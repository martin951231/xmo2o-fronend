<template>
  <span>
    <button class="datainsight-risk-entry" @click="open">AI 风险识别</button>
    <section v-if="visible" ref="dialog" class="analysis-dialog" role="dialog" aria-label="风险识别">
      <header><strong>五域风险识别</strong><button @click="close">关闭 / 取消</button></header>
      <p>示例阈值待业务确认。数据不足不代表业务正常。</p>
      <label>物业 <input v-model.number="form.property_id" type="number" :disabled="!!context.property_id"></label>
      <label>小区 <input v-model.number="form.village_id" type="number"></label>
      <label>开始 <input v-model="form.start_date" type="date"></label>
      <label>结束 <input v-model="form.end_date" type="date"></label>
      <button :disabled="busy" @click="detect">检测风险</button><button :disabled="busy" @click="history">已保存风险</button>
      <select v-model="domain"><option value="">全部业务域</option><option v-for="key in Object.keys(domains)" :key="key" :value="key">{{ domains[key] }}</option></select>
      <p role="status">{{ error || status }}</p>
      <p v-for="item in outcomes" :key="item.rule_id">{{ domains[item.domain] }} · {{ item.status }} · {{ item.limitations.join('；') }}</p>
      <p v-if="loaded && !cards.length">当前没有风险卡；请结合各规则检测状态判断是否数据充分。</p>
      <article v-for="card in filtered" :key="card.risk_id">
        <h3>{{ card.title }} · {{ card.severity }}</h3>
        <p>{{ card.time_window.start_date }} — {{ card.time_window.end_date }}</p>
        <p>当前 {{ card.current_value }} / 基线 {{ card.baseline_value }} / 变化 {{ card.change_value }}</p>
        <p>阈值 {{ card.threshold }} · 比较值 {{ card.comparison_value }} · {{ card.baseline_definition }}</p>
        <button :disabled="busy" @click="detail(card.risk_id)">查看详情</button>
        <button v-if="card.diagnosis_available" :disabled="busy" @click="diagnose(card.risk_id)">AI 深度诊断</button>
        <button v-if="card.domain === 'workorder' || card.domain === 'charge'" :disabled="busy" @click="diagnose(card.risk_id, 'charge_workorder')">收费 + 工单</button>
        <button v-if="card.domain === 'inspection' || card.domain === 'charge'" :disabled="busy" @click="diagnose(card.risk_id, 'charge_inspection')">收费 + 巡检</button>
        <button v-if="card.domain === 'workorder' || card.domain === 'inspection'" :disabled="busy" @click="diagnose(card.risk_id, 'workorder_inspection')">工单 + 巡检</button>
      </article>
      <details v-if="selected" open><summary>风险证据与局限</summary><pre>{{ value(selected) }}</pre></details>
      <article v-if="diagnosis">
        <h3>跨域诊断 · {{ diagnosis.diagnosis_status }}</h3><p>{{ diagnosis.involved_domains.join(' / ') }}</p>
        <h4>已验证事实</h4><pre v-for="fact in diagnosis.verified_facts" :key="fact.domain">{{ value(fact) }}</pre>
        <h4>待验证假设</h4><p v-for="line in diagnosis.hypotheses" :key="line">{{ line }}</p>
        <h4>证据局限 / 缺失指标</h4><p v-for="line in diagnosis.limitations" :key="line">{{ line }}</p><pre>{{ value(diagnosis.missing_metrics) }}</pre>
        <h4>业务建议</h4><p v-for="line in diagnosis.recommendations" :key="line">{{ line }}</p>
        <button v-if="diagnosis.thread_id" :disabled="busy" @click="followup">继续追问</button>
      </article>
    </section>
    <DataInsightDrawer ref="chat" :context="context" :request-headers="requestHeaders" :api-base="apiBase" />
  </span>
</template>
<script>
import InsightAnalysis from './InsightAnalysis.vue'
import DataInsightDrawer from './DataInsightDrawer.vue'
import { cleanContext } from './dataInsightApi'
export default {
  name: 'InsightRisks', extends: InsightAnalysis,
  components: { DataInsightDrawer },
  data: () => ({ cards: [], outcomes: [], selected: null, domain: '', loaded: false, diagnosis: null,
    domains: { charge: '收费', public_revenue: '公共收益', express: '快递', workorder: '工单', inspection: '巡检' } }),
  computed: { filtered () { return this.cards.filter(c => !this.domain || c.domain === this.domain) } },
  methods: {
    async detect () { if (this.busy) return; this.clearRiskView(); await this.call('/risks/detect', 'POST', cleanContext(this.form)); if (this.result) { this.cards = this.result.items; this.outcomes = this.result.outcomes; this.loaded = true } },
    async history () { if (this.busy) return; this.clearRiskView(); const s = cleanContext(this.form); await this.call('/risks?property_id=' + (s.property_id || '') + '&village_id=' + (s.village_id || ''), 'GET'); if (this.result) { this.cards = this.result.items; this.loaded = true } },
    async detail (id) { await this.call('/risks/' + encodeURIComponent(id), 'GET'); this.selected = this.result },
    async diagnose (id, scenario) { this.diagnosis = null; await this.call('/risks/' + encodeURIComponent(id) + '/diagnose', 'POST', scenario ? { scenario } : {}); this.diagnosis = this.result },
    async followup () {
      if (this.busy || !this.diagnosis || !this.diagnosis.thread_id) return
      const target = this.diagnosis.thread_id; const turn = this.generation; const chat = this.$refs.chat
      if (chat.thread !== target) {
        await chat.reset()
        if (turn !== this.generation) return
        chat.thread = target
      }
      this.visible = false; await chat.openDrawer(); await chat.refreshResult()
    },
    clearRiskView () { this.cards = []; this.outcomes = []; this.selected = null; this.loaded = false; this.diagnosis = null },
    close () { InsightAnalysis.methods.close.call(this); this.clearRiskView() }
  }
}
</script>
<style scoped>
.datainsight-risk-entry { display: none; }
.analysis-dialog { position: fixed; inset: 6% 3% 6% auto; width: min(900px, 94vw); overflow: auto; z-index: 10020; background: #10243e; color: #e8f5ff; padding: 20px; box-sizing: border-box; }
header { display: flex; justify-content: space-between; } label { display: inline-block; margin: 8px; } input, button, select { color: #10243e; } article { border: 1px solid #456; padding: 12px; margin: 12px 0; } pre { white-space: pre-wrap; overflow-wrap: anywhere; }
</style>



