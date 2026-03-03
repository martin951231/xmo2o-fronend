<template>
  <div class="echart-pie" style="width: 100%; height: 100%; position: relative;">
    <!-- 图表容器 -->
    <div ref="chartRef" style="width: 100%; height: 100%;"></div>

    <!-- 悬浮中心文本层（移除模板里的可选链，改用Vue2兼容写法） -->
    <div
      v-if="centerText.show && centerText.text && centerText.text.length"
      class="center-text-layer"
      :style="getCenterTextLayerStyle"
    >
      <div
        v-for="(item, idx) in centerText.text"
        :key="idx"
        class="text-row"
      >
        <!-- 名称 -->
        <span class="text-name" :style="getNameStyle(idx)">
          {{ item.name }}
        </span>
        <!-- 数值 -->
        <span class="text-value" :style="getValueStyle(idx)">
          {{ item.value }}(万元)
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'EchartPie',
  props: {
    chartData: {
      type: Array,
      required: true,
      default: () => []
    },
    centerText: {
      type: Object,
      default: () => ({
        show: true,
        text: [
          { name:'总预算',value:0 },
          { name:'总支出',value:0 }
        ],
        fontSize: [16, 28],
        color: ['#8798AD', '#FFFFFF'],
        lineHeight: 45,
        fontWeight: [400, 700]
      })
    },
    title: {
      type: Object,
      default: () => ({
        show: false,
        text: '数据统计',
        color: '#FFFFFF',
        fontSize: 16,
        subText: '',
        subColor: '#8798AD'
      })
    },
    pieConfig: {
      type: Object,
      default: () => ({
        isRing: true,
        radius: ['45%', '70%'], // 父组件传参控制圆环直径
        center: ['50%', '50%']
      })
    },
    legend: {
      type: Object,
      default: () => ({
        show: true,
        position: 'right',
        textColor: '#8798AD',
        fontSize: 12,
        itemWidth: 10,
        itemGap: 12
      })
    },
    label: {
      type: Object,
      default: () => ({
        show: true,
        color: '#E5E6EB',
        fontSize: 11,
        formatter: '{b}: {d}%'
      })
    },
    labelLine: {
      type: Object,
      default: () => ({
        show: true,
        lineStyle: {
          color: '#40516C',
          width: 1,
          type: 'dashed'
        }
      })
    },
    colorList: {
      type: Array,
      default: () => ([
        '#165DFF', '#36CFC9', '#722ED1', '#0FC6C2', '#2ECC71', '#FF6B35'
      ])
    },
    tooltip: {
      type: Object,
      default: () => ({
        show: true,
        backgroundColor: 'rgba(17, 25, 40, 0.9)',
        borderColor: '#40516C',
        borderWidth: 1,
        textStyle: { color: '#E5E6EB', fontSize: 12 }
      })
    }
  },
  data() {
    return {
      chartInstance: null
    }
  },
  // 计算属性：封装样式（避免模板里写复杂逻辑，兼容Vue2）
  computed: {
    // 文本层基础样式
    getCenterTextLayerStyle() {
      const fontSize = this.centerText.fontSize && this.centerText.fontSize[0] ? this.centerText.fontSize[0] + 'px' : '16px'
      const color = this.centerText.color && this.centerText.color[0] ? this.centerText.color[0] : '#8798AD'
      const lineHeight = this.centerText.lineHeight ? this.centerText.lineHeight + 'px' : '45px'
      return {
        fontSize,
        color,
        lineHeight
      }
    }
  },
  watch: {
    chartData: { deep: true, handler: 'renderChart' },
    centerText: { deep: true, handler: 'renderChart' },
    pieConfig: { deep: true, handler: 'renderChart' },
    colorList: { deep: true, handler: 'renderChart' }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
      window.addEventListener('resize', this.resizeChart)
    })
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
      this.chartInstance = null
    }
    window.removeEventListener('resize', this.resizeChart)
  },
  methods: {
    // 格式化数值（抽离方法，避免模板里写逻辑）
    formatValue(value) {
      return Number(value || 0).toFixed(2)
    },
    // 获取名称样式（兼容Vue2，无可选链）
    getNameStyle(idx) {
      const fontSize = this.centerText.fontSize && this.centerText.fontSize[0] ? this.centerText.fontSize[0] + 'px' : '16px'
      const color = this.centerText.color && this.centerText.color[0] ? this.centerText.color[0] : '#8798AD'
      const fontWeight = this.centerText.fontWeight && this.centerText.fontWeight[0] ? this.centerText.fontWeight[0] : 400
      return {
        fontSize,
        color,
        fontWeight
      }
    },
    // 获取数值样式（兼容Vue2，无可选链）
    getValueStyle(idx) {
      const fontSize = this.centerText.fontSize && this.centerText.fontSize[1] ? this.centerText.fontSize[1] + 'px' : '28px'
      const color = this.centerText.color && this.centerText.color[1] ? this.centerText.color[1] : '#FFFFFF'
      const fontWeight = this.centerText.fontWeight && this.centerText.fontWeight[1] ? this.centerText.fontWeight[1] : 700
      return {
        fontSize,
        color,
        fontWeight,
        marginLeft: '8px'
      }
    },
    initChart() {
      const container = this.$refs.chartRef
      if (!container) return
      if (this.chartInstance) this.chartInstance.dispose()
      this.chartInstance = echarts.init(container)
      this.renderChart()
    },
    renderChart() {
      if (!this.chartInstance) return
      if (!Array.isArray(this.chartData)) return

      const { chartData, title, pieConfig = {}, legend, label, labelLine, colorList, tooltip } = this
      const { isRing = true, radius = ['45%', '70%'], center = ['50%', '50%'] } = pieConfig

      const series = [
        {
          name: title?.text || '数据统计',
          type: 'pie',
          radius: radius, // 圆环直径由父组件传参控制
          center: center,
          data: chartData,
          color: colorList,
          label: {
            show: label?.show === true,
            color: label?.color || '#E5E6EB',
            fontSize: label?.fontSize || 11,
            formatter: label?.formatter || '{b}: {d}%',
            position: isRing ? 'outside' : 'inside'
          },
          labelLine: {
            show: isRing && label?.show === true && labelLine?.show === true,
            lineStyle: labelLine?.lineStyle || { color: '#40516C', width: 1, type: 'dashed' }
          },
          itemStyle: {
            borderWidth: 1.5,
            borderColor: 'rgba(255, 255, 255, 0.15)'
          },
          emphasis: {
            focus: 'self',
            scale: true,
            scaleSize: 8,
            shadowBlur: 0
          }
        }
      ]

      const option = {
        backgroundColor: 'transparent',
        title: {
          show: title?.show === true,
          text: title?.text || '数据统计',
          subtext: title?.subText || '',
          left: 'center',
          top: 10,
          textStyle: { color: title?.color || '#FFFFFF', fontSize: title?.fontSize || 16 },
          subtextStyle: { color: title?.subColor || '#8798AD', fontSize: 12 }
        },
        legend: {
          show: (legend?.show === true) && chartData.length > 1,
          [legend?.position || 'right']: 15,
          top: ['top', 'bottom'].includes(legend?.position) ? 15 : 'center',
          left: ['left', 'right'].includes(legend?.position) ? 15 : 'center',
          orient: ['top', 'bottom'].includes(legend?.position) ? 'horizontal' : 'vertical',
          textStyle: { color: legend?.textColor || '#8798AD', fontSize: legend?.fontSize || 12 },
          itemWidth: legend?.itemWidth || 10,
          itemGap: legend?.itemGap || 12,
          icon: 'circle'
        },
        tooltip: { ...tooltip },
        series: series
      }

      this.chartInstance.clear()
      this.chartInstance.setOption(option, true)
    },
    resizeChart() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    }
  }
}
</script>

<style scoped>
.echart-pie {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  background: transparent;
  min-height: 300px;
  position: relative; /* 必须：作为子元素绝对定位的参考 */
}

/* 悬浮中心文本层：绝对定位到图表正中心 */
.center-text-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 精准居中 */
  text-align: left;
  z-index: 9999; /* 最高层级，确保在图表上方 */
  pointer-events: none; /* 关键：不遮挡图表的鼠标交互 */
}

/* 每行文字：分行显示，间距可控 */
.text-row {
  display: block; /* 强制每行独占一行 */
  margin: 4px 0; /* 行间距，避免重叠 */
  white-space: nowrap; /* 防止文字折行 */
}

/* 名称和数值样式分离 */
.text-name {
  display: inline-block;
}

.text-value {
  display: inline-block;
}
</style>