<template>
  <div class="cyber-table-container">
    <div class="cyber-table-wrapper" ref="tableWrapper">
      <!-- 表头 -->
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
            <span
              v-if="column.sortable"
              class="sort-icon"
              :class="{ active: currentSort.prop === column.prop }"
            >
              {{ currentSort.order === 'asc' ? '↑' : '↓' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 表格内容区 -->
      <div class="cyber-table-body" ref="tableBody">
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
              <!-- 保留你原来的 render 扩展能力 -->
              <template v-if="column.render">
                <component :is="column.render(row, column)" />
              </template>

              <!-- 新增：环比颜色列 -->
              <template v-else-if="isRatioColumn(column.prop)">
                <span
                  class="ratio-tag"
                  :class="getRatioClass(row[column.prop])"
                >
                  {{ formatRatioText(row[column.prop]) }}
                </span>
              </template>

              <!-- 默认文本 -->
              <template v-else>
                <span class="cell-text">{{ row[column.prop] || '-' }}</span>
              </template>
            </div>
          </div>
        </div>

        <div v-if="showMoreBtn" class="more-btn-wrapper">
          <button class="more-btn" @click="viewMore()">查看更多</button>
        </div>
      </div>

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
    enableSort: { type: Boolean, default: true },

    // 是否允许显示“查看更多”
    showMore: {
      type: Boolean,
      default: true
    },

    // 新增：环比列配置
    ratioConfig: {
      type: Object,
      default: () => ({
        enable: false,
        columns: []
      })
    }
  },
  data() {
    return {
      needMoreBtn: false,
      rowHeight: 44,
      bodyHeight: 0
    };
  },
  computed: {
    // 最终是否显示查看更多
    showMoreBtn() {
      return this.showMore && this.needMoreBtn;
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.$nextTick(() => this.judgeShowMore());
      }
    },
    columns: {
      deep: true,
      handler() {
        this.$nextTick(() => this.judgeShowMore());
      }
    },
    currentSort: {
      deep: true,
      handler() {
        this.$nextTick(() => this.judgeShowMore());
      }
    },
    showMore() {
      this.$nextTick(() => this.judgeShowMore());
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.calcBaseParams();
      this.judgeShowMore();
    });

    this._resizeHandler = () => {
      this.$nextTick(() => this.judgeShowMore());
    };
    window.addEventListener('resize', this._resizeHandler);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this._resizeHandler);
  },
  methods: {
    calcBaseParams() {
      if (!this.$refs.tableBody || !this.data.length) return;
      this.bodyHeight = this.$refs.tableBody.clientHeight;
      this.rowHeight =
        this.$refs.tableBody?.querySelector('.cyber-table-row')?.offsetHeight || 44;
    },

    judgeShowMore() {
      if (!this.data.length) {
        this.needMoreBtn = false;
        return;
      }

      this.calcBaseParams();
      const totalDataHeight = this.data.length * this.rowHeight;
      this.needMoreBtn = totalDataHeight > this.bodyHeight;
    },

    handleSortClick(prop) {
      if (!this.enableSort) return;
      const isCurrentProp = this.currentSort.prop === prop;
      const newOrder = isCurrentProp
        ? (this.currentSort.order === 'asc' ? 'desc' : 'asc')
        : 'asc';
      this.$emit('sort-change', { prop, order: newOrder });
    },

    viewMore() {
      this.$emit('viewMore');
    },

    // 是否为环比列
    isRatioColumn(prop) {
      return (
        this.ratioConfig &&
        this.ratioConfig.enable &&
        Array.isArray(this.ratioConfig.columns) &&
        this.ratioConfig.columns.includes(prop)
      );
    },

    // 获取环比样式类名
    getRatioClass(value) {
      if (value === null || value === undefined || value === '') {
        return 'is-empty';
      }

      const str = String(value).trim();

      if (str.startsWith('+')) return 'is-up';
      if (str.startsWith('-')) return 'is-down';

      const num = parseFloat(str);
      if (isNaN(num)) return 'is-empty';
      if (num > 0) return 'is-up';
      if (num < 0) return 'is-down';
      return 'is-flat';
    },

    // 格式化显示文本
    formatRatioText(value) {
      if (value === null || value === undefined || value === '') return '-';

      const str = String(value).trim();
      const num = parseFloat(str);

      if (isNaN(num)) return str;

      if (num > 0) {
        return `↑ ${str.startsWith('+') ? str : `+${str}`}`;
      }
      if (num < 0) {
        return `↓ ${str}`;
      }
      return `→ ${str}`;
    }
  }
};
</script>

<style lang="less" scoped>
@mainColor: #00c3fe;
@textLight: #e5eaf5;
@textGray: #88aaff;
@borderDark: #0a1929;
@glowPrimary: #00c3fe80;
@glowSecondary: #00c3fe4D;
@gridLine: #88aaff33;

// 新增：环比标签颜色
@upColor: #00e59b;
@upBg: rgba(0, 229, 155, 0.18);
@downColor: #ff6b6b;
@downBg: rgba(255, 107, 107, 0.18);
@flatColor: #ffd166;
@flatBg: rgba(255, 209, 102, 0.18);

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

.cyber-table-body {
  width: 100%;
  height: calc(100% - 48px);
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  overflow: hidden;

  .table-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: fade(@borderDark, 50%);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: fade(@mainColor, 60%);
      border-radius: 3px;
      border: 1px solid fade(@mainColor, 80%);
      transition: all 0.2s ease;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: @mainColor;
      box-shadow: 0 0 8px @glowPrimary;
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }

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

    // 新增：环比标签
    .ratio-tag {
      min-width: 72px;
      max-width: 100%;
      height: 28px;
      line-height: 28px;
      padding: 0 10px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      text-align: center;
      box-sizing: border-box;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border: 1px solid transparent;
      transition: all 0.3s ease;

      &.is-up {
        color: @upColor;
        background: @upBg;
        border-color: fade(@upColor, 80%);
        box-shadow: 0 0 8px fade(@upColor, 20%);
      }

      &.is-down {
        color: @downColor;
        background: @downBg;
        border-color: fade(@downColor, 80%);
        box-shadow: 0 0 8px fade(@downColor, 20%);
      }

      &.is-flat {
        color: @flatColor;
        background: @flatBg;
        border-color: fade(@flatColor, 80%);
        box-shadow: 0 0 8px fade(@flatColor, 20%);
      }

      &.is-empty {
        color: @textGray;
        background: fade(@textGray, 8%);
        border-color: fade(@textGray, 20%);
      }
    }
  }

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