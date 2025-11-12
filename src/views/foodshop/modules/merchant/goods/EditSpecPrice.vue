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
      <a-form :form="form" class="scrollbar scroll_content">
        <a-form-item
          :label="item.index_name"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-for="(item, index) in data.list"
        >
          <a-input v-decorator="[`indexs[${index}]`, { initialValue: item.index }]" type="hidden" />
          <a-input
            class="small-size"
            v-decorator="[`prices[${index}]`, { initialValue: item.price }]"
            :addon-after="L('元')"
          ></a-input>
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
    edit(goodsId) {
      this.visible = true
      this.data.goods_id = goodsId
      this.getEditInfo()
    },
    // 获得商品详情
    getEditInfo() {
      this.request(foodshopMerchantApi.goodsDetail, {
        goods_id: this.data.goods_id,
      }).then((res) => {
        this.data = res
      })
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.goods_id = this.data.goods_id
          values.type = 4
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
.scrollbar {
  max-height: 600px;
  overflow-y: auto;
}
</style>
