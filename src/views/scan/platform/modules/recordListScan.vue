<template>
    <a-modal
      :visible="visible"
      :title="title"
      width="60%"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <div style="margin-top: 20px;padding:20px;background-color: #fff;">
        <a-form-model layout="inline" :model="searchForm">
          <a-form-model-item label="搜索">
            <a-select
              v-model="searchForm.type"
              style="width:115px;"
            >
              <a-select-option :value="0">全部</a-select-option>
              <a-select-option :value="1">用户昵称</a-select-option>
              <a-select-option :value="2">用户手机号</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item>
            <a-input v-model="searchForm.keyword" placeholder="输入用户昵称/手机号"></a-input>
          </a-form-model-item>
          <a-form-model-item label="领取日期">
            <a-range-picker @change="timeChange" :value="dateRange" />
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" @click="submitForm(true)" class="ml-10">搜索</a-button>
            <a-button @click="resetForm()" class="ml-10">重置</a-button>
            <a-button @click="exportForm()" class="ml-10">导出</a-button>
          </a-form-model-item>
        </a-form-model>
          <a-row class="mt-20 mb-20">
              <a-col>
                  <a-button type="primary" @click="multipleDelete()" :disabled="!selectedRowKeys.length">批量删除</a-button>
              </a-col>
          </a-row>
        <a-table rowKey="id" :columns="columns" :data-source="datalist" :pagination="pagination" bordered style="margin-top: 10px;" :rowSelection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onParkingChange,
              getCheckboxProps: getCheckboxProps,
            }" >
            <span slot="action" slot-scope="text, record">
                <a @click="() => singleDelete(record.id)">{{
                        record.uid>0 ? '' : '删除'
                    }}</a>
          </span>
        </a-table>
      </div>
    </a-modal>
</template>
<script>

import scanPlatformApi from '@/api/scan/platform/index'


const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '二维码标识',
    dataIndex: 'ewm_no',
    key: 'ewm_no',
  },
    {
        title: '是否领取',
        dataIndex: 'get_text',
        key: 'get_text',
    },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '当前积分',
    dataIndex: 'score_count',
    key: 'score_count',
  },
  {
    title: '当前余额',
    dataIndex: 'now_money',
    key: 'now_money',
  },
  {
    title: '领取时间',
    dataIndex: 'get_time',
    key: 'get_time',
  },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
    },
];

export default {
  props: {
    visible: Boolean,
    title: String,
    scanId: null
  },
  data() {
    return {
      datalist: [],
      dateRange: [],
      columns,
      //搜索框表单
      searchForm: {
        type: 0, // 搜索类型
        keyword: '', // 搜索内容
        date: [],//日期筛选
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
      selectedRowKeys: [],
    };
  },
    computed: {
        getCheckboxProps() {
            return (record) => {
                return {
                    props: {
                        disabled: record.uid > 0,
                    },
                }
            }
        },
    },
  watch: {
    scanId:{//深度监听，可监听到对象、数组的变化
      handler(val, oldVal){
        this.getRecordList(false)
      },
      immediate: true
    }
  },
  methods: {
    // 列表单选多选
    onParkingChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
      setCurrent(){
          this.getRecordList(true)
      },
    // 获取table数据
    getRecordList(is_search) {
      let params = {...this.searchForm}
      if (is_search === true) {
        params.page = 1
        this.$set(this.pagination, 'current', 1)
      } else {
        params.page = this.pagination.current
        this.$set(this.pagination, 'current', this.pagination.current)
      }
      params.pageSize = this.pagination.pageSize
      params.send_id = this.scanId
      this.request(scanPlatformApi.recordAllList, params).then((res) => {
        this.datalist = res.data
        this.$set(this.pagination, 'total', res.total)
      })
    },
    // 提交搜索表单
    submitForm(is_search = false) {
      this.getRecordList(is_search)
    },
    // 重置表单
    resetForm() {
      this.$set(this, 'searchForm', {type: 0, keyword: '', date: []})
      this.$set(this.pagination, 'current', 1)
      this.dateRange = []
      this.getRecordList()
    },
    // 导出表单
    exportForm() {
        let params = this.searchForm;
        params.send_id = this.scanId;
        params.is_all = 1;
        this.request(scanPlatformApi.exportRecordList, params).then((res) => {
            if (res.file_url) {
                window.open(res.file_url)
            }
        })
    },
    // 单个删除
    singleDelete(id){
        let params = {
            id: id,
        }
        this.$confirm({
            title: this.L('是否删除该条数据?'),
            centered: true,
            onOk: () => {
                this.request(scanPlatformApi.singleDelete, params).then((res) => {
                    this.$message.success('操作成功!');
                    this.getRecordList()
                })
            },
            onCancel() {},
        })
    },
    // 批量删除
    multipleDelete(){
        //id 为数组
        let params = {
          ids: this.selectedRowKeys,
        }
        this.$confirm({
            title: this.L('是否删除已选数据?'),
            centered: true,
            onOk: () => {
                this.request(scanPlatformApi.multipleDelete, params).then((res) => {
                    this.$message.success('操作成功!');
                    this.getRecordList()
                })
            },
            onCancel() {},
        })
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
    timeChange(date, dateString) {
      this.dateRange = date
      this.$set(this.searchForm, 'date', dateString)
    },
    handleOk() {
      this.$emit('handleCancel')
    },
    handleCancel() {
      this.$emit('handleCancel')
    },
  },
};
</script>