<template>
  <div class="activity-list">
    <div class="title-con">
      <div class="title">活动管理</div>
      <div class="desc">创建埋点活动，设置用户进入企业微信群的入口，引导用户加群，构建私域流量</div>
    </div>
    <div class="oprate">
      <a-button @click="editActivity()" type="primary" icon="plus"> 新建 </a-button>
      <a-button @click="removeActivity()" type="danger" icon="close" style="margin-left: 10px"> 删除 </a-button>
    </div>
    <a-card class="content" :bordered="false">
      <a-table
        rowKey="id"
        :pagination="pagination"
        :columns="columns"
        :data-source="activityList"
        :row-selection="rowSelection"
        @change="handleTableChange"
      >
        <span slot="area" slot-scope="text, record">
          <a v-if="text == 1" @click="selectArea(record)">指定区域</a>
          <span v-else>所有区域</span>
        </span>
        <span slot="store" slot-scope="text, record">
          <a v-if="text == 1" @click="selectStore(record)">指定店铺</a>
          <span v-else>所有店铺</span>
        </span>
        <span slot="status" slot-scope="text">
          <a v-if="text == 1" style="cursor: default">开启</a>
          <span v-else>关闭</span>
        </span>
        <span slot="action" slot-scope="text">
          <a @click="editActivity(text)">编辑</a>
          <a-divider type="vertical" />
          <a @click="removeActivity(text)">删除</a>
        </span>
      </a-table>
    </a-card>
    <select-area ref="selectArea" :detail="detail" :areaList="areaList" @submit="getActivityList" />
    <select-store ref="selectStore" :detail="detail" @submit="getActivityList"></select-store>
  </div>
</template>
<script>
import privateFlowApi from '@/api/common/priviteflow'
import SelectArea from './modules/SelectArea.vue'
import SelectStore from './modules/SelectStore.vue'
const columns = [
  {
    dataIndex: 'id',
    key: 'id',
    title: '编号',
  },
  {
    dataIndex: 'name',
    key: 'name',
    title: '活动名称',
  },
  {
    dataIndex: 'create_time',
    key: 'create_time',
    title: '添加时间',
  },
  {
    dataIndex: 'is_point_area',
    key: 'is_point_area',
    title: '使用区域',
    scopedSlots: { customRender: 'area' },
  },
  {
    dataIndex: 'is_point_store',
    key: 'is_point_store',
    title: '使用店铺',
    scopedSlots: { customRender: 'store' },
  },
  {
    dataIndex: 'status',
    key: 'status',
    title: '状态',
    scopedSlots: { customRender: 'status' },
  },
  {
    dataIndex: 'id',
    key: 'action',
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  name: 'CommonPrivateFlowActivityList',
  components: { SelectArea, SelectStore },
  data() {
    return {
      columns,
      activityList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      selectedRowKeys: [],
      detail: {},
      areaList: [],
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
  activated() {
    this.getActivityList()
  },
  created() {
    this.getAreaList()
  },
  mounted() {},
  methods: {
    getActivityList() {
      this.request(privateFlowApi.getActivityList, {
        page: this.pagination.current,
        page_size: this.pagination.pageSize,
      }).then((data) => {
        this.activityList = data.list
        this.$set(this.pagination, 'total', data.total)
      })
    },
    handleTableChange(pagination) {
      console.log(pagination)
      this.$set(this.pagination, 'current', pagination.current)
      this.getActivityList()
    },
    handleRowSelectChange(selectedRowKeys) {
      console.log(selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    selectArea(record) {
      this.detail = record
      this.$refs.selectArea.openDrawer()
    },
    selectStore(record) {
      this.detail = record
      this.$refs.selectStore.openDrawer()
    },
    getAreaList() {
      this.request(privateFlowApi.getAllArea).then((data) => {
        this.areaList = data
      })
    },
    editActivity(id) {
      let url = '/common/platform.privateflow/activityEdit'
      if (id) {
        url = url + '?id=' + id
      }
      this.$router.push(url)
    },
    removeActivity(id) {
      let ids = []
      if (id) {
        ids = [id]
      } else {
        ids = this.selectedRowKeys
      }
      if(!ids.length) {
        this.$message.warning('请先选择要删除的活动~')
        return
      }
      const modal = this.$confirm({
        title: '确定要删除选择的活动吗?',
        centered: true,
        onOk: () => {
          this.request(privateFlowApi.delActivity, { ids }).then((data) => {
            this.$message.success('删除成功！')
            this.getActivityList()
            modal.destroy()
          })
        },
      })
      console.log(ids)
    },
  },
}
</script>
<style lang="less" scoped>
.activity-list {
  padding: 10px;
  .title-con {
    .title {
      color: #333333;
      font-size: 28px;
      font-weight: bold;
    }
    .desc {
      color: #999999;
      font-size: 16px;
      line-height: 40px;
    }
  }
  .oprate {
    margin-top: 10px;
  }
  .content {
    margin-top: 10px;
  }
}
</style>