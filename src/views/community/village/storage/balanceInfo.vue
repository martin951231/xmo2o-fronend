<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
        @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading" :height="800">
            <a-form :form="form" class="balance_info">
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col ">姓名</span>
                        <a-input :maxLength="100" style="width: 300px" v-model="post.nickname"
                            :disabled="is_disabled" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col ">手机号</span>
                        <a-input :maxLength="100" style="width: 300px" v-model="post.phone" :disabled="is_disabled" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                    v-if="is_customized_meter_reading==1">
                    <a-col :span="30">
                        <span class="label_col ">冷水余额</span>
                        <a-input :maxLength="30" style="width: 300px" v-model="cold_water_balance"
                            :disabled="is_disabled" suffix="元" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                    v-if="is_customized_meter_reading==1">
                    <a-col :span="30">
                        <span class="label_col ">热水余额</span>
                        <a-input :maxLength="30" style="width: 300px" v-model="hot_water_balance"
                            :disabled="is_disabled" suffix="元" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                    v-if="is_customized_meter_reading==1">
                    <a-col :span="30">
                        <span class="label_col ">电费余额</span>
                        <a-input :maxLength="30" style="width: 300px" v-model="electric_balance"
                            :disabled="is_disabled" suffix="元" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col ">物业余额</span>
                        <a-input :maxLength="30" style="width: 300px" v-model="current_money"
                            :disabled="is_disabled" suffix="元" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol"
                    v-if="is_customized_meter_reading==1">
                    <a-col :span="30">
                        <label class="label_col ant-form-item-required">余额类型</label>
                        <a-select placeholder="请选择余额类型" style="width: 180px"
                            v-decorator="['post.opt_money_type', {initialValue:post.opt_money_type}]">
                            <a-select-option value="cold_water_balance">冷水余额</a-select-option>
                            <a-select-option value="hot_water_balance">热水余额</a-select-option>
                            <a-select-option value="electric_balance">电费余额</a-select-option>
                            <a-select-option value="current_money">物业余额</a-select-option>
                        </a-select>
                        <span style="margin-left: 15px;"> 请选择要增加或减少余额的类型</span>
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="label_col ant-form-item-required">操作类型</span>
                    <a-radio-group @change="handleSelectChange" v-decorator="['post.status', {initialValue:post.status}]">
                        <a-radio :value="1">
                            增加
                        </a-radio>
                        <a-radio :value="2">
                            减少
                        </a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item label="" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-col :span="30">
                        <span class="label_col ant-form-item-required">{{post.status==1?'增加':post.status==2?'减少':'缴费'}}金额</span>
                        <a-input v-if="refreshInput" @change="handleInputChange" style="width: 300px" :placeholder="post.status==1?'请输入增加金额':post.status==2?'请输入减少金额':'请输入缴费金额'" :min="0" :maxLength="10"
                            oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                            v-decorator="['post.price',{ initialValue: post.price, rules: [{ required: true, message: post.status==1?L('请输入增加金额！'):post.status==2?L('请输入减少金额！'):L('请输入缴费金额！')  }] }]"
                            suffix="元" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_show_off_pay_type==1">
                    <span class="label_col">支付方式：</span>
                        <a-select v-model="post.off_pay_type" placeholder="请选择线下支付方式" style="width: 300px">
                            <a-select-option key="0" value="0">
                                请选择线下支付方式
                            </a-select-option>
                            <a-select-option v-for="online in offlinePayList" :key="online.id" :value="online.id">
                                {{ online.name }}
                            </a-select-option>
                        </a-select>
                </a-form-item>  
                
                
                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_aihorse_customized==1">
                    <a-col :span="30">
                        <span class="label_col">备注</span>
                        <a-textarea placeholder="请输入备注" :rows="4"
                            v-decorator="['post.remarks',{ initialValue: post.remarks, rules: [{ required: false, message: L('请输入备注！') }] }]"
                            class="textarea" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>
                
                <a-form-item label=""  :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="is_aihorse_customized<1">
                    <a-col :span="30">
                        <span class="label_col ant-form-item-required">备注</span>
                        <a-textarea placeholder="请输入备注" :rows="4"
                            v-decorator="['post.remarks',{ initialValue: post.remarks, rules: [{ required: true, message: L('请输入备注！') }] }]"
                            class="textarea" />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

            </a-form>
        </a-spin>
        <printPage ref="printPageModel" />
    </a-modal>
</template>
<style lang="less" scoped>
    /deep/ .imgname {
        width: 100px;
    }

    /deep/ .balance_info .textarea {
        width: 80% !important;
    }

    /deep/ .label_col {
        width: 90px;
        display: inline-block;
    }

    /deep/ .balance_info .ant-form-item {
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }

    /deep/ .balance_info .label_col {
        margin-right: 30px !important;
        font-weight: bold !important;
    }

    /deep/ .balance_info .ant-form-item .ant-col-sm-13 {
        width: 100% !important;
    }

    /deep/ .balance_info .ant-upload-picture-card-wrapper {
        width: 15% !important;
    }
</style>
<script>
    import villageApi from '@/api/community/village';
    import printPage from './printPage';
    export default {
        components: {
            printPage,
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
                sensitive_info: [],
                visible: false,
                post: {
                    pigcms_id: 0,
                    nickname: '',
                    phone: '',
                    status: 1,
                    price: '',
                    uid: 0,
                    remarks: '',
                    opt_money_type: 'current_money',
                    off_pay_type:'0'
                },
                hot_water_balance: '',
                cold_water_balance: '',
                electric_balance: '',
                current_money: '',
                is_disabled: true,
                is_customized_meter_reading: 0,
                refreshInput: true,
                is_aihorse_customized:0,
                offlinePayList:[],
                is_show_off_pay_type:0,
            }
        },
        mounted() {},
        methods: {
            
            handleSelectChange(e){
                this.post.status = e.target.value*1;
                this.is_show_off_pay_type=0;
                this.post.off_pay_type = "0";
                if(this.post.status==1 && this.is_aihorse_customized==1){
                    this.is_show_off_pay_type=1;
                }
                this.refrashForm()
            },
            
            refrashForm(){
                this.refreshInput = false
                this.$nextTick(()=>{
                    this.refreshInput = true
                })
            },
            
            handleInputChange(value){
                /*
                let cur_price = parseInt(value.target._value.toString() + value.data.toString())
                if(this.post.status == 2 && cur_price > parseInt(this.current_money)){
                    this.post.price = 0
                    this.$message.warn('减少金额不可大于当前物业余额')
                    this.refrashForm()
                }
                */
            },

            add(pigcms_id, is_customized_meter_reading) {
                let that = this;
                // that.confirmLoading = true;
                that.title = '增加/减少';
                that.visible = true;
                that.post.status = 1;
                that.post.off_pay_type = "0";
                that.post.price = '';
                that.post.remarks = '';
                that.post.opt_money_type = 'current_money';
                this.is_customized_meter_reading = 0;
                this.is_aihorse_customized=0;
                if (is_customized_meter_reading) {
                    this.is_customized_meter_reading = is_customized_meter_reading;
                }
                this.getOfflinePayList();
                that.request(villageApi.storageUserBalance, {
                    uid: pigcms_id
                }).then((data) => {
                    that.post.uid = pigcms_id;
                    that.current_money = data.current_money;
                    that.post.nickname = data.nickname;
                    that.post.phone = data.phone;
                    that.hot_water_balance = data.hot_water_balance;
                    that.cold_water_balance = data.cold_water_balance;
                    that.electric_balance = data.electric_balance;
                    if(data.is_aihorse_customized){
                        this.is_aihorse_customized=data.is_aihorse_customized*1;
                        if(this.post.status==1 && this.is_aihorse_customized==1){
                            this.is_show_off_pay_type=1;
                        }
                    }
                });
                
            },
            getOfflinePayList(){
                this.request(villageApi.getOfflinePayTypeList).then((xres) => {
                    this.offlinePayList=xres.list;
                }).catch((error) => {
                    this.offlinePayList=[];
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
                        
                        if (values.post.status == 2 || values.post.status == '2') {
                            let price_tmp=values.post.price*1;
                            if (values.post.opt_money_type == 'current_money' && price_tmp < this.post
                                .current_money) {
                                this.$message.error('物业余额不足！');
                                this.confirmLoading = false
                                return false;
                            }
                            if (this.is_customized_meter_reading && values.post.opt_money_type == 'cold_water_balance' && price_tmp > this.cold_water_balance) {
                                this.$message.error('冷水余额不足！');
                                this.confirmLoading = false
                                return false;
                            }
                            if (this.is_customized_meter_reading && values.post.opt_money_type == 'hot_water_balance' && price_tmp > this.hot_water_balance) {
                                this.$message.error('热水余额不足！');
                                this.confirmLoading = false
                                return false;
                            }
                            if (this.is_customized_meter_reading && values.post.opt_money_type == 'electric_balance' && price_tmp > this.electric_balance) {
                                this.$message.error('电费余额不足！');
                                this.confirmLoading = false
                                return false;
                            }

                        }
                        values.post.uid = this.post.uid;
                        values.post.off_pay_type = this.post.off_pay_type;
                        let url = villageApi.storageUserBalanceChange;
                        this.request(url, values.post)
                            .then((res) => {
                                this.$message.success('操作成功')
                                setTimeout(() => {
                                    this.form = this.$form.createForm(this)
                                    this.visible = false
                                    this.confirmLoading = false
                                    this.$emit('ok')
                                    if(this.is_aihorse_customized && values.post.status*1 ==1 && res.log_id){
                                        this.$refs.printPageModel.printShow({id:res.log_id,uid:this.post.uid});
                                    }
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
                    this.post.id = 0;
                    this.form = this.$form.createForm(this)
                }, 500)
            },
        },
    }
</script>
