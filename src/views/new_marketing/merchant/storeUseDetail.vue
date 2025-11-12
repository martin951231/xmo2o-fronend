<template>
    <div class="wrap">
        <div class="bread-crumb bg-ff mb-10">
            <a-breadcrumb>
                <a-breadcrumb-item
                    ><span
                        class="pointer"
                        @click="
                            $router.replace({
                                path: '/merchant/merchant.iframe/menu_999999',
                            })
                        "
                        >首页</span
                    ></a-breadcrumb-item
                >
                <a-breadcrumb-item><span class="cr-primary">店铺使用情况</span></a-breadcrumb-item>
            </a-breadcrumb>
        </div>
        <a-card
            title="店铺情况"
            :bordered="false"
            :headStyle="{ fontWeight: 'bold' }"
            :bodyStyle="{ backgroundColor: '#f9f9f9' }"
        >
            <span slot="extra"
                ><span
                    class="cr-primary pointer fs-16"
                    @click="
                        $router.push({
                            path: '/new_marketing/merchant/storeMarket',
                        })
                    "
                >
                    <a-icon type="shop" class="mr-10" />店铺商城
                </span></span
            >
            <!-- 数据统计 -->
            <div class="statistical-wrap bg-ff">
                <a-row>
                    <a-col :span="8">
                        <div class="flex align-center justify-center flex-column">
                            <span class="cr-99">店铺总数量</span>
                            <span class="cr-black fs-28 fw-bold">{{ storeUserdDetail.store_count_buy || 0 }}</span>
                        </div>
                    </a-col>
                    <a-col :span="8">
                        <div class="flex align-center justify-center flex-column border-lr">
                            <span class="cr-99">已使用</span>
                            <span class="cr-black fs-28 fw-bold">{{ storeUserdDetail.store_count_used || 0 }}</span>
                        </div>
                    </a-col>
                    <a-col :span="8">
                        <div class="flex align-center justify-center flex-column">
                            <span class="cr-99">剩余数量</span>
                            <span class="cr-black fs-28 fw-bold">{{ storeUserdDetail.store_count_unused || 0 }}</span>
                        </div>
                    </a-col>
                </a-row>
            </div>
            <!-- 店铺列表 -->
            <div class="store-wrap mt-10" v-if="storeList.length">
                <a-list
                    :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }"
                    :data-source="storeList"
                    style="width: 100%"
                >
                    <a-list-item
                        slot="renderItem"
                        slot-scope="item"
                        @click="
                            $router.push({
                                path: '/new_marketing/merchant/categoryStoreUseDetail',
                                query: {
                                    cat_id: item.cat_id,
                                },
                            })
                        "
                    >
                        <a-card hoverable class="item flex flex-column justify-between" :bodyStyle="{ height: '100%' }">
                            <div class="flex-1 flex flex-column justify-around" style="height: 100%">
                                <div class="flex justify-between align-center">
                                    <div class="flex align-center flex-1" style="overflow: hidden">
                                        <a-avatar
                                            :src="item.cat_pic ? item.cat_pic : classifyIcon"
                                            style="margin-right: 10px"
                                        />
                                        <span class="flex-1 no-wrap fs-16 fw-bold cr-black"
                                            >{{ item.cat_name
                                            }}{{
                                                item.child_cat_name && item.cat_name
                                                    ? '-' + item.child_cat_name
                                                    : item.child_cat_name || ''
                                            }}</span
                                        >
                                    </div>
                                    <div class="text-nowrap">店铺类型</div>
                                </div>
                                <div>
                                    <a-row>
                                        <a-col :span="8">
                                            <div class="flex align-center justify-center flex-column">
                                                <span class="cr-99 text-nowrap">购买店铺数量</span>
                                                <span class="cr-black fs-18 fw-bold">{{ item.store_count }}</span>
                                            </div>
                                        </a-col>
                                        <a-col :span="8">
                                            <div class="flex align-center justify-center flex-column border-lr">
                                                <span class="cr-99 text-nowrap">正在使用</span>
                                                <span class="cr-black fs-18 fw-bold">{{ item.used_count }}</span>
                                            </div>
                                        </a-col>
                                        <a-col :span="8">
                                            <div class="flex align-center justify-center flex-column">
                                                <span class="cr-99 text-nowrap">已过期</span>
                                                <span class="cr-black fs-18 fw-bold">{{ item.overdue_count }}</span>
                                            </div>
                                        </a-col>
                                    </a-row>
                                </div>
                            </div>
                            <template slot="actions" class="btn flex align-center justify-center">
                                <a-button type="primary" ghost v-if="item.unused_count && item.unused_count != 0"
                                    >去开店</a-button
                                >
                                <span class="fs-14 cr-99" v-else>店铺数量已用完</span>
                            </template>
                        </a-card>
                    </a-list-item>
                </a-list>
            </div>
        </a-card>
        <a-card title="购买记录" :bordered="false" :headStyle="{ fontWeight: 'bold' }">
            <!-- 表格 -->
            <a-table :columns="columns" :data-source="orderList" :pagination="pagination" rowKey="order_id">
                <span slot="order_name" slot-scope="text, record">
                    {{ text || '-' }}
                    <span class="cr-primay">{{ record.order_type == 1 && text ? '（续费）' : '' }}</span></span
                >
                <span slot="action" slot-scope="text, record">
                    <a-button type="link" @click="actionBtn($event, record, 'detail')">查看详情</a-button>
                </span>
            </a-table>
        </a-card>

        <a-drawer
            width="40%"
            title="订单详情"
            placement="right"
            :closable="false"
            :visible="drawerVisible"
            @close="drawerVisible = false"
        >
            <div v-if="orderDetail">
                <div class="flex align-center justify-between fs-16 fw-bold">
                    <span><a-badge :color="'blue'" />订单完成</span>
                    <span>{{ orderDetail.order_type_str }}</span>
                </div>
                <div class="ml-10">
                    <div class="flex mt-20">
                        <span class="text-nowrap">下单时间：</span>
                        <span class="text-wrap flex-1">{{ orderDetail.add_time }}</span>
                    </div>
                    <div class="flex mt-20">
                        <span class="text-nowrap">订单编号：</span>
                        <span class="text-wrap flex-1">
                            {{ orderDetail.orderid
                            }}<a-button class="ml-10" size="small" @click="copyOpt(orderDetail.orderid)">复制</a-button>
                        </span>
                    </div>
                    <div class="flex mt-20">
                        <span class="text-nowrap">电子单据：</span>
                        <span class="text-wrap flex-1 cr-primary">{{ orderDetail.electronic }}</span>
                    </div>
                </div>
                <a-divider />
                <div class="fs-16 fw-bold line">
                    <span>订单信息</span>
                </div>
                <div v-if="orderDetail.order_type == '0'">
                    <div class="flex mt-20">
                        <span class="text-nowrap">下单店铺：</span>
                        <span class="text-wrap flex-1" :class="orderDetail.store_name ? 'fw-bold' : ''">{{
                            orderDetail.store_name || '-'
                        }}</span>
                    </div>
                    <div class="flex mt-20">
                        <span class="text-nowrap">店铺详情：</span>
                        <span class="text-wrap flex-1">
                            <span
                                v-if="
                                    orderDetail.store_detail &&
                                    orderDetail.store_detail.length &&
                                    Array.isArray(orderDetail.store_detail)
                                "
                            >
                                <span v-for="(item, index) in orderDetail.store_detail" :key="index"
                                    ><span class="cr-primary">{{ item.num }}</span
                                    >个{{ item.type_name
                                    }}{{ orderDetail.pay_years ? `（周期${orderDetail.pay_years}年）` : '' }}店
                                    {{ index != orderDetail.store_detail.length - 1 ? '+' : '' }}
                                </span>
                            </span>
                            <span v-else>-</span>
                        </span>
                    </div>
                    <div class="flex mt-20">
                        <span class="text-nowrap">购买周期：</span>
                        <span class="text-wrap flex-1">{{ orderDetail.pay_years }}年</span>
                    </div>
                    <div class="flex mt-20">
                        <span class="text-nowrap">购买数量：</span>
                        <span class="text-wrap flex-1">{{ orderDetail.buy_num || '0' }}</span>
                    </div>
                    <div class="flex mt-20">
                        <span class="text-nowrap">店铺总数：</span>
                        <span class="text-wrap flex-1">{{ orderDetail.store_num || '0' }}</span>
                    </div>
                </div>
                <!-- 续费订单 -->
                <div v-if="orderDetail.order_type == '1'">
                    <div class="flex mt-20">
                        <span class="text-nowrap">续费店铺：</span>
                        <span class="text-wrap flex-1" v-if="orderDetail.store_name || orderDetail.store_type_name"
                            ><span class="fw-bold">{{ orderDetail.store_name }}</span
                            ><span v-if="orderDetail.store_type_name">（{{ orderDetail.store_type_name }}）</span></span
                        >
                        <span v-else>-</span>
                    </div>
                    <div class="flex mt-20">
                        <span class="text-nowrap">续费周期：</span>
                        <span class="text-wrap flex-1">{{ orderDetail.pay_years }}年</span>
                    </div>
                </div>
                <a-divider />
                <div>
                    <div
                        class="text-right cr-99 fs-16"
                        v-if="orderDetail.discount_money && orderDetail.discount_money != 0"
                    >
                        已优惠<span class="ml-10">￥{{ orderDetail.discount_money }}</span>
                    </div>
                    <div class="text-right fs-18 mt-10">
                        订单金额：<span class="cr-primary ml-5 fw-bold">￥{{ orderDetail.total_price }}</span>
                    </div>
                </div>
            </div>
        </a-drawer>
    </div>
</template>

<script>
import moment from 'moment'
import marketingMerchantApi from '@/api/new_marketing/merchant/index'
export default {
    data() {
        return {
            classifyIcon: require('@/assets/merchant/classify.png'),
            // 详情
            storeUserdDetail: '',
            // 店铺列表
            storeList: [],
            // 表格相关
            columns: [
                {
                    title: '订单编号',
                    dataIndex: 'orderid',
                    align: 'center',
                    width: '14%',
                },
                {
                    title: '下单店铺',
                    dataIndex: 'order_name',
                    scopedSlots: { customRender: 'order_name' },
                    align: 'center',
                    width: '14%',
                },
                {
                    title: '订购数量',
                    dataIndex: 'buy_num',
                    align: 'center',
                },
                {
                    title: '店铺数量',
                    dataIndex: 'store_num',
                    align: 'center',
                },
                {
                    title: '订单总金额',
                    dataIndex: 'total_price',
                    align: 'center',
                },
                {
                    title: '订单类型',
                    dataIndex: 'order_type_str',
                    align: 'center',
                },
                {
                    title: '支付时间',
                    dataIndex: 'pay_time',
                    align: 'center',
                    sortDirections: ['descend', 'ascend'],
                    sorter: (a, b) => moment(a.pay_time).unix() - moment(b.pay_time).unix(),
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                    align: 'center',
                },
            ],
            // 订单列表
            orderList: [],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            drawerVisible: false,
            orderDetail: '',
        }
    },
    activated() {
        this.getStoreUserdDetail()
        this.getOrderList()
    },
    methods: {
        actionBtn(e, current, type) {
            if (type == 'detail') {
                this.drawerVisible = true
                this.getOrderDetail(current.order_id)
            }
        },
        // 使用详情
        getStoreUserdDetail() {
            this.request(marketingMerchantApi.getStoreUserdDetail, {}).then((res) => {
                this.storeUserdDetail = res || ''
                this.storeList = res.category_list || []
            })
        },
        // 订单列表
        getOrderList() {
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }
            this.request(marketingMerchantApi.getOrderList, params).then((res) => {
                this.orderList = res.list || []
                this.$set(this.pagination, 'total', res.count || 0)
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getOrderList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getOrderList()
        },
        // 订单详情
        getOrderDetail(orderId = '') {
            if (!orderId) return
            let params = {
                order_id: orderId,
            }
            this.request(marketingMerchantApi.getOrderDetail, params).then((res) => {
                this.orderDetail = res || ''
            })
        },
        // 复制
        copyOpt(text) {
            this.$copyText(text)
                .then((message) => {
                    this.$message.success('复制成功')
                })
                .catch((err) => {
                    console.log('copy.err', err)
                    this.$message.error('复制失败')
                })
        },
    },
}
</script>

<style lang="less" scoped>
.text-wrap {
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
}
.text-nowrap {
    white-space: nowrap;
}
.line {
    position: relative;
    padding-left: 6px;
    box-sizing: border-box;
    &::before {
        content: '';
        position: absolute;
        left: -4px;
        width: 4px;
        height: 22px;
        background: #1890ff;
    }
}
.fs-28 {
    font-size: 28px;
}
.wrap {
    padding: 20px 0;
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .plr-20 {
        padding-left: 20px;
        padding-right: 20px;
        box-sizing: border-box;
    }
    .bread-crumb {
        padding: 20px 30px;
        width: 100%;
        box-sizing: border-box;
    }
    .statistical-wrap {
        padding: 20px 30px;
        box-shadow: 0px 5px 5px rgb(236 236 236 / 35%), 0px 4px 5px 0px rgb(230 230 230 / 35%) inset;
        .border-lr {
            border-right: 1px solid #f1f1f1;
            border-left: 1px solid #f1f1f1;
        }
    }
    .store-wrap {
        width: 100%;
        .item {
            margin: 10px 0;
            height: 240px;
            border: 1px solid #f1f1f1;
            border-radius: 4px;
            box-sizing: border-box;
            .btn {
                height: 60px;
                background-color: rgba(247, 249, 250, 1);
                border-top: 1px solid #f1f1f1;
                box-sizing: border-box;
            }
        }
    }
}
</style>