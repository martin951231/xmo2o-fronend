<template>
    <div class="account-management">
        <!-- 搜索筛选区域 -->
        <div class="search-container">
            <a-row :gutter="[16, 0]">
                <a-col :span="4">
                    <div class="search-item">
                        <label>账号：</label>
                        <a-input placeholder="请输入账号" v-model="searchParams.account" />
                    </div>
                </a-col>
                <a-col :span="4">
                    <div class="search-item">
                        <label>姓名：</label>
                        <a-input placeholder="请输入姓名" v-model="searchParams.realname" />
                    </div>
                </a-col>
                <a-col :span="4">
                    <div class="search-item">
                        <label>电话：</label>
                        <a-input placeholder="请输入电话" v-model="searchParams.phone" />
                    </div>
                </a-col>
                <a-col :span="4">
                    <div class="search-item">
                        <label>角色：</label>
                        <a-select class="role-select" placeholder="选择角色" v-model="searchParams.role">
                            <a-select-option :value="0">全部</a-select-option>
                            <a-select-option v-for="role in roleList" :key="role.id" :value="role.id">{{ role.name }}</a-select-option>
                        </a-select>
                    </div>
                </a-col>
                <a-col :span="4">
                    <div class="search-buttons">
                        <a-button type="primary" @click="search">搜索</a-button>
                        <a-button @click="resetSearch">重置</a-button>
                    </div>
                </a-col>
            </a-row>
        </div>

        <div class="content-container">
            <!-- 操作按钮 -->
            <div v-saction:account_create  class="action-container">
                <a-button type="primary" @click="showCreateModal">创建账号</a-button>
            </div>

            <!-- 表格 -->
            <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" row-key="id"
                class="main-table">
                <template slot="status_text" slot-scope="text">
                    <span :class="text === '启用' ? 'status-enabled' : 'status-disabled'">{{ text }}</span>
                </template>
                <template slot="action" slot-scope="record">
                    <div class="action-buttons">
                        <a href="#" class="action-btn edit-btn"  v-saction:account_edit @click="showEditModal(record)">编辑</a>
                        <a href="#" class="action-btn delete-btn"  v-saction:account_delete @click="handleDelete(record)">删除</a>
                    </div>
                </template>
            </a-table>
        </div>

        <!-- 创建/编辑账号弹窗 -->
        <a-modal v-model="modalVisible" :title="isEdit ? '编辑账号' : '创建账号'" width="500px" 
            @ok="handleSubmit" @cancel="handleCancel">
            <a-form-model ref="formRef" :model="formData" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :rules="formRules">
                <a-form-model-item label="账号" required prop="account">
                    <a-input v-model="formData.account" placeholder="请输入账号" />
                </a-form-model-item>
                <a-form-model-item label="姓名" required prop="realname">
                    <a-input v-model="formData.realname" placeholder="请输入姓名" />
                </a-form-model-item>
                <a-form-model-item label="电话" required prop="phone">
                    <a-input v-model="formData.phone" placeholder="请输入电话" />
                </a-form-model-item>
                <a-form-model-item label="角色" required prop="role">
                    <a-select v-model="formData.role" placeholder="请选择角色">
                        <a-select-option v-for="role in roleList" :key="role.id" :value="role.id">{{ role.name }}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="区域" prop="village_ids">
                    <a-select mode="multiple" v-model="formData.village_ids" placeholder="请选择区域">
                        <a-select-option v-for="item in villageList" :key="item.village_id" :value="item.village_id">{{ item.village_name }}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="密码" :required="!isEdit" prop="password">
                    <a-input type="password" v-model="formData.password" :placeholder="isEdit ? '请输入新密码（不修改请留空）' : '请输入密码'" />
                </a-form-model-item>
                <a-form-model-item label="状态" required prop="status">
                    <a-radio-group v-model="formData.status">
                        <a-radio :value="1">启用</a-radio>
                        <a-radio :value="0">禁用</a-radio>
                    </a-radio-group>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import socialActivityApi from '@/api/social_activity/index'

export default {
    name: 'AccountList',
    data() {
        return {
            modalVisible: false,
            isEdit: false,
            
            formData: {
                id: '',
                account: '',
                realname: '',
                phone: '',
                role: 1,
                village_ids: [],
                password: '',
                status: 1
            },
            
            formRules: {
                account: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 50, message: '账号长度在3到50个字符之间', trigger: 'blur' }
                ],
                realname: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 50, message: '姓名长度在2到50个字符之间', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
                ],
                role: [
                    { required: true, message: '请选择角色', trigger: 'change' }
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ]
            },
            
            columns: [
                { title: '账号', dataIndex: 'account', key: 'account' },
                { title: '姓名', dataIndex: 'realname', key: 'realname' },
                { title: '电话', dataIndex: 'phone', key: 'phone' },
                { title: '角色', dataIndex: 'role_name', key: 'role_name' },
                { title: '区域', dataIndex: 'village_name', key: 'village_name' },
                { title: '最后登录时间', dataIndex: 'last_login_time', key: 'last_login_time' },
                { title: '状态', dataIndex: 'status_text', key: 'status_text', scopedSlots: { customRender: 'status_text' } },
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
                account: '',
                realname: '',
                phone: '',
                role: 0
            },
            
            villageList: [],
            roleList: []
        }
    },
    created() {
        this.getList()
        this.getVillageList()
        this.getRoleList()
    },
    methods: {
        search() {
            this.pagination.current = 1
            this.getList()
        },
        
        resetSearch() {
            this.pagination.current = 1
            this.searchParams = {
                account: '',
                realname: '',
                phone: '',
                role: 0
            }
            this.getList()
        },
        
        getList() {
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
                ...this.searchParams
            }
            this.request(socialActivityApi.getAdminList, params).then((res) => {
                this.dataSource = res.data || []
                this.pagination.total = res.total || 0
            })
        },
        
        getVillageList() {
            this.request(socialActivityApi.getVillageList, {}).then((res) => {
                this.villageList = res || []
            })
        },
        
        getRoleList() {
            this.request(socialActivityApi.getRoleList, {}).then((res) => {
                this.roleList = res.data || []
            })
        },
        
        showCreateModal() {
            this.isEdit = false
            this.modalVisible = true
            this.formData = {
                id: '',
                account: '',
                realname: '',
                phone: '',
                role: 1,
                village_ids: [],
                password: ''
            }
        },
        
        showEditModal(record) {
            this.isEdit = true
            this.formData = {
                id: record.id,
                account: record.account,
                realname: record.realname,
                phone: record.phone,
                role: record.role_id,
                village_ids: record.village_id ? record.village_id.split(',').map(Number) : [],
                password: '',
                status: record.status
            }
            this.modalVisible = true
            console.log(record,this.formData)
        },
        
        handleSubmit() {
            this.$refs.formRef.validate((valid) => {
                if (valid) {
                    this.request(socialActivityApi.saveAdmin, this.formData).then((res) => {
                        this.$message.success(this.isEdit ? '编辑成功' : '创建成功')
                        this.modalVisible = false
                        this.getList()
                    })
                }
            })
        },
        
        handleCancel() {
            this.modalVisible = false
        },
        
        handleDelete(record) {
            this.$confirm({
                title: '确认删除',
                content: '确定要删除该账号吗？',
                centered: true,
                onOk: () => {
                    this.request(socialActivityApi.deleteAdmin, { id: record.id }).then((res) => {
                        this.$message.success('删除成功')
                        this.getList()
                    })
                },
                onCancel() {}
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
.account-management {
    .search-container {
        background: #fff;
        padding: 12px 16px;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        .role-select {
            width: 100px;
        }
        .search-item {
            display: flex;
            align-items: center;
            
            label {
                min-width: 45px;
                max-width: 45px;
                text-align: right;
                margin-right: 8px;
                color: #666;
                font-size: 14px;
            }

            :deep(.ant-input),
            :deep(.ant-select-selector) {
                width: 100%;
                height: 32px;
                font-size: 13px;
            }
        }

        .search-buttons {
            display: flex;
            gap: 8px;
            justify-content: flex-end;

            :deep(.ant-btn) {
                height: 32px;
                font-size: 13px;
                padding: 0 16px;
            }

            :deep(.ant-btn-primary) {
                background: #1890FF;
                border-color: #1890FF;
            }
        }
    }

    .content-container {
        margin-top: 16px;
        background: #fff;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        overflow: hidden;
    }

    .action-container {
        padding: 16px;
        border-bottom: 1px solid #e8e8e8;
        
        :deep(.ant-btn-primary) {
            height: 32px;
            font-size: 13px;
            padding: 0 20px;
            background: #1890FF;
            border-color: #1890FF;
        }
    }

    .main-table {
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

    .status-enabled {
        color: #52c41a;
    }

    .status-disabled {
        color: #ff4d4f;
    }

    .action-buttons {
        display: flex;
        gap: 12px;

        .action-btn {
            font-size: 13px;
            cursor: pointer;

            &:hover {
                text-decoration: underline;
            }

            &::after {
                content: '|';
                margin-left: 12px;
                color: #d9d9d9;
            }

            &:last-child::after {
                content: '';
                margin-left: 0;
            }
        }

        .edit-btn {
            color: #1890FF;
        }

        .delete-btn {
            color: #ff4d4f;
        }
    }
}
</style>