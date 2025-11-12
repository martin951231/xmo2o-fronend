<template>
    <!-- 公告 -->
    <div
    v-if="content"
    class="notice-wrap flex align-center"
    :style="{
        'background-color':content.bg_color
      }"
    >
      <img class="mr-10" src="@/assets/customPage/shopNoticeIcon.png" alt="" />
      <span class="flex-1 no-wrap"
      :style="{
        color:content.font_color
      }"
      >
        {{ content.noticeTxt || L('请填写内容，如果过长，将会在手机上滚动显示') }}
      </span>
    </div>
</template>

<script>
export default {
  props: {
    content: {
      type: [String, Object],
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
.notice-wrap {
  padding: 0 10px;
  width: 100%;
  height: 40px;
  background: #fff8e9;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 400;
  color: #717171;
}
</style>
