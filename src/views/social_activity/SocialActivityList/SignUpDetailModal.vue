<template>
    <a-modal
        :visible="visible"
        title="报名情况"
        width="1250px"
        :closable="true"
        @cancel="handleClose"
        footer=""
    >
        <div class="sign-up-detail-modal">
            <div class="stats-row">
                <div class="stat-card">
                    <div class="stat-icon users-icon"><a-icon type="solution" class="icon-lg" /></div>
                    <div class="stat-info">
                        <div class="stat-label">报名数</div>
                        <div class="stat-value">{{ statistics.signUpNum || 0 }}</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon check-in-icon"><a-icon type="form" class="icon-lg" /></div>
                    <div class="stat-info">
                        <div class="stat-label">签到数</div>
                        <div class="stat-value">{{ statistics.checkInNum || 0 }}</div>
                    </div>
                </div>
                <div class="qrcode-section">
                    <img v-if="h5Qrcode" :src="h5Qrcode" alt="签到二维码" class="qrcode-img" @mouseenter="showQrcodePreview" @mouseleave="hideQrcodePreview" />
                    <div class="qrcode-links">
                        <a @click="downloadQrcode" class="link-item">下载签到二维码</a>
                    </div>
                </div>

                <!-- 二维码预览 -->
                <div v-if="qrcodePreviewVisible" class="qrcode-preview" @mouseenter="showQrcodePreview" @mouseleave="hideQrcodePreview">
                    <img :src="h5Qrcode" alt="签到二维码预览" class="qrcode-preview-img" />
                </div>
            </div>

            <div class="search-bar">
                <a-range-picker
                    v-model="searchParams.dateRange"
                    format="YYYY-MM-DD"
                    :placeholder="['开始日期', '结束日期']"
                    class="date-picker"
                />
                <a-select v-model="searchParams.checkInStatus" placeholder="签到状态" class="status-select">
                    <a-select-option :value="-1">全部</a-select-option>
                    <a-select-option :value="0">未签到</a-select-option>
                    <a-select-option :value="1">已签到</a-select-option>
                </a-select>
                <a-button type="primary" @click="search">搜索</a-button>
                <a-button @click="resetSearch">重置</a-button>
                <a-button type="primary" @click="getList(1)">导出</a-button>
            </div>

            <!-- 报名表单详情弹窗 -->
            <SurveyDetailModal
                :visible="surveyDetailVisible"
                :order-id="orderId"
                @close="surveyDetailVisible = false"
            />

            <a-table
                :columns="columns"
                :data-source="dataSource"
                :pagination="pagination"
                :loading="loading"
                row-key="id"
            >
                <template slot="nickname" slot-scope="text, record">
                    {{ record.nickname || '-' }}
                </template>
                <template slot="survey_form" slot-scope="text, record">
                    <a @click="showSurveyDetail(record)" class="view-link">查看</a>
                </template>
                <template slot="phone" slot-scope="text, record">
                    {{ record.phone || '-' }}
                </template>
                <template slot="create_time" slot-scope="text, record">
                    {{ record.create_time || '-' }}
                </template>
                <template slot="user_source" slot-scope="text, record">
                    {{ record.user_source || '-' }}
                </template>
                <template slot="sign_text" slot-scope="text, record">
                    <span :class="getCheckInStatusClass(record.is_sign)">
                        {{ record.sign_text || '-' }}
                    </span>
                </template>
            </a-table>
        </div>
    </a-modal>
</template>

<script>
import socialActivityApi from '@/api/social_activity'
import SurveyDetailModal from './SurveyDetailModal'

export default {
    name: 'SignUpDetailModal',
    components: {
        SurveyDetailModal
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        sessionId: {
            type: Number,
            default: 0
        },
        sessionName: {
            type: String,
            default: ''
        },
        id: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            columns: [
                {
                    title: '用户昵称',
                    dataIndex: 'nickname',
                    key: 'nickname',
                    scopedSlots: { customRender: 'nickname' },
                    width: 100
                },
                {
                    title: '手机号',
                    dataIndex: 'phone',
                    key: 'phone',
                    width: 120
                },
                {
                    title: '姓名',
                    dataIndex: 'user_name',
                    key: 'user_name',
                    width: 100
                },
                {
                    title: '身份证号',
                    dataIndex: 'id_number',
                    key: 'id_number',
                    width: 180
                },
                {
                    title: '报名表单',
                    dataIndex: 'survey_form',
                    key: 'survey_form',
                    scopedSlots: { customRender: 'survey_form' },
                    width: 80
                },
                {
                    title: '票种',
                    dataIndex: 'ticket_name',
                    key: 'ticket_name',
                    width: 80
                },
                {
                    title: '金额',
                    dataIndex: 'amount',
                    key: 'amount',
                    width: 80
                },
                {
                    title: '报名时间',
                    dataIndex: 'create_time',
                    key: 'create_time',
                    scopedSlots: { customRender: 'create_time' },
                    width: 150
                },
                {
                    title: '来源',
                    dataIndex: 'user_source',
                    key: 'user_source',
                    scopedSlots: { customRender: 'user_source' },
                    width: 100
                },
                {
                    title: '签到状态',
                    dataIndex: 'sign_text',
                    key: 'sign_text',
                    scopedSlots: { customRender: 'sign_text' },
                    width: 100
                }
            ],
            dataSource: [],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
            },
            loading: false,
            searchParams: {
                dateRange: [],
                checkInStatus: -1
            },
            statistics: {
                signUpNum: 0,
                checkInNum: 0
            },
            qrcodeUrl: '',
            h5Qrcode: '',
            qrcodePreviewVisible: false,
            surveyDetailVisible: false,
            orderId: 0
        }
    },
    watch: {
        visible(val) {
            if (val && this.sessionId) {
                this.resetSearch()
                this.getList()
            }
        }
    },
    methods: {
        getList(is_export = 0) {
            this.loading = true
            const params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
                session_id: this.sessionId,
                id: this.id,
                start_date: this.searchParams.dateRange[0] ? this.searchParams.dateRange[0].format('YYYY-MM-DD') : '',
                end_date: this.searchParams.dateRange[1] ? this.searchParams.dateRange[1].format('YYYY-MM-DD') : '',
                check_in_status: this.searchParams.checkInStatus,
                is_export: is_export
            }
            this.request(socialActivityApi.getSignUpList, params).then(res => {
                if(is_export == 1){
                    window.open(res.file_url)
                    this.loading = false
                    return
                }
                this.dataSource = res.data || []
                this.pagination.total = res.total || 0
                this.statistics = {
                    signUpNum: res.signUpNum || 0,
                    checkInNum: res.checkInNum || 0
                };
                this.h5Qrcode = ''
                this.qrcodeUrl = res.qrcode_url || ''
                if (this.qrcodeUrl) {
                    var url = encodeURIComponent(this.qrcodeUrl)
                    this.h5Qrcode = location.origin + '/index.php?g=Index&c=Recognition&a=get_own_qrcode&qrCon=' + url
                }
                this.loading = false
            })
        },
        search() {
            this.pagination.current = 1
            this.getList()
        },
        resetSearch() {
            this.searchParams = {
                dateRange: [],
                checkInStatus: -1
            }
            this.pagination.current = 1
        },
        downloadQrcode() {
            if (this.h5Qrcode) {
                window.open(this.h5Qrcode)
            }
        },
        showSurveyDetail(record) {
            this.orderId = record.id
            this.surveyDetailVisible = true
        },
        showQrcodePreview() {
            this.qrcodePreviewVisible = true
        },
        hideQrcodePreview() {
            this.qrcodePreviewVisible = false
        },
        onPageChange(page, pageSize) {
            this.pagination.current = page
            this.getList()
        },
        onPageSizeChange(page, pageSize) {
            this.pagination.pageSize = pageSize
            this.getList()
        },
        handleClose() {
            this.$emit('close')
        },
        getCheckInStatusClass(status) {
            const classMap = {
                0: 'status-not-checkin',
                1: 'status-checked'
            }
            return classMap[status] || 'status-default'
        }
    }
}
</script>

<style scoped>
.sign-up-detail-modal {
    padding: 0;
}

.stats-row {
    display: flex;
    justify-content: flex-start;
    gap: 20px;
    margin-bottom: 20px;
    padding: 20px;
    background: #fafafa;
    border-radius: 8px;
    height: 120px;
}

.stat-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    background: #fff;
    border-radius: 8px;
    min-width: 180px;
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.users-icon {
    background: #f9f0ff;
}

.users-icon .icon-lg {
    font-size: 50px;
    color: #1890ff;;
}

.check-in-icon {
    background: #e6f7ff;
}

.check-in-icon .icon-lg {
    font-size: 50px;
    color: #1890ff;
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-label {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
}

.stat-value {
    font-size: 24px;
    font-weight: 600;
    color: #333;
}

.qrcode-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: auto;
}

.qrcode-img {
    width: 90px;
    height: 80px;
    cursor: pointer;
}

.qrcode-preview {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 8px;
}

.qrcode-preview-img {
    width: 300px;
    height: 300px;
    display: block;
}

.qrcode-links {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.link-item {
    font-size: 12px;
    color: #1890ff;
    cursor: pointer;
    text-align: center;
}

.link-item:hover {
    text-decoration: underline;
}

.search-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
}

.date-picker {
    width: 250px;
}

.status-select {
    width: 120px;
}

.status-not-checkin {
    color: #faad14;
    background: #fff7e6;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.status-checked {
    color: #52c41a;
    background: #f6ffed;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.status-default {
    color: #999;
    background: #f5f5f5;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.view-link {
    color: #1890ff;
    cursor: pointer;
}
</style>