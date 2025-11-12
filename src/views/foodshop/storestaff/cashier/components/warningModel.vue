<template>
  <div class="payConfirm_alert_wrapper">
    <div class="title_container">
      <div class="title_font">{{ modelTitle }}</div>
      <!-- <div class="closeicon" @click="closemodel()"><img src="../../../../../assets/storestaff/close.png" alt="" /></div> -->
    </div>
    <div class="alert_content_wrapper">
      <div class="centericonbox"><img src="../../../../../assets/storestaff/tips.png" alt="" /></div>
      <div class="fonttipsbox">
        {{ textTips }}
      </div>
      <div class="bottom_btn_wrapper">
        <div class="seeorder_btn" @click="closemodel()">{{ L('取消') }}</div>
        <div class="back_btn" @click="confirm()">{{ L('确定') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    textTips: String,
    modelTitle: String,
  },
  data() {
    return {}
  },
  created() {
    console.log(this.textTips)
  },
  methods: {
    closemodel() {
      this.$emit('closemodel')
    },
    confirm() {
      this.$emit('comfirmfnc')
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
      width: 70 / @rem * 1rem;
      height: 70 / @rem * 1rem;
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
        cursor: pointer;
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
