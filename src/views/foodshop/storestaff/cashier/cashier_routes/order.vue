<template>
  <div class="order_wrapper pt-20 pb-20">
    <div v-if="loading" class="loading"><a-spin size="large" /></div>
    <div class="order" v-else>
      <a-tabs @change="tabChange" :activeKey="orderType">
        <a-tab-pane v-for="orderType of orderTypes" :key="orderType.key" :tab="orderType.value">
          <!-- 预订单 -->
          <div v-if="orderType.key == 1">
            <!-- 二级筛选 -->
            <div class="flex align-center">
              <div class="w-100 mr-20">{{ L('预约到店时间') }}：</div>
              <div class="flex-1">
                <a-checkable-tag
                  v-for="orderTime in orderTimes"
                  :key="orderTime.key"
                  :checked="orderTime.checked"
                  @change="(checked) => setChecked(orderTimes, 'orderTime', orderTime.key)"
                  style="cursor: pointer"
                >
                  {{ orderTime.value }}
                </a-checkable-tag>
              </div>
            </div>
          </div>
          <!-- 堂食单 -->
          <div v-if="orderType.key == 2">
            <div class="flex align-center">
              <div class="w-100 mr-20">{{ L('订单状态') }}：</div>
              <div class="flex-1">
                <a-checkable-tag
                  v-for="orderStatus in orderStatuss"
                  :key="orderStatus.key"
                  :checked="orderStatus.checked"
                  @change="(checked) => setChecked(orderStatuss, 'orderStatus', orderStatus.key)"
                  style="cursor: pointer"
                >
                  {{ orderStatus.value }}
                </a-checkable-tag>
              </div>
            </div>
            <div class="flex align-center">
              <div class="w-100 mr-20 mt-10">{{ L('订单来源') }}：</div>
              <div class="flex-1">
                <a-checkable-tag
                  v-for="orderFrom in orderFroms"
                  :key="orderFrom.key"
                  :checked="orderFrom.checked"
                  @change="(checked) => setChecked(orderFroms, 'orderFrom', orderFrom.key)"
                  style="cursor: pointer"
                >
                  {{ orderFrom.value }}
                </a-checkable-tag>
              </div>
            </div>
          </div>
          <!-- 订单列表 (共用)-->
          <div v-if="orderList.length">
            <div class="order-list scroll_content mt-20" :style="'height:' + listHeight + 'px'">
              <order-item
                v-for="(order, orderIndex) of orderList"
                :key="order.order_id"
                :order="order"
                :index="orderIndex"
                @change="handleOrderItemChange"
              />
            </div>
            <div class="mt-10 text-right">
              <a-pagination v-model="page" :page-size.sync="pageSize" :total="total" @change="pageChange" />
            </div>
          </div>
          <div v-else class="mt-50 text-center cr-99 fs-16">{{ dataTips }}</div>
        </a-tab-pane>
        <div slot="tabBarExtraContent" class="w-400 search-order">
          <a-input-search
            :placeholder="L('请输入订单号、手机号、桌号、昵称')"
            allow-clear
            enter-button
            @search="onSearch"
          />
        </div>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import OrderItem from '../components/orderItem.vue'
export default {
  components: { OrderItem },
  props: {
    refresh: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // 筛选栏
      orderTypes: [], //一级筛选
      orderType: null,
      orderTimes: [], // 预订单二级筛选 预约到店时间
      orderTime: null,
      orderStatuss: [], // 堂食单二级筛选 订单状态
      orderStatus: null,
      orderFroms: [], // 堂食单三级筛选 订单来源
      orderFrom: null,
      keywords: '',
      // 订单列表
      orderList: [],
      orderListHeight: 0,
      dataTips: '',
      // 分页
      page: 1,
      pageSize: 10,
      total: 0,
      loading: true,
    }
  },
  watch: {
    refresh(val) {
      this.orderType = null
      this.orderTime = null
      this.orderStatus = null
      this.orderFrom = null
      this.getFilterData()
    },
  },
  mounted() {
    this.$emit('getcurrent', 'order')
    this.$nextTick(() => {
      this.init()
      // 监听窗口缩放
      window.onresize = () => {
        this.timer = setTimeout(() => {
          this.init()
        }, 600)
      }
    })
    if (this.$store.state.storestaff.orderPageState == 'nomarlCode') {
      this.orderType = 2
      this.orderFrom = 3
      this.$store.commit('changeorderPageState', '')
    }
    this.getFilterData()
  },
  computed: {
    listHeight() {
      if (this.orderType == 1) {
        return this.orderListHeight
      } else if (this.orderType == 2) {
        return this.orderListHeight - 30
      }
    },
  },
  methods: {
    init() {
      this.orderListHeight = document.body.clientHeight - 200
    },
    // 获取筛选值
    getFilterData() {
      this.loading = true
      this.request('/foodshop/storestaff.order/searchCondition').then((res) => {
        if (res.type && res.type.length) {
          this.orderTypes = res.type
          if (this.orderType == null) {
            this.orderType = res.type[0].key
          }
        }
        this.setChecked(res.order_time, 'orderTime', this.orderTime)
        this.setChecked(res.order_status, 'orderStatus', this.orderStatus)
        this.setChecked(res.order_source, 'orderFrom', this.orderFrom)
        this.getOrderList()
        this.loading = false
      })
    },
    //select = null 表示默认选中第一个
    setChecked(list = [], type, select) {
      if (!list || !list.length) {
        return
      }
      let key = select
      list.forEach((el, index) => {
        el.checked = false
        if (select == el.key) {
          el.checked = true
        }
      })
      if (list.length && key == null) {
        // 默认选中第一个
        key = list[0].key
        list[0].checked = true
      }
      switch (type) {
        case 'orderTime':
          this.orderTimes = list
          this.orderTime = key
          break
        case 'orderFrom':
          this.orderFroms = list
          this.orderFrom = key
          break
        case 'orderStatus':
          this.orderStatuss = list
          this.orderStatus = key
          break
      }
      if (select != null) {
        this.page = 1
        this.getOrderList()
      }
    },
    // 获取订单列表
    getOrderList() {
      this.dataTips = '正在加载...'
      let params = {
        type: this.orderType,
        keywords: this.keywords,
        page: this.page,
        pageSize: this.pageSize,
      }
      if (this.orderType == 1) {
        // 预订单
        params.order_time = this.orderTime
      } else if (this.orderType == 2) {
        // 堂食单
        params.order_status = this.orderStatus
        params.order_source = this.orderFrom
      }
      this.orderList = []
      this.request('/foodshop/storestaff.order/operateOrderList', params).then((res) => {
        if (res.list && res.list.length) {
          this.dataTips = ''
          this.orderList = res.list
          this.total = res.total
        } else {
          this.dataTips = this.L('暂无数据')
        }
      })
    },
    // 切换一级菜单
    tabChange(key) {
      this.orderType = key
      this.page = 1
      this.getOrderList()
    },
    // 搜索订单
    onSearch(value) {
      this.keywords = value
      this.page = 1
      this.getOrderList()
    },
    pageChange(page, pageSize) {
      this.page = page
      this.getOrderList()
    },
    // 订单项改变
    handleOrderItemChange(e) {
      if (e.type == 'refresh') {
        this.getFilterData()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.order_wrapper {
  width: 100%;
  height: 100%;
  padding-left: 120px;
  padding-right: 120px;
  background-color: #ffffff;
  // background-color: #f7f7f7;
  overflow: hidden;
  .order-list {
    padding-bottom: 30px;
    overflow-y: scroll;
  }
}
.search-order /deep/ .ant-input-group-addon {
  padding: 0;
  border: 0;
}
.loading {
  text-align: center;
  margin-top: 100px;
}
</style>
