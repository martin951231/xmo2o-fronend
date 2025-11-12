<template>
  <a-card :bordered="false" class="marketing-order-info">
    <!-- search box -->
    <a-form-model :model="searchForm" v-bind="searchFormLayout">
      <a-row>
        <a-col :span="9">
          <a-form-model-item label="区域">
            <a-cascader :options="areaList" placeholder="请选择区域" v-model="selectArea" />
          </a-form-model-item>
        </a-col>
        <a-col :span="4">
          <a-form-model-item label="">
            <a-select
              v-model="searchForm.area_uid"
              @select="onAreaPersonSelect"
              placeholder="请选择区域代理人"
              style="width: 110%"
            >
              <a-select-option v-for="item of areaPersonList" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="5">
          <a-form-model-item label="">
            <a-select v-model="searchForm.team_id" placeholder="请选择区域团队">
              <a-select-option v-for="item of teamList" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
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
          <a-form-model-item label="手动搜索">
            <a-input-group compact>
              <a-select v-model="contentType" style="width: 30%" @select="handleContentTypeChange">
                <a-select-option value="1"> 订单编号 </a-select-option>
                <a-select-option value="2"> 商家名称 </a-select-option>
                <a-select-option value="5"> 物业名称 </a-select-option>
                <a-select-option value="3"> 团队名称 </a-select-option>
                <a-select-option value="4"> 业务员名称 </a-select-option>
              </a-select>
              <a-input style="width: 70%" v-model="content" @change="handleInputChange" placeholder="请输入搜索内容" />
            </a-input-group>
          </a-form-model-item>
        </a-col>
        <a-col :span="9">
          <a-form-model-item label="下单时间">
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
        <a-col :span="6"> </a-col>
      </a-row>

      <a-row>
        <a-col :span="9">
          <a-form-model-item label="订单类型">
            <a-select v-model="searchForm.type" placeholder="请选择订单类型">
              <a-select-option :value="0"> 新订单 </a-select-option>
              <a-select-option :value="1"> 续费订单 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="9">
          <a-form-model-item label="订单业务">
            <a-select v-model="searchForm.order_business" placeholder="请选择订单业务">
              <a-select-option :value="0"> 店铺 </a-select-option>
              <a-select-option :value="1"> 社区 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="6"> </a-col>
      </a-row>
    </a-form-model>

    <!-- 统计数据 -->
    <a-row
      type="flex"
      align="middle"
      style="box-shadow: 2px 2px 10px 2px #eee; text-align: center; padding: 15px 0; border-radius: 5px"
    >
      <a-col :span="11">
        <statistic title="成交订单数" :value="dealOrderNums"> </statistic>
      </a-col>
      <a-col :span="1">
        <a-divider type="vertical" style="height: 45px" />
      </a-col>
      <a-col :span="11">
        <statistic title="成交总金额" :value="dealTotalMoney"> </statistic>
      </a-col>
    </a-row>

    <!-- table -->
    <a-table
      class="mt-20"
      :columns="columns"
      :row-key="(record) => record.order_id"
      :data-source="dataList"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="order_business" slot-scope="text">
        <span v-if="text == 0">店铺</span>
        <span v-else>社区</span>
      </template>
      <template slot="action" slot-scope="order_id, record">
        <a-button type="link" @click="goDetail(order_id, record)">查看详情</a-button>
      </template>
    </a-table>

    <!-- 详情 -->
    <a-drawer
      title="查看详情"
      placement="right"
      :closable="true"
      :visible="detailVisible"
      width="60%"
      @close="handleDrawerClose"
    >
      <order-detail :orderId="orderId" :orderBusiness="orderType" type="mer"></order-detail>
    </a-drawer>
  </a-card>
</template>
<script>
import moment from 'moment'
import { statistic } from 'ant-design-vue'
import marketingPlatformApi from '@/api/new_marketing/platform/index'
import OrderDetail from './modules/OrderDetail.vue'
export default {
  name: 'MarkeringOrderInfo',
  components: { statistic , OrderDetail},
  data() {
    return {
      selectArea: [],
      areaList: [],
      areaPersonList: [],
      teamList: [],
      time: [],
      searchForm: {
        begin_time: '',
        end_time: '',
        type: undefined,
        province_id: undefined,
        city_id: undefined,
        area_id: undefined,
        area_uid: undefined,
        team_id: undefined,
        order_business: undefined,
      },
      contentType: '1',
      content: '',
      searchFormLayout,
      loading: false,
      columns,
      dataList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      order: 0,
      detailVisible: false,
      dealOrderNums: 0,
      dealTotalMoney: 0,
      currency: '￥',
      orderId: '',
      orderType: 0, // 0店铺 1社区
    }
  },
  watch: {
    selectArea(val) {
      if (val.length) {
        this.searchForm.province_id = val[0]
        this.searchForm.city_id = val[1]
        this.searchForm.area_id = val[2]
        this.request(marketingPlatformApi.getAreaUidByProvince, {
          province_id: val[0],
          city_id: val[1],
          area_id: val[2],
        }).then((data) => {
          this.areaPersonList = data || []
        })
      }
    },
  },
  created() {
    this.getDataList()
  },
  methods: {
    moment,
    onAreaPersonSelect(val) {
      this.request(marketingPlatformApi.getTeamIdByAreaUid, {
        area_uid: val,
      }).then((data) => {
        this.teamList = data || []
      })
    },
    handleContentTypeChange(val) {
      delete this.searchForm.orderid
      delete this.searchForm.name
      delete this.searchForm.property_name
      delete this.searchForm.team_name
      delete this.searchForm.person_name
      this.resetSeachContent()
    },
    handleInputChange(e) {
      if (this.content) {
        this.resetSeachContent()
      }
    },
    resetSeachContent() {
      if (this.contentType == 1) {
        this.searchForm.orderid = this.content
      } else if (this.contentType == 2) {
        this.searchForm.name = this.content
      } else if (this.contentType == 3) {
        this.searchForm.team_name = this.content
      } else if (this.contentType == 4) {
        this.searchForm.person_name = this.content
      } else if (this.contentType == 5) {
        this.searchForm.property_name = this.content
      }
    },
    onDateRangeChange(date, dateString) {
      this.$set(this, 'time', [date[0], date[1]])
      this.searchForm.begin_time = dateString[0]
      this.searchForm.end_time = dateString[1]
    },
    search() {
      this.$set(this.pagination, 'current', 1)
      this.getDataList()
    },
    reset() {
      this.$set(this, 'searchForm', this.$options.data().searchForm)
      this.$set(this, 'time', [])
      this.contentType = '1'
      this.content = ''
      this.teamList = []
      this.areaPersonList = []
      this.selectArea = []
      this.$set(this.pagination, 'current', 1)
      this.getDataList()
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
      this.getDataList()
    },
    getDataList() {
      this.request(marketingPlatformApi.getOrderList, {
        ...this.searchForm,
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
        order: this.order,
      }).then((data) => {
        if (data.areaList && !this.areaList.length) {
          this.areaList = data.areaList
        }
        if (data.list) {
          this.$set(this.pagination, 'total', data.count)
          this.dealOrderNums = data.count
          this.dealTotalMoney = this.currency + data.total_price
          this.dataList = data.list || []
        }
      })
    },
    goDetail(id, record) {
      this.detailVisible = true
      this.orderType = record.order_business
      this.orderId = id
    },
    handleDrawerClose() {
      this.detailVisible = false
    },
  },
}
// search form layout
const searchFormLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
}
const columns = [
  {
    title: '订单编号',
    dataIndex: 'orderid',
    align: 'center',
  },
  {
    title: '商家/物业名称',
    dataIndex: 'mer_name',
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
    dataIndex: 'per_name',
    align: 'center',
  },
  {
    title: '购买数量',
    dataIndex: 'total_num',
    align: 'center',
  },
  {
    title: '店铺数量',
    dataIndex: 'buy_num',
    align: 'center',
  },
  {
    title: '订单类型',
    dataIndex: 'order_type_status',
    align: 'center',
  },
  {
    title: '支付时间',
    dataIndex: 'place_time',
    sorter: true,
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'order_id',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  },
]
</script>
<style lang="less" scoped>
.marketing-order-info {
  margin: 20px;
  min-height: 90%;
}
.line {
  .title {
    color: #333;
    min-width: 60px;
  }
  .content {
    flex: 1;
    color: #666;
  }
}
.module-title {
  line-height: 40px;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
  font-size: 16px;
}
</style>
