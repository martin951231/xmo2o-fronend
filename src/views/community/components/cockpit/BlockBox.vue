<template>
  <div class="BlockBox" :style="'width:' + width + 'rem;height:' + height+'%;'">
    <img class="left_1" src="../../../../assets/communityimg/cockpit_left_1.png">
    <img class="right_1" src="../../../../assets/communityimg/cockpit_right_1.png">
    <img class="left_2" src="../../../../assets/communityimg/cockpit_left_2.png">
    <img class="right_2" src="../../../../assets/communityimg/cockpit_right_2.png">
    <img class="top_1" src="../../../../assets/communityimg/cockpit_top_1.png">
    <div class="dot_1"></div>
    <div class="dot_2"></div>
    <div class="dot_3"></div>
    <div class="dot_4"></div>
    <div class="content_box">
      <div class="title_box">
        <img class="title_icon" :src="title_icon">
        <div class="title">{{title}}</div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import Rem from '../../../../utils/rem.js';
  import Vue from 'vue';
  Rem.getrem();
  export default {
    name: 'BlockBox',
    props: {
      width: {
        type: String,
        default: 386 / 192 * 1 + ''
      },
      height: {
        type: String,
        default: 27.6 + '' 
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
    padding: 6/@rem * 1rem;

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

    .top_1 {
      position: absolute;
      top: -3/@rem * 1rem;
      left: 0;
    }

    .dot_1 {
      width: 4/@rem * 1rem;
      height: 4/@rem * 1rem;
      background: #33C8FF;
      border-radius: 50%;
      position: absolute;
      top: 6/@rem * 1rem;
      left: 6/@rem * 1rem;
    }

    .dot_2 {
      width: 4/@rem * 1rem;
      height: 4/@rem * 1rem;
      background: #33C8FF;
      border-radius: 50%;
      position: absolute;
      top: 6/@rem * 1rem;
      right: 6/@rem * 1rem;
    }

    .dot_3 {
      width: 4/@rem * 1rem;
      height: 4/@rem * 1rem;
      background: #33C8FF;
      border-radius: 50%;
      position: absolute;
      bottom: 6/@rem * 1rem;
      right: 6/@rem * 1rem;
    }

    .dot_4 {
      width: 4/@rem * 1rem;
      height: 4/@rem * 1rem;
      background: #33C8FF;
      border-radius: 50%;
      position: absolute;
      bottom: 5/@rem * 1rem;
      left: 5/@rem * 1rem;
    }

    .content_box {
      width: 100%;
      height: 100%;
      background: rgba(7, 26, 51, 0.6);
      border-style: solid;
      border-width: 1/@rem * 1rem;
      border-image-source: linear-gradient(140deg,
          rgba(30, 67, 122, 1) 0%,
          rgba(71, 184, 255, 1) 12%,
          rgba(8, 58, 83, 1) 32%,
          rgba(71, 184, 255, 1) 47%,
          rgba(19, 60, 95, 1) 70%,
          rgba(71, 184, 255, 1) 87%,
          rgba(30, 67, 122, 1) 100%);
      border-image-slice: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .title_box {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 18/@rem * 1rem;

      .title_icon {
        width: 26/@rem * 1rem;
        height: 26/@rem * 1rem;
        display: block;
      }

      .title {
        font-size: 20/@rem * 1rem;
        font-family: Microsoft JhengHei;
        font-weight: bold;
        color: #FFFFFF;
        margin-left: 11/@rem * 1rem;
      }
    }
  }
</style>
