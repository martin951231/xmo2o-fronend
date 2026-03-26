<template>
  <div class="echart-pie-wrap">
    <div class="echart-pie-top">
      <div class="echart-pie">
        <div ref="chartRef" class="chart-inner"></div>

        <div
          v-if="showSingleCenterText"
          class="center-text-layer"
          :style="getCenterTextLayerStyle"
        >
          <div
            v-for="(item, idx) in centerText.text"
            :key="idx"
            class="text-row"
          >
            <span class="text-name" :style="getNameStyle(idx)">
              {{ item.name }}
            </span>
            <span class="text-value" :style="getValueStyle(idx)">
              {{ item.value }}{{ centerValueSuffix }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showFilterButtons" class="echart-pie-bottom">
      <div class="metric-btn-list">
        <div
          v-for="item in chartData"
          :key="item[categoryField]"
          class="metric-btn-item"
          :class="{ active: currentCategoryName === item[categoryField] }"
          @click="handleCategoryChange(item)"
        >
          {{ item[categoryField] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'EchartPie',
  props: {
    chartData: {
      type: Array,
      required: true,
      default: () => []
    },

    doubleRing: {
      type: Boolean,
      default: false
    },

    categoryField: {
      type: String,
      default: 'name'
    },

    doubleRingFields: {
      type: Object,
      default: () => ({
        left: [],
        right: []
      })
    },

    doubleRingColorList: {
      type: Object,
      default: () => ({
        left: [],
        right: []
      })
    },

    // 新增：双图分别控制 label
    // 支持：
    // {
    //   left: { color: '#0B1B2B', fontSize: 14, fontWeight: 600 },
    //   right: { color: '#FFFFFF', fontSize: 14, fontWeight: 600 }
    // }
    doubleRingLabel: {
      type: Object,
      default: () => ({
        left: {},
        right: {}
      })
    },

    title: {
      type: Object,
      default: () => ({
        show: false,
        text: '数据统计',
        color: '#FFFFFF',
        fontSize: 16,
        subText: '',
        subColor: '#8798AD'
      })
    },

    pieConfig: {
      type: Object,
      default: () => ({
        isRing: true,
        radius: ['42%', '68%'],
        center: ['50%', '50%'],
        doubleRadius: ['40%', '56%'],
        leftCenter: ['30%', '48%'],
        rightCenter: ['70%', '48%']
      })
    },

    legend: {
      type: Object,
      default: () => ({
        show: false,
        position: 'right',
        textColor: '#8798AD',
        fontSize: 12,
        itemWidth: 10,
        itemGap: 12
      })
    },

    label: {
      type: Object,
      default: () => ({
        show: true,
        color: '#E5E6EB',
        fontSize: 14,
        fontWeight: 400,
        formatter: '{b}\n{d}%'
      })
    },

    labelLine: {
      type: Object,
      default: () => ({
        show: true,
        length: 14,
        length2: 16,
        lineStyle: {
          color: '#6A8ACD',
          width: 1,
          type: 'solid'
        }
      })
    },

    colorList: {
      type: Array,
      default: () => ([
        '#14E1E8',
        '#FFF200',
        '#FF7A00',
        '#7D19FF',
        '#FF00F2',
        '#165DFF'
      ])
    },

    tooltip: {
      type: Object,
      default: () => ({
        show: true,
        backgroundColor: 'rgba(8, 24, 53, 0.96)',
        borderColor: '#00D9FF',
        borderWidth: 1,
        textStyle: { color: '#E5E6EB', fontSize: 12 }
      })
    },

    centerText: {
      type: Object,
      default: () => ({
        show: true,
        text: [
          { name: '总预算', value: 0 },
          { name: '总支出', value: 0 }
        ],
        fontSize: [16, 28],
        color: ['#8798AD', '#FFFFFF'],
        lineHeight: 45,
        fontWeight: [400, 700]
      })
    },

    centerValueSuffix: {
      type: String,
      default: '(万元)'
    },

    defaultCategoryName: {
      type: String,
      default: ''
    },

    showCategoryFilter: {
      type: Boolean,
      default: true
    },

    valueSuffix: {
      type: String,
      default: ''
    },

    filterButtons: {
      type: Object,
      default: () => ({
        show: false
      })
    }
  },

  data() {
    return {
      chartInstance: null,
      resizeHandler: null,
      currentCategoryName: ''
    }
  },

  computed: {
    showFilterButtons() {
      if (!this.showCategoryFilter) return false
      if (!this.filterButtons || this.filterButtons.show !== true) return false
      if (!Array.isArray(this.chartData) || !this.chartData.length) return false

      return this.chartData.every(item =>
        Object.prototype.hasOwnProperty.call(item, this.categoryField)
      )
    },

    activeCategoryData() {
      if (!Array.isArray(this.chartData) || !this.chartData.length) return null

      const isDirectPie = this.chartData.every(item =>
        Object.prototype.hasOwnProperty.call(item, 'value') &&
        Object.prototype.hasOwnProperty.call(item, 'name') &&
        !Object.prototype.hasOwnProperty.call(item, this.categoryField + '_dummy')
      )

      if (!this.showFilterButtons || isDirectPie) return null

      if (this.currentCategoryName) {
        const matched = this.chartData.find(
          item => item[this.categoryField] === this.currentCategoryName
        )
        if (matched) return matched
      }

      return this.chartData[0]
    },

    hasCustomDoubleRingFields() {
      const cfg = this.doubleRingFields || {}
      return Array.isArray(cfg.left) && cfg.left.length > 0 &&
        Array.isArray(cfg.right) && cfg.right.length > 0
    },

    leftColorList() {
      const left = this.doubleRingColorList && Array.isArray(this.doubleRingColorList.left)
        ? this.doubleRingColorList.left
        : []
      return left.length ? left : this.colorList
    },

    rightColorList() {
      const right = this.doubleRingColorList && Array.isArray(this.doubleRingColorList.right)
        ? this.doubleRingColorList.right
        : []
      return right.length ? right : this.colorList
    },

    singlePieData() {
      if (!Array.isArray(this.chartData) || !this.chartData.length) return []

      if (
        this.chartData.every(item =>
          Object.prototype.hasOwnProperty.call(item, 'name') &&
          Object.prototype.hasOwnProperty.call(item, 'value')
        )
      ) {
        return this.chartData
          .map((item, index) => ({
            ...item,
            value: Number(item.value || 0),
            itemStyle: Object.assign(
              {
                color: this.colorList[index % this.colorList.length]
              },
              item.itemStyle || {}
            )
          }))
          .filter(item => item.value > 0)
      }

      const cur = this.activeCategoryData
      if (!cur) return []

      return Object.keys(cur)
        .filter(key => key !== this.categoryField && typeof cur[key] !== 'object')
        .map((key, index) => ({
          name: key,
          value: Number(cur[key] || 0),
          itemStyle: {
            color: this.colorList[index % this.colorList.length]
          }
        }))
        .filter(item => item.value > 0)
    },

    leftPieData() {
      if (!this.doubleRing) return []

      if (this.hasCustomDoubleRingFields) {
        const cur = this.activeCategoryData
        if (!cur) return []

        return this.doubleRingFields.left
          .map((field, index) => {
            const key = typeof field === 'string' ? field : field.key
            const name = typeof field === 'string' ? field : (field.name || field.key)

            return {
              name,
              value: Number(cur[key] || 0),
              itemStyle: {
                color: this.leftColorList[index % this.leftColorList.length]
              }
            }
          })
          .filter(item => item.value > 0)
      }

      const baseData = this.getBaseDoubleRingData()
      return baseData
        .filter((_, index) => index % 2 === 0)
        .map((item, index) => ({
          ...item,
          itemStyle: Object.assign({}, item.itemStyle || {}, {
            color: this.leftColorList[index % this.leftColorList.length]
          })
        }))
    },

    rightPieData() {
      if (!this.doubleRing) return []

      if (this.hasCustomDoubleRingFields) {
        const cur = this.activeCategoryData
        if (!cur) return []

        return this.doubleRingFields.right
          .map((field, index) => {
            const key = typeof field === 'string' ? field : field.key
            const name = typeof field === 'string' ? field : (field.name || field.key)

            return {
              name,
              value: Number(cur[key] || 0),
              itemStyle: {
                color: this.rightColorList[index % this.rightColorList.length]
              }
            }
          })
          .filter(item => item.value > 0)
      }

      const baseData = this.getBaseDoubleRingData()
      return baseData
        .filter((_, index) => index % 2 !== 0)
        .map((item, index) => ({
          ...item,
          itemStyle: Object.assign({}, item.itemStyle || {}, {
            color: this.rightColorList[index % this.rightColorList.length]
          })
        }))
    },

    getCenterTextLayerStyle() {
      const fontSize = this.centerText.fontSize && this.centerText.fontSize[0]
        ? this.centerText.fontSize[0] + 'px'
        : '16px'
      const color = this.centerText.color && this.centerText.color[0]
        ? this.centerText.color[0]
        : '#8798AD'
      const lineHeight = this.centerText.lineHeight
        ? this.centerText.lineHeight + 'px'
        : '45px'

      return {
        fontSize,
        color,
        lineHeight
      }
    },

    showSingleCenterText() {
      return !this.doubleRing &&
        this.centerText &&
        this.centerText.show &&
        this.centerText.text &&
        this.centerText.text.length
    }
  },

  watch: {
    chartData: {
      deep: true,
      handler() {
        this.initDefaultCategory()
        this.renderChart()
      }
    },
    currentCategoryName() {
      this.renderChart()
    },
    doubleRing() {
      this.renderChart()
    },
    doubleRingFields: {
      deep: true,
      handler() {
        this.renderChart()
      }
    },
    doubleRingColorList: {
      deep: true,
      handler() {
        this.renderChart()
      }
    },
    doubleRingLabel: {
      deep: true,
      handler() {
        this.renderChart()
      }
    },
    pieConfig: {
      deep: true,
      handler() {
        this.renderChart()
      }
    },
    label: {
      deep: true,
      handler() {
        this.renderChart()
      }
    },
    labelLine: {
      deep: true,
      handler() {
        this.renderChart()
      }
    },
    legend: {
      deep: true,
      handler() {
        this.renderChart()
      }
    },
    tooltip: {
      deep: true,
      handler() {
        this.renderChart()
      }
    },
    title: {
      deep: true,
      handler() {
        this.renderChart()
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initDefaultCategory()
      this.initChart()
      this.resizeHandler = () => {
        if (this.chartInstance) {
          this.chartInstance.resize()
        }
      }
      window.addEventListener('resize', this.resizeHandler)
    })
  },

  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
      this.chartInstance = null
    }
    window.removeEventListener('resize', this.resizeHandler)
  },

  methods: {
    initDefaultCategory() {
      if (!Array.isArray(this.chartData) || !this.chartData.length) {
        this.currentCategoryName = ''
        return
      }

      if (!this.showFilterButtons) {
        this.currentCategoryName = ''
        return
      }

      if (this.defaultCategoryName) {
        const matched = this.chartData.find(
          item => item[this.categoryField] === this.defaultCategoryName
        )
        if (matched) {
          this.currentCategoryName = matched[this.categoryField]
          return
        }
      }

      this.currentCategoryName = this.chartData[0][this.categoryField]
    },

    handleCategoryChange(item) {
      const name = item[this.categoryField]
      if (name === this.currentCategoryName) return
      this.currentCategoryName = name
    },

    getNameStyle() {
      const fontSize = this.centerText.fontSize && this.centerText.fontSize[0]
        ? this.centerText.fontSize[0] + 'px'
        : '16px'
      const color = this.centerText.color && this.centerText.color[0]
        ? this.centerText.color[0]
        : '#8798AD'
      const fontWeight = this.centerText.fontWeight && this.centerText.fontWeight[0]
        ? this.centerText.fontWeight[0]
        : 400

      return {
        fontSize,
        color,
        fontWeight
      }
    },

    getValueStyle() {
      const fontSize = this.centerText.fontSize && this.centerText.fontSize[1]
        ? this.centerText.fontSize[1] + 'px'
        : '28px'
      const color = this.centerText.color && this.centerText.color[1]
        ? this.centerText.color[1]
        : '#FFFFFF'
      const fontWeight = this.centerText.fontWeight && this.centerText.fontWeight[1]
        ? this.centerText.fontWeight[1]
        : 700

      return {
        fontSize,
        color,
        fontWeight,
        marginLeft: '8px'
      }
    },

    initChart() {
      const container = this.$refs.chartRef
      if (!container) return

      if (this.chartInstance) {
        this.chartInstance.dispose()
      }

      this.chartInstance = echarts.init(container)
      this.renderChart()
    },

    getBaseDoubleRingData() {
      if (
        Array.isArray(this.chartData) &&
        this.chartData.every(item =>
          Object.prototype.hasOwnProperty.call(item, 'name') &&
          Object.prototype.hasOwnProperty.call(item, 'value')
        )
      ) {
        return this.chartData
          .map((item, index) => ({
            name: item.name,
            value: Number(item.value || 0),
            itemStyle: Object.assign(
              { color: this.colorList[index % this.colorList.length] },
              item.itemStyle || {}
            )
          }))
          .filter(item => item.value > 0)
      }

      const cur = this.activeCategoryData
      if (!cur) return []

      return Object.keys(cur)
        .filter(key => key !== this.categoryField && typeof cur[key] !== 'object')
        .map((key, index) => ({
          name: key,
          value: Number(cur[key] || 0),
          itemStyle: {
            color: this.colorList[index % this.colorList.length]
          }
        }))
        .filter(item => item.value > 0)
    },

    buildTooltip() {
      const unit = this.valueSuffix || ''
      const baseTooltip = this.tooltip || {}

      return Object.assign({}, baseTooltip, {
        trigger: 'item',
        formatter: (params) => {
          const percent = params.percent || 0
          return `
            <div style="min-width:120px;">
              <div style="margin-bottom:6px;color:${params.color};font-size:14px;font-weight:600;">
                ${params.name}
              </div>
              <div style="margin:4px 0;color:#E5E6EB;">
                数值：
                <span style="color:${params.color};font-weight:700;">
                  ${params.value}
                </span>${unit}
              </div>
              <div style="margin:4px 0;color:#8FB3FF;">
                占比：${percent}%
              </div>
            </div>
          `
        }
      })
    },

    getLabelFormatter() {
      return (params) => {
        if (this.label && typeof this.label.formatter === 'function') {
          return this.label.formatter(params)
        }

        if (this.label && typeof this.label.formatter === 'string') {
          return this.label.formatter
            .replace('{b}', params.name)
            .replace('{c}', params.value)
            .replace('{d}', params.percent)
        }

        return `${params.name}\n${params.percent}%`
      }
    },

    getMergedLabelConfig(side = '') {
      const base = this.label || {}
      const sideCfg =
        side && this.doubleRingLabel && this.doubleRingLabel[side]
          ? this.doubleRingLabel[side]
          : {}

      return {
        show: base.show === true,
        color: sideCfg.color || base.color || '#E5E6EB',
        fontSize: sideCfg.fontSize || base.fontSize || 14,
        fontWeight: sideCfg.fontWeight || base.fontWeight || 400,
        formatter: this.getLabelFormatter()
      }
    },

    buildSingleSeries(config) {
      const { title, labelLine } = this
      const {
        isRing = true,
        radius = ['42%', '68%'],
        center = ['50%', '50%']
      } = config

      const labelCfg = this.getMergedLabelConfig()

      return [
        {
          name: title && title.text ? title.text : '数据统计',
          type: 'pie',
          radius,
          center,
          data: this.singlePieData,
          color: this.colorList,
          avoidLabelOverlap: true,
          startAngle: 90,
          minAngle: 3,
          selectedMode: false,
          label: {
            show: labelCfg.show,
            color: labelCfg.color,
            fontSize: labelCfg.fontSize,
            fontWeight: labelCfg.fontWeight,
            formatter: labelCfg.formatter,
            position: isRing ? 'outside' : 'inside'
          },
          labelLine: {
            show: isRing && labelCfg.show && labelLine && labelLine.show === true,
            length: (labelLine && labelLine.length) || 14,
            length2: (labelLine && labelLine.length2) || 16,
            lineStyle: (labelLine && labelLine.lineStyle) || {
              color: '#6A8ACD',
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderWidth: 2,
            borderColor: '#071A3A'
          },
          emphasis: {
            focus: 'self',
            scale: true,
            scaleSize: 8,
            itemStyle: {
              shadowBlur: 18,
              shadowColor: 'rgba(0, 217, 255, 0.28)'
            }
          }
        }
      ]
    },

    buildDoubleSeries(config) {
      const { title, labelLine } = this
      const {
        isRing = true,
        doubleRadius = ['40%', '56%'],
        leftCenter = ['30%', '48%'],
        rightCenter = ['70%', '48%']
      } = config

      const leftLabelCfg = this.getMergedLabelConfig('left')
      const rightLabelCfg = this.getMergedLabelConfig('right')

      return [
        {
          name: (title && title.text ? title.text : '数据统计') + '-左',
          type: 'pie',
          radius: doubleRadius,
          center: leftCenter,
          data: this.leftPieData,
          color: this.leftColorList,
          avoidLabelOverlap: true,
          startAngle: 90,
          minAngle: 3,
          selectedMode: false,
          label: {
            show: leftLabelCfg.show,
            color: leftLabelCfg.color,
            fontSize: leftLabelCfg.fontSize,
            fontWeight: leftLabelCfg.fontWeight,
            formatter: leftLabelCfg.formatter,
            position: isRing ? 'outside' : 'inside'
          },
          labelLine: {
            show: isRing && leftLabelCfg.show && labelLine && labelLine.show === true,
            length: (labelLine && labelLine.length) || 14,
            length2: (labelLine && labelLine.length2) || 16,
            lineStyle: (labelLine && labelLine.lineStyle) || {
              color: '#6A8ACD',
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderWidth: 2,
            borderColor: '#071A3A'
          },
          emphasis: {
            focus: 'self',
            scale: true,
            scaleSize: 8,
            itemStyle: {
              shadowBlur: 18,
              shadowColor: 'rgba(0, 217, 255, 0.28)'
            }
          }
        },
        {
          name: (title && title.text ? title.text : '数据统计') + '-右',
          type: 'pie',
          radius: doubleRadius,
          center: rightCenter,
          data: this.rightPieData,
          color: this.rightColorList,
          avoidLabelOverlap: true,
          startAngle: 90,
          minAngle: 3,
          selectedMode: false,
          label: {
            show: rightLabelCfg.show,
            color: rightLabelCfg.color,
            fontSize: rightLabelCfg.fontSize,
            fontWeight: rightLabelCfg.fontWeight,
            formatter: rightLabelCfg.formatter,
            position: isRing ? 'outside' : 'inside'
          },
          labelLine: {
            show: isRing && rightLabelCfg.show && labelLine && labelLine.show === true,
            length: (labelLine && labelLine.length) || 14,
            length2: (labelLine && labelLine.length2) || 16,
            lineStyle: (labelLine && labelLine.lineStyle) || {
              color: '#6A8ACD',
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderWidth: 2,
            borderColor: '#071A3A'
          },
          emphasis: {
            focus: 'self',
            scale: true,
            scaleSize: 8,
            itemStyle: {
              shadowBlur: 18,
              shadowColor: 'rgba(0, 217, 255, 0.28)'
            }
          }
        }
      ]
    },

    renderChart() {
      if (!this.chartInstance) return
      if (!Array.isArray(this.chartData)) return

      const seriesData = this.doubleRing
        ? [...this.leftPieData, ...this.rightPieData]
        : this.singlePieData

      if (!seriesData.length) {
        this.chartInstance.clear()
        return
      }

      const { title, pieConfig = {}, legend } = this

      const option = {
        backgroundColor: 'transparent',
        title: {
          show: title && title.show === true,
          text: (title && title.text) || '数据统计',
          subtext: this.showFilterButtons
            ? (this.currentCategoryName || '')
            : ((title && title.subText) || ''),
          left: 'center',
          top: 10,
          textStyle: {
            color: (title && title.color) || '#FFFFFF',
            fontSize: (title && title.fontSize) || 16,
            fontWeight: 600
          },
          subtextStyle: {
            color: (title && title.subColor) || '#8798AD',
            fontSize: 12
          }
        },
        legend: {
          show: (legend && legend.show === true) && seriesData.length > 1,
          top: ['top', 'bottom'].includes(legend && legend.position) ? 15 : 'center',
          left: ['left', 'right'].includes(legend && legend.position) ? 15 : 'center',
          orient: ['top', 'bottom'].includes(legend && legend.position) ? 'horizontal' : 'vertical',
          textStyle: {
            color: (legend && legend.textColor) || '#8798AD',
            fontSize: (legend && legend.fontSize) || 12
          },
          itemWidth: (legend && legend.itemWidth) || 10,
          itemGap: (legend && legend.itemGap) || 12,
          icon: 'circle'
        },
        tooltip: this.buildTooltip(),
        series: this.doubleRing
          ? this.buildDoubleSeries(pieConfig)
          : this.buildSingleSeries(pieConfig)
      }

      this.chartInstance.clear()
      this.chartInstance.setOption(option, true)
      this.chartInstance.resize()
    }
  }
}
</script>

<style scoped>
.echart-pie-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-sizing: border-box;
  background: transparent;
}

.echart-pie-top {
  flex: 1;
  height: 100%;
  width: 100%;
}

.echart-pie-bottom {
  width: 100%;
  padding: 10px 6px 35px;
  box-sizing: border-box;
}

.echart-pie {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  background: transparent;
  min-height: 260px;
  position: relative;
  width: 100%;
  height: 100%;
}

.chart-inner {
  width: 100%;
  height: 100%;
}

.center-text-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: left;
  z-index: 9;
  pointer-events: none;
}

.text-row {
  display: block;
  margin: 4px 0;
  white-space: nowrap;
}

.text-name {
  display: inline-block;
}

.text-value {
  display: inline-block;
}

.metric-btn-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.metric-btn-item {
  min-width: 110px;
  padding: 10px 18px;
  box-sizing: border-box;
  text-align: center;
  font-size: 14px;
  color: #cfe7ff;
  border: 1px solid rgba(0, 191, 255, 0.45);
  border-radius: 10px;
  background: rgba(10, 25, 41, 0.42);
  cursor: pointer;
  user-select: none;
  transition: all 0.25s ease;
  box-shadow:
    inset 0 0 10px rgba(0, 180, 255, 0.08),
    0 0 8px rgba(0, 180, 255, 0.08);
}

.metric-btn-item:hover {
  color: #ffffff;
  border-color: #00f0ff;
  box-shadow:
    inset 0 0 12px rgba(0, 240, 255, 0.12),
    0 0 12px rgba(0, 240, 255, 0.2);
  transform: translateY(-1px);
}

.metric-btn-item.active {
  color: #ffffff;
  border-color: #00f0ff;
  background: linear-gradient(
    135deg,
    rgba(0, 240, 255, 0.18),
    rgba(0, 128, 255, 0.12)
  );
  box-shadow:
    inset 0 0 14px rgba(0, 240, 255, 0.14),
    0 0 14px rgba(0, 240, 255, 0.26);
  font-weight: 600;
}
</style>