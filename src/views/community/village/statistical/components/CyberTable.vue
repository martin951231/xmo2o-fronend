<template>
  <div class="cyber-table-container">
    <div class="cyber-table-wrapper" ref="tableWrapper">
      <!-- 表头：自定义宽高+排序图标同步 -->
      <div class="cyber-table-header" ref="tableHeader">
        <div class="cyber-table-header-row">
          <div
            v-for="(column, index) in columns"
            :key="index"
            class="cyber-table-header-cell"
            :style="{
              width: column.width || 'auto',
              textAlign: column.align || 'center'
            }"
            @click="() => column.sortable && handleSortClick(column.prop)"
          >
            <span class="header-text">{{ column.label }}</span>
            <span v-if="column.sortable" class="sort-icon" :class="{ active: currentSort.prop === column.prop }">
              {{ currentSort.order === 'asc' ? '↑' : '↓' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 表格内容区：绝对定位彻底防撑高，超出隐藏 -->
      <div class="cyber-table-body" ref="tableBody">
        <!-- 核心：绝对定位，宽高100%，超出隐藏，永不撑高父盒 -->
        <div class="table-content">
          <div
            v-for="(row, rowIndex) in data"
            :key="rowIndex"
            class="cyber-table-row"
          >
            <div
              v-for="(column, colIndex) in columns"
              :key="colIndex"
              class="cyber-table-cell"
              :style="{
                width: column.width || 'auto',
                textAlign: column.align || 'center'
              }"
            >
              <template v-if="column.render">
                <component :is="column.render(row, column)" />
              </template>
              <span class="cell-text">{{ row[column.prop] || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- 浮动查看更多按钮：仅样式+结构，无事件，数据超出时显示 -->
        <div v-if="showMoreBtn" class="more-btn-wrapper">
          <button class="more-btn" @click="viewMore()">查看更多</button>
        </div>
      </div>

      <!-- 空数据占位：判断父组件传入的data -->
      <div v-if="!data.length" class="empty-data">
        <span class="empty-icon">⊘</span>
        <span class="empty-text">暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CyberTable',
  props: {
    columns: { type: Array, required: true, default: () => [] },
    data: { type: Array, required: true, default: () => [] },
    currentSort: { type: Object, default: () => ({ prop: '', order: '' }) },
    enableSort: { type: Boolean, default: true }
  },
  data() {
    return {
      showMoreBtn: false, // 查看更多按钮显隐
      rowHeight: 44,      // 单行高度（和样式保持一致）
      bodyHeight: 0       // 内容区可视高度
    };
  },
  watch: {
    // 数据/列/排序变化，重新判断是否显示查看更多
    data: { deep: true, handler() { this.$nextTick(() => this.judgeShowMore()); } },
    columns: { deep: true, handler() { this.$nextTick(() => this.judgeShowMore()); } },
    currentSort: { deep: true, handler() { this.$nextTick(() => this.judgeShowMore()); } }
  },
  mounted() {
    this.$nextTick(() => {
      this.calcBaseParams();
      this.judgeShowMore();
    });
    window.addEventListener('resize', () => this.$nextTick(() => this.judgeShowMore()));
  },
  beforeUnmount() {
    window.removeEventListener('resize', () => this.judgeShowMore());
  },
  methods: {
    // 计算基础参数：仅获取内容区可视高度
    calcBaseParams() {
      if (!this.$refs.tableBody || !this.data.length) return;
      this.bodyHeight = this.$refs.tableBody.clientHeight;
      // 兼容实际渲染的单行高度，避免样式修改后判断不准
      this.rowHeight = this.$refs.tableBody?.querySelector('.cyber-table-row')?.offsetHeight || 44;
    },

    // 判断是否显示查看更多：数据总高度 > 内容区可视高度 则显示
    judgeShowMore() {
      if (!this.data.length) {
        this.showMoreBtn = false;
        return;
      }
      this.calcBaseParams();
      const totalDataHeight = this.data.length * this.rowHeight;
      this.showMoreBtn = totalDataHeight > this.bodyHeight;
    },

    // 表头排序点击事件：保留原功能，向父组件派发排序指令
    handleSortClick(prop) {
      if (!this.enableSort) return;
      const isCurrentProp = this.currentSort.prop === prop;
      const newOrder = isCurrentProp
        ? (this.currentSort.order === 'asc' ? 'desc' : 'asc')
        : 'asc';
      this.$emit('sort-change', { prop, order: newOrder });
    },

    //查看更多
    viewMore(){
      this.$emit('viewMore');
    }
  }
};
</script>

<style lang="less" scoped>
// 全局主色调：#00c3fe
@mainColor: #00c3fe;
@textLight: #e5eaf5;    // 浅色文字
@textGray: #88aaff;     // 灰色文字
@borderDark: #0a1929;   // 深色边框
@glowPrimary: #00c3fe80;// 50%透明度主色
@glowSecondary: #00c3fe4D;// 30%透明度主色
@gridLine: #88aaff33;   // 网格线颜色

// 容器：继承父级宽高，作为基础定位容器
.cyber-table-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border-radius: 8px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: 20px 20px;
    z-index: 0;
    pointer-events: none;
  }
}

// 表格外框：严格继承父级宽高，永不被内容撑高
.cyber-table-wrapper {
  width: 100%;
  height: 100%;
  border: 1px solid fade(@borderDark, 80%);
  border-radius: 6px;
  background: rgba(10, 25, 41, 0.85);
  box-shadow: 0 0 15px @glowSecondary, inset 0 0 10px fade(@borderDark, 50%);
  position: relative;
  z-index: 1;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, @mainColor, transparent);
    z-index: 3;
  }
}

// 表头样式：完全保留原科技风样式，无任何修改
.cyber-table-header {
  width: 100%;
  background: linear-gradient(180deg, @glowSecondary, transparent);
  border-bottom: 1px solid @glowSecondary;
  position: sticky;
  top: 0;
  z-index: 3;
  box-sizing: border-box;

  .cyber-table-header-row {
    width: 100%;
    display: block;
    overflow: hidden;
  }

  .cyber-table-header-cell {
    height: 48px;
    padding: 0 10px;
    color: @mainColor;
    font-size: 14px;
    font-weight: 600;
    line-height: 48px;
    float: left;
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 1px;
    white-space: nowrap;

    &:not(:has(.sort-icon)) {
      cursor: default;
    }

    &:hover {
      color: #fff;
      background: fade(@mainColor, 15%);
      text-shadow: 0 0 10px @glowPrimary, 0 0 20px @glowSecondary;
    }

    .header-text {
      display: inline-block;
      max-width: 100%;
      vertical-align: middle;
    }

    .sort-icon {
      margin-left: 6px;
      color: @textGray;
      font-size: 12px;
      opacity: 0;
      transition: all 0.3s ease;

      &.active {
        opacity: 1;
        color: @mainColor;
        text-shadow: 0 0 8px @glowPrimary;
      }
    }

    &:hover .sort-icon {
      opacity: 1;
    }
  }
}

// 表格内容区：核心修改——相对定位，子元素绝对定位彻底防撑高
.cyber-table-body {
  width: 100%;
  height: calc(100% - 48px); // 固定高度=总高度-表头高度
  position: relative;        // 作为内容的定位父级
  z-index: 2;
  box-sizing: border-box;
  overflow: hidden;          // 双重保险，防止溢出

  // 核心关键：绝对定位，宽高100%，超出隐藏，脱离文档流永不撑高父盒
  .table-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;        // 仅显示可视高度内容，超出直接隐藏
  }

  // 数据行：保留所有原样式、hover特效，固定高度44px
  .cyber-table-row {
    width: 100%;
    height: 44px;
    line-height: 44px;
    display: block;
    overflow: hidden;
    border-bottom: 1px solid fade(@borderDark, 50%);
    transition: all 0.2s ease;
    box-sizing: border-box;

    &:hover {
      background: linear-gradient(90deg, fade(@mainColor, 15%), fade(@mainColor, 5%));
      box-shadow: 0 0 12px @glowSecondary, inset 0 0 8px fade(@mainColor, 10%);
      transform: scaleX(1.003);
      cursor: default;
    }
  }

  // 单元格：完全保留原样式，不换行+超长省略+固定高度
  .cyber-table-cell {
    padding: 0 10px;
    float: left;
    box-sizing: border-box;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;

    &[style*='text-align: left'] {
      justify-content: flex-start;
    }

    .cell-text {
      color: @textLight;
      font-size: 13px;
      display: inline-block;
      max-width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      text-shadow: 0 0 5px @glowSecondary, 0 0 10px fade(@mainColor, 20%);

      &:hover {
        color: @mainColor;
        text-shadow: 0 0 6px @glowPrimary, 0 0 12px @glowPrimary;
      }
    }
  }

  // 查看更多按钮容器：浮动在底部，渐变遮罩，和原样式一致
  .more-btn-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 0;
    text-align: center;
    background: linear-gradient(transparent, rgba(10, 25, 41, 0.95));
    z-index: 2;
  }

  // 查看更多按钮：保留科技风样式、hover特效，无任何事件
  .more-btn {
    padding: 4px 16px;
    border: 1px solid @mainColor;
    border-radius: 4px;
    background: fade(@borderDark, 80%);
    color: @mainColor;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    gap: 4px;
    transition: all 0.3s ease;
    box-sizing: border-box;

    &:hover {
      background: @mainColor;
      color: @borderDark;
      box-shadow: 0 0 8px @glowPrimary;
      transform: translateY(-2px);
    }
  }
}

// 空数据样式：完全保留原样式，无修改
.empty-data {
  width: 100%;
  height: calc(100% - 48px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: fade(@textGray, 60%);
  position: relative;
  z-index: 2;

  .empty-icon {
    font-size: 40px;
    margin-bottom: 10px;
    color: fade(@borderDark, 80%);
    text-shadow: 0 0 10px fade(@borderDark, 50%);
  }

  .empty-text {
    font-size: 14px;
    letter-spacing: 1px;
  }
}

// 清除浮动：保留原样式，防止列宽错乱
.cyber-table-header-row::after,
.cyber-table-row::after {
  content: '';
  display: block;
  clear: both;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}
</style>