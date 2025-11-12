<template>
  <div style="margin-top: 20px;padding:20px;background-color: #fff;">
    <a-form-model layout="inline" :model="searchForm">
        <a-form-model-item label="搜索">
            <a-select
                v-model="searchForm.search_type"
                style="width:120px;"
            >
                <a-select-option :value="1">次卡名称</a-select-option>
<!--                <a-select-option :value="2">景区名称</a-select-option>-->
                <a-select-option :value="3">用户名称</a-select-option>
                <a-select-option :value="5">用户手机号</a-select-option>
                <a-select-option :value="4">店员名称</a-select-option>
            </a-select>
        </a-form-model-item>
        <a-form-model-item label="">
            <a-input v-model="searchForm.keyword" placeholder="关键词"></a-input>
        </a-form-model-item>
      <a-form-model-item label="次卡类型">
        <a-select
          v-model="searchForm.type"
          style="width:100px;"
        >
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="sports">体育次卡</a-select-option>
          <a-select-option value="scenic">景区次卡</a-select-option>
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
      </a-form-model-item>
    </a-form-model><br>
    <a-table rowKey="pigcms_id" :columns="columns" :data-source="datalist" :pagination="pagination" bordered>
    </a-table>
  </div>
</template>
<script>

import lifeToolsMerchantApi from "@/api/life_tools/merchant";
import cardEdit from '@/views/life_tools/merchant/modules/cardEdit'
import moment from 'moment'

const columns = [
  {
    title: '次卡名称',
    dataIndex: 'card_title',
    key: 'card_title',
  },
  {
    title: '用户名称',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone',
  },
  // {
  //   title: '核销景区',
  //   dataIndex: 'tools_title',
  //   key: 'tools_title',
  // },
   {
    title: '次卡类型',
    dataIndex: 'type_txt'
  },
  {
    title: '店员名称',
    dataIndex: 'staff_name',
    key: 'staff_name',
  },
  {
    title: '核销时间',
    dataIndex: 'add_time',
    key: 'add_time',
  },
  // {
  //   title: '操作',
  //   key: 'action',
  //   scopedSlots: { customRender: 'action' },
  // },
];
export default {
  components: {},
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      datalist: [],
      columns,
      order_id: 0,
      editVisible: false, //编辑
      currentBtn: {}, // 当前点击的操作按钮
      //搜索框表单
      searchForm: {
        search_type: 1,
        keyword: '',
        type: 'all',
        order_id: 0,
        time: [],
        begin_time: '', // 开始时间
        end_time: '', // 结束时间
        order_id: 0,
        time: [],
        begin_time: '', // 开始时间
        end_time: '', // 结束时间
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
   watch: {
      $route() {
          if (this.$route.query.order_id) {
              this.order_id = this.$route.query.order_id
              this.getDataList(false)
          }
      },
  },
  created() { 
      if (this.$route.query.order_id) {
          this.order_id = this.$route.query.order_id 
      } 
    this.getDataList(false)
  },
  methods: {
    moment,
    // 获取table数据
    getDataList(is_search) {
      this.searchForm.order_id = this.order_id
      let params = {...this.searchForm}
      if (is_search === true) {
        params.page = 1
        this.$set(this.pagination, 'current', 1)
      } else {
        params.page = this.pagination.current
        this.$set(this.pagination, 'current', this.pagination.current)
      }
      params.pageSize = this.pagination.pageSize
      this.request(lifeToolsMerchantApi.getToolsCardRecord, params).then((res) => {
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
        type: 'all',
        time: [],
        begin_time: '', // 开始时间
        end_time: '', // 结束时间
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