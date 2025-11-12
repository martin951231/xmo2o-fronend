<template>
  <div>
    <a-card title="业务经理列表" :bordered="false">
      <a-form layout="inline" ref="searchForm" :form="searchInfo" style="margin-bottom: 30px" :labelCol="{ span: 4 }">
        <a-row :gutter="24">
          <a-col :span="9">
            <a-form-item label="业务经理：" style="width: 100%">
              <a-input style="width: 300px" placeholder="请输入姓名" v-decorator="['name']" />
            </a-form-item>
          </a-col>
          <a-col :span="9">
            <a-form-item label="区域：" style="width: 100%">
              <a-cascader style="width: 300px" :options="areaList" placeholder="请选择省市区" v-decorator="['area']" />
            </a-form-item>
          </a-col>
          <a-col :span="6" style="text-align: right">
            <a-form-item>
              <a-button type="primary" htmlType="submit" @click="searchHandle">查询</a-button>
            </a-form-item>

            <a-form-item>
              <a-button @click="clearSearch">重置</a-button>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="9">
            <a-form-item label="区域代理" style="margin-top: 20px; width: 100%">
              <a-select style="width: 300px" placeholder="请选择区域代理人" v-decorator="['uid']">
                <a-select-option v-for="item in areaUser" :key="item.id">{{ item.name }} </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="9">
            <a-form-item label="添加时间" style="margin-top: 20px; width: 100%">
              <a-range-picker
                style="width: 300px"
                :ranges="{
                  过去30天: [moment().subtract(30, 'days'), moment()],
                  过去15天: [moment().subtract(15, 'days'), moment()],
                  过去7天: [moment().subtract(7, 'days'), moment()],
                  今日: [moment(), moment()],
                }"
                format="YYYY-MM-DD"
                v-decorator="['time', { initialValue: searchInfo.time }]"
              >
                <a-icon slot="suffixIcon" type="calendar" />
              </a-range-picker>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-button type="primary" @click="addManager" style="height: 46px">添加业务经理</a-button>
    </a-card>
    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data-source="managerList"
        rowKey="id"
        :pagination="pagination"
        style="min-height: 700px"
      >
        <span slot="action" slot-scope="text, record">
          <template>
            <a href="javascript:;" @click="editManager(record)">编辑</a>
            <a-divider type="vertical" />
          </template>
          <template>
            <a-dropdown>
              <a class="ant-dropdown-link" @click="(e) => e.preventDefault()"> 更多 <a-icon type="down" /> </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="upgradeManager(record)">升级</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="demoteManager(record)">降级</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="deleteManager(record)">移除</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </span>
      </a-table>
    </a-card>

    <!-- 添加业务经理弹窗 -->
    <a-modal
      :title="isAdd ? '添加业务经理' : '编辑业务经理'"
      :width="640"
      :visible="showEditManager"
      @cancel="showHandle('showEditManager')"
    >
      <a-form ref="managerForm" :form="managerInfo" :label-col="{ span: 4, offset: 3 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="姓名">
          <a-input
            placeholder="请输入名称"
            v-decorator="[
              'name',
              { initialValue: managerInfo.name, rules: [{ required: true, message: '请输入姓名！' }] },
            ]"
          />
        </a-form-item>

        <a-form-item label="绑定账号">
          <a-input
            :class="!isAdd ? 'disabled-input' : ''"
            :disabled="!isAdd"
            placeholder="请输入手机号"
            v-decorator="[
              'uid',
              { initialValue: managerInfo.uid, rules: [{ required: true, message: '请输入手机号！' }] },
            ]"
          />
        </a-form-item>

        <a-form-item label="成员邀请码" v-if="!isAdd">
          <a-input
            type="text"
            class="disabled-input"
            :disabled="true"
            v-decorator="['invitation_code', { initialValue: managerInfo.invitation_code }]"
          />
        </a-form-item>

        <a-form-item :label="isAdd ? '选择区域' : '区域'">
          <a-cascader
            :class="!isAdd ? 'disabled-input area' : ''"
            :options="areaList"
            placeholder="请选择省市区"
            :disabled="!isAdd"
            v-decorator="['area', { initialValue: managerInfo.area }]"
          />
        </a-form-item>

        <a-form-item label="备注">
          <a-textarea
            placeholder="请输入备注"
            v-decorator="['note', { initialValue: managerInfo.note }]"
            :autoSize="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button @click="showHandle('showEditManager')">取消</a-button>
        <a-button htmlType="submit" type="primary" @click="saveManagerInfo">确定</a-button>
      </template>
    </a-modal>

    <!-- 升级至区域代理 -->
    <a-modal
      title="升级至区域代理"
      :width="640"
      :destroyOnClose="true"
      :visible="showUpgrade"
      @cancel="showHandle('showUpgrade')"
    >
      <a-form ref="upgradeForm" :form="upgradeInfo" :label-col="{ span: 6, offset: 2 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="选择业务接手成员" v-if="haveTeam" help="业务经理当前业务商家需转移给当前团队成员">
          <a-select
            placeholder="请选择"
            v-decorator="[
              'person',
              { initialValue: upgradeInfo.person, rules: [{ required: true, message: '请选择业务接手成员！' }] },
            ]"
          >
            <a-select-option v-for="item in memberList" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="选择业务经理" v-if="haveTeam" help="须为此团队以及成员绑定新的业务经理">
          <a-select
            placeholder="请选择"
            v-decorator="[
              'manager',
              { initialValue: upgradeInfo.manager, rules: [{ required: true, message: '请选择业务经理！' }] },
            ]"
          >
            <a-select-option v-for="item in noTeamManagerList" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="选择区域">
          <a-cascader
            :options="areaList"
            placeholder="请选择省市区"
            v-decorator="[
              'area',
              { initialValue: upgradeInfo.area, rules: [{ required: true, message: '请选择区域！' }] },
            ]"
          />
        </a-form-item>

        <a-form-item label="店铺业务抽成比例" help="不填写则代表无提成，即为0">
          <a-input-number
            id="inputNumber"
            :min="0"
            :max="100"
            v-decorator="['store_percent', { initialValue: upgradeInfo.store_percent }]"
          />
          <span style="margin-left: 5px">%</span>
        </a-form-item>
        <a-form-item label="社区业务抽成比例" help="不填写则代表无提成，即为0">
          <a-input-number
            id="inputNumber"
            :min="0"
            :max="100"
            v-decorator="['village_percent', { initialValue: upgradeInfo.village_percent }]"
          />
          <span style="margin-left: 5px">%</span>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button @click="showHandle('showUpgrade')">取消</a-button>
        <a-button htmlType="submit" type="primary" @click="saveUpgradeInfo">确定</a-button>
      </template>
    </a-modal>

    <!-- 移除有团队的业务经理 -->
    <a-modal title="移除" :width="640" :destroyOnClose="true" :visible="showDelete" @cancel="showHandle('showDelete')">
      <a-form ref="deleteForm" :form="deleteInfo" :label-col="{ span: 6, offset: 3 }" :wrapper-col="{ span: 12 }">
        <a-form-model-item label="选择业务接手成员" help="业务经理当前业务商家需转移给当前团队成员">
          <a-select
            placeholder="请选择"
            v-decorator="[
              'person',
              { initialValue: deleteInfo.person, rules: [{ required: true, message: '请选择业务接手成员！' }] },
            ]"
          >
            <a-select-option v-for="item in memberList" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="选择业务经理" help="须为此团队以及成员绑定新的业务经理">
          <a-select
            placeholder="请选择"
            v-decorator="[
              'manager',
              { initialValue: deleteInfo.manager, rules: [{ required: true, message: '请选择业务经理！' }] },
            ]"
          >
            <a-select-option v-for="item in noTeamManagerList" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form>
      <template slot="footer">
        <a-button @click="showHandle('showDelete')">取消</a-button>
        <a-button htmlType="submit" type="primary" @click="saveDeleteInfo">确定</a-button>
      </template>
    </a-modal>

    <!-- 降级 -->
    <a-modal
      title="降级至业务员"
      :width="640"
      :destroyOnClose="true"
      :visible="showDemote"
      @cancel="showHandle('showDemote')"
    >
      <a-form ref="demoteForm" :form="demoteInfo" :label-col="{ span: 6, offset: 1 }" :wrapper-col="{ span: 12 }">
        <a-form-model-item label="选择业务经理" v-if="haveTeam" help="该团队下有成员，需为团队选择新业务经理">
          <a-select
            placeholder="请选择"
            v-decorator="[
              'manager_id',
              { initialValue: demoteInfo.manager_id, rules: [{ required: true, message: '请选择业务经理！' }] },
            ]"
          >
            <a-select-option v-for="item in noTeamManagerList" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="选择团队" help="降级为业务员后 将归属该团队">
          <a-select
            placeholder="请选择"
            v-decorator="[
              'team_id',
              { initialValue: demoteInfo.team_id, rules: [{ required: true, message: '请选择团队！' }] },
            ]"
          >
            <a-select-option v-for="item in teamList" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form>
      <template slot="footer">
        <a-button @click="showHandle('showDemote')">取消</a-button>
        <a-button htmlType="submit" type="primary" @click="saveDemoteInfo">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import marketingPlatformApi from '@/api/new_marketing/platform/index'

export default {
  name: 'MarketingArtisanList',
  components: {},
  data() {
    return {
      // 表头
      columns: [
        {
          title: '姓名',
          dataIndex: 'manager_name',
          align: 'center',
        },
        {
          title: '归属团队名',
          dataIndex: 'name',
          align: 'center',
        },
        {
          title: '团队人数',
          dataIndex: 'team_count',
          align: 'center',
        },
        {
          title: '区域代理',
          dataIndex: 'area_name',
          align: 'center',
        },
        {
          title: '团队总业绩',
          dataIndex: 'total_performance',
          align: 'center',
        },
        {
          title: '添加时间',
          dataIndex: 'add_time',
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
        },
      ],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },

      areaList: [],
      searchArea: [],
      showEditManager: false, // 添加、编辑业务经理弹窗显示
      isAdd: true, // 添加
      managerInfo: this.$form.createForm(this, { name: 'managerForm' }), // 业务经理表单信息
      managerList: [], // 业务经理列表
      showUpgrade: false, // 升级弹窗
      upgradeInfo: this.$form.createForm(this, { name: 'upgradeForm' }), // 升级form表单信息
      managerId: '', // 当前点击的业务经理id
      haveTeam: false, // 当前点击的业务经理是否有团队
      noTeamManagerList: [], // 没有团队的业务经理列表
      memberList: [],
      showDelete: false, // 移除弹窗
      deleteInfo: this.$form.createForm(this, { name: 'deleteForm' }), // 移除form表单信息
      showDemote: false, // 降级弹窗
      demoteInfo: this.$form.createForm(this, { name: 'demoteForm' }), // 降级form表单信息
      teamList: [], // 团队列表
      searchInfo: this.$form.createForm(this, { name: 'searchForm' }), // 搜索参数
      areaUser: [], // 区域代理列表
    }
  },
  watch: {
    $route() {
      if (this.$route.path == '/new_marketing/platform/ManagerList') {
        this.getList()
      }
    },
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    moment,

    searchHandle(e) {
      e.preventDefault()
      this.searchInfo.validateFields((err, values) => {
        if (!err) {
          // console.log('提交搜索信息', values)
          let query = {}
          if (values.area && values.area.length > 0) {
            query.province_id = values.area[0] || ''
            query.city_id = values.area[1] || ''
            query.area_id = values.area[2] || ''
          }
          if (values.time && values.time.length > 0) {
            query.start_time = values.time[0].format('YYYY-MM-DD')
            query.end_time = values.time[1].format('YYYY-MM-DD')
          }
          query.uid = values.uid || ''
          query.name = values.name || ''
          // console.log('提交搜索信息', query)
          this.getList(true, query)
        } else {
          console.log('搜索错误', err)
        }
      })
    },

    // 重置
    clearSearch() {
      this.searchInfo.resetFields()
      this.getList(true)
    },

    demoteManager(record) {
      this.managerId = record.id
      this.showDemote = true
      this.haveTeam = record.team_id !== '-'
    },

    // 降级操作
    saveDemoteInfo(e) {
      e.preventDefault()
      this.demoteInfo.validateFields((err, values) => {
        if (!err) {
          values.type = this.haveTeam ? 1 : 0
          values.id = this.managerId

          this.request(marketingPlatformApi.demoteManager, values).then((res) => {
            this.$message.success('降级成功！', 1)
            this.showDemote = false
            this.getList()
          })
        } else {
          console.log('submit!', err)
          for (let key in err) {
            this.$message.error(err[key].errors[0].message)
            break
          }
        }
      })
    },

    upgradeManager(record) {
      this.getMemberList(record.id)
      this.showUpgrade = true
      this.managerId = record.id
      this.haveTeam = record.team_id !== '-'
    },

    saveUpgradeInfo(e) {
      e.preventDefault()
      this.upgradeInfo.validateFields((err, values) => {
        if (!err) {
          values.province_id = values.area[0] || ''
          values.city_id = values.area[1] || ''
          values.area_id = values.area[2] || ''
          values.type = this.haveTeam ? 1 : 0
          values.id = this.managerId
          // console.log('保存升级信息', values)
          this.request(marketingPlatformApi.upgradeManager, values).then((res) => {
            this.$message.success('升级成功！', 1)
            this.showUpgrade = false
            this.getList()
          })
        } else {
          console.log('submit!', err)
          for (let key in err) {
            this.$message.error(err[key].errors[0].message)
            break
          }
        }
      })
    },

    // 移除操作
    deleteManager(record) {
      if (record.team_id === '-') {
        this.$confirm({
          title: '你确定要移除该业务经理吗？',
          icon: (h) => {
            return h('a-icon', {
              props: {
                type: 'close-circle',
                theme: 'filled',
              },
              style: {
                color: '#f50f50',
              },
            })
          },
          onOk: () => {
            this.request(marketingPlatformApi.delNoTeamManager, { id: record.id }).then((res) => {
              this.$message.success('移除成功！', 1)
              this.getList()
            })
          },
        })
      } else {
        this.managerId = record.id
        this.showDelete = true
        this.getMemberList(record.id)
      }
    },

    saveDeleteInfo(e) {
      e.preventDefault()
      this.deleteInfo.validateFields((err, values) => {
        if (!err) {
          values.id = this.managerId
          // console.log('提交移除信息', values)
          this.request(marketingPlatformApi.deleteManager, values).then((res) => {
            this.$message.success('移除成功！', 1)
            this.showDelete = false
            this.getList()
          })
        } else {
          console.log('submit!', err)
          for (let key in err) {
            this.$message.error(err[key].errors[0].message)
            break
          }
        }
      })
    },

    // 添加业务经理
    addManager() {
      this.isAdd = true
      this.showEditManager = true
      this.$nextTick(() => {
        this.managerInfo.setFieldsValue({
          name: '',
          uid: '',
          note: '',
          area: [],
        })
      })
    },

    // 编辑业务经理
    editManager(record) {
      // console.log('点击编辑按钮', record)
      this.isAdd = false
      this.showEditManager = true
      this.managerId = record.id
      this.$nextTick(() => {
        let area = []
        area[0] = record.province_id
        area[1] = record.city_id || ''
        area[2] = record.area_id || ''
        this.managerInfo.setFieldsValue({
          name: record.manager_name,
          uid: record.phone,
          note: record.note || '',
          area: area,
          invitation_code: record.invitation_code,
        })
      })
    },

    editSaveManagerInfo(values) {
      console.log('提交编辑信息', values)
      values.id = this.managerId
      this.request(marketingPlatformApi.editManager, values).then((res) => {
        this.$message.success('编辑成功！', 1)
        this.showEditManager = false
        this.getList()
      })
    },

    // 提交业务经理信息
    saveManagerInfo(e) {
      e.preventDefault()
      this.managerInfo.validateFields((err, values) => {
        if (!err) {
          if (!this.isAdd) {
            this.editSaveManagerInfo(values)
            return
          }
          values.province_id = values.area[0] || ''
          values.city_id = values.area[1] || ''
          values.area_id = values.area[2] || ''

          this.request(marketingPlatformApi.addManager, values).then((res) => {
            this.$message.success('添加成功！', 1)
            this.showEditManager = false
            this.getList()
          })
        } else {
          // console.log('submit!', err);
          for (let key in err) {
            this.$message.error(err[key].errors[0].message)
            break
          }
        }
      })
    },
    showHandle(key) {
      this[key] = !this[key]
    },
    changeSearchArea(val) {
      this.searchArea = [val[0], val[1], val[2]]
    },

    // 获取业务经理页面信息
    getList(update = false, param) {
      if (update) {
        this.$set(this.pagination, 'current', 1)
      }
      let params = {
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        ...param,
      }
      this.request(marketingPlatformApi.getManagerList, params).then((res) => {
        this.areaList = res.areaList
        this.areaUser = res.area_user
        this.managerList = res.list.data || []
        this.noTeamManagerList = res.manager_list
        this.teamList = res.team_list
        this.$set(this.pagination, 'total', res.list.total || 0)
      })
    },

    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.getList()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)
      this.$set(this.pagination, 'current', 1)
      this.getList()
    },

    // 获取业务接收成员列表
    getMemberList(id) {
      this.request(marketingPlatformApi.getTeamMemberList, { id }).then((res) => {
        this.memberList = res.person
      })
    },
  },
}
</script>
<style scoped >
.disabled-input,
>>> .ant-input[disabled] {
  border: none;
  color: #000;
  background: #fff !important;
  cursor: auto;
}

.disabled-input.area >>> input {
  border: none !important;
  cursor: auto !important;
}
.disabled-input.area >>> i {
  display: none !important;
}
.disabled-input.textarea {
  resize: none;
  margin-top: 6px;
}
</style>