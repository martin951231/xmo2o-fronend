<template>
  <div v-if="isShow">
    <a-card :bordered="false">
      <a-form-model
        layout="inline"
        ref="searchForm"
        :form="searchInfo"
        style="margin-bottom: 30px"
        :labelCol="{ span: 6 }"
      >
        <a-row :gutter="24">
          <a-col :span="9">
            <a-form-model-item label="选择成员" style="width: 100%">
              <div style="white-space: nowrap">
                <a-select class="select" v-model="searchInfo.memberType">
                  <a-select-option v-for="(item, index) in select_person" :key="index"
                    >{{ item.name }}
                  </a-select-option>
                </a-select>
                <a-cascader
                  class="cascader"
                  placeholder="请选择"
                  :allowClear="true"
                  :options="select_person[searchInfo.memberType].value"
                  v-model="searchInfo.member"
                />
              </div>
            </a-form-model-item>
          </a-col>
          <a-col :span="9">
            <a-form-model-item label="离职成员" style="width: 100%">
              <div style="white-space: nowrap">
                <a-select class="select" v-model="searchInfo.quitType">
                  <a-select-option v-for="(item, index) in quit_person" :key="index">{{ item.name }} </a-select-option>
                </a-select>
                <a-cascader
                  class="cascader"
                  placeholder="请选择"
                  :allowClear="true"
                  :options="quit_person[searchInfo.quitType].value"
                  v-model="searchInfo.quitMember"
                />
              </div>
            </a-form-model-item>
          </a-col>
          <a-col :span="6" style="text-align: right">
            <a-form-model-item>
              <a-button type="primary" htmlType="submit" @click="searchHandle">查询</a-button>
            </a-form-model-item>

            <a-form-model-item>
              <a-button @click="clearSearch">重置</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :span="9">
            <a-form-model-item label="人员姓名" style="margin-top: 20px; width: 100%">
              <a-input style="width: 300px" placeholder="请输入姓名" :allowClear="true" v-model="searchInfo.name" />
            </a-form-model-item>
          </a-col>
          <a-col :span="9">
            <a-form-model-item label="下单时间" style="margin-top: 20px; width: 100%">
              <a-range-picker
                style="width: 300px"
                :ranges="{
                  过去30天: [moment().subtract(30, 'days'), moment()],
                  过去15天: [moment().subtract(15, 'days'), moment()],
                  过去7天: [moment().subtract(7, 'days'), moment()],
                  今日: [moment(), moment()],
                }"
                format="YYYY-MM-DD"
                v-model="searchInfo.time"
              >
                <a-icon slot="suffixIcon" type="calendar" />
              </a-range-picker>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="9">
            <a-form-model-item label="订单类型" style="margin-top: 20px; width: 100%">
              <a-select
                class="select"
                placeholder="请选择订单类型"
                style="width: 200px"
                v-model="searchInfo.order_type"
              >
                <a-select-option v-for="item in order_type" :key="item.value">{{ item.label }} </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="9">
            <a-form-model-item label="订单业务" style="margin-top: 20px; width: 100%">
              <a-select
                class="select"
                placeholder="请选择订单业务"
                style="width: 200px"
                v-model="searchInfo.order_business"
              >
                <a-select-option v-for="item in order_business" :key="item.value">{{ item.label }} </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

      <a-row
        type="flex"
        justify="space-around"
        align="middle"
        style="box-shadow: 2px 2px 10px 2px #eee; text-align: center; padding: 15px 0; border-radius: 5px"
        v-show="showMemberInfo.member_name"
      >
        <a-col :flex="1">
          <statistic class="relative" :value="showMemberInfo.member_name">
            <template slot="title">
              <span>{{ showMemberInfo.identity_show }}</span>
            </template>
            <template #suffix>
              <span class="absolute tag" v-show="showMemberInfo.is_del == 1">已离职</span>
            </template>
          </statistic>
        </a-col>
        <a-col>
          <a-divider type="vertical" style="height: 45px" />
        </a-col>

        <a-col :flex="1" v-show="showMemberInfo.achievement_tip">
          <statistic :value="showMemberInfo.achievement">
            <template slot="title">
              <span>{{ showMemberInfo.achievement_name }}</span>
              <a-tooltip placement="top" :title="showMemberInfo.achievement_tip" style="margin-left: 2px">
                <a-icon type="exclamation-circle" />
              </a-tooltip>
            </template>
          </statistic>
        </a-col>
        <a-col v-show="showMemberInfo.achievement_tip">
          <a-divider type="vertical" style="height: 45px" />
        </a-col>

        <a-col v-show="showMemberInfo.team_achievement_tip">
          <statistic :value="showMemberInfo.team_achievement">
            <template slot="title">
              <span>团队总业绩</span>
              <a-tooltip placement="top" :title="showMemberInfo.team_achievement_tip" style="margin-left: 2px">
                <a-icon type="exclamation-circle" />
              </a-tooltip>
            </template>
          </statistic>
        </a-col>
        <a-col v-show="showMemberInfo.team_achievement_tip">
          <a-divider type="vertical" style="height: 45px" />
        </a-col>

        <a-col v-show="showMemberInfo.area_team_achievement_tip">
          <statistic :value="showMemberInfo.area_team_achievement">
            <template slot="title">
              <span>区域团队总业绩</span>
              <a-tooltip placement="top" :title="showMemberInfo.area_team_achievement_tip" style="margin-left: 2px">
                <a-icon type="exclamation-circle" />
              </a-tooltip>
            </template>
          </statistic>
        </a-col>
        <a-col v-show="showMemberInfo.area_team_achievement_tip">
          <a-divider type="vertical" style="height: 45px" />
        </a-col>

        <a-col>
          <statistic :value="showMemberInfo.commission">
            <template slot="title">
              <span>总提成</span>
              <a-tooltip placement="top" :title="showMemberInfo.commission_tip" style="margin-left: 2px">
                <a-icon type="exclamation-circle" />
              </a-tooltip>
            </template>
          </statistic>
        </a-col>
      </a-row>
    </a-card>

    <div class="bg-ff"></div>

    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :data-source="orderList"
        rowKey="order_id"
        :pagination="pagination"
        style="min-height: 700px"
      >
        <span slot="order_business" slot-scope="text">
          {{text == 0 ? '店铺' : '社区'}}
        </span>
        <span slot="order_type" slot-scope="text">
          {{text == 0 ? '新订单' : '续费订单'}}
        </span>
        <span slot="action" slot-scope="text, record">
          <a href="javascript:;" @click="orderShowHandle(record)">查看详情</a>
        </span>
      </a-table>
    </a-card>

    <!-- 订单详情 -->
    <a-drawer
      v-if="orderVisible"
      width="60%"
      title="订单详情"
      placement="right"
      :closable="false"
      :visible="orderVisible"
      @close="orderVisible = false"
    >
      <OrderDetail :orderId="orderId"></OrderDetail>
    </a-drawer>
  </div>
</template>
<script>
import moment from 'moment'
import { statistic } from 'ant-design-vue'
import OrderDetail from '@/views/new_marketing/platform/modules/OrderDetail'
import marketingPlatformApi from '@/api/new_marketing/platform/index'

export default {
  name: 'MarketingArtisanList',
  components: {
    OrderDetail,
    statistic,
  },
  data() {
    return {
      // 表头
      columns: [
        {
          title: '订单编号',
          dataIndex: 'orderid',
          align: 'center',
          key: '',
        },
        {
          title: '商家/物业名称',
          dataIndex: 'merchant_name',
          align: 'center',
        },
        {
          title: '订单业务',
          dataIndex: 'order_business',
          align: 'center',
          scopedSlots: { customRender: 'order_business' },
        },
        {
          title: '下单店铺/套餐',
          dataIndex: 'store_name',
          align: 'center',
        },
        {
          title: '订单总金额',
          dataIndex: 'total_price',
          align: 'center',
        },
        {
          title: '业务员',
          dataIndex: 'member_name',
          align: 'center',
        },
        {
          title: '订购数量',
          dataIndex: 'buy_num',
          align: 'center',
        },
        {
          title: '店铺数量',
          dataIndex: 'store_num',
          align: 'center',
        },
        {
          title: '订单类型',
          dataIndex: 'order_type',
          align: 'center',
          scopedSlots: { customRender: 'order_type' },
        },
        {
          title: '支付时间',
          dataIndex: 'pay_time',
          sorter: true,
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
      orderId: '', // 订单id
      orderVisible: false, // 显示订单详情
      orderList: [],
      searchInfo: {
        name: '',
        member: [],
        memberType: 0,
        quitMember: [],
        quitType: 0,
        order_type: -1,
        order_business: -1,
        time: [],

        start_time: '',
        end_time: '',
        member_type: 0,
      }, // 搜索参数

      select_person: {}, // 选择成员
      quit_person: {}, // 离职成员
      isShow: false,
      showMemberInfo: {}, // 展示的人员信息
    }
  },
  watch: {
    'searchInfo.quitType': {
      immediate: true,
      handler: function (newVal, oldVal) {
        console.log('离职成员类型', newVal, oldVal)
        // if (newVal != oldVal) {
        //   console.log('11111111111')
        //   this.searchInfo.quitMember = ''
        // }
      },
    },
  },
  created() {
    this.getSearchData()
    this.searchInfo.time = [this.moment().startOf('month'), this.moment()]
    this.searchHandle()
  },
  mounted() {},
  methods: {
    moment,

    getSearchData() {
      this.request(marketingPlatformApi.getCommissionSearchData).then((res) => {
        this.select_person = res.select_person
        this.quit_person = res.quit_person
        this.order_business = res.order_business
        this.order_type = res.order_type
        this.isShow = true
      })
    },

    getSearchList() {
      this.request(marketingPlatformApi.getCommissionList)
    },

    // 查看订单详情
    orderShowHandle(record) {
      this.orderId = record.order_id
      this.orderVisible = true
    },

    searchHandle(e) {
      e && e.preventDefault()
      // console.log('搜索参数', this.searchInfo)
      let params = this.searchInfo
      if (params.time.length > 0) {
        params.start_time = params.time[0].format('YYYY-MM-DD')
        params.end_time = params.time[1].format('YYYY-MM-DD')
      } else {
        params.start_time = ''
        params.end_time = ''
      }

      params = JSON.parse(JSON.stringify(this.searchInfo))
      if (params.member.length == 0) {
        params.member = ''
      } else if (params.member.length == 1) {
        params.member = params.member[0]
      } else {
        params.member = params.member[1]
      }
      params.quitMember.length > 0 ? params.quitMember = params.quitMember[0] : ''
      params.member_type = params.member ? params.memberType : params.quitType
      params.page = this.pagination.current
      params.pageSize = this.pagination.pageSize
      // console.log('搜索参数处理后', params)
      this.request(marketingPlatformApi.getCommissionList, params).then((res) => {
        // console.log('搜索结果', res)
        this.orderList = res.data || []
        this.$set(this.pagination, 'total', res.total || 0)
        let {
          member_name = '', // 名(为空时页面不展示)
          achievement = 0, // 总业绩
          commission = 0, // 时间区域内总提成
          identity = 1, // 身份：1=业务员,2=业务经理,3=区域代理,4=区域代理兼业务经理身份,5=技术员,6=技术主管
          team_achievement = 0, // 团队总业绩(业务经理)
          area_team_achievement = 0, // 总区域团队业绩(区域代理)
          is_del = 0, // 是否离职:0=否,1=是
        } = res
        let identity_show = '',
          achievement_name = '',
          achievement_tip = '',
          team_achievement_tip = '',
          area_team_achievement_tip = '',
          commission_tip = ''
        switch (identity) {
          case 1:
            identity_show = '业务员'
            achievement_name = '业绩总额'
            achievement_tip = '该业务员的业绩总金额'
            commission_tip = '该业务员的订单总提成'
            break
          case 2:
            identity_show = '业务经理'
            achievement_name = '个人总业绩'
            achievement_tip = '该业务经理个人业绩总金额'
            team_achievement_tip = '该业务经理团队所有成员的业绩总金额'
            commission_tip = '该业务经理（包含团队抽成以及个人业绩抽成）提成总和'
            break
          case 3:
            identity_show = '区域代理'
            area_team_achievement_tip = '该区域代理绑定的所有下级团队业绩总金额'
            commission_tip = '该区域代理 绑定的所有下级团队的总抽成'
            break
          case 4:
            identity_show = '区域代理'
            achievement_name = '个人总业绩'
            achievement_tip = '该区域代理在业务经理身份下的个人业绩总金额'
            team_achievement_tip = '该区域代理绑定的所有下级团队业绩总金额'
            area_team_achievement_tip = '该区域代理 绑定的所有下级团队业绩总金额'
            commission_tip = '该区域代理所有身份（业务经理）下的抽成总和'
            break
          case 5:
            identity_show = '技术员'
            commission_tip = '该技术人员抽取所属团队总订单的总抽成'
            break
          case 6:
            identity_show = '技术主管'
            commission_tip = '该技术主管抽取的总提成（技术人员抽成+技术主管抽成）'
        }

        this.showMemberInfo = {
          member_name,
          achievement,
          commission,
          identity,
          identity_show,
          team_achievement,
          area_team_achievement,
          is_del,
          achievement_name,
          achievement_tip,
          team_achievement_tip,
          area_team_achievement_tip,
          commission_tip,
        }
      })
    },

    // 重置
    clearSearch() {
      this.searchInfo = this.$options.data().searchInfo
      this.orderList = []
      this.$set(this.pagination, 'current', 1)
      this.searchInfo.time = [this.moment().startOf('month'), this.moment()]
      this.searchHandle()
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.searchHandle()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)
      this.$set(this.pagination, 'current', 1)
      this.searchHandle()
    },
  },
}
</script>
<style scoped lang="less">
.select {
  width: 100px;
  border-radius: 2px 0 0 2px;
  /deep/ .ant-select-selection {
    border-radius: 2px 0 0 2px;
  }
}

.cascader {
  width: 200px;
  border-radius: 0 2px 2px 0;
  /deep/ input {
    border-left: none;
    border-radius: 0 2px 2px 0;
  }
}

.select-right {
  width: 200px;
  border-radius: 0 2px 2px 0;
  /deep/ .ant-select-selection {
    border-left: none;
    border-radius: 0 2px 2px 0;
  }
}

.tag {
  background: rgba(24, 144, 255, 0.3);
  color: #1890ff;
  font-size: 12px;
  border-radius: 9px;
  padding: 0 6px;
  top: 20px;
  white-space: nowrap;
}
</style>