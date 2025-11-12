<template>
    <a-modal :title="title" :width="900"  :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading" >
            <a-form :form="form" >
                <!--活动名称-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">活动名称</span>
                        <a-input
                                :maxLength="100"
                                style="width: 300px"
                                placeholder="请填写活动名称"
                                v-decorator="['active_name',{ initialValue: detail.active_name,rules: [{ required: true, message: L('请填写活动名称！') }] }]"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--上传图片-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col">上传图片</span>
                        <a-upload
                                accept=".png,.jpg,.jpeg"
                                style="width: 84% !important;"
                                name="img"
                                :action="uploadImgUrl"
                                list-type="picture-card"
                                :file-list="fileList"
                                @preview="handlePreview"
                                @change="handleChange"
                        >
                            <div v-if="fileList.length < 5">
                                <a-icon type="plus" />
                                <div class="ant-upload-text">
                                    上传
                                </div>
                            </div>
                        </a-upload>
                        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel2">
                            <img alt="example" style="width: 100%" :src="previewImage" />
                        </a-modal>
                        <span style="color: red;margin-left: 16% !important;">建议尺寸：640*238px，最多上传5张</span>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--活动内容-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" class="cont_box">
                    <a-col :span="30">
                        <span class="box_width label_col">活动内容</span>
                        <vue-ueditor-wrap v-model="detail.richText" :config="myConfig"></vue-ueditor-wrap>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--活动时间-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" class="cont_box">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">活动时间</span>
                        <a-date-picker
                                :format="dateFormat"
                                placeholder="开始时间"
                                :value="date_moment(detail.start_time, dateFormat)"
                                @change="startOnChange"
                        >
                            <a-icon slot="suffixIcon" type="calendar" />
                        </a-date-picker>
                        <a-date-picker
                                :format="dateFormat"
                                placeholder="结束时间"
                                :value="date_moment(detail.end_time, dateFormat)"
                                @change="endOnChange"
                        >
                            <a-icon slot="suffixIcon" type="calendar" />
                        </a-date-picker>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--报名截止时间-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">报名截止时间</span>
                        <a-date-picker
                                :format="dateFormat"
                                placeholder="报名截止时间"
                                :value="date_moment(detail.close_time, dateFormat)"
                                @change="onChange"
                        >
                            <a-icon slot="suffixIcon" type="calendar" />
                        </a-date-picker>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--活动报名人数-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ">活动报名人数</span>
                        <a-input-number  :min="0" :max="999999999"  v-decorator="['max_num',{ initialValue: detail.max_num}]"  placeholder="请填写活动报名人数"/>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--是否需要添加身份证-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col" style="width: 140px !important;">是否需要添加身份证</span>
                        <a-radio-group name="is_need" v-model="detail.is_need">
                            <a-radio :value="1">
                                需要
                            </a-radio>
                            <a-radio :value="2">
                                不需要
                            </a-radio>
                        </a-radio-group>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--是否允许重复报名-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col" style="width: 140px !important;">是否允许重复报名</span>
                        <a-radio-group name="is_repeat" v-model="detail.is_repeat">
                            <a-radio :value="1">
                                是
                            </a-radio>
                            <a-radio :value="0">
                                否
                            </a-radio>
                        </a-radio-group>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                
                <!--活动状态-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ">活动状态</span>
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
                                :min="0" :max="999999999"
                                v-decorator="['sort',{ initialValue: detail.sort}]"
                                placeholder="请填写排序值"
                        />
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
        name: 'addVolunteerActivitiesInfo',
        components: {
            CustomTooltip,
            Editor,
            VueUeditorWrap
        },
        data() {
            return {
                title: '新建',
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
                    'active_name': '',
                    'add_time_txt': '',
                    'img_arr': [],
                    'start_time': '',
                    'end_time': '',
                    'max_num': '',
                    'status': 1,
                    'is_need': 2,
                    'is_repeat':1,
                    'sort': '',
                    'richText': ' ',
                    'activity_id': 0,
                    'close_time':'',
                },
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
                            'fullscreen', //全屏
                        ]
                    ],
                },
                content: '',
                dateFormat: 'YYYY-MM-DD',
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
                this.title = '添加活动';
                this.fileList = [];
                this.detail = {
                    'active_name': '',
                    'add_time_txt': '',
                    'img_arr': [],
                    'start_time': '',
                    'end_time': '',
                    'max_num': '',
                    'status': 1,
                    'is_need': 2,
                    'is_repeat':1,
                    'sort': 0,
                    'richText': ' ',
                    'activity_id': 0,
                    'close_time':'',
                };
                this.visible = true;
                this.loading = true;
            },
            //编辑
            edit(activity_id) {
                let _this = this;
                _this.visible = true;
                _this.confirmLoading = true;
                this.request(configStreetCommunityApi.getVolunteerDetail,{ activity_id: activity_id }).then((res) => {
                    if (res && res.info) {
                        _this.confirmLoading = false;
                        _this.detail = res.info;
                        _this.title = '编辑【'+res.info.active_name+'】';
                        if(res.info.imgList) {
                            _this.fileList = res.info.imgList;
                        }else{
                            _this.fileList = [];
                        }
                    }
                    _this.$forceUpdate()
                })
            },
            // 处理时间
            date_moment(time, dateFormat) {
                if (!time) {
                    return ''
                }
                return moment(time, dateFormat);
            },
            // 开始日期切换，重新赋值
            startOnChange(date, dateString) {
                this.detail.start_time = dateString;
            },
            // 结束日期切换，重新赋值
            endOnChange(date, dateString) {
                this.detail.end_time = dateString;
            },
            // 截止日期切换，重新赋值
            onChange(date, dateString) {
                this.detail.close_time = dateString;
            },
            //关闭预览图片
            handleCancel2() {
                this.previewVisible=false;
            },
            async handlePreview(file) {
                this.previewImage=file.url;
                this.previewVisible = true;
            },
            isAssetTypeAnImage(ext) {
                var index= ext.lastIndexOf(".");
                ext = ext.substr(index+1);
                ext=ext.substr(ext+1);
                return ['png', 'jpg', 'jpeg'].indexOf(ext.toLowerCase()) !== -1;
            },
            handleChange({fileList}) {
                let fileArr=[];
                for (var i = 0, l = fileList.length; i < l; i++) {
                    if(this.isAssetTypeAnImage(fileList[i].name)){
                        fileArr.push(fileList[i]);
                    }
                }
                this.fileList = fileArr;
                console.log(fileList, fileArr)
            },
            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this;
                this.detail.img=[];
                for (var i = 0, l = this.fileList.length; i < l; i++) {
                    this.detail.img.push(this.fileList[i].response);
                }
                this.detail.startTime=this.startTime;
                this.detail.endTime=this.endTime;
                validateFields((errors, values) => {
                    if (!errors) {
                        console.log(values)
                        const indexParams = { ...values }
                        if (this.detail.activity_id) {
                            indexParams.activity_id = this.detail.activity_id;
                        }
                        indexParams.active_name = values.active_name;
                        indexParams.start_time = this.detail.start_time;
                        indexParams.end_time = this.detail.end_time;
                        indexParams.close_time = this.detail.close_time;

                        indexParams.max_num = values.max_num;
                        indexParams.status = this.detail.status;
                        indexParams.is_need = this.detail.is_need;
                        indexParams.is_repeat = this.detail.is_repeat;
                        indexParams.sort = values.sort;
                        indexParams.richText = this.detail.richText;
                        indexParams.img_arr = this.detail.img;
                        if (!indexParams.active_name) {
                            this.$message.warning('请填写活动名称!')
                            return false;
                        }
                        if (!indexParams.start_time) {
                            this.$message.warning('请填写活动开始时间!')
                            return false;
                        }
                        if (!indexParams.end_time) {
                            this.$message.warning('请填写活动结束时间!')
                            return false;
                        }
                        if (!indexParams.close_time) {
                            this.$message.warning('请填写活动报名截止时间!')
                            return false;
                        }
                        this.confirmLoading = true;
                        this.request(configStreetCommunityApi.addVolunteerActivity,indexParams).then((res) => {
                            if (this.detail.activity_id) {
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
                    this.id = '0'
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
