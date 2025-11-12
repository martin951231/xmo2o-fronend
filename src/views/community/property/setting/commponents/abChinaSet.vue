<template>
    <div class="paramiter_set">
<!--        <a-alert message="提示信息" type="info">-->
<!--            <template slot="description">-->
<!--                <div class="desc_item">1、四舍五入：在设置保留的小数位基础上进行四舍五入的方法统计费用。</div>-->
<!--                <div class="desc_item">2、全舍：保留了设置的小数位后，其余的小数全舍。</div>-->
<!--                <div class="desc_item">3、当后台设置保留四位小数、三位小数、两位小数时，用户端，只展示两个数;当后台设置保留一位小数时，按照设置的值展示一个数</div>-->
<!--                <div class="desc_item">4、预缴账单支付30分钟不缴费自动作废，和始终不作废两种模式</div>-->
<!--            </template>-->
<!--        </a-alert>-->
        <a-form-model ref="ruleForm" :model="parameterSetForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-model-item label="缴费链接" prop="pay_url" extra="填写农行缴费链接后，社区生活缴费支付会跳转至农行缴费">
                <a-input class="form_width" v-model="parameterSetForm.pay_url" />
            </a-form-model-item>
            <a-form-model-item label="商户编号" prop="merchant_id" extra="缴费项目配置的主商户在商E付系统的商户编号">
                <a-input class="form_width" v-model="parameterSetForm.merchant_id" />
            </a-form-model-item>
            <a-form-model-item label="缴费项目编号" prop="merchant_id" extra="缴费项目在缴费中心的编号">
                <a-input class="form_width" v-model="parameterSetForm.epay_code" />
            </a-form-model-item>
            <a-form-model-item label="私钥密码" prop="abchina_prikey" extra="">
                <a-input class="form_width" v-model="parameterSetForm.abchina_prikey" />
            </a-form-model-item>
            <a-form-model-item label="商户证书" prop="merchant_pfx" extra="">
                <a-upload
                    name="file"
                    :multiple="false"
                    :data="{ upload_dir: 'file/abchina'}"
                    action="/v20/public/index.php/common/common.UploadFile/uploadFile"
                    :before-upload="beforeUpload"
                    :file-list="fileList"
                    @change="handleChange"
                >
                    <a-button> <a-icon type="upload" /> Click to Upload </a-button>
                </a-upload>
            </a-form-model-item>
            <a-form-model-item label="农行公钥证书" prop="trust_pay_cer" extra="">
                <a-upload
                    name="file"
                    :multiple="false"
                    :data="{ upload_dir: 'file/abchina'}"
                    action="/v20/public/index.php/common/common.UploadFile/uploadFile"
                    :before-upload="beforeUploadCer"
                    :file-list="fileListCer"
                    @change="handleChangeCer"
                >
                    <a-button> <a-icon type="upload" /> Click to Upload </a-button>
                </a-upload>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 2 }">
                <a-button type="primary" @click="onSubmit">提交</a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>

<script>
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    import propertyApi from '@/api/community/property/packages';
    export default {
        name: 'parameterSet',
        data() {
            return {
                labelCol: {
                    span: 2
                },
                wrapperCol: {
                    span: 14
                },
                rules: {
                    type: [{
                        required: true,
                        message: '请选择保留方式',
                        trigger: 'blur'
                    }],
                    other_digit: [{
                        required: true,
                        message: '请输入其他小数位数',
                        trigger: 'blur'
                    }],
                    meter_digit: [{
                        required: true,
                        message: '请输入水电燃小数位数',
                        trigger: 'blur'
                    }],
                    deleteBillMin: [{
                        required: true,
                        message: '请选择预缴账单作废',
                        trigger: 'blur'
                    }],
                },
                parameterSetForm: {},
                fileList:[],
                fileListCer:[]
            }
        },
        mounted(){
            this.getConfig()
        },
        methods: {
            getConfig(){
                this.request(propertyApi.setAbChina).then((res) => {
                    this.parameterSetForm = res;
                    this.fileList = [];
                    this.fileListCer = [];
                    this.fileList.push({
                        uid: 1,
                        name: res.merchant_pfx,
                        url: '',
                        response: 'Server Error 500',
                        status: "done"
                    });
                    this.fileListCer.push({
                        uid: 2,
                        name: res.trust_pay_cer,
                        url: '',
                        response: 'Server Error 500',
                        status: "done"
                    });
                })
            },
            
            onSubmit() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                       this.request(propertyApi.editAbChina, this.parameterSetForm).then((res) => {
                           this.$message.success('保存成功！')
                           this.getConfig()
                       }) 
                    }
                });
            },
            handleChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    this.parameterSetForm.merchant_pfx=info.file.response.data;
                    this.$message.success(`${info.file.name} 商户证书 上传成功`);
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} 商户证书 上传失败`);
                }
            },
            handleChangeCer(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    this.parameterSetForm.trust_pay_cer=info.file.response.data;
                    this.$message.success(`${info.file.name} 农行公钥证书 上传成功`);
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} 农行公钥证书 上传失败`);
                }
            },
            beforeUpload(file) {
                //只要最后一个文件
                this.fileList = [...this.fileList, file].slice(-1);
                return true;
            },
            beforeUploadCer(file) {
                //只要最后一个文件
                this.fileListCer = [...this.fileListCer, file].slice(-1);
                return true;
            },
        },
    }
</script>

<style lang="less" scoped>
    .paramiter_set{
        .form_width{
            width: 300px;
        }
    }
    
    /deep/ .ant-alert{
        width: 60%;
    }
    
    /deep/ .ant-form label {
        width: 90px;
    }
</style>
