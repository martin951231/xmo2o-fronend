<template>
  <!-- 柱状图容器，宽高由父组件控制 -->
  <div ref="chartRef" class="echart-bar-container" :style="{ width: '100%', height: '100%' }"></div>
</template>

<script>
// Vue2 直接引入：import echarts from 'echarts'
// Vue3 需修改为：import * as echarts from 'echarts'
import echarts from 'echarts'
export default {
  name: 'EchartBar',
  props: {
    /********************* 必传核心参数 - 加默认空数组，避免undefined *********************/
    xData: {
      type: Array,
      required: false,
      default: () => [] // 修复点1：加默认空数组
    },
    seriesData: {
      type: Array,
      required: false,
      default: () => [] // 修复点2：加默认空数组
    },

    /********************* 可选配置参数（黑底科技风默认值，传参可覆盖） *********************/
    title: {
      type: Object,
      default: () => ({
        show: false,
        text: '柱状图统计',
        subText: '',
        color: '#00e5ff',
        fontSize: 16,
        subColor: '#66bfff',
        subFontSize: 12
      })
    },
    barConfig: {
      type: Object,
      default: () => ({
        isHorizontal: false,
        barWidth: 30,
        barRadius: [8, 8, 0, 0],
        isStack: false
      })
    },
    xAxis: {
      type: Object,
      default: () => ({
        show: true,
        textColor: '#87e8de',
        fontSize: 12,
        tickShow: true,
        lineShow: true
      })
    },
    yAxis: {
      type: Object,
      default: () => ({
        show: true,
        textColor: '#87e8de',
        fontSize: 12,
        tickShow: true,
        lineShow: true,
        min: 0,
        max: null,
        unit: ''
      })
    },
    legend: {
      type: Object,
      default: () => ({
        show: true,
        position: 'top',
        textColor: '#87e8de',
        fontSize: 12,
        itemGap: 15
      })
    },
    colorList: {
      type: Array,
      default: () => ([
        'linear-gradient(90deg, #00cfff, #0099cc)',
        'linear-gradient(90deg, #667bff, #a26bff)',
        'linear-gradient(90deg, #00f0ff, #9966ff)',
        'linear-gradient(90deg, #00ffd9, #0099cc)',
        'linear-gradient(90deg, #99d1ff, #4a90e2)',
        'linear-gradient(90deg, #00e5ff, #008fb3)',
        'linear-gradient(90deg, #7b52ff, #5734cc)',
        'linear-gradient(90deg, #4056f4, #253599)'
      ])
    },
    tooltip: {
      type: Object,
      default: () => ({
        show: true,
        trigger: 'axis',
        backgroundColor: 'rgba(15, 25, 45, 0.95)',
        textColor: '#00f0ff',
        fontSize: 12,
        padding: [10, 15],
        borderColor: '#00cfff',
        borderWidth: 1,
        borderRadius: 6,
        formatter: '📊 {b}<br/>⚡ {a}：{c}'
      })
    },
    emphasis: {
      type: Object,
      default: () => ({
        show: true,
        shadowBlur: 25,
        shadowColor: 'rgba(0, 255, 255, 0.8)',
        shadowOffsetX: 0,
        shadowOffsetY: 0
      })
    }
  },
  data() {
    return {
      chartInstance: null // ECharts实例
    }
  },
  watch: {
    // 深度监听所有配置和数据，变化即时重绘 - 原有逻辑保留，这是自动重绘的核心
    xData: { deep: true, handler: 'renderChart' },
    seriesData: { deep: true, handler: 'renderChart' },
    title: { deep: true, handler: 'renderChart' },
    barConfig: { deep: true, handler: 'renderChart' },
    xAxis: { deep: true, handler: 'renderChart' },
    yAxis: { deep: true, handler: 'renderChart' },
    legend: { deep: true, handler: 'renderChart' },
    colorList: { deep: true, handler: 'renderChart' }
  },
  mounted() {
    this.initChart() // 初始化实例，不管数据是否就绪
    window.addEventListener('resize', this.resizeChart)
    // 修复点3：mounted后主动触发一次渲染，兼容数据刚好同步就绪的场景
    this.$nextTick(() => this.renderChart())
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
      this.chartInstance = null
    }
    window.removeEventListener('resize', this.resizeChart)
  },
  methods: {
    // 初始化ECharts实例 - 核心修复：移除数据空值判断，只判断容器是否存在
    initChart() {
      if (!this.$refs.chartRef) return // 只判断容器，不判断数据
      // 防止重复实例化
      if (this.chartInstance) return
      // 强制创建ECharts实例，即使数据为空
      this.chartInstance = echarts.init(this.$refs.chartRef)
      this.chartInstance.setOption({ backgroundColor: 'transparent' })
    },

    // 核心：渲染/重绘柱状图 - 修复点4：空数据兜底，实例不存在则先初始化
    renderChart() {
      // 修复点5：如果实例未创建，先执行初始化（兜底）
      if (!this.chartInstance) {
        this.initChart()
        // 初始化后仍无实例，直接返回（容器不存在的极端情况）
        if (!this.chartInstance) return
      }

      const { xData, seriesData, title, barConfig, xAxis, yAxis, legend, colorList, tooltip, emphasis } = this
      // 修复点6：空数据兜底 - 即使xData/seriesData为空，也正常组装配置，ECharts会空渲染不报错
      const validXData = Array.isArray(xData) ? xData : []
      const validSeriesData = Array.isArray(seriesData) ? seriesData : []

      // 组装ECharts完整配置（原有酷炫特效逻辑完全保留，仅替换xData/seriesData为有效值）
      const option = {
        color: colorList,
        backgroundColor: 'transparent',
        title: {
          show: title.show,
          text: title.text,
          subtext: title.subText,
          left: 'center',
          textStyle: {
            color: title.color,
            fontSize: title.fontSize,
            fontWeight: 600,
            textShadowBlur: 15,
            textShadowColor: title.color,
            textShadowOffsetX: 0,
            textShadowOffsetY: 0
          },
          subtextStyle: {
            color: title.subColor,
            fontSize: title.subFontSize,
            textShadowBlur: 10,
            textShadowColor: title.subColor
          }
        },
        legend: {
          show: legend.show && validSeriesData.length > 1, // 用有效值判断
          bottom: 10,
          left: 'center',
          top: 'auto',
          orient: 'horizontal',
          textStyle: {
            color: legend.textColor,
            fontSize: legend.fontSize,
            fontWeight: 500,
            textShadowBlur: 5,
            textShadowColor: '#00cfff'
          },
          padding: [0, 0, 5, 0],
          itemGap: legend.itemGap,
          itemStyle: {
            borderColor: '#00cfff',
            borderWidth: 2,
            shadowBlur: 8,
            shadowColor: 'rgba(0, 255, 255, 0.6)'
          },
          emphasis: {
            textStyle: {
              color: '#00f0ff',
              textShadowBlur: 10,
              textShadowColor: '#00f0ff'
            },
            itemStyle: {
              borderColor: '#00f0ff',
              shadowBlur: 15,
              shadowColor: 'rgba(0, 255, 255, 0.8)'
            }
          }
        },
        tooltip: {
          show: tooltip.show,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            lineStyle: { color: '#00f0ff', width: 2 },
            shadowStyle: { color: 'rgba(0, 255, 255, 0.1)' }
          },
          backgroundColor: tooltip.backgroundColor,
          textStyle: { color: tooltip.textColor, fontSize: tooltip.fontSize },
          padding: tooltip.padding,
          borderColor: tooltip.borderColor,
          borderWidth: 2,
          borderRadius: 8,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 255, 255, 0.5)',
          formatter: function(params) {
            let res = `${params[0]?.name || ''}`;
            params.forEach(item => {
              if (item.value > 0) res += `<br/>${item.seriesName}：${item.value}`;
            });
            return res;
          }
        },
        grid: {
          left: '4%',
          right: '5%',
          bottom: '15%',
          top: title.show ? '12%' : '6%',
          containLabel: true,
          borderColor: 'rgba(0, 180, 255, 0.4)',
          borderWidth: 1.5,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 255, 255, 0.2)'
        },
        // X/Y轴：全部替换为validXData/validSeriesData，避免空值报错
        xAxis: barConfig.isHorizontal ? [
          {
            type: 'value',
            show: yAxis.show,
            name: yAxis.unit,
            nameTextStyle: {
              color: yAxis.textColor,
              fontSize: yAxis.fontSize,
              padding: [0, 0, 0, 5],
              textShadowBlur: 5,
              textShadowColor: yAxis.textColor
            },
            axisLabel: {
              color: yAxis.textColor,
              fontSize: yAxis.fontSize,
              textShadowBlur: 3,
              textShadowColor: yAxis.textColor
            },
            axisTick: { show: yAxis.tickShow, lineStyle: { color: 'rgba(0, 255, 255, 0.5)' } },
            axisLine: { show: yAxis.lineShow, lineStyle: { color: 'rgba(0, 200, 255, 0.6)' } },
            splitLine: {
              show: true,
              lineStyle: { color: 'rgba(0, 150, 255, 0.2)', type: 'dashed', width: 1.2 }
            },
            min: yAxis.min,
            max: yAxis.max
          }
        ] : [
          {
            type: 'category',
            data: validXData, // 用有效值
            show: xAxis.show,
            axisLabel: {
              color: xAxis.textColor,
              fontSize: xAxis.fontSize,
              rotate: validXData.length > 6 ? 45 : 0, // 用有效值判断旋转
              margin: 10,
              textShadowBlur: 3,
              textShadowColor: xAxis.textColor
            },
            axisTick: { show: xAxis.tickShow, lineStyle: { color: 'rgba(0, 255, 255, 0.5)' } },
            axisLine: { show: xAxis.lineShow, lineStyle: { color: 'rgba(0, 200, 255, 0.6)' } }
          }
        ],
        yAxis: barConfig.isHorizontal ? [
          {
            type: 'category',
            data: validXData, // 用有效值
            show: xAxis.show,
            axisLabel: {
              color: xAxis.textColor,
              fontSize: xAxis.fontSize,
              textShadowBlur: 3,
              textShadowColor: xAxis.textColor
            },
            axisTick: { show: xAxis.tickShow, lineStyle: { color: 'rgba(0, 255, 255, 0.5)' } },
            axisLine: { show: xAxis.lineShow, lineStyle: { color: 'rgba(0, 200, 255, 0.6)' } }
          }
        ] : [
          {
            type: 'value',
            show: yAxis.show,
            name: yAxis.unit,
            nameTextStyle: {
              color: yAxis.textColor,
              fontSize: yAxis.fontSize,
              padding: [0, 5, 0, 0],
              textShadowBlur: 5,
              textShadowColor: yAxis.textColor
            },
            axisLabel: {
              color: yAxis.textColor,
              fontSize: yAxis.fontSize,
              textShadowBlur: 3,
              textShadowColor: yAxis.textColor
            },
            axisTick: { show: yAxis.tickShow, lineStyle: { color: 'rgba(0, 255, 255, 0.5)' } },
            axisLine: { show: yAxis.lineShow, lineStyle: { color: 'rgba(0, 200, 255, 0.6)' } },
            splitLine: {
              show: true,
              lineStyle: { color: 'rgba(0, 150, 255, 0.2)', type: 'dashed', width: 1.2 }
            },
            min: yAxis.min,
            max: yAxis.max
          }
        ],
        // 系列配置：用validSeriesData，保留所有发光特效
        series: validSeriesData.map(item => ({
          name: item.name || '',
          type: 'bar',
          barWidth: barConfig.barWidth,
          barRadius: barConfig.barRadius,
          stack: item.stack || '',
          data: Array.isArray(item.data) ? item.data : [], // 数据层兜底
          cursor: 'pointer',
          label: {
            show: true,
            position: 'insideTop',
            color: '#ffffff',
            fontSize: 11,
            fontWeight: 700,
            textBorderColor: ['rgba(0, 255, 255, 1)', 'rgba(0, 100, 255, 0.8)'],
            textBorderWidth: [1, 0.5],
            textShadowBlur: 6,
            textShadowColor: 'rgba(0, 255, 255, 0.8)',
            textShadowOffsetX: 0,
            textShadowOffsetY: 0
          },
          itemStyle: {
            borderColor: 'rgba(0, 255, 255, 0.6)',
            borderWidth: 2,
            color: (params) => colorList[params.seriesIndex % colorList.length],
            shadowBlur: 15,
            shadowColor: 'rgba(0, 255, 255, 0.4)',
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            opacity: 0.95
          },
          emphasis: {
            focus: 'single',
            scale: true,
            scaleSize: 2,
            shadowBlur: emphasis.show ? 40 : 0,
            shadowColor: emphasis.show ? 'rgba(0, 255, 255, 0.9)' : 'transparent',
            shadowOffsetY: -5,
            itemStyle: {
              borderColor: 'rgba(0, 255, 255, 1)',
              borderWidth: 2.5,
              opacity: 1,
              color: (params) => {
                const baseColor = colorList[params.seriesIndex % colorList.length];
                return baseColor.replace('90deg,', '90deg, rgba(0,0,0,0.1),')
              }
            },
            label: {
              textShadowBlur: 10,
              textShadowColor: 'rgba(255, 255, 255, 1)'
            }
          },
          animation: true,
          animationDuration: 1500,
          animationEasing: 'cubicOut',
          animationDelay: (idx) => idx * 50,
          animationFillMode: 'both'
        }))
      }
      // 强制设置配置，清空原有配置，确保渲染最新数据
      this.chartInstance.setOption(option, true)
    },

    // 窗口大小变化，自适应重绘
    resizeChart() {
      this.chartInstance && this.chartInstance.resize()
    }
  }
}
</script>

<style scoped>
.echart-bar-container {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  font-size: 14px;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  overflow: visible !important;
}
</style>