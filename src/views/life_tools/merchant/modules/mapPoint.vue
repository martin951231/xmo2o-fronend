<template>
    <a-modal :title="title" :width="1000" :height="500" :visible="visible" @cancel="closeWindow" :footer="null" destroyOnClose>
        <!-- 天地图 start -->
        <TiandituMap ref="tiandituMap" 
        v-if="$tiandituMapKey" 
        :center="clickMapShow.position" 
        :zoom="mapConfig.zoom" 
        :positionMarker="clickMapShow.position" 
        isChooseLocation 
        @selectLocationPoint="selectLocationPoint" 
        :currentSelectLngLatProps="longlat"/>
        <!-- 天地图 end -->
        <a-row v-else>
            <a-col :span="5">
                <a-input-search placeholder="搜索地址" @search="onSearch" />
            </a-col>
            <a-col :span="19" style="padding-left: 20px">
                <span style="color: #000000">当前选中经纬度：{{ longlat }}</span>

                <baidu-map
                    class="bm-view"
                    :center="mapConfig.center"
                    @click="clickMap"
                    :scroll-wheel-zoom="true"
                    :zoom="mapConfig.zoom"
                    @ready="mapReady"
                    :ak="AK"
                    id=""
                >
                    <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true">
                    </bm-geolocation>

                    <bm-map-type
                        :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
                        anchor="BMAP_ANCHOR_TOP_LEFT"
                    ></bm-map-type>
                    <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map>

                    <bm-local-search
                        :keyword="keyword"
                        :page-capacity="10"
                        @infohtmlset="searchSelectPoint"
                        :auto-viewport="true"
                        class="search-item"
                    ></bm-local-search>

                    <bm-marker v-if="isShowMapSign" :position="clickMapShow.position" :dragging="true"> </bm-marker>
                </baidu-map>
            </a-col>
        </a-row>

        <div style="text-align: right">
            <a-button type="primary" style="margin-top: 20px" @click="confirmPoint">确认选点</a-button>
        </div>
    </a-modal>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import lifeToolsMerchantApi from '@/api/life_tools/merchant'
import TiandituMap from '@/components/TiandituMap/indexMap' 
export default {
    components: {
        BaiduMap,
        TiandituMap,
    },
    data() {
        return {
            title: '选择位置',
            //是否显示弹窗
            visible: false,
            keyword: '',
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
        }
    },
    methods: {
        //关闭窗口
        closeWindow() {
            this.visible = false
        },
        selectPoint(longlat='') {
            this.keyword = ''
            setTimeout(()=>{
                this.visible = true
            },200)
            let params = ''
            //存在latlng的时候不调用接口
            if(longlat){
                params = {
                    lat: parseFloat(longlat.split(',')[1]),
                    lng: parseFloat(longlat.split(',')[0]),
                }
                this.mapConfig.center = params;
                this.clickMapShow.position = params
                this.isShowMapSign = true
                return
            }
            this.request(lifeToolsMerchantApi.getMapConfig).then((res) => {
                this.AK = res.ak
                this.mapConfig.center = res.detault_city ? res.detault_city : '北京'
                if(this.$tiandituMapKey){
                    this.$nextTick(()=>{
                        setTimeout(()=>{
                            this.$refs.tiandituMap.addressKeyword = this.mapConfig.center
                            this.$refs.tiandituMap.showPanelInput()
                        },500)
                    })
                }
            })
        },
        clickMap({ type, target, point, pixel, overlay }) {
            this.longlat = point.lng + ',' + point.lat
            this.clickMapShow.position.lng = point.lng
            this.clickMapShow.position.lat = point.lat
            this.isShowMapSign = true
            this.getAddress(point)
        },
        mapReady(e) {
            this.mapConfig.zoom = 15
            this.BMap = e.BMap
        },
        confirmPoint() {
            this.$emit('loadRefresh', this.longlat, this.clickMapShow.position)
            this.visible = false
        },
        selectLocationPoint(data){
            this.longlat = data.point.lng + ',' + data.point.lat
            this.clickMapShow.position.lng = data.point.lng
            this.clickMapShow.position.lat = data.point.lat
        },
        onSearch(value) {
            this.isShowMapSign = false
            this.keyword = value
        },
        searchSelectPoint({ point }) {
            this.longlat = point.lng + ',' + point.lat
            this.clickMapShow.position.lng = point.lng
            this.clickMapShow.position.lat = point.lat
            this.isShowMapSign = true
            this.getAddress(point)
        },
        // 选点后获取详细地址 省市区街道等
        getAddress(point) {
            if (this.BMap) {
                // Geocoder() 类进行地址解析
                // 创建地址解析器的实例
                const geoCoder = new this.BMap.Geocoder()
                // getLocation() 类--利用坐标获取地址的详细信息
                geoCoder.getLocation(point, (res) => {
                    // console.log('获取经纬度', point, '获取详细地址', res)
                    this.clickMapShow.position.address = res.address || ''
                    const addrComponent = res.addressComponents
                    // 省
                    const province = addrComponent.province
                    // 市
                    const city = addrComponent.city
                    // 区
                    const district = addrComponent.district
                    // 街道
                    const street = addrComponent.street
                    const streetNumber = addrComponent.street
                    this.clickMapShow.position.province = province || ''
                    this.clickMapShow.position.city = city || ''
                    this.clickMapShow.position.district = district || ''
                    this.clickMapShow.position.street = street || ''
                    this.clickMapShow.position.streetNumber = streetNumber || ''
                })
            }
        },
    },
}
</script>
<style scoped>
.bm-view {
    width: 100%;
    height: 500px;
    margin-top: 10px;
}
.search-item {
    width: 200px;
    height: 500px;
    overflow: auto;
    position: absolute;
    top: 50px;
    left: -200px;
}
</style>
