<template>
    <div class="screen_index">
        <div class="top_title">
            <div class="left_tab">
                <div class="tab_item" v-for="(item, index) in tabList" @click="chooseTab(index)">
                    <div class="item_title" :class="currentIndex == index?'active':''">{{item.name}}</div>
                    <img :src="tabselectIcon" class="item_icon" v-if="currentIndex == index"/>
                </div>
            </div>
            <div class="title_content">
                <div class="txt">江西省遂川县智慧社区管理平台</div>
            </div>
        </div>
        <div class="view_container" id="map_container">
            <div class="left_box">
                <div class="box_content" v-for="(item, index) in leftList[currentIndex]" :key="index">
                    <div class="box_title">
                        <data-title :chinaName="item.titleArr.chinaName" :englishName="item.titleArr.englishName" />
                    </div>
                    <div class="box_content">
                        <component :is="item.component"/>
                    </div>
                </div>
            </div>
            <div class="middle_box">
                <div class="top_scroll">
                    <marqueeLeft :sendVal="newsList" @clickEvent="navigateTo"></marqueeLeft>
                </div>
                <div class="top_map">
                    <baidu-map :center="center" :zoom="zoom" @ready="mapReady" @click="selectcity" :scroll-wheel-zoom="true"
                        class="BMap"> 
                    </baidu-map>
                </div>
            </div>
            <div class="right_box">
                <div class="box_content" v-for="(item, index) in rightList[currentIndex]" :key="index">
                    <div class="box_title">
                        <data-title :chinaName="item.titleArr.chinaName" :englishName="item.titleArr.englishName" />
                    </div>
                    <div class="box_content">
                        <component :is="item.component"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mapStyle from "./utils/mapStyle.js"
    import preventionControl from "./components/preventionControl.vue";
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
                     {id: 8, titleArr: {chinaName: '疫情防控数据统计', englishName: 'Prdata statistics'}, component: 'preventionControl'},
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
                newsList: []
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
            marqueeLeft
        },
        
        mounted(){
            
        },
        
        methods:{
            chooseTab(index){
                if(this.currentIndex!=index){
                    this.currentIndex = index
                } else {
                    console.log("重复")
                }
            },
            mapReady({ BMap, map }) {
                this.point = new BMap.Point(118.287117, 33.961525);
                map.centerAndZoom(this.point, 15);
                map.setMapStyle(mapStyle);
            },
            
            draw({
              el,
              BMap,
              map
            }) {
              const pixel = map.pointToOverlayPixel(new BMap.Point(this.longitude, this.latitude))
              el.style.left = pixel.x - 190 + 'px'
              el.style.top = pixel.y - 120 + 'px'
              this.centerPopup.lng = this.longitude; //自定义覆盖中心点
              this.centerPopup.lat = this.longitude; //自定义覆盖中心点
            },
            // 地图单击选择城市
            selectcity(e) {
                console.log(e)
                let _this = this;
                    // _this.showmap = true
                _this.longitude = e.point.lng; //经度
                _this.latitude = e.point.lat; //维度
                _this.center.lng = _this.longitude; //中心点
                _this.center.lat = _this.latitude; //中心点
                _this.centerPopup.lng = _this.longitude; //自定义覆盖中心点
                _this.centerPopup.lat = _this.latitude; //自定义覆盖中心点
                let geocoder = new BMap.Geocoder(); //创建地址解析器的实例
                geocoder.getLocation(e.point, function(rs) {
                    console.log(rs)
                    _this.propprovince = rs.addressComponents.province //省
                    _this.propcity = rs.addressComponents.city //市
                    _this.propcounty = rs.addressComponents.district //县
                    _this.propaddress = rs.addressComponents.address //详细地址
                    _this.getMapInfo(_this.propcity)
                });
            
            },
            // 地图自定义点的单击事件
            infoWindowOpens() {
            
            },
            
            navigateTo(item){
                console.log("item===>", item)
            },
            
            //地图数据
            getMapInfo(propcity) {
                console.log("propcity===>", propcity)
              // let propcity_name = ''
              // if(propcity){
              //   propcity_name = propcity.replace("市","");
              // }
              // this.request(configHouseMeterApi.getTongjiCountByCity,{city:propcity_name}).then(res => {
              //   console.log('+++++++', res)
              //   if (res) {
              //     this.mapinfo = res.info;
              //     if(this.firstload){
              //       this.center.lng = res.position.lng; //中心点
              //       this.center.lat = res.position.lat; //中心点
              //       this.propcity = res.position.name //市
              //       this.longitude = res.position.lng; //经度
              //       this.latitude = res.position.lat; //维度
              //       this.center.lng = res.position.lng; //中心点
              //       this.center.lat = res.position.lat; //中心点
              //       this.centerPopup.lng = res.position.lng; //自定义覆盖中心点
              //       this.centerPopup.lat = res.position.lat; //自定义覆盖中心点
              //       this.firstload = false
              //     }
              //     console.log("this.mapinfo", this.mapinfo)
              //   }
              // });
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
                    
                    .box_content{
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
                    .BMap{
                        width: 100%;
                        height: 100%;
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
                    
                    .box_content{
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
</style>
