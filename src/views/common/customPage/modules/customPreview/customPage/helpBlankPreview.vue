<template>
  <div>
    <div
      class="blank-height-content"
      :style="{
        height: content.blank_height + 'px'
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
.blank-height-box {
  width: 100%;
  min-height: 10px;
}
</style>
