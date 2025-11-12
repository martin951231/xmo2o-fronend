<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="prepaid_info">
                <!--关闭场馆截止日期-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">关闭场馆截止日期</span>
                        <a-date-picker
                                :mode="date_status"
                                :format="dateFormat"
                                placeholder="请选择时间"
                                v-model="dateValue"
                                @panelChange="selectYear"
                                @openChange="status =>onOpenChange(status, 'isOpen')"
                                :open="isOpen"
                        >
                        </a-date-picker>
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

                <!--关闭场馆原因-->
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" >
                    <a-col :span="30">
                        <span class="box_width label_col ant-form-item-required">关闭场馆原因</span>
                        <a-textarea
                                v-decorator="['close_msg',{ initialValue: post.close_msg,rules: [{ required: true, message: L('请输入关闭场馆原因！') }]}]"
                                placeholder="备注"
                        />
                    </a-col>
                    <a-col :span="6"></a-col>
                </a-form-item>

            </a-form>
        </a-spin>
    </a-modal>
</template>
<script>
    import moment from 'moment';
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
                    close_time:'',
                    close_msg:'',
                },
                isOpen:false,
                date_status:'date',
                dateFormat:'YYYY-MM-DD',
                dateValue:null,
            }
        },
        mounted() {
        },
        methods: {
            moment,
            selectYear(date,dateString){
                this.dateValue = date;
                this.isOpen = false;
            },
            onOpenChange(status, type) {
                this[type] = status
            },
            onOpenChange(status, type) {
                this[type] = status;
            },

            edit(id) {
                this.title = '关闭活动场馆';
                this.visible = true;
                this.dateValue = null;
                this.post = {
                    id:id,
                    close_time:'',
                    close_msg:'',
                };

            },
            handleSubmit() {
                let d = new Date(this.dateValue);
                let date_=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ;
                const {
                    form: {
                        validateFields
                    }
                } = this
                this.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        this.post.close_time=date_;
                        this.post.close_msg=values.close_msg;
                        let url=villageApi.venueActivityClose;
                        this.request(url, this.post)
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
        width: 140px !important;
    }
    /deep/ .ant-select{
        width: 20% !important;
    }
    /deep/ .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }
</style>