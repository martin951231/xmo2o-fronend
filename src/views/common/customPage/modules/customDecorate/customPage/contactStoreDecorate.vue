<template>
  <div>
    <!-- 组件描述 -->
    <componentDesc :content="desc"></componentDesc>

    <div v-if="formData" class="content">
      <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" :labelAlign="'left'">
        <a-form-model-item :label="L('拨号按钮')">
          <div class="flex align-center justify-between">
            <span>{{ formData.show_phone_icon == 1 ? L('显示') : L('不显示') }}</span>
            <a-checkbox
              :checked="formData.show_phone_icon == 1 ? true : false"
              :disabled="formData.show_address_icon == 2 ? true : false"
              :default-checked="formData.show_address_icon == 2 ? true : false"
              @change="showPhoneChange"
            >
            </a-checkbox>
          </div>
        </a-form-model-item>

        <a-form-model-item :label="L('店铺地址')">
          <div class="flex align-center justify-between">
            <span>{{ formData.show_address_icon == 1 ? L('显示') : L('不显示') }}</span>
            <a-checkbox
              :checked="formData.show_address_icon == 1 ? true : false"
              @change="showAddChange"
              :disabled="formData.show_phone_icon == 2 ? true : false"
              :default-checked="formData.show_phone_icon == 2 ? true : false"
            ></a-checkbox>
          </div>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import componentDesc from '@/views/common/customPage/modules/common/componentDesc'
export default {
  components: {
    componentDesc
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
        title: this.L('联系店铺')
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      formData: ''
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
    // 显示拨号按钮 1 显示 2 隐藏
    showPhoneChange(e) {
      this.$set(this.formData, 'show_phone_icon', e.target.checked ? 1 : 2)
    },
    // 显示店铺地址按钮  1 显示 2 隐藏
    showAddChange(e) {
      this.$set(this.formData, 'show_address_icon', e.target.checked ? 1 : 2)
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
.ant-form >>> .ant-form-item {
  margin-bottom: 0;
}
</style>
