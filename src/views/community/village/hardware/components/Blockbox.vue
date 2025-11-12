<template>
  <div class="BlockBox" :style="'width:' + width + 'rem;height:' + height+'%;'">
    <img class="left_1" src="../../../../../assets/communityimg/hardware_left_1.png">
    <img class="right_1" src="../../../../../assets/communityimg/hardware_right_1.png">
    <img class="left_2" src="../../../../../assets/communityimg/hardware_left_2.png">
    <img class="right_2" src="../../../../../assets/communityimg/hardware_right_2.png">
    <div class="content_box">
      <div class="title_box">
        <div class="title">{{title}}</div>
      </div>
      <slot></slot>
      <slot name="custom"></slot>
    </div>
  </div>
</template>

<script>
  import Rem from '../../../../../utils/rem.js';
  import Vue from 'vue';
  Rem.getrem();
  export default {
    name: 'BlockBox',
    props: {
      width: {
        type: String,
        default: 535 / 192 * 1 + ''
      },
      height: {
        type: String/Number,
        default: 50
      },
      title_icon: {
        type: String,
        default: 'http://www.group.com/v20/public/static/community/images/top_7.png'
      },
      title: {
        type: String,
        default: '环境信息'
      },
    }
  }
</script>

<style lang="less" scoped>
  @rem: 192; //定义页面尺寸

  .BlockBox {
    position: relative;
    background: rgba(2, 54, 177, 0.4);
    border: 1/@rem * 1rem solid rgba(145,169,255,0.4);

    .left_1 {
      position: absolute;
      top: 0;
      left: 0;
    }

    .right_1 {
      position: absolute;
      top: 0;
      right: 0;
    }

    .left_2 {
      position: absolute;
      bottom: 0;
      left: 0;
    }

    .right_2 {
      position: absolute;
      bottom: 0;
      right: 0;
    }

    .content_box {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .title_box {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background-image: url(../../../../../assets/communityimg/hardware_titleHead.png);
      background-repeat: no-repeat;
      background-size: 599/@rem * 1rem 100%;
      background-position-x: center;
      margin-top: -4/@rem * 1rem;
      position: absolute;
      .title {
        font-size: 20/@rem * 1rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: #FFFFFF;
        background: linear-gradient(92deg, #0072FF 0%, #00EAFF 48%, #01AAFF 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-top: 5/@rem * 1rem;
      }
    }
  }
</style>
