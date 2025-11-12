<template>
    <a-modal
        title="分享"
        width="900px"
        :visible="roomShareVisible"
        :footer="null"
        @cancel="cancalRoomShare"
    >
      <div style="display:flex;flex-direction:columns">
        <div class="share-div">
          <div><img style="width:150px" :src="shareData.cdnUrl"/></div>
          <div style="padding-left:1rem;">
            <p class="p-title">直播间小程序码</p>
            <p>右键点击图片保存到本地</p>
          </div>
        </div>
        <div class="share-div">
          <div><img style="width:180px;" :src="shareData.posterUrl"/></div>
          <div style="padding-left:1rem">
            <p class="p-title">直播间分享海报</p>
            <p>右键点击图片保存到本地</p>
          </div>
        </div>
      </div>
    </a-modal>
</template>

<script>
import LiveBroadcastMerchantApi from '@/api/liveBroadcast/merchant'
import LiveBroadcastPlatformApi from '@/api/liveBroadcast/platform'
export default {
  data() {
    return {
      //添加直播
      from:'',
      name:'RoomShare',
      roomShareVisible:false,
      roomid:0,
      shareData:{
        cdnUrl:'',
        pagePath:'',
        posterUrl:'',
        cdnUrlOrigin:'',
        posterUrlOrigin:''
      }
    }
  },
  mounted() {
    
  },
  methods: {
    //取消
    cancalRoomShare(){
      this.roomShareVisible = false;
    },
    //添加
    addRoomShare(roomid,from=''){
      this.shareData = {
        cdnUrl:'',
        pagePath:'',
        posterUrl:'',
        cdnUrlOrigin:'',
        posterUrlOrigin:''
      }
      this.roomid = roomid
      this.from = from
      this.getRoomShare()
      this.roomShareVisible = true;
      
    },
    getRoomShare(){
      let _that = this;
      if(this.from == 'platform'){
        _that.request(LiveBroadcastPlatformApi.getRoomShare, {roomid:this.roomid}).then((res) => {
          _that.shareData = res;
        })
      }else{
        _that.request(LiveBroadcastMerchantApi.getRoomShare, {roomid:this.roomid}).then((res) => {
          _that.shareData = res;
        })
      }
      
    },
  },
}
</script>

<style scoped lang="less">
.share-div{
  padding:1rem;
  display:flex;
  flex-direction:columns;
  width:45%;
  margin-left:3.3%;
  background:#F7F7F7
}
.p-title{
  font-weight:bold;
  font-size:1.1rem
}
</style>