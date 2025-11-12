<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'name',
              { initialValue: detail.name, rules: [{ required: true, message: '请输入姓名' }] },
            ]"
            placeholder="请输入姓名"
            style="width: 260px"
          />
        </a-form-item>
        <a-form-item label="绑定账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
              'uid',
              { initialValue: detail.uid, rules: [{ required: true, message: '请输入手机号' }] },
            ]"
            placeholder="请输入手机号"
            style="width: 260px"
          />
        </a-form-item>
        <a-form-item label="选择主管" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['director_id', { initialValue: detail.director_id, rules: [{ required: false, message: '请选择主管' }] }]" placeholder="请选择主管" style="width: 260px">
            <a-select-option v-for="item in director" :key="item.director_id" :director_id="item.director_id"
              >{{ item.director_name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import MarketingPlatformComponents from '@/api/new_marketing/platform'

export default {
  data() {
    return {
      director:[],
      title: '添加技术人员',
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
      detail: {
        id: 0,
        name: '',
        uid: '',
        director_id: undefined,
      },
      id: 0,
    }
  },
  mounted() {},
  methods: {
    // 添加技术人员
    add(id) {
      this.visible = true
      this.id = 0;
      this.getDirectorList(id)
      (this.title = '添加技术人员'),
        (this.detail = {
          id: 0,
          name: '',
          uid: '',
          director_id: undefined,
        })
    },
    edit(id) {
      this.visible = true
      this.id = id
      this.getDirectorList(id)
      this.getEditInfo(id)
      this.title = '编辑技术人员'
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.id
          console.log(values)
          this.request(MarketingPlatformComponents.getMarketingArtisanCreate, values)
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
                this.$emit('loaddata', this.id)
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
      this.request(MarketingPlatformComponents.getMarketingArtisanInfo, {
        id: this.id,
      }).then((res) => {
        console.log(res.showMethod)
        this.img = res.img
        this.showMethod = res.showMethod
        this.detail = {
          id: res.id,
          name: res.name,
          uid: res.uid,
          director_id: res.director_id,
        }
        if (typeof res.detail == 'object') {
          this.detail = res.detail
        }
      })
    },
    getDirectorList(id) {
      this.request(MarketingPlatformComponents.getDirectorList, {
        id: this.id,
      }).then((res) => {
        this.director = res
        if (typeof res.detail == 'object') {
          this.detail = res.detail
        }
      })
    },
  },
}
</script>