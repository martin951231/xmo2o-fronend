<template>
    <a-modal :title="title" :width="900"  :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading" >
            <a-form :form="form" >
                <!--标题-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">标题</span>
                        <a-input
                                :maxLength="100"
                                style="width: 300px"
                                placeholder="请输入标题"
                                v-decorator="['title',{ initialValue: post.title,rules: [{ required: true, message: L('请输入标题！') }] }]"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--联系人-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">联系人</span>
                        <a-input
                                :maxLength="30"
                                style="width: 300px"
                                placeholder="请输入联系人"
                                v-decorator="['user_name',{ initialValue: post.user_name,rules: [{ required: true, message: L('请输入联系人！') }] }]"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--联系方式-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">联系方式</span>
                        <a-input
                                :maxLength="30"
                                style="width: 300px"
                                placeholder="请输入联系方式"
                                v-decorator="['user_phone',{ initialValue: post.user_phone,rules: [{ required: true, message: L('请输入联系方式！') }] }]"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--验房地址-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col">验房地址</span>
                        <a-input
                                :maxLength="100"
                                style="width: 300px"
                                v-model="post.adress"
                        />
                        <span class="adress_box" @click="$refs.maPModel.init_(1,post.long,post.lat)">点击选取验房地址</span>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--排号时间-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">排号时间</span>
                        <a-range-picker
                                @change="queuingChange"
                                style="width: 300px"
                                v-model="post.queuing_time"
                                :ranges="{
                    今日: [moment(), moment()],
                    昨日: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    近七天: [moment().subtract(7, 'days'), moment()],
                    近30天: [moment().subtract(30, 'days'), moment()],
                  }"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--办公时间-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col">办公时间</span>
                        <a-time-picker
                                v-decorator="[
                  'work_start_time',
                  {
                    initialValue: post.work_start_time == '' ? null : moment(post.work_start_time, 'HH:mm'),
                    rules: [{ required: true, message: L('请选择办公时间~') }],
                  },
                ]"
                                format="HH:mm"
                                :placeholder="L('开始时间')"
                        />
                        <span class="ml-10 mr-10">{{ L('至') }}</span>
                        <a-time-picker
                                v-decorator="[
                  'work_end_time',
                  { initialValue: post.work_end_time == '' ? null : moment(post.work_end_time, 'HH:mm') },
                ]"
                                format="HH:mm"
                                :placeholder="L('结束时间')"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--每日最大预约数-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" >
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">预约数</span>
                        <a-input-number
                                :min="1" :max="9999"
                                placeholder="请输入预约数"
                                v-decorator="['max_queue_number',{ initialValue: post.max_queue_number ,rules: [{ required: true, message: L('请输入每日最大预约数！') }]}]"
                        /> 设置每日最大预约数（最多可设置9999）

                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--内容-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col float_l">内容</span>
                    <a-textarea
                            :maxLength="100"
                            style="width: 300px"
                            placeholder="请输入内容"
                            v-decorator="['content', { initialValue: post.content}]"
                            :rows="4"
                    />
                </a-form-item>
                <!--开启自动审核-->
                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="label_col">开启自动审核</span>
                    <a-radio-group  v-decorator="['examine_type', {initialValue:post.examine_type}]" >
                        <a-radio :value="1" >
                            开启
                        </a-radio>
                        <a-radio :value="0" >
                            关闭
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
                <!--扫码进排号预约-->
                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="voucher_img !=''">
                    <span class="label_col">扫码进排号预约</span>
                    <div class="voucher_img_box">
                        <viewer :images="voucher_img">
                            <img v-for="(src,index) in voucher_img" :src="src" >
                        </viewer>
                    </div>
                </a-form-item>
                <mapInfo ref="maPModel" @change="choiceMap" />
            </a-form>
        </a-spin>
    </a-modal>
</template>
<script>
    import moment from 'moment';
    import villageApi from '@/api/community/village';
    import mapInfo from './mapInfo';

    import 'viewerjs/dist/viewer.css';
    import Viewer from 'v-viewer';
    import Vue from 'vue';
    Vue.use(Viewer);

    export default {
        name: 'arrangingSet',
        components: {
            mapInfo,
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
                post:{
                    id:0,
                    title:'',
                    user_name:'',
                    user_phone:'',
                    long:'',
                    lat:'',
                    adress:'',
                    queuing_time: [undefined, undefined],
                    work_start_time:'',
                    work_end_time:'',
                    max_queue_number:'',
                    examine_type:0,
                },
                startTime: [],
                endTime: [],
                content: '',
                voucher_img:[],
                source_type:1,
            }
        },
        watch:{},
        mounted() {
        },
        methods: {
            moment,

            //排号规则设置
            info(source_type) {
                this.title = '排号规则设置';
                this.visible = true;
                this.loading = true;
                this.startTime=[];
                this.endTime=[];
                this.content='';
                this.voucher_img=[];
                this.source_type=source_type;
                this.getEditInfo();
            },

            // 日期切换，重新赋值
            queuingChange(date, dateString) {
                this.post.queuing_time = [dateString[0],dateString[1]];
            },

            //选取地图
            choiceMap(val){
                this.post.long=val.lng.toString();
                this.post.lat=val.lat.toString();
                if(val.address.length > 0){
                    this.post.adress=val.address;
                }
                console.log(22222,val,this.post)
            },
            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this;
                this.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        values.id=this.post.id;
                        values.queuing_time=this.post.queuing_time;
                        values.long=this.post.long;
                        values.lat=this.post.lat;
                        values.adress=this.post.adress;
                        values.source_type=this.source_type;
                        values.work_start_time=moment(values.work_start_time).format('HH:mm');
                        values.work_end_time=moment(values.work_end_time).format('HH:mm');
                        if(values.work_end_time == 'Invalid date'){
                            values.work_end_time='';
                        }
                        this.request(villageApi.publicRentalSubArrangingSet, values).then((res) => {
                            this.$message.success('编辑成功')
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
            getEditInfo() {
                this.request(villageApi.publicRentalGetArrangingSet,{source_type:this.source_type}).then((res) => {
                    this.post=res.data;
                    this.voucher_img=res.voucher_img;
                });
            },
        },
    }
</script>
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

    /deep/ .tip{
        margin: 0 10px;
    }
    /deep/ .times_but{
        margin-left: 10px;
    }

    /deep/ .voucher_img_box{
        display: inline-block !important;
    }
    /deep/ .voucher_img_box img{
        width: 120px;cursor: pointer;
    }

</style>