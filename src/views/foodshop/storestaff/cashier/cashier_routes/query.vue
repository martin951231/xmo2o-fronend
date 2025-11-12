<template>
    <div class="staff-order-list pt-20 pl-20 pr-20 pb-20">
        <a-spin :spinning="spinning" :tip="L('正在退款中')">
            <a-form layout="inline" ref="search_header">
                <a-form-item :label="L('下单时间') + ':'">
                    <a-range-picker
                        @change="dateOnChange"
                        :ranges="pickerRanges"
                        :allowClear="true"
                        v-model="search_data"
                        style="320px"
                    >
                        <a-icon slot="suffixIcon" type="calendar" />
                    </a-range-picker>
                </a-form-item>
                <a-form-item :label="L('手动搜索') + ':'">
                    <a-select
                        class="selectType"
                        style="width: 120px; text-align: center"
                        default-value="queryParam.searchtype"
                        v-model="queryParam.searchtype"
                    >
                        <a-select-option :value="item.key" :key="item.key" v-for="item in search_keyword">{{
                            item.value
                        }}</a-select-option>
                    </a-select>
                    <a-input style="width: 260px" v-model="queryParam.keyword" allowClear />
                </a-form-item>
                <a-form-item>
                    <a-button class="mr-10" type="primary" icon="search" @click="getOrderList()">{{
                        L('查询')
                    }}</a-button>
                    <a-button icon="download" @click="$refs.ExportAddModal.exports()">{{ L('导出订单') }}</a-button>
                </a-form-item>
            </a-form>
            <div class="mt-50" v-show="statisticsData">
                <a-card>
                    <a-row type="flex" justify="space-around" align="middle">
                        <a-col v-for="item in statisticsOptions" :key="item.prop">
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
            <div class="mt-10">
                <a-tabs :activeKey="queryParam.order_status" @change="statusChange">
                    <a-tab-pane key="0" :tab="L('全部')"></a-tab-pane>
                    <a-tab-pane key="1" :tab="L('待付款')"></a-tab-pane>
                    <a-tab-pane key="2" :tab="L('待落座')"></a-tab-pane>
                    <a-tab-pane key="3" :tab="L('就餐中')"></a-tab-pane>
                    <a-tab-pane key="4" :tab="L('已完成')"></a-tab-pane>
                    <a-tab-pane key="5" :tab="L('已取消')"></a-tab-pane>
                </a-tabs>
            </div>
            <a-table
                :columns="columns"
                :data-source="data"
                :pagination="pagination"
                @change="tableChange"
                rowKey="order_id"
                :loading="loading"
            >
                <span slot="order_status" slot-scope="text, record"
                    ><a-badge :status="record.order_status | statusFilter" :text="text"
                /></span>
                <span slot="order_type" slot-scope="text, record">
                    <a-tag v-if="text == 1" color="pink">{{ L('预订单') }}</a-tag>
                    <a-tag v-if="record.is_self_take == 1" color="purple">{{ L('自取单') }}</a-tag>
                    <a-tag v-if="record.is_self_take == 0 && text == 0" color="cyan">{{ L('堂食单') }}</a-tag>
                    <!-- <a-badge status="green" v-if="text == 1" :text="预订单" />
          <a-badge status="green" v-else-if="record.is_self_take == 1" :text="自取单" />
          <a-badge status="green" v-else :text="堂食单" /> -->
                </span>
                <template slot="action" slot-scope="text, record">
                    <a class="mr-10 mt-10 mb-10 inline-block" @click="look(record)">{{ L('查看') }}</a>
                    <a
                        v-if="
                            Number(record.order_status) > 2 &&
                            Number(record.order_status) < 6 &&
                            Number(record.order_status) != 5
                        "
                        class="inline-block"
                        style="margin-left: 10px"
                        @click="print(record)"
                    >
                        {{ L('打印') }}
                    </a>
                </template>
            </a-table>
            <a-drawer
                width="520"
                :title="L('订单详情')"
                placement="right"
                :closable="false"
                :visible="visible"
                @after-visible-change="afterVisibleChange"
                @close="onClose"
                class="detail-content"
            >
                <order-detail
                    ref="OrderDetailModal"
                    :detail="detail"
                    :canRefund="can_refund_dinging_order"
                    @look="look"
                    @closeOpt="onClose"
                    @updateList="getOrderList"
                    @updateSpinning="updateSpinning"
                />
            </a-drawer>
        </a-spin>
        <export-add ref="ExportAddModal" exportUrl="/foodshop/storestaff.order/export" :queryParam="queryParam" />
        <a-modal
            v-model="printmodalVisiable"
            :title="L('请选择打印类型')"
            @ok="handlePrintOk"
            @cancel="handlePrintCancel"
            centered
            :width="450"
            destroyOnClose
        >
            <div class="print">
                <a-checkbox-group v-model="checkedList" :options="plainOptions" @change="onPrintTypeChange" />
                <br />
                <div class="mt-20 pt-10 bt-f1">
                    <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onPrintCheckAllChange">{{
                        L('全选')
                    }}</a-checkbox>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import foodshopPlatformApi from '@/api/foodshop/platform'
import foodshopMerchantApi from '@/api/foodshop/merchant'
import AreaSearch from '@/views/common/area/AreaSearch.vue'
import OrderDetail from '@/views/foodshop/storestaff/cashier/components/OrderDetail.vue'
import ExportAdd from '@/views/common/export/ExportAdd.vue'
const data = []

const statusMap = ['error', 'error', 'error', 'processing', 'success', 'default', 'processing', 'processing']
let checkList = []
let checked = ['customer_account', 'menu', 'pre_account', 'bill_account']
export default {
    props: {
        refresh: {
            type: Number,
            default: 0,
        },
    },
    components: {
        AreaSearch,
        OrderDetail,
        ExportAdd,
    },
    data() {
        this.cacheData = data.map((item) => ({ ...item }))
        return {
            form: this.$form.createForm(this),
            loading: true,
            mdl: {},
            visible: false,
            statusMap,
            id: 1,
            timeTab: '',
            orderId: 0,
            detail: {}, // 订单详情
            search_data: [moment().subtract(7, 'days'), moment()],
            exportUrl: foodshopPlatformApi.orderExportUrl,
            search_keyword: [
                {
                    key: 'real_orderid',
                    value: this.L('订单编号'),
                },
                {
                    key: 'third_id',
                    value: this.L('流水号'),
                },
                {
                    key: 'username',
                    value: this.L('下单人'),
                },
                {
                    key: 'phone',
                    value: this.L('下单人电话'),
                },
            ],
            search_payType: [
                {
                    key: 'all',
                    value: this.L('全部'),
                },
                {
                    key: 'wechat',
                    value: this.L('微信支付'),
                },
                {
                    key: 'alipay',
                    value: this.L('支付宝支付'),
                },
                {
                    key: 'balance',
                    value: this.L('余额支付'),
                },
            ],
            statisticsOptions: [
                {
                    title: '订单总额',
                    desc: '订单总金额',
                    prop: 'total_price',
                    unit: '元',
                },
                {
                    title: '实际支付总额',
                    desc: '实际支付总金额',
                    prop: 'price',
                    unit: '元',
                },
                {
                    title: '线下支付总额',
                    desc: '线下支付总额包含订单线下支付金额之和',
                    prop: 'offline_money',
                    unit: '元',
                },
                {
                    title: '线上支付总额',
                    desc: '线上支付总额包括在线支付的金额、平台余额支付金额、商家余额支付金额、商家赠送余额支付金额和企业预存款余额支付金额，去除退款金额',
                    prop: 'online_money',
                    unit: '元',
                },
                {
                    title: '平台余额支付总额',
                    desc: '平台余额支付总金额',
                    prop: 'system_balance',
                    unit: '元',
                },
                {
                    title: '商家余额支付总额',
                    desc: '商家余额支付总金额',
                    prop: 'balance_merchant',
                    unit: '元',
                },
                {
                    title: '优惠总额',
                    desc: '优惠总额',
                    prop: 'discount_money',
                    unit: '元',
                },
            ],
            statisticsData: '',
            // 查询参数
            queryParam: {
                searchtype: 'real_orderid',
                show_goods_detail: '1',
                order_status: '0',
                payType: 'all',
            },
            pagination: {
                pageSize: 10,
                total: 10,
                current: 1,
                'show-total': (total) => this.L('共 X1 条记录', { X1: total }),
                'show-size-changer': true,
                'show-quick-jumper': true,
            },
            // 表头
            columns: [
                {
                    // width: '15%',
                    title: this.L('订单编号'),
                    dataIndex: 'real_orderid',
                },
                {
                    title: this.L('订单总额'),
                    dataIndex: 'total_price',
                    // width: '12%',
                    sorter: (a, b) => a.total_price - b.total_price,
                },
                {
                    title: this.L('实际支付'),
                    // width: '12%',
                    dataIndex: 'pay_price',
                    sorter: (a, b) => a.pay_price - b.pay_price,
                },
                {
                    title: this.L('线下支付'),
                    // width: '12%',
                    dataIndex: 'offline_money',
                    sorter: (a, b) => a.offline_money - b.offline_money,
                },
                {
                    title: this.L('线上支付金额'),
                    // width: '12%',
                    dataIndex: 'online_money',
                    sorter: (a, b) => a.online_money - b.online_money,
                },
                {
                    title: this.L('平台余额支付'),
                    // width: '12%',
                    dataIndex: 'system_balance',
                    sorter: (a, b) => a.system_balance - b.system_balance,
                },
                {
                    title: this.L('商家余额支付'),
                    // width: '12%',
                    dataIndex: 'balance_merchant',
                    sorter: (a, b) => a.balance_merchant - b.balance_merchant,
                },
                {
                    // width: '10%',
                    title: this.L('下单人'),
                    dataIndex: 'username',
                    // scopedSlots: { customRender: 'marchant_name' }
                },
                {
                    title: this.L('下单人电话'),
                    // width: '10%',
                    dataIndex: 'phone',
                    // scopedSlots: { customRender: 'marchant_name' }
                },
                {
                    title: this.L('下单时间'),
                    // width: '10%',
                    dataIndex: 'create_time',
                    sorter: (a, b) => a.create_time_s - b.create_time_s,
                },
                {
                    title: this.L('桌台号'),
                    // width: 120,
                    dataIndex: 'table_id',
                    scopedSlots: { customRender: 'table_id' },
                },
                {
                    title: this.L('支付方式'),
                    // width: 120,
                    dataIndex: 'pay_type_txt',
                    scopedSlots: { customRender: 'pay_type_txt' },
                },
                {
                    title: this.L('订单状态'),
                    // width: '10%',
                    dataIndex: 'order_status_txt',
                    scopedSlots: {
                        customRender: 'order_status',
                    },
                    sorter: (a, b) => a.order_status - b.order_status,
                },
                // {
                //   title: '订单类型',
                //   width: 180,
                //   dataIndex: 'is_book',
                //   scopedSlots: {
                //     customRender: 'order_type',
                //   },
                // },
                {
                    title: this.L('操作'),
                    // width: '10%',
                    dataIndex: 'action',
                    scopedSlots: {
                        customRender: 'action',
                    },
                },
            ],
            data,
            isShow: 1,
            store_id: 0,
            isSystem: 1,
            orderListUrl: '',
            // orderDetailUrl: foodshopPlatformApi.orderDetail,
            windowHeight: 0,
            searchHeight: 0,
            tableContentHeight: 0,
            printmodalVisiable: false,
            indeterminate: false,
            checkAll: true,
            checkedList: checked,
            plainOptions: checkList,
            modalWidth: 450,
            showFooter: true,
            pickerRanges: {},
            spinning: false,
            can_refund_dinging_order: undefined, // 控制店员退款权限 0无权限 1有权限
        }
    },
    watch: {
        refresh(val) {
            this.pagination.current = 1
            this.queryParam = {
                searchtype: 'real_orderid',
                show_goods_detail: '1',
                order_status: '0',
            }
            this.search_data = []
            this.getOrderList()
        },
    },
    created() {
        this.$emit('getcurrent', 'query')
        const pageInfo = Vue.ls.get('storestaff_page_info')
        this.store_id = pageInfo.store_id
        this.queryParam.store_id = pageInfo.store_id
        if (pageInfo.can_refund_dinging_order !== undefined) {
            this.can_refund_dinging_order = pageInfo.can_refund_dinging_order
        }
        this.orderListUrl = '/foodshop/storestaff.order/orderList'
        this.exportUrl = foodshopMerchantApi.orderExportUrl
        this.isSystem = 0

        this.pickerRanges[this.L('今日')] = [moment(), moment()]
        this.pickerRanges[this.L('昨日')] = [moment().subtract(1, 'days'), moment().subtract(1, 'days')]
        this.pickerRanges[this.L('近七天')] = [moment().subtract(7, 'days'), moment()]
        this.pickerRanges[this.L('近30天')] = [moment().subtract(30, 'days'), moment()]

        this.plainOptions = [
            { label: this.L('打印客看单'), value: 'customer_account' },
            { label: this.L('打印后厨单'), value: 'menu' },
            { label: this.L('打印预结单'), value: 'pre_account' },
            { label: this.L('打印结账单'), value: 'bill_account' },
        ]

        this.getOrderList()
    },
    mounted() {
        this.$nextTick(() => {
            this.init()
            window.onresize = () => {
                setTimeout(() => {
                    this.init()
                }, 600)
            }
        })
    },
    filters: {
        statusFilter(type) {
            const statusMap = ['error', 'error', 'error', 'processing', 'success', 'default', 'error', 'processing']
            return statusMap[type]
        },
    },
    methods: {
        moment,
        init() {
            const windowHeight = document.body.clientHeight
            if (this.$refs.search_header && this.$refs.search_header.$el) {
                const searchHeight = window.getComputedStyle(this.$refs.search_header.$el).height.replace('px', '')
                this.tableContentHeight = windowHeight - searchHeight - 40 - 55 - 50 - 55 - 10 - 20
            }
        },
        // 获取列表信息
        getOrderList() {
            this.loading = true
            this.queryParam['page'] = this.pagination.current
            if (this.orderListUrl) {
                this.request(this.orderListUrl, this.queryParam).then((res) => {
                    this.data = res.list
                    this.pagination.total = res.total
                    this.statisticsData = res.statistics_data
                    setTimeout(() => {
                        this.loading = false
                    }, 100)
                })
            }
        },
        // 订单详情
        getOrderDetail() {
            // console.log(this.orderDetailUrl)
            // if (this.orderDetailUrl) {
            //   this.request(this.orderDetailUrl, { order_id: this.orderId }).then((res) => {
            // this.detail = res
            //     this.detail.order_status_show = this.statusMap[this.detail.order.order_status]
            //   })
            // }
        },
        // 导出订单
        exportOrder() {},
        // 切换状态
        statusChange(key) {
            if (!this.loading) {
                this.queryParam.order_status = key
                this.page = 1
                this.pagination.current = this.page
                this.getOrderList()
            }
        },
        // 进行重置
        resetList() {
            // this.queryParam = {}
            for (var i in this.queryParam) {
                if (i === 'searchtype') {
                    this.queryParam[i] = 'real_orderid'
                } else {
                    this.queryParam[i] = ''
                }
            }
            this.timeTab = ''
            this.search_data = []
            this.id = this.id + 1
            this.getOrderList()
        },
        // 城市搜索内容
        handleSelect(area) {
            this.queryParam.city_id = area.cityId
            this.queryParam.province_id = area.provinceId
            this.queryParam.area_id = area.areaId
        },
        // 切换时间
        timeTabChange(e) {
            var dayObj = new Date()
            dayObj.setTime(dayObj.getTime())
            var endTime = dayObj.getFullYear() + '-' + (dayObj.getMonth() + 1) + '-' + dayObj.getDate()
            if (e.target.value == 'today') {
                var startTime = endTime
            } else if (e.target.value == 'sevenDay') {
                // 前7天的时间
                var dayObj = new Date()
                dayObj.setTime(dayObj.getTime() - 7 * 24 * 60 * 60 * 1000)
                var startTime = dayObj.getFullYear() + '-' + (dayObj.getMonth() + 1) + '-' + dayObj.getDate()
            } else if (e.target.value == 'thirtyDay') {
                // 前30天的时间
                var dayObj = new Date()
                dayObj.setTime(dayObj.getTime() - 30 * 24 * 60 * 60 * 1000)
                var startTime = dayObj.getFullYear() + '-' + (dayObj.getMonth() + 1) + '-' + dayObj.getDate()
            }
            this.search_data = [moment(startTime, 'YYYY-MM-DD'), moment(endTime, 'YYYY-MM-DD')]
            this.queryParam.start_time = startTime
            this.queryParam.end_time = endTime
        },
        // 日期切换，重新赋值
        dateOnChange(date, dateString) {
            this.queryParam.start_time = dateString[0]
            this.queryParam.end_time = dateString[1]
        },
        // 表格中变动  这里只针对页面页数切换
        tableChange(e) {
            this.queryParam['pageSize'] = e.pageSize
            if (e.current && e.current > 0) {
                this.page = e.current
                this.pagination.current = e.current
                this.getOrderList()
            }
        },
        // 查看详情  触发右侧抽屉弹出
        look(record) {
            // this.detail = record
            // this.visible = true
            // this.orderId = record.order_id
            var _that = this
            this.request(this.orderListUrl, { order_id: record.order_id, show_goods_detail: 1 }).then((res) => {
                _that.detail = res.list[0]
                _that.visible = true
                _that.orderId = record.order_id
            })

            // this.getMessageSuggestionsDetail(e.suggestions_id)
            // this.getOrderDetail()
        },
        afterVisibleChange(val) {
            console.log('visible', val)
        },
        showDrawer() {
            this.visible = true
        },
        onClose() {
            this.visible = false
        },
        // 打印订单
        print(record) {
            if (record.is_self_take) {
                checkList = [{ label: this.L('打印结账单'), value: 'bill_account' }]
                checked = ['bill_account']
            } else if (record.order_from == '5') {
                checkList = [
                    { label: this.L('打印后厨单'), value: 'menu' },
                    { label: this.L('打印结账单'), value: 'bill_account' },
                ]
                checked = ['menu', 'bill_account']
            } else {
                checkList = [
                    { label: this.L('打印客看单'), value: 'customer_account' },
                    { label: this.L('打印后厨单'), value: 'menu' },
                    { label: this.L('打印预结单'), value: 'pre_account' },
                    { label: this.L('打印结账单'), value: 'bill_account' },
                ]
                checked = ['customer_account', 'menu', 'pre_account', 'bill_account']
            }
            this.checkedList = checked
            this.plainOptions = checkList
            this.orderId = record.order_id
            this.printmodalVisiable = true
        },
        handlePrintOk() {
            if (this.checkedList.length) {
                this.request('/foodshop/storestaff.print/printOrder', {
                    order_id: this.orderId,
                    type: this.checkedList,
                }).then((res) => {
                    this.handlePrintCancel()
                    this.$message.success(res.msg || this.L('打印成功'))
                })
            } else {
                this.$message.warning(this.L('请选择打印类型'))
            }
        },
        handlePrintCancel() {
            this.printmodalVisiable = false
            this.checkAll = true
            this.indeterminate = false
            this.checkedList = checked
        },
        onPrintTypeChange(checkedList) {
            this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length
            this.checkAll = checkedList.length === this.plainOptions.length
        },
        onPrintCheckAllChange(e) {
            Object.assign(this, {
                checkedList: e.target.checked ? checked : [],
                indeterminate: false,
                checkAll: e.target.checked,
            })
        },
        updateSpinning(res) {
            this.spinning = res
        },
    },
}
</script>

<style scoped>
.staff-order-list {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    overflow: hidden;
}
.print /deep/ .ant-checkbox-group {
    width: 200px;
}
.print /deep/ .ant-checkbox-group-item {
    margin-bottom: 8px;
}
.detail-content >>> .ant-drawer-body {
    padding: 0;
}
.selectType /deep/ .ant-select-selection__rendered {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
}
</style>
