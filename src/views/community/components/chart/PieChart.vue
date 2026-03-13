<template>
  <div class="echart-pie" style="width: 100%; height: 100%; position: relative;">
    <div ref="chartRef" style="width: 100%; height: 100%;"></div>

    <div
      v-if="showSingleCenterText"
      class="center-text-layer"
      :style="getCenterTextLayerStyle"
    >
      <div
        v-for="(item, idx) in centerText.text"
        :key="idx"
        class="text-row"
      >
        <span class="text-name" :style="getNameStyle(idx)">
          {{ item.name }}
        </span>
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
          { name: '总预算', value: 0 },
          { name: '总支出', value: 0 }
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
        radius: ['45%', '70%'],
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
    },

    // 新增：是否双环
    doubleRing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chartInstance: null
    }
  },
  computed: {
    getCenterTextLayerStyle() {
      const fontSize = this.centerText.fontSize && this.centerText.fontSize[0]
        ? this.centerText.fontSize[0] + 'px'
        : '16px'
      const color = this.centerText.color && this.centerText.color[0]
        ? this.centerText.color[0]
        : '#8798AD'
      const lineHeight = this.centerText.lineHeight
        ? this.centerText.lineHeight + 'px'
        : '45px'
      return {
        fontSize,
        color,
        lineHeight
      }
    },

    // 双环时不显示中间悬浮文本
    showSingleCenterText() {
      return !this.doubleRing &&
        this.centerText &&
        this.centerText.show &&
        this.centerText.text &&
        this.centerText.text.length
    }
  },
  watch: {
    chartData: { deep: true, handler: 'renderChart' },
    centerText: { deep: true, handler: 'renderChart' },
    pieConfig: { deep: true, handler: 'renderChart' },
    colorList: { deep: true, handler: 'renderChart' },
    doubleRing: { handler: 'renderChart' }
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
    formatValue(value) {
      return Number(value || 0).toFixed(2)
    },

    getNameStyle() {
      const fontSize = this.centerText.fontSize && this.centerText.fontSize[0]
        ? this.centerText.fontSize[0] + 'px'
        : '16px'
      const color = this.centerText.color && this.centerText.color[0]
        ? this.centerText.color[0]
        : '#8798AD'
      const fontWeight = this.centerText.fontWeight && this.centerText.fontWeight[0]
        ? this.centerText.fontWeight[0]
        : 400
      return {
        fontSize,
        color,
        fontWeight
      }
    },

    getValueStyle() {
      const fontSize = this.centerText.fontSize && this.centerText.fontSize[1]
        ? this.centerText.fontSize[1] + 'px'
        : '28px'
      const color = this.centerText.color && this.centerText.color[1]
        ? this.centerText.color[1]
        : '#FFFFFF'
      const fontWeight = this.centerText.fontWeight && this.centerText.fontWeight[1]
        ? this.centerText.fontWeight[1]
        : 700
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

    // 单环 series
    buildSingleSeries(config) {
      const { chartData, title, colorList, label, labelLine } = this
      const { isRing = true, radius = ['45%', '70%'], center = ['50%', '50%'] } = config

      return [
        {
          name: title && title.text ? title.text : '数据统计',
          type: 'pie',
          radius: radius,
          center: center,
          data: chartData,
          color: colorList,
          label: {
            show: label && label.show === true,
            color: (label && label.color) || '#E5E6EB',
            fontSize: (label && label.fontSize) || 11,
            formatter: (label && label.formatter) || '{b}: {d}%',
            position: isRing ? 'outside' : 'inside'
          },
          labelLine: {
            show: isRing && label && label.show === true && labelLine && labelLine.show === true,
            lineStyle: (labelLine && labelLine.lineStyle) || {
              color: '#40516C',
              width: 1,
              type: 'dashed'
            }
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
    },

    // 双环 series
    buildDoubleSeries(config) {
      const { chartData, title, colorList, label, labelLine } = this
      const { isRing = true } = config

      const leftData = chartData.filter(function(_, index) {
        return index % 2 === 0
      })
      const rightData = chartData.filter(function(_, index) {
        return index % 2 !== 0
      })

      return [
        {
          name: (title && title.text ? title.text : '数据统计') + '-左',
          type: 'pie',
          radius: ['42%', '52%'],
          center: ['27%', '50%'],
          data: leftData,
          color: colorList,
          label: {
            show: label && label.show === true,
            color: (label && label.color) || '#E5E6EB',
            fontSize: (label && label.fontSize) || 11,
            formatter: (label && label.formatter) || '{b}: {d}%',
            position: isRing ? 'outside' : 'inside'
          },
          labelLine: {
            show: isRing && label && label.show === true && labelLine && labelLine.show === true,
            lineStyle: (labelLine && labelLine.lineStyle) || {
              color: '#40516C',
              width: 1,
              type: 'dashed'
            }
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
        },
        {
          name: (title && title.text ? title.text : '数据统计') + '-右',
          type: 'pie',
          radius: ['42%', '52%'],
          center: ['73%', '50%'],
          data: rightData,
          color: colorList,
          label: {
            show: label && label.show === true,
            color: (label && label.color) || '#E5E6EB',
            fontSize: (label && label.fontSize) || 11,
            formatter: (label && label.formatter) || '{b}: {d}%',
            position: isRing ? 'outside' : 'inside'
          },
          labelLine: {
            show: isRing && label && label.show === true && labelLine && labelLine.show === true,
            lineStyle: (labelLine && labelLine.lineStyle) || {
              color: '#40516C',
              width: 1,
              type: 'dashed'
            }
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
    },

    renderChart() {
      if (!this.chartInstance) return
      if (!Array.isArray(this.chartData)) return

      const { chartData, title, pieConfig = {}, legend, tooltip } = this

      const option = {
        backgroundColor: 'transparent',
        title: {
          show: title && title.show === true,
          text: (title && title.text) || '数据统计',
          subtext: (title && title.subText) || '',
          left: 'center',
          top: 10,
          textStyle: {
            color: (title && title.color) || '#FFFFFF',
            fontSize: (title && title.fontSize) || 16
          },
          subtextStyle: {
            color: (title && title.subColor) || '#8798AD',
            fontSize: 12
          }
        },
        legend: {
          show: (legend && legend.show === true) && chartData.length > 1,
          top: ['top', 'bottom'].includes(legend && legend.position) ? 15 : 'center',
          left: ['left', 'right'].includes(legend && legend.position) ? 15 : 'center',
          orient: ['top', 'bottom'].includes(legend && legend.position) ? 'horizontal' : 'vertical',
          textStyle: {
            color: (legend && legend.textColor) || '#8798AD',
            fontSize: (legend && legend.fontSize) || 12
          },
          itemWidth: (legend && legend.itemWidth) || 10,
          itemGap: (legend && legend.itemGap) || 12,
          icon: 'circle'
        },
        tooltip: Object.assign({}, tooltip),
        series: this.doubleRing
          ? this.buildDoubleSeries(pieConfig)
          : this.buildSingleSeries(pieConfig)
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
  position: relative;
}

.center-text-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: left;
  z-index: 9999;
  pointer-events: none;
}

.text-row {
  display: block;
  margin: 4px 0;
  white-space: nowrap;
}

.text-name {
  display: inline-block;
}

.text-value {
  display: inline-block;
}
</style>