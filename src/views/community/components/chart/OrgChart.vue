<template>
  <div class="tech-org-wrapper">
    <div ref="chartRef" class="chart-inner"></div>
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
  computed: {
    processedOrgData() {
      // 第一步：完整递归统计 totalCount
      const fullTree = this.buildTreeWithTotal(this.orgData, true);

      // 第二步：只保留两层显示（根节点 + 第一层子节点）
      return this.clipTreeLevel(fullTree, 1, 2);
    }
  },
  watch: {
    orgData: {
      deep: true,
      handler() {
        this.renderChart();
        this.$nextTick(() => {
          setTimeout(() => this.updateFlowEffect(), 100);
        });
      }
    },
    labelDirection() {
      this.renderChart();
      this.$nextTick(() => {
        setTimeout(() => this.updateFlowEffect(), 100);
      });
    }
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
    // 当前节点自身人数
    getSelfCount(node) {
      return Array.isArray(node && node.users) ? node.users.length : 0;
    },

    /**
     * 第一步：构建完整树，并递归统计 totalCount
     * 这里不裁剪层级，只负责把每个节点的 totalCount 算完整
     */
    buildTreeWithTotal(node, isRoot = false) {
      if (!node || typeof node !== 'object') return null;

      if (Number(node.type) === 1) {
        return null;
      }

      const children = Array.isArray(node.children) ? node.children : [];
      const visibleChildren = children
        .map(child => this.buildTreeWithTotal(child, false))
        .filter(Boolean);

      const selfCount = this.getSelfCount(node);
      const childrenTotal = visibleChildren.reduce((sum, child) => {
        return sum + Number(child.totalCount || 0);
      }, 0);

      return {
        ...node,
        _isRoot: isRoot,
        totalCount: selfCount + childrenTotal,
        children: visibleChildren,
        symbolSize: isRoot ? [130, 36] : [42, 98]
      };
    },

    /**
     * 第二步：裁剪展示层级
     * 只保留 maxLevel 层，children 超出的直接截掉
     * 但 totalCount 保留第一步已经算好的完整统计
     */
    clipTreeLevel(node, level = 1, maxLevel = 2) {
      if (!node) return null;

      const isRoot = !!node._isRoot;

      if (level >= maxLevel) {
        return {
          ...node,
          _isRoot: isRoot,
          children: [],
          // 保留已统计好的 totalCount
          totalCount: Number(node.totalCount || 0),
          symbolSize: isRoot ? [130, 36] : [42, 98]
        };
      }

      const children = Array.isArray(node.children) ? node.children : [];

      return {
        ...node,
        _isRoot: isRoot,
        totalCount: Number(node.totalCount || 0),
        children: children
          .map(child => this.clipTreeLevel(child, level + 1, maxLevel))
          .filter(Boolean),
        symbolSize: isRoot ? [130, 36] : [42, 98]
      };
    },

    // 节点显示名称：名称 + 总人数
    getDisplayName(data) {
      const name = (data && data.name) || '';
      const totalCount = Number((data && data.totalCount) || 0);

      if (!name) return '';
      return `${name}（${totalCount}）`;
    },

    // 文本格式化
    // 根节点：横向显示
    // 其他节点：纵向显示
    formatLabelText(data) {
      const name = (data && data.name) || '';
      const totalCount = Number((data && data.totalCount) || 0);
      const isRoot = !!(data && data._isRoot);

      const maxLen = 4;
      const shortName = name.length > maxLen ? name.substring(0, maxLen) : name;

      if (isRoot) {
        return `${shortName}（${totalCount}）`;
      }

      return `${shortName.split('').join('\n')}\n（${totalCount}）`;
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
      if (!this.chart) return;

      const chartData = this.processedOrgData;
      if (!chartData) {
        this.chart.clear();
        return;
      }

      const t = this.theme;

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          backgroundColor: 'rgba(5, 27, 74, 0.95)',
          borderColor: t.primary,
          borderWidth: 1,
          padding: [12, 20],
          textStyle: {
            color: '#fff',
            fontSize: 13
          },
          formatter: (params) => {
            const data = params.data || {};
            const totalCount = Number(data.totalCount || 0);
            const users = Array.isArray(data.users) ? data.users : [];

            let html = `
              <div style="
                font-weight:bold;
                color:${t.primary};
                margin-bottom:8px;
                border-bottom:1px solid rgba(0,242,254,0.3);
                padding-bottom:4px;
              ">
                ${data.name || ''}
              </div>
              <div style="font-size:12px;margin-bottom:8px;">
                总人数：<span style="color:${t.primary};">${totalCount}</span>
              </div>
            `;

            if (users.length) {
              users.forEach(u => {
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
            data: [chartData],
            top: '20%',
            left: '8%',
            bottom: '30%',
            right: '8%',
            edgeShape: 'polyline',
            layout: 'orthogonal',
            orient: 'vertical',
            symbol: 'rect',
            edgeForkPosition: '45%',

            // 兜底
            symbolSize: [42, 88],

            // 保留展开收起功能
            expandAndCollapse: true,
            // 当前数据只有两层展示，这里全部展开即可
            initialTreeDepth: 2,

            nodeGap: 130,
            levelGap: 170,

            itemStyle: {
              color: t.nodeBg,
              borderColor: t.lineColor,
              borderWidth: 1.5,
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

            label: {
              show: true,
              position: 'inside',
              color: '#fff',
              fontSize: 12,
              lineHeight: 16,
              align: 'center',
              verticalAlign: 'middle',
              formatter: (params) => this.formatLabelText(params.data)
            },

            leaves: {
              label: {
                show: true,
                position: 'inside',
                color: '#fff',
                fontSize: 12,
                lineHeight: 16,
                align: 'center',
                verticalAlign: 'middle',
                formatter: (params) => this.formatLabelText(params.data)
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
            lineStyle: {
              width: 0
            },
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

.chart-inner {
  width: 100%;
  height: 100%;
}
</style>