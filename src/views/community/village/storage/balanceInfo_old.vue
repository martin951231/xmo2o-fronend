<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="balance_info">
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col ">现在余额</span>
                        <a-input
                                :maxLength="30"
                                style="width: 300px"
                                v-model="post.now_money"
                                :disabled="is_disabled"
                                suffix="元"
                        />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="label_col ant-form-item-required">状态</span>
                    <a-radio-group  v-decorator="['post.status', {initialValue:post.status}]" >
                        <a-radio :value="1" >
                            增加
                        </a-radio>
                        <a-radio :value="2" >
                            减少
                        </a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item label="" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col ant-form-item-required">缴费金额</span>
                        <a-input
                                style="width: 300px"
                                placeholder="请输入缴费金额"
                                :min= "0" :maxLength="10"
                                oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                                v-decorator="['post.price',{ initialValue: post.price, rules: [{ required: true, message: L('请输入缴费金额！') }] }]"
                                suffix="元"
                        />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col ant-form-item-required">备注</span>
                        <a-textarea
                                placeholder="请输入备注"
                                :rows="4"
                                v-decorator="['post.remarks',{ initialValue: post.remarks, rules: [{ required: true, message: L('请输入备注！') }] }]"
                                class="textarea"/>
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

            </a-form>
        </a-spin>
    </a-modal>
</template>
<style lang="less" scoped>
    /deep/ .imgname{
        width: 100px;
    }

    /deep/ .balance_info .textarea{
        width: 80% !important;
    }

    /deep/ .label_col{
        width: 75px;
        display: inline-block;
    }

    /deep/ .balance_info .ant-form-item{
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }
    /deep/ .balance_info .label_col{
        margin-right: 30px !important;
        font-weight: bold !important;
    }
    /deep/ .balance_info .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }
    /deep/ .balance_info .ant-upload-picture-card-wrapper{
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
                sensitive_info:[],
                visible: false,
                post:{
                    pigcms_id:0,
                    now_money:'',
                    status:1,
                    price:'',
                    remarks:''
                },
                is_disabled:true
            }
        },
        mounted() {
        },
        methods: {

            add(pigcms_id) {
                let that=this;
                // that.confirmLoading = true;
                that.title = '增加/减少';
                that.visible = true;
                that.post.status= 1;
                that.post.price= '';
                that.post.remarks= '';
                console.log('pigcms_iddfsdf',pigcms_id);
                that.request(villageApi.storageUserBalance,{pigcms_id:pigcms_id}).then((data) => {
                    that.post.pigcms_id= data.pigcms_id;
                    that.post.now_money= data.now_money;
                    // that.confirmLoading = false;
                });
            },
            handleSubmit() {
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        values.post.pigcms_id=this.post.pigcms_id;
                        let url=villageApi.storageUserBalanceChange;
                        this.request(url, values.post)
                            .then((res) => {
                                this.$message.success('操作成功')
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false
                                    this.confirmLoading = false
                                    console.log(123)
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
        },
    }
</script>