<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="project_info">

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col">设备名称</span>
                        {{replyInfo.camera_name}}
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col">设备编号</span>
                        {{replyInfo.camera_sn}}
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col">申请姓名</span>
                        {{replyInfo.name}}
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col">申请电话</span>
                       {{replyInfo.phone}}
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col">申请地址</span>
                        {{replyInfo.address}}
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col">申请理由</span>
                        {{replyInfo.reply_reason}}
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col">可看时间范围</span>
                        <span v-if="replyInfo.start_time_txt&&replyInfo.end_time_txt">{{replyInfo.start_time_txt}}到{{replyInfo.end_time_txt}}</span>
                        <span v-if="!replyInfo.start_time&&!replyInfo.end_time">不限</span>
                        
                    </a-col>
                </a-form-item>
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_look>0">
                    <a-col :span="30">
                        <span class="label_col">审核结果</span>
                        {{replyInfo.reply_status_txt}}
                    </a-col>
                </a-form-item>
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_look>0&&replyInfo.reason">
                    <a-col :span="30">
                        <span class="label_col">拒绝原因</span>
                        {{replyInfo.reason}}
                    </a-col>
                </a-form-item>
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_look>0&&replyInfo.reply_time_txt">
                    <a-col :span="30">
                        <span class="label_col">审核时间</span>
                        {{replyInfo.reply_time_txt}}
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_look<=0">
                    <a-col :span="30">
                        <span class="label_col">审核选择</span>
                        <a-radio-group @change='checkChoose($event)' v-model="replyInfo.reply_status" >
                            <a-radio :value="1">申请中</a-radio>
                            <a-radio :value="2">允许</a-radio>
                            <a-radio :value="3">拒绝</a-radio>
                        </a-radio-group>
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_look<=0 && replyInfo.reply_status==3">
                    <span class="label_col">拒绝理由</span>
                    <a-input
                        :maxLength="30"
                        style="width: 300px"
                        placeholder="请输入拒绝理由！"
                        v-model="replyInfo.reason"
                    />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>
<style lang="less" scoped>
    .imgname{
        width: 100px;
    }

    /deep/ .project_info .ant-form-item{
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }
    /deep/ .project_info .label_col{
        margin-right: 30px !important;
        font-weight: bold !important;
    }
    /deep/ .project_info .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }
    /deep/ .project_info .ant-upload-picture-card-wrapper{
        width: 15% !important;
    }
</style>
<script>
    import villageApi from '@/api/community/village';

    export default {
        components: {
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
                replyInfo: {},
                id: 0,
                is_look: 0,
            }
        },
        mounted() {
        },
        methods: {
            edit(id,is_look=0) {
                if (!is_look) {
                    this.title = '审核';
                } else {
                    this.title = '查看';
                }
                this.is_look = is_look
                this.visible = true;
                this.id = id;
                this.getReplyInfo(id);
            },
            checkChoose(e) {
                this.$set(this.replyInfo, 'reply_status', e.target.value)
                console.log('e.target.value', e.target.value);
            },
            /**
             * 视频监控信息
             */
            getReplyInfo(id){
                this.request(villageApi.getReplyInfo,{
                    id:id
                }).then((res) => {
                   console.log('res',res);
                    this.replyInfo = res.info;
                })
            },

            handleSubmit() {
                if (this.is_look) {
                    this.visible = false
                    setTimeout(() => {
                        this.id = 0;
                        this.form = this.$form.createForm(this)
                    }, 500)
                    return false;
                }
                this.confirmLoading = true;

                let url=villageApi.checkReplyInfo;
                console.log('replyInfo',  this.replyInfo);
                this.request(url, this.replyInfo)
                    .then((res) => {
                        this.$message.success('审核操作成功')
                        setTimeout(() => {
                            this.form = this.$form.createForm(this)
                            this.visible = false
                            this.confirmLoading = false
                            this.$emit('ok');
                        }, 1500)
                    })
                    .catch((error)=>{
                        this.confirmLoading = false
                    })
            },
            handleCancel() {
                this.visible = false
                setTimeout(() => {
                    this.id = 0;
                    this.form = this.$form.createForm(this)
                }, 500)
            },
        },
    }
</script>