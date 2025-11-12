<template>
  <a-modal :title="title" :width="840" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="福利名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder='限八个字'
            v-decorator="['name', {initialValue:detail.name,rules: [{required: true, max:8,message:'限八个字'}]}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import atlascategoryPlatformApi from '@/api/recruit/platform';

export default {
  data() {
    return {
      maskClosable: false,
      title: '新增福利',
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
      },
      id: 0,

    }
  },
  mounted() {},
  methods: {
    // 新增福利
    add() {
      this.visible = true
      this.id = 0
      this.title = '新增福利',
      this.detail = {
        id: 0,
        name: '',
        sort: 0,
      }
    },
    edit(id) {
      this.visible = true
      this.id = id
      this.getEditInfo(id)
      this.title = '编辑福利'
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
          this.request(atlascategoryPlatformApi.getRecruitWelfareCreate, values)
            .then((res) => {
              if (this.id > 0) {
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
      setTimeout(() => {
        this.id = '0'
        this.form = this.$form.createForm(this)
      }, 500)
    },
    getEditInfo(id) {
      this.request(atlascategoryPlatformApi.getRecruitWelfareInfo, {
        id: this.id,
      })
        .then((res) => {
          this.showMethod = res.showMethod
          this.detail = res
        })
    },
  },
}
</script>
<style>
.edui-editor-toolbarboxinner div {
  height:22px;
  line-height: 30px;
}
.edui-combox-body {
  height: 22px;
}
</style>