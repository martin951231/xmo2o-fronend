<template>
    <a-modal :title="title" :width="840" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit"
        @cancel="handleCancelModel">
        <a-spin :spinning="confirmLoading">
            <a-form :form="form" style="max-height: 600px; overflow-y: scroll">
                <a-form-item label="券名称" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input placeholder="请输入券名称" v-model="formData.name" />
                </a-form-item>

                <a-form-item label="消费券金额" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input placeholder="请输入券金额" v-model="formData.coupon_price" />
                </a-form-item>

                <a-form-model-item label="可核销时间段" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-time-picker :allowClear='checkStatus' style="width: 180px;"
                        :value="moment(start_time, 'HH:mm:ss')" @change="onCycleStimeeRangeChange" />
                    <span>-</span>
                    <a-time-picker :allowClear='checkStatus' style="width: 180px;" :value="moment(end_time, 'HH:mm:ss')"
                        @change="onCycleEtimeeRangeChange" :getPopupContainer="
              triggerNode => {
                  return triggerNode.parentNode
              }" />
                </a-form-model-item>

                <a-form-item label="可核销的数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="请输入可核销的数量" v-model="formData.send_num" />
                </a-form-item>

                <a-form-item label="核销的时扣除的余额" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input placeholder="请输入核销的时扣除的余额" v-model="formData.money" />
                </a-form-item>

                <a-form-item label="优惠券金额(未核销转积分数量)" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input placeholder="请输入优惠券金额(未核销转积分数量)" v-model="formData.add_score_num" />
                </a-form-item>
                <a-form-item label="转换积分时需扣除的金额" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-input placeholder="请输入转换积分时需扣除的金额" v-model="formData.deduct_money" />
                </a-form-item>
                
                <a-form-model-item label="自动转积分时间" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                     <a-time-picker  :value="moment(overdue_time, 'HH:mm:ss')" @change="onOverdueChange" />
                  </a-form-model-item>
                
                <a-form-item label="选择发券员工身份标签" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    
                    <a-select
                        mode="multiple"
                        v-model="formData.label_ids"
                      >
                        <a-select-option v-for="(item,index) in label_list" :key="item.id">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                     
                </a-form-item>
                <a-form-item label="选择发券时间" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    
                     <a-button type="primary" @click="$refs.setCalendarModel.setCalendar(formData.pigcms_id)" size="small">
                          日历设置
                        </a-button>
                     
                </a-form-item>
                <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-switch checked-children="开" un-checked-children="关" :checked="formData.status == 1? true: false"
                        @change="isStatusChange" />
                </a-form-item> 
                <a-form-item label="是否开启自动转积分" :labelCol="labelCol" :wrapperCol="wrapperCol" :required="true">
                    <a-switch checked-children="开" un-checked-children="关" :checked="formData.is_auto_turn_score == 1? true: false"
                        @change="isAutoChange" />
                </a-form-item>
            </a-form>
        </a-spin>
        <set-calendar ref="setCalendarModel"  @setCalendarData="setCalendarData" />
    </a-modal>
</template>

<script>
    import lifeToolsPlatformApi from '@/api/employee/merchant/index'
    import moment from 'moment';
    import SetCalendar from './setCalendar'
    export default {
        name: "editCoupon",
        components: {
          SetCalendar
        },
        data() {
            return {
                checkStatus: false,
                title: '添加优惠券',
                start_time: null,
                end_time: null,
                overdue_time: null,
                formData: { //表单数据
                    pigcms_id: 0, //ID'
                    card_id: 0, // '标题'
                    name: "", //标签多个空格分割'
                    start_time: '00:00:00', //'开始时间'
                    end_time: '00:00:00', // '活动结束时间'
                    send_num: 0,
                    money: 0,
                    add_score_num: 0,
                    deduct_money: 0,
                    status: 0,
                    coupon_price: 0,
                    label_ids: [],
                    overdue_time: "00:00:00",
                    is_auto_turn_score: 0
                },
                visible: false,
                labelCol: {
                    xs: {
                        span: 24
                    },
                    sm: {
                        span: 8
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
                label_list:[],
                form: this.$form.createForm(this, {
                    name: 'coordinated'
                }),
            }
        },
        methods: {
            moment,
            edit(id, card_id) { 
                
                
                if (id == 0) {
                    this.title = "添加优惠券";
                    this.formData = { //表单数据
                        pigcms_id: 0, //ID'
                        card_id: card_id, // '标题'
                        name: "", //标签多个空格分割'
                        start_time: "00:00:00", //'开始时间'
                        end_time: '00:00:00', // '活动结束时间'
                        send_num: 0,
                        money: 0,
                        add_score_num: 0,
                        deduct_money: 0,
                        status: 0,
                        coupon_price: 0,
                        label_ids: [],
                        overdue_time: "00:00:00",
                        is_auto_turn_score: 0
                    }
                    this.start_time = "00:00:00"
                    this.end_time = "00:00:00"
                    this.overdue_time = "00:00:00"
                    this.$set(this, 'end_time', this.end_time)
                    this.$set(this, 'start_time', this.start_time)
                    this.$set(this, 'overdue_time', this.overdue_time)
                    this.$set(this, 'formData', this.formData)
                    this.getLabelList();
                    this.visible = true
                }else{
                    this.request(lifeToolsPlatformApi.editCoupon, {
                        pigcms_id: id
                    }).then((res) => {
                        this.getLabelList();
                        Object.assign(this.$data, this.$options.data.call(this))
                        this.confirmLoading = false
                        
                        if (res.pigcms_id) {
                            this.title = "编辑优惠券";
                            this.start_time = res.start_time
                            this.end_time = res.end_time
                            this.overdue_time = moment(res.overdue_time, "HH:ii:ss")
                            this.$set(this, 'end_time', this.end_time)
                            this.$set(this, 'start_time', this.start_time)
                            this.$set(this, 'overdue_time', this.overdue_time)
                            this.$set(this, 'formData', res)
                        }
                        
                        this.visible = true
                    })
                }
                
                
                
                
                
                
                
                
                
            },
            isStatusChange(value) {
                this.formData.status = value ? 1 : 0;
            },
            isAutoChange(value) {
                this.formData.is_auto_turn_score = value ? 1 : 0;
            },
            // 监听按周期开始日期选择变化
            onCycleStimeeRangeChange(date, dateString) {
                this.$set(this, 'start_time', dateString)
                // 更新表单数据
                this.$set(this.formData, 'start_time', dateString)
            },
            onOverdueChange(date, dateString) {
                this.$set(this, 'overdue_time', dateString)
                // 更新表单数据
                this.$set(this.formData, 'overdue_time', dateString)
            },
            // 监听按周期结束日期选择变化
            onCycleEtimeeRangeChange(date, dateString) {
                // 更新表单数据
                this.$set(this, 'end_time', dateString)
                this.$set(this.formData, 'end_time', dateString)
            },
            handleSubmit() {
                if (this.formData.name == "") {
                    this.$message.error('券名称必填')
                    return false;
                }
                /*if(this.formData.start_time=="00:00:00" || this.formData.end_time=="00:00:00"){
                    this.$message.error('时间必填')
                    return false;
                }*/

                this.request(lifeToolsPlatformApi.saveCoupon, this.formData).then((res) => {
                    this.formData.start_time = this.formData.end_time = moment("00:00:00")
                    this.$message.success('成功')
                    this.visible = false
                    this.$emit('getSportList')
                })
            },
            handleCancelModel() {
                this.visible = false
                this.formData.start_time = this.formData.end_time = "00:00:00"
                this.$emit('getSportList')
            },
            handleSelectLabel(val){
                console.log(val)
                this.formData.labels = val;
                console.log(this.formData.labels)
            },
            getLabelList(){
                this.request(lifeToolsPlatformApi.getLabelList).then((res)=>{
                    this.label_list = res 
                })
                
            },
            setCalendarData(data){
                this.formData.send_by = data.send_by;
                this.formData.send_dates = data.send_dates;
                this.formData.send_week = data.send_week;
                this.formData.clickDates = data.clickDateList;
            }
        }
    }
</script>

<style scoped>

</style>
