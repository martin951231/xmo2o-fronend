<template>
  <a-drawer
    :title="form.id ? '编辑审批流' : '新增审批流'"
    width="1000"
    :visible="visible"
    :confirmLoading="loading"
    @close="close">
    <a-form-model ref="formRef" :model="form" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
      <a-form-model-item label="流程名称" prop="flow_name">
        <a-input v-model="form.flow_name" placeholder="请输入流程名称" />
      </a-form-model-item>
      <a-form-model-item label="业务类型" prop="business_type_id">
        <a-select v-model="form.business_type_id" placeholder="请选择业务类型" :disabled="!!form.id">
          <a-select-option v-for="item in businessTypes" :key="item.id" :value="item.id">
            {{ item.type_name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="启用状态">
        <a-radio-group v-model="form.status">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="0">停用</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="审批节点" required>
        <a-alert
          type="info"
          show-icon
          message="审批按节点顺序一级级流转，所有启用节点全部通过后业务才生效。"
          style="margin-bottom: 12px" />
        <a-table
          class="approval-node-table"
          rowKey="node_key"
          :columns="nodeColumns"
          :data-source="form.nodes"
          :pagination="false"
          size="small">
          <span slot="node_name" slot-scope="text, record">
            <a-input v-model="record.node_name" class="node-name-input" placeholder="节点名称" />
          </span>
          <span slot="approver" slot-scope="text, record">
            <a-tree-select
              v-model="record.approver_wid"
              show-search
              :tree-data="workerTree"
              :tree-expanded-keys="workerExpandedKeys"
              :filterTreeNode="filterTreeNode"
              style="width: 100%"
              placeholder="请选择审批人"
              @treeExpand="onWorkerTreeExpand"
              @change="value => setApproverName(record, value)">
              <span
                slot="workerTreeTitle"
                slot-scope="node"
                class="approval-tree-title"
                @mousedown.stop.prevent
                @click.stop="toggleWorkerTreeNode(node)">
                {{ node.label || node.title }}
              </span>
            </a-tree-select>
          </span>
          <span slot="status" slot-scope="text, record">
            <a-switch checked-children="启用" un-checked-children="停用" :checked="record.status == 1" @change="checked => record.status = checked ? 1 : 0" />
          </span>
          <span slot="action" slot-scope="text, record, index" class="node-action-buttons">
            <a-button icon="arrow-up" size="small" :disabled="index == 0" @click="moveNode(index, -1)" />
            <a-button icon="arrow-down" size="small" :disabled="index == form.nodes.length - 1" @click="moveNode(index, 1)" />
            <a-popconfirm title="确认删除该节点？" @confirm="removeNode(index)">
              <a-button icon="delete" size="small" />
            </a-popconfirm>
          </span>
        </a-table>
        <a-button icon="plus" style="margin-top: 12px" @click="addNode">新增节点</a-button>
      </a-form-model-item>
    </a-form-model>
    <div class="drawer-footer">
      <a-button @click="close">取消</a-button>
      <a-button type="primary" :loading="loading" style="margin-left: 8px" @click="submit">保存</a-button>
    </div>
  </a-drawer>
</template>

<script>
import villageApi from '@/api/community/village'

const defaultForm = () => ({
    id: 0,
    flow_name: '',
    business_type_id: undefined,
    status: 1,
    nodes: []
})

export default {
    name: 'ApprovalFlowEdit',
    data () {
        return {
            visible: false,
            loading: false,
            form: defaultForm(),
            workers: [],
            workerTree: [],
            workerExpandedKeys: [],
            businessTypes: [],
            rules: {
                flow_name: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
                business_type_id: [{ required: true, message: '请选择业务类型', trigger: 'change' }]
            },
            nodeColumns: [
                { title: '顺序', customRender: (text, record, index) => index + 1, width: 50 },
                { title: '节点名称', dataIndex: 'node_name', key: 'node_name', width: 150, scopedSlots: { customRender: 'node_name' } },
                { title: '审批人', dataIndex: 'approver_wid', key: 'approver_wid', width: 250, scopedSlots: { customRender: 'approver' } },
                { title: '状态', dataIndex: 'status', key: 'status', width: 90, scopedSlots: { customRender: 'status' } },
                { title: '操作', dataIndex: 'action', key: 'action', width: 90, scopedSlots: { customRender: 'action' } }
            ]
        }
    },
    methods: {
        add () {
            this.form = defaultForm()
            this.visible = true
            this.getBusinessTypes()
            this.getWorkers()
            this.addNode()
        },
        edit (id) {
            this.form = defaultForm()
            this.visible = true
            this.getBusinessTypes()
            this.getWorkers()
            this.loading = true
            this.request(villageApi.approvalFlowDetail, { id }).then(res => {
                const info = res.info || {}
                this.form = Object.assign(defaultForm(), info, {
                    business_type_id: info.business_type_id ? Number(info.business_type_id) : undefined
                })
                this.form.nodes = (res.nodes || []).map((item, index) => ({
                    node_key: item.id || Date.now() + index,
                    id: item.id || 0,
                    node_name: item.node_name,
                    approver_wid: item.approver_wid,
                    approver_name: item.approver_name,
                    status: item.status
                }))
            }).finally(() => {
                this.loading = false
            })
        },
        close () {
            this.visible = false
        },
        getBusinessTypes () {
            this.request(villageApi.approvalBusinessTypeOptions, {}).then(res => {
                this.businessTypes = res.list || []
            })
        },
        getWorkers () {
            this.request(villageApi.approvalPropertyWorkers, { tokenName: 'village_access_token' }).then(res => {
                this.workers = res.list || []
                this.workerTree = this.normalizeWorkerTree(res.tree || [])
                this.workerExpandedKeys = []
            })
        },
        normalizeWorkerTree (tree) {
            return tree.map(item => {
                const node = Object.assign({}, item)
                if (!node.is_worker) {
                    node.label = node.title
                    node.title = ''
                    node.selectable = false
                    node.scopedSlots = Object.assign({}, node.scopedSlots, { title: 'workerTreeTitle' })
                }
                if (node.children && node.children.length) {
                    node.children = this.normalizeWorkerTree(node.children)
                }
                return node
            })
        },
        addNode () {
            this.form.nodes.push({
                node_key: Date.now() + Math.random(),
                id: 0,
                node_name: '',
                approver_wid: undefined,
                approver_name: '',
                status: 1
            })
        },
        removeNode (index) {
            this.form.nodes.splice(index, 1)
        },
        moveNode (index, step) {
            const targetIndex = index + step
            const node = this.form.nodes.splice(index, 1)[0]
            this.form.nodes.splice(targetIndex, 0, node)
        },
        setApproverName (record, value) {
            const worker = this.workers.find(item => Number(item.wid) === Number(value))
            record.approver_name = worker ? worker.name : ''
        },
        onWorkerTreeExpand (expandedKeys) {
            this.workerExpandedKeys = expandedKeys
        },
        toggleWorkerTreeNode (node) {
            const key = node.key || node.eventKey || node.value || (node.dataRef && node.dataRef.key) || (node.data && node.data.key)
            if (!key) {
                return
            }
            const expandedKeys = this.workerExpandedKeys.slice()
            const index = expandedKeys.indexOf(key)
            if (index > -1) {
                expandedKeys.splice(index, 1)
            } else {
                expandedKeys.push(key)
            }
            this.workerExpandedKeys = expandedKeys
        },
        filterTreeNode (input, treeNode) {
            const props = (treeNode && treeNode.data && treeNode.data.props) || (treeNode && treeNode.componentOptions && treeNode.componentOptions.propsData) || {}
            const title = props.title || ''
            return title.indexOf(input) > -1
        },
        submit () {
            this.$refs.formRef.validate(valid => {
                if (!valid) {
                    return
                }
                if (!this.form.nodes.length) {
                    this.$message.warning('请至少添加一个审批节点')
                    return
                }
                const invalid = this.form.nodes.some(item => !item.node_name || !item.approver_wid)
                if (invalid) {
                    this.$message.warning('请完善节点名称和审批人')
                    return
                }
                this.loading = true
                const data = Object.assign({}, this.form, {
                    nodes: this.form.nodes.map((item, index) => Object.assign({}, item, { sort: index + 1 }))
                })
                this.request(villageApi.approvalFlowSave, data).then(() => {
                    this.$message.success('保存成功')
                    this.visible = false
                    this.$emit('ok')
                }).finally(() => {
                    this.loading = false
                })
            })
        }
    }
}
</script>

<style scoped>
.drawer-footer {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
    border-top: 1px solid #e8e8e8;
}
.approval-tree-title {
    cursor: pointer;
}
.node-name-input {
    width: 130px;
}
.approval-node-table {
    max-width: 650px;
}
.approval-node-table >>> .ant-table {
    table-layout: fixed;
}
.approval-node-table >>> .ant-table-small > .ant-table-content > .ant-table-body {
    margin: 0;
}
.node-action-buttons {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
}
</style>
