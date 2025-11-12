<template>
    <div>
        <!-- 操作订单弹窗 -->
        <a-modal
            :visible="dialogVisible"
            title="操作券码"
            centered
            :maskClosable="false"
            :width="800"
            @ok="chooseStoreOk"
            @cancel="chooseStoreCancel"
            okText="确定核销"
        >
            <template>
                <a-form layout="inline" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
                    <a-row class="mb-20">
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            券序列码: <span>{{formData.group_pass}}</span>
                        </a-col>
                    </a-row>
                    <a-row class="mb-20">
                        <a-col :span="1"></a-col>
                        <a-col :span="10">
                            过期时间: <span>{{formData.deadline}}</span>
                        </a-col>
                    </a-row>
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

                </a-form>
            </template>
        </a-modal>
        <!-- 操作订单弹窗 end -->
    </div>
</template>

<script>
    import groupMerchantApi from '@/api/group/merchant/index'
    import cardMerchantApi from "@/api/card/merchant";

    export default {
        name: "CouponDetail",
        props: {
            // 存放路径
            order_id: {
                type: [String, Number],
                default: '0',
            },
            // 存放路径
            group_pass_id: {
                type: [String],
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
                id: this.group_pass_id,
                formData: {
                    order_id: 0,
                    real_orderid: "",
                    s_name: "",
                    tuan_type: 0,
                    num: 0,
                    total_money: 0,
                    add_time: 0,
                    delivery_comment: "",
                    pay_type: "",//wechat微信支付 alipay支付宝支付
                    total_pass_num: 0,
                    unconsume_pass_num: 0,
                    pay_msg: "",
                    group_pass: "",
                    deadline: "",
                    can_verify: "",
                    status_msg: "",
                    group_pass_id: "",

                }
            }
        },
        methods: {
            orderDetailList() {
                this.request(groupMerchantApi.couponDetail, {order_id: this.order_id,group_pass_id: this.group_pass_id}).then(data => {
                    this.formData = data.list
                })
            },
            chooseStoreOk() {
                // this.dialogVisible = false
                this.$confirm({
                    title: '是否确定核销选择的券码?',
                    centered: true,
                    onOk: () => {
                        this.request(groupMerchantApi.couponVerify, {
                            order_id: this.order_id,group_pass_id: this.group_pass_id
                        }).then((res) => {
                            // this.toSetPage(2)
                            // this.$message.success('删除成功')
                            // this.selectedRowKeys = []
                            // this.getDataList()
                            this.$message.success('核销成功')
                            this.$emit("notShowDetail");
                        })
                    },
                })
            },
            chooseStoreCancel() {
                // this.dialogVisible = false
                this.$emit("notShowDetail");
            },
        }
    }
</script>

<style scoped>
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
