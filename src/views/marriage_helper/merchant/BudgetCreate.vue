<template>
  <a-modal :title="title" :width="640" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="预算名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', {initialValue:detail.name,rules: [{required: true, max:6, message: '限六个字'}]}]" placeholder="限六个字"  />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import marriageHelperCommentApi from '@/api/marriage_helper/platform'
  export default {
    data() {
      return {
        categoryList:[],
        title: '添加预算',
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
          id:0,
          cat_id:'',
          name: '',
        },
        id:0,
      }
    },
    mounted() {},
    methods: {
      edit(id) {
        this.visible = true
        this.id = id
        this.getEditInfo()
        if (this.id > 0) {
          this.title = '编辑预算'
        } else {
          this.title = '添加预算'
        }
      },
      add() {
        //新建子分类
        this.title = '添加预算'
        this.visible = true
        this.detail = {
            id: 0,
            name:'',
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
            values.id = this.detail.id
            this.request(marriageHelperCommentApi.getBudgetCreate, values)
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
                    this.$emit('loaddata', this.id)
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
          setTimeout(() => {
            this.id = '0'
            this.form = this.$form.createForm(this)
          }, 500)
      },
    //   详情
      getEditInfo() {
        this.request(marriageHelperCommentApi.getBudgetInfo, {
            id: this.id
          })
          .then((res) => {
            this.detail = {
                id: 0,
                name:'',
            }
            if (res) {
              this.detail = res
            }
          })
      },
    },
  }
</script>
