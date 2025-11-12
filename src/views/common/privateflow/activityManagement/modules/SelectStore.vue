<template>
  <div class="select-store">
    <a-drawer title="指定店铺" placement="right" :visible="visible" @close="onClose" destroyOnClose :width="800">
      <div class="content">
        <div class="header">
          <div style="width: 100px">筛选类型：</div>
          <a-select v-model="is_selected" style="width: 100px">
            <a-select-option :value="-1"> 全部 </a-select-option>
            <a-select-option :value="1"> 已选择 </a-select-option>
            <a-select-option :value="0"> 未选择 </a-select-option>
          </a-select>
          <a-input-group compact style="width: 300px; margin-left: 20px">
            <a-select v-model="search_type" style="width: 100px">
              <a-select-option value="merchant_name"> 商家名称 </a-select-option>
              <a-select-option value="store_name"> 店铺名称 </a-select-option>
            </a-select>
            <a-input v-model="keyword" style="width: 200px" placeholder="请输入搜索关键字" />
          </a-input-group>
          <a-button type="primary" style="margin-left: 40px" @click="search">搜索</a-button>
        </div>
        <a-table
          rowKey="store_id"
          :pagination="pagination"
          :columns="columns"
          :data-source="list"
          :row-selection="rowSelection"
          @change="handleTableChange"
          :loading="loading"
        >
          <span slot="action" slot-scope="text, record">
            <a style="margin-right: 10px" v-if="record.is_selected == 0" @click="submit('bind',text)">绑定</a>
            <a @click="submit('unbind',text)" v-else>解除绑定</a>
          </span>
        </a-table>
      </div>
      <div class="footer">
        <a-button @click="submit('unbind')"  type="danger" size="large" style="margin-right: 20px">解除绑定</a-button>
        <a-button @click="submit('bind')" type="primary" size="large">绑定</a-button>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import privateFlowApi from '@/api/common/priviteflow'
const columns = [
  {
    dataIndex: 'merchant_name',
    key: 'merchant_name',
    title: '商家名称',
  },
  {
    dataIndex: 'store_name',
    key: 'store_name',
    title: '店铺名称',
  },
  {
    dataIndex: 'store_id',
    key: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'PrivateFlowSelectStore',
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      visible: false,
      indeterminate: false,
      checkAll: false,
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      selectedTypes: [
        { value: -1, title: '全部' },
        { value: 1, title: '已选择' },
        { value: 0, title: '未选择' },
      ],
      is_selected: -1,
      search_type: 'merchant_name',
      keyword: '',
      columns,
      selectedRowKeys: [],
      loading: false,
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.handleRowSelectChange,
      }
    },
  },
  methods: {
    getStoreList() {
      this.loading = true
      this.request(privateFlowApi.getStoreList, {
        activity_id: this.detail.id,
        is_selected: this.is_selected,
        search_type: this.search_type,
        keyword: this.keyword,
        page: this.pagination.current,
        pageSize: this.pagination.pageSize,
      }).then((data) => {
        this.loading = false
        this.list = data.list
        this.$set(this.pagination, 'total', data.total)
      })
    },
    handleTableChange(pagination) {
      console.log(pagination)
      this.$set(this.pagination, 'current', pagination.current)
      this.getStoreList()
    },
    handleRowSelectChange(selectedRowKeys) {
      console.log(selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    search() {
      this.$set(this.pagination, 'current', 1)
      this.getStoreList()
    },
    openDrawer() {
      Object.assign(this.$data, this.$options.data())
      this.visible = true
      this.getStoreList()
    },
    onClose() {
      this.visible = false
    },
    submit(operate, id) {
      let params = {
        id: this.detail.id,
        operate,
      }
      if (id) {
        params.store_ids = [id]
      } else {
        if(!this.selectedRowKeys.length) {
          this.$message.warning('请先选择店铺哦~')
          return
        }
        params.store_ids = this.selectedRowKeys
      }
      this.request(privateFlowApi.assignStore, params).then((data) => {
        this.$message.success('操作成功！')
        this.getStoreList()
        this.selectedRowKeys = []
        this.$emit('submit')
        // this.visible = false
      })
    },
  },
}
</script>
<style scoped>
.content {
  width: 100%;
  /* height: calc(100vh - 200px); */
}
.header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.footer {
  margin-top: 20px;
  float: right;
  height: 100px;
  /* position: fixed;
  bottom: 10px;
  right: 40px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-end; */
}
</style>