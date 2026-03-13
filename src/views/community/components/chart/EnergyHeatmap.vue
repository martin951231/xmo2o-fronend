<template>
  <div
    class="heatmap-container"
    :style="{ width: width, height: height }"
  >
    <!-- 筛选区 -->
    <div class="filter-bar">
      <!-- 分类筛选（Y轴） -->
      <div class="filter-group">
        <span class="label">分类：</span>
        <span
          v-for="(item,index) in yAxisData"
          :key="`y-${index}`"
          class="filter-item"
          :class="{ active: selectedY.includes(index) }"
          @click="toggleY(index)"
        >
          {{ item }}
        </span>
      </div>

      <!-- 月份筛选（X轴）- 适配2026-02格式 -->
      <div class="filter-group">
        <span class="label">月份：</span>
        <span
          v-for="(item,index) in xAxisData"
          :key="`x-${index}`"
          class="filter-item"
          :class="{ active: selectedX.includes(index) }"
          @click="toggleX(index)"
        >
          {{ item }}
        </span>
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
    heatData: { type: Array, required: true },
    xAxisData: {
      type: Array,
      required: true, // 适配2026-02格式的月份数组（必填）
      default: () => []
    },
    yAxisData: { type: Array, required: true },
    unit: { type: String, default: '元' },
    width: { type: String, default: '100%' },
    height: { type: String, default: '400px' },
    maxSize: {
      type: Number,
      default: undefined,
      validator: val => val === undefined || (Number.isInteger(val) && val >= 1)
    }
  },
  data() {
    return {
      chart: null,
      resizeHandler: null,
      selectedX: [], // 月份选中索引
      selectedY: []  // 分类选中索引
    }
  },
  // 关键：先初始化选中状态，再监听数据变化
  created() {
    // 提前初始化选中逻辑（兜底）
    this.initSelectedStatus()
  },
  mounted() {
    // 核心：$nextTick确保DOM完全渲染后再执行，解决刷新不生效问题
    this.$nextTick(() => {
      // 重新确认选中状态（防止created阶段数据未加载）
      this.initSelectedStatus()
      // 初始化图表
      this.initChart()
      // 监听窗口resize
      this.resizeHandler = () => {
        this.chart && this.chart.resize()
      }
      window.addEventListener('resize', this.resizeHandler)
    })
  },
  // 监听props变化，重新初始化选中状态（防止父组件异步传值）
  watch: {
    xAxisData: { handler() { this.initSelectedStatus(); this.initChart() }, immediate: true },
    yAxisData: { handler() { this.initSelectedStatus(); this.initChart() }, immediate: true },
    heatData: { handler() { this.initChart() }, deep: true },
    selectedX: { handler() { this.initChart() }, immediate: true },
    selectedY: { handler() { this.initChart() }, immediate: true },
    maxSize() {
      this.selectedX = this.limitSelectedCount(this.selectedX, 'month')
      this.selectedY = this.limitSelectedCount(this.selectedY, 'category')
      this.initChart()
    }
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose()
    }
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    // 核心：统一初始化选中状态（解决刷新不生效）
    initSelectedStatus() {
      // 防呆：数据未加载时不执行
      if (!this.xAxisData.length || !this.yAxisData.length) return

      // 1. 月份（X轴）：默认选中最后6个月（适配2026-02格式）
      const xSelectCount = Math.min(6, this.xAxisData.length)
      this.selectedX = Array.from({ length: xSelectCount }, (_, i) => {
        return this.xAxisData.length - xSelectCount + i
      })

      // 2. 分类（Y轴）：默认选中前6个
      const ySelectCount = Math.min(6, this.yAxisData.length)
      this.selectedY = Array.from({ length: ySelectCount }, (_, i) => i)

      // 应用maxSize限制
      this.selectedX = this.limitSelectedCount(this.selectedX, 'month')
      this.selectedY = this.limitSelectedCount(this.selectedY, 'category')

      // 调试日志（可选，验证选中状态）
      // console.log('最终选中月份索引：', this.selectedX)
      // console.log('最终选中分类索引：', this.selectedY)
    },

    // 限制选中数量（区分月份/分类）
    limitSelectedCount(selectedArr, type) {
      if (this.maxSize === undefined || this.maxSize < 1) {
        return selectedArr
      }
      // 月份：保留最后maxSize个；分类：保留前maxSize个
      return type === 'month' ? selectedArr.slice(-this.maxSize) : selectedArr.slice(0, this.maxSize)
    },

    // 切换分类选中
    toggleY(index) {
      const i = this.selectedY.indexOf(index)
      if (i > -1) {
        this.selectedY.splice(i, 1)
      } else {
        this.selectedY.push(index)
        this.selectedY = this.limitSelectedCount(this.selectedY, 'category')
      }
    },

    // 切换月份选中
    toggleX(index) {
      const i = this.selectedX.indexOf(index)
      if (i > -1) {
        this.selectedX.splice(i, 1)
      } else {
        this.selectedX.push(index)
        this.selectedX = this.limitSelectedCount(this.selectedX, 'month')
      }
    },

    // 初始化图表（核心渲染逻辑）
    initChart() {
      // 防呆：DOM/数据未就绪时不执行
      if (!this.$refs.chartDom || !this.xAxisData.length || !this.yAxisData.length) return

      // 销毁旧实例，避免重复渲染
      if (this.chart) {
        this.chart.dispose()
      }
      this.chart = echarts.init(this.$refs.chartDom)

      // 基于选中的索引获取渲染数据
      const newXAxis = this.selectedX.map(i => this.xAxisData[i])
      const newYAxis = this.selectedY.map(i => this.yAxisData[i])

      // 格式化热力图数据
      const formatData = []
      this.selectedY.forEach((yIdx, y) => {
        this.selectedX.forEach((xIdx, x) => {
          const value = Number(this.heatData[yIdx]?.[xIdx]) || 0
          formatData.push([x, y, value])
        })
      })

      // 计算视觉映射的极值
      const values = formatData.map(v => v[2])
      const min = values.length ? Math.min(...values) : 0
      const max = values.length ? Math.max(...values) : 100

      // 图表配置项
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          confine: true,
          backgroundColor: 'rgba(0,15,30,0.9)',
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
          bottom: 15,
          textStyle: { color: '#fff', fontSize: 10 },
          inRange: {
            color: ['#0F172A', '#022B3A', '#006680', '#00CFFA', '#8B5CF6']
          }
        },
        xAxis: {
          type: 'category',
          data: newXAxis,
          axisLabel: { color: '#fff', fontSize: 10 },
          axisLine: { lineStyle: { color: '#006680' } }
        },
        yAxis: {
          type: 'category',
          data: newYAxis,
          axisLabel: { color: '#fff', fontSize: 10 },
          axisLine: { lineStyle: { color: '#006680' } }
        },
        grid: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 65,
          containLabel: true
        },
        series: [
          {
            type: 'heatmap',
            data: formatData,
            itemStyle: { borderWidth: 1, borderColor: 'rgba(0,207,250,0.2)' },
            emphasis: {
              itemStyle: { borderColor: '#00CFFA', shadowBlur: 6, shadowColor: '#00CFFA' }
            }
          }
        ]
      }

      // 强制设置配置项，确保渲染
      this.chart.setOption(option, true)
    },

    // 外部调用的刷新方法（可选）
    renderChart() {
      this.initSelectedStatus()
      this.initChart()
    }
  }
}
</script>

<style scoped>
.heatmap-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

/* 筛选栏样式 */
.filter-bar {
  padding: 6px 10px;
  font-size: 12px;
  color: #fff;
}
.filter-group {
  margin-bottom: 6px;
}
.label {
  margin-right: 6px;
  color: #00CFFA;
}
.filter-item {
  display: inline-block;
  padding: 2px 8px;
  margin-right: 6px;
  margin-bottom: 4px;
  border: 1px solid #006680;
  border-radius: 3px;
  cursor: pointer;
  transition: 0.2s;
}
.filter-item:hover {
  border-color: #00CFFA;
}
.filter-item.active {
  background: #00CFFA;
  color: #000;
  border-color: #00CFFA;
}

/* 图表样式 */
.chart {
  width: 100%;
  height: calc(100% - 110px);
}
</style>