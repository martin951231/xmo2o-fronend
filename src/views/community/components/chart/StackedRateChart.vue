<template>
  <div class="dynamic-echart-chart">
    <div
      ref="chartRef"
      :style="{ width: containerWidth, height: containerHeight }"
      class="chart-inner"
    ></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'DynamicEchartChart',
  props: {
    chartData: { type: Array, required: true },
    fieldMap: { type: Object, required: true, validator: val => !!val.xAxis },
    yAxisList: {
      type: Array,
      required: true,
      validator: val => val.length >= 1 && val.every(item => !!item.key)
    },
    seriesList: {
      type: Array,
      required: false,
      default: () => [],
      validator: val => {
        if (!Array.isArray(val)) return false
        if (val.length === 0) return true
        return val.every(item => !!item.key && !!item.type && !!item.yAxisKey && !!item.field)
      }
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
        color: 'rgba(255,215,0,0.75)'
      })
    },
    showLegend: { type: Boolean, default: true },
    showTooltip: { type: Boolean, default: true },
    containerWidth: { type: String, default: '100%' },
    containerHeight: { type: String, default: '100%' },
    baseStyle: {
      type: Object,
      default: () => ({
        textLight: '#e8f1ff',
        textGray: '#8ea9c7',
        borderDark: '#0f172a',
        tooltipBorder: '#3b82f6'
      })
    }
  },
  data() {
    return {
      chartInstance: null,
      resizeHandler: null,
      techColorLib: [
        '#22c3ff',
        '#7c5cff',
        '#16d9a6',
        '#ffb84d',
        '#ff6b8b',
        '#8dd1ff'
      ]
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
    this.$nextTick(() => {
      this.initChart();
      this.resizeHandler = () => {
        this.chartInstance && this.chartInstance.resize();
      };
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
    forceRefreshChart() {
      if (!this.chartInstance) {
        this.initChart();
      } else {
        this.renderChart();
        this.chartInstance.resize();
      }
    },

    initChart() {
      if (!this.$refs.chartRef) return;
      if (this.chartInstance) {
        this.chartInstance.dispose();
      }
      this.chartInstance = echarts.init(this.$refs.chartRef);
      this.renderChart();
    },

    renderChart() {
      if (!this.chartInstance || !this.$refs.chartRef || !this.chartData || this.chartData.length === 0) {
        if (this.chartInstance) this.chartInstance.clear();
        return;
      }

      const { chartData, fieldMap, yAxisList, baseStyle } = this;
      const xAxisData = chartData.map(item => item[fieldMap.xAxis] || '-');

      const yAxisKeyToIndex = {};
      yAxisList.forEach((y, index) => {
        yAxisKeyToIndex[y.key] = index;
      });

      const getSeriesData = (field) => chartData.map(item => item[field] ?? 0);

      const option = {
        backgroundColor: 'transparent',
        animationDuration: 700,
        animationEasing: 'cubicOut',
        textStyle: { color: baseStyle.textLight },

        title: this.showTitle
          ? {
            text: this.chartTitle,
            top: 4,
            left: 'center',
            textStyle: {
              color: this.titleColor,
              fontSize: 16,
              fontWeight: 600
            }
          }
          : undefined,

        tooltip: this.showTooltip ? this.buildTooltip() : { show: false },

        legend: this.showLegend
          ? {
            bottom: 0,
            left: 'center',
            itemGap: 18,
            itemWidth: 12,
            itemHeight: 12,
            icon: 'roundRect',
            textStyle: {
              color: baseStyle.textGray,
              fontSize: 12
            }
          }
          : { show: false },

        grid: {
          left: yAxisList.length > 1 ? '7%' : '5%',
          right: yAxisList.length > 1 ? '7%' : '5%',
          bottom: this.showLegend ? '14%' : '8%',
          top: this.showTitle ? '14%' : '8%',
          containLabel: true
        },

        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            boundaryGap: true,
            axisLine: {
              lineStyle: {
                color: 'rgba(80, 130, 200, 0.55)',
                width: 1
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: baseStyle.textGray,
              fontSize: 12,
              margin: 12
            },
            splitLine: {
              show: false
            }
          }
        ],

        yAxis: this.buildYAxis(),

        series: this.buildSeries(getSeriesData, yAxisKeyToIndex)
      };

      if (this.standardLine.show) {
        option.series.push({
          name: this.standardLine.name,
          type: 'line',
          yAxisIndex: yAxisList.length - 1,
          data: Array(xAxisData.length).fill(this.standardLine.value),
          symbol: 'none',
          z: 2,
          lineStyle: {
            color: this.standardLine.color,
            type: 'dashed',
            width: 1.5,
            opacity: 0.9
          },
          label: {
            show: true,
            position: 'end',
            distance: 6,
            formatter: this.standardLine.label,
            color: this.standardLine.color,
            fontSize: 11,
            backgroundColor: 'rgba(15,23,42,0.72)',
            borderRadius: 4,
            padding: [3, 6]
          },
          emphasis: {
            disabled: true
          }
        });
      }

      this.chartInstance.setOption(option, true);
    },

    buildYAxis() {
      const { yAxisList, baseStyle, techColorLib } = this;

      const getYAxisPosition = (index, total) => {
        if (total === 1) return 'left';
        return index % 2 === 0 ? 'left' : 'right';
      };

      const leftYAxis = yAxisList.filter((_, i) => getYAxisPosition(i, yAxisList.length) === 'left');
      const rightYAxis = yAxisList.filter((_, i) => getYAxisPosition(i, yAxisList.length) === 'right');

      return yAxisList.map((y, index) => {
        const total = yAxisList.length;
        const position = getYAxisPosition(index, total);
        const offsetList = position === 'left' ? leftYAxis : rightYAxis;
        const offsetIndex = offsetList.findIndex(item => item.key === y.key);
        const offset = offsetIndex * 54;
        const axisColor = y.color || techColorLib[index % techColorLib.length];

        return {
          type: 'value',
          name: `${y.name}${y.unit ? `（${y.unit}）` : ''}`,
          nameLocation: 'end',
          nameGap: 16,
          nameTextStyle: {
            color: axisColor,
            fontSize: 12,
            fontWeight: 500,
            padding: [0, 0, 4, 0]
          },
          position,
          offset,
          min: typeof y.min === 'number' ? y.min : 0,
          max: typeof y.max === 'number'
            ? y.max
            : function (v) {
              return Math.ceil(v.max * 1.15 || 10);
            },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(80, 130, 200, 0.45)',
              width: 1
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: baseStyle.textGray,
            fontSize: 11
          },
          splitLine: {
            show: index === 0,
            lineStyle: {
              color: 'rgba(120, 160, 220, 0.14)',
              type: 'dashed'
            }
          }
        };
      });
    },

    buildSeries(getSeriesData, yAxisKeyToIndex) {
      const { seriesList, techColorLib } = this;

      return seriesList.map((series, seriesIndex) => {
        const {
          name,
          type,
          yAxisKey,
          field,
          stack,
          color,
          showLabel = true
        } = series;

        const yAxisIndex = yAxisKeyToIndex[yAxisKey];
        const seriesData = getSeriesData(field);
        const finalColor = color || techColorLib[seriesIndex % techColorLib.length];
        const rgb = this.hexToRgbObject(finalColor);
        const barTopColor = this.mixWithWhite(finalColor, 0.2);
        const barBottomColor = this.mixWithBlack(finalColor, 0.18);
        const hoverColor = this.mixWithWhite(finalColor, 0.1);
        const lineLightColor = this.mixWithWhite(finalColor, 0.22);

        const commonLabelFormatter = (params) => {
          if (params.value === 0 || params.value == null) return '';
          return `${params.value}${this.getYUnitByKey(yAxisKey)}`;
        };

        const baseConfig = {
          name,
          type,
          yAxisIndex,
          data: seriesData,
          stack: stack || '',
          cursor: 'pointer',
          z: type === 'line' ? 4 : 3
        };

        if (type === 'bar') {
          return {
            ...baseConfig,
            barWidth: series.barWidth || this.getAutoBarWidth(),
            barMaxWidth: 22,
            barGap: series.barGap || '30%',
            itemStyle: {
              borderRadius: [6, 6, 2, 2],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: this.rgbaString(barTopColor, 0.95) },
                { offset: 0.35, color: this.rgbaString(finalColor, 0.88) },
                { offset: 1, color: this.rgbaString(barBottomColor, 0.72) }
              ]),
              borderColor: this.rgbaString(finalColor, 0.72),
              borderWidth: 1,
              shadowColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.14)`,
              shadowBlur: 8,
              shadowOffsetY: 2
            },
            emphasis: {
              focus: 'series',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: this.rgbaString(hoverColor, 1) },
                  { offset: 1, color: this.rgbaString(finalColor, 0.82) }
                ]),
                borderColor: this.rgbaString(hoverColor, 0.95),
                borderWidth: 1.2,
                shadowColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.22)`,
                shadowBlur: 14,
                shadowOffsetY: 3
              }
            },
            blur: {
              itemStyle: {
                opacity: 0.32
              }
            },
            label: showLabel
              ? {
                show: true,
                position: 'top',
                distance: 6,
                formatter: (params) => {
                  const val = params.value;
                  if (val === 0 || val == null) return '';

                  // 第三种方案：类目较多时，只显示每个类目中最大值的标签
                  if (this.chartData.length >= 4) {
                    if (!this.isCategoryMaxValue(params.dataIndex, val)) return '';
                  }

                  return `${val}${this.getYUnitByKey(yAxisKey)}`;
                },
                color: this.rgbaString(finalColor, 0.96),
                fontSize: this.chartData.length > 6 ? 10 : 12,
                fontWeight: 600
              }
              : { show: false }
          };
        }

        if (type === 'line') {
          return {
            ...baseConfig,
            smooth: series.smooth !== false,
            symbol: series.symbol || 'circle',
            symbolSize: series.symbolSize || 8,
            connectNulls: true,
            lineStyle: {
              width: 2.5,
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: this.rgbaString(finalColor, 0.92) },
                { offset: 1, color: this.rgbaString(lineLightColor, 0.9) }
              ]),
              shadowColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`,
              shadowBlur: 6
            },
            itemStyle: {
              color: finalColor,
              borderColor: '#0f172a',
              borderWidth: 2,
              shadowColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
              shadowBlur: 8
            },
            emphasis: {
              focus: 'series',
              lineStyle: {
                width: 3
              },
              itemStyle: {
                borderWidth: 2,
                shadowColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.28)`,
                shadowBlur: 12
              },
              scale: true
            },
            label: showLabel
              ? {
                show: true,
                position: 'top',
                distance: 8,
                formatter: commonLabelFormatter,
                color: this.rgbaString(finalColor, 0.96),
                fontSize: 12,
                fontWeight: 600
              }
              : { show: false }
          };
        }

        return baseConfig;
      });
    },

    buildTooltip() {
      const { seriesList, baseStyle, techColorLib } = this;
      const seriesUnitMap = {};
      const seriesColorMap = {};

      seriesList.forEach((series, index) => {
        seriesUnitMap[series.name] = this.getYUnitByKey(series.yAxisKey);
        seriesColorMap[series.name] = series.color || techColorLib[index % techColorLib.length];
      });

      return {
        trigger: 'axis',
        confine: true,
        extraCssText: `
          backdrop-filter: blur(8px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.22);
        `,
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: 'rgba(125, 170, 255, 0.45)',
            width: 1
          }
        },
        backgroundColor: 'rgba(10, 18, 35, 0.88)',
        borderColor: 'rgba(90, 140, 255, 0.35)',
        borderWidth: 1,
        borderRadius: 10,
        padding: [10, 12],
        textStyle: {
          color: baseStyle.textLight,
          fontSize: 12
        },
        formatter: (params) => {
          const xName = params[0]?.name || '-';
          let tip = `
            <div style="margin-bottom:8px;font-size:13px;font-weight:600;color:#dbeafe;">
              ${xName}
            </div>
          `;

          params.forEach(item => {
            const color = seriesColorMap[item.seriesName] || '#22c3ff';
            const unit = seriesUnitMap[item.seriesName] || '';
            tip += `
              <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;min-width:180px;margin:6px 0;">
                <div style="display:flex;align-items:center;">
                  <span style="
                    display:inline-block;
                    width:8px;
                    height:8px;
                    border-radius:50%;
                    background:${color};
                    margin-right:8px;
                    box-shadow:0 0 6px ${this.hexOrRgba(color, 0.35)};
                  "></span>
                  <span style="color:#b9c9e8;">${item.seriesName}</span>
                </div>
                <span style="color:#ffffff;font-weight:700;">
                  ${item.value}${unit}
                </span>
              </div>
            `;
          });

          return tip;
        }
      };
    },

    getAutoBarWidth() {
      const count = this.chartData.length || 0;
      if (count <= 2) return 18;
      if (count <= 4) return 16;
      if (count <= 6) return 14;
      if (count <= 8) return 12;
      return 10;
    },

    // 每个类目下，只显示最大值柱子的标签
    isCategoryMaxValue(dataIndex, currentValue) {
      const currentRow = this.chartData[dataIndex];
      if (!currentRow) return false;

      let max = -Infinity;

      this.seriesList.forEach(series => {
        if (series.type !== 'bar') return;
        const val = Number(currentRow[series.field] || 0);
        if (val > max) max = val;
      });

      return Number(currentValue) === max && max > 0;
    },

    getYUnitByKey(yAxisKey) {
      return this.yAxisList.find(y => y.key === yAxisKey)?.unit || '';
    },

    hexToRgbObject(hex) {
      const h = (hex || '').replace('#', '');
      if (h.length !== 6) return { r: 34, g: 195, b: 255 };
      return {
        r: parseInt(h.substring(0, 2), 16),
        g: parseInt(h.substring(2, 4), 16),
        b: parseInt(h.substring(4, 6), 16)
      };
    },

    rgbaString(hex, alpha = 1) {
      const { r, g, b } = this.hexToRgbObject(hex);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    hexOrRgba(color, alpha = 1) {
      if (!color) return `rgba(34,195,255,${alpha})`;
      if (color.startsWith('rgba') || color.startsWith('rgb')) return color;
      return this.rgbaString(color, alpha);
    },

    mixWithWhite(hex, amount = 0.2) {
      const { r, g, b } = this.hexToRgbObject(hex);
      const nr = Math.round(r + (255 - r) * amount);
      const ng = Math.round(g + (255 - g) * amount);
      const nb = Math.round(b + (255 - b) * amount);
      return this.rgbToHex(nr, ng, nb);
    },

    mixWithBlack(hex, amount = 0.2) {
      const { r, g, b } = this.hexToRgbObject(hex);
      const nr = Math.round(r * (1 - amount));
      const ng = Math.round(g * (1 - amount));
      const nb = Math.round(b * (1 - amount));
      return this.rgbToHex(nr, ng, nb);
    },

    rgbToHex(r, g, b) {
      const toHex = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
  }
};
</script>

<style scoped>
.dynamic-echart-chart {
  width: 100%;
  height: 100%;
  padding: 8px 10px 6px;
  margin: 0 auto;
  border-radius: 12px;
  background: transparent;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.chart-inner {
  width: 100%;
  height: 100%;
  min-height: 260px;
}

@media (max-width: 768px) {
  .dynamic-echart-chart {
    padding: 6px;
    border-radius: 10px;
  }

  .chart-inner {
    min-height: 220px;
  }
}
</style>