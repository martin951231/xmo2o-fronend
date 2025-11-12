
<template>
  <a-modal :title="title" :width="720" :visible="visible" :footer="null" @cancel="handleCancel">
    <div class="content">
      <div class="code-box">
        <div class="code">
          <img :src="wxQrcode" v-if="wxQrcode" />
          <div v-if="wxErrorMsg" class="error-msg">{{ wxErrorMsg }}</div>
          <div>公众号二维码</div>
        </div>
        <div class="code">
          <img :src="h5Qrcode" v-if="h5Qrcode" />
          <div>网页二维码</div>
        </div>
        <div class="code">
          <img :src="wxappQrcode" v-if="wxappQrcode" />
          <div>小程序二维码</div>
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
      title: '店铺综合二维码',
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
      type: 'mallstore',
      image: '',
      visible: false,
      wxErrorMsg: '',
      wxQrcode: '',
      wxappErrorMsg: '',
      wxappQrcode: '',
      h5ErrorMsg: '',
      h5Qrcode: '',
    }
  },
  mounted() {
    console.log(this.catFid)
    this.getWxCode()
  },
  methods: {
    showModal(id) {
      this.visible = true
      this.id = id
      this.getWxCode()
      this.getH5Code()
      this.getWxappCode()
    },
    // 公众号二维码
    getWxCode() {
      this.request(merchantApi.seeWxQrcode, {
        type: this.type,
        id: this.id,
      }).then((res) => {
        if (res.error_code != false) {
          this.wxErrorMsg = res.msg
          this.wxQrcode = ''
        } else {
          this.wxQrcode = res.qrcode
          this.wxErrorMsg = ''
        }
      })
    },
    // 网页二维码
    getH5Code() {
      var url = encodeURIComponent(location.origin + '/packapp/plat/pages/shopmall_third/store_home/index?store_id=' + this.id)
      this.h5Qrcode = location.origin + '/index.php?g=Index&c=Recognition&a=get_own_qrcode&qrCon=' + url

    },
    // 小程序二维码
    getWxappCode() {
      var url = encodeURIComponent('pages/shopmall_third/store_home/index?store_id=' + this.id)

      this.wxappQrcode = '/index.php?g=Index&c=Recognition_wxapp&a=create_page_qrcode' + '&page=' + url
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
  width: 200px;
  height: 200px;
  border: 1px solid #c1c1c1;
}
.error-msg {
  width: 200px;
  height: 200px;
  border: 1px solid #c1c1c1;
}
</style>
