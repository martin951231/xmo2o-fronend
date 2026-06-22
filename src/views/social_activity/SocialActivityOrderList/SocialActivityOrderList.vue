<template>
    <div class="social-activity-order-list">
        <!-- 顶部金额栏 -->
        <div class="top-bar">
            <div class="balance-section">
                <span class="balance-amount">¥{{ withdrawableAmount.toFixed(2) }}</span>
            </div>
            <div class="action-buttons">
                <a-button v-saction:withdraw ghost @click="showWithdrawModal">申请提现</a-button>
                <a-button v-saction:withdraw_list ghost @click="showWithdrawRecord">提现记录</a-button>
            </div>
        </div>

        <!-- 搜索栏 -->
        <div class="search-bar">
            <a-col :span="5">
            <label>活动分类：</label>
            <a-select style="width: 65%" v-model="searchParams.catId" placeholder="请选择活动分类" class="search-item">
                <a-select-option :value="0">全部</a-select-option>
                <a-select-option v-for="item in categoryList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
            </a-col>
            <a-col :span="6">
            <label>活动名称：</label>
            <a-input v-model="searchParams.keywords" placeholder="请输入活动名称" class="search-item" />
            </a-col>
            <a-col :span="6">
            <label>活动场次：</label>
            <a-input v-model="searchParams.sessionName" placeholder="请输入活动场次" class="search-item" />
            </a-col>
            <a-col :span="6">
            <label>用户信息：</label>
            <a-input v-model="searchParams.nickname" placeholder="请输入用户昵称" class="search-item" />
            </a-col>
            <a-col :span="8">
            <label>支付时间：</label>
            <a-range-picker
                v-model="searchParams.payTimeRange"
                format="YYYY-MM-DD HH:mm:ss"
                :placeholder="['开始时间', '结束时间']"
                class="search-item"
            />
            </a-col>
            <a-button type="primary" @click="search">查询</a-button>
            <a-button @click="resetSearch">重置</a-button>
            <a-button v-saction:export type="primary" @click="exportOrder">导出</a-button>
        </div>

        <!-- 订单列表 -->
        <a-table
            :columns="columns"
            :data-source="dataSource"
            :pagination="pagination"
            :loading="loading"
            row-key="id"
            @change="onPageChange"
        >
            <template slot="survey_form" slot-scope="text, record">
                <a @click="showSurveyDetail(record)" class="view-link">查看</a>
            </template>
            <template slot="activity_status_text" slot-scope="text, record">
                <span :class="`status-tag status-${record.activity_status}`">{{ text }}</span>
            </template>
        </a-table>

        <!-- 申请提现弹窗 -->
        <a-modal
            v-model="withdrawModalVisible"
            title="申请提现"
            :width="400"
            @ok="handleWithdraw"
        >
            <div class="withdraw-form">
                <div class="form-row">
                    <label class="form-label">提现人姓名：</label>
                    <a-input v-model="withdrawForm.realname" class="form-input" placeholder="请输入提现人姓名" />
                </div>
                <div class="form-row">
                    <label class="form-label">提现金额：</label>
                    <div class="form-input-wrapper">
                        <a-input-number
                            v-model="withdrawForm.amount"
                            :min="1"
                            :max="withdrawableAmount"
                            :step="1"
                            class="form-input"
                            placeholder="请输入提现金额"
                            style="width: 125px !important;"
                        />
                        <span class="form-input-suffix">最低提现金额1元</span>
                    </div>
                </div>
                <div class="form-row">
                    <label class="form-label">备注：</label>
                    <a-textarea v-model="withdrawForm.remark" class="form-input" placeholder="请输入备注" />
                </div>
            </div>
        </a-modal>

        <!-- 提现记录抽屉 -->
        <WithdrawRecordDrawer
            :visible="withdrawRecordVisible"
            @close="withdrawRecordVisible = false"
        />

        <!-- 报名表单详情弹窗 -->
        <SurveyDetailModal
            :visible="surveyDetailVisible"
            :order-id="orderId"
            @close="surveyDetailVisible = false"
        />
    </div>
</template>

<script>
import socialActivityApi from '@/api/social_activity'
import WithdrawRecordDrawer from './WithdrawRecordDrawer'
import SurveyDetailModal from '../SocialActivityList/SurveyDetailModal'
export default {
    name: 'SocialActivityOrderList',
    components: {
        WithdrawRecordDrawer,
        SurveyDetailModal
    },
    data() {
        return {
            orderId: 0,
            withdrawableAmount: 0,
            searchParams: {
                catId: 0,
                keywords: '',
                sessionName: '',
                nickname: '',
                payTimeRange: []
            },
            categoryList: [],
            dataSource: [],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total, range) => `共 ${total} 条记录`,
            },
            loading: false,
            surveyDetailVisible: false,
            withdrawModalVisible: false,
            withdrawRecordVisible: false,
            withdrawForm: {
                realname: '',
                amount: '',
                remark: ''
            },
            columns: [
                {
                    title: '订单编号',
                    dataIndex: 'order_sn',
                    key: 'order_sn'
                },
                {
                    title: '活动分类',
                    dataIndex: 'category_name',
                    key: 'category_name'
                },
                {
                    title: '活动名称',
                    dataIndex: 'activity_name',
                    key: 'activity_name'
                },
                {
                    title: '活动场次',
                    dataIndex: 'session_name',
                    key: 'session_name'
                },
                {
                    title: '用户昵称',
                    dataIndex: 'nickname',
                    key: 'nickname'
                },
                {
                    title: '报名表单',
                    dataIndex: 'survey_form',
                    key: 'survey_form',
                    scopedSlots: { customRender: 'survey_form' }
                },
                {
                    title: '票种',
                    dataIndex: 'ticket_name',
                    key: 'ticket_name'
                },
                {
                    title: '金额',
                    dataIndex: 'amount',
                    key: 'amount',
                    render: (text) => `¥${text.toFixed(2)}`
                },
                {
                    title: '支付时间',
                    dataIndex: 'pay_time',
                    key: 'pay_time'
                },
                {
                    title: '状态',
                    dataIndex: 'activity_status_text',
                    key: 'activity_status_text',
                    scopedSlots: { customRender: 'activity_status_text' }
                }
            ]
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList(isExport = 0) {
            this.loading = true
            const params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
                cat_id: this.searchParams.catId,
                keywords: this.searchParams.keywords,
                session_name: this.searchParams.sessionName,
                nickname: this.searchParams.nickname,
                start_time: this.searchParams.payTimeRange[0] ? this.searchParams.payTimeRange[0].format('YYYY-MM-DD HH:mm:ss') : '',
                end_time: this.searchParams.payTimeRange[1] ? this.searchParams.payTimeRange[1].format('YYYY-MM-DD HH:mm:ss') : '',
                is_export: isExport
            }
            this.request(socialActivityApi.getOrderList, params).then(res => {
                if (isExport == 1) {
                    window.open(res.file_url)
                    this.loading = false
                    return true
                } else {
                    this.dataSource = res.data || []
                    this.pagination.total = res.total || 0
                }
                this.categoryList = res.category || []
                this.withdrawableAmount = res.withdrawable_amount || 0
                this.loading = false
            })
        },
        search() {
            this.pagination.current = 1
            this.getList()
        },
        resetSearch() {
            this.searchParams = {
                catId: 0,
                keywords: '',
                sessionName: '',
                nickname: '',
                payTimeRange: []
            }
            this.pagination.current = 1
            this.getList()
        },
        exportOrder() {
            this.getList(1)
        },
        onPageChange(pagination) {
            this.pagination.current = pagination.current
            this.pagination.pageSize = pagination.pageSize
            this.getList()
        },
        showSurveyDetail(record) {
            this.orderId = record.id || 0
            this.surveyDetailVisible = true
        },
        showWithdrawModal() {
            this.withdrawForm = {
                amount: '',
                realname: '',
                remark: ''
            }
            this.withdrawModalVisible = true
        },
        handleWithdraw() {
            if (!this.withdrawForm.amount || this.withdrawForm.amount <= 0) {
                this.$message.error('请输入有效金额')
                return
            }
            if (!this.withdrawForm.realname) {
                this.$message.error('请输入提现人姓名')
                return
            }
            if (!this.withdrawForm.remark) {
                this.$message.error('请输入备注')
                return
            }
            this.request(socialActivityApi.applyWithdraw, this.withdrawForm).then(res => {
                this.$message.success('申请提交成功')
                this.withdrawModalVisible = false
                this.getList()
            })
        },
        showWithdrawRecord() {
            this.withdrawRecordVisible = true
        }
    }
}
</script>

<style scoped>
.social-activity-order-list {
    padding: 20px;
    background: #f5f5f5;
    min-height: 100vh;
}

.top-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(129, 210, 207, 1);
    padding: 40px 30px;
    margin-bottom: 16px;
    position: relative;
}

.action-buttons {
    padding-left: 10px;
}

.balance-section {
    display: flex;
    flex-direction: column;
}

.balance-amount {
    color: #fff;
    font-size: 30px;
    font-weight: 500;
}

.action-buttons {
    display: flex;
    gap: 12px;
}

.search-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.search-item {
    width: 75%;
}

.full-width {
    width: 100%;
}

.view-link {
    color: #1890ff;
    cursor: pointer;
}

.survey-detail {
    padding: 16px;
}

.detail-row {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
    border-bottom: none;
}

.detail-label {
    width: 120px;
    font-weight: 500;
    color: #666;
    flex-shrink: 0;
}

.detail-value {
    flex: 1;
    color: #333;
    word-break: break-all;
}

.status-tag {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.status-0 {
    color: #999;
    background: #f5f5f5;
}

.status-10 {
    color: #1890ff;
    background: #e6f7ff;
}

.status-20 {
    color: #faad14;
    background: #fff7e6;
}

.status-30 {
    color: #52c41a;
    background: #f6ffed;
}

.status-40 {
    color: #ff4d4f;
    background: #fff2f0;
}

.withdraw-form {
    padding: 16px;
}

.form-row {
    display: flex;
    align-items: center;
    padding: 12px 0;
}

.form-row:last-child {
    border-bottom: none;
}

.form-label {
    width: 100px;
    font-weight: 500;
    color: #666;
    flex-shrink: 0;
}

.form-input {
    flex: 1;
}

.form-input-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-input-suffix {
    font-size: 10px;
    color: #999;
}
.ant-table-wrapper {
    background: #fff;
}
</style>