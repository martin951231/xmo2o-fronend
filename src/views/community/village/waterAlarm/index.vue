<template>
  <div class="water-alarm-page">
    <a-card :bordered="false">
      <div class="page-heading">
        <div><h2>水浸管理</h2><p>管理声光报警设备，远程控制报警、闪光与音量。</p></div>
        <a-button v-if="activeTab === 'devices'" type="primary" icon="plus" :disabled="!canAdd || busy || loading" @click="openEditor()">添加设备</a-button>
      </div>
      <a-alert v-if="activeTab === 'devices'" message="报警持续循环播放，需手动停止；仅闪光模式不播放声音。当前默认设备仅可添加一次。" type="info" show-icon />
      <a-tabs v-model="activeTab" @change="changeTab"><a-tab-pane key="sensors" tab="传感器管理" /><a-tab-pane key="devices" tab="喇叭管理" /></a-tabs>
      <div v-if="activeTab === 'sensors'">
        <div class="toolbar"><span>共 {{ sensorRows.length }} 个传感器</span><div><a-button :loading="sensorLoading" @click="loadSensors">刷新</a-button> <a-button type="primary" icon="plus" @click="openSensor()">添加传感器</a-button></div></div>
        <a-table row-key="sensor_id" :columns="sensorColumns" :data-source="sensorRows" :loading="sensorLoading" :pagination="{ pageSize: 10 }">
          <template slot="sensorState" slot-scope="text, row"><a-tag :color="Number(row.last_state) === 1 ? 'red' : 'default'">{{ Number(row.last_state) === 1 ? '漏水' : (Number(row.last_state) === 0 ? '正常' : '未上报') }}</a-tag></template>
          <template slot="sensorTime" slot-scope="text">{{ time(text) }}</template>
          <template slot="sensorEdit" slot-scope="text, row"><a-button type="link" @click="openSensor(row)">编辑报警词</a-button></template>
        </a-table>
        <p class="secondary">状态为最近一次上报结果。请将生成的ID配置到传感器；漏水后循环播报报警词并闪光，全部传感器恢复正常后停止。</p>
      </div>
      <div v-show="activeTab === 'devices'">
        <div class="toolbar"><span>共 {{ rows.length }} 台设备</span><a-button icon="reload" :loading="loading" :disabled="busy" @click="load">刷新列表</a-button></div>
        <a-table
          row-key="id"
          :columns="columns"
          :data-source="rows"
          :loading="loading"
          :pagination="false"
          :scroll="{ x: 1100 }">
          <template slot="name" slot-scope="text, row"><strong>{{ text }}</strong><div class="secondary">{{ row.host }}:{{ row.port }}</div></template>
          <template slot="state" slot-scope="text, row">
            <a-badge :status="known(row) ? 'success' : 'default'" :text="known(row) ? '已连接' : '状态待确认'" />
            <div class="state-tags" v-if="known(row)">
              <a-tag v-if="row.state.tts_active" color="blue">文字播报中</a-tag>
              <a-tag v-else-if="row.state.alarm_active" color="red">报警中</a-tag>
              <a-tag v-else-if="row.state.flash_active" color="orange">仅闪光</a-tag>
              <a-tag v-else>已停止</a-tag>
            </div>
            <div v-if="row.last_error" class="error-text">{{ row.last_error }}</div>
          </template>
          <template slot="volume" slot-scope="text, row">{{ known(row) ? row.state.volume : '—' }}<div class="secondary">报警设定：{{ row.volume }} 档</div></template>
          <template slot="seen" slot-scope="text">{{ time(text) }}</template>
          <template slot="actions" slot-scope="text, row">
            <div class="actions">
              <a-button :type="known(row) && row.state.alarm_active ? 'danger' : 'primary'" :disabled="busy || loading" @click="operate(row, known(row) && row.state.alarm_active ? 'stop' : 'alarm_start')">{{ known(row) && row.state.alarm_active ? '停止报警' : '报警' }}</a-button>
              <a-button :disabled="busy || loading" @click="operate(row, known(row) && row.state.flash_active ? 'flash_stop' : 'flash_start')">{{ known(row) && row.state.flash_active ? '停止闪光' : '闪光' }}</a-button>
              <a-button :disabled="busy || loading" @click="openVolume(row)">音量调整</a-button>
              <a-button :disabled="busy || loading" @click="openTts(row)">文字播报</a-button>
              <a-button v-if="!known(row)" type="danger" :disabled="busy || loading" @click="operate(row, 'stop')">停止声光</a-button>
            </div>
            <div class="links">
              <a-button type="link" size="small" :disabled="busy || loading" @click="operate(row, 'refresh')">刷新状态</a-button>
              <a-button type="link" size="small" :disabled="busy || loading" @click="openEditor(row)">编辑名称</a-button>
              <a-button type="link" size="small" :disabled="busy || loading" @click="showLogs(row)">操作记录</a-button>
            </div>
          </template>
          <template slot="emptyText"><a-empty description="暂无设备，请添加默认报警设备" /></template>
        </a-table>
        <div class="footnote"><a-icon v-if="busy" type="loading" /> {{ busy ? '正在与设备通信，请稍候…' : '页面每10秒读取一次设备状态；关闭页面不会停止报警。' }}</div>
      </div>
    </a-card>
    <a-modal v-model="sensorVisible" :title="sensorEditing ? '编辑报警词' : '添加传感器'" :confirm-loading="sensorSaving" :mask-closable="false" @ok="saveSensor">
      <a-form layout="vertical">
        <a-form-item label="传感器ID" required><a-input :value="sensorId" read-only placeholder="点击右侧按钮生成"><a-button slot="addonAfter" type="link" :disabled="sensorEditing || sensorSaving" :loading="sensorGenerating" @click="generateSensor">生成随机ID</a-button></a-input></a-form-item>
        <a-form-item label="报警词" required><a-textarea v-model="sensorText" :rows="3" :max-length="199" placeholder="例如：地下车库一号水浸传感器检测到漏水，请及时处理。" /><span :class="{ 'error-text': sensorBytes > 199 }">{{ sensorBytes }} / 199 字节（中文通常每字3字节）</span></a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model="editorVisible" :title="editingId ? '编辑设备' : '添加设备'" :confirm-loading="saving" :mask-closable="false" @ok="save">
      <a-form layout="vertical"><a-form-item label="设备名称" required><a-input v-model="name" :max-length="60" placeholder="例如：地下车库声光报警器" @pressEnter="save" /></a-form-item></a-form>
      <p class="secondary">使用默认连接与报警配置，无需填写其他参数。</p>
    </a-modal>
    <a-modal v-model="volumeVisible" title="音量调整" :confirm-loading="busy" :mask-closable="false" @ok="saveVolume">
      <p>设备：{{ selected.name }}</p>
      <div class="volume-control"><a-slider v-model="volume" :min="1" :max="31" :disabled="busy" /><a-input-number v-model="volume" :min="1" :max="31" :precision="0" :disabled="busy" /></div>
      <p class="secondary">1为最低非静音档。设备会限制最高档位，保存后显示实际音量。报警过程中调整将立即生效。</p>
    </a-modal>
    <a-modal
      :visible="ttsVisible"
      title="TTS文字播报"
      :width="820"
      :footer="null"
      :mask-closable="false"
      :closable="!busy && !ttsSaving"
      :keyboard="false"
      @cancel="ttsVisible = false">
      <div class="toolbar">
        <strong>{{ ttsDevice.name }}</strong>
        <a-button type="danger" :disabled="busy" @click="operate(ttsDevice, 'stop')">停止播报</a-button>
      </div>
      <a-alert message="点击播报后持续循环并爆闪；播报另一条会替换当前声音。关闭弹窗不会停止，请点击停止播报结束声音和灯光。" type="info" show-icon />
      <div class="tts-add">
        <a-textarea v-model="ttsContent" :rows="3" :max-length="199" :disabled="ttsSaving" placeholder="输入要播报的文字，例如：地下车库发生水浸，请及时处理。" />
        <div class="toolbar">
          <span :class="{ 'error-text': ttsByteLength > 199 }">{{ ttsByteLength }} / 199 字节（中文通常每字3字节）</span>
          <a-button type="primary" :loading="ttsSaving" :disabled="busy || ttsLoading || !ttsContent.trim() || ttsByteLength > 199" @click="addTtsText">添加文字</a-button>
        </div>
      </div>
      <div class="toolbar"><span>已添加 {{ ttsRows.length }} 条文字</span><a-button :loading="ttsLoading" :disabled="busy || ttsSaving" @click="loadTtsTexts">刷新列表</a-button></div>
      <a-table row-key="id" :columns="ttsColumns" :data-source="ttsRows" :loading="ttsLoading" :pagination="{ pageSize: 8 }">
        <template slot="content" slot-scope="text"><div class="tts-content">{{ text }}</div></template>
        <template slot="created" slot-scope="text">{{ time(text) }}</template>
        <template slot="speak" slot-scope="text, item">
          <div class="actions">
            <a-button type="primary" :disabled="busy || ttsSaving || ttsLoading" :loading="busy && playingTextId === item.id" @click="speakText(item)">播报</a-button>
            <a-popconfirm title="确定删除这条文字？删除不会停止正在进行的播报。" ok-text="删除" cancel-text="取消" :disabled="busy || ttsSaving || ttsLoading" @confirm="deleteTtsText(item)">
              <a-button type="danger" :disabled="busy || ttsSaving || ttsLoading">删除</a-button>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
    </a-modal>
    <a-drawer title="最近50条操作记录" :visible="logsVisible" :width="680" @close="logsVisible = false">
      <a-table row-key="id" :columns="logColumns" :data-source="logs" :loading="logsLoading" :pagination="{ pageSize: 10 }">
        <template slot="action" slot-scope="text">{{ actionNames[text] || text }}</template>
        <template slot="result" slot-scope="text">{{ resultNames[text] || text }}</template>
        <template slot="time" slot-scope="text">{{ time(text) }}</template>
      </a-table>
    </a-drawer>
  </div>
</template>

<script>
import moment from 'moment'
import api from '@/api/community/waterAlarm'

export default {
  name: 'WaterAlarm',
  data () {
    return {
      activeTab: 'sensors',
      sensorRows: [],
sensorLoading: false,
sensorVisible: false,
sensorSaving: false,
sensorGenerating: false,
sensorEditing: false,
sensorId: '',
sensorText: '',
      sensorColumns: [
        { title: '传感器ID', dataIndex: 'sensor_id' },
        { title: '报警词', dataIndex: 'alarm_text' },
        { title: '最近状态', dataIndex: 'last_state', scopedSlots: { customRender: 'sensorState' } },
        { title: '最近上报', dataIndex: 'last_seen', scopedSlots: { customRender: 'sensorTime' } },
        { title: '操作', key: 'edit', scopedSlots: { customRender: 'sensorEdit' } }
      ],
      rows: [],
canAdd: false,
loading: false,
busy: false,
saving: false,
      editorVisible: false,
editingId: 0,
name: '',
volumeVisible: false,
selected: {},
volume: 1,
      logsVisible: false,
logsLoading: false,
logs: [],
active: false,
timer: null,
now: Date.now(),
      ttsVisible: false,
      ttsSelected: {},
      ttsRows: [],
      ttsContent: '',
      ttsLoading: false,
      ttsSaving: false,
      playingTextId: 0,
      ttsColumns: [
        { title: '播报文字', dataIndex: 'content', scopedSlots: { customRender: 'content' } },
        { title: '添加时间', dataIndex: 'create_time', width: 180, scopedSlots: { customRender: 'created' } },
        { title: '操作', key: 'speak', width: 170, scopedSlots: { customRender: 'speak' } }
      ],
      actionNames: { alarm_start: '启动报警', tts_start: '文字播报', stop: '停止声光', flash_start: '仅闪光', flash_stop: '停止闪光', volume: '调整音量' },
      resultNames: { success: '成功', unknown: '结果待确认', pending: '执行中 / 待核对' },
      columns: [
        { title: '设备名称', dataIndex: 'name', width: 220, scopedSlots: { customRender: 'name' } },
        { title: '设备状态', key: 'state', width: 240, scopedSlots: { customRender: 'state' } },
        { title: '当前音量', key: 'volume', width: 120, scopedSlots: { customRender: 'volume' } },
        { title: '最近通信', dataIndex: 'last_seen', width: 180, scopedSlots: { customRender: 'seen' } },
        { title: '操作', key: 'actions', width: 380, scopedSlots: { customRender: 'actions' } }
      ],
      logColumns: [
        { title: '时间', dataIndex: 'create_time', scopedSlots: { customRender: 'time' } },
        { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } },
        { title: '结果', dataIndex: 'result', scopedSlots: { customRender: 'result' } },
        { title: '说明', dataIndex: 'message' }
      ]
    }
  },
  computed: {
    sensorBytes () { return new Blob([this.sensorText.trim()]).size },
    ttsDevice () { return this.rows.find(row => row.id === this.ttsSelected.id) || this.ttsSelected },
    ttsByteLength () { return new Blob([this.ttsContent.trim()]).size }
  },
  mounted () { this.activate() },
  activated () { this.activate() },
  deactivated () { this.deactivate() },
  beforeDestroy () { this.deactivate() },
  methods: {
    changeTab (tab) { if (tab === 'sensors') this.loadSensors() },
    async loadSensors () {
      if (this.sensorLoading) return
      this.sensorLoading = true
      try { this.sensorRows = (await this.call('sensors')).list } catch (e) { this.$message.error('传感器列表加载失败') } finally { this.sensorLoading = false }
    },
    openSensor (row) { this.sensorEditing = !!row; this.sensorId = row ? row.sensor_id : ''; this.sensorText = row ? row.alarm_text : ''; this.sensorVisible = true },
    async generateSensor () {
      if (this.sensorGenerating || this.sensorEditing) return
      this.sensorGenerating = true
      try { this.sensorId = (await this.call('generateSensor')).sensor_id } catch (e) { this.$message.error('ID生成失败，请重试') } finally { this.sensorGenerating = false }
    },
    async saveSensor () {
      if (this.sensorSaving || this.sensorGenerating) return
      if (!this.sensorId || !this.sensorText.trim() || this.sensorBytes > 199) { this.$message.warning('请生成ID并填写199字节以内的报警词'); return }
      this.sensorSaving = true
      try { this.sensorRows = (await this.call('saveSensor', { sensor_id: this.sensorId, alarm_text: this.sensorText.trim() })).list; this.sensorVisible = false; this.$message.success('传感器已保存') } catch (e) { this.$message.error('保存失败，请检查报警词或重新生成ID') } finally { this.sensorSaving = false }
    },
    call (action, data = {}) { return this.requestNew(api[action], data, 'post', undefined, { timeout: 30000 }) },
    time (value) { return value ? moment.unix(Number(value)).format('YYYY-MM-DD HH:mm:ss') : '尚未通信' },
    known (row) { return row.state_known && row.state && this.now / 1000 - Number(row.last_seen) <= 20 },
    activate () {
      if (this.active) return
      this.active = true
      this.loadSensors()
      this.load()
      this.timer = setInterval(() => {
        this.now = Date.now()
        if (this.activeTab === 'sensors' && !this.sensorVisible && !document.hidden) this.loadSensors()
        if (!this.busy && !this.loading && !this.saving && !this.ttsVisible && !this.volumeVisible && !document.hidden && this.rows.length) this.operate(this.rows[0], 'refresh', true)
      }, 10000)
    },
    deactivate () { this.active = false; clearInterval(this.timer); this.timer = null },
    async load () {
      if (this.loading || this.busy) return
      this.loading = true
      try {
        const data = await this.call('devices')
        this.rows = data.list; this.canAdd = data.can_add; this.now = Date.now()
      } catch (e) { this.$message.error('设备列表加载失败，请重试') } finally { this.loading = false }
      if (this.active && this.rows.length) this.operate(this.rows[0], 'refresh', true)
    },
    openEditor (row) { this.editingId = row ? row.id : 0; this.name = row ? row.name : ''; this.editorVisible = true },
    async save () {
      if (this.saving) return
      if (!this.name.trim()) { this.$message.warning('请输入设备名称'); return }
      this.saving = true
      try {
        const data = await this.call('save', { id: this.editingId, name: this.name.trim() })
        this.rows = data.list; this.canAdd = data.can_add; this.editorVisible = false
        this.$message.success('设备已保存')
      } catch (e) { this.$message.error('保存失败，请检查名称或刷新列表') } finally { this.saving = false }
    },
    async operate (row, action, silent = false, extra = {}) {
      if (this.busy || this.loading) return false
      this.busy = true
      try {
        const data = await this.call('operate', { id: row.id, action, volume: action === 'volume' ? this.volume : undefined, text_id: action === 'tts_start' ? extra.text_id : undefined })
        const index = this.rows.findIndex(item => item.id === row.id)
        if (index >= 0) this.$set(this.rows, index, data.device)
        this.now = Date.now()
        if (!silent) this.$message[data.ok ? 'success' : 'error'](data.message)
        return data.ok
      } catch (e) {
        const index = this.rows.findIndex(item => item.id === row.id)
        if (index >= 0) this.$set(this.rows, index, { ...this.rows[index], state_known: false, last_error: '通信未能确认，请刷新状态；可直接发送停止声光指令。' })
        if (!silent) this.$message.error('操作结果未确认，请刷新状态或发送停止指令')
        return false
      } finally { this.busy = false }
    },
    openVolume (row) { this.selected = row; this.volume = Number(row.volume) || 1; this.volumeVisible = true },
    async saveVolume () {
      if (!Number.isInteger(this.volume) || this.volume < 1 || this.volume > 31) { this.$message.warning('请选择1至31的整数音量'); return }
      if (await this.operate(this.selected, 'volume')) this.volumeVisible = false
    },
    openTts (row) {
      this.ttsSelected = row; this.ttsRows = []; this.ttsContent = ''; this.ttsVisible = true
      this.loadTtsTexts()
    },
    async loadTtsTexts () {
      if (this.ttsLoading || this.ttsSaving) return
      this.ttsLoading = true
      try { this.ttsRows = (await this.call('texts', { id: this.ttsSelected.id })).list } catch (e) { this.$message.error('文字列表加载失败，请检查数据库升级后重试') } finally { this.ttsLoading = false }
    },
    async addTtsText () {
      if (this.ttsSaving || this.ttsLoading || this.busy) return
      const content = this.ttsContent.trim()
      if (!content || this.ttsByteLength > 199 || Array.from(content).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127 || char === '[' || char === ']')) { this.$message.warning('请输入199字节以内的单段文字，不包含方括号或控制字符'); return }
      this.ttsSaving = true
      try {
        this.ttsRows = (await this.call('addText', { id: this.ttsSelected.id, content })).list
        this.ttsContent = ''; this.$message.success('文字已添加，可点击播报')
      } catch (e) { this.$message.error('添加失败，请检查是否重复或已达到100条上限') } finally { this.ttsSaving = false }
    },
    async deleteTtsText (item) {
      if (this.busy || this.ttsSaving || this.ttsLoading) return
      this.ttsSaving = true
      try {
        const data = await this.call('deleteText', { id: this.ttsSelected.id, text_id: item.id })
        this.ttsRows = data.list
        this.$message.success('文字已删除')
      } catch (e) { this.$message.error('删除失败，请刷新列表后重试') } finally { this.ttsSaving = false }
    },
    async speakText (item) {
      if (this.busy || this.ttsSaving || this.ttsLoading) return
      this.playingTextId = item.id
      try { return await this.operate(this.ttsDevice, 'tts_start', false, { text_id: item.id }) } finally { this.playingTextId = 0 }
    },
    async showLogs (row) {
      this.logsVisible = true; this.logsLoading = true; this.logs = []
      try { this.logs = (await this.call('logs', { id: row.id })).list } catch (e) { this.$message.error('操作记录加载失败') } finally { this.logsLoading = false }
    }
  }
}
</script>

<style scoped>
.water-alarm-page { margin: 20px; }
.page-heading, .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.page-heading { margin-bottom: 22px; }
.page-heading h2 { font-size: 22px; margin-bottom: 6px; color: #1f2937; }
.page-heading p, .secondary, .footnote { color: #7b8492; font-size: 13px; }
.page-heading p { margin: 0; }
.toolbar { margin: 0 0 18px; color: #596579; }
.secondary, .state-tags { margin-top: 6px; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; }
.links { margin-top: 8px; }
.links .ant-btn { padding-left: 0; margin-right: 12px; }
.error-text { color: #c06724; font-size: 12px; margin-top: 6px; max-width: 230px; }
.footnote { margin-top: 20px; }
.volume-control { display: flex; align-items: center; gap: 20px; margin: 24px 0; }
.volume-control .ant-slider { flex: 1; }
.tts-add { margin: 20px 0; }
.tts-add .toolbar { margin-top: 10px; font-size: 12px; }
.tts-content { white-space: pre-wrap; overflow-wrap: anywhere; }
@media (max-width: 768px) { .water-alarm-page { margin: 10px; } .page-heading { align-items: flex-start; } }
</style>
