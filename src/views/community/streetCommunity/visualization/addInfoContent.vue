<template>
    <a-modal :title="title" :width="1100"  :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading" >
            <a-form :form="form" >
                <!--活动名称-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">公告名称</span>
                        <a-input
                                :maxLength="100"
                                style="width: 300px"
                                placeholder="请填写公告名称"
                                v-decorator="['xtitle',{ initialValue: detail.xtitle,rules: [{ required: true, message: L('请填写公告名称！') }] }]"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                
                <!--活动状态-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ">公告状态</span>
                        <a-radio-group name="status" v-model="detail.status">
                            <a-radio :value="1">
                                开启
                            </a-radio>
                            <a-radio :value="0">
                                关闭
                            </a-radio>
                        </a-radio-group>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--排序-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col">排序</span>
                        <a-input-number
                                :min="0" :max="9999999"
                                v-decorator="['xsort',{ initialValue: detail.xsort}]"
                                placeholder="请填写排序值，越大越靠前"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--内容-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" class="cont_box">
                    <a-col :span="30">
                        <span class="box_width label_col"><span style="color: red;">*</span>公告内容</span>
                        <vue-ueditor-wrap v-model="detail.xcontent" :config="myConfig"></vue-ueditor-wrap>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>
<style lang="less" scoped>

    /deep/ .cont_box .ant-form-item-control{
        line-height: 25px !important;
    }

    /deep/ .ant-form-item{
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }
    /deep/ .label_col{
        margin-right: 30px !important;
        font-weight: bold !important;
    }
    /deep/ .box_width{
        display: inline-block;
        width: 97px !important;
    }
    /deep/ .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }
    /deep/ .ant-select{
        width: 300px !important;
    }
    /deep/ .ant-input-number{
        width: 300px !important;
        display: inline-block;
    }
    /deep/ .adress_box{
        padding: 5px;color: white;background: #87B87F;margin-left: 5px;border-radius:5px;cursor: pointer
    }
    /deep/ .times_but{
        font-size: 24px;font-weight: bold;cursor: pointer;display: inline-block;
    }
    /deep/ .el-date-editor{
        margin-right: 5px !important;
    }
    /deep/ .time_box{
        display: inline-block;
        margin-bottom: 5px !important;
    }
    /deep/ .set_time{
        display: inline-block;margin-left: 30px !important;
    }
    /deep/ .time_right{
        display: inline-block;width: 80% !important;margin-left: 1px !important;position: relative;
    }
    /deep/ .ant-upload-list{
        margin-bottom: 0 !important;
    }

</style>
<script>
    import moment from 'moment';
    import villageApi from '@/api/community/village';
    import CustomTooltip from '@/components/CustomTooltip/CustomTooltip'
    import configStreetCommunityApi from '@/api/community/streetCommunity'
    import Editor from '@/components/Editor/WEditor';
    import VueUeditorWrap from 'vue-ueditor-wrap'
    export default {
        name: 'addInfoContent',
        components: {
            CustomTooltip,
            Editor,
            VueUeditorWrap
        },
        data() {
            return {
                title: '添加公告',
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
                confirmLoading: false,
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                uploadImgUrl: '/v20/public/index.php'+villageApi.venueActivityUpload,
                detail:{
                    'xtitle': '',
                    'xcontent': '',
                    'xsort': '',
                    'status':1,
                },
                idd:0,
                fileList:[],
                previewImage: '',
                previewVisible: false,
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
                content: '',
            }
        },
        watch:{
            // content(val){
            //     this.$set(this.detail, 'content',val)
            // }
        },
        mounted() {
        },
        methods: {
            moment,
            //添加
            add() {
                this.title = '添加公告';
                this.fileList = [];
                this.detail = {
                    'xtitle': '',
                    'xcontent': '',
                    'xsort': '',
                    'status':1,
                };
                this.idd=0;
                this.visible = true;
                this.loading = true;
            },
            //编辑
            edit(idd) {
                let _this = this;
                this.idd=idd;
                _this.visible = true;
                _this.confirmLoading = true;
                this.request('/community/street_community.Visualization/getStreetInfoContent',{ idd: idd }).then((res) => {
                    if (res && res.detail) {
                        _this.confirmLoading = false;
                        _this.detail = res.detail;
                        _this.title = '编辑公告【'+res.detail.xtitle+'】';
                    }
                    _this.$forceUpdate()
                }).catch((error) => {
                        this.confirmLoading = false;
                })
            },

            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this;

                validateFields((errors, values) => {
                    if (!errors) {
             
                        const indexParams = { ...values }
                        indexParams.idd=this.idd;
                        if (!indexParams.xtitle) {
                            this.$message.warning('请填写公告名称！')
                            return false;
                        }
                        indexParams.status = this.detail.status;
                        indexParams.xcontent = this.detail.xcontent;
                        if (!indexParams.xcontent) {
                            this.$message.warning('请填写公告内容！')
                            return false;
                        }
                        this.confirmLoading = true;
                        this.request('/community/street_community.Visualization/addStreetInfoContent',indexParams).then((res) => {
                            if (this.idd) {
                                this.$message.success('编辑成功')
                            } else {
                                this.$message.success('添加成功')
                            }
                            setTimeout(() => {
                                this.form = this.$form.createForm(this);
                                this.visible = false;
                                this.confirmLoading = false;
                                this.$emit('ok')
                            }, 1500)
                        }).catch((error)=>{
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
                    this.idd = 0
                    this.form = this.$form.createForm(this)
                }, 500)
            },
        },
    }
</script>

<style scoped>
    >>>.ant-time-picker{
        width: 160px;
    }
    /deep/ .tip{
        margin: 0 10px;
    }
    /deep/ .times_but{
        margin-left: 10px;
    }
</style>
