<template>
    <div class="enter-store-wrap bg-ff" v-if="content">
        <!-- 天地图 start -->
        <TiandituMap ref="tiandituMap" v-if="$tiandituMapKey" :center="postionMap" :zoom="zoom" :positionMarker="postionMap" :mapCustomStyle="{height: '200px'}"/>
        <!-- 天地图 end -->
        <baidu-map class="bm-view" :zoom="zoom" :center="postionMap" :scroll-wheel-zoom="true" @ready="mapReady" v-else>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
            <bm-map-type
                :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP']"
                anchor="BMAP_ANCHOR_TOP_RIGHT"
            ></bm-map-type>
            <bm-marker :position="postionMap"> </bm-marker>
        </baidu-map>
    </div>
</template>

<script>
import TiandituMap from '@/components/TiandituMap/indexMap'
export default {
    components:{TiandituMap},
    props: {
        content: {
            type: [String, Object, Array],
            default: '',
        },
    },
    data() {
        return {
            zoom: 14,
            postionMap: {
                lng: 116.405994,
                lat: 39.91737,
            }, //地图中心点坐标
            isMapReady: false
        }
    },
    updated() {
        if(this.$tiandituMapKey && this.content && this.content.list){
            this.$refs.tiandituMap?.setCenterAndZoom(this.content.list)
            this.$refs.tiandituMap?.setCurrentMarker(this.content.list)
            return
        }
        if (this.isMapReady && this.content && this.content.list) {
            const { lng, lat } = this.content.list
            this.postionMap.lng = lng
            this.postionMap.lat = lat
        }
    },
    methods: {
        mapReady() {
            this.isMapReady = true
            if (this.content && this.content.list) {
                const { lng, lat } = this.content.list
                this.postionMap.lng = lng
                this.postionMap.lat = lat
            }
        }
    }
}
</script>

<style scoped>
.enter-store-wrap {
    width: 100%;
    height: 200px;
    box-sizing: border-box;
}

.bm-view {
    width: 100%;
    height: 200px;
}
</style>
