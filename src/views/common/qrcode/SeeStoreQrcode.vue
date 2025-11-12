
<template>
  <a-modal :title="title" :width="720" :visible="visible" :footer="null" @cancel="handleCancel">
    <div class="content">
      <div class="code-box">
        <div class="code">
          <img :src="wxQrcode" v-if="wxQrcode" />
          <div v-if="wxErrorMsg" class="error-msg">{{ wxErrorMsg }}</div>
          <div>{{ L('公众号二维码') }}</div>
        </div>
        <div class="code">
          <img :src="h5Qrcode" v-if="h5Qrcode" />
          <!-- <div v-if="h5ErrorMsg" class="error-msg">{{ h5ErrorMsg }}</div> -->
          <div>{{ L('网页二维码') }}</div>
        </div>
        <div class="code">
          <img :src="wxappQrcode" v-if="wxappQrcode" />
          <div>{{ L('小程序二维码') }}</div>
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
      title: this.L('店铺综合二维码'),
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
      type: 'merchantstore',
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
    // this.getWxCode()
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
      var url = encodeURIComponent(location.origin + '/packapp/platn/pages/store/v1/home/index?store_id=' + this.id)
      this.h5Qrcode = location.origin + '/index.php?g=Index&c=Recognition&a=get_own_qrcode&qrCon=' + url
      // this.request(merchantApi.seeH5Qrcode, {
      //   url: url,
      // }).then((res) => {
      //   if (res.code == 200) {
      //     //console.log(r);
      //     this.h5Qrcode = 'data:image/png;base64,' + res.data
      //     //给img的sec赋值。
      //   } else {
      //     this.h5ErrorMsg = '二维码生成失败'
      //   }
      // })
    },
    // 小程序二维码
    getWxappCode() {
      var url = encodeURIComponent('platn/pages/store/v1/home/index?page_from=store_qr_code&store_id=' + this.id)

      this.wxappQrcode = '/index.php?g=Index&c=Recognition_wxapp&a=create_page_qrcode' + '&page=' + url

      // this.request(merchantApi.createPageQrcode, {
      //   type: this.type,
      //   id: this.id,
      // }).then((res) => {
      //   if (res.error_code) {
      //     this.wxErrorMsg = res.msg
      //   } else {
      //     this.wxQrcode = res.qrcode
      //   }
      // })
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
