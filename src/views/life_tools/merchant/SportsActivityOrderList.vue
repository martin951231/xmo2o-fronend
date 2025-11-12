<template>
  <div style="margin-top: 20px;padding:20px;background-color: #fff;">
    <a-form-model layout="inline" :model="searchForm">
        <a-form-model-item label="搜索">
            <a-select
                v-model="searchForm.search_type"
                style="width:100px;"
            >
                <a-select-option :value="1">标题</a-select-option>
                <a-select-option :value="2">适用体育馆</a-select-option>
                <a-select-option :value="3">适用门票</a-select-option>
                <a-select-option :value="4">订单号</a-select-option>
                <a-select-option :value="5">手机号</a-select-option>
            </a-select>
        </a-form-model-item>
        <a-form-model-item label="">
            <a-input v-model="searchForm.keyword" placeholder="关键词"></a-input>
        </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
        <a-button @click="resetForm()" class="ml-20">重置</a-button>
      </a-form-model-item>
    </a-form-model><br>
    <a-table :row-selection="rowSelection" rowKey="order_id" :columns="columns" :data-source="datalist" :pagination="pagination" bordered>
    </a-table>
  </div>
</template>
<script>

import lifeToolsMerchantApi from "@/api/life_tools/merchant";
import moment from 'moment'

const columns = [
  {
    title: '订单号',
    dataIndex: 'real_orderid',
    key: 'real_orderid',
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '约战体育馆/门票',
    dataIndex: 'tools_title',
    key: 'tools_title',
  },
  {
    title: '约战人数',
    dataIndex: 'num',
    key: 'num',
  },
  {
    title: '约战方式',
    dataIndex: 'group_type_val',
    key: 'group_type_val',
  },
  {
    title: '发起人',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: '发起人手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '约战日期',
    dataIndex: 'ticket_time',
    key: 'ticket_time',
  },
  {
    title: '发起约战日期',
    dataIndex: 'add_time',
    key: 'add_time',
  },
  {
    title: '下单时间',
    dataIndex: 'add_time',
    key: 'add_time',
  },
  {
    title: '支付金额',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '支付方式',
    dataIndex: 'pay_type_txt',
    key: 'pay_type_txt',
  },
    {
        title: '状态',
        dataIndex: 'group_status_val',
        key: 'group_status_val',
    },
];
const ids = []
export default {
  components: {},
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      datalist: [],
      columns,
      //搜索框表单
      searchForm: {
        search_type: 1,
        keyword: '',
      },
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
      this.request(lifeToolsMerchantApi.getSportsActivityOrderList, params).then((res) => {
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
        search_type: 1,
        keyword: '',
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
    // 监听日期选择变化
    onDateRangeChange(date, dateString) {
      // 更新搜索框表单数据
      this.$set(this.searchForm, 'time', [date[0], date[1]])
      this.$set(this.searchForm, 'begin_time', dateString[0])
      this.$set(this.searchForm, 'end_time', dateString[1])
    },
  },
};
</script>