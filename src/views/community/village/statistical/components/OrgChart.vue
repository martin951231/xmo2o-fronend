<template>
  <div class="tech-org-wrapper">
    <!-- 直接给容器加固定宽高兜底，彻底避开宽高问题 -->
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
      required: true, // 强制传参，避免空数据
      default: () => ({ name: '根节点', children: [] })
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
    // 强兜底：DOM加载完成后立即初始化，无多余嵌套
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
    // 初始化：极简逻辑，确保实例和渲染一步到位
    initChart() {
      const el = this.$refs.chartRef;
      if (!el) {
        console.error('图表容器DOM不存在');
        return;
      }
      // 强制canvas渲染，低版本ECharts最稳
      this.chart = echarts.init(el, null, { renderer: 'canvas' });
      // 首次渲染图表（含原生连线）
      this.renderChart();
      // 强制触发流光渲染，确保首次加载就有流光
      setTimeout(() => {
        this.updateFlowEffect();
      }, 100);
      // 点击节点：延迟200ms（匹配连线动画），同步更新流光
      this.chart.on('click', (params) => {
        if (params.seriesType === 'tree') {
          setTimeout(() => {
            this.updateFlowEffect();
          }, 200);
        }
      });
    },

    // 渲染主图表：保留原生连线（稳定）+ 加动画 + 所有原样式
    renderChart() {
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
          textStyle: { color: t.textColor, fontSize: 13 },
          formatter: (params) => {
            const data = params.data;
            let html = `<div style="font-weight:bold;color:${t.primary};margin-bottom:8px;border-bottom:1px solid rgba(0,242,254,0.3);padding-bottom:4px;">${data.name}</div>`;
            if (data.users && Array.isArray(data.users) && data.users.length > 0) {
              html += `<div style="display:flex;flex-direction:column;gap:4px;">`;
              data.users.forEach((user) => {
                html += `<div style="font-size:12px;"><span style="color:${t.primary};margin-right:8px;">●</span>${user}</div>`;
              });
              html += `</div>`;
            } else if (data.user) {
              html += `<div style="font-size:12px;"><span style="color:${t.primary};margin-right:8px;">●</span>${data.user}</div>`;
            } else {
              html += `<div style="font-size:12px;color:#999;">暂无成员信息</div>`;
            }
            return html;
          }
        },
        series: [
          {
            type: 'tree',
            data: [this.orgData],
            top: '8%', left: '8%', bottom: '15%', right: '8%',
            edgeShape: 'polyline', // 直角折线
            layout: 'orthogonal',
            orient: 'vertical',
            symbol: 'rect',
            symbolSize: [80, 36],
            expandAndCollapse: true,
            initialTreeDepth: -1, // 全部展开（无需标记位，避开兼容坑）
            nodeGap: 50,
            levelGap: 80,
            // 节点样式：保留所有原科技风效果
            itemStyle: {
              color: t.nodeBg,
              borderColor: t.lineColor,
              borderWidth: 1.5,
              shadowBlur: 10,
              shadowColor: t.glowColor
            },
            // 原生连线：加动画（解决展开瞬间弹出）+ 原样式
            lineStyle: {
              color: t.lineColor,
              width: 1.5,
              curveness: 0,
              animation: true, // 开启连线动画
              animationDuration: 300, // 动画时长300ms
              animationEasing: 'cubicOut' // 缓动更流畅
            },
            // 节点文字：保留原样式
            label: {
              show: true,
              position: 'inside',
              color: t.textColor,
              fontSize: 12,
              formatter: '{b}'
            },
            leaves: { label: { position: 'inside', rotate: 0 } },
            z: 2, // 节点层级高于流光
            animationDuration: 300, // 节点动画和连线同步
            edgeAnimation: true // 强制连线动画（低版本ECharts生效）
          },
          // 流光层：单独系列，仅渲染流光，无其他样式
          {
            type: 'lines',
            coordinateSystem: 'view',
            polyline: true,
            silent: true, // 不拦截点击事件
            lineStyle: { width: 0 }, // 隐藏流光层基线
            effect: {
              show: true,
              period: 3, // 流光流动速度
              trailLength: 0.3, // 流光拖尾
              symbol: 'circle',
              symbolSize: 3, // 流光圆点大小
              color: '#fff' // 流光颜色
            },
            data: [],
            z: 1 // 流光层级低于节点，高于连线（视觉更优）
          }
        ]
      };
      // 强制设置配置，开启重绘
      this.chart.setOption(option, true);
    },

    // 重写流光层：低版本ECharts全兼容，坐标100%匹配原生连线
    updateFlowEffect() {
      // 多层校验：一步为空就返回，避免报错
      if (!this.chart || !this.chart.getModel || !this.orgData.name) return;
      const seriesModels = this.chart.getModel().getSeries();
      if (!seriesModels || seriesModels.length < 1) return;
      const treeModel = seriesModels[0]; // 索引0=树形图系列（低版本兼容）
      if (!treeModel.getData || !treeModel.tree) return;

      const data = treeModel.getData();
      const tree = treeModel.tree;
      const flowData = [];

      // 低版本兼容：遍历所有节点（替代data.each）
      for (let i = 0; i < data.count(); i++) {
        const node = tree.getNodeByDataIndex(i);
        // 仅处理「有父节点+父节点未收起」的节点
        if (!node.parent || node.parent.collapsed) continue;
        // 获取节点和父节点的布局坐标（原生树形图计算好的，直接用）
        const childLayout = data.getItemLayout(i);
        const parentLayout = data.getItemLayout(node.parent.dataIndex);
        // 坐标有效性校验：避免NaN/0坐标
        if (!childLayout || !parentLayout || !childLayout.x || !parentLayout.y) continue;

        // 计算直角折线坐标（和原生连线完全一致的逻辑）
        const midY = parentLayout.y + (childLayout.y - parentLayout.y) * 0.5;
        flowData.push({
          coords: [
            [parentLayout.x, parentLayout.y], // 父节点坐标
            [parentLayout.x, midY],           // 垂直拐点
            [childLayout.x, midY],            // 水平拐点
            [childLayout.x, childLayout.y]    // 子节点坐标
          ]
        });
      }

      // 仅更新流光层（索引1），不碰树形图系列，避免重绘导致状态变化
      this.chart.setOption({
        series: [
          {}, // 占位：树形图系列（索引0），不修改
          { data: flowData } // 索引1=流光层，仅更新数据
        ]
      });
    },

    // 窗口缩放：自适应重绘，流光同步更新
    handleResize() {
      if (this.chart) {
        this.chart.resize();
        // 缩放后延迟更新流光，匹配图表重绘
        setTimeout(() => {
          this.updateFlowEffect();
        }, 100);
      }
    }
  }
};
</script>

<style scoped>
/* 容器样式：极简，强制占满父级 */
.tech-org-wrapper {
  width: 100%;
  height: 100%;
}
</style>