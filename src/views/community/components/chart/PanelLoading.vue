<template>
  <transition name="panel-loading-fade">
    <div v-if="visible" class="panel-loading-mask">
      <div class="panel-loading-box">
        <span class="panel-loading-ring"></span>
        <div class="panel-loading-text">{{ text }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PanelLoading',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '数据加载中...'
    }
  }
}
</script>

<style scoped lang="less">
.panel-loading-mask {
  position: absolute;
  inset: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(7, 18, 38, 0.62);
  backdrop-filter: blur(2px);
}

.panel-loading-box {
  width: 100%;
  height: 100%;
  padding: 18px 22px;
  border-radius: 12px;
  background: rgba(8, 26, 56, 0.92);
  border: 1px solid rgba(0, 229, 255, 0.35);
  box-shadow: 0 0 18px rgba(0, 229, 255, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.panel-loading-ring {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 3px solid rgba(0, 229, 255, 0.18);
  border-top-color: #00e5ff;
  animation: panel-loading-spin 0.9s linear infinite;
  display: inline-block;
}

.panel-loading-text {
  margin-top: 12px;
  font-size: 14px;
  color: #dffbff;
  letter-spacing: 1px;
}

@keyframes panel-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.panel-loading-fade-enter-active,
.panel-loading-fade-leave-active {
  transition: opacity 0.2s ease;
}

.panel-loading-fade-enter,
.panel-loading-fade-leave-to {
  opacity: 0;
}
</style>