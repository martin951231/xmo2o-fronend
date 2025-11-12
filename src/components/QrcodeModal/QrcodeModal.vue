<template>
  <div class="content">
    <a-modal :centered="true" destroyOnClose :width="width" v-model="visible" :title="title" :footer="null">
      <div class="url-box" v-if="content">
        <img :src="content.qrcode" v-if="model == 1 || model == 3"/>
        <div class="url-box-txt" v-if="model == 2 || model == 3">
          <a-input v-model="content.link_url" :disabled="true" />
          <a-button type="primary" @click="copy">{{ L('复制') }}</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>
  
  <script>
export default {
  //model弹框内容类型 1是只显示二维码 2显示链接 3全都显示
  //width弹框的宽度
  //content内容 link_url--链接 qrcode--二维码链接
  //title弹框标题
  //visible是否显示弹框
  data() {
    return {
      visible: false,
      model: 3,
      content: null,
      width: '',
      title: '',
    }
  },
  methods: {
    //复制
    copy() {
      let { link_url } = this.content
      this.$copyText(link_url)
        .then((message) => {
          this.$message.success('复制完毕')
          this.$emit('copySuccess')
        })
        .catch((err) => {
          this.$message.error('复制失败')
          this.$emit('copyRrror')
        })
    },

    showModal(
      show,
      content = {
        link_url: '', //页面链接
        qrcode: '', //二维码
      },
      model = 3,
      title = '查看链接',
      width = '30%'
    ) {
      this.visible = show
      this.model = model
      this.title = title
      this.width = width
      this.content = content;
      this.$set(this.content,'qrcode',content.qrcode)
    },
  },
}
</script>
  
<style lang="less" scoped>
.url-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.url-box img {
  width: 300px;
  height: 300px;
  margin: 0 auto;
}
.url-box-txt {
  display: flex;
}
</style>
  