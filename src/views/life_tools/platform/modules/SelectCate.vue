<template>
  <a-modal
    title="选择分类"
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
      <a-form-model-item label="分类名称">
        <a-input v-model="searchForm.cat_name" placeholder="分类名称"></a-input>
      </a-form-model-item>
        <a-form-model-item>
            <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
        </a-form-model-item>
    </a-form-model>
    <a-table
      rowKey="cat_id"
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
    dataIndex: 'cat_id',
    key: 'cat_id',
  },
  {
    title: '名称',
    dataIndex: 'cat_name',
    key: 'cat_name',
  },
  {
    title: '描述',
    dataIndex: 'cat_info',
    key: 'cat_info',
  },
  {
    title: '排序',
    dataIndex: 'cat_sort',
    key: 'cat_sort',
  },
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    this.$set(this.searchForm, 'cat_id', selectedRowKeys)
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
      this.request(lifeToolsPlatformApi.getCateList, params).then((res) => {
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
    onChange(id, status) {
      let params = {
        id: id,
        status: 0
      }
      if (status === 0) {
        params.status = 1
      }
      this.request(lifeToolsPlatformApi.setStatus, params).then((res) => {
        this.$message.success('操作成功!');
        this.getDataList()
      })
    },
    handleAdd() {
      this.currentBtn = {
        'props': 'addScan',
        'title': '添加活动'
      }
      this.addVisible = true
    },
    handleEdit(id) {
      this.request(lifeToolsPlatformApi.editData, {id: id}, 'GET').then((res) => {
        res.status = res.status.toString()
        this.currentBtn = {
          'props': 'editScan',
          'title': '编辑活动',
          'data': res
        }
        this.editVisible = true
      })
    },
    handleRecord(id) {
      this.currentBtn = {
        'props': 'recordScan',
        'title': '领取记录',
        'id': id
      }
      this.recordVisible = true
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
          this.request(lifeToolsPlatformApi.addRelatedCate, {
            cat_id: this.selectedRowKeys,
          }).then(res => {
            this.$message.success('添加成功')
            this.$emit('backDeal', this.cat_key, this.title)
          })
          this.handleCancel()
        } else {
          this.$message.error('请选择分类')
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