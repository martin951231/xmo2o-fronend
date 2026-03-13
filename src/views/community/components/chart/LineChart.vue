<template>
  <div
    class="tech-line-chart"
    :style="{ width: chartWidth, height: chartHeight }"
    ref="chartRef"
  ></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'TechLineChart',
  props: {
    chartWidth: {
      type: String,
      default: '100%'
    },
    chartHeight: {
      type: String,
      default: '400px'
    },
    chartData: {
      type: Object,
      required: false,
      default: () => ({
        xAxis: [],
        series: []
      })
    },
    chartTitle: {
      type: String,
      default: '科技感折线图'
    },
    // 新增：单位
    unit: {
      type: String,
      default: ''
    },
    colorList: {
      type: Array,
      default: () => [
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#00f0ff' },
            { offset: 1, color: '#0066ff' }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#ff00f0' },
            { offset: 1, color: '#9900ff' }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#ffff00' },
            { offset: 1, color: '#ff9900' }
          ]
        }
      ]
    },
    showLegend: {
      type: Boolean,
      default: true
    },
    showTooltip: {
      type: Boolean,
      default: true
    },
    showDataZoom: {
      type: Boolean,
      default: true
    },
    animation: {
      type: Boolean,
      default: true
    },
    animationDuration: {
      type: Number,
      default: 1500
    }
  },
  data() {
    return {
      myChart: null,
      resizeTimer: null
    }
  },
  watch: {
    chartData: {
      handler(newVal) {
        this.updateChart(newVal)
      },
      deep: true
    },
    colorList: {
      handler() {
        this.updateChart()
      },
      deep: true
    },
    chartTitle() {
      this.updateChart()
    },
    unit() {
      this.updateChart()
    }
  },
  mounted() {
    this.initChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose()
      this.myChart = null
    }
    window.removeEventListener('resize', this.handleResize)
    clearTimeout(this.resizeTimer)
  },
  methods: {
    renderChart() {
      this.initChart()
    },

    initChart() {
      const chartDom = this.$refs.chartRef
      if (!chartDom) return

      if (!this.myChart) {
        this.myChart = echarts.init(chartDom)
      }

      const option = this.getChartOption(this.chartData)
      this.myChart.setOption(option, true)
    },

    // 统一格式化数值 + 单位
    formatValue(value) {
      if (value === null || value === undefined || value === '') return ''
      return this.unit ? `${value}${this.unit}` : `${value}`
    },

    getChartOption(data = {}) {
      const xAxis = data.xAxis || []
      const series = data.series || []

      return {
        backgroundColor: 'transparent',
        animation: this.animation,
        animationDuration: this.animationDuration,
        animationEasing: 'cubicOut',
        title: {
          text: this.chartTitle,
          left: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '500',
            textShadowBlur: 10,
            textShadowColor: this.colorList[0].colorStops[0].color
          }
        },
        // 左上角单位
        graphic: this.unit
          ? [
            {
              type: 'text',
              left: 10,
              top: 35,
              style: {
                text: `（${this.unit}）`,
                fill: '#8fb3ff',
                font: '14px Microsoft YaHei'
              }
            }
          ]
          : [],
        legend: {
          show: this.showLegend,
          top: '10px',
          right: '10px',
          textStyle: { color: '#c0cfff' }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: this.showDataZoom ? '16%' : '8%',
          top: '80px',
          containLabel: true
        },
        tooltip: {
          show: this.showTooltip,
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#00f0ff',
              width: 2,
              type: 'dashed'
            }
          },
          backgroundColor: 'rgba(0, 10, 30, 0.85)',
          borderColor: '#00f0ff',
          borderWidth: 1,
          textStyle: { color: '#ffffff' },
          padding: 10,
          borderRadius: 6,
          formatter: (params) => {
            if (!params || !params.length) return ''

            let html = `${params[0].axisValue}<br/>`
            params.forEach(item => {
              html += `
                <div style="margin-top: 4px;">
                  <span style="
                    display:inline-block;
                    width:10px;
                    height:10px;
                    border-radius:50%;
                    background:${item.color};
                    margin-right:6px;
                  "></span>
                  ${item.seriesName}：${this.formatValue(item.value)}
                </div>
              `
            })
            return html
          }
        },
        dataZoom: this.showDataZoom
          ? [
            { type: 'inside', xAxisIndex: 0 },
            {
              type: 'slider',
              xAxisIndex: 0,
              bottom: '0px',
              backgroundColor: 'rgba(0, 20, 50, 0.3)',
              borderColor: '#0066ff',
              handleStyle: { color: '#00f0ff' }
            }
          ]
          : [],
        xAxis: {
          type: 'category',
          data: xAxis,
          axisLine: { lineStyle: { color: '#0066ff' } },
          axisTick: { lineStyle: { color: '#00f0ff' }, length: 8 },
          axisLabel: { color: '#c0cfff', margin: 10 },
          splitLine: {
            show: true,
            lineStyle: { color: 'rgba(0, 100, 255, 0.2)', type: 'dashed' }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#0066ff' } },
          axisTick: { lineStyle: { color: '#00f0ff' }, length: 8 },
          axisLabel: {
            color: '#c0cfff',
            formatter: '{value}'
          },
          splitLine: {
            show: true,
            lineStyle: { color: 'rgba(0, 100, 255, 0.2)', type: 'dashed' }
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(0, 50, 100, 0.1)', 'rgba(0, 30, 80, 0.05)']
            }
          }
        },
        series: series.map((item, index) => ({
          name: item.name,
          type: 'line',
          data: item.data || [],
          color: this.colorList[index % this.colorList.length],
          label: {
            show: true,
            position: 'top',
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 600,
            formatter: (params) => {
              const value = Number(params.value || 0)
              if (value === 0) return ''
              return this.formatValue(value)
            }
          },
          lineStyle: {
            width: 3,
            shadowBlur: 10,
            shadowColor:
            this.colorList[index % this.colorList.length].colorStops[0].color
          },
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: this.colorList[index % this.colorList.length].colorStops[0].color,
            shadowBlur: 15,
            shadowColor:
            this.colorList[index % this.colorList.length].colorStops[0].color
          },
          emphasis: {
            symbol: 'circle',
            symbolSize: 12,
            itemStyle: {
              shadowBlur: 20,
              shadowColor: '#ffffff'
            }
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: `${this.colorList[index % this.colorList.length].colorStops[0].color}80`
                },
                {
                  offset: 1,
                  color: `${this.colorList[index % this.colorList.length].colorStops[1].color}10`
                }
              ]
            }
          },
          animationDelay: idx => idx * 20
        }))
      }
    },

    updateChart(newData = this.chartData) {
      if (!this.myChart) return
      const newOption = this.getChartOption(newData)
      this.myChart.setOption(newOption, true)
    },

    handleResize() {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        if (this.myChart) {
          this.myChart.resize()
        }
      }, 100)
    }
  }
}
</script>

<style scoped lang="less">
.tech-line-chart {
  width: 100%;
  border-radius: 12px;
  padding: 10px;
  box-sizing: border-box;
  will-change: width, height;
}
</style>