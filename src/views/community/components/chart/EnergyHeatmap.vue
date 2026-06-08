<template>
  <div
    ref="containerRef"
    class="heatmap-container"
    :style="{ width: width, height: height }"
  >
    <!-- 筛选区 -->
    <div class="filter-bar">
      <!-- 分类 -->
      <div class="filter-group">
        <span class="label">分类：</span>
        <div ref="yFilterLine" class="filter-line">
          <span
            v-for="item in visibleYItems"
            :key="`y-${item.realIndex}`"
            class="filter-item"
            :class="{ active: selectedY.includes(item.realIndex) }"
            @click="toggleY(item.realIndex)"
          >
            {{ item.label }}
          </span>
        </div>
      </div>

      <!-- 月份 -->
      <div class="filter-group">
        <span class="label">月份：</span>
        <div ref="xFilterLine" class="filter-line">
          <span
            v-for="item in visibleXItems"
            :key="`x-${item.realIndex}`"
            class="filter-item"
            :class="{ active: selectedX.includes(item.realIndex) }"
            @click="toggleX(item.realIndex)"
          >
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- 图表 -->
    <div ref="chartDom" class="chart"></div>

  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'HeatMapChart',
  props: {
    heatData: {
      type: Array,
      required: true,
      default: () => []
    },
    xAxisData: {
      type: Array,
      required: true,
      default: () => []
    },
    yAxisData: {
      type: Array,
      required: true,
      default: () => []
    },
    unit: {
      type: String,
      default: '元'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    }
  },
  data () {
    return {
      chart: null,
      resizeHandler: null,

      // 当前“可见”的项
      visibleXItems: [],
      visibleYItems: [],

      // 当前“选中”的项（存真实索引）
      selectedX: [],
      selectedY: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.refreshDelayRender()

      this.resizeHandler = () => {
        this.refreshDelayRender(false)
      }

      window.addEventListener('resize', this.resizeHandler)
    })
  },
  beforeUnmount () {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
    window.removeEventListener('resize', this.resizeHandler)
  },
  watch: {
    xAxisData: {
      handler () {
        this.refreshDelayRender(true)
      },
      deep: true
    },
    yAxisData: {
      handler () {
        this.refreshDelayRender(true)
      },
      deep: true
    },
    heatData: {
      handler () {
        this.$nextTick(() => {
          this.initChart()
        })
      },
      deep: true
    }
  },
  methods: {
    /**
     * 弹窗打开后/组件首次显示后调用
     * forceDefaultSelect = true  => 当前可见项全部默认选中
     * forceDefaultSelect = false => 尽量保留之前的选择，只过滤不可见项
     */
    refreshDelayRender (forceDefaultSelect = true) {
      this.$nextTick(() => {
        setTimeout(() => {
          this.calculateVisibleItems(() => {
            this.syncSelectedWithVisible(forceDefaultSelect)
            this.initChart()
          })
        }, 60)
      })
    },

    /**
     * 计算当前一行能显示哪些项
     */
    calculateVisibleItems (callback) {
      if (!this.xAxisData.length || !this.yAxisData.length) {
        this.visibleXItems = []
        this.visibleYItems = []
        callback && callback()
        return
      }

      this.$nextTick(() => {
        const xVisibleIndexes = this.xAxisData.map((_, index) => index)
        const yVisibleIndexes = this.yAxisData.map((_, index) => index)

        this.visibleXItems = xVisibleIndexes.map(i => ({
          label: this.xAxisData[i],
          realIndex: i
        }))

        this.visibleYItems = yVisibleIndexes.map(i => ({
          label: this.yAxisData[i],
          realIndex: i
        }))

        this.$nextTick(() => {
          callback && callback()
        })
      })
    },

    /**
     * 同步选中项和可见项
     * forceDefaultSelect=true：当前可见项全部选中
     * false：尽量保留之前选择，只过滤掉当前不可见项
     */
    syncSelectedWithVisible (forceDefaultSelect = true) {
      const visibleXIndexes = this.visibleXItems.map(item => item.realIndex)
      const visibleYIndexes = this.visibleYItems.map(item => item.realIndex)

      if (forceDefaultSelect) {
        this.selectedX = [...visibleXIndexes]
        this.selectedY = [...visibleYIndexes]
        return
      }

      const nextSelectedX = this.selectedX.filter(i => visibleXIndexes.includes(i))
      const nextSelectedY = this.selectedY.filter(i => visibleYIndexes.includes(i))

      // 如果过滤完一个都没有，就默认全选当前可见项
      this.selectedX = nextSelectedX.length ? nextSelectedX : [...visibleXIndexes]
      this.selectedY = nextSelectedY.length ? nextSelectedY : [...visibleYIndexes]
    },

    toggleX (realIndex) {
      const idx = this.selectedX.indexOf(realIndex)
      if (idx > -1) {
        this.selectedX.splice(idx, 1)
      } else {
        this.selectedX.push(realIndex)
      }
      this.selectedX = [...this.selectedX]
      this.initChart()
    },

    toggleY (realIndex) {
      const idx = this.selectedY.indexOf(realIndex)
      if (idx > -1) {
        this.selectedY.splice(idx, 1)
      } else {
        this.selectedY.push(realIndex)
      }
      this.selectedY = [...this.selectedY]
      this.initChart()
    },

    initChart () {
      if (!this.$refs.chartDom) return

      const visibleXIndexes = this.visibleXItems.map(item => item.realIndex)
      const visibleYIndexes = this.visibleYItems.map(item => item.realIndex)

      const renderXIndexes = visibleXIndexes.filter(i => this.selectedX.includes(i))
      const renderYIndexes = visibleYIndexes.filter(i => this.selectedY.includes(i))

      if (!renderXIndexes.length || !renderYIndexes.length) {
        if (this.chart) {
          this.chart.clear()
        }
        return
      }

      if (this.chart) {
        this.chart.dispose()
      }
      this.chart = echarts.init(this.$refs.chartDom)

      const newXAxis = renderXIndexes.map(i => this.xAxisData[i])
      const newYAxis = renderYIndexes.map(i => this.yAxisData[i])

      const formatData = []
      renderYIndexes.forEach((yIdx, y) => {
        renderXIndexes.forEach((xIdx, x) => {
          const value = Number(this.heatData[yIdx]?.[xIdx]) || 0
          formatData.push([x, y, value])
        })
      })

      const values = formatData.map(v => v[2])
      const min = values.length ? Math.min(...values) : 0
      const max = values.length ? Math.max(...values) : 100

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          confine: true,
          backgroundColor: 'rgba(0,15,30,0.92)',
          borderColor: '#00CFFA',
          borderWidth: 1,
          padding: 8,
          formatter: (params) => {
            if (!params.data) return ''
            const x = params.data[0]
            const y = params.data[1]
            const value = params.data[2]

            return `
              <div style="line-height:1.6">
                <div><b style="color:#8B5CF6">${newYAxis[y]}</b></div>
                <div>${newXAxis[x]}</div>
                <div style="color:#00CFFA">数值：${value} ${this.unit}</div>
              </div>
            `
          }
        },
        visualMap: {
          min,
          max,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: 10,
          textStyle: {
            color: '#fff',
            fontSize: 10
          },
          inRange: {
            color: ['#0F172A', '#022B3A', '#006680', '#00CFFA', '#8B5CF6']
          }
        },
        grid: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 60,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: newXAxis,
          axisLabel: {
            color: '#fff',
            fontSize: 10
          },
          axisLine: {
            lineStyle: {
              color: '#006680'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'category',
          data: newYAxis,
          axisLabel: {
            color: '#fff',
            fontSize: 10
          },
          axisLine: {
            lineStyle: {
              color: '#006680'
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            type: 'heatmap',
            data: formatData,
            itemStyle: {
              borderWidth: 1,
              borderColor: 'rgba(0,207,250,0.2)'
            },
            emphasis: {
              itemStyle: {
                borderColor: '#00CFFA',
                shadowBlur: 6,
                shadowColor: '#00CFFA'
              }
            },
            label: {
              show: false
            }
          }
        ]
      }

      this.chart.setOption(option, true)
      this.chart.resize()
    },

    // 给父组件调用
    renderChart () {
      this.refreshDelayRender(true)
    }
  }
}
</script>

<style scoped>
.heatmap-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.filter-bar {
  padding: 6px 10px;
  font-size: 12px;
  color: #fff;
  box-sizing: border-box;
}

.filter-group {
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 6px;
}

.label {
  flex: 0 0 auto;
  margin-right: 6px;
  line-height: 26px;
  color: #00CFFA;
}

.filter-line {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  overflow: visible;
  white-space: normal;
  gap: 6px;
}

.filter-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  height: 26px;
  line-height: 20px;
  padding: 2px 8px;
  box-sizing: border-box;
  border: 1px solid #006680;
  border-radius: 3px;
  background: transparent;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-item:hover {
  border-color: #00CFFA;
  box-shadow: 0 0 6px rgba(0, 207, 250, 0.25);
}

.filter-item.active {
  background: #00CFFA;
  border-color: #00CFFA;
  color: #000;
}

.chart {
  width: 100%;
  flex: 1;
  min-height: 0;
}

</style>
