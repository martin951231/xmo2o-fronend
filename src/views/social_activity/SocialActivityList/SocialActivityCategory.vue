<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <div class="page-header">
            <a-button type="primary" v-saction:save @click="showAddModal">创建分类</a-button>
        </div>
        
        <a-table
            :columns="columns"
            :data-source="dataSource"
            :pagination="pagination"
            :loading="loading"
            row-key="id"
        >
            <template slot="action" slot-scope="text, record">
                <a type="link" v-saction:edit @click="showEditModal(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm v-saction:delete placement="top" title="确定要删除这个分类吗？" ok-text="确认" cancel-text="取消" @confirm="handleDelete(record)">
                     <a>删除</a>
                </a-popconfirm>
            </template>
        </a-table>
        
        <!-- 添加/编辑弹窗 -->
        <a-modal
            :title="modalTitle"
            :visible="modalVisible"
            @ok="handleSubmit"
            @cancel="handleCancel"
        >
            <a-form layout="vertical">
                <a-form-item label="分类名称">
                    <a-input 
                        v-model="formData.name" 
                        placeholder="请输入分类名称" 
                        :max-length="50" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import { request } from '@/utils/request'
import socialActivityApi from '@/api/social_activity/index'

export default {
    name: 'SocialActivityCategory',
    data() {
        return {
            columns: [
                {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                    width: 80,
                },
                {
                    title: '分类名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    key: 'create_time',
                },
                {
                    title: '创建人',
                    dataIndex: 'creator',
                    key: 'creator',
                },
                {
                    title: '修改时间',
                    dataIndex: 'update_time',
                    key: 'update_time',
                },
                {
                    title: '修改人',
                    dataIndex: 'modifier',
                    key: 'modifier',
                },
                {
                    title: '操作',
                    key: 'action',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            dataSource: [],
            pagination: {
                current: 1,
                pageSize: 20,
                total: 0,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `总共 ${total} 个项目`,
            },
            loading: false,
            modalVisible: false,
            modalTitle: '创建分类',
            formData: {
                id: 0,
                name: '',
            },
        }
    },
    created() {
        this.getCategoryList()
    },
    methods: {
        // 获取分类列表
        getCategoryList() {
            this.loading = true
            request(socialActivityApi.getCategoryList, {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }).then((response) => {
                this.loading = false
                this.dataSource = response.data || []
                this.pagination.total = response.total || 0
            })
        },
        
        // 显示添加弹窗
        showAddModal() {
            this.modalTitle = '创建分类'
            this.formData = {
                id: 0,
                name: '',
            }
            this.modalVisible = true
        },
        
        // 显示编辑弹窗
        showEditModal(record) {
            this.modalTitle = '编辑分类'
            this.formData = {
                id: record.id,
                name: record.name,
            }
            this.modalVisible = true
        },
        
        // 提交表单
        handleSubmit() {
            if (!this.formData.name.trim()) {
                this.$message.error('请输入分类名称')
                return
            }
            
            request(socialActivityApi.saveCategory, this.formData, 'post').then((response) => {
                this.$message.success(response.msg || '操作成功')
                this.handleCancel()
                this.getCategoryList()
            })
        },
        
        // 取消弹窗
        handleCancel() {
            this.modalVisible = false
            this.formData = {
                id: 0,
                name: '',
            }
        },
        
        // 删除分类
        handleDelete(record) {
            request(socialActivityApi.deleteCategory, { id: record.id }, 'post').then((response) => {
                this.$message.success('删除成功')
                this.getCategoryList()
            })
        },
        
        // 分页变化
        onPageChange(page, pageSize) {
            this.pagination.current = page
            this.pagination.pageSize = pageSize
            this.getCategoryList()
        },
    },
}
</script>

<style scoped>
.page-header {
    margin-bottom: 16px;
}
</style>