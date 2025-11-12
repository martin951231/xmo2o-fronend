<template>
    <a-modal :title="title" :visible="visible" :width="1000" :footer="null" @cancel="handleCancelMap">
        <div class="flex flex-wrap justify-between">
            <div style=" width:260px" class="flex">
                <a-input v-model="addressKeyword" placeholder="请输入关键字" @change="showPanelInput"></a-input>
            </div>
            <div class="flex-1 ml-40">
                <!-- 百度地图 -->
                <baidu-map
                        class="bm-view"
                        :zoom="zoom"
                        :center="postionMap"
                        :scroll-wheel-zoom="true"
                        @click="getLocationPoint"
                >
                    <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
                    <bm-map-type
                            :map-types="['BMAP_NORMAL_MAP', 'BMAP_SATELLITE_MAP']"
                            anchor="BMAP_ANCHOR_TOP_RIGHT"
                    ></bm-map-type>
                    <bm-local-search
                            :keyword="addressKeyword"
                            :zoom="zoom"
                            :auto-viewport="true"
                            @infohtmlset="infohtmlset"
                            :panel="showPanel"
                            class="searchRes"
                    ></bm-local-search>
                    <bm-marker :position="postionMap" :dragging="true"></bm-marker>
                </baidu-map>
                <!-- 百度地图 end -->
            </div>
        </div>

    </a-modal>
</template>

<style scoped>
    .bm-view {
        width: 650px;
        height: 500px;
    }
</style>

<script>
    export default {
        name: "ChoosePoint",
        data() {
            return {
                title:'地图',
                showPanel: true,
                visible: false,//地图model不展示
                zoom: 12.8, // 地图缩放比例
                addressKeyword: '', // 搜索框关键词
                postionMap: {
                    lng: 117.217433,
                    lat: 31.838546
                }, //中心点坐标
            }
        },
        methods: {
            // 地图弹窗确定
            handleOk() {
                this.visible = false
                this.$emit('updatePosition',this.postionMap)

            },
            // 地图弹窗取消
            handleCancelMap() {
                this.visible = false
            },
            // 搜索框完成地址检索后的回调
            infohtmlset(res) {
                if (res) {
                    this.postionMap.lng = res.point.lng
                    this.postionMap.lat = res.point.lat
                }
            },
            // 点击地图获取信息
            getLocationPoint(info) {
                this.postionMap.lng = info.point.lng
                this.postionMap.lat = info.point.lat
                this.handleOk();
            },
            showMap(center={}) {
                if (center.lat != undefined) {
                    this.postionMap = center;
                }
                this.visible = true
            },
            showPanelInput() {
                this.showPanel = !this.showPanel
            },
        }
    }
</script>

<style scoped>

</style>