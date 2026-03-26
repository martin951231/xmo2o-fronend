<template>
  <div class="dynamic-echart-chart">
    <div
      v-if="!hasData"
      class="empty-state"
      :style="{ width: containerWidth, height: containerHeight }"
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
        if (!Array.isArray(val)) return false;
        if (val.length === 0) return true;
        return val.every(item => !!item.key && !!item.type && !!item.yAxisKey && !!item.field);
      }
    },
    chartTitle: { type: String, default: '数据统计' },
    showTitle: { type: Boolean, default: true },
    titleColor: { type: String, default: '#ffffff' },
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

    // 是否显示每个类目的总量（默认显示）
    showCategoryTotal: {
      type: Boolean,
      default: true
    },

    // 新增：控制总量由哪些字段参与计算
    // 不传时，保持原逻辑：统计所有 bar 系列字段
    categoryTotalFields: {
      type: Array,
      default: () => []
    },

    emptyText: {
      type: String,
      default: '暂无数据'
    },

    containerWidth: { type: String, default: '100%' },
    containerHeight: { type: String, default: '100%' },
    baseStyle: {
      type: Object,
      default: () => ({
        textLight: '#ffffff',
        textGray: '#ffffff',
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
        '#ff6b8b',
        '#7c5cff',
        '#16d9a6',
        '#ffb84d',
        '#8dd1ff'
      ]
    };
  },
  computed: {
    hasData() {
      if (!Array.isArray(this.chartData) || this.chartData.length === 0) return false;

      const validBarOrLineSeries = this.seriesList.filter(
        item => item && item.field && (item.type === 'bar' || item.type === 'line')
      );

      if (!validBarOrLineSeries.length) return false;

      return this.chartData.some(row => {
        return validBarOrLineSeries.some(series => {
          const value = Number(row[series.field]);
          return !Number.isNaN(value) && value !== 0;
        });
      });
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.handleChartChange();
      }
    },
    fieldMap: {
      deep: true,
      handler() {
        this.handleChartChange();
      }
    },
    yAxisList: {
      deep: true,
      handler() {
        this.handleChartChange();
      }
    },
    seriesList: {
      deep: true,
      handler() {
        this.handleChartChange();
      }
    },
    standardLine: {
      deep: true,
      handler() {
        this.handleChartChange();
      }
    },
    showCategoryTotal() {
      this.handleChartChange();
    },
    categoryTotalFields: {
      deep: true,
      handler() {
        this.handleChartChange();
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.hasData) {
        this.initChart();
      }

      this.resizeHandler = () => {
        if (this.chartInstance && this.hasData) {
          this.chartInstance.resize();
        }
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
    handleChartChange() {
      this.$nextTick(() => {
        if (!this.hasData) {
          if (this.chartInstance) {
            this.chartInstance.clear();
          }
          return;
        }

        if (!this.chartInstance) {
          this.initChart();
        } else {
          this.renderChart();
          this.chartInstance.resize();
        }
      });
    },

    forceRefreshChart() {
      if (!this.hasData) {
        if (this.chartInstance) {
          this.chartInstance.clear();
        }
        return;
      }

      if (!this.chartInstance) {
        this.initChart();
      } else {
        this.renderChart();
        this.chartInstance.resize();
      }
    },

    initChart() {
      if (!this.$refs.chartRef || !this.hasData) return;
      if (this.chartInstance) {
        this.chartInstance.dispose();
      }
      this.chartInstance = echarts.init(this.$refs.chartRef);
      this.renderChart();
    },

    renderChart() {
      if (!this.chartInstance || !this.$refs.chartRef || !this.hasData) {
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
              top: 2,
              left: 'center',
              textStyle: {
                color: this.titleColor,
                fontSize: 18,
                fontWeight: 700
              }
            }
          : undefined,

        tooltip: this.showTooltip ? this.buildTooltip() : { show: false },

        legend: this.showLegend
          ? {
              bottom: 4,
              left: 'center',
              itemGap: 10,
              itemWidth: 14,
              itemHeight: 14,
              icon: 'roundRect',
              textStyle: {
                color: '#c0cfff',
                fontSize: 12,
                fontWeight: 500
              }
            }
          : { show: false },

        grid: {
          left: yAxisList.length > 1 ? '7%' : '6%',
          right: yAxisList.length > 1 ? '7%' : '6%',
          bottom: this.showLegend ? '14%' : '18%',
          top: this.showTitle ? '18%' : '8%',
          containLabel: true
        },

        xAxis: [
          {
            type: 'category',
            data: xAxisData,
            boundaryGap: true,
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.35)',
                width: 1
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#c0cfff',
              fontWeight: 500,
              margin: 16,
              interval: 0,
              rotate: 0,
              formatter: (value, index) => this.formatXAxisLabelByInterval(value, index)
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
            color: '#ffffff',
            fontSize: 12,
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

    getXAxisLabelInterval() {
      const count = this.chartData.length || 0;

      if (count <= 6) return 0;
      if (count <= 10) return 1;
      if (count <= 16) return 2;
      if (count <= 24) return 3;
      return 4;
    },

    formatXAxisLabelByInterval(value, index) {
      const count = this.chartData.length || 0;

      let step = 1;
      if (count <= 6) step = 1;
      else if (count <= 10) step = 2;
      else if (count <= 16) step = 3;
      else if (count <= 24) step = 4;
      else step = 5;

      if (index % step !== 0 && index !== count - 1) return '';

      return value || '';
    },

    buildYAxis() {
      const { yAxisList } = this;

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

        return {
          type: 'value',
          name: `${y.name}${y.unit ? `（${y.unit}）` : ''}`,
          nameLocation: 'end',
          nameGap: 18,
          nameTextStyle: {
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 600,
            padding: [0, 0, 6, 0]
          },
          position,
          offset,
          min: typeof y.min === 'number' ? y.min : 0,
          max: typeof y.max === 'number'
            ? y.max
            : function (v) {
                return Math.ceil(v.max * 1.2 || 10);
              },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.28)',
              width: 1
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 500
          },
          splitLine: {
            show: index === 0,
            lineStyle: {
              color: 'rgba(255,255,255,0.12)',
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
            z: 5,
            zlevel: 2,
            barWidth: series.barWidth || this.getAutoBarWidth(),
            barMaxWidth: 32,
            barGap: series.barGap || '20%',
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
                  position: 'insideTop',
                  distance: 20,
                  formatter: (params) => {
                    const currentValue = Number(params.value || 0);
                    if (!currentValue) return '';

                    if (!this.showCategoryTotal) return '';

                    if (!this.shouldShowBarLabel(currentValue)) return '';

                    if (!this.isCategoryMaxBar(params.dataIndex, field)) return '';

                    const total = this.getCategoryTotalValue(params.dataIndex);
                    if (total == null || Number(total) === 0) return '';

                    return this.formatCategoryTotalValue(total);
                  },
                  color: '#ffffff',
                  fontSize: this.chartData.length > 6 ? 12 : 14,
                  fontWeight: 700,
                  z: 999,
                  textBorderColor: 'rgba(0, 25, 50, 0.95)',
                  textBorderWidth: 3,
                  textShadowColor: 'rgba(0,0,0,0.45)',
                  textShadowBlur: 3
                }
              : { show: false },
            labelLayout: () => {
              return {
                hideOverlap: true
              };
            }
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
                  position: 'insideTop',
                  distance: 8,
                  formatter: (params) => {
                    const val = params.value;
                    if (val === 0 || val == null) return '';
                    return ``;
                  },
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 700
                }
              : { show: false }
          };
        }

        return baseConfig;
      });
    },

    buildTooltip() {
      const { seriesList, techColorLib } = this;
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
            color: 'rgba(255,255,255,0.3)',
            width: 1
          }
        },
        backgroundColor: 'rgba(10, 18, 35, 0.92)',
        borderColor: 'rgba(255,255,255,0.22)',
        borderWidth: 1,
        borderRadius: 10,
        padding: [10, 12],
        textStyle: {
          color: '#ffffff',
          fontSize: 13
        },
        formatter: (params) => {
          const xName = params[0]?.name || '-';
          let tip = `
            <div style="margin-bottom:8px;font-size:14px;font-weight:700;color:#ffffff;">
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
                  <span style="color:#ffffff;">${item.seriesName}</span>
                </div>
                <span style="color:#ffffff;font-weight:700;">
                  ${item.value}${unit}
                </span>
              </div>
            `;
          });

          if (this.showCategoryTotal) {
            const dataIndex = params[0]?.dataIndex;
            if (dataIndex !== undefined && dataIndex !== null) {
              const total = this.getCategoryTotalValue(dataIndex);
              if (total > 0) {
                tip += `
                  <div style="
                    margin-top:8px;
                    padding-top:8px;
                    border-top:1px dashed rgba(255,255,255,0.15);
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:16px;
                  ">
                    <span style="color:#c0cfff;">总量</span>
                    <span style="color:#ffffff;font-weight:700;">${this.formatCategoryTotalValue(total)}</span>
                  </div>
                `;
              }
            }
          }

          return tip;
        }
      };
    },

    // 获取总量计算字段
    // 不传 categoryTotalFields 时，沿用原逻辑：取所有 bar 系列的 field
    getCategoryTotalCalcFields() {
      if (Array.isArray(this.categoryTotalFields) && this.categoryTotalFields.length > 0) {
        return this.categoryTotalFields.filter(Boolean);
      }

      return this.seriesList
        .filter(series => series.type === 'bar' && series.field)
        .map(series => series.field);
    },

    getCategoryTotalValue(dataIndex) {
      const row = this.chartData[dataIndex];
      if (!row) return 0;

      const useCustomFields = Array.isArray(this.categoryTotalFields) && this.categoryTotalFields.length > 0;
      const totalFields = this.getCategoryTotalCalcFields();

      const total = totalFields.reduce((sum, field) => {
        return sum + Number(row[field] || 0);
      }, 0);

      // 仅在使用 categoryTotalFields 自定义字段时，固定保留两位小数
      if (!useCustomFields) return total;
      return Math.round(total * 100) / 100;
    },

    formatCategoryTotalValue(total) {
      const useCustomFields = Array.isArray(this.categoryTotalFields) && this.categoryTotalFields.length > 0;
      if (!useCustomFields) return `${total}`;

      const num = Number(total);
      if (Number.isNaN(num)) return `${total}`;
      return num.toFixed(2);
    },

    getGlobalBarMaxValue() {
      let max = 0;

      this.chartData.forEach(row => {
        this.seriesList.forEach(series => {
          if (series.type !== 'bar') return;
          const value = Number(row[series.field] || 0);
          if (value > max) {
            max = value;
          }
        });
      });

      return max;
    },

    shouldShowBarLabel(value) {
      const globalMax = this.getGlobalBarMaxValue();
      if (!globalMax) return false;

      return Number(value) >= globalMax * 0.1;
    },

    getAutoBarWidth() {
      const categoryCount = this.chartData.length || 0;
      const barSeriesCount = this.seriesList.filter(item => item.type === 'bar').length || 1;

      if (categoryCount <= 3) {
        if (barSeriesCount >= 4) return 24;
        if (barSeriesCount === 3) return 28;
        return 32;
      }
      if (categoryCount <= 5) {
        if (barSeriesCount >= 4) return 20;
        return 24;
      }
      if (categoryCount <= 8) return 18;
      return 16;
    },

    isCategoryMaxBar(dataIndex, currentField) {
      const currentRow = this.chartData[dataIndex];
      if (!currentRow) return false;

      let max = -Infinity;
      let maxField = '';

      this.seriesList.forEach(series => {
        if (series.type !== 'bar') return;
        const val = Number(currentRow[series.field] || 0);
        if (val > max) {
          max = val;
          maxField = series.field;
        }
      });

      return max > 0 && currentField === maxField;
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
  position: relative;
}

.chart-inner {
  width: 100%;
  height: 100%;
  min-height: 260px;
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

@media (max-width: 768px) {
  .dynamic-echart-chart {
    padding: 6px;
    border-radius: 10px;
  }

  .chart-inner,
  .empty-state {
    min-height: 220px;
  }
}
</style>
