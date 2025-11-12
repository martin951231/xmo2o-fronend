<template>
    <a-modal :title="title" :width="1000" :height="300" :visible="visible" @cancel="closeWindow" :footer="null">
        <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol"
            style="max-height: 650px; overflow-y: scroll">

            <a-form-model-item label="订单信息 " style="margin-left: 100px;">
                订单编号: {{ formData.real_orderid }}
                <br>订单状态 : {{ formData.order_status_val }}
                <br>下单时间 : {{ formData.add_time }}
                <br>报名费用 : {{ formData.price }}
                <br>是否支付 : {{ formData.paid == 1 ? '已支付' : '未支付' }}
                <br>支付时间 : {{ formData.pay_time}}
                <br>积分抵扣数 : {{ formData.system_score}}
                <br>平台优惠券的金额 : {{ formData.coupon_price}}
                <br>商家优惠券的金额 : {{ formData.card_price}}
                <br>商家赠送余额支付金额 : {{ formData.merchant_balance_give}}
             </a-form-model-item>
             
            <a-form-model-item label="活动信息 " style="margin-left: 100px;">
                活动名称 : {{ formData.title }}
                <br>活动日期 : {{ formData.activity_time }}
                <br>活动简介 : {{ formData.desc }}
                <br>活动地址 : {{ formData.address }}
            </a-form-model-item>
            
            <a-form-model-item label="用户信息" style="margin-left: 100px;">
                下单用户昵称 : {{ formData.user.nickname }}
                <br>下单用户手机号 : {{ formData.user.phone }}<br>
 
                <div v-for="(item, index) in formData.custom_form">
                    <div v-if="item.type == 'image'">
                        {{item.title}} : <br>
                        <img v-for="(img,i) in item.show_value" :src="img" @click="showImg(img)" style="width: auto;height: 150px;margin-right: 10px;margin-bottom: 10px"/>
                    </div>
                    <div v-else-if="item.type == 'select'">
                        {{item.title}} : {{ item.show_value }}<br>
                    </div>
                     <div v-else-if="item.type == 'area'">
                        {{item.title}} : <span  v-for="(adress,i) in item.value">{{adress.label}} &nbsp;&nbsp;</span><br>
                    </div>
                   <div v-else>
                          {{item.title}} : {{ item.value }}<br>
                   </div>
                </div>
                
            </a-form-model-item>
            
            <a-form-model-item label="核销信息 " style="margin-left: 100px;">
                核销码 : {{ formData.verify_code }}
                <br>核销状态 : {{ formData.verify_time == '-' ? '未核销' : '已核销'}}
                <br>核销时间 : {{ formData.verify_time }}
                <br>核销人姓名 : {{ formData.staff_name }}
                <span v-if="formData.sku_id > 0"><br>规格信息 : {{ formData.sku_str }}</span>
            </a-form-model-item>
            
            <a-form-model-item v-if="formData.refund_money > 0" label="退款信息 " style="margin-left: 100px;">
                退款理由 : {{ formData.apply_refund_reason }}
                <br>退款金额 : {{ formData.refund_money}}
                <br>退款时间 : {{ formData.refund_time }}
            </a-form-model-item>

        </a-form-model>
        
        
        <a-modal  :width="800" :height="300" :visible="showImage" @cancel="closeImg" :footer="null">
            <img :src="showImageSrc" style="width: 100%;margin-top: 15px;">
        </a-modal>
        
        
    </a-modal>
</template>
<script>
    import lifeToolsMerchantApi from '@/api/life_tools/merchant/index'
    export default {
        data() {
            return {
                title: "报名详情",
                //是否显示弹窗
                visible: false,
                order_id: 0,
                formData: null,
                showImage: false,
                showImageSrc: ''
            }
        },
        methods: {
            //关闭窗口
            closeWindow() {
                this.visible = false
            },
            showWindow(order_id) {
                this.order_id = order_id;
                this.getOrderDetail();
                this.visible = true;
            },
            getOrderDetail() {
                this.request(lifeToolsMerchantApi.getAppointOrderDetail, {
                    order_id: this.order_id
                }).then((res) => {
                    this.formData = res
                })
            },
            showImg(img){
                this.showImageSrc = img;
                this.showImage = true;
            },
            closeImg(){
                this.showImage = false;
                this.showImageSrc = '';
            }
        }
    }
</script>
