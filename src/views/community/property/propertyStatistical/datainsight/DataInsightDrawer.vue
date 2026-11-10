<template>
  <div>
    <button type="button" class="datainsight-dev-entry" @click="openDrawer">AI 数据分析</button>
    <aside v-if="open" class="insight-drawer" role="dialog" aria-label="数据查询">
      <header><strong>AI 数据分析</strong><button @click="open = false">关闭</button></header>
      <p>按当前物业、小区及时间查询，结果附统计口径与来源。</p>
      <section ref="messages" class="messages" aria-live="polite">
        <article v-for="(message, i) in messages" :key="i">
          <strong>{{ message.role === 'user' ? '你' : 'AI' }}</strong>
          <p>{{ message.text }}</p>
          <div v-for="(metric, j) in message.metrics || []" :key="j" class="evidence">
            <strong>{{ metric.query.metric_code }}</strong>
            <p>{{ metric.value == null ? '暂无可用数据' : display(metric.value) }} {{ metric.unit }}</p>
            <small>{{ metric.query.start_date }} 至 {{ metric.query.end_date }}</small>
            <p>口径：{{ metric.basis }} · 来源：{{ metric.source }}</p>
            <p v-if="metric.error_code">原因：{{ metric.error_code }}</p>
            <p>证据：{{ display(metric.evidence || {}) }}</p>
            <p>完整性：{{ statusLabel(metric.completeness) }} {{ (metric.missing_fields || []).join('、') }}</p>
          </div>
        </article>
      </section>
      <details v-if="process.length"><summary>分析过程</summary><ol><li v-for="(step, i) in process" :key="i">{{ step }}</li></ol></details>
      <p v-if="progress" role="status">{{ progress }}</p>
      <p v-if="error" role="alert">{{ error }}</p>
      <form v-if="waiting" @submit.prevent="resume">
        <p>等待补充信息：{{ waiting.message }}</p>
        <label>小区 ID <input v-model.number="answer.village_id" type="number" min="1" required></label>
        <label>开始日期 <input v-model="answer.start_date" type="date" required></label>
        <label>结束日期 <input v-model="answer.end_date" type="date" required></label>
        <button :disabled="busy">补充并继续</button>
      </form>
      <form v-else @submit.prevent="send">
        <textarea v-model="question" maxlength="2000" placeholder="查询快递数量；完成后可追问“那去年呢？”" />
        <button :disabled="busy || needsRefresh || !question.trim()">发送</button>
      </form>
      <button v-if="thread" :disabled="busy" @click="refreshResult">获取已保存结果</button>
      <button v-if="thread || busy" @click="cancel">结束当前会话</button>
    </aside>
  </div>
</template>

<script>
import { createDataInsightApi, cleanContext } from './dataInsightApi'

export default {
  name: 'DataInsightDrawer',
  props: {
    context: { type: Object, required: true },
    apiBase: { type: String, default: '/api/v1/datainsight' },
    requestHeaders: { type: Function, required: true }
  },
  data () {
    return { open: false, messages: [], question: '', thread: null, busy: false,
      waiting: null, answer: {}, progress: '', error: '', controller: null, generation: 0,
      needsRefresh: false, activeContext: {}, lastResult: '', process: [] }
  },
  watch: {
    context: { deep: true, handler () { this.reset() } },
    apiBase () { this.reset() }
  },
  beforeDestroy () { this.reset() },
  methods: {
    api () { return createDataInsightApi(this.apiBase, this.requestHeaders) },
    display (value) { return typeof value === 'object' ? JSON.stringify(value) : value },
    statusLabel (status) {
      return ({ complete: '完整', completed: '查询完成', partial: '部分数据缺失', unavailable: '数据不可用', no_data: '没有数据', cancelled: '已取消', failed: '查询失败' })[status] || status
    },
    id () { return 'req_' + Date.now() + '_' + Math.random().toString(36).slice(2) },
    scroll () { this.$nextTick(() => { const el = this.$refs.messages; if (el) el.scrollTop = el.scrollHeight }) },
    async openDrawer () {
      this.open = true
      const generation = this.generation
      try { await this.api().ready() } catch (error) { if (generation === this.generation) this.error = error.message }
      this.scroll()
    },
    async reset () {
      const thread = this.thread; const api = this.api()
      this.generation++
      if (this.controller) this.controller.abort()
      this.thread = null; this.waiting = null; this.messages = []; this.busy = false
      this.error = ''; this.progress = ''; this.process = []; this.question = ''; this.answer = {}
      this.needsRefresh = false; this.activeContext = {}; this.lastResult = ''; this.controller = null
      if (thread) { try { await api.cancel(thread) } catch (_) { /* Old context stays cleared even if server is unreachable. */ } }
    },
    async cancel () { const done = this.reset(); this.progress = '会话已结束'; await done },
    async send () {
      const text = this.question.trim()
      if (!text || this.busy || this.waiting || this.needsRefresh) return
      this.messages.push({ role: 'user', text }); this.question = ''; this.scroll()
      await this.execute('messages', { request_id: this.id(), question: text,
        context: this.thread ? null : cleanContext(this.context) })
    },
    async resume () {
      if (this.busy || !this.waiting || !this.thread) return
      await this.execute('resume', { request_id: this.id(), answer: cleanContext(this.answer) })
    },
    showResult (result) {
      if (!result || typeof result.status !== 'string') throw new Error('服务返回了无法识别的结果')
      if (result.status === 'waiting_for_input') {
        this.waiting = result.interrupt; this.answer = { ...this.activeContext, ...cleanContext(this.context) }; return
      }
      if (result.status === 'ready') { this.progress = '会话尚未返回结果'; return }
      this.waiting = null
      const metrics = result.metrics || []
      const signature = JSON.stringify(result)
      if (signature !== this.lastResult) {
        this.messages.push({ role: 'assistant', text: this.statusLabel(result.status) + (result.error_code ? '：' + result.error_code : ''), metrics })
        this.lastResult = signature
      }
      if (metrics[0]) this.activeContext = cleanContext(metrics[0].query)
      this.scroll()
    },
    async refreshResult () {
      if (this.busy || !this.thread) return
      this.busy = true; const generation = this.generation
      const controller = new AbortController(); this.controller = controller
      try {
        const result = await this.api().result(this.thread, controller.signal)
        if (generation !== this.generation) return
        this.showResult(result); this.needsRefresh = false; this.error = ''
      } catch (error) { if (generation === this.generation && error.name !== 'AbortError') this.error = error.message }
      finally { if (generation === this.generation) { this.busy = false; this.controller = null } }
    },
    async execute (operation, body) {
      if (this.busy) return
      this.busy = true; this.error = ''; this.progress = '正在规划'; this.process = []
      const generation = this.generation
      const controller = new AbortController(); this.controller = controller
      const timer = setTimeout(() => controller.abort(), 120000)
      try {
        const api = this.api()
        if (!this.thread) {
          if (operation !== 'messages') throw new Error('没有可恢复的会话')
          const context = cleanContext(this.context)
          if (!context.property_id) throw new Error('物业信息尚未加载，请稍后重试')
          const session = await api.create(context.property_id, controller.signal)
          if (generation !== this.generation) { api.cancel(session.thread_id).catch(() => {}); return }
          this.thread = session.thread_id; this.activeContext = context
        }
        await api.stream(this.thread, operation, body, controller.signal, event => {
          if (generation !== this.generation) return
          const labels = { planning: '正在规划', querying: '正在查询', calculating: '正在计算', validating: '正在校验', rendering: '正在整理结果' }
          this.progress = labels[event.event] || ''
          if (labels[event.event]) this.process.push(labels[event.event])
          if (event.event === 'waiting_for_input') {
            this.waiting = event.data; this.answer = { ...this.activeContext, ...cleanContext(this.context) }
          } else if (event.event === 'completed') {
            this.showResult(event.data)
          } else if (event.event === 'failed' || event.event === 'cancelled') {
            this.waiting = null
            this.error = event.event === 'cancelled' ? '执行已取消' : '查询失败：' + ((event.data || {}).error_code || '服务暂不可用')
          }
          this.scroll()
        })
        if (generation === this.generation) this.needsRefresh = false
      } catch (error) {
        if (generation === this.generation) {
          this.error = error.name === 'AbortError' ? '请求超时或已中断，请获取已保存结果或结束会话' : error.message
          this.needsRefresh = Boolean(this.thread)
        }
      } finally {
        clearTimeout(timer)
        if (generation === this.generation) { this.busy = false; this.controller = null }
      }
    }
  }
}
</script>

<style scoped>
.datainsight-dev-entry { display: none; align-items: center; position: fixed; right: 24px; bottom: 24px; z-index: 1200; }
.insight-drawer { position: fixed; z-index: 1300; right: 0; top: 0; bottom: 0; width: min(480px, 100vw); padding: 20px; background: #10243b; color: #eff7ff; box-shadow: -8px 0 30px #0006; display: flex; flex-direction: column; gap: 10px; box-sizing: border-box; }
header { display: flex; justify-content: space-between; align-items: center; }
.messages { flex: 1; min-height: 0; overflow: auto; overflow-wrap: anywhere; white-space: pre-wrap; }
article { padding: 12px 0; border-bottom: 1px solid #406080; }
.evidence { padding: 10px; margin-top: 8px; background: #1c3550; border-radius: 8px; overflow-wrap: anywhere; }
button { padding: 8px 12px; cursor: pointer; background: #207db4; color: white; border: 0; border-radius: 5px; }
button:disabled { opacity: .5; cursor: default; }
textarea { width: 100%; min-height: 70px; color: #10243b; }
label { display: block; margin-bottom: 8px; } input { color: #10243b; } [role=alert] { color: #ffb2a8; }
</style>
