<template>
  <div class="change_diners_wrapper">
    <div class="title_container">
      <div class="paytitle_content">
        <div class="title_font" v-if="methodstype === 'balance'">{{ L('平台余额支付') }}</div>
        <div class="title_font" v-else-if="methodstype === 'online'">{{ L('线上支付') }}</div>
        <div class="title_font" v-else>{{ L('线下支付') }}</div>
      </div>
      <div class="backtext" v-if="methodstype == 'balance' && waitingPay" @click="stopPay()">{{ L('返回上一步') }}</div>
      <div class="backtext" v-else @click="closemodel()">{{ L('关闭') }}</div>
    </div>

    <div class="paybody_wrapper" v-if="methodstype == 'balance'">
      <div class="center_container">
        <div class="label_text" v-if="waitingPay">
          {{ L('平台余额支付') }}:
          <span>{{ userinfo.now_money }}</span>
        </div>
        <div class="label_text" v-else>{{ L('平台余额支付') }}</div>
        <div class="inputbox" v-if="waitingPay">
          <input type="number" v-model="code" placeholder="请输入验证码" />
          <div class="countdown_content" v-if="countdown > 0">{{ L('X1秒', { X1: countdown }) }}</div>
        </div>
        <div class="inputbox" v-else>
          <input
            class="input_phone"
            type="tel"
            v-model="phonenumber"
            maxlength="11"
            :placeholder="L('请输入手机号')"
            oninput="value=value.replace(/[^\d]/g,'')"
          />
        </div>
        <div class="explain_content">
          <div class="iconbox"><img src="../../../../../assets/storestaff/waring.png" alt="" /></div>
          <div class="textExplain">{{ L('只有在平台账户绑定手机号的用户才能使用平台余额支付') }}</div>
        </div>
      </div>

      <div class="sendcode_btn" v-if="waitingPay || !balancePayUseSms" @click="payorder('balance')">
        {{ L('确认支付') }}({{ L('￥')
        }}{{ vipMoney ? Number(modelInfo.needpay_price) - vipMoney : Number(modelInfo.needpay_price) }})
      </div>
      <div class="sendcode_btn" v-else @click="gowait()">{{ L('发送验证码') }}</div>
    </div>

    <div class="paybody_wrapper" v-else-if="methodstype == 'online'">
      <div class="center_container">
        <div class="payicon_container">
          <div class="payiconbox"><img src="../../../../../assets/storestaff/wxzf.png" alt="" /></div>
          <div class="payiconbox"><img src="../../../../../assets/storestaff/zfbzf.png" alt="" /></div>
          <!-- <div class="payiconbox"><img src="../../../../../assets/storestaff/ysfzf.png" alt="" /></div> -->
        </div>
        <div class="scan_inputbox">
          <input type="number" v-model="scancode" ref="numberInput" @keypress="codeIn" />
          <div class="iconbox"><img src="../../../../../assets/storestaff/saoma.png" alt="" /></div>
        </div>
        <div class="explain_content">
          <div class="iconbox"><img src="../../../../../assets/storestaff/waring.png" alt="" /></div>
          <div class="textExplain">
            {{
              L(
                '建议使用扫码枪直接扫描得到值，或者先刷新用户手机中的码，再写入。如果提示扫码错误，可以关闭本页面重新创建订单。'
              )
            }}
          </div>
        </div>
      </div>
      <div class="onlinepay_cfm" :class="scancode ? '' : 'cantclk'" @click="payorder('online')">
        {{ L('确认付款') }}
      </div>
    </div>

    <div class="outlinecontent" v-else>
      <div class="center_container">
        <div class="needcollect dashed_content">
          <div class="leftlabel">{{ L('应收') }}</div>
          <div class="rightvalue">
            {{
              vipMoney
                ? (Number(modelInfo.needpay_price) - Number(vipMoney)).toFixed(2)
                : Number(modelInfo.needpay_price).toFixed(2)
            }}
          </div>
        </div>
        <div class="collect_yet dashed_content">
          <div class="leftlabel">{{ L('已收') }}</div>
          <div class="rightvalue">
            <input type="number" v-model="getPrice" :placeholder="L('请输入收取金额')" @input="computedchange()" />
          </div>
        </div>
        <div class="givechange dashed_content">
          <div class="leftlabel">{{ L('找零') }}</div>
          <div class="rightvalue">{{ giveChange.toFixed(2) }}</div>
        </div>
        <div class="dashed_content" v-if="modelInfo.offline_pay_type && modelInfo.offline_pay_type.length" style="align-items: unset;">
            <div class="leftlabel">{{ L('支付方式') }}</div>
            <div class="flex-1 text-right text-wrap">
                <span class="text-wrap offline-pay-item text-left pointer" :class="[{'active': offlinePayType == item.id}]" v-for="item in modelInfo.offline_pay_type" :key="item.id" @click="offlinePayTypeHandle(item)">{{ item.name }}</span>
            </div>
        </div>
      </div>
      <div class="onlinepay_cfm" @click="payorder('offline')">{{ L('确认付款') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelInfo: Object,
    paymodeInfo: String,
    vipMoney: Number,
  },
  data() {
    return {
      methodstype: '', //当前支付方法的状态判断
      // 平台余额支付信息
      giveChange: 0,
      getPrice: '',

      waitingPay: false, //判断是否在等待付款的弹框
      countdown: 60, //倒计时
      countdownfnc: '',
      phone: '',
      code: '',
      scancode: '',

      phonenumber: '', //接收验证码电话
      userinfo: '',

      // 线上支付

      // 线下支付
      offlinePayType: '',

      //使用平台余额支付是否需要短信验证码验证  1：需要  0：不需要
      balancePayUseSms:1
    }
  },
  created() {
    this.methodstype = this.paymodeInfo
    if(this.methodstype == 'offline' && this.modelInfo && this.modelInfo.offline_pay_type && this.modelInfo.offline_pay_type[0]) {
        this.offlinePayType = this.modelInfo.offline_pay_type[0].id
    }
    this.$nextTick(() => {
        $('.input_phone').focus()
    });
    this.getConfig();
  },
  mounted() {
    if (this.methodstype === 'online') {
      this.$refs.numberInput.focus()
    }
  },
  methods: {
    codeIn(e) {
      if (e.key == 'Enter') {
        this.payorder('online')
      }
    },
    computedchange() {
      this.giveChange = this.vipMoney
        ? Number(this.getPrice) - this.modelInfo.needpay_price - this.vipMoney
        : Number(this.getPrice) - this.modelInfo.needpay_price
      if (this.giveChange < 0) {
        this.giveChange = 0
      }
    },
    // 开启倒计时
    opencutdown() {
      this.countdown = 60
      this.countdownfnc = setInterval(() => {
        this.countdown += -1
      }, 1000)
    },

    closemodel() {
      this.$emit('closemodel')
    },
    stopPay() {
      this.waitingPay = false
      clearInterval(this.countdownfnc)
    },
    gowait() {
      this.request('/storestaff/storestaff.index/sendSmsToUser', {
        phone: this.phonenumber,
      }).then((res) => {
        if (res.user) {
          this.waitingPay = true
          this.userinfo = res.user
          this.opencutdown()
        }
      })
    },
    getConfig() {
      this.request('/storestaff/storestaff.index/getConfig', {}).then((res) => {
        this.balancePayUseSms = res.balance_pay_use_sms;
      })
    },

    closemodel() {
      this.$emit('closemodel')
    },

    payorder(type) {
      this.$emit('comfirmOrder', {
        type: type,
        code: this.code,
        phone: this.phonenumber,
        authCode: this.scancode,
        offline_pay_type: this.offlinePayType
      })
    },
    offlinePayTypeHandle(item) {
        if(item.id == this.offlinePayType) return
        this.offlinePayType = item.id
    }
  },
}
</script>

<style lang="less" scoped>
@rem: 192; //定义页面尺寸
.change_diners_wrapper {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  .title_container {
    width: 100%;
    height: 100 / @rem * 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fafafa;
    box-sizing: border-box;
    padding: 0 30 / @rem * 1rem;
    .paytitle_content {
      font-size: 32 / @rem * 1rem;
      font-weight: bold;
      color: #222222;
      line-height: 100 / @rem * 1rem;
      text-align: center;
    }
    .backtext {
      cursor: pointer;
      font-size: 26 / @rem * 1rem;
      font-weight: 500;
      color: #9a9a9a;
    }
  }
  .paybody_wrapper {
    width: 100%;
    height: 510 / @rem * 1rem;
    background-color: #f3f5f7;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    .center_container {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;
      box-sizing: border-box;
      padding: 0 60 / @rem * 1rem;
      .label_text {
        width: 100%;
        text-align: center;
        font-size: 30 / @rem * 1rem;
        font-weight: 500;
        color: #ff9c00;
        margin-top: 100 / @rem * 1rem;
        span {
          margin-left: 10 / @rem * 1rem;
        }
      }
      .inputbox {
        width: 100%;
        height: 65 / @rem * 1rem;
        background-color: #ffffff;
        border: solid 2 / @rem * 1rem #ff9c00;
        display: flex;
        justify-content: space-between;
        padding: 0 20 / @rem * 1rem;
        align-items: center;
        border-radius: 4 / @rem * 1rem;
        margin-top: 30 / @rem * 1rem;
        input {
          width: 70%;
          height: 100%;
          outline: none;
          border: none;
          background: transparent;
          font-size: 28 / @rem * 1rem;
          font-weight: 500;
          color: #343434;
          line-height: 65 / @rem * 1rem;
        }
        input::-webkit-input-placeholder {
          color: #cecece;
        }
        .countdown_content {
          font-size: 22 / @rem * 1rem;
          font-weight: 500;
          color: #ff9c00;
        }
      }
      .explain_content {
        width: 100%;
        display: flex;
        align-items: flex-start;
        margin-top: 25 / @rem * 1rem;
        .iconbox {
          width: 14 / @rem * 1rem;
          height: 27 / @rem * 1rem;
          display: flex;
          align-items: center;
          margin-right: 10 / @rem * 1rem;
          img {
            width: 100%;
            height: 14 / @rem * 1rem;
          }
        }
        .textExplain {
          width: 95%;
          font-size: 18 / @rem * 1rem;
          font-weight: 500;
          color: #9a9a9a;
        }
      }

      .payicon_container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        display: flex;
        margin-top: 50 / @rem * 1rem;
        .payiconbox {
          width: 100 / @rem * 1rem;
          height: 100 / @rem * 1rem;
          margin: 0 27 / @rem * 1rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .scan_inputbox {
        width: 100%;
        height: 65 / @rem * 1rem;
        background-color: #ffffff;
        border: solid 2 / @rem * 1rem #5377f2;
        display: flex;
        justify-content: space-between;
        padding: 0 20 / @rem * 1rem;
        align-items: center;
        border-radius: 4 / @rem * 1rem;
        margin-top: 30 / @rem * 1rem;
        input {
          width: 70%;
          height: 100%;
          outline: none;
          border: none;
          background: transparent;
          font-size: 28 / @rem * 1rem;
          font-weight: 500;
          color: #343434;
          line-height: 65 / @rem * 1rem;
        }
        input::-webkit-input-placeholder {
          color: #cecece;
        }
        .iconbox {
          width: 40 / @rem * 1rem;
          height: 40 / @rem * 1rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .onlinepay_cfm {
      cursor: pointer;
      width: 292 / @rem * 1rem;
      height: 70 / @rem * 1rem;
      background: #5377f2;
      box-shadow: 0px 5 / @rem * 1rem 0px 0px #385fe4;
      border-radius: 10 / @rem * 1rem;
      font-size: 24 / @rem * 1rem;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      line-height: 70 / @rem * 1rem;
      margin-top: 60 / @rem * 1rem;
    }

    .cantclk {
      background: #bebfbe;
      box-shadow: none;
      pointer-events: none;
    }

    .sendcode_btn {
      cursor: pointer;
      width: 292 / @rem * 1rem;
      height: 70 / @rem * 1rem;
      background-color: #ff9c00;
      box-shadow: 0px 5 / @rem * 1rem 2 / @rem * 1rem 0px #e78d00;
      border-radius: 10 / @rem * 1rem;
      font-size: 24 / @rem * 1rem;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      line-height: 70 / @rem * 1rem;
      margin-top: 110 / @rem * 1rem;
    }
  }

  .outlinecontent {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    background-color: #ffffff;
    padding: 0 24 / @rem * 1rem;
    .center_container {
      width: 100%;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      max-height: 70vh;
      overflow-y: auto;
      .dashed_content {
        width: 100%;
        min-height: 100 / @rem * 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: dashed 1 / @rem * 1rem #f1f1f1;
        padding: 0 5 / @rem * 1rem;
        .leftlabel {
          font-size: 24 / @rem * 1rem;
          font-weight: bold;
          color: #343434;
        }
        .rightvalue {
          font-size: 34 / @rem * 1rem;
          font-weight: bold;
          color: #ff3434;
          display: flex;
          justify-content: flex-end;
          input {
            width: 100%;
            height: 100%;
            outline: none;
            border: none;
            background: transparent;
            font-size: 28 / @rem * 1rem;
            font-weight: 500;
            color: #343434;
            line-height: 65 / @rem * 1rem;
            text-align: right;
          }
          input::-webkit-input-placeholder {
            color: #cecece;
          }
        }
        .offline-pay-item {
            margin-left: 20 / @rem * 1rem;
            margin-bottom: 20 / @rem * 1rem;
            padding: 4/ @rem * 1rem 14 / @rem * 1rem;
            font-size: 20 / @rem * 1rem;
            font-weight: 500;
            line-height: 28 / @rem * 1rem;;
            border: 1 / @rem * 1rem  solid #9a9a9a;
            border-radius: 6 / @rem * 1rem;
            color: #9a9a9a;
            display: inline-block;
            max-width: 100%;
            &.active {
                color: #fb7492;
                border-color: #fb7492;
            }
        }
      }
      .givechange {
        border: none;
        .leftlabel {
          font-size: 28 / @rem * 1rem;
        }
        .rightvalue {
          font-size: 34 / @rem * 1rem;
          color: #fe9a00;
        }
      }
    }
    .onlinepay_cfm {
      cursor: pointer;
      width: 292 / @rem * 1rem;
      height: 70 / @rem * 1rem;
      background: #fb7492;
      box-shadow: 0px 5 / @rem * 1rem 0px 0px #e15a79;
      border-radius: 10 / @rem * 1rem;
      font-size: 24 / @rem * 1rem;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      line-height: 70 / @rem * 1rem;
      margin-top: 20 / @rem * 1rem;
      margin-bottom: 40 / @rem * 1rem;
    }
  }
}
</style>
