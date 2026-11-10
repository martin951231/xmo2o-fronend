// Handles UTF-8 and event boundaries split across arbitrary network chunks.
export async function streamInsight (response, onEvent) {
  if (!response.body) throw new Error('浏览器或服务不支持事件流')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  try {
    while (true) {
      const { value, done } = await reader.read()
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true })
      buffer = buffer.replace(/\r\n/g, '\n')
      let boundary
      while ((boundary = buffer.indexOf('\n\n')) >= 0) {
        const frame = buffer.slice(0, boundary); buffer = buffer.slice(boundary + 2)
        const data = frame.split('\n').filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n')
        if (data) onEvent(JSON.parse(data))
      }
      if (buffer.length > 2000000) throw new Error('事件数据过大')
      if (done) {
        if (buffer.trim()) throw new Error('事件流不完整')
        break
      }
    }
  } finally { try { await reader.cancel() } finally { reader.releaseLock() } }
}
