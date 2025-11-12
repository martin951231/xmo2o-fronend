<template>
  <div style="margin-top: 20px;padding:20px;background-color: #fff;">
    <a-form-model layout="inline" :model="searchForm">
      <a-form-model-item label="搜索">
          <a-select
              v-model="searchForm.search_type"
              style="width:100px;"
          >
              <a-select-option :value="1">订单号</a-select-option>
              <a-select-option :value="2">用户昵称</a-select-option>
              <a-select-option :value="3">手机号</a-select-option>
              <a-select-option :value="4">景区名称</a-select-option>
          </a-select>
      </a-form-model-item>
        <a-form-model-item label="">
            <a-input v-model="searchForm.keyword" placeholder="关键词"></a-input>
        </a-form-model-item>
        <a-form-model-item label="日期">
            <a-select
                v-model="searchForm.time_type"
                style="width:100px;"
            >
                <a-select-option :value="1">下单时间</a-select-option>
                <a-select-option :value="2">核销时间</a-select-option>
            </a-select>
        </a-form-model-item>
      <a-form-model-item label="">
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
        <a-form-model-item label="订单状态">
            <a-select
                v-model="searchForm.status"
                style="width:120px;"
            >
                <a-select-option :value="-1">全部</a-select-option>
                <a-select-option :value="10">待付款</a-select-option>
                <a-select-option :value="20">待核销</a-select-option>
                <a-select-option :value="30">已核销</a-select-option>
                <a-select-option :value="50">已退款</a-select-option>
                <a-select-option :value="70">已过期</a-select-option>
                <a-select-option :value="60">已取消</a-select-option>
                <a-select-option :value="45">售后中</a-select-option>
            </a-select>
        </a-form-model-item>
      <a-form-model-item label="支付方式">
        <a-select
          v-model="searchForm.pay_type"
          style="width:120px;"
        >
          <a-select-option v-for="item in payTypeArr" :value="item.value" :key="item.value">{{item.label}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
        <a-button @click="resetForm()" class="ml-20">重置</a-button>
          <a-button type="primary" icon="download" @click="getExport()" class="ml-20">导出</a-button>
      </a-form-model-item>
    </a-form-model><br>
    <a-table rowKey="order_id" :columns="columns" :data-source="datalist" :pagination="pagination" bordered>
      <span slot="numTitle">
        数量
        <a-tooltip trigger="hover">
          <template slot="title">订单总数量：{{ all_num }}</template>
          <a-icon class="ml-10" type="question-circle" />
        </a-tooltip>
      </span>
        <span slot="priceTitle">
        总价
        <a-tooltip trigger="hover">
          <template slot="title">订单总金额：{{ all_price }}</template>
          <a-icon class="ml-10" type="question-circle" />
        </a-tooltip>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="() => handleDetail(record.order_id)">详情</a>
      </span>
    </a-table>
      <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="searchForm"></export-add>
    <!-- 详情 -->
    <orderDetail
      v-if="currentBtn.props === 'orderDetail'"
      :visible="detailVisible"
      :title="currentBtn.title"
      type="scenic"
      @getDataList="getDataList"
      @handleCancel="detailVisible = false"
      :formData="currentBtn.data"
    ></orderDetail>
  </div>
</template>
<script>

import lifeToolsPlatformApi from "@/api/life_tools/platform";
import orderDetail from '@/views/life_tools/platform/modules/orderDetail'
import ExportAdd from "@/views/common/export/ExportAdd"
import moment from 'moment'

const columns = [
  {
    title: '订单号',
    dataIndex: 'real_orderid',
    key: 'real_orderid',
  },
  {
    title: '订单名称',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '门票名称',
    dataIndex: 'ticket_title',
    key: 'ticket_title',
  },
  {
    title: '用户昵称',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: '用户手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    dataIndex: 'num',
    slots: { title: 'numTitle' },
    key: 'num',
  },
  {
    dataIndex: 'total_price',
    slots: { title: 'priceTitle' },
    key: 'total_price',
  },
  {
    title: '订单状态',
    dataIndex: 'order_status_val',
    key: 'order_status_val',
  },
  {
    title: '下单时间',
    dataIndex: 'add_time',
    key: 'add_time',
  },
  {
    title: '支付方式',
    dataIndex: 'pay_type_txt',
    key: 'pay_type_txt',
  },
  {
    title: '核销时间',
    dataIndex: 'verify_time',
    key: 'verify_time',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

const payTypeArr = [
  {
    label:"全部",
    value:"",
  },
  {
    label:"微信",
    value:"wechat",
  },
  {
    label:"支付宝",
    value:"alipay",
  },
  {
    label:"现金",
    value:"offline",
  },
  {
    label:"余额支付",
    value:"balance",
  },
]
export default {
    components: {orderDetail, ExportAdd},
  data() {
    return {
      payTypeArr,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      datalist: [],
      columns,
      addVisible: false, //添加
      detailVisible: false, //详情
      recordVisible: false, //记录
      currentBtn: {}, // 当前点击的操作按钮
      ewmVisible: false,
      setVisible: false,
        all_num: 0,
        all_price: 0,
      ewm: '',
      ewmName: '',
      configForm: {
        scan_money_desc: '',
        scan_score_desc: '',
        scan_timeout: '3'
      },
      //搜索框表单
      searchForm: {
        search_type: 1,
        time_type: 1,
        pay_type:'',
        keyword: '',
        type: 3,
        status: -1,
        time: [],
        begin_time: '', // 开始时间
        end_time: '', // 结束时间
      },
        exportUrl: lifeToolsPlatformApi.exportToolsOrder,
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
      system_config: null,
    };
  },
  created() {
    this.system_config = this.$getCache('system_config')
    if(this.system_config && this.system_config.internal_membership_card == 1){
        this.payTypeArr.push({
            label: '一卡通支付',
            value: 'ecard',
        })
    }
    this.getDataList(false)
  },
  methods: {
    moment,
    // 获取table数据
    getDataList(is_search) {
      let params = {...this.searchForm}
      if (is_search === true) {
        params.page = 1
        this.$set(this.pagination, 'current', 1)
      } else {
        params.page = this.pagination.current
        this.$set(this.pagination, 'current', this.pagination.current)
      }
      params.pageSize = this.pagination.pageSize
      this.request(lifeToolsPlatformApi.getSportsOrderList, params).then((res) => {
        this.datalist  = res.data
        this.all_num   = res.all_num
        this.all_price = res.all_price
        this.$set(this.pagination, 'total', res.total)
      })
    },
    // 提交搜索表单
    submitForm(is_search = false) {
      this.getDataList(is_search)
    },
    // 重置表单
    resetForm() {
      this.$set(this, 'searchForm', {
        search_type: 1,
        time_type: 1,
        pay_type:'',
        keyword: '',
        type: 3,
        status: -1,
        time: [],
        begin_time: '', // 开始时间
        end_time: '', // 结束时间
      })
      this.$set(this.pagination, 'current', 1)
      this.getDataList()
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
    handleDetail(order_id) {
      this.request(lifeToolsPlatformApi.getSportsOrderDetail, {order_id: order_id}, 'GET').then((res) => {
        this.currentBtn = {
          'props': 'orderDetail',
          'title': '订单详情',
          'data': res
        }
        this.detailVisible = true
      })
    },
    // 监听日期选择变化
    onDateRangeChange(date, dateString) {
      // 更新搜索框表单数据
      this.$set(this.searchForm, 'time', [date[0], date[1]])
      this.$set(this.searchForm, 'begin_time', dateString[0])
      this.$set(this.searchForm, 'end_time', dateString[1])
    },
      getExport() {
          if (this.datalist.length > 0) {
              // 弹层提示
            this.$message.loading({ content: '加载中,请耐心等待,数量越多时间越长。', key:'updatable', duration: 0 })
            this.request(this.exportUrl, this.searchForm).then((res)=>{
                        // console.log(res)
                        if(res.file_url){
                          this.$message.success({ content: '下载成功!', key:'updatable', duration: 2 })
                            window.open(res.file_url)
                        }
              })
          } else {
              this.$message.warn('当前没有可以导出的内容')
          }
      },
  },
};
</script>
