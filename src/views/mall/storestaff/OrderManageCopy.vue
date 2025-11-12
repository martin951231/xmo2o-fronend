<template>
    <div class="pt-20 pl-20 pr-20 pb-20 bg-ff">
        <!-- 查询条件 -->
        <a-form-model layout="inline" :model="searchForm">
            <a-form-item label="搜索" class="search a-form-item">
                <span class="input-class flex align-center">
                    <a-input class="flex-sub" placeholder="请输入搜索内容" v-model="searchForm.content"> </a-input>
                    <span class="ml-10">
                        <a-select
                            style="width: 140px"
                            placeholder="请选择"
                            v-model="searchForm.search_type"
                            :getPopupContainer="
                                (triggerNode) => {
                                    return triggerNode.parentNode
                                }
                            "
                        >
                            <a-select-option v-for="item in search_type_options" :key="item.value">
                                {{ item.label }}
                            </a-select-option>
                        </a-select>
                    </span>
                </span>
            </a-form-item>
            <a-form-model-item label="下单时间" class="a-form-item">
                <a-range-picker
                    class="input-class"
                    :ranges="{
                        今日: [moment(), moment()],
                        近7天: [moment().subtract(6, 'days'), moment()],
                        近15天: [moment().subtract(14, 'days'), moment()],
                        近30天: [moment().subtract(29, 'days'), moment()],
                    }"
                    :value="time"
                    format="YYYY-MM-DD"
                    @change="onDateRangeChange"
                    :getCalendarContainer="
                        (triggerNode) => {
                            return triggerNode.parentNode
                        }
                    "
                />
            </a-form-model-item>
            <a-form-item label="营销活动" class="a-form-item">
                <a-select
                    class="input-class"
                    placeholder="请选择"
                    v-model="searchForm.act"
                    :getPopupContainer="
                        (triggerNode) => {
                            return triggerNode.parentNode
                        }
                    "
                >
                    <template v-for="item in act_Options">
                        <a-select-option v-if="item.show" :key="item.value">
                            {{ item.label }}
                        </a-select-option>
                    </template>
                </a-select>
            </a-form-item>
            <a-form-item label="支付方式" class="a-form-item">
                <a-select
                    class="input-class"
                    placeholder="请选择"
                    v-model="searchForm.pay"
                    :getPopupContainer="
                        (triggerNode) => {
                            return triggerNode.parentNode
                        }
                    "
                >
                    <a-select-option v-for="item in pay_options" :key="item.value">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="配送方式" class="a-form-item">
                <a-select
                    class="input-class"
                    placeholder="请选择"
                    v-model="searchForm.express_type"
                    :getPopupContainer="
                        (triggerNode) => {
                            return triggerNode.parentNode
                        }
                    "
                >
                    <a-select-option v-for="item in express_type_options" :key="item.value">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="订单来源" class="a-form-item">
                <a-select
                    class="input-class"
                    placeholder="请选择"
                    v-model="searchForm.source"
                    :getPopupContainer="
                        (triggerNode) => {
                            return triggerNode.parentNode
                        }
                    "
                >
                    <a-select-option v-for="item in source_options" :key="item.value">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="核销方式" class="a-form-item">
                <a-select class="input-class" placeholder="请选择" v-model="searchForm.verify">
                    <a-select-option v-for="item in verify_status" :key="item.value">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-model-item>
                <a-button type="primary" @click="getOrderList('', true)"> 查询</a-button>
                <a-button class="ml-20" @click="resetForm()"> 重置</a-button>
                <a-button type="primary" class="ml-20" @click="$refs.exportColumnsModal.getColumnsConfig()"> 导出订单</a-button>
                <a-button type="primary" class="ml-20" @click="importDeliveryMethodClick" v-if="system_config && system_config.open_mall_staff_change_deliver == 1"> 批量导入配送方式</a-button>
            </a-form-model-item>
        </a-form-model>

        <!-- 统计 -->
        <div class="mt-row" v-show="statisticsData">
            <a-card>
                <a-row type="flex" justify="space-around" align="middle">
                    <a-col :span="6" v-for="item in statisticsOptions" :key="item.prop">
                        <a-row>
                            <a-col class="text-center pointer">
                                <a-tooltip>
                                    <template slot="title">
                                        {{ item.desc }}
                                    </template>
                                    {{ item.title }}
                                    <a-icon type="exclamation-circle" />
                                </a-tooltip>
                            </a-col>
                            <a-col class="text-center">
                                <span class="statisticsData">
                                    {{ statisticsData[item.prop] || 0 }}{{ item.unit }}
                                </span>
                            </a-col>
                        </a-row>
                    </a-col>
                </a-row>
            </a-card>
        </div>

        <!-- tabs -->
        <div v-show="tabList.length" class="mt-row">
            <a-tabs
                :animated="false"
                :activeKey="searchForm.status"
                :default-active-key="defaultActiveKey"
                @change="tabsChange"
            >
                <a-tab-pane v-for="item in tabList" :key="item.status">
                    <span slot="tab">
                        <a-badge @click="changeColor(item.status)"> {{ item.label }} </a-badge><br />
                        <a-badge
                            align="middle"
                            :class="isTrue == item.status * 1 ? 'colorBlue' : 'colorRed'"
                            @click="changeColor(item.status)"
                        >
                            {{ item.num }}
                        </a-badge>
                    </span>
                    <!-- 订单列表 -->
                    <!-- 表头 -->
                    <div class="order-header">
                        <a-row type="flex" justify="space-between" align="middle">
                            <a-col :span="10">
                                <a-row type="flex" justify="space-between">
                                    <a-col :span="12" class="padding-left-24">商品</a-col>
                                    <a-col :span="6" class="text-center">单价</a-col>
                                    <a-col :span="6" class="text-center">数量</a-col>
                                </a-row>
                            </a-col>
                            <a-col :span="14">
                                <a-row type="flex" justify="space-between" align="middle">
                                    <a-col :span="4" class="text-center">
                                        <div>收货人/手机</div>
                                        <div>店铺名称</div>
                                    </a-col>
                                    <a-col :span="4" class="text-center">收货地址</a-col>
                                    <a-col :span="4" class="text-center pointer">
                                        <a-tooltip>
                                            <template slot="title">
                                                商品总价是订单内所有商品价格之和；总优惠代表所有优惠金额总和。
                                            </template>
                                            付款金额
                                            <a-icon type="exclamation-circle" />
                                        </a-tooltip>
                                    </a-col>
                                    <a-col :span="4" class="text-center">物流方式</a-col>
                                    <a-col :span="4" class="text-center">订单状态</a-col>
                                    <a-col :span="4" class="text-center">操作</a-col>
                                </a-row>
                            </a-col>
                        </a-row>
                    </div>
                    <!-- 订单item -->
                    <div class="order-body">
                        <div v-if="spinning" class="spinning">
                            <a-spin :spinning="spinning" size="large" />
                        </div>
                        <a-row v-else>
                            <a-row v-if="orderList.length">
                                <div v-for="(item, index) in orderList" :key="index">
                                    <orderItemCopy
                                        :order="item"
                                        :tabStatus="searchForm.status"
                                        @getOrderList="updateList"
                                        @updateItem="updateItem"
                                    >
                                    </orderItemCopy>
                                </div>
                            </a-row>
                            <a-row v-else style="margin-top: 100px">
                                <a-empty :image="simpleImage"></a-empty>
                            </a-row>
                        </a-row>
                    </div>

                    <!-- 分页 -->
                    <div class="mt-20 text-right" v-show="orderList.length">
                        <a-pagination
                            :current="searchForm.page"
                            :pageSize.sync="searchForm.pageSize"
                            :total="total"
                            show-size-changer
                            show-quick-jumper
                            :show-total="(total) => `共 ${total} 条记录`"
                            @change="onPageChange"
                            @showSizeChange="onPageSizeChange"
                        />
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
        <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="searchForm" />
        <import-delivery-method ref="importDeliveryMethod" @handleOk="importDeliveryMethodOk"/>

        <export-columns ref="exportColumnsModal" @getExport="getExport"/>
    </div>
</template>

<script>
import moment from 'moment'
import mallStorestaffApi from '@/api/mall/storestaff/index'
import orderItemCopy from './components/orderItemCopy'
import { Empty } from 'ant-design-vue'
import ExportAdd from '@/views/common/export/ExportAdd.vue'
import exportColumns from '../modules/exportColumns.vue'
import importDeliveryMethod from './components/importDeliveryMethod'

export default {
    name: 'OrderManage',
    data() {
        return {
            time: [],
            isTrue: 3,
            searchForm: {
                type: 'pc',
                content: '',
                search_type: '1',
                page: 1,
                pageSize: 10,
                begin_time: '',
                end_time: '',
                act: 'all',
                pay: 'all',
                express_type: '0',
                source: '',
                status: '3',
                verify: 'all',
            },
            // 1=订单编号 2=第三方支付号 3=客户姓名 4=客户电话
            search_type_options: [
                {
                    label: '订单编号',
                    value: '1',
                },
                {
                    label: '第三方支付号',
                    value: '2',
                },
                {
                    label: '客户姓名',
                    value: '3',
                },
                {
                    label: '客户电话',
                    value: '4',
                },
            ],
            // all:全部；砍价：bargain；拼团：group；限时：limited；预售：prepare；周期购：periodic；N元N价：reached；满包邮 :shipping;满赠 ：give；满减：minus；满折：discount
            act_Options: [
                {
                    label: '全部',
                    value: 'all',
                    show: true,
                },
                {
                    label: '拼团活动',
                    value: 'group',
                    show: true,
                },
                {
                    label: '秒杀活动',
                    value: 'limited',
                    show: true,
                },
                {
                    label: '砍价活动',
                    value: 'bargain',
                    show: true,
                },
                {
                    label: '预售活动',
                    value: 'prepare',
                    show: true,
                },
                {
                    label: '周期购活动',
                    value: 'periodic',
                    show: true,
                },
                {
                    label: 'N元N件活动',
                    value: 'reached',
                    show: false,
                },
                {
                    label: '满包邮活动',
                    value: 'shipping',
                    show: false,
                },
                {
                    label: '满赠活动',
                    value: 'give',
                    show: false,
                },
                {
                    label: '满减活动',
                    value: 'minus',
                    show: false,
                },
                {
                    label: '满折活动',
                    value: 'discount',
                    show: false,
                },
                {
                    label: '普通订单',
                    value: 'ordinary',
                    show: true,
                },
            ],
            // 微信支付：wechat，支付宝支付：alipay, 线下支付：offline_pay，云闪付：quick_pass，翼支付：win_pay，商家余额支付：merchant_balance，平台支付：platform_balance
            pay_options: [
                {
                    label: '全部',
                    value: 'all',
                },
                {
                    label: '微信支付',
                    value: 'wechat',
                },
                {
                    label: '支付宝支付',
                    value: 'alipay',
                },
                {
                    label: '线下支付',
                    value: 'offline_pay',
                },
                {
                    label: '云闪付',
                    value: 'quick_pass',
                },
                {
                    label: '翼支付',
                    value: 'win_pay',
                },
                {
                    label: '商家余额支付',
                    value: 'merchant_balance',
                },
                {
                    label: '平台支付',
                    value: 'platform_balance',
                },
                {
                    label: '员工卡余额支付',
                    value: 'employee_money_pay',
                },
                {
                    label: '员工卡积分支付',
                    value: 'employee_score_pay',
                },
            ],
            // 0=全部，1=骑手速运，2：快递配送， 3：同城自提
            express_type_options: [
                {
                    label: '全部',
                    value: '0',
                },
                {
                    label: '快递配送',
                    value: '2',
                },
                {
                    label: '同城自提',
                    value: '3',
                },
                {
                    label: '骑手速运',
                    value: '1',
                },
            ],
            // 全部=''，安卓APP=androidapp,苹果APP=iosapp,微信小程序=wechat_mini,微信公众号=wechat_h5,移动网页=h5
            source_options: [
                {
                    label: '全部',
                    value: '',
                },
                {
                    label: '安卓APP',
                    value: 'androidapp',
                },
                {
                    label: '苹果APP',
                    value: 'iosapp',
                },
                {
                    label: '微信小程序',
                    value: 'wechat_mini',
                },
                {
                    label: '微信公众号',
                    value: 'wechat_h5',
                },
                {
                    label: '移动网页',
                    value: 'h5',
                },
            ],
            statisticsOptions: [
                {
                    title: '实收总金额',
                    desc: '用户支付总费用加上平台补贴费用，扣除平台服务费，商家实际得到金额',
                    prop: 'sh_money',
                    unit: '元',
                },
                {
                    title: '支付总金额',
                    desc: '用户支付总费用',
                    prop: 'zf_money',
                    unit: '元',
                },
                {
                    title: '订单笔数',
                    desc: '用户总共下单的笔数',
                    prop: 'jianshu',
                    unit: '笔',
                },
                {
                    title: '退款总金额',
                    desc: '用户申请退款成功总金额',
                    prop: 'tk_money',
                    unit: '元',
                },
            ],
            statisticsData: '',
            tabList: [
                {
                    label: '全部订单',
                    num: 0,
                    status: 1,
                },
                {
                    label: '待付款',
                    num: 0,
                    status: 2, //待付款
                },
                {
                    label: '待发货',
                    num: 0,
                    status: 3, //待发货
                },
                {
                    label: '已发货',
                    num: 0,
                    status: 4, //已发货
                },
                {
                    label: '已完成',
                    num: 0,
                    status: 5, //已完成
                },
                {
                    label: '已取消',
                    num: 0,
                    status: 6, //已取消
                },
                {
                    label: '售后中',
                    num: 0,
                    status: 7, //售后中
                },
                {
                    label: '已退款',
                    num: 0,
                    status: 8, //已退款
                },
            ],
            verify_status: [
                {
                    label: '全部',
                    value: 'all',
                    show: true,
                },
                {
                    label: '手动核销（移动端）',
                    value: '1',
                    show: true,
                },
                {
                    label: '手动核销（pc端）',
                    value: '2',
                    show: true,
                },
                // {
                //     label: '手动核销',
                //     value: '1,2',
                //     show: true
                // },
                {
                    label: '扫码核销',
                    value: '3',
                    show: true,
                },
            ],
            exportUrl: mallStorestaffApi.exportOrder,
            defaultActiveKey: '3',
            total: 0,
            orderList: [],
            simpleImage: '',
            spinning: true,
            system_config: null,
        }
    },
    components: {
        ExportAdd,
        orderItemCopy,
        exportColumns,
        importDeliveryMethod,
    },
    beforeRouteEnter(to, from, next) {
        if (from.name == 'orderDetail') {
            to.meta.keepAlive = true
        } else {
            to.meta.keepAlive = false
        }
        next()
    },
    beforeCreate() {
        this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
    },
    created() {
        this.system_config = this.$getCache('system_config')
        if(this.system_config && this.system_config.internal_membership_card == 1){
            this.pay_options.push({
                label: '一卡通支付',
                value: 'ecard',
            })
        }
        this.getOrderList()
    },
    activated() {
        this.getOrderList()
    },
    methods: {
        moment,
        getPopupContainer(el, dialogContext) {},
        changeColor(status) {
            this.isTrue = status
        },
        // 查询订单
        getOrderList(order_id = '', is_search = false) {
            if (!order_id) {
                this.spinning = true
            } else {
                this.spinning = false
            }
            if (is_search == true) {
                this.$set(this.searchForm, 'page', 1)
                this.$set(this.searchForm, 'pageSize', 10)
            }
            this.request(mallStorestaffApi.getOrderListCopy, this.searchForm)
                .then((data) => {
                    let { list = [], status_num = [], collect_num = '', count = 0 } = data
                    // 统计
                    this.statisticsData = collect_num
                    // 订单状态tabs
                    if (status_num.length) {
                        status_num.forEach((item) => {
                            this.tabList.forEach((tabItem) => {
                                tabItem.status = tabItem.status.toString()
                                item.status = item.status.toString()
                                if (tabItem.status == item.status) {
                                    tabItem.num = item.num || item.num == 0 ? item.num : 0
                                    tabItem.show_text = `${tabItem.label}（${tabItem.num}）`
                                }
                            })
                        })
                    } else {
                        this.tabList = this.$options.data().tabList.map((item) => {
                            item.status = item.status.toString()
                            item.show_text =
                                item.num != '' || item.num == 0 ? `${item.label}（${item.num}）` : item.label
                            return item
                        })
                    }
                    // 订单列表
                    this.total = count
                    if (order_id && list.length) {
                        if (list && list.length) {
                            list.forEach((item, index) => {
                                if (item.order_id == order_id) {
                                    this.$set(this.orderList, index, item)
                                    if (item.children && item.children.length) {
                                        this.$set(this.orderList[index], 'children', item.children)
                                    }
                                    if (item.button) {
                                        this.$set(this.orderList[index], 'button', item.button)
                                        for (let k in item.button) {
                                            this.$set(this.orderList[index]['button'], k, item.button[k])
                                        }
                                    }
                                }
                                this.$forceUpdate()
                            })
                        } else {
                            this.orderList = []
                        }
                    } else {
                        this.orderList = []
                        if (list && list.length) {
                            list.forEach((item, index) => {
                                this.$set(this.orderList, index, item)
                                if (item.children && item.children.length) {
                                    this.$set(this.orderList[index], 'children', item.children)
                                }
                                if (item.button) {
                                    this.$set(this.orderList[index], 'button', item.button)
                                    for (let k in item.button) {
                                        this.$set(this.orderList[index]['button'], k, item.button[k])
                                    }
                                }
                                this.$forceUpdate()
                            })
                        }
                    }
                    this.spinning = false
                })
                .catch((err) => {
                    this.spinning = false
                })
        },
        // 时间选择
        onDateRangeChange(date, dateString) {
            // 更新搜索框表单数据
            this.time = [date[0], date[1]]
            this.$set(this.searchForm, 'begin_time', dateString[0])
            this.$set(this.searchForm, 'end_time', dateString[1])
        },
        // 重置
        resetForm() {
            Object.assign(this.$data, this.$options.data())
            this.getOrderList()
        },
        // tab切换
        tabsChange(key) {
            this.$set(this.searchForm, 'status', key)
            this.$set(this.searchForm, 'page', 1)
            this.$set(this.searchForm, 'pageSize', 10)
            // this.orderList = []
            this.getOrderList()
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.searchForm, 'page', page)
            this.getOrderList()
        },
        // pageSize变化
        onPageSizeChange(page, pageSize) {
            this.$set(this.searchForm, 'pageSize', pageSize)
            this.$set(this.searchForm, 'page', 1)
            this.getOrderList()
        },
        updateList() {
            this.orderList = []
            this.getOrderList()
        },
        updateItem(res) {
            this.getOrderList(res.order_id)
        },
        getExport(columns=[],callback) {
            this.searchForm['columns'] = columns.join(',');
            if (this.orderList.length) {
                this.request(this.exportUrl, this.searchForm).then((data) => {
                    // 弹层提示
                    this.$message.loading({
                        content: '加载中,请耐心等待,数量越多时间越长。',
                        key: 'updatable',
                        duration: 0,
                    })
                    // console.log('添加导出计划任务成功')
                    // this.file_url = exportApi.downloadExportFile + '?id=' + date.export_id
                    // this.file_date = date
                    let url = data.file_url
                    if (url) {
                        window.open(url)
                    }
                    this.$message.success({ content: '下载成功!', key: 'updatable', duration: 2 })
                    callback();
                }).catch(err=>{
                    callback();
                })
            } else {
                this.$message.warn('当前没有可以导出的内容')
            }
        },
        //批量导入配送方式
        importDeliveryMethodClick(){
            this.$refs.importDeliveryMethod.open('批量导入配送方式');
        },
        importDeliveryMethodOk(e){
            let formData = new FormData;
            formData.append('file',e.originFileObj)
            this.request(mallStorestaffApi.uploadOrderDeliveryExcel, formData).then((data) => {
                // 弹层提示
                this.$message.loading({
                    content: '加载中,请耐心等待,数量越多时间越长。',
                    key: 'updatable',
                    duration: 0,
                })
                this.$message.success({ content: '导入成功!', key: 'updatable', duration: 2 })
                this.$refs.importDeliveryMethod.visible = false;
                this.updateList();
            })
        },
    },
}
</script>

<style scoped>
.search >>> .ant-form-item-children {
    width: 100%;
    display: flex;
    align-items: center;
}

.statisticsData {
    font-size: 30px;
    color: #000000;
}

.order-header {
    padding: 16px 0;
    width: 100%;
    border: 1px solid #e8e8e8;
    background: #e8e8e8;
    color: rgba(0, 0, 0, 0.85);
    font-weight: normal;
    font-size: 14px;
    line-height: 1.5;
    white-space: nowrap;
    box-sizing: border-box;
}

.order-body {
    overflow-y: scroll !important;
    height: 478px !important;
}

.mt-row {
    margin-top: 0px;
}

.mb-50 {
    margin-bottom: 50px;
}

.search >>> label {
    padding-left: 26px;
}

.padding-left-24 {
    padding-left: 24px;
}

.a-form-item.ant-form-item {
    display: inline-flex;
    width: 23%;
    min-width: 360px;
}

.a-form-item >>> .ant-form-item-control-wrapper {
    flex: 1;
    min-width: 240px;
}

.input-class {
    width: 100%;
}

.ant-card-bordered {
    border: unset;
}

.mt-10.ant-table-wrapper {
    display: none;
}

.spinning {
    position: absolute;
    top: 50%;
    left: 50%;
}

.tab-item-wrap >>> .ant-badge-count,
.ant-badge-dot,
.ant-badge .ant-scroll-number-custom-component {
    transform: translate(99%, -50%);
}
.colorBlue {
    color: blue;
    width: 40px;
    text-align: center;
    font-weight: bold;
}
.colorRed {
    color: red;
    width: 40px;
    text-align: center;
    font-weight: bold;
}
</style>
