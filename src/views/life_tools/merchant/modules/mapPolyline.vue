<template>
    <a-modal
        :title="title"
        width="80%"
        height="80vh"
        :visible="visible"
        @cancel="closeWindow"
        :footer="null"
        :destroyOnClose="true"
    >
        <a-row>
            <a-col :span="24">
                <baidu-map
                    class="bm-view"
                    :center="mapConfig.center"
                    :scroll-wheel-zoom="true"
                    :zoom="mapConfig.zoom"
                    @click="clickMap"
                    @ready="mapReady"
                    :ak="AK"
                    id=""
                >
                    <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true">
                    </bm-geolocation>

                    <bm-map-type :map-types="['BMAP_NORMAL_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
                    <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map>

                    <template v-if="isShowMapSign">
                        <bm-marker
                            v-for="item in mapMakers"
                            :key="item.id"
                            :position="{ lng: item.lng, lat: item.lat }"
                            :dragging="false"
                            @click="markerClick(item)"
                        >
                            <bm-label
                                v-if="item.name"
                                :content="item.name"
                                :labelStyle="{
                                    color: '#333',
                                    fontSize: '14px',
                                    borderColor: '#ffffff',
                                    backgroundColor: '#fff',
                                    padding: '4px',
                                    borderRadius: '4px',
                                }"
                                :offset="{ width: 0, height: -30 }"
                            />
                        </bm-marker>
                    </template>

                    <bm-polyline
                        :path="polylinePath"
                        stroke-color="blue"
                        :stroke-opacity="0.6"
                        :stroke-weight="4"
                        :editing="true"
                        @lineupdate="updatePolylinePath"
                    ></bm-polyline>
                </baidu-map>
            </a-col>
        </a-row>

        <div style="text-align: right">
            <row class="mt-20 mr-20">
                <span>是否开启删除线路点：</span>
                <a-switch @change="switchChange" v-model="mapPointFlag" checked-children="开" un-checked-children="关" />
            </row>
            <a-button class="mt-20 mr-20" @click="polylinePath = []">重新绘制</a-button>
            <a-button type="primary" class="mt-20" @click="confirmPoint">确认绘制</a-button>
        </div>
    </a-modal>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import lifeToolsMerchantApi from '@/api/life_tools/merchant'
export default {
    components: {
        BaiduMap,
    },
    props:{
        deletePoint:{
            type: Boolean,
            default(){
                return false
            }
        }
    },
    data() {
        return {
            title: '地图绘制',
            //是否显示弹窗
            visible: false,
            mapConfig: {
                center: '北京',
                zoom: 15,
            },
            isShowMapSign: false,
            clickMapShow: {
                position: { lng: 116.404, lat: 39.915 },
            },
            AK: '',
            longlat: '',
            BMap: '',
            polylinePath: [],
            mapMakers: [],
            mapPointFlag: false,
        }
    },
    methods: {
        //是否开启删除线路点
        switchChange(e){
            this.mapPointFlag = e;
            if(this.mapPointFlag){
                this.polylinePath.forEach((v,index) => {
                    this.mapMakers.push({
                        id: 'id'+ index,
                        lng: v.lng,
                        lat: v.lat,
                    })
                });
            }else{
                //否则复原
                let mapMakers = [];
                this.mapMakers.forEach(v=>{
                    if(v.name){
                        mapMakers.push(v);
                    }
                })
                this.mapMakers = [];
                this.mapMakers = mapMakers
            }
        },
        //标记点事件
        markerClick(item){
            //删除点
            if(!item.name && this.mapPointFlag){
                let arr = this.polylinePath.filter(v=>{
                    return v.lat == item.lat && v.lng == item.lng
                })
                if(arr[0]){
                    this.polylinePath = this.polylinePath.filter(v=>{
                    return v.lat != arr[0].lat && v.lng != arr[0].lng
                    })
                    this.mapMakers = this.mapMakers.filter(v=>{
                    return v.lat != arr[0].lat && v.lng != arr[0].lng
                    })
                }
            }   
        },
        //关闭窗口
        closeWindow() {
            this.visible = false
            this.polylinePath = []
            this.mapPointFlag = false;
        },
        setPolyline(polylinePath = [], mapMakers = []) {
            console.log('polylinePath',polylinePath)
            this.visible = true
            this.polylinePath = polylinePath
            if (this.polylinePath.length) {
                this.$set(this.mapConfig,'center',{
                    lat: this.polylinePath[0]['lat'],
                    lng: this.polylinePath[0]['lng']
                })
            }
            this.mapConfig.zoom = 15
            this.mapMakers = mapMakers
            if (this.mapMakers && this.mapMakers.length) {
                this.isShowMapSign = true
            }
        },
        mapReady(e) {
            // console.log('this.polylinePath',this.polylinePath)
            this.request(lifeToolsMerchantApi.getMapConfig).then((res) => {
                this.AK = res.ak
                if (this.polylinePath.length) {
                    this.$set(this.mapConfig,'center',{
                        lat: this.polylinePath[0]['lat'],
                        lng: this.polylinePath[0]['lng']
                    })
                } else {
                    this.$set(this.mapConfig,'center',res.detault_city ? res.detault_city : '北京')
                }
                this.mapConfig.zoom = 15
            })
            this.BMap = e.BMap
        },
        confirmPoint() {
            this.$emit('conform', this.polylinePath)
            this.closeWindow()
        },
        updatePolylinePath(e) {
            this.polylinePath = e.target.getPath()
        },
        clickMap({ type, target, point, pixel, overlay }) {
            if(this.mapPointFlag)return
            let polylinePath = this.polylinePath || []
            polylinePath.push({
                lng: point.lng,
                lat: point.lat,
            })
            this.polylinePath = polylinePath
        },
    },
}
</script>
<style scoped>
.bm-view {
    width: 100%;
    height: 640px;
}
</style>
