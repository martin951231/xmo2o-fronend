<template>
    <a-drawer :title="cameraForm.id?'编辑':'添加'" :width="1200" :visible="visible" :maskClosable="false"
        :confirmLoading="confirmLoading" @close="handleCancel">
        <a-form-model ref="ruleForm" :model="cameraForm" :rules="rules" tyle="vertical">
            <div class='form_con'>
                <div class="form_item">
                    <a-form-model-item label="设备厂商" prop="brand_id">
                        <a-select @change="(value)=>handleSelectChange(value, 'brand_id')" v-model="cameraForm.brand_id"
                            placeholder="请选择设备厂商">
                            <a-select-option :value="item.id" v-for="(item,index) in brandList" :key="index">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </div>

                <div class="form_item">
                    <a-form-model-item prop="thirdProtocol">
                        <template slot="label">设备协议</template>
                        <a-select @change="value=>handleSelectChange(value, 'thirdProtocol')" placeholder="请选择"
                            v-model="cameraForm.thirdProtocol">
                            <a-select-option :value="value.thirdProtocol" v-for="(value, key) in thirdProtocolArr"
                                :key="key">
                                {{value.thirdTitle}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </div>
                <div class="form_item">
                    <a-form-model-item v-if="hasRadio == 1" label="协议类型" prop="isup_version">
                         <template slot='extra'>
                            <span>点击图片可以查看</span>
                        </template>
                        <a-radio-group @change="handleRadioChange" v-model="cameraForm['isup_version']">
                            <a-radio :value="key" v-for="(value, key) in radioList" :key="key">{{value}}</a-radio>
                        </a-radio-group>
                        <img style="width: 30px;" v-if="radioIconImg && radioExplainImg" :src="radioIconImg" @click.stop="previewImage(radioExplainImg)">
                    </a-form-model-item>
                </div>
                <div class="form_item">
                    <a-form-model-item v-if="hasRadio == 1" label="适用设备型号" prop="isup_version">
                         <template slot='extra'>
                            <span>点击图片可以查看</span>
                        </template>
                        <img style="width: 30px;" v-if="radioIconImg && radioExplainImg" :src="radioIconImg" @click.stop="previewTwoImage(applicableModelExplainImg, deviceModeInfoExplainImg)">
                    </a-form-model-item>
                </div>
                <div class="form_item" v-for="(value, key) in formList" :key="key" v-show="value['isShow'] == 1">
                    <!-- 输入框 -->
                    <a-form-model-item :label="value['lable']" :prop="key"
                        v-if="value['formType'] == 'input' && value['isShow'] == 1 && refrashForm">
                        <template slot='extra'>
                            <span v-if="!value['href']">{{value['title']}}</span>
                            <a v-else type="link" @click="goUrl(value['href'])">{{value['title']}}</a>
                        </template>
                        <a-input v-model="cameraForm[key]" placeholder="请输入" />
                    </a-form-model-item>
                    <!-- 选择框 -->
                    <a-form-model-item :label="value['lable']" :prop="key"
                        v-if="value['formType'] == 'select' && value['isShow'] == 1">
                        <template slot='extra'>
                            <span v-if="!value['href']">{{value['title']}}</span>
                            <a v-else type="link" @click="goUrl(value['href'])">{{value['title']}}</a>
                        </template>
                        <a-select v-model="cameraForm[key]" placeholder="请选择">
                            <a-select-option :value="item.id" v-for="(item,index) in deviceTypeList" :key="index">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <!-- radio -->
                    <a-form-model-item :label="value['lable']" :prop="key"
                        v-if="value['formType'] == 'radio' && value['isShow'] == 1">
                        <template slot='extra'>
                            <span v-if="!value['href']">{{value['title']}}</span>
                            <a v-else type="link" @click="goUrl(value['href'])">{{value['title']}}</a>
                        </template>
                        <a-radio-group v-model="cameraForm[key]">
                            <a-radio :value="0">不支持</a-radio>
                            <a-radio :value="1">支持</a-radio>
                        </a-radio-group>
                    </a-form-model-item>
                    <!-- 日期 -->
                    <a-form-model-item :label="value['lable']" :prop="key"
                        v-if="value['formType'] == 'date' && value['isShow'] == 1">
                        <template slot='extra'>
                            <span v-if="!value['href']">{{value['title']}}</span>
                            <a v-else type="link" @click="goUrl(value['href'])">{{value['title']}}</a>
                        </template>
                        <a-date-picker v-if="cameraForm.open_time"
                            :default-value="moment(cameraForm.open_time, 'YYYY-MM-DD')" style="width: 100%;"
                            @change="handleDateChange" placeholder="请选择" />
                        <a-date-picker v-else style="width: 100%;" @change="handleDateChange" placeholder="请选择" />
                    </a-form-model-item>
                </div>
                
            </div>
            <div v-if="hasRadio == 1">
                <div style="margin-left: 1%;font-weight: 900;">
                    【网络>高级配置>HTTP监听】： <img style="width: 30px;" v-if="httpIconImg && httpExplainImg" :src="httpIconImg" @click.stop="previewImage(httpExplainImg)">
                </div>
                <div class='form_con' v-for="(httpItem, indexItem) in httpListenArr" :key="indexItem">
                    <div class="form_item_tip">
                        <a-form-model-item>
                            <div style="display: flex;">
                                <div style="min-width: 120px;">{{httpItem['title']}}：</div>
                                {{httpItem['value']}}
                                <a-button type="primary" size="small" @click="copyItemValue(httpItem['value'])" style="margin-left:10px;margin-top:8px;">复制</a-button>
                            </div>
                        </a-form-model-item>
                    </div>
                </div>
            </div>
            <div class='form_con' v-if="synOverView && synOverView['syn_msg']">
                <div class="form_item_tip">
                    <a-form-model-item v-if="synOverView && synOverView['syn_msg']" label="同步信息" prop="syn_msg">
                        {{synOverView['syn_msg']}}
                    </a-form-model-item>
                </div>
            </div>
            <div class='form_con' v-if="synOverView && synOverView['syn_time_text']">
                <div class="form_item_tip">
                    <a-form-model-item v-if="synOverView && synOverView['syn_time_text']" label="同步时间" prop="syn_time_text">
                        {{synOverView['syn_time_text']}}
                    </a-form-model-item>
                </div>
            </div>
        </a-form-model>

        <div :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }">
            <a-button :style="{ marginRight: '8px' }" @click="handleCancel">
                取消
            </a-button>
            <a-button :loading="confirmLoading" type="primary" @click="handleSubmit">
                提交
            </a-button>
        </div>
        <a-modal title="预览图片" :width="1505" :visible="previewVisible" @cancel="handlePreviewCancel" :footer="null">
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                <img preview="1" style="width: 1500px;" :src="imageUrl">
            </div>
        </a-modal>
        <a-modal title="预览图片" :width="905" :visible="previewTwoVisible" @cancel="handlePreviewCancel" :footer="null">
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                <img preview="1" style="width: 752px;" :src="imageUrl1">
            </div>
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                <img preview="1" style="width: 752px;" :src="imageUrl2">
            </div>
        </a-modal>
    </a-drawer>
</template>

<script>
    import villageApi from '@/api/community/village';
    import moment from 'moment';
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            cameraId: {
                type: [String, Number],
                default: 0
            },
            channelId: {
                type: [String, Number],
                default: 0
            }
        },
        watch: {
            visible: {
                handler(val) {
                    if (val) {
                        this.getBrandList()
                        this.getDeviceType()
                    }
                    if (val && this.cameraId) {
                        this.getCameraInfo(this.cameraId, this.channelId)
                    }
                }
            }
        },
        data() {
            return {
                hasHttpListen: false,
                imageUrl: '',
                previewVisible: false,
                previewTwoVisible: false,
                refrashForm: true,
                confirmLoading: false,
                cameraForm: {
                    isup_version: '',
                    brand_id: undefined,
                    thirdProtocol: undefined,
                    camera_id: 0,
                    
                    camera_name: "",
                    camera_sn: "",
                    device_code: "",
                    device_type: undefined,
                    is_support_look: undefined,
                    open_time: "",
                    param: "",
                    product_model: "",
                    product_name: "",
                    remark: "",
                    sort: 0,
                    thirdLoginName: "",
                    thirdLoginPassword: "",
                    channel_id: 0,
                    channelId: "",
                    channelName: "",
                },
                brandList: [], //设备品牌
                deviceTypeList: [], //设备类型
                thirdProtocolArr: {},
                rules: {
                    isup_version: [{
                        required: true,
                        message: '请选择',
                        trigger: 'blur'
                    }],
                    thirdProtocol: [{
                        required: true,
                        message: '请选择',
                        trigger: 'blur'
                    }],
                    brand_id: [{
                        required: true,
                        message: '请选择',
                        trigger: 'blur'
                    }],
                },
                formList: {},
                hasRadio: 0,
                radioList: {},
                synOverView: {},
                radioIconImg: '',
                radioExplainImg: '',
                httpIconImg: '',
                httpExplainImg: '',
                applicableModelExplainImg: '',
                deviceModeInfoExplainImg: '',
                httpListenArr: [],
                imageUrl1: '',
                imageUrl2: '',
            }
        },
        methods: {
            moment,
            handleDateChange(date, dateString) {
                this.cameraForm.open_time = dateString;
            },
            copyItemValue(value) {
                console.log('value', value)
                var input = document.createElement("input");// 直接构建input
                input.value = value;  // 设置内容
                document.body.appendChild(input);// 添加临时实例
                input.select();   // 选择实例内容
                document.execCommand("Copy");// 执行复制
                document.body.removeChild(input);//删除临时实例
                this.$message.success('复制成功');
            },
            handlePreviewCancel() {
                this.previewVisible = false;
                this.previewTwoVisible = false;
            },
            previewImage(imageUrlString) {
                this.imageUrl = imageUrlString
                this.previewVisible = true;
            },
            previewTwoImage(applicableModelExplainImg, deviceModeInfoExplainImg) {
                this.imageUrl1 = applicableModelExplainImg;
                this.imageUrl2 = deviceModeInfoExplainImg;
                this.previewTwoVisible = true;
            },
            handleRadioChange(value){
                if(value.target.value == "ehomeV5"){
                    this.rules['thirdLoginPassword'] = [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }]
                } else {
                    this.rules['thirdLoginPassword'] = [{
                        required: false,
                        message: '请输入',
                        trigger: 'blur'
                    }]
                }
                this.hasHttpListen = true
                this.refrashForm = false
                this.$nextTick(()=>{
                    this.refrashForm = true
                })
                this.$forceUpdate()
            },
            clearForm() {
                this.formList = {}
                this.hasRadio = 0
                this.radioList = {}
                this.radioIconImg = ''
                this.radioExplainImg = ''
                this.httpIconImg = ''
                this.httpExplainImg = ''
                this.applicableModelExplainImg = ''
                this.deviceModeInfoExplainImg = ''
                this.httpListenArr = []
                this.hasHttpListen = false
                this.refrashForm = true
                this.confirmLoading = false
                this.brandList = []
                this.cameraForm = {
                    isup_version: '',
                    brand_id: undefined,
                    thirdProtocol: undefined,
                    camera_id: 0,
                    
                    camera_name: "",
                    camera_sn: "",
                    device_code: "",
                    device_type: undefined,
                    is_support_look: undefined,
                    open_time: "",
                    param: "",
                    product_model: "",
                    product_name: "",
                    remark: "",
                    sort: 0,
                    thirdLoginName: "",
                    thirdLoginPassword: "",
                    channel_id: 0,
                    channelId: "",
                    channelName: "",
                }
                this.brandList = []
                this.deviceTypeList = []
                this.thirdProtocolArr = []
                this.rules = {
                    isup_version: [{
                        required: true,
                        message: '请选择',
                        trigger: 'blur'
                    }],
                    thirdProtocol: [{
                        required: true,
                        message: '请选择',
                        trigger: 'blur'
                    }],
                    brand_id: [{
                        required: true,
                        message: '请选择',
                        trigger: 'blur'
                    }],
                }
                this.synOverView = {}
                this.$refs.ruleForm.resetFields();
            },
            handleSelectChange(value, type, has = 0) {
                if (type == 'brand_id') {
                    this.formList = {}
                    this.hasRadio = 0
                    this.radioList = {}
                    this.radioIconImg = ''
                    this.radioExplainImg = ''
                    this.httpIconImg = ''
                    this.httpExplainImg = ''
                    this.applicableModelExplainImg = ''
                    this.deviceModeInfoExplainImg = ''
                    this.httpListenArr = []
                    this.hasHttpListen = false
                    this.thirdProtocolArr = {};
                    this.cameraForm.brand_id = value;
                    if (has != 1) {
                        this.cameraForm.thirdProtocol = undefined
                    }
                    this.$forceUpdate()
                    this.request(villageApi.getThirdProtocol, {
                        brand_id: value, channelId: this.channelId, cameraId: this.cameraId
                    }).then((res) => {
                        if (res.thirdProtocol) {
                            this.thirdProtocolArr = res.thirdProtocol;
                        }
                        if (res.tips) {
                            this.formList = res.tips
                            for (let key in res.tips) {
                                if(!this.cameraId && res.tips[key]['formType'] == 'select'){
                                    this.cameraForm[key] = undefined
                                } else if(!this.cameraId) {
                                    this.cameraForm[key] = res.tips[key]['default_value']
                                }
                                console.log('this.cameraForm===>', this.cameraForm)
                                this.rules[key] = [{
                                    required: res.tips[key].isRequired == 1 ? true : false,
                                    message: res.tips[key].formType == 'input' ? '请输入' : '请选择',
                                    trigger: 'blur'
                                }]
                            }
                            let that = this;
                            let thirdProtocol = this.cameraForm.thirdProtocol;
                            console.log('thirdProtocol', thirdProtocol, has)
                            if (has == 1 && thirdProtocol) {
                                this.$nextTick(() => {
                            console.log('1111111111thirdProtocol', thirdProtocol, has)
                                    that.handleSelectChange(thirdProtocol, 'thirdProtocol')
                                })
                            }
                        }
                    })
                } else if (type == 'thirdProtocol') {
                    this.hasRadio = 0
                    this.radioList = {}
                    this.radioIconImg = ''
                    this.radioExplainImg = ''
                    this.httpIconImg = ''
                    this.httpExplainImg = ''
                    this.applicableModelExplainImg = ''
                    this.deviceModeInfoExplainImg = ''
                    this.httpListenArr = []
                    this.hasHttpListen = false
                    
                    this.request(villageApi.getVideoGatewayList, {
                        protocol: value, channelId: this.channelId, cameraId: this.cameraId
                    }).then((res) => {
                        if(res.formParams){
                            this.formList = res.formParams
                            for (let key in res.formParams) {
                                if(!this.cameraId && res.formParams[key]['formType'] == 'select'){
                                    this.cameraForm[key] = undefined
                                } else if(!this.cameraId) {
                                    this.cameraForm[key] = res.formParams[key]['default_value']
                                }
                                console.log('this.cameraForm===>', this.cameraForm)
                                this.rules[key] = [{
                                    required: res.formParams[key].isRequired == 1 ? true : false,
                                    message: res.formParams[key].formType == 'input' ? '请输入' : '请选择',
                                    trigger: 'blur'
                                }]
                            }
                            let that = this
                            let isup_version = this.cameraForm.isup_version
                            if (isup_version) {
                                this.$nextTick(()=>{
                                    if(isup_version == "ehomeV5"){
                                        that.rules['thirdLoginPassword'] = [{
                                            required: true,
                                            message: '请输入',
                                            trigger: 'blur'
                                        }]
                                    } else {
                                        that.rules['thirdLoginPassword'] = [{
                                            required: false,
                                            message: '请输入',
                                            trigger: 'blur'
                                        }]
                                    }
                                    that.refrashForm = false
                                    that.$nextTick(()=>{
                                        that.refrashForm = true
                                    })
                                    that.$forceUpdate()
                                })
                            }
                        }
                        if(res.radioList){
                            this.radioList = res.radioList
                        }
                        if (res.hasRadio) {
                            this.hasRadio = res.hasRadio
                        }
                        if (res.radioIconImg) {
                            this.radioIconImg = res.radioIconImg
                        }
                        if (res.radioExplainImg) {
                            this.radioExplainImg = res.radioExplainImg
                        }
                        if (res.httpIconImg) {
                            this.httpIconImg = res.httpIconImg
                        }
                        if (res.httpExplainImg) {
                            this.httpExplainImg = res.httpExplainImg
                        }
                        if (res.applicableModelExplainImg) {
                            this.applicableModelExplainImg = res.applicableModelExplainImg
                        }
                        if (res.deviceModeInfoExplainImg) {
                            this.deviceModeInfoExplainImg = res.deviceModeInfoExplainImg
                        }
                        if (res.httpListenArr) {
                            this.httpListenArr = res.httpListenArr
                        }
                        console.log('httpListenArr', this.httpListenArr)
                    })
                }
            },
            getBrandList() {
                this.request(villageApi.getBrandList).then((res) => {
                    this.brandList = res;
                    // if(res.length>0){
                    //     this.cameraForm.brand_id = res[0].id
                    //     this.handleSelectChange(res[0].id, 'brand_id')
                    // }
                })
            },
            getDeviceType() {
                this.request(villageApi.getDeviceTypeList).then((res) => {
                    this.deviceTypeList = res;
                })
            },
            getCameraInfo(id, channelId = 0) {
                this.request(villageApi.getCameraInfo, {
                    camera_id: id, channelId: channelId,
                }).then((res) => {
                    for (let key in this.cameraForm) {
                        this.cameraForm[key] = res[key]
                        console.log(key+'<===key===>', res[key])
                    }
                    this.cameraForm.open_time = res.open_time_txt
                    this.cameraForm.camera_id = res.camera_id
                    if (res.synOverView) {
                        this.synOverView = res.synOverView
                    }
                    let that = this;
                    this.$nextTick(() => {
                        if (that.cameraForm.brand_id) {
                            that.handleSelectChange(that.cameraForm.brand_id, 'brand_id', 1)
                        }
                    })
                })
            },
            handleSubmit() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        if (this.cameraId) {
                            this.cameraForm.camera_id = this.cameraId
                        }
                        console.log('cameraForm===>', this.cameraForm)
                        
                        let params = {}
                        for(let key in this.cameraForm){
                            if(this.cameraForm[key]){
                                params[key] = this.cameraForm[key]
                            }
                        }
                        console.log('params===>', params)
                        
                        this.request(villageApi.addCameraDevice, params).then((res) => {
                            if (this.cameraId > 0) {
                                this.$message.success('编辑成功')
                            } else {
                                this.$message.success('添加成功')
                            }
                            this.$refs.ruleForm.resetFields();
                            this.confirmLoading = false
                            this.clearForm()
                            this.$emit('close', true);
                        }).catch((error) => {
                            this.confirmLoading = false
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleCancel() {
                this.clearForm()
                this.$emit('close')
            },
            getCurrentTime() {
                let yy = new Date().getFullYear();
                let mm = new Date().getMonth() + 1;
                let dd = new Date().getDate();
                let hh = new Date().getHours();
                let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
                let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
                this.cameraForm.open_time = yy + '-' + mm + '-' + dd;
            },
            goUrl(url) {
                if (!url) return
                window.open(url)
            }
        },
    }
</script>
<style lang="less" scoped>
    .form_con {
        display: flex;
        flex-wrap: wrap;
        .form_item {
            width: 31.5%;
            margin-left: 1.5%;
        }
        .form_item_tip {
            margin-left: 1.5%;
            .ant-form-item {
                margin-bottom: 0;
            }
        }
    }

    /deep/ .project_info .ant-form-item {
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }

    /deep/ .project_info .label_col {
        margin-right: 30px !important;
        font-weight: bold !important;
    }

    /deep/ .project_info .ant-form-item .ant-col-sm-13 {
        width: 100% !important;
    }

    /deep/ .project_info .ant-upload-picture-card-wrapper {
        width: 15% !important;
    }
</style>