<template>
    <a-modal :title="title" width="70%" :height="500" v-model="visible" @cancel="closeWindow" destroyOnClose :footer="null">
        <h4 class="mb-20" style="text-align: center;color: red" v-if="model == 'pointPro'">
            <span class="ml-10" style="color: #000000" v-if="addressName">
                {{L('当前地址：')}}{{ addressName + (addressItem?' ' + addressItem.name: '')}}
            </span>
            (注意：使用时需要选择右边的地址，才能带上详细地址)
        </h4>
            <a-row>
                <!-- 高德地图 start -->
                <a-col :span="19" v-if="$mapConfig == 'amap'">
                    <GaoDemap :mapCustomStyle="{height: '500px'}" :center="clickMapShow.position" :zoom="mapConfig.zoom" :positionMarker="clickMapShow.position" showControlZoom isChooseLocation @selectLocationPoint="getLocationPoint"/>
                </a-col>
                <!-- 高德地图 end -->
                <template v-else>
                    <!-- 天地图 start -->
                    <a-col :span="19" v-if="$tiandituMapKey">
                        <TiandituMap :mapCustomStyle="{height: '500px'}" :center="clickMapShow.position" :zoom="mapConfig.zoom" :positionMarker="clickMapShow.position" showControlZoom isChooseLocation @selectLocationPoint="getLocationPoint"/>
                    </a-col>
                    <!-- 天地图 end -->
                    <template v-else>
                        <a-col :span="4">
                            <a-input-search placeholder="搜索地址" @search="onSearch" />
                        </a-col>
                        <a-col :span="model == 'pointPro'?15:20" style="padding-left: 20px">
                            <span style="color: #000000">{{L('当前经纬度：')}}{{ longlat?(longlat.lng +','+ longlat.lat):'' }}</span>
                            <baidu-map class="bm-view" :center="mapConfig.center" @click="clickMap" :scroll-wheel-zoom="true" :zoom="mapConfig.zoom" @ready="mapReady" :ak="AK" id>
                                <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>

                                <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
                                <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map>

                                <bm-local-search :keyword="keyword" :page-capacity="10" @infohtmlset="searchSelectPoint" :auto-viewport="true" class="search-item"></bm-local-search>

                                <bm-marker v-if="isShowMapSign" :position="clickMapShow.position" :dragging="true" @dragend="dragend"></bm-marker>
                            </baidu-map>
                        </a-col>
                    </template>
                </template>
                <a-col :span="5" v-if="model == 'pointPro'">
                    <div style="padding: 0 0 0 10px">
                        <div>{{L('地址列表：')}}</div>
                        <div class="address-box" id="scrollbar1" v-if="addressInfo && addressInfo.pois">
                            <div class="address-item" v-for="(item,index) in addressInfo.pois" :key="index" @click="addressItemClick(item)">
                                <div class="name">{{item.name}}</div>
                                <div class="adres">{{item.addr}}</div>
                            </div>
                        </div>
                    </div>
                </a-col>
            </a-row>
        <div style="text-align: right">
            <a-button type="primary" style="margin-top: 20px" @click="confirmPoint" :loading="confirmLoading">{{L('确认')}}</a-button>
        </div>
    </a-modal>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import { old_request } from '@/utils/request'
import TiandituMap from '@/components/TiandituMap/indexMap' 
import GaoDemap from '@/components/GaoDemap/indexMap' 
export default {
    components: {
        BaiduMap,
        TiandituMap,
        GaoDemap,
    },
    props: {
        //类型
        model: {
            type: String,
            default() {
                return 'point' //point 简单的地图选点，pointPro 选点+选择地址(pro更好用的版本)
            },
        },
        options: {
            type: Object,
            default() {
                return {
                    store_id: '',
                    type: 'store',
                }
            },
        },
    },
    data() {
        return {
            title: '',
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
            addressInfo: '',
            addressName: '',
            addressItem: '',
            confirmLoading: false,
        }
    },
    methods: {
        //关闭窗口
        closeWindow() {
            this.visible = false
        },
        //打开地图
        open(point = { lat: '', lng: '' }, title = this.L('选择位置')) {
            this.title = title
            this.keyword = ''
            this.addressName = ''
            this.addressItem = ''
            this.addressInfo = ''
            setTimeout(() => {
                this.visible = true
            }, 200)
            let params = ''
            //存在latlng的时候不调用接口
            if (point.lat && point.lng) {
                params = {
                    lat: point.lat * 1,
                    lng: point.lng * 1,
                }
                this.mapConfig.center = params
                this.clickMapShow.position = params
                this.isShowMapSign = true
                return
            }
            let { store_id, type } = this.options
            if(store_id) {
                this.request(`/common/api.BaiduMap/getMapConfig`, { id: store_id, type }).then((res) => {
                    this.AK = res.ak
                    this.mapConfig.center = res.detault_city ? res.detault_city : '北京'
                })
            } else {
                this.request('/life_tools/merchant.LifeTools/getMapConfig',params).then((res) => {
                    this.AK = res.ak
                    this.mapConfig.center = res.detault_city ? res.detault_city : '北京'
                })
            }
        },
        //地图点击事件
        clickMap({ type, target, point, pixel, overlay }) {
            this.longlat = {
                lng: point.lng,
                lat: point.lat,
            }
            this.clickMapShow.position.lng = point.lng
            this.clickMapShow.position.lat = point.lat
            this.isShowMapSign = true
            this.getAddress(point)
        },
        //标记点拖动事件
        dragend({ type, target, pixel, point }) {
            this.longlat = {
                lng: point.lng,
                lat: point.lat,
            }
            this.clickMapShow.position.lng = point.lng
            this.clickMapShow.position.lat = point.lat
            this.isShowMapSign = true
            this.getAddress(point)
        },
        mapReady(e) {
            this.mapConfig.zoom = 15
            this.BMap = e.BMap
        },
        onSearch(value) {
            this.isShowMapSign = false
            this.keyword = value
        },
        //左侧地去检索
        searchSelectPoint(e) {
            this.longlat = {
                lng: e.point.lng,
                lat: e.point.lat,
            }
            this.clickMapShow.position.lng = e.point.lng
            this.clickMapShow.position.lat = e.point.lat
            this.isShowMapSign = true
            this.getAddress(e.point)
        },
        // 选点后获取详细地址 省市区街道等
        getAddress(point) {
            //高德地图
            if(this.$mapConfig == 'amap'){
                point.coordinate_type = 'gcj02'
            }else{
                if(this.$tiandituMapKey){
                    point.coordinate_type = 'wgs84'
                }
            }
            if (this.model == 'pointPro') {
                this.addressItem = ''
                this.request(`/common/api.BaiduMap/reverseGeocoding`, point).then((res) => {
                    if (res.status == 0) {
                        this.addressInfo = res.result
                        let { province, city='', district='', street='' } = res.result.addressComponent
                        this.addressName = province + ' ' + city + ' ' + district + ' ' + street
                    }
                })
            } else {
                this.longlat = {
                    lng: point.lng,
                    lat: point.lat,
                }
            }
        },
        //选地址模式点击地址事件
        addressItemClick(item) {
            this.addressItem = item
        },
        //确定事件
        confirmPoint() {
            //普通选点模式
            if (this.model == 'point') {
                let params = {
                    ...this.longlat,
                    longlat: this.longlat.lng + ',' + this.longlat.lat,
                }
                try {
                    //用百度地图api获取当前位置信息
                    var point = new BMap.Point(this.longlat.lng, this.longlat.lat)
                    var geoc = new BMap.Geocoder()
                    geoc.getLocation(point, (res) => {
                        if (res) {
                            let { province, city, district, street } = res.addressComponents
                            params.address = province + ' ' + city + ' ' + district
                            params.province = province
                            params.city = city
                            params.district = district
                            params.street = street
                        }
                        this.$emit('selectCallBack', params)
                        this.visible = false
                    })
                } catch (error) {
                    this.$emit('selectCallBack', params)
                    this.visible = false
                }
                return
            }
            //pro版本模式
            if (!this.addressInfo) {
                //请选择地址
                this.$message.info(this.L('请选择地址'))
                return
            }
            let { province, city, district, street } = this.addressInfo.addressComponent
            let formData = new FormData()
            formData.append('city_name', city)
            formData.append('area_name', district)
            formData.append('get_province', 1)
            formData.append('all_city', 1)
            formData.append('app_type', 1)
            if(this.$mapConfig == 'amap'){
                formData.append('coordinate_type', 'gcj02')
            }else{
                if(this.$tiandituMapKey){
                    formData.append('coordinate_type', 'wgs84')
                }
            }
            this.confirmLoading = true
            old_request('/wap.php?g=Wap&c=Home&a=cityMatching', formData, 'post', {
                'Content-Type': 'multipart/form-data',
            })
                .then((res) => {
                    if (res.errorCode == 0) {
                        let params = {
                            lat: this.addressItem ? this.addressItem.point.y : this.longlat.lat,
                            lng: this.addressItem ? this.addressItem.point.x : this.longlat.lng,
                            address: [province, city, district, street].filter(i => i).join(' '),
                            name: this.addressItem ? this.addressItem.name : '',
                            province,
                            city,
                            district,
                            street,
                            area_id: res.result.area_id,
                            city_id: res.result.city_id,
                            province_id: res.result.province_id,
                        }
                        this.$emit('selectCallBack', params)
                        this.visible = false
                        this.confirmLoading = false
                    }
                })
                .catch((err) => {
                    this.confirmLoading = false
                })
        },
        // 点击地图获取信息
        getLocationPoint(info) {
            if(info.point){
                info = info.point
            }
            this.longlat = {
                lng: info.lng,
                lat: info.lat,
            }
            this.clickMapShow.position.lng = info.lng
            this.clickMapShow.position.lat = info.lat
            this.getAddress(this.longlat)
        },
    },
}
</script>
<style lang="less" scoped>
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
.address-box {
    height: 500px;
    overflow-y: auto;
    .address-item {
        cursor: pointer;
        padding: 10px 0;
        border-bottom: 1px solid #e6e6e6;
        background-color: #fff;
        transition: all 0.15s;
        .name {
            font-size: 16px;
            color: #333;
        }
        .adres {
            font-size: 14px;
            color: #999;
        }
    }
    .address-item:last-child {
        border: none;
    }
    .address-item:hover {
        background-color: rgba(230, 230, 230, 0.5);
    }
}
#scrollbar1::-webkit-scrollbar {
    width: 5px;
}
#scrollbar1::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #c1c1c1;
}
#scrollbar1::-webkit-scrollbar-thumb:hover {
    background-color: rgba(193, 193, 193, 0.5);
}
#scrollbar1::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #f1f1f1;
    border: 1px solid #cacaca;
}
</style>
