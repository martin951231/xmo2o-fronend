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
        <a-form-item label="选择主管" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['dir_uid', { initialValue: detail.dir_uid }]" style="width: 260px">
            <a-select-option v-for="item in director" :key="item.dir_uid" :dir_uid="item.dir_uid"
              >{{ item.dir_name }}
            </a-select-option>
          </a-select>
          <br><span>更换主管后，该技术员所在的团队归新技术主管</span>
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
      director: [],
      title: '选择技术主管',
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
        dir_uid: 0,
      },
      id: 0,
    }
  },
  mounted() {},
  methods: {
    edit(id) {
      this.visible = true
      this.id = id
      this.getEditInfo(id)
      this.title = '更换技术主管'
      this.getDirectorList(id)
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.id
          this.request(MarketingPlatformComponents.getMarketingArtisanDir, values)
            .then((res) => {
              if (this.id > 0) {
                this.$message.success('更换成功')
              } else {
                this.$message.success('保存成功')
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
        this.detail = {
          id: res.id,
          name: res.name,
          uid: res.uid,
          dir_uid: res.dir_uid,
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