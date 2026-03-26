<template>
  <span class="org-title">
    <!-- 标题 -->
    <span class="title-text">
      {{ titleName }}

      <a-popover
        trigger="click"
        placement="bottomLeft"
        overlayClassName="org-title-date-popover"
        v-model="datePickerVisible"
      >
        <template slot="content">
          <div class="month-range-panel">
            <!-- 单个月份模式 -->
            <template v-if="isSingleMode">
              <div class="panel-row">
                <span class="panel-label">选择月份</span>
                <a-month-picker
                  v-model="innerSingleMonth"
                  format="YYYY-MM"
                  placeholder="请选择月份"
                  :allowClear="false"
                  :disabledDate="disabledSingleMonth"
                  @change="handleSingleChange"
                />
              </div>
              <div class="panel-tips">
                选择月份不能超过当前月
              </div>
            </template>

            <!-- 时间区间模式 -->
            <template v-else>
              <div class="panel-row">
                <span class="panel-label">开始月份</span>
                <a-month-picker
                  v-model="innerStartMonth"
                  format="YYYY-MM"
                  placeholder="请选择开始月份"
                  :allowClear="false"
                  :disabledDate="disabledStartMonth"
                  @change="handleStartChange"
                />
              </div>

              <div class="panel-row">
                <span class="panel-label">结束月份</span>
                <a-month-picker
                  v-model="innerEndMonth"
                  format="YYYY-MM"
                  placeholder="请选择结束月份"
                  :allowClear="false"
                  :disabledDate="disabledEndMonth"
                  @change="handleEndChange"
                />
              </div>

              <div class="panel-tips">
                最多可选12个月
                <!-- 已去除“结束月份不能超过当前月”的限制说明 -->
              </div>
            </template>

            <div class="panel-footer">
              <a-button size="small" @click="handleReset">重置</a-button>
              <a-button
                type="primary"
                size="small"
                :disabled="!canConfirm"
                @click="handleConfirm"
              >
                确定
              </a-button>
            </div>
          </div>
        </template>

        <span
          v-if="hasDisplayValue"
          class="date-range-wrap"
          @click.stop="handleDateRangeClick"
        >
          (
          <span class="title-change-type checked-type">
            {{ displayText }}
          </span>
          )
        </span>
      </a-popover>
    </span>

    <!-- More按钮 -->
    <span
      v-if="showMore"
      class="more-btn"
      @click="handleClickMore"
    >
      查看更多
    </span>
  </span>
</template>

<script>
import moment from 'moment'

export default {
  name: 'OrgTitle',
  props: {
    titleName: {
      type: String,
      default: ''
    },
    showMore: {
      type: Boolean,
      default: false
    },
    dateRange: {
      type: [Object, String],
      default: () => ({
        start_date: '',
        end_date: ''
      })
    }
  },
  data () {
    return {
      datePickerVisible: false,
      innerStartMonth: null,
      innerEndMonth: null,
      innerSingleMonth: null
    }
  },
  computed: {
    currentMonth () {
      return moment().endOf('month')
    },

    // 自动判断是否单个月份模式
    isSingleMode () {
      const val = this.dateRange

      // 字符串：2026-03
      if (typeof val === 'string') {
        return !!val
      }

      // 对象：有 start/end -> 区间模式
      if (val && typeof val === 'object') {
        const hasRangeField = 'start_date' in val || 'end_date' in val
        if (hasRangeField) return false

        // 单值对象
        if (val.date || val.month || val.value) {
          return true
        }
      }

      // 默认保留原逻辑：区间模式
      return false
    },

    canConfirm () {
      if (this.isSingleMode) {
        if (!this.innerSingleMonth) return false
        if (this.innerSingleMonth.isAfter(this.currentMonth, 'month')) return false
        return true
      }

      if (!this.innerStartMonth || !this.innerEndMonth) return false
      if (this.innerEndMonth.isBefore(this.innerStartMonth, 'month')) return false

      // 最多12个月（包含开始和结束月）
      const diff = this.innerEndMonth.diff(this.innerStartMonth, 'months')
      if (diff > 11) return false

      // 结束月超过当前月也允许点击确定，去除此处限制
      // if (this.innerEndMonth.isAfter(this.currentMonth, 'month')) return false;

      return true
    },

    displayText () {
      if (this.isSingleMode) {
        return this.formatSingleDate(this.dateRange)
      }
      return this.formatDateRange(this.dateRange)
    },

    hasDisplayValue () {
      if (this.isSingleMode) {
        return !!this.formatSingleDate(this.dateRange)
      }

      return !!(
        this.dateRange &&
        (this.dateRange.start_date || this.dateRange.end_date)
      )
    }
  },
  watch: {
    dateRange: {
      immediate: true,
      deep: true,
      handler (val) {
        this.syncInnerValue(val)
      }
    },
    datePickerVisible (val) {
      if (val) {
        this.syncInnerValue(this.dateRange)
      }
    }
  },
  methods: {
    handleClickMore () {
      this.$emit('viewMore')
    },

    handleDateRangeClick () {
      this.datePickerVisible = true
    },

    getSingleValue (val) {
      if (!val) return ''

      if (typeof val === 'string') {
        return val
      }

      if (typeof val === 'object') {
        return val.date || val.month || val.value || ''
      }

      return ''
    },

    syncInnerValue (val) {
      if (this.isSingleMode) {
        const singleValue = this.getSingleValue(val)
        this.innerSingleMonth = singleValue
          ? moment(singleValue, 'YYYY-MM')
          : null

        this.innerStartMonth = null
        this.innerEndMonth = null
        return
      }

      this.innerStartMonth = val && val.start_date
        ? moment(val.start_date, 'YYYY-MM')
        : null

      this.innerEndMonth = val && val.end_date
        ? moment(val.end_date, 'YYYY-MM')
        : null

      this.innerSingleMonth = null
    },

    formatDateRange (item) {
      if (!item || typeof item !== 'object') return ''
      const start = item.start_date || ''
      const end = item.end_date || ''
      if (start && end) return `${start} - ${end}`
      return start || end || ''
    },

    formatSingleDate (item) {
      return this.getSingleValue(item)
    },

    disabledSingleMonth (current) {
      if (!current) return false
      return current.isAfter(this.currentMonth, 'month')
    },

    disabledEndMonth (current) {
      if (!current) return false

      // 如果选了开始月
      if (this.innerStartMonth) {
        // 结束月不能早于开始月
        if (current.isBefore(this.innerStartMonth, 'month')) {
          return true
        }
      }

      // 去除“结束月不能超过当前月”的限制

      return false
    },

    disabledStartMonth (current) {
      if (!current) return false

      // 如果选了结束月
      if (this.innerEndMonth) {
        // 开始月不能晚于结束月
        if (current.isAfter(this.innerEndMonth, 'month')) {
          return true
        }
      }

      return false
    },

    handleSingleChange (value) {
      this.innerSingleMonth = value
    },

    handleStartChange (value) {
      this.innerStartMonth = value

      if (this.innerStartMonth && this.innerEndMonth) {
        // 结束月 < 开始月，自动清空结束月
        if (this.innerEndMonth.isBefore(this.innerStartMonth, 'month')) {
          this.innerEndMonth = null
          return
        }

        // 超过12个月，自动清空结束月
        const diff = this.innerEndMonth.diff(this.innerStartMonth, 'months')
        if (diff > 11) {
          this.innerEndMonth = null
        }
      }
    },

    handleEndChange (value) {
      this.innerEndMonth = value

      if (this.innerStartMonth && this.innerEndMonth) {
        // 结束月 < 开始月，自动清空开始月
        if (this.innerEndMonth.isBefore(this.innerStartMonth, 'month')) {
          this.innerStartMonth = null
          return
        }

        // 超过12个月，自动清空开始月
        const diff = this.innerEndMonth.diff(this.innerStartMonth, 'months')
        if (diff > 11) {
          this.innerStartMonth = null
        }
      }
    },

    handleReset () {
      if (this.isSingleMode) {
        this.innerSingleMonth = null
      } else {
        this.innerStartMonth = null
        this.innerEndMonth = null
      }
    },

    handleConfirm () {
      if (!this.canConfirm) return

      if (this.isSingleMode) {
        const result = this.innerSingleMonth.format('YYYY-MM')

        // 单个月份模式返回单值
        this.$emit('changeDateRange', result)
        this.datePickerVisible = false
        return
      }

      const result = {
        start_date: this.innerStartMonth.format('YYYY-MM'),
        end_date: this.innerEndMonth.format('YYYY-MM')
      }

      this.$emit('changeDateRange', result)
      this.datePickerVisible = false
    }
  }
}
</script>

<style scoped lang="less">
.org-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 2rem;
  color: #fff;
  font-size: 1.5rem;
  line-height: 1.5rem;
  margin: 0;
  position: relative;
  z-index: 1;
  padding: 1.5rem 0.8rem 1.5rem 3rem;
  white-space: nowrap;
  font-weight: 600;
  cursor: context-menu;
  overflow: visible;
}

.org-title::before {
  content: "";
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.8rem;
  height: 1.8rem;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2L2 7L12 12L22 7L12 2Z' stroke='%2300CFFA' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M2 17L12 22L22 17' stroke='%2300CFFA' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M2 12L12 17L22 12' stroke='%2300CFFA' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100% 100%;
  animation: tech-breathe 2s infinite ease-in-out;
}

.org-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0.15rem;
  background: linear-gradient(90deg, transparent, #00CFFA, #0077FF, transparent);
  background-size: 200% 100%;
  border-radius: 0.1rem;
  box-shadow: 0 0 0.5rem #00CFFA;
  animation: tech-line 3s infinite linear;
}

.title-text {
  text-shadow: 0 0 0.3rem #00CFFA, 0 0 0.6rem rgba(0,207,250,.3);
  animation: tech-breathe 2s infinite ease-in-out;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.date-range-wrap {
  margin-left: 0.4rem;
  font-size: 1.1rem;
  cursor: pointer;
  user-select: none;
}

.title-change-type {
  cursor: pointer;
}

.checked-type {
  color: #40E0D0;
  text-shadow: 0 0 0.2rem #40E0D0, 0 0 0.5rem rgba(64, 224, 208, 0.4);
  font-weight: 700;
}

.more-btn {
  position: relative;
  padding: 0.2rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: #00CFFA;
  border: 1px solid rgba(0,207,250,.6);
  border-radius: 0.3rem;
  background: rgba(0,15,30,.7);
  cursor: pointer;
  overflow: hidden;
  box-shadow: inset 0 0 .3rem #00CFFA, 0 0 .4rem rgba(0,207,250,.6);
  transition: all .3s ease;
}

.more-btn::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(0,207,250,.8), transparent);
  transition: .6s;
}

.more-btn::before {
  content: "查看更多";
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(5px) scale(.9);
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
  color: #00CFFA;
  background: rgba(0,15,30,.95);
  border: 1px solid rgba(0,207,250,.6);
  border-radius: 0.3rem;
  white-space: nowrap;
  box-shadow: 0 0 .5rem #00CFFA, inset 0 0 .3rem #00CFFA;
  opacity: 0;
  pointer-events: none;
  transition: .25s ease;
  z-index: 99;
}

.more-btn:hover {
  color: #fff;
  border-color: #00CFFA;
  box-shadow: inset 0 0 .5rem #00CFFA, 0 0 .8rem #00CFFA;
  transform: scale(1.1);
}

.more-btn:hover::after {
  left: 100%;
}

.more-btn:hover::before {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
}

.month-range-panel {
  width: 320px;
  padding: 4px 2px;
}

.panel-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.panel-label {
  width: 64px;
  flex-shrink: 0;
  color: #666;
  font-size: 13px;
}

.panel-tips {
  margin-top: 2px;
  font-size: 12px;
  color: #999;
}

.panel-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
}

@keyframes tech-breathe {
  0%,100% { opacity: .8; }
  50% { opacity: 1; }
}

@keyframes tech-line {
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
}
</style>
