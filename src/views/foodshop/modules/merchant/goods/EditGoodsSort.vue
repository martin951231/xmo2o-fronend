<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :label="L('商品分类')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select style="width: 320px" v-decorator="['sort_id', { initialValue: 0, rules: [{ required: true }] }]">
            <a-select-option :value="item.sort_id" v-for="(item, index) in sortList" :key="index">{{
              item.sort_name
            }}</a-select-option>
          </a-select>
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
      title: this.L('修改分类'),
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
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
      data: {},
      sortList: [],
    }
  },
  mounted() {},
  methods: {
    edit(storeId, pigcms_id) {
      this.visible = true
      this.data.pigcms_id = pigcms_id
      this.data.store_id = storeId
      this.getSortList()
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
          values.type = 7
          if (values.sort_id <= 0) {
            this.$message.error(this.L('请选择分类'))
            this.confirmLoading = false
            return
          }
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
    getSortList() {
      this.sortList = [
        {
          sort_id: 0,
          sort_name: this.L('请选择分类'),
        },
      ]
      this.request(foodshopMerchantApi.selectSortList, this.data).then((res) => {
        this.sortList = this.sortList.concat(res)
      })
    },
    handleCancel() {
      this.visible = false
      this.form = this.$form.createForm(this)
    },
  },
}
</script>
