<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <!-- 搜索栏 -->
    <a-form-model layout="inline" :model="searchForm">
      <a-form-model-item label="搜索">
        <a-select v-model="searchForm.type" style="width: 115px">
          <a-select-option :value="1"> 分享人</a-select-option>
          <a-select-option :value="2"> 购买人</a-select-option>
          <a-select-option :value="3"> 商品名称</a-select-option>
        </a-select>
        <a-input v-model="searchForm.keyword" placeholder="请输入搜索关键字" style="width: 215px" />
      </a-form-model-item>
      <a-form-model-item label="订单状态">
        <a-select v-model="searchForm.status" style="width: 150px">
          <a-select-option v-for="item in statusList" :value="item.value" :key="item.value">
            {{ item.label }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="下单时间">
        <a-range-picker
          :ranges="{
            过去30天: [moment().subtract(30, 'days'), moment()],
            过去15天: [moment().subtract(15, 'days'), moment()],
            过去7天: [moment().subtract(7, 'days'), moment()],
            今日: [moment(), moment()],
          }"
          :value="searchForm.time"
          format="YYYY-MM-DD"
          @change="onDateRangeChange"
        />
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" icon="search" @click="submitForm(true)" class="ml-20"> 查询</a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- 数据列表 -->
    <a-table class="mt-20" rowKey="order_id" :columns="columns" :data-source="dataList" :pagination="pagination">
      <!-- 商品信息 -->
      <span slot="goods_name" slot-scope="text, record">
        <div class="product-info">
          <div>
            <img :src="record.goods_image" />
          </div>
          <div>
            <div>{{ text }}</div>
            <div>{{ record.goods_sku_dec }}</div>
          </div>
        </div>
      </span>
      <!-- <span slot="goodsScore" slot-scope="text">
        <template>
         <a-rate :default-value="text" disabled />
        </template>
        {{text}}星
      </span> -->
      <span slot="goods_count1" v-if="value_sum">
        商品数量
        <a-tooltip placement="right">
          <template slot="title">
            <span>{{value_sum.goods_num_sum}}</span>
          </template>
          <a-icon type="question-circle" />
        </a-tooltip>
      </span>
      <span slot="discount_price1" v-if="value_sum">
        销售额
        <a-tooltip placement="right">
          <template slot="title">
            <span>{{value_sum.discount_price_sum}}</span>
          </template>
          <a-icon type="question-circle" />
        </a-tooltip>
      </span>
      <span slot="share_user_commission1" v-if="value_sum">
        佣金
        <a-tooltip placement="right">
          <template slot="title">
            <span>{{value_sum.share_user_commission_sum}}</span>
          </template>
          <a-icon type="question-circle" />
        </a-tooltip>
      </span>
    </a-table>
  </div>
</template>

<script>
import moment from 'moment'
import groupPlatformApi from '@/api/group/platform/index'

export default {
  name: 'ReplyList',
  data() {
    return {
      //   搜索框表单
      searchForm: {
        keywords: '', // 搜索内容
        type: 1, // 搜索类型
        time: [],
        start_time: '', // 开始时间
        end_time: '', // 结束时间
        status: 0,
      },
      store_list: [], // 店铺列表
      //   table表格头部
      columns: [
        {
          title: '分享人',
          dataIndex: 'share_user_name',
          scopedSlots: { customRender: 'share_user_name' },
        },
        {
          title: '购买人',
          dataIndex: 'user_name',
          scopedSlots: { customRender: 'user_name' },
        },
        {
          title: '订单状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '商品名称',
          dataIndex: 'goods_name',
        },
        {
          dataIndex: 'goods_count',
          key: 'goods_count',
          scopedSlots: { customRender: 'goods_count' },
          slots: { title: 'goods_count1' },
        },
        {
          dataIndex: 'discount_price',
          key: 'discount_price',
          slots: { title: 'discount_price1' },
          scopedSlots: { customRender: 'discount_price' },
        },
        {
          dataIndex: 'share_user_commission',
          key: 'share_user_commission',
          width: '160px',
          slots: { title: 'share_user_commission1' },
        },
        {
          title: '下单时间',
          dataIndex: 'add_time',
          key: 'add_time',
        },
      ],
      //   列表数据
      dataList: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
      statusList: [
        {
          value: 0,
          label: '全部',
        },
        {
          value: 1,
          label: '已支付',
        },
        {
          value: 2,
          label: '已消费',
        },
        {
          value: 3,
          label: '部分消费',
        },
        {
          value: 4,
          label: '退款',
        },
        {
          value: 5,
          label: '已发货',
        },
        {
          value: 6,
          label: '团长收货待自提',
        },
        {
          value: 7,
          label: '部分商品发货',
        },
        {
          value: 8,
          label: '部分商品收货待自提',
        },
        {
          value: 10,
          label: '超时支付',
        },
        {
          value: 11,
          label: '已取消',
        },
        {
          value: 12,
          label: '已退款',
        },
        {
          value: 13,
          label: '已评价',
        },
      ],
      value_sum: null
    }
  },
  created() {
    this.getDataList({ is_search: false })
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy()
    next()
  },

  methods: {
    moment,
    // 获取table数据
    getDataList(param) {
      let params = { ...this.searchForm }
      delete params.time
      if (param.is_search == true) {
        params.page = 1
        this.$set(this.pagination, 'current', 1)
      } else {
        params.page = this.pagination.current
        this.$set(this.pagination, 'current', this.pagination.current)
      }
      params.page_size = this.pagination.pageSize
      this.request(groupPlatformApi.groupOrderShareList, params).then((res) => {
        this.dataList = res.data
        this.value_sum = res.value_sum
        this.$set(this.pagination, 'total', res.total)
      })
    },
    // 监听日期选择变化
    onDateRangeChange(date, dateString) {
      // 更新搜索框表单数据
      this.$set(this.searchForm, 'time', [date[0], date[1]])
      this.$set(this.searchForm, 'start_time', dateString[0])
      this.$set(this.searchForm, 'end_time', dateString[1])
    },
    // 提交搜索表单
    submitForm(is_search = false) {
      let params = { ...this.searchForm }
      delete params.time
      params.is_search = is_search
      console.log(params)
      this.getDataList(params)
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.submitForm()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)
      this.submitForm()
    },
    // 重置表单
    resetForm() {
      this.$set(this, 'searchForm', { content: '', begin_time: '', end_time: '', type: 1, status: 2 })
      this.$set(this.pagination, 'current', 1)
      this.getDataList({ store_id: this.store_id, is_search: false })
    },
  },
}
</script>
<style scoped lang="less">
* {
  font-size: 14px;
}
</style>