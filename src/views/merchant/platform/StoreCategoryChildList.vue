<template>
    <div id="components-layout-demo-basic">
        <a-spin :spinning="spinning" size="large">
            <a-layout>
                <a-layout-content
                        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '100px' }"
                >
                    <a-table
                            :columns="columns"
                            :data-source="data"
                            :pagination="pagination"
                            @change="handleTableChange"
                    >
                        <span slot="cat_id" slot-scope="text">
                            {{ text }}
                        </span>

                        <span slot="cat_name" slot-scope="text">
                            {{ text }}
                        </span>

                        <span slot="cat_url" slot-scope="text">
                            {{ text }}
                        </span>

                        <!--<span slot="cat_sort" slot-scope="text">
                                {{text}}
                        </span>-->

                        <template slot="cat_sort" slot-scope="text, record">
                            <a-input-number
                                    :default-value="text ? text : 0"
                                    :precision="0"
                                    :min="0"
                                    class="sort-input"
                                    v-model="record.cat_sort"
                                    @blur="handleSortChange($event, text, record)"
                            />
                        </template>

                        <router-link
                                :to="{
                                path: '/common/platform.custom/catCustomPage',
                                query: { source_id: record.cat_id, source: 'category' },
                            }"
                                slot="diy_status"
                                slot-scope="text, record"
                                target="_blank"
                        >
                            {{ record.diy_status == 0 ? '未装修' : '已装修' }}
                        </router-link>

                        <span slot="cat_status" slot-scope="text, record">
                            <span v-if="record.cat_status == 0">关闭</span>
                            <span v-else>启用</span>
                        </span>
                        <!--<span slot="manage" slot-scope="text,record" class="text-center">
                            <a class="label-sm-1 label-sm-1-blue"
                               @click="goTo(record.ids,record.category_id)">去管理</a>
                        </span>-->
                        <span slot="action" slot-scope="text, record">
                            <a class="label-sm blue" @click="diyEdit(record.cat_id)">编辑</a>
                            <a class="btn label-sm blue" style="margin-left: 10px" @click="diyDel(record.cat_id)"
                            >删除</a
                            >
                        </span>
                        <template slot="title" slot-scope="currentPageData">
                            <a-row type="flex" justify="center" align="top">
                                <a-col :span="4" class="text-left"> 子分类列表</a-col>
                                <a-col :span="15"></a-col>
                                <a-col :span="5" class="text-right">
                                    <a-button type="primary" @click="addCategory()"> 添加子分类</a-button>
                                </a-col>
                            </a-row>
                        </template>
                    </a-table>
                </a-layout-content>
            </a-layout>
        </a-spin>

        <a-modal v-model="visible" :width="920" :title="title" :footer="null" @cancel="handleCancel">
            <a-form v-bind="{ labelCol: { span: 7 }, wrapperCol: { span: 16 } }">
                <a-form-item label="分类名称" required="true">
                    <a-row>
                        <a-col :span="14">
                            <a-input placeholder="分类名称" v-model="formData.cat_name"></a-input>
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item label="分类描述" help="用于描述分类的副标题,吸引客户,限制100字以内">
                    <a-row>
                        <a-col :span="14">
                            <a-textarea
                                    placeholder="分类描述"
                                    v-model="formData.cat_info"
                                    :auto-size="{ minRows: 2, maxRows: 6 }"
                                    :maxLength="100"
                            />
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item label="短标记" help="只能用英文或数字,用于网址(url)中的标记!建议使用分类的拼音" required="true">
                    <a-row>
                        <a-col :span="14">
                            <a-input placeholder="短标记" v-model="formData.cat_url"></a-input>
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item label="分类LOGO图标" required="true" help="仅支持jpg、png、jpeg、gif图片类型">
                    <a-input hidden v-model="formData.cat_pic"></a-input>
                    <template>
                        <div class="clearfix">
                            <a-upload
                                    :action="action"
                                    :name="uploadName"
                                    :data="{ upload_dir: upload_dir }"
                                    list-type="picture-card"
                                    :file-list="fileList"
                                    @preview="handlePreview"
                                    @change="handleChange"
                            >
                                <!-- <div v-if="fileList.length < 10">-->
                                <a-icon type="plus"/>
                                <div class="ant-upload-text">上传</div>
                                <!--</div>-->
                            </a-upload>
                            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel1">
                                <img alt="example" style="width: 100%" :src="previewImage"/>
                            </a-modal>
                        </div>
                    </template>
                </a-form-item>

                <a-form-item label="绑定行业属性" required="true">
                    <a-row>
                        <a-col :span="14">
                            <a-select v-model="formData.cat_industry">
                                <a-select-option v-for="(item, index) in cat_sel" :value="item.id" :key="index">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item label="分类广告图" help="分类广告图,建议尺寸 702*142">
                    <a-input hidden v-model="formData.cat_adver"></a-input>
                    <template>
                        <div class="clearfix">
                            <a-upload
                                    :action="action"
                                    :name="uploadName"
                                    :data="{ upload_dir: upload_dir }"
                                    list-type="picture-card"
                                    :file-list="fileList1"
                                    @preview="handlePreview1"
                                    @change="handleChange1"
                            >
                                <!-- <div v-if="fileList.length < 10">-->
                                <a-icon type="plus"/>
                                <div class="ant-upload-text">上传</div>
                                <!--</div>-->
                            </a-upload>
                            <a-modal :visible="previewVisible1" :footer="null" @cancel="handleCancel2">
                                <img alt="example" style="width: 100%" :src="previewImage"/>
                            </a-modal>
                        </div>
                    </template>
                </a-form-item>

                <a-form-item label="分类排序" help="默认添加时间排序!手动排序数值越大,排序越前。">
                    <a-row>
                        <a-col :span="14">
                            <a-input placeholder="分类排序" v-model="formData.cat_sort"></a-input>
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item label="是否热门" help="如果选择热门,颜色会有变化">
                    <a-row>
                        <a-col :span="14">
                            <a-switch
                                    checked-children="是"
                                    un-checked-children="否"
                                    v-model="formData.is_hot"
                                    v-decorator="[
                                    'is_hot',
                                    { initialValue: formData.is_hot == 1 ? true : false, valuePropName: 'checked' },
                                ]"
                            />
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item label="分类状态">
                    <a-row>
                        <a-col :span="14">
                            <a-switch
                                    checked-children="打开"
                                    un-checked-children="关闭"
                                    v-model="formData.cat_status"
                                    v-decorator="[
                                    'cat_status',
                                    { initialValue: formData.cat_status == 1 ? true : false, valuePropName: 'checked' },
                                ]"
                            />
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item :wrapper-col="{ span: 20, offset: 6 }">
                    <a-row type="flex" justify="center" align="top">
                        <a-col :span="6" class="text-center">
                            <a-button type="primary" @click="handleSubmit"> 提交</a-button>
                        </a-col>
                        <a-col :span="6"></a-col>
                    </a-row>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import merchantPlatformApi from '@/api/merchant/platform/index'
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        })
    }
    const columns = [
        {
            title: '编号',
            dataIndex: 'cat_id',
            scopedSlots: {customRender: 'cat_id'},
        },
        {
            title: '名称',
            dataIndex: 'cat_name',
            scopedSlots: {customRender: 'cat_name'},
        },
        {
            title: '短标记',
            dataIndex: 'cat_url',
            scopedSlots: {customRender: 'cat_url'},
        },
        {
            title: '排序',
            dataIndex: 'cat_sort',
            scopedSlots: {customRender: 'cat_sort'},
        },
        {
            title: '页面装修',
            dataIndex: 'diy_status',
            scopedSlots: {customRender: 'diy_status'},
        },
        {
            title: '状态',
            dataIndex: 'cat_status',
            scopedSlots: {customRender: 'cat_status'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ]

    export default {
        name: 'StoreCategoryList',
        props: {
            // 存放路径
            upload_dir: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                title: '添加子分类',
                action: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
                uploadName: 'reply_pic',
                visible: false,
                spinning: false,
                previewVisible: false,
                previewVisible1: false,
                previewImage: '',
                cat_id: 0,
                cat_sel: [], //行业属性
                fileList: [], //图片logo
                fileList1: [], //广告图片
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
                    cat_fid: this.$route.query.cat_id,
                    page: 1,
                },
                formData: {
                    //表单数据
                    cat_id: '',
                    cat_fid: this.$route.query.cat_id,
                    cat_name: '',
                    cat_pic: '',
                    cat_url: '',
                    cat_sort: 0,
                    is_hot: 0,
                    cat_status: 1,
                    cat_industry: '',
                    cat_info: '',
                    cat_adver: '',
                },
                data: [],
                columns,
            }
        },
        mounted() {
            //将主分类带过来
            this.cat_fid = this.$route.query.cat_id
            this.getLists()
        },
        activated() {
            //将主分类带过来
            this.cat_fid = this.$route.query.cat_id
            this.getLists()
        },
        created() {
            //将主分类带过来
            this.title = '添加子分类'
            this.cat_fid = this.$route.query.cat_id
            this.getLists()
        },
        methods: {
            getLists() {
                this.data = [];
                this.queryParam.cat_fid = this.$route.query.cat_id
                this.queryParam.page = this.pagination.current
                this.queryParam.pageSize = this.pagination.pageSize
                this.request(merchantPlatformApi.getStoreCategoryList, this.queryParam).then((res) => {
                        this.data = res.list
                        this.pagination.total = res.count
                        this.queryParam['page'] += 1
                })
            },
            addCategory() {
                this.visible = true
                this.fileList=[]
                this.formData={
                    //表单数据
                        cat_fid: this.$route.query.cat_id,
                        cat_id: '',
                        cat_name: '',
                        cat_pic: '',
                        cat_url: '',
                        cat_sort: 0,
                        is_hot: 0,
                        cat_status: 1,
                        cat_industry: '',
                        cat_info: '',
                        cat_adver: '',
                }
                this.request(merchantPlatformApi.editStoreCategory, {}).then((res) => {
                    this.cat_sel = res.sel
                })
            },
            diyEdit(id) {
                this.request(merchantPlatformApi.editStoreCategory, {cat_id: id}).then((res) => {
                    this.visible = true
                    this.title = '编辑子分类'
                    this.cat_sel = res.sel
                    this.formData = res.data
                    this.fileList1 = []
                    this.fileList = []
                    if (res.data.cat_pic) {
                        let param1 = {
                            uid: 'logo',
                            name: 'logo_1',
                            status: 'done',
                            url: res.data.cat_pic,
                        }
                        this.fileList.push(param1)
                    }

                    if (res.data.cat_adver) {
                        let param2 = {
                            uid: 'logo2',
                            name: 'logo_2',
                            status: 'done',
                            url: res.data.cat_adver,
                        }
                        this.fileList1.push(param2)
                    }
                })
            },
            diyDel(id) {
                this.$confirm({
                    title: '您确定删除此分类吗?',
                    centered: true,
                    onOk: () => {
                        let param = {
                            cat_id: id,
                        }
                        this.request(merchantPlatformApi.delStoreCategory, param).then((res) => {
                            if (res) {
                                this.getLists()
                            }
                        })
                    },
                    onCancel() {
                    },
                })
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                    this.getLists()
                }
            },
            handleCancel() {
                this.title = '添加子分类'
                this.visible = false
            },
            handleSubmit() {
                this.request(merchantPlatformApi.saveStoreCategory, this.formData).then((res) => {
                    if (res) {
                        this.$message.success('编辑成功！')
                    } else {
                        this.$message.error('编辑失败！')
                    }
                    //初始化
                    this.visible = false
                    this.formData.cat_id = ''
                    this.formData.cat_fid = this.$route.query.cat_id
                    this.formData.cat_name = ''
                    this.formData.cat_pic = ''
                    this.formData.cat_url = ''
                    this.formData.cat_sort = 0
                    this.formData.is_hot = 0
                    this.formData.cat_status = 1
                    this.formData.cat_industry = ''
                    this.formData.cat_info = ''
                    this.formData.cat_adver = ''
                    this.title = '添加子分类'
                    this.getLists()
                })
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
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj)
                }
                this.previewImage = file.url || file.preview
                this.previewVisible = true
            },
            //保存排序
            handleSortChange(e, val, record) {
                let param = {
                    cat_id: record.cat_id,
                    cat_fid: record.cat_fid,
                    cat_sort: val,
                }
                this.request(merchantPlatformApi.updateSort, param).then((res) => {
                    //this.queryParam['page'] = 1
                    this.getLists()
                })
            },
            handleChange({fileList}) {
                console.log(fileList, 'iamge==iamge==iamge')
                if (fileList.length > 0) {
                    let len = fileList.length - 1
                    this.fileList = fileList
                    if (this.fileList[len].status == 'done') {
                        if(this.fileList[len].response.status != 1000){
                            this.$message.error(this.fileList[len].response.msg);
                            this.fileList=this.fileList.slice(0,-1);
                            return false;
                        }

                        console.log(this.fileList[len].response.data, 'iamge==iamge==iamge')
                        this.formData.cat_pic = this.fileList[len].response.data
                        this.fileList[0].uid = 'logo'
                        this.fileList[0].name = 'logo_1'
                        this.fileList[0].status = 'done'
                        this.fileList[0].url = this.fileList[len].response.data
                        if (fileList.length > 1) {
                            this.fileList.splice(0, len)
                        }
                    }
                }
            },
            handleCancel1() {
                this.previewVisible = false
            },

            async handlePreview1(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj)
                }
                this.previewImage = file.url || file.preview
                this.previewVisible1 = true
            },
            handleChange1({fileList}) {
                if (fileList.length > 0) {
                    let len = fileList.length - 1
                    this.fileList1 = fileList
                    if (this.fileList1[len].status == 'done') {
                        this.formData.cat_adver = this.fileList1[len].response.data
                        this.fileList1[0].uid = 'logo_2'
                        this.fileList1[0].name = 'logo_2'
                        this.fileList1[0].status = 'done'
                        this.fileList1[0].url = this.fileList1[len].response.data
                        if (fileList.length > 1) {
                            this.fileList1.splice(0, len)
                        }
                    }
                }
            },
            handleCancel2() {
                this.previewVisible1 = false
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
</style>