<template>
  <a-drawer
    :title="title"
    :width="900"
    :visible="visible"
    v-if="visible"
    :maskClosable="false"
    :confirmLoading="loading"
    @close="handleCancel">
    <div style="background-color: white; padding-bottom: 50px;">
     <div class="order-list-box">
            <a-table
              :columns="columns"
              :data-source="data"
              class="components-table-demo-nested"
              :pagination="pagination">
            </a-table>
          </div>
    </div>
  </a-drawer>
</template>
<script>
  import villageApi from '@/api/community/village'
  import addBindInfo from './addBindInfo'
	import store from '@/store';
  const columns = [
    { title: store.getters.config.room_name+'号/车位号', dataIndex: 'numbers', key: 'numbers' },
    { title: '生成时间', dataIndex: 'time', key: 'time' },
    { title: '生成结果', dataIndex: 'status', key: 'status' },
    { title: '失败原因', dataIndex: 'fail_reason', key: 'fail_reason' },
  ]
  export default {
    name: 'OrderLogList',
    data () {
      return {
        title: '查看账单生成结果',
        ruleInfo: '',
        is_show: 1,
        show: true,
        dataId: 1,
        data: [],
        rule_id: 0,
      pagination: {
          current:1,
          pageSize: 10,
          total:10,
          showSizeChanger: true, // 显示可改变每页数量
          pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
          showTotal: total => `共 ${total} 条`, // 显示总数
          onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
          onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
      },
        search_data: [],
        search: { page: 1 },
        form: this.$form.createForm(this),
        visible: false,
        loading: false,
        columns,
        page: 1,
      }
    },
    components: {
      addBindInfo
    },
    mounted () {
        this.key = 1
    },
    computed: {
      // 表格选择操作
      rowSelection () {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
    },
    methods: {
      // 获取列表信息
      add (rule_id, key, charge_type='') {
        console.log("key==============>", key)
        this.loading = false
        this.visible = true
        this.rule_id = rule_id
        this.page=1;
        this.search['page'] = 1;
        console.log('key', this.key)
        this.data = []
        this.charge_type = charge_type
        console.log("this.charge_type======>", this.charge_type)
        this.getAddBindList()
      },
      // 获取列表信息
      getAddBindList () {
          this.search['page'] = this.page
          this.search['limit'] = this.pagination.pageSize
          this.search.rule_id = this.rule_id
          this.request('community/village_api.Cashier/getAutoOrderLogList', this.search)
            .then((res) => {
              console.log('res1=============>', res)
                this.pagination.total = res.count ? res.count : 0
                this.pagination.pageSize = res.total_limit ? res.total_limit : 0
                this.data = res.list
            })
      },

      handleCancel () {
        this.visible = false
        setTimeout(() => {
          this.rule_id = '0'
          this.form = this.$form.createForm(this)
        }, 500)
      },
      cancel () {},
        onTableChange(page,pageSize){
            this.page =page
            this.pagination.current = page
            this.pagination.pageSize = pageSize
            this.getAddBindList()
            console.log('onTableChange==>', page, pageSize)
        },
    }
  }
</script>
<style scoped>
.page_top{
    background-color: #e6f7ff;
    display: inline-block;
    width: 100%;
    padding: 20px 20px;
    margin-bottom: 20px;
    color: #666666;
}
</style>
