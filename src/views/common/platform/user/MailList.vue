<template>
    <div id="components-layout-demo-basic">
        <a-spin :spinning="spinning" size="large" v-if="!is_add_show && !is_view_show">
            <a-layout>
                <a-layout-content
                        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '100px' }"
                >
                    <a-tabs default-active-key="1">
                        <a-tab-pane key="1" tab="站内信列表">
                            <a-table
                                    :columns="columns"
                                    :data-source="data"
                                    :pagination="pagination"
                                    @change="handleTableChange"
                            >
                        <span slot="cat_name" slot-scope="text">
                            {{ text }}
                        </span>
                                <span slot="title1" slot-scope="text">
                            {{ text }}
                        </span>
                                <span slot="users" slot-scope="text, record">
                            <span v-if="record.users == 0">全部用户</span>
                            <span v-else>指定</span>
                        </span>
                                <span slot="set_send_time" slot-scope="text">
                             {{ text }}
                        </span>
                                <span slot="send_status" slot-scope="text, record">
                            <span v-if="record.send_status == 0">待发送</span>
                            <span v-else-if="record.send_status == 1">已发送</span>
                            <span v-else>发送失败</span>
                        </span>

                                <span slot="send_usernums" slot-scope="text">
                             {{ text }}
                        </span>

                                <span slot="send_points" slot-scope="text">
                             {{ text }}
                        </span>
                                <span slot="action" slot-scope="text, record">
                            <a class="label-sm blue" @click="diyEdit(record.id)">查看</a>
                            <a class="btn label-sm blue" style="margin-left: 10px" @click="diyDel(record.id)"
                            >删除</a
                            >
                        </span>
                                <template slot="title" slot-scope="currentPageData">
                                    <a-row type="flex" align="top">
                                        <a-col class="span-tyle">
                                            推送分类：
                                        </a-col>
                                        <a-col :span="4">
                                            <a-select v-model="queryParam.category_type" style="width: 200px">
                                                <a-select-option
                                                        v-for="(item,index) in cat_sel"
                                                        :value="item.cat_id"
                                                        :key="index">
                                                    {{item.cat_name}}
                                                </a-select-option>
                                                <a-select-option :value="mall">
                                                    商城
                                                </a-select-option>
                                                <a-select-option :value="maidan">
                                                    买单
                                                </a-select-option>
                                                <a-select-option :value="group">
                                                    团购
                                                </a-select-option>
                                                <a-select-option :value="foodshop">
                                                    外卖
                                                </a-select-option>
                                            </a-select>
                                        </a-col>

                                        <a-col class="span-tyle">
                                            推送人群：
                                        </a-col>
                                        <a-col :span="4">
                                            <a-select v-model="queryParam.users" style="width: 200px">
                                                <a-select-option :value="0">
                                                    全部
                                                </a-select-option>
                                                <a-select-option :value="1">
                                                    指定
                                                </a-select-option>
                                            </a-select>
                                        </a-col>
                                    </a-row>
                                    <br>
                                    <a-row type="flex" align="top">
                                        <a-col class="span-tyle">
                                            发送时间：
                                        </a-col>
                                        <a-col :span="4">
                                            <a-range-picker style="width: 200px" v-model="queryParam.set_send_time_date"
                                                            format="YYYY-MM-DD">
                                            </a-range-picker>
                                        </a-col>

                                        <a-col class="span-tyle">
                                            手动搜索：
                                        </a-col>
                                        <a-col :span="4">
                                            <a-input
                                                    placeholder="请输入标题"
                                                    v-model="queryParam.title"
                                                    style="width: 200px"
                                            >
                                            </a-input>
                                        </a-col>
                                        <a-col :span="1">
                                            <a-button type="primary" @click="getLists()">查询</a-button>
                                        </a-col>
                                        <a-col :span="1" style="margin-left: 15px">
                                            <a-button type="default" @click="subForm()">重置</a-button>
                                        </a-col>
                                    </a-row>
                                    <br>
                                    <a-row type="flex" justify="center" align="top">
                                        <a-col :span="4" class="text-left">
                                            <a-button type="primary" @click="addCategory()"> +添加推送</a-button>
                                        </a-col>
                                        <a-col :span="15"></a-col>
                                        <a-col :span="5" class="text-right">
                                        </a-col>
                                    </a-row>
                                </template>
                            </a-table>
                        </a-tab-pane>
                    </a-tabs>
                </a-layout-content>
            </a-layout>
        </a-spin>
        <mail-edit v-if="is_view_show" :mail_id="mail_id" @getShow="getShow"></mail-edit>
        <mail-add :mail_id="0" v-if="is_add_show" @getShow="getShow"></mail-add>
    </div>
</template>

<script>
    import mailPlatformApi from '@/api/common/platform/user'
    import MailAdd from "./MailAdd"
    import MailEdit from "./MailEdit"
    import ACol from "ant-design-vue/es/grid/Col";

    const columns = [
        {
            title: '推送分类',
            dataIndex: 'cat_name',
            scopedSlots: {customRender: 'cat_name'},
        },
        {
            title: '标题',
            dataIndex: 'title1',
            scopedSlots: {customRender: 'title1'},
        },
        {
            title: '推送人群',
            dataIndex: 'users',
            scopedSlots: {customRender: 'users'},
        },
        {
            title: '发送时间',
            dataIndex: 'set_send_time',
            scopedSlots: {customRender: 'set_send_time'},
        },
        {
            title: '状态',
            dataIndex: 'send_status',
            scopedSlots: {customRender: 'send_status'},
        },
        {
            title: '发送用户数',
            dataIndex: 'send_usernums',
            scopedSlots: {customRender: 'send_usernums'},
        },
        {
            title: '点击数',
            dataIndex: 'send_points',
            scopedSlots: {customRender: 'send_points'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ]

    export default {
        name: 'MailList',
        components: {MailEdit, ACol, MailAdd},
        data() {
            return {
                mail_id: "",
                mall: "1-2",
                maidan: "1-3",
                group: "1-4",
                foodshop: "1-5",
                mail_id: "",
                is_add_show: false,
                title: '添加主分类',
                action: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
                uploadName: 'reply_pic',
                visible: false,
                spinning: false,
                is_view_show: false,
                previewVisible: false,
                previewVisible1: false,
                previewImage: '',
                hides: 0,
                cat_id: 0,
                cat_sel: [], //行业属性
                fileList: [], //图片logo
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
                queryParam: {
                    cat_id: '',
                    page: 1,
                    category_type: "",
                    users: "",
                    set_send_time_date: "",
                    title: ""
                },
                data: [],
                columns,
            }
        },
        mounted() {
            this.getLists()
        },
        activated() {
            this.getLists()
        },
        created() {
            this.title = '添加主分类'
            this.getLists()
        },
        methods: {
            getLists() {
                this.queryParam.page = 1
                this.queryParam.pageSize = this.pagination.pageSize
                this.data = []
                this.request(mailPlatformApi.mailList, this.queryParam).then((res) => {
                    this.cat_sel = res.cat_sel
                    if (res.list.length > 0) {
                        this.data = res.list
                        this.pagination.total = res.count
                        this.queryParam['page'] += 1
                    }
                })
            },
            subForm() {
                this.queryParam.page = this.pagination.current
                this.queryParam.pageSize = this.pagination.pageSize
                this.queryParam.cat_id = ''
                this.queryParam.page = 1
                this.queryParam.category_type = ""
                this.queryParam.users = ""
                this.queryParam.set_send_time_date = ""
                this.queryParam.title = ""
                this.request(mailPlatformApi.mailList, this.queryParam).then((res) => {
                    this.cat_sel = res.cat_sel
                    if (res.list.length > 0) {
                        this.data = res.list
                        this.pagination.total = res.count
                        this.queryParam['page'] += 1
                    }
                })
            },
            addCategory() {
                this.is_add_show = true;
            },
            getShow() {
                this.is_add_show = false
                this.is_view_show = false
                this.getLists()
            },
            diyDel(id) {
                this.$confirm({
                    title: '您确定删除此分类吗?',
                    centered: true,
                    onOk: () => {
                        let param = {
                            id: id,
                        }
                        this.request(mailPlatformApi.delData, param).then((res) => {
                            if (res) {
                                this.getLists()
                            }
                        })
                    },
                    onCancel() {
                    },
                })
            },
            diyEdit(id) {
                this.is_view_show = true;
                this.mail_id = id
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                    this.getLists()
                }
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.$set(this.pagination, 'current', page)
                this.getLists()
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.getLists()
            },
            // async handlePreview(file) {
            //     if (!file.url && !file.preview) {
            //         file.preview = await getBase64(file.originFileObj)
            //     }
            //     this.previewImage = file.url || file.preview
            //     this.previewVisible = true
            // },
            // handleChange({fileList}) {
            //     if (fileList.length > 0) {
            //         let len = fileList.length - 1
            //         this.fileList = fileList
            //         if (this.fileList[len].status == 'done') {
            //             this.formData.cat_pic = this.fileList[len].response.data
            //             this.fileList[0].uid = 'logo'
            //             this.fileList[0].name = 'logo_1'
            //             this.fileList[0].status = 'done'
            //             this.fileList[0].url = this.fileList[len].response.data
            //             if (fileList.length > 1) {
            //                 this.fileList.splice(0, len)
            //             }
            //         }
            //     }
            // },
            // async handlePreview1(file) {
            //     if (!file.url && !file.preview) {
            //         file.preview = await getBase64(file.originFileObj)
            //     }
            //     this.previewImage = file.url || file.preview
            //     this.previewVisible1 = true
            // },
            // handleChange1({fileList}) {
            //     if (fileList.length > 0) {
            //         let len = fileList.length - 1
            //         this.fileList1 = fileList
            //         if (this.fileList1[len].status == 'done') {
            //             this.formData.cat_adver = this.fileList1[len].response.data
            //             this.fileList1[0].uid = 'logo_2'
            //             this.fileList1[0].name = 'logo_2'
            //             this.fileList1[0].status = 'done'
            //             this.fileList1[0].url = this.fileList1[len].response.data
            //             if (fileList.length > 1) {
            //                 this.fileList1.splice(0, len)
            //             }
            //         }
            //     }
            // },
            // handleCancel2() {
            //     this.previewVisible1 = false
            // },
            onDateStartChange(end_time_moment, end_time) {
                this.queryParam.set_send_time_date = end_time
                this.$set(this.queryParam, 'set_send_time_date', end_time)
            },
        },
    }
</script>

<style scoped>
    .label-sm-1-blue {
        padding: 7px;
        color: #1890ff;
        border: 1px dashed #a09da2 !important;
    }

    .span-tyle {
        width: 80px;
        padding-top: 5px;
    }
</style>