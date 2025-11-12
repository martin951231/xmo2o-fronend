<template>
    <div class="mapContent">
        <template v-if="isChooseLocation">
            <div class="chooseLocationBox flex">
                <div style="width: 300px;" class="mr-20">
                    <a-input class="mb-10" v-model="addressKeyword" placeholder="请输入关键字" @change="showPanelInput"></a-input>
                    <div v-if="pois.length" class="mp-10 mb-10" style="height: 400px;overflow-y: auto;">
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
            default: ()=>{
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
        //地图类型
        showMapType: {
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
                showLabel: false,
                color: 'rgb(51, 136, 255)',
                weight: 3,
                opacity: 0.8,
                fillColor: 'rgb(51, 136, 255)',
                fillOpacity: 0.3,
                lineStyle: 'dashed',
            },
            drawTool: null, //绘制工具实例
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
        }
    },
    created() {
        console.log('this.mapId', this.mapId);
    },
    mounted() {
        this.map = new T.Map(this.mapId)
        this.map.centerAndZoom(new T.LngLat(this.center.lng, this.center.lat), this.zoom)
        this.map.addEventListener('click', this.mapClick)

        this.createMarker(this.positionMarker)

        //是否展示鹰眼
        if (this.showOverviewMap) {
            const miniMap = new T.Control.OverviewMap({
                isOpen: true,
                size: new T.Point(150, 150),
            })
            this.map.addControl(miniMap)
        }

        //地图类型
        if (this.showMapType) {
            var ctrl = new T.Control.MapType()
            this.map.addControl(ctrl)
        }

        //开启地图缩放模式
        if (this.showControlZoom) {
            //创建缩放平移控件对象
            this.control = new T.Control.Zoom()
            //添加缩放平移控件
            this.map.addControl(this.control)
        }

        //开启绘制功能
        if (this.drawToolType) {
            //创建标注工具对象
            this.drawTool = new T[this.drawToolType + 'Tool'](this.map, this.polygonConfig)
            //添加鼠标绘制工具监听事件，用于获取绘制结果
            this.drawTool.addEventListener('draw', this.overlaycomplete)
        }

        //开启选择地点模式
        if (this.isChooseLocation) {
            const config = {
                pageCapacity: this.pagination.pageSize, //每页显示的数量
                onSearchComplete: this.localSearchResult, //接收数据的回调函数
            }
            this.localsearch = new T.LocalSearch(this.map, config)
        }
    },
    methods: {
        mapClick(e) {
            const data = { lat: e.lnglat.getLat(), lng: e.lnglat.getLng() }
            this.currentMarker.setLngLat(e.lnglat)
            this.currentSelectLngLat = data.lng + ',' + data.lat
            this.$emit('selectLocationPoint', { point: { lat: data.lat, lng: data.lng } })
        },
        //设置中心点
        setCenterAndZoom(data, zoom) {
            this.map.centerAndZoom(new T.LngLat(data.lng, data.lat), zoom)
        },
        setCurrentMarker(data){
            this.currentMarker.setLngLat(new T.LngLat(data.lng, data.lat))
        },
        //创建标记点
        createMarker(positionMarker) {
            if (positionMarker.lat && positionMarker.lng) {
                //创建标注对象
                this.currentMarker = new T.Marker(new T.LngLat(positionMarker.lng, positionMarker.lat))
                //向地图上添加标注
                this.map.addOverLay(this.currentMarker)
            }
        },
        //打开绘制工具
        openDrawTool() {
            this.clearALLOverlay()
            this.drawTool.open()
        },
        clearALLOverlay() {
            this.graphic && this.map.removeOverLay(this.graphic)
            this.graphicArr = []
        },
        //绘制完成事件
        overlaycomplete(e) {
            //获取多边形中心点
            const { lat, lng } = e.currentPolygon.getCenter()
            //清除绘制工具图形
            this.drawTool.clear()
            this.graphicArr = e.currentLnglats
            this.$emit('overlaycomplete', { paths: [this.getGraphicData()] })
            this.createGraphic()
        },
        //获取图形数据
        getGraphicData() {
            return this.graphicArr.map((v) => {
                return { lng: v.lng, lat: v.lat }
            })
        },
        //创建图形
        createGraphic() {
            this.graphic = new T[this.drawToolType](
                this.graphicArr.map((v) => new T.LngLat(v.lng, v.lat)),
                this.polygonConfig
            )
            //编辑模式
            this.graphic.enableEdit()
            this.map.addOverLay(this.graphic)
            this.graphic.addEventListener('edit', (e) => {
                this.graphicArr = e.target.ht[0]
                this.$emit('overlaycomplete', { paths: [this.getGraphicData()] })
            })
        },
        //关键词输入框
        showPanelInput() {
            if (this.addressKeyword) {
                this.localsearch.search(this.addressKeyword)
            } else {
                //先清除所有坐标
                this.poisMarker.forEach((v) => {
                    this.map.removeOverLay(v)
                })
                this.poisMarker = []
                this.pois = []
            }
        },
        localSearchResult(result) {
            //根据返回类型解析搜索结果
            this.pois = result.getPois() || []
            this.pagination.total = this.localsearch.getCountNumber()
            //先清除所有坐标
            this.poisMarker.forEach((v) => {
                this.map.removeOverLay(v)
            })
            this.poisMarker = []
            let zoomArr = []
            //回显标记点
            this.pois.forEach((v) => {
                //坐标
                var lnglatArr = v.lonlat.split(',')
                var lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1])
                var winHtml = '名称:' + v.name + '<br/>地址:' + v.address
                //创建标注对象
                var marker = new T.Marker(lnglat)
                zoomArr.push(lnglat)
                this.poisMarker.push(marker)
                //地图上添加标注点
                this.map.addOverLay(marker)
                //注册标注点的点击事件
                var markerInfoWin = new T.InfoWindow(winHtml, { autoPan: true })
                marker.addEventListener('click', (event) => {
                    const { lnglat } = event
                    marker.openInfoWindow(markerInfoWin)
                    this.currentSelectLngLat = lnglat.lng + ',' + lnglat.lat
                    this.$emit('selectLocationPoint', { point: { lat: lnglat.lat, lng: lnglat.lng } })
                })
            })

            //显示地图的最佳级别
            this.map.setViewport(zoomArr)
        },
        showPosition(item, index) {
            var lnglatArr = item.lonlat.split(',')
            var markerInfoWin = new T.InfoWindow('名称:' + item.name + '<br/>地址:' + item.address, { autoPan: true })
            this.poisMarker[index].openInfoWindow(markerInfoWin)
            this.currentSelectLngLat = lnglatArr[0] + ',' + lnglatArr[1]
            this.$emit('selectLocationPoint', { point: { lat: lnglatArr[1], lng: lnglatArr[0] },data: item, })
        },
        paginationChange(page, pageSize) {
            if (page > this.pagination.current) {
                this.localsearch.nextPage()
            } else {
                this.localsearch.previousPage()
            }
            this.pagination.current = page
            this.pagination.pageSize = pageSize
        },
        showSizeChange(current, pageSize) {
            this.pagination.current = current
            this.pagination.pageSize = pageSize
            this.showPanelInput()
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