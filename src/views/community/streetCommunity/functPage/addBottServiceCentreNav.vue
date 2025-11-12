<template>
    <a-modal :title="title" :width="950" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
        @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading" >
            <a-form :form="form">
                <a-form-item label="服务名称" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom: 15px;">
                    <a-col :span="18">
                        <a-input
                            v-decorator="['nav_name', {initialValue:detail.nav_name,rules: [{required: true, message: '请输入服务名称！'}]}]" />
                    </a-col>
                </a-form-item>
                <a-form-item label="上传图片" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom: 1px;">
                    <a-row>
                        <div>
                            <a-upload name="img" list-type="picture-card" class="avatar-uploader"
                                :show-upload-list="false" :action="upload_url" :before-upload="beforeUpload"
                                @change="handleChange">
                                <img v-if="imageUrl" :src="imageUrl" class="imgname" alt="img" />
                                <div v-else>
                                    <a-icon :type="loading ? 'loading' : 'plus'" />
                                    <div class="ant-upload-text">
                                        上传
                                    </div>
                                </div>
                            </a-upload>
                        </div>
                    </a-row>
                </a-form-item>
                <a-form-item label="链接地址" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom: 10px;">
                    <a-row>
                        <a-col :span="18">
                            <a-input
                                v-decorator="['nav_url', {initialValue:detail.nav_url}]" />
                        </a-col>
                        <a-col :span="6">
                            <a @click="$refs.createModal.FunctionLibrary()" style="margin-left: 10px;">从功能库中选择</a>
                        </a-col>
                    </a-row>
                </a-form-item>
                <a-form-item label="权限设置" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom: 10px;">
                    <a-radio-group v-decorator="['level_show',{initialValue:detail.level_show}]">
                        <a-radio :value="0">全部用户可见</a-radio>
                        <a-radio :value="1">仅党员可见（未登录用户不可见）</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="活动状态" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom: 10px;">
                    <a-switch checked-children="开启" un-checked-children="关闭"
                        v-decorator="['xstatus',{initialValue:detail.xstatus==1 ? true : false,valuePropName: 'checked'}]" />
                </a-form-item>
                <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom: 1px;">
                    <a-col :span="8">
                        <a-input-number v-decorator="['xsort',{initialValue:detail.xsort}]" :min="0" :max="99999"
                            :precision="0" :step="1" style="width:150px;" />
                    </a-col>
                    <a-col :span="6">
                        <a-tooltip placement="right">
                            <template slot="title">
                                <span>此值越大排序越靠前</span>
                            </template>
                            <a-button class="add-box-tip"><a-icon class="tip-txt" type="question" /></a-button>
                        </a-tooltip>
                    </a-col>
                </a-form-item>
                <!--内容-->
                <a-form-item label="" class="cont_box" style="margin-bottom: 10px;" >
                    <a-col :span="30">
                        <span class="box_width label_col">服务内容：</span>
                        <vue-ueditor-wrap v-model="detail.xcontent" :config="myConfig"></vue-ueditor-wrap>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
            </a-form>
        </a-spin>
        <function-library :height='800' :width="1200" ref="createModal" @ok="handleOk" />
    </a-modal>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import FunctionLibrary from '../visualization/FunctionLibrary.vue';
    import CustomTooltip from '@/components/CustomTooltip/CustomTooltip';
    import Editor from '@/components/Editor/WEditor';
    import VueUeditorWrap from 'vue-ueditor-wrap';
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    export default {
        name: 'addBottServiceCentreNav',
        components: {
            FunctionLibrary,
            CustomTooltip,
            Editor,
            VueUeditorWrap
        },
        data() {
            return {
                title: '添加服务',
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
                visible: false,
                confirmLoading: false,
                sortedInfo: null,
                form: this.$form.createForm(this),
                detail: {
                    id: 0,
                    nav_name: '',
                    img_url: '',
                    nav_url: '',
                    level_show: 0,
                    xstatus: 1,
                    xsort: 0,
                    xcontent:'',
                },
                idd:0,
                loading: false,
                imageUrl: '',
                upload_url: '/v20/public/index.php/' + streetCommunityApi.upload,
                img: '',
                cat_id:0,
                myConfig: {
                    enableAutoSave: false,
                    autoSyncData: false,
                    // 编辑器不自动被内容撑高
                    autoHeightEnabled: false,
                    // 初始容器高度
                    initialFrameHeight: 240,
                    // 初始容器宽度
                    initialFrameWidth: '100%',
                    // 上传文件接口
                    serverUrl: '/v20/public/static/UEditor/php/controller.php',
                    // UEditor 文件存放位置
                    UEDITOR_HOME_URL: '/v20/public/static/UEditor/',
                    toolbars: [
                        [
                            'source', //源代码
                            '|',
                            'fontfamily',//字体
                            'fontsize',//字号
                            '|',
                            'forecolor', //字体颜色
                            'backcolor', //背景色
                            'bold', //加粗
                            'italic',//斜体
                            'underline',//下划线
                            'removeformat',//清除格式
                            '|',
                            'justifyleft',//居左对齐
                            'justifycenter',//居中对齐
                            'justifyright',//居右对齐
                            'insertorderedlist', //有序列表
                            'insertunorderedlist',//无序列表
                            '|',
                            'emotion',//表情
                            'simpleupload',//单图上传
                            'insertvideo',
                            'fullscreen', //全屏
                        ]
                    ],
                },
            }
        },
        methods: {
            editBottNavigation(idd,cat_id) {
                this.visible = true;
                this.idd = idd;
                if (this.idd > 0) {
                    this.title = '编辑服务'
                } else {
                    this.title = '添加服务'
                }
                this.cat_id=cat_id;
                this.getEditInfo();
            },
            addBottNavigations(cat_id) {
                this.title = '添加服务';
                this.visible = true;
                this.detail = {
                    id: 0,
                    nav_name: '',
                    img_url: '',
                    nav_url: '',
                    level_show: 0,
                    xstatus: 1,
                    xsort: 0,
                    xcontent:'',
                };
                this.cat_id=cat_id;
                this.imageUrl = '';
            },
            tableChange(e) {
                if (e.current && e.current > 0) {
                    this.page = e.current;
                    this.getEditInfo()
                }
            },
            handleOk(url) {
                this.detail.nav_url = url;
            },
            cancel() {

            },
            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true
                validateFields((errors, values) => {
                    if (!errors) {
                        values.idd = this.idd;
                        values.img_url = this.img;
                        values.xstatus = values.xstatus ? 1:0;
                        values.xcontent = this.detail.xcontent;
                        values.cfrtype='serviceCentre';
                        values.cat_id=this.cat_id;
                        this.request(streetCommunityApi.addStreetServiceNav, values)
                            .then((res) => {
                                if (this.idd > 0) {
                                    this.$message.success('编辑成功')
                                } else {
                                    this.$message.success('添加成功')
                                }
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false
                                    this.confirmLoading = false
                                    this.idd = ''
                                    this.$emit('ok', values)
                                }, 1500)
                            })
                            .catch((error) => {
                                this.confirmLoading = false
                            })

                    } else {
                        this.confirmLoading = false
                    }
                })
            },

            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.idd = '0'
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.request(streetCommunityApi.getStreetServiceNavInfo, {
                        idd: this.idd,
                        'cat_id':this.cat_id,
                        'cfrtype':'serviceCentre',
                    })
                    .then((res) => {
                        this.detail = res.detail
                        this.img=this.detail.img_url
                        this.imageUrl = this.detail.img_url_full
                    }).catch((error) => {
                           
                    })
            },
            handleChange(info) {
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    // Get this url from response in real world.
                    getBase64(info.file.originFileObj, imageUrl => {
                        this.imageUrl = imageUrl;
                        this.loading = false;
                    });
                    if (info.file.response.status === 1000) {
                        this.img = info.file.response.data;
                    }
                }
            },
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    this.$message.error('You can only upload JPG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
            },
        },
    }
</script>
<style>
    /deep/ .ant-form-item{
        margin-bottom: 10px;
    }
    /deep/ .ant-form-item-control{
        line-height: 10px;
    }
    .avatar-uploader>.ant-upload {
        width: 120px;
        height: 120px;
    }

    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }

    .imgname {
        width: 80px;
    }
</style>