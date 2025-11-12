<template>
  <a-modal
    :title="'选择'+typeName"
    centered
    :visible="dialogVisible"
    @ok="handleOk"
    @cancel="handleCancel"
    class="dialog"
    :destroyOnClose="true"
    :bodyStyle="{'height':'70vh','overflow-y': 'auto'}"
    :width="'60%'"

  >
  <div style="margin-top: 5px;padding:10px;background-color: #fff;">
    <a-form-model layout="inline" :model="searchForm">
      <a-form-model-item label="标题">
        <a-input v-model="searchForm.title" placeholder="标题"></a-input>
      </a-form-model-item>
        <a-form-model-item>
            <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
        </a-form-model-item>
    </a-form-model>
    <a-table
      rowKey="recommend_id"
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
      title: '名称',
      dataIndex: 'title',
      scopedSlots: {customRender: 'title'},
  },
  {
      title: '商家名称',
      dataIndex: 'merchant_name',
      scopedSlots: {customRender: 'merchant_name'},
  },
  // {
  //     title: '价格',
  //     dataIndex: 'goods_price',
  //     slots: {customRender: 'goods_price'}
  // },
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
      typeValue:'scenic',
      typeName:'文旅',
      datalist: [],
      columns,
      //搜索框表单
      searchForm: {
        name: '', // 搜索名称
      },
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
      page : 1,
    };
  },
  created() {
  },  
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    openDialog(type, typeName) {
      this.dialogVisible = true
      this.typeValue = type
      this.typeName = typeName
      this.getDataList()
    },
    moment,
    // 获取table数据
    getDataList(is_search) {
      let params = {...this.searchForm}
      
      params.page = this.pagination.current
      params.pageSize = this.pagination.pageSize
      params.type = this.typeValue
      
      this.request(lifeToolsPlatformApi.getScenicHotRecommendList, params).then((res) => {
        this.datalist = res.data
        this.$set(this.pagination, 'total', res.total)
      })
    },
    // 提交搜索表单
    submitForm(is_search = false) {
      this.$set(this.pagination, 'current', 1)
      this.getDataList()
    },
    // 重置表单
    resetForm() {
      this.pagination.current = 1
      this.$set(this.pagination, 'current', 1)
      this.getDataList()
    },
    // 页码变化
    onPageChange(page, pageSize) {
      console.log(page, 'onPageChange')
      this.$set(this.pagination, 'current', page)
      this.getDataList()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)
      this.getDataList()
    },
    // 点击确认
    handleOk() {
        if (this.selectedRowKeys.length) {
          this.request(lifeToolsPlatformApi.addScenicHotRecommendList, {
            recommend_id: this.selectedRowKeys,type:this.typeValue
          }).then(res => {
            this.$message.success('添加成功')
            this.$emit('backDeal')
          })
          this.handleCancel()
        } else {
          this.$message.error('请选择'+this.typeName)
        }
    },
    handleCancel() {
        this.searchForm = {
            title: '', // 搜索名称
        }
      this.selectedRowKeys = [];
      this.selectedRows    = [];
      this.dialogVisible   = false
    },
  },
};
</script>