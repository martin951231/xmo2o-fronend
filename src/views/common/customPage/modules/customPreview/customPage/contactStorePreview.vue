<template>
  <div class="contact-store-wrap flex justify-between align-center bg-ff flex-wrap">
    <div style="width:100%;" class="flex justify-between align-center">
      <div class="store-name no-wrap">
        <span>{{ storeName || L( '此处显示店铺名称') }}</span>
      </div>
      <div
        class="flex align-center contactStoreIcon justify-between"
        v-if="(content && content.show_phone_icon) || (content && content.show_address_icon)"
      >
        <span class="address-icon" v-if="content && content.show_address_icon == 1"
          ><img src="@/assets/customPage/contact_store_address_icon.png" alt=""
        /></span>
        <span class="phone-icon" v-if="content && content.show_phone_icon == 1"
          ><img src="@/assets/customPage/contact_store_phone_icon.png" alt=""
        /></span>
      </div>
    </div>
    <div class="no-wrap address-txt">
      <span>{{ storeAddress || L('此处显示详细地址') }}</span>
    </div>
  </div>
</template>

<script>
import customPageApi from '@/api/common/platform/customPage'
export default {
  props: {
    content: {
      type: [String, Object],
      default: ''
    }
  },
  data() {
    return {
      source:this.$route.query.source || '',
      storeName: '',
      storeAddress: '',
    }
  },
  computed: {
    sourceInfo() {
      return this.$store.state.customPage.sourceInfo
    },
  },
  mounted() {
     // 如果来源是店铺时，默认定位到当前店铺地址
     if(this.source && this.source == 'store') {
         this.getStoreInfo();
     }
   },
   methods: {
     // 获取店铺信息
   getStoreInfo() {
     let params = {
       source_id: this.sourceInfo.source_id,
     };
     this.request(customPageApi.getMerchantStoreMsg, params).then(res => {
       this.storeName = res.store.name || ''
       this.storeAddress = res.store.adress || ''
     })
   }
  }
}
</script>

<style scoped>
.contact-store-wrap {
  padding: 9px 16px;
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  font-size: 13px;
}
.store-name {
  margin-right: 6px;
  color: #333333;
  font-weight: bold;
}
.address-icon {
  padding-right: 10px;
}
.phone-icon {
  padding-right: 10px;
}
.address-txt {
  font-weight: 400;
  color: #999999;
}
</style>
