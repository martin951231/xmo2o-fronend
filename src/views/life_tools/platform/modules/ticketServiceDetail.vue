<template>
  <!-- 票务系统详情 -->
  <div class="">
    <a-modal
      title="订单详情"
      :visible="showModal"
      :footer="false"
      :destroyOnClose="true"
      @ok="handleOk"
      :width="700"
      @cancel="handleCancel"
    >
      <div v-if="modalDetail && type==1" style="max-height: 600px; width:100%;overflow-y: auto;">
        <a-row style="margin-bottom: 20px;" v-if="modalDetail&&modalDetail.base_info">
          <a-col :span="4" style="text-align: right; margin-bottom:10px;">
            订单编号：
          </a-col>
          <a-col :span="12">{{ modalDetail.base_info.real_orderid }}</a-col>
        </a-row>

        <!-- 基本信息展示 -->
        <a-row style="margin-bottom: 20px;" v-if="modalDetail&&modalDetail.base_info">
          <a-col :span="4" style="text-align: right;">
            基本信息：
          </a-col>
          <a-col :span="20">
            <div>
              <a-row v-if="modalDetail&&modalDetail.base_info&&modalDetail.base_info.type" style="margin-bottom:10px;">
                <a-col :span="4">订单类型：</a-col>
                <a-col :span="8">{{ modalDetail.base_info.type=='scenic'?'景区':modalDetail.base_info.type=='stadium'?'场馆':'课程' }}</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="4">景区名称：</a-col>
                <a-col :span="12">{{ modalDetail.base_info.tools_title }}</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="4">门票名称：</a-col>
                <a-col :span="7">{{ modalDetail.base_info.ticket_title }}</a-col>
                <a-col :span="3" v-if="modalDetail.base_info.is_group==1">类型：</a-col>
                <a-col :span="4" v-if="modalDetail.base_info.is_group==1">团体票</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">

                <!-- 订单状态 10未支付不显示 20未消费已付款，30已消费未评价,40已消费已评价, 45申请退款中，50已退款 60未付款已过期 70已付款已过期 80已全部转赠 -->
                <a-col :span="4" v-if="modalDetail.base_info.order_status !='10'">订单状态：</a-col>
                <a-col :span="7" v-if="modalDetail.base_info.order_status !='10'">{{modalDetail.base_info.order_status_text?modalDetail.base_info.order_status_text:'暂无订单状态'}}</a-col>
                <a-col :span="4" v-if="modalDetail.base_info.source">购买方式：</a-col>
                <a-col :span="4" v-if="modalDetail.base_info.source">{{ modalDetail.base_info.source?modalDetail.base_info.source: '暂无购买方式' }}</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="4">下单数量：</a-col>
                <a-col :span="7">{{ modalDetail.base_info.num }}</a-col>
                <a-col :span="4" v-if="modalDetail.base_info.pay_type">支付方式：</a-col>
                <a-col :span="9" v-if="modalDetail.base_info.pay_type">{{ modalDetail.base_info.pay_type=='wechat'?'微信':modalDetail.base_info.pay_type=='alipay'?'支付宝':modalDetail.base_info.pay_type=='offline'?'现金支付':'余额支付' }}</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="4">下单时间：</a-col>
                <a-col :span="12">{{ modalDetail.base_info.pay_time }}</a-col>
              </a-row>
              <a-row v-if="modalDetail.base_info.use_time" style="margin-bottom:10px;">
                <a-col :span="4">使用时间：</a-col>
                <a-col :span="12">{{ modalDetail.base_info.use_time }}</a-col>
              </a-row>
              <a-row v-if="modalDetail.base_info.verify_time" style="margin-bottom:10px;">
                <a-col :span="4">核销时间：</a-col>
                <a-col :span="12">{{ modalDetail.base_info.verify_time }}</a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>

        <!-- 用户信息展示 -->
        <a-row style="margin-bottom: 20px;" v-if="modalDetail.user_info">
          <a-col :span="4" style="text-align: right;">
            用户信息：
          </a-col>
          <a-col :span="20">
            <div>
              <a-row>
                <a-col :span="5">下单用户昵称：</a-col>
                <a-col :span="12">{{ modalDetail.user_info.nickname }}</a-col>
              </a-row>
              <a-row>
                <a-col :span="6">下单用户手机号：</a-col>
                <a-col :span="12">{{ modalDetail.user_info.phone }}</a-col>
              </a-row>
              <a-row v-if=" modalDetail.user_info.tourists_nickname">
                <a-col :span="5">联系人昵称：</a-col>
                <a-col :span="6">{{ modalDetail.user_info.tourists_nickname }}</a-col>
              </a-row>
              <a-row v-if="modalDetail.user_info.tourists_phone">
                <a-col :span="5">联系人手机号：</a-col>
                <a-col :span="6">{{ modalDetail.user_info.tourists_phone }}</a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>

        <!-- 导游信息展示 -->
        <a-row style="margin-bottom: 20px;" v-if="modalDetail.guide_info&&modalDetail.guide_info.length">
          <a-col :span="4" style="text-align: right;">
            导游信息：
          </a-col>
          <a-col :span="20">
            <!-- 使用for循环 -->
            <div v-for="(ite, ind) in modalDetail.guide_info" :key="ind">
              <a-row v-for="(item, index) in ite" :key="index" style="margin-bottom:10px;">
                <a-col :span="4">{{ item.title }}：</a-col>
                <a-col :span="20" v-if="item.type =='image'" style="display:flex; align-items: center;">
                  <img v-for="(val, inde) in item.show_value" :key="inde" :src="val" alt="" style="width: 50px; height: 50px; margin-right: 10px;">
                </a-col>
                <a-col :span="20" v-else>{{ item.show_value }}</a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>

        <!-- 价格信息展示 -->
        <a-row style="margin-bottom: 20px;" v-if="modalDetail.price_info">
          <a-col :span="4" style="text-align: right;">
            价格信息：
          </a-col>
          <a-col :span="20">
            <div>
              <a-row style="margin-bottom:10px;">
                <a-col :span="4 ">订单总价格：</a-col>
                <a-col :span="12">{{ modalDetail.price_info.total_price }}元</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="4">优惠后价格：</a-col>
                <a-col :span="12">{{ modalDetail.price_info.price }}元</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="5">在线支付金额：</a-col>
                <a-col :span="6">{{ modalDetail.price_info.pay_money }}元</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="6">平台余额支付金额：</a-col>
                <a-col :span="6">{{ modalDetail.price_info.system_balance }}元</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="5">积分抵扣金额：</a-col>
                <a-col :span="6">{{ modalDetail.price_info.system_score_money }}元</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="4">积分抵扣数：</a-col>
                <a-col :span="6">{{ modalDetail.price_info.system_score }}元</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="6">商家余额支付金额：</a-col>
                <a-col :span="6">{{ modalDetail.price_info.merchant_balance_pay }}元</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="7">商家赠送余额支付金额：</a-col>
                <a-col :span="6">{{ modalDetail.price_info.merchant_balance_give }}元</a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>

        <!-- 优惠券信息展示 -->
        <a-row style="margin-bottom: 20px;" v-if="modalDetail.coupon_info">
          <a-col :span="4" style="text-align: right;">
            优惠券信息：
          </a-col>
          <a-col :span="20">
            <div>
              <a-row style="margin-bottom:10px;">
                <a-col :span="6">平台优惠券金额：</a-col>
                <a-col :span="18">{{ modalDetail.coupon_info.coupon_price }}元</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="6">商家优惠券金额：</a-col>
                <a-col :span="18">{{ modalDetail.coupon_info.card_price }}元</a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>

        <!-- 退款信息展示 -->
        <a-row style="margin-bottom: 20px;" v-if="modalDetail.back_info" >
          <a-col :span="4" style="text-align:right;">
            退款信息：
          </a-col>
          <a-col :span="20">
            <div>
              <a-row style="margin-bottom:10px;">
                <a-col :span="4">退款金额：</a-col>
                <a-col :span="20">{{ modalDetail.back_info.refund_money?modalDetail.back_info.refund_money:'0.00' }}元</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="4">退款时间：</a-col>
                <a-col :span="20">{{ modalDetail.back_info.refund_time?modalDetail.back_info.refund_time:'暂无时间' }}</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="4">退款原因：</a-col>
                <a-col :span="20">{{ modalDetail.back_info.reply_refund_reason?modalDetail.back_info.reply_refund_reason:'暂无退款信息' }}</a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>

        <!-- 核销信息展示 -->
        <a-row style="margin-bottom: 20px;" v-if="modalDetail.verify_info&&modalDetail.verify_info.length">
          <a-col :span="4" style="text-align:right;">
            核销信息：
          </a-col>
          <a-col :span="20">
            <!-- 使用for循环 -->
            <div v-for="(item, index) in modalDetail.verify_info" :key="index">
              <a-row style="margin-bottom:10px;">
                <a-col :span="3">核销码：</a-col>
                <a-col :span="21">{{ item.code }}</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="4">核销状态：</a-col>
                <a-col :span="20">{{ item.status_text }}</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="4">退款时间：</a-col>
                <a-col :span="20">{{ item.last_time }}</a-col>
              </a-row>
              <a-row style="margin-bottom:10px;">
                <a-col :span="5">核销人姓名：</a-col>
                <a-col :span="19">{{ item.refund_name?item.refund_name: '暂无姓名' }}</a-col>
              </a-row>
              <a-row v-if="item.verify_type_text" style="margin-bottom:10px;">
                <a-col :span="4">核销方式：</a-col>
                <a-col :span="12">{{ item.verify_type_text }}</a-col>
              </a-row>
              <a-row style="margin-top: 20px;">
                <a-col :span="4"><a-button type="primary" @click="handleOk('verification',item, modalDetail.mer_id)">
                  核销
                </a-button></a-col>
                <a-col :span="4"><a-button type="primary" @click="handleOk('refund', item, modalDetail.mer_id)">
                  退款
                </a-button></a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </div>
      <div v-else-if="modalDetail && type==2">
        <a-form-model :model="modalDetail" :label-col="labelCol" :wrapper-col="wrapperCol" style="max-height: 650px; overflow-y: scroll">
        <a-form-model-item label="订单编号 ">
          {{ modalDetail.orderid }}
        </a-form-model-item>
        <a-form-model-item label="基本信息 ">
          <br>订单类型 : {{ modalDetail.type_name }}
          <br>次卡名称 : {{ modalDetail.card_title }}
          <br>景区名称 : {{ modalDetail.tools_title_val }}
          <br>订单状态 : {{ modalDetail.order_status_val }}
          <br>下单数量 : {{ modalDetail.num }}
          <br>下单时间 : {{ modalDetail.add_time }}
          <br>过期时间 : {{ modalDetail.out_time }}
        </a-form-model-item>
        <a-form-model-item label="用户信息 ">
          <br>下单用户昵称 : {{ modalDetail.nickname }}
          <br>下单用户手机号 : {{ modalDetail.phone }}
        </a-form-model-item>
        <a-form-model-item label="价格信息 ">
          <br>订单总价格 : {{ modalDetail.total_price }} 元
          <br>在线支付金额 : {{ modalDetail.pay_money }} 元
          <br>平台余额支付金额 : {{ modalDetail.system_balance }} 元
          <br>商家余额支付金额 : {{ modalDetail.merchant_balance_pay }} 元
          <br>商家赠送余额支付金额 : {{ modalDetail.merchant_balance_give }} 元
        </a-form-model-item>
        <a-form-model-item label="退款信息 " v-if="modalDetail.refund_money > 0">
          <br>退款金额 : {{ modalDetail.refund_money }} 元
          <br>退款时间 : {{ modalDetail.refund_time }}
          <br>退款原因 : {{ modalDetail.reply_refund_reason }}
          <br>
        </a-form-model-item>
        <a-form-model-item label="退款信息 " v-else>
              <br>无
          </a-form-model-item>
          <div class="can_back">
<a-popconfirm
                    v-if="modalDetail.can_back == 1"
                    title=" 确认退款吗?"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="agree(modalDetail.order_id)"
                >
                    <a-button type="primary" style="margin-top:20px">退款</a-button>
                </a-popconfirm>
          </div>
        
      </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script>
    export default {
        data () {
					return {
						confirmLoading: false,
            labelCol: { span: 6 },
            wrapperCol: { span: 10 },
					}
        },
				props: {
					showModal: {
						type: Boolean,
						default: false
					},
					modalDetail: {
						type: Object,
						default: () => {}
					},
          type: {
						type: Number,
						default(){
              return 1
            }
					},
				},
        created () {
            // this.getData()
            // this.getStatistics()
            // this.getpay()
        },
        methods: {
					handleOk (e, item, mer_id) {
            this.$emit('handleOk', e, item, mer_id)
					},
					handleCancel () {
						this.$emit('handleCancel')
					},
          //次卡退款
          agree(e){
            this.$emit('agree',e)
          },
				}
    }
</script>

<style scoped>
.can_back{
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>
