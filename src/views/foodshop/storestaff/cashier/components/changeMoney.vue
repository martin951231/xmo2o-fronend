<template>
  <div class="change_diners_wrapper">
    <div class="title_container">
      <div class="emptybox"></div>
      <div class="paytitle_content">
        <div class="title_font" v-if="type === 'cantdisc'">{{ L('不可优惠金额') }}</div>
        <div class="title_font" v-else-if="type === 'needpay'">{{ L('应付金额') }}</div>
        <div class="title_font" v-else>{{ L('会员卡抵扣') }}</div>
      </div>
      <div class="closeicon" @click="closemodel()"><img src="../../../../../assets/storestaff/close.png" alt="" /></div>
    </div>

    <div class="outlinecontent">
      <div class="center_container">
        <div class="collect_yet dashed_content" v-if="type === 'cantdisc'">
          <div class="leftlabel">{{ L('不可优惠金额') }}</div>
          <div class="rightvalue">
            <input
              type="text"
              v-model="cantdisc"
              onkeyup="value=value.replace(/[^\d\.]/g,'')"
              :placeholder="L('请输入修改的金额')"
            />
          </div>
        </div>
        <div v-else-if="type === 'needpay'">
          <div class="collect_yet dashed_content">
            <div class="leftlabel">{{ L('当前值') }}</div>
            <div class="rightvalue">{{ modelInfo.needpay_price }}</div>
          </div>
          <div class="collect_yet dashed_content">
            <div class="leftlabel">{{ L('修改值') }}</div>
            <div class="rightvalue">
              <input
                type="text"
                v-model="needpay"
                onkeyup="value=value.replace(/[^\d\.]/g,'')"
                :placeholder="L('请输入修改的金额')"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <div class="collect_yet dashed_content">
            <div class="leftlabel">{{ L('当前值') }}</div>
            <div class="rightvalue">{{ nowvipMoney }}</div>
          </div>
          <div class="collect_yet dashed_content">
            <div class="leftlabel">{{ L('修改值') }}</div>
            <div class="rightvalue">
              <input
                type="text"
                v-model="vipNum"
                onkeyup="value=value.replace(/[^\d\.]/g,'')"
                :placeholder="L('请输入修改的金额')"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="onlinepay_cfm" @click="confirmchange()">{{ L('确认修改') }}</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    modelInfo: Object,
    type: String,
    nowvipMoney: Number,
  },
  data() {
    return {
      cantdisc: '',
      needpay: '',
      vipNum: '',
    }
  },
  created() {
    console.log(this.modelInfo)
  },
  methods: {
    confirmchange() {
      let info = {
        type: this.type,
      }
      if (this.type == 'cantdisc') {
        if (this.cantdisc.substr(this.cantdisc.length - 1, 1) == '-') {
          this.cantdisc = this.cantdisc.substring(0, this.cantdisc.length - 1)
        }
        if (this.cantdisc == '') {
          this.$message.warning(this.L('您还没有输入金额') + '~')
        } else {
          info.numinfo = Number(this.cantdisc).toFixed(2)
          this.$emit('saveMoneynum', info)
        }
      } else if (this.type == 'needpay') {
        if (this.needpay.substr(this.needpay.length - 1, 1) == '-') {
          this.needpay = this.needpay.substring(0, this.needpay.length - 1)
        }
        if (this.needpay == '') {
          this.$message.warning(this.L('您还没有输入金额') + '~')
        } else {
          info.numinfo = Number(this.needpay).toFixed(2)
          this.$emit('saveMoneynum', info)
        }
      } else {
        if (this.vipNum.substr(this.vipNum.length - 1, 1) == '-') {
          this.vipNum = this.vipNum.substring(0, this.vipNum.length - 1)
        }
        if (this.vipNum == '') {
          this.$message.warning(this.L('您还没有输入金额') + '~')
        } else {
          info.numinfo = Number(this.vipNum).toFixed(2)
          this.$emit('saveMoneynum', info)
        }
      }
    },
    closemodel() {
      this.$emit('closemodel')
    },
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
    .closeicon {
      width: 26 / @rem * 1rem;
      height: 26 / @rem * 1rem;
      display: flex;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .emptybox {
      width: 26 / @rem * 1rem;
      height: 26 / @rem * 1rem;
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
      .dashed_content {
        width: 100%;
        height: 100 / @rem * 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: dashed 1 / @rem * 1rem #f1f1f1;
        padding: 0 5 / @rem * 1rem;
        .leftlabel {
          white-space: nowrap;
          font-size: 24 / @rem * 1rem;
          font-weight: bold;
          color: #343434;
        }
        .rightvalue {
          width: 100%;
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
      width: 292 / @rem * 1rem;
      height: 70 / @rem * 1rem;
      background: #00ccb4;
      border-radius: 10 / @rem * 1rem;
      font-size: 24 / @rem * 1rem;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      line-height: 70 / @rem * 1rem;
      margin-top: 20 / @rem * 1rem;
      margin-bottom: 20 / @rem * 1rem;
    }
  }
}
</style>
