<template>
    <a-drawer
        :visible="visible"
        :width="900"
        title="提现记录"
        placement="right"
        @close="$emit('close')"
    >
        <div class="withdraw-record">
            <!-- 搜索栏 -->
            <div class="search-bar">
                <a-range-picker
                    v-model="searchParams.dateRange"
                    format="YYYY-MM-DD"
                    :placeholder="['开始日期', '结束日期']"
                    class="date-picker"
                    label="提现时间"
                />
                <a-select v-model="searchParams.audit_status" placeholder="审核状态" class="status-select" label="审核状态">
                    <a-select-option :value="-1">全部</a-select-option>
                    <a-select-option :value="0">待审核</a-select-option>
                    <a-select-option :value="10">通过</a-select-option>
                    <a-select-option :value="20">审核未通过</a-select-option>
                </a-select>
                <a-button type="primary" @click="search">搜索</a-button>
                <a-button @click="resetSearch">重置</a-button>
                <a-button type="primary" @click="exportRecord">导出</a-button>
            </div>

            <!-- 记录列表 -->
            <a-table
                :columns="columns"
                :data-source="dataSource"
                :pagination="pagination"
                :loading="loading"
                row-key="id"
                @change="onPageChange"
            >
                <template slot="status_text" slot-scope="text, record">
                    <span :class="`status-tag status-${record.status}`">{{ text }}</span>
                </template>
            </a-table>
        </div>
    </a-drawer>
</template>

<script>
import socialActivityApi from '@/api/social_activity'

export default {
    name: 'WithdrawRecordDrawer',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            searchParams: {
                dateRange: [],
                audit_status: -1
            },
            dataSource: [],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100']
            },
            loading: false,
            columns: [
                {
                    title: '提现人',
                    dataIndex: 'realname',
                    key: 'realname'
                },
                {
                    title: '提现金额',
                    dataIndex: 'amount',
                    key: 'amount',
                    render: (text) => `¥${text.toFixed(2)}`
                },
                {
                    title: '备注',
                    dataIndex: 'remark',
                    key: 'remark',
                    render: (text) => text || '--'
                },
                {
                    title: '提现时间',
                    dataIndex: 'create_time',
                    key: 'create_time'
                },
                {
                    title: '审核状态',
                    dataIndex: 'status_text',
                    key: 'status_text',
                    scopedSlots: { customRender: 'status_text' }
                },
                {
                    title: '审核备注',
                    dataIndex: 'audit_remark',
                    key: 'audit_remark',
                    render: (text) => text || '--'
                }
            ]
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
        getList(isExport = 0) {
            this.loading = true
            const params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
                audit_status: this.searchParams.audit_status,
                start_time: this.searchParams.dateRange[0] ? this.searchParams.dateRange[0].format('YYYY-MM-DD') : '',
                end_time: this.searchParams.dateRange[1] ? this.searchParams.dateRange[1].format('YYYY-MM-DD') : '',
                is_export: isExport
            }
            this.request(socialActivityApi.getWithdrawRecordList, params).then(res => {
                if (isExport == 1) {
                    window.open(res.file_url)
                } else {
                    this.dataSource = res.data || []
                    this.pagination.total = res.total || 0
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
                audit_status: -1
            }
            this.pagination.current = 1
        },
        exportRecord() {
            this.getList(1)
        },
        onPageChange(pagination) {
            this.pagination.current = pagination.current
            this.pagination.pageSize = pagination.pageSize
            this.getList()
        }
    }
}
</script>

<style scoped>
.withdraw-record {
    padding: 20px;
}

.search-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 8px;
    margin-bottom: 20px;
}

.date-picker {
    width: 250px;
}

.status-select {
    width: 150px;
}

.status-tag {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.status-0 {
    color: #faad14;
    background: #fff7e6;
}

.status-1 {
    color: #52c41a;
    background: #f6ffed;
}

.status-2 {
    color: #ff4d4f;
    background: #fff2f0;
}
</style>