/**
*******************
*   @author 郑亚莉
*   @date 2020-04-30
*   @description 带问号的tooltip
*******************
*/
<template>
  <div class="tooltip">
    <a-tooltip>
      <template slot="title">
      <a v-if="link" class="link" :href="link" target="_blank">{{ text }}</a>
      <span v-else>{{ text }}</span> 
      </template>
      <!-- 问号 -->
      <a-icon v-if="type == 'question'" :style="'font-size:'+ size+';color:'+ color" type="question-circle" theme="filled" />
      <!-- 感叹号 -->
      <a-icon v-if="type == 'notice'" :style="'font-size:'+ size+';color:'+ color"  type="exclamation-circle" theme="filled"/>
      <!-- 加号 -->
      <a-icon v-if="type == 'plus'" theme="filled" type="plus-circle"  :style="'font-size:'+ size+';color:'+ color"/>
      <!-- 减号 -->
      <a-icon v-if="type == 'minus'" theme="filled" type="minus-circle" :style="'font-size:'+ size+';color:'+ color"/>
      <!-- 错号 -->
      <a-icon v-if="type == 'wrong'" theme="filled" type="close-circle" :style="'font-size:'+ size+';color:'+ color"/>
      <!-- 信息 -->
      <a-icon v-if="type == 'info'" theme="filled" type="info-circle" :style="'font-size:'+ size+';color:'+ color"/>
      <!-- 对号 -->
      <a-icon v-if="type == 'right'" theme="filled" type="check-circle" :style="'font-size:'+ size+';color:'+ color"/>
    </a-tooltip>
  </div>
</template>

<script>
export default {
  name: 'CustomTooltip',
  props: {
    /* 
    question: 问号
    notice: 感叹号
    plus: 加号
    minus: 减号
    wrong: 错号
    info: 信息
    right: 对号
    */
    type: {
      type: String,
      default: 'question'
    },
    text: {
      type: String,
      default: '默认文字提示'
    },
    size: {
      type: String,
      default: '16px',
    },
    color: {
      type: String,
      default: '#c5c5c5'
    },
    link: {
      type: String,
      default: ''
    },
  },
  methods:{
    toUrl() {

    }
  }
}
</script>

<style scoped>
.tooltip {
  display: inline-block;
  margin: 0 10px;
}
.link {
  color: #ffffff;
}
</style>
