<template>
  <div class="tech-line-chart-wrap" :style="{ width: chartWidth, height: chartHeight }">
    <div
      v-if="!hasData"
      class="empty-state"
    >
      <div class="empty-state-inner">
        <div class="empty-state-icon"></div>
        <div class="empty-state-text">{{ emptyText }}</div>
      </div>
    </div>

    <div
      v-show="hasData"
      class="tech-line-chart"
      ref="chartRef"
    ></div>
  </div>
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

    // 单轴默认单位
    unit: {
      type: String,
      default: ''
    },

    emptyText: {
      type: String,
      default: '暂无数据'
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
            { offset: 0, color: '#ff5ea8' },
            { offset: 1, color: '#ff7aa2' }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#ffe66d' },
            { offset: 1, color: '#ffb347' }
          ]
        },
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 0,
          colorStops: [
            { offset: 0, color: '#00ff99' },
            { offset: 1, color: '#00cc66' }
          ]
        }
      ]
    },

    // 只保留这个参数
    customLineYAxisList: {
      type: Array,
      default: () => []
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

  computed: {
    hasData() {
      const data = this.chartData || {}
      const xAxis = Array.isArray(data.xAxis) ? data.xAxis : []
      const series = Array.isArray(data.series) ? data.series : []

      if (!xAxis.length) return false
      if (!series.length) return false

      const validSeries = series.filter(item => item && Array.isArray(item.data))
      if (!validSeries.length) return false

      return validSeries.some(item => {
        return item.data.some(val => {
          const num = Number(val)
          return !Number.isNaN(num) && num !== 0
        })
      })
    },

    useMultiYAxis() {
      return Array.isArray(this.customLineYAxisList) && this.customLineYAxisList.length > 0
    },

    normalizedYAxisList() {
      if (!this.useMultiYAxis) {
        return [
          {
            key: 'default',
            name: '',
            unit: this.unit || '',
            position: 'left',
            color: '#ffffff',
            offset: 0,
            min: null,
            max: null,
            splitLine: true
          }
        ]
      }

      return this.customLineYAxisList.map((item, index) => ({
        key: item.key || `yAxis_${index}`,
        name: item.name || '',
        unit: item.unit || '',
        position: item.position === 'right' ? 'right' : 'left',
        color: '#ffffff',
        offset: item.offset !== undefined ? Number(item.offset) : 0,
        min: item.min !== undefined ? item.min : null,
        max: item.max !== undefined ? item.max : null,
        splitLine: item.splitLine !== undefined ? item.splitLine : index === 0
      }))
    }
  },

  watch: {
    chartData: {
      handler(newVal) {
        this.handleDataChange(newVal)
      },
      deep: true
    },
    colorList: {
      handler() {
        this.handleDataChange()
      },
      deep: true
    },
    customLineYAxisList: {
      handler() {
        this.handleDataChange()
      },
      deep: true
    },
    chartTitle() {
      this.handleDataChange()
    },
    unit() {
      this.handleDataChange()
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initChartIfNeeded()
      window.addEventListener('resize', this.handleResize)
    })
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
      this.initChartIfNeeded()
    },

    handleDataChange(newData = this.chartData) {
      this.$nextTick(() => {
        if (!this.hasData) {
          if (this.myChart) {
            this.myChart.clear()
          }
          return
        }

        if (!this.myChart) {
          this.initChart()
        } else {
          this.updateChart(newData)
        }
      })
    },

    initChartIfNeeded() {
      if (!this.hasData) return
      if (!this.$refs.chartRef) return

      if (!this.myChart) {
        this.initChart()
      } else {
        this.updateChart()
      }
    },

    initChart() {
      const chartDom = this.$refs.chartRef
      if (!chartDom || !this.hasData) return

      if (!this.myChart) {
        this.myChart = echarts.init(chartDom)
      }

      const option = this.getChartOption(this.chartData)
      this.myChart.setOption(option, true)
    },

    // 通过 series.name 匹配 customLineYAxisList 里的 name
    getSeriesAxisIndex(seriesName) {
      if (!this.useMultiYAxis) return 0

      const index = this.normalizedYAxisList.findIndex(item => item.name === seriesName)
      return index === -1 ? 0 : index
    },

    formatValueWithUnit(value, unit = '') {
      if (value === null || value === undefined || value === '') return ''
      return unit ? `${value}${unit}` : `${value}`
    },

    formatValueWithoutUnit(value) {
      if (value === null || value === undefined || value === '') return ''
      return `${value}`
    },

    getAxisDisplayName(axisItem) {
      if (!axisItem) return ''
      if (axisItem.name && axisItem.unit) return `${axisItem.name}(${axisItem.unit})`
      if (axisItem.name) return axisItem.name
      if (axisItem.unit) return `(${axisItem.unit})`
      return ''
    },

    getMaxMinMarkPoint(seriesData = [], color) {
      const numberData = (seriesData || [])
        .map(v => Number(v))
        .filter(v => !isNaN(v))

      if (!numberData.length) {
        return { data: [] }
      }

      const max = Math.max(...numberData)
      const nonZeroData = numberData.filter(v => v > 0)
      const min = nonZeroData.length ? Math.min(...nonZeroData) : null
      const markData = []

      if (max > 0) {
        markData.push({
          type: 'max'
        })
      }

      if (min !== null && min !== max) {
        const index = numberData.findIndex(v => v === min)
        if (index !== -1) {
          markData.push({
            coord: [index, min],
            value: min
          })
        }
      }

      return {
        symbol: 'circle',
        symbolSize: 10,
        label: {
          show: true,
          color: '#ffffff',
          fontSize: 14,
          fontWeight: 600,
          formatter: params => this.formatValueWithoutUnit(params.value),
          padding: [4, 8],
          borderRadius: 4
        },
        itemStyle: {
          color
        },
        data: markData
      }
    },

    buildYAxis() {
      return this.normalizedYAxisList.map((axisItem, index) => {
        const isLeft = axisItem.position === 'left'

        return {
          type: 'value',
          name: this.getAxisDisplayName(axisItem),
          position: axisItem.position,
          offset: axisItem.offset,
          min: axisItem.min,
          max: axisItem.max,
          nameLocation: 'end',
          nameRotate: 0,
          nameGap: 18,
          nameTextStyle: {
            color: '#ffffff',
            fontSize: 12,
            align: isLeft ? 'left' : 'right',
            padding: isLeft ? [0, 0, 6, 0] : [0, 0, 6, 0]
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ffffff'
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: '#ffffff'
            },
            length: 8
          },
          axisLabel: {
            color: '#ffffff',
            formatter: value => this.formatValueWithUnit(value, axisItem.unit)
          },
          splitLine: {
            show: !!axisItem.splitLine,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.15)',
              type: 'dashed'
            }
          },
          splitArea: index === 0
            ? {
              show: true,
              areaStyle: {
                color: ['rgba(0, 50, 100, 0.1)', 'rgba(0, 30, 80, 0.05)']
              }
            }
            : {
              show: false
            }
        }
      })
    },

    getChartOption(data = {}) {
      const xAxis = data.xAxis || []
      const series = data.series || []
      const yAxis = this.buildYAxis()

      const rightAxisCount = this.normalizedYAxisList.filter(item => item.position === 'right').length

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
        legend: {
          show: this.showLegend,
          top: '10px',
          right: '10px',
          textStyle: {
            color: '#c0cfff'
          }
        },
        grid: {
          left: '4%',
          right: rightAxisCount > 1 ? '10%' : '6%',
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
          textStyle: {
            color: '#ffffff'
          },
          padding: 10,
          borderRadius: 6,
          formatter: (params) => {
            if (!params || !params.length) return ''

            let html = `${params[0].axisValue}<br/>`

            params.forEach(item => {
              const axisIndex = this.getSeriesAxisIndex(item.seriesName)
              const axisItem = this.normalizedYAxisList[axisIndex] || {}
              const dotColor = typeof item.color === 'string'
                ? item.color
                : (item.color && item.color.colorStops ? item.color.colorStops[0].color : '#00f0ff')

              html += `
                <div style="margin-top: 4px;">
                  <span style="
                    display:inline-block;
                    width:10px;
                    height:10px;
                    border-radius:50%;
                    background:${dotColor};
                    margin-right:6px;
                  "></span>
                  ${item.seriesName}：${this.formatValueWithUnit(item.value, axisItem.unit || '')}
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
              handleStyle: { color: '#00f0ff' },
              textStyle: { color: '#ffffff' }
            }
          ]
          : [],
        xAxis: {
          type: 'category',
          data: xAxis,
          boundaryGap: false,
          axisLine: {
            lineStyle: { color: '#c0cfff' }
          },
          axisTick: {
            lineStyle: { color: '#c0cfff' },
            length: 8
          },
          axisLabel: {
            color: '#c0cfff',
            margin: 10
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.12)',
              type: 'dashed'
            }
          }
        },
        yAxis,
        series: series.map((item, index) => {
          const currentColor = this.colorList[index % this.colorList.length]
          const startColor = currentColor.colorStops[0].color
          const endColor = currentColor.colorStops[1].color
          const yAxisIndex = this.getSeriesAxisIndex(item.name)

          return {
            name: item.name,
            type: 'line',
            yAxisIndex,
            data: item.data || [],
            color: currentColor,
            smooth: true,
            connectNulls: false,
            label: {
              show: false
            },
            markPoint: this.getMaxMinMarkPoint(item.data || [], startColor),
            lineStyle: {
              width: 3,
              shadowBlur: 10,
              shadowColor: startColor
            },
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: startColor,
              shadowBlur: 15,
              shadowColor: startColor
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
                    color: `${startColor}66`
                  },
                  {
                    offset: 1,
                    color: `${endColor}08`
                  }
                ]
              }
            },
            animationDelay: idx => idx * 20
          }
        })
      }
    },

    updateChart(newData = this.chartData) {
      if (!this.myChart || !this.hasData) return
      const newOption = this.getChartOption(newData)
      this.myChart.setOption(newOption, true)
    },

    handleResize() {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        if (this.myChart && this.hasData) {
          this.myChart.resize()
        }
      }, 100)
    }
  }
}
</script>

<style scoped lang="less">
.tech-line-chart-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}

.tech-line-chart {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  padding: 10px;
  box-sizing: border-box;
  will-change: width, height;
}

.empty-state {
  width: 100%;
  height: 100%;
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-sizing: border-box;
  background:
    radial-gradient(circle at center, rgba(34, 195, 255, 0.12) 0%, rgba(34, 195, 255, 0.03) 35%, rgba(0, 0, 0, 0) 70%);
}

.empty-state-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.empty-state-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  position: relative;
  border: 1px solid rgba(34, 195, 255, 0.28);
  box-shadow:
    0 0 0 6px rgba(34, 195, 255, 0.04),
    0 0 20px rgba(34, 195, 255, 0.08) inset;
}

.empty-state-icon::before,
.empty-state-icon::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  background: rgba(34, 195, 255, 0.7);
  transform: translate(-50%, -50%);
  border-radius: 2px;
}

.empty-state-icon::before {
  width: 24px;
  height: 2px;
}

.empty-state-icon::after {
  width: 2px;
  height: 24px;
  opacity: 0.35;
}

.empty-state-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  text-align: center;
}
</style>