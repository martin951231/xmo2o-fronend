<template>
    <a-modal :title="title" :width="800" :height="300" :visible="visible" @cancel="closeWindow"   ok-text="确认" cancel-text="取消" @ok="returnClick">

        <a-row>
            <span>发券类型： </span>
            <a-radio-group v-model="returnParams.send_by" @change="sendBySelect">
                <a-radio :value="0">
                    每天
                </a-radio>
                <a-radio :value="1">
                    按周
                </a-radio>
                <a-radio :value="2">
                    按时间段
                </a-radio>
            </a-radio-group>
        </a-row>
        <a-row v-if="returnParams.send_by == 0" style="width: 100%; height: 40px;padding-top: 20px;">
            
        </a-row>
        <a-row v-if="returnParams.send_by == 1" style="width: 100%; height: 40px;padding-top: 20px;">
            <a-checkbox-group  v-model="returnParams.send_week" @change="selectWeek">
                <a-checkbox v-for="(item,index) in weekMap" :value="item.key">
                      周{{item.value}}
                </a-checkbox>
            </a-checkbox-group>
        </a-row>
        
        <a-row v-if="returnParams.send_by == 2" style="width: 100%; height: 40px;padding-top: 20px;">
          <a-range-picker :value="send_dates"  @change="handleChange"/>
        </a-row>
        
        
        <a-row style="margin-top: 0px;">
            <calendar @panelChange="onPanelChange" @select="selectDate" :fullscreen="false">
                <template slot="dateCellRender" slot-scope="value">
                    <span v-if="isSendCoupon(value)" style="font-size: 12px;line-height: 21px; color:#0FB70F">发券</span>
                    <span v-else style="font-size: 12px;line-height: 21px; color: red"></span>
                </template>
            </calendar>
        </a-row>


    </a-modal>
</template>
<script>
    import {
        Calendar
    } from 'ant-design-vue'
    import moment from 'moment'
    import lifeMerchantApi from '@/api/employee/merchant/index'
    const plainOptions = [];
    const defaultCheckedList = [];
    export default {
        components: {
            Calendar
        },
        data() {
            return {
                title: "设置发券日期",
                //是否显示弹窗
                visible: false,
                pigcms_id: 0,
                dateList: {},
                send_dates: null,
                returnParams: {
                    send_by: 0,
                    send_week:[],
                    send_dates: [],
                    clickDateList: {}
                },
                plainOptions,
                checkedList: defaultCheckedList,
                indeterminate: true,
                checkAll: false,
                weekMap: [
                    {key: 1, value: "一"},
                    {key: 2, value: "二"},
                    {key: 3, value: "三"},
                    {key: 4, value: "四"},
                    {key: 5, value: "五"},
                    {key: 6, value: "六"},
                    {key: 0, value: "日"},
                ],
                time: 0,
                is_edit: false
            }
        },
        methods: {
            moment,
            //关闭窗口
            closeWindow() {
                this.visible = false
            },
            init(){
                let returnParams = {
                    send_by: 0,
                    send_week: [],
                    send_dates: [],
                    clickDateList: {}
                };
                this.send_dates = null;
                this.returnParams = returnParams;
                this.time = 0;
                this.is_edit = false;
            },
            setCalendar(pigcms_id) {
                
                this.init();
                
                
                this.pigcms_id = pigcms_id;

                let time = 0;
                if(pigcms_id){
                    this.getData(pigcms_id);
                }
                this.submitRequest(time);

                this.visible = true;
            },
            getData(pigcms_id){
                    this.request(lifeMerchantApi.editCoupon, {
                        pigcms_id:pigcms_id
                    }).then((res)=>{
                        this.returnParams.send_by = res.send_by;
                        this.returnParams.clickDateList = res.other_date;
                        if(res.send_by == 1){
                            this.returnParams.send_week = res.send_rule;
                        }
                        if(res.send_by == 2){ 
                            let dateFormat = "YYYY/MM/DD";
                            this.send_dates = [moment(res.send_rule[0], dateFormat), moment(res.send_rule[1], dateFormat)]
                        }
                    })
            },
            //请求修改数据
            submitRequest(time) {
                this.request(lifeMerchantApi.getSendCouponDateList, {
                    time,
                    pigcms_id: this.pigcms_id
                }).then((res) => {
                    let dateList = {};
                    for (const v of res) {
                        dateList[v] = 1
                    }
                    this.dateList = dateList;
                })
            },
            //切换年份/月份
            onPanelChange(value, mode) {
                let time = moment(value.format('YYYY-MM-DD')).unix();
                this.time = time;
                //非编辑模式，获取数据库信息
                if(!this.is_edit){
                    this.submitRequest(time);
                }else{//编辑模式生成新信息
                    this.getCalcDateList();
                }
            },
            //点击日期
            selectDate(value) {
                let time = moment(value.format('YYYY-MM-DD')).unix()
                this.time = time;
 
                if (!this.returnParams.clickDateList[time] && this.returnParams.clickDateList[time] != 0) {
                    this.returnParams.clickDateList[time] = this.dateList[time] ? 0 : 1;
                }else{
                    this.returnParams.clickDateList[time] = this.returnParams.clickDateList[time] ? 0 : 1;
                } 
                console.log(this.returnParams.clickDateList)
            },
            isSendCoupon(value) {
                let time = moment(value.format('YYYY-MM-DD')).unix();
                let newDateList = Object.assign(this.dateList, this.returnParams.clickDateList);
                return (newDateList[time] && newDateList[time] == 1) ? true : false;
            },
            sendBySelect() {
                this.returnParams.clickDateList = {};
                this.getCalcDateList();
            }, 
            selectWeek(){
                this.getCalcDateList();
            },
            handleChange(value, mode){ 
                this.returnParams.send_dates = [mode[0], mode[1]];
                this.send_dates = value; 
                this.getCalcDateList();
            },
            getCalcDateList(){
                this.is_edit = true;
                let send_rule = this.returnParams.send_by == 2 ? this.returnParams.send_dates : this.returnParams.send_week;
                
                this.request(lifeMerchantApi.getCalcDateList, {
                    time: this.time,
                    send_by: this.returnParams.send_by,
                    send_rule: send_rule
                }).then((res) => {
                   let dateList = {};
                   for (const v of res) {
                       dateList[v] = 1
                   }
                   this.dateList = dateList; 
                })
            },
            returnClick(){
                this.$emit('setCalendarData', this.returnParams);
                this.visible = false;
            }
        }
    }
</script>
<style type="text/css">
    .ant-fullcalendar-header .ant-radio-group {
        display: none
    }
</style>
