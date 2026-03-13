<template>
  <div class="tech-org-wrapper">
    <div ref="chartRef" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'TechOrgTree',
  props: {
    orgData: {
      type: Object,
      required: true,
      default: () => ({ name: '根节点', children: [] })
    },
    labelDirection: {
      type: String,
      default: 'horizontal',
      validator: (v) => ['horizontal', 'vertical'].includes(v)
    }
  },
  data() {
    return {
      chart: null,
      theme: {
        primary: '#00f2fe',
        lineColor: '#00c3fe',
        glowColor: 'rgba(0,140,254,0.3)',
        nodeBg: 'rgba(2, 24, 68, 0.9)',
        textColor: '#fff'
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
      window.addEventListener('resize', this.handleResize);
    });
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    // 格式化文字：竖向逐字换行，横向截断
    formatLabelText(text, direction = this.labelDirection) {
      const isVertical = direction === 'vertical';
      const maxLen = isVertical ? 4 : 8;
      const shortText = text && text.length > maxLen ? text.substring(0, maxLen) : (text || '');
      return isVertical ? shortText.split('').join('\n') : shortText;
    },

    initChart() {
      const el = this.$refs.chartRef;
      if (!el) return;
      this.chart = echarts.init(el, null, { renderer: 'canvas' });
      this.renderChart();
      setTimeout(() => this.updateFlowEffect(), 100);
      this.chart.on('click', () => {
        setTimeout(() => this.updateFlowEffect(), 200);
      });
    },

    renderChart() {
      const t = this.theme;
      const isVertical = this.labelDirection === 'vertical';

      // 节点尺寸：所有节点都指定尺寸，保证框显示
      const rootSize = isVertical ? [36, 120] : [120, 36];
      const childSize = isVertical ? [36, 80] : [80, 36];
      // 竖向文字行高缩小（从20→16），横向保持20
      const labelLineHeight = isVertical ? 16 : 20;

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          backgroundColor: 'rgba(5, 27, 74, 0.95)',
          borderColor: t.primary,
          borderWidth: 1,
          padding: [12, 20],
          textStyle: { color: '#fff', fontSize: 13 },
          formatter: (params) => {
            const data = params.data;
            let html = `<div style="font-weight:bold;color:${t.primary};margin-bottom:8px;border-bottom:1px solid rgba(0,242,254,0.3);padding-bottom:4px;">${data.name}</div>`;
            if (data.users && data.users.length) {
              data.users.forEach(u => {
                html += `<div style="font-size:12px;"><span style="color:${t.primary};">●</span> ${u}</div>`;
              });
            } else {
              html += `<div style="font-size:12px;color:#999;">暂无成员</div>`;
            }
            return html;
          }
        },
        series: [
          {
            type: 'tree',
            data: [this.orgData],
            // 核心调整：top从8%→15%，让图表整体往下移，避免上层节点溢出
            top: '15%',
            left: '8%',
            bottom: '15%',
            right: '8%',
            edgeShape: 'polyline',
            layout: 'orthogonal',
            orient: 'vertical',
            symbol: 'rect', // 强制矩形框
            symbolSize: childSize, // 全局默认子节点尺寸（保证框显示）
            expandAndCollapse: true,
            initialTreeDepth: -1,
            nodeGap: isVertical ? 60 : 50,
            levelGap: isVertical ? 120 : 80,

            // 节点样式：保证框的背景、边框都显示
            itemStyle: {
              color: t.nodeBg, // 框的背景色
              borderColor: t.lineColor, // 框的边框色
              borderWidth: 1.5, // 边框宽度（必须设，否则框不明显）
              shadowBlur: 10,
              shadowColor: t.glowColor
            },
            lineStyle: {
              color: t.lineColor,
              width: 1.5,
              curveness: 0,
              animation: true,
              animationDuration: 300
            },

            // 根节点：单独放大尺寸，保证框显示
            topLevel: {
              symbolSize: [120, 36], // 根节点始终横向尺寸
              label: {
                show: true,
                position: 'inside',
                color: '#fff',
                fontSize: 120,
                lineHeight: 20,
                align: 'center',
                verticalAlign: 'middle',
                formatter: (params) => this.formatLabelText(params.name, 'horizontal')
              }
            },

            // 普通子节点：指定尺寸+样式，保证框显示
            label: {
              show: true,
              position: 'inside',
              color: '#fff',
              fontSize: 12,
              lineHeight: labelLineHeight,
              align: 'center',
              verticalAlign: 'middle',
              // formatter: (params) => this.formatLabelText(params.name, params.dataIndex && params.dataIndex <=1 ? 'horizontal' :this.labelDirection )
              formatter: (params) => this.formatLabelText(params.name, this.labelDirection )
            },

            // 叶子节点：指定尺寸，保证框显示
            leaves: {
              symbolSize: childSize,
              label: {
                show: true,
                position: 'inside',
                color: '#fff',
                fontSize: 12,
                lineHeight: labelLineHeight,
                align: 'center',
                verticalAlign: 'middle',
                formatter: (params) => this.formatLabelText(params.name, this.labelDirection)
              }
            },

            z: 2,
            animationDuration: 300,
            edgeAnimation: true
          },
          {
            type: 'lines',
            coordinateSystem: 'view',
            polyline: true,
            silent: true,
            lineStyle: { width: 0 },
            effect: {
              show: true,
              period: 3,
              trailLength: 0.3,
              symbol: 'circle',
              symbolSize: 3,
              color: '#fff'
            },
            data: [],
            z: 1
          }
        ]
      };

      this.chart.setOption(option, true);
    },

    updateFlowEffect() {
      if (!this.chart) return;

      const ecModel = this.chart.getModel();
      if (!ecModel) return;

      const series = ecModel.getSeries();
      if (!series || !series.length) return;

      const treeSeries = series.find(item => item.option && item.option.type === 'tree');
      if (!treeSeries) return;

      const data = treeSeries.getData();
      const tree = treeSeries.tree;

      if (!data || !tree || typeof tree.getNodeByDataIndex !== 'function') {
        return;
      }

      const flowData = [];

      for (let i = 0; i < data.count(); i++) {
        const node = tree.getNodeByDataIndex(i);
        if (!node || !node.parent || node.parent.collapsed) continue;

        const c = data.getItemLayout(i);
        const p = data.getItemLayout(node.parent.dataIndex);

        if (!c || !p) continue;
        if (c.x == null || c.y == null || p.x == null || p.y == null) continue;

        const my = p.y + (c.y - p.y) / 2;

        flowData.push({
          coords: [
            [p.x, p.y],
            [p.x, my],
            [c.x, my],
            [c.x, c.y]
          ]
        });
      }

      this.chart.setOption({
        series: [{}, { data: flowData }]
      });
    },

    handleResize() {
      if (this.chart) {
        this.chart.resize();
        setTimeout(() => this.updateFlowEffect(), 100);
      }
    }
  }
};
</script>

<style scoped>
.tech-org-wrapper {
  width: 100%;
  height: 100%;
}
</style>