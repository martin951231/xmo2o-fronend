<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel" v-if="post.status == 0"  >
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="prepaid_info">
                <!--预约编号-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col">预约编号</span>
                        {{post.record_number}}
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--姓名-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col">姓名</span>
                        {{post.name}}
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--联系人电话-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ">联系人电话</span>
                        {{post.phone}}
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--预约日期-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ">预约日期</span>
                        {{post.appoint_time}}
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--预约时间-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ">预约时间</span>
                        {{post.times}}
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--备注-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ">备注</span>
                        <span >{{post.remarks}}</span>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--审核状态-->
                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col ant-form-item-required" v-if="post.status == 0">审核状态</span>
                    <span class="box_width label_col " v-else>审核状态</span>
                    <a-radio-group  v-decorator="['status', {initialValue:post.status}]"  :disabled="post.examine_status">
                        <a-radio :value="1" >
                            审核通过
                        </a-radio>
                        <a-radio :value="2" >
                            审核不通过
                        </a-radio>
                        <a-radio :value="3" v-if="post.status == 3">
                            取消预约
                        </a-radio>
                    </a-radio-group>
                </a-form-item>

                <!--审核说明-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="post.status != 3">
                    <a-col :span="30">
                        <span class="box_width label_col ">审核说明</span>
                        <span v-if="post.status == 0">
                              <a-textarea
                                      v-decorator="['examine_msg',{ initialValue: post.examine_msg }]"
                                      placeholder="备注"
                              />
                        </span>
                        <span  v-else >{{post.examine_msg}}</span>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--取消时间-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="post.status == 3">
                    <a-col :span="30">
                        <span class="box_width label_col ">取消时间</span>
                        {{post.cancel_time}}
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--取消原因-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="post.status == 3">
                    <a-col :span="30">
                        <span class="box_width label_col ">取消原因</span>
                        {{post.cancel_msg}}
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

            </a-form>
        </a-spin>
    </a-modal>

    <a-modal :title="title" :width="900" :visible="visible" :footer="null" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel" v-else>
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="prepaid_info">
                <!--预约编号-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col">预约编号</span>
                        {{post.record_number}}
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--姓名-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col">姓名</span>
                        {{post.name}}
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--联系人电话-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ">联系人电话</span>
                        {{post.phone}}
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--预约日期-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ">预约日期</span>
                        {{post.appoint_time}}
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--预约时间-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ">预约时间</span>
                        {{post.times}}
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--备注-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ">备注</span>
                        <span >{{post.remarks}}</span>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--审核状态-->
                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="box_width label_col ant-form-item-required" v-if="post.status == 0">审核状态</span>
                    <span class="box_width label_col " v-else>审核状态</span>
                    <a-radio-group  v-decorator="['status', {initialValue:post.status}]"  :disabled="post.examine_status">
                        <a-radio :value="1" >
                            审核通过
                        </a-radio>
                        <a-radio :value="2" >
                            审核不通过
                        </a-radio>
                        <a-radio :value="3" v-if="post.status == 3">
                            取消预约
                        </a-radio>
                    </a-radio-group>
                </a-form-item>

                <!--审核说明-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="post.status != 3">
                    <a-col :span="30">
                        <span class="box_width label_col ">审核说明</span>
                        <span v-if="post.status == 0">
                              <a-textarea
                                      v-decorator="['examine_msg',{ initialValue: post.examine_msg }]"
                                      placeholder="备注"
                              />
                        </span>
                        <span  v-else >{{post.examine_msg}}</span>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--取消时间-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="post.status == 3">
                    <a-col :span="30">
                        <span class="box_width label_col ">取消时间</span>
                        {{post.cancel_time}}
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--取消原因-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="post.status == 3">
                    <a-col :span="30">
                        <span class="box_width label_col ">取消原因</span>
                        {{post.cancel_msg}}
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

            </a-form>
        </a-spin>
    </a-modal>
</template>
<script>
    import villageApi from '@/api/community/village';
    export default {
        components: {
        },
        data() {
            return {
                title: '',
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
                post:{
                    id:0,
                    record_number:'',
                    name:'',
                    phone:'',
                    times:'',
                    appoint_time:'',
                    status:'',
                    remarks:'',
                    examine_msg:'',
                    status_msg:'',
                    examine_status:false,
                    cancel_msg:'',
                    cancel_time:'',
                },
            }
        },
        mounted() {
        },
        methods: {

            //是否支持收藏
            cycleChange(e){
                // this.post.is_collect=e;
            },
            edit(id) {
                this.post.id = id;
                this.imgUrl='';
                this.getEditInfo();
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
                        let url=villageApi.venueRecordSub;
                        values.id=this.post.id;
                        if(this.post.status > 0){
                            this.form = this.$form.createForm(this)
                            this.visible = false;
                            this.confirmLoading = false;
                            this.$emit('ok');
                            return false;
                        }
                        this.request(url, values)
                            .then((res) => {
                                this.$message.success('操作成功')
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false;
                                    this.confirmLoading = false;
                                    this.$emit('ok')
                                }, 1500)
                                console.log(345)
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
                    this.post.id = 0;
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                let that=this;
                that.confirmLoading = true;
                this.request(villageApi.venueRecordEdit, {
                    id: that.post.id
                })
                    .then((res) => {
                        that.title = (res.status == 0) ? '审核' : '查看';
                        that.post=res;
                        that.confirmLoading = false;
                        that.visible = true;
                    })
            },
        },
    }
</script>
<style lang="less" scoped>
    /deep/ .ant-col-30 textarea{
        width: 75% !important;
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
</style>