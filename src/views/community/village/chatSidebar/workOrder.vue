<template>
  <div class="message-suggestions-list-box">
    <a-table
      :columns="columns"
      :data-source="data"
      class="components-table-demo-nested"
      :pagination="pagination"
      rowKey="id"
      @change='table_change'
      :loading="loading"
    >
      <span slot="status_txt" slot-scope="text, record">
        <span :style="'color:'+record.color ">{{record.status_txt}}</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.PopupEditModel.info(record.order_id)">详情</a>
      </span>
    </a-table>
    <workOrderInfo ref="PopupEditModel"/>
  </div>
</template>
<script>
import villageApi from "@/api/community/village"
import workOrderInfo from './workOrderInfo'

const columns = [
  { title: '序号', dataIndex: 'order_id' },
  { title: '工单详情', dataIndex: 'order_content' },
  { title: '工单类目', dataIndex: 'subject_name' },
  { title: '上报分类', dataIndex: 'cate_name' },
  { title: '上报位置', dataIndex: 'address_txt' },
  { title: '上报人员', dataIndex: 'name' },
  { title: '手机号码', dataIndex: 'phone' },
  { title: '上报时间', dataIndex: 'add_time_txt' },
  { title: '状态  ', dataIndex: 'status_txt', scopedSlots: { customRender: 'status_txt' } },
  { title: '操作', dataIndex: 'operation', scopedSlots: { customRender: 'action' } }
]
const data = []
export default {
  name: 'workOrder',
  components: {
    workOrderInfo
  },
  data () {
    return {
      pagination: { current: 1, pageSize: 10, total: 10 },
      search: { page: 1 },
      loading: false,
      data,
      columns
    }
  },
  props: {
    pigcmsId: {
      type: Number,
      default: 0
    },
    usernum: {
      type: String,
      default: ''
    }
  },
  created () {
    this.getList(1)
  },
  methods: {
    // 获取列表信息
    getList (t = 0) {
      this.loading = true
      if (t === 1) {
        this.$set(this.pagination, 'current', 1)
      }
      this.search['page'] = this.pagination.current
      this.search['pigcms_id'] = this.pigcmsId
      this.request(villageApi.getWorkOrderList, this.search)
        .then((res) => {
          console.log(res)
          this.pagination.total = res.count ? res.count : 0
          this.pagination.pageSize = res.total_limit ? res.total_limit : 10
          this.data = res.list
          this.loading = false
        })
    },
    // 表格中变动  这里只针对页面页数切换
    table_change (e) {
      let that = this
      if (e.current && e.current > 0) {
        that.$set(that.pagination, 'current', e.current)
        that.getList()
      }
    }
  }
}
</script>
<style>
.statistical_data{
  margin: 20px 20px;
  padding: 14px 0;
  text-align: center;
  background-color: #eee;
  font-size: 14px;
}
.statistical_fir_p{
  font-size: 16px;
}
.statistical_data p{
  margin: 0 0;
}
.tab_list{
  padding: 14px 0;
  text-align: center;
  font-size: 14px;
  border: 1px solid #ccc;
}
</style>