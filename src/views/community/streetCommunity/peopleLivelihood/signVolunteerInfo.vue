<template>
    <a-modal :title="title" :width="900"  :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading" >
            <a-form :form="form" >
                <!--报名姓名-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">报名姓名</span>
                        <a-input
                                :maxLength="100"
                                style="width: 300px"
                                placeholder="请填写报名姓名"
                                v-decorator="['join_name',{ initialValue: detail.join_name,rules: [{ required: true, message: L('请填写报名姓名！') }] }]"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--报名手机号-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">报名手机号</span>
                        <a-input-number
                                :min="1"
                                :max="99999999999"
                                placeholder="请填写报名手机号"
                                v-decorator="['join_phone',{ initialValue: detail.join_phone,rules: [{ required: true, message: L('请填写报名手机号！') }]}]" />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--报名身份证-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col" >报名身份证</span>
                        <a-input
                                :maxLength="100"
                                style="width: 300px"
                                placeholder="请填写报名身份证"
                                v-decorator="['join_id_card',{ initialValue: detail.join_id_card }]"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--所属活动-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col" >所属活动</span>
                        {{detail.active_name}}
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--备注-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col" >备注</span>
                        <a-textarea
                                style="width: 80%"
                                placeholder="请填写备注"
                                v-decorator="['join_remark', { initialValue: detail.join_remark}]"
                                :rows="4"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--审核状态-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">审核状态</span>
                        <a-radio-group name="status" v-model="detail.join_examine" :disabled="detail.is_examine">
                            <a-radio :value="0">
                                待审核
                            </a-radio>
                            <a-radio :value="1">
                                审核通过
                            </a-radio>
                            <a-radio :value="2">
                                审核拒绝
                            </a-radio>
                        </a-radio-group>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>
                <!--报名状态-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">报名状态</span>
                        <a-radio-group name="status" v-model="detail.join_status">
                            <a-radio :value="1">
                                开启
                            </a-radio>
                            <a-radio :value="2">
                                关闭
                            </a-radio>
                        </a-radio-group>
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

    /deep/ .ant-radio-wrapper{
        display:inline !important;
    }

</style>
<script>
    import moment from 'moment';
    import configStreetCommunityApi from '@/api/community/streetCommunity'
    export default {
        name: 'signVolunteerInfo',
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
                detail:{
                    'join_id': 0,
                    'activity_id': 0,
                    'join_name': '',
                    'join_phone': '',
                    'join_id_card': '',
                    'join_remark': '',
                    'active_name': '',
                    'join_status': 1,
                    'join_examine':0,
                    'is_examine':false
                },
            }
        },
        mounted() {
        },
        methods: {
            moment,
            //编辑
            edit(join_name,join_id,activity_id) {
                let _this = this;
                _this.title = '编辑姓名【'+join_name+'】';
                _this.visible = true;
                _this.confirmLoading = true;
                this.request(configStreetCommunityApi.getVolunteerActiveJoinInfo,{ join_id: join_id,activity_id: activity_id }).then((res) => {
                    _this.confirmLoading = false;
                    if (res && res.info) {
                        _this.detail = res.info;
                    }
                    _this.$forceUpdate()
                })
            },
            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this;
                let _this = this;
                _this.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        values.join_id =this.detail.join_id;
                        values.join_status =this.detail.join_status;
                        values.join_examine =this.detail.join_examine;
                        this.request(configStreetCommunityApi.subActiveJoin, values).then((res) => {
                            _this.$message.success('编辑成功')
                            setTimeout(() => {
                                _this.form = _this.$form.createForm(this)
                                _this.visible = false
                                _this.confirmLoading = false
                                _this.$emit('ok', values)
                            }, 1500)
                        }).catch((error)=>{
                            _this.confirmLoading = false
                        })
                    } else {
                        _this.confirmLoading = false
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
