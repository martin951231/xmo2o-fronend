<template>
  <div class="message-suggestions-list-box">
    <div class="add-box">
      <a-row :gutter="48">
        <a-col :md="8" :sm="24">
          <a-button type="primary" @click="$refs.PopupAddModel.add()">
            添加
          </a-button>
        </a-col>
      </a-row>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      class="components-table-demo-nested"
      :pagination="pagination"
      rowKey="id"
      @change='table_change'
      :loading="loading"
    >
            <span slot="status" slot-scope="text, record">
                <div v-if="record.status == 1" style="color: red;">关闭</div>
                <div v-if="record.status == 0" style="color: #1890ff;">开启</div>
            </span>
      <span slot="action" slot-scope="text, record">
                <a @click="$refs.PopupEditModel.edit(record.id)">编辑</a>
        <a-divider type="vertical"/>
                <a @click="delUserLabel(record.id)">删除</a>
            </span>
    </a-table>
        <userLabelInfo ref="PopupAddModel" @ok="addActive"/>
        <userLabelInfo ref="PopupEditModel" @ok="editActive"/>
  </div>
</template>
<script>
import villageApi from '@/api/community/village'
import userLabelInfo from './userLabelInfo'
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '标签类型', dataIndex: 'label_type', key: 'label_type' },
  { title: '标签名称', dataIndex: 'label_name', key: 'label_name' },
  { title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' } },
  { title: '添加时间', dataIndex: 'create_at', key: 'create_at' },
  { title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' } }
]
const data = []
export default {
  name: 'userLabelList',
  filters: {},
  components: {
    userLabelInfo
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
  activated () {
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
      this.request(villageApi.getUserLabelList, this.search)
        .then((res) => {
          this.pagination.total = res.count ? res.count : 0
          this.pagination.pageSize = res.total_limit ? res.total_limit : 10
          this.data = res.list
          this.loading = false
        })
    },
    // 添加
    addActive (val) {
      this.getList(1)
    },
    // 编辑
    editActive (val) {
      this.getList()
    },

    // 删除
    delUserLabel (val) {
      console.log('标签ID---' + val)
      this.request(villageApi.changeUserLabel, { id: val, type: 'del' })
        .then((res) => {
          this.$message.success('删除成功')
          this.getList()
        })
    },

    // 表格中变动  这里只针对页面页数切换
    table_change (e) {
      let _this = this
      console.log('e', e)
      if (e.current && e.current > 0) {
        _this.$set(_this.pagination, 'current', e.current)
        _this.getList()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.message-suggestions-list-box {
  margin: 30px 20px;
  background-color: white;
}

.message-suggestions-list-box .search-box {
  padding: 20px 20px 0;
}

.message-suggestions-list-box .add-box {
  padding: 20px 20px 0;
}

.message-suggestions-list-box .components-table-demo-nested {
  padding: 20px;
}

.message-suggestions-list-box .message_box {
  padding: 20px;
}

.lbsf {
  float: right;
  margin-right: 24px;
}
</style>