<template>
  <div class="cloud-access-page">
    <a-card :bordered="false">
      <div class="page-header">
        <div>
          <div class="page-title">门禁出入记录管理</div>
          <div class="page-desc">记录门禁设备上报的数据类型、进出方向、是否开门、感应器、设备与开门时间，方便联调和追踪。</div>
        </div>
        <a-button type="primary" icon="plus" @click="openModal()">
          添加记录
        </a-button>
      </div>

      <div class="filter-wrap">
        <a-form-model layout="inline" :model="searchForm">
          <a-form-model-item label="数据类型">
            <a-select v-model="searchForm.type" allow-clear placeholder="请选择数据类型" style="width: 220px">
              <a-select-option v-for="item in typeOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="进出方向">
            <a-select v-model="searchForm.reader" allow-clear placeholder="请选择进出方向" style="width: 140px">
              <a-select-option v-for="item in readerOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="是否开门">
            <a-select v-model="searchForm.status" allow-clear placeholder="请选择状态" style="width: 140px">
              <a-select-option v-for="item in statusOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="感应器">
            <a-select
              v-model="searchForm.card_id"
              allow-clear
              show-search
              placeholder="请选择感应器"
              style="width: 220px"
              option-filter-prop="children"
            >
              <a-select-option v-for="item in sensorOptions" :key="item.id" :value="item.id">
                {{ item.code }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="门禁设备">
            <a-select
              v-model="searchForm.serial_id"
              allow-clear
              show-search
              placeholder="请选择门禁设备"
              style="width: 220px"
              option-filter-prop="children"
            >
              <a-select-option v-for="item in deviceOptions" :key="item.id" :value="item.id">
                {{ item.serial_num }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="设备MAC">
            <a-input
              v-model="searchForm.MAC"
              allow-clear
              placeholder="请输入设备MAC"
              @keyup.enter.native="handleSearch"
            />
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" icon="search" @click="handleSearch">查询</a-button>
            <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>

      <a-table
        row-key="id"
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="type" slot-scope="text">
          <a-tag :color="getTypeColor(text)">
            {{ getTypeLabel(text) }}
          </a-tag>
        </template>
        <template slot="reader" slot-scope="text">
          <a-tag :color="Number(text) === 0 ? 'green' : 'orange'">
            {{ getReaderLabel(text) }}
          </a-tag>
        </template>
        <template slot="status" slot-scope="text">
          <a-tag :color="Number(text) === 1 ? 'green' : 'red'">
            {{ getStatusLabel(text) }}
          </a-tag>
        </template>
        <template slot="sensorCode" slot-scope="text">
          {{ text || '-' }}
        </template>
        <template slot="deviceSerial" slot-scope="text">
          {{ text || '-' }}
        </template>
        <template slot="deviceMac" slot-scope="text">
          {{ text || '-' }}
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="openModal(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除该记录吗？" ok-text="确认" cancel-text="取消" @confirm="handleDelete(record)">
            <a class="action-danger">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>

    <a-modal
      :title="modalTitle"
      :visible="modalVisible"
      :confirm-loading="submitting"
      destroy-on-close
      width="720px"
      @ok="handleSubmit"
      @cancel="closeModal"
    >
      <a-form-model
        ref="formRef"
        :model="formData"
        :rules="rules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 17 }"
      >
        <a-form-model-item label="数据类型" prop="type">
          <a-select v-model="formData.type" placeholder="请选择数据类型">
            <a-select-option v-for="item in typeOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="进出方向" prop="reader">
          <a-radio-group v-model="formData.reader">
            <a-radio v-for="item in readerOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="是否开门" prop="status">
          <a-radio-group v-model="formData.status">
            <a-radio v-for="item in statusOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="感应器">
          <a-select
            v-model="formData.card_id"
            allow-clear
            show-search
            placeholder="请选择感应器"
            option-filter-prop="children"
          >
            <a-select-option v-for="item in sensorOptions" :key="item.id" :value="item.id">
              {{ item.code }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="门禁设备">
          <a-select
            v-model="formData.serial_id"
            allow-clear
            show-search
            placeholder="请选择门禁设备"
            option-filter-prop="children"
          >
            <a-select-option v-for="item in deviceOptions" :key="item.id" :value="item.id">
              {{ item.serial_num }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="设备MAC" prop="MAC">
          <a-input v-model="formData.MAC" :max-length="50" placeholder="请输入设备MAC" />
        </a-form-model-item>
        <a-form-model-item label="开门时间" prop="access_time">
          <a-input v-model="formData.access_time" placeholder="请输入开门时间，例如 2026-04-10 10:00:00" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import villageDeviceApi from '@/api/community/village/device'
import { getSystemName } from '@/utils/util'

const TYPE_OPTIONS = [
  { value: 0, label: '0 - 卡' },
  { value: 1, label: '1 - 串口字符串/二维码' },
  { value: 2, label: '2 - 密码' },
  { value: 3, label: '3 - 按钮请求' },
  { value: 6, label: '6 - 二代证数据' },
  { value: 9, label: '9 - Base64编码数据' },
  { value: 10, label: '10 - 指纹数据' },
  { value: 11, label: '11 - 指静脉数据' },
  { value: 12, label: '12 - RFID卡' },
  { value: 13, label: '13 - 人脸' },
  { value: 23, label: '23 - 人脸' },
  { value: 26, label: '26 - 二代证数据' },
  { value: 28, label: '28 - 人脸机Post数据' },
  { value: 30, label: '30 - WG66/485读头数据' },
  { value: 100, label: '100 - 历史刷卡记录' },
  { value: 101, label: '101 - 历史报警记录' }
]

const READER_OPTIONS = [
  { value: 0, label: '进' },
  { value: 1, label: '出' }
]

const STATUS_OPTIONS = [
  { value: 1, label: '开门' },
  { value: 0, label: '拒绝' }
]

const defaultSearchForm = () => ({
  type: undefined,
  reader: undefined,
  status: undefined,
  card_id: undefined,
  serial_id: undefined,
  MAC: ''
})

const defaultFormData = () => ({
  id: 0,
  type: 0,
  reader: 0,
  status: 1,
  card_id: undefined,
  serial_id: undefined,
  MAC: '',
  access_time: ''
})

export default {
  name: 'CloudAccessRecordsList',
  data () {
    return {
      loading: false,
      submitting: false,
      modalVisible: false,
      modalTitle: '添加记录',
      tokenName: 'village_access_token',
      typeOptions: TYPE_OPTIONS,
      readerOptions: READER_OPTIONS,
      statusOptions: STATUS_OPTIONS,
      searchForm: defaultSearchForm(),
      formData: defaultFormData(),
      tableData: [],
      sensorOptions: [],
      deviceOptions: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`
      },
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 90 },
        { title: '数据类型', dataIndex: 'type', key: 'type', width: 210, scopedSlots: { customRender: 'type' } },
        { title: '进出方向', dataIndex: 'reader', key: 'reader', width: 110, scopedSlots: { customRender: 'reader' } },
        { title: '是否开门', dataIndex: 'status', key: 'status', width: 110, scopedSlots: { customRender: 'status' } },
        { title: '感应器编码', dataIndex: 'sensor_code', key: 'sensor_code', width: 220, scopedSlots: { customRender: 'sensorCode' } },
        { title: '设备序列号', dataIndex: 'device_serial_num', key: 'device_serial_num', width: 180, scopedSlots: { customRender: 'deviceSerial' } },
        { title: '设备MAC', dataIndex: 'MAC', key: 'MAC', width: 180, scopedSlots: { customRender: 'deviceMac' } },
        { title: '开门时间', dataIndex: 'access_time', key: 'access_time', width: 180 },
        { title: '操作', key: 'action', width: 160, scopedSlots: { customRender: 'action' } }
      ],
      rules: {
        type: [
          { required: true, message: '请选择数据类型', trigger: 'change' }
        ],
        reader: [
          { required: true, message: '请选择进出方向', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择是否开门', trigger: 'change' }
        ],
        access_time: [
          { required: true, message: '请输入开门时间', trigger: 'blur' }
        ],
        MAC: [
          { max: 50, message: '设备MAC长度不能超过50位', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    const sysName = getSystemName(location.hash) || 'village'
    this.tokenName = sysName + '_access_token'
    this.loadOptions()
    this.fetchList()
  },
  methods: {
    loadOptions () {
      Promise.all([
        this.request(villageDeviceApi.accessSensorsIndex, { page: 1, pageSize: 500, tokenName: this.tokenName }),
        this.request(villageDeviceApi.accessDeviceIndex, { page: 1, pageSize: 500, tokenName: this.tokenName })
      ]).then(([sensorRes, deviceRes]) => {
        this.sensorOptions = sensorRes.list || []
        this.deviceOptions = deviceRes.list || []
      })
    },
    getTypeLabel (value) {
      const current = this.typeOptions.find(item => item.value === Number(value))
      return current ? current.label : `未知类型(${value})`
    },
    getTypeColor (value) {
      const typeColorMap = {
        0: 'blue',
        1: 'cyan',
        2: 'purple',
        3: 'orange',
        6: 'gold',
        9: 'magenta',
        10: 'volcano',
        11: 'lime',
        12: 'green',
        13: 'geekblue',
        23: 'geekblue',
        26: 'gold',
        28: 'red',
        30: 'processing',
        100: 'green',
        101: 'red'
      }
      return typeColorMap[Number(value)] || 'default'
    },
    getReaderLabel (value) {
      const current = this.readerOptions.find(item => item.value === Number(value))
      return current ? current.label : `未知(${value})`
    },
    getStatusLabel (value) {
      const current = this.statusOptions.find(item => item.value === Number(value))
      return current ? current.label : `未知(${value})`
    },
    fetchList () {
      this.loading = true
      const params = {
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        tokenName: this.tokenName,
        ...this.searchForm
      }
      this.request(villageDeviceApi.accessRecordsIndex, params)
        .then((res) => {
          this.tableData = res.list || []
          this.pagination.total = Number(res.count || 0)
          this.pagination.pageSize = Number(res.pageSize || this.pagination.pageSize)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSearch () {
      this.pagination.current = 1
      this.fetchList()
    },
    handleReset () {
      this.searchForm = defaultSearchForm()
      this.pagination.current = 1
      this.fetchList()
    },
    handleTableChange (pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.fetchList()
    },
    openModal (record) {
      this.modalVisible = true
      this.modalTitle = record && record.id ? '编辑记录' : '添加记录'
      this.formData = record
        ? {
            id: Number(record.id),
            type: Number(record.type),
            reader: Number(record.reader),
            status: Number(record.status) === 0 ? 0 : 1,
            card_id: record.card_id ? Number(record.card_id) : undefined,
            serial_id: record.serial_id ? Number(record.serial_id) : undefined,
            MAC: record.MAC || '',
            access_time: record.access_time || ''
          }
        : defaultFormData()
      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate()
        }
      })
    },
    closeModal () {
      this.modalVisible = false
      this.formData = defaultFormData()
    },
    handleSubmit () {
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          return false
        }
        this.submitting = true
        const api = this.formData.id ? villageDeviceApi.accessRecordsEdit : villageDeviceApi.accessRecordsAdd
        this.request(api, {
          ...this.formData,
          MAC: this.formData.MAC ? this.formData.MAC.trim() : '',
          tokenName: this.tokenName
        })
          .then(() => {
            this.$message.success(this.formData.id ? '记录更新成功' : '记录添加成功')
            this.closeModal()
            this.fetchList()
          })
          .finally(() => {
            this.submitting = false
          })
      })
    },
    handleDelete (record) {
      this.request(villageDeviceApi.accessRecordsDelete, {
        id: record.id,
        tokenName: this.tokenName
      }).then(() => {
        this.$message.success('记录删除成功')
        if (this.tableData.length === 1 && this.pagination.current > 1) {
          this.pagination.current -= 1
        }
        this.fetchList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.cloud-access-page {
  padding: 16px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  color: #1f2329;
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
}

.page-desc {
  margin-top: 4px;
  color: #8c8c8c;
  line-height: 22px;
}

.filter-wrap {
  padding: 16px 16px 0;
  margin-bottom: 16px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.action-danger {
  color: #ff4d4f;
}

/deep/ .ant-form-item {
  margin-bottom: 16px;
}
</style>
