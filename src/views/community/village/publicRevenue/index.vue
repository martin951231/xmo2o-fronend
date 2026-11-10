<template>
  <div class="public-revenue-page">
    <a-alert
      message="保存草稿不会更新公示数据；首次提交直接生效，修改已生效的年初结余或季度收支时发起“调整公共收益”审批。"
      type="info"
      show-icon
      class="page-alert" />

    <a-tabs v-model="activeTab" @change="handleTabChange">
      <a-tab-pane key="period" tab="收支录入">
        <a-card :bordered="false" class="revenue-card">
          <a-form layout="inline" class="period-filter">
            <a-form-item label="年度">
              <a-select v-model="periodForm.year" style="width: 120px" @change="handleYearChange">
                <a-select-option v-for="year in yearOptions" :key="year" :value="year">{{ year }}年</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="期间">
              <a-select v-model="periodForm.quarter" style="width: 150px" @change="handleQuarterChange">
                <a-select-option :value="0">年初结余</a-select-option>
                <a-select-option v-for="quarter in 4" :key="quarter" :value="quarter">第{{ quarterText[quarter] }}季度</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <a-tag v-if="periodInfo && Number(periodInfo.status) === 1" color="green">已生效</a-tag>
              <a-tag v-else color="orange">草稿</a-tag>
              <a-tag v-if="isPending" color="blue">调整审批中</a-tag>
            </a-form-item>
          </a-form>

          <a-alert
            v-if="isFutureQuarter"
            :message="futureQuarterMessage"
            type="warning"
            show-icon
            class="quarter-warning" />

          <a-spin :spinning="periodLoading">
            <template v-if="periodForm.quarter === 0">
              <div class="section-heading">
                <div class="section-title">年初结余设置</div>
                <div class="section-description">填写年初结余，金额单位为元。</div>
              </div>
              <a-row class="opening-form">
                <a-col :span="24" class="opening-field">
                  <a-form-item label="年初结余（元）">
                    <a-input-number v-model="periodForm.opening_actual_balance" :precision="2" style="width: 100%" />
                  </a-form-item>
                </a-col>
              </a-row>
            </template>

            <template v-else>
              <a-row :gutter="16" class="balance-summary">
                <a-col :span="12"><a-statistic title="年初结余" :value="Number(opening.actual || 0)" :precision="2" suffix="元" /></a-col>
                <a-col :span="12"><a-statistic title="结余" :value="actualBalance" :precision="2" suffix="元" /></a-col>
              </a-row>

              <h3>本期收入</h3>
              <a-table rowKey="subject_id" :columns="incomeColumns" :data-source="incomeRows" :pagination="false" size="middle">
                <template slot="accrual" slot-scope="text, record">
                  <a-input-number v-model="record.accrual_amount" :precision="2" style="width: 150px" />
                </template>
                <template slot="actual" slot-scope="text, record">
                  <a-input-number v-model="record.actual_amount" :precision="2" style="width: 150px" />
                </template>
                <template slot="remark" slot-scope="text, record">
                  <a-input v-model="record.remark" :maxLength="255" placeholder="选填" />
                </template>
              </a-table>

              <h3 class="expense-title">本期支出</h3>
              <a-table rowKey="subject_id" :columns="expenseColumns" :data-source="expenseRows" :pagination="false" size="middle">
                <template slot="accrual" slot-scope="text, record">
                  <a-input-number v-model="record.accrual_amount" :precision="2" style="width: 150px" />
                </template>
                <template slot="actual" slot-scope="text, record">
                  <a-input-number v-model="record.actual_amount" :precision="2" style="width: 150px" />
                </template>
                <template slot="remark" slot-scope="text, record">
                  <a-input v-model="record.remark" :maxLength="255" placeholder="选填" />
                </template>
              </a-table>
            </template>

            <a-form-item v-if="requiresApproval" label="调整原因" class="reason-row">
              <a-textarea v-model="periodForm.reason" :rows="3" :maxLength="500" placeholder="本次调整需要审批，请填写原因，审批人将看到修改前后内容" />
            </a-form-item>

            <div class="form-actions">
              <a-button icon="save" class="draft-button" :loading="saving" @click="savePeriod(false)">保存草稿</a-button>
              <a-button
                type="primary"
                icon="check-circle"
                class="submit-button"
                :loading="saving"
                :disabled="isPending || isFutureQuarter"
                @click="confirmSubmit"
              >
                {{ requiresApproval ? '提交调整审批' : '提交并生效' }}
              </a-button>
              <a-button
                v-if="isPending"
                type="danger"
                ghost
                icon="rollback"
                class="withdraw-button"
                @click="openWithdraw"
              >撤销提交</a-button>
            </div>
          </a-spin>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="subject" tab="项目设置">
        <a-card :bordered="false">
          <div class="table-toolbar"><a-button type="primary" icon="plus" @click="openSubject()">新增项目</a-button></div>
          <a-table rowKey="id" :columns="subjectColumns" :data-source="subjects" :loading="subjectLoading" :pagination="false">
            <span slot="type" slot-scope="text"><a-tag :color="Number(text) === 1 ? 'green' : 'red'">{{ Number(text) === 1 ? '收入' : '支出' }}</a-tag></span>
            <span slot="status" slot-scope="text, record"><a-switch :checked="Number(text) === 1" @change="checked => changeSubjectStatus(record, checked)" /></span>
            <span slot="action" slot-scope="text, record">
              <a @click="openSubject(record)">编辑</a><a-divider type="vertical" />
              <a-popconfirm title="确认删除该项目？已被使用的项目不能删除。" @confirm="deleteSubject(record)"><a>删除</a></a-popconfirm>
            </span>
          </a-table>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="log" tab="操作日志">
        <a-card :bordered="false">
          <a-table
            rowKey="id"
            :columns="logColumns"
            :data-source="logs"
            :loading="logLoading"
            :pagination="logPagination"
            @change="logTableChange"
          />
        </a-card>
      </a-tab-pane>
    </a-tabs>

    <a-modal :title="subjectForm.id ? '编辑项目' : '新增项目'" :visible="subjectVisible" :confirmLoading="subjectSaving" @ok="saveSubject" @cancel="subjectVisible = false">
      <a-form-model ref="subjectForm" :model="subjectForm" :rules="subjectRules" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-form-model-item label="项目类型" prop="type"><a-radio-group v-model="subjectForm.type"><a-radio :value="1">收入</a-radio><a-radio :value="2">支出</a-radio></a-radio-group></a-form-model-item>
        <a-form-model-item label="项目名称" prop="name"><a-input v-model="subjectForm.name" :maxLength="50" /></a-form-model-item>
        <a-form-model-item label="排序"><a-input-number v-model="subjectForm.sort" style="width: 100%" /></a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal
      title="撤销公共收益调整申请"
      :visible="withdrawVisible"
      :confirmLoading="withdrawLoading"
      okText="确认撤销"
      cancelText="取消"
      @ok="withdrawApproval"
      @cancel="withdrawVisible = false">
      <a-alert message="撤销后审批流程立即结束，本次修改内容将保留为草稿，可调整后重新提交。" type="warning" show-icon class="withdraw-alert" />
      <a-form-item label="撤销原因" class="withdraw-reason">
        <a-textarea v-model="withdrawReason" :rows="4" :maxLength="500" placeholder="请输入撤销原因（必填）" />
      </a-form-item>
    </a-modal>
  </div>
</template>

<script>
import villageApi from '@/api/community/village'

const currentYear = new Date().getFullYear()
const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3)
const logActionLabels = {
    subject_save: '保存收支项目',
    subject_status: '变更项目启用状态',
    subject_delete: '删除收支项目',
    draft_save: '保存草稿',
    adjustment_draft_save: '保存调整草稿',
    first_submit: '首次提交',
    adjustment_submit: '提交调整审批',
    adjustment_approved: '调整审批通过',
    adjustment_direct_effect: '调整直接生效'
}

export default {
    name: 'PublicRevenue',
    data () {
        return {
            activeTab: 'period',
            yearOptions: Array.from({ length: 11 }, (item, index) => currentYear + 1 - index),
            quarterText: ['', '一', '二', '三', '四'],
            periodLoading: false,
            saving: false,
            periodInfo: null,
            effectiveCandidate: null,
            loadedQuarter: 0,
            quarterEffectiveStatus: { 1: 0, 2: 0, 3: 0, 4: 0 },
            opening: { accrual: '0.00', actual: '0.00' },
            periodForm: { year: currentYear, quarter: 0, opening_actual_balance: 0, reason: '' },
            incomeRows: [],
            expenseRows: [],
            subjects: [],
            subjectLoading: false,
            subjectVisible: false,
            subjectSaving: false,
            withdrawVisible: false,
            withdrawLoading: false,
            withdrawReason: '',
            subjectForm: { id: 0, type: 1, name: '', sort: 0, status: 1 },
            subjectRules: { name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }] },
            logs: [],
            logLoading: false,
            logPagination: { current: 1, pageSize: 20, total: 0 },
            incomeColumns: [
                { title: '收入项目', dataIndex: 'subject_name', key: 'subject_name' },
                { title: '应收（元）', dataIndex: 'accrual_amount', key: 'accrual_amount', width: 190, scopedSlots: { customRender: 'accrual' } },
                { title: '实收（元）', dataIndex: 'actual_amount', key: 'actual_amount', width: 190, scopedSlots: { customRender: 'actual' } },
                { title: '备注', dataIndex: 'remark', key: 'remark', scopedSlots: { customRender: 'remark' } }
            ],
            expenseColumns: [
                { title: '支出项目', dataIndex: 'subject_name', key: 'subject_name' },
                { title: '应付（元）', dataIndex: 'accrual_amount', key: 'accrual_amount', width: 190, scopedSlots: { customRender: 'accrual' } },
                { title: '实付（元）', dataIndex: 'actual_amount', key: 'actual_amount', width: 190, scopedSlots: { customRender: 'actual' } },
                { title: '备注', dataIndex: 'remark', key: 'remark', scopedSlots: { customRender: 'remark' } }
            ],
            subjectColumns: [
                { title: '类型', dataIndex: 'type', key: 'type', width: 100, scopedSlots: { customRender: 'type' } },
                { title: '项目名称', dataIndex: 'name', key: 'name' },
                { title: '排序', dataIndex: 'sort', key: 'sort', width: 100 },
                { title: '启用', dataIndex: 'status', key: 'status', width: 100, scopedSlots: { customRender: 'status' } },
                { title: '操作', dataIndex: 'action', key: 'action', width: 150, scopedSlots: { customRender: 'action' } }
            ],
            logColumns: [
                { title: '时间', dataIndex: 'add_time_text', key: 'add_time_text', width: 180 },
                { title: '操作人', dataIndex: 'operator_name', key: 'operator_name', width: 140 },
                { title: '动作', dataIndex: 'action', key: 'action', width: 180, customRender: action => logActionLabels[action] || action || '-' },
                { title: '业务ID', dataIndex: 'business_id', key: 'business_id', width: 100 },
                { title: '原因', dataIndex: 'reason', key: 'reason' }
            ]
        }
    },
    computed: {
        isEffective () { return this.periodInfo && Number(this.periodInfo.status) === 1 },
        isPending () {
            if (!this.periodInfo) return false
            const status = this.periodInfo.pending_status
            return status !== null && status !== undefined && status !== '' && Number(status) === 0
        },
        currentCandidate () {
            if (Number(this.periodForm.quarter) === 0) {
                return { opening_actual_balance: this.round(Number(this.periodForm.opening_actual_balance || 0)) }
            }
            return this.comparableRows(this.incomeRows.concat(this.expenseRows))
        },
        requiresApproval () {
            return Boolean(this.isEffective) && JSON.stringify(this.effectiveCandidate) !== JSON.stringify(this.currentCandidate)
        },
        isFutureQuarter () {
            const year = Number(this.periodForm.year)
            const quarter = Number(this.periodForm.quarter)
            return quarter > 0 && (year > currentYear || (year === currentYear && quarter > currentQuarter))
        },
        futureQuarterMessage () {
            return `尚未进入${this.periodForm.year}年第${this.quarterText[this.periodForm.quarter]}季度，当前只能保存草稿，不能提交生效。`
        },
        actualBalance () {
            return this.round(Number(this.opening.actual || 0) + this.sum(this.incomeRows, 'actual_amount') - this.sum(this.expenseRows, 'actual_amount'))
        }
    },
    mounted () {
        this.loadPeriod()
    },
    methods: {
        handleTabChange (key) {
            if (key === 'subject') this.loadSubjects()
            if (key === 'log') this.loadLogs(1)
        },
        handleYearChange () {
            this.periodForm.quarter = 0
            this.loadedQuarter = 0
            this.loadPeriod()
        },
        handleQuarterChange (quarter) {
            const missing = this.firstMissingQuarter(quarter)
            if (missing) {
                this.$message.warning(`请先填写并提交生效${this.periodForm.year}年第${this.quarterText[missing]}季度数据`)
                this.periodForm.quarter = this.loadedQuarter
                return
            }
            this.loadPeriod()
        },
        loadPeriod () {
            this.periodLoading = true
            this.request(villageApi.publicRevenuePeriodDetail, { year: this.periodForm.year, quarter: this.periodForm.quarter }).then(res => {
                this.periodInfo = res.period || null
                this.subjects = res.subjects || []
                this.quarterEffectiveStatus = res.quarter_effective_status || { 1: 0, 2: 0, 3: 0, 4: 0 }
                this.loadedQuarter = Number(this.periodForm.quarter)
                this.opening = res.quarter_opening || { accrual: '0.00', actual: '0.00' }
                const live = res.period || {}
                this.effectiveCandidate = Number(this.periodForm.quarter) === 0
                    ? { opening_actual_balance: this.round(Number(live.opening_actual_balance || 0)) }
                    : this.comparableRows(res.details || [])
                const source = live.draft || live
                this.periodForm.opening_actual_balance = Number(source.opening_actual_balance || 0)
                this.periodForm.reason = ''
                const detailList = (source.details || res.details || []).reduce((map, item) => {
                    map[Number(item.subject_id)] = item
                    return map
                }, {})
                const buildRows = type => this.subjects.filter(item => Number(item.type) === type && (Number(item.status) === 1 || detailList[Number(item.id)])).map(item => {
                    const detail = detailList[Number(item.id)] || {}
                    return { subject_id: Number(item.id), subject_name: item.name, type, accrual_amount: Number(detail.accrual_amount || 0), actual_amount: Number(detail.actual_amount || 0), remark: detail.remark || '' }
                })
                this.incomeRows = buildRows(1)
                this.expenseRows = buildRows(2)
            }).finally(() => { this.periodLoading = false })
        },
        periodPayload (submit) {
            return {
                year: this.periodForm.year,
                quarter: this.periodForm.quarter,
                opening_actual_balance: this.periodForm.opening_actual_balance,
                details: this.incomeRows.concat(this.expenseRows),
                reason: this.periodForm.reason,
				save_mode: submit ? 'submit' : 'draft',
                submit: submit ? 1 : 0,
                confirmed: submit ? 1 : 0
            }
        },
        savePeriod (submit) {
            const missing = this.firstMissingQuarter(this.periodForm.quarter)
            if (missing) {
                this.$message.warning(`请先填写并提交生效${this.periodForm.year}年第${this.quarterText[missing]}季度数据`)
                return
            }
            if (submit && this.isFutureQuarter) {
                this.$message.warning(this.futureQuarterMessage)
                return
            }
            this.saving = true
            this.request(villageApi.publicRevenuePeriodSave, this.periodPayload(submit)).then(res => {
                this.$message.success(res.approval_required ? '修改申请已提交审批' : (submit ? '提交成功，数据已生效' : '草稿已保存'))
                this.loadPeriod()
            }).finally(() => { this.saving = false })
        },
        confirmSubmit () {
            if (this.isFutureQuarter) {
                this.$message.warning(this.futureQuarterMessage)
                return
            }
            if (this.requiresApproval && !this.periodForm.reason.trim()) {
                this.$message.warning('请填写调整原因')
                return
            }
            const content = this.periodForm.quarter === 0
                ? `年初结余 ${Number(this.periodForm.opening_actual_balance || 0).toFixed(2)} 元。`
                : `结余 ${this.actualBalance.toFixed(2)} 元。`
            this.$confirm({
                title: this.requiresApproval ? '确认提交调整审批？' : '确认提交并立即公示？',
                content,
                okText: '确认提交',
                cancelText: '返回检查',
                onOk: () => this.savePeriod(true)
            })
        },
        comparableRows (rows) {
            return (rows || []).filter(item => this.hasAmount(item.accrual_amount) || this.hasAmount(item.actual_amount) || String(item.remark || '').trim()).map(item => ({
                subject_id: Number(item.subject_id),
                type: Number(item.type),
                accrual_amount: this.round(Number(item.accrual_amount || 0)),
                actual_amount: this.round(Number(item.actual_amount || 0)),
                remark: String(item.remark || '').trim()
            })).sort((a, b) => a.subject_id - b.subject_id)
        },
        firstMissingQuarter (quarter) {
            for (let previous = 1; previous < Number(quarter); previous++) {
                if (Number(this.quarterEffectiveStatus[previous] || 0) !== 1) return previous
            }
            return 0
        },
        openWithdraw () {
            this.withdrawReason = ''
            this.withdrawVisible = true
        },
        withdrawApproval () {
            if (!this.withdrawReason.trim()) {
                this.$message.warning('请输入撤销原因')
                return
            }
            const approvalId = Number(this.periodInfo && this.periodInfo.pending_approval_id || 0)
            if (!approvalId) {
                this.$message.warning('当前审批流程不存在，请刷新页面后重试')
                return
            }
            this.withdrawLoading = true
            this.request(villageApi.approvalAction, { id: approvalId, action: 'withdraw', remark: this.withdrawReason.trim() }).then(() => {
                this.$message.success('审批提交已撤销，修改内容已保留为草稿')
                this.withdrawVisible = false
                this.loadPeriod()
            }).finally(() => { this.withdrawLoading = false })
        },
        hasAmount (value) { return Math.abs(Number(value || 0)) > 0.00001 },
        sum (rows, field) { return rows.reduce((total, item) => total + Number(item[field] || 0), 0) },
        round (value) { return Math.round((value + Number.EPSILON) * 100) / 100 },
        loadSubjects () {
            this.subjectLoading = true
            this.request(villageApi.publicRevenueSubjectList, {}).then(res => { this.subjects = res || [] }).finally(() => { this.subjectLoading = false })
        },
        openSubject (record) {
            this.subjectForm = record ? { id: record.id, type: Number(record.type), name: record.name, sort: Number(record.sort), status: Number(record.status) } : { id: 0, type: 1, name: '', sort: 0, status: 1 }
            this.subjectVisible = true
        },
        saveSubject () {
            this.$refs.subjectForm.validate(valid => {
                if (!valid) return
                this.subjectSaving = true
                this.request(villageApi.publicRevenueSubjectSave, this.subjectForm).then(() => {
                    this.$message.success('保存成功')
                    this.subjectVisible = false
                    this.loadSubjects()
                }).finally(() => { this.subjectSaving = false })
            })
        },
        changeSubjectStatus (record, checked) {
            this.request(villageApi.publicRevenueSubjectStatus, { id: record.id, status: checked ? 1 : 0 }).then(() => {
                this.$message.success('状态已更新')
                this.loadSubjects()
            })
        },
        deleteSubject (record) {
            this.request(villageApi.publicRevenueSubjectDelete, { id: record.id }).then(() => {
                this.$message.success('删除成功')
                this.loadSubjects()
            })
        },
        loadLogs (page) {
            this.logLoading = true
            this.request(villageApi.publicRevenueOperationLogList, { page, page_size: this.logPagination.pageSize }).then(res => {
                this.logs = res.list || []
                this.logPagination.current = page
                this.logPagination.total = res.count || 0
            }).finally(() => { this.logLoading = false })
        },
        logTableChange (pagination) { this.loadLogs(pagination.current) }
    }
}
</script>

<style scoped>
.public-revenue-page {
    box-sizing: border-box;
    padding: 0;
}
.page-alert { margin-bottom: 16px; }
.quarter-warning { margin-bottom: 16px; }
.revenue-card { border-radius: 6px; }
.revenue-card >>> .ant-card-body { padding: 24px; }
.period-filter {
    margin-bottom: 24px;
    padding: 14px 18px 2px;
    background: #f7f9fc;
    border: 1px solid #edf0f5;
    border-radius: 6px;
}
.section-heading {
    padding-left: 12px;
    border-left: 3px solid #1890ff;
}
.section-title {
    color: #262626;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
}
.section-description {
    margin-top: 4px;
    color: #8c8c8c;
    font-size: 13px;
}
.opening-form {
    max-width: 720px;
    margin-top: 20px;
    padding: 22px 24px 10px;
    background: #fafbfd;
    border: 1px solid #f0f2f5;
    border-radius: 6px;
}
.opening-field + .opening-field { margin-top: 8px; }
.opening-form .ant-form-item, .reason-row { width: 100%; }
.balance-summary { padding: 18px 20px; margin-bottom: 24px; background: #fafafa; border-radius: 4px; }
.expense-title { margin-top: 30px; }
.reason-row { margin-top: 24px; }
.reason-row >>> .ant-form-item-label { vertical-align: top; }
.reason-row >>> .ant-form-item-control-wrapper { width: 620px; }
.form-actions {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
}
.draft-button, .submit-button {
    min-width: 110px;
    height: 36px;
    border-radius: 4px;
}
.submit-button {
    margin-left: 12px;
    box-shadow: 0 3px 8px rgba(24, 144, 255, .22);
}
.withdraw-button { margin-left: 12px; }
.withdraw-alert { margin-bottom: 20px; }
.withdraw-reason { margin-bottom: 0; }
.table-toolbar { margin-bottom: 16px; }

@media (max-width: 768px) {
    .opening-form { max-width: none; }
}
</style>
