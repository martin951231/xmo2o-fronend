<template>
  <div
    class="heatmap-container"
    :style="{ width: width, height: height }"
  >

    <!-- ============ 筛选区 ============ -->
    <div class="filter-bar">

      <!-- 分类筛选（Y轴） -->
      <div class="filter-group">
        <span class="label">分类：</span>
        <span
          v-for="(item,index) in yAxisData"
          :key="index"
          class="filter-item"
          :class="{ active: selectedY.includes(index) }"
          @click="toggleY(index)"
        >
          {{ item }}
        </span>
      </div>

      <!-- 月份筛选（X轴） -->
      <div class="filter-group">
        <span class="label">月份：</span>
        <span
          v-for="(item,index) in xAxisData"
          :key="index"
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
    heatData: {
      type: Array,
      required: true
    },
    xAxisData: {
      type: Array,
      default: () => [
        '1月','2月','3月','4月','5月','6月',
        '7月','8月','9月','10月','11月','12月'
      ]
    },
    yAxisData: {
      type: Array,
      required: true
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
    },
    // 最大行列数（同时限制筛选选中数量）
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
      selectedX: [],
      selectedY: []
    }
  },

  mounted() {
    // 默认全选 + 自动截断选中数量
    this.selectedX = this.limitSelectedCount(this.xAxisData.map((_, i) => i))
    this.selectedY = this.limitSelectedCount(this.yAxisData.map((_, i) => i))
    this.initChart()
    this.resizeHandler = () => {
      this.chart && this.chart.resize()
    }
    window.addEventListener('resize', this.resizeHandler)
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
    window.removeEventListener('resize', this.resizeHandler)
  },

  watch: {
    heatData: { handler() { this.initChart() }, deep: true },
    selectedX() { this.initChart() },
    selectedY() { this.initChart() },
    maxSize() {
      // maxSize变化时，重新截断选中数量
      this.selectedX = this.limitSelectedCount(this.selectedX)
      this.selectedY = this.limitSelectedCount(this.selectedY)
      this.initChart()
    }
  },

  methods: {
    renderChart() {
      // 调用已有的初始化逻辑，实现图表重绘
      this.initChart()
    },
    /* ================== 核心：限制筛选选中数量（最多maxSize个） ================== */
    limitSelectedCount(selectedArr) {
      if (this.maxSize === undefined || this.maxSize < 1) {
        return selectedArr // 不传则不限制
      }
      // 选中数量超过maxSize时，保留前maxSize个
      return selectedArr.slice(0, this.maxSize)
    },

    /* ================== 切换筛选（自动截断选中数量） ================== */
    toggleY(index) {
      const i = this.selectedY.indexOf(index)
      if (i > -1) {
        this.selectedY.splice(i, 1)
      } else {
        this.selectedY.push(index)
        // 新增：添加后自动截断
        this.selectedY = this.limitSelectedCount(this.selectedY)
      }
    },

    toggleX(index) {
      const i = this.selectedX.indexOf(index)
      if (i > -1) {
        this.selectedX.splice(i, 1)
      } else {
        this.selectedX.push(index)
        // 新增：添加后自动截断
        this.selectedX = this.limitSelectedCount(this.selectedX)
      }
    },

    /* ================== 限制行列数（基于筛选+maxSize） ================== */
    limitDataSize(originX, originY) {
      if (this.maxSize === undefined || this.maxSize < 1) {
        return { limitX: originX, limitY: originY }
      }
      // 最多显示 maxSize行 * maxSize列
      const limitX = originX.slice(0, this.maxSize)
      const limitY = originY.slice(0, this.maxSize)
      return { limitX, limitY }
    },

    /* ================== 初始化图表 ================== */
    initChart() {
      if (!this.$refs.chartDom) return
      if (this.chart) {
        this.chart.dispose()
      }
      this.chart = echarts.init(this.$refs.chartDom)

      /* ============ 数据过滤：筛选+数量限制+行列限制 ============ */
      const showX = this.selectedX
      const showY = this.selectedY

      // 应用行列限制
      const { limitX, limitY } = this.limitDataSize(showX, showY)

      const newXAxis = limitX.map(i => this.xAxisData[i])
      const newYAxis = limitY.map(i => this.yAxisData[i])

      const formatData = []
      limitY.forEach((yIdx, y) => {
        limitX.forEach((xIdx, x) => {
          const value = Number(this.heatData[yIdx]?.[xIdx]) || 0
          formatData.push([x, y, value])
        })
      })

      const values = formatData.map(v => v[2])
      const min = values.length ? Math.min(...values) : 0
      const max = values.length ? Math.max(...values) : 100

      /* ============ 图表配置 ============ */
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

      this.chart.setOption(option)
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

/* ============ 筛选栏 ============ */
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

/* ============ 图表 ============ */
.chart {
  width: 100%;
  height: calc(100% - 110px);
}
</style>