<template>
<a-modal :title="title" :width="800" :height="300" :visible="visible" @cancel="closeWindow" :footer="null">
    
 <a-row>
    
    <a-card size="small" title="用户" style="width: 100%">
          <a slot="extra" href="#"></a>
          <p>昵    称：{{detail.user.nickname}}</p>  
          <p>手 机 号：{{detail.user.phone}}</p>
          <p>求助人姓名：{{detail.name}}</p>
          <p>求助人手机号：{{detail.phone}}</p>
    </a-card> 
    
 </a-row>
 
 <a-row style="margin-top: 30px;">
       <a-card size="small" title="投诉建议"  style="width: 100%;">
           <p v-if="detail.title">标  题：{{detail.title}}</p>
                 
           <p>发布时间：{{detail.create_time}}</p>
           <p>是否解决：{{detail.is_solve == 1 ? '已解决' : '未解决'}}</p> 
           <p>浏览量：{{detail.view_count}}</p>
           <p v-if="detail.image_arr.length > 0 ">图片：</p> 
           <p v-if="detail.image_arr.length > 0 ">
               <img v-for="item in detail.image_arr" @click="$refs.showImageModel.showImage(item)" :src="item" class="images">
           </p>
           
           <p>地址：{{detail.address.area_ip_desc}}</p> 
           <p>位置：<a @click="showMap">{{isShowMap ? "关闭地图":"查看地图"}}</a></p>
            <p v-if="isShowMap">
                <TiandituMap :center="center" :zoom="zoom" :positionMarker="center" showOverviewMap v-if="$tiandituMapKey"/>
                <baidu-map class="bm-view" :center="center"   :scroll-wheel-zoom="true"
                  :zoom="zoom" @ready="mapReady" :ak="AK" id="" v-else>
                    <bm-marker :position="markerPoint"  animation="BMAP_ANIMATION_BOUNCE">
                       
                    </bm-marker>
                    
                    <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
                    <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map>
                 
                </baidu-map>
            </p>
            <p>内容：{{detail.content}}</p> 
        </a-card>
   </a-row>
     
   <show-image ref="showImageModel"/>
   </a-modal>
   </template>
   <script>
       import lifeToolsPlatformApi from "@/api/life_tools/platform";
       import showImage from './showImage.vue'
            
       import BaiduMap from 'vue-baidu-map/components/map/Map.vue' 
       import TiandituMap from '@/components/TiandituMap/indexMap' 
       export default {
         components: {
            BaiduMap,
            showImage,
            TiandituMap
        },
        data() {
            return {
                title:"详情",
                //是否显示弹窗
                visible:false,
                center: {lng: 0, lat: 0},
                point:{lng: 0, lat: 0},
                zoom: 15,
                AK: '',
                isShowMap: false,
                markerPoint: {lng: 0, lat: 0},
                detail:{
                    user:{
                        nickname: '',
                        phone: '',
                        gender: '',
                        real_name: '',
                        lat: '',
                        lng: ''
                    },
                    tools:{
                        title: '',
                        phone: '',
                        area:{
                            area_ip_desc: ''
                        },
                        address: ''
                    },
                    title: '',
                    create_time: '',
                    content: '',
                    view_count: 0,
                    image_arr: [],
                    address: {}
                }
            }
        },
            methods: {
                //关闭窗口
                closeWindow(){
                    this.visible = false
                },
                showHelpNoticeDetail(id) {
                    this.isShowMap = false;
                    this.center = {}
                    
                    console.log(id)
                    this.visible = true
                    this.request(lifeToolsPlatformApi.getHelpNoticeDetail, {pigcms_id: id}).then((res) => {
                        // this.$message.success(this.L('操作成功！'))
                        // this.visible = false
                        // this.$emit('loadRefresh');
                        this.detail = res
                        this.center.lat = res.lat
                        this.center.lng = res.lng
                        this.AK = res.ak
                        this.markerPoint.lat = res.lat
                        this.markerPoint.lng = res.lng
                    })
                },
                mapReady({BMap, map}) { 
                  // this.center.lng = this.detail.lat
                  // this.center.lat = this.detail.lng
                  // this.zoom = 15
                },
                showMap(){
                    this.isShowMap = this.isShowMap ? false : true;
                }
            }
        }
</script>
<style type="text/css">
    .images{
        width: 50px;
        height: 50px;
        margin-left: 10px;
    }
    .bm-view {
      width: 100%;
      height: 500px;
      margin-top: 10px;
    }
</style>