<template>
  <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0">
    <a-card :bordered="false">
      <a-tabs default-active-key="spread" @change="tabsChange">
        <a-tab-pane key="spread" tab="排行榜数据"> </a-tab-pane>
        <a-tab-pane key="visit" tab="参与人数" force-render> </a-tab-pane>
        <a-tab-pane key="buy" tab="购买人数" force-render> </a-tab-pane>
      </a-tabs>
      <div class="message-suggestions-list-box">
        <div class="button-content">
          <a-button
            type="primary"
            style="margin-right: 20px"
            @click="$refs.GroupCombineAddRobotModel.add(queryParam.combine_id, queryParam.type)"
            >导入数据</a-button
          >
          <a-button type="danger" :disabled="selectedRowKeys.length == 0" @click="deleteRobot">删除</a-button>
        </div>
        <a-table
          :columns="columns"
          :data-source="data"
          rowKey="id"
          class="components-table-demo-nested"
          :pagination="pagination"
          @change="tableChange"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          style="min-height: 700px"
        >
          <span slot="avatar" slot-scope="text"> <img :src="text" class="image" alt="" /> </span>
          <template v-for="col in ['spread_num']" slot="spread_num" slot-scope="text, record">
            <div :key="col">
              <a-input
                v-if="record.editable"
                style="margin: -5px 2px; width: 56px"
                :value="text"
                @change="(e) => handleChangeSpreadNum(e.target.value, record.id, col)"
              />
              <template v-else>{{ text }}</template>
              <span class="editable-row-operations">
                <span v-if="record.editable">
                  <a @click="() => saveSpreadNum(record.id)">保存</a>
                  <a-divider type="vertical" />
                  <a @click="() => cancelSpreadNum(record.id, record.spread_num, col)">取消</a>
                </span>
                <span v-else>
                  <a
                    :disabled="editingKey !== ''"
                    @click="() => editSpreadNum(record.id, record.spread_num)"
                    style="margin-left: 4px"
                    >编辑</a
                  >
                </span>
              </span>
            </div>
          </template>
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
      </div>
      <group-combine-add-robot ref="GroupCombineAddRobotModel" @handleUpdate="handleUpdate" />
    </a-card>
  </div>
</template>

<script>
import GroupPlatformApi from '@/api/group/platform'
import Vue from 'vue'
import GroupCombineAddRobot from './GroupCombineAddRobot.vue'
import groupPlatformApi from '@/api/group/platform'
const data = []
export default {
  name: 'GroupCombineList',
  components: { GroupCombineAddRobot },
  data() {
    this.cacheData = data.map((item) => ({
      ...item,
    }))
    return {
      // 查询参数
      queryParam: {
        type: 'spread',
        idArr: [],
      },
      pagination: {
        pageSize: 10,
        total: 0,
        'show-total': (total) => `共 ${total} 条记录`,
        'show-quick-jumper': true,
      },
      data,
      page: 1,
      selectedRowKeys: [],
      oldSpreadNum: 0,
      editingKey: '',
      // 表头
      columns: [
        {
          title: '编号',
          dataIndex: 'id',
          width: '8%',
        },
        {
          title: '用户名',
          dataIndex: 'user_name',
          width: '15%',
        },
        {
          title: '用户头像',
          dataIndex: 'avatar',
          width: '15%',
          scopedSlots: {
            customRender: 'avatar',
          },
        },
        {
          title: '推荐人数',
          dataIndex: 'spread_num',
          width: '20%',
          scopedSlots: {
            customRender: 'spread_num',
          },
        },
        {
          title: '所赚佣金',
          dataIndex: 'spread_money',
          width: '20%',
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '25%',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
    }
  },
  created() {},
  mounted() {
    this.queryParam['combine_id'] = this.$route.query.id
    this.getList()
  },
  watch: {
    $route() {
      this.queryParam['combine_id'] = this.$route.query.id
      this.getList()
    },
  },
  methods: {
    // 获取列表信息
    getList() {
      this.queryParam['page'] = this.page
      if (this.queryParam['combine_id'] > 0) {
        this.request(GroupPlatformApi.getRobotList, this.queryParam).then((res) => {
          this.data = res.list
          this.pagination.total = res.total
        })
      }
    },
    deleteRobot(id = '0') {
      if (id > 0) {
        this.queryParam['idArr'] = [id]
      } else {
        this.queryParam['idArr'] = this.selectedRowKeys
      }
      if (this.queryParam['idArr'].length <= 0) {
        this.$message.error('请选择数据')
      }
      this.request(GroupPlatformApi.delRobot, this.queryParam).then((res) => {
        this.$message.success('删除成功')
        this.getList()
      })
    },
    // 表格中变动  这里只针对页面页数切换
    tableChange(e, filters, sorter) {
      // 分页
      this.queryParam['pageSize'] = e.pageSize
      this.queryParam['page'] = e.current

      if (e.current && e.current > 0) {
        this.page = e.current
      }
      this.getList()
    },
    handleUpdate() {
      this.getList()
    },
    cancel() {},
    // 选中操作
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 切换不同类型的机器人
    tabsChange(value) {
      this.queryParam['type'] = value
      switch (value) {
        case 'spread':
          this.columns = [
            {
              title: '编号',
              dataIndex: 'id',
              width: '8%',
            },
            {
              title: '用户名',
              dataIndex: 'user_name',
              width: '15%',
            },
            {
              title: '用户头像',
              dataIndex: 'avatar',
              width: '15%',
              scopedSlots: {
                customRender: 'avatar',
              },
            },
            {
              title: '推荐人数',
              dataIndex: 'spread_num',
              width: '12%',
              scopedSlots: {
                customRender: 'spread_num',
              },
            },
            {
              title: '所赚佣金',
              dataIndex: 'spread_money',
              width: '20%',
            },
            {
              title: '操作',
              dataIndex: 'action',
              width: '25%',
              scopedSlots: {
                customRender: 'action',
              },
            },
          ]
          break
        case 'visit':
          this.columns = [
            {
              title: '编号',
              dataIndex: 'id',
              width: '15%',
            },
            {
              title: '用户名',
              dataIndex: 'user_name',
              width: '30%',
            },
            {
              title: '用户头像',
              dataIndex: 'avatar',
              width: '30%',
              scopedSlots: {
                customRender: 'avatar',
              },
            },
            {
              title: '操作',
              dataIndex: 'action',
              width: '25%',
              scopedSlots: {
                customRender: 'action',
              },
            },
          ]
          break
        case 'buy':
          this.columns = [
            {
              title: '编号',
              dataIndex: 'id',
              width: '8%',
            },
            {
              title: '用户名',
              dataIndex: 'user_name',
              width: '15%',
            },
            {
              title: '用户头像',
              dataIndex: 'avatar',
              width: '20%',
              scopedSlots: {
                customRender: 'avatar',
              },
            },
            {
              title: '支付金额',
              dataIndex: 'price',
              width: '20%',
            },
            {
              title: '操作',
              dataIndex: 'action',
              width: '25%',
              scopedSlots: {
                customRender: 'action',
              },
            },
          ]
          break
      }
      this.getList()
    },

    // 编辑推荐人数
    handleChangeSpreadNum(value, id, column) {
      const newData = [...this.data]
      const target = newData.filter((item) => id === item.id)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    // 编辑推荐人数
    editSpreadNum(id, spreadNum) {
      const newData = [...this.data]
      const target = newData.filter((item) => id === item.id)[0]
      this.editingKey = id
      this.oldSpreadNum = spreadNum
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    // 保存排序
    saveSpreadNum(id) {
      const newData = [...this.data]
      const newCacheData = [...this.cacheData]
      const target = newData.filter((item) => id === item.id)[0]
      const targetCache = newCacheData.filter((item) => id === item.id)[0]
      if (target) {
        delete target.editable
        this.data = newData
        Object.assign(target, this.cacheData.filter((item) => id === item.id)[0])
        this.cacheData = newCacheData
      }
      this.request(groupPlatformApi.editSpreadNum, {
        type: 1,
        id: target.id,
        spread_num: target.spread_num,
      }).then((res) => {
        this.getList()
      })
      this.editingKey = ''
    },
    // 取消排序
    cancelSort(id, spreadNum, column) {
      const newData = [...this.data]
      const target = newData.filter((item) => id === item.id)[0]
      this.editingKey = ''
      if (target) {
        target[column] = this.oldSpreadNum
        this.oldSpreadNum = 0
        Object.assign(target, this.cacheData.filter((item) => id === item.id)[0])
        delete target.editable
        this.data = newData
      }
    },
  },
}
</script>
<style lang="less" scoped>
.image {
  width: 48px;
  margin-right: 5px;
  height: 48px;
  border-radius: 4px;
}
.button-content {
  padding: 12px 0;
}
</style>
