<template>
    <div style="background-color: #f8f9fd;overflow: hidden;width: 100%;height: 100%">
        <div class="form-box" v-if="form">
            <a-form-model :model="form">
                <a-form-model-item :label="L('问卷投放人群')">
                    <a-select v-model="form.submit_user_type">
                        <!-- <a-select-option value="all">{{L('不限身份')}}</a-select-option> -->
                        <a-select-option value="system_user">{{L('所有注册用户')}}</a-select-option>
                        <a-select-option value="level_user">{{L('会员等级用户')}}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item :label="L('主动通知用户(站内信)')">
                    <a-radio-group v-model="form.user_notice_switch">
                        <a-radio :style="radioStyle" :value="1">{{L('通知')}}</a-radio>
                        <a-radio :style="radioStyle" :value="2">{{L('不通知')}}</a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item :label="L('问卷有效期')">
                    <a-range-picker @change="onChange" v-model="date" showTime :format="dateFormat"/>
                </a-form-model-item>
                <a-form-model-item :label="L('提交次数')">
                    <a-radio-group v-model="user_notice_switch_type" @change="user_notice_switch_change">
                        <a-radio :style="radioStyle" :value="0">{{L('不限次数')}}</a-radio>
                        <a-radio :style="radioStyle" :value="1">
                            {{L('每个参与者最高可提交')}}
                            <a-input-number v-model="form.max_submit_num" :min="0" />
                        </a-radio>
                        <a-radio :style="radioStyle" :value="2">
                            {{L('每个参与者单日最高可提交')}}
                            <a-input-number v-model="form.max_day_submit_num" :min="0" />
                        </a-radio>
                    </a-radio-group>
                </a-form-model-item>
                <a-form-model-item :label="L('公开次数')">
                    <a-radio-group v-model="form.show_result">
                        <a-radio :style="radioStyle" :value="1">{{L('提交问卷后展示结果')}}</a-radio>
                        <a-radio :style="radioStyle" :value="0">{{L('提交问卷后不展示结果')}}</a-radio>
                    </a-radio-group>
                </a-form-model-item>
            </a-form-model>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { cloneDeep } from 'lodash'
export default {
    data() {
        return {
            radioStyle: {
                display: 'block',
                height: '40px',
                lineHeight: '40px',
            },
            //整个表单数据
            form: {
                start_time: '', //投放时间
                end_time: '', //问卷有效期
                submit_count: '', //提交次数
                submit_user_type: 'system_user', //投放人群
                user_notice_switch: 1, //主动通知用户
                max_submit_num: 0, //每个参与者最高可提交次数 0 不限制
                max_day_submit_num: 0, //每个参与者每日最高可提交次数 0 不限制
                show_result: 1, //问卷后是否展示结果 1 展示 0 不展示
            },
            user_notice_switch_type: 0,
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
            date: [null, null],
        }
    },
    computed: {
        getDate() {
            return [
                this.form.start_time ? moment(this.form.start_time, this.dateFormat) : null,
                this.form.end_time ? moment(this.form.end_time, this.dateFormat) : null,
            ]
        },
    },
    methods: {
        moment,
        setFormData(data) {
            let params = cloneDeep(data)
            this.form = {
                start_time: params.start_time, //投放时间
                end_time: params.end_time, //问卷有效期
                submit_count: params.submit_count, //提交次数
                submit_user_type: params.submit_user_type, //投放人群
                user_notice_switch: params.user_notice_switch, //主动通知用户
                max_submit_num: params.max_submit_num, //每个参与者最高可提交次数 0 不限制
                max_day_submit_num: params.max_day_submit_num, //每个参与者每日最高可提交次数 0 不限制
                show_result: params.show_result, //问卷后是否展示结果 1 展示 0 不展示
            }
            if(params.max_submit_num){
                this.user_notice_switch_type = 1
            }else if(params.max_day_submit_num){
                this.user_notice_switch_type = 2
            }
            this.date = this.getDate
        },
        getFormData() {
            return this.form
        },
        onChange(date, dateString) {
            this.form.start_time = dateString[0]
            this.form.end_time = dateString[1]
        },
        user_notice_switch_change(e) {
            let value = e.target.value
            if (value == 0) {
                this.form.max_submit_num = 0
                this.form.max_day_submit_num = 0
            } else if (value == 1) {
                this.form.max_submit_num = 1
                this.form.max_day_submit_num = 0
            } else if (value == 2) {
                this.form.max_submit_num = 0
                this.form.max_day_submit_num = 1
            }
        },
    },
}
</script>

<style lang="less" scoped>
@box-width: 840px;
@main-border-radius: 8px;
.form-box {
    max-width: @box-width;
    background-color: #fff;
    margin: 20px auto;
    padding: 20px;
    box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.03);
    border-radius: @main-border-radius;
}
</style>