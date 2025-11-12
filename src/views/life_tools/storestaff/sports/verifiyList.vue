<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row style="margin-top: 10px">
            <a-col :span="24">
                <a-input-group compact>
                    <label style="line-height: 30px; margin-left: 15px">搜索：</label>
                    <a-select :value="queryParams.ft" @change="selectSearchBy" style="width: 100px">
                        <a-select-option v-for="item in searchBy" :key="item.key">
                            {{ item.value }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        style="width: 220px"
                        :placeholder="'请输入' + searchByMap[queryParams.ft]"
                        :value="queryParams.fv"
                        @change="keywordsChange"
                    />

                    <label style="line-height: 30px; margin-left: 20px">选择日期：</label>
                    <a-select :value="queryParams.date_by" @change="selectDateBy" style="width: 100px">
                        <a-select-option v-for="item in dateBy" :key="item.key">
                            {{ item.value }}
                        </a-select-option>
                    </a-select>
                    <a-range-picker @change="selectDate" />

                    <blockquote v-if="tabKey == '1'">
                    <label style="line-height: 30px; margin-left: 20px">订单类型：</label>
                    <a-select :value="queryParams.order_type" @change="selectOrderType" style="width: 100px">
                        <a-select-option v-for="item in orderType" :key="item.key">
                            {{ item.value }}
                        </a-select-option>
                    </a-select>
                    </blockquote>
                    <blockquote v-if="tabKey == '2'">
                    <label style="line-height: 30px; margin-left: 20px">次卡类型：</label>
                    <a-select v-model="queryParams.tools_type" :options="toolsType" style="width: 100px" placeholder="请选择">
                    </a-select>
                    </blockquote>

                    <a-button type="primary" @click="searchBtn" style="width: 80px; margin-left: 20px">搜索</a-button>
                </a-input-group>
            </a-col>
        </a-row>

        <a-row class="mt-20">
            <a-tabs v-model="tabKey" @change="tabsChange">
                <a-tab-pane key="1" tab="门票">
                    <a-table
                        style="background: #ffffff"
                        :columns="columns"
                        rowKey="order_id"
                        :data-source="dataList"
                        @change="changePage"
                        :pagination="pagination"
                    >
                        <span slot="time" slot-scope="text, item">
                            {{ item.appoint.start_time_text }} ~ {{ item.appoint.end_time_text }}
                        </span>
                    </a-table>
                </a-tab-pane>
                <a-tab-pane key="2" tab="次卡">
                    <a-table
                        style="background: #ffffff"
                        :columns="timeCardColumns"
                        rowKey="order_id"
                        :data-source="timeCardList"
                        @change="timeCardChangePage"
                        :pagination="timeCardPagination"
                    >
                        <template slot="action" slot-scope="text, record">
                            <a-button type="link" @click="getTimeCardDetail(record.order_id)">详情</a-button>
                        </template>
                    </a-table>
                </a-tab-pane>
            </a-tabs>
        </a-row>

        <a-modal
            :visible="modalVisible"
            @cancel="modalVisible = false"
            @ok="modalVisible = false"
            width="60%"
            :bodyStyle="{ maxHeight: '700px', overflowY: 'auto' }"
            title="核销详情"
        >
            <a-descriptions title="基本信息" :column="2" class="card-detail">
                <a-descriptions-item label="订单编号"> {{ timeCardDetail.orderid || '-' }} </a-descriptions-item>
                <a-descriptions-item label="订单类型"> {{ timeCardDetail.type_name || '-' }} </a-descriptions-item>
                <a-descriptions-item label="次卡名称"> {{ timeCardDetail.title || '-' }} </a-descriptions-item>
                <a-descriptions-item label="商家名称"> {{ timeCardDetail.merchant_name || '-' }} </a-descriptions-item>
                <a-descriptions-item label="订单状态">
                    {{ timeCardDetail.order_status_val || '-' }}
                </a-descriptions-item>
                <a-descriptions-item label="下单数量"> {{ timeCardDetail.num || '-' }} </a-descriptions-item>
                <a-descriptions-item label="下单时间"> {{ timeCardDetail.add_time_text || '-' }} </a-descriptions-item>
                <a-descriptions-item label="过期时间"> {{ timeCardDetail.out_time || '-' }} </a-descriptions-item>
                <a-descriptions-item label="可使用次数/总次数"
                    >{{ timeCardDetail.all_num }} / {{ timeCardDetail.total_num }}
                </a-descriptions-item>
            </a-descriptions>
            <a-descriptions title="用户信息" :column="1" class="card-detail">
                <a-descriptions-item label="下单用户昵称"> {{ timeCardDetail.nickname || '-' }} </a-descriptions-item>
                <a-descriptions-item label="下单用户手机号"> {{ timeCardDetail.phone || '-' }} </a-descriptions-item>
            </a-descriptions>
            <a-descriptions title="价格信息" :column="1" class="card-detail">
                <a-descriptions-item label="订单总价格">
                    {{ currency }}{{ timeCardDetail.total_price || 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="在线支付金额">
                    {{ currency }}{{ timeCardDetail.pay_money || 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="平台余额支付金额">
                    {{ currency }}{{ timeCardDetail.system_balance || 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="商家余额支付金额">
                    {{ currency }}{{ timeCardDetail.merchant_balance_pay || 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="商家赠送余额支付金额">
                    {{ currency }}{{ timeCardDetail.merchant_balance_give || 0 }}
                </a-descriptions-item>
            </a-descriptions>
            <template slot="footer">
                <a-button type="primary" @click="modalVisible = false"> 确定 </a-button>
            </template></a-modal
        >
    </div>
</template>

<script>
import lifeToolsStorestaffApi from '@/api/life_tools/storestaff/index'
export default {
    data() {
        return {
            currency: '￥',
            queryParams: {
                ft: 1,
                fv: '',
                stime: '',
                etime: '',
                page_size: 10,
                date_by: 1,
                order_type: 'all',
                tools_type: undefined
            },
            searchBy: [
                {
                    key: 1,
                    value: '订单号',
                },
                {
                    key: 2,
                    value: '活动名称',
                },
                {
                    key: 3,
                    value: '手机号',
                },
                {
                    key: 4,
                    value: '景区名称',
                },
            ],
            searchByMap: {
                1: '订单号',
                2: '用户昵称',
                3: '手机号',
            },
            dateBy: [
                {
                    key: 1,
                    value: '下单日期',
                },
                {
                    key: 2,
                    value: '核销日期',
                },
            ],
            orderType: [
                {
                    key: 'all',
                    value: '全部',
                },
                {
                    key: 'stadium',
                    value: '体育馆',
                },
                {
                    key: 'course',
                    value: '体育课程',
                },
                {
                    key: 'sports_activity',
                    value: '运动约战',
                },
            ],
            store_id: 0,
            dataList: [],
            isAllCheck: false,
            pagination: {
                pageSize: 10,
                total: 0,
                current: 1,
                page: 1,
            },
            columns: [
                {
                    title: this.L('订单号'),
                    dataIndex: 'orderid',
                },
                {
                    title: this.L('订单名称'),
                    dataIndex: 'title',
                },
                {
                    title: this.L('用户昵称'),
                    dataIndex: 'nickname',
                },
                {
                    title: this.L('用户手机号'),
                    dataIndex: 'phone',
                },
                {
                    title: this.L('数量'),
                    dataIndex: 'num',
                },
                {
                    title: this.L('总价'),
                    dataIndex: 'total_price',
                },
                {
                    title: this.L('订单状态'),
                    dataIndex: 'order_status_text',
                },
                {
                    title: this.L('下单时间'),
                    dataIndex: 'add_time_text',
                },
                {
                    title: this.L('核销时间'),
                    dataIndex: 'verify_time_text',
                },
            ],
            tabKey: '1',
            timeCardColumns: [
                {
                    title: this.L('订单号'),
                    dataIndex: 'orderid',
                },
                {
                    title: this.L('次卡名称'),
                    dataIndex: 'title',
                },
                {
                    title: this.L('用户昵称'),
                    dataIndex: 'nickname',
                },
                {
                    title: this.L('用户手机号'),
                    dataIndex: 'phone',
                },
                {
                    title: this.L('核销店员'),
                    dataIndex: 'staff_name',
                },
                {
                    title: this.L('下单时间'),
                    dataIndex: 'add_time_text',
                },
                {
                    title: this.L('核销时间'),
                    dataIndex: 'verify_time_text',
                },
                {
                    title: this.L('操作'),
                    dataIndex: 'action',
                    align: 'center',
                    scopedSlots: { customRender: 'action' },
                },
            ],
            timeCardList: [],
            timeCardPagination: {
                pageSize: 10,
                total: 0,
                current: 1,
                page: 1,
            },
            modalVisible: false,
            // 次卡详情
            timeCardDetail: '',
            toolsType: [
                {
                    value: 'scenic',
                    label: '景区'
                },
                {
                    value: 'stadium',
                    label: '场馆'
                },
                {
                    value: 'course',
                    label: '课程'
                }
            ]
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            this.queryParams.page_size = this.tabKey == 1 ? this.pagination.pageSize : this.timeCardPagination.pageSize
            this.queryParams.page = this.tabKey == 1 ? this.pagination.current : this.timeCardPagination.current
            this.queryParams.type = this.tabKey == 1 ? 'ticket' : 'card'
            let params = {
                ...this.queryParams,
                tools_type: this.queryParams.tools_type?this.queryParams.tools_type:''
            }

            this.request(lifeToolsStorestaffApi.sportsVerifyList, params).then((res) => {
                if (this.tabKey == 1) {
                    this.dataList = res.data
                    this.pagination.total = res.total
                } else {
                    this.timeCardList = res.data
                    this.timeCardPagination.total = res.total
                }
            })
        },
        keywordsChange(e) {
            this.queryParams.fv = e.target.value
        },

        selectSearchBy(val) {
            this.queryParams.ft = val
        },
        searchBtn() {
            if (this.tabKey == 1) {
                this.pagination.current = 1
            } else {
                this.timeCardPagination.current = 1
            }
            this.getData()
        },
        selectDate(value, dateString) {
            this.queryParams.stime = dateString[0]
            this.queryParams.etime = dateString[1]
        },
        changePage(page, pageSize) {
            this.pagination.current = page.current
            this.getData()
        },
        onSearch(val) {
            this.queryParam.fv = val
        },
        searchByChange(val) {
            this.queryParam.ft = val
        },
        selectDateBy(val) {
            this.queryParams.date_by = val
        },
        selectOrderType(val) {
            this.queryParams.order_type = val
        },
        tabsChange(e) {
            if ((this.tabKey == 1 && !this.dataList.length) || (this.tabKey == 2 && !this.timeCardList.length)) {
                this.getData()
            }
        },
        timeCardChangePage(page, pageSize) {
            this.timeCardPagination.current = page.current
            this.getData()
        },
        // 次卡详情
        getTimeCardDetail(order_id) {
            this.request(lifeToolsStorestaffApi.sportsTimeCardVerifyOrderDetail, { order_id }).then((res) => {
                this.timeCardDetail = res
                this.modalVisible = true
            })
        },
    },
}
</script>

<style scoped>
.card-detail {
    margin-bottom: 20px;
    display: flex;
}
.card-detail >>> .ant-descriptions-title {
    white-space: nowrap;
    margin-right: 20px;
}
.card-detail >>> .ant-descriptions-view {
    /* padding-left: 80px!important; */
    box-sizing: border-box !important;
    flex: 1;
}
</style>
