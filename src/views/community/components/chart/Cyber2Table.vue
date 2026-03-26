<template>
  <div class="cyber-table-container">
    <div class="cyber-table-wrapper">
      <!-- 表头 -->
      <div class="cyber-table-header" ref="tableHeader">
        <!-- 多级表头 -->
        <template v-if="hasMultiHeader">
          <div
            class="cyber-table-header-grid"
            :style="headerGridStyle"
          >
            <div
              v-for="(cell, index) in headerGridCells"
              :key="`header-cell-${index}`"
              class="cyber-table-header-cell"
              :class="{ sortable: !!cell.sortable }"
              :style="getMergedHeaderCellStyle(cell)"
              @click="() => cell.sortable && handleSortClick(cell.prop)"
            >
              <span class="header-text">{{ cell.label }}</span>
              <span
                v-if="cell.sortable"
                class="sort-icon"
                :class="{ active: currentSort.prop === cell.prop }"
              >
                {{ currentSort.order === 'asc' ? '↑' : '↓' }}
              </span>
            </div>
          </div>
        </template>

        <!-- 单级表头 -->
        <template v-else>
          <div class="cyber-table-header-grid" :style="singleGridStyle">
            <div
              v-for="(column, index) in finalColumns"
              :key="index"
              class="cyber-table-header-cell"
              :class="{ sortable: !!column.sortable }"
              :style="{ textAlign: column.align || 'center' }"
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
        </template>
      </div>

      <!-- 表格内容区 -->
      <div class="cyber-table-body" ref="tableBody" :style="{ height: bodyAreaHeight }">
        <div :class="`table-content`">
          <div
            v-for="(row, rowIndex) in data"
            :key="rowIndex"
            class="cyber-table-row-grid"
            :style="getRowStyle()"
          >
            <div
              v-for="(column, colIndex) in finalColumns"
              :key="colIndex"
              class="cyber-table-cell"
              :style="{ textAlign: column.align || 'center' }"
            >
              <template v-if="column.render">
                <component :is="column.render(row, column)" />
              </template>

              <template v-else-if="isRatioColumn(column.prop)">
                <span
                  class="ratio-tag"
                  :class="getRatioClass(row[column.prop])"
                >
                  {{ formatRatioText(row[column.prop]) }}
                </span>
              </template>

              <template v-else>
                <span class="cell-text">{{ formatCellText(row[column.prop]) }}</span>
              </template>
            </div>
          </div>
        </div>

        <div v-if="showMoreBtn" class="more-btn-wrapper">
          <button class="more-btn" @click="viewMore()">查看更多</button>
        </div>
      </div>

      <div v-if="!data.length" class="empty-data" :style="{ height: emptyAreaHeight }">
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
    headerRows: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    currentSort: {
      type: Object,
      default: () => ({ prop: '', order: '' })
    },
    enableSort: {
      type: Boolean,
      default: true
    },
    showMore: {
      type: Boolean,
      default: true
    },
    ratioConfig: {
      type: Object,
      default: () => ({
        enable: false,
        columns: []
      })
    },
    headerCellHeight: {
      type: Number,
      default: 48
    },

    // 新增：是否在数据不足时自动撑满表格内容区
    fillEmptySpace: {
      type: Boolean,
      default: false
    },

    // 基础行高
    baseRowHeight: {
      type: Number,
      default: 44
    }
  },

  data() {
    return {
      needMoreBtn: false,
      rowHeight: 44,
      bodyHeight: 0,
      dynamicRowHeight: 44
    };
  },

  computed: {
    showMoreBtn() {
      return this.showMore && this.needMoreBtn;
    },

    hasMultiHeader() {
      return Array.isArray(this.headerRows) && this.headerRows.length > 0;
    },

    finalColumns() {
      if (Array.isArray(this.columns) && this.columns.length) {
        return this.columns;
      }

      if (this.hasMultiHeader) {
        const lastRow = this.headerRows[this.headerRows.length - 1] || [];
        return lastRow
          .filter(item => item.prop)
          .map(item => ({
            label: item.label,
            prop: item.prop,
            width: item.width,
            align: item.align || 'center',
            sortable: !!item.sortable
          }));
      }

      return [];
    },

    normalizedHeaderRows() {
      if (!this.hasMultiHeader) return [];

      return this.headerRows.map(row =>
        row.map(cell => ({
          label: cell.label || '',
          prop: cell.prop || '',
          align: cell.align || 'center',
          sortable: !!cell.sortable,
          rowspan: Number(cell.rowspan || 1),
          colspan: Number(cell.colspan || 1)
        }))
      );
    },

    gridTemplateColumns() {
      if (!this.finalColumns.length) return '';
      return this.finalColumns.map(col => col.width || '1fr').join(' ');
    },

    headerGridStyle() {
      return {
        display: 'grid',
        gridTemplateColumns: this.gridTemplateColumns,
        gridTemplateRows: `repeat(${this.normalizedHeaderRows.length}, ${this.headerCellHeight}px)`
      };
    },

    singleGridStyle() {
      return {
        display: 'grid',
        gridTemplateColumns: this.gridTemplateColumns
      };
    },

    headerGridCells() {
      if (!this.hasMultiHeader) return [];

      const rows = this.normalizedHeaderRows;
      const rowCount = rows.length;
      const colCount = this.finalColumns.length;

      const occupied = Array.from({ length: rowCount }, () => Array(colCount).fill(false));
      const result = [];

      for (let r = 0; r < rowCount; r++) {
        let colPointer = 0;
        const row = rows[r];

        for (let i = 0; i < row.length; i++) {
          const cell = row[i];

          while (colPointer < colCount && occupied[r][colPointer]) {
            colPointer++;
          }

          const startCol = colPointer;
          const endCol = startCol + cell.colspan - 1;
          const endRow = r + cell.rowspan - 1;

          for (let rr = r; rr <= endRow; rr++) {
            for (let cc = startCol; cc <= endCol; cc++) {
              if (occupied[rr] && occupied[rr][cc] !== undefined) {
                occupied[rr][cc] = true;
              }
            }
          }

          result.push({
            ...cell,
            gridColumnStart: startCol + 1,
            gridColumnEnd: startCol + cell.colspan + 1,
            gridRowStart: r + 1,
            gridRowEnd: r + cell.rowspan + 1
          });

          colPointer = endCol + 1;
        }
      }

      return result;
    },

    headerTotalHeight() {
      const headerRowsCount = this.hasMultiHeader ? this.normalizedHeaderRows.length : 1;
      return headerRowsCount * this.headerCellHeight;
    },

    bodyAreaHeight() {
      return `calc(100% - ${this.headerTotalHeight}px)`;
    },

    emptyAreaHeight() {
      return `calc(100% - ${this.headerTotalHeight}px)`;
    }
  },

  watch: {
    data: {
      deep: true,
      handler() {
        this.$nextTick(() => this.updateTableLayout());
      }
    },
    columns: {
      deep: true,
      handler() {
        this.$nextTick(() => this.updateTableLayout());
      }
    },
    headerRows: {
      deep: true,
      handler() {
        this.$nextTick(() => this.updateTableLayout());
      }
    },
    fillEmptySpace() {
      this.$nextTick(() => this.updateTableLayout());
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.updateTableLayout();
    });

    this._resizeHandler = () => {
      this.$nextTick(() => this.updateTableLayout());
    };
    window.addEventListener('resize', this._resizeHandler);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this._resizeHandler);
  },

  methods: {
    calcBaseParams() {
      if (!this.$refs.tableBody) return;

      this.bodyHeight = this.$refs.tableBody.clientHeight || 0;

      const firstRow = this.$refs.tableBody.querySelector('.cyber-table-row-grid');
      this.rowHeight = (firstRow && firstRow.offsetHeight) || this.baseRowHeight;
    },

    updateTableLayout() {
      if (!this.data.length) {
        this.needMoreBtn = false;
        this.dynamicRowHeight = this.baseRowHeight;
        return;
      }

      this.$nextTick(() => {
        this.calcBaseParams();

        const baseHeight = this.baseRowHeight;
        const totalDataHeight = this.data.length * baseHeight;

        // 是否需要查看更多
        this.needMoreBtn = totalDataHeight > this.bodyHeight;

        // 是否要自动撑满空白
        if (this.fillEmptySpace && totalDataHeight < this.bodyHeight) {
          this.dynamicRowHeight = Math.max(
            baseHeight,
            Math.floor(this.bodyHeight / this.data.length)
          );
        } else {
          this.dynamicRowHeight = baseHeight;
        }
      });
    },

    getRowStyle() {
      return {
        ...this.singleGridStyle,
        minHeight: `${this.dynamicRowHeight}px`,
        height: `${this.dynamicRowHeight}px`
      };
    },

    handleSortClick(prop) {
      if (!this.enableSort || !prop) return;
      const isCurrentProp = this.currentSort.prop === prop;
      const newOrder = isCurrentProp
        ? (this.currentSort.order === 'asc' ? 'desc' : 'asc')
        : 'asc';
      this.$emit('sort-change', { prop, order: newOrder });
    },

    viewMore() {
      this.$emit('viewMore');
    },

    isRatioColumn(prop) {
      return (
        this.ratioConfig &&
        this.ratioConfig.enable &&
        Array.isArray(this.ratioConfig.columns) &&
        this.ratioConfig.columns.includes(prop)
      );
    },

    getRatioClass(value) {
      if (value === null || value === undefined || value === '') return 'is-empty';
      const str = String(value).trim();
      if (str.startsWith('+')) return 'is-up';
      if (str.startsWith('-')) return 'is-down';

      const num = parseFloat(str);
      if (isNaN(num)) return 'is-empty';
      if (num > 0) return 'is-up';
      if (num < 0) return 'is-down';
      return 'is-flat';
    },

    formatRatioText(value) {
      if (value === null || value === undefined || value === '') return '-';

      const str = String(value).trim();
      const num = parseFloat(str);

      if (isNaN(num)) return str;
      if (num > 0) return `↑ ${str.startsWith('+') ? str : `+${str}`}`;
      if (num < 0) return `↓ ${str}`;
      return `→ ${str}`;
    },

    formatCellText(value) {
      if (value === null || value === undefined || value === '') return '-';
      return value;
    },

    getMergedHeaderCellStyle(cell) {
      return {
        gridColumn: `${cell.gridColumnStart} / ${cell.gridColumnEnd}`,
        gridRow: `${cell.gridRowStart} / ${cell.gridRowEnd}`,
        textAlign: cell.align || 'center'
      };
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
  overflow: hidden;
  border-radius: 8px;
}

.cyber-table-wrapper {
  width: 100%;
  height: 100%;
  border: 1px solid fade(@borderDark, 80%);
  border-radius: 6px;
  background: rgba(10, 25, 41, 0.85);
  box-shadow: 0 0 15px @glowSecondary, inset 0 0 10px fade(@borderDark, 50%);
  position: relative;
  overflow: hidden;
}

.cyber-table-header {
  width: 100%;
  background: linear-gradient(180deg, @glowSecondary, transparent);
  border-bottom: 1px solid fade(@mainColor, 35%);
}

.cyber-table-header-grid {
  width: 100%;
}

.cyber-table-header-cell {
  min-width: 0;
  padding: 0 10px;
  color: @mainColor;
  font-size: 14px;
  font-weight: 600;
  box-sizing: border-box;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid fade(@mainColor, 30%);
  border-bottom: 1px solid fade(@mainColor, 22%);
  background: rgba(0, 40, 95, 0.25);

  .header-text {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.sortable {
    cursor: pointer;
  }

  .sort-icon {
    margin-left: 6px;
    color: @textGray;
    font-size: 12px;
    opacity: 0;

    &.active {
      opacity: 1;
      color: @mainColor;
    }
  }

  &:hover .sort-icon {
    opacity: 1;
  }
}

.cyber-table-body {
  width: 100%;
  position: relative;
  overflow: hidden;

  .table-content {
    position: absolute;
    inset: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .cyber-table-row-grid {
    width: 100%;
    border-bottom: 1px solid fade(@borderDark, 50%);
    transition: all 0.2s ease;
    box-sizing: border-box;

    &:hover {
      background: linear-gradient(90deg, fade(@mainColor, 15%), fade(@mainColor, 5%));
    }
  }

  .cyber-table-cell {
    padding: 0 10px;
    box-sizing: border-box;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    min-height: 44px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid fade(@mainColor, 10%);

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
    }

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

      &.is-up {
        color: @upColor;
        background: @upBg;
        border-color: fade(@upColor, 80%);
      }

      &.is-down {
        color: @downColor;
        background: @downBg;
        border-color: fade(@downColor, 80%);
      }

      &.is-flat {
        color: @flatColor;
        background: @flatBg;
        border-color: fade(@flatColor, 80%);
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
  }
}

.empty-data {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: fade(@textGray, 60%);

  .empty-icon {
    font-size: 40px;
    margin-bottom: 10px;
  }

  .empty-text {
    font-size: 14px;
  }
}
</style>