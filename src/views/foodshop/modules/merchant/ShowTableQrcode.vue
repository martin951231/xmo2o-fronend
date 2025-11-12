
<template>
  <a-modal :title="title" :width="720" :visible="visible" :footer="null" @cancel="handleCancel">
    <div class="content">
      <div class="code-box">
        <div class="code">
          <img src="../../../../assets/images/table_qr.png" />
          <div class="title_code">
            <b>{{ L('已装修的桌台码(示例)') }}</b>
          </div>
        </div>
        <div class="qr_code">
          <img src="../../../../assets/images/table_normal.png" />
          <div class="title_qr_code">
            <b>{{ L('普通桌台码(示例)') }}</b>
          </div>
        </div>
      </div>
      <a-radio-group class="code-box" :value="radioValue" @change="radioChange">
        <a-radio class="code radio-style" :value="2"> </a-radio>
        <a-radio class="code radio-style" :value="1"> </a-radio>
      </a-radio-group>
      <div class="footer-box">
        <a-button type="primary" icon="download" @click="tableQrcode"> {{ L('批量下载') }} </a-button>
        <a-button @click="handleCancel"> {{ L('取消') }} </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import foodshopMerchantApi from '@/api/foodshop/merchant'
export default {
  data() {
    return {
      title: this.L('下载桌台二维码'),
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
      store_id: 0,
      selectedTableIds: [],
      image: '',
      visible: false,
      storeId: 0,
      radioValue: 2,
    }
  },
  mounted() {
    console.log(this.catFid)
  },
  methods: {
    showModal(id, selectedTableIds) {
      this.storeId = id
      this.selectedTableIds = selectedTableIds
      this.visible = true
    },
    radioChange(e) {
      this.radioValue = e.target.value
    },
    seeQrcode(store_id) {
      this.visible = true
      this.store_id = store_id
      this.getCode()
    },
    tableQrcode() {
      this.title = this.L('选择您需要下载的桌台码类型')
      // this.initForm();
      this.request(foodshopMerchantApi.downloadQrcodeTable, {
        store_id: this.storeId,
        is_common: this.radioValue,
        table_ids: this.selectedTableIds,
      }).then((res) => {
        this.url = res.download_url
        download(this.url)
      })
    },
    getCode() {
      this.request(foodshopMerchantApi.seeQrcode, {
        store_id: this.store_id,
      }).then((res) => {
        this.image = res.qrcode
        // this.image = 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg'
      })
    },
    handleCancel() {
      this.visible = false
    },
  },
}
function download(url) {
  window.open(url)
}
</script>

<style scoped>
.content {
  padding: 20px;
  overflow: hidden;
}
.code-box {
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.code {
  margin: 10px;
}
.code img {
  width: 300px;
  height: 360px;
  border: 1px solid #c1c1c1;
}
.qr_code {
  margin: 50px 10px 10px 10px;
}
.qr_code img {
  width: 300px;
  height: 300px;
  border: 1px solid #c1c1c1;
}
.title_code {
  margin-top: 20px;
}
.title_qr_code {
  margin-top: 40px;
}
.radio-style {
  width: 100%;
  text-align: center;
}
.footer-box {
  text-align: right;
}
.footer-box button {
  margin-top: 10px;
  margin-right: 20px;
}
</style>
