<template>
    <div class="screen_index" v-if="refrashThis">
        <div class="top_title">
            <div class="left_tab">
                <div class="tab_item" v-for="(item, index) in tabList" @click="chooseTab(index)">
                    <div class="item_title" :class="currentIndex == index?'active':''">{{item.name}}</div>
                    <img :src="tabselectIcon" class="item_icon" v-if="currentIndex == index"/>
                </div>
            </div>
            <div class="title_content">
                <div class="txt">{{indexData.visualize_title}}</div>
            </div>
            
            <div class="right_tab">
                <div class="txt" v-if="cityCountyManageFuncJudge>0 && is_street_login && street_communitys.length>0">
                    <a-popconfirm placement="bottomRight" ok-text=" 确 认 " cancel-text=" 取 消 " @confirm="swapCityRegion"
                        @visibleChange="handleVisibleChange">
                        <template slot="title">
                            <p class="swap_region_title">区域切换</p>
                            <div class="swap_region_content">
                                <div class="itemdiv">
                                    <span style="width: 80px;display: inline-block;">社区：</span>
                                    <a-select style="width: 250px" @change="handleCommunityChange"
                                        v-model="swap_community_id">
                                        <a-select-option :value="0">
                                            请选择社区
                                        </a-select-option>
                                        <a-select-option v-for="(item3,index3)  in street_communitys"
                                            :value="item3.area_id">
                                            {{ item3.area_name }}
                                        </a-select-option>
                                    </a-select>
                                </div>
                            </div>
                        </template>
                        <span>{{indexData.street_community_name}} <a-icon type="swap" /></span>
                    </a-popconfirm>
                </div>
            </div>
            
        </div>
        <div class="view_container" id="map_container">
            <div class="left_box">
                <div class="box_content" v-for="(item, index) in leftList[currentIndex]" :key="index">
                    <div class="box_title">
                        <data-title :chinaName="item.titleArr.chinaName" :englishName="item.titleArr.englishName" :swap_community_id="swap_community_id" />
                    </div>
                    <div class="box_content_bottom">
                        <component :is="item.component" :swap_community_id="swap_community_id"/>
                    </div>
                </div>
            </div>
            <div class="middle_box">
                <div class="top_scroll">
                    <marqueeLeft v-if="newsList.length>0" :sendVal="newsList" @clickEvent="navigateTo"></marqueeLeft>
                </div>
                 <iframe
                    class="top_map"
                    :src="vr720yunConfig.vr_720yun_url"
                    v-if="vr720yunConfig && vr720yunConfig.vr_720yun_switch == 1 && vr720yunConfig.vr_720yun_url"
                ></iframe>
                <div class="top_map" v-else>
                    <baidu-map @ready="mapReady" :scroll-wheel-zoom="true" @click="selectcity"
                        class="BMap">
                    </baidu-map>
                    <div class="map_tips" v-if="indexData.region_count_info && indexData.region_count_info.length>0">
                        <div class="tips_item" v-for="(item, index) in indexData.region_count_info" :key="index">
                            <div class="left_label">{{item.key}}：</div>
                            <div class="right_value">{{item.value}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right_box">
                <div class="box_content" v-for="(item, index) in rightList[currentIndex]" :key="index">
                    <div class="box_title">
                        <data-title :chinaName="item.titleArr.chinaName" :englishName="item.titleArr.englishName" :swap_community_id="swap_community_id" />
                    </div>
                    <div class="box_content_bottom">
                        <component :is="item.component" :swap_community_id="swap_community_id" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity';
    import mapStyle from "./utils/mapStyle1.js";
    import preventionControl from "./components/preventionControl.vue";
    import nationStatistics from "./components/nationStatistics.vue";
    import partyMembers from "./components/partyMembers.vue";
    import genderStatistics from "./components/genderStatistics.vue";
    import educationalLevel from "./components/educationalLevel.vue";
    import partyActivities from "./components/partyActivities.vue";
    import ageStatistics from "./components/ageStatistics.vue";
    import partyConsultation from "./components/partyConsultation.vue";
    import partyOrganization from "./components/partyOrganization.vue";
    import populationMsg from "./components/populationMsg.vue";
    import residentsNature from "./components/residentsNature.vue";
    import dataTitle from "./components/dataTitle.vue";
    import eventReporting from "./components/eventReporting.vue";
    import communityCare from "./components/communityCare.vue";
    import sessionsLesson from "./components/sessionsLesson.vue";
    import maritalStatus from "./components/maritalStatus.vue";
    import hotNews from "./components/hotNews.vue";
    import communityProperty from "./components/communityProperty.vue";
    import surveillanceOne from "./components/surveillanceOne.vue";
    import surveillanceTwo from "./components/surveillanceTwo.vue";
    import marqueeLeft from "./components/marqueeX.vue";
    export default{
        data(){
            return{
                tabselectIcon: require('./images/active_tab_icon.png'),
                indexData: {},
                center: {
                    lng: 117.283042,
                    lat: 31.86119
                },
                centerPopup: {
                    lng: 117.283042,
                    lat: 31.86119
                },
                zoom: 8,
                points: [],
                markerPoint: {},
                currentIndex: 0,
                tabList: [
                    {name: "社区党建"},
                    {name: "人口分析"},
                    {name: "事件分析"}
                ],
                leftList:[
                    [{id: 1, titleArr: {chinaName: '党组织架构统计', englishName: 'Architecture statistics'}, component: 'partyOrganization'},
                     {id: 2, titleArr: {chinaName: '党员数量统计', englishName: 'Quantity statistics'}, component: 'partyMembers'},
                     {id: 3, titleArr: {chinaName: '党建活动', englishName: 'Party building activities'}, component: 'partyActivities'},],
                     
                    [{id: 4, titleArr: {chinaName: '人口信息', englishName: 'Demographic information'}, component: 'populationMsg'},
                     {id: 5, titleArr: {chinaName: '男女比例统计', englishName: 'Proportional statistics'}, component: 'genderStatistics'},
                     {id: 6, titleArr: {chinaName: '年龄段统计', englishName: 'Age group statistics'}, component: 'ageStatistics'},],
                     
                    [{id: 7, titleArr: {chinaName: '事件上报', englishName: 'Event reporting'}, component: 'eventReporting'},
                     //{id: 8, titleArr: {chinaName: '疫情防控数据统计', englishName: 'Prdata statistics'}, component: 'preventionControl'},
                     { id: 8,titleArr: {chinaName: '民族统计',englishName: 'Nationality statistics'},component: 'nationStatistics'},
                     {id: 9, titleArr: {chinaName: '社区关怀', englishName: 'Community care'}, component: 'communityCare'},]
                ],
                
                rightList: [
                    [{id: 1, titleArr: {chinaName: '三会一课', englishName: 'Three sessions and one lesson'}, component: 'sessionsLesson'},
                     {id: 2, titleArr: {chinaName: '党内咨询', englishName: 'Inner party consultation'}, component: 'partyConsultation'},
                     {id: 3, titleArr: {chinaName: '热点新闻', englishName: 'hot news'}, component: 'hotNews'},],
                     
                    [{id: 4, titleArr: {chinaName: '居民人口性质统计', englishName: 'Demographic nature'}, component: 'residentsNature'},
                     {id: 5, titleArr: {chinaName: '教育水平统计', englishName: 'Educational level'}, component: 'educationalLevel'},
                     {id: 6, titleArr: {chinaName: '婚姻状况统计', englishName: 'Marital status'}, component: 'maritalStatus'},],
                     
                    [{id: 7, titleArr: {chinaName: '社区物业统计', englishName: 'Community property'}, component: 'communityProperty'},
                     {id: 8, titleArr: {chinaName: '视频监控一', englishName: 'Video surveillance'}, component: 'surveillanceOne'},
                     {id: 9, titleArr: {chinaName: '视频监控二', englishName: 'Video surveillance'}, component: 'surveillanceTwo'},]
                ],
                newsList: [],
                scrollUrl: '',
                mapDialog: {
                    longitude: 0,
                    latitude: 0
                },
                cityCountyManageFuncJudge:0,
                is_street_login:0,
                street_communitys:[],
                swap_community_id:0,
                refrashThis: true,
                vr720yunConfig: {},
            }
        },
        
        components: {
            preventionControl,
            partyMembers,
            genderStatistics,
            educationalLevel,
            partyActivities,
            ageStatistics,
            partyConsultation,
            partyOrganization,
            populationMsg,
            residentsNature,
            dataTitle,
            eventReporting,
            communityCare,
            sessionsLesson,
            maritalStatus,
            hotNews,
            surveillanceOne,
            surveillanceTwo,
            communityProperty,
            marqueeLeft,
            nationStatistics
        },
        
        mounted(){
            this.getScrollList()
        },
        
        methods:{
            chooseTab(index){
                if(this.currentIndex!=index){
                    this.currentIndex = index
                    this.getScrollList()
                } else {
                    console.log("重复")
                }
            },
            swapCityRegion() {
                this.refrashThis = false
                this.$nextTick(()=>{
                    this.refrashThis = true
                });
            },
            handleVisibleChange(visible) {
                console.log('visible', visible);
            },
            handleCommunityChange(ev) {
                console.log('community_id', ev);
            },
            selectcity(e){
                this.mapDialog.longitude = e.point.lng; //经度
                this.mapDialog.latitude = e.point.lat; //维度
            },
            mapReady({ BMap, map }) {
                let self = this
                self.request(streetCommunityApi.getIndex,  {swap_community_id:this.swap_community_id}).then((res) => {
                    self.indexData = res
                    self.tabList = [{
                        name: res.visualize_nav1
                    },{
                        name: res.visualize_nav2
                    },{
                        name: res.visualize_nav3
                    }]
                    self.leftList[2][1].titleArr.chinaName = res.visualize_nav4
                    self.cityCountyManageFuncJudge=0;
                    self.vr720yunConfig = res.vr720yunConfig;
                 if(res.cityCountyManageFuncJudge!= undefined && res.cityCountyManageFuncJudge>0){
                        self.cityCountyManageFuncJudge= res.cityCountyManageFuncJudge;
                        self.leftList[2][1] =  { id: 8,titleArr: {chinaName: '民族统计',englishName: 'Nationality statistics'},component: 'nationStatistics'}
                    }
                    if(res.is_street_login != undefined){
                        this.is_street_login=res.is_street_login;
                    }
                    if(res.street_communitys != undefined && res.street_communitys){
                        this.street_communitys=res.street_communitys;
                    }
                    
                    // map.setMapStyle(mapStyle);
                    // map.clearOverlays();
                    // 中心点位
                    // self.point = new BMap.Point(res.position.lng, res.position.lat);
                    // let point = map.centerAndZoom(self.point, 15);
                    // let myIcon = new BMap.Icon(res.position.icon, new BMap.Size(24, 24), {});
                    // let marker = new BMap.Marker(self.point, {icon: myIcon});
                    // let labelopts = {
                    //     position: self.point,
                    //     offset: new BMap.Size(0, 15)
                    // };
                    // let label = new BMap.Label(res.position.area_name, labelopts);
                    // label.setStyle({
                    //     color: "#fff",
                    //     backgroundColor: "rgba(0, 0, 0, 0.5)",
                    //     borderRadius: "10px",
                    //     padding: "0 10px",
                    //     fontSize: "10px",
                    //     lineHeight: "20px",
                    //     border :"0",
                    //     transform:'translateX(-50%)'
                    // });
                    // marker.addEventListener('click', function(){})
                    // map.addOverlay(label);
                    // map.addOverlay(marker);
                    
                    let partybranch_list = res.partybranch_list
                    let work_list = res.work_list
                    partybranch_list.map(v=>{
                        let partybranchIcon = new BMap.Icon(v.icon, new BMap.Size(24, 24), {});
                        let partybranchMarker = new BMap.Marker(new BMap.Point(v.lng, v.lat), {icon: partybranchIcon});
                        partybranchMarker.addEventListener('click', function(){
                            let steelContent = `<div>
                                 <div style="margin-top: 5px">党支部名称：${v.name}</div>
                                 <div style="margin-top: 5px">党支部类型：${v.type}</div>
                                 <div style="margin-top: 5px">地址：${v.adress}</div>
                            </div>`
                            let opts = {
                                width: 250,     // 信息窗口宽度
                                height: 150,    // 信息窗口高度
                                title: "党支部信息"  // 信息窗口标题
                            }
                            let infoWindow = new BMap.InfoWindow(steelContent, opts);  // 创建信息窗口对象
                            map.openInfoWindow(infoWindow, new BMap.Point(v.lng, v.lat));        // 打开信息窗口
                        })
                        
                        // let labelopts = {
                        //     position: new BMap.Point(v.lng, v.lat),
                        //     offset: new BMap.Size(0, 15)
                        // };
                        
                        // let label = new BMap.Label(v.name, labelopts);
                        // label.setStyle({
                        //     color: "#fff",
                        //     backgroundColor: "rgba(0, 0, 0, 0.5)",
                        //     borderRadius: "10px",
                        //     padding: "0 10px",
                        //     fontSize: "10px",
                        //     lineHeight: "20px",
                        //     border :"0",
                        //     transform:'translateX(-50%)'
                        // });
                        // map.addOverlay(label);
                        map.addOverlay(partybranchMarker);
                    })
                    
                    work_list.map(v=>{
                        let workIcon = new BMap.Icon(v.icon, new BMap.Size(24, 24), {});
                        let workMarker = new BMap.Marker(new BMap.Point(v.lng, v.lat), {icon: workIcon});
                        // workMarker.addEventListener('click', function(){
                        //     let steelContent = `<div>
                        //          <div style="margin-top: 5px">姓名：${v.name}</div>
                        //          <div style="margin-top: 5px">手机号：${v.phone}</div>
                        //     </div>`
                        //     let opts = {
                        //         width: 250,     // 信息窗口宽度
                        //         height: 100,    // 信息窗口高度
                        //         title: "巡检点信息"  // 信息窗口标题
                        //     }
                        //     let infoWindow = new BMap.InfoWindow(steelContent, opts);  // 创建信息窗口对象
                        //     map.openInfoWindow(infoWindow, new BMap.Point(v.lng, v.lat));        // 打开信息窗口
                        // })
                        // let labelopts = {
                        //     position: new BMap.Point(v.lng, v.lat),
                        //     offset: new BMap.Size(0, 15)
                        // };
                        
                        // let label = new BMap.Label(v.name, labelopts);
                        // label.setStyle({
                        //     color: "#fff",
                        //     backgroundColor: "rgba(0, 0, 0, 0.5)",
                        //     borderRadius: "10px",
                        //     padding: "0 10px",
                        //     fontSize: "10px",
                        //     lineHeight: "20px",
                        //     border :"0",
                        //     transform:'translateX(-50%)'
                        // });
                        // map.addOverlay(label);
                        map.addOverlay(workMarker);
                    })
                    
                    let work_position_list = res.work_position_list
                    work_position_list.map(v=>{
                        let positionIcon = new BMap.Icon(v.icon, new BMap.Size(24, 24), {});
                        let positionMarker = new BMap.Marker(new BMap.Point(v.lng, v.lat), {icon: positionIcon});
                        positionMarker.addEventListener('click', function(){
                            let steelContent = `<div>
                                 <div style="margin-top: 5px">姓名：${v.name}</div>
                                 <div style="margin-top: 5px">手机号：${v.phone}</div>
                            </div>`
                            let opts = {
                                width: 250,     // 信息窗口宽度
                                height: 100,    // 信息窗口高度
                                title: "网格员信息"  // 信息窗口标题
                            }
                            let infoWindow = new BMap.InfoWindow(steelContent, opts);  // 创建信息窗口对象
                            map.openInfoWindow(infoWindow, new BMap.Point(v.lng, v.lat));        // 打开信息窗口
                        })
                        map.addOverlay(positionMarker);
                    })
                    
                    let bd = new BMap.Boundary();
                    res.position.area_name = res.position.area_name != '高新区'?res.position.area_name:'蜀山区'
                    bd.get(res.position.area_name, function (rs) {
                        let count = rs.boundaries.length; //行政区域的点有多少个
                        if (count === 0) {
                            map.centerAndZoom(new BMap.Point(res.position.lng, res.position.lat), res.position.zoomLevel);
                            console.log('未能获取当前输入行政区域');
                            return ;
                        }
                        let pointArray = [];
                        for (let i = 0; i < count; i++) {
                            let ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 4,fillColor: '#107FFB', fillOpacity: '0.2', strokeColor: "#0DF7FF"}); //建立多边形覆盖物
                            map.addOverlay(ply);  //添加覆盖物
                            pointArray = pointArray.concat(ply.getPath());
                        }
                        
                        let trajectoryList = res.position_trail_list
                        trajectoryList.map(v=>{
                            if(v.trails.length>0){
                                let pLine = []
                                let color = v.color
                                v.trails.map(item=>{
                                    pLine.push(new BMap.Point(item.bd_long, item.bd_lat))
                                })
                                console.log("pLine===>", pLine)
                                let polyline = new BMap.Polyline(pLine, {
                                    strokeColor: color,
                                    strokeWeight: 3,
                                    strokeOpacity: 0.8,
                                })
                                
                                polyline.addEventListener('click', function(){
                                    let steelContent = `<div>
                                         <div style="margin-top: 5px">巡检员姓名：${v.name}</div>
                                         <div style="margin-top: 5px">巡检时间：${v.time}</div>
                                    </div>`
                                    let opts = {
                                        width: 250,     // 信息窗口宽度
                                        height: 100,    // 信息窗口高度
                                        title: "巡检轨迹信息"  // 信息窗口标题
                                    }
                                    let infoWindow = new BMap.InfoWindow(steelContent, opts);  // 创建信息窗口对象
                                    let timeout = setTimeout(()=>{
                                        map.openInfoWindow(infoWindow, new BMap.Point(self.mapDialog.longitude, self.mapDialog.latitude));        // 打开信息窗口
                                        clearTimeout(timeout)
                                    }, 100)
                                })
                                map.addOverlay(polyline);
                            }
                        })
                        map.setViewport(pointArray);
                        map.centerAndZoom(new BMap.Point(res.position.lng, res.position.lat), res.position.zoomLevel);
                    });
                })
            },
            
            getScrollList(){
                let self = this
                self.request(streetCommunityApi.getAreaStreetWorkersOrder, {swap_community_id:this.swap_community_id}).then((res) => {
                    self.newsList = res.list
                    self.scrollUrl = res.url
                })
            },
            
            navigateTo(item){
                window.open(this.scrollUrl)
            },
            
            randomColor() {
                let r, g, b
                r = Math.floor(Math.random() * 256)
                g = Math.floor(Math.random() * 256)
                b = Math.floor(Math.random() * 256)
                a = 0.8
                return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'
            }
        }
    }
</script>

<style lang="less" scoped>
    .screen_index{
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-image: linear-gradient(to right bottom, #03050F, #0D1632);
        overflow: hidden;
        .top_title{
            background-image: url(images/top_title_back.png), linear-gradient(to right bottom, #020309, #0D1632);
            background-size: 100% 100%;
            height: 90px;
            width: 100%;
            display: flex;
            align-items: flex-end;
            justify-content: flex-start;
            font-weight: bold;
            
            .title_content{
                width: calc(100vw - (100vw/3 - 100px)*2);
                height: 90px;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                .txt{
                    transform: translateY(3px);
                    color: #00FFFF;
                    font-size: 26px;
                }
            }
            
            .left_tab{
                width: calc(100vw/3 - 100px);
                height: 75px;
                cursor: pointer;
                display: flex;
                .tab_item{
                    width: 33.3%;
                    height: 75px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    .item_title{
                        color: #ffffff;
                        font-size: 17px;
                    }
                    .active{
                        color: #00FFFF;
                        font-size: 24px;
                    }
                    .item_icon{
                        width: 160px;
                        height: 10px;
                        transform: translateY(10px);
                    }
                }
                
            }
            
            .right_tab {
                width: calc(100vw/3 - 100px);
                height: 75px;
                text-align: right;
            
                .txt {
                    cursor: pointer;
                    transform: translateY(3px);
                    color: #f7f9f9;
                    font-size: 24px;
                    margin-right: 30px;
                }
            }
            
        }
        
        .view_container{
            width: 100%;
            margin-top: 3px;
            height: calc(100vh - 90px - 6px);
            display: flex;
            justify-content: space-between;
            .left_box{
                width: calc(100vw/4 - 10px);
                height: calc(100vh - 90px - 6px);
                margin-left: 5px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                .box_content{
                    width: 100%;
                    height: 32.7%;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    background-image: linear-gradient(to right bottom, #020309, #0D1632);
                    .box_title{
                        width: 100%;
                        height: 42px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .box_content_bottom{
                        width: 100%;
                        height: calc(100% - 42px);
                    }
                }
            }
            
            .middle_box{
                width: calc(100vw/2);
                margin-top: 3.5px;
                height: calc(100vh - 90px - 12px);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                .top_scroll{
                    height: 5%;
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    overflow: hidden;
                }
                .top_map{
                    height: 95%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    align-items: center;
                    position: relative;
                    .BMap{
                        width: 100%;
                        height: 100%;
                    }
                    .map_tips {
                        width: 200px;
                        height: 150px;
                        position: absolute;
                        left: 10px;
                        bottom: 10px;
                        z-index: 999999;
                        background: rgba(0, 0, 0, 0.5);
                        border-radius: 10px;
                        padding: 20px;
                        .tips_item{
                            display: flex;
                            align-items: center;
                            margin-top: 5px;
                            .left_label{
                                color: #fff;
                                font-size: 14px;
                            }
                            .right_value{
                                color: #fff;
                                font-size: 14px;
                            }
                        }
                    }
                }
            }
            
            .right_box{
                width: calc(100vw/4 - 10px);
                height: calc(100vh - 90px - 6px);
                margin-right: 5px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                .box_content{
                    width: 100%;
                    height: 32.7%;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    background-image: linear-gradient(to right bottom, #020309, #0D1632);
                    .box_title{
                        width: 100%;
                        height: 42px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .box_content_bottom{
                        width: 100%;
                        height: calc(100% - 42px);
                    }
                }
            }
        }
    }
    
    /deep/ .BMap_cpyCtrl {
        display:none;
    }
     
    /* 隐藏文字信息 */
    /deep/ .anchorBL{
        display:none;
    }
    
    .swap_region_content {
        width: 390px;
        margin-bottom: 60px;

        .itemdiv {
            margin: 30px 0px;
        }
    }
</style>
