<template>
  <div>
    <a-modal
      :visible="visible"
      :title="title"
      width="45%"
      @cancel="handleCancel"
      @ok="handleOk"
      :footer="null"
    >
      <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" style="max-height: 650px; overflow-y: scroll">
        <a-form-model-item label="订单编号 ">
          {{ formData.real_orderid }}
        </a-form-model-item>
        <a-form-model-item label="基本信息 ">
          订单类型 : {{ formData.type_name }} <span v-if="formData.is_group == 1">（团体票）</span>
          <br>订单名称 : {{ formData.title }}
          <br>订单状态 : {{ formData.order_status_val }}
          <br>下单数量 : {{ formData.num }}
          <br>下单时间 : {{ formData.add_time }}
          <br>使用日期 : <span v-if="formData.scenic_ticket_type == 0">{{formData.date_ticket_start}} ~ {{formData.date_ticket_end}}</span>
          <span v-else>{{ formData.ticket_time }}</span>
          <br>核销时间 : {{ formData.verify_time }}
        </a-form-model-item>
        <a-form-model-item label="用户信息 ">
          下单用户昵称 : {{ formData.nickname }}
          <br>下单用户手机号 : {{ formData.phone }}
            <span v-if="formData.member_id > 0">
              <br>联系人昵称 : {{ formData.member_name }}
              <br>联系人手机号 : {{ formData.member_phone }}
              <br>联系人身份证号 : {{ formData.member_idcard }}
            </span>
        </a-form-model-item>
        <a-form-model-item v-if="formData.is_group == 1 && formData.tour_guide_custom_form && formData.tour_guide_custom_form.length > 0" label="导游信息 ">
        <div v-for="(item,index) in formData.tour_guide_custom_form">
            
            <span v-if="item.type == 'image'">
                {{item.title}}: <br />
                <img width="100" height="auto" style="margin-left: 10px;" @click="showImage(image.url)" v-for="image in item.value" :src="image.url" >
            </span>
            <span v-else>{{item.title}}: {{item.value}}</span><br/>
        </div>
        
         
            
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
          订单总价格 : {{ formData.total_price }} 元
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
          平台优惠券金额 : {{ formData.coupon_price }} 元
          <br>商家优惠券金额 : {{ formData.card_price }} 元
        </a-form-model-item>
        <a-form-model-item label="退款信息 " v-if="formData.refund_money > 0">
          退款金额 : {{ formData.refund_money }} 元
          <br>退款时间 : {{ formData.refund_time }}
          <br>退款原因 : {{ formData.reply_refund_reason }}
            <br>
                <a-popconfirm
                    v-if="formData.order_status === 45"
                    title="确认同意退款吗?"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="agree(formData.order_id)"
                >
                    <a-button type="primary">同意退款
                    </a-button>
                </a-popconfirm>
            <a-button style="margin-left: 5px;" v-if="formData.order_status === 45" @click="refuse()">
                拒绝退款
            </a-button>
        </a-form-model-item>
          <a-form-model-item label="退款信息 " v-else>
              无
          </a-form-model-item>
          <a-form-model-item label="核销信息 ">
              <a-row>
                  <a-col v-for="item in formData.detail" :key="item.detail_id">
                      核销码 : {{ item.code }}
                      <br>核销状态 : {{ item.status_val }}
                      
                    <span v-if="formData.sku_type == 2"><br>规格名称 : {{ item.sku_str }}</span>
                      <br>{{ item.time_val }} : {{ item.last_time }}
                      <br>核销人姓名 : {{ item.staff_name }}
                      <br><a-popconfirm
                          v-if="formData.order_status === 70 && item.status === 2"
                          title="确认退款吗?"
                          ok-text="确认"
                          cancel-text="取消"
                          @confirm="agree1(item.detail_id)"
                      >
                          <a-button type="primary">退款
                          </a-button>
                      </a-popconfirm>
                      <br>
                  </a-col>
              </a-row>
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
      
      <a-modal width="1000px" style="padding: 0" :visible="showImageVisible" @cancel="showImageVisible = false" :footer="null">
          <img style="width: 100%;" :src="showImageSrc" alt="">
      </a-modal>
  </div>
</template>
<script>

import moment from 'moment'
import lifeToolsMerchantApi from "@/api/life_tools/merchant";
import lifeToolsStorestaffApi from "@/api/life_tools/storestaff";
export default {
  props: {
    visible: Boolean,
    title: String,
    formData: Object,
    parasmType:{
      type: String,
      default(){
        return ''
      }
    }
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
      loading: false,
      refusetitle: '请填写拒绝退款原因',
      refusevisible: false,
      refusereason: '',
      showImageSrc: '',
      showImageVisible: false,
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
        let url = lifeToolsMerchantApi.agreeSportsOrderRefund
        if(this.parasmType == 'storestaff'){
          url = lifeToolsStorestaffApi.agreeScenicOrderRefund
        }
          this.request(url, {order_id: order_id}).then((res) => {
              this.$message.success('操作成功')
              this.$emit('handleCancel')
              this.$emit('getDataList')
          })
      },
      agree1(detail_id) {
        let url = lifeToolsMerchantApi.refuseSportsOrderRefund
        if(this.parasmType == 'storestaff'){
          url = lifeToolsStorestaffApi.refuseScenicOrderRefund
        }
          this.request(url, {detail_id: detail_id}).then((res) => {
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
          this.request(lifeToolsMerchantApi.refuseSportsOrderRefund, {order_id: this.formData.order_id, reason: reason}).then((res) => {
              this.$message.success('操作成功')
              this.refusevisible = false
              this.$emit('handleCancel')
              this.$emit('getDataList')
          })
      },
      showImage(src){
          this.showImageSrc = src;
          this.showImageVisible = true;
      }
  },
};
</script>