<template>
    <div class="integral-detail">
        <div class="search-container">
            <a-row :gutter="[16, 0]">
                <a-col :span="5">
                    <div class="search-item">
                        <label>姓名：</label>
                        <a-input v-model="searchParams.name" placeholder="请输入姓名" />
                    </div>
                </a-col>
                <a-col :span="5">
                    <div class="search-item">
                        <label>手机号：</label>
                        <a-input v-model="searchParams.phone" placeholder="请输入手机号" />
                    </div>
                </a-col>
                <a-col :span="5">
                    <div class="search-item">
                        <label>活动名称：</label>
                        <a-input v-model="searchParams.activity_name" placeholder="请输入活动名称" />
                    </div>
                </a-col>
                <a-col :span="5">
                    <div class="search-item">
                        <label>获得时间：</label>
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
        <DetailTable :columns="columns" :dataSource="dataSource" :pagination="pagination" />
    </div>
</template>

<script>
import socialActivityApi from '@/api/social_activity/index'
import DetailTable from './modules/DetailTable.vue'

export default {
    name: 'IntegralDetail',
    components: {
        DetailTable
    },
    data() {
        return {
            columns: [
                { title: '姓名', dataIndex: 'nickname', key: 'nickname' },
                { title: '手机号', dataIndex: 'phone', key: 'phone' },
                { title: '住址/来源', dataIndex: 'village_name', key: 'village_name' },
                { title: '活动名称', dataIndex: 'activity_name', key: 'activity_name' },
                { title: '活动场次', dataIndex: 'session_name', key: 'session_name' },
                { title: '积分规则', dataIndex: 'rule_name', key: 'rule_name' },
                { title: '描述', dataIndex: 'desc', key: 'desc' },
                { title: '获得时间', dataIndex: 'create_time', key: 'create_time' },
                { 
                    title: '积分数量', 
                    dataIndex: 'score_text', 
                    key: 'score_text',
                    scopedSlots: { customRender: 'score_text' }
                }
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
                showTotal: (total, range) => `共 ${total} 条记录`,
            },
            
            searchParams: {
                name: '',
                phone: '',
                activity_name: '',
                timeRange: null
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
                name: '',
                phone: '',
                activity_name: '',
                timeRange: null
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
            
            this.request(socialActivityApi.getPointDetailList, params).then((res) => {
                this.dataSource = res.data || []
                this.pagination.total = res.total || 0
            })
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
.integral-detail {
    padding: 16px;
    
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
}
</style>
