<template>
    <div id="components-layout-demo-basic">
        <a-spin :spinning="spinning" size="large">
            <a-layout>
                <a-layout-content
                        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '100px' }">
                    <!--<a-button type="primary" @click="addTemplates()">
                        店员管理
                    </a-button>-->
                    <a-table :columns="columns"
                             :data-source="data"
                             :pagination="pagination"
                             @change="handleTableChange" bordered>
                            <span slot="id" slot-scope="text">
                                {{text}}
                            </span>

                        <span slot="name" slot-scope="text">
                                {{text}}
                        </span>

                        <span slot="url" slot-scope="text">
                                 <a :href="text">访问链接</a>
                            </span>

                        <span slot="pic" slot-scope="text">
                                <img :src="text" style="width: 80px;height: 80px;">
                        </span>

                        <span slot="status" slot-scope="text">
                                <span class="height-30" v-if="text ==0">
                                    禁用
                                </span>
                                <span v-else class="height-30">
                                    正常
                                </span>
                        </span>

                        <span slot="last_time" slot-scope="text">
                                {{text}}
                        </span>

                        <span slot="action" slot-scope="text,record">
                                <a class="label-sm blue" @click="sliderEdit(record.id)"> 修改</a>
                                <a class="btn label-sm blue" style="margin-left: 10px;"
                                   @click="sliderDel(record.id)">删除</a>
                        </span>
                        <template slot="title" slot-scope="currentPageData">
                            <a-row type="flex" justify="center" align="top">
                                <a-col :span="8">
                                    店铺导航管理
                                </a-col>
                                <a-col :span="12">
                                </a-col>
                                <a-col :span="2" class="text-right">

                                </a-col>
                                <a-col :span="2" class="text-right">
                                    <a-button type="primary" @click="goNextPage()">
                                        添加导航
                                    </a-button>
                                </a-col>
                            </a-row>
                        </template>
                    </a-table>
                </a-layout-content>
            </a-layout>
        </a-spin>

        <a-modal v-model="visible_staff" title="导航管理" :footer="null">
            <a-form v-bind="{ labelCol: { span: 7 }, wrapperCol: { span: 14 }, }" @submit="handleSubmit">
                <a-form-item label="导航名称">
                    <template>
                        <a-upload
                                name="avatar"
                                list-type="picture-card"
                                class="avatar-uploader"
                                :show-upload-list="false"
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                :before-upload="beforeUpload"
                                @change="handleChange"
                        >
                            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                            <div v-else>
                                <a-icon :type="loading ? 'loading' : 'plus'" />
                                <div class="ant-upload-text">
                                    Upload
                                </div>
                            </div>
                        </a-upload>
                    </template>
                </a-form-item>

                <a-form-item :wrapper-col="{ span: 20, offset: 6 }">
                    <a-row type="flex" justify="center" align="top">
                        <a-col :span="4" class="text-left">
                            <a-button type="default" @click="hidelModel()">
                                取消
                            </a-button>
                        </a-col>
                        <a-col :span="6" class="text-center">
                            <a-button type="primary" html-type="submit">
                                提交
                            </a-button>
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                    </a-row>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import mallMerchantApi from '@/api/merchant/store'

    const columns = [
        {
            title: '排序',
            dataIndex: 'id',
            scopedSlots: {customRender: 'id'},
        },
        {
            title: '名称',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '链接地址',
            dataIndex: 'url',
            scopedSlots: {customRender: 'url'},
        },
        {
            title: '图片',
            dataIndex: 'pic',
            scopedSlots: {customRender: 'pic'},
        },
        {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'},
        },
        {
            title: '最后操作时间',
            dataIndex: 'last_time',
            scopedSlots: {customRender: 'last_time'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];
    export default {
        data() {
            return {
                headers: {
                    authorization: 'authorization-text',
                },
                spinning: false,
                data: [],
                visible_staff: false,
                store_id: '',
                site_url: '',
                pagination: {},
                queryParam: {
                    page: 1,
                    store_id: "",
                },
                formData: {
                    id: '',
                    name: '',
                    url: 0,
                    pic: "",
                    status: "",
                    sort:"",
                    last_time: "",
                    store_id: '',
                },
                columns,
            };
        },
        mounted() {
            this.store_id = this.$route.query.store_id
            this.formData.store_id = this.$route.query.store_id
            this.getLists()
        },
        activated() {
            this.getLists()
        },
        created() {
            this.store_id = this.$route.query.store_id
            this.formData.store_id = this.$route.query.store_id
        },
        methods: {
            handleChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
            getLists() {
                this.queryParam['page'] = 1
                this.queryParam['store_id'] = this.store_id
                this.request(mallMerchantApi.storeSliderList, this.queryParam).then((res) => {
                    this.site_url = res.site_url
                    this.data = res.list
                    this.pagination.total = res.count
                    this.queryParam['page'] += 1
                })
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                    this.getLists()
                }
            },
            goNextPage() {
                this.visible_staff = true
                this.formData.id = ""
            },
            handleSubmit(e) {
                e.preventDefault()
                this.request(mallMerchantApi.storeSliderEdit, this.formData).then((res) => {
                    this.getLists()
                    this.visible_staff = false
                    this.formData.id = ""
                })
            },
            hidelModel() {//隐藏店员编辑框
                this.visible_staff = false
            },
            sliderEdit(id) {//修改店员信息
                let param = {
                    'id': id
                }
                this.request(mallMerchantApi.storeSliderMsg, param).then((res) => {
                    this.formData.id = res.list.id
                    this.formData.name = res.list.name
                    this.formData.url = res.list.url
                    this.formData.pic = res.list.pic
                    this.formData.status = res.list.status
                    this.formData.last_time = res.list.last_time
                    this.formData.store_id = res.list.store_id

                    this.visible_staff = true
                })
            },
            sliderDel(id) {//店员删除
                this.$confirm({
                    title: '是否确定删除该店铺导航?',
                    centered: true,
                    onOk: () => {
                        let param = {
                            'id': id,
                            'store_id': this.store_id
                        }
                        this.request(mallMerchantApi.storeSliderDel, param).then((res) => {
                            this.getLists()
                            this.$message.success('操作成功！')
                        })
                    },
                    onCancel() {
                    },
                })
            },
            selectHref(){//功能库选择

            }
        },
    };
</script>

<style scoped>
    th.column-money,
    td.column-money {
        text-align: right !important;
    }

    .label-sm {
        color: green;
    }

    .label-sm.blue {
        color: #1890ff !important;
    }
</style>