<template>
  <a-modal :title="title" :width="640" :visible="visible" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!--        <a-form-item label="桌位类型" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
        <!--          <a-select-->
        <!--            show-search-->
        <!--            placeholder="请选择"-->
        <!--            option-filter-prop="children"-->
        <!--            style="width: 200px"-->
        <!--            v-decorator="['tid', {initialValue:tid,rules: [{required: true, message: '请选择桌位类型！'}]}]"-->
        <!--            :filter-option="filterOption"-->
        <!--            @focus="handleFocus"-->
        <!--            @blur="handleBlur"-->
        <!--            @change="handleChange"-->
        <!--          >-->
        <!--            <a-select-option v-for="item of tableTypes" :value="item.id">-->
        <!--              {{ item.name }}-->
        <!--            </a-select-option>-->
        <!--          </a-select>-->
        <!--        </a-form-item>-->

        <!--        <a-form-item label="桌位编号" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
        <!--          <a-input v-decorator="['name', {initialValue:name,rules: [{required: true, message: '请输入桌位编号！'}]}]" />-->
        <!--        </a-form-item>-->
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import foodshopMerchantApi from '@/api/foodshop/merchant'
export default {
  data() {
    return {
      title: this.L('新建分类'),
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
      id: 0,
      store_id: 0,
      tid: null,
      name: '',
      tableTypes: [],
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
    }
  },
  mounted() {
    if (typeof this.$route.query.store_id != 'undefined') {
      this.store_id = this.$route.query.store_id
    }
  },
  methods: {
    initForm() {
      this.name = ''
      this.request(foodshopMerchantApi.tableTypeList, { store_id: this.store_id }).then((res) => {
        this.tableTypes = res
      })
    },
    addTable() {
      this.initForm()
      this.id = 0
      this.visible = true
      this.title = this.L('新建桌位')
    },
    editTable(id) {
      this.id = id
      this.visible = true
      this.title = this.L('编辑桌位')
      this.initForm()
      this.request(foodshopMerchantApi.getTable, { id: id }).then((res) => {
        this.tid = res.tid
        this.name = res.name
      })
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      this.form = this.$form.createForm(this)
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.id
          values.store_id = this.store_id
          this.request(foodshopMerchantApi.saveTable, values)
            .then((res) => {
              this.$message.success(this.id > 0 ? this.L('编辑成功') : this.L('添加成功'))
              this.form = this.$form.createForm(this)
              this.visible = false
              this.confirmLoading = false
              this.$emit('updateTableList', {})
            })
            .catch((error) => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    handleBlur() {
      console.log('blur')
    },
    handleFocus() {
      console.log('focus')
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
}
</script>