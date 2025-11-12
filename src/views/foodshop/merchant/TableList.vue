<template>
  <div>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" :tab="L('桌台类型列表')" style="background: #fff">
        <a-button type="primary" style="margin: 10px 20px" @click="$refs.editTableTypeModal.addType()">{{
          L('新建桌台类型')
        }}</a-button>
        <a-table style="background: #ffffff" :columns="tableTypeColumn" rowKey="id" :data-source="tableTypeData">
          <span slot="people" slot-scope="text, record"
            >{{ record.min_people }}-{{ record.max_people }}{{ L('人') }}</span
          >
          <span slot="table_type_btn" slot-scope="text, record">
            <span style="color: #1890ff; cursor: pointer" @click="$refs.editTableTypeModal.editType(record.id)">{{
              L('编辑')
            }}</span
            >&nbsp;|&nbsp;<span style="cursor: pointer" @click="delTableType(record.id)">{{ L('删除') }}</span>
          </span>
        </a-table>
        <edit-table-type ref="editTableTypeModal" @updateTableTypeList="getData" />
      </a-tab-pane>

      <a-tab-pane key="2" :tab="L('桌台列表')" force-render style="background: #fff">
        <a-button type="primary" style="margin: 10px 20px" @click="$refs.editTableModal.addTable()">{{
          L('新建桌台')
        }}</a-button>
        <a-button class="icon_btn" @click="$refs.showTableQrcodeModal.showModal(store_id, selectedRowKeys)">{{
          L('下载桌台码')
        }}</a-button>
        <a-table
          style="background: #ffffff"
          :columns="tableColumn"
          rowKey="id"
          :data-source="tableData"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
          
          <span slot="table_btn" slot-scope="text, record2">
            <span style="color: #1890ff; cursor: pointer" @click="$refs.editTableModal.editTable(record2.id)">{{
              L('编辑')
            }}</span
            >&nbsp;|&nbsp;<span style="cursor: pointer" @click="delTable(record2.id)">{{ L('删除') }}</span>
          </span>
        </a-table>
        <edit-table ref="editTableModal" @updateTableList="getData" />
      </a-tab-pane>
    </a-tabs>
    <show-table-qrcode ref="showTableQrcodeModal" />
  </div>
</template>
<style type="text/css">
.icon_btn {
  margin-right: 1rem;
  border-color: #1890ff;
  color: #1890ff;
}
.del_center {
  top: 35%;
}
</style>
<script>
import foodshopMerchantApi from '@/api/foodshop/merchant'
import EditTableType from '../modules/merchant/EditTableType.vue'
import EditTable from '../modules/merchant/EditTable.vue'
// import ShowStoreQrcode from "@/views/foodshop/modules/merchant/ShowStoreQrcode";
import ShowTableQrcode from '../modules/merchant/ShowTableQrcode.vue'
const tableTypeColumn = []
const tableColumn = []
export default {
  components: {
    EditTableType,
    EditTable,
    ShowTableQrcode,
  },
  data() {
    return {
      tabKey: 1,
      store_id: 0,
      queryParam: {
        store_id: 0,
      },
      tableTypeData: [],
      tableData: [],

      isAllCheck: false,

      tableTypeColumn,
      tableColumn,
      selectedRowKeys: [], //选中的行
    }
  },
  created() {
    this.tableTypeColumn = [
      { title: this.L('ID'), dataIndex: 'id' },
      { title: this.L('桌台类型'), dataIndex: 'name' },
      { title: this.L('桌台数'), dataIndex: 'num' },
      { title: this.L('容纳人数'), dataIndex: 'people', scopedSlots: { customRender: 'people' } },
      { title: this.L('预订金'), dataIndex: 'deposit' },
      { title: this.L('排号前缀'), dataIndex: 'number_prefix' },
      { title: this.L('排序（值越大越靠前显示）'), dataIndex: 'sort' },
      { title: this.L('使用时间'), dataIndex: 'use_time' },
      { title: this.L('操作'), dataIndex: 'table_type_btn', scopedSlots: { customRender: 'table_type_btn' } },
    ]
    this.tableColumn = [
      { title: this.L('ID'), dataIndex: 'id' },
      { title: this.L('桌台类型'), dataIndex: 'type_name' },
      { title: this.L('桌号'), dataIndex: 'name' },
      { title: this.L('排序（值越大越靠前显示）'), dataIndex: 'sort' },
      { title: this.L('操作'), dataIndex: 'table_btn', scopedSlots: { customRender: 'table_btn' } },
    ]
  },
  mounted() {
    this.store_id = this.$route.query.store_id
    this.getData()
  },
  watch: {
    $route() {
      if (this.$route.path == '/merchant/merchant.foodshop/tableList' && this.$route.query.store_id != undefined) {
        this.getData()
      }
    },
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
  },
  methods: {
    start() {
      setTimeout(() => {
        this.selectedRowKeys = []
      }, 1000)
    },
    onSelectChange(selectedRowKeys) {
      console.log(selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    allCheck(v) {
      console.log(this.allCheck())
    },

    delTableType(id) {
      var _that = this
      var param = {}
      param.id = id
      param.store_id = this.$route.query.store_id

      this.$confirm({
        title: this.L('确定删除该桌台类型?'),
        content: '',
        okText: this.L('确定'),
        okType: 'danger',
        class: 'del_center',
        cancelText: this.L('取消'),
        onOk() {
          _that.request(foodshopMerchantApi.delTableType, param).then((res) => {
            _that.$message.success(_that.L('删除成功'))
            _that.getData()
          })
        },
      })
    },
    delTable(id) {
      var _that = this
      var param = {}
      param.id = id
      param.store_id = this.$route.query.store_id
      this.$confirm({
        title: this.L('确定删除该桌台?'),
        content: '',
        okText: this.L('确定'),
        class: 'del_center',
        okType: 'danger',
        cancelText: this.L('取消'),
        onOk() {
          _that.request(foodshopMerchantApi.delTable, param).then((res) => {
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
      if (this.tabKey == 1) {
        //获取桌台类型
        this.getTableTypeList()
      } else {
        //获取桌台列表
        this.getTableList()
      }
    },
    getTableTypeList() {
      this.queryParam['store_id'] = this.$route.query.store_id
      this.request(foodshopMerchantApi.tableTypeList, this.queryParam).then((res) => {
        this.tableTypeData = res
      })
    },
    getTableList() {
      this.queryParam['store_id'] = this.$route.query.store_id
      this.request(foodshopMerchantApi.tableList, this.queryParam).then((res) => {
        this.tableData = res
      })
    },
  },
}
</script>
