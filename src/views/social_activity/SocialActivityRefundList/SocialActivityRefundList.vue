<template>
  <a-card title="退款列表" :bordered="false">
    <a-form layout="inline" class="refund-filters" @submit.prevent="search">
      <a-form-item v-for="field in textFilters" :key="field.key" :label="field.title">
        <a-input v-model.trim="filters[field.key]" allow-clear :placeholder="field.title" style="width: 185px" />
      </a-form-item>
      <a-form-item label="退款状态">
        <a-select v-model="filters.status" style="width: 150px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option v-for="(label, value) in statuses" :key="value" :value="value">{{ label }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="报名订单状态">
        <a-select v-model="filters.order_status" style="width: 150px">
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="0">未支付</a-select-option>
          <a-select-option value="10">已支付</a-select-option>
          <a-select-option value="20">已取消</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="时间类型">
        <a-select v-model="filters.time_type" style="width: 130px">
          <a-select-option value="created_at">申请时间</a-select-option>
          <a-select-option value="finished_at">退款成功时间</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-range-picker v-model="dateRange" show-time format="YYYY-MM-DD HH:mm:ss" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading">查询</a-button>
        <a-button style="margin-left: 8px" @click="reset">重置</a-button>
      </a-form-item>
    </a-form>
    <a-alert type="info" show-icon message="失败及待人工处理的退款，用户端仍显示退款中。查询状态只核对原退款结果，不会重新发起退款。" style="margin: 16px 0" />
    <div style="margin-bottom: 16px">
      <a-button type="primary" :disabled="!selectedRowKeys.length || loading" :loading="batchUpdating" @click="batchUpdate">
        批量更新退款状态
      </a-button>
      <span style="margin-left: 12px">已选择 {{ selectedRowKeys.length }} 条（当前页）</span>
      <span v-if="batchUpdating" style="margin-left: 12px">已更新 {{ batchDone }} / {{ batchTotal }} 条，请保持页面打开</span>
    </div>
    <a-alert v-if="updateSummary" :message="updateSummary" type="info" show-icon style="margin-bottom: 16px" />
    <a-table v-if="updateResults.length" :columns="resultColumns" :data-source="updateResults" row-key="id" :pagination="false" size="small" style="margin-bottom: 16px" />
    <a-table :row-selection="rowSelection" :columns="columns" :data-source="rows" row-key="id" :loading="loading || batchUpdating"
      :pagination="pagination" :scroll="{ x: 3200 }" @change="pageChange">
      <template slot="status" slot-scope="text, record">
        <a-tag :color="Number(record.status) === 2 ? 'green' : Number(record.status) >= 3 ? 'red' : 'orange'">{{ text }}</a-tag>
      </template>
      <template slot="actions" slot-scope="text, record">
        <a-button type="link" size="small" :disabled="Number(record.status) === 2 || querying !== null || batchUpdating"
          :loading="querying === record.id" @click="queryStatus(record)">更新退款状态</a-button>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import api from '@/api/social_activity'
const textFilters = [
  { key: 'order_sn', title: '报名订单号' },
  { key: 'pay_order_no', title: '原交易订单号' },
  { key: 'refund_no', title: '商户退款订单号' },
  { key: 'refund_trxid', title: '通联退款流水号' },
  { key: 'activity_id', title: '活动ID' },
  { key: 'activity_name', title: '活动名' },
  { key: 'host_village_id', title: '主办小区ID' },
  { key: 'host_village_name', title: '主办小区' }
]
const newFilters = () => Object.assign({ status: '', order_status: '', time_type: 'created_at' }, ...textFilters.map(f => ({ [f.key]: '' })))
export default {
  name: 'SocialActivityRefundList',
  data () {
    return {
      textFilters, filters: newFilters(), dateRange: [], rows: [], loading: false, querying: null,
      selectedRowKeys: [], batchUpdating: false, batchDone: 0, batchTotal: 0, updateResults: [], updateSummary: '',
      resultColumns: [
        { title: '退款ID', dataIndex: 'id', width: 100 },
        { title: '更新结果', dataIndex: 'status_text', width: 180 },
        { title: '失败/待确认原因', dataIndex: 'failure_reason' }
      ],
      statuses: { 0: '待提交', 1: '处理中', 2: '退款成功', 3: '退款失败', 4: '待人工处理' },
      pagination: { current: 1, pageSize: 20, total: 0, showSizeChanger: true, showTotal: total => `共 ${total} 条` },
      columns: [
        { title: '退款ID', dataIndex: 'id', width: 95, fixed: 'left' },
        { title: '报名订单号', dataIndex: 'order_sn', width: 210 },
        { title: '原交易订单号', dataIndex: 'pay_order_no', width: 210 },
        { title: '商户退款订单号', dataIndex: 'refund_no', width: 270 },
        { title: '原通联支付流水号', dataIndex: 'original_trxid', width: 200 },
        { title: '通联退款流水号', dataIndex: 'refund_trxid', width: 200 },
        { title: '退款金额（元）', dataIndex: 'refund_amount', width: 140 },
        { title: '支付金额（元）', dataIndex: 'paid_amount', width: 140 },
        { title: '线上退款（元）', dataIndex: 'online_amount', width: 140 },
        { title: '余额退款（元）', dataIndex: 'balance_amount', width: 140 },
        { title: '活动ID', dataIndex: 'activity_id', width: 100 },
        { title: '活动名', dataIndex: 'activity_name', width: 200 },
        { title: '主办小区', dataIndex: 'host_village_name', width: 180 },
        { title: '报名订单状态', dataIndex: 'order_status_text', width: 130 },
        { title: '最近查询时间', dataIndex: 'last_query_at', width: 180 },
        { title: '退款状态', dataIndex: 'status_text', width: 130, scopedSlots: { customRender: 'status' } },
        { title: '申请时间', dataIndex: 'created_at', width: 180 },
        { title: '退款成功时间', dataIndex: 'finished_at', width: 180 },
        { title: '退款原因', dataIndex: 'reason', width: 200 },
        { title: '失败/待确认原因', dataIndex: 'failure_reason', width: 300 },
        { title: '发起来源', dataIndex: 'source', width: 110, customRender: value => value === 'user' ? '用户申请' : value },
        { title: '操作', key: 'actions', width: 150, fixed: 'right', scopedSlots: { customRender: 'actions' } }
      ]
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: keys => { this.selectedRowKeys = keys },
        getCheckboxProps: record => ({ props: { disabled: Number(record.status) === 2 || this.batchUpdating || this.querying !== null } })
      }
    }
  },
  created () { this.load() },
  methods: {
    search () { if (this.batchUpdating || this.querying !== null) return; this.pagination.current = 1; this.load() },
    reset () { this.filters = newFilters(); this.dateRange = []; this.search() },
    pageChange (pagination) { if (this.batchUpdating || this.querying !== null) return; this.pagination.current = pagination.current; this.pagination.pageSize = pagination.pageSize; this.load() },
    load () {
      this.selectedRowKeys = []
      this.loading = true
      const params = { ...this.filters, page: this.pagination.current, pageSize: this.pagination.pageSize }
      if (this.dateRange.length === 2) {
        params.start_time = this.dateRange[0].format('YYYY-MM-DD HH:mm:ss')
        params.end_time = this.dateRange[1].format('YYYY-MM-DD HH:mm:ss')
      }
      return this.request(api.getRefundList, params).then(res => {
        this.rows = res.data || []; this.pagination.total = res.total || 0
      }).catch(() => {}).finally(() => { this.loading = false })
    },
    async queryStatus (record) {
      if (this.querying !== null || this.batchUpdating || Number(record.status) === 2) return
      this.querying = record.id
      try {
        const res = await this.request(api.queryRefundStatus, { id: record.id })
        this.updateResults = [res]
        this.updateSummary = '退款状态已核对'
        await this.load()
      } catch (error) {
        this.$message.error('更新未完成，请稍后重试')
      } finally { this.querying = null }
    },
    async batchUpdate () {
      if (this.batchUpdating || this.querying !== null || !this.selectedRowKeys.length) return
      const ids = this.selectedRowKeys.slice()
      this.batchUpdating = true
      this.batchDone = 0
      this.batchTotal = ids.length
      this.updateResults = []
      this.updateSummary = ''
      const counts = { success: 0, failed: 0, pending: 0, error: 0 }
      try {
        // 分笔调用现有鉴权接口，避免整批请求超时；一笔异常不阻断后续。
        for (const id of ids) {
          try {
            const res = await this.request(api.queryRefundStatus, { id })
            this.updateResults.push(res)
            if (Number(res.status) === 2) counts.success++
            else if (Number(res.status) === 3) counts.failed++
            else counts.pending++
          } catch (error) {
            counts.error++
            this.updateResults.push({ id, status_text: '查询未完成', failure_reason: (error && error.message) || '请求异常，请重新查询确认' })
          } finally { this.batchDone++ }
        }
        this.updateSummary = '更新完成：退款成功 ' + counts.success + ' 条，退款失败 ' + counts.failed + ' 条，处理中/待人工确认 ' + counts.pending + ' 条，查询异常 ' + counts.error + ' 条'
        await this.load()
      } finally { this.batchUpdating = false }
    }
  }
}
</script>

<style scoped>
.refund-filters .ant-form-item { margin-bottom: 12px; }
</style>
