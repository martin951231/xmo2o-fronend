<template>
  <a-card :bordered="false" v-if="Object.keys(detail).length" style="padding: 0" class="order-detail-content">
    <a-badge color="red" :text="detail.order_status_txt" class="status-item" />
    <a-descriptions title :column="1" class="mt-10">
      <a-descriptions-item :label="L('下单时间')">{{ detail.create_time }}</a-descriptions-item>
      <a-descriptions-item :label="L('订单编号')">{{ detail.real_orderid }}</a-descriptions-item>
      <!-- <a-descriptions-item v-if="detail.phone" :label="L('预约手机号')">{{ detail.phone }}</a-descriptions-item> -->
      <!-- <a-descriptions-item v-if="detail.user_phone" :label="L('绑定手机号')">{{ detail.user_phone }}</a-descriptions-item> -->
    </a-descriptions>
    <a-divider dashed style="margin: 10px 0px 18px 0" />

    <!-- 就餐信息 -->
    <a-descriptions title :column="1">
      <a-descriptions-item
      ><span class="content-title">{{ L('就餐信息') }}</span></a-descriptions-item
      >
      <a-descriptions-item :label="L('所属门店')">{{ detail.store_name }}</a-descriptions-item>
      <a-descriptions-item :label="L('桌号')" v-if="detail.table_info && detail.table_info.table_type_name">
        {{ detail.table_info.table_type_name
        }}{{ detail.table_info.table_name ? '-' + detail.table_info.table_name : '' }}
      </a-descriptions-item>
      <a-descriptions-item
        :label="L('取餐号')"
        v-if="detail.order_from == '5' || (detail.is_self_take && detail.fetch_number)"
      >{{ detail.fetch_number }}</a-descriptions-item
      >
      <!-- <a-descriptions-item :label="L('取餐时间')" v-if="detail.is_self_take && detail.self_take_time">{{
        detail.self_take_time
      }}</a-descriptions-item>
      <a-descriptions-item :label="L('就餐时间')" v-if="detail.book_time_str">{{ detail.book_time_str }}</a-descriptions-item>
      <a-descriptions-item :label="L('就餐人数')" v-if="detail.book_num">{{ detail.book_num }}</a-descriptions-item>-->
      <a-descriptions-item
        :label="L('已支付订金')"
        v-if="detail.book_price != 0 && detail.book_price != 0.0"
      >{{ L('￥') }}{{ detail.book_price }}</a-descriptions-item
      >
    </a-descriptions>
    <a-divider dashed style="margin: 10px 0px 18px 0" />
    <!-- 下单信息 -->
    <a-descriptions title :column="1">
      <a-descriptions-item
      ><span class="content-title">{{ L('下单信息') }}</span></a-descriptions-item
      >
      <a-descriptions-item :label="L('订单总额')">{{ L('￥') }}{{ detail.total_price }}</a-descriptions-item>
      <a-descriptions-item :label="L('菜品总计份数')" v-if="detail.goods_num && detail.goods_num != 0">
        x{{ detail.goods_num }}
      </a-descriptions-item>
      <a-descriptions-item :label="L('总优惠')" v-if="detail.discount_price && detail.discount_price != 0">
        {{ L('￥') }}{{ detail.discount_price }}
      </a-descriptions-item>
      <a-descriptions-item :label="L('实付总额')">{{ L('￥') }}{{ detail.pay_price }}</a-descriptions-item>
      <!-- <a-descriptions-item :label="L('订单备注')" v-if="detail.note">{{ detail.note }}</a-descriptions-item> -->
      <a-descriptions-item :label="L('取消原因')" v-if="detail.cancel_reason">{{
        detail.cancel_reason
      }}</a-descriptions-item>
    </a-descriptions>
    <!-- 商品列表 -->
    <template v-if="detail.goods_detail && detail.goods_detail.length">
      <a-card v-for="(item, index) in detail.goods_detail" class="goods-content" :key="'goods_detail_' + index">
        <template v-if="item.goods_combine && item.goods_combine.length">
          <span v-for="(order_detail, index2) in item.goods_combine" :key="'order_detail_' + index2">
            <a-descriptions title :column="3">
              <a-descriptions-item label v-if="detail.show_order_num == 1">
                <a-tag color="blue">{{ order_detail.number_str }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label v-else> </a-descriptions-item>
              <a-descriptions-item label></a-descriptions-item>
              <a-descriptions-item :span="2">
                <span style="color: #1890ff">{{ order_detail.status_str }}</span>
              </a-descriptions-item>
            </a-descriptions>
            <a-descriptions title :column="3" v-for="(goods, index3) in order_detail.goods" :key="'goods_' + index3">
              <!-- 主商品 -->
              <a-descriptions-item label>
                <span
                  class="goods-main"
                  :class="detail.order_status && detail.order_status == 4 ? 'pointer' : ''"
                  @click="getGoodsInfo(goods)"
                >{{ goods.name }}</span
                >
              </a-descriptions-item>
              <a-descriptions-item label>
                <span class="goods-main">*{{ goods.num }}</span>
              </a-descriptions-item>
              <a-descriptions-item label>
                <span class="goods-main">{{ L('￥') }}{{ goods.total_price }}</span>
              </a-descriptions-item>
              <!-- 规格 -->
              <a-descriptions-item :span="3" v-if="goods.spec">
                <a-tag v-for="(spec, index4) in goods.spec_arr" :key="'spec_' + index4">{{ spec }}</a-tag>
              </a-descriptions-item>
              <!-- 附属菜 -->
              <a-descriptions-item :span="3" v-if="goods.spec_sub">
                <a-tag color="blue">{{ goods.is_package_goods ? L('菜品') : L('辅菜') }}</a-tag>
                <span class="sub-goods">{{ goods.spec_sub }}</span>
              </a-descriptions-item>
            </a-descriptions>
            <!-- <a-descriptions title :column="3" v-if="order_detail.goods_note">
              <a-descriptions-item :label="L('备注">
                <span class="goods-main">{{ order_detail.goods_note }}</span>
              </a-descriptions-item>
            </a-descriptions> -->

            <!-- 已退商品 -->
          <a-descriptions title="" :column="3" v-for="(goods, goods_index) in order_detail.refund_goods" :key="goods_index">
            <!-- 主商品 -->
            <a-descriptions-item label="">
              <span class="goods-main">{{ goods.name }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="">
              <span class="goods-main">*{{ goods.num }}</span>
              <img class="refund-image" :src="require('../../../../../assets/merchant/refund.png')" />
            </a-descriptions-item>
            <a-descriptions-item label="">
              <span class="goods-main">{{ L('￥') }}{{ goods.total_price }}</span>
            </a-descriptions-item>
            <!-- 规格 -->
            <a-descriptions-item :span="3" v-if="goods.spec">
              <a-tag v-for="(spec, spec_index) in goods.spec_arr" :key="spec_index" class="spec">{{ spec }}</a-tag>
            </a-descriptions-item>
            <!-- 附属菜 -->
            <a-descriptions-item :span="3" v-if="goods.spec_sub">
              <a-tag color="blue">{{ goods.is_package_goods ? L('菜品') : L('辅菜') }}</a-tag>
              <span class="sub-goods">{{ goods.spec_sub }}</span>
            </a-descriptions-item>
          </a-descriptions>

          </span>
          
          <a-descriptions title :column="3" style="margin-top: 10px;">
            <a-descriptions-item :label="L('满减优惠')" :span="2" v-if="item.discount_money > 0"></a-descriptions-item>
            <a-descriptions-item :span="1" v-if="item.discount_money > 0">
              <span class="discount-money">-{{ L('￥') }}{{ item.discount_money }}</span>
            </a-descriptions-item>
            <a-descriptions-item
              :label="L('会员卡折扣金额')"
              :span="2"
              v-if="item.merchant_discount_money > 0"
            ></a-descriptions-item>
            <a-descriptions-item :span="1" v-if="item.merchant_discount_money > 0">
              <span class="discount-money">-{{ L('￥') }}{{ item.merchant_discount_money }}</span>
            </a-descriptions-item>
            <a-descriptions-item
              :label="L('商家优惠券')"
              :span="2"
              v-if="item.merchant_coupon_price > 0"
            ></a-descriptions-item>
            <a-descriptions-item :span="1" v-if="item.merchant_coupon_price > 0">
              <span class="discount-money">-{{ L('￥') }}{{ item.merchant_coupon_price }}</span>
            </a-descriptions-item>
            <a-descriptions-item
              :label="L('平台优惠券')"
              :span="2"
              v-if="item.system_coupon_price > 0"
            ></a-descriptions-item>
            <a-descriptions-item :span="1" v-if="item.system_coupon_price > 0">
              <span class="discount-money">-{{ L('￥') }}{{ item.system_coupon_price }}</span>
            </a-descriptions-item>
            <a-descriptions-item
              :label="L('已抵扣订金')"
              :span="2"
              v-if="item.book_money != 0 && item.book_money != 0.0 && item.book_money"
            ></a-descriptions-item>
            <a-descriptions-item :span="1" v-if="item.book_money > 0">
              <span class="discount-money">-{{ L('￥') }}{{ item.book_money }}</span>
            </a-descriptions-item>
            <a-descriptions-item
              :label="L('平台积分抵扣')"
              :span="2"
              v-if="item.system_score_money > 0"
            ></a-descriptions-item>
            <a-descriptions-item :span="1" v-if="item.system_score_money > 0">
              <span class="pay-money">{{ L('￥') }}{{ item.system_score_money }}</span>
            </a-descriptions-item>
            <a-descriptions-item
              :label="L('商家会员卡余额支付')"
              :span="2"
              v-if="item.merchant_balance_pay > 0"
            ></a-descriptions-item>
            <a-descriptions-item :span="1" v-if="item.merchant_balance_pay > 0">
              <span class="pay-money">{{ L('￥') }}{{ item.merchant_balance_pay }}</span>
            </a-descriptions-item>
            <a-descriptions-item :label="L('平台余额')" :span="2" v-if="item.system_balance > 0"></a-descriptions-item>
            <a-descriptions-item :span="1" v-if="item.system_balance > 0">
              <span class="pay-money">{{ L('￥') }}{{ item.system_balance }}</span>
            </a-descriptions-item>
            <!-- 在线支付金额 -->
            <a-descriptions-item
              :label="item.pay_info.pay_type_chanel"
              :span="2"
              v-if="item.pay_info && item.pay_info.pay_type_chanel"
            >
            </a-descriptions-item>
            <a-descriptions-item :span="1" v-if="item.pay_info && item.pay_info.pay_type">
              <span class="pay-money">{{ L('￥') }}{{ item.pay_money }}</span>
            </a-descriptions-item>
            <!-- 在线支付流水号 -->
            <a-descriptions-item
              :label="L('支付流水号')"
              :span="2"
              v-if="item.pay_info && item.pay_info.transaction_no"
            >
            </a-descriptions-item>
            <a-descriptions-item :span="1" v-if="item.pay_info && item.pay_info.transaction_no">
              <span>{{ item.pay_info.transaction_no }}</span>
            </a-descriptions-item>
            <!-- 支付环境 -->
            <a-descriptions-item :label="L('支付环境')" :span="2" v-if="item.pay_info && item.pay_info.env_txt">
            </a-descriptions-item>
            <a-descriptions-item :span="1" v-if="item.pay_info && item.pay_info.env_txt">
              <span class="pay-money">{{ item.pay_info.env_txt }}</span>
            </a-descriptions-item>
            <!-- <a-descriptions-item :label="L('在线支付金额')" :span="2" v-if="item.pay_money > 0"></a-descriptions-item>
            <a-descriptions-item :span="1" v-if="item.pay_money > 0">
              <span class="pay-money">{{ L('￥') }}{{ item.pay_money }}</span>
            </a-descriptions-item>
            <a-descriptions-item :label="L('支付方式')" :span="2" v-if="item.pay_type > 0"></a-descriptions-item>
            <a-descriptions-item :label="L('支付方式')" :span="1" v-if="item.pay_type > 0">
              <span class="d">{{ item.pay_type }}</span>
            </a-descriptions-item> -->
            <a-descriptions-item :label="L('已退款金额')" :span="2" v-if="item.refund_money > 0"></a-descriptions-item>
            <a-descriptions-item :span="1" v-if="item.refund_money > 0">
              <span class="pay-money">{{ L('￥') }}{{ item.refund_money }}</span>
            </a-descriptions-item>
            <a-descriptions-item :label="L('支付时间')" :span="2" v-if="item.pay_time > 0"></a-descriptions-item>
            <a-descriptions-item :span="1" v-if="item.pay_time > 0">
              <span class>{{ item.pay_time }}</span>
            </a-descriptions-item>
            <a-descriptions-item :label="L('支付人信息')" :span="2" v-if="item.username"></a-descriptions-item>
            <a-descriptions-item :span="1" v-if="item.username">
              <span class>{{ item.username }} {{ item.phone }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </template>
      </a-card>
    </template>

    <!-- 占位 -->
    <div style="height:53px;" v-if="detail.order_status && detail.order_status == 4 && detail.goods_num != 0 && canRefund==1"></div>

    <!-- 整单退款 -->
    <div class="detail-bottom-refund" v-if="detail.order_status && detail.order_status == 4 && detail.goods_num != 0 && canRefund==1">
      <a-row type="flex" justify="space-between" align="middle">
        <a-col class="text-left">
          <span> {{ L('如需退菜，点击菜名即可退菜') }}！ </span>
        </a-col>
        <a-col class="text-right">
          <a-button type="danger" @click="refundOrder()">{{ L('整单退款') }}</a-button>
        </a-col>
      </a-row>
    </div>
    <!-- 退菜 -->
    <a-modal
      v-model="returnFoodShow"
      :footer="null"
      :title="null"
      width="32%"
      :maskClosable="false"
      :closable="false"
      :centered="true"
      :bodyStyle="{ padding: 0 }"
      :destroyOnClose="true"
    >
      <div class="alert_wrapper">
        <returnFoodModel @returnSuccess="cfmreturn" :goodsInfo="goodsInfo" @closemodel="closemodel"></returnFoodModel>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import foodshopPlatformApi from '@/api/foodshop/platform'
import path from '@/router/router-path.js'
import { getTokenName, setCookie } from '@/utils/util'
import returnFoodModel from '@/views/foodshop/storestaff/cashier/components/returnFoodModel'
import Vue from 'vue'
export default {
  components: {
    returnFoodModel
  },
  props: {
    // 接收父页面数据
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isSystem: {
      type: Number,
      default: 1
    },
    canRefund: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      order: [],
      top: 10,
      bottom: 10,
      baseUrl: '/v20/public/platform/#',
      goodsInfo: '',
      returnFoodShow: false
    }
  },
  methods: {
    // 登录商家后台
    merchantLogin () {
      this.request(foodshopPlatformApi.merchantAutoLogin, { mer_id: this.detail.store.mer_id }).then((response) => {
        const tokenName = getTokenName(path.merchantIndex)
        Vue.ls.set(tokenName, response.ticket, null) // vue.ls存储到localstorage,持久化存储
        setCookie(tokenName, response.ticket, null) // 存入到cookie中
        window.open(this.baseUrl + path.merchantIndex, '_blank')
      })
    },
    // 登录店员后台
    storeLogin () {
      this.request(foodshopPlatformApi.staffAutoLogin, { store_id: this.detail.store.store_id }).then((response) => {
        const tokenName = getTokenName(path.storestaffIndex)
        Vue.ls.set(tokenName, response.ticket, null) // vue.ls存储到localstorage,持久化存储
        setCookie(tokenName, response.ticket, null) // 存入到cookie中
        window.open(this.baseUrl + path.storestaffIndex, '_blank')
      })
    },
    // 部分退菜 获取单个商品信息
    getGoodsInfo (goods) {
      if (!this.detail.order_status && this.detail.order_status != 4) return
      this.$store.state.storestaff.nowOrderId = this.detail.order_id
      this.returnFoodShow = true
      this.goodsInfo = goods
    },
    cfmreturn () {
      this.getorderInfo()
      this.closemodel()
    },
    closemodel () {
      this.returnFoodShow = false
    },
    // 获取订单信息
    getorderInfo () {
      const params = {
        order_id: this.detail.order_id
      }
      const success = (res) => {
        if (res.order.order_status && res.order.order_status == 5) {
          // 全部退菜 刷新列表
          this.$emit('closeOpt')
          this.$emit('updateList')
        } else {
          // 更新当前订单
          this.$emit('look', res.order)
        }
      }
      this.request('/foodshop/storestaff.order/orderDetail', params).then(success)
    },
    // 整单退款
    refundOrder () {
        this.$confirm({
            content: this.L('是否确认整单退款？'),
            maskClosable: false,
            cancelText: this.L('取消'),
            okText: this.L('确认'),
            onOk: () => {
                this.$emit('closeOpt')
                this.$emit('updateSpinning', true)
                const params = {
                    order_id: this.detail.order_id
                }
                const success = (res) => {
                    this.$emit('updateSpinning', false)
                    this.$message.success({ content: this.L('整单退款成功!') })
                    this.$emit('updateList')
                }
                this.request('/foodshop/storestaff.order/refundOrderAll', params).then(success).catch(() => {
                    this.$emit('updateSpinning', false)
                })
            },
            onCancel: () => {
                this.$emit('updateSpinning', false)
            }
        })
    }
  }
}
</script>
<style scoped>
.status-item >>> .ant-badge {
  margin-bottom: 12px;
}
.status-item >>> .ant-badge-status-text {
  margin-left: 8px;
  font-size: 18px;
  font-weight: bolder;
  color: black;
}

.content-title {
  border-left: 4px solid black;
  padding-left: 6px;
  color: black;
  font-weight: bolder;
  height: 16px;
  line-height: 16px;
}
.pay-money {
  color: darkred;
}
.discount-money {
  font-weight: bolder;
}
.goods-content {
  margin-bottom: 10px;
  border: 1px dashed #e8e8e8;
}
.detail-bottom-refund {
  padding: 10px 48px;
  width: 520px;
  position: fixed;
  bottom: 0;
  right: 0;
  background-color: #ffffff;
  box-sizing: border-box;
  border-top: 1px solid #e8e8e8;
}
.refund-image {
  width: 30px;
  margin-left: 30px;
}
.spec.ant-tag {
  margin-bottom: 8px;
}
.pointer:hover {
  color: #1890ff;
  background-color: transparent;
  border-color: transparent;
  box-shadow: none;
}
</style>
