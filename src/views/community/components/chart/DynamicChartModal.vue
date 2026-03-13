<template>
  <!-- 弹窗遮罩层 -->
  <div class="modal-overlay" v-if="visible" @click.self="handleClose">
    <!-- 弹窗主体 -->
    <div class="modal-content" :style="{ width: modalWidth, height: modalHeight }">
      <!-- 弹窗头部 -->
      <div class="modal-header">
        <span class="modal-title">{{ title }}</span>
        <button class="close-btn" @click="handleClose">×</button>
      </div>

      <!-- 弹窗内容：根据type动态渲染组件 -->
      <div class="modal-body">
        <!-- 热力图（通用版：所有参数由heatmapProps透传） -->
        <component
          v-if="type === 'heatmap'"
          :is="heatmapComponent"
          v-bind="heatmapProps"
          ref="dynamicRef"
        />

        <!-- 表格（通用版：所有参数由tableProps透传） -->
        <component
          v-if="type === 'table'"
          :is="tableComponent"
          v-bind="tableProps"
          ref="dynamicRef"
          @sort-change="handleTableEvent('sort-change', $event)"
          @viewMore="handleTableEvent('viewMore', $event)"
        />
      </div>

      <!-- 弹窗底部（可选） -->
      <div class="modal-footer" v-if="showFooter">
        <button class="cancel-btn" @click="handleClose">取消</button>
        <button class="confirm-btn" @click="handleConfirm">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
// 引入基础组件（可改为异步引入，优化性能）
import EnergyHeatmap from './EnergyHeatmap.vue' // 你的热力图基础组件
import CyberTable from './CyberTable.vue'     // 你的表格基础组件

export default {
  name: 'UniversalChartModal',
  components: {
    EnergyHeatmap,
    CyberTable
  },
  props: {
    // 基础弹窗配置
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '数据详情'
    },
    // 显示类型：heatmap=热力图，table=表格
    type: {
      type: String,
      required: true,
    },
    modalWidth: {
      type: String,
      default: '80%'
    },
    modalHeight: {
      type: String,
      default: '80vh'
    },
    showFooter: {
      type: Boolean,
      default: true
    },

    // ============ 通用热力图参数（对象形式，父组件自定义所有属性） ============
    heatmapProps: {
      type: Object,
      default: () => ({})
    },
    // 可选：指定热力图组件（默认用EnergyHeatmap，可扩展其他热力图组件）
    heatmapComponent: {
      type: [String, Object],
      default: 'EnergyHeatmap'
    },

    // ============ 通用表格参数（对象形式，父组件自定义所有属性） ============
    tableProps: {
      type: Object,
      default: () => ({})
    },
    // 可选：指定表格组件（默认用CyberTable，可扩展其他表格组件）
    tableComponent: {
      type: [String, Object],
      default: 'CyberTable'
    }
  },
  emits: [
    'close',
    'confirm',
    // 表格事件透传（支持任意表格事件，通过事件名转发）
    'table-event'
  ],
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit('close')
    },
    // 确认按钮
    handleConfirm() {
      this.$emit('confirm')
    },
    // 表格事件统一转发（通用化处理）
    handleTableEvent(eventName, eventData) {
      this.$emit('table-event', { eventName, eventData })
    }
  }
}
</script>

<style scoped>
/* 样式完全复用，无修改 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: #0a101f;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 207, 250, 0.3);
  border: 1px solid #006680;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 12px 20px;
  border-bottom: 1px solid #006680;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 16px;
  color: #00cffa;
  font-weight: bold;
}

.close-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(0, 207, 250, 0.2);
}

.modal-body {
  flex: 1;
  padding: 15px;
  overflow: auto;
}

.modal-footer {
  padding: 10px 20px;
  border-top: 1px solid #006680;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn, .confirm-btn {
  padding: 6px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #006680;
  font-size: 14px;
}

.cancel-btn {
  background: transparent;
  color: #fff;
}

.cancel-btn:hover {
  border-color: #00cffa;
  color: #00cffa;
}

.confirm-btn {
  background: #00cffa;
  color: #000;
  border-color: #00cffa;
}

.confirm-btn:hover {
  background: #8b5cf6;
  border-color: #8b5cf6;
}
</style>