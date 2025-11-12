<template>
    <div>
        <a-button class="mb-10" type="primary" @click="addScene">{{L('新建场景')}}</a-button>
        <!-- 投诉场景列表-->
        <a-table :columns="sceneColumns" :data-source="sceneList" :pagination="pagination" rowKey="id" @change="sceneTableChange">
            <span slot="is_system" slot-scope="text, record">
                <a-tag v-if="record.is_system == 1" color="red">是</a-tag>
                <a-tag v-else>否</a-tag>
            </span>
            <span slot="link_url" slot-scope="text, record">
                <a-icon type="copy" theme="twoTone" v-if="record.link_url" v-clipboard:copy="record.link_url" v-clipboard:success="copySuccess" v-clipboard:error="copyError"/>
            </span>
            <span slot="action" slot-scope="text, record">
                <a class="label-sm blue" @click="openSceneTag(record)">举报类型</a>
                <template v-if="record.is_system != 1">
                    &nbsp;&nbsp;|&nbsp;&nbsp;<a class="label-sm blue" @click="editScene(record)">编辑</a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a-popconfirm
                        title="删除后无法恢复，是否确定?"
                        @confirm="() => del(record.id)"
                    >
                    <a class="btn label-sm blue" style="color: red">删除</a>
                    </a-popconfirm>
                </template>
            </span>
        </a-table>

        <a-modal v-model="sceneModalVisible" :footer="null" width="800px" :title="L('举报类型')" destroyOnClose :maskClosable="false">
            <a-button class="mb-10" type="primary" @click="addScene">{{L('新建举报类型')}}</a-button>
            <!-- 投诉场景标签列表 -->
            <a-table :columns="sceneTagColumns" :data-source="sceneTagList" :pagination="sceneTagPagination" rowKey="id" @change="sceneTagTableChange">
                <span slot="action" slot-scope="text, record">
                    <a class="label-sm blue" @click="editScene(record)">编辑</a>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <a-popconfirm
                        title="删除后无法恢复，是否确定?"
                        @confirm="() => del(record.id)"
                    >
                    <a class="btn label-sm blue" style="color: red">删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
        </a-modal>

        <!-- 新建/编辑 -->
        <a-modal v-model="sceneFormModalVisible" width="650px" :title="sceneFormModalTitle" destroyOnClose @ok="sceneFormSubmit" :zIndex="1001">
            <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules" ref="ruleForm">
                <a-form-model-item :label="sceneModalVisible?L('举报类型名称'):L('场景名称')" prop="name">
                    <a-input v-model="form.name" :placeholder="L('请输入')" />
                </a-form-model-item>
                <a-form-model-item :label="L('场景类型')" prop="type" v-if="!sceneModalVisible">
                    <a-input v-model="form.type" :placeholder="L('请输入字母字符串')" />
                </a-form-model-item>
                <a-form-model-item :label="L('排序')" :help="L('倒序排序，数值越大越靠前')">
                    <a-input-number v-model="form.sort" :min="0" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import mailPlatformApi from '@/api/common/platform/user'
export default {
    data() {
        return {
            sceneModalVisible: false,
            sceneFormModalVisible: false,
            sceneFormModalTitle: '',
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            form: {
                name: '',
                type: '',
                sort: 0,
            },
            rules: {
                name: [{ required: true, message: this.L('不能为空'), trigger: 'blur' }],
                type: [{ required: true, message: this.L('不能为空'), trigger: 'blur' }],
            },
            itemData: '',
            sceneColumns: [
                {
                    title: '场景名称',
                    dataIndex: 'name',
                    width:200
                },
                {
                    title: '场景类型',
                    dataIndex: 'type',
                    width:200
                },
                {
                    title: '系统内置',
                    dataIndex: 'is_system',
                    scopedSlots: { customRender: 'is_system' },
                    width:200
                },
                {
                    title: '排序',
                    dataIndex: 'sort',
                    width:200
                },
                {
                    title: '链接（点击可复制）',
                    dataIndex: 'link_url',
                    scopedSlots: { customRender: 'link_url' },
                    width:200
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                    width:200
                },
            ],
            sceneTagColumns: [
                {
                    title: '举报类型名称',
                    dataIndex: 'name',
                    width:200
                },
                {
                    title: '排序',
                    dataIndex: 'sort',
                    width:200
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                    width:200
                },
            ],
            sceneList: [],
            sceneTagList: [],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            sceneTagPagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            sceneQuery: {
                page: 1,
                pageSize: 10,
            },
            sceneTagQuery: {
                page: 1,
                pageSize: 10,
                gid: '',
            },
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            if (this.sceneModalVisible) {
                this.sceneTagQuery.page = this.sceneTagPagination.current
                this.sceneTagQuery.pageSize = this.sceneTagPagination.pageSize
                this.request(mailPlatformApi.getComplaintGroupTypeList, this.sceneTagQuery).then((res) => {
                    this.sceneTagList = res.data || []
                    this.sceneTagPagination.total = res.total
                    if (res.data.length == 0 && res.last_page == 1) {
                        this.sceneTagPagination.current = 1
                        this.getList()
                    }
                })
            } else {
                this.sceneQuery.page = this.pagination.current
                this.sceneQuery.pageSize = this.pagination.pageSize
                this.request(mailPlatformApi.getComplaintGroupList, this.sceneQuery).then((res) => {
                    this.sceneList = res.data || []
                    this.pagination.total = res.total
                    if (res.data.length == 0 && res.last_page == 1) {
                        this.pagination.current = 1
                        this.getList()
                    }
                })
            }
        },
        //新建场景
        addScene() {
            this.sceneFormModalVisible = true
            this.sceneFormModalTitle = this.L('新建')
            this.clearFormData()
        },
        editScene(item) {
            this.itemData = item
            const { name = '', type = '', sort = 0 } = item
            this.form.name = name
            this.form.type = type
            this.form.sort = sort
            this.sceneFormModalVisible = true
            this.sceneFormModalTitle = this.L('编辑')
        },
        clearFormData() {
            this.form.name = ''
            this.form.type = ''
            this.form.sort = 0
            this.itemData = ''
        },
        openSceneTag(item) {
            this.clearFormData()
            this.sceneTagQuery.gid = item.id
            this.sceneModalVisible = true
            this.sceneTagPagination.current = 1
            this.sceneTagPagination.pageSize = 10
            this.form.gid = item.id
            this.getList()
        },
        //表单确定事件
        sceneFormSubmit() {
            let url = mailPlatformApi.addComplaintGroup
            if (this.itemData.id) {
                url = mailPlatformApi.editComplaintGroup
                this.form.id = this.itemData.id
            } else {
                this.form.id = ''
            }
            //投诉标签
            if (this.sceneModalVisible) {
                url = mailPlatformApi.addComplaintGroupType
                if (this.itemData.id) {
                    url = mailPlatformApi.editComplaintGroupType
                }
            }
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.request(url, this.form).then((res) => {
                        if (this.itemData.id) {
                            this.$message.success('编辑成功')
                        } else {
                            this.$message.success('添加成功')
                        }
                        this.sceneFormModalVisible = false
                        this.getList()
                    })
                } else {
                    return false
                }
            })
        },
        // 删除
        del(id) {
            let url = mailPlatformApi.delComplaintGroup
            if (this.sceneModalVisible) {
                url = mailPlatformApi.delComplaintGroupType
            }
            let params = {
                id,
            }
            this.request(url, params).then((res) => {
                this.$message.success('删除成功')
                this.getList()
            })
        },
        sceneTableChange({ current, pageSize }) {
            this.pagination.current = current
            this.pagination.pageSize = pageSize
            this.getList()
        },
        sceneTagTableChange({ current, pageSize }) {
            this.sceneTagPagination.current = current
            this.sceneTagPagination.pageSize = pageSize
            this.getList()
        },
        copyError() {
            this.$message.error('复制失败！')
        },
        copySuccess() {
            this.$message.success('复制成功！')
        },
    },
}
</script>