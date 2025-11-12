<template>
    <a-modal title="" :width="800" :height="300" :visible="visible" @cancel="closeWindow" :footer="null">
        <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">

            <a-form-item label="订单编号">
                <span>{{detail.orderid}}</span>
            </a-form-item>
            <a-form-item label="基本信息">
                <p>订单类型：{{detail.type_name}}</p>
                <p v-if="type=='card'" class="item_order_detail">次卡名称：{{detail.title}}</p>
                <p class="item_order_detail">景区名称：{{detail.tools_title_val}}</p>
                <p class="item_order_detail">订单状态：{{detail.order_status_val}}</p>
                <p class="item_order_detail">下单数量：{{detail.num}}</p>
                <p class="item_order_detail">下单时间：{{detail.add_time}}</p>
                <p v-if="type=='card'" class="item_order_detail">过期时间：{{detail.out_time}}</p>
            </a-form-item>
            <a-form-item label="用户信息">
                <p>下单用户昵称：{{detail.nickname}}</p>
                <p class="item_order_detail">在线支付金额：{{detail.phone}}</p>

            </a-form-item>

            <a-form-item label="价格信息">
                <p>订单总价格：{{detail.total_price}}</p>
                <p class="item_order_detail">下单用户手机号：{{detail.pay_money}}</p>
                <p class="item_order_detail">平台余额支付金额：{{detail.system_balance}}</p>
                <p class="item_order_detail">商家余额支付金额：{{detail.merchant_balance_pay}}</p>
                <p class="item_order_detail">商家赠送余额支付金额：{{detail.merchant_balance_give}}</p>

            </a-form-item>


           

        </a-form>
    </a-modal>
</template>
<script>
    import lifeToolsStorestaffApi from '@/api/life_tools/storestaff/index'
    import cardMerchantApi from '@/api/card/merchant'
    export default {
        data() {
            return {
                sort_id: 0,
                type: 'card',
                title: "添加类型",
                visible: false,
                order_id: '',
                queryParam: {
                    sort_id: 0,
                    name: '',
                    describe: '',
                    sort: 0,
                },
                detail: {
                    orderid: "",
                    type_name: "",
                    title: "",
                    tools_title_val: "",
                    order_status_val: "",
                    num: "",
                    add_time: "",
                    out_time: "",
                    nickname: "",
                    phone: "",
                    total_price: "",
                    pay_money: "",
                    system_balance: "",
                    merchant_balance_pay: "",
                    merchant_balance_give: "",
                },
                form: this.$form.createForm(this, {
                    name: 'coordinated'
                }),
            };
        },
        methods: {

            getData(order_id, type) {
                this.type = type;
                this.request(lifeToolsStorestaffApi.getCardOrderDetail, {
                    order_id: order_id ,
                    type: type
                }).then((res) => {

                    this.detail = {
                        orderid: "",
                        type_name: "",
                        title: "",
                        tools_title_val: "",
                        order_status_val: "",
                        num: "",
                        add_time: "",
                        out_time: "",
                        nickname: "",
                        phone: "",
                        total_price: "",
                        pay_money: "",
                        system_balance: "",
                        merchant_balance_pay: "",
                        merchant_balance_give: "",
                    }
                    this.form.resetFields();
                    this.detail = res 

                    this.visible = true

                })

            },
            closeWindow() {
                this.visible = false
            }
             
            
          
        },
        mounted() {
           
        },
     
    }
</script>
<style>
    .item_order_detail{
        line-height: 30px;
    }
</style>