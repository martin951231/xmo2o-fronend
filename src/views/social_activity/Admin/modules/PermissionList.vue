<template>
    <div class="permission-management">
        <div class="content-container">
            <div v-saction:permission_create  class="action-container" >
                <a-button type="primary" @click="showPermissionModal">添加权限角色</a-button>
            </div>

            <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" row-key="id"
                class="main-table">
                <template slot="action" slot-scope="record">
                    <div class="action-buttons">
                        <a v-if="!isSuperAdmin(record)" v-saction:permission_edit  href="#" class="action-btn edit-btn"
                            @click="showEditModal(record)">编辑</a>
                        <a v-if="!isSuperAdmin(record)" v-saction:permission_delete  href="#" class="action-btn delete-btn"
                            @click="showDeleteModal(record)">删除</a>
                        <span v-else class="action-btn disabled-btn">超级管理员</span>
                    </div>
                </template>
            </a-table>
        </div>

        <a-modal v-model="modalVisible" :title="isEdit ? '编辑权限套餐' : '添加权限套餐'" width="1200px" :mask="true"
            :mask-closable="false" :closable="true" @ok="handleSubmit" @cancel="handleCancel">
            <div class="permission-content">
                <a-form layout="horizontal">
                    <a-form-item label="角色名称" :label-col="{ span: 2}" :wrapper-col="{ span: 10}">
                        <a-input v-model="formData.name" placeholder="请输入角色名称" />
                    </a-form-item>
                </a-form>

                <div class="permissions-section">
                    <div class="permission-table-container">
                        <div class="permission-table">
                            <div class="permission-header">
                                <div class="menu-cell">菜单名称</div>
                                <div class="actions-cell">权限操作</div>
                            </div>
                            <div v-for="(item, index) in menuTree" :key="item.id" class="permission-row">
                                <div class="menu-cell">
                                    <a-checkbox :checked="item.checked" @change="toggleMenu(item)">{{ item.title}}</a-checkbox>
                                </div>
                                <div class="actions-cell">
                                    <div class="action-group">
                                        <a-checkbox v-for="action in item.children" :key="action.id"
                                            :checked="action.checked" @change="toggleAction(item, action)">{{action.title }}</a-checkbox>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template slot="footer">
                <div class="modal-footer">
                    <a-button @click="handleCancel" class="cancel-btn">取消</a-button>
                    <a-button type="primary" @click="handleSubmit" class="submit-btn">保存</a-button>
                </div>
            </template>
        </a-modal>

        <a-modal v-model="deleteModalVisible" title="删除确认" width="500px" @ok="handleDelete"
            @cancel="deleteModalVisible = false">
            <div class="delete-content">
                <p>确定要删除这个权限角色吗？</p>
                <p class="warning-text">删除后将无法恢复，请谨慎操作！</p>
            </div>
        </a-modal>
    </div>
</template>

<script>
import socialActivityApi from '@/api/social_activity/index'

export default {
    name: 'PermissionList',
    data() {
        return {
            modalVisible: false,
            deleteModalVisible: false,
            isEdit: false,
            deleteId: '',

            formData: {
                id: '',
                name: '',
                permissions: []
            },

            columns: [
                { title: '角色名称', dataIndex: 'name', key: 'name' },
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

            menuTree: []
        }
    },
    created() {
        this.getRoleList()
    },
    methods: {
        getRoleList() {
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize
            }
            this.request(socialActivityApi.getRoleList, params).then((res) => {
                this.dataSource = res.data || []
                this.pagination.total = res.total || 0
            })
        },

        showPermissionModal() {
            this.isEdit = false
            this.formData = {
                id: '',
                name: '',
                permissions: []
            }
            this.loadMenuTree(() => {
                this.resetMenuTree()
                this.modalVisible = true
            })
        },

        showEditModal(record) {
            this.isEdit = true
            this.formData = {
                id: record.id,
                name: record.name,
                menu_ids: record.menus || []
            }
            this.loadMenuTree(() => {
                this.setMenuTree(record.menus || [])
                this.modalVisible = true
            })
        },

        loadMenuTree(callback) {
            this.request(socialActivityApi.getMenuTreeList, {}).then((res) => {
                const menuData = res.data || res || []
                this.menuTree = menuData.filter(item => item.type === 2)
                this.menuTree.forEach(item => {
                    this.$set(item, 'checked', false)
                    if (item.children) {
                        item.children = item.children.filter(child => child.type === 3)
                        item.children.forEach(action => {
                            this.$set(action, 'checked', false)
                        })
                    }
                })
                if (callback) {
                    callback()
                }
            })
        },

        resetMenuTree() {
            this.menuTree.forEach(item => {
                this.$set(item, 'checked', false)
                if (item.children) {
                    item.children.forEach(action => {
                        this.$set(action, 'checked', false)
                    })
                }
            })
        },

        setMenuTree(permissions) {
            this.menuTree.forEach(item => {
                this.$set(item, 'checked', permissions.includes(item.id))
                if (item.children) {
                    item.children.forEach(action => {
                        this.$set(action, 'checked', permissions.includes(action.id))
                    })
                }
            })
        },

        toggleMenu(item) {
            this.$set(item, 'checked', !item.checked)
            if (item.children) {
                item.children.forEach(action => {
                    this.$set(action, 'checked', item.checked)
                })
            }
        },

        toggleAction(item, action) {
            this.$set(action, 'checked', !action.checked)
            if (item.children) {
                const anyChecked = item.children.some(a => a.checked)
                this.$set(item, 'checked', anyChecked)
            }
        },

        collectPermissions() {
            const permissions = []
            this.menuTree.forEach(item => {
                if (item.checked) {
                    permissions.push(item.id)
                }
                if (item.children) {
                    item.children.forEach(action => {
                        if (action.checked) {
                            permissions.push(action.id)
                        }
                    })
                }
            })
            return permissions
        },

        handleSubmit() {
            if (!this.formData.name) {
                this.$message.error('请输入角色名称')
                return
            }
            this.formData.menu_ids = this.collectPermissions()
            this.request(socialActivityApi.saveRole, this.formData).then((res) => {
                this.$message.success(this.isEdit ? '编辑成功' : '添加成功')
                this.modalVisible = false
                this.getRoleList()
            })
        },

        handleCancel() {
            this.modalVisible = false
        },

        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getRoleList()
        },

        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getRoleList()
        },
        showDeleteModal(record) {
            this.deleteId = record.id
            this.deleteModalVisible = true
        },
        handleDelete() {
            this.request(socialActivityApi.deleteRole, { id: this.deleteId }).then((res) => {
                this.$message.success('删除成功')
                this.deleteModalVisible = false
                this.getRoleList()
            })
        },
        isSuperAdmin(record) {
            return record.id === 1
        }
    }
}
</script>

<style lang="less" scoped>
.permission-management {
    .content-container {
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

    .action-buttons {
        display: flex;
        gap: 16px;

        .action-btn {
            font-size: 13px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;

            &:hover {
                text-decoration: none;
            }
        }

        .edit-btn {
            color: #1890FF;

            &:hover {
                background: #e6f7ff;
            }
        }

        .delete-btn {
            color: #ff4d4f;

            &:hover {
                background: #fff1f0;
            }
        }

        .disabled-btn {
            color: #999;
            cursor: not-allowed;
        }
    }

    .delete-content {
        padding: 20px 0;

        p {
            margin-bottom: 12px;
            font-size: 14px;
            color: #333;
        }

        .warning-text {
            color: #ff4d4f;
            font-weight: 600;
        }
    }

    .permission-content {
        padding: 24px;
    }

    :deep(.ant-modal) {
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);

        &-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px 8px 0 0;
            padding: 16px 24px;

            .ant-modal-title {
                color: #fff;
                font-size: 16px;
                font-weight: 600;
            }

            .ant-modal-close {
                color: #fff;

                &:hover {
                    color: #fff;
                }
            }
        }

        &-content {
            border-radius: 0 0 8px 8px;
        }
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 24px;
        border-top: 1px solid #e8e8e8;

        .cancel-btn {
            width: 100px;
            height: 36px;
            font-size: 14px;
        }

        .submit-btn {
            width: 100px;
            height: 36px;
            font-size: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: #667eea;

            &:hover {
                background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                border-color: #764ba2;
            }
        }
    }
}

.permissions-section {
    margin-top: 10px;
    .permission-table-container {
        max-height: 500px;
        overflow-y: auto;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        overflow-x: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

        .permission-table {
            .permission-header {
                display: flex;
                align-items: center;
                padding: 16px 20px;
                background-color: #f5f5f5;
                border-bottom: 1px solid #e8e8e8;
                font-size: 14px;
                font-weight: 600;
                color: #666;

                .menu-cell {
                    width: 300px;
                    flex-shrink: 0;
                    padding-right: 24px;
                    border-right: 1px solid #e8e8e8;
                }

                .actions-cell {
                    flex: 1;
                    padding-left: 24px;
                }
            }

            .permission-row {
                display: flex;
                align-items: flex-start;
                padding: 20px;
                border-bottom: 1px solid #e8e8e8;

                &:last-child {
                    border-bottom: none;
                }

                &:hover {
                    background-color: #fafafa;
                }

                .menu-cell {
                    width: 300px;
                    flex-shrink: 0;
                    padding-right: 24px;
                    border-right: 1px solid #e8e8e8;

                    :deep(.ant-checkbox-wrapper) {
                        font-size: 14px;
                        font-weight: 600;
                        color: #333;
                    }
                }

                .actions-cell {
                    flex: 1;
                    padding-left: 24px;

                    .action-group {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 24px;

                        :deep(.ant-checkbox-wrapper) {
                            font-size: 13px;
                            color: #666;
                            margin-bottom: 8px;

                            &:hover {
                                color: #1890FF;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>