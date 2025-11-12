<template>
  <a-modal :title="title" :width="840" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit"
           @cancel="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', {initialValue:detail.name,rules: [{required: true, message: '请输入热搜词名称'}]}]"/>
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" help="值越大越靠前">
          <a-input-number v-decorator="['sort',{initialValue:detail.sort}]" :min="0"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import GroupPlatformApi from "@/api/group/platform";

export default {
  data() {
    return {
      title: '新建热搜词',
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
        sort: '',
      },
      cat_id: '',
      id: 0,
    }
  },
  mounted() {},
  methods: {
    // 新建热搜词
    add(cat_id) {
      this.visible = true
      this.cat_id = cat_id
      this.id = 0
      this.detail = {
        id: 0,
        name: '',
        sort: '',
      }
    },
    edit(id, cat_id) {
      this.visible = true
      this.id = id
      this.cat_id = cat_id
      this.getEditInfo()
      this.title = '编辑热搜词'
    },
    handleSubmit() {
      const {
        form: {
          validateFields
        }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        console.log(values)
        if (!errors) {
          values.cat_id = this.cat_id
          values.id = this.id
          this.request(GroupPlatformApi.addGroupSearchHot, values)
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
                this.$emit('loaddata', this.cat_id)
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
    getEditInfo() {
      this.request(GroupPlatformApi.getGroupSearchHotInfo, {
        id: this.id,
      })
        .then((res) => {
          this.showMethod = res.showMethod
          this.detail = {
            id: 0,
            name: '',
            sort: '',
          }
          if (typeof (res.detail) == 'object') {
            this.detail = res.detail
          }
          console.log('detail', this.detail)
        })
    },
  },
}
</script>
