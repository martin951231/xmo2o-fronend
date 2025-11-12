<template>
  <a-modal
    :title="title"
    :width="840"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" style="width:880px">
          <a-input
            v-decorator="[
              'name',
              { initialValue: detail.name, rules: [{ required: true, message: '请输入姓名' }] },
            ]"
            placeholder="请输入姓名"
            style="width: 260px"
          />
        </a-form-item>
        <a-form-item label="绑定账号" :labelCol="labelCol" :wrapperCol="wrapperCol" style="width:880px">
          <a-input
            v-decorator="[
              'uid',
              { initialValue: detail.uid, rules: [{ required: true, message: '请输入手机号' }] },
            ]"
            placeholder="请输入手机号"
            style="width: 260px"
          />
        </a-form-item>
        <a-form-item label="抽成比例" :labelCol="labelCol" :wrapperCol="wrapperCol" style="width:880px">
          <a-input-number
            :min='0'
            :max='100'
            v-decorator="[
              'team_percent',
              { initialValue: detail.team_percent, rules: [{ required: true, message: '请输入0-100之前数组' }] },
            ]"
            placeholder="请输入"
            style="width: 60px"
          /> % <br>
          <span style="font-size:12px;color:#999">技术主管抽取下级技术人员所在团队的订单抽成；不填写即为0</span>
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
      title: '添加技术主管',
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
        team_percent: 0,
      },
      id: 0,
    }
  },
  mounted() {},
  methods: {
    // 添加技术主管
    add() {
      this.visible = true
      this.id = 0
      ;(this.title = '添加技术主管'),
        (this.detail = {
          id: 0,
          name: '',
          uid: '',
          team_percent: 0,
        })
      this.getDirectorList(id)
    },
    edit(id) {
      this.visible = true
      this.id = id
      this.getDirectorList(id)
      this.getEditInfo(id)
      this.title = '编辑技术主管'
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.id
          this.request(MarketingPlatformComponents.getMarketingDirectorCreate, values)
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
      this.request(MarketingPlatformComponents.getMarketingDirectorInfo, {
        id: this.id,
      }).then((res) => {
        this.detail = {
          id: res.id,
          name: res.name,
          uid: res.uid,
          team_percent: res.team_percent,
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