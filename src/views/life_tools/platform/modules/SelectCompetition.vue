<template>
  <a-modal
    title="选择活动"
    width="50%"
    centered
    :visible="dialogVisible"
    @ok="handleOk"
    @cancel="handleCancel"
    class="dialog"
    :destroyOnClose="true"
  >
  <div style="margin-top: 5px;padding:10px;background-color: #fff;">
    <a-form-model layout="inline" :model="searchForm">
      <a-form-model-item label="活动标题">
        <a-input v-model="searchForm.title" placeholder="活动标题"></a-input>
      </a-form-model-item>
        <a-form-model-item>
            <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
        </a-form-model-item>
    </a-form-model>
    <a-table
      rowKey="competition_id"
      :columns="columns"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :data-source="datalist"
      :pagination="pagination"
      bordered
    >
    </a-table>
  </div>
  </a-modal>
</template>
<script>

import lifeToolsPlatformApi from "@/api/life_tools/platform";
import moment from 'moment'

const columns = [
  {
    title: 'ID',
    dataIndex: 'competition_id',
    key: 'competition_id',
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '参赛类型',
    dataIndex: 'member_type',
    key: 'member_type',
  },
  {
    title: '报名费用',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '开始时间',
    dataIndex: 'start_time',
    key: 'start_time',
  },
  {
    title: '结束时间',
    dataIndex: 'end_time',
    key: 'end_time',
  },
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
};

export default {
  data() {
    return {
      dialogVisible: false,
      rowSelection,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      datalist: [],
      columns,
      addVisible: false, //添加
      editVisible: false, //编辑
      recordVisible: false, //记录
      currentBtn: '', // 当前点击的操作按钮
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
        name: '', // 搜索名称
        status: -1,//上下架
      },
      selectedRowKeys: [],
      selectedRows: [],
      cat_id: '',
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
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    openDialog() {
      this.dialogVisible = true
      this.getDataList()
    },
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
      this.request(lifeToolsPlatformApi.getCompetitionList, params).then((res) => {
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
      this.$set(this, 'searchForm', {name: '', status: -1})
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
    confirm(id, status) {
      this.onChange(id, status)
    },
    setCancel() {
      this.setVisible = false;
    },
    // 点击确认
    handleOk() {
        if (this.selectedRowKeys.length) {
          this.request(lifeToolsPlatformApi.addRelatedCompetition, {
            competition_id: this.selectedRowKeys,
          }).then(res => {
            this.$message.success('添加成功')
            this.$emit('backDeal', this.cat_key, this.title)
          })
          this.handleCancel()
        } else {
          this.$message.error('请选择活动')
        }
    },
    handleCancel() {
        this.searchForm = {
            title: '', // 搜索名称
        }
        this.selectedRowKeys = [];
        this.selectedRows    = [];
      this.dialogVisible = false
    },
  },
};
</script>