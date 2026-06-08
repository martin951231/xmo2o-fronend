<template>
    <div class="sensitive-words">
        <div class="search-container">
            <a-row :gutter="[16, 0]">
                <a-col :span="6">
                    <div class="search-item">
                        <label>敏感词：</label>
                        <a-input v-model="searchParams.keyword" placeholder="请输入姓名敏感词" />
                    </div>
                </a-col>
                <a-col :span="5">
                    <div class="search-item">
                        <label>状态：</label>
                        <a-select v-model="searchParams.status" placeholder="请选择状态">
                            <a-select-option :value="0">全部</a-select-option>
                            <a-select-option :value="1">启用</a-select-option>
                            <a-select-option :value="2">禁用</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :span="9">
                    <div class="search-item">
                        <label>添加时间：</label>
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
        
        <div v-saction:sensitive_words_create  class="action-container" >
            <a-button type="primary" @click="showAddModal">添加屏蔽词</a-button>
        </div>
        
        <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" row-key="id" class="main-table">
            <template slot="status" slot-scope="text">
                <span :class="text === 1 ? 'status-enable' : 'status-disable'">
                    {{ text === 1 ? '启用' : '禁用' }}
                </span>
            </template>
            <template slot="action" slot-scope="record">
                <div class="action-buttons">
                    <a v-saction:sensitive_words_edit  href="#"  class="action-btn" @click="showEditModal(record)">编辑</a>
                    <a v-saction:sensitive_words_delete  href="#"  class="action-btn delete-btn" @click="handleDelete(record)">删除</a>
                </div>
            </template>
        </a-table>
        
        <a-modal v-model="modalVisible" :title="isEdit ? '编辑敏感词' : '添加敏感词'" width="500px"
            @ok="handleSubmit" @cancel="handleCancel">
            <a-form-model ref="formRef" :model="formData" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" :rules="formRules">
                <a-form-model-item label="敏感词" required prop="word">
                    <a-textarea v-model="formData.word" placeholder="请输入敏感词，多个敏感词使用逗号隔开" :rows="4" />
                </a-form-model-item>
                <a-form-model-item label="状态" required prop="status" v-if="!isEdit">
                    <a-radio-group v-model="formData.status">
                        <a-radio :value="1">启用</a-radio>
                        <a-radio :value="2">禁用</a-radio>
                    </a-radio-group>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import socialActivityApi from '@/api/social_activity/index'

export default {
    name: 'SensitiveWords',
    data() {
        return {
            columns: [
                { title: '敏感词', dataIndex: 'word', key: 'word' },
                { title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' } },
                { title: '添加时间', dataIndex: 'create_time', key: 'create_time' },
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
                keyword: '',
                status: 0,
                timeRange: null
            },
            
            modalVisible: false,
            isEdit: false,
            formData: {
                id: '',
                word: '',
                status: 1
            },
            formRules: {
                word: [
                    { required: true, message: '请输入敏感词', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ]
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
                keyword: '',
                status: 0,
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
            
            this.request(socialActivityApi.getSensitiveWordList, params).then((res) => {
                this.dataSource = res.data || []
                this.pagination.total = res.total || 0
            })
        },
        
        showAddModal() {
            this.isEdit = false
            this.formData = {
                id: '',
                word: '',
                status: 1
            }
            this.modalVisible = true
        },
        
        showEditModal(record) {
            this.isEdit = true
            this.formData = {
                id: record.id,
                word: record.word,
                status: record.status
            }
            this.modalVisible = true
        },
        
        handleSubmit() {
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    if (this.isEdit) {
                        this.request(socialActivityApi.saveSensitiveWord, this.formData).then((res) => {
                            this.$message.success('编辑成功')
                            this.modalVisible = false
                            this.getList()
                        })
                    } else {
                        const words = this.formData.word.split(/[,，]/).map(w => w.trim()).filter(w => w)
                        if (words.length === 0) {
                            this.$message.warning('请输入敏感词')
                            return
                        }
                        
                        const promises = words.map(word => {
                            return this.request(socialActivityApi.saveSensitiveWord, {
                                word: word,
                                status: this.formData.status
                            })
                        })
                        
                        Promise.all(promises).then(() => {
                            this.$message.success(`成功添加 ${words.length} 个敏感词`)
                            this.modalVisible = false
                            this.getList()
                        }).catch(() => {
                            this.$message.error('部分敏感词添加失败')
                        })
                    }
                }
            })
        },
        
        handleCancel() {
            this.modalVisible = false
        },
        
        handleDelete(record) {
            this.$confirm({
                title: '确认删除',
                content: '确定要删除这个敏感词吗？',
                onOk: () => {
                    this.request(socialActivityApi.deleteSensitiveWord, { id: record.id }).then((res) => {
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
.sensitive-words {
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
        
        .import-btn {
            margin-left: 12px;
        }
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

    .status-enable {
        color: #52c41a;
    }

    .status-disable {
        color: #ff4d4f;
    }

    .action-buttons {
        display: flex;
        gap: 12px;

        .action-btn {
            font-size: 13px;
            cursor: pointer;
            color: #1890FF;

            &:hover {
                text-decoration: underline;
            }
        }

        .delete-btn {
            color: #ff4d4f;
        }
    }
}
</style>
