<template>
    <a-drawer :title="title" :visible="visible" :width="750" @close="resetForm" :body-style="{ paddingBottom: '80px' }">
        <a-form-model ref="ruleForm" :model="buildForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="绑定员工" prop="yuangong" extra="多选，不限制数量，绑定员工后，业主加好友时随机从其中选择">
                <a-select mode="multiple" placeholder="请选择员工" style="width: 240px"
                    @change="(value)=>handleSelectChange(value, 'yuangong')" :value="selectedItems">
                    <a-select-option v-for="(item, index) in filteredOptions" :value="item.name" :index="index">
                        {{item.name}}</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item :label="'绑定'+$store.getters.config.single_name" prop="is_kefu" :extra="'选择“是”选项，添加客服时只能选择'+$store.getters.config.single_name+'下的业主；选择“否”选项，添加客服时能选择'+$store.getters.config.single_name+'所有的业主'">
                <a-radio-group name="radioGroup" v-model="buildForm.is_kefu">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="0">否</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="欢迎语" prop="welcome_tip" extra="变量填写规则（可对应复制到填写内容）：{姓名} {手机号}">
                <a-textarea style="padding: 5px width:200px; height: 100px; resize:none;" placeholder="请输入欢迎语"
                    v-model="buildForm.welcome_tip" />
            </a-form-model-item>
            <a-form-model-item label="企业微信服务群二维码">
                <a-upload name="reply_pic" :multiple="false" :action="uploadUrl" :data="uploadParams" :before-upload="beforeUpload" :showUploadList="false"
                    :headers="headers" @change="(info)=>handleUploadChange(info, 'qycode')">
                    <a-button :loading="qyimgLoading">上传二维码</a-button>
                    <a-button type="link" v-if="ercodeUrl" @click.stop="lookCode()">查看二维码</a-button>
                    <a-button type="link" @click.stop="lookHelp">点击可查看使用帮助</a-button>
                </a-upload>
            </a-form-model-item>
            <a-form-model-item label="装修" prop="zhuangxiu">
                <template slot="extra">
                    1、无需装修：将直接使用二维码自带的模板样式</br>
                    2、系统默认模板：将直接使用我们提供的模板样式，可选择查看样式</br>
                    3、上传模板：需要自行设计好模板后上传，尺寸：750*1334；注意：模板左下角需距离页面边缘间距20像素预留100*100像素的空白位置，用于放置群二维码
                </template>
                <a-select placeholder="请选择装修" style="width: 240px" v-model="buildForm.template_type"
                    @change="(value)=>handleSelectChange(value, 'zhuangxiu')">
                    <a-select-option v-for="(item, index) in repaireList" :value="item.id" :index="index">{{item.name}}</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item v-if="buildForm.template_type == 2" label="上传模板" prop="template_url" extra="尺寸：750*1334；注意：模板左下角需距离页面边缘间距20像素预留100*100像素的空白位置，用于放置群二维码">
                <a-upload name="reply_pic" :multiple="false" :action="uploadUrl" :data="uploadParams" :before-upload="beforeUpload" :showUploadList="false"
                    :headers="headers" @change="(info)=>handleUploadChange(info, 'template')">
                    <a-button :loading="temimgLoading">上传模板</a-button>
                    <a-button type="link" v-if="imageUrl" @click.stop="previewImage()">查看图片</a-button>
                </a-upload>
            </a-form-model-item>
            <a-form-model-item v-if="effect_img" label="效果预览">
                <img style="width: 260px;" :src="effect_img" @click.stop="lookEffectImg()">
            </a-form-model-item>
        </a-form-model>

        <a-modal title="效果预览" :width="500" :visible="effectImgVisible" @cancel="handleEffectImgCancel" :footer="null">
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                <img preview="1" style="width: 400px;" :src="effect_img">
            </div>
        </a-modal>

        <a-modal title="查看二维码" :width="350" :visible="erCodeVisible" @cancel="handleCodeCancel" :footer="null">
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                <img preview="1" style="width: 150px;" :src="ercodeUrl">
            </div>
        </a-modal>
        
        <a-modal title="预览图片" :width="350" :visible="previewVisible" @cancel="handlePreviewCancel" :footer="null">
            <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                <img preview="2" style="width: 150px;" :src="imageUrl">
            </div>
        </a-modal>

        <div :style="{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }">
            <a-button style="marginRight: 8px" @click="resetForm">
                关闭
            </a-button>
            <a-button :loading="confirmLoading" type="primary" @click="onSubmit">
                保存
            </a-button>
        </div>
    </a-drawer>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        watch,
        reactive,
        computed,
        onMounted,
        defineComponent
    } from '@vue/composition-api';
    import villageNew from "@/api/community/village/villageNewApi";
    import store from '@/store';
    export default defineComponent({
        props: {
            title: {
                type: String,
                default: ''
            },
            visible: {
                type: Boolean,
                default: false
            },
            single_id: {
                type: [String, Number],
                default: 0
            }
        },
        setup(props, context) {
            //二维码部分
            const handleCodeCancel = () => {
                erCodeVisible.value = false
            }
            const lookCode = () => {
                erCodeVisible.value = true
            }
            const handleEffectImgCancel = () => {
                effectImgVisible.value = false
            }
            const lookEffectImg = () => {
                effectImgVisible.value = true
            }
            let ercodeUrl = ref('')
            let erCodeVisible = ref(false)
            let effectImgVisible = ref(false)
            let qyhelpUrl = ref('')
            let effect_img = ref('')
            
            //上传图片部分
            const headers = reactive({
                authorization: 'authorization-text'
            })
            const uploadUrl = ref('/v20/public/index.php/common/common.UploadFile/uploadImg')
            const uploadParams = reactive({
                upload_dir: 'village'
            }) 
            
            let previewVisible = ref(false)
            const handlePreviewCancel = ()=>{
                previewVisible.value = false
            }
            
            let imageUrl = ref('')
            let qyimgLoading = ref(false)
            let temimgLoading = ref(false)
            
            const handleUploadChange = (info, type)=>{
                if (info.file.status === 'uploading') {
                    if(type == 'qycode'){
                        qyimgLoading.value = true;
                    } else {
                        temimgLoading.value = true
                    }
                    return;
                }
                
                if (info.file.status === 'error') {
                    Vue.prototype.$message.error('上传失败!');
                    if(type == 'qycode'){
                        qyimgLoading.value = true;
                    } else {
                        temimgLoading.value = true
                    }
                    return;
                }
                
                if (info.file.status === 'done') {
                    if(type == 'qycode'){
                        ercodeUrl.value = info.file.response.data.full_url
                        buildForm.value.qy_qrcode = info.file.response.data.image
                        qyimgLoading.value = false;
                    } else {
                        imageUrl.value = info.file.response.data.full_url
                        buildForm.value.template_url = info.file.response.data.image
                        temimgLoading.value = false
                    }
                }
            }
            
            const beforeUpload=(file, res)=> {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    Vue.prototype.$message.error('You can only upload JPG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    Vue.prototype.$message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
            }
            
            const previewImage = (type) => {
                previewVisible.value = true
            }
            
            //选择员工
            let userList = ref([])
            let selectedItems = ref([])
            const filteredOptions = computed({
                get: () => {
                    return userList.value.filter(o => !selectedItems.value.includes(o));
                }
            })

            //装修
            let repaireList = ref([{
                name: '无需装修',
                id: 0
            }, {
                name: '系统默认模板',
                id: 1
            }, {
                name: '上传模板',
                id: 2
            }])

            //查看帮助pdf
            const lookHelp = () => {
                window.open(qyhelpUrl.value)
            }

            //点击确定Loadding
            let confirmLoading = ref(false)
            //表单对象
            let buildForm = ref({})
            //表单规则对象
            const rules = reactive({
                is_kefu: [{
                    required: true,
                    message: '请选择是否绑定'+store.getters.config.single_name,
                    trigger: 'blur'
                }],
                welcome_tip: [{
                    required: true,
                    message: '请输入欢迎语',
                    trigger: 'blur'
                }]
            })
            //表单规则ref
            let ruleForm = ref()
            //表单布局
            const labelCol = ref({
                span: 6
            })
            const wrapperCol = ref({
                span: 16
            })
            
            //表单保存
            const onSubmit = () => {
                ruleForm.value.validate(valid => {
                    if (valid) {
                        if (selectedItems.length == 0) {
                            Vue.prototype.$message.warn('请选择绑定员工！')
                            return
                        }
                        saveForm()
                    }
                })
            }

            //表单重置
            const resetForm = () => {
                context.emit('closeDrawer')
                buildForm.value = {}
                imageUrl.value = ''
                ercodeUrl.value = ''
                effect_img.value = ''
                ruleForm.value.resetFields();
                selectedItems.value=[];
            }

            //表单保存
            const saveForm = () => {
                confirmLoading.value = true;
                let postData=buildForm.value;
                postData.single_id=props.single_id;
                Vue.prototype.request(villageNew.saveBuildingButler,postData).then((res) => {
                    confirmLoading.value = false
                    resetForm()
                    Vue.prototype.$message.success('保存成功！')
                }).catch(e=>{
                    confirmLoading.value = false
                })
            }

            //获取表单详情
            const getBuildInfo = (single_id) => {
                Vue.prototype.request(villageNew.getBuildingButler, {
                    single_id,
                }).then((res) => {
                    selectedItems.value=[];
                    buildForm.value={};
                    if(res.buldingButler){
                        buildForm.value = res.buldingButler
                        selectedItems.value = res.buldingButlerBindList.map(v=>{
                            return v.name
                        })
                        ercodeUrl.value = res.buldingButler.qy_qrcode
                        buildForm.value.template_url =  res.buldingButler.template_url
                        imageUrl.value = res.buldingButler.template_url
                        effect_img.value = res.buldingButler.effect_img
                        buildForm.value.work_arr = res.buldingButler.work_arr.split(',')
                    }
                    if(res.buldingButlerList){
                        userList.value = res.buldingButlerList
                    }
                    qyhelpUrl.value = res.qyhelp_url
                })
            }

            //选择框change事件
            const handleSelectChange = (value, type) => {
                if (type == 'yuangong') {
                    selectedItems.value = value;
                    let arr = []
                    value.map(item=>{
                        userList.value.map(v=>{
                            if(item == v.name){
                                arr.push(v.wid)
                            }
                        })
                    })
                    buildForm.value.work_arr = arr
                }

                if (type == 'zhuangxiu') {
                    buildForm.value.template_type = value
                    if (value == 1 && buildForm.value.qy_qrcode) {
                        services_look_img();
                    } else if (value == 2 && buildForm.value.qy_qrcode && buildForm.value.template_url){
                        services_look_img();
                    } else {
                        buildForm.value.effect_img = ''
                        effect_img.value = ''
                    }
                }
            }


            const services_look_img = () => {
                let template_type = buildForm.value.template_type;
                if (0 == template_type || !template_type) {
                    return
                }
                if (! buildForm.value.qy_qrcode) {
                    Vue.prototype.$message.warn('请上传企业微信群二维码！')
                    return
                }
                if (2 == template_type && ! buildForm.value.template_url) {
                    Vue.prototype.$message.warn('请上传对应模板！')
                    return
                }
                
                Vue.prototype.request(villageNew.servicesImgPreview, {
                    template_type: template_type,
                    qy_qrcode: buildForm.value.qy_qrcode,
                    template_url: buildForm.value.template_url,
                }).then((res) => {
                    console.log('services_look_img',res);
                    if (res.data) {
                        var file_path = res.data.file_path;
                        var file = res.data.file;
                        buildForm.value.effect_img = file
                        effect_img.value = file_path
                    }
                })
            }

            //监听父组件传的visible
            watch(() => props.visible, (val) => {
                if (val) {
                    getBuildInfo(props.single_id)
                }
            }, {
                deep: true
            })

            return {
                confirmLoading,
                onSubmit,
                resetForm,
                buildForm,
                labelCol,
                wrapperCol,
                rules,
                saveForm,
                ruleForm,
                userList,
                repaireList,
                handleSelectChange,
                filteredOptions,
                selectedItems,
                lookHelp,
                lookCode,
                handleCodeCancel,
                ercodeUrl,
                erCodeVisible,
                getBuildInfo,
                qyhelpUrl,
                headers,
                uploadUrl,
                uploadParams,
                imageUrl,
                qyimgLoading,
                temimgLoading,
                beforeUpload,
                handleUploadChange,
                previewImage,
                previewVisible,
                handlePreviewCancel,
                services_look_img,
                effect_img,
                effectImgVisible,
                handleEffectImgCancel,
                lookEffectImg,
            }
        }
    })
</script>

<style lang="less" scoped>
    /deep/ textarea {
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
</style>
