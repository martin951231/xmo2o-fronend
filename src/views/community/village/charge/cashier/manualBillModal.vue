<template>
    <a-modal :width="760" :title="mode === 'vacancyConfig' ? '空置费配置' : '新增账单'" :visible="visible"
        :confirm-loading="loading" @ok="handleOk" @cancel="handleCancel">
        <a-form-model v-if="mode === 'bill'" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="收费项目">
                <a-select v-model="form.project_id" placeholder="请选择收费项目" @change="handleProjectChange">
                    <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="收费标准">
                <a-select v-model="form.rule_id" placeholder="请选择按月生成的收费标准" @change="handleRuleChange">
                    <a-select-option v-for="item in ruleList" :key="item.id" :value="item.id">{{ item.charge_name }}</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="生成方式">
                <a-radio-group v-model="form.generate_mode">
                    <a-radio value="day">按天生成</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="账单开始日期">
                <a-date-picker v-model="form.service_start_time" value-format="YYYY-MM-DD" style="width: 100%"
                    @change="calcMoney" />
            </a-form-model-item>
            <a-form-model-item label="账单结束日期">
                <a-date-picker v-model="form.service_end_time" value-format="YYYY-MM-DD" style="width: 100%"
                    allow-clear @change="calcMoney" />
            </a-form-model-item>
            <a-form-model-item label="单价">
                <a-input-number v-model="form.unit_price" :precision="1" disabled style="width: 100%" />
            </a-form-model-item>
            <a-form-model-item label="房间面积">
                <a-input-number v-model="form.area" :precision="1" disabled style="width: 100%" />
            </a-form-model-item>
            <a-form-model-item label="允许押金抵扣">
                <a-switch v-model="form.allow_deposit_deduct" />
            </a-form-model-item>
            <a-form-model-item label="是否合并账单">
                <a-radio-group v-model="form.merge_bill">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="0">否，按月拆分</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="备注">
                <a-input v-model="form.remark" placeholder="请输入备注" />
            </a-form-model-item>
            <a-divider orientation="left">基本信息</a-divider>
            <a-descriptions :column="3" size="small">
                <a-descriptions-item label="收费标准名称">{{ ruleInfo.charge_name || '-' }}</a-descriptions-item>
                <a-descriptions-item label="未入住居屋折扣">{{ ruleInfo.not_house_rate || '-' }}</a-descriptions-item>
                <a-descriptions-item label="费用标准生效时间">{{ ruleInfo.charge_valid_time || '-' }}</a-descriptions-item>
                <a-descriptions-item label="计费模式">{{ ruleInfo.fees_type_text || '-' }}</a-descriptions-item>
                <a-descriptions-item label="计量单位">{{ ruleInfo.unit_gage_text || '-' }}</a-descriptions-item>
                <a-descriptions-item label="收费金额">{{ ruleInfo.charge_price || '0.0' }}元</a-descriptions-item>
                <a-descriptions-item label="周期性费用设置">{{ ruleInfo.cyclicity_text || '-' }}</a-descriptions-item>
                <a-descriptions-item label="账单生成周期设置">{{ ruleInfo.bill_create_set_text || '-' }}</a-descriptions-item>
                <a-descriptions-item label="账单欠费模式">{{ ruleInfo.bill_type_text || '-' }}</a-descriptions-item>
                <a-descriptions-item label="生成账单模式">{{ ruleInfo.create_mode_text || '-' }}</a-descriptions-item>
                <a-descriptions-item label="是否支持预缴">{{ ruleInfo.is_prepaid_text || '-' }}</a-descriptions-item>
                <a-descriptions-item label="缴费时长">{{ calcInfo.days ? calcInfo.days + '天' : '-' }}</a-descriptions-item>
                <a-descriptions-item label="收费总金额">{{ displayTotalMoney }}元</a-descriptions-item>
            </a-descriptions>
            <a-alert v-if="calcInfo.total_money !== ''" type="info" show-icon>
                <template slot="message">
                    调整天数：{{ calcInfo.days }} 天，总费用：{{ displayTotalMoney }}，业主应付：{{ displayTotalMoney }}
                </template>
            </a-alert>
        </a-form-model>
        <a-form-model v-else :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="启用空置费">
                <a-switch v-model="vacancyConfig.is_open" />
            </a-form-model-item>
            <a-form-model-item label="收费模式">
                <a-radio-group v-model="vacancyConfig.charge_mode">
                    <a-radio :value="1">固定每天金额</a-radio>
                    <a-radio :value="2">按面积计算</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="每天金额" v-if="vacancyConfig.charge_mode === 1">
                <a-input-number v-model="vacancyConfig.fixed_day_money" :precision="4" :min="0" style="width: 100%" />
            </a-form-model-item>
            <a-form-model-item label="面积单价" v-if="vacancyConfig.charge_mode === 2">
                <a-input-number v-model="vacancyConfig.area_unit_price" :precision="4" :min="0" style="width: 100%" />
            </a-form-model-item>
            <a-form-model-item label="收费项目">
                <a-select v-model="vacancyConfig.project_id" placeholder="请选择收费项目" @change="handleVacancyProjectChange">
                    <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="收费标准">
                <a-select v-model="vacancyConfig.rule_id" placeholder="请选择收费标准">
                    <a-select-option v-for="item in vacancyRuleList" :key="item.id" :value="item.id">{{ item.charge_name }}</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="允许押金抵扣">
                <a-switch v-model="vacancyConfig.allow_deposit_deduct" />
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>

<script>
import villageApi from '@/api/community/village'

export default {
    data() {
        return {
            visible: false,
            loading: false,
            mode: 'bill',
            roomId: 0,
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
            projectList: [],
            ruleList: [],
            vacancyRuleList: [],
            roomInfo: {},
            ruleInfo: {},
            form: this.defaultForm(),
            vacancyConfig: {
                is_open: false,
                charge_mode: 1,
                fixed_day_money: 0,
                area_unit_price: 0,
                project_id: undefined,
                rule_id: undefined,
                allow_deposit_deduct: true,
            },
            calcInfo: {
                days: 0,
                total_money: '',
                owner_pay_money: '',
            },
        }
    },
    methods: {
        defaultForm() {
            return {
                project_id: undefined,
                rule_id: undefined,
                service_start_time: '',
                service_end_time: '',
                generate_mode: 'day',
                unit_price: 0,
                area: 0,
                allow_deposit_deduct: true,
                merge_bill: 1,
                remark: '',
            }
        },
        open(roomId) {
            this.mode = 'bill'
            this.roomId = roomId
            this.visible = true
            this.form = this.defaultForm()
            this.ruleInfo = {}
            this.calcInfo = { days: 0, total_money: '', owner_pay_money: '' }
            this.loadMeta()
        },
        openVacancyConfig(roomId) {
            this.mode = 'vacancyConfig'
            this.roomId = roomId
            this.visible = true
            this.loadMeta()
        },
        loadMeta() {
            this.request(villageApi.manualBillMeta, { room_id: this.roomId }).then(res => {
                this.projectList = res.project_list || []
                if (res.room_info) {
                    this.roomInfo = res.room_info
                    this.form.area = Number(res.room_info.housesize || 0)
                    this.form.service_start_time = res.room_info.default_bill_start_date || ''
                    this.form.service_end_time = res.room_info.default_bill_end_date || ''
                }
                const config = res.vacancy_fee_config || {}
                this.vacancyConfig = {
                    is_open: Number(config.is_open || 0) === 1,
                    charge_mode: Number(config.charge_mode || 1),
                    fixed_day_money: Number(config.fixed_day_money || 0),
                    area_unit_price: Number(config.area_unit_price || 0),
                    project_id: config.project_id ? Number(config.project_id) : undefined,
                    rule_id: config.rule_id ? Number(config.rule_id) : undefined,
                    allow_deposit_deduct: Number(config.allow_deposit_deduct || 1) === 1,
                }
                if (this.vacancyConfig.project_id) {
                    this.handleVacancyProjectChange(this.vacancyConfig.project_id)
                }
            })
        },
        handleProjectChange(projectId) {
            this.form.rule_id = undefined
            this.ruleInfo = {}
            this.getRuleList(projectId, 'ruleList')
        },
        handleRuleChange(ruleId) {
            this.calcInfo = { days: 0, total_money: '', owner_pay_money: '' }
            if (!ruleId) {
                this.ruleInfo = {}
                return
            }
            this.request(villageApi.manualBillRuleInfo, {
                room_id: this.roomId,
                project_id: this.form.project_id,
                rule_id: ruleId,
            }).then(res => {
                this.ruleInfo = res || {}
                this.form.unit_price = Number(this.ruleInfo.monthly_unit_price || 0)
                this.form.area = Number(this.ruleInfo.area || 0)
                this.calcMoney()
            })
        },
        handleVacancyProjectChange(projectId) {
            this.vacancyConfig.rule_id = undefined
            this.getRuleList(projectId, 'vacancyRuleList')
        },
        getRuleList(projectId, target) {
            if (!projectId) {
                this[target] = []
                return
            }
            const api = target === 'ruleList' ? villageApi.manualBillRuleList : villageApi.ChargeRuleLists
            const params = target === 'ruleList' ? { charge_project_id: projectId } : { charge_project_id: projectId }
            this.request(api, params).then(res => {
                this[target] = res.list || res || []
            })
        },
        calcMoney() {
            if (!this.form.service_start_time || !this.form.unit_price || !this.form.area) {
                this.calcInfo = { days: 0, total_money: '', owner_pay_money: '' }
                return
            }
            const post = Object.assign({}, this.form, {
                room_id: this.roomId,
                allow_deposit_deduct: this.form.allow_deposit_deduct ? 1 : 0,
            })
            this.request(villageApi.manualBillCalc, post).then(res => {
                this.calcInfo = res
            })
        },
        handleOk() {
            if (this.mode === 'vacancyConfig') {
                this.saveVacancyConfig()
            } else {
                this.createBill()
            }
        },
        createBill() {
            if (!this.form.project_id || !this.form.rule_id || !this.form.service_start_time) {
                this.$message.warning('请完善新增账单信息')
                return
            }
            this.loading = true
            const post = Object.assign({}, this.form, {
                room_id: this.roomId,
                allow_deposit_deduct: this.form.allow_deposit_deduct ? 1 : 0,
            })
            this.request(villageApi.manualBillCreate, post).then(res => {
                this.$message.success(res.msg || '账单已生成')
                this.visible = false
                this.$emit('ok')
            }).finally(() => {
                this.loading = false
            })
        },
        saveVacancyConfig() {
            this.loading = true
            const post = Object.assign({}, this.vacancyConfig, {
                is_open: this.vacancyConfig.is_open ? 1 : 0,
                allow_deposit_deduct: this.vacancyConfig.allow_deposit_deduct ? 1 : 0,
            })
            this.request(villageApi.vacancyFeeConfigSave, post).then(() => {
                this.$message.success('保存成功')
                this.visible = false
            }).finally(() => {
                this.loading = false
            })
        },
        handleCancel() {
            this.visible = false
        },
    },
    computed: {
        displayTotalMoney() {
            return Number(this.calcInfo.total_money || 0).toFixed(1)
        },
    },
}
</script>

<style scoped>
</style>
