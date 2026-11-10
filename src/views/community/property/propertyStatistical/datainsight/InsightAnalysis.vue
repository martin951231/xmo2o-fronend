<template>
  <span>
    <button class="datainsight-analysis-entry" @click="open">{{ chartId ? 'AI 分析' : 'AI 经营报告' }}</button>
    <section v-if="visible" ref="dialog" class="analysis-dialog" role="dialog" aria-label="数据分析">
      <header><strong>{{ chartId ? '图表 AI 分析' : 'AI 经营分析报告' }}</strong><button @click="close">关闭 / 取消</button></header>
      <p>单小区独立查询；口径可能与物业级图表不同。AI 未配置时仅展示确定性事实。</p>
      <label>物业 ID <input v-model.number="form.property_id" type="number" min="1" :disabled="!!context.property_id"></label>
      <label>小区 ID <input v-model.number="form.village_id" type="number" min="1"></label>
      <label>开始 <input v-model="form.start_date" type="date"></label>
      <label>结束 <input v-model="form.end_date" type="date"></label>
      <button :disabled="busy" @click="generate">{{ busy ? '查询中…' : '生成分析' }}</button>
      <button v-if="!chartId" :disabled="busy" @click="history">查看历史报告</button>
      <ul v-if="!chartId"><li v-for="item in reports" :key="item.report_id"><button :disabled="busy" @click="reopen(item.report_id)">{{ item.created_at }} · {{ item.scope.start_date }} — {{ item.scope.end_date }} · {{ item.status }}</button></li></ul>
      <p role="status">{{ error || status }}</p>
      <article v-if="result">
        <h3>{{ result.overview }}</h3><p>{{ result.explanation }}</p>
        <p v-if="result.scope">物业 {{ result.scope.property_id }} / 小区 {{ result.scope.village_id }} · {{ result.scope.start_date }} — {{ result.scope.end_date }}</p>
        <p>文字分析状态：{{ result.narrative_status }} · {{ result.analysis_mode }}</p>
        <section v-for="chapter in result.sections" :key="chapter.title">
          <h3>{{ chapter.title }}</h3><p>{{ chapter.text }}</p><p v-if="chapter.status">{{ chapter.status }} {{ chapter.error_code }}</p>
          <p v-if="chapter.coverage">五域覆盖：{{ value(chapter.coverage) }}</p>
          <p v-if="chapter.scope">统计期间：{{ chapter.scope.start_date }} — {{ chapter.scope.end_date }}</p>
          <ul><li v-for="m in chapter.metrics" :key="m.evidence_id">{{ m.query.metric_code }}：{{ value(m.value) }} {{ m.unit }} · {{ m.completeness }} · 证据 {{ m.evidence_id }}</li></ul>
          <table v-if="chapter.derived && chapter.derived.length"><tbody><tr v-for="d in chapter.derived" :key="d.name"><td>{{ d.name }}</td><td>{{ value(d.value) }} {{ d.unit }}</td><td>{{ d.completeness }} · {{ d.basis }}<br>{{ d.evidence_refs.join('、') }}</td></tr></tbody></table>
          <p v-for="line in chapter.limitations" :key="line">{{ line }}</p>
        </section>
        <table><thead><tr><th>核心事实</th><th>值 / 单位</th><th>期间 / 口径</th><th>证据 / 限制</th></tr></thead>
          <tbody><tr v-for="m in result.metrics" :key="m.query.metric_code">
            <td>{{ m.query.metric_code }}</td><td>{{ value(m.value) }} {{ m.unit }}</td>
            <td>{{ m.query.start_date }} — {{ m.query.end_date }}<br>{{ m.basis }}</td>
            <td>{{ m.source }} · {{ m.completeness }}<br>{{ m.evidence_id }}<br>{{ m.missing_fields.join('、') }}<pre>{{ value(m.evidence) }}</pre></td>
          </tr></tbody>
        </table>
        <figure v-for="m in trends" :key="m.query.metric_code">
          <figcaption>{{ m.query.metric_code }} · {{ m.unit }} · {{ m.completeness }}（仅展示返回的日期点，不补齐缺失日期）</figcaption>
          <div v-for="(amount, day) in m.value" :key="day" class="trend-row"><span>{{ day }}</span><i :style="{ width: barWidth(amount, m.value) }"></i><span>{{ amount }}</span></div>
        </figure>
        <h3>数据限制</h3><p v-for="line in result.limitations" :key="line">{{ line }}</p>
        <h3>建议</h3><p v-for="line in result.suggestions" :key="line">{{ line }}</p>
      </article>
    </section>
  </span>
</template>
<script>
import { createDataInsightApi, cleanContext } from './dataInsightApi'
export default {
  name: 'InsightAnalysis',
  props: { chartId: { type: String, default: '' }, context: { type: Object, default: () => ({}) },
    requestHeaders: { type: Function, required: true }, apiBase: { type: String, default: '/api/v1/datainsight' } },
  data: () => ({ visible: false, busy: false, form: {}, error: '', status: '', result: null, reports: [], controller: null, generation: 0 }),
  watch: { scopeKey () { this.close(); this.result = null; this.reports = [] },
    apiBase () { this.close(); this.result = null; this.reports = [] } },
  computed: { scopeKey () { return JSON.stringify(this.context) },
    trends () { return ((this.result && this.result.metrics) || []).filter(m => m.query.metric_code.endsWith('_trend') && m.value && typeof m.value === 'object') } },
  mounted () { document.addEventListener('fullscreenchange', this.placeDialog) },
  beforeDestroy () { this.close(); document.removeEventListener('fullscreenchange', this.placeDialog); if (this.$refs.dialog) this.$refs.dialog.remove() },
  methods: {
    value (v) { return v === null || v === undefined ? '暂无可用数据' : typeof v === 'object' ? JSON.stringify(v) : String(v) },
    barWidth (amount, values) { const max = Math.max(...Object.values(values)); return (max > 0 ? amount / max * 60 : 0) + '%' },
    placeDialog () { if (this.$refs.dialog) (document.fullscreenElement || document.body).appendChild(this.$refs.dialog) },
    open () { this.form = { ...cleanContext(this.context) }; this.visible = true; this.error = ''; this.$nextTick(this.placeDialog) },
    close () { this.generation++; if (this.controller) this.controller.abort(); this.busy = false; this.visible = false },
    async call (path, method, body, history = false) {
      if (this.busy) return
      const turn = ++this.generation
      this.controller = new AbortController(); const signal = this.controller.signal
      this.busy = true; this.error = ''; this.status = '正在查询'; this.result = null
      try {
        const headers = await createDataInsightApi(this.apiBase, this.requestHeaders).ready()
        const response = await fetch(this.apiBase.replace(/\/$/, '') + path, { method, headers, credentials: 'omit', signal,
          body: body === undefined ? undefined : JSON.stringify(body) })
        if (!response.ok) throw new Error(({ 403: '无权查询该物业、小区或报告', 422: '请填写有效的物业、小区和日期', 503: '服务或可信授权桥尚未配置' })[response.status] || '分析失败：' + response.status)
        const data = await response.json()
        if (turn !== this.generation) return
        if (history) { this.reports = data.items; this.status = data.items.length ? '已加载最近报告' : '暂无历史报告' }
        else { this.result = data; this.status = ({ completed: '查询完成', partial: '部分完成：存在缺失数据', failed: '分析失败' })[data.status] || data.status }
      } catch (e) { if (turn === this.generation) this.error = e.name === 'AbortError' ? '已取消' : e.message }
      finally { if (turn === this.generation) this.busy = false }
    },
    generate () { return this.chartId ? this.call('/charts/analyze', 'POST', { ...cleanContext(this.form), chart_id: this.chartId }) : this.call('/reports', 'POST', cleanContext(this.form)) },
    history () { const scope = cleanContext(this.form); this.reports = []; return this.call('/reports?property_id=' + (scope.property_id || '') + '&village_id=' + (scope.village_id || ''), 'GET', undefined, true) },
    reopen (id) { return this.call('/reports/' + encodeURIComponent(id), 'GET') }
  }
}
</script>
<style scoped>
.datainsight-analysis-entry { display: none; }
.analysis-dialog { position: fixed; inset: 6% 3% 6% auto; width: min(900px, 94vw); overflow: auto; z-index: 10020; background: #10243e; color: #e8f5ff; padding: 20px; border: 1px solid #34819a; box-sizing: border-box; }
header { display: flex; justify-content: space-between; } label { display: inline-block; margin: 8px; } input, button { color: #10243e; } table { width: 100%; border-collapse: collapse; } td, th { border: 1px solid #456; padding: 8px; overflow-wrap: anywhere; } pre { white-space: pre-wrap; }
.trend-row { display: flex; align-items: center; gap: 8px; margin: 5px 0; } .trend-row i { display: inline-block; height: 10px; background: #41c8d8; }
</style>
