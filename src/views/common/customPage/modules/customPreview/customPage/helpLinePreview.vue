<template>
  <div class="line-box">
    <div
      class="assist-line"
      :style="{
        'border-bottom':
          content.aux_line_style == 'solid'
            ? '1px solid ' + content.aux_line_color
            : '1px dashed' + content.aux_line_color,
        margin: content.left_right_margin == 'noMargin' ? '' : '0 30px'
      }"
    ></div>
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
.line-box {
  width: 100%;
  height: 30px;
  box-sizing: border-box;
}
.line-box .assist-line {
  height: 20px;
}
</style>
