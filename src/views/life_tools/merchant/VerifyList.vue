<template>
  <div style="margin-top: 20px;padding:20px;background-color: #fff;">
    <a-form-model layout="inline" :model="searchForm">
      <a-form-model-item label="订单号/店员名称">
        <a-input v-model="searchForm.keyword" placeholder="订单号/店员名称"></a-input>
      </a-form-model-item>
      <a-form-model-item label="订单类型">
        <a-select
          v-model="searchForm.type"
          style="width:115px;"
        >
          <a-select-option :value="0">全部</a-select-option>
          <a-select-option :value="1">场馆</a-select-option>
          <a-select-option :value="2">课程</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="核销时间">
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
        <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
        <a-button @click="resetForm()" class="ml-20">重置</a-button>
        <a-button type="primary" icon="download" @click="getExport()" class="ml-20">导出</a-button>
      </a-form-model-item>
    </a-form-model><br>
    <a-table rowKey="order_id" :columns="columns" :data-source="datalist" :pagination="pagination" bordered>
    </a-table>
      <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="searchForm"></export-add>
  </div>
</template>
<script>

import lifeToolsMerchantApi from "@/api/life_tools/merchant";
import ExportAdd from "@/views/common/export/ExportAdd"
import moment from 'moment'

const columns = [
  {
    title: '订单号',
    dataIndex: 'real_orderid',
    key: 'real_orderid',
  },
  {
    title: '订单类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '店铺名称',
    dataIndex: 'store_name',
    key: 'store_name',
  },
  {
    title: '店员名称',
    dataIndex: 'staff_name',
    key: 'staff_name',
  },
  {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '核销时间',
    dataIndex: 'last_time',
    key: 'last_time',
  }
];

export default {
  components: {ExportAdd},
  data() {
    return {
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
      ewm: '',
      ewmName: '',
      configForm: {
        scan_money_desc: '',
        scan_score_desc: '',
        scan_timeout: '3'
      },
      //搜索框表单
      searchForm: {
        keyword: '',
        type: 0,
        status: -1,
        time: [],
        begin_time: '', // 开始时间
        end_time: '', // 结束时间
      },
        exportUrl: lifeToolsMerchantApi.exportVerifyRecord,
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
    };
  },
  created() {
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
      this.request(lifeToolsMerchantApi.getSportsVerifyList, params).then((res) => {
        this.datalist = res.data
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
        keyword: '',
        type: 0,
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
      this.request(lifeToolsMerchantApi.getSportsOrderDetail, {order_id: order_id}, 'GET').then((res) => {
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
        this.request(this.exportUrl, this.searchForm).then((res)=>{
          if(res.file_url){
            window.open(res.file_url)
          }
        });
      },
  },
};
</script>