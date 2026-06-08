<template>
    <div class="activity-comments">
        <div class="search-container">
            <a-row :gutter="[16, 0]">
                <a-col :span="5">
                    <div class="search-item">
                        <label>活动名称：</label>
                        <a-input v-model="searchParams.activity_name" placeholder="请输入活动名称" />
                    </div>
                </a-col>
                <a-col :span="5">
                    <div class="search-item">
                        <label>活动场次：</label>
                        <a-input v-model="searchParams.session" placeholder="请输入活动场次" />
                    </div>
                </a-col>
                <a-col :span="5">
                    <div class="search-item">
                        <label>审核状态：</label>
                        <a-select class="w-100" v-model="searchParams.status" placeholder="请选择审核状态">
                            <a-select-option :value="-1">全部</a-select-option>
                            <a-select-option :value="0">待审核</a-select-option>
                            <a-select-option :value="10">通过</a-select-option>
                            <a-select-option :value="20">拒绝</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :span="5">
                    <div class="search-item">
                        <label>评论时间：</label>
                        <a-range-picker v-model="searchParams.timeRange" format="YYYY-MM-DD" />
                    </div>
                </a-col>
                <a-col :span="4">
                    <div class="search-buttons">
                        <a-button type="primary" @click="handleSearch">查询</a-button>
                        <a-button @click="handleReset">重置</a-button>
                    </div>
                </a-col>
            </a-row>
        </div>

        <div v-saction:comments_check class="action-container">
            <a-button type="primary" @click="handleBatchApprove">通过</a-button>
            <a-button @click="handleBatchReject">拒绝</a-button>
        </div>

        <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" row-key="id"
            :row-selection="rowSelection" class="main-table">
            <template slot="status" slot-scope="text">
                <span :class="getStatusClass(text)">
                    {{ getStatusText(text) }}
                </span>
            </template>
            <template slot="action" slot-scope="record">
                <div class="action-buttons">
                    <a v-if="record.audit_status === 0" v-saction:comments_check class="action-btn approve"
                        @click="showAuditModal(record, 1)">通过</a>
                    <a v-if="record.audit_status === 0" v-saction:comments_check class="action-btn reject"
                        @click="showAuditModal(record, 2)">拒绝</a>
                    <a v-if="record.is_hot === 0" v-saction:comments_select class="action-btn select"
                        @click="handleSelect(record)">精选</a>
                    <a v-if="record.is_hot === 1" v-saction:comments_select class="action-btn cancel"
                        @click="handleCancelSelect(record)">取消精选</a>
                </div>
            </template>
        </a-table>

        <a-modal v-model="auditModalVisible" title="活动评论" width="800px" :closable="true" :maskClosable="false"
            @ok="handleAuditSubmit" @cancel="handleAuditCancel" ok-text="确定" cancel-text="取消">
            <a-descriptions :column="1" bordered size="small">
                <a-descriptions-item label="活动名称">
                    {{ currentRecord.activity_name }}
                </a-descriptions-item>
                <a-descriptions-item label="活动场次">
                    {{ currentRecord.session_name }}
                </a-descriptions-item>
                <a-descriptions-item label="活动时间">
                    {{ currentRecord.activity_time }}
                </a-descriptions-item>
                <a-descriptions-item label="活动地点">
                    {{ currentRecord.session_location }}
                </a-descriptions-item>
                <a-descriptions-item label="用户昵称">
                    {{ currentRecord.nickname }}
                </a-descriptions-item>
                <a-descriptions-item label="评论时间">
                    {{ currentRecord.comment_time }}
                </a-descriptions-item>
                <a-descriptions-item label="评论内容">
                    <div class="comment-content">
                        <p>{{ currentRecord.content }}</p>
                        <div v-if="currentRecord.images && currentRecord.images.length" class="image-list">
                            <img v-for="(img, index) in currentRecord.images" :key="index" :src="img"
                                class="comment-image" />
                        </div>
                    </div>
                </a-descriptions-item>
            </a-descriptions>
            <div class="audit-radio">
                <label>审核：</label>
                <a-radio-group v-model="auditStatus">
                    <a-radio :value="1">通过</a-radio>
                    <a-radio :value="2">拒绝</a-radio>
                </a-radio-group>
            </div>
        </a-modal>
    </div>
</template>

<script>
import socialActivityApi from '@/api/social_activity/index'

export default {
    name: 'ActivityComments',
    data() {
        return {
            columns: [
                { title: '活动名称', dataIndex: 'activity_name', key: 'activity_name' },
                { title: '活动场次', dataIndex: 'session_name', key: 'session_name' },
                { title: '活动时间', dataIndex: 'activity_time', key: 'activity_time' },
                { title: '活动地点', dataIndex: 'session_location', key: 'session_location' },
                { title: '用户昵称', dataIndex: 'nickname', key: 'nickname' },
                { title: '评论内容', dataIndex: 'content', key: 'content', ellipsis: true },
                { title: '评论时间', dataIndex: 'comment_time', key: 'comment_time' },
                { title: '审核状态', dataIndex: 'audit_status_text', key: 'audit_status_text', scopedSlots: { customRender: 'audit_status_text' } },
                { title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
            ],

            dataSource: [],

            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: false,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
            },

            searchParams: {
                activity_name: '',
                session: '',
                timeRange: null,
                status: -1
            },

            selectedRowKeys: [],

            auditModalVisible: false,
            currentRecord: {},
            auditStatus: 1
        }
    },
    computed: {
        rowSelection() {
            return {
                selectedRowKeys: this.selectedRowKeys,
                onChange: this.onSelectChange,
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        handleSearch() {
            this.pagination.current = 1
            this.getList()
        },

        handleReset() {
            this.searchParams = {
                activity_name: '',
                session: '',
                timeRange: null,
                status: -1
            }
            this.pagination.current = 1
            this.getList()
        },

        getList() {
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
                ...this.searchParams
            }

            if (this.searchParams.timeRange && this.searchParams.timeRange.length === 2) {
                params.start_time = this.searchParams.timeRange[0].format('YYYY-MM-DD')
                params.end_time = this.searchParams.timeRange[1].format('YYYY-MM-DD')
                delete params.timeRange
            } else {
                delete params.timeRange
            }

            this.request(socialActivityApi.getCommentList, params).then((res) => {
                this.dataSource = res.data || []
                this.pagination.total = res.total || 0
            })
        },

        onSelectChange(selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
        },

        handleBatchApprove() {
            if (this.selectedRowKeys.length === 0) {
                this.$message.warning('请选择要审核的评论')
                return
            }
            this.$confirm({
                title: '确认通过',
                content: `确定要通过选中的 ${this.selectedRowKeys.length} 条评论吗？`,
                onOk: () => {
                    this.request(socialActivityApi.batchAuditComment, {
                        ids: this.selectedRowKeys,
                        status: 1
                    }).then((res) => {
                        this.$message.success('批量通过成功')
                        this.selectedRowKeys = []
                        this.getList()
                    })
                }
            })
        },

        handleBatchReject() {
            if (this.selectedRowKeys.length === 0) {
                this.$message.warning('请选择要审核的评论')
                return
            }
            this.$confirm({
                title: '确认拒绝',
                content: `确定要拒绝选中的 ${this.selectedRowKeys.length} 条评论吗？`,
                onOk: () => {
                    this.request(socialActivityApi.batchAuditComment, {
                        ids: this.selectedRowKeys,
                        status: 2
                    }).then((res) => {
                        this.$message.success('批量拒绝成功')
                        this.selectedRowKeys = []
                        this.getList()
                    })
                }
            })
        },

        showAuditModal(record, status) {
            this.currentRecord = { ...record }
            this.auditStatus = status
            this.auditModalVisible = true
        },

        handleAuditSubmit() {
            this.request(socialActivityApi.auditComment, {
                id: this.currentRecord.id,
                status: this.auditStatus
            }).then((res) => {
                this.$message.success(this.auditStatus === 1 ? '通过成功' : '拒绝成功')
                this.auditModalVisible = false
                this.getList()
            })
        },

        handleAuditCancel() {
            this.auditModalVisible = false
        },

        handleSelect(record) {
            this.request(socialActivityApi.selectComment, { id: record.id }).then((res) => {
                this.$message.success('精选成功')
                this.getList()
            })
        },

        handleCancelSelect(record) {
            this.request(socialActivityApi.cancelSelectComment, { id: record.id }).then((res) => {
                this.$message.success('取消精选成功')
                this.getList()
            })
        },

        getStatusClass(status) {
            const classMap = {
                0: 'status-pending',
                1: 'status-approved',
                2: 'status-rejected'
            }
            return classMap[status] || ''
        },

        getStatusText(status) {
            const textMap = {
                0: '待审核',
                1: '通过',
                2: '拒绝'
            }
            return textMap[status] || ''
        },

        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getList()
        },

        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getList()
        }
    }
}
</script>

<style lang="less" scoped>
.activity-comments {
    .w-100 {
        width: 100px;
    }

    margin: 10px 0;

    .search-container {
        margin-bottom: 16px;
        padding: 16px;
        background: #fff;
        border: 1px solid #e8e8e8;
        border-radius: 4px;

        .search-item {
            display: flex;
            align-items: center;

            label {
                min-width: 70px;
                text-align: right;
                margin-right: 12px;
                font-size: 14px;
                color: #333;
            }
        }

        .search-buttons {
            display: flex;
            gap: 12px;
        }
    }

    .action-container {
        margin-bottom: 16px;
        display: flex;
        gap: 12px;
    }

    .main-table {
        background: #fff;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        overflow: hidden;

        :deep(.ant-table-thead) {
            background: #f5f5f5;

            th {
                background: #f5f5f5;
                color: #666;
                font-weight: 500;
                font-size: 13px;
                border-bottom: 1px solid #e8e8e8;
            }
        }

        :deep(.ant-table-tbody) {
            tr {
                border-bottom: 1px solid #e8e8e8;

                &:hover {
                    background: #fafafa;
                }
            }

            td {
                font-size: 13px;
                color: #333;
                padding: 12px 16px;
            }
        }

        :deep(.ant-pagination) {
            padding: 12px 16px;
            border-top: 1px solid #e8e8e8;
            text-align: right;

            li {
                margin: 0 2px;

                &.ant-pagination-item-active {
                    background: #1890FF;
                    border-color: #1890FF;

                    a {
                        color: #fff;
                    }
                }
            }
        }
    }

    .status-pending {
        color: #faad14;
    }

    .status-approved {
        color: #52c41a;
    }

    .status-rejected {
        color: #ff4d4f;
    }

    .action-buttons {
        display: flex;
        gap: 8px;

        .action-btn {
            font-size: 13px;
            cursor: pointer;

            &:hover {
                text-decoration: underline;
            }
        }

        .approve {
            color: #52c41a;
        }

        .reject {
            color: #ff4d4f;
        }

        .select {
            color: #1890FF;
        }

        .cancel {
            color: #999;
        }
    }

    .audit-radio {
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #e8e8e8;
        display: flex;
        align-items: center;

        label {
            min-width: 80px;
            margin-right: 16px;
            font-weight: 500;
            color: #333;
            font-size: 14px;
        }
    }

    :deep(.ant-modal) {
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);

        &-header {
            border-bottom: 1px solid #e8e8e8;
            padding: 16px 24px;

            .ant-modal-title {
                font-size: 16px;
                font-weight: 600;
                color: #333;
            }

            .ant-modal-close {
                color: #999;

                &:hover {
                    color: #333;
                }
            }
        }

        &-body {
            padding: 24px;
        }

        &-footer {
            border-top: 1px solid #e8e8e8;
            padding: 16px 24px;

            .ant-btn {
                height: 36px;
                padding: 0 24px;
                font-size: 14px;
                border-radius: 4px;
            }

            .ant-btn-primary {
                background: #1890FF;
                border-color: #1890FF;
            }
        }
    }

    :deep(.ant-descriptions) {
        &-item-label {
            font-weight: 500;
            color: #333;
            font-size: 14px;
        }

        &-item-content {
            color: #666;
            font-size: 14px;
        }
    }
}

.comment-content {
    p {
        margin: 0 0 12px 0;
        color: #666;
        line-height: 1.6;
        font-size: 14px;
    }

    .image-list {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;

        .comment-image {
            width: 135px;
            height: 135px;
            border: 1px solid #e8e8e8;
            border-radius: 4px;
            object-fit: cover;
        }
    }

}
</style>
