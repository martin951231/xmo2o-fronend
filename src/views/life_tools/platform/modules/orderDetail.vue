<template>
  <div>
    <a-modal
      :visible="visible"
      :title="title"
      width="35%"
      @cancel="handleCancel"
      @ok="handleOk"
      :footer="null"
    >
      <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" style="max-height: 650px; overflow-y: scroll">
        <a-form-model-item label="订单编号 ">
          {{ formData.real_orderid }}
        </a-form-model-item>
        <a-form-model-item label="基本信息 ">
          <br>订单类型 : {{ formData.type_name }}
          <br>订单名称 : {{ formData.title }}
          <br>订单状态 : {{ formData.order_status_val }}
          <br>下单数量 : {{ formData.num }}
          <br>下单时间 : {{ formData.add_time }}
          <br>使用日期 : {{ formData.ticket_time }}
          <br>核销时间 : {{ formData.verify_time }}
        </a-form-model-item>
        <a-form-model-item label="用户信息 ">
          <br>下单用户昵称 : {{ formData.nickname }}
          <br>下单用户手机号 : {{ formData.phone }}
            <span v-if="formData.member_id > 0">
              <br>联系人昵称 : {{ formData.member_name }}
              <br>联系人手机号 : {{ formData.member_phone }}
              <br>联系人身份证号 : {{ formData.member_idcard }}
            </span>
        </a-form-model-item>
        <a-form-model-item label="报名信息 " v-if="formData.custom_form.length > 0">
            <div  v-for="item in formData.custom_form" :key="item.pigcms_id">
                <a-row 
                  v-for="custom in item.content" :key="custom.pigcms_id" 
                  type="flex" 
                  justify="start"
                  >
                  <a-col>
                   {{custom.title}}：
                  </a-col>
                  <a-col>
                    {{custom.show_value ? custom.show_value : '-'}}
                  </a-col>
                </a-row>
            </div>           
        </a-form-model-item>
        <a-form-model-item label="价格信息 ">
          <br>订单总价格 : {{ formData.total_price }} 元
          <br>优惠后价格 : {{ formData.price }} 元
          <br>在线支付金额 : {{ formData.pay_money }} 元
          <br>平台余额支付金额 : {{ formData.system_balance }} 元
          <br>积分抵扣金额 : {{ formData.system_score_money }} 元
          <br>积分抵扣数 : {{ formData.system_score }}
          <br>商家余额支付金额 : {{ formData.merchant_balance_pay }} 元
          <br>商家赠送余额支付金额 : {{ formData.merchant_balance_give }} 元
          <template v-if="Number(formData.internal_card_pay_money) > 0">
            <br>一卡通支付金额 : {{ formData.internal_card_pay_money }} 元
          </template> 
        </a-form-model-item>
        <a-form-model-item label="优惠券信息 ">
          <br>平台优惠券金额 : {{ formData.coupon_price }} 元
          <br>商家优惠券金额 : {{ formData.card_price }} 元
        </a-form-model-item>
        <a-form-model-item label="退款信息 " v-if="formData.refund_money > 0">
          <br>退款金额 : {{ formData.refund_money }} 元
          <br>退款时间 : {{ formData.refund_time }}
            <br>退款原因 : {{ formData.reply_refund_reason }}
        </a-form-model-item>
          <a-form-model-item label="退款信息 " v-else>
              <br>无
          </a-form-model-item>
          <a-form-model-item label="核销信息 ">
              <a-row>
                  <a-col v-for="item in formData.detail" :key="item.detail_id">
                      <br>核销码 : {{ item.code }}
                      <br>核销状态 : {{ item.status_val }}
                      <br>{{ item.time_val }} : {{ item.last_time }}
                      <br>核销人姓名 : {{ item.staff_name }}
                  </a-col>
              </a-row>
          </a-form-model-item>
        <a-button type="primary" style="margin-left: 25%" @click="loginMer">
          登录商家后台
        </a-button>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>

import moment from 'moment'
import lifeToolsPlatformApi from "@/api/life_tools/platform";
import {getTokenName, setCookie} from "@/utils/util";
import path from "@/router/router-path";
import Vue from "vue";

export default {
  props: {
    visible: Boolean,
    title: String,
    formData: Object,
    type: {
        type: String,
        default: 'sports'
    },
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
      loading: false,
      baseUrl: '/v20/public/platform/#',
    };
  },
  created() {
    console.log(this.formData);
  },
  methods: {
    moment,
    handleCancel() {
      this.$emit('handleCancel')
        this.$emit('getDataList')
    },
    handleOk() {
      this.$emit('handleCancel')
        this.$emit('getDataList')
    },
    //登录商家
    loginMer() { 
      this.request(lifeToolsPlatformApi.loginMer, {mer_id: this.formData.mer_id}).then((response) => {
        const tokenName = this.type == 'sport' ? getTokenName(path.merchantLifeToolsOrderList) : getTokenName(path.merchantLifeToolsScenicOrderList);
        Vue.ls.set(tokenName, response.ticket, null) // vue.ls存储到localstorage,持久化存储
        setCookie(tokenName, response.ticket, null) // 存入到cookie中
        if(this.type == 'sport'){
            window.open(this.baseUrl + path.merchantLifeToolsOrderList, '_blank')
        }else{
            window.open(this.baseUrl + path.merchantLifeToolsScenicOrderList, '_blank')
        }
      })
    },
  },
};
</script>