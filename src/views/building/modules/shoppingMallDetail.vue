<template>
    <a-descriptions title="基础信息" :column="2">
        <a-descriptions-item label="商场名称">
         {{ record.name }}
        </a-descriptions-item>
        <a-descriptions-item label="简称">
         {{ record.short_name }}
        </a-descriptions-item>
        <a-descriptions-item label="联系电话">
         {{ record.phone }}
        </a-descriptions-item>
        <a-descriptions-item label="状态">
         {{ record.status_text }}
        </a-descriptions-item>
        <a-descriptions-item label="面积">
         {{ record.area }} ㎡
        </a-descriptions-item>
        <a-descriptions-item label="负责人">
         {{ record.director }}
        </a-descriptions-item>
        <a-descriptions-item label="详细地址" :span="2">
         {{ record.address }}
        </a-descriptions-item>
        <a-descriptions-item label="介绍" :span="2">
         {{ record.introduction }}
        </a-descriptions-item>
        <a-descriptions-item label="" :span="2">
            <div style="width: 650px">
                <!-- 天地图 start -->
                <TiandituMap ref="tiandituMap" v-if="$tiandituMapKey" :center="postionMap" :zoom="zoom" :positionMarker="postionMap" showControlZoom/>
                <!-- 天地图 end -->
                <!-- 百度地图 -->
                <baidu-map class="bm-view" :zoom="zoom" :center="postionMap" :scroll-wheel-zoom="true" v-else>
                    <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
                    <bm-map-type
                        :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP']"
                        anchor="BMAP_ANCHOR_TOP_RIGHT"
                    ></bm-map-type>
                    <bm-marker
                        :position="{ lng: postionMap.lng, lat: postionMap.lat }"
                        :dragging="true"
                    >
                    </bm-marker>
                </baidu-map>
                <!-- 百度地图 end -->
            </div>
        </a-descriptions-item>
    </a-descriptions>
</template>
<script>
import buildingPlatformApi from '@/api/building/index'
import TiandituMap from '@/components/TiandituMap/indexMap' 
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import coordinate from '@/utils/coordinate'

export default {
    name: "shoppingMallDetail",
    components: {
        TiandituMap,
        BaiduMap
    },
    props: {
        // 存放路径
        mall_id: {
            type: [String, Number],
            default: '0',
        },
    },
    data() {
        return {
          record: {},
          zoom: 15, // 地图缩放比例
          postionMap: {
              lng: 0,
              lat: 0,
           }, //中心点坐标
        }
    },
    
    mounted() {
        if(this.$props.mall_id > 0){
            this.getDetail();
        }
    },
    methods: {
        getDetail(){
            let _that = this
            this.request(buildingPlatformApi.getShoppingMall, {id:this.$props.mall_id}).then((res) => {
                _that.record = res;
                _that.postionMap = {
                    lat: res.lat,
                    lng: res.lng
                }

                if(typeof _that.$refs.tiandituMap != "undefined"){
                    //天地图
                    let tdtMap = coordinate.bd09ToWgs84(res.lng,res.lat);
                    _that.postionMap = {
                        lat: tdtMap[1],
                        lng: tdtMap[0]
                    }
                    _that.$refs.tiandituMap?.setCenterAndZoom(_that.postionMap)
                    _that.$refs.tiandituMap?.createMarker(_that.postionMap)
                }
            })
        },
    },
}
</script>

<style scoped>
.mb-0 {
    margin-bottom: 0;
}
.bm-view {
    width: 650px;
    height: 450px;
    margin-top: 10px;
}
.ms {
    color: #888;
    display: flex;
    justify-content: center;
}
</style>


