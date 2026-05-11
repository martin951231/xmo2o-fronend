<template>
  <div class="cloud-access-page">
    <a-card :bordered="false">
      <div class="page-header">
        <div>
          <div class="page-title">非机动车管理</div>
          <div class="page-desc">维护当前小区车牌编号与住户的映射关系，车牌从门禁感应器中选择，住户按房间自动带出。</div>
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
              placeholder="请输入姓名、手机号、房间号"
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

        <a-form-model-item label="人员类型" prop="person_type">
          <a-radio-group v-model="formData.person_type" @change="handlePersonTypeChange">
            <a-radio :value="1">业主</a-radio>
            <a-radio :value="2">工作人员</a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item v-if="formData.person_type === 1" label="房间" prop="vacancy_id" extra="按当前小区房间逐级选择，选到房间后自动带出绑定业主">
          <a-cascader
            style="width: 100%;"
            :options="options"
            :load-data="loadDataFunc"
            :value="formData.roomArr"
            allow-clear
            placeholder="请选择房间"
            change-on-select
            @change="setVisionsFunc"
          />
        </a-form-model-item>

        <a-form-model-item label="绑定业主/工作人员" prop="user_id" :extra="formData.person_type === 1 ? '自动读取当前房间绑定的业主信息' : '按组织架构选择一个工作人员'">
          <a-spin v-if="formData.person_type === 1" :spinning="ownerLoading">
            <a-input
              :value="ownerDisplayText"
              disabled
              placeholder="请选择房间后自动带出绑定业主"
            />
            <div v-if="formData.user_id" class="owner-detail-list">
              <div class="owner-detail-item">姓名：{{ ownerNameDisplay }}</div>
              <div class="owner-detail-item">电话：{{ ownerPhoneDisplay }}</div>
            </div>
            <div v-if="formData.room" class="owner-room">{{ formData.room }}</div>
            <div v-if="formData.vacancy_id && !ownerLoading && !formData.user_id" class="owner-empty">
              当前房间未绑定业主，请先绑定业主后再新增映射
            </div>
          </a-spin>
          <div v-else>
            <a-spin :spinning="orgLoading || staffLoading">
              <a-cascader
                style="width: 100%;"
                :options="staffCascaderOptions"
                :load-data="loadStaffDataFunc"
                :value="staffCascaderValue"
                allow-clear
                placeholder="请选择工作人员"
                @change="handleStaffCascaderChange"
              />
            </a-spin>
            <div v-if="formData.user_id" class="owner-detail-list">
              <div class="owner-detail-item">姓名：{{ ownerNameDisplay }}</div>
              <div class="owner-detail-item">电话：{{ ownerPhoneDisplay }}</div>
              <div class="owner-detail-item">组织：{{ formData.group_name || '-' }}</div>
            </div>
          </div>
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
import villageApi from '@/api/community/village'
import villageDeviceApi from '@/api/community/village/device'
import propertyApi from '@/api/community/property/packages'
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
  person_type: 1,
  sensors_id: undefined,
  parking_num: '',
  sensor_code: '',
  user_id: undefined,
  user_name: '',
  user_phone: '',
  room: '',
  group_id: undefined,
  group_name: '',
  vacancy_id: undefined,
  roomArr: [],
  type: 1
})

export default {
  name: 'HouseNonMotorizedVehicleList',
  data () {
    return {
      loading: false,
      submitting: false,
      ownerLoading: false,
      modalVisible: false,
      modalTitle: '新增映射',
      tokenName: 'village_access_token',
      typeOptions: TYPE_OPTIONS,
      searchForm: defaultSearchForm(),
      formData: defaultFormData(),
      tableData: [],
      sensorOptions: [],
      options: [],
      sensorSearchTimer: null,
      orgLoading: false,
      staffLoading: false,
      staffCascaderOptions: [],
      staffCascaderValue: [],
      currentVillageId: undefined,
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
        person_type: [
          { required: true, message: '请选择人员类型', trigger: 'change' }
        ],
        vacancy_id: [
          { validator: this.validateVacancyId, trigger: 'change' }
        ],
        user_id: [
          { validator: this.validateUserId, trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择车辆类型', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ownerNameDisplay () {
      return this.formData.user_name || '未命名人员'
    },
    ownerPhoneDisplay () {
      return this.formData.user_phone || '-'
    },
    ownerDisplayText () {
      if (!this.formData.user_id) {
        return ''
      }
      return this.ownerNameDisplay
    }
  },
  mounted () {
    const sysName = getSystemName(location.hash) || 'village'
    this.tokenName = sysName + '_access_token'
    this.fetchList()
    this.getSingleListByVillage()
  },
  beforeDestroy () {
    clearTimeout(this.sensorSearchTimer)
  },
  methods: {
    normalizeNumber (value) {
      if (value === null || value === undefined || value === '') {
        return undefined
      }
      const number = Number(value)
      return Number.isNaN(number) ? undefined : number
    },
    validateVacancyId (rule, value, callback) {
      if (this.formData.person_type === 2 || value) {
        callback()
        return
      }
      callback(new Error('请选择房间'))
    },
    validateUserId (rule, value, callback) {
      if (value) {
        callback()
        return
      }
      callback(new Error(this.formData.person_type === 2 ? '请选择工作人员' : '当前房间未绑定业主'))
    },
    getRecordPersonType (record = {}) {
      const rawType = this.normalizeNumber(record.person_type || record.user_type || record.bind_type)
      if (rawType === 2) {
        return 2
      }
      if (!record.vacancy_id && !record.room_id && !record.room_data && (record.group_id || record.worker_id || record.wid)) {
        return 2
      }
      return 1
    },
    getTypeLabel (value) {
      const current = this.typeOptions.find(item => item.value === Number(value))
      return current ? current.label : '-'
    },
    getSensorOptionLabel (item) {
      const parkingNum = item.parking_num || '-'
      return item.code ? `${parkingNum}（${item.code}）` : parkingNum
    },
    getRoomPathFromRecord (record = {}) {
      const fromArray = Array.isArray(record.roomArr)
        ? record.roomArr
        : (Array.isArray(record.room_arr) ? record.room_arr : [])
      const normalizedArray = fromArray.map(item => this.normalizeNumber(item)).filter(item => item !== undefined)
      if (normalizedArray.length === 4) {
        return normalizedArray
      }

      const fromFields = [
        record.single_id,
        record.floor_id,
        record.layer_id,
        record.vacancy_id || record.room_data || record.room_id
      ].map(item => this.normalizeNumber(item)).filter(item => item !== undefined)

      return fromFields.length === 4 ? fromFields : []
    },
    getSubmitPayload () {
      return {
        id: this.formData.id,
        person_type: this.formData.person_type,
        bind_type: this.formData.person_type,
        sensors_id: this.formData.sensors_id,
        parking_num: this.formData.parking_num,
        sensor_code: this.formData.sensor_code,
        user_id: this.formData.user_id,
        worker_id: this.formData.person_type === 2 ? this.formData.user_id : undefined,
        user_name: this.formData.user_name,
        user_phone: this.formData.user_phone,
        room: this.formData.room,
        vacancy_id: this.formData.person_type === 1 ? this.formData.vacancy_id : undefined,
        group_id: this.formData.group_id,
        group_name: this.formData.group_name,
        type: this.formData.type,
        tokenName: this.tokenName
      }
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
    async openModal (record) {
      const roomArr = record ? this.getRoomPathFromRecord(record) : []
      const personType = record ? this.getRecordPersonType(record) : 1

      this.modalVisible = true
      this.modalTitle = record && record.id ? '编辑映射' : '新增映射'
      this.formData = record
        ? {
            id: Number(record.id),
            person_type: personType,
            sensors_id: this.normalizeNumber(record.sensors_id),
            parking_num: record.parking_num || '',
            sensor_code: record.sensor_code || '',
            user_id: this.normalizeNumber(record.user_id || record.worker_id || record.wid || record.pigcms_id),
            user_name: record.user_name || record.name || '',
            user_phone: record.user_phone || record.phone || record.mobile || record.phone_num || '',
            room: record.room || record.room_address || '',
            group_id: this.normalizeNumber(record.group_id || record.department_id),
            group_name: record.group_name || record.department_name || '',
            vacancy_id: this.normalizeNumber(record.vacancy_id || record.room_data || record.room_id),
            roomArr: personType === 1 ? roomArr : [],
            type: Number(record.type || 1)
          }
        : defaultFormData()

      this.ownerLoading = false
      this.sensorOptions = []
      this.staffCascaderValue = []
      this.ensureSelectedSensorOption()

      if (this.formData.person_type === 1) {
        await this.ensureRoomRootOptions()
      } else {
        await this.ensureOrgTreeData()
      }
      if (this.formData.person_type === 1 && roomArr.length === 4) {
        await this.restoreRoomSelection(roomArr)
      }

      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate()
        }
      })
    },
    ensureSelectedSensorOption () {
      if (this.formData.sensors_id && this.formData.parking_num) {
        this.sensorOptions = [{
          id: this.formData.sensors_id,
          code: this.formData.sensor_code || '',
          parking_num: this.formData.parking_num
        }]
      }
    },
    closeModal () {
      this.modalVisible = false
      this.ownerLoading = false
      this.formData = defaultFormData()
      this.sensorOptions = []
      this.staffCascaderValue = []
    },
    handlePersonTypeChange () {
      this.formData.user_id = undefined
      this.formData.user_name = ''
      this.formData.user_phone = ''
      this.formData.room = ''
      this.formData.group_id = undefined
      this.formData.group_name = ''
      this.staffCascaderValue = []

      if (this.formData.person_type === 1) {
        this.formData.vacancy_id = undefined
        this.formData.roomArr = []
        this.ensureRoomRootOptions()
      } else {
        this.formData.vacancy_id = undefined
        this.formData.roomArr = []
        this.ensureOrgTreeData()
      }

      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate(['vacancy_id', 'user_id'])
        }
      })
    },
    ensureOrgTreeData () {
      if (this.staffCascaderOptions.length) {
        return Promise.resolve(this.staffCascaderOptions)
      }
      return this.fetchOrgTreeData()
    },
    async fetchOrgTreeData () {
      this.orgLoading = true
      try {
        const [res, villageId] = await Promise.all([
          this.request(propertyApi.frameworkTissueNav, {
            tokenName: this.tokenName
          }),
          this.ensureCurrentVillageId()
        ])
        const menuList = res && res.menu_list ? res.menu_list : []
        const currentVillageId = villageId || this.getCurrentVillageId(res)
        const villageNode = this.findCurrentVillageNode(menuList, currentVillageId) || this.getOnlyVillageNode(menuList)
        this.staffCascaderOptions = villageNode && villageNode.children
          ? villageNode.children.map(item => this.mapOrgNodeToStaffOption(item))
          : []
        return this.staffCascaderOptions
      } finally {
        this.orgLoading = false
      }
    },
    ensureCurrentVillageId () {
      const localVillageId = this.getCurrentVillageId()
      if (localVillageId) {
        this.currentVillageId = localVillageId
        return Promise.resolve(localVillageId)
      }
      return this.request('/community/village_api.VillageConfig/getConfig')
        .then((res) => {
          const villageId = this.normalizeNumber(
            res && (res.village_id || res.current_village_id || res.now_village_id || res.login_village_id)
          )
          this.currentVillageId = villageId
          return villageId
        })
        .catch(() => undefined)
    },
    getCurrentVillageId (res = {}) {
      const userInfo = (this.$store && this.$store.getters && this.$store.getters.userInfo) || {}
      const config = (this.$store && this.$store.getters && this.$store.getters.config) || {}
      const query = (this.$route && this.$route.query) || {}
      return this.normalizeNumber(
        this.currentVillageId ||
        userInfo.village_id ||
        userInfo.villageId ||
        userInfo.current_village_id ||
        userInfo.login_village_id ||
        config.village_id ||
        query.village_id ||
        query.village ||
        query.current_village_id ||
        res.current_village_id ||
        res.village_id
      )
    },
    findCurrentVillageNode (nodes = [], villageId) {
      if (!villageId) {
        return null
      }
      for (const node of nodes) {
        if (Number(node.village_id || 0) === Number(villageId)) {
          return node
        }
        const children = node.children || []
        const current = this.findCurrentVillageNode(children, villageId)
        if (current) {
          return current
        }
      }
      return null
    },
    getOnlyVillageNode (nodes = []) {
      if (nodes.length === 1 && nodes[0] && nodes[0].children) {
        return nodes[0]
      }
      return null
    },
    mapOrgNodeToStaffOption (node = {}) {
      return {
        label: node.title || node.name || '-',
        value: `org_${node.id}`,
        isLeaf: false,
        orgId: this.normalizeNumber(node.id),
        orgName: node.title || node.name || '',
        rawChildren: node.children || []
      }
    },
    mapWorkerToStaffOption (worker = {}, groupId, groupName) {
      const workerId = this.normalizeNumber(worker.wid || worker.worker_id || worker.id)
      const name = worker.name || worker.user_name || '-'
      const phone = worker.phone || worker.mobile || worker.phone_num || ''
      return {
        label: phone ? `${name}（${phone}）` : name,
        value: `staff_${workerId}`,
        isLeaf: true,
        userId: workerId,
        userName: name,
        userPhone: phone,
        groupId: this.normalizeNumber(worker.group_id || worker.department_id || groupId),
        groupName: worker.group_name || groupName || ''
      }
    },
    loadStaffDataFunc (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      if (!targetOption || targetOption.isLeaf || targetOption.children) {
        return
      }
      targetOption.loading = true
      this.getOrgWorkerOptions(targetOption.orgId, targetOption.orgName)
        .then((workerOptions) => {
          const childOrgOptions = (targetOption.rawChildren || []).map(item => this.mapOrgNodeToStaffOption(item))
          targetOption.children = childOrgOptions.concat(workerOptions)
          this.staffCascaderOptions = [...this.staffCascaderOptions]
        })
        .finally(() => {
          targetOption.loading = false
        })
    },
    getOrgWorkerOptions (groupId, groupName) {
      if (!groupId) {
        return Promise.resolve([])
      }
      this.staffLoading = true
      return this.request(propertyApi.frameworkTissueUser, {
        assets_id: '0',
        num: '',
        status: '0',
        time: '',
        keywords: '',
        group_id: groupId,
        page: 1,
        pageSize: 1000,
        tokenName: this.tokenName
      }).then((res) => {
        const list = res && res.list ? res.list : []
        return list.map(item => this.mapWorkerToStaffOption(item, groupId, groupName))
      }).finally(() => {
        this.staffLoading = false
      })
    },
    handleStaffCascaderChange (value = [], selectedOptions = []) {
      this.staffCascaderValue = Array.isArray(value) ? value : []
      const staffOption = selectedOptions.find(item => item && item.isLeaf && item.userId)
      if (!staffOption) {
        this.formData.user_id = undefined
        this.formData.user_name = ''
        this.formData.user_phone = ''
        this.formData.group_id = undefined
        this.formData.group_name = ''
        this.formData.room = ''
        return
      }
      this.formData.user_id = staffOption.userId
      this.formData.user_name = staffOption.userName
      this.formData.user_phone = staffOption.userPhone
      this.formData.group_id = staffOption.groupId
      this.formData.group_name = staffOption.groupName
      this.formData.room = this.formData.group_name
      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.validateField('user_id')
        }
      })
    },
    handleSensorFocus () {
      if (!this.sensorOptions.length) {
        this.fetchSensorOptions('')
      }
    },
    handleSensorSearch (value) {
      clearTimeout(this.sensorSearchTimer)
      this.sensorSearchTimer = setTimeout(() => {
        this.fetchSensorOptions(value)
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
    handleSensorChange (value) {
      const current = this.sensorOptions.find(item => String(item.id) === String(value))
      this.formData.sensors_id = value
      this.formData.parking_num = current ? current.parking_num : ''
      this.formData.sensor_code = current ? current.code : ''
    },
    ensureRoomRootOptions () {
      if (this.options.length) {
        return Promise.resolve(this.options)
      }
      return this.getSingleListByVillage()
    },
    getSingleListByVillage () {
      return this.request(villageApi.getSingleListByVillage).then(res => {
        const list = res || []
        this.options = list.map(item => ({
          label: item.name,
          value: item.id,
          isLeaf: false
        }))
        return this.options
      })
    },
    getFloorList (id) {
      return this.request(villageApi.getFloorList, {
        pid: id
      }).then(res => res || [])
    },
    getLayerList (id) {
      return this.request(villageApi.getLayerList, {
        pid: id
      }).then(res => res || [])
    },
    getVacancyList (id) {
      return this.request(villageApi.getVacancyList, {
        pid: id
      }).then(res => res || [])
    },
    loadDataFunc (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      if (!targetOption) {
        return
      }
      targetOption.loading = true
      setTimeout(() => {
        targetOption.loading = false
      }, 100)
    },
    async restoreRoomSelection (roomArr) {
      await this.setVisionsFunc(roomArr.slice(0, 1), { skipClearOwner: true })
      await this.setVisionsFunc(roomArr.slice(0, 2), { skipClearOwner: true })
      await this.setVisionsFunc(roomArr.slice(0, 3), { skipClearOwner: true })
      await this.setVisionsFunc(roomArr, { skipClearOwner: true, silentOwnerNotice: true })
    },
    clearOwnerInfo (keepRoom = false) {
      this.formData.user_id = undefined
      this.formData.user_name = ''
      this.formData.user_phone = ''
      if (!keepRoom) {
        this.formData.room = ''
      }
    },
    getFieldValueByLabels (fieldList = [], labels = []) {
      const current = fieldList.find(item => {
        const label = String(item && item.label ? item.label : '').trim()
        return labels.some(target => label === target || label.includes(target))
      })
      if (!current) {
        return ''
      }
      return current.value || current.text || current.val || ''
    },
    getSelectedRoomLabel (selectedOptions = []) {
      if (!selectedOptions.length) {
        return ''
      }
      const labels = []
      let currentOptions = this.options
      selectedOptions.forEach(value => {
        const current = (currentOptions || []).find(item => String(item.value) === String(value))
        if (current) {
          labels.push(current.label)
          currentOptions = current.children || []
        }
      })
      return labels.join('/')
    },
    async getRoomOwnerInfo (vacancyId, config = {}) {
      const { selectedOptions = [], silentOwnerNotice = false } = config
      if (!vacancyId) {
        this.clearOwnerInfo()
        return
      }

      const roomLabel = this.getSelectedRoomLabel(selectedOptions)
      this.ownerLoading = true
      try {
        const res = await this.request('/community/village_api.Building/getRoomBindOwnerData', {
          vacancy_id: vacancyId
        })
        const userInfoRaw = res && res.user_info ? res.user_info : {}
        const userInfo = Array.isArray(userInfoRaw) ? (userInfoRaw[0] || {}) : userInfoRaw
        const userFieldList = Array.isArray(res && res.user_field_list) ? res.user_field_list : []
        const userId = this.normalizeNumber(userInfo.pigcms_id || userInfo.id)
        const userName = userInfo.name || userInfo.user_name || userInfo.nickname ||
          this.getFieldValueByLabels(userFieldList, ['姓名', '业主姓名', '住户姓名'])
        const userPhone = userInfo.phone || userInfo.mobile || userInfo.user_phone || userInfo.phone_num ||
          this.getFieldValueByLabels(userFieldList, ['手机号', '联系电话', '联系手机', '手机号码'])

        this.formData.user_id = userId
        this.formData.user_name = userName
        this.formData.user_phone = userPhone
        this.formData.room = (res && res.room_address) || roomLabel

        if (!userId && !silentOwnerNotice) {
          this.$message.warning('当前房间未绑定业主，请先绑定业主后再新增映射')
        }
      } catch (e) {
        this.clearOwnerInfo(true)
        this.formData.room = roomLabel
      } finally {
        this.ownerLoading = false
      }
    },
    async setVisionsFunc (selectedOptions = [], config = {}) {
      const { skipClearOwner = false, silentOwnerNotice = false } = config
      this.formData.roomArr = selectedOptions

      if (!selectedOptions.length) {
        this.formData.vacancy_id = undefined
        this.clearOwnerInfo()
        return []
      }

      if (selectedOptions.length === 1) {
        this.formData.vacancy_id = undefined
        if (!skipClearOwner) {
          this.clearOwnerInfo()
        }
        const children = (await this.getFloorList(selectedOptions[0])).map(item => ({
          label: item.name,
          value: item.id,
          isLeaf: false
        }))
        const optionsTemp = [...this.options]
        const current = optionsTemp.find(item => String(item.value) === String(selectedOptions[0]))
        if (current) {
          current.children = children
        }
        this.options = optionsTemp
        return children
      }

      if (selectedOptions.length === 2) {
        this.formData.vacancy_id = undefined
        if (!skipClearOwner) {
          this.clearOwnerInfo()
        }
        const children = (await this.getLayerList(selectedOptions[1])).map(item => ({
          label: item.name,
          value: item.id,
          isLeaf: false
        }))
        const optionsTemp = [...this.options]
        const building = optionsTemp.find(item => String(item.value) === String(selectedOptions[0]))
        const unit = building && building.children
          ? building.children.find(item => String(item.value) === String(selectedOptions[1]))
          : null
        if (unit) {
          unit.children = children
        }
        this.options = optionsTemp
        return children
      }

      if (selectedOptions.length === 3) {
        this.formData.vacancy_id = undefined
        if (!skipClearOwner) {
          this.clearOwnerInfo()
        }
        const children = (await this.getVacancyList(selectedOptions[2])).map(item => ({
          label: item.name,
          value: item.id,
          isLeaf: true
        }))
        const optionsTemp = [...this.options]
        const building = optionsTemp.find(item => String(item.value) === String(selectedOptions[0]))
        const unit = building && building.children
          ? building.children.find(item => String(item.value) === String(selectedOptions[1]))
          : null
        const layer = unit && unit.children
          ? unit.children.find(item => String(item.value) === String(selectedOptions[2]))
          : null
        if (layer) {
          layer.children = children
        }
        this.options = optionsTemp
        return children
      }

      if (selectedOptions.length === 4) {
        this.formData.vacancy_id = this.normalizeNumber(selectedOptions[3])
        await this.getRoomOwnerInfo(this.formData.vacancy_id, {
          selectedOptions,
          silentOwnerNotice
        })
      }

      return []
    },
    handleSubmit () {
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          return false
        }
        this.submitting = true
        const api = this.formData.id ? villageDeviceApi.nonMotorizedVehicleEdit : villageDeviceApi.nonMotorizedVehicleAdd
        this.request(api, this.getSubmitPayload())
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

.owner-detail-list {
  margin-top: 8px;
  color: #595959;
  font-size: 12px;
  line-height: 20px;
}

.owner-detail-item + .owner-detail-item {
  margin-top: 2px;
}

.owner-room {
  margin-top: 8px;
  color: #8c8c8c;
  font-size: 12px;
  line-height: 20px;
}

.owner-empty {
  margin-top: 8px;
  color: #ff4d4f;
  font-size: 12px;
  line-height: 20px;
}

/deep/ .ant-form-item {
  margin-bottom: 16px;
}
</style>
