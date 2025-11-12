<template>
  <div>
    <a-modal
      :visible="visible"
      :title="title"
      width="40%"
      @cancel="handleCancel"
      @ok="handleOk"
      :footer="null"
    >
      <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" style="max-height: 650px; overflow-y: scroll">
        <a-form-model-item label="订单编号 ">
          {{ formData.orderid }}
        </a-form-model-item>
        <a-form-model-item label="基本信息 ">
          <br>订单类型 : {{ formData.type_name }}
          <br>次卡名称 : {{ formData.title }}
          <br>景区名称 : {{ formData.tools_title_val }}
          <br>总次数 :{{ formData.total_num }}
          <br>已使用次数 : {{ formData.total_num - formData.all_num}}
          <br>首次使用时间 : {{ formData.first_time_text }}
          <br>订单状态 : {{ formData.order_status_val }}
          <br>下单时间 : {{ formData.add_time }}
          <br>过期时间 : {{ formData.out_time }}
        </a-form-model-item>
        <a-form-model-item label="用户信息 ">
          <br>下单用户昵称 : {{ formData.nickname }}
          <br>下单用户手机号 : {{ formData.phone }}
        </a-form-model-item>
        <a-form-model-item label="价格信息 ">
          <br>订单总价格 : {{ formData.total_price }} 元
          <br>在线支付金额 : {{ formData.pay_money }} 元
          <br>平台余额支付金额 : {{ formData.system_balance }} 元
          <br>商家余额支付金额 : {{ formData.merchant_balance_pay }} 元
          <br>商家赠送余额支付金额 : {{ formData.merchant_balance_give }} 元
        </a-form-model-item>
        <a-form-model-item label="退款信息 " v-if="formData.refund_money > 0">
          <br>退款金额 : {{ formData.refund_money }} 元
          <br>退款时间 : {{ formData.refund_time }}
          <br>退款原因 : {{ formData.reply_refund_reason }}
            <br>
                <a-popconfirm
                    v-if="formData.order_status === 50"
                    title="确认同意退款吗?"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="agree(formData.order_id)"
                >
                    <a-button type="primary">同意退款
                    </a-button>
                </a-popconfirm>
            <a-button style="margin-left: 5px;" v-if="formData.order_status === 50" @click="refuse()">
                拒绝退款
            </a-button>
        </a-form-model-item>
          <a-form-model-item label="退款信息 " v-else>
              <br>无
          </a-form-model-item>
      </a-form-model>
    </a-modal>
      <a-modal
          :visible="refusevisible"
          :title="refusetitle"
          width="20%"
          @cancel="refuseCancel"
          @ok="refuseOk"
      >
          <a-input v-model="refusereason" type="textarea" />
      </a-modal>
  </div>
</template>
<script>

import moment from 'moment'
import lifeToolsMerchantApi from "@/api/life_tools/merchant";

export default {
  props: {
    visible: Boolean,
    title: String,
    formData: Object
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
      loading: false,
      refusetitle: '请填写拒绝退款原因',
      refusevisible: false,
      refusereason: '',
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
      agree(order_id) {
          this.request(lifeToolsMerchantApi.agreeCardOrderRefund, {order_id: order_id}).then((res) => {
              this.$message.success('操作成功')
              this.$emit('handleCancel')
              this.$emit('getDataList')
          })
      },
      refuseCancel() {
          this.refusevisible = false
      },
      refuse() {
          this.refusevisible = true
      },
      refuseOk() {
          let reason = this.refusereason
          if (reason == '') {
              this.$message.error('请填写拒绝原因！')
              return
          }
          this.request(lifeToolsMerchantApi.refuseCardOrderRefund, {order_id: this.formData.order_id, reason: reason}).then((res) => {
              this.$message.success('操作成功')
              this.refusevisible = false
              this.$emit('handleCancel')
              this.$emit('getDataList')
          })
      },
  },
};
</script>