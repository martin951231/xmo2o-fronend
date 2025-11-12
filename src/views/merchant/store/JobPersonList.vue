<template>
    <div id="components-layout-demo-basic">
        <a-layout>
            <a-row style="width: 100%;height:68px;border-bottom: 1px solid #f1f1f1;background-color: white;line-height: 68px;padding-left: 10px;">
                <a-col :span="24"> 技师入驻用于前端店铺主页里技师信息模块展示使用,申请认证 则成为平台内已认证技师</a-col>
            </a-row>
            <a-layout style="padding: 0 20px; background: #fff">
                <a-layout-content :style="{ margin: '0px', padding: '0px', background: '#fff', minHeight: '100px' }">
                    <div class="table-operations">
                        <a-row align="top" style="padding: 0px;width: 100%;">
                            <a-col :span="2" class="text-center">
                                <a-button type="primary" @click="$refs.addChildModal.add(store_id)"
                                          style="height: 40px;width: 100px;border-radius: 7px;">
                                    添加技师
                                </a-button>
                            </a-col>
                            <a-col :span="2" class="text-left">
                                <a-button type="default" @click="delAllChild"
                                          style="height: 40px;width: 80px;border-radius: 7px;">
                                    删除
                                </a-button>
                            </a-col>
                            <a-col :span="18" class="text-center">
                            </a-col>
                        </a-row>
                    </div>
                    <a-table :columns="columns"
                             :data-source="data"
                             :pagination="pagination"
                             :row-selection="{ selectedRows: selectedRows, onChange: onSelectChange }"
                             @change="handleTableChange">
                            <span slot="headimg" slot-scope="text,record">
                                <img width="50px" height="50px" :src="record.headimg" v-if="record.headimg">
                            </span>

                        <span slot="name" slot-scope="text">
                                {{text}}
                            </span>

                        <span slot="job_name" slot-scope="text">
                                {{text}}
                        </span>

                        <span slot="job_time" slot-scope="text">
                                {{text}}
                        </span>

                        <span slot="status" slot-scope="text, record">
                            <a v-if="record.status==0" @click="showRes(record.id)">未申请认证</a>
                            <a v-if="record.status==1">审核中</a>
                            <a v-if="record.status==2">已认证</a>
                            <a v-if="record.status==3">未通过认证</a>
                        </span>

                        <span slot="phone" slot-scope="text">
                                {{text}}
                        </span>
                        <span slot="action" slot-scope="text, record">
                                <a class="label-sm blue" v-if="record.status!=1 && record.status!=2"
                                   @click="$refs.addChildModal.edit(record.id)">编辑</a>

                            <a class="label-sm blue" v-if="record.status==1 || record.status==2"
                               @click="$refs.viewChildModal.edit(record.id)">查看</a>
                                <a
                                        class="btn label-sm blue"
                                        style="margin-left: 10px"
                                        @click="childDel(record.id)"
                                >解除</a
                                >
                            </span>
                    </a-table>
                </a-layout-content>
            </a-layout>
        </a-layout>
        <a-modal :title="title" :width="640" :visible="confirmShow" @cancel="handleCancel" @ok="sureEdit">
            <a-form-model
                    v-bind="{
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
          }"
            >
                <a-row :gutter="8">
                    <a-col :span="4"></a-col>
                    <a-col :span="20">绑定请输入需要绑定技师的平台账号(手机号):</a-col>
                </a-row>
                <a-row :gutter="8">
                    <a-col :span="4">

                    </a-col>
                    <a-col :span="12">
                        <a-input v-model="phone"
                        />
                    </a-col>
                    <a-col :span="8">
                        <a-button @click="resJob">验证</a-button>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="4">

                    </a-col>
                    <a-col :span="12">
                        {{msg}}
                    </a-col>
                </a-row>
                <a-row :gutter="8">
                    <a-col :span="4">

                    </a-col>
                    <a-col :span="20">
                        <img style="width: 50%" :src="avatar"/>
                    </a-col>
                </a-row>

                <a-form-item label="详细描述">
                    <a-textarea :rows="4" placeholder="请输入详细描述" v-model="detail"
                                :maxLength="500"></a-textarea>
                </a-form-item>
            </a-form-model>
        </a-modal>
        <edit-job-person ref="addChildModal" @handleUpdate="handleUpdate"></edit-job-person>
        <view-job-person ref="viewChildModal" @handleUpdate="handleUpdate"></view-job-person>
    </div>
</template>

<script>
    import mallMerchantApi from '@/api/merchant/store'
    import EditJobPerson from "./EditJobPerson";
    import ViewJobPerson from "./ViewJobPerson";

    const columns = [
        {
            title: '头像',
            dataIndex: 'headimg',
            scopedSlots: {customRender: 'headimg'},
        },
        {
            title: '名称',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '职位',
            dataIndex: 'job_name',
            scopedSlots: {customRender: 'job_name'},
        },
        {
            title: '从业年限',
            dataIndex: 'job_time',
            scopedSlots: {customRender: 'job_time'},
        },
        {
            title: '认证状态',
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'},
        },
        {
            title: '绑定账号',
            dataIndex: 'phone',
            scopedSlots: {customRender: 'phone'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];
    const selectedRows = []
    export default {
        name: "JobPersonList",
        components: {ViewJobPerson, EditJobPerson},
        props: {
            store_id: {
                type: [String, Number],
                default: '0',
            },
        },
        data() {
            return {
                title: "申请认证",
                phone: "",
                detail: "",
                msg: "",
                sortLoading: false,
                confirmShow: false,
                is_res: false,
                person_id: 0,
                uid: 0,
                avatar:"",
                selectedRows,
                data: [],
                columns,
                // 查询参数
                queryParam: {
                    id: 0,
                },
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
            }
        },
        watch: {
            $route: {
                handler() {
                    this.getJobList()
                },
            },
        },
        mounted() {
            this.getJobList()
        },
        methods: {
            delAllChild() {
                if (this.selectedRows.length) {
                    this.$confirm({
                        title: '你确定删除吗?',
                        centered: true,
                        onOk: () => {
                            this.request(mallMerchantApi.delJob, {ids: this.selectedRows}).then((res) => {
                                this.$message.success('删除成功！')
                                this.getJobList()
                            })
                        },
                        onCancel() {
                        },
                    })
                } else {
                    this.$message.error(this.L('请选择删除项！'))
                }
            },
            showRes(id) {
                this.confirmShow = true
                this.person_id = id
            },
            // 获得技师列表
            getJobList() {
                this.request(mallMerchantApi.jobList, {store_id: this.store_id}).then((res) => {
                    this.data = res.list
                    this.$set(this, 'data', res.list)
                    this.$set(this.pagination, 'total', res.count)
                })
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                    this.getJobList()
                }
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.$set(this.pagination, 'current', page)
                this.getJobList()
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.getJobList()
            },
            // 设置为删除
            childDel(id) {
                this.$confirm({
                    title: '你确定解除此技师吗?',
                    centered: true,
                    onOk: () => {
                        this.request(mallMerchantApi.delJob, {ids: id}).then((res) => {
                            this.$message.success('解除成功！')
                            this.getJobList()
                        })
                    },
                    onCancel() {
                    },
                })
            },
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRows = [];
                if (selectedRows.length) {
                    selectedRows.map((item) => {
                        this.selectedRows.push(item.id)
                    })
                }
            },
            // 添加编辑删除回调
            handleUpdate() {
                this.getJobList()
            },
            handleCancel() {
                this.phone = ""
                this.confirmShow = false
                this.detail = ""
            },
            sureEdit() {
                if (this.is_res) {
                    this.request(mallMerchantApi.authentica, {
                        id: this.person_id,
                        uid: this.uid,
                        detail: this.detail
                    }).then((res) => {
                        this.$message.success('已经提交申请，请等待审核结果！')
                        // 调用父页面方法
                        this.phone = ""
                        this.confirmShow = false
                        this.detail = ""
                        this.uid = 0
                        this.person_id = 0
                        this.getJobList()
                    })
                } else {
                    this.$message.error('请输入有效的技师账号(手机号)验证！')
                }
            },
            resJob() {
                this.request(mallMerchantApi.resJob, {phone: this.phone}).then((res) => {
                    if (res.uid) {
                        this.is_res = true
                        this.msg = "该账号可申请认证"
                        this.uid = res.uid
                        this.avatar = res.avatar
                    } else {
                        this.is_res = false
                        this.msg = "该账号不存在或者已经被认证"
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .detail-content >>> .ant-drawer-body {
        padding: 0;
    }

    #components-layout-demo-basic {
        text-align: left;
        background: #ffffff;
        height: 100%;
    }

    #components-layout-demo-basic .ant-layout {
        height: 100%;
    }

    #components-layout-demo-basic .ant-layout-header,
    #components-layout-demo-basic .ant-layout-footer {
        background: #ffffff;
        color: #fff;
        height: 80px;
    }

    #components-layout-demo-basic .ant-layout-sider {
        background: #ffffff;
        color: #fff;
    }

    #components-layout-demo-basic .ant-layout-content {
        background: #ffffff;
        color: #fff;
        min-height: 120px;
        line-height: 120px;
        padding-left: 20px;
    }

    #components-layout-demo-basic > .ant-layout {
        margin-bottom: 48px;
    }

    #components-layout-demo-basic > .ant-layout:last-child {
        margin: 0;
    }

    #components-layout-demo-basic .add-goods {
        margin: 0 20px;
    }

    #components-layout-demo-basic >>> .ant-btn-group {
        line-height: 80px;
    }

    #components-layout-demo-basic .edit-content {
        float: right;
        /* margin-right: 60px; */
    }

    #components-layout-demo-basic >>> .ant-tabs {
        display: inline-block;
    }

    #components-layout-demo-basic >>> .ant-layout-content {
        line-height: 70px;
    }
</style>