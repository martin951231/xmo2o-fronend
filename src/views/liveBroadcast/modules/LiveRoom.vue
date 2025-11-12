<template>
    <a-modal
        title="微信扫码直播"
        width="900px"
        :visible="roomVisible"
        :footer="null"
        @cancel="cancalRoom"
    >
      <img src="@/assets/wechat_live/create_room.png"/>
    </a-modal>
</template>

<script>
import LiveBroadcastMerchantApi from '@/api/liveBroadcast/merchant'
export default {
  data() {
    return {
      //添加直播
      name:'Room',
      roomVisible:false
    }
  },
  mounted() {
    
  },
  methods: {
    //取消添加直播
    cancalRoom(){
      this.roomVisible = false;
    },
    //添加主播
    addRoom(){
      this.roomVisible = true;
    } 
  },
}
</script>