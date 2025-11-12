<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :label="L('分组名称')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'package_name',
              { initialValue: detail.package_name, rules: [{ required: true, message: L('请输入分组名称！') }] },
            ]"
          />
        </a-form-item>
        <a-form-item :label="L('可选数量')" :labelCol="labelCol" :wrapperCol="wrapperCol" :extra="L('分组可选数量一旦修改，必选菜品的设置将会被自动清空，请重新选择')">
          <a-input-number
            v-decorator="[
              'num',
              { initialValue: detail.num, rules: [{ required: true, message: L('请输入可选数量！') }] },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-spin>

    <template slot="footer">
      <a-popconfirm
        v-if="detail.id"
        class="ant-dropdown-link"
        style="float: left"
        :title="L('确认删除?')"
        :ok-text="L('确定')"
        :cancel-text="L('取消')"
        @confirm="delSort()"
        @cancel="cancel"
      >
        <a-button>{{ L('删除分组') }}</a-button>
      </a-popconfirm>
      <a-button key="back" @click="handleCancel">{{ L('取消') }}</a-button>
      <a-button key="submit" type="primary" @click="handleSubmit">{{ L('确定') }}</a-button>
    </template>
  </a-modal>
</template>

<script>
import foodshopMerchantApi from '@/api/foodshop/merchant'

export default {
  data() {
    return {
      title: this.L('新建分组'),
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
      categoryList: [],
      showMethod: [],
      detail: {
        id: 0,
        package_name: '',
        num: 1,
      },
      id: 0,
      pid: 0,
    }
  },
  mounted() {},
  methods: {
    add(pid) {
      this.visible = true
      this.pid = pid
      this.id = 0
      this.detail = {
        id: 0,
        package_name: '',
        num: 0,
      }
    },
    edit(id) {
      this.visible = true
      this.id = id
      this.detail.id = id
      // this.detail.store_id = storeId
      this.getEditInfo()
      if (this.detail.id > 0) {
        this.title = this.L('编辑分组')
      } else {
        this.title = this.L('新建分组')
      }
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.id
          values.pid = this.pid
          this.request(foodshopMerchantApi.editPackageDetail, values)
            .then((res) => {
              if (this.detail.id) {
                this.$message.success(this.L('编辑成功'))
              } else {
                this.$message.success(this.L('添加成功'))
              }
              // 调用父页面方法
              this.$emit('handleUpdate', {})
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
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
    getEditInfo() {
      this.request(foodshopMerchantApi.getPackageDetailInfo, {
        id: this.detail.id,
      }).then((res) => {
        this.detail = res.detail
        this.id = res.detail.id
        this.pid = res.detail.pid
      })
    },
    // 删除分组
    delSort() {
      this.request(foodshopMerchantApi.delPackageDetail, { id: this.detail.id })
        .then((res) => {
          this.$message.success(this.L('删除成功'))
          // 调用父页面方法
          this.$emit('handleUpdate', {})
          this.form = this.$form.createForm(this)
          this.visible = false
          this.confirmLoading = false
        })
        .catch((error) => {
          this.confirmLoading = false
        })
    },
    // 取消删除
    cancel() {},
  },
}
</script>
