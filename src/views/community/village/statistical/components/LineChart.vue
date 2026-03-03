<template>
  <!-- 图表容器，科技感圆角+阴影，宽高通过Props自定义 -->
  <div
    class="tech-line-chart"
    :style="{ width: chartWidth, height: chartHeight }"
    ref="chartRef"
  ></div>
</template>

<script>
// ECharts4 无需按需引入，直接全量引入（4.x按需引入逻辑繁琐，全量更适配）
import echarts from 'echarts'

export default {
  name: 'TechLineChart',
  props: {
    // 图表宽高，支持字符串（px/%）
    chartWidth: {
      type: String,
      default: '100%'
    },
    chartHeight: {
      type: String,
      default: '400px'
    },
    // 核心数据：x轴类目 + 系列数据（ECharts4/5通用格式）
    chartData: {
      type: Object,
      required: false,
    },
    // 图表标题
    chartTitle: {
      type: String,
      default: '科技感折线图'
    },
    // 自定义渐变颜色主题
    colorList: {
      type: Array,
      default: () => [
        { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#00f0ff' }, { offset: 1, color: '#0066ff' }] },
        { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#ff00f0' }, { offset: 1, color: '#9900ff' }] },
        { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#ffff00' }, { offset: 1, color: '#ff9900' }] }
      ]
    },
    // 开关配置：图例/tooltip/数据缩放
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
    // 动画配置
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
      myChart: null, // ECharts实例
      resizeTimer: null // 防抖定时器（ECharts4 用window.resize+防抖，替代ResizeObserver更兼容）
    }
  },
  watch: {
    // 深度监听数据变化，动态更新图表
    chartData: {
      handler(newVal) {
        this.updateChart(newVal)
      },
      deep: true
    },
    // 监听颜色、标题变化
    colorList: { handler: 'updateChart', deep: true },
    chartTitle: { handler: 'updateChart' }
  },
  mounted() {
    // 挂载后初始化图表（确保DOM存在）
    this.initChart()
    // 监听窗口缩放，实现自适应（ECharts4 用window.resize+防抖，兼容性更好）
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    // 销毁前释放资源，避免内存泄漏（Vue2 必做）
    if (this.myChart) {
      this.myChart.dispose()
      this.myChart = null
    }
    window.removeEventListener('resize', this.handleResize)
    clearTimeout(this.resizeTimer)
  },
  methods: {
    renderChart() {
      // 调用已有的初始化逻辑，实现图表重绘
      this.initChart()
    },
    // 初始化图表（ECharts4 核心方法，科技感配置全保留）
    initChart() {
      const chartDom = this.$refs.chartRef
      if (!chartDom || this.myChart) return
      // 实例化ECharts（ECharts4 语法：echarts.init）
      this.myChart = echarts.init(chartDom)
      // 设置配置项
      const option = this.getChartOption(this.chartData)
      this.myChart.setOption(option)
    },
    // 生成ECharts4 配置项（和5.x基本一致，动画/样式完全兼容）
    getChartOption(data) {
      const { xAxis, series } = data
      return {
        backgroundColor: 'transparent',
        animation: this.animation,
        animationDuration: this.animationDuration,
        animationEasing: 'cubicOut',
        // 标题：科技感发光效果
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
        // 图例
        legend: {
          show: this.showLegend,
          top: '10px',
          left: 'right',
          textStyle: { color: '#c0cfff' },
          itemHoverStyle: { color: '#ffffff', textShadowBlur: 5 }
        },
        // 网格：科技感阴影
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '80px',
          containLabel: true,
          shadowColor: this.colorList[0].colorStops[1].color,
          shadowBlur: 20,
          shadowOffsetX: 0,
          shadowOffsetY: 0
        },
        // 提示框：科技感半透明样式+虚线指示线
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
          borderRadius: 6
        },
        // 数据缩放：滚轮+滑块
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
        // X轴：科技感发光刻度+虚线分割线
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
        // Y轴：和X轴一致的科技感样式
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#0066ff' } },
          axisTick: { lineStyle: { color: '#00f0ff' }, length: 8 },
          axisLabel: { color: '#c0cfff', formatter: '{value}' },
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
        // 系列数据：折线渐变+数据点脉冲+区域填充
        series: series && series.map((item, index) => ({
          name: item.name,
          type: 'line',
          data: item.data,
          color: this.colorList[index % this.colorList.length],
          label: {
            show: true, // 开启数值显示
            position: 'top', // 堆叠柱专属：每个块内部居中，绝对不重叠
            color: '#ffffff', // 白色主色，黑底清晰
            fontSize: 11, // 适配柱宽，略小一点不拥挤
            fontWeight: 600, // 加粗更醒目
            // 科技风文字描边：防止白色字和渐变柱融合，黑底更清晰
            textBorderColor: 'rgba(0, 255, 255, 0.8)',
            textBorderWidth: 0.8,
            // 可选：轻微阴影，强化科技感
            shadowBlur: 2,
            shadowColor: 'rgba(0, 255, 255, 0.6)'
          },
          // 折线样式
          lineStyle: {
            width: 3,
            shadowBlur: 10,
            shadowColor: this.colorList[index % this.colorList.length].colorStops[0].color
          },
          // 数据点
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: this.colorList[index % this.colorList.length].colorStops[0].color,
            shadowBlur: 15,
            shadowColor: this.colorList[index % this.colorList.length].colorStops[0].color
          },
          // 数据点悬浮脉冲动画
          emphasis: {
            symbol: 'circle',
            symbolSize: 12,
            itemStyle: {
              shadowBlur: 20,
              shadowColor: '#ffffff'
            }
          },
          // 折线下方渐变填充
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${this.colorList[index % this.colorList.length].colorStops[0].color}80` },
                { offset: 1, color: `${this.colorList[index % this.colorList.length].colorStops[1].color}10` }
              ]
            }
          },
          // 折线从左到右渐入动画
          animationDelay: (idx) => idx * 20
        }))
      }
    },
    // 动态更新图表
    updateChart(newData = this.chartData) {
      if (!this.myChart) return
      const newOption = this.getChartOption(newData)
      this.myChart.setOption(newOption, true)
    },
    // 窗口缩放自适应：防抖处理（避免频繁重绘，优化性能）
    handleResize() {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        if (this.myChart) {
          this.myChart.resize() // ECharts4 自带resize方法
        }
      }, 100)
    }
  }
}
</script>

<!-- 样式改为 Less 语法，scoped 保留，科技感样式效果完全不变 -->
<style scoped lang="less">
.tech-line-chart {
  width: 100%;
  border-radius: 12px;
  padding: 10px;
  box-sizing: border-box;
  // 解决容器闪烁问题
  will-change: width, height;
}
</style>