<template>
  <a-modal :title="title" :width="540" :visible="visiblelevel" :confirmLoading="confirmLoading" @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="行业名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请填写行业名称'}]}]"/>
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['sort', {initialValue:detail.sort,rules: [{required: false, message: '请填写排序'}]}]"/>
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
      title: '行业添加',
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
      visiblelevel: false,
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
    // 行业添加
    add(fid) {
      this.visiblelevel = true
      this.id = 0
      this.fid = fid
      this.title = '行业添加',
      this.detail = {
        id: 0,
        name: '',
        sort: 0,
      }
    },
    edit(id, fid) {
      this.visiblelevel = true
      this.id = id
      this.fid = fid
      this.getEditInfo(id)
      this.title = '行业编辑'
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
          values.fid = this.fid
          this.request(atlascategoryPlatformApi.getRecruitIndustryCreate, values)
            .then((res) => {
              if (this.id > 0) {
                this.$message.success('编辑成功')
              } else {
                this.$message.success('添加成功')
              }
              setTimeout(() => {
                this.form = this.$form.createForm(this)
                this.visiblelevel = false
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
      this.visiblelevel = false
      setTimeout(() => {
        this.id = '0'
        this.form = this.$form.createForm(this)
      }, 500)
    },
    getEditInfo(id) {
      this.request(atlascategoryPlatformApi.getRecruitIndustryInfo, {
        id: this.id,
        fid: this.fid,
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