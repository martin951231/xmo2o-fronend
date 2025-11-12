<template>
    <div class="allmap">
        <baidu-map class="map"
                   :center="polygon"
                   :zoom=now_zoom
                   @mousemove="syncPolyline"
                   @click="paintPolyline"
                   @ready="handler"
                   @rightclick="newPolyline">
            <bm-control class="bm-control" style="display:none">
                <div class="top">
                    <a-row>
                        <a-col :span="20">
                            <div class="top_left">
                                <div class="select_button" style="display: flex; align-items: center; justify-content: flex-start; padding-left: 20px;">
                                    <div class="color: white;font-size: 14px display: flex; flex-direction: column; justify-content: flex-start;">
                                        <div style="color: white;font-size: 14px">只看模式</div>
                                    </div>
                                    <div style="margin-left: 20px;color: white;font-size: 14px; display: flex; flex-direction: column;">
                                        <div>
                                            操作说明：
                                        </div>
                                        <div>
                                            1、在绘制网格范围时绘制完成后，点击鼠标右键进行保存；也可以在绘制区域点击右侧“保存绘制”按钮进行保存
                                        </div>
                                        <div>
                                            2、编辑模式下可在地图中进行区域绘制、编辑、删除
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </div>
            </bm-control>
            <bm-polyline :path="path" v-for="path of polyline.paths"></bm-polyline>
        </baidu-map>
        <a-modal
                title="提示"
                :visible="visible"
                :confirm-loading="confirmLoading"
                @ok="handleOk"
                @cancel="handleCancel"
        >
            <div>{{ ModalText }}</div>
        </a-modal>
        <a-modal
                title="网格信息"
                :visible="is_show_info"
                :confirm-loading="confirmLoading"
                :footer="null"
                :centered = true
                @cancel="handleCancel2"
        >
            <!-- <div v-html="InfoText"></div> -->
            <p>街道名称：{{InfoText.area_name?InfoText.area_name:InfoText.grid_name}}<img v-if="select_type == 2" src="../../../../assets/edit.png" style="width: 15px;height: 15px" @click="edit_attr"/></p>
            <p>街道联系方式：{{InfoText.grid_phone?InfoText.grid_phone:InfoText.phone}}</p>
            <p>街道人口：{{InfoText.count}}</p>
        </a-modal>
        <a-modal
                title="提示"
                :visible="notice"
                :confirm-loading="confirmLoading"
                @ok="handleOk1"
                @cancel="handleCancel1"
        >
            <div v-html="NoticeText"></div>
        </a-modal>
        <a-modal
                title="提示"
                :visible="dele"
                :confirm-loading="confirmLoading"
                @ok="handleOk3"
                @cancel="handleCancel3"
        >
            <div>{{ DelText }}</div>
        </a-modal>
        <create-form ref="createModal" @ok="handleOk4" @getGridId="getGridId" @refrashThis="refrashThis" />
        <create-village-form ref="createVillageModal" @ok="handleOk5" @getGridId="getGridId" />
        <create-single-form ref="createSingleModal" @ok="handleOk6" @getGridId="getGridId" />
        <area-info-form ref="areaInfoModal"/>
        <village-info-form ref="villageInfoModal"/>
        <single-info-form ref="singleInfoModal"/>
        <village-record-info-form ref="villageRecordInfoModal"/>
        <single-record-info-form ref="singleRecordInfoModal"/>
    </div>
</template>
<style>
    .allmap {
        width: 100%;
        height: 100%;
    }
    .map {
        width: 100%;
        height: 100%;
    }
    .bm-control {
        width: 100%;
        height: 80px;
    }
    .top{
        width: 100%;
        height: 80px;
        background-color: black;
        background-color: rgba(0, 0, 0, 0.8);
    }
    .top_left{
        width: 100%;
        height: 80px;
    }
    .start_button{
        height: 40px;
        width: 250px;
        margin-top: 20px;
        background-color: #0a8ddf;
        border:2px solid #a1a1a1;
        border-radius:10px;
    }
    .select_button{
        height: 40px;
        margin-top: 20px;
    }
    .select_type{
        width: 20%;
    }
</style>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import villageApi from '@/api/community/village';
    import CreateForm from '../../streetCommunity/gridCustom/CreateForm'
    import CreateVillageForm from '../../streetCommunity/gridCustom/CreateVillageForm'
    import CreateSingleForm from '../../streetCommunity/gridCustom/CreateSingleForm'
    import AreaInfoForm from '../../streetCommunity/gridCustom/AreaInfoForm'
    import VillageInfoForm from '../../streetCommunity/gridCustom/VillageInfoForm'
    import SingleInfoForm from '../../streetCommunity/gridCustom/SingleInfoForm'
    import VillageRecordInfoForm from '../../streetCommunity/gridCustom/VillageRecordInfoForm'
    import SingleRecordInfoForm from '../../streetCommunity/gridCustom/SingleRecordInfoForm'
    var select_type = '1';
	import store from '@/store';
    export default {
        components: {
            CreateForm,
            CreateVillageForm,
            CreateSingleForm,
            AreaInfoForm,
            VillageInfoForm,
            SingleInfoForm,
            VillageRecordInfoForm,
            SingleRecordInfoForm,
        },
        data () {
            return {
                polyline: {
                    editing: false,
                    paths: []
                },
                polygon:{   //中心点坐标
                    lng:117.283042,
                    lat:31.86119
                },
                zoom:14,   //记录层级
                now_zoom:14,   //当前所在层级
                map:'',
                BMap:'',
                BMapGL:'',
                str_lng_lat:'',
                manage_range_polygon:'',
                ModalText:'您没有绘制任何区域，请先绘制网格区域',
                InfoText:{},
                visible: false,  //进入页面提示语
                notice:false,   //点击绘制按钮提示语
                confirmLoading: false,
                select_type,  //管理模式
                button_type:1,  //按钮
                is_over:false,   //是否绘制完成
                is_show_info:false,  //是否展示街道信息
                DelText: '是否删除该区域，删除后，该区域下所绘制的区域会一并删除',//删除网格提示语
                dele:false,//删除网格
                e:'',
                type:0,//类型 1街道 2社区 3小区 4楼栋
                draw_type:1 ,//绘制网格的类型 1街道 2社区 3小区 4楼栋
                start_zoom:100,
                isDisable:true,
                clickTimes:0,
                polygon_arr:[
                ],
                grid_member_id: '',
                street_id:0
            }
        },
        computed:{
            levelTips(){
                if(this.button_type == 1){
                    return '绘制街道网格（当前层级：'+  this.now_zoom + '）';
                }else if(this.button_type == 2){
                    return '绘制社区网格（当前层级：'+  this.now_zoom + '）';
                }else if(this.button_type == 3){
                    return '绘制'+store.getters.config.house_name+'网格（当前层级：'+  this.now_zoom + '）';
                }else if(this.button_type == 4){
                    return '绘制'+store.getters.config.single_name+'网格（当前层级：'+  this.now_zoom + '）';
                }
            },
            NoticeText(){
                return '<h5>您当前所在地图层级为'+this.now_zoom+'级，所需绘制的区域为完整的街道区域，当您街道区域绘制完成后，该层级对应的地理位置信息为街道。街道绘制完成后，请在街道下绘制社区/'+store.getters.config.house_name+'/'+store.getters.config.single_name+'各自对应的区域，同样，绘制时所在的地图层级对应为各自的区域信息。例如</h5><h5>1、当前地图层级为10级，绘制完成后，街道所对应的地图层级为10级，社区/'+store.getters.config.house_name+'在10级查看区域信息时，就是对应街道的信息。</h5><h5>2、当绘制社区的区域是在地图层级为14时，社区/'+store.getters.config.house_name+'在14级查看的信息就是对应社区的信息。</h5><h5>3、同理，'+store.getters.config.house_name+'的区域位置及对应的地图层级也是如此。</h5>';
            }
        },
        mounted(){
            window.addEventListener('mousewheel',this.handleScroll);
        },
        inject:['reload'],
        methods: {
            edit_attr(){
                this.is_show_info = false
                this.$refs.createModal.edit(this.InfoText.id);
            },
            refrashThis(){
                console.log('1234567890')
                this.button_type = 4
                // this.reload()
            },
            getGridId(id){
                this.grid_member_id = id
            },
            handleSelectChange(value) {
                console.log(value, this.now_zoom, this.button_type);
                if(this.polygon_arr != []){
                    this.polygon_arr.map((item,i)=> {
                        if (this.select_type == 2) {
                            item.enableEditing(); //允许拖拽
                            item.disableMassClear();
                            item.addEventListener("lineupdate", this.lineupdateFunction);
                        }else{
                            item.disableEditing();//不允许拖拽
                            item.enableMassClear();
                        }
                    });
                }
            },
            handleOk(e) {
                this.visible = false;
                this.confirmLoading = false;
                this.select_type = '2';
            },
            handleCancel(e) {
                console.log('Clicked cancel button');
                this.visible = false;
            },
            tishi(){
                console.log(this.button_type)
                if(this.button_type != 0 && this.button_type == 1){
                    this.notice = true;
                }else if(this.button_type != 0 && this.button_type != 1){
                    if(this.polygon_arr != []){
                        this.polygon_arr.map((item,i)=> {
                            item.disableMassClear();
                        });
                    }
                    this.toggle('polyline');
                }else{
                    this.toggle('polyline');
                }
            },
            handleOk1(e) {
                if(this.polygon_arr != []){
                    this.polygon_arr.map((item,i)=> {
                        item.disableMassClear();
                    });
                }
                this.notice = false;
                this.confirmLoading = false;
                this.toggle('polyline');
            },
            handleCancel1(e) {
                console.log('Clicked cancel button');
                this.notice = false;
            },
            handleCancel2(e) {
                this.is_show_info = false;
            },
            handleOk3(e) {
                this.dele = false;
                this.deleteAll(this.e);
            },
            handleCancel3(e) {
                this.dele = false;
            },
            handleOk4 () {
                this.$refs.table.refresh()
            },
            handleOk5 () {
                this.$refs.table.refresh()
            },
            handleOk6 () {
                this.$refs.table.refresh()
            },
            handler({BMap,map}){
                this.map = map;
                this.BMap = BMap;
                this.getCenterPolygon();
                this.getAreaRange();
            },
            //点击页面右上角按钮
            toggle (name) {
                this.is_over = false;
                if(this.button_type != 0){
                    if(name=='polyline'){
                        this.polyline.editing= true;
                    }else{
                        this[name].editing = true;
                    }

                    this.button_type = 0;
                }else{
                    this.saveData();
                }
            },
            //保存数据
            saveData(){
                console.log("124567890-0")
                let _this = this;
                var polygonCenterCode = this.getPolygonCenterCode(this.str_lng_lat);
                var center = this.map.getBounds().getCenter();
                this.request(streetCommunityApi.addGridRange, {
                    manage_range_polygon:this.str_lng_lat,
                    zoom:this.zoom,
                    lng: center.lng,
                    lat:center.lat,
                    polygon_center_code:polygonCenterCode
                }).then((res) => {
                    _this.$message.success('绘制成功');
                    this.reload();
                    this.select_type = '2';
                });
            },
            deleteAll(e) {
                this.overlaycomplete(e);
                this.map.removeOverlay(e.overlay);
                if(!this.str_lng_lat){
                    this.$message.warn('请先选择要删除的区域')
                    return
                }
                this.request(streetCommunityApi.delGridRange, {
                    manage_range_polygon:this.str_lng_lat,
                }).then((res) => {
                    this.$message.success('删除成功');
                    this.reload();
                })
            },
            syncPolyline (e) {
                this.e = e;
                this.overlaycomplete(e,2);
                if (!this.polyline.editing) {
                    return
                }
                const {paths} = this.polyline
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
            newPolyline (e) {
                this.e = e;
                this.str_lng_lat = ''
                this.overlaycomplete(e);
                if(this.select_type == '2' && this.button_type != 0 && this.str_lng_lat){
                    this.dele = true;
                }
                console.log('select_type',this.select_type,'button_type',this.button_type,'draw_type',this.draw_type,'polyline',this.polyline);
                if (!this.polyline.editing) {
                    return
                }
                const {paths} = this.polyline
                if(!paths.length) {
                    paths.push([])
                }
                const path = paths[paths.length - 1]
                path.pop()
                if (path.length) {
                    paths.push([])
                }
                this.is_over = true;
                this.overlaycomplete(e);
                this.polyline.editing = false;
                var center = this.map.getBounds().getCenter();
                console.log('this.str_lng_lat===>', this.str_lng_lat, this.str_lng_lat.split('|'))
                let strLength = this.str_lng_lat.split('|').length
                if(this.str_lng_lat && strLength>=3){
                    this.$refs.createModal.add(this.str_lng_lat,this.zoom,center.lng,center.lat,e.overlay);
                } else{
                    this.$refs.createModal.handleCancel()
                    this.$message.warn('请先绘制完整的区域')
                }
            },

            overlaycomplete(e,m=1){
                let that = this
                if(e.overlay){
                    var path = e.overlay.getPath();//Array<Point> 返回多边型的点数组
                    if(m==1){
                        this.str_lng_lat = '';
                        for(var i=0;i<=path.length-1;i++){
                            this.str_lng_lat += path[i].lng+','+path[i].lat+'|';
                        }
                        this.str_lng_lat=this.str_lng_lat.substring(0,this.str_lng_lat.length-1);
                        return this.str_lng_lat;
                    }else if(m==2){
                        this.manage_range_polygon = '';
                        for(var i=0;i<=path.length-1;i++){
                            this.manage_range_polygon += path[i].lng+','+path[i].lat+'|';
                        }
                        this.manage_range_polygon=this.manage_range_polygon.substring(0,this.manage_range_polygon.length-1);
                    }
                }
            },
            paintPolyline (e) {
                let _this = this;
                _this.clickTimes += 1;
                if(_this.clickTimes == 2){
                    _this.addZoom();
                    _this.clickTimes = 0;
                    return false;
                }
                if(_this.button_type == 0){
                    var remain_time = 0;
                }else{
                    var remain_time = 400;
                }
                setTimeout(function () {
                    if (_this.clickTimes == 1) {
                        _this.clickTimes = 0; // 单击清零
                        if(_this.is_over == true || _this.select_type == '1' || (_this.select_type == '2' && _this.button_type != 0)){
                            var str_lng_lat = _this.overlaycomplete(e);
                            if(str_lng_lat){
                                _this.request(streetCommunityApi.showInfo,{
                                    str_lng_lat:str_lng_lat,
                                    street_id:_this.street_id
                                }).then((res)=>{
                                    if(res != ''){
                                        if(res.type == 1){
                                            _this.InfoText = res;
                                            _this.is_show_info = true;
                                        }else if(res.type == 2){
                                            _this.$refs.areaInfoModal.add(res.grid_name,res.grid_phone,res.area_name,res.polygon_name,_this.select_type,res.id);
                                        }else if(res.type == 3){
                                            if(_this.select_type == 2){
                                                _this.$refs.villageInfoModal.add(res.grid_name,res.grid_phone,res.area_name,res.polygon_name,res.village_name,_this.select_type,res.id);
                                            }else{
                                                _this.$refs.villageRecordInfoModal.add(res.grid_name,res.grid_phone,res.area_name,res.village_name,res.village_id,res.property_phone,res.village_people_count);
                                            }
                                        }else if(res.type == 4){
                                            if(_this.select_type == 2){
                                                _this.$refs.singleInfoModal.add(res.grid_name,res.grid_phone,res.area_name,res.polygon_name,res.village_name,res.single_name,_this.select_type,res.id);
                                            }else{
                                                _this.$refs.singleRecordInfoModal.add(res.single_id,res.street_name+'/'+res.area_name+'/'+res.village_name);
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        if (!_this.polyline.editing) {
                            return
                        }
                        const {paths} = _this.polyline
                        !paths.length && paths.push([])
                        paths[paths.length - 1].push(e.point)
                    }
                }, remain_time);
            },
            //监听鼠标滚动空置层级
            handleScroll(e){
                if(this.isDisable == false){
                    return false;
                }
                if(this.$refs.createSingleModal.visible || this.$refs.createModal.visible || this.$refs.createVillageModal.visible || this.$refs.areaInfoModal.visible || this.$refs.villageInfoModal.visible || this.$refs.singleInfoModal.visible || this.is_show_info || this.$refs.villageRecordInfoModal.visible || this.$refs.singleRecordInfoModal.visible){
                    return  false;
                }

                this.isDisable = false;
                let _this = this;
                var e = e || window.event;
                if(this.button_type != 0){
                    if(_this.polygon_arr.length > 0 ){
                        _this.polygon_arr.map((item,i)=> {
                            item.enableMassClear();
                        });
                    }
                }
                if(e.wheelDelta > 0) {
                    if(this.polyline.editing == false){
                        this.zoom = this.zoom + 1;
                    }
                    if(this.zoom > 19){
                        this.zoom = 19;
                    }
                    this.getZoomLastGrid(this.now_zoom,this.e,0);
                    if(this.type == 1  && this.now_zoom+1 > this.start_zoom){
                        this.button_type = 2;
                        this.draw_type = 2;
                    }else if(this.type == 2 && this.now_zoom+1 > this.start_zoom){
                        this.button_type = 3;
                        this.draw_type = 3;
                    }else if(this.type == 3 && this.now_zoom+1 > this.start_zoom){
                        this.button_type = 4;
                        this.draw_type = 4;
                    }else if(this.type == 4 && this.now_zoom+1 > this.start_zoom){
                        this.button_type = 4;
                        this.draw_type = 4;
                    }
                }else{
                    if(this.polyline.editing == false){
                        this.zoom = this.zoom - 1;
                    }
                    if(this.zoom < 4){
                        this.zoom = 4;
                    }
                    this.getZoomLastGrid(this.now_zoom,this.e,1);
                }
                setTimeout(()=>{
                    _this.isDisable = true;
                },1000);
            },
            //上级地图增加层级
            addZoom() {
                if(this.polyline.editing == false){
                    this.zoom = this.zoom + 1;
                }
                if(this.polygon_arr != []){
                    this.polygon_arr.map((item,i)=> {
                        item.enableMassClear();
                    });
                }
                if(this.zoom > 19){
                    this.zoom = 19;
                }
                this.getZoomLastGrid(this.now_zoom,this.e,0);
                if(this.type == 1 && this.now_zoom+1 > this.start_zoom){
                    this.button_type = 2;
                    this.draw_type = 2;
                }else if(this.type == 2 && this.now_zoom+1 > this.start_zoom){
                    this.button_type = 3;
                    this.draw_type = 3;
                }else if(this.type == 3 && this.now_zoom+1 > this.start_zoom){
                    this.button_type = 4;
                    this.draw_type = 4;
                }else if(this.type == 4 && this.now_zoom+1 > this.start_zoom){
                    this.button_type = 4;
                    this.draw_type = 4;
                }
            },

            //获取地图中心点
            getCenterPolygon(){
                this.request(villageApi.HouseGridGetMap, {}).then((res) => {
                    this.street_id=res.street_id;
                    this.polygon.lng = res.long;
                    this.polygon.lat = res.lat;
                })
            },
            //获取网格集合
            getAreaRange(){
                this.request(villageApi.HouseGridGetRangeList, {}).then((res) => {
                    if(res.data == ''){
                        if(res.type == 2){
                            this.button_type = 2;
                            this.now_zoom = 15;
                        }
                    } else{
                        var manage_range_polygon = new Array();
                        var polygon_arr = new Array();
                        res.data.map((item,i)=>{
                            if(item.zoom){
                                this.now_zoom = item.zoom;
                                this.zoom = item.zoom;
                                this.start_zoom = item.zoom;
                            }
                            this.type = item.type;
                            this.button_type = item.type;
                            manage_range_polygon = new Array();
                            item.manage_range_polygon.map((item1,i1)=>{
                                var a = new Array();
                                a = item1.split(',');
                                manage_range_polygon[i1] = new this.BMap.Point(a[0],a[1]);
                            });
                            var polygon;
                            if(item.type == 1){
                                polygon = new this.BMap.Polygon(manage_range_polygon, {strokeColor:"#2681f3", strokeWeight:2, strokeOpacity:0.8,fillColor:"#2681f3",strokeStyle:"dashed"});
                            } else if(item.type == 2){
                                polygon = new this.BMap.Polygon(manage_range_polygon, {strokeColor:"#fed1b3", strokeWeight:2, strokeOpacity:0.8,fillColor:"#fed1b3",strokeStyle:"dashed"});
                            } else if(item.type == 3){
                                polygon = new this.BMap.Polygon(manage_range_polygon, {strokeColor:"#9eeede", strokeWeight:2, strokeOpacity:0.8,fillColor:"#9eeede",strokeStyle:"dashed"});
                            } else if(item.type == 4){
                                polygon = new this.BMap.Polygon(manage_range_polygon, {strokeColor:"#c8d5f5", strokeWeight:2, strokeOpacity:0.8,fillColor:"#c8d5f5",strokeStyle:"dashed"});
                            }
                            this.map.addOverlay(polygon);//添加多边形图层
                            if(this.select_type == 2){
                                polygon.enableEditing(); //允许拖拽
                                polygon.disableMassClear();
                                polygon.addEventListener("lineupdate", this.lineupdateFunction);
                            }
                            polygon_arr[i] = polygon;
                        });
                        this.polygon_arr = polygon_arr;
                        console.log('lijie',this.polygon_arr);
                    }
                })
            },


            changeSelectType(){
                this.select_type = '2';
            },
            //获取离当前层级最近的网格
            getZoomLastGrid(zoom,e,i){
                var isJian = false;
                var rtn = this.overlaycomplete(e);
                if(i){
                    zoom = zoom-1;
                    isJian = true;
                }else{
                    zoom = zoom+1;
                }
                this.request(streetCommunityApi.getZoomLastGrid,{
                    zoom:zoom,
                    str_lng_lat:rtn,
                    is_jian : isJian,
                    street_id:this.street_id
                }).then((res)=>{
                    this.now_zoom = zoom;
                    if(this.now_zoom > 19){
                        this.now_zoom = 19
                    }
                    if(res != ''){
                        this.map.clearOverlays();//删除全部
                        var polygon_arr = new Array();
                        res.map((item,index)=>{
                            this.type = item.type;
                            this.start_zoom = item.zoom;
                            if(isJian == true){
                                this.button_type = item.type;
                                this.draw_type = item.type;
                            }
                            var manage_range_polygon = new Array();
                            item.manage_range_polygon.map((item1,i1)=>{
                                var a = new Array();
                                a = item1.split(',');
                                manage_range_polygon[i1] = new this.BMap.Point(a[0],a[1]);
                            });
                            console.log('hui',manage_range_polygon);
                            var polygon = new this.BMap.Polygon(manage_range_polygon, {strokeColor:"#2681f3", strokeWeight:2, strokeOpacity:0.8,fillColor:"#2681f3",strokeStyle:"dashed"});
                            this.map.addOverlay(polygon);//添加多边形图层
                            //polygon.enableEditing();
                            if(this.select_type == 2){
                                polygon.enableEditing(); //是否允许拖拽
                                polygon.addEventListener("lineupdate", this.lineupdateFunction);
                                polygon.disableMassClear();
                            }
                            polygon_arr[index] = polygon;
                        });
                        this.polygon_arr = polygon_arr;
                    }else{
                        if(this.now_zoom <= this.start_zoom){
                            if(this.type != 0){
                                this.button_type = this.draw_type = this.type;
                            }
                        }
                    }
                })
            },
            //获取多边形中心点位置
            getPolygonCenterCode(path){
                path = path.split('|');
                path.forEach((item,i) =>{
                    item = item.split(',');
                    path[i] = item;
                });
                var x = 0,
                    y = 0;
                for(var k = 0;k<path.length;k++){
                    x=x+ parseFloat(path[k][0]);
                    y=y+ parseFloat(path[k][1]);
                }
                x=x/path.length;
                y=y/path.length;
                return [x,y];
            },
            // 划线监听事件
            lineupdateFunction (vl){
                console.log('++++++++',vl);
                let _this = this;
                let path = vl.currentTarget.Ho;
                let  str_lng_lat = '';
                for(var i=0;i<=path.length-1;i++){
                    str_lng_lat += path[i].lng+','+path[i].lat+'|';
                }
                str_lng_lat=str_lng_lat.substring(0,str_lng_lat.length-1);
                this.request(streetCommunityApi.saveRange,{
                    str_lng_lat:_this.manage_range_polygon,
                    new_str_lng_lat : str_lng_lat
                }).then((res)=>{
                    this.$message.success('拖拽保存成功')
                });
            },
        },
        beforeDestroy(){
            window.removeEventListener('mousewheel',this.handleScroll);
        },
        //监听更新路由操作
        beforeRouteLeave (to, from, next) {
            let that = this;
            if(that.is_over == true){
                this.$confirm({
                    title: '您绘制的区域没有保存，是否需要保存',
                    content: '',
                    okText: '保存',
                    okType: '',
                    cancelText: '不保存',
                    onOk() {
                        that.saveData();
                    },
                    onCancel() {
                        next();
                    },
                });
            }else{
                next();
            }
        },
    }
</script>
<style scoped>
    p{
        margin-left: 170px;
    }
</style>