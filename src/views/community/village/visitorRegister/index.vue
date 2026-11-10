<template>
  <a-card title="访客登记(新)">
    <a-button slot="extra" @click="openConfig">小程序配置</a-button>
    <a-alert message="发布用于启用登记；请先将登记页面发布到微信小程序正式版，再生成二维码。" type="info" show-icon />
    <a-tabs :active-key="type" @change="switchType">
      <a-tab-pane key="visitor" tab="来访人员登记" />
      <a-tab-pane key="vehicle" tab="外来车辆登记" />
    </a-tabs>
    <a-spin :spinning="busy">
      <a-descriptions v-if="current" bordered :column="2">
        <a-descriptions-item label="表单名称">{{ current.name }}</a-descriptions-item>
        <a-descriptions-item label="表单编号">{{ current.code }}</a-descriptions-item>
        <a-descriptions-item label="当前状态">{{ statusNames[current.status] }}</a-descriptions-item>
        <a-descriptions-item label="二维码状态">{{ current.qrcode_valid ? '已生成（长期有效）' : '未生成或图片缺失' }}</a-descriptions-item>
        <a-descriptions-item label="发布时间">{{ timestamp(current.published_at) }}</a-descriptions-item>
        <a-descriptions-item label="二维码预览">
          <img v-if="current.qrcode_url" :src="current.qrcode_url" class="qr" alt="登记小程序码" @click="preview = true">
          <span v-else>请先生成二维码</span>
        </a-descriptions-item>
      </a-descriptions>
      <div class="actions">
        <a-button :disabled="busy" @click="generate">生成二维码</a-button>
        <a-button :disabled="!current.qrcode_valid" @click="preview = true">查看二维码</a-button>
        <a-button :disabled="!current.qrcode_valid" @click="downloadQr">下载二维码</a-button>
        <a-button type="primary" :disabled="busy" @click="changeStatus('publish')">发布</a-button>
        <a-button :disabled="busy" @click="changeStatus('disable')">停用</a-button>
      </div>
    </a-spin>
    <div class="filters">
      <a-input v-model="keyword" :placeholder="type === 'visitor' ? '访客姓名' : '车牌号码'" :max-length="60" />
      <a-input v-model="phone" placeholder="联系电话" :max-length="11" />
      <a-range-picker v-model="dates" />
      <a-select v-if="type === 'vehicle'" v-model="vehicleStatus" style="width: 130px">
        <a-select-option value="">全部状态</a-select-option>
        <a-select-option value="entered">未离场</a-select-option>
        <a-select-option value="exited">已离场</a-select-option>
      </a-select>
      <a-button type="primary" @click="loadRecords(1)">查询</a-button>
      <a-button :loading="exporting" @click="exportRecords">导出 Excel</a-button>
    </div>
    <a-table
      row-key="id"
      :columns="columns"
      :data-source="rows"
      :loading="loading"
      :pagination="pagination"
      :scroll="{ x: 1600 }"
      @change="pageChanged">
      <template slot="status" slot-scope="text">{{ text === 'entered' ? '未离场' : '已离场' }}</template>
      <template slot="created" slot-scope="text">{{ timestamp(text) }}</template>
      <template slot="actions" slot-scope="text, record">
        <a @click="showDetail(record)">查看详情</a>
        <a v-if="type === 'vehicle' && record.status === 'entered'" class="exit-link" @click="openExit(record)">登记离场</a>
      </template>
    </a-table>
    <a-modal
      v-model="configVisible"
      title="小程序配置"
      ok-text="保存配置"
      :confirm-loading="saving"
      @ok="saveConfig"
      @cancel="secret = ''">
      <a-form layout="vertical">
        <a-form-item label="AppID"><a-input v-model="appid" :max-length="32" /></a-form-item>
        <a-form-item label="AppSecret"><a-input-password v-model="secret" autocomplete="new-password" :placeholder="hasSecret ? '已配置，留空保留原值' : '请输入AppSecret'" :max-length="32" /></a-form-item>
      </a-form>
      <a-alert message="修改AppID会将两个表单恢复草稿并使二维码失效，需要重新生成并发布。" type="warning" />
      <a-button class="test-button" :loading="testing" @click="testConnection">测试已保存配置的连接</a-button>
      <p>点击确定保存配置。AppSecret不会返回前端。</p>
    </a-modal>
    <a-modal v-model="preview" title="登记二维码" :footer="null">
      <img :src="current.qrcode_url" class="preview" alt="登记小程序码">
    </a-modal>
    <a-modal v-model="detailVisible" title="登记详情" :footer="null">
      <a-descriptions bordered :column="1">
        <a-descriptions-item v-for="column in detailColumns" :key="column.dataIndex" :label="column.title">{{ detailValue(column.dataIndex) }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
    <a-modal v-model="exitVisible" title="登记离场" :confirm-loading="savingExit" @ok="saveExit">
      <p>车牌号码：{{ exitRecord.plate_number }}</p>
      <p>进入时间：{{ exitRecord.entry_time }}</p>
      <a-date-picker v-model="exitTime" show-time format="YYYY-MM-DD HH:mm:ss" placeholder="离开时间" />
    </a-modal>
  </a-card>
</template>

<script>
import moment from 'moment'
import api from '@/api/community/visitorRegister'

const person = [
  ['registration_no', '登记编号'], ['visit_time', '来访时间'], ['visitor_name', '访客姓名'],
  ['organization_or_id', '单位或有效证件号码'], ['phone', '联系电话'], ['visit_reason', '事由'],
  ['host_name_room', '被访者姓名、房号'], ['remark', '备注'], ['create_time', '提交时间']
]
const vehicle = [
  ['registration_no', '登记编号'], ['plate_number', '车牌号码'], ['entry_time', '进入时间'],
  ['exit_time', '离开时间'], ['destination', '车辆去向'], ['phone', '联系电话'], ['status', '当前状态'], ['create_time', '提交时间']
]
export default {
  name: 'VisitorRegisterNew',
  data () {
    return {
      type: 'visitor',
forms: [],
rows: [],
busy: false,
loading: false,
exporting: false,
      keyword: '',
phone: '',
dates: [],
vehicleStatus: '',
      pagination: { current: 1, pageSize: 20, total: 0 },
      statusNames: { draft: '草稿', published: '已发布', disabled: '已停用' },
      configVisible: false,
appid: '',
secret: '',
hasSecret: false,
saving: false,
testing: false,
      preview: false,
detailVisible: false,
detail: {},
exitVisible: false,
exitRecord: {},
exitTime: null,
savingExit: false,
      recordSequence: 0
    }
  },
  computed: {
    current () { return this.forms.find(item => item.form_type === this.type) || {} },
    detailColumns () { return (this.type === 'visitor' ? person : vehicle).map(([dataIndex, title]) => ({ dataIndex, title })) },
    columns () {
      return this.detailColumns.map(column => ({
        ...column,
        scopedSlots: column.dataIndex === 'status' ? { customRender: 'status' } : column.dataIndex === 'create_time' ? { customRender: 'created' } : undefined
      })).concat([{ title: '操作', key: 'actions', fixed: 'right', width: 160, scopedSlots: { customRender: 'actions' } }])
    }
  },
  created () { this.refreshForms(); this.loadRecords(1) },
  methods: {
    call (action, data = {}) { return this.request(api[action], data) },
    timestamp (value) { return value ? moment.unix(Number(value)).format('YYYY-MM-DD HH:mm:ss') : '—' },
    detailValue (key) {
      if (key === 'create_time') return this.timestamp(this.detail[key])
      if (key === 'status') return this.detail[key] === 'entered' ? '未离场' : '已离场'
      return this.detail[key] || '—'
    },
    async refreshForms () { this.forms = await this.call('forms') },
    switchType (type) { this.type = type; this.keyword = ''; this.phone = ''; this.dates = []; this.vehicleStatus = ''; this.loadRecords(1) },
    params () {
      return {
        form_type: this.type,
[this.type === 'visitor' ? 'visitor_name' : 'plate_number']: this.keyword,
        phone: this.phone,
status: this.vehicleStatus,
        date_from: this.dates.length ? this.dates[0].format('YYYY-MM-DD') : '',
        date_to: this.dates.length ? this.dates[1].format('YYYY-MM-DD') : ''
      }
    },
    async loadRecords (page) {
      const sequence = ++this.recordSequence
      this.loading = true
      try {
        const result = await this.call('records', { ...this.params(), page, page_size: 20 })
        if (sequence === this.recordSequence) { this.rows = result.list; this.pagination = { current: page, pageSize: 20, total: result.total } }
      } finally { if (sequence === this.recordSequence) this.loading = false }
    },
    pageChanged (pagination) { this.loadRecords(pagination.current) },
    async openConfig () {
      const result = await this.call('configInfo')
      this.appid = result.appid; this.hasSecret = result.has_secret; this.secret = ''; this.configVisible = true
    },
    async saveConfig () {
      if (this.saving) return
      this.saving = true
      try {
        await this.call('saveConfig', { appid: this.appid.trim(), appsecret: this.secret.trim() })
        this.secret = ''; this.configVisible = false; this.$message.success('配置已保存'); await this.refreshForms()
      } finally { this.saving = false }
    },
    async testConnection () {
      this.testing = true
      try { await this.call('testConnection'); this.$message.success('连接成功') } finally { this.testing = false }
    },
    generate () {
      const type = this.type
      const run = async () => {
        this.busy = true
        try { this.forms = await this.call('generateQr', { form_type: type, regenerate: 1 }); this.$message.success('二维码已生成') } finally { this.busy = false }
      }
      if (this.current.qrcode_valid) this.$confirm({ title: '重新生成二维码？', content: '将替换当前二维码图片。', onOk: run })
      else run()
    },
    async changeStatus (action) {
      if (this.busy) return
      this.busy = true
      try { this.forms = await this.call(action, { form_type: this.type }); this.$message.success(action === 'publish' ? '发布成功。' : '已停用') } finally { this.busy = false }
    },
    download (blob, filename) {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    },
    async downloadQr () {
      try {
        const response = await fetch(this.current.qrcode_url)
        if (!response.ok) throw new Error('download')
        const blob = await response.blob()
        this.download(blob, this.current.code + (blob.type === 'image/jpeg' ? '.jpg' : '.png'))
      } catch (e) { this.$message.error('二维码下载失败，请稍后重试') }
    },
    async showDetail (record) { this.detail = await this.call('detail', { form_type: this.type, id: record.id }); this.detailVisible = true },
    openExit (record) { this.exitRecord = record; this.exitTime = moment(); this.exitVisible = true },
    async saveExit () {
      if (!this.exitTime || this.exitTime.isBefore(moment(this.exitRecord.entry_time))) { this.$message.error('离开时间不能早于进入时间'); return }
      if (this.savingExit) return
      this.savingExit = true
      try {
        await this.call('registerExit', { id: this.exitRecord.id, exit_time: this.exitTime.format('YYYY-MM-DD HH:mm:ss') })
        this.exitVisible = false; this.$message.success('登记离场成功'); await this.loadRecords(this.pagination.current)
      } finally { this.savingExit = false }
    },
    async exportRecords () {
      this.exporting = true
      try {
        const result = await this.call('export', this.params())
        const binary = atob(result.content)
        const bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
        this.download(new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), result.filename)
      } finally { this.exporting = false }
    }
  }
}
</script>
<style scoped>
.actions, .filters { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
.filters > .ant-input { width: 180px; }
.qr { width: 110px; cursor: pointer; }
.preview { width: 100%; }
.exit-link { margin-left: 12px; }
.test-button { margin: 16px 0; }
</style>
