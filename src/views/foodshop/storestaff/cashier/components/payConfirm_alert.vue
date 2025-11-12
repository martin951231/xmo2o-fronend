<template>
  <div class="payConfirm_alert_wrapper">
    <div class="title_container">
      <div class="title_font">{{ L('支付完成') }}</div>
    </div>
    <div class="alert_content_wrapper">
      <div class="centericonbox"><img src="../../../../../assets/storestaff/scuess.png" alt="" /></div>
      <div class="fonttipsbox">
        {{ L('支付完成') }}
        <span>{{ L('￥') }}{{ price }}</span>
      </div>
      <div class="bottom_btn_wrapper">
        <div class="back_btn" @click="backindex()">{{ L('返回首页') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  data() {
    return {}
  },
  props: {
    price: Number,
    frompage: Number,
  },
  methods: {
    closemodel() {
      this.$emit('closemodel')
    },
    backindex() {
      if (this.frompage == 1) {
        this.$store.commit('changeleftState', 4)
        this.$router.replace({ name: 'diningTable' })
      } else if (this.frompage == 0) {
        this.$router.replace({ name: 'order' })
      } else {
        this.$router.replace({ name: 'orderQuickly' })
      }
    },
  },
}
</script>

<style lang="less" scoped>
@rem: 192; //定义页面尺寸
.payConfirm_alert_wrapper {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  .title_container {
    width: 100%;
    height: 100 / @rem * 1rem;
    background-color: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 40 / @rem * 1rem;
    .title_font {
      font-size: 32 / @rem * 1rem;
      font-weight: bold;
      color: #222222;
    }
    .leftempty_box {
      width: 20 / @rem * 1rem;
      height: 20 / @rem * 1rem;
    }
    .closeicon {
      cursor: pointer;
      width: 20 / @rem * 1rem;
      height: 20 / @rem * 1rem;
      display: flex;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .alert_content_wrapper {
    width: 100%;
    height: 400%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .centericonbox {
      width: 100 / @rem * 1rem;
      height: 100 / @rem * 1rem;
      margin-top: 50 / @rem * 1rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .fonttipsbox {
      font-size: 30 / @rem * 1rem;
      font-weight: bold;
      color: #343434;
      margin-top: 30 / @rem * 1rem;
      span {
        color: #ff6e60;
      }
    }
    .bottom_btn_wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 80 / @rem * 1rem;
      margin-bottom: 40 / @rem * 1rem;
      .seeorder_btn {
        width: 166 / @rem * 1rem;
        height: 60 / @rem * 1rem;
        background: #dedede;
        border-radius: 10 / @rem * 1rem;
        text-align: center;
        line-height: 60 / @rem * 1rem;
        font-size: 24 / @rem * 1rem;
        font-weight: 500;
        color: #666666;
      }
      .back_btn {
        cursor: pointer;
        width: 166 / @rem * 1rem;
        height: 60 / @rem * 1rem;
        background: #00ccb4;
        border-radius: 10 / @rem * 1rem;
        text-align: center;
        line-height: 60 / @rem * 1rem;
        font-size: 24 / @rem * 1rem;
        font-weight: 500;
        color: #ffffff;
        margin-left: 15 / @rem * 1rem;
      }
    }
  }
}
</style>
