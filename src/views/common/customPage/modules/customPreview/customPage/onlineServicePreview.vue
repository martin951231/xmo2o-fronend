<template>
  <div class="online-service-wrap cr-white">
    <div class="flex align-center online-service-name no-wrap justify-center">
      <img class="store-name-img" src="@/assets/customPage/online_service_icon.png" alt="" />
      <span class="ser-txt">{{ content.txt }}</span>
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
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
.online-service-wrap {
  width: 100%;
  min-height: 22px;
  box-sizing: border-box;
  font-weight: 400;
  line-height: 22px;
}
.online-service-name {
  width: 80px;
  height: 22px;
  border-radius: 40px;
  background: rgb(24,144,255)
}
.store-name-img {
  margin: 0 4px 0 2px;
}
.ser-txt {
  font-size: 12px;
  vertical-align: middle;
}
</style>
