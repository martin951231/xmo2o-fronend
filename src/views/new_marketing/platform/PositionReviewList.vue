<template>
  <a-card
    :bordered="false"
    class="position-review-list"
    :tab-list="tabList"
    :active-tab-key="activeTab"
    @tabChange="onTabChange"
  >
    <!-- search box -->
    <a-form-model :model="searchForm" v-bind="searchFormLayout">
      <a-row>
        <a-col :span="9">
          <a-form-model-item label="申请职位">
            <a-select v-model="searchForm.identity" placeholder="请选择申请职位">
              <a-select-option value="1"> 业务员 </a-select-option>
              <a-select-option value="2"> 业务经理 </a-select-option>
              <a-select-option value="3"> 区域代理 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="9">
          <a-form-model-item label="人员姓名">
            <a-input v-model="searchForm.name" placeholder="请输入人员姓名" />
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <a-form-model-item>
            <a-button type="primary" @click="search"> 搜索 </a-button>
            <a-button class="ml-10" @click="reset"> 重置 </a-button>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="9">
          <a-form-model-item label="申请时间">
            <a-range-picker
              :ranges="{
                今日: [moment(), moment()],
                近7天: [moment().subtract('days', 6), moment()],
                近15天: [moment().subtract('days', 14), moment()],
                近30天: [moment().subtract('days', 29), moment()],
              }"
              :value="time"
              format="YYYY-MM-DD"
              @change="onDateRangeChange"
              style="width: 100%"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="9">
          <a-form-model-item label="审核状态" v-if="activeTab == 1">
            <a-select v-model="searchForm.status" placeholder="请选择审核状态">
              <a-select-option value="0"> 待审核 </a-select-option>
              <a-select-option value="1"> 已通过 </a-select-option>
              <a-select-option value="2"> 已拒绝 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="6"> </a-col>
      </a-row>
    </a-form-model>

    <!-- table list -->
    <a-table
      class="mt-10"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="dataList"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="status_type" slot-scope="text, record">
        <a-badge v-if="record.status == 2" color="#f50" :text="text" />
        <a-badge v-else-if="record.status == 1" color="#2db7f5" :text="text" />
        <a-badge v-else color="#108ee9" :text="text" />
      </template>
      <template slot="action" slot-scope="id, record">
        <a-button type="link" @click="btnClick('check', record)">查看</a-button>
        <template v-if="record.status == 0">
          <a-button type="link" @click="btnClick('pass', record)">通过</a-button>
          <a-button type="link" @click="btnClick('refuse', record)">拒绝</a-button>
        </template>
      </template>
    </a-table>

    <!-- modal -->
    <!-- check -->
    <a-modal v-model="checkModalVisible" title="查看详情" class="check-modal" :footer="null" centered>
      <a-row :gutter="[16, 16]">
        <a-col class="title" :span="6"> 姓名： </a-col>
        <a-col class="content" :span="14"> {{ currentRecord.person_name }} </a-col>
      </a-row>
      <a-row :gutter="[16, 16]">
        <a-col class="title" :span="6"> UID： </a-col>
        <a-col class="content" :span="14"> {{ currentRecord.uid }} </a-col>
      </a-row>
      <a-row :gutter="[16, 16]">
        <a-col class="title" :span="6"> 申请理由： </a-col>
        <a-col class="content" :span="14"> {{ currentRecord.reason }} </a-col>
      </a-row>
    </a-modal>
    <!-- pass -->
    <a-modal
      v-model="reviewModalVisible"
      title="审核通过"
      class="review-modal"
      :width="700"
      centered
      destroyOnClose
      @ok="reviewRecord"
    >
      <a-form-model :model="reviewForm" v-bind="formLayout" :rules="rules" ref="reviewForm">
        <template v-if="teamList.length">
          <a-form-model-item label="选择接手成员" prop="pid">
            <a-select v-model="reviewForm.pid" placeholder="请选择接手成员">
              <a-select-option v-for="item of teamList" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </template>
        <template v-if="currentRecord.identity == 3">
          <!-- 转至区域经理 -->
          <a-form-model-item label="选择接手业务经理" prop="manage_id">
            <a-select v-model="reviewForm.manage_id" placeholder="请选择接手业务经理">
              <a-select-option v-for="item of manageList" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="代理抽成比率" prop="percent">
            <a-input-number v-model="reviewForm.percent" :min="0" :max="100" placeholder="请输入" /> %
          </a-form-model-item>
        </template>
        <a-form-model-item label="选择区域" prop="area">
          <a-cascader :options="areaList" placeholder="请选择区域" v-model="reviewForm.area" />
        </a-form-model-item>
        <a-form-model-item label="备注" prop="agree_reason">
          <a-textarea
            v-model="reviewForm.agree_reason"
            placeholder="请输入备注"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import moment from 'moment'
import marketingPlatformApi from '@/api/new_marketing/platform/index'

export default {
  name: 'PositionReviewList',
  data() {
    return {
      tabList,
      activeTab: '1',
      searchForm: {
        identity: undefined,
        name: '',
        status: undefined,
        start_time: '',
        end_time: '',
      },
      time: [],
      order: 0, // add_time sorter
      searchFormLayout,
      formLayout,
      columns,
      loading: false,
      dataList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      currentRecord: {},
      checkModalVisible: false,
      reviewModalVisible: false,
      reviewForm: {
        agree_reason: '',
        area: [],
        pid: undefined
      },
      teamList: [],
      manageList: [],
      areaList: [],
      rules: {},
    }
  },
  created() {
    this.getData()
  },
  methods: {
    moment,
    onTabChange(current) {
      this.activeTab = current
      this.reset()
    },
    getData() {
      if (this.activeTab == 2) {
        this.searchForm.status = 2
      }
      this.request(marketingPlatformApi.positionReviewList, {
        ...this.searchForm,
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        order: this.order,
      }).then((data) => {
        if (data) {
          if (data.arr) {
            this.$set(this.pagination, 'total', data.arr.total)
            this.dataList = data.arr.data || []
          }
          this.manageList = data.manager_list
          this.areaList = data.areaList
        }
      })
    },
    handleTableChange(pagination, filters, sorter) {
      let current = pagination.current
      if (current == this.pagination.current) {
        // 排序
        if (sorter.order) {
          this.order = sorter.order == 'ascend' ? 2 : 1
        } else {
          this.order = 0
        }
        current = 1
      }
      this.$set(this.pagination, 'current', current)
      this.getData()
    },
    // 创建时间
    onDateRangeChange(date, dateString) {
      this.$set(this, 'time', [date[0], date[1]])
      this.searchForm.start_time = dateString[0]
      this.searchForm.end_time = dateString[1]
    },
    search() {
      this.$set(this.pagination, 'current', 1)
      this.getData()
    },
    reset() {
      this.$set(this, 'searchForm', this.$options.data().searchForm)
      this.$set(this, 'time', [])
      this.$set(this.pagination, 'current', 1)
      this.getData()
    },
    btnClick(type, record) {
      this.currentRecord = record
      if (type == 'check') {
        this.checkModalVisible = true
      } else if (type == 'pass') {
        this.$set(this, 'reviewForm', this.$options.data().reviewForm)
        this.request(marketingPlatformApi.getTeamList, {
          pid: record.pid,
        }).then((data) => {
          this.teamList = data || []
          if (this.teamList.length) {
            // 业务经理返回数据才显示
            this.rules.pid = [{ required: true, message: '请选择接手成员', trigger: 'blur' }]
          }
          if (this.rules.area) {
            delete this.rules.area
          }
          if (record.identity == 3) {
            this.reviewForm = {
              ...this.reviewForm,
              manage_id: undefined,
              percent: undefined,
            }
            this.rules = {
              ...this.rules,
              manage_id: [{ required: true, message: '请选择接手业务经理', trigger: 'blur' }],
              percent: [{ required: true, message: '请输入代理抽成比率', trigger: 'blur' }],
              area: [{ required: true, message: '请选择区域', trigger: 'blur' }],
            }
          }
          this.reviewModalVisible = true
        })
      } else if (type == 'refuse') {
        this.$confirm({
          title: '提示',
          content: '您确定要拒绝该成员的申请吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          centered: true,
          onOk: () => {
            this.request(marketingPlatformApi.reviewDisagree, { id: record.id }).then((data) => {
              this.$message.success('已拒绝该申请~')
              this.getData()
            })
          },
        })
      }
    },
    // agree
    reviewRecord() {
      this.$refs.reviewForm.validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.reviewForm))
          params.id = this.currentRecord.id
          params.type = this.currentRecord.identity == 3 ? 1 : 0
          if (params.area.length) {
            params.province_id = params.area[0] || ''
            params.city_id = params.area[1] || ''
            params.area_id = params.area[2] || ''
          }
          delete params.area
          console.log('reviewRecord', params)
          this.request(marketingPlatformApi.reviewAgree, params).then((data) => {
            this.reviewModalVisible = false
            this.$message.success('审核已通过~')
            this.getData()
          })
        } else {
          return false
        }
      })
    },
  },
}
// tab
const tabList = [
  {
    key: '1',
    tab: '审核列表',
  },
  {
    key: '2',
    tab: '已拒绝列表',
  },
]
// search form layout
const searchFormLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}
// pass form layout
const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
}
const columns = [
  {
    title: '姓名',
    dataIndex: 'person_name',
    align: 'center',
  },
  {
    title: '当前职位',
    dataIndex: 'now_identity_name',
    align: 'center',
  },
  {
    title: '所属团队',
    dataIndex: 'team_name',
    align: 'center',
  },
  {
    title: '累计（个人/团队）业绩',
    dataIndex: 'total_performance',
    align: 'center',
  },
  {
    title: '申请职位',
    dataIndex: 'identity_name',
    align: 'center',
  },
  {
    title: '申请时间',
    dataIndex: 'add_time',
    sorter: true,
    align: 'center',
  },
  {
    title: '审核状态',
    dataIndex: 'status_type',
    scopedSlots: { customRender: 'status_type' },
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'id',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  },
]
</script>
<style lang="less" scoped>
.position-review-list {
  margin: 20px;
  min-height: 90%;
}
.check-modal {
  .title {
    text-align: right;
    color: #999;
  }
  .content {
    color: #333;
  }
}
</style>
