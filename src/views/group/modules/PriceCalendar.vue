<template>
    <div>
        <a-modal
            title="价格日历"
            :width="840"
            :visible="visible"
            destroyOnClose
            @ok="handleSubmit"
            @cancel="handleCancel"
        >
            <div class="container">
                <calendar
                    :validRange="[moment(), moment().add(3, 'month').subtract(1, 'days')]"
                    :headerRender="headerRender"
                >
                    <template slot="dateCellRender" slot-scope="value">
                        <div class="date-cell" v-if="showPrice(value)">
                            <span>{{ priceList[moment(value.format('YYYY-MM-DD')).unix()].price }}</span>
                            <a-icon
                                v-if="value.isAfter(moment().subtract(1, 'days'))"
                                @click.stop="editPrice(value)"
                                class="edit"
                                type="form"
                            />
                        </div>
                    </template>
                </calendar>
            </div>
        </a-modal>
        <a-modal
            title="编辑价格"
            :width="650"
            :visible="editVisiable"
            centered
            destroyOnClose
            @ok="handlePriceChange"
            @cancel="handlePriceCancel"
        >
            <div class="edit-price">
                <a-row :gutter="gutter">
                    <a-col :span="span.left"> 场次名称：</a-col>
                    <a-col :span="span.right">
                        <span>{{ ruleName }}</span>
                    </a-col>
                </a-row>
                <a-row :gutter="gutter">
                    <a-col :span="span.left"> 生效时间：</a-col>
                    <a-col :span="span.right">
                        <span v-if="dayPriceChange">{{ currentValue.day }}</span>
                        <a-range-picker
                            v-else
                            :disabled-date="disabledDate"
                            v-model="formData.day"
                            style="width: 300px"
                        />
                    </a-col>
                </a-row>
                <a-row :gutter="gutter">
                    <a-col :span="span.left"> 售卖价格：</a-col>
                    <a-col :span="span.right" v-if="dayPriceChange">
                        <a-input-number v-model="formData.price" placeholder="请输入价格" style="width: 300px" />
                    </a-col>
                    <a-col :span="span.right" v-else>
                        <a-radio-group v-model="formData.salePriceType">
                            <a-radio :value="1"> 每天统一价格 </a-radio>
                            <a-radio :value="2"> 在周内设置不同价格 </a-radio>
                        </a-radio-group>
                        <div class="mt-10">
                            <a-input-number
                                v-if="formData.salePriceType == 1"
                                v-model="formData.price"
                                placeholder="请输入价格"
                                style="width: 300px"
                            />
                            <div v-else>
                                <div>
                                    <a-input-number
                                        v-model="formData.price1"
                                        placeholder="请输入价格"
                                        style="width: 100px; margin-right: 10px"
                                    />
                                    <a-checkable-tag
                                        v-for="(item, index) of weekArr"
                                        :key="item.key"
                                        v-model="item.check1"
                                        @change="(val) => weekCheckChange(val, '1', index)"
                                    >
                                        {{ item.title }}
                                    </a-checkable-tag>
                                </div>
                                <div class="mt-10">
                                    <a-input-number
                                        v-model="formData.price2"
                                        placeholder="请输入价格"
                                        style="width: 100px; margin-right: 10px"
                                    />
                                    <a-checkable-tag
                                        v-for="(item, index) of weekArr"
                                        :key="item.key"
                                        v-model="item.check2"
                                        @change="(val) => weekCheckChange(val, '2', index)"
                                    >
                                        {{ item.title }}
                                    </a-checkable-tag>
                                </div>
                            </div>
                        </div>
                    </a-col>
                </a-row>
                <a-row :gutter="gutter">
                    <a-col :span="span.left"> 是否售卖：</a-col>
                    <a-col :span="span.right">
                        <a-radio-group v-model="formData.is_sale">
                            <a-radio :value="1"> 售卖 </a-radio>
                            <a-radio :value="0"> 停售 </a-radio>
                        </a-radio-group>
                    </a-col>
                </a-row>
            </div>
        </a-modal>
    </div>
</template>
<script>
import { Calendar } from 'ant-design-vue'
import moment from 'moment'
export default {
    name: 'GroupPriceCalendar',
    components: { Calendar },
    props: {},
    data() {
        return {
            gutter: [10, 10],
            span: { left: 4, right: 20 },
            visible: false,
            rule: {}, // 当前编辑的场次
            editVisiable: false,
            priceList: {}, // 每天和对应的价格
            weekArr: [
                { title: '周一', check1: true, check2: false, key: 0 },
                { title: '周二', check1: true, check2: false, key: 1 },
                { title: '周三', check1: true, check2: false, key: 2 },
                { title: '周四', check1: true, check2: false, key: 3 },
                { title: '周五', check1: true, check2: false, key: 4 },
                { title: '周六', check1: true, check2: false, key: 5 },
                { title: '周日', check1: true, check2: false, key: 6 },
            ],
            dayPriceChange: false, // true修改某天 false批量修改
            currentValue: {}, // 当前编辑的某天的售卖信息
            currentValueKey: 0,
            formData: {
                price: '',
                price1: '',
                price2: '',
                is_sale: 1,
                day: [moment(), moment().add(3, 'month').subtract(1, 'days')],
                salePriceType: 1,
            },
        }
    },
    computed: {
        ruleName() {
            const startTime =
                this.rule.start_time > 9 ? this.rule.start_time + ':00' : '0' + this.rule.start_time + ':00'
            const endTime = this.rule.end_time > 9 ? this.rule.end_time + ':00' : '0' + this.rule.end_time + ':00'
            return `${startTime}至${this.rule.day == 2 ? '次日' : ''}${endTime}${
                this.rule.use_hours_type == 0 ? '' : '内，任选' + this.rule.use_hours + '小时'
            }`
        },
    },
    methods: {
        moment,
        // 打开弹框
        openModal(e) {
            console.log(e)
            const { rule } = e
            this.rule = rule
            this.getPriceList()
            this.visible = true
        },
        getPriceList() {
            // 获取每日的信息
            this.priceList = {}
            const startDay = moment().subtract(1, 'days')
            const endDay = moment().add(3, 'month').subtract(1, 'days')
            const dayNum = endDay.diff(startDay, 'days')
            if (this.rule.price_calendar && this.rule.price_calendar.length) {
                let length = this.rule.price_calendar.length
                this.rule.price_calendar.forEach((item) => {
                    const day = moment(item.day)
                    const key = day.unix()
                    this.priceList[key] = { price: item.price, is_sale: item.is_sale, day: item.day }
                })
                // 多出来的天数
                const lastDay = moment(this.rule.price_calendar[length - 1].day)
                const dayNum2 = endDay.diff(lastDay, 'days')
                for (let i = 0; i < dayNum2; i++) {
                    const day2 = moment().add(i, 'day')
                    const key2 = day2.unix()
                    this.priceList[key2] = {
                        price: this.rule.default_price,
                        is_sale: 1,
                        day: day2.format('YYYY-MM-DD'),
                    }
                }
            } else {
                for (let i = 0; i < dayNum; i++) {
                    const day = moment().add(i, 'day')
                    const formatDay = day.format('YYYY-MM-DD')
                    const key = moment(formatDay).unix()
                    this.priceList[key] = { price: this.rule.default_price, is_sale: 1, day: formatDay }
                }
            }
        },
        // 点击确定
        handleSubmit() {
            this.$emit('getPriceList', { priceList: this.priceList, rule_index: this.rule.rule_index })
            this.handleCancel()
        },
        // 点击关闭
        handleCancel() {
            this.visible = false
        },
        handlePriceCancel() {
            this.formData = this.$options.data().formData
            this.editVisiable = false
        },
        // 自定义渲染头部
        headerRender({ value, type, onChange, onTypeChange }) {
            const start = 0
            const end = 12
            const monthOptions = []

            const current = value.clone()
            const localeData = value.localeData()
            const months = []
            for (let i = 0; i < 12; i++) {
                current.month(i)
                months.push(localeData.monthsShort(current))
            }

            for (let index = start; index < end; index++) {
                monthOptions.push(
                    <a-select-option class="month-item" key={`${index}`}>
                        {months[index]}
                    </a-select-option>
                )
            }
            const month = value.month()

            const year = value.year()
            const options = []
            for (let i = year - 1; i < year + 2; i += 1) {
                options.push(
                    <a-select-option key={i} value={i} class="year-item">
                        {i}
                    </a-select-option>
                )
            }
            const ruleName = `${
                this.rule.start_time > 9 ? this.rule.start_time + ':00' : '0' + this.rule.start_time + ':00'
            }至${this.rule.day == 2 ? '次日' : ''}${
                this.rule.end_time > 9 ? this.rule.end_time + ':00' : '0' + this.rule.end_time + ':00'
            }${this.rule.use_hours_type == 0 ? '' : '内，任选' + this.rule.use_hours + '小时'}`
            return (
                <div style={{ padding: '10px' }}>
                    <a-row type="flex" justify="space-between">
                        <a-col>
                            <a-select
                                dropdownMatchSelectWidth={false}
                                onChange={(newYear) => {
                                    const now = value.clone().year(newYear)
                                    onChange(now)
                                }}
                                value={String(year)}
                            >
                                {options}
                            </a-select>
                            <a-select
                                style={{ marginLeft: '10px' }}
                                dropdownMatchSelectWidth={false}
                                value={String(month)}
                                onChange={(selectedMonth) => {
                                    const newValue = value.clone()
                                    newValue.month(parseInt(selectedMonth, 10))
                                    onChange(newValue)
                                }}
                            >
                                {monthOptions}
                            </a-select>
                        </a-col>
                        <a-col>{ruleName}</a-col>
                        <a-col>
                            <a-button type="primary" onClick={(e) => this.editPrice()}>
                                批量设置
                            </a-button>
                        </a-col>
                    </a-row>
                </div>
            )
        },
        disabledDate(current) {
            return (
                current.isBefore(moment().subtract(1, 'days')) ||
                current.isAfter(moment().add(3, 'month').subtract(1, 'days'))
            )
        },
        showPrice(value) {
            const key = moment(value.format('YYYY-MM-DD')).unix()
            return this.priceList && this.priceList[key]
        },
        // 编辑价格
        editPrice(value) {
            if (value) {
                this.dayPriceChange = true
                this.currentValueKey = moment(value.format('YYYY-MM-DD')).unix()
                this.currentValue = this.priceList[this.currentValueKey]
                this.formData.price = this.currentValue.price
                this.formData.is_sale = this.currentValue.is_sale
            } else {
                this.dayPriceChange = false
            }
            this.editVisiable = true
        },
        // 价格修改确定
        handlePriceChange() {
            console.log(this.formData)
            if (
                (this.dayPriceChange || (!this.dayPriceChange && this.formData.salePriceType == 1)) &&
                !this.formData.price
            ) {
                this.$message.error('请输入售卖价格')
                return
            }
            if (this.dayPriceChange) {
                // 单日价格
                this.currentValue.price = this.formData.price
                this.currentValue.is_sale = this.formData.is_sale
                this.$set(this.priceList, this.currentValueKey, this.currentValue)
            } else {
                // 批量修改
                if (this.formData.salePriceType == 2 && (!this.formData.price1 || !this.formData.price2)) {
                    this.$message.error('请输入两个售卖价格')
                    return
                }
                if (!this.formData.day.length) {
                    this.$message.error('请选择生效时间')
                    return
                }
                let week1 = [] //拥有价格1
                let week2 = [] //拥有价格2
                if (this.formData.salePriceType == 2) {
                    this.weekArr.forEach((item) => {
                        if (item.check1) {
                            week1.push(item.key)
                        } else {
                            week2.push(item.key)
                        }
                    })
                }
                const startDay = this.formData.day[0].format('YYYY-MM-DD')
                const endDay = this.formData.day[1].format('YYYY-MM-DD')
                for (let key in this.priceList) {
                    let item = this.priceList[key]
                    if (moment(item.day).isBetween(startDay, endDay, null, '[]')) {
                        if (this.formData.salePriceType == 1) {
                            // 一个价格
                            item.price = this.formData.price
                            item.is_sale = this.formData.is_sale
                        } else {
                            // 两个价格
                            const weekDay = moment(item.day).weekday()
                            if (week1.includes(weekDay)) {
                                item.price = this.formData.price1
                            } else {
                                item.price = this.formData.price2
                            }
                            item.is_sale = this.formData.is_sale
                        }
                        this.$set(this.priceList, key, item)
                    }
                }
            }
            this.handlePriceCancel()
        },

        weekCheckChange(val, type, index) {
            let item = this.weekArr[index]
            if (type == 1) {
                item.check2 = !val
            } else {
                item.check1 = !val
            }
            this.$set(this.weekArr, index, item)
        },
    },
}
</script>
<style scoped>
.container {
    width: 100%;
    max-height: 650px;
    overflow-y: auto;
}
.date-cell {
    font-size: 16px;
}
.edit {
    color: #1890ff;
    margin-left: 8px;
}
.edit-price {
    line-height: 35px;
}
</style>
            