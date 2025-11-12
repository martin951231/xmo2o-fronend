<template>
    <a-modal :title="title" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"
        @ok="handleSubmit" @cancel="handleCancel">
        <a-spin :spinning="confirmLoading" :height="800">
            <a-form :form="form" class="prepaid_info">
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="label_col ant-form-item-required">优惠类型</span>
                    <a-radio-group v-model="order_discount_type" @change="onChangeRadio" :default-value="order_discount_type" :disabled="is_disabled">
                        <a-radio :value="1" v-if="project_cycle_type==2 && had_order_discount_type!=2 && func_kaidalaicn_special<1">
                            账单月数优惠
                        </a-radio>
                        <a-radio :value="3" v-if="func_kaidalaicn_special==1">
                            账单欠费缴费优惠
                        </a-radio>
                        <a-radio :value="2" v-if="had_order_discount_type!=1">
                            账单提前缴费优惠
                        </a-radio>

                    </a-radio-group>
                </a-form-item>
                
                <div class="order_discount_type1" v-if="order_discount_type*1==1">
                    
                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <span class="label_col ant-form-item-required">缴费类型</span>
                    
                        <a-select @change="onChangeSelect"
                            style="width: 250px;margin-right: 10px;" v-model="discount_type" :default-value="discount_type" :disabled="is_disabled">
                            <a-select-option :value="1" :key="1" v-if="bill_date_set==2" >按月预缴</a-select-option>
                            <a-select-option :value="2" :key="1" v-if="bill_date_set==2" >按季度预缴</a-select-option>
                            <a-select-option :value="3" :key="1" v-if="bill_date_set==3" >按年预缴</a-select-option>
                        </a-select>
                   
                </a-form-item>

                <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <div class="form_con">
                        <span class="label_col ant-form-item-required">预缴优惠到期时间</span>
                        <a-date-picker :mode="date_status" :format="dateFormat" placeholder="请选择时间" :default-value="dateValue ? moment(dateValue, dateFormat) : dateValue" v-model="dateValueStr" @change="selectDate" >
                        </a-date-picker>
                    </div>
                </a-form-item>
                    <div style="padding: 1px 1px 20px 30px;color: #ff6000;">温馨提示：折扣率是以百分比计算的，请输入0-100（0和100表示没有优惠）。例如输入80，则按价格的80%进行计算，优惠掉价格的20%</div>
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
                            <a-input-number :min="0" :max="100" :precision="2" :formatter="value => value>0 ? `${value} %`:'' "
                                style="width: 120px" placeholder="请输入折扣率" v-model="monthlyChoice[index].rate" />
                            <span class="icon_1" style="" @click="del_row('monthlyChoice',index)" v-if="index>0">
                                <a-icon type="minus" />
                            </span>
                        </div>
                    </div>

                    <div class="icon_1" @click="add_row('monthlyChoice')" style="margin: 10px 0px 10px 205px;"
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
                            <a-input-number :min="0" :max="100" :precision="2" :formatter="value => value>0 ? `${value} %` :'' "
                                style="width: 120px" placeholder="请输入折扣率" v-model="quarterlyChoice[index].rate" />
                            <span class="icon_1" style="" @click="del_row('quarterlyChoice',index)" v-if="index>0">
                                <a-icon type="minus" />
                            </span>
                        </div>
                    </div>
                    <div class="icon_1" @click="add_row('quarterlyChoice')" style="margin: 10px 0px 10px 205px;"
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
                            <a-input-number :min="0" :max="100" :precision="2" :formatter="value => value>0 ? `${value} %` :''"
                                style="width: 120px" placeholder="请输入折扣率" v-model="yearlyChoice[index].rate" />
                            请输入折扣率
                            <span class="icon_1" style="padding-right: 1px;padding-left: 1px"
                                @click="del_row('yearlyChoice',index)" v-if="index>0">
                                <a-icon type="minus" />
                            </span>
                        </div>
                    </div>
                    <div class="icon_1" @click="add_row('yearlyChoice')" style="margin: 10px 0px 10px 205px;"
                        v-if="yearlyChoice.length<5">
                        <a-icon type="plus" />
                    </div>
                </a-form-item>
                
                </div>
                <div class="order_discount_type2"  v-if="order_discount_type*1==2">
                    <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <span class="label_col ant-form-item-required">满足账单优惠{{unitStr}}数</span>
                        
                            <a-select @change="onChangeSelect"
                                style="width: 250px;margin-right: 10px;" v-model="con_num" :default-value="con_num" :disabled="is_disabled">
                                <a-select-option v-for="o_num in order_num"
                                        :value="o_num" :key="o_num">{{o_num}}{{unit2Str}}</a-select-option>
                            </a-select>
                       
                    </a-form-item>
                    <!--
                    <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <div class="form_con">
                            <span class="label_col">提前缴费优惠到期时间</span>
                            <a-date-picker :mode="date_status" :format="dateFormat" placeholder="请选择时间" :default-value="dateValue ? moment(dateValue, dateFormat) : dateValue" v-model="dateValueStr" @change="selectDate" >
                            </a-date-picker>
                        </div>
                    </a-form-item>
                    -->
                    <div style="padding: 1px 1px 20px 30px;color: #ff6000;">温馨提示：折扣率是以百分比计算的，请输入0-100（0和100表示没有优惠）。例如输入80，则按价格的80%进行计算，优惠掉价格的20%</div>
                    <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                        <div>
                            <span class="label_col ant-form-item-required">提前缴费时间</span>
                            <div v-for="(item,index) in forwardChoice" :class="index==0 ? 'first_item' :'other_item'">
                                <!--
                                <a-select @change="onChangeSelect"
                                    style="width: 250px;margin-right: 10px;" v-model="forwardChoice[index].num" >
                                    <a-select-option v-for="o_num in order_num"
                                            :value="o_num" :key="o_num">{{o_num}}月</a-select-option>
                                </a-select>
                                -->
                                <span class="icon_22"  @click="add_day(index)">
                                    <a-icon type="plus" />
                                </span>
                                <a-input-number :min="0" :max="9999" :precision="0" :formatter="value => value>0 ? `${value}`:'' "
                                    style="width: 150px;margin-right:5px;" placeholder="请输入提前天数" v-model="forwardChoice[index].num" />天
                                <span class="icon_22" style="margin-right: 20px;" @click="del_day(index)" >
                                    <a-icon type="minus" />
                                </span>
                                    
                                <a-input-number :min="0" :max="100" :precision="2" :formatter="value => value>0 ? `${value} %`:'' "
                                    style="width: 130px" placeholder="请输入折扣率" v-model="forwardChoice[index].rate" />
                                <span class="icon_1" style="" @click="del_row('forwardChoice',index)" v-if="index>0">
                                    <a-icon type="minus" />
                                </span>
                            </div>
                        </div>
                    
                        <div class="icon_1" @click="add_row('forwardChoice')" style="margin: 10px 0px 10px 205px;"
                            v-if="forwardChoice.length<12">
                            <a-icon type="plus" />
                        </div>
                    </a-form-item>
                    
               </div>
               
               <div class="order_discount_type2"  v-if="order_discount_type*1==3">
                    <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
                        <span class="label_col ant-form-item-required">欠费时长计算类型</span>
                        
                            <a-select @change="onChangeType3Select"
                                style="width: 250px;margin-right: 10px;" v-model="discount_type" :default-value="discount_type" :disabled="is_disabled">
                                <a-select-option v-for="(item3,index3) in oweTypeArr"
                                        :value="item3.xkey" :key="item3.xkey">{{item3.xvalue}}</a-select-option>
                            </a-select>
                       
                    </a-form-item>
                    <div style="padding: 1px 1px 20px 30px;color: #ff6000;">温馨提示：
                        <div>1、按月计算：每个月是按照30天计算的，按周计算：每个周是按照7天计算的</div>
                        <div>2、折扣率是以百分比计算的，请输入0-100（0和100表示没有优惠）。例如输入80，则按价格的80%进行计算，优惠掉价格的20%</div>
                   
                    </div>
                    <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                        <div>
                            <span class="label_col ant-form-item-required">欠费时长优惠</span>
                            <div v-for="(item,index) in forwardChoice" :class="index==0 ? 'first_item' :'other_item'">
                                <!--
                                <a-select @change="onChangeSelect"
                                    style="width: 250px;margin-right: 10px;" v-model="forwardChoice[index].num" >
                                    <a-select-option v-for="o_num in order_num"
                                            :value="o_num" :key="o_num">{{o_num}}月</a-select-option>
                                </a-select>
                                -->
                                <span class="icon_22"  @click="add_day(index)">
                                    <a-icon type="plus" />
                                </span>
                                <a-input-number :min="0" :max="9999" :precision="0" :formatter="value => value>0 ? `${value}`:'' "
                                    style="width: 150px;margin-right:5px;" placeholder="请输入欠费时间" v-model="forwardChoice[index].num" />{{unit3Str}}
                                <span class="icon_22" style="margin-right: 20px;" @click="del_day(index)" >
                                    <a-icon type="minus" />
                                </span>
                                    
                                <a-input-number :min="0" :max="100" :precision="2" :formatter="value => value>0 ? `${value} %`:'' "
                                    style="width: 130px" placeholder="请输入折扣率" v-model="forwardChoice[index].rate" />
                                <span class="icon_1" style="" @click="del_row('forwardChoice',index)" v-if="index>0">
                                    <a-icon type="minus" />
                                </span>
                            </div>
                        </div>
                    
                        <div class="icon_1" @click="add_row('forwardChoice')" style="margin: 10px 0px 10px 205px;"
                            v-if="forwardChoice.length<12">
                            <a-icon type="plus" />
                        </div>
                    </a-form-item>
                    
               </div>
               
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
                forwardChoice: [{
                    num: 1,
                    id: 0,
                    rate: '',
                    type:'day',
                }],
                discount_type: 1,
                date_status: 'date',
                dateFormat: 'YYYY-MM-DD',
                dateValue: null,
                dateValueStr: '',
                idd: 0,
                charge_project_id:0,
                project_cycle_type:0,
                order_discount_type:1,
                order_num:24,
                unitStr:'月',
                unit2Str:'个月',
                con_num:1,
                con_type:1,
                had_order_discount_type:0,
                func_kaidalaicn_special:0,
                oweTypeArr:[{'xkey':1,'xvalue':'按月计算'},{'xkey':5,'xvalue':'按周计算'},{'xkey':4,'xvalue':'按天计算'}],
                unit3Str:'个月',
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
                if(this.func_kaidalaicn_special==1){
                    this.forwardChoice=[{
                        num: 1,
                        id: 0,
                        rate: '',
                        type:'day',
                    }]
                }
            },
            onChangeSelect(ee){
                console.log('select', ee);
            },
            handleChangeCycle(ee) {
                console.log('cycle', ee)
            },
            onChangeType3Select(ee){
                this.discount_type=this.discount_type*1;
                if(this.discount_type==1){
                    this.unit3Str='个月';
                }else if(this.discount_type==5){
                    this.unit3Str='周';
                }else if(this.discount_type==4){
                    this.unit3Str='天';
                }
            },
            add_day(index){
                if(this.forwardChoice[index] !=undefined){
                    ++this.forwardChoice[index].num;
                }
            },
            del_day(index){
                if(this.forwardChoice[index] !=undefined){
                    --this.forwardChoice[index].num;
                }
            },
            del_row(type, index) {
                if (type == 'monthlyChoice') {
                    this.monthlyChoice.splice(index, 1)
                } else if (type == 'quarterlyChoice') {
                    this.quarterlyChoice.splice(index, 1)
                } else if (type == 'yearlyChoice') {
                    this.yearlyChoice.splice(index, 1)
                }else if(type=='forwardChoice'){
                    this.forwardChoice.splice(index, 1)
                }
            },
            add_row(type) {
                let addobj = {
                    num: 1,
                    id: 0,
                    rate:'',
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
                }else if(type=='forwardChoice'){
                    addobj.type='day';
                    this.forwardChoice.push(addobj)
                }
            },

            add(charge_rule_id = 0, bill_date_set=2,charge_project_id=0,project_cycle_type=0,had_order_discount_type=0,other_info='') {
                this.iniDatas();
                this.charge_rule_id = charge_rule_id;
                this.charge_project_id = charge_project_id;
                this.bill_date_set = bill_date_set;
                this.discount_type = 1;
                this.con_type=1;
                this.project_cycle_type=project_cycle_type;
                this.had_order_discount_type=had_order_discount_type;
                if(had_order_discount_type>0){
                    this.order_discount_type=had_order_discount_type;
                }
                if(this.project_cycle_type!=2){
                    this.order_discount_type=2;
                    this.unitStr='笔';
                    this.unit2Str='笔';
                    this.con_type=2;
                }
                if(other_info && typeof(other_info) === "object"  && other_info.func_kaidalaicn_special!=undefined){
                    this.func_kaidalaicn_special=other_info.func_kaidalaicn_special*1;
                }
                if(this.func_kaidalaicn_special==1){
                    this.order_discount_type=3;
                }
                this.idd = 0;
                if (bill_date_set == 1) {
                    this.bill_date_str = '日';
                } else if (bill_date_set == 2) {
                    this.bill_date_str = '月';
                } else if (bill_date_set == 3) {
                    this.bill_date_str = '年';
                    this.discount_type = 3;
                }
                this.title = '添加账单优惠';
                this.visible = true;
                this.is_disabled = false;
            },

            edit(id,charge_rule_id=0,bill_date_set=0,charge_project_id=0,project_cycle_type=0,had_order_discount_type=0,other_info='') {
                this.iniDatas();
                this.idd=id;
                this.bill_date_set = bill_date_set;
                this.charge_rule_id = charge_rule_id;
                this.charge_project_id = charge_project_id;
                this.discount_type = 1;
                this.con_type=1;
                this.project_cycle_type=project_cycle_type;
                this.had_order_discount_type=had_order_discount_type;
                if(had_order_discount_type>0){
                    this.order_discount_type=had_order_discount_type;
                }
                if(this.project_cycle_type!=2){
                    this.order_discount_type=2;
                    this.unitStr='笔';
                    this.unit2Str='笔';
                    this.con_type=2;
                }
                if(other_info && typeof(other_info) === "object"  && other_info.func_kaidalaicn_special!=undefined){
                    this.func_kaidalaicn_special=other_info.func_kaidalaicn_special*1;
                    this.order_discount_type=had_order_discount_type;
                }
                if (bill_date_set == 1) {
                    this.bill_date_str = '日';
                } else if (bill_date_set == 2) {
                    this.bill_date_str = '月';
                } else if (bill_date_set == 3) {
                    this.bill_date_str = '年';
                    this.discount_type = 3;
                }
                this.title = '编辑账单优惠';
                this.visible = true;
                this.is_disabled = true;
                this.getEditInfo();
            },
            handleSubmit() {
                let postData={};
                postData.id=this.idd;
                if(!this.dateValue || this.dateValue.length<7){
                
                    if(this.order_discount_type*1!=2 && this.order_discount_type*1!=3){
                        this.$message.warn('请正确选择账单优惠到期时间！');
                        return false;
                    }
                    
                }
                postData.order_discount_type=this.order_discount_type;
                postData.project_cycle_type=this.project_cycle_type;
                postData.con_num=this.con_num;
                postData.con_type=this.con_type;
                postData.expire_time=this.dateValueStr;
                postData.discount_type=this.discount_type;
                postData.bill_date_set=this.bill_date_set;
                postData.charge_rule_id=this.charge_rule_id;
                postData.charge_project_id= this.charge_project_id;
                postData.prepayment='';
                let prepaymentdata='';
                let msg_err='预缴时长';
                let msg_err2='时间选择';
                this.forwardType=0;
                if(this.order_discount_type*1==2){
                     prepaymentdata=this.forwardChoice;
                     msg_err='提前缴费';
                     msg_err2='天数填写';
                     postData.discount_type=4;  //按日
                }else if(this.order_discount_type*1==3){
                    prepaymentdata=this.forwardChoice;
                    msg_err='欠费时长优惠';
                    msg_err2='欠费时间';
                    postData.con_type=3;
                    postData.con_num=0;
                }else{
                    if(this.discount_type==1){
                        prepaymentdata=this.monthlyChoice;
                    }else if(this.discount_type==2){
                        prepaymentdata=this.quarterlyChoice;
                    }else if(this.discount_type==3){
                        prepaymentdata=this.yearlyChoice;
                    }
                }
               
                if(prepaymentdata.length<1){
                    this.$message.warn(msg_err+'设置错误，请检查设置！');
                    return false;
                }
                let err_msg_tips='';
                let numArr=[];
                for(let ii=0;ii<prepaymentdata.length;ii++){
                    if(prepaymentdata[ii].num*1<1){
                        err_msg_tips='第'+(ii+1)+'个'+msg_err+msg_err2+'错误！';
                        break;
                    }
                    if(!prepaymentdata[ii].rate || (prepaymentdata[ii].rate*1>=100 ||prepaymentdata[ii].rate*1<=0)){
                        err_msg_tips='第'+(ii+1)+'个'+msg_err+'折扣率设置错误，请设置成0到100之间的数字！';
                        break;
                    }
                    if(numArr.length<1 || !numArr.includes(prepaymentdata[ii].num)){
                        numArr.push(prepaymentdata[ii].num);
                    }else if(numArr.includes(prepaymentdata[ii].num)){
                        err_msg_tips='第'+(ii+1)+'个'+msg_err+'时间已经设置过了！';
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
            iniDatas(){
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
                this.forwardChoice=[{
                    num: 1,
                    key: 0,
                    rate: ''
                }];
                this.dateValue = null;
                this.dateValueStr='';
                this.unitStr='月';
                this.unit2Str='个月';
                this.con_num=1;
                this.con_type=1;
            },
            handleCancel() {
                this.visible = false
                this.iniDatas();
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
                        if(res.order_discount_type!= undefined && res.order_discount_type==2||res.order_discount_type==3){
                            this.con_num=res.con_num;
                            this.con_type=res.con_type;
                            this.forwardChoice=res.sublist;
                            if(res.order_discount_type==3){
                                this.onChangeType3Select('');
                            }
                        }else{
                          if(this.discount_type==1){
                              this.monthlyChoice=res.sublist;
                          }else if(this.discount_type==2){
                              this.quarterlyChoice=res.sublist;
                          }else if(this.discount_type==3){
                              this.yearlyChoice=res.sublist;
                          }  
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
        .icon_22 {
            margin: 0 5px;
            width: 30px;
            height: 30px;
            display:  inline-block;
            text-align: center;
            line-height: 30px;
            border: 1px solid #999999;
            cursor: pointer;
            background-color: #eee;
        }
    }

    .other_item {
        display: flex;
        margin-left: 98px;
        margin-top: 12px;
        .icon_22 {
            margin: 0 5px;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #999999;
            cursor: pointer;
            background-color: #eee;
        }
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
    .ant-form-item-required{
            width: 176px;
            display: inline-block;
    }
    .other_item{
        margin-left: 205px;
    }
</style>
