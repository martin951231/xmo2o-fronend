<template>
    <div class="permission-management">
        <div class="content-container">
            <div v-saction:permission_create class="action-container">
                <a-button type="primary" @click="showPermissionModal">添加权限角色</a-button>
            </div>

            <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" row-key="id"
                class="main-table">
                <template slot="action" slot-scope="record">
                    <div class="action-buttons">
                        <a v-if="!isSuperAdmin(record)" v-saction:permission_edit href="#" class="action-btn edit-btn"
                            @click="showEditModal(record)">编辑</a>
                        <a v-if="!isSuperAdmin(record)" v-saction:permission_delete href="#"
                            class="action-btn delete-btn" @click="showDeleteModal(record)">删除</a>
                        <span v-else class="action-btn disabled-btn">超级管理员</span>
                    </div>
                </template>
            </a-table>
        </div>

        <a-modal v-model="modalVisible" :title="isEdit ? '编辑权限套餐' : '添加权限套餐'" width="1200px" :mask="true"
            :mask-closable="false" :closable="true" @ok="handleSubmit" @cancel="handleCancel">
            <div class="permission-content">
                <a-form layout="horizontal">
                    <a-form-item label="角色名称" :label-col="{ span: 2 }" :wrapper-col="{ span: 10 }">
                        <a-input v-model="formData.name" placeholder="请输入角色名称" />
                    </a-form-item>
                </a-form>

                <div class="permissions-section">
                    <div class="permission-table-container">
                        <template v-for="item in menuTree">
                            <div v-if="item.type === 1" class="permission-group" :key="item.id">
                                <div class="group-header" @click="toggleGroup(item)">
                                    <span class="arrow" :class="{ 'arrow-open': item._open }">&#9654;</span>
                                    <a-checkbox :checked="item.checked" :indeterminate="item.indeterminate"
                                        @change="toggleMenu(item)" @click.native.stop>{{ item.title }}</a-checkbox>
                                </div>
                                <div v-show="item._open" class="group-body">
                                    <div v-for="menu in item.children" :key="menu.id" class="permission-row">
                                        <div class="menu-cell">
                                            <a-checkbox :checked="menu.checked" :indeterminate="menu.indeterminate"
                                                :disabled="menu.forceChecked"
                                                @change="toggleMenu(menu)">{{ menu.title }}</a-checkbox>
                                        </div>
                                        <div class="actions-cell">
                                            <div v-if="menu.children && menu.children.length" class="action-group">
                                                <a-checkbox v-for="action in menu.children" :key="action.id"
                                                    :checked="action.checked" @change="toggleAction(menu, action)">{{ action.title }}</a-checkbox>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="permission-group" v-else-if="item.type === 2">
                                <div class="group-body">
                                    <div class="permission-row">
                                        <div class="menu-cell">
                                            <a-checkbox :checked="item.checked" :indeterminate="item.indeterminate"
                                                :disabled="item.forceChecked"
                                                @change="toggleMenu(item)">{{ item.title }}</a-checkbox>
                                        </div>
                                        <div class="actions-cell">
                                            <div v-if="item.children && item.children.length" class="action-group">
                                                <a-checkbox v-for="action in item.children" :key="action.id"
                                                    :checked="action.checked" @change="toggleAction(item, action)">{{
                                                    action.title }}</a-checkbox>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
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
                const list = []
                menuData.forEach(item => {
                    if (item.type === 1) {
                        list.push(this.normalizeGroup(item))
                    } else if (item.type === 2) {
                        list.push(this.normalizeMenu(item))
                    }
                })
                this.menuTree = list
                if (callback) {
                    callback()
                }
            })
        },

        normalizeGroup(group) {
            const result = {
                id: group.id,
                pid: group.pid,
                title: group.title,
                type: group.type,
                _open: true,
                checked: false,
                indeterminate: false,
                children: []
            }
            if (group.children && Array.isArray(group.children)) {
                result.children = group.children
                    .filter(c => c.type === 2)
                    .map(menu => {
                        const m = this.normalizeMenu(menu)
                        m.pidGroup = result
                        return m
                    })
            }
            return result
        },

        normalizeMenu(menu) {
            const forceChecked = menu.component === 'SocialActivityIndex'
            const result = {
                id: menu.id,
                pid: menu.pid,
                title: menu.title,
                type: menu.type,
                forceChecked: forceChecked,
                checked: forceChecked,
                indeterminate: false,
                children: []
            }
            if (menu.children && Array.isArray(menu.children)) {
                result.children = menu.children
                    .filter(c => c.type === 3)
                    .map(action => ({
                        id: action.id,
                        pid: action.pid,
                        title: action.title,
                        type: action.type,
                        checked: false
                    }))
            }
            return result
        },

        toggleGroup(group) {
            this.$set(group, '_open', !group._open)
        },

        toggleMenu(item) {
            if (item.forceChecked) return
            const newVal = !item.checked
            this.$set(item, 'checked', newVal)
            this.$set(item, 'indeterminate', false)

            if (item.type === 1 && item.children) {
                item.children.forEach(menu => {
                    if (menu.forceChecked) return
                    this.$set(menu, 'checked', newVal)
                    this.$set(menu, 'indeterminate', false)
                    if (menu.children) {
                        menu.children.forEach(action => {
                            this.$set(action, 'checked', newVal)
                        })
                    }
                })
            } else if (item.type === 2 && item.children) {
                item.children.forEach(action => {
                    this.$set(action, 'checked', newVal)
                })
            }
        },

        toggleAction(menu, action) {
            this.$set(action, 'checked', !action.checked)
        },

        collectMenuPermissions(menu, out) {
            let hasActionChecked = false
            if (menu.children && menu.children.length) {
                menu.children.forEach(action => {
                    if (action.checked) {
                        hasActionChecked = true
                        out.push(action.id)
                    }
                })
                if (hasActionChecked || menu.checked) {
                    out.push(menu.id)
                }
            } else if (menu.checked) {
                out.push(menu.id)
            }
        },

        setMenuTree(permissions) {
            const ids = permissions.map(Number)
            this.menuTree.forEach(item => {
                if (item.type === 1) {
                    let anyMenuChecked = false
                    item.children.forEach(menu => {
                        if (menu.forceChecked) {
                            this.$set(menu, 'checked', true)
                            this.$set(menu, 'indeterminate', false)
                            anyMenuChecked = true
                            if (menu.children) {
                                menu.children.forEach(action => {
                                    this.$set(action, 'checked', true)
                                })
                            }
                        } else if (menu.children && menu.children.length) {
                            let anyActionChecked = false
                            menu.children.forEach(action => {
                                const checked = ids.includes(action.id)
                                this.$set(action, 'checked', checked)
                                if (checked) anyActionChecked = true
                            })
                            const menuChecked = ids.includes(menu.id) || anyActionChecked
                            this.$set(menu, 'checked', menuChecked)
                            this.$set(menu, 'indeterminate', false)
                            if (menuChecked) anyMenuChecked = true
                        } else {
                            const checked = ids.includes(menu.id)
                            this.$set(menu, 'checked', checked)
                            this.$set(menu, 'indeterminate', false)
                            if (checked) anyMenuChecked = true
                        }
                    })
                    const groupChecked = ids.includes(item.id) || anyMenuChecked
                    this.$set(item, 'checked', groupChecked)
                    this.$set(item, 'indeterminate', false)
                } else if (item.type === 2) {
                    if (item.forceChecked) {
                        this.$set(item, 'checked', true)
                        this.$set(item, 'indeterminate', false)
                        if (item.children) {
                            item.children.forEach(action => {
                                this.$set(action, 'checked', true)
                            })
                        }
                    } else if (item.children && item.children.length) {
                        let anyActionChecked = false
                        item.children.forEach(action => {
                            const checked = ids.includes(action.id)
                            this.$set(action, 'checked', checked)
                            if (checked) anyActionChecked = true
                        })
                        const menuChecked = ids.includes(item.id) || anyActionChecked
                        this.$set(item, 'checked', menuChecked)
                        this.$set(item, 'indeterminate', false)
                    } else {
                        this.$set(item, 'checked', ids.includes(item.id))
                        this.$set(item, 'indeterminate', false)
                    }
                }
            })
        },

        collectPermissions() {
            const permissions = []
            this.menuTree.forEach(item => {
                if (item.type === 1) {
                    item.children.forEach(menu => {
                        this.collectMenuPermissions(menu, permissions)
                    })
                } else if (item.type === 2) {
                    this.collectMenuPermissions(item, permissions)
                }
            })
            return permissions
        },

        collectMenuPermissions(menu, out) {
            if (menu.children && menu.children.length) {
                let hasActionChecked = false
                menu.children.forEach(action => {
                    if (action.checked) {
                        hasActionChecked = true
                        out.push(action.id)
                    }
                })
                if (hasActionChecked || menu.checked) {
                    out.push(menu.id)
                }
            } else if (menu.checked) {
                out.push(menu.id)
            }
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
    }

    .permission-group {
        border-bottom: 1px solid #e8e8e8;

        &:last-child {
            border-bottom: none;
        }

        .group-header {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            background-color: #f0f2f5;
            cursor: pointer;
            font-weight: 600;
            color: #333;

            &:hover {
                background-color: #e6f0ff;
            }

            .arrow {
                display: inline-block;
                width: 14px;
                font-size: 10px;
                color: #666;
                margin-right: 8px;
                transition: transform 0.2s;
            }

            .arrow-open {
                transform: rotate(90deg);
            }

            :deep(.ant-checkbox-wrapper) {
                font-size: 14px;
                font-weight: 600;
                color: #333;
            }
        }

        .group-body {
            .permission-row {
                display: flex;
                align-items: flex-start;
                padding: 14px 20px;
                border-bottom: 1px solid #f0f0f0;

                &:last-child {
                    border-bottom: none;
                }

                &:hover {
                    background-color: #fafafa;
                }

                .menu-cell {
                    width: 220px;
                    flex-shrink: 0;
                    padding-right: 16px;
                    border-right: 1px solid #f0f0f0;

                    :deep(.ant-checkbox-wrapper) {
                        font-size: 13px;
                        font-weight: 500;
                        color: #333;
                    }
                }

                .actions-cell {
                    flex: 1;
                    padding-left: 16px;

                    .action-group {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 20px;

                        :deep(.ant-checkbox-wrapper) {
                            font-size: 13px;
                            color: #666;
                            margin-bottom: 4px;

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
