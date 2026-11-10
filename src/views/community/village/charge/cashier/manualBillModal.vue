<template>
    <a-modal :width="modalWidth" :title="modalTitle" :visible="visible"
        :footer="null" :mask-closable="false" @cancel="handleCancel">
        <div v-if="isBatchSelectStep" class="batch-target-step">
            <div class="batch-target-tip">
                <div v-if="billKind === 'deposit'">押金分类：{{ selectedDepositCategoryName }}，每个房间押金金额：{{ form.deposit_money }}元。</div>
                <div v-else>当前收费标准：{{ selectedRuleName }}。请选择需要生成账单的{{ batchTargetLabel }}。</div>
                <div>计费时间：{{ form.service_start_time }} 至 {{ form.service_end_time }}</div>
                <div class="warning">注意：全选框只会选中当前页，如需跨页选择，请逐页勾选。</div>
            </div>

            <div v-if="billKind !== 'parking_management'" class="batch-search">
                <label>房间：</label>
                <a-cascader v-model="roomSearch.vacancy" :options="roomOptions"
                    :load-data="loadRoomTreeData" change-on-select
                    placeholder="请选择房间" style="width: 250px" />
                <label class="search-label">有无住户：</label>
                <a-select v-model="roomSearch.is_user_bind" style="width: 110px">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">有</a-select-option>
                    <a-select-option value="2">无</a-select-option>
                </a-select>
                <a-button type="primary" icon="search" class="search-button" @click="searchBatchTargets">查询</a-button>
            </div>
            <div v-else class="batch-search">
                <label>所属车库：</label>
                <a-select v-model="parkingSearch.garage_id" placeholder="请选择车库" style="width: 150px">
                    <a-select-option :value="0">全部</a-select-option>
                    <a-select-option v-for="item in garageList" :key="item.garage_id" :value="item.garage_id">
                        {{ item.garage_num }}
                    </a-select-option>
                </a-select>
                <label class="search-label">车位号：</label>
                <a-input v-model="parkingSearch.position_num" placeholder="请输入车位号"
                    style="width: 180px" @pressEnter="searchBatchTargets" />
                <a-button type="primary" icon="search" class="search-button" @click="searchBatchTargets">查询</a-button>
            </div>

            <a-table :columns="targetColumns" :data-source="targetList" :loading="targetLoading"
                :row-key="targetRowKey" :row-selection="batchRowSelection"
                :scroll="{ x: targetTableWidth }"
                :pagination="targetPagination" @change="handleTargetTableChange">
                <template slot="action" slot-scope="text, record">
                    <span v-if="!isTargetSelectable(record)" class="unselectable-reason">
                        不可选：{{ record.unselectable_reason || '未绑定当前收费标准' }}
                    </span>
                    <span v-else class="selectable-status">
                        可选，
                        <a href="javascript:;" :class="isTargetSelected(record) ? 'cancel-select' : 'select-target'"
                            @click="toggleTarget(record)">
                            {{ isTargetSelected(record) ? '取消选择' : '点击选择' }}
                        </a>
                    </span>
                </template>
            </a-table>
            <div class="selected-summary">已选择 {{ selectedTargetKeys.length }} 个{{ batchTargetLabel }}</div>
        </div>

        <a-form-model v-else-if="billKind === 'deposit'" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="押金分类" required>
                <a-select v-model="form.category_id" placeholder="请选择押金分类" @change="resetBatchTargetSelection">
                    <a-select-option v-for="item in depositCategoryList" :key="item.id" :value="item.id">{{ item.cate_name }}</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="押金金额" required>
                <a-input-number v-model="form.deposit_money" :disabled="!form.category_id" :precision="1" :min="0" style="width: 100%" @change="resetBatchTargetSelection" />
            </a-form-model-item>
            <a-form-model-item label="开始日期" required>
                <a-date-picker v-model="form.service_start_time" value-format="YYYY-MM-DD" style="width: 100%" @change="resetBatchTargetSelection" />
            </a-form-model-item>
            <a-form-model-item label="结束日期" required>
                <a-date-picker v-model="form.service_end_time" value-format="YYYY-MM-DD" style="width: 100%" @change="resetBatchTargetSelection" />
            </a-form-model-item>
        </a-form-model>
        <a-form-model v-else-if="isBillMode" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-alert v-if="mode === 'bill' && billKind === 'parking_management'" type="info" show-icon
                message="仅支持车位管理费，当前车位须已绑定所选收费标准；未绑定时请先通过“添加收费项”绑定。" />
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
            <a-form-model-item v-if="mode !== 'batchBill'" label="生成方式">
                <a-radio-group v-model="form.generate_mode">
                    <a-radio value="day">按天生成</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-alert v-if="mode === 'batchBill'" class="batch-date-tip" type="info" show-icon
                message="按所选计费起止日期计算，包含开始和结束当天；日费用按月单价除以当月天数计算。超出服务时间或已有重复账单的对象不可选。" />
            <a-form-model-item :label="mode === 'batchBill' ? '计费开始时间' : '账单开始日期'" :required="mode === 'batchBill'">
                <a-date-picker v-model="form.service_start_time" value-format="YYYY-MM-DD" style="width: 100%"
                    :disabled-date="disabledBillDate"
                    @change="handleStartDateChange" />
            </a-form-model-item>
            <a-form-model-item :label="mode === 'batchBill' ? '计费结束时间' : '账单结束日期'" :required="mode === 'batchBill'">
                <a-date-picker v-model="form.service_end_time" value-format="YYYY-MM-DD" style="width: 100%"
                    :disabled-date="disabledBillDate"
                    allow-clear @change="handleEndDateChange" />
            </a-form-model-item>
            <a-form-model-item label="单价">
                <a-input-number v-model="form.unit_price" :precision="1" disabled style="width: 100%" />
            </a-form-model-item>
            <a-form-model-item :label="targetAreaLabel">
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
                <a-descriptions-item :label="previewChargeAmountLabel">{{ displayChargeAmount }}元</a-descriptions-item>
                <a-descriptions-item label="周期性费用设置">{{ ruleInfo.cyclicity_text || '-' }}</a-descriptions-item>
                <a-descriptions-item label="账单生成周期设置">{{ ruleInfo.bill_create_set_text || '-' }}</a-descriptions-item>
                <a-descriptions-item label="账单欠费模式">{{ ruleInfo.bill_type_text || '-' }}</a-descriptions-item>
                <a-descriptions-item label="生成账单模式">{{ ruleInfo.create_mode_text || '-' }}</a-descriptions-item>
                <a-descriptions-item label="是否支持预缴">{{ ruleInfo.is_prepaid_text || '-' }}</a-descriptions-item>
                <a-descriptions-item label="缴费时长">{{ calcInfo.days ? calcInfo.days + '天' : '-' }}</a-descriptions-item>
                <a-descriptions-item label="收费总金额">
                    {{ isBatchRoomAreaPricing ? '下一步按房间面积计算' : displayTotalMoney + '元' }}
                </a-descriptions-item>
            </a-descriptions>
            <a-alert v-if="calcInfo.total_money !== ''" type="info" show-icon>
                <template slot="message">
                    <span v-if="isBatchRoomAreaPricing">
                        周期：{{ calcInfo.days }} 天，每平方米折算金额：{{ displayTotalMoney }}元；
                        下一步将根据每个房间面积和实际起止日期计算预计费用。
                    </span>
                    <span v-else>
                        调整天数：{{ calcInfo.days }} 天，总费用：{{ displayTotalMoney }}，业主应付：{{ displayTotalMoney }}
                    </span>
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
        <div class="modal-footer">
            <a-button @click="handleCancel">取消</a-button>
            <a-button v-if="mode === 'batchBill' && batchStep === 2" @click="backToTargetStep">上一步</a-button>
            <a-button type="primary" :loading="loading" @click="handleOk">{{ modalOkText }}</a-button>
        </div>
    </a-modal>
</template>

<script>
import villageApi from '@/api/community/village'

const roomColumns = [
    { title: '楼号', dataIndex: 'single_name', key: 'single_name', width: 150 },
    { title: '单元名称', dataIndex: 'floor_name', key: 'floor_name', width: 110 },
    { title: '层号', dataIndex: 'layer_name', key: 'layer_name', width: 90 },
    { title: '房间号', dataIndex: 'room', key: 'room', width: 110 },
    { title: '房间面积', dataIndex: 'housesize', key: 'housesize', width: 100 },
    { title: '预计费用', dataIndex: 'estimated_amount_text', key: 'estimated_amount_text', width: 100 },
    { title: '有无住户', dataIndex: 'user_bind_status', key: 'user_bind_status', width: 90 },
    { title: '物业服务开始时间', dataIndex: 'property_service_start_date', key: 'property_service_start_date', width: 145 },
    { title: '物业服务结束时间', dataIndex: 'property_service_end_date', key: 'property_service_end_date', width: 145 },
    { title: '最新账单结束时间', dataIndex: 'latest_bill_end_date', key: 'latest_bill_end_date', width: 145 },
    { title: '是否可选', key: 'action', width: 240, scopedSlots: { customRender: 'action' } },
]

const parkingColumns = [
    { title: '车位号', dataIndex: 'position_num', key: 'position_num', width: 180 },
    { title: '所属车库', dataIndex: 'garage_num', key: 'garage_num', width: 220 },
    { title: '业主', dataIndex: 'owner_name', key: 'owner_name', width: 140 },
    { title: '电话', dataIndex: 'owner_phone', key: 'owner_phone', width: 150 },
    { title: '车位面积', dataIndex: 'position_area', key: 'position_area', width: 140 },
    { title: '预计费用', dataIndex: 'estimated_amount_text', key: 'estimated_amount_text', width: 100 },
    { title: '是否可选', key: 'action', width: 240, scopedSlots: { customRender: 'action' } },
]

export default {
    data() {
        return {
            visible: false,
            loading: false,
            mode: 'bill',
            roomId: 0,
            positionId: 0,
            targetIds: [],
            billKind: 'bill',
            batchStep: 1,
            targetList: [],
            selectedTargetKeys: [],
            targetLoading: false,
            targetPagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: total => `共 ${total} 条`,
            },
            roomSearch: {
                vacancy: [],
                is_user_bind: '0',
            },
            parkingSearch: {
                garage_id: 0,
                position_num: '',
            },
            roomOptions: [],
            garageList: [],
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
            depositCategoryList: [],
            projectList: [],
            ruleList: [],
            vacancyRuleList: [],
            orderList: [],
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
                category_id: undefined,
                deposit_money: undefined,
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
        open(roomId, orderList = [], positionId = 0) {
            this.mode = 'bill'
            this.roomId = positionId ? 0 : roomId
            this.positionId = positionId
            this.targetIds = [positionId || roomId]
            this.billKind = positionId ? 'parking_management' : 'bill'
            this.orderList = orderList || []
            this.visible = true
            this.form = this.defaultForm()
            this.projectList = []
            this.ruleList = []
            this.roomInfo = {}
            this.ruleInfo = {}
            this.calcInfo = { days: 0, total_money: '', owner_pay_money: '' }
            this.loadMeta()
        },
        openPosition(positionId, orderList = []) {
            this.open(0, orderList, positionId)
        },
        openBatch(billKind = 'bill') {
            this.mode = 'batchBill'
            this.batchStep = 1
            this.targetIds = []
            this.selectedTargetKeys = []
            this.targetList = []
            this.roomId = 0
            this.positionId = 0
            this.billKind = ['parking_management', 'deposit'].includes(billKind) ? billKind : 'bill'
            this.targetPagination.current = 1
            this.targetPagination.pageSize = 10
            this.targetPagination.total = 0
            this.roomSearch = { vacancy: [], is_user_bind: '0' }
            this.parkingSearch = { garage_id: 0, position_num: '' }
            this.orderList = []
            this.visible = true
            this.form = this.defaultForm()
            this.roomInfo = {}
            this.ruleInfo = {}
            this.calcInfo = { days: 0, total_money: '', owner_pay_money: '' }
            if (this.billKind === 'parking_management') {
                this.loadGarageList()
            } else {
                this.loadSingleList()
            }
            if (this.billKind === 'deposit') {
                this.depositCategoryList = []
                this.request(villageApi.depositCategoryOptions).then(res => {
                    this.depositCategoryList = res.list || []
                })
            } else {
                this.loadMeta()
            }
        },
        openVacancyConfig(roomId) {
            this.mode = 'vacancyConfig'
            this.roomId = roomId
            this.positionId = 0
            this.targetIds = [roomId]
            this.billKind = 'bill'
            this.visible = true
            this.loadMeta()
        },
        loadMeta() {
            const targetKey = [this.mode, this.roomId, this.positionId, this.billKind].join(':')
            this.request(villageApi.manualBillMeta, {
                room_id: this.roomId,
                position_id: this.positionId,
                bill_kind: this.billKind,
            }).then(res => {
                if (!this.visible || targetKey !== [this.mode, this.roomId, this.positionId, this.billKind].join(':')) {
                    return
                }
                this.projectList = res.project_list || []
                const targetInfo = res.target_info || res.room_info || {}
                this.roomInfo = targetInfo
                if (Object.keys(targetInfo).length) {
                    this.form.area = Number(targetInfo.position_area || targetInfo.housesize || 0)
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
            this.form.unit_price = 0
            this.ruleList = []
            this.ruleInfo = {}
            this.calcInfo = { days: 0, total_money: '', owner_pay_money: '' }
            if (this.mode === 'batchBill') {
                this.resetBatchTargetSelection()
            }
            this.getRuleList(projectId, 'ruleList')
        },
        handleRuleChange(ruleId) {
            this.calcInfo = { days: 0, total_money: '', owner_pay_money: '' }
            this.ruleInfo = {}
            this.form.unit_price = 0
            if (this.mode === 'batchBill') {
                this.resetBatchTargetSelection()
            }
            if (!ruleId) {
                this.ruleInfo = {}
                return
            }
            if (this.mode === 'batchBill') {
                this.request(villageApi.getRuleInfo, {
                    rule_id: ruleId,
                }).then(res => {
                    this.setRuleInfo(res)
                })
                return
            }
            const positionId = this.positionId
            const roomId = this.roomId
            const projectId = this.form.project_id
            const isCurrentRule = () => this.visible && this.mode === 'bill' &&
                this.positionId === positionId && this.roomId === roomId &&
                this.form.project_id === projectId && this.form.rule_id === ruleId
            this.request(villageApi.manualBillRuleInfo, {
                room_id: this.roomId,
                position_id: this.positionId,
                project_id: this.form.project_id,
                rule_id: ruleId,
                bill_kind: this.billKind,
            }).then(res => {
                if (!isCurrentRule()) {
                    return
                }
                this.setRuleInfo(res)
                if (this.fillStartTimeByLatestBill()) {
                    this.calcMoney()
                }
            }).catch(() => {
                if (isCurrentRule()) {
                    this.form.rule_id = undefined
                    this.form.unit_price = 0
                    this.ruleInfo = {}
                    this.calcInfo = { days: 0, total_money: '', owner_pay_money: '' }
                }
            })
        },
        setRuleInfo(ruleInfo) {
            this.ruleInfo = ruleInfo || {}
            this.form.unit_price = Number(this.ruleInfo.monthly_unit_price || this.ruleInfo.charge_price || 0)
            this.updateBatchBillPreview()
        },
        validateBatchDates(showTip = false) {
            const start = this.form.service_start_time
            const end = this.form.service_end_time
            let message = ''
            if (!start || !end) message = '请选择计费开始时间和计费结束时间'
            else if (![start, end].every(date => /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date)) message = '计费时间格式不正确'
            else if (start > end) message = '计费开始时间不能晚于结束时间'
            else if ((Date.parse(end) - Date.parse(start)) / 86400000 + 1 > 3650) message = '计费时间范围不能超过3650天'
            if (message && showTip) this.$message.warning(message)
            return !message
        },
        updateBatchBillPreview() {
            if (this.mode !== 'batchBill') return
            const monthlyPrice = Number(this.form.unit_price || 0)
            if (!this.validateBatchDates() || monthlyPrice < 0 || !this.form.rule_id) {
                this.calcInfo = { days: 0, total_money: '', owner_pay_money: '' }
                return
            }
            let totalMoney = 0
            let days = 0
            const cursor = new Date(this.form.service_start_time + 'T00:00:00Z')
            const end = new Date(this.form.service_end_time + 'T00:00:00Z')
            while (cursor <= end) {
                const monthDays = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0)).getUTCDate()
                totalMoney += monthlyPrice / monthDays
                days += 1
                cursor.setUTCDate(cursor.getUTCDate() + 1)
            }
            totalMoney = Math.round((Math.round(totalMoney * 10000) / 10000 + Number.EPSILON) * 10) / 10
            this.calcInfo = { days, total_money: totalMoney, owner_pay_money: totalMoney }
        },
        loadBatchTargetList() {
            this.targetLoading = true
            const params = {
                target_type: this.billKind === 'parking_management' ? 'position' : 'room',
                bill_kind: this.billKind,
                project_id: this.form.project_id,
                rule_id: this.form.rule_id,
                charge_rule_id: this.form.rule_id,
                deposit_money: this.form.deposit_money,
                service_start_time: this.form.service_start_time,
                service_end_time: this.form.service_end_time,
                page: this.targetPagination.current,
                limit: this.targetPagination.pageSize,
            }
            if (this.billKind === 'parking_management') {
                Object.assign(params, this.parkingSearch)
            } else {
                Object.assign(params, this.roomSearch)
            }
            this.request(villageApi.batchManualBillTargetList, params).then(res => {
                this.targetList = res.list || []
                this.targetPagination.total = Number(res.count || 0)
                if (res.total_limit) {
                    this.targetPagination.pageSize = Number(res.total_limit)
                }
            }).finally(() => {
                this.targetLoading = false
            })
        },
        searchBatchTargets() {
            this.targetPagination.current = 1
            this.loadBatchTargetList()
        },
        handleTargetTableChange(pagination) {
            this.targetPagination.current = pagination.current
            this.targetPagination.pageSize = pagination.pageSize
            this.loadBatchTargetList()
        },
        getTargetId(record) {
            return Number(this.billKind === 'parking_management' ? record.position_id : record.pigcms_id)
        },
        isTargetSelected(record) {
            return this.selectedTargetKeys.includes(this.getTargetId(record))
        },
        isTargetSelectable(record) {
            return Number(record.can_select || 0) === 1
        },
        toggleTarget(record) {
            this.setTargetSelected(record, !this.isTargetSelected(record))
        },
        setTargetSelected(record, selected) {
            if (selected && !this.isTargetSelectable(record)) {
                this.$message.warning(record.unselectable_reason || '当前' + this.batchTargetLabel + '未绑定当前收费标准，不可选择')
                return
            }
            const targetId = this.getTargetId(record)
            const selectedKeys = this.selectedTargetKeys.slice()
            const index = selectedKeys.indexOf(targetId)
            if (selected && index === -1) {
                selectedKeys.push(targetId)
            } else if (!selected && index !== -1) {
                selectedKeys.splice(index, 1)
            }
            this.selectedTargetKeys = selectedKeys
        },
        setCurrentPageSelected(selected, changedRows) {
            ;(changedRows || []).forEach(record => this.setTargetSelected(record, selected))
        },
        resetBatchTargetSelection() {
            this.targetIds = []
            this.selectedTargetKeys = []
            this.targetList = []
            this.targetPagination.current = 1
            this.targetPagination.total = 0
        },
        validateBatchForm() {
            if (this.billKind === 'deposit') {
                if (!this.form.category_id || !Number.isFinite(Number(this.form.deposit_money)) || Number(this.form.deposit_money) <= 0) {
                    this.$message.warning('请选择押金分类并填写大于0的押金金额')
                    return false
                }
            } else if (!this.form.project_id || !this.form.rule_id) {
                this.$message.warning('请先完善收费标准和账单信息')
                return false
            }
            return true
        },
        goToTargetStep() {
            if (!this.validateBatchForm()) return
            if (!this.validateBatchDates(true)) return
            this.batchStep = 2
            this.loadBatchTargetList()
        },
        validateBatchTargets() {
            if (!this.selectedTargetKeys.length) {
                this.$message.warning('请选择需要创建账单的' + this.batchTargetLabel)
                return false
            }
            if (this.selectedTargetKeys.length > 200) {
                this.$message.warning('单次最多选择200个' + this.batchTargetLabel)
                return false
            }
            this.targetIds = this.selectedTargetKeys.slice()
            return true
        },
        backToTargetStep() {
            this.batchStep = 1
        },
        loadSingleList() {
            this.request(villageApi.getSingleListByVillage).then(res => {
                this.roomOptions = (res || []).map(item => ({
                    label: item.name,
                    value: item.id,
                    isLeaf: false,
                }))
            })
        },
        loadRoomTreeData(selectedOptions) {
            const targetOption = selectedOptions[selectedOptions.length - 1]
            const level = selectedOptions.length
            const apiMap = {
                1: villageApi.getFloorList,
                2: villageApi.getLayerList,
                3: villageApi.getVacancyList,
            }
            const api = apiMap[level]
            if (!targetOption || !api || targetOption.children) {
                return
            }
            targetOption.loading = true
            this.request(api, { pid: targetOption.value }).then(res => {
                targetOption.children = (res || []).map(item => ({
                    label: item.name,
                    value: item.id,
                    isLeaf: level === 3,
                }))
                this.roomOptions = this.roomOptions.slice()
            }).finally(() => {
                targetOption.loading = false
            })
        },
        loadGarageList() {
            this.request(villageApi.garageList).then(res => {
                this.garageList = res || []
            })
        },
        handleVacancyProjectChange(projectId) {
            this.vacancyConfig.rule_id = undefined
            this.getRuleList(projectId, 'vacancyRuleList')
        },
        handleStartDateChange() {
            if (this.mode === 'batchBill') {
                this.resetBatchTargetSelection()
                if (this.form.service_start_time && this.form.service_end_time) this.validateBatchDates(true)
                this.updateBatchBillPreview()
                return
            }
            if (this.form.service_start_time && this.form.service_end_time &&
                this.form.service_start_time > this.form.service_end_time) {
                this.form.service_end_time = ''
                this.calcInfo = { days: 0, total_money: '', owner_pay_money: '' }
                this.$message.warning('账单开始时间不能晚于结束时间')
                return
            }
            if (!this.validateBillDateRange(true)) {
                return
            }
            if (this.applyPropertyServiceEndLimit(true)) {
                this.calcMoney()
            }
        },
        handleEndDateChange() {
            if (this.mode === 'batchBill') {
                this.resetBatchTargetSelection()
                if (this.form.service_start_time && this.form.service_end_time) this.validateBatchDates(true)
                this.updateBatchBillPreview()
                return
            }
            if (this.form.service_start_time && this.form.service_end_time &&
                this.form.service_start_time > this.form.service_end_time) {
                this.form.service_end_time = ''
                this.calcInfo = { days: 0, total_money: '', owner_pay_money: '' }
                this.$message.warning('账单开始时间不能晚于结束时间')
                return
            }
            if (!this.validateBillDateRange(true)) {
                return
            }
            if (this.applyPropertyServiceEndLimit(true)) {
                this.calcMoney()
            }
        },
        fillStartTimeByLatestBill() {
            const latestEndDate = this.getLatestBillEndDate()
            if (latestEndDate) {
                this.form.service_start_time = this.addOneDay(latestEndDate)
                if (!this.form.service_end_time || this.form.service_end_time < this.form.service_start_time) {
                    this.form.service_end_time = this.getDefaultEndDateByStart(this.form.service_start_time)
                }
            }
            if (!this.applyPropertyServiceEndLimit(true)) {
                return false
            }
            return this.validateBillDateRange(true)
        },
        getLatestBillEndDate() {
            let latestEndDate = ''
            this.getMatchedBillRanges().forEach(item => {
                if (item.end_date && (!latestEndDate || item.end_date > latestEndDate)) {
                    latestEndDate = item.end_date
                }
            })
            return latestEndDate
        },
        getMatchedBillRanges() {
            const projectId = String(this.form.project_id || '')
            if (!projectId || !this.form.rule_id || !Array.isArray(this.ruleInfo.bill_date_ranges)) {
                return []
            }
            const sourceList = this.ruleInfo.bill_date_ranges
            return sourceList.map(item => {
                const itemProjectId = String(item.project_id || item.charge_project_id || '')
                if (itemProjectId && itemProjectId !== projectId) {
                    return null
                }
                const startDate = this.normalizeDateText(item.start_date || item.service_start_time || item.service_start_time_txt)
                const endDate = this.normalizeDateText(item.end_date || item.service_end_time || item.service_end_time_txt)
                if (!startDate || !endDate) {
                    return null
                }
                return { start_date: startDate, end_date: endDate }
            }).filter(item => item)
        },
        disabledBillDate(current) {
            const dateText = current && current.format ? current.format('YYYY-MM-DD') : this.normalizeDateText(current)
            if (!dateText) {
                return false
            }
            return this.getMatchedBillRanges().some(item => dateText >= item.start_date && dateText <= item.end_date)
        },
        validateBillDateRange(showTip = false) {
            const startDate = this.form.service_start_time
            const endDate = this.form.service_end_time || startDate
            if (!startDate || !endDate) {
                return true
            }
            if (startDate > endDate) {
                this.calcInfo = { days: 0, total_money: '', owner_pay_money: '' }
                if (showTip) {
                    this.$message.warning('账单开始时间不能晚于结束时间')
                }
                return false
            }
            const hasOverlap = this.getMatchedBillRanges().some(item => startDate <= item.end_date && endDate >= item.start_date)
            if (hasOverlap) {
                this.calcInfo = { days: 0, total_money: '', owner_pay_money: '' }
                if (showTip) {
                    this.$message.warning('选择的账单日期已存在账单，不能重复生成')
                }
                return false
            }
            return true
        },
        applyPropertyServiceEndLimit(showTip = false) {
            const propertyEndDate = this.getPropertyServiceEndDate()
            if (!propertyEndDate) {
                return true
            }
            if (this.form.service_start_time && this.form.service_start_time > propertyEndDate) {
                this.form.service_start_time = ''
                this.form.service_end_time = ''
                this.calcInfo = { days: 0, total_money: '', owner_pay_money: '' }
                if (showTip) {
                    this.$message.warning('账单开始日期已超过物业服务结束日期，不能生成账单')
                }
                return false
            }
            if (!this.form.service_start_time && !this.form.service_end_time && this.hasPropertyServiceStartDate() && showTip) {
                this.$message.warning('当前房间已超过物业服务结束日期，不能生成账单')
                return false
            }
            if (this.form.service_end_time && this.form.service_end_time > propertyEndDate) {
                this.form.service_end_time = propertyEndDate
                if (showTip) {
                    this.$message.warning('账单结束日期不能超过物业服务结束日期，已自动调整')
                }
            }
            return true
        },
        getPropertyServiceEndDate() {
            if (this.billKind === 'parking_management' || !this.roomInfo) {
                return ''
            }
            return this.normalizeDateText(this.roomInfo.property_service_end_date || this.roomInfo.property_service_end_time)
        },
        getPropertyServiceStartDate() {
            if (this.billKind === 'parking_management' || !this.roomInfo) {
                return ''
            }
            return this.normalizeDateText(this.roomInfo.property_service_start_date || this.roomInfo.property_service_start_time)
        },
        hasPropertyServiceStartDate() {
            return !!this.getPropertyServiceStartDate()
        },
        normalizeDateText(value) {
            if (!value || value === '0') {
                return ''
            }
            if (typeof value === 'number' || /^\d+$/.test(String(value))) {
                const timestamp = Number(value)
                if (!timestamp) {
                    return ''
                }
                return this.formatDate(new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000))
            }
            const match = String(value).match(/\d{4}[-/]\d{1,2}[-/]\d{1,2}/)
            if (!match) {
                return ''
            }
            const parts = match[0].replace(/\//g, '-').split('-')
            return parts[0] + '-' + parts[1].padStart(2, '0') + '-' + parts[2].padStart(2, '0')
        },
        formatDate(date) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            return year + '-' + month + '-' + day
        },
        addOneDay(dateText) {
            const parts = dateText.split('-').map(item => Number(item))
            const date = new Date(parts[0], parts[1] - 1, parts[2])
            date.setDate(date.getDate() + 1)
            return this.formatDate(date)
        },
        getDefaultEndDateByStart(startDate) {
            const parts = startDate.split('-').map(item => Number(item))
            const date = new Date(parts[0] + 1, parts[1] - 1, parts[2])
            date.setDate(date.getDate() - 1)
            const propertyEndDate = this.getPropertyServiceEndDate()
            const endDate = this.formatDate(date)
            return propertyEndDate && endDate > propertyEndDate ? propertyEndDate : endDate
        },
        getRuleList(projectId, target) {
            if (!projectId) {
                this[target] = []
                return
            }
            const api = target === 'ruleList' ? villageApi.manualBillRuleList : villageApi.ChargeRuleLists
            const params = target === 'ruleList'
                ? {
                    charge_project_id: projectId,
                    bill_kind: this.billKind,
                    room_id: this.roomId,
                    position_id: this.positionId,
                }
                : { charge_project_id: projectId }
            this.request(api, params).then(res => {
                if (target === 'ruleList' && (projectId !== this.form.project_id ||
                    params.bill_kind !== this.billKind || params.room_id !== this.roomId ||
                    params.position_id !== this.positionId)) {
                    return
                }
                this[target] = res.list || res || []
            })
        },
        calcMoney() {
            if (!this.form.service_start_time || !this.form.unit_price ||
                (Number(this.ruleInfo.fees_type_status || 1) === 2 && !this.form.area)) {
                this.calcInfo = { days: 0, total_money: '', owner_pay_money: '' }
                return
            }
            const post = Object.assign({}, this.form, {
                room_id: this.roomId,
                position_id: this.positionId,
                allow_deposit_deduct: this.form.allow_deposit_deduct ? 1 : 0,
            })
            this.request(villageApi.manualBillCalc, post).then(res => {
                this.calcInfo = res
            })
        },
        handleOk() {
            if (this.mode === 'vacancyConfig') {
                this.saveVacancyConfig()
            } else if (this.mode === 'batchBill') {
                if (this.batchStep === 1) {
                    this.goToTargetStep()
                } else {
                    this.createBatchBill()
                }
            } else {
                this.createBill()
            }
        },
        createBill() {
            if (!this.form.project_id || !this.form.rule_id || !this.form.service_start_time) {
                this.$message.warning('请完善新增账单信息')
                return
            }
            if (!this.validateBillDateRange(true)) {
                return
            }
            if (!this.applyPropertyServiceEndLimit(true)) {
                return
            }
            this.loading = true
            const post = Object.assign({}, this.form, {
                room_id: this.roomId,
                position_id: this.positionId,
                bill_kind: this.billKind,
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
        createBatchBill() {
            if (!this.validateBatchForm()) return
            if (!this.validateBatchDates(true)) return
            if (!this.validateBatchTargets()) {
                return
            }
            this.loading = true
            const post = Object.assign({}, this.form, {
                target_ids: this.targetIds,
                bill_kind: this.billKind,
                allow_deposit_deduct: this.form.allow_deposit_deduct ? 1 : 0,
            })
            delete post.generate_mode
            delete post.period
            this.request(villageApi.batchManualBillCreate, post).then(res => {
                const message = res.msg || '批量账单已生成'
                if (Number(res.failed_count || 0) > 0) {
                    this.$message.warning(message)
                } else {
                    this.$message.success(message)
                }
                this.visible = false
                this.$emit('ok', res)
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
        isBatchSelectStep() {
            return this.mode === 'batchBill' && this.batchStep === 2
        },
        isBillMode() {
            return this.mode === 'bill' || this.mode === 'batchBill'
        },
        modalWidth() {
            return this.isBatchSelectStep ? 'calc(100vw - 48px)' : 760
        },
        modalOkText() {
            return this.mode === 'batchBill' && this.batchStep === 1 ? '下一步' : '确定'
        },
        selectedDepositCategoryName() {
            const category = this.depositCategoryList.find(item => item.id === this.form.category_id)
            return category ? category.cate_name : '-'
        },
        targetColumns() {
            if (this.billKind === 'deposit') {
                return roomColumns.filter(item => !['property_service_start_date', 'property_service_end_date', 'latest_bill_end_date'].includes(item.dataIndex))
            }
            return this.billKind === 'parking_management' ? parkingColumns : roomColumns
        },
        targetRowKey() {
            return this.billKind === 'parking_management' ? 'position_id' : 'pigcms_id'
        },
        targetTableWidth() {
            return this.billKind === 'parking_management' ? 1180 : 1520
        },
        selectedRuleName() {
            const rule = this.ruleList.find(item => String(item.id) === String(this.form.rule_id))
            return rule ? rule.charge_name : '-'
        },
        batchRowSelection() {
            return {
                selectedRowKeys: this.selectedTargetKeys,
                onSelect: (record, selected) => this.setTargetSelected(record, selected),
                onSelectAll: (selected, selectedRows, changedRows) => this.setCurrentPageSelected(selected, changedRows),
                getCheckboxProps: record => ({
                    props: {
                        disabled: !this.isTargetSelectable(record),
                    },
                }),
            }
        },
        modalTitle() {
            if (this.billKind === 'deposit') return '批量新增押金账单'
            if (this.mode === 'vacancyConfig') {
                return '空置费配置'
            }
            if (this.mode === 'batchBill' && this.billKind === 'parking_management') {
                return '批量新增车位管理费账单'
            }
            if (this.billKind === 'parking_management') {
                return '新增车位管理费账单'
            }
            return this.mode === 'batchBill' ? '批量新增账单' : '新增账单'
        },
        batchTargetLabel() {
            return this.billKind === 'parking_management' ? '车位' : '房间'
        },
        targetAreaLabel() {
            return this.billKind === 'parking_management' ? '车位面积' : '房间面积'
        },
        displayTotalMoney() {
            return Number(this.calcInfo.total_money || 0).toFixed(1)
        },
        displayChargeAmount() {
            if (this.mode === 'batchBill' && this.calcInfo.total_money !== '') {
                return Number(this.calcInfo.total_money || 0).toFixed(1)
            }
            return Number(this.ruleInfo.charge_price || 0).toFixed(1)
        },
        isBatchRoomAreaPricing() {
            const feesType = Number(this.ruleInfo.fees_type_status || this.ruleInfo.fees_type || 1)
            return this.mode === 'batchBill' && feesType === 2
        },
        previewChargeAmountLabel() {
            return this.isBatchRoomAreaPricing ? '每㎡折算金额' : '收费金额'
        },
    },
}
</script>

<style scoped>
.batch-target-tip {
    margin-bottom: 20px;
    padding: 16px 20px;
    line-height: 24px;
    background: #e6f7ff;
}

.batch-target-tip .warning {
    color: #f5222d;
}

.batch-search {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.search-label {
    margin-left: 28px;
}

.search-button {
    margin-left: 28px;
}

.selected-summary {
    margin-top: 12px;
    color: #1890ff;
}

.select-target {
    color: #f5222d;
}

.cancel-select {
    color: #52c41a;
}

.unselectable-reason {
    color: #f5222d;
}

.period-unit {
    display: inline-block;
    width: 45px;
    padding-left: 8px;
}

.batch-date-tip {
    margin-bottom: 20px;
}

.modal-footer {
    margin: 24px -24px -24px;
    padding: 10px 16px;
    text-align: right;
    border-top: 1px solid #e8e8e8;
}

.modal-footer .ant-btn + .ant-btn {
    margin-left: 8px;
}
</style>
