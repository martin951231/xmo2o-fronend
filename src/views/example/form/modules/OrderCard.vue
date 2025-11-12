<template>
  <a-card>
    <!-- 卡片头部 -->
    <section class="header">
      <div class="order-no">{{content.order_no}}</div>
    </section>
  </a-card>
</template>
<script>
export default {
  name: 'OrderCardFoodshop',
  props: {
    content: {
      type: Object,
      default: function() {
        return {}
      }
    }
  }
}
</script>
<style lang="less" scoped>
.header {
  padding: 10px;
  height: 50px;
  background: #1890ff10;
}
</style>