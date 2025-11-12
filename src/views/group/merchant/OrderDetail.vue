<template>
    <div>
        <!-- 操作订单弹窗 -->
        <a-modal
                :visible="dialogVisible"
                title="操作订单"
                centered
                :maskClosable="false"
                :width="800"
                @ok="chooseStoreOk"
                @cancel="chooseStoreCancel"
        >
            <template>
                <a-form layout="inline" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
                    <a-row class="mb-20">
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            订单编号: <span>{{formData.real_orderid}}</span>
                        </a-col>
                    </a-row>
                    <a-row class="mb-20">
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            商品名称: <span> {{formData.s_name}} <a v-if="formData.is_marketing_goods==1">(分销商品)</a></span>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="10" class="mr-10" style="margin-bottom:15px;font-weight:bold">
                            订单信息
                        </a-col>
                    </a-row>
                    <a-row class="mb-20">
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            订单类型:
                            <span v-if="formData.tuan_type==0">团购券</span>
                            <span v-if="formData.tuan_type==1">代金券</span>
                            <span v-if="formData.tuan_type==2">实物</span>
                        </a-col>
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            订单状态:
                            <span>{{formData.pay_msg}}</span>
                        </a-col>
                    </a-row>
                    <a-row class="mb-20">
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            数量: <span>{{formData.num}}</span>
                        </a-col>
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            总价: <span>{{formData.total_money}}</span>
                        </a-col>
                    </a-row>
                    <a-row class="mb-20">
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            下单时间: <span>{{formData.add_time}}</span>
                        </a-col>
                    </a-row>
                    <a-row class="mb-20">
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            买家留言: <span>{{formData.delivery_comment}}</span>
                        </a-col>
                    </a-row>
                    <a-row class="mb-20" v-if="formData.pay_type">
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            支付方式:
                            <span v-if="formData.pay_type=='offline'">线下支付</span>
                            <span v-if="formData.pay_type=='wechat'">微信支付</span>
                            <span v-if="formData.pay_type=='alipay'">支付宝支付</span>
                        </a-col>
                    </a-row>
                    <a-row class="mb-20">
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            总核销码数: <span>{{formData.total_pass_num}}</span>
                        </a-col>
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            未使用核销码数: <span>{{formData.unconsume_pass_num}}</span>
                        </a-col>
                    </a-row>
                     <a-row class="mb-20" v-if="formData.adress">
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            收货地址: <span>{{formData.adress}}</span>
                        </a-col>
                    </a-row>
                    <a-row class="mb-20" v-if="formData.trade_hotel && formData.is_hotel == 1">
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            {{$store.getters.config.room_name}}类型: <span>{{formData.trade_hotel.retval.cat_name}}</span>
                        </a-col>
                    </a-row>
                    <a-row class="mb-20" v-if="formData.trade_hotel && formData.is_hotel == 1">
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            预定天数: <span>{{formData.trade_hotel.retval.book_day}}</span>
                        </a-col>
                    </a-row>
                    <a-row class="mb-20" v-if="formData.trade_hotel && formData.is_hotel == 1">
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            开始预定时间: <span>{{formData.trade_hotel.retval.dep_time_txt}}</span>
                        </a-col>
                    </a-row>
                    <a-row class="mb-20" v-if="formData.trade_hotel && formData.is_hotel == 1">
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            结束预定时间: <span>{{formData.trade_hotel.retval.end_time_txt}}</span>
                        </a-col>
                    </a-row>

                    <div v-if="formData.paid">
                        <a-row>
                            <a-col :span="10" class="mr-10" style="margin-bottom:15px;font-weight:bold">
                                用户信息
                            </a-col>
                        </a-row>
                        <a-row class="mb-20">
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                用户ID: <span>{{formData.uid}}</span>
                            </a-col>
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                用户名: <span>{{formData.nickname}}</span>
                            </a-col>
                        </a-row>
                        <a-row class="mb-20">
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                订单手机号: <span>{{formData.phone}}</span>
                            </a-col>
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                用户手机号: <span>{{formData.user_phone}}</span>
                            </a-col>
                        </a-row>
                        <a-row class="mb-20">
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                支付: <span>{{formData.payment_money}}  </span>
                            </a-col>
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                使用商家会员卡余额: <span>{{formData.merchant_balance}}</span>
                            </a-col>
                        </a-row>
                        <a-row class="mb-20">
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                余额支付金额: <span>{{formData.balance_pay}}</span>
                            </a-col>
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                在线支付金额: <span>{{formData.payment_money}}</span>
                            </a-col>
                        </a-row>
                        <a-row class="mb-20">
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                余额: <span>{{formData.now_money}}</span>
                            </a-col>
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                折扣: <span>{{formData.card_discount}}</span>
                            </a-col>
                        </a-row>
                        <a-row class="mb-20">
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                赠送余额: <span>{{formData.card_give_money}}</span>
                            </a-col>
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                微信优惠: <span>{{formData.wx_cheap}}</span>
                            </a-col>
                        </a-row>
                        <a-row class="mb-20">
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                平台优惠券: <span>{{formData.coupon_price}}</span>
                            </a-col>
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                商家优惠券: <span>{{formData.card_price}}</span>
                            </a-col>
                        </a-row>
                        <a-row class="mb-20">
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                积分抵扣金额: <span>{{formData.score_deducte}}</span>
                            </a-col>
                            <a-col :span="1"></a-col>
                            <a-col :span="10">
                                积分使用数量: <span>{{formData.score_used_count}}</span>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="10" class="mr-10" style="margin-bottom:15px;font-weight:bold">
                                额外信息
                            </a-col>
                        </a-row>
                        <a-row class="mb-20">
                            <a-col :span="1"></a-col>
                            <a-col :span="2">
                                备注: <span>
                        </span>
                            </a-col>
                            <a-col :span="10" class="mr-20">
                                <a-input
                                        v-model="formData.note_info"
                                />
                            </a-col>
                            <a-col :span="2">
                                <a-button type="primary" @click="updateOrderNote()">
                                    修改
                                </a-button>
                            </a-col>
                        </a-row>
                        <a-row class="mb-20" v-for="(item,index) in formData.group_pass_list" :key="index">
                            <a-col :span="1"></a-col>
                            <a-col :span="23">
                                消费密码: 
                                <span>
                                    {{item.group_pass}} &nbsp;&nbsp;&nbsp;
                                   （ <span v-if="item.status == 0">未核销</span>
                                    <span v-else-if="item.status == 1">已核销</span>
                                    <span v-else-if="item.status == 2">已退款</span>
                                    <span v-else></span>
                                     <span v-if="item.staff_name">，店员名称：{{item.staff_name}}</span>
                                     <span v-if="item.verify_time_txt">，操作时间：{{item.verify_time_txt}}</span>
                                     ）
                                </span>
                            </a-col>
                        </a-row>
                    </div>
                </a-form>
            </template>
        </a-modal>
        <!-- 操作订单弹窗 end -->
    </div>
</template>

<script>
    import groupMerchantApi from '@/api/group/merchant/index'

    export default {
        name: "OrderDetail",
        props: {
            // 存放路径
            order_id: {
                type: [String, Number],
                default: '0',
            },
        },
        mounted() {
            // this.dialogVisible = this.visible
            // this.getAllArea()
            this.orderDetailList()
        },
        data() {
            return {
                dialogVisible: true,
                orderId: this.order_id,
                formData: {
                    order_id: 0,
                    real_orderid: "",
                    s_name: "",
                    tuan_type: 0,
                    paid: 0,
                    num: 0,
                    total_money: 0,
                    add_time: 0,
                    delivery_comment: "",
                    pay_type: "",//wechat微信支付 alipay支付宝支付
                    total_pass_num: 0,
                    unconsume_pass_num: 0,
                    uid: 0,
                    nickname: "",
                    phone: "",
                    pay_msg: "",
                    user_phone: "",
                    paymoney: 0,//支付金额
                    payment_money: 0,
                    balance_pay: 0,
                    merchant_balance: 0,
                    card_discount: 0,
                    card_give_money: 0,

                    now_money: 0,

                    wx_cheap: 0,
                    coupon_price: 0,
                    card_price: 0,
                    score_deducte: 0,
                    score_used_count: 0,
                    note_info: "",

                    group_pass_txt: "",
                    group_pass_list:[]

                }
            }
        },
        methods: {
            orderDetailList() {
                this.request(groupMerchantApi.orderDetail, {order_id: this.order_id}).then(data => {
                    this.formData = data.list
                })
            },
            chooseStoreOk() {
                // this.dialogVisible = false
                this.$emit("notShowDetail");
            },
            chooseStoreCancel() {
                // this.dialogVisible = false
                this.$emit("notShowDetail");
            },
            updateOrderNote() {
                this.request(groupMerchantApi.updateOrderNote, {
                    order_id: this.order_id,
                    note_info: this.formData.note_info
                }).then(data => {
                    if (data) {
                        this.$message.success('修改成功！')
                    }
                })
            }
        }
    }
</script>

<style scoped>
    div /deep/ .ant-modal-body{
        max-height: 600px;
        overflow-y: auto;
    }
    .font-red {
        color: #ff3d0d;
    }

    .page-bar {
        margin: 40px;
    }

    ul, li {
        margin: 0px;
        padding: 0px;
    }

    li {
        list-style: none
    }

    .page-bar li:first-child > a {
        margin-left: 0px
    }

    .page-bar a {
        border: 1px solid #ddd;
        text-decoration: none;
        position: relative;
        float: left;
        padding: 6px 12px;
        margin-left: -1px;
        line-height: 1.42857143;
        color: #337ab7;
        cursor: pointer
    }

    .page-bar a:hover {
        background-color: #eee;
    }

    .page-bar a.banclick {
        cursor: not-allowed;
    }

    .page-bar .active a {
        color: #fff;
        cursor: default;
        background-color: #337ab7;
        border-color: #337ab7;
    }

    .page-bar i {
        font-style: normal;
        color: #d44950;
        margin: 0px 4px;
        font-size: 12px;
    }
</style>
