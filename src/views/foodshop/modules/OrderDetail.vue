<template>
  <a-card :bordered="false" v-if="Object.keys(detail).length" style="padding: 0" class="order-detail-content">
    <a-badge :status="detail.order_status_show" :text="detail.order.status_str" class="status-item" />

    <a-descriptions title="" :column="1">
      <a-descriptions-item :label="L('下单时间')">
        {{ detail.order.create_time_str }}
      </a-descriptions-item>
      <a-descriptions-item :label="L('订单编号')">
        {{ detail.order.real_orderid }}
      </a-descriptions-item>
    </a-descriptions>
    <a-divider dashed style="margin: 10px 0px 18px 0" />

    <!-- 就餐信息 -->
    <a-descriptions title="" :column="1">
      <a-descriptions-item>
        <span class="content-title">{{ L('就餐信息') }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="L('所属门店')">
        {{ detail.store.name }}
      </a-descriptions-item>
      <a-descriptions-item :label="L('桌号')" v-if="detail.table_info.table_type_name">
        {{ detail.table_info.table_type_name }} {{ detail.table_info.table_name ? '-' : '' }}
        {{ detail.table_info.table_name }}
      </a-descriptions-item>
    </a-descriptions>
    <a-divider dashed style="margin: 10px 0px 18px 0" />
    <!-- 下单信息 -->
    <a-descriptions title="" :column="1">
      <a-descriptions-item>
        <span class="content-title">{{ L('下单信息') }}</span>
      </a-descriptions-item>

      <a-descriptions-item :label="L('订单总额')"> {{ L('￥') }}{{ detail.order.total_price }} </a-descriptions-item>
      <a-descriptions-item :label="L('菜品总计份数')" v-if="detail.order.goods_num && detail.order.goods_num != 0">
        x{{ detail.order.goods_num }}
      </a-descriptions-item>
      <a-descriptions-item :label="L('总优惠')" v-if="detail.order.discount_price && detail.order.discount_price != 0">
        ￥{{ detail.order.discount_price }}
      </a-descriptions-item>
      <a-descriptions-item :label="L('实付总额')"> {{ L('￥') }}{{ detail.order.pay_price }} </a-descriptions-item>
      <a-descriptions-item :label="L('已支付订金')" v-if="detail.order.book_price > 0 && detail.order.is_book_pay > 0">
        ￥{{ detail.order.book_price }}
      </a-descriptions-item>
      <a-descriptions-item :label="L('取消原因')" v-if="detail.order.cancel_reason">
        {{ detail.order.cancel_reason }}
      </a-descriptions-item>
    </a-descriptions>
    <!-- 商品列表 -->
    <template v-if="detail.order.goods_detail">
      <a-card v-for="(item, index) in detail.order.goods_detail" class="goods-content" :key="index">
        <span v-for="(order_detail, order_index) in item.goods_combine" :key="order_index">
          <a-descriptions title="" :column="3" v-if="detail.order.show_order_num">
            <a-descriptions-item label="">
              <a-tag color="blue">
                {{ order_detail.number_str }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label=""> </a-descriptions-item>
            <a-descriptions-item :span="2">
              <span style="color: #1890ff">{{ order_detail.status_str }}</span>
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions title="" :column="3" v-for="(goods, goods_index) in order_detail.goods" :key="goods_index">
            <!-- 主商品 -->
            <a-descriptions-item label="">
              <span class="goods-main">{{ goods.name }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="">
              <span class="goods-main">*{{ goods.num }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="">
              <span class="goods-main">{{ L('￥') }}{{ goods.total_price }} 
                <span class="old-money" v-if="goods.old_total_price != goods.total_price">{{goods.old_total_price}}</span>
              </span>
            </a-descriptions-item>
            <!-- 规格 -->
            <a-descriptions-item :span="3" v-if="goods.spec">
              <a-tag v-for="(spec, spec_index) in goods.spec_arr" :key="spec_index">{{ spec }}</a-tag>
            </a-descriptions-item>
            <!-- 附属菜 -->
            <a-descriptions-item :span="3" v-if="goods.spec_sub">
              <a-tag color="blue"> {{ L('辅菜') }} </a-tag>
              <span class="sub-goods">{{ goods.spec_sub }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </span>
        <!-- 已退商品 -->
        <a-descriptions
          title=""
          :column="3"
          v-for="(goods, refund_goods_index) in item.refund_goods"
          :key="refund_goods_index"
        >
          <!-- 主商品 -->
          <a-descriptions-item label="">
            <span class="goods-main">{{ goods.name }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="">
            <span class="goods-main">*{{ goods.num }}</span>
            <img class="refund-image" src="../../../assets/merchant/refund.png" />
          </a-descriptions-item>
          <a-descriptions-item label="">
            <span class="goods-main">{{ L('￥') }}{{ goods.total_price }}</span>
          </a-descriptions-item>
          <!-- 规格 -->
          <a-descriptions-item :span="3" v-if="goods.spec">
            <a-tag v-for="(spec, refund_spec_index) in goods.spec_arr" :key="refund_spec_index">{{ spec }}</a-tag>
          </a-descriptions-item>
          <!-- 附属菜 -->
          <a-descriptions-item :span="3" v-if="goods.spec_sub">
            <a-tag color="blue"> {{ L('辅菜') }} </a-tag>
            <span class="sub-goods">{{ goods.spec_sub }}</span>
          </a-descriptions-item>
        </a-descriptions>

        <a-descriptions title="" :column="3">
          <a-descriptions-item :label="L('满减优惠')" :span="2" v-if="item.discount_money > 0"></a-descriptions-item>
          <a-descriptions-item :span="1" v-if="item.discount_money > 0">
            <span class="discount-money">-{{ L('￥') }}{{ item.discount_money }}</span>
          </a-descriptions-item>
          <a-descriptions-item :label="L('会员卡折扣金额')" :span="2" v-if="item.merchant_discount_money > 0">
            <!-- <span class="discount-money">-{{item.merchant_discount_money}}</span> -->
          </a-descriptions-item>
          <a-descriptions-item :span="1" v-if="item.merchant_discount_money > 0">
            <span class="discount-money">-{{ L('￥') }}{{ item.merchant_discount_money }}</span>
          </a-descriptions-item>
          <a-descriptions-item :label="L('已抵扣订金')" :span="2" v-if="item.book_money > 0"> </a-descriptions-item>
          <a-descriptions-item :span="1" v-if="item.book_money > 0">
            <span class="pay-money">-{{ L('￥') }}{{ item.book_money }}</span>
          </a-descriptions-item>
          <a-descriptions-item :label="L('平台积分抵扣')" :span="2" v-if="item.system_score_money > 0">
          </a-descriptions-item>
          <a-descriptions-item :label="L('商家优惠券')" :span="2" v-if="item.merchant_coupon_price > 0">
          </a-descriptions-item>
          <a-descriptions-item :span="1" v-if="item.merchant_coupon_price > 0">
            <span class="discount-money">-{{ L('￥') }}{{ item.merchant_coupon_price }}</span>
          </a-descriptions-item>
          <a-descriptions-item :label="L('平台优惠券')" :span="2" v-if="item.system_coupon_price > 0">
          </a-descriptions-item>
          <a-descriptions-item :span="1" v-if="item.system_coupon_price > 0">
            <span class="discount-money">-{{ L('￥') }}{{ item.system_coupon_price }}</span>
          </a-descriptions-item>
          <a-descriptions-item :label="L('平台积分抵扣')" :span="2" v-if="item.system_score_money > 0">
          </a-descriptions-item>
          <a-descriptions-item :span="1" v-if="item.system_score_money > 0">
            <span class="pay-money">{{ L('￥') }}{{ item.system_score_money }}</span>
          </a-descriptions-item>
          <a-descriptions-item :label="L('商家会员卡余额')" :span="2" v-if="item.merchant_balance_pay > 0">
          </a-descriptions-item>
          <a-descriptions-item :span="1" v-if="item.merchant_balance_pay > 0">
            <span class="pay-money">{{ L('￥') }}{{ item.merchant_balance_pay }}</span>
          </a-descriptions-item>
          <a-descriptions-item :label="L('平台余额')" :span="2" v-if="item.system_balance > 0"> </a-descriptions-item>
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
          <a-descriptions-item :label="L('支付流水号')" :span="2" v-if="item.pay_info && item.pay_info.transaction_no">
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
          <!-- <a-descriptions-item :label="L('在线支付金额')" :span="2" v-if="item.pay_money > 0"> </a-descriptions-item>
          <a-descriptions-item :span="1" v-if="item.pay_money > 0">
            <span class="pay-money">{{ L('￥') }}{{ item.pay_money }}</span>
          </a-descriptions-item>
          <a-descriptions-item :label="L('支付方式')" :span="2" v-if="item.pay_type > 0"> </a-descriptions-item>
          <a-descriptions-item :span="1" v-if="item.pay_type > 0">
            <span class="d">{{ item.pay_type }}</span>
          </a-descriptions-item> -->
          <a-descriptions-item :label="L('已退款金额')" :span="2" v-if="item.refund_money > 0"></a-descriptions-item>
          <a-descriptions-item :span="1" v-if="item.refund_money > 0">
            <span class="pay-money">{{ L('￥') }}{{ item.refund_money }}</span>
          </a-descriptions-item>
          <a-descriptions-item :label="L('支付时间')" :span="2" v-if="item.pay_time > 0"> </a-descriptions-item>
          <a-descriptions-item :span="1" v-if="item.pay_time > 0">
            <span class="">{{ item.pay_time }}</span>
          </a-descriptions-item>
          <a-descriptions-item :label="L('支付人信息')" :span="2" v-if="item.username"> </a-descriptions-item>
          <a-descriptions-item :span="1" v-if="item.username">
            <span class="">{{ item.username }} {{ item.phone }}</span>
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </template>
    <a-affix :offset-bottom="bottom" class="detail-bottom" v-if="isSystem">
      <a-button type="primary" @click="merchantLogin()"> {{ L('登录商家后台') }} </a-button>
      <a-button type="primary" @click="storeLogin()" style="margin-left: 20px"> {{ L('登录店员后台') }} </a-button>
    </a-affix>
  </a-card>
</template>



<script>
import foodshopPlatformApi from '@/api/foodshop/platform'
import path from '@/router/router-path.js'
import { getTokenName, setCookie } from '@/utils/util'
import Vue from 'vue'
export default {
  props: {
    //接收父页面数据
    detail: {
      type: Object,
      default: () => {
        return {}
      },
    },
    isSystem: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      order: [],
      top: 10,
      bottom: 10,
      baseUrl: '/v20/public/platform/#',
    }
  },
  watch: {
    detail(newVal) {
      console.log('detail3', newVal)
    },
  },
  mounted() {
    console.log('detail2', this.detail)
  },
  methods: {
    // 登录商家后台
    merchantLogin() {
      console.log(this.detail)
      this.request(foodshopPlatformApi.merchantAutoLogin, { mer_id: this.detail.store.mer_id }).then((response) => {
        const tokenName = getTokenName(path.merchantIndex)
        Vue.ls.set(tokenName, response.ticket, null) // vue.ls存储到localstorage,持久化存储
        setCookie(tokenName, response.ticket, null) // 存入到cookie中
        window.open(this.baseUrl + path.merchantIndex, '_blank')
      })
    },
    // 登录店员后台
    storeLogin() {
      this.request(foodshopPlatformApi.staffAutoLogin, { store_id: this.detail.store.store_id }).then((response) => {
        const tokenName = getTokenName(path.storestaffIndex)
        console.log(path.storestaffIndex)
        Vue.ls.set(tokenName, response.ticket, null) // vue.ls存储到localstorage,持久化存储
        setCookie(tokenName, response.ticket, null) // 存入到cookie中
        window.open(this.baseUrl + path.storestaffIndex, '_blank')
        console.log(res)
        console.log(res)
      })
    },
  },
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
.old-money {
  margin-left: 10px;
  color: darkred;
  text-decoration: line-through;
}
.discount-money {
  font-weight: bolder;
}
.goods-content {
  margin-bottom: 10px;
  border: 1px dashed #e8e8e8;
}
.goods-conten:last-child {
  margin-bottom: 40px;
}
.detail-bottom {
  position: fixed;
  bottom: 10px;
  right: 20px;
  background-color: #ffffff;
}
.refund-image {
  width: 30px;
  margin-left: 30px;
}
.status-item {
  margin-bottom: 15px;
}
</style>
