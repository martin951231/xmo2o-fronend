<template>
  <div>
    <router-link :to="{ path: '/merchant/merchant.foodshop/editPrintRule', query: { store_id: store_id } }">
      <a-button type="primary" style="margin: 10px 20px">{{ L('新建打印机规则') }}</a-button>
    </router-link>
    <a-table
      style="background: #ffffff"
      :columns="columns"
      rowKey="id"
      :data-source="printRuleList"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <span slot="edit_btn" slot-scope="text, record">
        <router-link
          :to="{ path: '/merchant/merchant.foodshop/editPrintRule', query: { store_id: store_id, id: record.id, reciept_type: record.reciept_type } }"
        >
          <a-button class="icon_btn">{{ L('编辑') }}</a-button>
        </router-link>
        <a-button type="danger" @click="delTableType(record.id)">{{ L('删除') }}</a-button>
      </span>
    </a-table>
  </div>
</template>
<style type="text/css">
.icon_btn {
  margin-right: 1rem;
  border-color: #1890ff;
  color: #1890ff;
}
</style>
<script>
import foodshopMerchantApi from '@/api/foodshop/merchant'
const columns = []

export default {
  components: {},
  data() {
    return {
      store_id: 0,
      queryParam: {
        store_id: 0,
      },
      printRuleList: [],
      isAllCheck: false,
      pagination: { pageSize: 10, total: 10 },
      columns,
    }
  },
  watch: {
    $route() {
      console.log(this.$route.query.store_id, 'watch')
      if (this.$route.query.store_id) {
        this.store_id = this.$route.query.store_id
        this.getData()
      }
    },
  },
  created() {
    this.columns = [
      { title: this.L('打印机规则名称'), dataIndex: 'name' },
      { title: this.L('打印张数'), dataIndex: 'number' },
      { title: this.L('关联打印设备'), dataIndex: 'print_count' },
      { title: this.L('操作'), dataIndex: 'edit_btn', scopedSlots: { customRender: 'edit_btn' } },
    ]
  },
  mounted() {
    this.store_id = this.$route.query.store_id
    this.getData()
  },
  methods: {
    delTableType(id) {
      var _that = this
      var param = {}
      param.id = id
      param.store_id = this.$route.query.store_id

      this.$confirm({
        title: this.L('确定删除该打印机规则'),
        content: '',
        okText: this.L('确定'),
        okType: 'danger',
        cancelText: this.L('取消'),
        centered: true,
        onOk() {
          _that.request(foodshopMerchantApi.delPrintRule, param).then((res) => {
            _that.$message.success(_that.L('删除成功'))
            _that.getData()
          })
        },
      })
    },
    callback(key) {
      this.tabKey = key
      this.getData()
    },
    getData() {
      this.getPrintRuleList()
    },
    getPrintRuleList() {
      this.queryParam['store_id'] = this.store_id
      this.request(foodshopMerchantApi.getPrintRuleList, this.queryParam).then((res) => {
        this.printRuleList = res.list
        this.pagination.total = res.total_count
        console.log(this.pagination, 'this.pagination')
      })
    },
    handleTableChange(e) {
      if (e.current && e.current > 0) {
        this.queryParam['page'] = e.current
        this.getPrintRuleList()
      }
    },
  },
}
</script>
