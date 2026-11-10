import { streamInsight } from './dataInsightSse'

export function cleanContext (context = {}) {
  const out = {}
  for (const key of ['property_id', 'village_id']) {
    const value = Number(context[key])
    if (Number.isSafeInteger(value) && value > 0) out[key] = value
  }
  for (const key of ['start_date', 'end_date']) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(context[key] || '')) out[key] = context[key]
  }
  return out
}

export function createDataInsightApi (base, getHeaders) {
  base = (base || '/api/v1/datainsight').replace(/\/$/, '')
  async function ready () {
    const headers = await getHeaders()
    const authorization = headers && (headers.Authorization || headers.authorization)
    if (!authorization || !/^Bearer\s+\S+$/.test(authorization)) throw new Error('数据分析暂不可用：尚未接入 P3 登录身份')
    // Deliberately exclude PHP ticket/cookies and unrelated request interceptors.
    return { 'Content-Type': 'application/json', Authorization: authorization }
  }
  async function request (suffix, method, body, signal) {
    const headers = await ready()
    const response = await fetch(base + suffix, { method, headers, credentials: 'omit', signal,
      body: body === undefined ? undefined : JSON.stringify(body) })
    if (!response.ok) {
      const messages = { 401: 'P3 登录已失效，请重新登录', 403: '无权查询此物业、小区或会话',
        409: '会话正在执行、等待补充或请求已提交，请获取已保存结果', 422: '查询参数不完整或格式错误',
        503: '数据分析服务暂不可用，请稍后重试' }
      throw new Error(messages[response.status] || '数据分析请求失败（' + response.status + '）')
    }
    return response
  }
  const sessionPath = id => '/sessions/' + encodeURIComponent(id)
  return {
    ready,
    async create (propertyId, signal) {
      const data = await (await request('/sessions', 'POST', { property_id: propertyId }, signal)).json()
      if (!data.thread_id || typeof data.thread_id !== 'string') throw new Error('服务未返回有效会话')
      return data
    },
    async stream (id, operation, body, signal, onEvent) {
      if (!['messages', 'resume'].includes(operation)) throw new Error('不支持的会话操作')
      const response = await request(sessionPath(id) + '/' + operation, 'POST', body, signal)
      if (!(response.headers.get('content-type') || '').includes('text/event-stream')) throw new Error('服务未返回分析事件流')
      let terminal = false
      await streamInsight(response, event => {
        if (terminal) return
        if (['waiting_for_input', 'completed', 'failed', 'cancelled'].includes(event.event)) terminal = true
        onEvent(event)
      })
      if (!terminal) throw new Error('连接已中断，尚未收到最终结果，请获取已保存结果')
    },
    async result (id, signal) { return (await request(sessionPath(id) + '/result', 'GET', undefined, signal)).json() },
    async cancel (id) {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 10000)
      try { return await (await request(sessionPath(id) + '/cancel', 'POST', undefined, controller.signal)).json() }
      finally { clearTimeout(timer) }
    }
  }
}
