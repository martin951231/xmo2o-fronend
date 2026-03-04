<template>
  <div class="dynamic-echart-chart" style="width: 100%;height: 100%;">
    <div
      :style="{ width: containerWidth, height: containerHeight }"
      ref="chartRef"
    ></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'DynamicEchartChart',
  props: {
    // 保持原有props不变...
    chartData: { type: Array, required: true },
    fieldMap: { type: Object, required: true, validator: val => !!val.xAxis },
    yAxisList: {
      type: Array,
      required: true,
      validator: val => val.length >= 1 && val.every(item => !!item.key)
    },
    seriesList: {
      type: Array,
      required: true,
      validator: val => val.length >= 1 && val.every(item => !!item.key && !!item.type && !!item.yAxisKey && !!item.field)
    },
    chartTitle: { type: String, default: '数据统计' },
    showTitle: { type: Boolean, default: true },
    titleColor: { type: String, default: '#00f0ff' },
    standardLine: {
      type: Object,
      default: () => ({
        show: false,
        value: 80,
        name: '达标线',
        label: '达标线(80%)',
        color: 'rgba(255,215,0,0.6)'
      })
    },
    showLegend: { type: Boolean, default: true },
    showTooltip: { type: Boolean, default: true },
    containerWidth: { type: String, default: '100%' },
    containerHeight: { type: String, default: '100%' },
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
      techColorLib: [
        '#ff00ff',  // 洋红霓虹
        '#00ffff',  // 青色霓虹
        '#ffff00',  // 亮黄霓虹
        '#ff6600',  // 橙红霓虹
        '#8b00ff'   // 紫色霓虹
      ],
      // 深空冷色调备份（注释保留）
      // techColorLib: [
      //   '#4cc9f0', '#4361ee', '#3a0ca3', '#7209b7', '#f72585'
      // ],
    };
  },
  watch: {
    chartData: { deep: true, handler: 'renderChart' },
    fieldMap: { deep: true, handler: 'renderChart' },
    yAxisList: { deep: true, handler: 'renderChart' },
    seriesList: { deep: true, handler: 'renderChart' },
    standardLine: { deep: true, handler: 'renderChart' }
  },
  mounted() {
    // 延迟初始化，确保DOM完全渲染
    this.$nextTick(() => {
      this.initChart();
      this.resizeHandler = () => this.chartInstance?.resize();
      window.addEventListener('resize', this.resizeHandler);
    });
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
    window.removeEventListener('resize', this.resizeHandler);
  },
  methods: {
    // ========== 新增：强制刷新图表的方法（供父组件调用） ==========
    forceRefreshChart() {
      // 先确保实例初始化，再渲染
      if (!this.chartInstance) {
        this.initChart();
      } else {
        this.renderChart();
      }
      // 强制触发ECharts重绘
      this.chartInstance?.resize();
    },

    initChart() {
      if (!this.$refs.chartRef) return;
      // 销毁旧实例，避免重复创建
      if (this.chartInstance) {
        this.chartInstance.dispose();
      }
      this.chartInstance = echarts.init(this.$refs.chartRef);
      // 初始化后立即渲染
      this.renderChart();
    },

    renderChart() {
      // 前置校验：实例/数据都存在才渲染
      if (!this.chartInstance || !this.$refs.chartRef || this.chartData.length === 0) {
        // 数据为空时，清空图表
        if (this.chartInstance) {
          this.chartInstance.clear();
        }
        return;
      }

      const { chartData, fieldMap, yAxisList, seriesList, baseStyle } = this;
      const xAxisData = chartData.map(item => item[fieldMap.xAxis] || '-');
      const yAxisKeyToIndex = {};
      yAxisList.forEach((y, index) => { yAxisKeyToIndex[y.key] = index; });
      const getSeriesData = (field) => chartData.map(item => item[field] || 0);

      const option = {
        textStyle: { color: baseStyle.textLight },
        tooltip: this.showTooltip ? this.buildTooltip() : { show: false },
        legend: this.showLegend ? {
          top: 'bottom',
          textStyle: { color: baseStyle.textGray },
          itemGap: 18,
          icon: 'roundRect',
          itemWidth: 12,
          itemHeight: 12
        } : { show: false },
        grid: {
          left: yAxisList.length > 1 ? '12%' : '10%',
          right: yAxisList.length > 1 ? '12%' : '10%',
          bottom: '15%',
          top: this.showTitle ? '10%' : '5%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: xAxisData,
          axisLine: { lineStyle: { color: '#1e40af' } },
          axisTick: { lineStyle: { color: '#1e40af' } },
          axisLabel: {
            color: baseStyle.textGray,
            fontSize: 12,
            margin: 10
          },
          boundaryGap: true
        }],
        yAxis: this.buildYAxis(),
        series: this.buildSeries(getSeriesData, yAxisKeyToIndex)
      };

      if (this.standardLine.show) {
        option.series.push({
          name: this.standardLine.name,
          type: 'line',
          yAxisIndex: yAxisList.length - 1,
          data: Array(xAxisData.length).fill(this.standardLine.value),
          lineStyle: {
            color: this.standardLine.color,
            type: 'dashed',
            width: 2
          },
          symbol: 'none',
          label: {
            show: true,
            position: 'end',
            formatter: this.standardLine.label,
            color: '#ffd700',
            fontSize: 10
          }
        });
      }

      // 关键：第二个参数设为true，强制替换所有配置，避免增量更新失效
      this.chartInstance.setOption(option, true);
    },

    // 保持原有buildYAxis、buildSeries、buildTooltip等方法不变...
    buildYAxis() {
      const { yAxisList, baseStyle, techColorLib } = this;
      const getYAxisPosition = (index, total) => {
        if (total === 1) return 'left';
        return index % 2 === 0 ? 'left' : 'right';
      };
      const leftYAxis = yAxisList.filter((_, i) => getYAxisPosition(i, yAxisList.length) === 'left');
      const rightYAxis = yAxisList.filter((_, i) => getYAxisPosition(i, yAxisList.length) === 'right');
      const getYAxisOffset = (index, list, baseOffset = 0) => index * baseOffset;

      return yAxisList.map((y, index) => {
        const total = yAxisList.length;
        const position = getYAxisPosition(index, total);
        const offsetList = position === 'left' ? leftYAxis : rightYAxis;
        const offsetIndex = offsetList.findIndex(item => item.key === y.key);
        const offset = getYAxisOffset(offsetIndex, offsetList, 90);
        const axisColor = y.color || techColorLib[index % techColorLib.length];

        return {
          type: 'value',
          name: `${y.name}（${y.unit}）`,
          nameTextStyle: { color: axisColor, fontSize: 12, fontWeight: 500 },
          axisLine: { lineStyle: { color: '#1e40af' } },
          axisTick: { lineStyle: { color: '#1e40af' } },
          axisLabel: { color: baseStyle.textGray, fontSize: 11 },
          splitLine: {
            show: index === 0,
            lineStyle: { color: `rgba(30, 64, 175, 0.3)` }
          },
          position,
          offset,
          min: typeof y.min === 'number' ? y.min : 0,
          max: y.max ? y.max : function(v) { return Math.ceil(v.max * 1.2); }
        };
      });
    },

    buildSeries(getSeriesData, yAxisKeyToIndex) {
      const { seriesList, baseStyle, techColorLib } = this;

      return seriesList.map((series, seriesIndex) => {
        const { key, name, type, yAxisKey, field, stack, color, showLabel = true } = series;
        const yAxisIndex = yAxisKeyToIndex[yAxisKey];
        const seriesData = getSeriesData(field);
        const finalColor = color || techColorLib[seriesIndex % techColorLib.length];
        const gradientEndColor = this.getGradientEndColor(finalColor);
        const lineLightColor = this.getLineLightColor(finalColor);

        const baseConfig = {
          name,
          type,
          yAxisIndex,
          data: seriesData,
          stack: stack || '',
          barWidth: '15%',
          barGap: '30%',
          cursor: 'pointer'
        };

        if (type === 'bar') {
          return {
            ...baseConfig,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: finalColor },
                { offset: 1, color: gradientEndColor }
              ]),
              borderWidth: 1,
              borderColor: finalColor,
              shadowColor: finalColor,
              shadowBlur: 10,
              shadowOffsetY: 1
            },
            label: showLabel ? {
              show: true,
              position: 'insideCenter',
              formatter: `{c}${this.getYUnitByKey(yAxisKey)}`,
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 600,
              offset:[5,10],
              textBorderColor: gradientEndColor,
              textBorderWidth: 1
            } : { show: false },
            emphasis: {
              focus: 'single',
              scale: false,
              scaleSize: 0,
              shadowBlur: 25,
              shadowColor: finalColor,
              shadowColor0: 'transparent',
              blurScope: 'coordinateSystem',
              shadowOffsetX: 0,
              shadowOffsetY: -3,
              itemStyle: {
                borderColor: 'inherit',
                borderWidth: 'inherit',
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: finalColor },
                  { offset: 1, color: gradientEndColor }
                ])
              }
            }
          };
        } else if (type === 'line') {
          const rgb = this.hexToRgb(finalColor);
          return {
            ...baseConfig,
            itemStyle: {
              color: finalColor,
              shadowColor: `rgba(${rgb}, 1)`,
              shadowBlur: 20,
              shadowOffsetY: 0
            },
            lineStyle: {
              width: 3,
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                { offset: 0, color: finalColor },
                { offset: 1, color: lineLightColor }
              ]),
              type: series.lineType || 'solid',
              shadowColor: `rgba(${rgb}, 0.8)`,
              shadowBlur: 15,
              shadowOffsetY: 0
            },
            symbol: series.symbol || 'circle',
            symbolSize: 9,
            symbolStyle: {
              borderWidth: 2,
              borderColor: '#0a1929',
              color: finalColor,
              shadowColor: finalColor,
              shadowBlur: 15
            },
            label: showLabel ? {
              show: true,
              position: series.labelPos || 'top',
              formatter: `{c}${this.getYUnitByKey(yAxisKey)}`,
              color: finalColor,
              fontSize: 11,
              fontWeight: 600,
              textShadow: `0 0 10px ${finalColor}, 0 0 20px ${finalColor}`
            } : { show: false },
            emphasis: {
              itemStyle: { shadowBlur: 30, shadowColor: finalColor },
              lineStyle: { width: 5, shadowBlur: 25 },
              symbolSize: 14,
              label: { textShadow: `0 0 15px ${finalColor}, 0 0 25px ${finalColor}` }
            }
          };
        }
        return baseConfig;
      });
    },

    buildTooltip() {
      const { seriesList, yAxisList, baseStyle, techColorLib } = this;
      const seriesUnitMap = {};
      const seriesColorMap = {};

      seriesList.forEach((series, index) => {
        seriesUnitMap[series.name] = this.getYUnitByKey(series.yAxisKey);
        seriesColorMap[series.name] = series.color || techColorLib[index % techColorLib.length];
      });

      return {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          lineStyle: { color: baseStyle.tooltipBorder, width: 2 },
          shadowStyle: { color: 'rgba(0, 240, 255, 0.1)' }
        },
        backgroundColor: 'rgba(10, 25, 41, 0.95)',
        borderColor: baseStyle.tooltipBorder,
        borderWidth: 2,
        borderRadius: 8,
        textStyle: { color: baseStyle.textLight },
        formatter: (params) => {
          const xName = params[0].name;
          const titleColor = seriesColorMap[params[0].seriesName] || '#00f0ff';
          let tip = `<div style="font-weight: bold; color: ${titleColor}; margin-bottom: 8px; font-size:14px;">${xName}</div>`;
          params.forEach(item => {
            const unit = seriesUnitMap[item.seriesName] || '';
            const color = seriesColorMap[item.seriesName] || '#00f0ff';
            tip += `<div style="margin:4px 0;">${item.seriesName}：<span style="color:${color}; font-weight:600;">${item.value}</span>${unit}</div>`;
          });
          return tip;
        }
      };
    },

    getYUnitByKey(yAxisKey) {
      return this.yAxisList.find(y => y.key === yAxisKey)?.unit || '';
    },

    hexToRgb(hex) {
      const reg = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;
      const match = hex.match(reg);
      return match ? `${parseInt(match[1], 16)},${parseInt(match[2], 16)},${parseInt(match[3], 16)}` : '0,240,255';
    },

    getGradientEndColor(mainColor) {
      const neonColorMap = {
        '#00ff99': 'rgba(69,170,122,0.66)',
        '#ff6699': 'rgba(175,72,106,0.66)',
        '#6699ff': 'rgba(77,114,189,0.66)',
        '#00ffd9': 'rgba(1,181,154,0.66)',
        '#00e5ff': 'rgba(2,163,182,0.66)',
        '#00FF9D': 'rgba(2,177,110,0.66)'
      };
      const deepColorMap = {
        '#00ff99': 'rgb(66,161,116)',
        '#ff6699': 'rgb(92,37,55)',
        '#6699ff': 'rgb(39,58,97)',
        '#00ffd9': 'rgb(1,97,83)',
        '#00e5ff': 'rgb(1,92,103)',
        '#00FF9D': 'rgb(0,92,57)'
      };
      return neonColorMap[mainColor] || deepColorMap[mainColor] || '#0a1929';
    },

    getLineLightColor(mainColor) {
      const neonLineMap = {
        '#ff00ff': '#ff66ff',
        '#00ffff': '#66ffff',
        '#ffff00': '#ffff66',
        '#ff6600': '#ff9966',
        '#8b00ff': '#b366ff'
      };
      const deepLineMap = {
        '#4cc9f0': '#80d9f5',
        '#4361ee': '#7380ee',
        '#3a0ca3': '#6a4cb3',
        '#7209b7': '#a25cc7',
        '#f72585': '#f972b0'
      };
      return neonLineMap[mainColor] || deepLineMap[mainColor] || this.lightenColor(mainColor, 40);
    },

    lightenColor(hex, percent) {
      const reg = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/;
      const match = hex.match(reg);
      if (!match) return hex;
      const r = Math.min(255, Math.floor(parseInt(match[1], 16) * (1 + percent / 100)));
      const g = Math.min(255, Math.floor(parseInt(match[2], 16) * (1 + percent / 100)));
      const b = Math.min(255, Math.floor(parseInt(match[3], 16) * (1 + percent / 100)));
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  }
};
</script>

<style scoped>
.dynamic-echart-chart {
  padding: 10px;
  margin: 0 auto;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: transparent;
}
.chart-title {
  height: 1.5rem;
  width: 100%;
  display: inline-block;
  font-size: 1.4rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 5px;
  transition: all 0.3s ease;
}
@media (max-width: 768px) {
  .chart-title {
    font-size: 1.2rem;
  }
}
</style>