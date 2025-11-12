
<!--<template>-->
<!--  <a-modal :title="title" :width="340" :height="340" :visible="visible" :footer="null" @cancel="handleCancel">-->
<!--    <div style="text-align: center">-->
<!--      <img :src="image" style="width: 280px;height: 280px">-->
<!--    </div>-->
<!--  </a-modal>-->
<!--</template>-->

<!--<script>-->
<!--  import foodshopMerchantApi from '@/api/foodshop/merchant'-->
<!--  export default {-->
<!--    data () {-->
<!--      return {-->
<!--        title: '查看店铺二维码',-->
<!--        labelCol: {-->
<!--          xs: {-->
<!--            span: 24-->
<!--          },-->
<!--          sm: {-->
<!--            span: 7-->
<!--          }-->
<!--        },-->
<!--        wrapperCol: {-->
<!--          xs: {-->
<!--            span: 24-->
<!--          },-->
<!--          sm: {-->
<!--            span: 13-->
<!--          }-->
<!--        },-->
<!--        store_id:0,-->
<!--        image:'',-->
<!--        visible:false,-->
<!--      }-->
<!--    },-->
<!--    mounted () {-->
<!--      console.log(this.catFid)-->
<!--    },-->
<!--    methods: {-->

<!--      storeQrcode() {-->
<!--        // this.store_id = store_id;-->
<!--        // this.visible = true;-->
<!--        this.title = '选择您需要下载的桌台码类型';-->
<!--        // this.initForm();-->
<!--        this.request(foodshopMerchantApi.downloadQrcodeStore, {store_id: 428})-->
<!--          .then((res) => {-->
<!--            this.tid = res.tid;-->
<!--            this.name = res.name;-->
<!--          })-->
<!--      },-->
<!--      getCode () {-->
<!--        this.request(foodshopMerchantApi.seeQrcode, {-->
<!--          store_id: this.store_id-->
<!--        })-->
<!--          .then((res) => {-->
<!--            this.image = res.qrcode-->
<!--            // this.image = 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg'-->
<!--          })-->
<!--      },-->
<!--      handleCancel(){-->
<!--        this.visible = false;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</script>-->
