<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row>
            <a-col>
                <a-button type="primary" class="mr-20" @click="editItem()">{{ L('新建岗位') }}</a-button>
            </a-col>
        </a-row>

        <a-table class="mt-20" rowKey="id" :columns="columns" :data-source="list" :pagination="pagination">
            <span slot="station_name" slot-scope="text">
                {{ text || '-' }}
            </span>
            <span slot="menus" slot-scope="text, record" class="cr-primary pointer" @click="openModalAuthority(record)">
                {{ L('查看') }}
            </span>
            <span slot="status" slot-scope="text">
                <font v-if="text == 1" class="font-blue">{{ L('正常') }}</font>
                <font v-else class="font-red">{{ L('禁止') }}</font>
            </span>
            <!-- 操作栏 -->
            <span slot="action" slot-scope="text, record">
                <span class="cr-primary pointer mr-20" @click="editItem(record)">{{ L('编辑') }}</span>
                <span class="cr-primary pointer font-gray" @click="delItem(record)">{{ L('删除') }}</span>
            </span>
        </a-table>

        <a-modal
            :visible="modalVisible"
            :title="modalTitle"
            :destroyOnClose="true"
            width="60%"
            :bodyStyle="{
                maxHeight: '650px',
                overflowY: 'auto',
            }"
            @cancel="handleCancel"
            @ok="handleOk"
        >
            <a-form-model :model="modalForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
                <a-form-model-item :label="L('岗位名称')" required>
                    <a-input allow-clear v-model="modalForm.station_name" :placeholder="L('请输入')" />
                </a-form-model-item>
                <a-form-model-item :label="L('岗位描述')">
                    <a-textarea
                        allow-clear
                        v-model="modalForm.station_desc"
                        :placeholder="L('请输入')"
                        :autoSize="{ minRows: 5, maxRows: 10 }"
                        style="resize: none"
                        :maxLength="-1"
                    />
                </a-form-model-item>
                <a-form-model-item :label="L('权限')">
                    <a-button @click="openModalAuthority()">{{ L('设置权限') }}</a-button>
                </a-form-model-item>
                <a-form-model-item :label="L('状态')">
                    <a-switch
                        :checked-children="L('正常')"
                        :un-checked-children="L('禁止')"
                        :checked="modalForm.status == 1 ? true : false"
                        @change="switchChange"
                    />
                </a-form-model-item>
            </a-form-model>
        </a-modal>

        <a-modal
            :visible="modalAuthority"
            :title="modalForm.is_view ? L('岗位权限') : L('设置岗位权限')"
            :destroyOnClose="true"
            width="60%"
            :bodyStyle="{
                height: '650px',
                overflowY: 'auto',
            }"
            :zIndex="1001"
            @cancel="handleCancelAuthority"
            @ok="handleOkAuthority"
        >
            <a-tree
                v-if="authorityList.length"
                checkable
                :defaultExpandAll="true"
                :tree-data="authorityList"
                :replaceFields="{ key: 'id' }"
                :blockNode="true"
                :selectable="false"
                v-model="modalForm.menus_select"
                class="merchant-account-auth-menu-tree"
                @check="menuCheck"
            >
            </a-tree>

            <div
                class="title font-14 item-2"
                style="padding-left: 30px; box-sizing: border-box; width: calc(100% - 8px)"
                v-if="authorityList.length"
            >
                <a-checkbox
                    :checked="checkedAll"
                    :disabled="modalForm.is_view ? true : false"
                    @change="onCheckAllChange($event)"
                >
                    <span class="cr-333" style="margin-left: 8px">{{ L('全选') }}</span>
                </a-checkbox>
            </div>
        </a-modal>
    </div>
</template>

<script>
import MerchantApi from '@/api/merchant/merchant/index'
export default {
    data() {
        return {
            list: [],
            columns: [
                {
                    title: this.L('岗位名称'),
                    dataIndex: 'station_name',
                },
                {
                    title: this.L('岗位描述'),
                    dataIndex: 'station_desc',
                    ellipsis: true,
                },
                {
                    title: this.L('权限'),
                    dataIndex: 'menus',
                    scopedSlots: {
                        customRender: 'menus',
                    },
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status',
                    scopedSlots: {
                        customRender: 'status',
                    },
                },
                {
                    title: this.L('创建时间'),
                    dataIndex: 'create_time',
                },
                {
                    title: this.L('更新时间'),
                    dataIndex: 'last_time',
                },
                {
                    title: this.L('操作'),
                    key: 'action',
                    scopedSlots: {
                        customRender: 'action',
                    },
                },
            ],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            modalVisible: false,
            modalTitle: '',
            modalForm: '',
            // 权限
            modalAuthority: false,
            // 权限列表
            authorityList: [],
            // 权限全选
            checkedAll: false,
        }
    },
    mounted() {
        this.getList()
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        // 账号列表
        getList() {
            let params = {
                page: this.pagination.current,
                page_size: this.pagination.pageSize,
            }
            this.request(MerchantApi.merStationsList, params).then((res) => {
                this.list = res.data || []
                if (!this.list.length && this.pagination.current > 1) {
                    this.pageSize.current = this.pageSize.current - 1
                    this.getList()
                }
                this.pagination.total = res.total || 0
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getList()
        },
        // 添加 || 编辑
        editItem(record = '') {
            if (record) {
                this.modalTitle = this.L('岗位编辑')
                this.modalForm = {
                    id: record.id,
                    station_name: record.station_name,
                    station_desc: record.station_desc,
                    // 没有全选的情况下选择子菜单需要把子菜单的父级id带上
                    menus: record.menus ? record.menus.map((item) => item - 0) : [],
                    // 不包含父级id
                    menus_select:record.menus_select ? record.menus_select.map((item) => item - 0) : [],
                    status: record.status,
                }
            } else {
                this.modalTitle = this.L('新建岗位')
                this.modalForm = {
                    station_name: '',
                    station_desc: '',
                    menus: [],
                    menus_select: [],
                    status: 1,
                }
            }

            this.modalVisible = true
        },
        // 删除
        delItem(record = '') {
            this.$confirm({
                title: this.L('确定要删除吗？删除后无法恢复'),
                centered: true,
                onOk: () => {
                    this.request(MerchantApi.merStationsDel, {
                        id: record.id,
                    }).then((res) => {
                        this.$message.success(this.L('操作成功！'))
                        this.getList()
                    })
                },
                onCancel() {},
            })
        },
        // 状态
        switchChange(status) {
            status = status ? 1 : 0
            this.modalForm.status = status
        },
        // 编辑 || 新增账户 弹框取消
        handleCancel() {
            this.modalVisible = false
            this.modalTitle = ''
            this.modalForm = {}
        },
        // 编辑 || 新增账户 弹框确认
        handleOk() {
            if (!this.modalForm.station_name.trim()) {
                this.$message.error(this.L('岗位名称必填'))
                return
            }

            let params = {
                ...this.modalForm,
                allMenus: this.modalForm.allMenus
            }

            this.request(MerchantApi.merStationsSave, params).then((res) => {
                this.$message.success(this.L('操作成功！'))
                this.getList()
                this.handleCancel()
            })
        },
        initAuthorityList(list = [], className = '') {
            if (list.length) {
                list = list.map((item) => {
                    if (this.modalForm.is_view) {
                        item.disabled = true
                        item.disableCheckbox = true
                    } else {
                        item.disabled = false
                        item.disableCheckbox = false
                    }

                    item.class = className || 'menu_first'
                    if (item.children && item.children.length) {
                        item.children = this.initAuthorityList(item.children, 'menu_last')
                    }

                    return item
                })
            }
            return list
        },
        // 权限列表
        getAuthorityList(record) {
            this.request(MerchantApi.merchantMenu, {}).then((res) => {
                this.authorityList = res || []
                if (this.authorityList.length) {
                    this.authorityList = this.initAuthorityList(this.authorityList)
                    this.$nextTick(() => {
                        if (record) {
                            this.modalForm = {
                                id: record.id,
                                station_name: record.station_name,
                                station_desc: record.station_desc,
                                menus: record.menus ? record.menus.map((item) => item - 0) : [],
                                menus_select: record.menus_select ? record.menus_select.map((item) => item - 0) : [],
                                status: record.status,
                                ...this.modalForm,
                            }
                        }
                    })
                }
            })
        },
        // 设置权限
        openModalAuthority(record = '') {
            if (record) {
                this.modalForm = {
                    is_view: true,
                }
            }
            this.getAuthorityList(record)
            this.modalAuthority = true
        },
        // 全选
        onCheckAllChange(e) {
            this.checkedAll = e.target.checked
            let menus = this.checkedAll ? this.initSelectAll(this.authorityList) : []
            this.$set(this.modalForm, 'menus', menus)
            this.$set(this.modalForm,'menus_select',menus)
        },
        initSelectAll(list = []) {
            let menus = []
            if (!Array.isArray(list)) {
                return menus
            }
            if (list.length) {
                list.forEach((item) => {
                    menus.push(item.id)
                    if (item.children && item.children.length && Array.isArray(item.children)) {
                        menus = menus.concat(this.initSelectAll(item.children))
                    }
                })
            }
            return menus
        },
        // 选择
        menuCheck(checkedKeys,e) {
            let menus = this.initSelectAll(this.authorityList)
            if (checkedKeys.length != menus.length) {
                this.checkedAll = false
            } else {
                this.checkedAll = true
            }
            
            let halfCheckedKeys = e.halfCheckedKeys || []
            this.$set(this.modalForm, 'menus_select', checkedKeys)
            this.$set(this.modalForm,'menus',checkedKeys.concat(halfCheckedKeys))
        },
        // 权限弹框关闭
        handleCancelAuthority() {
            this.modalAuthority = false
            if (this.modalForm.is_view) {
                this.modalForm = {}
            }
        },
        // 权限弹框确定
        handleOkAuthority() {
            this.handleCancelAuthority()
        },
    },
}
</script>

<style lang="less">
.title {
    padding: 12px 10px;
    background-color: #f8f8f8;
    font-weight: bold;
    text-align: left;
    box-sizing: border-box;
    color: #000000;
    font-size: 16px;
}
.font-14 {
    font-size: 14px;
}

.border-bottom {
    border-bottom: 1px solid #ffffff;
}

/deep/ textarea {
    overflow-x: hidden;
    overflow-y: auto !important;
}
.cr-333 {
    color: #333333;
}

.font-blue {
    color: #1890ff;
}

.font-red {
    color: red;
}

.font-gray {
    color: gray;
}
.merchant-account-auth-menu-tree /deep/ {
    li.ant-tree-treenode-disabled > span:not(.ant-tree-switcher),
    li.ant-tree-treenode-disabled > .ant-tree-node-content-wrapper,
    li.ant-tree-treenode-disabled > .ant-tree-node-content-wrapper span {
        color: #333333;
    }
    &.ant-tree li span.ant-tree-switcher {
        width: 0;
        overflow: hidden;
    }
    &.ant-tree > li:first-child,
    &.ant-tree li,
    .ant-tree-child-tree > li:first-child {
        padding-top: 0 !important;
        padding-bottom: 1px !important;
    }
    &.ant-tree li.menu_first {
        ul {
            padding-left: 0;
        }
    }
    .menu_first {
        span.ant-tree-node-content-wrapper {
            color: #333333;
            font-size: 16px;
            font-weight: bold;
            white-space: pre-wrap;
            word-break: break-all;
            word-wrap: break-word;
            background-color: #f8f8f8 !important;
            padding: 10px;
            min-height: 24px;
            height: auto;
            box-sizing: border-box;
        }
        span.ant-tree-checkbox {
            padding: 10px;
            background-color: #f8f8f8 !important;
            box-sizing: border-box;
            margin-right: 0;
            min-height: 44px;
            height: auto;
            .ant-tree-checkbox-inner {
                top: 4px;
            }

            &::after {
                width: 0;
                height: 0;
                box-sizing: border-box;
                border: none;
            }
        }
    }

    .menu_last {
        span.ant-tree-checkbox {
            padding: 10px 10px 10px 30px;
            background-color: #f8f8f8 !important;
            box-sizing: border-box;
            margin-right: 0;
            height: auto;
            min-height: 44px;
            .ant-tree-checkbox-inner {
                top: 4px;
            }

            &::after {
                width: 0;
                height: 0;
                box-sizing: border-box;
                border: none;
            }
        }
        span.ant-tree-node-content-wrapper {
            color: #333333;
            font-size: 14px;
            font-weight: bold;
            white-space: pre-wrap;
            word-break: break-all;
            word-wrap: break-word;
            background-color: #f8f8f8 !important;
            padding: 10px;
            box-sizing: border-box;
            height: auto;
            min-height: 24px;
            width: calc(100% - 66px) !important;
        }
        ul.ant-tree-child-tree {
            padding-left: 50px !important;
            padding-top: 10px;
            padding-bottom: 10px;
            width: 100%;
            display: flex !important;
            flex-wrap: wrap !important;
            li {
                width: 25%;
                display: flex;
                span.ant-tree-checkbox {
                    background-color: #ffffff !important;
                    padding: 0;
                    margin-right: 8px;
                    min-height: 24px;
                    &::after {
                        width: 0;
                        height: 0;
                        box-sizing: border-box;
                        border: none;
                    }
                }
                span.ant-tree-node-content-wrapper {
                    margin-right: 20px;
                    flex: 1;
                    white-space: pre-wrap;
                    word-break: break-all;
                    word-wrap: break-word;
                    min-height: 24px;
                    height: auto;
                    color: #333333;
                    font-size: 12px;
                    font-weight: normal;
                    background-color: #ffffff !important;
                    padding: 0;
                }
            }
        }
    }
}
</style>
