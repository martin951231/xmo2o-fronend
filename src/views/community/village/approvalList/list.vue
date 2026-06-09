<template>
  <div class="approval-list-page">
    <div class="search-box">
      <a-form layout="inline">
        <a-form-item label="列表类型">
          <a-radio-group v-model="search.scope" button-style="solid" @change="getList(true)">
            <a-radio-button value="all">全部</a-radio-button>
            <a-radio-button value="todo">待我审批</a-radio-button>
            <a-radio-button value="reviewed">我已审批</a-radio-button>
            <a-radio-button value="mine">我发起的</a-radio-button>
          </a-radio-group>
        </a-form-item>
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
            <a-select-option :value="0">审批中</a-select-option>
            <a-select-option :value="1">已通过</a-select-option>
            <a-select-option :value="2">已驳回</a-select-option>
            <a-select-option :value="3">已撤回</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="getList(true)">查询</a-button>
          <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
        </a-form-item>
      </a-form>
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
        <a-tag :color="statusColor[text]">{{ statusMap[text] || text }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.approvalDetail.open(record.id)">详情</a>
        <template v-if="record.can_approve">
          <a-divider type="vertical" />
          <a @click="$refs.approvalDetail.open(record.id)">审批</a>
        </template>
      </span>
    </a-table>
    <approval-detail ref="approvalDetail" @ok="getList(false)" />
  </div>
</template>

<script>
import villageApi from '@/api/community/village'
import ApprovalDetail from './detail'

export default {
    name: 'ApprovalList',
    components: {
        ApprovalDetail
    },
    data () {
        return {
            loading: false,
            search: {
                scope: 'todo',
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
            statusMap: {
                0: '审批中',
                1: '已通过',
                2: '已驳回',
                3: '已撤回'
            },
            statusColor: {
                0: 'blue',
                1: 'green',
                2: 'red',
                3: 'orange'
            },
            columns: [
                { title: '审批编号', dataIndex: 'id', key: 'id', width: 90 },
                { title: '标题', dataIndex: 'title', key: 'title' },
                { title: '业务类型', dataIndex: 'business_type', key: 'business_type', scopedSlots: { customRender: 'business_type' } },
                { title: '发起人', dataIndex: 'apply_name', key: 'apply_name', width: 120 },
                { title: '当前节点', dataIndex: 'current_node_name', key: 'current_node_name', width: 140 },
                { title: '状态', dataIndex: 'status', key: 'status', width: 110, scopedSlots: { customRender: 'status' } },
                { title: '发起时间', dataIndex: 'add_time_text', key: 'add_time_text', width: 180 },
                { title: '操作', dataIndex: 'action', key: 'action', width: 140, scopedSlots: { customRender: 'action' } }
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
            this.request(villageApi.approvalInstanceList, this.search).then(res => {
                this.list = res.list || []
                this.pagination.total = res.count || 0
                this.pagination.pageSize = res.page_size || this.search.page_size
            }).finally(() => {
                this.loading = false
            })
        },
        resetSearch () {
            this.search = {
                scope: 'todo',
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
        }
    }
}
</script>

<style scoped>
.approval-list-page .search-box {
    margin-bottom: 16px;
}
</style>
