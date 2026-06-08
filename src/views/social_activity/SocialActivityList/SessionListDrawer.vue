<template>
    <div>
        <a-drawer
            :visible="visible"
            :title="title"
            width="800"
            :closable="true"
            @close="handleClose"
        >
            <div class="session-list-drawer">
                <div class="search-bar">
                    <a-input v-model="searchParams.name" placeholder="搜索场次名称" class="search-input" />
                    <a-button type="primary" @click="search">搜索</a-button>
                    <a-button @click="resetSearch">重置</a-button>
                </div>

                <a-table
                    :columns="columns"
                    :data-source="dataSource"
                    :pagination="pagination"
                    :loading="loading"
                    row-key="id"
                >
                    <template slot="sessionName" slot-scope="text, record">
                        {{ record.name || '-' }}
                    </template>
                    <template slot="activityTime" slot-scope="text, record">
                        {{ record.time_range || '-' }}
                    </template>
                    <template slot="totalNum" slot-scope="text, record">
                        {{ record.total_num || 0 }}
                    </template>
                    <template slot="signUpNum" slot-scope="text, record">
                        <a @click="showSignUpDetail(record)" class="action-btn">
                            {{ record.sign_up_num || 0 }}/{{ record.check_in_num || 0 }}
                        </a>
                    </template>
                    <template slot="status" slot-scope="text, record">
                        <span :class="getStatusClass(record.status)">{{ record.status_text || '-' }}</span>
                    </template>
                </a-table>
            </div>
        </a-drawer>

        <!-- 报名详情弹窗 -->
        <SignUpDetailModal
            :visible="signUpDetailVisible"
            :sessionId="currentSessionId"
            :sessionName="currentSessionName"
            :id="id"
            @close="signUpDetailVisible = false"
            style="width: 800px;"
        />
    </div>
</template>

<script>
import socialActivityApi from '@/api/social_activity'
import SignUpDetailModal from './SignUpDetailModal'

export default {
    name: 'SessionListDrawer',
    components: {
        SignUpDetailModal
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        activityId: {
            type: Number,
            default: 0
        },
        activityName: {
            type: String,
            default: ''
        }
    },
    data() {
            return {
                columns: [
                    {
                        title: '活动场次',
                        dataIndex: 'name',
                        key: 'name',
                        scopedSlots: { customRender: 'sessionName' },
                        width: 120
                    },
                    {
                        title: '活动时间',
                        dataIndex: 'start_time',
                        key: 'start_time',
                        scopedSlots: { customRender: 'activityTime' },
                        width: 180
                    },
                    {
                        title: '活动人数',
                        dataIndex: 'total_num',
                        key: 'total_num',
                        scopedSlots: { customRender: 'totalNum' },
                        width: 90
                    },
                    {
                        title: '报名/签到',
                        dataIndex: 'sign_up_num',
                        key: 'sign_up_num',
                        scopedSlots: { customRender: 'signUpNum' },
                        width: 90
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        key: 'status',
                        scopedSlots: { customRender: 'status' },
                        width: 80
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
                    name: ''
                },
                signUpDetailVisible: false,
                currentSessionId: 0,
                currentSessionName: '',
                id: 0, //场次关联某天id
            }
        },
    computed: {
        title() {
            return this.activityName ? `${this.activityName} - 场次列表` : '场次列表'
        }
    },
    watch: {
        visible(val) {
            if (val) {
                this.resetSearch()
                this.getList()
            }
        }
    },
    methods: {
        getList() {
            this.loading = true
            const params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
                name: this.searchParams.name,
                activity_id: this.activityId
            }
            this.request(socialActivityApi.getSessionList, params).then(res => {
                this.dataSource = res.data || []
                this.pagination.total = res.total || 0
                this.loading = false
            })
        },
        search() {
            this.pagination.current = 1
            this.getList()
        },
        resetSearch() {
            this.searchParams = {
                name: ''
            }
            this.pagination.current = 1
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
        showSignUpDetail(record) {
            this.currentSessionId = record.session_id
            this.id = record.id
            this.currentSessionName = record.name
            this.signUpDetailVisible = true
        },
        getStatusClass(status) {
            const classMap = {
                0: 'status-pending',
                1: 'status-active',
                2: 'status-ended'
            }
            return classMap[status] || 'status-default'
        }
    }
}
</script>

<style scoped>
.session-list-drawer {
    padding: 0;
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

.search-input {
    width: 200px;
}

.status-pending {
    color: #faad14;
    background: #fff7e6;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.status-active {
    color: #52c41a;
    background: #f6ffed;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.status-ended {
    color: #666;
    background: #f5f5f5;
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
</style>