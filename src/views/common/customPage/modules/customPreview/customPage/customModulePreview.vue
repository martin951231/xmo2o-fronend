<template>
  <div class="cus-mod-box">
    <div class="def-box">
      <p class="def-txt fs-14 text-center text-els">
        <span v-if="content && (content.page_title || content.page_title == 0)">
          {{ content.page_title }}
        </span>
        <span v-else>{{L('此处为自定义模块，可将自定义页面嵌入')}}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: [String, Object],
      default: ''
    }
  }
}
</script>

<style scoped>
.cus-mod-box {
  width: 100%;
  height: 80px;
}
.def-box {
  width: 100%;
  height: 80px;
  background-color: #ebedf0;
}
.def-box .def-txt {
  color: #868889;
  line-height: 80px;
  margin-bottom: 0;
}
</style>
