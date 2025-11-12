<template>
    <a-modal :title="title" :width="900"  :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading" >
            <a-form :form="form" >
                <!--活动场馆名称-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">活动场馆名称</span>
                        <a-input
                                :maxLength="100"
                                style="width: 300px"
                                placeholder="请输入活动场馆名称"
                                v-decorator="['title',{ initialValue: post.title,rules: [{ required: true, message: L('请输入活动场馆名称！') }] }]"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--活动场馆类型-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">活动场馆类型</span>
                        <a-select
                                  @change="classifyChange"
                                  placeholder="请选择活动场馆类型"
                                  v-model="post.classify_id"
                        >
                            <a-select-option
                                    v-for="item in ClassifyData"
                                    :key="item.id">
                                {{item.title}}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--办公时间-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">办公时间</span>
                        <a-input
                                :maxLength="100"
                                style="width: 600px"
                                placeholder="请输入办公时间"
                                v-decorator="['work_txt',{ initialValue: post.work_txt,rules: [{ required: true, message: L('请输入办公时间！') }] }]"
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

                <!--联系人-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ">联系人</span>
                        <a-input
                                :maxLength="18"
                                style="width: 300px"
                                placeholder="请输入联系人"
                                v-decorator="['contacts',{ initialValue: post.contacts }]"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--联系人电话-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ">联系人电话</span>
                        <a-input
                                :maxLength="30"
                                style="width: 300px"
                                placeholder="请输入联系人电话"
                                v-decorator="['phone',{ initialValue: post.phone }]"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--场馆介绍-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" class="cont_box">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">场馆介绍</span>
                        <!--<rich-text :info.sync="content"/>-->
                        <vue-ueditor-wrap v-model="post.content" :config="myConfig"></vue-ueditor-wrap>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--场馆地址-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">场馆地址</span>
                        <a-input
                                :maxLength="100"
                                style="width: 300px"
                               v-model="post.adress"
                        />
                        <span class="adress_box" @click="$refs.maPModel.init_(post.id,post.long,post.lat)">点击选取场馆地址</span>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--排序-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col">排序</span>
                        <a-input-number
                                :min="0" :max="999999999"
                                placeholder="请输入"
                                v-decorator="['sort',{ initialValue: post.sort }]"
                        /> 值越大，越靠前显示。
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--是否支持收藏-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">是否支持收藏</span>
                        <a-select
                                @change="cycleChange"
                                v-model="post.is_collect"
                        >
                            <a-select-option
                                    v-for="item in collect_arr"
                                    :key="item.key">
                                {{item.value}}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--是否支持预约-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">是否支持预约</span>

                        <a-select
                                @change="appointChange"
                                v-model="post.is_appoint"
                        >
                            <a-select-option
                                    v-for="item in appoint_arr"
                                    :key="item.key">
                                {{item.value}}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--预约周期-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_appoint">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">预约周期(天)</span>
                        <a-input-number
                                :min="1" :max="31"
                                placeholder="请输入"
                                v-decorator="['appoint_cycle',{ initialValue: post.appoint_cycle,rules: [{ required: true, message: L('请输入预约周期(天)！') }]}]"
                        /> 预约周期(天)数，最小值为1天，最大值为31天。

                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--最大预约数-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_appoint">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">最大预约数</span>
                        <a-input-number
                                :min="1" :max="100"
                                placeholder="请输入"
                                v-decorator="['appoint_num',{ initialValue: post.appoint_num ,rules: [{ required: true, message: L('请输入预约数！') }]}]"
                        /> 设置活动场馆场地总数

                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--设置时间段-->
                <div class="set_time" v-if="is_appoint">
                    <div class="box_width label_col ant-form-item-required ">设置时间段</div>
                </div>
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"  class="time_right" v-if="is_appoint">
                    <span v-for='(item,index) in itemcount'   v-model="itemcount" style="width: 500px">
                        <div class="time_box">
                             <a-time-picker
                                     :value="startDateMoments(index)"
                                     format="HH:mm"
                                     @change="onCycleStimeeRangeChange($event,index)"
                                                 />
                              <span class="tip">-</span>
                              <a-time-picker
                                      :value="endDateMoments(index)"
                                      format="HH:mm"
                                      @change="onCycleEtimeeRangeChange($event,index)"
                              />

                            <span class="times_but" v-if="index == 0" @click="plus_times(index)">+</span>
                            <span class="times_but" v-if="index > 0 " @click="reduce_times(index)"> -</span>
                        </div>
                    </span>
                </a-form-item>
                <activityMap ref="maPModel" @change="choiceMap" />
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
    import Editor from '@/components/Editor/WEditor';
    // import RichText from '@/components/RichText/RichText2';
    import activityMap from './activityMap';

    import VueUeditorWrap from 'vue-ueditor-wrap'

    export default {
        name: 'activityInfo',
        components: {
            Editor,
            // RichText,
            activityMap,
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
                post:{
                    id:0,
                    title:'',
                    classify_id:undefined,
                    work_txt:'',
                    contacts:'',
                    phone:'',
                    content:' ',
                    sort:0,
                    is_collect:1,
                    is_appoint:1,
                    appoint_cycle:'',
                    appoint_num:'',
                    img:[],
                    long:'',
                    lat:'',
                    adress:'',
                    status:'',
                    startTime:[],
                    endTime:[],

                },
                cycle_start_time: '00:00',
                cycle_end_time: '00:00',
                collect_arr:[{"key":0,"value":"否"},{"key":1,"value":"是"}],
                appoint_arr:[{"key":0,"value":"否"},{"key":1,"value":"是"}],
                fileList:[],
                ClassifyData:[],
                previewImage: '',
                previewVisible: false,
                startTime: [],
                endTime: [],
                itemcount:1,
                is_appoint:true,
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
                content: ''
            }
        },
        watch:{
            // content(val){
            //     this.$set(this.post, 'content',val)
            // }
        },
        mounted() {
        },
        methods: {
            moment,
            startDateMoments(index) {
                let str;
                if(this.post.id>0 && this.startTime[index]){
                    //编辑页面
                    str=this.startTime[index];
                } else if(!this.post.id && this.startTime[index]){
                    str=this.startTime[index];
                }else{
                    //添加
                    str= '00:00';
                }
                return moment(str, 'HH:mm');
            },
            endDateMoments(index) {
                let str;
                if(this.post.id > 0 && this.endTime[index]){
                    str=this.endTime[index];
                } else if(!this.post.id && this.endTime[index]){
                    str=this.endTime[index];
                }else{
                    str= '00:00';
                }
                return moment(str, 'HH:mm');
            },
            // 监听按周期开始日期选择变化
            onCycleStimeeRangeChange(e, index) {
                // 更新表单数据
                this.$set(this.startTime, index, moment(e).format('HH:mm'));
                this.$forceUpdate();
            },
            // 监听按周期结束日期选择变化
            onCycleEtimeeRangeChange(e, index) {
                // 更新表单数据
                this.$set(this.endTime, index, moment(e).format('HH:mm'))
                this.$forceUpdate()
            },
            //活动场馆类型
            classifyChange(e){
                this.post.classify_id=e;
            },
            //关闭预览图片
            handleCancel2() {
                this.previewVisible=false;
            },
            async handlePreview(file) {
                this.previewImage=file.response;
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
            },
            //是否支持收藏
            cycleChange(){
                // this.post.is_collect=e;
            },
            //是否是否支持预约
            appointChange(e){
                if(e == 1){
                    this.is_appoint=true;
                }else{
                    this.is_appoint=false;
                }
            },
            //选取地图
            choiceMap(val){
                this.post.long=val.lng.toString();
                this.post.lat=val.lat.toString();
                if(val.address.length > 0){
                    this.post.adress=val.address;
                }
            },
            //加
            plus_times(index){
               if(this.itemcount <= 23){
                   this.itemcount +=1;
               }
            },
            //减
            reduce_times(index){
                this.itemcount -=1;
                this.startTime.splice(index,1);
                this.endTime.splice(index,1);
            },
            add() {
                this.title = '添加活动场馆';
                this.visible = true;
                this.loading = true;
                this.fileList=[];
                this.itemcount=1;
                this.is_appoint=true;
                this.startTime=[];
                this.endTime=[];
                this.content='';
                this.post = {
                    id:0,
                    title:'',
                    classify_id: undefined,
                    work_txt:'',
                    contacts:'',
                    phone:'',
                    content:' ',
                    sort:0,
                    is_collect:1,
                    is_appoint:1,
                    appoint_cycle:'',
                    appoint_num:'',
                    img:[],
                    long:'0',
                    lat:'0',
                    adress:'',
                    status:'',
                    startTime:[],
                    endTime:[],
                    cycle_start_time: '00:00',
                    cycle_end_time: '00:00',
                };
                this.request(villageApi.venueClassifyData).then((data) => {
                    if (data){
                        this.ClassifyData =data;
                    }
                });
            },
            edit(id) {
                this.title = '编辑活动场馆';
                this.visible = true;
                this.post.id = id;
                this.confirmLoading = true;
                this.content='';
                this.request(villageApi.venueClassifyData).then((data) => {
                    if (data){
                        this.ClassifyData =data;
                    }
                });
                this.getEditInfo();
            },
            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this;
                this.confirmLoading = true;
                this.post.img=[];

                for (var i = 0, l = this.fileList.length; i < l; i++) {
                    this.post.img.push(this.fileList[i].response);
                }
                this.post.startTime=this.startTime;
                this.post.endTime=this.endTime;
                validateFields((errors, values) => {
                    if (!errors) {
                        let url=villageApi.venueActivityAdd;
                        if(this.post.id > 0){
                            url=villageApi.venueActivitySub;
                        }
                        this.post.title=values.title;
                        this.post.work_txt=values.work_txt;
                        this.post.contacts=values.contacts;
                        this.post.phone=values.phone;
                        this.post.sort=values.sort;
                        this.post.appoint_cycle=values.appoint_cycle;
                        this.post.appoint_num=values.appoint_num;
                        this.request(url, this.post)
                            .then((res) => {
                                if (this.post.id>0) {
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
                            })
                            .catch((error)=>{
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
            getEditInfo() {
                this.request(villageApi.venueActivityEdit, {
                    id: this.post.id
                }).then((res) => {
                    this.post=res.data;
                    this.content = res.data.content
                    this.itemcount=res.param.itemcount;
                    this.startTime=res.param.startTime;
                    this.endTime=res.param.endTime;
                    this.is_appoint=res.param.is_appoint;
                    this.fileList=res.param.fileList;
                    this.confirmLoading = false;
                    this.$forceUpdate()
                });
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
