<template>
  <a-modal :title="title" :width="640" :visible="visible" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :label="L('桌台类型')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', { initialValue: name, rules: [{ required: true, message: L('请输入桌台类型！') }] }]"
          />
        </a-form-item>

        <a-form-item :label="L('最少人数')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="[
              'min_people',
              {
                initialValue: min_people,
                rules: [
                  { required: true, message: L('请输入最少人数！') },
                  { pattern: /^[1-9]\d*$/, message: L('请填写大于0的整数！') },
                ],
              },
            ]"
          />
        </a-form-item>

        <a-form-item :label="L('最多人数')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="[
              'max_people',
              {
                initialValue: max_people,
                rules: [
                  { required: true, message: L('请输入最多人数！') },
                  { pattern: /^[1-9]\d*$/, message: L('请填写大于0的整数！') },
                ],
              },
            ]"
          />
        </a-form-item>

        <a-form-item :label="L('预定订金')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'deposit',
              { initialValue: deposit, rules: [{ pattern: /^[0-9]+(.?)[0-9]*$/, message: L('金额输入有误！') }] },
            ]"
            prefix="￥"
          />
        </a-form-item>

        <a-form-item
          :label="L('排号前缀')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :help="L('在排号时区分桌台类型（如大桌用：D,小桌用S,等，得到的排号D1、D2；S1、S2等）')"
        >
          <a-input
            v-decorator="[
              'number_prefix',
              { initialValue: number_prefix, rules: [{ required: true, message: L('请输入排号前缀！') }] },
            ]"
          />
        </a-form-item>

        <a-form-item
          :label="L('使用时间')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :help="
            L('该类型下的桌台每次使用时间大约是多长时间，如一个小时，那么下一桌大约就要60分钟后才能使用（单位：分钟）')
          "
        >
          <a-input-number
            v-decorator="[
              'use_time',
              { initialValue: use_time, rules: [{ required: true, message: L('请输入使用时间！') }] },
            ]"
            :min="0"
          />
        </a-form-item>

        <a-form-item :label="L('排序')" :help="L('值越大越靠前显示')"  :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number :min="0" :precision="0"
            v-decorator="['sort', { initialValue: sort }]"
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
      name: '',
      min_people: 1,
      max_people: 1,
      deposit: 0,
      number_prefix: '',
      use_time: 0,
      sort:0,
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
      this.min_people = 1
      this.max_people = 1
      this.deposit = 0
      this.number_prefix = ''
      this.use_time = 0
      this.sort = 0
    },
    addType() {
      this.initForm()
      this.id = 0
      this.visible = true
      this.title = this.L('新建桌台类型')
    },
    editType(id) {
      this.id = id
      this.visible = true
      this.title = this.L('编辑桌台类型')
      this.request(foodshopMerchantApi.getTableType, { id: id }).then((res) => {
        this.name = res.name
        this.min_people = res.min_people
        this.max_people = res.max_people
        this.deposit = res.deposit
        this.number_prefix = res.number_prefix
        this.use_time = res.use_time
        this.sort = res.sort
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
          this.request(foodshopMerchantApi.saveTableType, values)
            .then((res) => {
              this.$message.success(this.id > 0 ? this.L('编辑成功') : this.L('添加成功'))
              this.form = this.$form.createForm(this)
              this.visible = false
              this.confirmLoading = false
              this.$emit('updateTableTypeList', {})
            })
            .catch((error) => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
  },
}
</script>