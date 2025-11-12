<template>
  <a-modal
    :title="title"
    :width="528"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <img :src="detail.images" style="width:480px;">
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      title: '广告图片查看',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      detail: {
        id: 0,
        images: '',
      },
    }
  },

  methods: {
    // 广告图片查看
    images(images) {
      this.visible = true
      this.title = '广告图片查看',
      this.detail = {
        id: 0,
        images: images,
      }
    },
    handleCancel() {
      this.visible = false
      setTimeout(() => {
        this.id = '0'
        this.form = this.$form.createForm(this)
      }, 500)
    },
  },
}
</script>