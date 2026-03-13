<template>
  <div ref="chartRef" class="sunburst-chart" :style="{ width: width, height: height }"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'SunburstChart',
  props: {
    chartData: {
      type: Array,
      required: true,
      default: () => []
    },
    colorConfig: {
      type: Object,
      required: false,
      default: () => ({
        colors: ['#FFAE57', '#FF7853', '#EA5151', '#CC3F57', '#9A2555'],
        bgColor: 'transparent' // 背景透明
      })
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
  data() {
    return {
      chart: null
    };
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.initChartInstance();
    });
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    window.removeEventListener('resize', this.resizeChart);
  },
  methods: {
    initChartInstance() {
      if (!this.chart && this.$refs.chartRef) {
        this.chart = echarts.init(this.$refs.chartRef);
      }
    },

    renderChart() {
      this.initChartInstance();
      if (!this.chart) return;

      const processedData = JSON.parse(JSON.stringify(this.chartData));
      const setItemStyle = (dataList) => {
        dataList.forEach((item, index) => {
          const color = this.colorConfig.colors[index % this.colorConfig.colors.length];
          if (!item.itemStyle) {
            item.itemStyle = { color };
          }
          if (item.children && item.children.length) {
            setItemStyle(item.children);
          }
        });
      };
      setItemStyle(processedData);

      const option = {
        backgroundColor: 'transparent', // 完全透明背景
        color: this.colorConfig.colors,
        series: [
          {
            type: 'sunburst',
            center: ['50%', '50%'],
            radius: ['10%', '20%'], // 调整内外半径，让文字有空间显示
            data: processedData,
            sort: (a, b) => b.getValue() - a.getValue(),
            // 文字外显，清晰可见
            label: {
              show: true,
              position: 'outside', // 文字放在扇形外面
              color: '#fff', // 白色文字，适配深色背景
              fontSize: 12,
              distance: 10 // 文字距离扇形的距离
            },
            itemStyle: {
              borderColor: '#000', // 黑色边框，增强区分度
              borderWidth: 1
            },
            levels: [
              {
                r0: '40%',
                r: '80%',
                label: {
                  position: 'outside',
                  color: '#fff',
                  fontSize: 12,
                  distance: 10
                }
              }
            ]
          }
        ]
      };

      this.chart.clear();
      this.chart.setOption(option);

      window.removeEventListener('resize', this.resizeChart);
      window.addEventListener('resize', this.resizeChart);
    },

    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    }
  }
};
</script>

<style scoped>
.sunburst-chart {
  box-sizing: border-box;
  overflow: hidden;
  min-height: 400px;
  background: transparent !important; /* 确保容器背景透明 */
}
</style>