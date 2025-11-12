<template>
    <!-- 团购订单列表 -->
    <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0">
        <template>
            <div class="mb-10">
                <a-form layout="inline">
                    <div class="flex search-content">
                        <div class="right flex">
                            <div>
                                <a-form-item>
                                    <a-select
                                        v-model="queryParam.is_time"
                                        style="width: 102px"
                                        @change="handleChange"
                                        placeholder="订单时间"
                                    >
                                        <a-select-option value="0"> 下单时间 </a-select-option>
                                        <a-select-option value="1"> 付款时间 </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item label="">
                                    <a-range-picker
                                        :ranges="{
                                            过去30天: [moment().subtract(30, 'days'), moment()],
                                            过去15天: [moment().subtract(15, 'days'), moment()],
                                            过去7天: [moment().subtract(7, 'days'), moment()],
                                            今日: [moment(), moment()],
                                        }"
                                        v-model="queryParam.time"
                                        format="YYYY-MM-DD"
                                        style="width: 260px"
                                        @change="onDateRangeChange"
                                    />
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item>
                                    <a-select
                                        v-model="queryParam.is_type"
                                        style="width: 102px"
                                        @change="handleChange"
                                        placeholder="订单类型"
                                    >
                                        <a-select-option value="-1"> 全部类型 </a-select-option>
                                        <a-select-option value="0"> 团购券 </a-select-option>
                                        <a-select-option value="2"> 实物 </a-select-option>
                                        <a-select-option value="1"> 代金券 </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item>
                                    <a-select
                                        v-model="queryParam.is_pay"
                                        style="width: 195px"
                                        @change="handleChange"
                                        placeholder="支付方式"
                                    >
                                        <a-select-option value=""> 全部支付方式 </a-select-option>
                                        <a-select-option value="weixin"> 微信支付 </a-select-option>
                                        <a-select-option value="yzfpay"> 翼支付线上 </a-select-option>
                                        <a-select-option value="weixinh5"> 微信H5支付 </a-select-option>
                                        <a-select-option value="weifutong"> 威富通[微信支付] </a-select-option>
                                        <a-select-option value="wirecard"> Visa/AisaPay卡 </a-select-option>
                                        <a-select-option value="merchantwarrior"> Visa/Master卡 </a-select-option>
                                        <a-select-option value="poli"> Poli支付 </a-select-option>
                                        <a-select-option value="alipayh5"> 支付宝支付(H5) </a-select-option>
                                        <a-select-option value="offline"> 线下支付 </a-select-option>
                                        <a-select-option value="nmg"> 内蒙古智慧城市 </a-select-option>
                                        <a-select-option value="yeepay"> 银行卡支付（易宝支付） </a-select-option>
                                        <a-select-option value="allinpay"> 银行卡支付（通联支付） </a-select-option>
                                        <a-select-option value="baidu"> 百度钱包支付 </a-select-option>
                                        <a-select-option value="unionpay"> 云闪付 </a-select-option>
                                        <a-select-option value="ccb"> 建设银行 </a-select-option>
                                        <a-select-option value="unionpay_international">
                                            银联支付（澳洲）
                                        </a-select-option>
                                        <a-select-option value="quickpay"> 银联支付（hark） </a-select-option>
                                        <a-select-option value="weixinapp"> 微信APP支付 </a-select-option>
                                        <a-select-option value="yzfpay_offline"> 翼支付线下 </a-select-option>
                                        <a-select-option value="balance"> 余额支付 </a-select-option>
                                        <a-select-option value="ecard" v-if="system_config && system_config.internal_membership_card == 1"> 一卡通支付 </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item>
                                    <a-select
                                        v-model="queryParam.status"
                                        style="width: 110px"
                                        @change="handleChange"
                                        placeholder="订单状态"
                                    >
                                        <a-select-option value="-1"> 全部 </a-select-option>
                                        <a-select-option value="0"> 未消费 </a-select-option>
                                        <a-select-option value="1"> 已消费 </a-select-option>
                                        <a-select-option value="2"> 已完成 </a-select-option>
                                        <a-select-option value="3"> 已退款 </a-select-option>
                                        <a-select-option value="4"> 已取消 </a-select-option>
                                        <a-select-option value="5"> 部分消费 </a-select-option>
                                        <a-select-option value="6"> 部分退款 </a-select-option>
                                        <a-select-option value="9"> 已过期平台冻结 </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item>
                                    <a-select
                                        v-model="queryParam.is_compre"
                                        style="width: 140px"
                                        @change="handleChange"
                                        placeholder="综合搜索"
                                    >
                                        <a-select-option value="0"> 订单编号 </a-select-option>
                                        <a-select-option value="1"> 支付流水号 </a-select-option>
                                        <a-select-option value="2"> 第三方支付流水号 </a-select-option>
                                        <a-select-option value="3"> 团购名称 </a-select-option>
                                        <a-select-option value="4"> 客户名称 </a-select-option>
                                        <a-select-option value="5"> 客户电话 </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item>
                                    <a-input v-model="queryParam.text" style="width: 160px" />
                                </a-form-item>
                            </div>
                            <div>
                                <a-button icon="search" @click="searchBtn()" style="margin-right: 15px">
                                    查询
                                </a-button>
                            </div>
                            <div>
                                <a-button
                                    type="primary"
                                    icon="download"
                                    @click="$refs.ExportAddModal.exports()"
                                    style="margin-right: 15px"
                                    >导出订单
                                </a-button>
                            </div>
                        </div>
                    </div>
                </a-form>
            </div>
        </template>
        <a-card :bordered="false">
            <div class="message-suggestions-list-box">
                <a-table
                    :columns="columns"
                    :data-source="data"
                    class="components-table-demo-nested"
                    :pagination="pagination"
                    @change="tableChange"
                    rowKey="order_id"
                    :loading="loading"
                >
                    <template slot="note_info" slot-scope="text, record">
                        <a-input
                            :default-value="text ? text : 0"
                            :precision="0"
                            :min="0"
                            class="sort-input"
                            style="width: 130px"
                            v-model="record.note_info"
                            @blur="handleSortChange($event, text, record)"
                        />
                    </template>
                    <span slot="begin_time" slot-scope="text, record">
                        <div v-if="record.status == 0" style="color: red">未消费</div>
                        <div v-if="record.status == 1" style="color: green">已消费</div>
                        <div v-if="record.status == 2" style="color: green">已完成</div>
                        <div v-if="record.status == 3" style="color: red">已退款</div>
                        <div v-if="record.status == 4" style="color: red">已取消</div>
                        <div v-if="record.status == 5" style="color: red">部分消费</div>
                        <div v-if="record.status == 6" style="color: red">部分退款</div>
                        <div v-if="record.status == 7" style="color: red">未支付</div>
                        <div v-if="record.status == 9" style="color: red">已过期平台冻结</div>
                        <div>下单时间：{{ record.addTime }}</div>
                        <div v-if="record.status != 7 && record.payTime">付款时间：{{ record.payTime }}</div>
                    </span>
                    <span slot="sale_set" slot-scope="text, record">
                        <div>数量：{{ record.num }}</div>
                        <div>总价：{{ record.total_money }}</div>
                    </span>
                    <span slot="is_group_combine" slot-scope="text, record">
                        <div v-if="record.is_group_combine == 1">优惠组合</div>
                        <div v-if="record.is_group_combine == 0">
                            <div v-if="record.tuan_type == 0">团购券</div>
                            <div v-if="record.tuan_type == 1">代金券</div>
                            <div v-if="record.tuan_type == 2">实物</div>
                        </div>
                    </span>
                    <span slot="sale_count" slot-scope="text, record">
                        <div>用户ID：{{ record.uid }}</div>
                        <div>用户名：{{ record.user_name }}</div>
                        <div>订单手机号：{{ record.user_phone }}</div>
                    </span>
                    <span slot="action" slot-scope="text, record">
                        <a @click="selectStore(record.order_id)" class="ant-btn-link pointer">查看</a>
                        <!-- <a @click="getClick(record.order_id)">编辑标签</a> -->
                    </span>
                </a-table>
            </div>
            <a-drawer
                title="查看订单"
                width="40%"
                :visible="orderDetailVisible"
                :body-style="{ paddingBottom: '80px' }"
                @close="notShowDetail"
            >
                <drawer-order-detail v-if="orderDetailVisible" :order_id="order_id" />
            </a-drawer>
            
            <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="queryParam" />
        </a-card>
    </div>
</template>

<script>
import moment from 'moment'
import groupMerchantApi from '@/api/group/merchant'
// import OrderDetail from './OrderDetail.vue'
import ExportAdd from '@/views/common/export/ExportAdd.vue'
import DrawerOrderDetail from './DrawerOrderDetail.vue'

const data = []

export default {
    name: 'OrderList',
    components: {
        // OrderDetail,
        ExportAdd,
        DrawerOrderDetail,
    },
    data() {
        this.cacheData = data.map((item) => ({ ...item }))
        return {
            order_id: 0,
            form: this.$form.createForm(this),
            mdl: {},
            orderDetailVisible: false,
            loading: true,
            id: 1,
            search_data: [],
            exportUrl: groupMerchantApi.orderExportUrl,
            // 查询参数
            queryParam: {
                is_time: '0',
                is_type: '-1',
                is_pay: '',
                status: '-1',
                is_compre: '0',
                group_id: '',
            },
            pagination: {
                current: 1,
                pageSize: 10,
                total: 10,
                'show-total': (total) => `共 ${total} 条记录`,
                'show-size-changer': true,
                'show-quick-jumper': true,
            },
            // 表头
            columns: [
                {
                    title: '订单编号',
                    dataIndex: 'real_orderid',
                    width: 150,
                },
                {
                    title: '名称',
                    dataIndex: 's_name',
                    width: 150,
                },
                {
                    title: '订单信息',
                    dataIndex: 'sale_set',
                    scopedSlots: {
                        customRender: 'sale_set',
                    },
                    width: 100,
                },
                {
                    title: '订单类型',
                    dataIndex: 'is_group_combine',
                    scopedSlots: {
                        customRender: 'is_group_combine',
                    },
                    width: 100,
                },
                {
                    title: '用户信息',
                    dataIndex: 'sale_count',
                    scopedSlots: {
                        customRender: 'sale_count',
                    },
                    width: 150,
                },
                {
                    title: '订单状态',
                    dataIndex: 'begin_time',
                    scopedSlots: {
                        customRender: 'begin_time',
                    },
                    width: 200,
                },
                {
                    title: '订单备注',
                    dataIndex: 'note_info',
                    scopedSlots: {
                        customRender: 'note_info',
                    },
                    width: 150,
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: {
                        customRender: 'action',
                    },
                    width: 90,
                },
            ],
            data,
            system_config: null,
        }
    },

    watch: {
        $route() {
            this.initList()
        },
    },
    mounted() {
        this.system_config = this.$getCache('system_config')
        this.initList()
    },
    methods: {
        moment,
        // 点击查询按钮
        searchBtn() {
            this.page = 1
            this.pagination.current = this.page
            this.getGoodsList()
        },
        // 标签
        getClick(cat_id, title) {
            this.$refs.specialModel.getGoodsOrderList(cat_id)
        },
        // 监听日期选择变化
        onDateRangeChange(date, dateString) {
            // 更新搜索框表单数据
            this.$set(this.queryParam, 'time', [date[0], date[1]])
            this.$set(this.queryParam, 'begin_time', dateString[0])
            this.$set(this.queryParam, 'end_time', dateString[1])
        },
        // 获取列表信息
        initList() {
            this.getGoodsList()
        },
        // 获取列表信息
        getGoodsList() {
            this.queryParam['group_id'] = this.$route.query.group_id
            console.log(this.$route.query.group_id)
            this.queryParam['page'] = this.page
            this.loading = true
            if (groupMerchantApi.getGoodsOrderList) {
                this.request(groupMerchantApi.getGoodsOrderList, this.queryParam).then((res) => {
                    this.loading = false
                    this.data = res.list
                    this.pagination.total = res.total
                })
            }
        },
        addGoods() {
            this.$refs.selectGoupCate.open()
        },
        handleChange() {},
        // 表格中变动  这里只针对页面页数切换
        tableChange(e) {
            this.queryParam['pageSize'] = e.pageSize
            if (e.current && e.current > 0) {
                this.pagination.current = e.current
                this.page = e.current
                this.getGoodsList()
            }
        },
        //导出订单
        exportOrder() {},
        // 点击设置推荐店铺
        selectStore(order_id) {
            this.orderDetailVisible = true
            this.order_id = order_id
        },
        // 选择店铺后的回调
        onStoreSelect(info) {
            this.selectStoreVisible = false
            const { storeName, storeIds } = info
            console.log(storeIds, 'storeIds')
        },

        //保存备注
        handleSortChange(e, val, record) {
            let params = {
                id: record.order_id,
                note_info: val,
            }
            this.request(groupMerchantApi.noteInfo, params).then((data) => {
                if (this.searchHotList && this.searchHotList.length) {
                    this.searchHotList = this.searchHotList.map((item) => {
                        if (record.id == item.id) {
                            item.note_info = val
                        }
                        this.getSearchHotList()
                        return item
                    })
                }
            })
        },
        notShowDetail() {
            this.orderDetailVisible = false
            this.getGoodsList()
        },
    },
}
</script>

<style scoped>
.detail-content >>> .ant-drawer-body {
    padding: 0;
}

.ant-table td {
    white-space: nowrap;
}

.goods-title {
    font-size: 20px;
    margin-right: 10px;
}

.search-content {
    justify-content: space-between;
    align-items: center;
}

.search-content .right {
    align-items: center;
}
</style>
