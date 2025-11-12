<template>
    <div class="screen_index" v-if="refrashThis">
        <div class="top_title">
            <div class="left_tab">
                <div class="tab_item" v-for="(item, index) in tabList" @click="chooseTab(index)">
                    <div class="item_title" :class="currentIndex == index?'active':''">{{item.name}}</div>
                    <img :src="tabselectIcon" class="item_icon" v-if="currentIndex == index" />
                </div>
            </div>
            <div class="title_content">
                <div class="txt">{{indexData.visualize_title}}</div>
            </div>
            <div class="right_tab">
                <div class="txt" v-if="region_level>=2">
                    <a-popconfirm placement="bottomRight" ok-text=" 确 认 " cancel-text=" 取 消 " @confirm="swapCityRegion"
                        @visibleChange="handleVisibleChange">
                        <template slot="title">
                            <p class="swap_region_title">区域切换</p>
                            <div class="swap_region_content">
                                <div class="itemdiv" v-if="region_level==4">
                                    <span style="width: 80px;display: inline-block;">区县：</span>
                                    <a-select style="width: 250px" @change="handleCountyChange"
                                        v-model="county_area_id">
                                        <a-select-option :value="0">
                                            请选择区县
                                        </a-select-option>
                                        <a-select-option v-for="(item1,index1)  in county_regions"
                                            :value="item1.area_id">
                                            {{ item1.area_name }}
                                        </a-select-option>
                                    </a-select>
                                </div>
                                <div class="itemdiv" v-if="region_level>=3 && county_area_id>0">
                                    <span style="width: 80px;display: inline-block;">镇乡/街道：</span>
                                    <a-select style="width: 250px" @change="handleStreetChange" v-model="street_id">
                                        <a-select-option :value="0">
                                            请选择镇乡/街道
                                        </a-select-option>
                                        <a-select-option v-for="(item2,index2)  in street_regions"
                                            :value="item2.area_id">
                                            {{ item2.area_name }}
                                        </a-select-option>
                                    </a-select>
                                </div>
                                <div class="itemdiv" v-if="region_level>=3 && street_id>0">
                                    <span style="width: 80px;display: inline-block;">社区：</span>
                                    <a-select style="width: 250px"
                                        v-model="community_id">
                                        <a-select-option :value="0">
                                            请选择社区
                                        </a-select-option>
                                        <a-select-option v-for="(item3,index3)  in community_regions"
                                            :value="item3.area_id">
                                            {{ item3.area_name }}
                                        </a-select-option>
                                    </a-select>
                                </div>
                            </div>
                        </template>
                        <span>{{indexData.area_name}} <a-icon type="swap" /></span>
                    </a-popconfirm>
                </div>
            </div>

        </div>
        <div class="view_container" id="map_container">
            <div class="left_box">
                <div class="box_content" v-for="(item, index) in leftList[currentIndex]" :key="index">
                    <div class="box_title">
                        <data-title :chinaName="item.titleArr.chinaName" :englishName="item.titleArr.englishName"
                            :addressParams="addressParams" />
                    </div>
                    <div class="box_content_bottom">
                        <component :addressParams="addressParams" :is="item.component" />
                    </div>
                </div>
            </div>
            <div class="middle_box">
                <div class="top_scroll">
                    <marqueeLeft v-if="newsList.length>0" :sendVal="newsList" @clickEvent="navigateTo"></marqueeLeft>
                </div>
                <div class="top_map">
                    <div style="width: 100%; height: 100%;" id="mapCanvas"></div>
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
                        <data-title :chinaName="item.titleArr.chinaName" :englishName="item.titleArr.englishName"
                            :addressParams="addressParams" />
                    </div>
                    <div class="box_content_bottom">
                        <component :addressParams="addressParams" :is="item.component" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import houseCityApi from '@/api/system/community/house';
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
    export default {
        data() {
            return {
                addressParams: {},
                city_area_id: 0,
                refrashThis: true,
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
                tabList: [{
                        name: "社区党建"
                    },
                    {
                        name: "人口分析"
                    },
                    {
                        name: "事件分析"
                    }
                ],
                leftList: [
                    [{
                            id: 1,
                            titleArr: {
                                chinaName: '党组织架构统计',
                                englishName: 'Architecture statistics'
                            },
                            component: 'partyOrganization'
                        },
                        {
                            id: 2,
                            titleArr: {
                                chinaName: '党员数量统计',
                                englishName: 'Quantity statistics'
                            },
                            component: 'partyMembers'
                        },
                        {
                            id: 3,
                            titleArr: {
                                chinaName: '党建活动',
                                englishName: 'Party building activities'
                            },
                            component: 'partyActivities'
                        },
                    ],

                    [{
                            id: 4,
                            titleArr: {
                                chinaName: '人口信息',
                                englishName: 'Demographic information'
                            },
                            component: 'populationMsg'
                        },
                        {
                            id: 5,
                            titleArr: {
                                chinaName: '男女比例统计',
                                englishName: 'Proportional statistics'
                            },
                            component: 'genderStatistics'
                        },
                        {
                            id: 6,
                            titleArr: {
                                chinaName: '年龄段统计',
                                englishName: 'Age group statistics'
                            },
                            component: 'ageStatistics'
                        },
                    ],

                    [{
                            id: 7,
                            titleArr: {
                                chinaName: '事件上报',
                                englishName: 'Event reporting'
                            },
                            component: 'eventReporting'
                        },
                        //{id: 8, titleArr: {chinaName: '疫情防控数据统计', englishName: 'Prdata statistics'}, component: 'preventionControl'},
                        {
                            id: 8,
                            titleArr: {
                                chinaName: '民族统计',
                                englishName: 'Nationality statistics'
                            },
                            component: 'nationStatistics'
                        },
                        {
                            id: 9,
                            titleArr: {
                                chinaName: '社区关怀',
                                englishName: 'Community care'
                            },
                            component: 'communityCare'
                        },
                    ]
                ],

                rightList: [
                    [{
                            id: 1,
                            titleArr: {
                                chinaName: '三会一课',
                                englishName: 'Three sessions and one lesson'
                            },
                            component: 'sessionsLesson'
                        },
                        {
                            id: 2,
                            titleArr: {
                                chinaName: '党内咨询',
                                englishName: 'Inner party consultation'
                            },
                            component: 'partyConsultation'
                        },
                        {
                            id: 3,
                            titleArr: {
                                chinaName: '热点新闻',
                                englishName: 'hot news'
                            },
                            component: 'hotNews'
                        },
                    ],

                    [{
                            id: 4,
                            titleArr: {
                                chinaName: '居民人口性质统计',
                                englishName: 'Demographic nature'
                            },
                            component: 'residentsNature'
                        },
                        {
                            id: 5,
                            titleArr: {
                                chinaName: '教育水平统计',
                                englishName: 'Educational level'
                            },
                            component: 'educationalLevel'
                        },
                        {
                            id: 6,
                            titleArr: {
                                chinaName: '婚姻状况统计',
                                englishName: 'Marital status'
                            },
                            component: 'maritalStatus'
                        },
                    ],

                    [{
                            id: 7,
                            titleArr: {
                                chinaName: '社区物业统计',
                                englishName: 'Community property'
                            },
                            component: 'communityProperty'
                        },
                        {
                            id: 8,
                            titleArr: {
                                chinaName: '视频监控一',
                                englishName: 'Video surveillance'
                            },
                            component: 'surveillanceOne'
                        },
                        {
                            id: 9,
                            titleArr: {
                                chinaName: '视频监控二',
                                englishName: 'Video surveillance'
                            },
                            component: 'surveillanceTwo'
                        },
                    ]
                ],
                newsList: [],
                scrollUrl: '',
                mapDialog: {
                    longitude: 0,
                    latitude: 0
                },
                region_level: 0,
                county_regions: [],
                street_regions: [],
                community_regions: [],
                county_area_id: 0,
                street_id: 0,
                community_id: 0,
                city_area_name: '',
                mapObj: {}, //地图实例
            }
        },

        components: {
            preventionControl,
            nationStatistics,
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

        mounted() {
            let that = this
            if (that.$route.query.city_area_id) {
                that.city_area_id = that.$route.query.city_area_id;
            } else {
                that.city_area_id = 0;
            }
            that.addressParams.city_area_id = that.city_area_id
            that.requestData()
        },

        methods: {
            requestData(){
                let that = this
                that.getScrollList(true)
                that.refrashThis = false
                that.$nextTick(() => {
                    that.refrashThis = true
                });
            },
            
            chooseTab(index) {
                let that = this
                if (that.currentIndex != index) {
                    that.currentIndex = index
                    that.getScrollList(false)
                } else {
                    console.log("重复")
                }
            },
            swapCityRegion() {
                let that = this
                that.addressParams.city_area_id = that.city_area_id
                that.addressParams.county_area_id = that.county_area_id
                that.addressParams.street_id = that.street_id
                that.addressParams.community_id = that.community_id
                that.requestData()
            },
            handleVisibleChange(visible) {
                console.log('visible', visible);
                console.log('county_area_id', this.county_area_id);
                console.log('addressParams', this.addressParams)
            },
            handleCountyChange(ev) {
                let that = this
                let postArr = {};
                that.community_id = 0;
                that.street_id = 0;
                if(ev){
                    let obj = that.county_regions.find(item=>ev == item.area_id)
                    if(obj.adcode){
                        that.addressParams.adcode = obj.adcode
                    }
                } else {
                    that.addressParams.adcode = null
                }
                postArr.county_area_id = that.county_area_id;
                postArr.region_type = 'street';
                that.request(houseCityApi.getNextCityRegions, postArr).then((res) => {
                    if (res.next_city_region) {
                        that.street_regions = res.next_city_region;
                    } else {
                        that.street_regions = [];
                    }

                }).catch((error) => {
                    that.street_regions = [];
                });
            },
            handleStreetChange(ev) {
                let that = this
                let postArr = {};
                that.community_id = 0;
                postArr.street_id = that.street_id;
                postArr.region_type = 'community';
                that.request(houseCityApi.getNextCityRegions, postArr).then((res) => {
                    if (res.next_city_region) {
                        that.community_regions = res.next_city_region;
                    } else {
                        that.community_regions = [];
                    }
                }).catch((error) => {
                    that.community_regions = [];
                });
            },
            mapReady() {
                let self = this
                self.mapObj = new BMapGL.Map('mapCanvas');
                self.mapObj.addEventListener('click', function(e) {
                    self.mapDialog.longitude = e.point.lng; //经度
                    self.mapDialog.latitude = e.point.lat; //维度,
                })
                self.mapObj.enableScrollWheelZoom(true);
                self.addressParams.city_area_name = self.city_area_name;
                self.addressParams.city_area_id = self.city_area_id;
                self.request(houseCityApi.getIndex, self.addressParams).then((res) => {
                    self.indexData = res
                    if (res.region_level && res.region_level >= 2) {
                        self.region_level = res.region_level;
                        if (res.region_level == 4) {
                            self.county_regions = res.next_city_region;
                        } else if (res.region_level == 3) {
                            self.street_regions = res.next_city_region;
                        } else if (res.region_level == 2) {
                            self.community_regions = res.next_city_region;
                        }
                        self.county_area_id = res.county_area_id;
                        self.street_id = res.street_id;
                        self.community_id = res.community_id;
                        if (res.city_area_name && res.city_area_name) {
                            self.city_area_name = res.city_area_name;
                        } else {
                            self.city_area_name = '';
                        }
                    }
                    
                    self.tabList = [{
                        name: res.visualize_nav1
                    }, {
                        name: res.visualize_nav2
                    }, {
                        name: res.visualize_nav3
                    }]
                    self.leftList[2][1].titleArr.chinaName = res.visualize_nav4
                    
                    // 图层
                    let fillLayer = new BMapGL.FillLayer({
                        crs: 'GCJ02', // 数据源坐标类型
                        enablePicked: true,
                        autoSelect: true,
                        pickWidth: 30,
                        pickHeight: 30,
                        selectedColor: '#78BAF5', // 悬浮选中项颜色
                        border: true,
                        opacity: .9,
                        style: { // 样式配置
                            fillColor: "#BDDDFA",
                            fillOpacity: .9,
                            strokeWeight: 3,
                            strokeColor: '#9CCCF8',
                        }
                    });
                    fillLayer.addEventListener('click', function(e) {
                        if(!res.area_feature_collection || res.area_feature_collection.features.length == 1) return
                        if (e.value.dataIndex !== -1 && e.value.dataItem) {
                            console.log('click', e.value.dataItem);
                            self.addressParams['adcode'] = e.value.dataItem.properties.adcode
                            self.requestData()
                        }
                    })
                    self.mapObj.addNormalLayer(fillLayer)
                    if(res.area_feature_collection){
                        fillLayer.setData(res.area_feature_collection);
                        res.area_feature_collection.features.map(item => {
                            let cityLabel = new BMapGL.Label(item.properties.name, {
                                position: new BMapGL.Point(item.properties.centroid[0], item
                                    .properties.centroid[1]),
                                offset: new BMapGL.Size(0, 0)
                            })
                            cityLabel.setStyle({
                                color: '#ff595c',
                                fontWeight: 'bold',
                                fontSize: '15px',
                                backgroundColor: 'transparent',
                                border: 'none'
                            })
                            self.mapObj.addOverlay(cityLabel);
                        })
                    }
                    
                    // 党支部
                    let partybranch_list = res.partybranch_list
                    let work_list = res.work_list
                    partybranch_list.map(v => {
                        let partybranchIcon = new BMapGL.Icon(v.icon, new BMapGL.Size(24, 24), {});
                        let partybranchMarker = new BMapGL.Marker(new BMapGL.Point(v.lng, v.lat), {
                            icon: partybranchIcon
                        });
                        partybranchMarker.addEventListener('click', function() {
                            let steelContent = `<div>
                                 <div style="margin-top: 5px">党支部名称：${v.name}</div>
                                 <div style="margin-top: 5px">党支部类型：${v.type}</div>
                                 <div style="margin-top: 5px">地址：${v.adress}</div>
                            </div>`
                            let opts = {
                                width: 250, // 信息窗口宽度
                                height: 150, // 信息窗口高度
                                title: "党支部信息" // 信息窗口标题
                            }
                            let infoWindow = new BMapGL.InfoWindow(steelContent,
                                opts); // 创建信息窗口对象
                            self.mapObj.openInfoWindow(infoWindow, new BMapGL.Point(v.lng, v
                                .lat)); // 打开信息窗口
                        })

                        self.mapObj.addOverlay(partybranchMarker);
                    })
                    
                    // 工作人员
                    work_list.map(v => {
                        let workIcon = new BMapGL.Icon(v.icon, new BMapGL.Size(24, 24), {});
                        let workMarker = new BMapGL.Marker(new BMapGL.Point(v.lng, v.lat), {
                            icon: workIcon
                        });

                        self.mapObj.addOverlay(workMarker);
                    })
                    
                    // 工作人员列表
                    let work_position_list = res.work_position_list
                    work_position_list.map(v => {
                        let positionIcon = new BMapGL.Icon(v.icon, new BMapGL.Size(24, 24), {});
                        let positionMarker = new BMapGL.Marker(new BMapGL.Point(v.lng, v.lat), {
                            icon: positionIcon
                        });
                        positionMarker.addEventListener('click', function() {
                            let steelContent = `<div>
                                 <div style="margin-top: 5px">姓名：${v.name}</div>
                                 <div style="margin-top: 5px">手机号：${v.phone}</div>
                            </div>`
                            let opts = {
                                width: 250, // 信息窗口宽度
                                height: 100, // 信息窗口高度
                                title: "网格员信息" // 信息窗口标题
                            }
                            let infoWindow = new BMapGL.InfoWindow(steelContent,
                                opts); // 创建信息窗口对象
                            self.mapObj.openInfoWindow(infoWindow, new BMapGL.Point(v.lng, v
                                .lat)); // 打开信息窗口
                        })
                        self.mapObj.addOverlay(positionMarker);
                    })

                    // 轨迹路线
                    let trajectoryList = res.position_trail_list
                    trajectoryList.map(v => {
                        if (v.trails.length > 0) {
                            let pLine = []
                            let color = v.color
                            v.trails.map(item => {
                                pLine.push(new BMapGL.Point(item.bd_long, item
                                    .bd_lat))
                            })
                            let polyline = new BMapGL.Polyline(pLine, {
                                strokeColor: color,
                                strokeWeight: 3,
                                strokeOpacity: 0.8,
                            })

                            polyline.addEventListener('click', function() {
                                let steelContent = `<div>
                                     <div style="margin-top: 5px">巡检员姓名：${v.name}</div>
                                     <div style="margin-top: 5px">巡检时间：${v.time}</div>
                                </div>`
                                let opts = {
                                    width: 250, // 信息窗口宽度
                                    height: 100, // 信息窗口高度
                                    title: "巡检轨迹信息" // 信息窗口标题
                                }
                                let infoWindow = new BMapGL.InfoWindow(steelContent,
                                    opts); // 创建信息窗口对象
                                let timeout = setTimeout(() => {
                                    self.mapObj.openInfoWindow(infoWindow, new BMapGL
                                        .Point(self.mapDialog.longitude, self.mapDialog.latitude)); // 打开信息窗口
                                    clearTimeout(timeout)
                                }, 100)
                            })
                            self.mapObj.addOverlay(polyline);
                        }
                    })

                    self.mapObj.centerAndZoom(new BMapGL.Point(res.position.lng, res.position.lat), res
                        .position.zoomLevel);
                })
            },

            getScrollList(flag) {
                let self = this
                self.request(houseCityApi.getAreaStreetWorkersOrder, self.addressParams).then((res) => {
                    self.newsList = res.list
                    self.scrollUrl = res.url
                    if (flag) {
                        self.mapReady()
                    }
                })
            },

            navigateTo(item) {
                if (this.scrollUrl) {
                    window.open(this.scrollUrl)
                }
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
    .screen_index {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-image: linear-gradient(to right bottom, #03050F, #0D1632);
        overflow: hidden;

        .top_title {
            background-image: url(images/top_title_back.png), linear-gradient(to right bottom, #020309, #0D1632);
            background-size: 100% 100%;
            height: 90px;
            width: 100%;
            display: flex;
            align-items: flex-end;
            justify-content: flex-start;
            font-weight: bold;

            .title_content {
                width: calc(100vw - (100vw/3 - 100px)*2);
                height: 90px;
                display: flex;
                align-items: flex-start;
                justify-content: center;

                .txt {
                    transform: translateY(3px);
                    color: #00FFFF;
                    font-size: 26px;
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

            .left_tab {
                width: calc(100vw/3 - 100px);
                height: 75px;
                cursor: pointer;
                display: flex;

                .tab_item {
                    width: 33.3%;
                    height: 75px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;

                    .item_title {
                        color: #ffffff;
                        font-size: 17px;
                    }

                    .active {
                        color: #00FFFF;
                        font-size: 24px;
                    }

                    .item_icon {
                        width: 160px;
                        height: 10px;
                        transform: translateY(10px);
                    }
                }

            }
        }

        .view_container {
            width: 100%;
            margin-top: 3px;
            height: calc(100vh - 90px - 6px);
            display: flex;
            justify-content: space-between;

            .left_box {
                width: calc(100vw/4 - 10px);
                height: calc(100vh - 90px - 6px);
                margin-left: 5px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;

                .box_content {
                    width: 100%;
                    height: 32.7%;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    background-image: linear-gradient(to right bottom, #020309, #0D1632);

                    .box_title {
                        width: 100%;
                        height: 42px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .box_content_bottom {
                        width: 100%;
                        height: calc(100% - 42px);
                    }
                }
            }

            .middle_box {
                width: calc(100vw/2);
                margin-top: 3.5px;
                height: calc(100vh - 90px - 12px);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;

                .top_scroll {
                    height: 5%;
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    overflow: hidden;
                }

                .top_map {
                    height: 95%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    align-items: center;
                    position: relative;

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

            .right_box {
                width: calc(100vw/4 - 10px);
                height: calc(100vh - 90px - 6px);
                margin-right: 5px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;

                .box_content {
                    width: 100%;
                    height: 32.7%;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    background-image: linear-gradient(to right bottom, #020309, #0D1632);

                    .box_title {
                        width: 100%;
                        height: 42px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .box_content_bottom {
                        width: 100%;
                        height: calc(100% - 42px);
                    }
                }
            }
        }
    }

    /deep/ .BMap_cpyCtrl {
        display: none;
    }

    /* 隐藏文字信息 */
    /deep/ .anchorBL {
        display: none;
    }

    .swap_region_content {
        width: 390px;
        margin-bottom: 60px;

        .itemdiv {
            margin: 30px 0px;
        }
    }

    /deep/ .ant-popover-buttons {
        text-align: center !important;
    }
</style>