<template>
  <a-modal
    :title="title"
    :width="400"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :label="L('当前库存')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            class="small-size"
            v-decorator="[
              'spec_stock',
              {
                initialValue: detail.spec_stock_type == 1 ? detail.stock_num : detail.spec_stock,
                rules: [{ required: true, message: L('请输入当前库存！') }],
              },
            ]"
            :disabled="detail.spec_stock_type == 1 ? true : false"
            :min="-1"
          />
        </a-form-item>
        <a-form-item :label="L('原始库存')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            class="small-size"
            v-decorator="[
              'spec_original_stock',
              {
                initialValue: detail.spec_stock_type == 1 ? detail.original_stock : detail.spec_original_stock,
                rules: [{ required: true, message: L('请输入原始库存！') }],
              },
            ]"
            :disabled="detail.spec_stock_type == 1 ? true : false"
            :min="-1"
          />
        </a-form-item>
        <div v-if="detail.spec_stock_type == 1" style="margin-left: 16%; margin-bottom: 10px">
          <span>{{
            L('继承商品库商品库存后，如需修改商品库该商品的当前库存则可以到商品库中修改，规格的库存为独有库存')
          }}</span>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import foodshopMerchantApi from '@/api/foodshop/merchant'

export default {
  data() {
    return {
      title: this.L('修改库存'),
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 10,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 13,
        },
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      data: {
        pigcms_id: 0,
        spec_stock: 0,
        spec_original_stock: 0,
      },
      detail: {},
    }
  },
  methods: {
    edit(pigcms_id, spec_stock, spec_original_stock, detail) {
      this.visible = true
      this.data.pigcms_id = pigcms_id
      this.data.spec_stock = spec_stock
      this.data.spec_original_stock = spec_original_stock
      this.detail = detail
      console.log(detail)
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.pigcms_id = this.data.pigcms_id
          values.type = 3
          console.log(values)
          this.request(foodshopMerchantApi.editSingleGoods, values)
            .then((res) => {
              this.$message.success(this.L('编辑成功'))
              // 调用父页面方法
              this.$emit('handleGoodsUpdate')
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.visible = false
                this.confirmLoading = false
              }, 1500)
            })
            .catch((error) => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.form = this.$form.createForm(this)
    },
    // 取消删除
    cancel() {},
  },
}
</script>
<style scoped>
.small-size {
  width: 100px;
}
</style>
