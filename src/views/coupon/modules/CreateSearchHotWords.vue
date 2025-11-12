<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="搜索词" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入搜索词名称'}]}]" />
        </a-form-item>
        <a-form-item label="排序值" :labelCol="labelCol" :wrapperCol="wrapperCol" help="值越大，排序越前">
          <a-input-number v-decorator="['sort',{initialValue:detail.sort}]" :min="0"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import couponPlatformApi from '@/api/coupon/platform';
  export default {
    data() {
      return {
        title: '新建搜索词',
        labelCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 7
          }
        },
        wrapperCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 13
          }
        },
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        detail: {
          id: 0,
          name: '',
          sort: 0,
          is_hot:'0'
        },
        id: '0',
      }
    },
    mounted() {
      this.getEditInfo();
      console.log( this.catFid)
    },
    methods: {
      add() {
        this.visible = true
        this.id = '0'
        this.detail = {
          id: 0,
          name: '',
          sort: 0,
          is_hot:'0'
        }
      },
      edit(id) {
        this.visible = true
        this.id = id
        this.getEditInfo()
        if (this.id > 0) {
          this.title = '编辑搜索词'
        } else {
          this.title = '新建搜索词'
        }
      },
      handleSubmit() {
        const {
          form: {
            validateFields
          }
        } = this
        this.confirmLoading = true
        validateFields((errors, values) => {
          if (!errors) {
            values.id = this.id
            this.request(couponPlatformApi.saveWords, values)
              .then((res) => {
                if (this.id>0) {
                  this.$message.success('编辑成功')
                } else {
                  this.$message.success('添加成功')
                }
                setTimeout(() => {
                  this.form = this.$form.createForm(this)
                  this.visible = false
                  this.confirmLoading = false
                  this.$emit('ok', values)
                }, 1500)
              })
              .catch((error)=>{
                  this.confirmLoading = false
              })

          } else {
            this.confirmLoading = false
          }
        })
      },
      handleCancel() {
        this.visible = false
          this.id = '0'
          this.form = this.$form.createForm(this)
      },
      getEditInfo() {
        this.request(couponPlatformApi.getWordDetail, {
            id: this.id
          })
          .then((res) => {
              this.detail = res
          })
      }
    },
  }
</script>
