<template>
    <a-modal :title="title" :width="940" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit"
             @cancel="handleCancelModel">
        <a-spin :spinning="confirmLoading">
            <a-form :form="form" style="max-height: 600px; overflow-y: scroll">
                <a-form-item label="员工卡名称" :labelCol="labelCol" :wrapperCol="wrapperCol" required="true">
                    <a-input
                            placeholder="请输入员工卡名称"
                            v-model="formData.name"
                    />
                </a-form-item>

                <a-form-item label="背景颜色" :labelCol="labelCol" :wrapperCol="wrapperCol" required="true">
                    <a-input
                            placeholder="请输入背景颜色"
                            v-model="formData.bg_color"
                    />
                </a-form-item>

              <!--  <a-form-item label="积分抵扣金额比例" :labelCol="labelCol" :wrapperCol="wrapperCol" required="true">
                    <a-input-number
                            style="width:410px;"
                            placeholder="请输入积分抵扣金额比例"
                            v-model="formData.score_percent"
                    />
                </a-form-item>-->


                <a-form-item label="背景图" :labelCol="labelCol" :wrapperCol="wrapperCol" required="true">
                    <a-row>
                        <a-input hidden v-model="formData.bg_image"></a-input>
                        <template>
                            <div class="clearfix">
                                <a-upload
                                        :action="action"
                                        :name="uploadName"
                                        :data="{ upload_dir: upload_dir}"
                                        list-type="picture-card"
                                        :file-list="fileList"
                                        @preview="handlePreview"
                                        @change="handleChange"
                                >
                                    <a-icon type="plus"/>
                                    <div class="ant-upload-text">
                                        上传图片
                                    </div>
                                </a-upload>
                                <a-modal :visible="previewVisible" :footer="null"
                                         @cancel="handleCancel">
                                    <img alt="example" style="width: 100%" :src="previewImage"/>
                                </a-modal>
                            </div>
                        </template>
                    </a-row>
                </a-form-item>

                <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" required="true">
                    <a-switch checked-children="开" un-checked-children="关" :checked="formData.status == 1? true: false" @change="isStatusChange" />
                </a-form-item>

                <a-form-item
                        label="会员权益"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        required
                >
                    <vue-ueditor-wrap :config="ueConfig"
                                      v-model="formData.description"></vue-ueditor-wrap>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>

</template>

<script>
    import lifeToolsMerchantApi from '@/api/life_tools/merchant/index'
    import VueUeditorWrap from 'vue-ueditor-wrap';
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        })
    }
    export default {
        name: "editEmployeeCard",
        props: {
            // 存放路径
            upload_dir: {
                type: String,
                default: '',
            },
        },
        components: {VueUeditorWrap},
        data() {
            return {
                title: '添加商家员工卡',
                formData: {//表单数据
                    card_id: 0,//ID'
                    name: "",// '员工卡名称'
                    description: "",//'会员权益'
                    bg_image: "",//背景图'
                    bg_color: "",//'背景颜色'
                    status: 1,// '状态'
                },
                visible: false,
                previewVisible: false,
                confirmLoading:false,
                previewImage: '',
                fileList: [],//大图
                action: '/v20/public/index.php/common/common.UploadFile/uploadPictures',
                uploadName: 'reply_pic',
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 7
                    }
                },
                wrapperCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 13
                    }
                },
                ueConfig: {
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 300,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
                    // serverUrl: 'http://35.201.165.105:8000/controller.php',
                    // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
                    // 上传文件接口
                    serverUrl: '/v20/public/static/UEditor/php/controller.php',
                    // UEditor 文件存放位置
                    UEDITOR_HOME_URL: '/v20/public/static/UEditor/',
                    toolbars: [[
                        'fullscreen', 'source', '|', 'undo', 'redo', '|',
                        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                        'directionalityltr', 'directionalityrtl', 'indent', '|',
                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify'
                    ]]
                }

            }
        },
        methods: {
            edit(id){
                this.request(lifeToolsMerchantApi.editCard, {card_id:id}).then((res) => {
                    Object.assign(this.$data, this.$options.data.call(this))
                    this.confirmLoading=false
                    this.visible=true
                    this.fileList = []
                    if(res.card_id){
                        if (res.bg_image) {
                            let param = {
                                uid: 'logo',
                                name: 'logo_1',
                                status: 'done',
                                url: res.bg_image
                            }
                            this.fileList.push(param)
                        }
                    }
                    this.$set(this, 'formData', res)
                })
            },
            add() {
                this.visible=true
                this.formData={//表单数据
                    name: "",// '员工卡名称'
                    description: "",//'会员权益'
                    bg_image: "",//背景图'
                    bg_color: "",//'背景颜色'
                    status: 1,// '状态'
                }
                this.$set(this, 'formData', this.formData)
            },
            isStatusChange(value) {
                this.formData.status = value ? 1 : 0;
            },
            async handlePreview(file) {
                if (!file.url && !file.preview) {
                    file.preview = await getBase64(file.originFileObj);
                }
                this.previewImage = file.url || file.preview;
                this.previewVisible = true;
            },
            handleChange({fileList}) {
                this.fileList = fileList
                if (fileList.length > 0) {
                    let len = fileList.length - 1
                    if (this.fileList[len].status == 'done') {
                        this.formData.bg_image = this.fileList[len].response.data
                        this.fileList[0].uid = 'logo'
                        this.fileList[0].name = 'logo_1'
                        this.fileList[0].status = 'done'
                        this.fileList[0].url = this.fileList[len].response.data
                        if (fileList.length > 1) {
                            this.fileList.splice(0, len);
                        }
                    }

                } else {
                    this.formData.bg_image = ""
                }
            },
            handleCancel() {
                this.previewVisible = false
            },
            handleSubmit(){
                if(this.formData.name==""){
                    this.$message.error('员工卡名称必填')
                    return false;
                }

                if(this.formData.description==""){
                    this.$message.error('会员权益必填')
                    return false;
                }

                if(this.formData.bg_image==""){
                    this.$message.error('背景图必填')
                    return false;
                }
                this.request(lifeToolsMerchantApi.saveCard, this.formData).then((res) => {
                    this.$message.success('成功')
                    this.visible=false
                    this.$emit('getSportList')
                })
            },
            handleCancelModel(){
                this.visible=false
                this.$emit('getSportList')
            },
        }
    }
</script>

<style scoped>
   >>> .ant-upload-list-picture-card-container {
        float: left;
        width: 104px;
        height: 104px;
        margin: 10px 8px 8px 0;
    }
</style>