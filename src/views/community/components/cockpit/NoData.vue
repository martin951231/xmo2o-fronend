<template>
  <div class="nodata">
    <div class="text_1" :style="'color:' + textColor">
      — 暂无数据 —
    </div>
  </div>
</template>

<script>
  import Rem from '../../../../utils/rem.js';
  import Vue from 'vue';
  Rem.getrem();
  export default {
    name: 'NoData',
    props: {
      textColor: {
        type: String,
        default: '#1aebff'
      },
    }
  }
</script>

<style lang="less" scoped>
  @rem: 192; //定义页面尺寸

  .nodata {
    width: 100%;
    height: 88%;
    display: flex;
    align-items: center;
    justify-content: center;

    .text_1 {
      color: #1aebff;
    }
  }
</style>
