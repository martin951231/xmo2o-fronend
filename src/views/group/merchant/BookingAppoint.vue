<template>
    <div class="booking-appoint">
        <!-- 页面标题 -->
        <a-page-header title="场次预约" />
        <!-- 页面内容 -->
        <a-card :bordered="false">
            <a-tabs :activeKey="activeKey" @change="onTabChange">
                <a-tab-pane :key="1" tab="基本信息">
                    <a-row class="form-row" :gutter="gutter">
                        <a-col class="form-title" :span="titleSpan"> 商品类型：</a-col>
                        <a-col class="form-content" :span="contentSpan"> 场次预约 </a-col>
                    </a-row>
                    <a-row class="form-row" :gutter="gutter">
                        <a-col class="form-title" :span="titleSpan"><span class="required">*</span> 场次名称：</a-col>
                        <a-col class="form-content" :span="contentSpan">
                            <a-input placeholder="请输入场次名称" v-model="formData.s_name" style="width: 50%" />
                        </a-col>
                    </a-row>
                    <a-row class="form-row" :gutter="gutter">
                        <a-col class="form-title" :span="titleSpan"><span class="required">*</span> 场次设置：</a-col>
                        <a-col class="form-content" :span="contentSpan">
                            <div class="rule-card" v-for="(item, index) of rules" :key="item.rule_index">
                                <div class="left">
                                    <div class="col">
                                        <span class="title"><span class="required">*</span>时间：</span>
                                        <div class="row-content">
                                            <div style="margin-bottom: 10px">
                                                <a-select
                                                    v-model="item.start_time"
                                                    style="width: 80px"
                                                    @select="ruleTimeSelectChange('start', index)"
                                                >
                                                    <a-select-option v-for="(i, idx) in 24" :key="i" :value="idx">{{
                                                        idx > 9 ? idx : '0' + idx
                                                    }}</a-select-option>
                                                </a-select>
                                                <span class="unit">时</span>
                                                <span class="unit">至</span>
                                                <a-select
                                                    v-model="item.day"
                                                    style="width: 80px; margin: 0 10px"
                                                    @select="ruleTimeSelectChange('day', index)"
                                                >
                                                    <a-select-option :value="1"> 当日 </a-select-option>
                                                    <a-select-option :value="2"> 次日 </a-select-option>
                                                </a-select>
                                                <a-select
                                                    v-model="item.end_time"
                                                    style="width: 80px"
                                                    @select="ruleTimeSelectChange('end', index)"
                                                >
                                                    <a-select-option v-for="(i, idx) in 24" :key="i" :value="idx">{{
                                                        idx > 9 ? idx : '0' + idx
                                                    }}</a-select-option>
                                                </a-select>
                                                <span class="unit">时</span>
                                            </div>
                                            <div>
                                                <a-radio-group v-model="item.use_hours_type">
                                                    <a-radio :value="0"> 全部时间 </a-radio>
                                                    <a-radio :value="1">
                                                        任选
                                                        <a-input-number
                                                            v-model="item.use_hours"
                                                            style="width: 80px; margin-left: 10px"
                                                            :precision="0"
                                                            :min="0"
                                                        />
                                                        <span class="unit">小时</span>
                                                    </a-radio>
                                                </a-radio-group>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <span class="title"><span class="required">*</span>数量：</span>
                                        <div class="row-content">
                                            <a-input-number
                                                v-model="item.count"
                                                placeholder="请输入数量"
                                                style="width: 150px"
                                                :precision="0"
                                                :min="0"
                                            />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <span class="title"><span class="required">*</span>价格：</span>
                                        <div class="row-content">
                                            <a-input-number
                                                placeholder="请输入价格"
                                                style="width: 150px"
                                                :min="0"
                                                v-model="item.default_price"
                                            />
                                            <a-button
                                                type="link"
                                                @click="setPriceCalendar(item)"
                                                :disabled="calendarDisable(item)"
                                            >
                                                价格日历
                                            </a-button>
                                            <div class="help">
                                                默认价格为该场次的基础价格，设置时间和价格后可在价格日历中设置指定时间的特殊价格
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="right">
                                    <a-button type="danger" ghost size="small" @click="removeRule(index)">
                                        删除场次
                                    </a-button>
                                </div>
                            </div>
                            <a-button type="primary" ghost icon="plus" @click="addRules">新增</a-button>
                        </a-col>
                    </a-row>
                    <a-row class="form-row" :gutter="gutter">
                        <a-col class="form-title" :span="titleSpan"
                            ><span class="required">*</span> 可提前预约时长：</a-col
                        >
                        <a-col class="form-content" :span="contentSpan">
                            <a-input-number
                                v-model="formData.appoint_time"
                                placeholder="请输入天数"
                                style="width: 30%"
                                :precision="0"
                                :min="0"
                            />
                            <span class="unit">天</span>
                        </a-col>
                    </a-row>
                    <a-row class="form-row" :gutter="gutter">
                        <a-col class="form-title" :span="titleSpan">
                            <span class="required">*</span>可提前取消时长：</a-col
                        >
                        <a-col class="form-content" :span="contentSpan">
                            <a-radio-group v-model="formData.cancel_type">
                                <a-radio :value="0"> 不可取消 </a-radio>
                                <a-radio :value="1">
                                    支持取消
                                    <a-select
                                        v-model="formData.cancel_hours_type"
                                        style="width: 100px; margin-left: 10px"
                                    >
                                        <a-select-option :value="3"> 开场前 </a-select-option>
                                        <a-select-option :value="1"> 结束前 </a-select-option>
                                    </a-select>
                                    <a-input-number
                                        v-model="formData.cancel_hours"
                                        style="width: 80px; margin-left: 10px"
                                        :precision="0"
                                        :min="0"
                                    />
                                    <span class="unit">小时</span>
                                </a-radio>
                                <a-radio :value="2"> 随时取消 </a-radio>
                            </a-radio-group>
                        </a-col>
                    </a-row>
                    <a-row class="form-row" :gutter="gutter">
                        <a-col class="form-title" :span="titleSpan"> <span class="required">*</span>适用店铺：</a-col>
                        <a-col class="form-content" :span="contentSpan">
                            {{ storeNames ? storeNames : '未选择店铺' }}
                            <a-button type="link" @click="chooseStore"> 设置 </a-button>
                        </a-col>
                    </a-row>
                </a-tab-pane>
                <a-tab-pane :key="2" tab="规格/数量">
                    <a-card title="套餐设置" :bordered="false">
                        <p>
                            说明：可为团购商品的规格设置一个价格、库存、同一ID最多购买数量、同一ID每天最多购买数量、同一ID每次最少购买数量。团购规格适用于普通团购，但是当团购类型为其他的时候规格失效。
                        </p>
                        <div class="rule-card" v-for="(item, index) of combineList" :key="item.combine_index">
                            <div class="left">
                                <span><span class="required">*</span> 套餐名：</span>
                                <a-input class="w-200" placeholder="请输入套餐名称" v-model="item.name" />
                                <span class="ml-10"> 套餐介绍：</span>
                                <a-input class="w-200" placeholder="请输入套餐介绍" v-model="item.intro" />
                                <span class="ml-10"> <span class="required">*</span>套餐价格：</span>
                                <a-input class="w-200" placeholder="请输入套餐价格" v-model="item.price" />
                                <!-- <a-row class="form-row" :gutter="gutter">
                  <a-col class="form-title" :span="4"><span class="required">*</span> 套餐名：</a-col>
                  <a-col class="form-content" :span="4">
                    <a-input class="w-400" placeholder="请输入套餐名称" v-model="item.name" />
                  </a-col>
                </a-row>
                <a-row class="form-row" :gutter="gutter">
                  <a-col class="form-title" :span="titleSpan"> 套餐介绍：</a-col>
                  <a-col class="form-content" :span="contentSpan">
                    <a-input class="w-400" placeholder="请输入套餐介绍" v-model="item.intro" />
                  </a-col>
                </a-row>
                <a-row class="form-row" :gutter="gutter">
                  <a-col class="form-title" :span="titleSpan"> <span class="required">*</span>套餐价格：</a-col>
                  <a-col class="form-content" :span="contentSpan">
                    <a-input class="w-400" placeholder="请输入套餐价格" v-model="item.price" />
                  </a-col>
                </a-row> -->
                            </div>
                            <div class="right">
                                <a-button type="danger" ghost size="small" @click="removeCombine(index)">
                                    删除规格
                                </a-button>
                            </div>
                        </div>
                        <a-button type="primary" ghost icon="plus" @click="addCombines">添加套餐</a-button>
                        <div class="mt-20">
                            <a-button v-if="combineList.length" type="primary" icon="plus" @click="addRuleCombine"
                                >生成套餐关系</a-button
                            >
                        </div>
                        <a-table
                            v-if="ruleCombineList.length"
                            class="mt-20"
                            :columns="columns"
                            :data-source="ruleCombineList"
                            row-key="id"
                            bordered
                            :pagination="false"
                        >
                            <template v-for="col in titleSlot" :slot="col.slot">
                                <div :key="col.slot">
                                    <a-tooltip>
                                        {{ col.title }}
                                        <template slot="title"> {{ col.tip }}</template>
                                        <a-icon type="question-circle" />
                                    </a-tooltip>
                                </div>
                            </template>
                            <template
                                v-for="col in ['stock_num_col', 'once_max_col', 'once_max_day_col', 'once_min_col']"
                                :slot="col"
                                slot-scope="text, record, index"
                            >
                                <div :key="col">
                                    <a-input-number
                                        style="margin: -5px 0"
                                        :precision="0"
                                        placeholder="请输入"
                                        :value="text"
                                        :min="col == 'once_min_col'?1:0"
                                        @change="(e) => handleRCInput(e, index, col)"
                                    />
                                </div>
                            </template>
                            <template slot="operation" slot-scope="text, record, index">
                                <a-button type="danger" ghost @click="removeRuleCombine(index)">删除</a-button>
                            </template>
                        </a-table>
                    </a-card>
                    <a-card title="数量设置" :bordered="false">
                        <a-row class="form-row" :gutter="gutter">
                            <a-col class="form-title" :span="titleSpan"> ID最多购买数量：</a-col>
                            <a-col class="form-content" :span="contentSpan">
                                <a-radio-group
                                    v-model="formData.once_max_type"
                                    @change="(e) => handleRadioChange(e.target.value, 'once_max_type')"
                                >
                                    <a-radio :value="0"> 不限 </a-radio>
                                    <a-radio :value="1">
                                        有限
                                        <a-input-number
                                            v-if="formData.once_max_type == 1"
                                            v-model="formData.once_max"
                                            style="width: 120px; margin-left: 10px"
                                            :precision="0"
                                            placeholder="请输入数量"
                                            :min="0"
                                        />
                                    </a-radio>
                                </a-radio-group>
                            </a-col>
                        </a-row>
                        <a-row class="form-row" :gutter="gutter">
                            <a-col class="form-title" :span="titleSpan"> ID每天最多购买数量：</a-col>
                            <a-col class="form-content" :span="contentSpan">
                                <a-radio-group
                                    v-model="formData.once_max_day_type"
                                    @change="(e) => handleRadioChange(e.target.value, 'once_max_day_type')"
                                >
                                    <a-radio :value="0"> 不限 </a-radio>
                                    <a-radio :value="1">
                                        有限
                                        <a-input-number
                                            v-if="formData.once_max_day_type == 1"
                                            v-model="formData.once_max_day"
                                            style="width: 120px; margin-left: 10px"
                                            :precision="0"
                                            placeholder="请输入数量"
                                            :min="0"
                                        />
                                    </a-radio>
                                </a-radio-group>
                                <div class="help">一个ID每天最多购买数量，会受“ID最多购买数量”配置项限制</div>
                            </a-col>
                        </a-row>
                        <a-row class="form-row" :gutter="gutter">
                            <a-col class="form-title" :span="titleSpan"> ID每次最少购买数量：</a-col>
                            <a-col class="form-content" :span="contentSpan">
                                <a-radio-group
                                    v-model="formData.once_min_type"
                                    @change="(e) => handleRadioChange(e.target.value, 'once_min_type')"
                                >
                                    <a-radio :value="0"> 不限 </a-radio>
                                    <a-radio :value="1">
                                        有限
                                        <a-input-number
                                            v-if="formData.once_min_type == 1"
                                            v-model="formData.once_min"
                                            style="width: 120px; margin-left: 10px"
                                            :precision="0"
                                            placeholder="请输入数量"
                                            :min="0"
                                        />
                                    </a-radio>
                                </a-radio-group>
                                <div class="help">购买数量低于此设定的不允许参团</div>
                            </a-col>
                        </a-row>
                    </a-card>
                    <a-card title="库存扣减方式" :bordered="false">
                        <a-radio-group v-model="formData.stock_reduce_method">
                            <a-radio :value="0" :style="radioStyle">
                                支付成功后减库存（可能会出现售出的数量大于商品总数）
                            </a-radio>
                            <a-radio :value="1" :style="radioStyle">
                                下单成功后减库存（可能会出现大量下单但是没有支付时库存已经没有了，但是如果20分钟后还是没有买单的话系统自动回滚库存）
                            </a-radio>
                        </a-radio-group>
                    </a-card>
                </a-tab-pane>
                <a-tab-pane :key="3" tab="其他设置">
                    <a-card title="补充信息" :bordered="false">
                        <a-row class="form-row" :gutter="gutter">
                            <a-col class="form-title" :span="titleSpan"> 团购专页分类：</a-col>
                            <a-col class="form-content" :span="contentSpan">
                                <a-select
                                    v-model="formData.cat_fid"
                                    style="width: 160px"
                                    placeholder="一级分类"
                                    @change="(val) => handleGroupCategoryChange(val)"
                                >
                                    <a-select-option v-for="cat1 in groupCategoryList" :key="cat1.sort_id">
                                        {{ cat1.sort_name }}
                                    </a-select-option>
                                </a-select>
                                <a-select
                                    v-model="formData.cat_id"
                                    style="width: 160px; margin-left: 10px"
                                    placeholder="二级分类"
                                >
                                    <a-select-option v-for="cat2 in currentGroupCat.children" :key="cat2.sort_id">
                                        {{ cat2.sort_name }}
                                    </a-select-option>
                                </a-select>
                            </a-col>
                        </a-row>
                        <a-row class="form-row" :gutter="gutter">
                            <a-col class="form-title" :span="titleSpan">是否支持自动核销：</a-col>
                            <a-col class="form-content" :span="contentSpan">
                                <a-radio-group v-model="formData.auto_check">
                                    <a-radio :value="0"> 不支持 </a-radio>
                                    <a-radio :value="1"> 支持 </a-radio>
                                </a-radio-group>
                                <div class="help">
                                    选择支持，则用户付款该团购商品后该订单自动核销，无需店员操作核销动作；自动核销只支持团购商品归属为一个店铺，如果归属为多个店铺，则默认核销第一个店铺
                                </div>
                            </a-col>
                        </a-row>
                    </a-card>
                    <a-card title="会员优惠" :bordered="false">
                        <p>
                            说明：必须设置一个会员等级优惠类型和优惠类型对应的数值，我们将结合优惠类型和所填的数值来计算该商品会员等级的优惠的幅度！
                        </p>
                        <div class="leveloff" v-for="item of leveloff" :key="item.lid">
                            <span class="lname">{{ item.lname }}</span>
                            <span>优惠类型</span>
                            <a-select
                                placeholder="请选择优惠类型"
                                v-model="item.type"
                                style="width: 120px; margin-left: 10px"  :disabled="discount_sync_status"
                            >
                                <a-select-option v-for="type in levelList" :key="type.type">
                                    {{ type.title }}
                                </a-select-option>
                            </a-select>
                            <a-input-number
                                v-model="item.vv"
                                style="width: 180px; margin-left: 10px"
                                placeholder="请输入对应优惠金额"
                                :min="0"
                                :disabled="discount_sync_status"
                            />
                        </div>
                    </a-card>
                    <a-card title="其他设置" :bordered="false">
                        <a-row class="form-row" :gutter="gutter">
                            <a-col class="form-title" :span="titleSpan">团购状态：</a-col>
                            <a-col class="form-content" :span="contentSpan">
                                <a-radio-group v-model="formData.status">
                                    <a-radio :value="1"> 开启 </a-radio>
                                    <a-radio :value="0"> 关闭（为了方便用户能查找到以前的订单，团购无法删除） </a-radio>
                                </a-radio-group>
                            </a-col>
                        </a-row>
                    </a-card>
                </a-tab-pane>
            </a-tabs>
        </a-card>

        <a-button class="submit" type="primary" size="large" @click="submitForm"> 保存 </a-button>
        <!-- 价格日历弹窗 -->
        <price-calendar ref="priceCalendar" @getPriceList="getPriceList" />
        <!-- 指定店铺 -->
        <choose-store :visible="chooseStoreVisible" :storeIdArr="formData.store_ids" @submit="getChooseStore" />
    </div>
</template>
<script>
let rule_index = 1
const ruleItem = {
    rule_id: 0,
    start_time: 0,
    day: 1, //1当天 2次日
    end_time: 23,
    use_hours_type: 0, // 0全部时间 1任选时间
    use_hours: '',
    count: '',
    default_price: '',
    price_calendar: [],
}
let combine_index = 1
const combineItem = {
    combine_id: 0,
    name: '',
    intro: '',
    price: '',
}

const columns = [
    {
        title: '场次名称',
        dataIndex: 'rule_name',
    },
    {
        title: '规格名称',
        dataIndex: 'combine_name',
    },
    {
        dataIndex: 'stock_num',
        slots: { title: 'stock_num_title' },
        scopedSlots: { customRender: 'stock_num_col' },
    },
    {
        dataIndex: 'once_max',
        slots: { title: 'once_max_title' },
        scopedSlots: { customRender: 'once_max_col' },
    },
    {
        dataIndex: 'once_max_day',
        slots: { title: 'once_max_day_title' },
        scopedSlots: { customRender: 'once_max_day_col' },
    },
    {
        dataIndex: 'once_min',
        slots: { title: 'once_min_title' },
        scopedSlots: { customRender: 'once_min_col' },
    },
    {
        title: '操作',
        dataIndex: 'id',
        scopedSlots: { customRender: 'operation' },
    },
]

const titleSlot = [
    {
        slot: 'stock_num_title',
        title: '库存',
        tip: '0表示不限制，否则产品会出现“已卖光”状态！',
    },
    {
        slot: 'once_max_title',
        title: '同一ID最多购买数量',
        tip: '同一个ID最多购买数量，0表示不限制！请填写大于等于零的值！',
    },
    {
        slot: 'once_max_day_title',
        title: '同一ID每天最多购买数量',
        tip: '同一ID每天最多购买数量，0表示不限制！请填写大于等于零的值！',
    },
    {
        slot: 'once_min_title',
        title: '同一ID每次最少购买数量',
        tip: '同一ID每次最少购买数量，购买数量低于此设定的不允许参团！请填写大于等于1的值！',
    },
]

let reloadRuleCombine = true
import moment from 'moment'
import PriceCalendar from '../modules/PriceCalendar'
import ChooseStore from '../modules/ChooseStore'
import groupMerchantApi from '@/api/group/merchant/index'
export default {
    name: 'GroupBookingAppoint',
    components: { PriceCalendar, ChooseStore },
    data() {
        return {
            discount_sync_status: false,
            titleSpan: 4, // 表单标题占位
            contentSpan: 18, // 表单内容占位
            gutter: [16, 30], //间隔
            radioStyle: {
                display: 'block',
                height: '30px',
                lineHeight: '30px',
            },
            levelList: [
                { type: 0, title: '无优惠' },
                { type: 1, title: '百分比' },
                { type: 2, title: '立减' },
            ],
            activeKey: 1,
            //   表单数据
            formData: {
                s_name: '',
                appoint_time: '',
                cancel_type: 0,
                cancel_hours_type: 3,
                cancel_hours: '',
                once_max_type: 0,
                once_max: '',
                once_max_day_type: 0,
                once_max_day: '',
                once_min_type: 0,
                once_min: '',
                stock_reduce_method: 0,
                cat_fid: '',
                cat_id: '',
                auto_check: 0,
                status: 1,
                store_ids: [],
            },
            rules: [], // 场次设置
            leveloff: [],
            groupCategoryList: [], //团购专页分类
            currentGroupCat: {
                children: [],
            },
            combineList: [], //套餐列表
            ruleCombineList: [], //场次套餐组合列表
            columns,
            titleSlot,
            chooseStoreVisible: false,
            storeNames: '',
            group_id: 0,
            canSave: true,
        }
    },
    watch: {
        $route(val) {
            if (val.path == '/merchant/merchant.group/bookingAppoint') {
                if (val.query.group_id) {
                    this.group_id = val.query.group_id
                    this.getEditInfo()
                } else {
                    this.resetForm()
                }
            }
        },
    },
    mounted() {
        if (this.$route.query.group_id) {
            this.group_id = this.$route.query.group_id
            this.getEditInfo()
        } else {
            this.getLeveloff()
        }
    },
    methods: {
        moment,
        onTabChange(key) {
            this.activeKey = key
        },
        // 添加场次
        addRules() {
            let item = { rule_index, ...ruleItem }
            this.rules.push(item)
            rule_index++
            if (this.ruleCombineList.length) {
                reloadRuleCombine = false
                this.$message.warning('修改完场次信息需要重新生成套餐组合哦~')
            }
        },
        // 监听场次时间选择变动
        ruleTimeSelectChange(type, index) {
            let item = this.rules[index]
            if (item.end_time <= item.start_time && item.day == 1) {
                this.$message.warning('结束时间应该大于开始时间')
                if (item.start_time == 23) {
                    item.day = 2
                    item.end_time = 0
                } else {
                    item.end_time = item.start_time + 1
                }
                this.$set(this.rules, index, item)
            }
            if (this.ruleCombineList.length) {
                reloadRuleCombine = false
                this.$message.warning('修改完场次信息需要重新生成套餐组合哦~')
            }
        },
        // 删除场次
        removeRule(index) {
            this.rules.splice(index, 1)
            if (this.ruleCombineList.length) {
                reloadRuleCombine = false
                this.$message.warning('修改完场次信息需要重新生成套餐组合哦~')
            }
        },
        // 价格日历是否可点击
        calendarDisable(value) {
            if (
                Number(value.default_price) > 0 &&
                (value.use_hours_type == 0 || (value.use_hours_type == 1 && Number(value.use_hours) > 0))
            ) {
                return false
            } else {
                return true
            }
        },
        // 设置价格日历
        setPriceCalendar(value) {
            this.$refs.priceCalendar.openModal({ rule: value })
        },
        // 获取到价格日历表
        getPriceList(e) {
            const { priceList, rule_index } = e
            const ruleIndex = this.rules.findIndex((item) => item.rule_index == rule_index)
            let item = this.rules[ruleIndex]
            let price_calendar = []
            for (let i in priceList) {
                price_calendar.push(priceList[i])
            }
            item.price_calendar = price_calendar
            this.$set(this.rules, ruleIndex, item)
            console.log(this.rules)
        },
        // 添加套餐
        addCombines() {
            let item = { combine_index, ...combineItem }
            this.combineList.push(item)
            combine_index++
            if (this.ruleCombineList.length) {
                reloadRuleCombine = false
                this.$message.warning('修改完套餐信息需要重新生成套餐组合哦~')
            }
        },
        // 删除套餐
        removeCombine(index) {
            this.combineList.splice(index, 1)
            if (!this.combineList.length) {
                this.ruleCombineList = []
            }
            if (this.ruleCombineList.length) {
                reloadRuleCombine = false
                this.$message.warning('修改完套餐信息需要重新生成套餐组合哦~')
            }
        },
        // 生成规格关系
        addRuleCombine() {
            reloadRuleCombine = true
            if (!this.rules.length) {
                this.$message.warning('请先设置至少一个场次!')
                return
            }
            for (let item of this.combineList) {
                if (!item.name) {
                    this.$message.warning('请完善套餐名称等信息!')
                    return
                }
            }
            this.ruleCombineList = []
            this.rules.forEach((rule) => {
                const startTime = rule.start_time > 9 ? rule.start_time + ':00' : '0' + rule.start_time + ':00'
                const endTime = rule.end_time > 9 ? rule.end_time + ':00' : '0' + rule.end_time + ':00'
                const rule_name = `${startTime}至${rule.day == 2 ? '次日' : ''}${endTime}${
                    rule.use_hours_type == 0 ? '' : '内，任选' + rule.use_hours + '小时'
                }`
                this.combineList.forEach((combine) => {
                    this.ruleCombineList.push({
                        id: combine.combine_index + '_' + rule.rule_index,
                        combine_index: combine.combine_index,
                        combine_name: combine.name,
                        rule_index: rule.rule_index,
                        rule_name,
                        stock_num: 0,
                        once_max: 0,
                        once_max_day: 0,
                        once_min: 0,
                    })
                })
            })
        },
        removeRuleCombine(index) {
            this.ruleCombineList.splice(index, 1)
        },
        // 监听场次套餐组合输入变化
        handleRCInput(value, index, type) {
            // handleRCInput(e, index, col)
            console.log(value, index, type)
            if (value) {
                let item = this.ruleCombineList[index]
                item[type] = value
                let num_type = type.split('_col')
                item[num_type[0]] = value
                this.$set(this.ruleCombineList, index, item)
                console.log('9999999999999', this.ruleCombineList)
            }
        },
        // 监听单选变化
        handleRadioChange(value, type) {
            this.$set(this.formData, type, value)
            this.$forceUpdate()
        },
        chooseStore() {
            this.chooseStoreVisible = !this.chooseStoreVisible
        },
        getChooseStore(e) {
            this.formData.store_ids = e.storeIds
            this.storeNames = e.storeName
            this.chooseStoreVisible = false
        },
        // 获得添加编辑团购商品所需的数据
        getLeveloff() {
            this.request(groupMerchantApi.getGroupEditInfo).then((data) => {
                if (data.group_category_list.length) {
                    this.groupCategoryList = data.group_category_list
                    if (this.group_id) {
                        this.handleGroupCategoryChange(this.formData.cat_fid, this.formData.cat_id)
                    } else {
                        this.$set(this.formData, 'cat_fid', this.groupCategoryList[0].sort_id)
                        this.handleGroupCategoryChange(this.groupCategoryList[0].sort_id)
                    }
                }
                if (data.user_level.length && !this.group_id) {
                    this.leveloff = data.user_level
                }
                this.discount_sync_status = data.discount_sync_status
            })
        },
        // 团购专页一级分类变化
        handleGroupCategoryChange(fid, id) {
            for (let i in this.groupCategoryList) {
                let item = this.groupCategoryList[i]
                if (item.sort_id == fid) {
                    this.$set(this, 'currentGroupCat', item)
                    if (item.children && item.children.length) {
                        if (!id) {
                            this.$set(this.formData, 'cat_id', item.children[0].sort_id)
                        }
                    }
                    return
                }
            }
        },
        // 提交
        submitForm() {
            console.log(this.formData)
            if (!reloadRuleCombine) {
                this.$message.error('您修改完场次或套餐信息后未重新生成套餐组合消息，请点击”生成套餐关系“重新生成哦~')
                return
            }
            if (!this.canSave) return

            if (this.validateForm()) {
                this.canSave = false
                const { formData } = this
                let params = {
                    s_name: formData.s_name,
                    appoint_time: formData.appoint_time,
                    cancel_type: formData.cancel_type == 1 ? formData.cancel_hours_type : formData.cancel_type,
                    cancel_hours: formData.cancel_hours,
                    once_max: formData.once_max_type == 1 ? formData.once_max : formData.once_max_type,
                    once_max_day: formData.once_max_day_type == 1 ? formData.once_max_day : formData.once_max_day_type,
                    once_min: formData.once_min_type == 1 ? formData.once_min : formData.once_min_type,
                    stock_reduce_method: formData.stock_reduce_method,
                    cat_fid: formData.cat_fid,
                    cat_id: formData.cat_id,
                    auto_check: formData.auto_check,
                    status: formData.status,
                    store_ids: formData.store_ids,
                    leveloff_list: this.leveloff,
                }
                params.rules = this.rules.map((item) => ({
                    rule_index: item.rule_index,
                    rule_id: item.rule_id,
                    start_time: item.start_time * 3600,
                    end_time: item.day == 2 ? item.end_time * 3600 + 86400 : item.end_time * 3600,
                    use_hours: item.use_hours_type == 1 ? item.use_hours : 0,
                    count: item.count,
                    default_price: item.default_price,
                    price_calendar: item.price_calendar,
                }))
                params.combine = this.combineList
                params.rule_combine = this.ruleCombineList
                params.group_id = this.group_id
                console.log('----------params', params)
                this.request(groupMerchantApi.saveBookingAppoint, params)
                    .then((data) => {
                        this.activeKey = 1
                        if (!this.$route.query.group_id) {
                            this.resetForm()
                        }
                        this.$message.success('提交成功！', 2, () => {
                            // 保存成功后返回微页面列表页
                            this.$message.destroy()
                            this.$router.push({ path: '/merchant/merchant.group/groupList' })
                            this.canSave = true
                        })
                    })
                    .catch(() => {
                        this.canSave = true
                    })
            }
        },

        // 获取编辑信息
        getEditInfo() {
            this.request(groupMerchantApi.showBookingAppoint, { group_id: this.group_id }).then((data) => {
                this.formData = JSON.parse(JSON.stringify(data))
                this.getLeveloff()
                this.rules = data.rules.map((item) => ({
                    rule_index: item.rule_id,
                    rule_id: item.rule_id,
                    start_time: item.start_time / 3600,
                    day: item.end_time >= 86400 ? 2 : 1,
                    end_time: item.end_time >= 86400 ? (item.end_time - 86400) / 3600 : item.end_time / 3600,
                    use_hours_type: item.use_hours > 0 ? 1 : 0,
                    use_hours: item.use_hours > 0 ? item.use_hours : '',
                    count: item.count,
                    default_price: item.default_price,
                    price_calendar: item.price_calendar,
                }))
                // 0=不可取消 1=到期前几小时取消 2=随时可取消 3=开场前可取消
                this.$set(this.formData, 'cancel_type',data.cancel_type == 3 || data.cancel_type == 1 ? 1 : data.cancel_type)
                this.$set(this.formData, 'cancel_hours_type',data.cancel_type == 1?1:3)
                this.$set(this.formData, 'cancel_hours',data.cancel_type == 1 || data.cancel_type == 3 ? data.cancel_hours : '')

                // 店铺信息
                if (data.store.ids) {
                    let store_ids = data.store.ids ? data.store.ids : []
                    let store_name = data.store.detail ? data.store.detail : []
                    let storeNameDetail = []
                    store_ids.forEach((ids) => {
                        store_name.forEach((name) => {
                            if (ids.store_id == name.store_id) {
                                storeNameDetail.push(name.name)
                                ids.name = name.name
                                this.storeNames = storeNameDetail.join(',')
                            }
                        })
                    })
                    this.$set(this.formData, 'store_ids', store_ids)
                }
                this.formData.once_max_type = this.formData.once_max > 0 ? 1 : 0
                this.formData.once_max = this.formData.once_max > 0 ? this.formData.once_max : ''
                this.formData.once_max_day_type = this.formData.once_max_day > 0 ? 1 : 0
                this.formData.once_max_day = this.formData.once_max_day > 0 ? this.formData.once_max_day : ''
                this.formData.once_min_type = this.formData.once_min > 0 ? 1 : 0
                this.formData.once_min = this.formData.once_min > 0 ? this.formData.once_min : ''
                this.combineList = data.combine.map((item) => ({
                    combine_index: item.combine_id,
                    ...item,
                }))
                this.ruleCombineList = data.rule_combine.map((item) => ({
                    combine_index: item.combine_id,
                    rule_index: item.rule_id,
                    ...item,
                }))
                this.leveloff = data.leveloff_list
                this.formData = JSON.parse(JSON.stringify(this.formData))
                console.log('--------this.formData', this.formData)
            })
        },
        resetForm() {
            Object.assign(this.$data, this.$options.data())
            this.getLeveloff()
        },

        // 验证表单
        validateForm() {
            // tab1
            if (!this.formData.s_name) {
                this.$message.error('请输入场次名称！')
                this.activeKey = 1
                return false
            }
            if (!this.rules.length) {
                this.$message.error('请设置至少一个场次！')
                this.activeKey = 1
                return false
            }
            for (let item of this.rules) {
                if (!item.count || !item.default_price || (item.use_hours_type == 1 && !item.use_hours)) {
                    this.$message.error('请完善场次设置信息')
                    this.activeKey = 1
                    return false
                }
            }
            if (isEmpty(this.formData.appoint_time)) {
                this.$message.error('请输入可提前预约时长！')
                this.activeKey = 1
                return false
            }
            if (this.formData.cancel_type == 1 && isEmpty(this.formData.cancel_hours)) {
                this.$message.error('请输入可提前取消时长！')
                this.activeKey = 1
                return false
            }
            if (!this.formData.store_ids.length) {
                this.$message.error('请选择适用店铺！')
                this.activeKey = 1
                return false
            }

            // tab2
            if (this.combineList.length) {
                for (let item of this.combineList) {
                    if (!item.name || !item.price) {
                        this.$message.error('请完善套餐的名称和价格信息')
                        this.activeKey = 2
                        return false
                    }
                }
            }
            if (this.ruleCombineList.length) {
                for (let item of this.ruleCombineList) {
                    if (
                        isEmpty(item.stock_num) ||
                        isEmpty(item.once_max) ||
                        isEmpty(item.once_max_day) ||
                        isEmpty(item.once_min)
                    ) {
                        this.$message.error('请完善套餐组合关系信息')
                        this.activeKey = 2
                        return false
                    }
                }
            }
            if (this.formData.once_max_type == 1 && isEmpty(this.formData.once_max)) {
                this.$message.error('请输入ID最多购买限购数量')
                this.activeKey = 2
                return false
            }
            if (this.formData.once_max_day_type == 1 && isEmpty(this.formData.once_max_day)) {
                this.$message.error('请输入ID每天最多购买限购数量')
                this.activeKey = 2
                return false
            }
            if (this.formData.once_min_type == 1 && isEmpty(this.formData.once_min)) {
                this.$message.error('请输入ID每次最少购买数量')
                this.activeKey = 2
                return false
            }
            // tab3
            // if (isEmpty(this.formData.cat_fid) || isEmpty(this.formData.cat_id)) {
            //   this.$message.error('请输入团购专页的一级和二级分类')
            //   return false
            // }
            return true
        },
    },
}
function isEmpty(val) {
    return typeof val === 'undefined' || val === null || val === ''
}
</script>

<style scoped lang="less">
.booking-appoint {
    .form-row {
        font-size: 14px;
        line-height: 35px;
        .form-title {
            text-align: right;
            color: rgba(0, 0, 0, 0.85);
        }
        .help {
            color: rgba(0, 0, 0, 0.45);
            line-height: 24px;
            margin-top: 5px;
        }
        .unit {
            margin-left: 10px;
        }
    }
    .rule-card {
        background-color: #f7f7f7;
        border-radius: 10px;
        padding: 10px;
        margin-bottom: 10px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        .left {
            flex: 1;
            .col {
                display: flex;
                margin-bottom: 10px;
                .title {
                    color: rgba(0, 0, 0, 0.85);
                    width: 60px;
                }
                .row-content {
                    flex: 1;
                }
            }
        }
        .right {
            width: 100px;
        }
    }

    .leveloff {
        display: flex;
        align-items: center;
        margin-top: 10px;
        .lname {
            color: rgba(0, 0, 0, 0.85);
            font-size: 16px;
            margin-right: 30px;
            width: 120px;
            text-align: right;
        }
    }

    .required {
        color: red;
        margin-right: 2px;
    }

    .submit {
        margin: 40px 0 100px 10px;
    }
}
</style>
