<template>
     <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="标题">
            <a-input v-model="form.name"/>
        </a-form-model-item>

        <a-form-model-item label="有效期">
            <a-radio-group v-model="form.qrcode_type" :disabled="qrcodeTypeDisabled">
                <a-radio value="0">
                永久
                </a-radio>
                <a-radio value="1">
                临时
                </a-radio>
            </a-radio-group>
            <div class="ant-form-explain" style="margin:5px auto" v-if="form.qrcode_type == '0'">永久二维码，是无过期时间的，但数量较少（目前为最多10万个）。</div>
            <div class="ant-form-explain" style="margin:5px auto" v-else>临时二维码，是有过期时间的，最长可以设置30天后过期，但能够生成较多数量。</div>
            <div v-if="form.qrcode_type == 1">
                <a-input-number v-model="form.days" :min="1" :max="30" :disabled="qrcodeTypeDisabled"/> &nbsp;天
            </div>
        </a-form-model-item>

        <a-form-model-item label="回复内容">
            <a-radio-group v-model="form.reply_type">
                <a-radio value="0">
                文字内容
                </a-radio>
                <a-radio value="1">
                图文消息
                </a-radio>
            </a-radio-group>
        </a-form-model-item>

        <a-form-model-item label="文字内容" v-if="form.reply_type == 0">
            <a-input v-model="form.content" type="textarea" />
        </a-form-model-item>


        <div v-else>
        <a-form-model-item label="图文消息标题">
            <a-input v-model="form.title"/>
        </a-form-model-item>

        <a-form-model-item label="图文消息描述">
            <a-input v-model="form.des"  type="textarea" />
        </a-form-model-item>
        <a-form-item label="图文消息图片" help="支持JPG、PNG格式，较好的效果为大图360*200，小图200*200。图片最大不超过2M">
            <a-input hidden v-model="form.img"></a-input>
            <a-upload
                name="pic"
                list-type="picture-card"
                :data="uploadDir"
                :action="uploadApi"
                :file-list="fileList"
                @preview="handlePreview"
                @change="handleChange"
                :before-upload="beforeUpload"
            >
            <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                上传
                </div>
            </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
        </a-form-item>

        <a-form-model-item label="图文消息链接">
            <a-input v-model="form.url"/>
            <a @click="getLinkUrl" style="float:right">{{ L('链接库选择') }}</a>
        </a-form-model-item>
        </div>

        <div style="padding-left:16.66%">
            <a-button type="primary" @click="submit">立即提交</a-button>
            <a-button style="margin-left:1rem" @click="cancel">取消</a-button>
        </div>
     </a-form-model>
     
</template>

<script>
import channelCodeApi from '@/api/channel_code/index'

export default {
    name: "addChannelCode",
    props: {
        // 存放路径
        channel_id: {
            type: [String, Number],
            default: '0',
        },
    },
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            qrcodeTypeDisabled:false,
            form: {
                type_id:0,
                name: '',
                qrcode_type:'0',  //二维码类型  0：永久  1：临时
                days:1,
                reply_type:'1',  //回复类型  0：文字内容  1：图文内容
                content:'', //文字内容回复
                title:'', //图文标题
                des:'', //图文描述
                img:'', //图文图片
                url:'' //图文跳转地址
            },
            uploadApi:"/v20/public/index.php/common/common.UploadFile/uploadPic",
            uploadDir:{type:'channel_code'},
            previewVisible: false,
            previewImage: '',
            fileList: [],
        }
    },
    
    mounted() {
        if(this.$props.channel_id > 0){
            this.getDetail();
            this.qrcodeTypeDisabled = true
        }
    },
    methods: {
        getDetail(){
            this.request(channelCodeApi.platformDetail, {chanel_id:this.$props.channel_id}).then((res) => {
                this.form.type_id = res.type_id
                this.form.name= res.name
                this.form.qrcode_type= res.qrcode_type.toString()
                if(res.days > 0){
                    this.form.days= res.days
                }
                this.form.reply_type= res.reply_type.toString()
                this.form.content= res.content
                this.form.title= res.title
                this.form.des= res.des
                this.form.img= res.img
                this.form.url= res.url
                this.previewImage = res.img_preview
                if(this.previewImage){
                    this.fileList = [
                        {
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: res.img_preview,
                        }
                    ]
                }
            })
        },
        beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传图片最大不能超过2M');
            }
            return isLt2M;
        },
        handleCancel() {
            this.previewVisible = false;
        },
        async handlePreview(file) {
            if (!file.url && !file.preview) {
                file.preview = file.response.data.url;
            }
            this.previewImage = file.url || file.preview;
            this.previewVisible = true;
        },
        handleChange({ fileList }) {
            this.fileList = fileList;
            var len = 0;
            if (this.fileList[len].status == 'done') {
                this.form.img = this.fileList[len].response.data.path;
            }
        },
        cancel(){
            this.$emit('cancel');
        },
        submit(){
            console.log(this.form)
            this.form.chanel_id = this.$props.channel_id;
            var api = channelCodeApi.platformAdd;
            if(this.form.chanel_id > 0){
                api = channelCodeApi.platformEdit;
            }
            this.request(api, this.form).then((res) => {
                this.$emit('cancel');
                this.$emit('refresh');
            })
        },

        getLinkUrl() {
            this.$LinkBases({
                source: this.$store.state.customPage.sourceInfo.source, // 必填
                type: 'h5', // 必填
                source_id: this.$store.state.customPage.sourceInfo.source_id,
                // 确定按钮
                handleOkBtn: (res) => {
                    // 点击按钮事件
                    this.$nextTick(() => {
                        //链接库动态赋值
                        this.form.url = res.url;
                    })
                },
            })
        },
    },
}
</script>

<style scoped>
.mb-0 {
    margin-bottom: 0;
}
</style>
