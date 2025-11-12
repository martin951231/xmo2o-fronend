<template>
    <div class=" pt-20 pl-20 pr-20 pb-20  br-10">
        <a-spin :spinning="confirmLoading">
            <a-tabs default-active-key="loans">
                <a-tab-pane key="loans" :tab="tabName">
                </a-tab-pane>
            </a-tabs>
            <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm">
                <a-card :bordered="false">
                    <a-form-model-item
                            label="户型名称:"
                            :colon="false"
                            prop="title"
                            :rules="[
                            {
                                required: true,
                                message: '楼盘名称不能为空',
                                trigger: ['blur'],
                            },
                        ]"
                    >
                        <a-input
                                v-model="formData.title"
                                :maxLength="100"
                                placeholder="请输入名称"
                                style="width: 300px"
                        />
                    </a-form-model-item>

                    <a-form-model-item
                            label="户型面积:"
                            :colon="false"
                            prop="acreage"
                            :rules="[
                            {
                                required: true,
                                message: '楼盘面积不能为空',
                                trigger: ['blur'],
                            },
                        ]"
                    >
                        <a-input
                                v-model="formData.acreage"
                                :maxLength="100"
                                placeholder="请输入楼盘面积"
                                style="width: 300px"
                        />
                    </a-form-model-item>

                    <a-form-model-item label="上传标题图片" required="true" help="只能上传一张">
                        <a-row>
                            <a-input hidden v-model="formData.image"></a-input>
                            <template>
                                <div class="clearfix">
                                    <a-upload
                                            :action="action"
                                            :name="uploadName"
                                            :data="{ upload_dir: upload_dir}"
                                            list-type="picture-card"
                                            :file-list="fileList1"
                                            @preview="handlePreview1"
                                            @change="handleChange"
                                    >
                                        <a-icon type="plus" />
                                        <div class="ant-upload-text">上传图片</div>
                                    </a-upload>
                                    <a-modal
                                            :visible="previewVisible1"
                                            :footer="null"
                                            @cancel="handleCancel1"
                                    >
                                        <img alt="example" style="width: 100%" :src="previewImage" />
                                    </a-modal>
                                </div>
                            </template>
                        </a-row>
                    </a-form-model-item>
                </a-card>
            </a-form-model>
            <div class="page-header">
                <a-button class="ml-20 mt-20 mb-20" type="primary" @click="handleSubmit()">提交</a-button>
            </div>
        </a-spin>
    </div>
</template>

<script>
    import lifePlatformApi from '@/api/life_tools/platform/index'
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
        })
    }
    export default {
        name: "SaleBuildingFloorPlanEdit",
        props: {
            // 存放路径
            upload_dir: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                labelCol: {
                    xs: {
                        span: 24,
                    },
                    sm: {
                        span: 3,
                    },
                },
                wrapperCol: {
                    xs: {
                        span: 24,
                    },
                    sm: {
                        span: 16,
                    },
                },
                visible: false,
                confirmLoading: false,
                previewVisible1: false,
                previewVisible: false,
                previewImage: '',
                previewImage1: '',
                sel_areas: [],
                fileList1: [], //标题图片
                fileList: [], //轮播图片
                tabName:"新建户型",
                action: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
                uploadName: 'reply_pic',
                formData: {
                    pigcms_id:0,
                    acreage:undefined,
                    houses_id:0,
                    title: '', // 标题
                    image:'',
                },
            }
        },
        watch: {
            '$route.query.pigcms_id'(val) {
                if (val>0) {
                    this.formData.pigcms_id = val
                    this.tabName="编辑户型",
                        this.getEditInfo()
                }else{
                    this.tabName="新增户型"
                    this.getDetail()
                }
            },
            '$route.query.houses_id'(val) {
                if (val>0) {
                    this.formData.houses_id = val
                }
            },
        },
        mounted() {
            this.formData.pigcms_id = this.$route.query.pigcms_id
            this.formData.houses_id = this.$route.query.houses_id
            this.form = this.$form.createForm(this)
            if (this.formData.pigcms_id>0) {
                this.getEditInfo()
            }else{
                this.getDetail()
            }
        },
        activated() {
            this.formData.pigcms_id = this.$route.query.pigcms_id
            this.formData.houses_id = this.$route.query.houses_id
            this.form = this.$form.createForm(this)
            if (this.formData.pigcms_id>0) {
                this.getEditInfo()
            }else{
                this.getDetail()
            }
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
                this.fileList1 = fileList
                if (fileList.length > 0) {
                    let len = fileList.length - 1
                    if (this.fileList1[len].status == 'done') {
                        this.formData.image =this.fileList1[len].response.data
                        this.fileList1[0].uid = 'logo'
                        this.fileList1[0].name = 'logo_1'
                        this.fileList1[0].status = 'done'
                        this.fileList1[0].url = this.fileList1[len].response.data
                        if (fileList.length > 1) {
                            this.fileList1.splice(0, len)
                        }
                    }
                } else {
                    this.formData.image = ''
                }
            },
            handleCancel1() {
                this.previewVisible1 = false
            },
            handleSubmit() {
                if(!this.formData.title){
                    this.$message.error("请输入户型名称")
                    return false;
                }

                if(!this.formData.image){
                    this.$message.error("请输入户型图片")
                    return false;
                }

                if(this.formData.acreage=="" || this.formData.acreage==undefined){
                    this.$message.error("请输入户型面积")
                    return false;
                }
                this.formData.houses_id = this.$route.query.houses_id
                this.request(lifePlatformApi.editHouseFloorPlan, this.formData)
                    .then((res) => {
                        this.$message.success("保存成功！")
                        this.formData.pigcms_id=0
                        setTimeout(() => {
                            this.$message.destroy()
                            this.confirmLoading = false
                            this.$router.push({ path: '/life_tools/platform.LifeTools/saleBuildingFloorPlanList', query: {houses_id: this.formData.houses_id}})
                        }, 1500)
                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })
            },
            getEditInfo() {
                this.fileList1=[]
                this.formData.pigcms_id = this.$route.query.pigcms_id
                this.request(lifePlatformApi.getHousesFloorPlanMsg, {
                    pigcms_id: this.formData.pigcms_id,
                }).then((res) => {
                    this.fileList1=[]
                    if (res.image) {
                        //商家logo
                        let param1 = {
                            uid: 'logo',
                            name: 'logo_1',
                            status: 'done',
                            url: res.image,
                        }
                        this.fileList1.push(param1)
                    }
                    this.formData=res
                })
            },
            getDetail(){
                this.formData={
                        acreage:undefined,
                        title: '', // 标题
                        image:'',
                }
            }
        },
    }
</script>

<style scoped>

</style>