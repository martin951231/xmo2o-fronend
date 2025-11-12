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
                            label="楼盘名称:"
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
                            label="楼盘平均价格:"
                            :colon="false"
                            prop="price"
                            help="元/平方米"
                            :rules="[
                            {
                                required: true,
                                message: '楼盘平均价格不能为空',
                                trigger: ['blur'],
                            },
                        ]"
                    >
                        <a-input
                                v-model="formData.price"
                                :maxLength="100"
                                placeholder="请输入楼盘平均价格,单位元/平方米"
                                style="width: 300px"
                        />
                    </a-form-model-item>

                    <a-form-model-item
                            label="楼盘面积:"
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

                    <a-form-model-item label="地址" required>
                        <a-cascader
                                :options="formData.areas"
                                placeholder="选择"
                                :value="sel_areas"
                                @change="onChangeArea"
                                style="width: 300px"
                        />
                    </a-form-model-item>

                    <a-form-model-item
                            label="详细地址:"
                            :colon="false"
                            prop="title"
                            :rules="[
                            {
                                required: true,
                                message: '详细地址不能为空',
                                trigger: ['blur'],
                            },
                        ]"
                    >
                        <a-input
                                v-model="formData.address"
                                :maxLength="100"
                                placeholder="请输入详细地址"
                                style="width: 300px"
                        />
                    </a-form-model-item>

                    <a-form-model-item label="经纬度:" :colon="false" required>
                        <a-row style="margin-bottom: 20px;">
                            <a-col :span="15">
                                <a-input style="width: 200px;" :disabled="true" :value="formData.longlat" placeholder="请选择位置" /> <a
                                    @click="$refs.mapPointModel.selectPoint()" style="margin-left: 5px;">地图选点</a>
                            </a-col>
                        </a-row>
                    </a-form-model-item>

                    <a-form-model-item
                            label="楼盘咨询电话:"
                            :colon="false"
                            prop="phone"
                            :rules="[
                            {
                                required: true,
                                message: '楼盘咨询电话不能为空',
                                trigger: ['blur'],
                            },
                        ]"
                    >
                        <a-input
                                v-model="formData.phone"
                                :maxLength="100"
                                placeholder="请输入"
                                style="width: 300px"
                        />
                    </a-form-model-item>

                    <a-form-model-item label="上传标题图片" required help="只能上传一张">
                        <a-row>
                            <a-input hidden v-model="formData.cover_image"></a-input>
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


                    <a-form-model-item label="上传详情轮播图" required>
                        <a-row>
                            <a-input hidden v-model="formData.images"></a-input>
                            <template>
                                <div class="clearfix">
                                    <a-upload
                                            :action="action"
                                            :name="uploadName"
                                            :data="{ upload_dir: upload_dir}"
                                            list-type="picture-card"
                                            :file-list="fileList"
                                            @preview="handlePreview"
                                            @change="handleChange1"
                                    >
                                        <!-- <div v-if="fileList.length < 10">-->
                                        <a-icon type="plus" />
                                        <div class="ant-upload-text">上传图片</div>
                                        <!--</div>-->
                                    </a-upload>
                                    <a-modal
                                            :visible="previewVisible"
                                            :footer="null"
                                            @cancel="handleCancel"
                                    >
                                        <img alt="example" style="width: 100%" :src="previewImage" />
                                    </a-modal>
                                </div>
                            </template>
                        </a-row>
                    </a-form-model-item>

                    <a-form-model-item label="楼盘详情:" :colon="false" required>
                        <a-row style="margin-bottom: 20px;">
                            <a-col :span="24">
                               <!-- <vue-ueditor-wrap v-model="formData.content" :config="ueConfig"></vue-ueditor-wrap>-->
                                <rich-text :info.sync="formData.content" />
                            </a-col>
                        </a-row>
                    </a-form-model-item>
                </a-card>
            </a-form-model>
            <div class="page-header">
                <a-button class="ml-20 mt-20 mb-20" type="primary" @click="handleSubmit()">提交</a-button>
            </div>
        </a-spin>
        <map-point @loadRefresh="setLongLat" ref="mapPointModel" />
    </div>
</template>

<script>
    import lifePlatformApi from '@/api/life_tools/platform/index'
    import mapPoint from './mapPoint.vue'
    import RichText from '@/components/RichText/RichText2'
    import VueUeditorWrap from 'vue-ueditor-wrap'
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
        })
    }
    export default {
        name: "SaleBuildingEdit",
        components: {
            RichText,
            mapPoint,
            VueUeditorWrap
        },
        props: {
            // 存放路径
            upload_dir: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                title: this.L('新建门票'),
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
                tabName:"新建楼盘",
                form: this.$form.createForm(this),
                action: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
                uploadName: 'reply_pic',
                formData: {
                    acreage:undefined,
                    houses_id:0,
                    longlat: '',
                    title: '', // 标题
                    price: undefined, // 价格
                    long: undefined, // 标签
                    lat:undefined,
                    province_id:0,
                    city_id:0,
                    area_id:0,
                    address:'',
                    phone:'',
                    cover_image:'',
                    images:'',
                    content:'',
                    areas:[]
                },
                ueConfig: {
                    enableAutoSave: false,
                    autoSyncData: false,
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 350,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 上传文件接口
                    serverUrl: '/v20/public/static/UEditor/php/controller.php',
                    // UEditor 文件存放位置
                    UEDITOR_HOME_URL: '/v20/public/static/UEditor/',
                },
            }
        },
        watch: {
            '$route.query.houses_id'(val) {
                if (val>0) {
                    this.formData.houses_id = val
                    this.tabName="编辑楼盘",
                        this.getEditInfo()
                }else{
                    this.tabName="新增楼盘"
                    this.getDetail()
                }
            },
        },
        mounted() {
            this.formData.houses_id = this.$route.query.houses_id
            this.form = this.$form.createForm(this)
            if (this.formData.houses_id>0) {
                this.getEditInfo()
            }else{
                this.getDetail()
            }
        },
        activated() {
            this.formData.houses_id = this.$route.query.houses_id
            this.form = this.$form.createForm(this)
            if (this.formData.houses_id>0) {
                this.getEditInfo()
            }else{
                this.getDetail()
            }
        },
        methods: {
            onChangeArea(value) {
                this.formData.province_id = value[0]
                this.formData.city_id = value[1]
                this.formData.area_id = value[2]
                this.sel_areas = [value[0], value[1], value[2]]
            },
            setLongLat(longlat) {
                this.formData.longlat = longlat
                this.$set(this.formData, 'longlat', longlat)
            },
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj)
                }
                this.previewImage = file.url || file.preview
                this.previewVisible = true
            },
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
                        this.formData.cover_image =this.fileList1[len].response.data
                        console.log(this.fileList1[len].response.data,"this.fileList1[len].thumbUrl");
                        this.fileList1[0].uid = 'logo'
                        this.fileList1[0].name = 'logo_1'
                        this.fileList1[0].status = 'done'
                        this.fileList1[0].url = this.fileList1[len].response.data
                        if (fileList.length > 1) {
                            this.fileList1.splice(0, len)
                        }
                    }
                } else {
                    this.formData.cover_image = ''
                }
            },
            handleChange1({ fileList }) {
                    this.fileList = fileList
                    let attr_image = []
                    for (let i = 0; i < this.fileList.length; i++) {
                        if (this.fileList[i].status == 'done') {
                            if (this.fileList[i].url !== undefined) {
                                //编辑组装的数据
                                attr_image.push(this.fileList[i].url)
                            } else {
                                //上传的图片
                                attr_image.push(this.fileList[i].response.data)
                            }
                        }
                    }

                    if (attr_image.length > 0) {
                        this.formData.images = attr_image.join(',')
                    }
            },
            handleCancel1() {
                this.previewVisible1 = false
            },
            handleCancel() {
                this.previewVisible = false
            },
            handleSubmit() {
                if(!this.formData.title){
                    this.$message.error("请输入楼盘名称")
                    return false;
                }

                if(!this.formData.price){
                    this.$message.error("请输入楼盘价格")
                    return false;
                }

                if(!this.formData.acreage){
                    this.$message.error("请输入楼盘面积")
                    return false;
                }

                if(this.formData.longlat==""){
                    this.$message.error("请选择经纬度")
                    return false;
                }

                if(!this.formData.province_id || !this.formData.city_id || !this.formData.area_id){
                    this.$message.error("请选择地址")
                    return false;
                }

                if(this.formData.address==undefined || this.formData.address==""){
                    this.$message.error("请输入详细地址")
                    return false;
                }

                if(this.formData.cover_image==undefined || this.formData.cover_image==""){
                    this.$message.error("请上传标题图片")
                    return false;
                }

                if(this.formData.phone==undefined || this.formData.phone==""){
                    this.$message.error("请输入楼盘咨询电话")
                    return false;
                }

                if(this.formData.images==undefined || this.formData.images==""){
                    this.$message.error("请上传详情轮播图")
                    return false;
                }

                if(this.formData.content==undefined || this.formData.content==""){
                    this.$message.error("请输入楼盘详情")
                    return false;
                }
                this.request(lifePlatformApi.editHouseFloor, this.formData)
                    .then((res) => {
                        this.$message.success("保存成功！")
                        this.formData.houses_id=0
                        setTimeout(() => {
                            this.$message.destroy()
                            this.confirmLoading = false
                            this.$router.push({ path: '/life_tools/platform.LifeTools/saleBuildingList'})
                        }, 1500)
                    })
                    .catch((error) => {
                        this.confirmLoading = false
                    })
            },
            getEditInfo() {
                this.request(lifePlatformApi.getHousesFloorMsg, {
                    houses_id: this.formData.houses_id,
                }).then((res) => {
                    this.formData=res.list
                    this.formData.areas=res.areas
                    if(res.list.long && res.list.lat){
                        this.formData.longlat=res.list.long+","+res.list.lat
                    }else{
                        this.formData.longlat=""
                    }
                    this.fileList1 = []
                    this.fileList = []
                    if (res.list.swiper_image.length > 0) {
                        for (let j = 0; j < res.list.swiper_image.length; j++) {
                            //商家图片
                            let param1 = {
                                uid: j,
                                name: 'image_' + j,
                                status: 'done',
                                url: res.list.swiper_image[j],
                            }
                            this.fileList.push(param1)
                        }
                    }

                    if (res.list.cover_image) {
                        //商家logo
                        let param1 = {
                            uid: 'logo',
                            name: 'logo_1',
                            status: 'done',
                            url: res.list.cover_image,
                        }
                        this.fileList1.push(param1)
                    }
                    this.sel_areas = [res.list.province_id, res.list.city_id, res.list.area_id]
                })
            },
            getDetail() {
                this.formData= {
                        acreage:undefined,
                        houses_id:0,
                        longlat: '',
                        title: '', // 标题
                        price: undefined, // 价格
                        long: undefined, // 标签
                        lat:undefined,
                        province_id:0,
                        city_id:0,
                        area_id:0,
                        address:'',
                        phone:'',
                        cover_image:'',
                        images:'',
                        content:'',
                        areas:[]
                }
                this.fileList1 = [] //标题图片
                this.fileList = [] //轮播图片
                this.sel_areas = [] // 地址
                this.request(lifePlatformApi.getHousesFloorMsg, {
                    houses_id: 0
                }).then((res) => {
                    this.formData.areas=res.areas
                })
            },
        },
    }
</script>

<style scoped>
>>>.ant-cascader-input.ant-input {
    position: static;
    width: 300px;
    padding-right: 24px;
    background-color: transparent !important;
    cursor: pointer;
}
</style>