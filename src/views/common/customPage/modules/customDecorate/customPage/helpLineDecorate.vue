<template>
  <div>
    <!-- 组件描述 -->
    <componentDesc :content="desc"></componentDesc>

    <div v-if="formDataDecorate" class="content">
      <a-form-model :model="formDataDecorate" :label-col="labelCol" :wrapper-col="wrapperCol" :labelAlign="'left'">
        <a-form-model-item :label="L('选择样式')">
          <div class="flex align-center justify-between">
            <span>{{ getLabel(lineStyle, formDataDecorate.aux_line_style) }}</span>
            <div>
              <a-radio-group v-model="formDataDecorate.aux_line_style" button-style="solid">
                <a-radio-button v-for="item in lineStyle" :key="item.value" :value="item.value">
                  <IconFont :type="item.icon" class="itemIcon" />
                </a-radio-button>
              </a-radio-group>
            </div>
          </div>
        </a-form-model-item>
        <a-form-model-item :label="L('左右边距')">
          <div class="flex align-center justify-between">
            <span>{{ getLabel(lineMargin, formDataDecorate.left_right_margin) }}</span>
            <div>
              <a-radio-group v-model="formDataDecorate.left_right_margin" button-style="solid">
                <a-radio-button v-for="item in lineMargin" :key="item.value" :value="item.value">
                  <IconFont :type="item.icon" class="itemIcon" />
                </a-radio-button>
              </a-radio-group>
            </div>
          </div>
        </a-form-model-item>
        <a-form-model-item
          :label="L('辅助线颜色')"
          class="flex-end"
          :labelCol="{
            span: 5
          }"
          :wrapperCol="{
            span: 19
          }"
        >
          <div class="flex align-center color-picker-wrap">
            <span class="color-name">{{ formDataDecorate.aux_line_color }}</span>
            <label
              for="aux_line_color"
              class="color-picker-label"
              :style="[{ background: formDataDecorate.aux_line_color }]"
            >
              <input type="color" v-model="formDataDecorate.aux_line_color" id="aux_line_color" />
            </label>
            <a-button @click="resetOpt('aux_line_color')" type="link">{{L('重置')}}</a-button>
          </div>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
import IconFont from '@/utils/icon'
export default {
  components: {
    componentDesc,
    IconFont
  },
  props: {
    // 表单数据
    formContent: {
      type: [String, Object],
      default: ''
    }
  },
  data() {
    return {
      desc: {
        title: this.L('辅助线')
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      formDataDecorate: '',
      lineStyle: [
        {
          value: 'solid',
          label: this.L('实线'),
          icon: 'iconCustomPageBorderLine'
        },
        {
          value: 'dashed',
          label: this.L('虚线'),
          icon: 'iconCustomPageBorderDashed'
        }
      ],
      lineMargin: [
        {
          value: 'noMargin',
          label: this.L('无边距'),
          icon: 'iconCustomPagePadding0'
        },
        {
          value: 'hasMargin',
          label: this.L('有边距'),
          icon: 'iconCustomPagePadding'
        }
      ],
      // 辅助线颜色
      aux_line_color: '#e5e5e5'
    }
  },
  watch: {
    formContent: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.formDataDecorate = {}
          for (let k in newVal) {
            this.$set(this.formDataDecorate, k, newVal[k])
          }
        } else {
          this.formDataDecorate = ''
        }
      }
    },
    formDataDecorate: {
      deep: true,
      handler(val) {
        this.$emit('updatePageInfo', val)
      }
    }
  },
  mounted() {
    if (this.formContent) {
      this.formDataDecorate = {}
      for (let k in this.formContent) {
        this.$set(this.formDataDecorate, k, this.formContent[k])
      }
    }
  },
  methods: {
    // 获取label
    getLabel(list = [], value = '') {
      let label = ''
      if (list.length) {
        list.forEach(item => {
          if (item.value == value) {
            label = item.label
          }
        })
      }
      return label
    },
    // 重置
    resetOpt(filed) {
      this.$set(this.formDataDecorate, filed, this[filed])
    }
  }
}
</script>

<style scoped>
.content {
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}
.color-picker-wrap {
  justify-content: flex-end;
}
.color-picker-label {
  width: 80px;
  height: 30px;
  border: 1px solid #666666;
}
.color-picker-label input[type='color'] {
  opacity: 0;
}
.color-name {
  height: 30px;
  line-height: 30px;
  min-width: 60px;
  text-align: left;
  margin-right: 20px;
  vertical-align: middle;
  font-size: 14px;
  font-weight: bold;
}
</style>
