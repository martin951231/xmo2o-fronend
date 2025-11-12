<template>
    <div class="mt-20 ml-10 mr-10 mb-20 bg-ff" style="padding: 24px; box-sizing: border-box">
        <a-row type="flex" justify="space-between" align="middle">
            <a-col :span="8"> 店铺导航管理 </a-col>
            <a-col :span="2" class="text-right">
                <a-button type="primary" @click="goNextPage()"> 添加导航 </a-button>
            </a-col>
        </a-row>
        <a-spin :spinning="spinning" size="large" class="mt-20">
            <a-table :columns="columns" :data-source="dataList" :pagination="pagination" row-key="id">
                <span slot="url" slot-scope="text">
                    <a :href="text">访问链接</a>
                </span>

                <span slot="pic" slot-scope="text">
                    <img :src="text" style="width: 80px; height: 80px" />
                </span>

                <span slot="status" slot-scope="text" class="height-30">
                    {{text == 0?'禁用':'正常'}}
                </span>

                <span slot="action" slot-scope="text, record">
                    <span class="cr-primary pointer" @click="sliderEdit(record)"> 修改</span>
                    <span class="cr-primary pointer" style="margin-left: 10px" @click="sliderDel(record.id)">删除</span>
                </span>
            </a-table>
        </a-spin>

        <a-modal v-model="visible_staff" title="导航管理" :footer="null" @cancel="hidelModel" width="40%" :destroyOnClose="true">
            <a-form v-bind="{ labelCol: { span: 7 }, wrapperCol: { span: 14 } }" @submit="handleSubmit">
                <a-form-item label="导航名称">
                    <a-input
                        v-decorator="['name', { rules: [{ required: true, message: '请输入导航名称' }] }]"
                        placeholder="请输入导航名称"
                        v-model="formData.name"
                    >
                    </a-input>
                </a-form-item>

                <a-form-item label="导航图片" required help="仅支持jpg、png、jpeg、gif图片类型,建议大小不要超过2M">
                    <a-row>
                        <a-input hidden v-model="formData.pic"></a-input>
                        <template>
                            <a-upload
                                :action="action"
                                :name="uploadName"
                                :data="{ upload_dir: upload_dir, store_id: this.store_id }"
                                list-type="picture-card"
                                :file-list="fileList1"
                                @preview="handlePreview1"
                                @change="handleChange"
                            >
                                <a-icon type="plus" />
                                <div class="ant-upload-text">上传图片</div>
                            </a-upload>
                        </template>
                    </a-row>
                </a-form-item>

                <a-form-item label="链接地址">
                    <a-input v-model="formData.url" placeholder="请输入链接地址" />
                    <template>
                        <a-button type="dashed" icon="plus" @click="setLinkBases('merchant', 'PC')">
                            从功能库中选择</a-button
                        >
                    </template>
                </a-form-item>

                <a-form-item label="导航排序">
                    <a-input
                        v-decorator="['tel', { rules: [{ required: true, message: '请输入导航排序' }] }]"
                        placeholder="请输入导航排序"
                        v-model="formData.sort"
                    >
                    </a-input>
                </a-form-item>

                <a-form-item label="导航状态">
                    <a-select v-model="formData.status">
                        <a-select-option :value="0"> 禁用 </a-select-option>
                        <a-select-option :value="1"> 正常 </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item :wrapper-col="{ span: 20, offset: 6 }">
                    <a-row type="flex" justify="center" align="top">
                        <a-col :span="4" class="text-left">
                            <a-button type="default" @click="hidelModel()"> 取消 </a-button>
                        </a-col>
                        <a-col :span="6" class="text-center">
                            <a-button type="primary" html-type="submit"> 提交 </a-button>
                        </a-col>
                        <a-col :span="6"> </a-col>
                    </a-row>
                </a-form-item>
            </a-form>
        </a-modal>

        <a-modal :visible="previewVisible1" :footer="null" @cancel="handleCancel1">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>

<script>
import mallMerchantApi from '@/api/merchant/store'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}
const columns = [
    {
        title: '排序',
        dataIndex: 'sort',
    },
    {
        title: '名称',
        dataIndex: 'name',
    },
    {
        title: '链接地址',
        dataIndex: 'url',
        scopedSlots: { customRender: 'url' },
    },
    {
        title: '图片',
        dataIndex: 'pic',
        scopedSlots: { customRender: 'pic' },
    },
    {
        title: '状态',
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' },
    },
    {
        title: '最后操作时间',
        dataIndex: 'last_time',
    },
    {
        title: '操作',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' },
    },
]

export default {
    props: {
        // 存放路径
        upload_dir: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            headers: {
                authorization: 'authorization-text',
            },
            fileList1: [],
            spinning: false,
            dataList: [],
            visible_staff: false,
            previewVisible1: false,
            previewImage: '',
            store_id: '',
            mer_id: '',
            site_url: '',
            pagination: {
                current: 1,
                total: 0,
                pageSize: 20,
                showSizeChanger: false,
                showQuickJumper: false,
                onChange: this.onPageChange,
            },
            queryParam: {
                page: 1,
                store_id: '',
            },
            action: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
            uploadName: 'reply_pic',
            formData: {
                id: '',
                name: '',
                url: '',
                pic: '',
                status: 1,
                sort: '',
                last_time: '',
                store_id: '',
            },
            columns,
        }
    },
    created() {
        this.store_id = this.$route.query.store_id
        this.mer_id = this.$route.query.mer_id || ''
        this.formData.store_id = this.$route.query.store_id
        this.getLists()
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        async handlePreview1(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj)
            }
            this.previewImage = file.url || file.preview
            this.previewVisible1 = true
        },
        handleChange({ fileList }) {
            if (fileList.length > 0) {
                let len = fileList.length - 1
                this.fileList1 = fileList
                if (this.fileList1[len].status == 'done') {
                    //this.formData.image_logo = this.fileList1[len].thumbUrl
                    this.formData.pic = this.fileList1[len].response.data
                    this.fileList1[0].uid = 'logo'
                    this.fileList1[0].name = 'logo_1'
                    this.fileList1[0].status = 'done'
                    this.fileList1[0].url = this.fileList1[len].response.data
                    if (fileList.length > 1) {
                        this.fileList1.splice(0, len)
                    }
                }
            }else{
                this.fileList1 = []
                this.formData.pic = ''
            }
        },
        getLists() {
            this.queryParam['page'] = this.pagination.current
            this.queryParam['store_id'] = this.store_id
            this.request(mallMerchantApi.storeSliderList, this.queryParam).then((res) => {
                this.site_url = res.site_url
                this.dataList = res.list
                this.pagination.total = res.count
            })
        },
        handleCancel1() {
            this.previewVisible1 = false
        },
        goNextPage() {
            this.visible_staff = true
        },
        handleSubmit(e) {
            e.preventDefault()
            if(!this.formData.pic){
                this.$message.warning(this.L('请上传导航图片'))
                return
            }
            this.request(mallMerchantApi.storeSliderEdit, this.formData).then((res) => {
                this.getLists()
                this.hidelModel()
            })
        },
        setLinkBases(source = 'platform', type = 'h5') {
            this.$LinkBases({
                // visible: true,
                source: source, // 必填
                type: type, // 必填
                source_id: this.mer_id,
                store_id: this.store_id,
                // 确定按钮
                handleOkBtn: (res) => {
                    // 点击按钮事件
                    console.log('handleOk', res)
                    this.formData.url = res.url
                },
            })
        },
        hidelModel() {
            //隐藏店员编辑框
            this.visible_staff = false
            this.formData = {
                id: '',
                name: '',
                url: '',
                pic: '',
                status: 1,
                sort: '',
                last_time: '',
                store_id: this.store_id,
            }
            this.fileList1 = []
        },
        sliderEdit(record) {
            //修改店员信息
            let param = {
                id: record.id,
            }
            this.request(mallMerchantApi.storeSliderMsg, param).then((res) => {
                this.formData.id = res.list.id
                this.formData.name = res.list.name
                this.formData.url = res.list.url
                this.formData.pic = res.list.pic
                this.formData.sort = res.list.sort
                this.fileList1 = [
                    {
                        uid: 'image',
                        name: 'image_1',
                        status: 'done',
                        url: record.pic,
                    },
                ]
                this.formData.status = res.list.status
                this.formData.last_time = res.list.last_time
                this.formData.store_id = res.list.store_id
                this.visible_staff = true
            })
        },
        sliderDel(id) {
            //店员删除
            this.$confirm({
                title: '是否确定删除该店铺导航?',
                centered: true,
                onOk: () => {
                    let param = {
                        id: id,
                        store_id: this.store_id,
                    }
                    this.request(mallMerchantApi.storeSliderDel, param).then((res) => {
                        this.getLists()
                        this.$message.success('操作成功！')
                    })
                },
                onCancel() {},
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getLists()
        },
    },
}
</script>

<style scoped>
</style>