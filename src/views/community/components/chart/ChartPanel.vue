<template>
  <div class="chart-panel">
    <span class="chart-hover-glow"></span>
    <span class="chart-hover-scan"></span>

    <!-- 四角角标 -->
<!--    <span class="panel-corner corner-tl"></span>-->
<!--    <span class="panel-corner corner-tr"></span>-->
    <span class="panel-corner corner-bl"></span>
    <span class="panel-corner corner-br"></span>

    <slot name="title">
      <charTitle :title-name="title" />
    </slot>

    <div class="chart-panel-body">
      <slot />
    </div>
  </div>
</template>

<script>
import CharTitle from '@/views/community/components/chart/charTitle.vue'

export default {
  name: 'ChartPanel',
  components: { CharTitle },
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="less">
.chart-panel {
  margin: 0;
  min-height: 360px;
  border-radius: 8px;
  position: relative;
  box-sizing: border-box;
  z-index: 1;
  overflow: hidden;

  background: linear-gradient(
    180deg,
    rgba(8, 28, 56, 0.78) 0%,
    rgba(6, 20, 40, 0.88) 100%
  );

  border: 1px solid rgba(0, 195, 254, 0.16);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.02),
    0 6px 20px rgba(0, 0, 0, 0.18);

  backdrop-filter: blur(2px);
  transition:
    transform 0.28s ease,
    box-shadow 0.28s ease,
    border-color 0.28s ease,
    background 0.28s ease;

  /* 顶部左侧横线 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 110px;
    height: 1px;
    background: linear-gradient(90deg, rgba(0, 195, 254, 0.78), transparent);
    pointer-events: none;
    z-index: 2;
    transition: all 0.28s ease;
  }

  /* 右上竖线 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 72px;
    background: linear-gradient(180deg, rgba(0, 195, 254, 0.48), transparent);
    pointer-events: none;
    z-index: 2;
    transition: all 0.28s ease;
  }

  .chart-hover-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.28s ease;
    background:
      radial-gradient(circle at 50% 0%, rgba(0, 195, 254, 0.10), transparent 42%),
      radial-gradient(circle at 100% 100%, rgba(0, 120, 255, 0.08), transparent 38%);
  }

  .chart-hover-scan {
    position: absolute;
    top: 0;
    left: -120%;
    width: 60%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
    opacity: 0;
    transform: skewX(-20deg);
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.03) 30%,
      rgba(0, 195, 254, 0.12) 50%,
      rgba(255, 255, 255, 0.03) 70%,
      transparent 100%
    );
  }

  /* 四角角标 */
  .panel-corner {
    position: absolute;
    width: 18px;
    height: 18px;
    pointer-events: none;
    z-index: 3;
    opacity: 0.42;
    transition:
      opacity 0.28s ease,
      transform 0.28s ease,
      filter 0.28s ease;

    &::before,
    &::after {
      content: '';
      position: absolute;
      background: linear-gradient(90deg, #00cfff, #58f3ff);
      box-shadow:
        0 0 6px rgba(0, 216, 255, 0.30),
        0 0 12px rgba(0, 216, 255, 0.16);
      border-radius: 2px;
    }
  }

  /* 左上角：故意往下移，避开标题图标 */
  .corner-tl {
    top: 8px;
    left: 8px;

    &::before {
      top: 0;
      left: 0;
      width: 14px;
      height: 2px;
    }

    &::after {
      top: 0;
      left: 0;
      width: 2px;
      height: 14px;
    }
  }

  .corner-tr {
    top: 8px;
    right: 8px;

    &::before {
      top: 0;
      right: 0;
      width: 14px;
      height: 2px;
    }

    &::after {
      top: 0;
      right: 0;
      width: 2px;
      height: 14px;
    }
  }

  .corner-bl {
    bottom: 8px;
    left: 8px;

    &::before {
      bottom: 0;
      left: 0;
      width: 14px;
      height: 2px;
    }

    &::after {
      bottom: 0;
      left: 0;
      width: 2px;
      height: 14px;
    }
  }

  .corner-br {
    bottom: 8px;
    right: 8px;

    &::before {
      bottom: 0;
      right: 0;
      width: 14px;
      height: 2px;
    }

    &::after {
      bottom: 0;
      right: 0;
      width: 2px;
      height: 14px;
    }
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 195, 254, 0.38);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.03),
      0 10px 28px rgba(0, 55, 120, 0.22),
      0 0 18px rgba(0, 195, 254, 0.10);

    &::before {
      width: 180px;
      background: linear-gradient(90deg, rgba(0, 225, 255, 0.95), transparent);
    }

    &::after {
      height: 110px;
      background: linear-gradient(180deg, rgba(0, 225, 255, 0.7), transparent);
    }

    .chart-hover-glow {
      opacity: 1;
    }

    .chart-hover-scan {
      opacity: 1;
      animation: chartScanMove 1.4s ease forwards;
    }

    .panel-corner {
      opacity: 1;
      filter: drop-shadow(0 0 6px rgba(0, 216, 255, 0.45));
    }

    .corner-tl {
      transform: translate(-1px, 1px);
    }

    .corner-tr {
      transform: translate(1px, 1px);
    }

    .corner-bl {
      transform: translate(-1px, -1px);
    }

    .corner-br {
      transform: translate(1px, -1px);
    }
  }
}

.chart-panel-body {
  height: calc(100% - 42px);
  min-height: 0;
  position: relative;
  z-index: 3;
}

@keyframes chartScanMove {
  0% {
    left: -120%;
  }
  100% {
    left: 140%;
  }
}
</style>