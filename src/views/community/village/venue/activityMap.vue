<template>
    <a-modal :title="title" :width="900" :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="10" :sm="10" >
                    <a-input-group compact>
                        <p style="margin-top: 5px;">关键词：</p>
                        <a-input style="width: 70%" v-model="search.keyword"/>
                    </a-input-group>
                </a-col>
                <a-col :md="3" :sm="24" style="padding-right: 0 !important;padding-left: 0 !important;">
                    <a-button type="primary" @click="subBut()">
                        提交
                    </a-button>
                </a-col>
                <a-col :md="2" :sm="24" style="padding-right: 0 !important;padding-left: 0 !important;">
                    <a-button  @click="resetList()">清空</a-button>
                </a-col>
                <span v-if="markerPoint.lng > 0" style="line-height: 30px;color: red;">当前选中地址：{{markerPoint.address}}</span>
            </a-row>
        </div>
        <div class="map" style="width: 100% !important;height: 500px !important;">
            <baidu-map
                    :center="center"
                    :scroll-wheel-zoom="true"
                    :zoom="zoom"
                    @ready="handler"
                    @click="getClickInfo"
                    class="BMap"
                    style="width: 100%;height: 100%;"
            >
                <bm-marker
                        :position="markerPoint"
                        :dragging="true"
                        @dragend="dragend"
                ><bm-label content="我在这" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -26, height: 26}"/></bm-marker>
                <bm-local-search :keyword="search.keyword" :auto-viewport="true" :location="search.location"></bm-local-search>
            </baidu-map>
        </div>
    </a-modal>
</template>
<script>
    import moment from 'moment';
    import villageApi from '@/api/community/village';
    export default {
        name: 'activityMap',
        components: {},
        data() {
            return {
                title: '新建',
                confirmLoading: false,
                visible: false,
                loading: false,
                center: {      //地图中心
                    lng: 106.35586,
                    lat: 27.759588
                },
                post: {
                    id: 0,
                    lng: 0,
                    lat: 0
                },
                markerPoint: {
                    lng: 0,
                    lat: 0,
                    address:''
                },
                zoom: 16,
                search: {
                    location: '',
                    keyword: ''
                },
                map:'',
                BMap:'',
            }
        },
        mounted() {},
        methods: {
            moment,
            handler ({BMap, map}) {
                this.map = map;
                this.BMap = BMap;
                console.log('handler')
            },

            dragend (e) {
                this.getLocations(e,0);
            },

            //地图点击事件
            getClickInfo (e) {
                this.getLocations(e,0);
            },
            //获取地址
            getLocations(e,t){
                let _this = this;
                console.log('获取地址')
                let geocoder = new _this.BMap.Geocoder(); //创建地址解析器的实例
                let r=[];
                if(t == 1){
                    r = new _this.BMap.Point(e.point.lng,e.point.lat);
                }else{
                    r=e.point;
                }
                geocoder.getLocation(r, function(rs) {
                    const addrComponent = rs.addressComponents
                    const surroundingPois = rs.surroundingPois
                    const province = addrComponent.province
                    const city = addrComponent.city
                    const district = addrComponent.district
                    let addr = addrComponent.street
                    if (surroundingPois.length > 0 && surroundingPois[0].title) {
                        if (addr) {
                            addr += `-${surroundingPois[0].title}`
                        } else {
                            addr += `${surroundingPois[0].title}`
                        }
                    } else {
                        addr += addrComponent.streetNumber
                    }
                    _this.markerPoint['address'] = province+city+district+addr;
                });
                _this.markerPoint['lng'] = e.point['lng'];
                _this.markerPoint['lat'] = e.point['lat'];
            },
            //提交
            subBut() {
                if(this.markerPoint.lng == 0){
                    this.$message.error('请先在地图完成选点')
                    return false;
                }
                this.$emit('change',this.markerPoint);
                this.resetList();
                this.handleCancel();
            },

            // 进行重置
            resetList() {
                this.markerPoint = { lng: 0, lat:0,address:''};
                this.search = { location: '', keyword:''};
            },

            //页面加载
            init_(id,lng,lat){
                let _this = this;
                id=Number(id);
                lng=Number(lng);lat=Number(lat);
                _this.title = '地图选点';
                _this.search = { location: '', keyword:''};
                _this.post = {id: id, lng: lng, lat:lat};
                _this.markerPoint = { lng: 0, lat:0 ,address:''};
                if(id == 0){
                    //todo 获取默认经纬度
                    this.request(villageApi.venueActivityLocation).then((data) => {
                        if (data){
                            _this.post.lng=Number(data.lng);
                            _this.post.lat=Number(data.lat);
                        }
                    });
                }
                console.log(_this.post)
                if(_this.post.id > 0){
                    setTimeout(function(){
                        _this.center = { lng: _this.post.lng, lat:_this.post.lat};
                        _this.getLocations({"point": {"lng": _this.post.lng,"lat": _this.post.lat}},1);
                    },800);
                }else{
                    setTimeout(function(){
                        _this.center = { lng: _this.post.lng, lat:_this.post.lat};
                    },800);
                }
                _this.zoom=15;
                _this.loading = true;
                _this.visible = true;
                console.log('init_')
            },

            handleCancel() {
                this.visible = false;
            },
        },
    }
</script>
<style lang="less" scoped>
    /*/deep/ .map{*/
        /*width: 500px !important;*/
        /*height: 500px !important;*/
    /*}*/

</style>