<template>
  <a-modal :title="title" :width="1000" :height="500" :visible="visible" @cancel="closeWindow" :footer="null">
    <a-row>
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

          <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
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
export default {
  components: {
    BaiduMap,
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
    }
  },
  methods: {
    //关闭窗口
    closeWindow() {
      this.visible = false
    },
    selectPoint() {
    //   this.request('/g=Index&c=Map&a=suggestion').then((res) => {
    //     this.AK = res.ak
    //     this.mapConfig.center = res.detault_city ? res.detault_city : '北京'
    //     console.log('map_config', res)
    //   })
      this.visible = true
    },
    clickMap({ type, target, point, pixel, overlay }) {
      this.longlat = point.lng + ',' + point.lat
      this.clickMapShow.position.lng = point.lng
      this.clickMapShow.position.lat = point.lat
      this.isShowMapSign = true
    },
    mapReady() {
      this.mapConfig.center = '北京'
      this.mapConfig.zoom = 15
    },
    confirmPoint() {
      this.$emit('loadRefresh', this.longlat)
      this.visible = false
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
    },
  },
}
</script>
<style>
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
