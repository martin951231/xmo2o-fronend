<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading"  :height="800">
            <a-form :form="form" class="prepaid_info">

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true" >
                    <span class="label_col ant-form-item-required">预缴时间选择</span>
                    <a-select
                            :disabled="is_disabled"
                            @change="handleChangeCycle"
                            style="width: 300px"
                            v-decorator="['post.cycle',{ initialValue: post.cycle, rules: [{ required: true, message: L('请选择预缴时间！') }] }]">
                        <a-select-option :value="item15.key"  v-for="(item15,index15) in cycle_info" :key="index15" >
                            {{item15.value}}
                        </a-select-option>
                    </a-select>
                    <a-input-number
                            v-if="cycle_txt_status"
                            :disabled="is_disabled"
                            :min="1"
                            style="width: 130px;margin-left: 10px"
                            placeholder="请输入时间数"
                            v-decorator="['post.cycle_param',{ initialValue: post.cycle_param}]"
                    />  &nbsp;&nbsp;{{bill_date_str}}
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" >
                    <span class="label_col ant-form-item-required">优惠模式</span>
                    <a-select
                            style="width: 300px"
                            @change="discountType"
                            v-decorator="['post.type',{ initialValue: post.type, rules: [{ required: true, message: L('请选择优惠模式！') }] }]">
                        <a-select-option :value="item15.key"  v-for="(item15,index15) in type_info" :key="index15" >
                            {{item15.value}}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="" :required="true" :labelCol="labelCol" :wrapperCol="wrapperCol"  v-if="type_1" extra="以百分比计算，请输入0-100。例如输入80，则按80%进行收取，即预缴2个月100元，则折扣后仅需缴纳80元，优惠掉20元">
                    <a-col :span="18">
                        <span class="label_col ant-form-item-required">折扣率</span>
                        <a-input-number
                                :min="0" :max="100" :formatter="value => `${value} %`"
                                style="width: 110px"
                                placeholder="请输入折扣率"
                                v-decorator="['post.rate',{ initialValue: post.rate, rules: [{ required: true, message: L('请输入折扣率！') }] }] "
                        />
                    </a-col>
                    <a-col :span="6">
                    </a-col>
                </a-form-item>

                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true"  v-if="type_2">
                    <span class="label_col ant-form-item-required">赠送时间</span>
                        <a-select style="width: 100px"  @change="handleChange" v-decorator="['post.give_cycle_param',{ initialValue: post.give_cycle_param }]">>
                            <a-select-option :value="item15.key"  v-for="(item15,index15) in give_cycle_param_info" :key="index15" >
                                {{item15.value}}
                            </a-select-option>
                        </a-select>
                        <a-input-number
                                v-if="give_cycle_txt_status"
                                :min="1" :max="100"
                                style="width: 130px;margin-left: 10px"
                                placeholder="请输入赠送时间"
                                v-decorator="['post.give_cycle_txt',{ initialValue: post.give_cycle_txt}]"
                        />
                        &nbsp;&nbsp;{{bill_date_str}}
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="type_3" extra="类似于线下送礼物时候的备注，比如缴费统一赠送小礼品之类的">
                        <a-col :span="18">
                            <span class="label_col">自定义文本</span>
                            <a-input
                                    :maxLength="30"
                                    style="width: 300px"
                                    placeholder="请输入"
                                    v-decorator="['post.custom_txt',{ initialValue: post.custom_txt ,rules: [{ required: true, message: L('请输入自定义文本！') }]}]"
                            />
                        </a-col>
                        <a-col :span="6">
                        </a-col>
                </a-form-item>

                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="label_col">状态</span>
                    <a-radio-group v-decorator="['post.status', {initialValue:post.status}]" >
                        <a-radio :value="1" >
                            开启
                        </a-radio>
                        <a-radio :value="2" >
                            禁止
                        </a-radio>
                    </a-radio-group>
                </a-form-item>


            </a-form>
        </a-spin>
    </a-modal>
</template>
<script>
    import villageApi from '@/api/community/village';
    import streetCommunityApi from '@/api/community/streetCommunity';
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
                cycle_info:[],
                type_info:[],
                give_cycle_param_info:[],
                visible: false,
                post:{
                    id:0,
                    type:'',
                    status:'',
                    rate:'',
                    cycle:'',
                    give_cycle_param:'',
                    give_cycle_txt:'',
                    custom_txt:'',
                    cycle_param:''
                },
                give_cycle_txt_status:false,
                cycle_txt_status:false,
                is_disabled:false,
                type_1:false,
                type_2:false,
                type_3:false,
                type_4:false,
                bill_date_set:2,
                bill_date_str:'月',
            }
        },
        mounted() {
        },
        methods: {
            handleChange(value) {
                if(value == 11){
                    this.give_cycle_txt_status=true;
                }else{
                    this.give_cycle_txt_status=false;
                }
            },

            discountType(value){
                this.type_1=this.type_2=this.type_3=false;
                switch(value) {
                    case 1:
                       this.type_1=true;
                        break;
                    case 2:
                        this.type_2=true;
                        break;
                    case 3:
                        this.type_3=true;
                        break;
                }
            },
            handleChangeCycle(value){
                if(value == 11){
                    this.cycle_txt_status=true;
                }else{
                    this.cycle_txt_status=false;
                }
            },

            add(charge_rule_id=0,bill_date_set) {
                this.charge_rule_id=charge_rule_id;
                this.bill_date_set=bill_date_set;
                if(bill_date_set==1){
                    this.bill_date_str='日';
                }else if(bill_date_set==2){
                    this.bill_date_str='月';
                }else if(bill_date_set==3){
                    this.bill_date_str='年';
                }
                this.title = '添加预缴时间';
                this.visible = true;
                this.is_disabled=false;
                this.type_1=false;
                this.type_2=false;
                this.type_3=false;
                this.type_4=false;
                this.post = {
                    id: 0,
                    type:'',
                    status:1,
                    rate:'',
                    cycle:'',
                    give_cycle_param:'',
                    give_cycle_txt:'',
                    custom_txt:'',
                    cycle_param:''
                };
                this.give_cycle_txt_status=false;
                this.cycle_txt_status=false;
                this.request(villageApi.getPrepaidCycle,{charge_rule_id:this.charge_rule_id}).then((data) => {
                    this.cycle_info= data.cycle;
                    this.type_info= data.type;
                    this.give_cycle_param_info= data.give_cycle;
                })
            },

            edit(id,bill_date_set) {
				this.bill_date_set=bill_date_set;
				if(bill_date_set==1){
				    this.bill_date_str='日';
				}else if(bill_date_set==2){
                    this.bill_date_str='月';
                }else if(bill_date_set==3){
				    this.bill_date_str='年';
				}
                this.title = '编辑预缴周期';
                this.visible = true;
                this.is_disabled=false;
                this.post.id = id;
                this.imgUrl='';
                this.getEditInfo();
                this.type_1=false;
                this.type_2=false;
                this.type_3=false;
                this.type_4=false;
                this.request(villageApi.getPrepaidCycle,{charge_rule_id:this.charge_rule_id}).then((data) => {
                    this.cycle_info= data.cycle;
                    this.type_info= data.type;
                    this.give_cycle_param_info= data.give_cycle;
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
                        let url=villageApi.ChargePrepaidAdd;
                        if(this.post.id > 0){
                            url=villageApi.ChargePrepaidSub;
                            values.post.id=this.post.id;
                        }else{
                            values.post.charge_rule_id=this.charge_rule_id;
                        }
                        this.request(url, values.post)
                            .then((res) => {
                                if (this.post.id>0) {
                                    this.$message.success('编辑成功')
                                } else {
                                    this.$message.success('添加成功')
                                }
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
            getEditInfo() {
                this.confirmLoading = true;
                this.request(villageApi.ChargePrepaidEdit, {
                    id: this.post.id
                })
                    .then((res) => {
                        this.post = {
                            id: res.id,
                            type: res.type,
                            rate:res.rate,
                            cycle:res.cycle,
                            cycle_param:res.cycle_param,
                            give_cycle_param:res.give_cycle_param,
                            give_cycle_txt:res.give_cycle_txt,
                            custom_txt:res.custom_txt,
                            status:res.status
                        };
                        switch(res.type) {
                            case 1:
                                this.type_1=true;
                                break;
                            case 2:
                                this.type_2=true;
                                break;
                            case 3:
                                this.type_3=true;
                                break;
                        }
                        this.is_disabled=res.is_disabled;
                        this.give_cycle_txt_status=res.give_cycle_txt_status;
                        this.cycle_txt_status=res.cycle_txt_status;
                        this.confirmLoading = false;
                        if(res.charge_rule_id > 0){
                            this.bill_date_str=res.bill_create_set;
                        }
                    })
            },
        },
    }
</script>
<style lang="less" scoped>

    /deep/ .prepaid_info .ant-form-item{
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }
    /deep/ .prepaid_info .label_col{
        margin-right: 30px !important;
        font-weight: bold !important;
    }
    /deep/ .prepaid_info .ant-form-item .ant-col-sm-13{
        width: 100% !important;
    }
    /deep/ .prepaid_info  .ant-upload-picture-card-wrapper{
        width: 15% !important;
    }
</style>