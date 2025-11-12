<template>
  <div v-if="formData">
    <!-- 组件描述 -->
    <componentDesc :content="desc"></componentDesc>

    <div v-if="formData" class="content">
      <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" :labelAlign="'left'">
        <a-form-model-item
          :label="L('公告')"
          :labelCol="{
            span: 8
          }"
          :wrapperCol="{
            span: 20
          }"
          :prop="'noticeTxt'"
          :rules="{
            required: true,
            message: L('请填写公告内容'),
            trigger: '',
          }"
        >
          <a-input
            :placeholder="L('请填写公告内容')"
            autoSize
            v-model="formData.noticeTxt"
            type="textarea"
            style="resize: none;"
          />
        </a-form-model-item>

        <a-form-model-item
          :label="L('背景颜色')"
          class="flex-end"
          :labelCol="{
            span: 5
          }"
          :wrapperCol="{
            span: 19
          }"
        >
          <div class="flex align-center color-picker-wrap">
            <span class="color-name">{{ formData.bg_color }}</span>
            <label for="bg_color" class="color-picker-label" :style="[{ background: formData.bg_color }]">
              <input type="color" v-model="formData.bg_color" id="bg_color" />
            </label>
            <a-button @click="resetOpt('bg_color')" type="link">{{L('重置')}}</a-button>
          </div>
        </a-form-model-item>

        <a-form-model-item
          :label="L('文字颜色')"
          class="flex-end"
          :labelCol="{
            span: 5
          }"
          :wrapperCol="{
            span: 19
          }"
        >
          <div class="flex align-center color-picker-wrap">
            <span class="color-name">{{ formData.font_color }}</span>
            <label for="font_color" class="color-picker-label" :style="[{ background: formData.font_color }]">
              <input type="color" v-model="formData.font_color" id="font_color" />
            </label>
            <a-button @click="resetOpt('font_color')" type="link">{{L('重置')}}</a-button>
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
    formContent: {
      type: [String, Object],
      default: ''
    }
  },
  data() {
    return {
      desc: {
        title: this.L('公告')
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      formData: '',
      // 背景颜色
      bg_color: '#FFF3DB',
      // 文字颜色
      font_color: '#666666'
    }
  },
  watch: {
    formContent: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.formData = {}
          for (let k in newVal) {
            this.$set(this.formData, k, newVal[k])
          }
        } else {
          this.formData = ''
        }
      }
    },
    formData: {
      deep: true,
      handler(val) {
        this.$emit('updatePageInfo', val)
      }
    }
  },
  mounted() {
    if (this.formContent) {
      this.formData = {}
      for (let k in this.formContent) {
        this.$set(this.formData, k, this.formContent[k])
      }
    }
  },
  methods: {
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
    // 颜色重置
    resetOpt(filed) {
      this.$set(this.formData, filed, this[filed])
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
