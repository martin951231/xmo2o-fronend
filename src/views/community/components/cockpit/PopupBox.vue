<template>
  <div class="fixed_box" v-if="isshow">
    <div class="popup_box">
      <div class="header">
        <div class="flex_box_1">
          <img class="img_1" src="../../../../assets/communityimg/cockpit_popupicon.png" alt="">
          <div class="text_1">{{title}}</div>
        </div>
        <img @click="close" class="close_img" src="../../../../assets/communityimg/cockpit_close.png" alt="">
      </div>
      <slot></slot>
      <div class="bottom_btn" v-if="isShowBottom">
        <div class="btn_text" @click="close">
          关闭
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Rem from '../../../../utils/rem.js';
  import Vue from 'vue';
  Rem.getrem();
  export default {
    name: 'PopupBox',
    props: {
      title: {
        type: String,
        default: '标题'
      },
      isShowBottom: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        isshow: false
      }
    },
    methods: {
      close() {
        this.isshow = false
      },
      open() {
        this.isshow = true
      },
    },
  }
</script>

<style lang="less" scoped>
  @rem: 192; //定义页面尺寸

  .fixed_box {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    z-index: 999;

    .popup_box {
      width: 891/@rem * 1rem;
      background: #0B4071;
      border-radius: 8/@rem * 1rem;

      .header {
        width: 100%;
        height: 80/@rem * 1rem;
        background-image: url(../../../../assets/communityimg/cockpit_popupbg.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 15/@rem * 1rem;

        .flex_box_1 {
          display: flex;
          flex-direction: row;
          align-items: center;

          .img_1 {}

          .text_1 {
            font-size: 22/@rem * 1rem;
            font-family: SimHei;
            font-weight: bold;
            color: #FFFFFF;
            margin-left: 15/@rem * 1rem;
          }
        }

        .close_img {}
      }
      .bottom_btn{
        height: 60px;
        width: 100%;
        display: flex;
        justify-content: center;
        .btn_text{
          width: 100px;
          height: 30px;
          padding:0 3px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          background-color: orangered;
          border-radius: 15px;
          cursor: pointer;
          font-size: 15px;
        }
      }
    }
  }
</style>
