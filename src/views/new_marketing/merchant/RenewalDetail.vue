<template>
  <!-- 续费 -->
  <div class="renewal-detail">
    <div class="header-title">续费详情</div>
    <div class="content">
      <a-row>
        <a-col :span="16">
          <div class="col left">
            <img class="left-image" :src="shopDetail.image" />
            <div class="right-content">
              <div class="content-title">{{ shopDetail.name }}</div>
              <div class="row">
                <span class="title">价格：</span>
                <span class="price">{{ currency + price }}/年</span>
              </div>
              <div class="row">
                <span class="title">服务周期：</span>
                <div class="service">
                  <div
                    class="service-item"
                    :class="item.years == years ? 'active' : ''"
                    v-for="item of yearList"
                    :key="item.years"
                    @click="seviceItemChange(item)"
                  >
                    <span class="item">{{ item.label }}</span>
                    <span class="discount" v-if="item.discount">{{ item.discount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="col right">
            <div class="content-title">支付方式</div>
            <div class="right-cont">
              <div class="top">
                <a-radio-group v-model="payType">
                  <a-radio :style="radioStyle" v-for="item of payTypes" :key="item.value" :value="item.value">
                    {{ item.label }}
                    <template v-if="item.value == 'balance'">
                      <span style="color: red">
                        <template v-if="merchantMoenyShowType == 2">-</template>
                        {{ currency + merchantMoenyShow }}
                      </span>
                      <span style="color: #aaaaaa" v-if="payMoney > merchantMoeny">（余额不足）</span>
                    </template>
                  </a-radio>
                </a-radio-group>
              </div>
              <div class="bottom">
                <div class="discount">已优惠{{ currency + discountMoney }}</div>
                <div class="pay-money">{{ currency + payMoney }}</div>
                <div class="pay-btn" @click="goPay">立即购买</div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <a-modal
      v-model="wxPayModalVisible"
      title="请使用微信扫码支付"
      :width="700"
      centered
      destroyOnClose
      @ok="handleOK"
      cancelText="关闭"
      okText="支付已完成"
      class="modal"
      style="text-aligin: center"
    >
      <div class="tips">请使用微信扫描二维码进行支付</div>
      <div class="qrcode">
        <img :src="qrCodeImg" />
      </div>
    </a-modal>
  </div>
</template>
<script>
import marketingMerchantApi from '@/api/new_marketing/merchant'

let timer = null
let messageLoading = null

export default {
  name: 'MarketingRenewalDetail',
  data() {
    return {
      currency: '￥',
      payType: '1',
      radioStyle: {
        display: 'block',
        height: '40px',
        lineHeight: '40px',
        fontSize: '16px',
        color: '#333',
      },
      wxPayModalVisible: false,
      storeId: '',
      years: '',
      price: '',
      shopDetail: {},
      yearList: [],
      payTypes: [],
      payType: '',
      payMoney: '',
      discountMoney: '',
      merchantMoeny: '',
      qrCodeImg: '',
      merchantMoenyShow: '',
      merchantMoenyShowType: 1, // 1正数 2负数
      orderid: '',
    }
  },
 watch: {
    '$route.query.store_id'(val) {
      if (val) {
        Object.assign(this.$data, this.$options.data())
        this.storeId = val
        this.getData()
      }
    },
  },
  mounted() {
    this.storeId = this.$route.query.store_id
    this.getData()
  },
  methods: {
    goPay() {
      console.log(this.payType)
      if (this.payType == 'balance' && Number(this.merchantMoeny) < Number(this.payMoney)) {
        this.$message.warning('余额不足，请选择其他支付方式~')
        return
      }
      this.request(marketingMerchantApi.savePayInfo, {
        store_id: this.storeId,
        years: this.years,
        pay_type: this.payType,
      }).then((data) => {
        if (data && data.order_id) {
          this.request(marketingMerchantApi.goPay, {
            order_id: data.order_id,
            order_type: data.order_type,
            pay_type: this.payType,
          }).then((res) => {
            if (this.payType == 'weixin') {
              this.qrCodeImg = res.info
              this.wxPayModalVisible = true
            } else if (this.payType == 'alipay') {
              window.open(res.info)
              this.orderid = res.orderid
              messageLoading = this.$message.loading('正在支付...', 0)
              timer = setInterval(() => {
                this.getOrderDetail()
              }, 1000)
            } else {
              this.$message.success('支付成功！')
              setTimeout(() => {
                this.handleOK()
              }, 1000)
            }
          })
        }
      })
    },
    getOrderDetail() {
      this.request(marketingMerchantApi.checkOrderPayOk, {
        orderid: this.orderid,
      })
        .then((data) => {
          if (data.paid == 1) {
            setTimeout(messageLoading, 0)
            this.$message.success('支付成功！')
            clearInterval(timer)
            timer = null
            setTimeout(() => {
              this.handleOK()
            }, 1000)
          }
        })
        .catch((err) => {
          setTimeout(messageLoading, 0)
          this.$message.error('支付失败！' + err.msg)
          clearInterval(timer)
          timer = null
        })
    },
    handleOK() {
      this.wxPayModalVisible = false
      this.$multiTab.closeCurrentPage()
      this.$router.push('/new_marketing/merchant/storeUseDetail')
    },
    seviceItemChange(value) {
      this.years = value.years
      this.price = value.price
      this.getData()
    },
    getData() {
      let params = { store_id: this.storeId }
      if (this.years) {
        params.years = this.years
      }
      this.request(marketingMerchantApi.getRenewPayInfo, params).then((data) => {
        if (data) {
          if (!this.years) {
            this.years = data.price_detail.service_cycle[0].years
            this.price = data.price_detail.service_cycle[0].price
            // 店铺信息
            this.$set(this, 'shopDetail', data.store)
            // 价格列表
            if (data.price_detail && data.price_detail.service_cycle) {
              this.$set(this, 'yearList', data.price_detail.service_cycle)
            }
          }
          // 支付信息
          if (data.pay) {
            this.payMoney = Number(data.pay.pay_money)
            this.discountMoney = Number(data.pay.discount_money)
            this.merchantMoeny = Number(data.pay.merchant_money)
            this.merchantMoenyShow = this.merchantMoeny > 0 ? this.merchantMoeny : this.merchantMoeny * -1
            this.merchantMoenyShowType = this.merchantMoeny > 0 ? 1 : 2
            this.$set(this, 'payTypes', data.pay.pay_type)
            if (!this.payType && data.pay.pay_type && data.pay.pay_type.length) {
              this.payType = data.pay.pay_type[0].value
            }
          }
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.renewal-detail {
  margin: 20px 10px;
  border-radius: 6px;
  box-shadow: 0px 0px 4px 4px #f1f1f1;
  overflow: hidden;
  .header-title {
    width: 100%;
    background: #ffffff;
    color: #333333;
    font-weight: bold;
    font-size: 18px;
    line-height: 60px;
    padding: 10px 20px;
    box-sizing: border-box;
  }
  .content {
    width: 100%;
    background: #fafafa;
    padding: 20px;
    box-sizing: border-box;
    .col {
      background: #ffffff;
      margin: 0 5px;
      width: calc(~'100%- 10px');
      //   min-height: 600px;
      padding: 20px;
    }
    .content-title {
      font-size: 24px;
      font-weight: bold;
      color: #333333;
    }
    .left {
      display: flex;
      .left-image {
        min-width: 200px;
        max-width: 200px;
        height: 200px;
        border-radius: 4px;
      }
      .right-content {
        flex: 1;
        margin-left: 10px;
        .row {
          display: flex;
          margin: 20px 0;
          line-height: 30px;
          vertical-align: middle;
          .title {
            margin-right: 10px;
            min-width: 80px;
            max-width: 80px;
          }
        }
        .price {
          color: #1890ff;
          font-size: 22px;
        }
        .service {
          .service-item {
            float: left;
            margin-right: 30px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            padding: 0 10px;
            min-width: 80px;
            text-align: center;
            border-radius: 4px;
            font-size: 14px;
            color: #666;
            position: relative;
            cursor: pointer;
            .discount {
              position: absolute;
              color: #ffffff;
              font-size: 12px;
              background: #1890ff;
              border-radius: 10px;
              padding: 0 4px;
              min-width: 40px;
              top: -10px;
              right: -24px;
              line-height: 20px;
              text-align: center;
            }
          }
          .active {
            border-color: #1890ff;
            color: #1890ff;
          }
        }
      }
    }
    .right {
      .right-cont {
        min-height: 500px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-top: 20px;
        .top {
          flex: 1;
        }
        .bottom {
          text-align: right;
          .discount {
            color: #1890ff;
            font-size: 20px;
          }
          .pay-money {
            color: #333333;
            font-weight: bold;
            font-size: 28px;
          }
          .pay-btn {
            width: 100%;
            margin: 10px 0;
            height: 50px;
            line-height: 50px;
            vertical-align: middle;
            text-align: center;
            color: #ffffff;
            font-size: 24px;
            //   font-weight: bold;
            background: #1890ff;
            border-radius: 6px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
.modal {
  .tips {
    line-height: 40px;
    vertical-align: middle;
    text-align: center;
    font-size: 18px;
    color: #333333;
    font-weight: bold;
  }
  .qrcode {
    width: 400px;
    height: 400px;
    margin: auto;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
