<template>
  <div class="mt-10 mb-10">
        <div class="main-box-content">
            <a-form layout="inline">
                <a-form-item :label="L('城市区域') + '：'" v-if="isSystem">
                  <area-Search ref="areaSearchModal" @handleSelect="handleSelect" :key="id" />
                </a-form-item>
                <a-form-item :label="L('下单时间') + '：'">
                  <a-range-picker
                    @change="dateOnChange"
                    :ranges="pickerRanges"
                    :allowClear="true"
                    v-model="search_data"
                    style
                  >
                    <a-icon slot="suffixIcon" type="calendar" />
                  </a-range-picker>
                </a-form-item>
                <a-form-item :label="L('手动搜索') + '：'">
                  <a-input-group compact>
                    <a-select style="width: 110px" default-value="queryParam.searchtype" v-model="queryParam.searchtype">
                      <a-select-option :value="item.key" :key="item.key" v-for="item in search_keyword">{{
                        item.value
                        }}</a-select-option>
                    </a-select>
                    <a-input style="width: 235px" allow-clear v-model="queryParam.keyword" />
                  </a-input-group>
                </a-form-item>
                <div class="mt-20" v-if="isSystem">
                    <a-button type="primary" icon="search" @click="searchBtn()" style="margin-right: 15px">{{L('查询')}}</a-button>
                    <a-button icon="download" @click="$refs.ExportAddModal.exports()">{{ L('导出订单') }}</a-button>
                </div>
                <a-form-item label="" v-else>
                  <a-button type="primary" icon="search" @click="searchBtn()" style="margin-right: 15px">{{L('查询')}}</a-button>
                  <a-button icon="download" @click="$refs.ExportAddModal.exports()">{{ L('导出订单') }}</a-button>
                </a-form-item>
          </a-form>
        </div>

        <div class="main-box-content">
          <div v-show="statisticsData">
          <a-card>
            <a-row type="flex" justify="space-around" align="middle">
              <a-col v-for="item in statisticsOptions" :key="item.prop">
                <a-row>
                  <a-col class="text-center pointer">
                    <a-tooltip>
                      <template slot="title">
                        {{ item.desc }}
                      </template>
                      {{ item.title }}
                      <a-icon type="exclamation-circle"/>
                    </a-tooltip>
                  </a-col>
                  <a-col class="text-center">
                    <span class="statisticsData"> {{ statisticsData[item.prop] || 0 }}{{ item.unit }} </span>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-card>
        </div>

        <div>
          <a-tabs default-active-key="0" @change="statusChange">
            <a-tab-pane key="0" :tab="L('全部')"></a-tab-pane>
            <a-tab-pane key="1" :tab="L('待支付')" force-render></a-tab-pane>
            <a-tab-pane key="2" :tab="L('待落座')"></a-tab-pane>
            <a-tab-pane key="3" :tab="L('就餐中')"></a-tab-pane>
            <a-tab-pane key="4" :tab="L('已完成')"></a-tab-pane>
            <a-tab-pane key="5" :tab="L('已取消')"></a-tab-pane>
          </a-tabs>
        </div>
        <a-table
          :columns="columns"
          :data-source="data"
          class="components-table-demo-nested"
          :pagination="pagination"
          @change="tableChange"
          rowKey="order_id"
          :loading="loading"
        >
          <span slot="order_status" slot-scope="text, record">
            <a-badge :status="record.order_status | statusFilter" :text="text" />
          </span>
          <span slot="phone" slot-scope="text, record">
            {{ text ? text : record.user_phone }}
          </span>
          <a slot="action" slot-scope="text, record" @click="look(record)">{{ L('查看') }}</a>
        </a-table>
        </div>
        <a-drawer
          width="520"
          :title="L('订单详情')"
          placement="right"
          :closable="false"
          :visible="visible"
          @after-visible-change="afterVisibleChange"
          @close="onClose"
          class="detail-content"
        >
          <order-detail ref="OrderDetailModal" :detail="detail" :isSystem="isSystem" />
        </a-drawer>
      <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="queryParam" />
  </div>
</template>

<script>
import moment from 'moment'
import foodshopPlatformApi from '@/api/foodshop/platform'
import foodshopMerchantApi from '@/api/foodshop/merchant'
import AreaSearch from '@/views/common/area/AreaSearch.vue'
import OrderDetail from '../modules/OrderDetail.vue'
import ExportAdd from '@/views/common/export/ExportAdd.vue'
// $refs.OrderDetailModal.getOrderDetail(orderId)
const data = []

const statusMap = ['error', 'error', 'error', 'processing', 'success', 'default', 'processing', 'processing']
export default {
  name: 'OrderList',
  components: {
    AreaSearch,
    OrderDetail,
    ExportAdd,
  },
  data() {
    this.cacheData = data.map((item) => ({ ...item }))
    return {
      form: this.$form.createForm(this),
      mdl: {},
      visible: false,
      loading: true,
      statusMap,
      id: 1,
      timeTab: '',
      orderId: 0,
      detail: {}, //订单详情
      search_data: [],
      exportUrl: foodshopPlatformApi.orderExportUrl,
      search_keyword: [
        {
          key: 'real_orderid',
          value: this.L('订单编号'),
        },
        {
          key: 'third_id',
          value: this.L('流水号'),
        },
        {
          key: 'store_name',
          value: this.L('店铺名称'),
        },
        {
          key: 'merchant_name',
          value: this.L('商家名称'),
        },
        {
          key: 'username',
          value: this.L('下单人'),
        },
        {
          key: 'phone',
          value: this.L('下单人电话'),
        },
      ],

      search_payType: [
        {
          key: 'all',
          value: this.L('全部'),
        },
        {
          key: 'wechat',
          value: this.L('微信支付'),
        },
        {
          key: 'alipay',
          value: this.L('支付宝支付'),
        },
        {
          key: 'balance',
          value: this.L('余额支付'),
        },
      ],
      statisticsOptions: [
        {
          title: '订单总额',
          desc: '订单总金额',
          prop: 'total_price',
          unit: '元',
        },
        {
          title: '实际支付总额',
          desc: '实际支付总金额',
          prop: 'price',
          unit: '元',
        },
          {
              title: '线下支付总额',
              desc: '线下支付总额包含订单线下支付金额之和',
              prop: 'offline_money',
              unit: '元',
          },
          {
              title: '线上支付总额',
              desc: '线上支付总额包括在线支付的金额、平台余额支付金额、商家余额支付金额、商家赠送余额支付金额和企业预存款余额支付金额，去除退款金额',
              prop: 'online_money',
              unit: '元',
          },
          {
              title: '平台余额支付总额',
              desc: '平台余额支付总金额',
              prop: 'system_balance',
              unit: '元',
          },
          {
              title: '商家余额支付总额',
              desc: '商家余额支付总金额',
              prop: 'balance_merchant',
              unit: '元',
          },
          {
              title: '优惠总额',
              desc: '优惠总额',
              prop: 'discount_money',
              unit: '元',
          },
      ],
      statisticsData: '',
      // 查询参数
      queryParam: {
        searchtype: 'real_orderid',
        payType:'all'
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 10,
        'show-total': (total) => this.L(`共 X1 条记录`, { X1: total }),
        'show-size-changer': true,
        'show-quick-jumper': true,
      },
      // 表头
      columns: [
        {
          title: this.L('订单编号'),
          width: 120,
          dataIndex: 'real_orderid',
        },
        {
          title: this.L('订单总额'),
          width: 120,
          dataIndex: 'total_price',
          sorter: (a, b) => a.total_price - b.total_price,
        },
        {
          title: this.L('实际支付'),
          width: 120,
          dataIndex: 'pay_price',
          sorter: (a, b) => a.pay_price - b.pay_price,
        },
        {
          title: this.L('线下支付'),
          width: '12%',
          dataIndex: 'offline_money',
          sorter: (a, b) => a.offline_money - b.offline_money
        },
        {
          title: this.L('所属门店'),
          width: 120,
          dataIndex: 'store_mer_name',
        },
        {
          title: this.L('下单人'),
          width: 120,
          dataIndex: 'username',
          // scopedSlots: { customRender: 'marchant_name' }
        },
        {
          title: this.L('下单人电话'),
          width: 120,
          dataIndex: 'phone',
          scopedSlots: { customRender: 'phone' },
        },
        {
          title: this.L('下单时间'),
          width: 120,
          dataIndex: 'create_time',
          sorter: (a, b) => a.create_time_s - b.create_time_s,
        },
        {
          title: this.L('订单状态'),
          width: 120,
          dataIndex: 'order_status_txt',
          scopedSlots: {
            customRender: 'order_status',
          },
          sorter: (a, b) => a.order_status - b.order_status,
        },
        {
          title: this.L('桌台号'),
          width: 120,
          dataIndex: 'table_id',
          scopedSlots: { customRender: 'table_id' },
        },
        {
          title: this.L('支付方式'),
          width: 120,
          dataIndex: 'pay_type_txt',
          scopedSlots: { customRender: 'pay_type_txt' },
        },
        {
          title: this.L('操作'),
          dataIndex: 'action',
          width: '220px',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      data,
      isShow: 1,
      store_id: 0,
      isSystem: 0,
      orderListUrl: '',
      orderDetailUrl: foodshopPlatformApi.orderDetail,
      pickerRanges: {},
    }
  },

  watch: {
    $route() {
      console.log('watch')
      if (typeof this.$route.query.store_id != 'undefined') {
        this.queryParam.store_id = this.$route.query.store_id
      }
      this.initList()
    },
  },
  created() {
    console.log('created')
    console.log(typeof this.$route.query.store_id)

    this.pickerRanges[this.L('今日')] = [moment(), moment()]
    this.pickerRanges[this.L('昨日')] = [moment().subtract(1, 'days'), moment().subtract(1, 'days')]
    this.pickerRanges[this.L('近七天')] = [moment().subtract(7, 'days'), moment()]
    this.pickerRanges[this.L('近30天')] = [moment().subtract(30, 'days'), moment()]
  },
  filters: {
    statusFilter(type) {
      const statusMap = ['error', 'error', 'error', 'processing', 'success', 'default', 'error', 'processing']
      return statusMap[type]
    },
  },
  mounted() {
    console.log(this.$route.query.store_id, 'this.$route.query.store_id')
    if (typeof this.$route.query.store_id != 'undefined') {
      this.queryParam.store_id = this.$route.query.store_id
      this.orderListUrl = foodshopMerchantApi.orderList
      this.orderDetailUrl = foodshopMerchantApi.orderDetail
      this.exportUrl = foodshopMerchantApi.orderExportUrl
      this.isSystem = 0
    } else {
      this.orderListUrl = foodshopPlatformApi.orderList
      this.orderDetailUrl = foodshopPlatformApi.orderDetail
      this.exportUrl = foodshopPlatformApi.orderExportUrl
      this.queryParam.store_id = 0
      this.isSystem = 1
    }
    console.log('mounted')
    console.log(this.orderDetailUrl)
    this.initList()
  },
  methods: {
    moment,
    // 点击查询按钮
    searchBtn() {
      this.page = 1
      this.pagination.current = this.page
      this.getOrderList()
    },

    // 获取列表信息
    initList() {
      //默认查询7天的订单数据
      this.search_data = [moment().subtract(7, 'days'), moment()]
      this.queryParam.start_time = moment().subtract(7, 'days').format('YYYY-MM-DD')
      this.queryParam.end_time = moment().format('YYYY-MM-DD')

      this.getOrderList()
    },
    // 获取列表信息
    getOrderList() {
      this.queryParam['page'] = this.page
      console.log(this.orderListUrl)
      this.loading = true
      if (this.orderListUrl) {
        this.request(this.orderListUrl, this.queryParam).then((res) => {
          this.loading = false
          this.data = res.list
          this.statisticsData = res.statistics_data
          this.pagination.total = res.total
        })
      }
    },
    // 订单详情
    getOrderDetail() {
      console.log(this.orderDetailUrl)
      if (this.orderDetailUrl) {
        this.request(this.orderDetailUrl, { order_id: this.orderId }).then((res) => {
          this.detail = res
          this.detail.order_status_show = this.statusMap[this.detail.order.order_status]
        })
      }
    },
    //导出订单
    exportOrder() {},
    // 切换状态
    statusChange(key) {
      // console.log(key)
      this.queryParam.order_status = key
      this.page = 1
      this.pagination.current = this.page

      this.getOrderList()
    },
    //城市搜索内容
    handleSelect(area) {
      this.queryParam.city_id = area.cityId
      this.queryParam.province_id = area.provinceId
      this.queryParam.area_id = area.areaId
    },
    // 日期切换，重新赋值
    dateOnChange(date, dateString) {
      this.queryParam.start_time = dateString[0]
      this.queryParam.end_time = dateString[1]
      // console.log('search_data', this.search_data)
    },
    // 表格中变动  这里只针对页面页数切换
    tableChange(e) {
      this.queryParam['pageSize'] = e.pageSize
      if (e.current && e.current > 0) {
        this.pagination.current = e.current
        this.page = e.current
        this.getOrderList()
      }
    },
    // 查看详情  触发右侧抽屉弹出
    look(e) {
      this.visible = true
      this.orderId = e.order_id
      // this.getMessageSuggestionsDetail(e.suggestions_id)
      this.getOrderDetail()
    },
    afterVisibleChange(val) {},
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
  },
}
</script>

<style scoped>
.detail-content >>> .ant-drawer-body {
  padding: 0;
}
.ant-table td {
  white-space: nowrap;
}
</style>
