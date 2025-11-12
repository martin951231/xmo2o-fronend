<template>
    <div class="order-item-wrap">
        <a-row type="flex" justify="space-between" class="order-item-header">
            <a-col :span="20" style="padding-top: 5px;">
                <div class="text-wrap">
                    <span class="mr-30">订单编号：{{ order.order_no }}</span>
                    <span class="mr-30">下单时间：{{ order.create_time }}</span>
                    <span class="mr-30">订单类型：{{ order.order_type_txt }}</span>
                    <span class="mr-30">店铺名称：{{ order.store_name }}</span>
                </div>
                <div class="text-wrap" style="margin-top: 10px;" v-if="order.status != 0">
                    <span class="mr-30">付款方式：{{ order.pay_type }}</span>
                    <span v-if="order.verify_text">核销方式：{{ order.verify_text }}</span>
                </div>
            </a-col>
            <a-col :span="3" style="display: flex;flex-direction: column;align-items: center;padding-left: 30px;">
                <a-button type="link" @click="orderPrintTicket">补打小票</a-button>
                <a-button type="link" @click="orderDetail"> 查看详情</a-button>
            </a-col>
        </a-row>
        <a-row type="flex" justify="space-between" class="order-item-content">
            <a-col :span="8">
                <div class="goods-wrap">
                    <div
                        v-for="(goodsItem, goodsIndex) in goods"
                        :key="goodsIndex"
                        class="goods-item"
                        v-show="goodsItem.show"
                    >
                        <a-row
                            type="flex"
                            justify="space-between"
                            align="middle"
                            class="pt-20 pb-20 order-item-content-goods"
                            :class="
                                (goodsIndex != 1 && fold && goods.length > 1) ||
                                (goodsIndex != goods.length - 1 && !fold)
                                    ? 'border-bottom'
                                    : ''
                            "
                        >
                            <a-col :span="12">
                                <div class="flex align-center">
                                    <a-avatar shape="square" :size="64" :src="goodsItem.image" />
                                    <div class="flex flex-column pl-10 pr-10 flex-1 sx-hidden">
                                        <span class="goods-name flex-1">{{ goodsItem.goods_name }}</span>
                                        <span v-show="goodsItem.sku_info">{{ goodsItem.sku_info }}</span>
                                        <span v-if="goodsItem.is_gift == 1">
                                            <a-tag color="#108ee9">赠品</a-tag>
                                        </span>
                                        <span v-if="goodsItem.refund_desc">
                                            <a-tag
                                                v-for="(refund_desc, descIndex) in goodsItem.refund_desc"
                                                :key="descIndex"
                                                color="red"
                                                >{{ refund_desc }}</a-tag
                                            >
                                        </span>
                                    </div>
                                </div>
                            </a-col>
                            <a-col :span="6" class="text-center">{{ currency }}{{ goodsItem.price }}</a-col>
                            <a-col :span="6" class="text-center goods-num">
                                <span>{{ goodsItem.num }}</span>
                                <span v-show="goods.length > 2 && goodsIndex == 1 && fold" class="fold-btn">
                                    <a-button key="unfold" @click="foldMenu('unfold')" type="link">
                                        展开<a-icon type="down" />
                                    </a-button>
                                </span>
                                <span v-show="goodsIndex == goods.length - 1 && !fold" class="fold-btn">
                                    <a-button key="fold" @click="foldMenu('fold')" type="link">
                                        收起<a-icon type="up" />
                                    </a-button>
                                </span>
                            </a-col>
                        </a-row>
                    </div>
                </div>
            </a-col>
            <a-col :span="16">
                <a-row type="flex" justify="space-between" class="height-inherit">
                    <a-col :span="4">
                        <div class="content-item">
                            <span>{{ order.username }}</span>
                            <span>{{ order.phone }}</span>
                        </div>
                    </a-col>
                    <a-col :span="4">
                        <div class="content-item">
                            <span>{{ order.address }}</span>
                        </div>
                    </a-col>
                    <a-col :span="4">
                        <div class="content-item">
                            <span v-if="order.periodic_count && order.order_type == 'periodic'">
                                <span> 共计 {{ order.periodic_count }} 期 </span>
                                <span v-if="order.refund_count_periodic">
                                    退款
                                    <span class="cr-red">
                                        {{ order.refund_count_periodic }}
                                    </span>
                                    期
                                </span>
                            </span>
                            <span>商品总价：{{ currency }}{{ order.money_total }}</span>
                            <span v-if="order.discount_total">
                                <a-popover v-model="discountTotalVisible" title="" trigger="click">
                                    <span slot="content">
                                        <a-list item-layout="horizontal" :data-source="discountList">
                                            <a-list-item
                                                slot="renderItem"
                                                slot-scope="item"
                                                v-if="item.value && item.value != 0"
                                                class="flex"
                                            >
                                                <a-badge
                                                    :color="'red'"
                                                    :text="`${item.label}：-${currency}${item.value}`"
                                                >
                                                </a-badge>
                                            </a-list-item>
                                        </a-list>
                                    </span>
                                    <span
                                        @click="discountTotalVisible = !discountTotalVisible"
                                        class="pointer"
                                        v-if="order.discount_total && order.discount_total != 0"
                                    >
                                        总优惠
                                        <a-icon type="exclamation-circle" />
                                        ：
                                        <span>-{{ currency }}{{ order.discount_total }}</span>
                                    </span>
                                </a-popover>
                            </span>
                            <span v-if="order.money_freight && order.money_freight != 0">
                                运费：+{{ currency }}{{ order.money_freight }}
                            </span>
                            <span
                                v-if="order.bargain_price && order.bargain_price != 0 && order.order_type == 'prepare'"
                            >
                                定金{{ currency }}{{ order.bargain_price }}
                                <span v-if="order.deduct_price && order.deduct_price != 0">
                                    抵{{ currency }}{{ order.deduct_price }}
                                </span>
                            </span>
                            <span
                                class="cr-red"
                                v-if="order.bargain_price && order.bargain_price != 0 && order.order_type == 'prepare'"
                            >
                                已支付定金：{{ currency }}{{ order.real_bargain_price }}
                            </span>
                            <span class="fw-bold">
                                <span class="cr-black" v-if="order.status == 0">待付款：</span>
                                <span class="cr-black" v-if="order.status == 1">尾款待付款：</span>
                                <span class="cr-black" v-if="order.status >= 10">实付款：</span>
                                <span class="cr-red">{{ currency }}{{ order.money_real }}</span>
                            </span>
                            <span
                                v-if="
                                    order.status >= 60 &&
                                    order.status < 80 &&
                                    ((order.refund_money_periodic && order.refund_money_periodic != 0) ||
                                        (order.refund_money && order.refund_money != 0)) &&
                                    order.is_all == 1
                                "
                                class="cr-red"
                            >
                                退款金额：{{ currency
                                }}{{
                                    order.order_type == 'periodic' ? order.refund_money_periodic : order.refund_money
                                }}
                            </span>
                            <span
                                v-if="
                                    order.status >= 60 &&
                                    order.status < 80 &&
                                    ((order.refund_money_periodic && order.refund_money_periodic != 0) ||
                                        (order.refund_money && order.refund_money != 0)) &&
                                    order.is_all == 0
                                "
                                class="cr-red"
                            >
                                部分退款金额：{{ currency
                                }}{{
                                    order.order_type == 'periodic' ? order.refund_money_periodic : order.refund_money
                                }}
                            </span>
                        </div>
                    </a-col>
                    <a-col :span="4">
                        <div class="content-item">
                            <span>{{ order.express_style_txt }}</span>
                            <span v-if="order.express_style == 1">期望送达时间：{{ order.express_current_time }}</span>
                        </div>
                    </a-col>
                    <a-col :span="4">
                        <div class="content-item">
                            <span>
                                <span v-if="order.order_type == 'periodic' && order.current_periodic" class="cr-red">
                                    第{{ order.current_periodic }}期
                                </span>
                                <span>{{ order.status_txt || '---' }}</span>
                            </span>
                            <span v-if="order.current_time" class="cr-red">
                                {{ order.current_time.indexOf(' ') != -1? order.current_time.split(' ')[0]: order.current_time}}送达
                            </span>
                            <span
                                v-if="order.status == 10 && order.send_time && order.order_type == 'prepare'"
                                class="cr-red"
                            >
                                发货时间：{{ moment(order.send_time).format('YYYY.MM.DD') }}
                            </span>
                        </div>
                    </a-col>
                    <a-col :span="4">
                        <div class="content-item" v-if="isHasBtn">
                            <span v-for="item in btnList" :key="item.props">
                                <a-button
                                    type="link"
                                    v-if="item.show == 1"
                                    @click="btnOpt(item)"
                                    :style="{ color: item.color }"
                                >
                                    {{ item.label }}
                                </a-button>
                            </span>
                        </div>
                        <div class="content-item" v-else>---</div>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
        <a-row class="remark" v-if="order.remark && order.remark != ''"> 买家备注：{{ order.remark }} </a-row>
        <a-row class="clerk_remark" v-if="order.clerk_remark && order.clerk_remark != ''">
            店员备注：{{ order.clerk_remark }}
        </a-row>

        <!-- 弹框 查看物流 快递发货 拒绝退款原因-->
        <!-- 快递发货 -->
        <deliverGoods
            v-if="currentBtn.props == 'express_btn'"
            :visible="deliverGoodsVisible"
            :title="currentBtn.title"
            @handleCancel="deliverGoodsVisible = false"
            :order="order"
            @updateList="updateList"
        ></deliverGoods>
        <!-- 查看物流 -->
        <logistics
            v-if="currentBtn.props == 'trajectory_btn' || currentBtn.props == 'logistics_btn'"
            :visible="logisticsVisible"
            :title="currentBtn.title"
            @handleCancel="logisticsVisible = false"
            :order="order"
            pageType="merchant"
        ></logistics>
        <!-- 拒绝退款原因 -->
        <refuseRefund
            v-if="currentBtn.props == 'refuse_refund_btn'"
            :visible="refuseRefundVisible"
            :title="currentBtn.title"
            @handleCancel="refuseRefundVisible = false"
            :order="order"
            @updateList="updateList"
        ></refuseRefund>
    </div>
</template>

<script>
import moment from 'moment'
import mallMerchantApi from '@/api/mall/merchant/index'
import deliverGoods from '@/views/mall/merchant/modules/deliverGoods'
import logistics from '@/views/mall/modules/logistics'
import refuseRefund from '@/views/mall/merchant/modules/refuseRefund'

export default {
    props: {
        order: Object,
        tabStatus: [Number, String],
    },
    components: {
        deliverGoods,
        logistics,
        refuseRefund,
    },
    data() {
        return {
            fold: true,
            discountTotalVisible: false, // 优惠弹框显隐
            goods: [],
            discountList: [
                {
                    label: '平台优惠券优惠金额',
                    value: '',
                    props: 'discount_system_coupon',
                },
                {
                    label: '商家优惠券优惠金额',
                    value: '',
                    props: 'discount_merchant_coupon',
                },
                {
                    label: '商家会员卡优惠金额',
                    value: '',
                    props: 'discount_merchant_card',
                },
                {
                    label: '平台会员等级优惠金额',
                    value: '',
                    props: 'discount_system_level',
                },
                {
                    label: '店员优惠金额',
                    value: '',
                    props: 'discount_clerk_money',
                },
                {
                    label: '参加活动优惠金额',
                    value: '',
                    props: 'discount_act_money',
                },
            ],
            // 操作按钮
            btnList: [
                {
                    label: '接单',
                    props: 'take_btn',
                    show: '0',
                    action: 'confirm',
                    tips: '是否确定接单？',
                    success: '接单成功',
                    api: 'orderTaking',
                    color: '#1890ff',
                },
                {
                    label: '骑手配送',
                    props: 'hoseman_btn',
                    show: '0',
                    action: 'confirm',
                    tips: '是否确定骑手配送？',
                    success: '订单已转至平台配送！',
                    api: 'deliverGoodsByHouseman',
                    color: '#1890ff',
                },
                {
                    label: '店员核销',
                    props: 'clerk_btn',
                    show: '0',
                    action: 'confirm',
                    tips: '是否确定核销？',
                    success: '该订单已核销',
                    api: 'staffVerify',
                    color: '#1890ff',
                },
                {
                    label: '快递发货',
                    props: 'express_btn',
                    show: '0',
                    action: 'modal',
                    title: '发货',
                    color: '#1890ff',
                },
                {
                    label: '查看物流',
                    props: 'logistics_btn',
                    show: '0',
                    action: 'modal',
                    title: '查看物流',
                    color: '#1890ff',
                },
                {
                    label: '顺延配送',
                    props: 'postpone_btn',
                    show: '0',
                    action: 'confirm',
                    tips: '是否确定顺延配送？',
                    success: '该订单已顺延配送',
                    api: 'postponeDelivery',
                    color: 'rgb(250, 173, 20)',
                },
                {
                    label: '骑手轨迹',
                    props: 'trajectory_btn',
                    show: '0',
                    action: 'modal',
                    title: '骑手轨迹',
                    color: '#1890ff',
                },
                {
                    label: '同意退款',
                    props: 'agree_refund_btn',
                    show: '0',
                    action: 'confirm',
                    tips: '是否确定同意退款？',
                    success: '同意退款成功',
                    api: 'agreeRefund',
                    color: '#1890ff',
                },
                {
                    label: '拒绝退款',
                    props: 'refuse_refund_btn',
                    show: '0',
                    action: 'modal',
                    title: '拒绝退款',
                    color: 'rgb(250, 173, 20)',
                },
            ],
            // 当前点击的操作按钮
            currentBtn: '',
            deliverGoodsVisible: false, // 快递发货
            logisticsVisible: false, // 查看物流
            refuseRefundVisible: false, // 拒绝退款
            moneyRealVisible: false, // 实付款修改
            after_money: '', // 实付款修改后的价格
            isHasBtn: 0,
            currency: '￥',
        }
    },
    watch: {
        order: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.initGoods()
                    this.initDiscountList()
                    this.initBtnList()
                }
            },
        },
    },
    mounted() {
        this.initGoods()
        this.initDiscountList()
        this.initBtnList()
    },
    methods: {
        moment,
        // 展开收起
        foldMenu(type) {
            if (type == 'unfold') {
                this.fold = false
                this.goods = this.goods.map((item, index) => {
                    item.show = true
                    return item
                })
            } else {
                this.fold = true
                this.initGoods()
            }
        },
        // 商品
        initGoods() {
            this.goods = this.order && this.order.children ? this.order.children : []
            if (this.goods.length) {
                this.goods = this.goods.map((item, index) => {
                    if (index > 1) {
                        item.show = false
                    } else {
                        item.show = true
                    }
                    return item
                })
            }
        },
        // 优惠
        initDiscountList() {
            this.discountList = this.discountList.map((item) => {
                if (this.order) {
                    item.value = this.order[item.props]
                }
                return item
            })
        },
        // 按钮
        initBtnList() {
            this.btnList = this.btnList.map((item) => {
                item.show = this.order.button[item.props]
                // 已退款 不显示查看物流
                if (this.order.status == 70 && item.props == 'logistics_btn') {
                    item.show = 0
                }
                return item
            })
            this.isHasBtn = this.btnList.filter((item) => item.show == 1).length
        },
        // 各种操作
        btnOpt(item) {
            this.currentBtn = item
            console.log(this.currentBtn, 'this.currentBtn')
            let { api = '', success = '', tips = '', action = '', props = '' } = this.currentBtn
            let { order_id, periodic_order_id, order_type } = this.order
            if (action == 'confirm') {
                this.$confirm({
                    title: tips ? tips : '提醒',
                    content: '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        if (api) {
                            let params = {
                                order_id: order_id,
                            }
                            // 顺延配送 || 手动接单
                            let periodicIdArr = ['take_btn', 'hoseman_btn']
                            if (order_type == 'periodic' && periodicIdArr.indexOf(props) != -1) {
                                params.periodic_order_id = periodic_order_id
                            }
                            this.request(mallMerchantApi[api], params).then((data) => {
                                this.$message.success(success)
                                // 更新订单列表
                                this.updateList()
                            })
                        }
                    },
                    onCancel: () => {
                        console.log('Cancel')
                        this.currentBtn = ''
                    },
                    class: 'test',
                })
            }

            if (action == 'modal') {
                if (props == 'express_btn') {
                    this.deliverGoodsVisible = true
                } else if (props == 'trajectory_btn' || props == 'logistics_btn') {
                    this.logisticsVisible = true
                } else if (props == 'refuse_refund_btn') {
                    this.refuseRefundVisible = true
                }
            }
        },
        // 更新订单列表
        updateList() {
            this.$emit('getOrderList')
        },
        // 查看详情
        orderDetail() {
            let { order_id = '', periodic_order_id = '', order_type, refund_id = '' } = this.order
            let query = {
                order_id: order_id,
            }
            if (periodic_order_id && order_type == 'periodic') {
                query.periodic_order_id = periodic_order_id
            }
            if (refund_id) {
                query.refund_id = refund_id
            }

            let routeData = this.$router.resolve({ path: '/merchant/merchant.mall/orderDetail', query })
            window.open(routeData.href, '_blank')
        },
        orderPrintTicket() {
            let params = {
                order_id: this.order.order_id
            }
            this.request(mallMerchantApi.orderPrintTicket, params).then(data => {
                this.$message.success('打印成功')
            })
        }
    },
}
</script>

<style scoped>
.order-item-wrap {
    margin-top: 10px;
    width: 100%;
    border: 1px solid #e8e8e8;
    box-sizing: border-box;
    font-weight: normal;
    font-size: 14px;
    line-height: 1.5;
}

.order-item-header {
    border-bottom: 1px solid #e8e8e8;
    padding: 8px 0 8px 24px;
    background: #fafafa;
}

/* .order-item-content {
      padding: 8px 0;
  } */
.order-item-content-goods {
    width: 100%;
    height: 100%;
    padding-left: 24px;
    box-sizing: border-box;
}

.border-bottom {
    border-bottom: 1px solid #e8e8e8;
}

.border-left {
    border-left: 1px solid #e8e8e8;
}

.goods-name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: keep-all;
}

.height-inherit {
    height: 100%;
}

.content-item {
    padding: 10px;
    height: 100%;
    border-left: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    box-sizing: border-box;
    white-space: wrap;
    word-break: break-all;
    word-wrap: break-word;
}

.content-item span {
    line-height: 26px;
}

.goods-num {
    position: relative;
}

.fold-btn {
    position: absolute;
    top: 180%;
    right: 8px;
    transform: translate(0, -50%);
}

.fold-btn >>> .ant-btn {
    padding: 0;
}

.goods-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.goods-item {
    flex: 1;
    display: flex;
    align-items: center;
}

.ml-5 {
    margin-left: 5px;
}

.remark,
.clerk_remark {
    word-break: break-word;
    text-align: left;
    padding: 5px 10px;
    background: #fffaeb;
    color: #f90;
    border-top: 1px solid #e8e8e8;
}
.remark {
    background: #fdeeee;
    color: #da2626;
}
.mr-30 {
    margin-right: 30px;
}
</style>
