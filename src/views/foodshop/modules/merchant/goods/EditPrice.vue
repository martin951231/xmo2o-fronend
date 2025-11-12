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
        <a-form-item :label="L('价格')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'price',
              { initialValue: data.price, rules: [{ required: true, message: L('请输入商品价格！') }] },
            ]"
            class="small-size"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import foodshopMerchantApi from '@/api/foodshop/merchant'

export default {
  data() {
    return {
      title: this.L('修改价格'),
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
        price: 0,
      },
    }
  },
  methods: {
    edit(pigcms_id, price) {
      this.visible = true
      this.data.pigcms_id = pigcms_id
      this.data.price = price
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.pigcms_id = this.data.pigcms_id
          values.type = 2
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