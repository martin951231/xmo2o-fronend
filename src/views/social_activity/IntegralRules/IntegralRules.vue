<template>
    <div class="integral-rules">
        <SearchBar @search="search" @reset="resetSearch" @create="showCreateModal" :searchParams="searchParams" />
        <RulesTable :columns="columns" :dataSource="dataSource" :pagination="pagination" @edit="showEditModal" @delete="handleDelete" />
        <RulesModal v-model="modalVisible" :isEdit="isEdit" :formData="formData" :key="modalKey" @submit="handleSubmit" @cancel="handleCancel" />
    </div>
</template>

<script>
import socialActivityApi from '@/api/social_activity/index'
import SearchBar from './modules/SearchBar.vue'
import RulesTable from './modules/RulesTable.vue'
import RulesModal from './modules/RulesModal.vue'

export default {
    name: 'IntegralRules',
    components: {
        SearchBar,
        RulesTable,
        RulesModal
    },
    data() {
        return {
            modalVisible: false,
            isEdit: false,
            modalKey: 0,
            
            formData: {
                id: '',
                name: '',
                register_score: '',
                participate_score: '',
                share_score: '',
                pay_score: '',
                status: 1
            },
            
            columns: [
                { title: '积分规则名称', dataIndex: 'name', key: 'name' },
                { title: '报名积分', dataIndex: 'sign_point', key: 'sign_point' },
                { title: '参与积分', dataIndex: 'participate_point', key: 'participate_point' },
                { title: '分享积分', dataIndex: 'share_point', key: 'share_point' },
                { title: '支付积分比例(%)', dataIndex: 'pay_ratio', key: 'pay_ratio' },
                { title: '状态', dataIndex: 'status_text', key: 'status_text', scopedSlots: { customRender: 'status_text' } },
                { title: '编辑时间', dataIndex: 'update_time', key: 'update_time' },
                { title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
            ],
            
            dataSource: [],
            
            pagination: {
                current: 1,
                pageSize: 10,
                total: 100,
                showSizeChanger: false,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total, range) => `共 ${total} 条记录`,
            },
            
            searchParams: {
                timeRange: null,
                status: 0
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        search(params) {
            this.pagination.current = 1
            this.searchParams = params
            this.getList()
        },
        
        resetSearch(params) {
            this.pagination.current = 1
            this.searchParams = params
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
            
            this.request(socialActivityApi.getPointRuleList, params).then((res) => {
                this.dataSource = res.data || []
                this.pagination.total = res.total || 0
            })
        },
        
        showCreateModal() {
            this.isEdit = false
            this.formData = {
                id: '',
                name: '',
                register_score: '',
                participate_score: '',
                share_score: '',
                pay_score: '',
                status: 1
            }
            this.modalKey++
            this.modalVisible = true
        },
        
        showEditModal(record) {
            console.log(record)
            this.isEdit = true
            this.formData = {
                id: record.id,
                name: record.name,
                register_score: record.sign_point,
                participate_score: record.participate_point,
                share_score: record.share_point,
                pay_score: record.pay_ratio,
                status: record.status
            }
            this.modalKey++
            this.modalVisible = true
        },
        
        handleSubmit(formData) {
            const params = {
                id: formData.id,
                name: formData.name,
                sign_point: formData.register_score,
                participate_point: formData.participate_score,
                share_point: formData.share_score,
                pay_ratio: formData.pay_score,
                status: formData.status
            }
            this.request(socialActivityApi.savePointRule, params).then((res) => {
                this.$message.success(this.isEdit ? '编辑成功' : '创建成功')
                this.modalVisible = false
                this.getList()
            })
        },
        
        handleCancel() {
            this.modalVisible = false
        },
        
        handleDelete(record) {
            this.$confirm({
                title: '确认删除',
                content: '确定要删除这条积分规则吗？',
                onOk: () => {
                    this.request(socialActivityApi.deletePointRule, { id: record.id }).then((res) => {
                        this.$message.success('删除成功')
                        this.getList()
                    })
                }
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
.integral-rules {
    padding: 16px;
}
</style>