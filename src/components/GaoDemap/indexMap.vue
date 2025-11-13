<template>
    <div class="mapContent">
        <template v-if="isChooseLocation">
            <div class="chooseLocationBox flex">
                <div style="width: 300px;" class="mr-20">
                    <a-input class="mb-10" v-model="addressKeyword" placeholder="请输入关键字" @change="showPanelInput"></a-input>
                    <div v-if="pois.length" class="panel mp-10 mb-10" style="height: 400px;overflow-y: auto;">
                        <div class="addressItem" v-for="(item,index) in pois" :key="index" style="padding: 10px 0;cursor: pointer;" @click="showPosition(item,index)" :title="L('点击选中')">
                            <div style="color: #2a81cb">{{index + 1}}.{{item.name}}</div>
                            <div>{{item.address}}</div>
                        </div>
                    </div>
                    <a-pagination class="mt-20" v-if="pois.length" size="small" :total="pagination.total" @change="paginationChange" />
                </div>
                <div class="flex-1">
                    <div class="mb-10" v-if="currentSelectLngLat || currentSelectLngLatProps">当前选中经纬度：{{currentSelectLngLat || currentSelectLngLatProps}}</div>
                    <div :id="mapId" :style="[mapCustomStyle]"></div>
                </div>
            </div>
        </template>
        <template v-else>
            <div :id="mapId" :style="[mapCustomStyle]"></div>
            <div class="ms text-wrap mt-10" v-if="drawToolType">{{ L('点击绘制按钮开始绘制(再次点击重新绘制)，点击绘制按钮后请在地图中点击鼠标左键选点，双击鼠标左键即可完成绘制') }}</div>
        </template>
    </div>
</template>
  
  <script>
import coordinate from '@/utils/coordinate'
const guid = (len = 32, initial = true, radix = null) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const uuid = []
    radix = radix || chars.length

    if (len) {
        // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
        for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
    } else {
        let r
        // rfc4122标准要求返回的uuid中,某些位为固定的字符
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | (Math.random() * 16)
                uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
            }
        }
    }
    // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
    if (initial) {
        uuid.shift()
        return `${initial}${uuid.join('')}`
    }
    return uuid.join('')
}
export default {
    props: {
        mapId: {
            type: String,
            default: () => {
                return guid(6)
            },
        },
        center: {
            type: Object,
            default: () => {
                return { lat: '', lng: '' }
            },
        },
        zoom: {
            type: Number,
            default: 15,
        },
        //位置标记点
        positionMarker: {
            type: Object,
            default: () => {
                return { lat: '', lng: '' }
            },
        },
        //是否展示鹰眼
        showOverviewMap: {
            type: Boolean,
            default: false,
        },
        //地图缩放空间
        showControlZoom: {
            type: Boolean,
            default: false,
        },
        //是否开启绘制多边形功能
        drawToolType: {
            type: String,
            default: '',
        },
        //是否开启选择地点模式
        isChooseLocation: {
            type: Boolean,
            default: false,
        },
        mapCustomStyle: {
            type: Object,
            default: () => {
                return {
                    width: '100%',
                    height: '450px',
                }
            },
        },
        currentSelectLngLatProps: {
            type: String,
            default: () => {
                return ''
            },
        },
    },
    data() {
        return {
            map: null,
            control: null,
            polygonConfig: {
                strokeColor: '#3388FF',
                strokeWeight: 3,
                strokeOpacity: 0.8,
                fillColor: '#3388FF',
                fillOpacity: 0.3,
                strokeStyle: 'dashed',
            },
            drawTool: null, //绘制工具实例
            graphicEditor: {}, //图形编辑器
            graphicArr: [], //图形数据
            graphic: null,
            addressKeyword: '',
            localsearch: null,
            pois: [],
            poisMarker: [],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
            },
            currentSelectLngLat: '',
            currentMarker: null,
            graphicEditorType: {
                Polygon: 'PolygonEditor',
            },
        }
    },
    created() {
        console.log('this.mapId', this.mapId)
    },
    computed: {
        getGraphicEditorType() {
            return this.graphicEditorType[this.drawToolType]
        },
    },
    mounted() {
        this.map = new AMap.Map(this.mapId)
        this.map.setZoomAndCenter(this.zoom, new AMap.LngLat(this.center.lng, this.center.lat))
        this.isChooseLocation && AMap.Event.addListener(this.map, 'click', this.mapClick)

        this.createMarker(this.positionMarker)

        //是否展示鹰眼
        if (this.showOverviewMap) {
            const miniMap = new AMap.HawkEye({
                visible: true,
            })
            this.map.addControl(miniMap)
        }

        //开启地图缩放模式
        if (this.showControlZoom) {
            //创建缩放平移控件对象
            this.control = new AMap.ControlBar({
                position: {
                    top: '10px',
                    right: '10px',
                },
            })
            const toolBar = new AMap.ToolBar({
                position: {
                    top: '110px',
                    right: '40px',
                },
            })
            this.map.addControl(toolBar)
            //添加缩放平移控件
            this.map.addControl(this.control)
        }

        //开启绘制功能
        if (this.drawToolType) {
            //创建标注工具对象
            this.drawTool = new AMap.MouseTool(this.map)
            //多边形编辑器实例
            this.graphicEditor[this.getGraphicEditorType] = new AMap[this.getGraphicEditorType](this.map)
            //监听图形编辑器事件
            this.graphicEditor[this.getGraphicEditorType].on('adjust', this.overlaycomplete)
            //添加鼠标绘制工具监听事件，用于获取绘制结果
            this.drawTool.on('draw', this.overlaycomplete)
        }

        //开启选择地点模式
        if (this.isChooseLocation) {
            const config = {
                pageSize: this.pagination.pageSize, // 单页显示结果条数
                pageIndex: this.pagination.current, // 页码
                city: '', // 兴趣点城市
            }

            AMap.plugin(['AMap.PlaceSearch'], () => {
                //构造地点查询类
                this.localsearch = new AMap.PlaceSearch(config)
                AMap.Event.addListener(this.localsearch, 'complete', this.localSearchResult)
                // 失败回调
                AMap.Event.addListener(this.localsearch, 'error', (error) => {
                    alert(`查询失败：${error.info}`)
                })
            })
        }
    },
    methods: {
        mapClick(e) {
            const data = { lat: e.lnglat.getLat(), lng: e.lnglat.getLng() }
            this.currentMarker.setPosition(e.lnglat)
            this.currentSelectLngLat = data.lng + ',' + data.lat
            this.selectLocationPoint({ point: { lat: data.lat, lng: data.lng }, lat: data.lat, lng: data.lng })
        },
        //设置中心点
        setCenterAndZoom(data, zoom) {
            this.map.setZoomAndCenter(zoom, new AMap.LngLat(data.lng, data.lat))
        },
        setCurrentMarker(data) {
            this.currentMarker.setPosition(new AMap.LngLat(data.lng, data.lat))
        },
        //创建标记点
        createMarker(positionMarker) {
            if (positionMarker.lat && positionMarker.lng) {
                //创建标注对象
                this.currentMarker = new AMap.Marker({
                    position: [positionMarker.lng, positionMarker.lat],
                })
                //向地图上添加标注
                this.currentMarker.setMap(this.map)
            }
        },
        //打开绘制工具
        openDrawTool() {
            this.clearALLOverlay()
            let result = this.drawToolType.charAt(0).toLowerCase() + this.drawToolType.slice(1)
            this.drawTool.close(true)
            //关闭编辑器
            this.graphicEditor[this.getGraphicEditorType].close()
            this.drawTool[result](this.polygonConfig)
        },
        clearALLOverlay() {
            this.graphic && this.map.remove(this.graphic)
            this.graphicArr = []
        },
        //绘制完成事件
        overlaycomplete(e) {
            if (e.type == 'draw') {
                //清空绘制好的数据
                this.drawTool.close(true)
                //多边形数据
                this.graphicArr = e.obj.getPath().map((v) => {
                    return {
                        lat: v.lat,
                        lng: v.lng,
                    }
                })
                this.createGraphicEditor()
            } else if (e.type == 'adjust') {
                this.graphicArr = e.target.getPath().map((v) => {
                    return {
                        lat: v.lat,
                        lng: v.lng,
                    }
                })
            }
            this.$emit('overlaycomplete', { paths: [this.getGraphicData()] })
        },
        //获取图形数据
        getGraphicData() {
            return this.graphicArr.map((v) => {
                return { lng: v.lng, lat: v.lat }
            })
        },
        createGraphic() {
            this.createGraphicEditor()
        },
        //创建图形编辑器
        createGraphicEditor() {
            this.graphic = new AMap[this.drawToolType]({
                ...this.polygonConfig,
                path: this.graphicArr.map((v) => new AMap.LngLat(v.lng, v.lat)),
            })
            this.map.add(this.graphic)

            this.graphicEditor[this.getGraphicEditorType].setTarget(this.graphic)
            this.graphicEditor[this.getGraphicEditorType].open() //编辑模式
        },
        echoToggle(arr) {
            this.clearALLOverlay()
            this.graphicArr = arr
            this.graphic = new AMap[this.drawToolType]({
                ...this.polygonConfig,
                path: this.graphicArr.map((v) => new AMap.LngLat(v.lng, v.lat)),
            })
            //获取多边形中心点
            const { lat, lng } = this.graphic.getBounds().getCenter()
            //关闭编辑器
            this.graphicEditor[this.getGraphicEditorType].close()
            var point = new AMap.LngLat(lng, lat)
            this.map.panTo(point)
            this.map.add(this.graphic)
        },
        //关键词输入框
        showPanelInput() {
            this.pagination.current = 1
            this.localsearch.setPageIndex(this.pagination.current)
            if (this.addressKeyword) {
                this.localsearch.search(this.addressKeyword)
            } else {
                //先清除所有坐标
                this.poisMarker.forEach((v) => {
                    this.map.remove(v)
                })
                this.poisMarker = []
                this.pois = []
            }
        },
        localSearchResult(result) {
            const { poiList } = result
            //根据返回类型解析搜索结果
            this.pois = poiList.pois
            this.pagination.total = poiList.count
            //先清除所有坐标
            this.poisMarker.forEach((v) => {
                this.map.remove(v)
            })
            this.poisMarker = []
            //回显标记点
            this.pois.forEach((v) => {
                //坐标
                var lnglatArr = [v.location.lng, v.location.lat]
                var winHtml = '名称:' + v.name + '<br/>地址:' + v.address
                //创建标注对象
                var marker = new AMap.Marker({
                    position: lnglatArr,
                })
                this.poisMarker.push(marker)
                //地图上添加标注点
                marker.setMap(this.map)
                //注册标注点的点击事件
                var markerInfoWin = new AMap.InfoWindow({ content: winHtml })
                AMap.Event.addListener(marker, 'click', (event) => {
                    const { lnglat } = event
                    // 在地图上打开信息窗体
                    markerInfoWin.open(this.map, [lnglat.lng, lnglat.lat])
                    this.currentSelectLngLat = lnglat.lng + ',' + lnglat.lat
                    this.selectLocationPoint({
                        point: { lat: lnglat.lat, lng: lnglat.lng },
                        lat: lnglat.lat,
                        lng: lnglat.lng,
                    })
                })
            })

            //显示地图的最佳级别
            this.map.setFitView(this.poisMarker)
        },
        showPosition(item, index) {
            var lnglatArr = [item.location.lng, item.location.lat]
            var winHtml = '名称:' + item.name + '<br/>地址:' + item.address
            var markerInfoWin = new AMap.InfoWindow({ content: winHtml, offset: new AMap.Pixel(0, -30) })
            markerInfoWin.open(this.map, lnglatArr)
            this.currentSelectLngLat = lnglatArr[0] + ',' + lnglatArr[1]
            this.selectLocationPoint({
                point: { lat: lnglatArr[1], lng: lnglatArr[0] },
                data: item,
                lat: lnglatArr[1],
                lng: lnglatArr[0],
            })
        },
        paginationChange(page, pageSize) {
            this.pagination.current = page
            this.pagination.pageSize = pageSize
            this.localsearch.setPageIndex(page)
            this.localsearch.setPageSize(pageSize)
            this.localsearch.search(this.addressKeyword)
        },
        showSizeChange(current, pageSize) {
            this.pagination.current = current
            this.pagination.pageSize = pageSize
            this.showPanelInput()
        },
        selectLocationPoint(data) {
            this.$emit('selectLocationPoint', data)
        },
    },
}
</script>
  
<style lang="less" scoped>
.mapContent {
    .chooseLocationBox {
        overflow: hidden;
        .addressItem {
        }
    }
}
#tiandimap {
    width: 100%;
    height: 450px;
}
.ms {
    color: #888;
    display: flex;
    justify-content: center;
}
</style>  
