
<template>
  <a-modal :title="title" :width="350" :visible="visible" :footer="null" @cancel="handleCancel">
    <div class="content">
      <div class="code-box">
        <div class="code">
          <img :src="h5Qrcode" v-if="h5Qrcode" />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import merchantApi from '@/api/merchant/merchant/index'
export default {
  components: {},
  data() {
    return {
      title: '查看网址二维码',
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
      id: 0,
      image: '',
      visible: false,
      h5Qrcode: '',
    }
  },
  mounted() {},
  methods: {
    showModal(qrcodeUrl) {
      this.visible = true
      this.id = IDBCursor
      this.qrcodeUrl = qrcodeUrl
      this.getH5Code()
    },
    // 网页二维码
    getH5Code() {
      var url = encodeURIComponent(this.qrcodeUrl)
      this.h5Qrcode = location.origin + '/index.php?g=Index&c=Recognition&a=get_own_qrcode&qrCon=' + url
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>

<style scoped>
.content {
  overflow: hidden;
}
.code-box {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.code {
  margin: 10px;
}
.code img {
  width: 250px;
  height: 250px;
  /* border: 1px solid #c1c1c1; */
}
.error-msg {
  width: 200px;
  height: 200px;
  border: 1px solid #c1c1c1;
}
</style>
