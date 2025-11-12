<template>
    <div class="wrap">
        <a-form-model 
            ref="ruleForm" 
            :model="form" 
            :label-col="{ span: 8 }" 
            :wrapper-col="{ span: 16 }">
            <a-form-model-item :label="L('是否开启员工专区商家自提时间')">
                <a-switch 
                    :checked-children="L('开')" 
                    :un-checked-children="L('关')" 
                    v-model="form.open_pick_time" />
            </a-form-model-item>
            <a-form-model-item 
                :label="L('员工专区商家自提时间段')">
                <a-button type="primary" @click="addDate()">{{L('新增自提日期')}}</a-button>
            </a-form-model-item>
            <template v-for="(item,index) in form.pick_time">
                <a-form-model-item 
                    :key="index"
                    :label="L('选择日期')"
                    v-bind="formItemLayout">
                    <div>
                        <a-date-picker 
                            style="width:calc(128px * 2 + 45px);"
                            :disabled-date="disabledDate"
                            :value="item.select_date?moment(item.select_date, 'YYYY-MM-DD'):null"
                            type="date"
                            @change="(date, dateString) => {selectDateChange(date, dateString,index)}" />
                        <a-button type="link" @click="addTime(index)">{{L('新增时间段')}}</a-button>
                        <a-button type="link" style="color: red;" @click="delDate(index)">{{L('删除')}}</a-button>
                        
                        <label style="padding-left: 20px;">每日限购数量(-1为不限购)：</label> 
                        <a-input type="number" v-model="form.pick_time[index].limit_num" style="width: 80px" />
                    </div>
                    <div 
                        v-for="(subItem,subIndex) in item.time_list" 
                        :key="subIndex"
                        class="mt-5">
                        <a-time-picker 
                            :value="subItem.start_time?moment(subItem.start_time, 'HH:mm'):null"
                            :placeholder="L('请选择时间')"
                            format="HH:mm"
                            @change="(time) => {selectTimeChange(time, 'start_time',index,subIndex)}" />
                        <span class="ml-20 mr-20">-</span>
                        <a-time-picker 
                            :value="subItem.end_time?moment(subItem.end_time, 'HH:mm'):null"
                            :placeholder="L('请选择时间')"
                            format="HH:mm"
                            :disabledHours="() => disabledHours(index,subIndex)"
                            :disabledMinutes="(e) => disabledMinutes(e,index,subIndex)"
                            @change="(time) => {selectTimeChange(time, 'end_time',index,subIndex)}" />
                        <a-button 
                            type="link" 
                            style="color: red;" 
                            @click="delTime(index,subIndex)">{{L('删除')}}</a-button>
                    </div>
                </a-form-model-item>
            </template>
            <a-form-model-item v-bind="formItemLayout">
                <div class="flex align-center justify-center mt-50">
                    <a-button type="primary" @click="savePickTime()">{{L('保存')}}</a-button>
                </div>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>

<script>
// 员工专区自提时间
import moment from 'moment';
import employeePlatformApi from "@/api/employee/platform";
export default {
    data() {
        return {
            formItemLayout: {
                labelCol: {
                    span: 8
                },
                wrapperCol: {
                    span: 16
                }
            },
            form: {
                // 是否启用自提时间配置
                open_pick_time: true,
                // 自提时间
                pick_time: []
            }
        }
    },
    created() {
        this.getPickTimeSetting()
    },
    methods: {
        moment,
        // 获取自提时间
        getPickTimeSetting() {
            this.request(employeePlatformApi.getPickTimeSetting, {}).then((res) => {
                const {
                   open_pick_time = 1,
                    pick_time = []
                } = res
                this.$set(this.form,'open_pick_time',open_pick_time == 1?true:false)
                this.$set(this.form,'pick_time',pick_time)
            })
        },
        // 新增日期
        addDate() {
            let pick_time = this.form.pick_time
            pick_time.push({
                select_date: null,
                time_list: [{
                    start_time: '',
                    end_time: ''
                }],
                limit_num: 0
            })
            this.$set(this.form,'pick_time',pick_time)
        },
        // 删除日期
        delDate(index) {
            this.$confirm({
                title: '提示',
                content: '确定删除该日期吗？',
                onOk: () => {
                    this.$delete(this.form.pick_time,index)
                },
                onCancel() {},
            })
        },
        // 选择日期
        selectDateChange(date, dateString,index) {
            this.$set(this.form.pick_time[index],'select_date',date?moment(date).format('YYYY-MM-DD'):'')
        },
        // 禁止选择的日期
        disabledDate(current) {
            return current && current < moment().subtract(1, 'days');
        },
        // 新增时间
        addTime(index) {
            let time_list = this.form.pick_time[index]['time_list']
            time_list.push({
                start_time: '',
                end_time: ''
            })
            this.$set(this.form.pick_time[index],'time_list',time_list)
        },
        // 时间删除
        delTime(index,subIndex) {
            this.$confirm({
                title: '提示',
                content: '确定删除该时间段吗？',
                onOk: () => {
                    this.$delete(this.form.pick_time[index]['time_list'],subIndex)
                },
                onCancel() {},
            })
        },
        // 选择时间
        selectTimeChange(time,field,index,subIndex) {
            this.$set(this.form.pick_time[index]['time_list'][subIndex],field,time?moment(time).format('HH:mm'):'')
        },
        // 禁止选择部分小时选项
        disabledHours(index,subIndex) {
            let hours = [];
            let time = this.form.pick_time[index]['time_list'][subIndex]['start_time']
            let timeArr = time.split(":");
            for(let i=0;i<parseInt(timeArr[0]);i++){
                hours.push(i)
            }
            return hours;
        },
        // 禁止选择部分分钟选项
        disabledMinutes(selectedHour,index,subIndex){
            let startTime = this.form.pick_time[index]['time_list'][subIndex]['start_time']
            let timeArr = startTime.split(":");
            let minutes = [];
            if(selectedHour == parseInt(timeArr[0])){
                for(let i=0;i<parseInt(timeArr[1]);i++){
                    minutes.push(i);
                }
            }
            return minutes;
        },
        // 判断时间段是否有冲突 true，表示没有重叠；false表示有重叠 
        judgeTimeList(dateArr= []){
            for (let k in dateArr) {
                if (!this.judge(k, dateArr)) {
                    return false
                }
            }
            return true
        },
        judge(idx, dateArr) {
            for (let k in dateArr) {
                if (idx !== k) {
                    if (dateArr[k].start_time <= dateArr[idx].start_time && dateArr[k].end_time > dateArr[idx].start_time) {
                        return false
                    }
                    if (dateArr[k].start_time < dateArr[idx].end_time && dateArr[k].end_time >= dateArr[idx].end_time) {
                        return false
                    }
                }
            }
            return true
        },
        // 保存
        savePickTime() {
            if (this.form.open_pick_time && !this.form.pick_time.length) {
                this.$message.error(this.L('请设置自提时间段'))
                return
            }

            const {
                open_pick_time = true,
                pick_time = []
            } = this.form

            // 日期选择校验
            let dateEmptyArr = pick_time.filter(item => {
                if (!item.select_date) return item
            }) || []
            if (dateEmptyArr.length) {
                this.$message.error(this.L('请选择自提日期'))
                return
            } else {
                let selectDate = pick_time.map(item => item.select_date)
                let dateNewSet = Array.from(new Set(selectDate))
                if (dateNewSet.length != selectDate.length) {
                    this.$message.error(this.L('自提日期重复'))
                    return
                }
            }

            // 时间段校验
            let errMsg = '';
            try {
                pick_time.forEach((item,index) => {
                    if (item.time_list && item.time_list.length) {
                        item.time_list.forEach((subItem,subIndex) => {
                            if (!subItem.start_time || !subItem.end_time) {
                                errMsg = '请选择时间'
                            }
                            if (subItem.start_time && subItem.end_time) {
                                let startHour = subItem.start_time.split(":")[0]
                                let startMins = subItem.start_time.split(":")[1]
                                let startTotalMins = Number(startHour) * 60 + Number(startMins)
                                let endHour = subItem.end_time.split(":")[0]
                                let endMins = subItem.end_time.split(":")[1]
                                let endTotalMins = Number(endHour) * 60 + Number(endMins)
                                if (endTotalMins <= startTotalMins) {
                                    errMsg = '结束时间不能大于开始时间'
                                }
                            }
                            if (!this.judgeTimeList(item.time_list)) {
                                errMsg = `${item.select_date} 时间段重叠`
                            }
                            if(errMsg) {
                                throw Error(errMsg);
                            }
                        })
                    }
                })
            } catch(e) {
                this.$message.error(this.L(errMsg))
                return
            }

            let params = {
                open_pick_time: open_pick_time?1:0,
                pick_time: pick_time
            }

            this.request(employeePlatformApi.pickTimeSetting, params).then((res) => {
                this.$message.success(this.L('设置成功'))
            })
        }
    }
}
</script>

<style scoped>
.wrap {
    margin: 20px 0 20px;
    padding: 20px;
    background-color: #fff;
    box-sizing: border-box;
}
</style>
