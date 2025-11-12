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
              'stock_num',
              { initialValue: data.sort_name, rules: [{ required: true, message: L('请输入当前库存！') }] },
            ]"
            :min="-1"
          />
        </a-form-item>
        <a-form-item :label="L('原始库存')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            class="small-size"
            v-decorator="[
              'original_stock',
              { initialValue: data.sort_name, rules: [{ required: true, message: L('请输入原始库存！') }] },
            ]"
            :min="-1"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import foodshopMerchantApi from '@/api/foodshop/merchant'
import { dateToDateString } from '@/utils/util'

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
        stock_num: '',
        goods_id: 0,
        store_id: this.$route.query.store_id,
        original_stock: '',
      },
    }
  },
  mounted() {
    console.log(this.catFid)
  },
  methods: {
    moment,
    edit(storeId, pigcms_id) {
      this.visible = true
      this.data.pigcms_id = pigcms_id
      this.data.store_id = storeId
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.store_id = this.data.store_id
          values.pigcms_id = this.data.pigcms_id
          values.type = 3
          console.log(values)
          this.request(foodshopMerchantApi.editGoodsBatch, values)
            .then((res) => {
              this.$message.success(this.L('编辑成功'))
              // 调用父页面方法
              this.$emit('handleGoodsUpdate', {})
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
      // this.getEditInfo()
      this.form = this.$form.createForm(this)
    },
    //取消删除
    cancel() {},
  },
}
</script>

<style scoped>
.small-size {
  width: 100px;
}
</style>
