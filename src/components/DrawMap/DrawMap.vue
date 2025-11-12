<template>
    <div style="width: 100%">
        <a-col :span="span">
            <baidu-map
                class="bm-view"
                :style="'height:' + mapHeight"
                :center="mapConfig.center"
                :scroll-wheel-zoom="true"
                :zoom="mapConfig.zoom"
                @ready="mapReady"
                @click="paintPolygon"
                @mousemove="syncPolygon"
                @rightclick="newPolygon"
                id="baidu-maps"
            >
                <!-- <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"> </bm-geolocation> -->

                <bm-map-type
                    :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
                    anchor="BMAP_ANCHOR_TOP_LEFT"
                ></bm-map-type>
                <div v-if="mapTypeFlag">
                    <bm-polygon
                        :path="path"
                        v-for="path of polygonPath.paths"
                        :key="path.toString()"
                        stroke-color="blue"
                        fill-color="blue"
                        :fill-opacity="0.3"
                        :stroke-opacity="0.5"
                        :stroke-weight="2"
                        @click="alertpath"
                        :editing="editing"
                        @lineupdate="updatePolygonPath"
                    />
                </div>
                <div v-else>
                    <bm-polygon
                        :path="polygonPath.paths"
                        stroke-color="blue"
                        fill-color="blue"
                        :fill-opacity="0.3"
                        :stroke-opacity="0.5"
                        :stroke-weight="2"
                        @click="alertpath"
                        :editing="editingPath"
                        @lineupdate="updatePolygonPath"
                    />
                </div>
                <bm-marker :position="mapConfig.position" :dragging="false"> </bm-marker>
            </baidu-map>
            <div class="ms text-wrap">
                {{ L('点击绘制按钮开始绘制(再次点击重新绘制)，点击绘制按钮后请在地图中点击鼠标左键选点，按下鼠标右键即可完成绘制') }}
            </div>
        </a-col>
    </div>
</template>
<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
export default {
    props: {
        span: {
            type: Number,
            default() {
                return 20
            },
        },
        editingPath: {
            type: Boolean,
            default() {
                return true
            },
        },
        //地图ak值
        isAk: {
            type: String,
            default() {
                return '1AkNvHhmDXEt4lFlFZmovxlW2FnEyOwi'
            },
        },
        //地图高度
        mapHeight: {
            type: String,
            default() {
                return '350px'
            },
        },
        //地图参数
        mapConfig: {
            type: Object,
            default() {
                return {
                    zoom: 15,
                    center: { lat: 31.838546, lng: 117.217433 }, //默认中心点经纬度(亚夏汽车大厦)
                    position: { lat: 31.838546, lng: 117.217433 },
                }
            },
        },
    },
    data() {
        return {
            mapType: 'baidu',
            mapTypeFlag: true,
            polygonPath: {
                editing: false,
                paths: [], // 绘制完成后的经纬度，其实是在画的时候动态push的，因为在点击的时候触发了 paintPolygon 函数
            },
            //多边形是否开启编辑模式
            editing: true,
        }
    },
    components: {
        BaiduMap,
    },
    created() {},
    methods: {
        //地图渲染事件
        mapReady({ BMap, map }) {
            this.$emit('mapOnReady')
        },
        //多边形回显
        echoToggle(e, editing = true) {
            this.mapTypeFlag = false
            this.polygonPath.paths = JSON.parse(JSON.stringify(e))
            this.editing = editing
        },
        // 开启多边形绘制
        toggle() {
            this.mapTypeFlag = true
            this.editing = false
            this.polygonPath.editing = true
            // this.polygonPath.editing = !this.polygonPath.editing
            // 在这里做一步判断，如果有路径且开启绘制就把原来的路径清空
            if (this.polygonPath.paths && this.polygonPath.editing) {
                this.polygonPath.paths = []
            }
        },
        // 鼠标移动时
        syncPolygon(e) {
            if (!this.polygonPath.editing) {
                return
            }
            const { paths } = this.polygonPath
            if (!paths.length) {
                return
            }
            const path = paths[paths.length - 1]
            if (!path.length) {
                return
            }
            if (path.length === 1) {
                path.push(e.point)
            }
            this.$set(path, path.length - 1, e.point)
        },
        // 鼠标右键点击时往路径里push一个面
        newPolygon(e) {
            if (!this.polygonPath.editing) {
                return
            }
            // 当开始绘制后把按钮调回开始绘制状态，防止绘制多个图形
            this['polygonPath'].editing = !this['polygonPath'].editing
            const { paths } = this.polygonPath
            if (!paths.length) {
                paths.push([])
            }
            const path = paths[paths.length - 1]
            path.pop()
            if (path.length) {
                paths.push([])
            }
            //右键结束绘画后传递事件
            this.editing = true
            // 右键结束绘画后传递事件
            this.$emit('polygonPath', this.polygonPath)
        },
        // 鼠标左键多边形绘制
        paintPolygon(e) {
            if (!this.polygonPath.editing) {
                return
            }

            !this.polygonPath.paths.length && this.polygonPath.paths.push([])
            this.polygonPath.paths[this.polygonPath.paths.length - 1].push(e.point)
            this.polygonPath = JSON.parse(JSON.stringify(this.polygonPath))
        },
        alertpath(e) {
            // console.log(e.currentTarget.so)
            // console.log(this.polygonPath.paths[0])
        },
        updatePolygonPath(e) {
            //编辑覆盖物时触发，获取坐标点集合
            this.polygonPath.paths[0] = e.target.getPath()
            //编辑覆盖物时传递事件
            this.$emit('polygonPath', this.polygonPath)
        },
    },
}
</script>

<style lang="less" scoped>
.bm-view {
    width: 100%;
    margin-top: 10px;
}
.ms {
    color: #888;
    display: flex;
    justify-content: center;
}
</style>
