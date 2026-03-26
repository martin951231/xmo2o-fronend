<template>
  <div class="dynamic-rose-chart">
    <div class="rose-chart-left">
      <div
        v-if="!hasData"
        class="empty-state"
        :style="{ height: containerHeight }"
      >
        <div class="empty-state-inner">
          <div class="empty-state-icon"></div>
          <div class="empty-state-text">{{ emptyText }}</div>
        </div>
      </div>

      <div
        v-show="hasData"
        ref="chartRef"
        :style="{ width: containerWidth, height: containerHeight }"
        class="chart-inner"
      ></div>
    </div>

    <div class="rose-chart-right">
      <div class="metric-btn-list">
        <div
          v-for="item in metricOptions"
          :key="item.key"
          class="metric-btn-item"
          :class="{ active: currentMetricKey === item.key }"
          @click="handleMetricChange(item)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'DynamicRoseChart',
  props: {
    chartData: {
      type: Array,
      required: true,
      default: () => []
    },

    fieldMap: {
      type: Object,
      default: () => ({
        name: 'village_name'
      })
    },

    metricOptions: {
      type: Array,
      required: true,
      default: () => []
    },

    defaultMetricKey: {
      type: String,
      default: ''
    },

    chartTitle: {
      type: String,
      default: '南丁格尔玫瑰图'
    },

    showTitle: {
      type: Boolean,
      default: true
    },

    showLegend: {
      type: Boolean,
      default: true
    },

    showTooltip: {
      type: Boolean,
      default: true
    },

    emptyText: {
      type: String,
      default: '暂无数据'
    },

    containerWidth: {
      type: String,
      default: '100%'
    },

    containerHeight: {
      type: String,
      default: '100%'
    },

    roseType: {
      type: String,
      default: 'radius'
    },

    radius: {
      type: Array,
      default: () => ['28%', '68%']
    },

    baseStyle: {
      type: Object,
      default: () => ({
        textLight: '#e5eaf5',
        textGray: '#88aaff',
        borderDark: '#0a1929',
        tooltipBorder: '#00f0ff'
      })
    }
  },

  data() {
    return {
      chartInstance: null,
      resizeHandler: null,
      currentMetricKey: '',
      currentMetricLabel: '',
      currentMetricUnit: '',
      techColorLib: [
        '#ff00ff',
        '#00ffff',
        '#ffff00',
        '#ff6600',
        '#8b00ff'
      ]
    }
  },

  computed: {
    currentMetricConfig() {
      return (
        this.metricOptions.find(item => item.key === this.currentMetricKey) || {}
      )
    },

    hasData() {
      if (!Array.isArray(this.chartData) || this.chartData.length === 0) return false
      if (!this.currentMetricKey) return false

      return this.chartData.some(item => {
        const value = Number(item?.[this.currentMetricKey] ?? 0)
        return !Number.isNaN(value) && value > 0
      })
    }
  },

  watch: {
    chartData: {
      deep: true,
      handler() {
        this.handleDataChange()
      }
    },
    metricOptions: {
      deep: true,
      handler(val) {
        if (!val || !val.length) return

        const hasCurrent = val.some(item => item.key === this.currentMetricKey)
        if (!hasCurrent) {
          this.initDefaultMetric()
        }
        this.handleDataChange()
      }
    },
    currentMetricKey() {
      this.handleDataChange()
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initDefaultMetric()
      this.initChartIfNeeded()
      this.resizeHandler = () => {
        if (this.chartInstance && this.hasData) {
          this.chartInstance.resize()
        }
      }
      window.addEventListener('resize', this.resizeHandler)
    })
  },

  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
      this.chartInstance = null
    }
    window.removeEventListener('resize', this.resizeHandler)
  },

  methods: {
    handleDataChange() {
      this.$nextTick(() => {
        if (!this.hasData) {
          if (this.chartInstance) {
            this.chartInstance.clear()
          }
          return
        }

        this.initChartIfNeeded()
        this.renderChart()
      })
    },

    forceRefreshChart() {
      this.$nextTick(() => {
        if (!this.hasData) {
          if (this.chartInstance) {
            this.chartInstance.clear()
          }
          return
        }

        if (!this.chartInstance) {
          this.initChart()
        } else {
          this.renderChart()
          this.chartInstance.resize()
        }
      })
    },

    initDefaultMetric() {
      if (this.defaultMetricKey) {
        const target = this.metricOptions.find(item => item.key === this.defaultMetricKey)
        if (target) {
          this.currentMetricKey = target.key
          this.currentMetricLabel = target.label
          this.currentMetricUnit = target.unit || ''
          return
        }
      }

      if (this.metricOptions.length) {
        this.currentMetricKey = this.metricOptions[0].key
        this.currentMetricLabel = this.metricOptions[0].label
        this.currentMetricUnit = this.metricOptions[0].unit || ''
      }
    },

    initChartIfNeeded() {
      if (!this.hasData) return
      if (!this.$refs.chartRef) return

      if (!this.chartInstance) {
        this.initChart()
      } else {
        this.renderChart()
      }
    },

    initChart() {
      if (!this.$refs.chartRef || !this.hasData) return

      if (this.chartInstance) {
        this.chartInstance.dispose()
      }

      this.chartInstance = echarts.init(this.$refs.chartRef)
      this.renderChart()
    },

    handleMetricChange(item) {
      if (!item || item.key === this.currentMetricKey) return
      this.currentMetricKey = item.key
      this.currentMetricLabel = item.label
      this.currentMetricUnit = item.unit || ''
    },

    renderChart() {
      if (!this.hasData) {
        if (this.chartInstance) this.chartInstance.clear()
        return
      }

      if (!this.chartInstance || !this.$refs.chartRef) return

      const pieData = this.getRoseSeriesData()
      if (!pieData.length) {
        this.chartInstance.clear()
        return
      }

      const option = this.buildOption(pieData)
      this.chartInstance.setOption(option, true)
      this.chartInstance.resize()
    },

    buildOption(pieData) {
      const { baseStyle } = this

      return {
        color: this.techColorLib,
        textStyle: {
          color: baseStyle.textLight
        },
        title: this.showTitle
          ? {
            text: this.chartTitle || this.currentMetricLabel,
            subtext: this.currentMetricLabel,
            left: 'center',
            top: '2%',
            textStyle: {
              color: '#e5eaf5',
              fontSize: 16,
              fontWeight: 600
            },
            subtextStyle: {
              color: '#88aaff',
              fontSize: 12
            }
          }
          : undefined,
        tooltip: this.showTooltip ? this.buildTooltip() : { show: false },
        legend: this.showLegend
          ? {
            orient: 'vertical',
            left: '2%',
            top: 'middle',
            textStyle: {
              color: baseStyle.textGray,
              fontSize: 12
            },
            itemWidth: 10,
            itemHeight: 10,
            icon: 'circle',
            formatter: (name) => {
              const item = pieData.find(v => v.name === name)
              if (!item) return name
              return `${name}  ${item.value}${this.currentMetricUnit}`
            }
          }
          : { show: false },
        series: [
          {
            name: this.currentMetricLabel,
            type: 'pie',
            roseType: this.roseType,
            radius: this.radius,
            center: ['48%', '52%'],
            avoidLabelOverlap: true,
            startAngle: 90,
            minAngle: 8,
            selectedMode: false,
            label: {
              show: true,
              color: baseStyle.textLight,
              fontSize: 12,
              formatter: (params) => {
                return `${params.name}\n${params.value}${this.currentMetricUnit}`
              }
            },
            labelLine: {
              show: true,
              length: 18,
              length2: 16,
              smooth: false,
              lineStyle: {
                color: 'rgba(136,170,255,0.75)',
                width: 1
              }
            },
            itemStyle: {
              borderColor: '#0a1929',
              borderWidth: 2,
              shadowBlur: 12,
              shadowColor: 'rgba(0,0,0,0.25)'
            },
            emphasis: {
              scale: true,
              scaleSize: 8,
              itemStyle: {
                shadowBlur: 22,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(255,255,255,0.25)'
              },
              label: {
                color: '#ffffff',
                fontWeight: 600
              }
            },
            data: pieData
          }
        ]
      }
    },

    buildTooltip() {
      const { baseStyle } = this
      return {
        trigger: 'item',
        backgroundColor: 'rgba(10, 25, 41, 0.95)',
        borderColor: baseStyle.tooltipBorder,
        borderWidth: 2,
        borderRadius: 8,
        textStyle: {
          color: baseStyle.textLight
        },
        formatter: (params) => {
          return `
            <div style="font-weight:bold;color:${params.color};margin-bottom:8px;font-size:14px;">
              ${params.name}
            </div>
            <div style="margin:4px 0;">
              ${this.currentMetricLabel}：
              <span style="color:${params.color};font-weight:600;">
                ${params.value}
              </span>${this.currentMetricUnit}
            </div>
          `
        }
      }
    },

    getRoseSeriesData() {
      const nameField = this.fieldMap.name || 'name'
      const metricKey = this.currentMetricKey

      return this.chartData
        .map((item, index) => {
          const value = Number(item[metricKey] || 0)
          return {
            name: item[nameField] || `数据${index + 1}`,
            value,
            itemStyle: {
              color: this.techColorLib[index % this.techColorLib.length]
            }
          }
        })
        .filter(item => item.value > 0)
    }
  }
}
</script>

<style scoped>
.dynamic-rose-chart {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 8px 10px 6px;
  box-sizing: border-box;
  background-color: transparent;
}

.rose-chart-left {
  flex: 1;
  min-width: 0;
  height: 100%;
  position: relative;
}

.chart-inner {
  width: 100%;
  height: 100%;
  min-height: 260px;
}

.empty-state {
  width: 100%;
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
  color: rgba(192, 207, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  text-align: center;
}

.rose-chart-right {
  width: 130px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
}

.metric-btn-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-btn-item {
  width: 100%;
  padding: 10px 12px;
  box-sizing: border-box;
  text-align: center;
  font-size: 14px;
  color: #88aaff;
  border: 1px solid rgba(30, 64, 175, 0.6);
  border-radius: 8px;
  background: rgba(10, 25, 41, 0.45);
  cursor: pointer;
  user-select: none;
  transition: all 0.25s ease;
}

.metric-btn-item:hover {
  color: #ffffff;
  border-color: #00f0ff;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.28);
  transform: translateY(-1px);
}

.metric-btn-item.active {
  color: #ffffff;
  border-color: #00f0ff;
  background: linear-gradient(
    135deg,
    rgba(0, 240, 255, 0.2),
    rgba(139, 0, 255, 0.18)
  );
  box-shadow: 0 0 16px rgba(0, 240, 255, 0.32);
  font-weight: 600;
}

@media (max-width: 768px) {
  .dynamic-rose-chart {
    padding: 6px;
  }

  .chart-inner,
  .empty-state {
    min-height: 220px;
  }

  .empty-state-icon {
    width: 48px;
    height: 48px;
  }

  .empty-state-text {
    font-size: 13px;
  }

  .rose-chart-right {
    width: 110px;
    margin-left: 8px;
  }

  .metric-btn-item {
    font-size: 13px;
    padding: 8px 10px;
  }
}
</style>