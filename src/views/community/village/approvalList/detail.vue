<template>
  <a-modal
    title="审批详情"
    width="860px"
    :visible="visible"
    :confirmLoading="loading"
    :footer="null"
    @cancel="close">
    <a-spin :spinning="loading">
      <a-descriptions bordered size="small" :column="2" v-if="info.id">
        <a-descriptions-item label="审批编号">{{ info.id }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="statusColor[info.status]">{{ statusMap[info.status] }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="标题" :span="2">{{ info.title }}</a-descriptions-item>
        <a-descriptions-item label="业务类型">{{ info.business_type_name || businessTypeMap[info.business_type] || info.business_type }}</a-descriptions-item>
        <a-descriptions-item label="当前节点">{{ info.current_node_name || '-' }}</a-descriptions-item>
        <a-descriptions-item label="发起人">{{ info.apply_name || '-' }}</a-descriptions-item>
        <a-descriptions-item label="发起时间">{{ info.add_time_text }}</a-descriptions-item>
        <a-descriptions-item label="申请说明" :span="2">{{ info.apply_remark || info.apply_reason || '-' }}</a-descriptions-item>
        <a-descriptions-item label="变更内容" :span="2">
          <pre class="change-content">{{ info.change_content_text || '-' }}</pre>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider orientation="left">审批节点</a-divider>
      <a-timeline>
        <a-timeline-item v-for="node in nodes" :key="node.id" :color="nodeColor(node.status)">
          <div class="node-line">
            <strong>第 {{ node.sort }} 级：{{ node.node_name }}</strong>
            <a-tag style="margin-left: 8px">{{ node.status_text }}</a-tag>
          </div>
          <div>审批人：{{ node.approver_name }}</div>
          <div v-if="node.approve_time_text">审批时间：{{ node.approve_time_text }}</div>
          <div v-if="node.remark">备注：{{ node.remark }}</div>
        </a-timeline-item>
      </a-timeline>
      <template v-if="info.can_approve || info.can_withdraw">
        <a-divider />
        <a-form-model :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item label="审批备注" v-if="info.can_approve">
            <a-textarea v-model="remark" placeholder="请输入审批备注" :rows="3" />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 20, offset: 3 }">
            <a-button type="primary" v-if="info.can_approve" :loading="actionLoading" @click="submitAction('pass')">通过</a-button>
            <a-button type="danger" v-if="info.can_approve" :loading="actionLoading" style="margin-left: 8px" @click="submitAction('reject')">驳回</a-button>
            <a-button v-if="info.can_withdraw" :loading="actionLoading" style="margin-left: 8px" @click="submitAction('withdraw')">撤回</a-button>
          </a-form-model-item>
        </a-form-model>
      </template>
    </a-spin>
  </a-modal>
</template>

<script>
import villageApi from '@/api/community/village'

export default {
    name: 'ApprovalDetail',
    data () {
        return {
            visible: false,
            loading: false,
            actionLoading: false,
            info: {},
            nodes: [],
            remark: '',
            businessTypeMap: {
                service_time_change: '调整物业服务时间',
                delivery_time_change: '调整交房时间',
                bill_amount_change: '修改账单金额'
            },
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
            }
        }
    },
    methods: {
        open (id) {
            this.visible = true
            this.remark = ''
            this.getDetail(id)
        },
        close () {
            this.visible = false
        },
        getDetail (id) {
            this.loading = true
            this.request(villageApi.approvalInstanceDetail, { id }).then(res => {
                this.info = res.info || {}
                this.nodes = res.nodes || []
            }).finally(() => {
                this.loading = false
            })
        },
        nodeColor (status) {
            if (Number(status) === 1) return 'green'
            if (Number(status) === 2) return 'red'
            if (Number(status) === 3) return 'orange'
            return 'blue'
        },
        submitAction (action) {
            const actionText = {
                pass: '通过',
                reject: '驳回',
                withdraw: '撤回'
            }[action]
            this.$confirm({
                title: '确认' + actionText + '该审批？',
                onOk: () => {
                    this.actionLoading = true
                    this.request(villageApi.approvalAction, {
                        id: this.info.id,
                        action,
                        remark: this.remark
                    }).then(() => {
                        this.$message.success('操作成功')
                        this.visible = false
                        this.$emit('ok')
                    }).finally(() => {
                        this.actionLoading = false
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
.change-content {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
    background: #fafafa;
    padding: 8px;
    line-height: 1.8;
}
.node-line {
    margin-bottom: 4px;
}
</style>
