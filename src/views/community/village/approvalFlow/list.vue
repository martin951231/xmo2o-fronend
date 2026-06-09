<template>
  <div class="approval-flow-page">
    <div class="search-box">
      <a-form layout="inline">
        <a-form-item label="业务类型">
          <a-select v-model="search.business_type_id" style="width: 220px" allowClear placeholder="请选择业务类型">
            <a-select-option v-for="item in businessTypes" :key="item.id" :value="item.id">
              {{ item.type_name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="search.status" style="width: 120px">
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="0">停用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="getList(true)">查询</a-button>
          <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.flowEdit.add()">新增审批流</a-button>
      <a-button style="margin-left: 8px" icon="setting" @click="goTypeConfig">业务类型配置</a-button>
    </div>
    <a-table
      rowKey="id"
      :columns="columns"
      :data-source="list"
      :pagination="pagination"
      :loading="loading"
      @change="tableChange">
      <span slot="business_type" slot-scope="text, record">
        {{ record.business_type_name || businessTypeMap[record.business_type_id] || text }}
      </span>
      <span slot="status" slot-scope="text">
        <a-tag :color="text == 1 ? 'green' : 'red'">{{ text == 1 ? '启用' : '停用' }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.flowEdit.edit(record.id)">编辑节点</a>
        <a-divider type="vertical" />
        <a-popconfirm
          :title="record.status == 1 ? '确认停用该审批流？' : '确认启用该审批流？'"
          @confirm="changeStatus(record)">
          <a>{{ record.status == 1 ? '停用' : '启用' }}</a>
        </a-popconfirm>
      </span>
    </a-table>
    <flow-edit ref="flowEdit" @ok="afterFlowSave" />
  </div>
</template>

<script>
import villageApi from '@/api/community/village'
import FlowEdit from './detail'

export default {
    name: 'ApprovalFlowList',
    components: {
        FlowEdit
    },
    data () {
        return {
            loading: false,
            search: {
                business_type_id: undefined,
                status: -1,
                page: 1,
                page_size: 10
            },
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            },
            list: [],
            businessTypes: [],
            columns: [
                { title: '流程名称', dataIndex: 'flow_name', key: 'flow_name' },
                { title: '业务类型', dataIndex: 'business_type', key: 'business_type', scopedSlots: { customRender: 'business_type' } },
                { title: '节点数', dataIndex: 'node_count', key: 'node_count', width: 100 },
                { title: '状态', dataIndex: 'status', key: 'status', width: 100, scopedSlots: { customRender: 'status' } },
                { title: '更新时间', dataIndex: 'update_time_text', key: 'update_time_text', width: 180 },
                { title: '操作', dataIndex: 'action', key: 'action', width: 180, scopedSlots: { customRender: 'action' } }
            ]
        }
    },
    computed: {
        businessTypeMap () {
            const map = {}
            this.businessTypes.forEach(item => {
                map[item.id] = item.type_name
            })
            return map
        }
    },
    mounted () {
        this.getBusinessTypes()
        this.getList(true)
    },
    methods: {
        getBusinessTypes () {
            this.request(villageApi.approvalBusinessTypeOptions, {}).then(res => {
                this.businessTypes = res.list || []
            })
        },
        getList (resetPage) {
            if (resetPage) {
                this.search.page = 1
                this.pagination.current = 1
            }
            this.loading = true
            this.request(villageApi.approvalFlowList, this.search).then(res => {
                this.list = res.list || []
                this.pagination.total = res.count || 0
                this.pagination.pageSize = res.page_size || this.search.page_size
            }).finally(() => {
                this.loading = false
            })
        },
        resetSearch () {
            this.search = {
                business_type_id: undefined,
                status: -1,
                page: 1,
                page_size: 10
            }
            this.getList(true)
        },
        tableChange (pagination) {
            this.search.page = pagination.current
            this.pagination.current = pagination.current
            this.getList(false)
        },
        changeStatus (record) {
            this.request(villageApi.approvalFlowStatus, {
                id: record.id,
                status: Number(record.status) === 1 ? 0 : 1
            }).then(() => {
                this.$message.success('操作成功')
                this.getList(false)
            })
        },
        afterFlowSave () {
            this.getBusinessTypes()
            this.getList(false)
        },
        goTypeConfig () {
            this.$router.push('/village/village.approvalflow/approvalflow_type')
        }
    }
}
</script>

<style scoped>
.approval-flow-page .search-box {
    margin-bottom: 16px;
}
.approval-flow-page .table-operator {
    margin-bottom: 16px;
}
</style>
