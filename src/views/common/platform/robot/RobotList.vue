<template>
  <div id="components-layout-demo-basic" style="margin: 24px 0 0">
    <a-page-header title="机器人管理" style="padding: 0 0 16px 0">
      <template slot="extra">
        <a-button type="primary" icon="plus" @click="$refs.RobotEditModal.add()">添加机器人</a-button>
      </template>
      <div style="color: #999">提供各业务所需数据</div>
    </a-page-header>
    <a-card>
      <a-table
        :columns="columns"
        :data-source="robotList"
        @change="tableChange"
        rowKey="id"
        :loading="loading"
        :pagination="pagination"
      >
        <span slot="avatar" slot-scope="text">
          <div class="img-wrap">
            <img class="goods-image" :src="text" />
          </div>
        </span>
        <span slot="action" slot-scope="text, record">
          <a-popconfirm
            class="ant-dropdown-link"
            title="确认删除?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="deleteRobot(record.id)"
            @cancel="cancel"
          >
            <a-button type="link">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>
    </a-card>
    <robot-edit ref="RobotEditModal" @ok="handleOk" />
  </div>
</template>

<script>
import robotPlatformApi from '@/api/common/platform/robot'
import robotEdit from './RobotEdit'

const selectedRowKeys = []
export default {
  name: 'robotList',
  components: { robotEdit },
  data() {
    return {
      form: this.$form.createForm(this),
      // 查询参数
      queryParam: {
        page: 1,
      },
      // 表头
      columns: [
        {
          title: '编号',
          dataIndex: 'id',
          width: '15%',
        },
        {
          title: '机器人名称',
          dataIndex: 'name',
          width: '20%',
        },
        {
          title: '机器人头像  ',
          width: '20%',
          dataIndex: 'avatar',
          scopedSlots: { customRender: 'avatar' },
        },
        {
          title: '添加时间',
          dataIndex: 'create_time',
          width: '20%',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '20%',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
      pagination: {
        pageSize: 10,
        total: 0,
        'show-total': (total) => `共 ${total} 条记录`,
        'show-quick-jumper': true,
      },
      selectedRowKeys,
      robotList: [],
      loading: false,
    }
  },
  created() {},
  mounted() {
    this.getRobotList()
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
  },
  methods: {
    // 获得列表
    getRobotList() {
      this.loading = true
      this.request(robotPlatformApi.getRobotList, this.queryParam).then((res) => {
        this.robotList = res.list
        this.pagination.total = res.total
        this.loading = false
      })
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    deleteRobot(id) {
      this.request(robotPlatformApi.delRobot, { id: id }).then((res) => {
        this.getRobotList()
        this.$message.success('删除成功')
      })
    },
    // 表格中变动
    tableChange(e) {
      if (e.current && e.current > 0) {
        this.queryParam['page'] = e.current
        this.getRobotList()
      }
    },
    cancel() {},
    handleOk() {
      this.getRobotList()
    },
  },
}
</script>
<style scoped>
.goods-image {
  width: 48px;
  margin-right: 5px;
  height: 48px;
  border-radius: 4px;
}
.img-wrap {
  position: relative;
}
</style>
