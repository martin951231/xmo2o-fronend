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
                <a-select v-model="form.rule_id" placeholder="请选择收费标准">
                    <a-select-option v-for="item in ruleList" :key="item.id" :value="item.id">{{ item.charge_name }}</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="生成方式">
                <a-radio-group v-model="form.generate_mode">
                    <a-radio value="day">按天生成</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="服务开始日期">
                <a-date-picker v-model="form.service_start_time" value-format="YYYY-MM-DD" style="width: 100%"
                    :disabled-date="disabledStartDate" @change="calcMoney" />
            </a-form-model-item>
            <a-form-model-item label="服务结束日期">
                <a-date-picker v-model="form.service_end_time" value-format="YYYY-MM-DD" style="width: 100%"
                    :disabled-date="disabledEndDate" allow-clear @change="calcMoney" />
            </a-form-model-item>
            <a-form-model-item label="单价">
                <a-input-number v-model="form.unit_price" :precision="4" :min="0" style="width: 100%" @change="calcMoney" />
            </a-form-model-item>
            <a-form-model-item label="房间面积">
                <a-input-number v-model="form.area" :precision="4" :min="0" style="width: 100%" @change="calcMoney" />
            </a-form-model-item>
            <a-form-model-item label="允许押金抵扣">
                <a-switch v-model="form.allow_deposit_deduct" />
            </a-form-model-item>
            <a-form-model-item label="第三方公司">
                <div class="third-company-row">
                    <a-select v-model="form.third_party_company_id" allow-clear placeholder="请选择第三方公司" style="flex: 1">
                        <a-select-option v-for="item in thirdCompanyList" :key="item.id" :value="item.id">{{ item.company_name }}</a-select-option>
                    </a-select>
                    <a-button class="third-company-btn" @click="companyVisible = true">新增</a-button>
                </div>
            </a-form-model-item>
            <a-form-model-item label="第三方承担">
                <a-input-number v-model="form.third_party_money" :precision="4" :min="0" style="width: 100%" @change="calcMoney" />
            </a-form-model-item>
            <a-form-model-item label="备注">
                <a-input v-model="form.remark" placeholder="请输入备注" />
            </a-form-model-item>
            <a-alert v-if="calcInfo.total_money !== ''" type="info" show-icon>
                <template slot="message">
                    调整天数：{{ calcInfo.days }} 天，总费用：{{ calcInfo.total_money }}，业主应付：{{ calcInfo.owner_pay_money }}
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
        <a-modal title="新增第三方公司" :visible="companyVisible" :confirm-loading="companyLoading" @ok="saveCompany" @cancel="companyVisible = false">
            <a-input v-model="companyName" placeholder="请输入公司名称" />
        </a-modal>
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
            thirdCompanyList: [],
            roomInfo: {},
            companyVisible: false,
            companyLoading: false,
            companyName: '',
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
                third_party_company_id: undefined,
                third_party_money: 0,
                remark: '',
            }
        },
        open(roomId) {
            this.mode = 'bill'
            this.roomId = roomId
            this.visible = true
            this.form = this.defaultForm()
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
                this.thirdCompanyList = res.third_company_list || []
                if (res.room_info) {
                    this.roomInfo = res.room_info
                    this.form.area = Number(res.room_info.housesize || 0)
                    this.form.service_start_time = res.room_info.property_service_start_date || res.room_info.delivery_date || ''
                    this.form.service_end_time = res.room_info.property_service_end_date || ''
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
            this.getRuleList(projectId, 'ruleList')
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
            this.request(villageApi.ChargeRuleLists, { project_id: projectId }).then(res => {
                this[target] = res.list || res || []
            })
        },
        calcMoney() {
            if (!this.form.service_start_time || !this.form.unit_price || !this.form.area) {
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
        saveCompany() {
            if (!this.companyName) {
                this.$message.warning('请输入公司名称')
                return
            }
            this.companyLoading = true
            this.request(villageApi.thirdPartyCompanySave, {
                company_name: this.companyName,
                status: 1,
            }).then(res => {
                this.$message.success('保存成功')
                this.companyVisible = false
                this.companyName = ''
                this.loadMeta()
                if (res.id) {
                    this.form.third_party_company_id = res.id
                }
            }).finally(() => {
                this.companyLoading = false
            })
        },
        disabledStartDate(current) {
            return this.isDisabledBillDate(current, false)
        },
        disabledEndDate(current) {
            return this.isDisabledBillDate(current, true)
        },
        isDisabledBillDate(current, isEnd) {
            if (!current) {
                return false
            }
            const value = current.format('YYYY-MM-DD')
            const minDate = this.roomInfo.property_service_start_date || this.roomInfo.delivery_date || ''
            const maxDate = this.roomInfo.property_service_end_date || ''
            if (minDate && value < minDate) {
                return true
            }
            if (maxDate && value > maxDate) {
                return true
            }
            if (isEnd && this.form.service_start_time && value < this.form.service_start_time) {
                return true
            }
            return false
        },
    },
}
</script>

<style scoped>
.third-company-row {
    display: flex;
    align-items: center;
}
.third-company-btn {
    margin-left: 8px;
}
</style>
