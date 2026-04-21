<template>
  <div class="cloud-access-page">
    <a-card :bordered="false">
      <div class="page-header">
        <div>
          <div class="page-title">非机动车管理</div>
          <div class="page-desc">维护当前小区车牌编号与用户的映射关系，车牌从门禁感应器中选择，用户从当前小区住户中选择。</div>
        </div>
        <a-button type="primary" icon="plus" @click="openModal()">
          新增映射
        </a-button>
      </div>

      <div class="filter-wrap">
        <a-form-model layout="inline" :model="searchForm">
          <a-form-model-item label="车牌编号">
            <a-input
              v-model="searchForm.parking_num"
              allow-clear
              placeholder="请输入车牌编号"
              @keyup.enter.native="handleSearch"
            />
          </a-form-model-item>
          <a-form-model-item label="用户信息">
            <a-input
              v-model="searchForm.user_keyword"
              allow-clear
              placeholder="请输入姓名/手机号/房间号"
              @keyup.enter.native="handleSearch"
            />
          </a-form-model-item>
          <a-form-model-item label="车辆类型">
            <a-select v-model="searchForm.type" allow-clear placeholder="请选择车辆类型" style="width: 160px">
              <a-select-option v-for="item in typeOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
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
        <template slot="parkingNum" slot-scope="text">
          {{ text || '-' }}
        </template>
        <template slot="sensorCode" slot-scope="text">
          {{ text || '-' }}
        </template>
        <template slot="userName" slot-scope="text">
          {{ text || '-' }}
        </template>
        <template slot="userPhone" slot-scope="text">
          {{ text || '-' }}
        </template>
        <template slot="room" slot-scope="text">
          {{ text || '-' }}
        </template>
        <template slot="type" slot-scope="text">
          <a-tag :color="Number(text) === 1 ? 'green' : 'blue'">
            {{ getTypeLabel(text) }}
          </a-tag>
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="openModal(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除这条映射吗？" ok-text="确认" cancel-text="取消" @confirm="handleDelete(record)">
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
        <a-form-model-item label="车牌编号" prop="sensors_id" extra="输入感应器编码或车牌编号模糊搜索，每次展示 20 条">
          <a-select
            v-model="formData.sensors_id"
            allow-clear
            show-search
            :filter-option="false"
            :not-found-content="null"
            placeholder="请输入感应器编码或车牌编号"
            @search="handleSensorSearch"
            @focus="handleSensorFocus"
            @change="handleSensorChange"
          >
            <a-select-option v-for="item in sensorOptions" :key="String(item.id)" :value="item.id">
              {{ getSensorOptionLabel(item) }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="用户" prop="user_id" extra="输入姓名、手机号或房间号模糊搜索，每次展示 20 条">
          <a-select
            v-model="formData.user_id"
            allow-clear
            show-search
            :filter-option="false"
            :not-found-content="null"
            placeholder="请输入用户姓名、手机号或房间号"
            @search="handleUserSearch"
            @focus="handleUserFocus"
            @change="handleUserChange"
          >
            <a-select-option v-for="item in userOptions" :key="String(item.pigcms_id)" :value="item.pigcms_id">
              {{ getUserOptionLabel(item) }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="车辆类型" prop="type">
          <a-radio-group v-model="formData.type">
            <a-radio v-for="item in typeOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import villageDeviceApi from '@/api/community/village/device'
import { getSystemName } from '@/utils/util'

const TYPE_OPTIONS = [
  { value: 1, label: '电瓶车' },
  { value: 2, label: '摩托车' },
  { value: 3, label: '自行车' },
  { value: 99, label: '其他' }
]

const defaultSearchForm = () => ({
  parking_num: '',
  user_keyword: '',
  type: undefined
})

const defaultFormData = () => ({
  id: 0,
  sensors_id: undefined,
  parking_num: '',
  sensor_code: '',
  user_id: undefined,
  user_name: '',
  user_phone: '',
  room: '',
  type: 1
})

export default {
  name: 'HouseNonMotorizedVehicleList',
  data () {
    return {
      loading: false,
      submitting: false,
      modalVisible: false,
      modalTitle: '新增映射',
      tokenName: 'village_access_token',
      typeOptions: TYPE_OPTIONS,
      searchForm: defaultSearchForm(),
      formData: defaultFormData(),
      tableData: [],
      sensorOptions: [],
      userOptions: [],
      sensorSearchTimer: null,
      userSearchTimer: null,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`
      },
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 90 },
        { title: '车牌编号', dataIndex: 'parking_num', key: 'parking_num', width: 160, scopedSlots: { customRender: 'parkingNum' } },
        { title: '感应器编码', dataIndex: 'sensor_code', key: 'sensor_code', width: 180, scopedSlots: { customRender: 'sensorCode' } },
        { title: '用户姓名', dataIndex: 'user_name', key: 'user_name', width: 140, scopedSlots: { customRender: 'userName' } },
        { title: '手机号', dataIndex: 'user_phone', key: 'user_phone', width: 150, scopedSlots: { customRender: 'userPhone' } },
        { title: '房间号', dataIndex: 'room', key: 'room', width: 220, scopedSlots: { customRender: 'room' } },
        { title: '车辆类型', dataIndex: 'type', key: 'type', width: 120, scopedSlots: { customRender: 'type' } },
        { title: '添加时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
        { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
        { title: '操作', key: 'action', width: 160, scopedSlots: { customRender: 'action' } }
      ],
      rules: {
        sensors_id: [
          { required: true, message: '请选择车牌编号', trigger: 'change' }
        ],
        user_id: [
          { required: true, message: '请选择用户', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择车辆类型', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    const sysName = getSystemName(location.hash) || 'village'
    this.tokenName = sysName + '_access_token'
    this.fetchList()
  },
  beforeDestroy () {
    clearTimeout(this.sensorSearchTimer)
    clearTimeout(this.userSearchTimer)
  },
  methods: {
    getTypeLabel (value) {
      const current = this.typeOptions.find(item => item.value === Number(value))
      return current ? current.label : '-'
    },
    getSensorOptionLabel (item) {
      const parkingNum = item.parking_num || '-'
      return item.code ? `${parkingNum}（${item.code}）` : parkingNum
    },
    getUserOptionLabel (item) {
      const name = item.name || '未命名用户'
      const phone = item.phone || '-'
      const room = item.room ? ` / ${item.room}` : ''
      return `${name} / ${phone}${room}`
    },
    fetchList () {
      this.loading = true
      const params = {
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        tokenName: this.tokenName,
        ...this.searchForm
      }
      this.request(villageDeviceApi.nonMotorizedVehicleIndex, params)
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
      this.modalTitle = record && record.id ? '编辑映射' : '新增映射'
      this.formData = record
        ? {
            id: Number(record.id),
            sensors_id: record.sensors_id ? Number(record.sensors_id) : undefined,
            parking_num: record.parking_num || '',
            sensor_code: record.sensor_code || '',
            user_id: record.user_id ? Number(record.user_id) : undefined,
            user_name: record.user_name || '',
            user_phone: record.user_phone || '',
            room: record.room || '',
            type: Number(record.type || 1)
          }
        : defaultFormData()
      this.sensorOptions = []
      this.userOptions = []
      this.ensureSelectedOptions()
      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate()
        }
      })
    },
    ensureSelectedOptions () {
      if (this.formData.sensors_id && this.formData.parking_num) {
        this.sensorOptions = [{
          id: this.formData.sensors_id,
          code: this.formData.sensor_code || '',
          parking_num: this.formData.parking_num
        }]
      }
      if (this.formData.user_id) {
        this.userOptions = [{
          pigcms_id: this.formData.user_id,
          name: this.formData.user_name || '',
          phone: this.formData.user_phone || '',
          room: this.formData.room || ''
        }]
      }
    },
    closeModal () {
      this.modalVisible = false
      this.formData = defaultFormData()
      this.sensorOptions = []
      this.userOptions = []
    },
    handleSensorFocus () {
      if (!this.sensorOptions.length) {
        this.fetchSensorOptions('')
      }
    },
    handleUserFocus () {
      if (!this.userOptions.length) {
        this.fetchUserOptions('')
      }
    },
    handleSensorSearch (value) {
      clearTimeout(this.sensorSearchTimer)
      this.sensorSearchTimer = setTimeout(() => {
        this.fetchSensorOptions(value)
      }, 250)
    },
    handleUserSearch (value) {
      clearTimeout(this.userSearchTimer)
      this.userSearchTimer = setTimeout(() => {
        this.fetchUserOptions(value)
      }, 250)
    },
    fetchSensorOptions (keyword = '') {
      this.request(villageDeviceApi.nonMotorizedVehicleSensorOptions, {
        keyword,
        pageSize: 20,
        tokenName: this.tokenName
      }).then((res) => {
        const list = res.list || []
        if (this.formData.sensors_id && this.formData.parking_num) {
          const exists = list.some(item => String(item.id) === String(this.formData.sensors_id))
          if (!exists) {
            list.unshift({
              id: this.formData.sensors_id,
              code: this.formData.sensor_code || '',
              parking_num: this.formData.parking_num
            })
          }
        }
        this.sensorOptions = list.slice(0, 20)
      })
    },
    fetchUserOptions (keyword = '') {
      this.request(villageDeviceApi.nonMotorizedVehicleUserOptions, {
        keyword,
        pageSize: 20,
        tokenName: this.tokenName
      }).then((res) => {
        const list = res.list || []
        if (this.formData.user_id) {
          const exists = list.some(item => Number(item.pigcms_id) === Number(this.formData.user_id))
          if (!exists) {
            list.unshift({
              pigcms_id: this.formData.user_id,
              name: this.formData.user_name || '',
              phone: this.formData.user_phone || '',
              room: this.formData.room || ''
            })
          }
        }
        this.userOptions = list.slice(0, 20)
      })
    },
    handleSensorChange (value) {
      const current = this.sensorOptions.find(item => String(item.id) === String(value))
      this.formData.sensors_id = value
      this.formData.parking_num = current ? current.parking_num : ''
      this.formData.sensor_code = current ? current.code : ''
    },
    handleUserChange (value) {
      const current = this.userOptions.find(item => Number(item.pigcms_id) === Number(value))
      this.formData.user_id = value
      this.formData.user_name = current ? current.name : ''
      this.formData.user_phone = current ? current.phone : ''
      this.formData.room = current ? current.room : ''
    },
    handleSubmit () {
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          return false
        }
        this.submitting = true
        const api = this.formData.id ? villageDeviceApi.nonMotorizedVehicleEdit : villageDeviceApi.nonMotorizedVehicleAdd
        this.request(api, {
          ...this.formData,
          tokenName: this.tokenName
        })
          .then(() => {
            this.$message.success(this.formData.id ? '映射更新成功' : '映射添加成功')
            this.closeModal()
            this.fetchList()
          })
          .finally(() => {
            this.submitting = false
          })
      })
    },
    handleDelete (record) {
      this.request(villageDeviceApi.nonMotorizedVehicleDelete, {
        id: record.id,
        tokenName: this.tokenName
      }).then(() => {
        this.$message.success('映射删除成功')
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
