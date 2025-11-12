<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
        @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading" :height="800">
            <a-form :form="form" class="prepaid_info">

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="label_col ant-form-item-required">缴费类型</span>
                    <a-radio-group v-model="discount_type" @change="onChangeRadio" :default-value="discount_type" :disabled="is_disabled">
                        <a-radio :value="1" v-if="bill_date_set==2">
                            按月预缴
                        </a-radio>
                        <a-radio :value="2" v-if="bill_date_set==2">
                            按季度预缴
                        </a-radio>
                        <a-radio :value="3" v-if="bill_date_set==3">
                            按年预缴
                        </a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <div class="form_con">
                        <span class="label_col ant-form-item-required">预缴优惠到期时间</span>
                        <a-date-picker :mode="date_status" :format="dateFormat" placeholder="请选择时间" :default-value="dateValue ? moment(dateValue, dateFormat) : dateValue" v-model="dateValueStr" @change="selectDate" >
                        </a-date-picker>
                    </div>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true"
                    v-if="discount_type==1">
                    <div>
                        <span class="label_col ant-form-item-required">预缴时长</span>
                        <div v-for="(item,index) in monthlyChoice" :class="index==0 ? 'first_item' :'other_item'">
                            <a-select @change="handleChangeCycle"
                                style="width: 250px;margin-right: 10px;" v-model="monthlyChoice[index].num">
                                <a-select-option :value="item1.key" v-for="(item1,index1) in monthlyArr"
                                    :key="item1.key">
                                    {{item1.value}}
                                </a-select-option>
                            </a-select>
                            <a-input-number :min="0" :max="100" :precision="precision" :formatter="value => value>0 ? `${value} %`:'' "
                                style="width: 120px" placeholder="请输入折扣率" v-model="monthlyChoice[index].rate" />
                            <span class="icon_1" style="" @click="del_row('monthlyChoice',index)" v-if="index>0">
                                <a-icon type="minus" />
                            </span>
                        </div>
                    </div>

                    <div class="icon_1" @click="add_row('monthlyChoice')" style="margin: 10px 0px 10px 100px;"
                        v-if="monthlyChoice.length<12">
                        <a-icon type="plus" />
                    </div>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true"
                    v-if="discount_type==2">
                    <div>
                        <span class="label_col ant-form-item-required">预缴时长</span>
                        <div v-for="(item,index) in quarterlyChoice" :class="index==0 ? 'first_item' :'other_item'">
                            <a-select  @change="handleChangeCycle"
                                style="width: 250px;margin-right: 10px;" v-model="quarterlyChoice[index].num">
                                <a-select-option :value="item1.key" v-for="(item1,index1) in quarterlyArr"
                                    :key="item1.key">
                                    {{item1.value}}
                                </a-select-option>
                            </a-select>
                            <a-input-number :min="0" :max="100" :precision="precision" :formatter="value => value>0 ? `${value} %` :'' "
                                style="width: 120px" placeholder="请输入折扣率" v-model="quarterlyChoice[index].rate" />
                            <span class="icon_1" style="" @click="del_row('quarterlyChoice',index)" v-if="index>0">
                                <a-icon type="minus" />
                            </span>
                        </div>
                    </div>
                    <div class="icon_1" @click="add_row('quarterlyChoice')" style="margin: 10px 0px 10px 100px;"
                        v-if="quarterlyChoice.length<4">
                        <a-icon type="plus" />
                    </div>
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true"
                    v-if="discount_type==3">
                    <div>
                        <span class="label_col ant-form-item-required">预缴时长</span>
                        <div v-for="(item,index) in yearlyChoice" :class="index==0 ? 'first_item' :'other_item'">
                            <a-select  @change="handleChangeCycle"
                                style="width: 250px;margin-right: 10px;" v-model="yearlyChoice[index].num">
                                <a-select-option :value="item1.key" v-for="(item1,index1) in yearlyArr"
                                    :key="item1.key">
                                    {{item1.value}}
                                </a-select-option>
                            </a-select>
                            <a-input-number :min="0" :max="100" :precision="precision" :formatter="value => value>0 ? `${value} %` :''"
                                style="width: 120px" placeholder="请输入折扣率" v-model="yearlyChoice[index].rate" />
                            请输入折扣率
                            <span class="icon_1" style="padding-right: 1px;padding-left: 1px"
                                @click="del_row('yearlyChoice',index)" v-if="index>0">
                                <a-icon type="minus" />
                            </span>
                        </div>
                    </div>
                    <div class="icon_1" @click="add_row('yearlyChoice')" style="margin: 10px 0px 10px 100px;"
                        v-if="yearlyChoice.length<5">
                        <a-icon type="plus" />
                    </div>
                </a-form-item>

                <!--
                <a-form-item label=""  :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="label_col">状态</span>
                    <a-radio-group  >
                        <a-radio :value="1" >
                            开启
                        </a-radio>
                        <a-radio :value="2" >
                            禁止
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
                -->

            </a-form>
        </a-spin>
    </a-modal>
</template>
<script>
    import moment from 'moment';
    import villageApi from '@/api/community/village';
    import streetCommunityApi from '@/api/community/streetCommunity';
    export default {
        components: {},
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
                is_disabled: false,
                charge_rule_id:0,
                bill_date_set: 2,
                bill_date_str: '月',
                monthlyArr: [{
                    key: 1,
                    value: '1个月'
                }, {
                    key: 2,
                    value: '2个月'
                }, {
                    key: 3,
                    value: '3个月'
                }, {
                    key: 4,
                    value: '4个月'
                }, {
                    key: 5,
                    value: '5个月'
                }, {
                    key: 6,
                    value: '6个月'
                }, {
                    key: 7,
                    value: '7个月'
                }, {
                    key: 8,
                    value: '8个月'
                }, {
                    key: 9,
                    value: '9个月'
                }, {
                    key: 10,
                    value: '10个月'
                }, {
                    key: 11,
                    value: '11个月'
                }, {
                    key: 12,
                    value: '12个月'
                }],
                monthlyChoice: [{
                    num: 1,
                    id: 0,
                    rate: ''
                }],
                quarterlyArr: [{
                    key: 1,
                    value: '1个季度'
                }, {
                    key: 2,
                    value: '2个季度'
                }, {
                    key: 3,
                    value: '3个季度'
                }, {
                    key: 4,
                    value: '4个季度'
                }],
                quarterlyChoice: [{
                    num: 1,
                    id: 0,
                    rate: ''
                }],
                yearlyArr: [{
                    key: 1,
                    value: '1年'
                }, {
                    key: 2,
                    value: '2年'
                }, {
                    key: 3,
                    value: '3年'
                }, {
                    key: 4,
                    value: '4年'
                }, {
                    key: 5,
                    value: '5年'
                }],
                yearlyChoice: [{
                    num: 1,
                    id: 0,
                    rate: ''
                }],
                discount_type: 1,
                date_status: 'date',
                dateFormat: 'YYYY-MM-DD',
                dateValue: null,
                dateValueStr: '',
                idd: 0,
                charge_project_id:0,
                precision:0,
            }
        },
        mounted() {},
        methods: {

            moment,
            selectDate(date, dateString) {
                this.dateValue = date;
                this.dateValueStr=dateString;
                console.log(dateString,date);
            },
            onChangeRadio(ee) {
                console.log('ee', ee);
            },
            handleChangeCycle(ee) {
                console.log('cycle', ee)
            },

            del_row(type, index) {
                if (type == 'monthlyChoice') {
                    this.monthlyChoice.splice(index, 1)
                } else if (type == 'quarterlyChoice') {
                    this.quarterlyChoice.splice(index, 1)
                } else if (type == 'yearlyChoice') {
                    this.yearlyChoice.splice(index, 1)
                }
            },
            add_row(type) {
                let addobj = {
                    num: 1,
                    id: 0
                };
                if (type == 'monthlyChoice') {
                    let index_num = this.monthlyChoice.length;
                    this.monthlyChoice.push(addobj)
                } else if (type == 'quarterlyChoice') {
                    let index_num = this.quarterlyChoice.length;
                    this.quarterlyChoice.push(addobj)
                } else if (type == 'yearlyChoice') {
                    let index_num = this.yearlyChoice.length;
                    this.yearlyChoice.push(addobj)
                }
            },

            add(charge_rule_id = 0, bill_date_set=2,charge_project_id=0) {
                this.charge_rule_id = charge_rule_id;
                this.charge_project_id = charge_project_id;
                this.bill_date_set = bill_date_set;
                this.discount_type = 1;
                this.idd = 0;
                if (bill_date_set == 1) {
                    this.bill_date_str = '日';
                } else if (bill_date_set == 2) {
                    this.bill_date_str = '月';
                } else if (bill_date_set == 3) {
                    this.bill_date_str = '年';
                    this.discount_type = 3;
                }
                this.title = '添加预缴优惠';
                this.visible = true;
                this.is_disabled = false;
                this.getPrecisionNum();
            },

            edit(id,charge_rule_id=0,bill_date_set=0,charge_project_id=0) {
                this.idd=id;
                this.bill_date_set = bill_date_set;
                this.charge_rule_id = charge_rule_id;
                this.charge_project_id = charge_project_id;
                this.discount_type = 1;
                if (bill_date_set == 1) {
                    this.bill_date_str = '日';
                } else if (bill_date_set == 2) {
                    this.bill_date_str = '月';
                } else if (bill_date_set == 3) {
                    this.bill_date_str = '年';
                    this.discount_type = 3;
                }
                this.title = '编辑预缴优惠';
                this.visible = true;
                this.is_disabled = true;
                this.getPrecisionNum();
                this.getEditInfo();
            },
            getPrecisionNum(){
                //查询折扣率小数点位数
                this.request(villageApi.getPrecisionNum)
                    .then((res) => {
                        this.precision = res.precision
                    })
            },
            handleSubmit() {
                let postData={};
                postData.id=this.idd;
                if(!this.dateValue || this.dateValue.length<7){
                    this.$message.warn('请正确选择预缴优惠到期时间！');
                    return false;
                }
                postData.expire_time=this.dateValueStr;
                postData.discount_type=this.discount_type;
                postData.bill_date_set=this.bill_date_set;
                postData.charge_rule_id=this.charge_rule_id;
                postData.charge_project_id= this.charge_project_id;
                postData.prepayment='';
                let prepaymentdata='';
                if(this.discount_type==1){
                    prepaymentdata=this.monthlyChoice;
                }else if(this.discount_type==2){
                    prepaymentdata=this.quarterlyChoice;
                }else if(this.discount_type==3){
                    prepaymentdata=this.yearlyChoice;
                }
                if(prepaymentdata.length<1){
                    this.$message.warn('预缴时长设置错误，请检查设置！');
                    return false;
                }
                let err_msg_tips='';
                let numArr=[];
                for(let ii=0;ii<prepaymentdata.length;ii++){
                    if(prepaymentdata[ii].num*1<1){
                        err_msg_tips='第'+(ii+1)+'个预缴时长时间选择错误！';
                        break;
                    }
                    if(!prepaymentdata[ii].rate || (prepaymentdata[ii].rate*1>=100 ||prepaymentdata[ii].rate*1<=0)){
                        err_msg_tips='第'+(ii+1)+'个预缴时长折扣率设置错误，请设置成0到100之间的数字！';
                        break;
                    }
                    if(numArr.length<1 || !numArr.includes(prepaymentdata[ii].num)){
                        numArr.push(prepaymentdata[ii].num);
                    }else if(numArr.includes(prepaymentdata[ii].num)){
                        err_msg_tips='第'+(ii+1)+'个预缴时长时间已经设置过了！';
                        break;
                    }
                }
                if(err_msg_tips){
                    this.$message.warn(err_msg_tips);
                    return false;
                }
                postData.prepayment=prepaymentdata;
                console.log('postData',postData);

                this.confirmLoading = true;
                this.request(villageApi.saveHouseNewChargePrepaidDiscount, postData)
                    .then((res) => {
                        if (this.idd > 0) {
                            this.$message.success('编辑成功')
                        } else {
                            this.idd=res;
                            this.$message.success('添加成功')
                        }
                        setTimeout(() => {
                            this.form = this.$form.createForm(this)
                            this.visible = false
                            this.confirmLoading = false
                            this.$emit('ok',this.idd);
                        }, 1000)
                        
                    })
                    .catch((error) => {
                        console.log('error',error);
                        this.confirmLoading = false
                    })
            },
            handleCancel() {
                this.visible = false
                this.discount_type = 1;
                this.idd = 0;
                this.monthlyChoice = [{
                    num: 1,
                    key: 0,
                    rate: ''
                }];
                this.quarterlyChoice = [{
                    num: 1,
                    key: 0,
                    rate: ''
                }];
                this.yearlyChoice = [{
                    num: 1,
                    key: 0,
                    rate: ''
                }];
                this.dateValue = null;
                setTimeout(() => {
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            getEditInfo() {
                this.confirmLoading = true;
                this.request(villageApi.chargePrepaidDiscountEdit, {
                        id:this.idd,
                        charge_rule_id : this.charge_rule_id,
                        charge_project_id :this.charge_project_id,
                        bill_date_set : this.bill_date_set,
                    })
                    .then((res) => {
                        this.dateValueStr=res.expire_time_str;
                        this.dateValue=res.expire_time_str;
                        this.discount_type=res.discount_type;
                        if(this.discount_type==1){
                            this.monthlyChoice=res.sublist;
                        }else if(this.discount_type==2){
                            this.quarterlyChoice=res.sublist;
                        }else if(this.discount_type==3){
                            this.yearlyChoice=res.sublist;
                        }
                        this.confirmLoading = false;
                    })
            },
        },
    }
</script>
<style lang="less" scoped>
    /deep/ .prepaid_info .ant-form-item {
        margin-left: 30px !important;
        margin-bottom: 15px !important;
    }

    /deep/ .prepaid_info .label_col {
        margin-right: 30px !important;
        font-weight: bold !important;
    }

    /deep/ .prepaid_info .ant-form-item .ant-col-sm-13 {
        width: 100% !important;
    }

    /deep/ .prepaid_info .ant-upload-picture-card-wrapper {
        width: 15% !important;
    }

    .first_item {
        display: inline-block;
    }

    .other_item {
        display: flex;
        margin-left: 98px;
        margin-top: 12px;
    }

    .icon_1 {
        margin-left: 25px;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #999999;
        cursor: pointer;
    }
</style>
