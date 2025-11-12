<template>
    <div class="container">
        <!-- canvas图复原 -->
        <div class="imgBox" ref="canvas_con" v-show="current == 0 && isCurrentShow && imgUrl !=''" @click="rightClick">
            <img class="canvas_img" :src="imgUrl" >
            <canvas id="myCanvas" :width="canvasProp.width" :height="canvasProp.height"></canvas>
        </div>
        <div class="fixed_box_1" @click.stop="isPopup" v-if="current == 0 && isCurrentShow && text_show"
            :style="'top:'+ popupPosition.top + 'px; left:'+ popupPosition.left+'px'">
            <p class="single_name">
                {{single_name}}
            </p>
        </div>
        <div class="head_box" :class="current==4 || current==3 || current==2?'head_bg_3':''">
            <div class="logo_box">
                <img class="logo_img" :src="village_info.village_icon" alt="">
            </div>
            <div class="menu_box">
                <div class="item_box_flex" v-for="(item,index) in indexTabList" @click="clickMenu(index)"
                    :class="index==current?'item_box_active':'item_box_flex'">
                    <img class="menu_icon" :src="item.icon">
                    <div class="title_1">{{item.name}}</div>
                </div>
            </div>
            <div class="admin_box">
                <div class="admin_flex">
                    <div class="admin_name">{{village_info.login_name}}</div>
                    <div class="flex_icon">
                        <img class="cockpit_admin" src="../../../../assets/communityimg/cockpit_admin.png">
                        <div class="line"></div>
                        <img @click="loginout" class="cockpit_loginout"
                            src="../../../../assets/communityimg/cockpit_loginout.png">
                    </div>
                </div>
                <div class="time_text" v-if="timer">{{timer | formatTimer}}</div>
            </div>
        </div>
        <!-- 首页 -->
        <div class="current_1" v-if="current == 0 && isCurrentShow">
            <!-- 滚动公告 -->
            <div class="laba_box">
                <img class="laba" src="../../../../assets/communityimg/cockpit_laba.png" alt=""
                    v-if="text_array.length!=0">
                <div class="marquee-inner-wrapper">
                    <div class="first-marquee">
                        <span>
                            <li @click="navigateToD(item)" v-for="(item, index) in text_array">{{item.title}}</li>
                        </span>
                    </div>
                    <div class="second-marquee">
                        <span>
                            <li @click="navigateToD(item)" v-for="(item, index) in text_array">{{item.title}}</li>
                        </span>
                    </div>
                </div>
            </div>
            <!-- 滚动公告END -->
            <!-- 切换 -->
            <img class="switch_btn" @click="switchBox" src="../../../../assets/communityimg/cockpit_switch.png">
            <!-- 切换END -->
            <!-- 背景图上传 -->
            <div class="up_bnt" v-if="current == 0 && isCurrentShow && imgUrl == ''">
                <p class="up_text" v-if="$store.getters.config">您还未上传{{$store.getters.config.house_name}}楼盘底图</p>
                <div class="up_btn_text" @click="navigateToUpload()">立即添加</div>
            </div>
            <!-- 背景图上传END -->
            <div class="left_box">
                <BlockBox class="BlockBox_c_1 marTop" height="32.6" :title_icon="weather.img" title="环境信息">
                    <div class="flex_box_1">
                        <div class="info_box">
                            <div class="item_box" v-for="(item,index) in weather.weather">
                                <div class="icon_box">
                                    <img class="icon_1" :src="item.img" alt="">
                                </div>
                                <div class="text_1">{{item.value}} {{item.company}}
                                    <p class="text_2"></p>
                                </div>
                            </div>
                        </div>
                        <div class="info_box2">
                            <div class="left_flex_box">
                                <div class="flex_box_2" v-for="(item,index) in weather.pm">
                                    <img class="weather_icon" :src="item.img" alt="">
                                    <div class="flex_mini_box">
                                        <div class="flex_1">
                                            <div class="text_2">{{item.name}}</div>
                                            <div class="weather_text">
                                                <p class="text_3">{{item.value}}</p>
                                                <p class="text_4">up/m³</p>
                                            </div>
                                        </div>
                                        <div class="flex_2">
                                            <div class="bar" v-if="item.value>100" style="width: 100%;"></div>
                                            <div class="bar" v-if="item.value<100" :style="{width: item.rate}"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="main" class="my_echarts_1"></div>
                        </div>
                    </div>
                    <!-- <NoData></NoData> -->
                </BlockBox>
                <BlockBox class="BlockBox_c_2 marTop" height="31.1" :title_icon="device_img" title="设施管理">
                    <div class="info_text">
                        总设施数量 <p class="text_1">{{shebei_device_total}}</p> 个
                    </div>
                    <div class="info_box">
                        <div class="item_box" v-for="(item,index) in device_list_type">
                            <!-- <img class="icon_1" src="" alt=""> -->
                            <div class="icon_1" :style="{backgroundColor: item.color}"></div>
                            <p class="text_2">{{item.title}}</p>
                        </div>
                    </div>
                    <div class="info_box_2">
                        <div class="item_box" v-for="(item,index) in device_list_list">
                            <img class="left_flex_box" :src="item.img">
                            <div class="flex_1">
                                <p class="text_2">{{item.title}}</p>
                                <div class="flex_mini_box">
                                    <!-- <p class="text_3" v-for="(item,index) in 3">10</p> -->
                                    <p class="text_3" :style="{color: item.total_arr.color}">{{item.total_arr.num}}</p>
                                    <p class="text_3" :style="{color: item.alarm_arr.color}">{{item.alarm_arr.num}}</p>
                                    <p class="text_3" :style="{color: item.offline_arr.color}">{{item.offline_arr.num}}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <NoData v-if="device_list_list.length == 0"></NoData>

                </BlockBox>
                <BlockBox class="BlockBox_c_3 marTop" height="31.1" :title_icon="alarm_img" title="报警信息">
                    <div class="top_box_4">
                        <div class="mini_box_1" v-if="home_alarm_list && home_alarm_list[0]">
                            <div class="table-right">
                                <div class="table-scroll_right">
                                    <div class="table-flex_body_right" v-for="(item,index) in home_alarm_list">
                                        <div class="text_1" v-for="(items,indexs) in item" style="width: 90px;"
                                            v-show="indexs==0">{{items.title}}</div>
                                        <div class="text_1" v-for="(items,indexs) in item" style="width: 80px;"
                                            v-show="indexs==1">{{items.title}}</div>
                                        <div class="text_1" v-for="(items,indexs) in item" style="width: 80px;"
                                            v-show="indexs==2">{{items.title}}</div>
                                        <div class="text_1" v-for="(items,indexs) in item" style="width: 140px;"
                                            v-show="indexs==3">{{items.title}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tip_text_box" v-else>
                            <div class="tip_text">暂无记录</div>
                        </div>
                    </div>
                </BlockBox>
            </div>
            <div class="right_box">
                <div class="change_box" :style="!isChange?'display:block':'display:none'">
                    <BlockBox class="BlockBox_c_4 marTop" height="56.6" :title_icon="populationStatistic.img"
                        title="人口信息">
                        <div class="info_box_4">
                            <div class="left_info_box">
                                <div class="item_box_4" style="margin-top: 0;"
                                    v-for="(item,index) in populationStatistic.population">
                                    <img class="img_1" :src="item.img">
                                    <div class="flex_4">
                                        <p class="text_5">{{item.title}}</p>
                                        <div class="flex_bottom_box">
                                            <p class="text_6">{{item.value}}</p>
                                            <p class="text_7">人</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="main_a" class="my_echarts_2"></div>
                        </div>
                        <div class="echarts_text">人口年龄分布</div>
                    </BlockBox>
                    <BlockBox class="BlockBox_c_5 marTop" height="41.1" :title_icon="vehicle_img" title="车辆信息">
                        <div class="top_box_5">
                            <div class="item_box_5" v-for="(item,index) in vehicle_list_type">
                                <div class="square" :style="{backgroundColor: item.color}"></div>
                                <p class="text_8">{{item.title}}</p>
                            </div>
                        </div>
                        <div class="bootom_box_5">
                            <div class="item_box_6" v-for="(item,index) in vehicle_list_list">
                                <img class="img_2" :src="item.img" alt="">
                                <div class="right_box_5">
                                    <p class="text_9">{{item.title}}</p>
                                    <div class="flex_text_box_2">
                                        <p class="text_10">{{item.enter}}</p>
                                        <p class="text_11"></p>
                                        <p class="text_12">{{item.out}}</p>
                                        <p class="text_13">{{item.unit}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BlockBox>
                </div>
                <div class="" :style="isChange?'display:block':'display:none'">
                    <BlockBox class="BlockBox_c_6 marTop" :title_icon="villgeRepairInfo.repair_img" height="31.1"
                        title="缴费信息">
                        <div class="info_box_6">
                            <div class="left_box_6">
                                <div class="item_box_7" style="margin-top:20px;"
                                    v-for="(item,index) in villge_pay_list">
                                    <div class="img_box">
                                        <img class="img_2" :src="item.img" alt="">
                                    </div>
                                    <div class="right_text_box_1">
                                        <p class="text_14">{{item.name}}</p>
                                        <div class="flex_text_box_3">
                                            <p class="text_15">{{item.value}}</p>
                                            <p class="text_16">{{item.unit}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="main_c" class="my_echarts_4"></div>
                        </div>
                        <div class="echarts_text_1">收入占比</div>
                    </BlockBox>
                    <BlockBox class="BlockBox_c_6 marTop" height="31.6" :title_icon="villgePayOrderInfo.pay_img"
                        title="工单信息">
                        <div class="info_box_6" style="margin-bottom: 6%;">
                            <div class="left_box_6">
                                <div class="item_box_7" v-for="(item,index) in villge_repair_list">
                                    <div class="img_box">
                                        <img class="img_2" :src="item.img" alt="">
                                    </div>
                                    <div class="right_text_box_1">
                                        <p class="text_14">{{item.name}}</p>
                                        <div class="flex_text_box_3">
                                            <p class="text_15">{{item.value}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="main_d" class="my_echarts_4"></div>
                        </div>
                        <div class="echarts_text_1">{{new Date().getFullYear()}}年问题类型占比</div>
                    </BlockBox>
                </div>

                <BlockBox class="BlockBox_c_6 marTop" :style="!isChange?'display:block':'display:none'"
                    :title_icon="house_img" height="31.1" title="房屋信息">
                    <div class="info_box_6">
                        <div class="left_box_6">
                            <div class="item_box_7" v-for="(item,index) in vacancy_count_list">
                                <div class="img_box">
                                    <img class="img_2" :src="item.img" alt="">
                                </div>
                                <div class="right_text_box_1">
                                    <p class="text_14">{{item.name}}</p>
                                    <div class="flex_text_box_3">
                                        <p class="text_15">{{item.value}}</p>
                                        <p class="text_16">{{item.unit}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="main_b" class="my_echarts_3"></div>
                    </div>
                    <div class="echarts_text_1">自住/租赁占比</div>
                </BlockBox>
            </div>
        </div>
        <NewsList v-if="current == 3 && isCurrentShow" :news_id="news_id"></NewsList>
        <SocialService v-if="current == 4 && isCurrentShow"></SocialService>
        <HouseInfo v-if="!isCurrentShow" :single_id="single_id" @goBackIndex="goBackIndex"></HouseInfo>
        <PopupBox ref="PopupBox" :title="houseInfo.single_title" :isShowBottom="false">
            <div class="popup_content">
                <div class="popup_flex_box">
                    <div class="popup_flex_1" v-for="(item,index) in houseInfo.list">
                        <p class="title">{{item.key}}：</p>
                        <p class="text_1">{{item.value}}</p>
                    </div>
                </div>
                <div @click="openHouseInfo" class="goinfo">详细信息</div>
            </div>
        </PopupBox>
        <IntelligentEqu v-if="current == 1 && isCurrentShow"></IntelligentEqu>
        <AngelEye v-if="current == 2 && isCurrentShow"></AngelEye>
        <!-- 头部背景图 -->
        <img class="img_bg_1" src="../../../../assets/communityimg/cockpit_header.png">
    </div>
</template>

<script>
    import echarts from 'echarts' //引入echarts
    import 'echarts-liquidfill/src/liquidFill.js';
    import CommunityDataApi from '@/api/community/communitydata'
    import configVillageApi from '@/api/community/village/index'
    import streetVillageApi from '@/api/community/streetCommunity/index'
    import BlockBox from '../../components/cockpit/BlockBox.vue'
    import NoData from '../../components/cockpit/NoData.vue'
    import NewsList from '../../components/cockpit/NewsList.vue'
    import SocialService from '../../components/cockpit/SocialService.vue'
    import HouseInfo from '../../components/cockpit/HouseInfo.vue'
    import PopupBox from '../../components/cockpit/PopupBox.vue'
    import IntelligentEqu from '../../components/cockpit/IntelligentEqu.vue' //智能设施
    import AngelEye from '../../components/cockpit/AngelEye.vue' //智能设施
    import Rem from '../../../../utils/rem.js';
    import Vue from 'vue';
	import store from '@/store';
    Rem.getrem();
    export default {
        props: {},
        components: {
            BlockBox,
            NoData,
            NewsList,
            HouseInfo,
            PopupBox,
            IntelligentEqu,
            SocialService,
            AngelEye
        },
        filters: {
            formatTimer: function(value) {
                let date = new Date(value);
                let y = date.getFullYear();
                let MM = date.getMonth() + 1;
                MM = MM < 10 ? "0" + MM : MM;
                let d = date.getDate();
                d = d < 10 ? "0" + d : d;
                let h = date.getHours();
                h = h < 10 ? "0" + h : h;
                let m = date.getMinutes();
                m = m < 10 ? "0" + m : m;
                let s = date.getSeconds();
                s = s < 10 ? "0" + s : s;
                return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
            }
        },
        data() {
            return {
                news_id: 0,
                isChange: false,
                house_img: '',
                alarm_img: '',
                device_img: '',
                vehicle_img: '',
                village_info: {},
                indexTabList: [{
                    name: "首页",
                    icon: require('../images/cockpit_shouye.png')
                }, {
                    name: "智能设施",
                    icon: require('../images/cockpit_zhineng.png')
                }, {
                    name: "天使之眼",
                    icon: require('../images/cockpit_tianshi.png')
                }, {
                    name: "新闻公告",
                    icon: require('../images/cockpit_xinwen.png')
                }, {
                    name: "社区服务",
                    icon: require('../images/cockpit_shequ.png')
                }],
                houseInfo: [],
                weather: {},
                populationStatistic: {},
                shebei_device_total: 0,
                device_list_type: [],
                device_list_list: [],
                vehicle_list_type: [],
                vehicle_list_list: [],
                homeStatisticData: {
                    alarm_list: [],
                    vacancy_count: {},
                    vehicle_list: {}
                },
                vacancy_count_list: [],
                home_alarm_list: [],
                villgePayOrderInfo: {},
                villge_pay_list: [],
                villgeRepairInfo: {},
                villge_repair_list: [],
                current: 0,
                text_arr: '',
                text_array: [],
                isCurrentShow: true,
                offsetList: [],
                pointNum: 0,
                ctxPic: '',
                imgUrl: 'https://hf.pigcms.com/static/wxapp/images/builds_back_img.jpg',
                pointData: [],
                detailData: [],
                imgsrc: '',
                ctx: null,
                single_name: '',
                single_id: '',
                toplength: 0,
                leftlength: 0,
                text_show: false,
                timer1: '',
                timer: '',
                width: 1920,
                height: 937,
                singleArr: [],
                pageParams: {},
                canvasProp: {
                    width: 0,
                    height: 0
                },
                coverImg: 'https://hf.pigcms.com/static/wxapp/images/builds_back_img.jpg',
                popupPosition: {
                    left: 0,
                    top: 0
                }
            };
        },
        created() {
            // this.width = document.documentElement.clientWidth || document.body.clientWidth;
            // this.height = document.documentElement.clientHeight || document.body.clientHeight;
            this.getNotice()
            this.getHomeStatistic()
            this.getWeather()
            this.getPopulationStatistic()
            this.getTime()
        },
        mounted() {
            let that = this
            that.$nextTick(() => {
                if(that.$refs.canvas_con){
                    let domWidth = that.$refs.canvas_con.clientWidth // 宽
                    let domHeight = that.$refs.canvas_con.clientHeight // 高
                    that.canvasProp.width = domWidth
                    that.canvasProp.height = domHeight
                    if(JSON.parse(sessionStorage.getItem('canvasProp')) && !JSON.parse(sessionStorage.getItem('canvasProp')).width){
                        sessionStorage.setItem('canvasProp', JSON.stringify(that.canvasProp))
                    }
                    that.pageParams.floor_photo_coordinate = {
                        top: 0,
                        left: 0
                    }
                    that.pageParams.floor_photo_size = {
                        width: domWidth,
                        height: domHeight
                    }
                    that.getAreaList()
                }
            })
        },
        beforeDestroy() {
            if (this.timer1) {
                clearInterval(this.timer1); // 在Vue实例销毁前，清除我们的定时器
            }
        },
        methods: {
            navigateToUpload() {
                this.$router.push({
                    path: "/village/village.iframe/house_index_config"
                })
            },
            getTime() {
                let _this = this
                this.timer1 = setInterval(() => {
                    _this.timer = new Date(); // 修改数据date
                }, 1000)
            },
            goBackIndex() {
                this.isCurrentShow = true
                this.current = 0
                this.getHomeStatistic()
                this.getWeather()
                this.reset()
                if (this.isChange) {
                    this.getVillgePayOrder()
                    this.getVillgeRepair()
                } else {
                    this.getPopulationStatistic()
                }
            },
            loginout() {
                window.opener = null;
                window.open('', '_self');
                window.close();
            },
            isPopup() {
                if(this.single_id){
                    this.getBuildingInfo(this.single_id)
                } else{
                    this.$message.warn('该区域未绑定'+store.getters.config.single_name)
                }
            },

            getHomeStatistic() {
                this.home_alarm_list = []
                this.vacancy_count_list = []
                this.homeStatisticData = {}
                this.request(configVillageApi.getHomeStatistic, {}, 'post').then((res) => {
                    this.homeStatisticData = res
                    this.village_info = res.village_info
                    this.shebei_device_total = res.device_list.device_total
                    this.device_list_type = res.device_list.type
                    this.device_list_list = res.device_list.list
                    this.vehicle_list_type = res.vehicle_list.type
                    this.vehicle_list_list = res.vehicle_list.list
                    this.house_img = res.vacancy_count.house_img
                    this.alarm_img = res.alarm_list.img
                    this.device_img = res.device_list.img
                    this.vehicle_img = res.vehicle_list.img
                    this.vacancy_count_list = [{
                        name: store.getters.config.single_name+'总数',
                        value: res.vacancy_count.countSingle,
                        img: res.vacancy_count.house_img1,
                        unit: '栋'
                    }, {
                        name: store.getters.config.room_name+'总数',
                        value: res.vacancy_count.countVacancy,
                        img: res.vacancy_count.house_img2,
                        unit: '套'
                    }, {
                        name: '住户统计',
                        value: res.vacancy_count.countBind,
                        img: res.vacancy_count.house_img3,
                        unit: '户'
                    }, {
                        name: '空户总数',
                        value: res.vacancy_count.countEmpty,
                        img: res.vacancy_count.house_img4,
                        unit: '户'
                    }]
                    this.home_alarm_list = res.alarm_list.list
                    this.myEcharts2(res.vacancy_count.countUser, res.vacancy_count.countRent)
                })
            },
            getNotice() {
                this.request(configVillageApi.getNotice, {}, 'post').then((res) => {
                    this.text_array = res
                    let arr_text = res.map(item => {
                        return item.title
                    })
                    this.text_arr = arr_text.join('\xa0\xa0\xa0\xa0\xa0\xa0')
                })
            },

            navigateToD(item) {
                this.current = 3
                this.news_id = item.news_id
            },

            getWeather() {
                this.request(configVillageApi.getWeather, {}, 'post').then((res) => {
                    this.weather = res
                    this.myEcharts(res.level)
                })
            },
            getPopulationStatistic() {
                this.request(configVillageApi.getPopulationStatistic, {}, 'post').then((res) => {
                    this.populationStatistic = res
                    this.myEcharts1(res.age)
                })
            },

            getBuildingInfo(single_id) {
                this.request(configVillageApi.getBuildingInfo, {
                    single_id: single_id
                }, 'post').then((res) => {
                    this.houseInfo = res
                    this.$refs.PopupBox.open()
                    console.log("getBuildingInfo=============>", res)
                })
            },

            getVillgePayOrder() {
                this.request(configVillageApi.getVillgePayOrder, {}, 'post').then((res) => {
                    this.villgePayOrderInfo = res
                    this.villge_pay_list = [{
                        name: '物业费',
                        value: res.property_money,
                        img: res.property_img,
                        unit: '元'
                    }, {
                        name: '停车费',
                        value: res.park_money,
                        img: res.park_img,
                        unit: '元'
                    }]
                    this.myEcharts3(res.property_money, res.park_money)
                })
            },

            getVillgeRepair() {
                this.request(configVillageApi.getVillgeRepair, {}, 'post').then((res) => {
                    this.villgeRepairInfo = res
                    this.villge_repair_list = [{
                        name: '工单总数',
                        value: res.repair_sum,
                        img: res.sum_img,
                    }, {
                        name: '已完成',
                        value: res.repair_sum_finish,
                        img: res.finish_img,
                    }, {
                        name: '处理中',
                        value: res.repair_sum_ing,
                        img: res.sum_img,
                    }]
                    this.myEcharts4(res.repair_1, res.repair_2, res.repair_3)
                    console.log("工单信息=========>", res)
                })
            },

            openHouseInfo() {
                this.text_show = false
                let firstClick = true
                if (firstClick) {
                    firstClick = false
                    this.$refs.PopupBox.close()
                    this.isCurrentShow = false
                    setTimeout(() => {
                        firstClick = true
                    }, 2000)
                }
            },
            clickMenu(index) {
                this.isCurrentShow = true
                this.current = index
                if (index == 0) {
                    this.getHomeStatistic()
                    this.getWeather()
                    this.getNotice()
                    this.reset()
                    if (this.isChange) {
                        this.getVillgePayOrder()
                        this.getVillgeRepair()
                    } else {
                        this.getPopulationStatistic()
                    }
                } else if (index == 3) {
                    this.news_id = 0
                    this.text_show = false
                } else{
                    this.text_show = false
                }
            },
            switchBox() {
                this.isChange = !this.isChange
                if (this.isChange) {
                    this.getVillgePayOrder()
                    this.getVillgeRepair()
                } else {
                    this.getPopulationStatistic()
                }
            },
            myEcharts(level) {
                const myChart = this.$echarts.init(document.getElementById('main'));

                let normal = 30;
                let all = 100;
                const option = {
                    width: 100,
                    height: 100,
                    backgroundColor: 'rgba(255,255,255,0)',
                    tooltip: {
                        formatter: "{a} <br/>值 : {c}"
                    },
                    grid: {
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    },
                    angleAxis: {
                        show: false,
                        max: 90 * 360 / 180, //-45度到225度，二者偏移值是270度除360度
                        type: 'value',
                        startAngle: 190, //极坐标初始角度
                        splitLine: {
                            show: false
                        }
                    },
                    barMaxWidth: 4, //圆环宽度
                    radiusAxis: {
                        show: false,
                        type: 'category',
                    },
                    //圆环位置和大小
                    polar: {
                        center: ['50%', '65%'],
                        radius: '70'
                    },
                    series: [{
                            name: "正常数",
                            type: "gauge",
                            center: ['50%', '65%'],
                            radius: '100%',
                            min: 0, //最小刻度
                            max: all, //最大刻度
                            startAngle: 200,
                            endAngle: -20,
                            axisLine: {
                                lineStyle: {
                                    color: [
                                        [1, new echarts.graphic.LinearGradient(
                                            0, 0, 1, 0, [{
                                                    offset: 0,
                                                    color: '#14E4A2',
                                                }, {
                                                    offset: 0.5,
                                                    color: '#FFDA78',
                                                },
                                                {
                                                    offset: 1,
                                                    color: '#FFA00B',
                                                }
                                            ]
                                        )]
                                    ],
                                    width: 5
                                }
                            },
                            axisLabel: {
                                show: false,
                                color: [
                                    [1, '#14E4A2']
                                ],
                            },
                            axisTick: {
                                show: false,

                            },
                            splitLine: {
                                show: true,
                                length: 8,
                                lineStyle: {
                                    width: 1,
                                    color: 'rgba(255,255,255,0)'
                                }
                            },
                            splitNumber: 120,
                            itemStyle: {
                                show: true,
                            },
                            detail: {
                                textStyle: {
                                    fontSize: 20,
                                    fontWeight: '700',
                                    color: '#3286EC'
                                },
                                show: true,
                                offsetCenter: [0, '0%'],
                                formatter: (value) => {
                                    return [
                                        level.value
                                    ]
                                },
                            },
                            data: [{
                                value: normal,
                            }],
                            pointer: {
                                show: false,
                                length: "50%",
                                width: "2%",

                            },
                            animationDuration: 4000,
                        },
                        {
                            type: 'bar',
                            data: [{ //上层圆环，显示数据
                                value: level.level,
                                itemStyle: {
                                    color: { //图形渐变颜色方法，四个数字分别代表，右，下，左，上，offset表示0%到100%
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 1, //从左到右 0-1
                                        y2: 0,
                                        colorStops: [{
                                            offset: 0,
                                            color: 'rgb(11,255,0)'
                                        }, {
                                            offset: 0.3,
                                            color: 'rgb(239,255,0)'
                                        }, {
                                            offset: 0.6,
                                            color: 'rgb(239,255,0)'
                                        }, {
                                            offset: 1,
                                            color: '#f00'
                                        }],
                                    },
                                },
                            }],
                            barGap: '100%', //柱间距离,上下两层圆环重合
                            coordinateSystem: 'polar',
                            roundCap: true, //顶端圆角从 v4.5.0 开始支持
                            z: 2 //圆环层级，同zindex
                        },
                        { //下层圆环，显示最大值
                            type: 'bar',
                            data: [{
                                value: level.level,
                                itemStyle: {
                                    color: '#cecece'
                                }
                            }],
                            barGap: '-90%',
                            barWidth: 10,
                            coordinateSystem: 'polar',
                            roundCap: true,
                            z: 1
                        },
                    ]
                }
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            },
            myEcharts1(age) {
                // 基于准备好的dom，初始化echarts实例
                const myChart1 = this.$echarts.init(document.getElementById('main_a'));

                var scale = 1;
                var echartData = [{
                        value: age.level1,
                        name: '18岁以下',
                        itemStyle: {
                            normal: { //颜色渐变
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [{
                                            offset: 0,
                                            color: 'rgba(255, 129, 129, 1)'
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(228, 255, 79, 1)'
                                        }
                                    ]
                                )
                            }
                        }

                    }, {
                        value: age.level2,
                        name: '18-40岁',
                        itemStyle: {
                            normal: { //颜色渐变
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [{
                                            offset: 0,
                                            color: 'rgba(79, 255, 141, 1)'
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(36, 232, 255, 1)'
                                        }
                                    ]
                                )
                            }
                        }

                    }, {
                        value: age.level3,
                        name: '41-60岁',
                        itemStyle: {
                            normal: { //颜色渐变
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [{
                                            offset: 0,
                                            color: 'rgba(217, 177, 255, 1)'
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(194, 134, 255, 1)'
                                        }
                                    ]
                                )
                            }
                        }
                    },
                    {
                        value: age.level4,
                        name: '60岁以上',
                        itemStyle: {
                            normal: { //颜色渐变
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [{
                                            offset: 0,
                                            color: 'rgba(217, 77, 255, 1)'
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(14, 13, 255, 1)'
                                        }
                                    ]
                                )
                            }
                        }
                    }
                ]
                var total_datas = 0;
                // for (var i = 0; i < echartData.length; i++) {
                //   total_datas += echartData[i].value
                // }
                total_datas = age.population_count
                var rich = {
                    yellow: {
                        color: "rgba(255, 255, 255, 1)",
                        fontSize: 12 * scale,
                        // padding: [21, 0],
                        align: 'center'
                    },
                    total: {
                        color: "rgba(255, 255, 255, 1)",
                        fontSize: 12 * scale,
                        align: 'center'
                    },

                    blue: {
                        color: 'rgba(255, 255, 255, 1)',
                        fontSize: 13 * scale,
                        align: 'center'
                    },
                    hr: {
                        borderColor: '#0b5263',
                        width: '100%',
                        borderWidth: 1,
                        height: 0,
                    }
                }
                const option = {
                    backgroundColor: 'rgba(255,255,255,0)',
                    title: {
                        text: total_datas,
                        textStyle: {
                            color: 'rgba(255, 255, 255, 1)',
                            fontSize: 12,
                            align: 'center',
                        },
                        x: 'center',
                        y: 'center',
                    },
                    series: [{
                        name: '总人口数',
                        type: 'pie',
                        itemStyle: {
                            normal: {
                                borderWidth: 5,
                                borderColor: "rgba(7, 26, 51, 1)",
                            }
                        },
                        radius: ['38%', '50%'],
                        hoverAnimation: false,
                        color: ['#c487ee', '#deb140', '#49dff0', '#034079', '#6f81da', '#00ffb4'],
                        label: {
                            show: true,
                            formatter: '{name|{b}}\n {time|{d}%}',
                            rich: {
                                name: {
                                    fontSize: 10,
                                    color: '#fff'
                                },
                                time: {
                                    fontSize: 10,
                                    color: '#fff'
                                }
                            }
                        },
                        labelLine: {
                            length: 15,
                            length2: 5,
                            maxSurfaceAngle: 120,
                            lineStyle: {
                                color: '#0b5263'
                            }
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '15',
                                fontColor: '#fff'
                            }
                        },
                        data: echartData
                    }]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart1.setOption(option);
            },
            myEcharts2(val1, val2) {
                // 基于准备好的dom，初始化echarts实例
                const myChart2 = this.$echarts.init(document.getElementById('main_b'));

                const option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    series: [{
                        name: '访问来源',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '55%'],
                        y: '-10%',
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [{
                                value: val1,
                                name: '自主',
                                selected: true,
                                itemStyle: {
                                    normal: { //颜色渐变
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: '#0bc1cc'
                                        }, {
                                            offset: .5,
                                            color: '#35abd9'
                                        }, {
                                            offset: 1,
                                            color: '#9977ef'
                                        }])
                                    }
                                }
                            },
                            {
                                value: val2,
                                name: '租赁',
                                itemStyle: {
                                    normal: { //颜色渐变
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: '#768be7'
                                        }, {
                                            offset: .5,
                                            color: '#a771f7'
                                        }, {
                                            offset: 1,
                                            color: '#c957fe'
                                        }])
                                    }
                                }
                            }
                        ]
                    }]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart2.setOption(option);
            },
            myEcharts3(val1, val2) {
                // 基于准备好的dom，初始化echarts实例
                const myChart3 = this.$echarts.init(document.getElementById('main_c'));
                const option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    series: [{
                        type: 'pie',
                        radius: ['36%', '52%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            normal: { //颜色渐变
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#fb4470'
                                }, {
                                    offset: .5,
                                    color: '#f7678b'
                                }, {
                                    offset: 1,
                                    color: '#f28ba8'
                                }])
                            }
                        },
                        label: {
                            show: true,
                            formatter: '{name|{b}} {time|{d}%}',
                            rich: {
                                name: {
                                    fontSize: 10,
                                    color: '#fff'
                                },
                                time: {
                                    fontSize: 10,
                                    color: '#fff'
                                }
                            }
                        },
                        labelLine: {
                            length: 15,
                            length2: 5,
                            maxSurfaceAngle: 160,
                            lineStyle: {
                                color: '#0b5263'
                            }
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '15',
                                fontColor: '#fff'
                            }
                        },
                        data: [{
                                value: val1,
                                name: '物业费'
                            },
                            {
                                value: val2,
                                name: '停车费'
                            },
                        ]
                    }]
                };
                myChart3.setOption(option);
            },

            myEcharts4(val1, val2, val3) {
                // 基于准备好的dom，初始化echarts实例
                const myChart4 = this.$echarts.init(document.getElementById('main_d'));
                let dataA = [{
                    value: val1,
                    name: '在线报修',
                    selected: true,
                    itemStyle: {
                        normal: { //颜色渐变
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#4188fa'
                            }, {
                                offset: .5,
                                color: '#4280fa'
                            }, {
                                offset: 1,
                                color: '#4187fa'
                            }])
                        }
                    },
                }, {
                    value: val2,
                    name: '水电煤上报',
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#04b568'
                        }, {
                            offset: .5,
                            color: '#20c3a8'
                        }, {
                            offset: 1,
                            color: '#2fcac8'
                        }])
                    },
                }, {
                    value: val3,
                    name: '投诉建议',
                    itemStyle: {
                        normal: { //颜色渐变
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: '#7883f8'
                            }, {
                                offset: .5,
                                color: '#7980f8'
                            }, {
                                offset: 1,
                                color: '#7689f7'
                            }])
                        }
                    },
                }]
                dataA.map((v, i) => {
                    if (v.value == 0 || v.value == '') {
                        dataA.splice(i, 1)
                    }
                })
                const option = {
                    series: [{
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '55%'],
                        data: dataA,
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        }
                    }]
                };
                myChart4.setOption(option);
            },

            getAreaList() {
                let that = this
                that.request(streetVillageApi.getSingleAreaCoordinate, that.pageParams, 'post').then((res) => {
                    that.singleArr = res.list || []
                    that.imgUrl = res.src
                    that.reset()
                })
            },
            drawBack(arr, back_color, color = '') {
                let canvas = document.getElementById('myCanvas');
                let ctx = canvas.getContext("2d");
                ctx.beginPath();
                arr.map((v, i) => {
                    if (i == 0) {
                        ctx.moveTo(v.x, v.y);
                    } else {
                        ctx.lineTo(v.x, v.y);
                    }
                })
                ctx.closePath();
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.fillStyle = back_color; //填充颜色
                ctx.fill(); //填充
            },
            drawPoint(x, y) {
                let canvas = document.getElementById('myCanvas');
                let ctx = canvas.getContext("2d");
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
            },
            drawLine(start, end) {
                let canvas = document.getElementById('myCanvas');
                let ctx = canvas.getContext("2d");
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#FF0000";
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
            },
            clearCanvas() {
                let canvas = document.getElementById('myCanvas');
                canvas.width = this.canvasProp.width || JSON.parse(sessionStorage.getItem('canvasProp')).width
                canvas.height = this.canvasProp.height || JSON.parse(sessionStorage.getItem('canvasProp')).height
            },
            reset() {
                let that = this
                that.clearCanvas()
                that.pointArr = []
                if (that.singleArr.length == 0) {
                    return
                }
                that.$nextTick(() => {
                    that.singleArr.map((single, index) => {
                        // single.pointArr.map((v, i) => {
                        //     that.drawPoint(v.x, v.y)
                        //     if (i != 0) {
                        //         that.drawLine(single.pointArr[i - 1], single.pointArr[i])
                        //     }
                        // })
                        let back_color = "RGBA(177, 6, 29, .3)"
                        if (single.single_id) {
                            back_color = "RGBA(0, 255, 255, .3)"
                        }
                        that.drawBack(single.pointArr, back_color, '#ffffff')
                    })
                })
            },
            rightClick($el) {
                let that = this
                let point = {
                    x: $el.x,
                    y: $el.y
                }
                console.log('point===>', point)
                that.popupPosition.top = $el.y - 86
                that.popupPosition.left = $el.x - 49
                that.text_show = false
                that.singleArr.map((v, i) => {
                    if (that.calculationExtremum(v.pointArr, point)) {
                        that.single_id = v.single_id
                        that.single_name = v.single_name || v.single_id
                        that.text_show = true
                    }
                })
            },
            calculate(arr, p) {
                let count = arr.length;
                let result = false;
                for (let i = 0, j = count - 1; i < count; i++) {
                    let p1 = arr[i];
                    let p2 = arr[j];
                    if ((p1.x < p.x && p2.x >= p.x) || (p2.x < p.x && p1.x >= p.x)) {
                        if ((p.x - p1.x) / (p2.x - p1.x) * (p2.y - p1.y) + p1.y < p.y) {
                            result = !result;
                        }
                    }
                    j = i;
                }
                return result;
            },
            calculationExtremum(pointArr, point) {
                let that = this
                let flag = true
                let xArr = []
                let yArr = []
                pointArr.map(v => {
                    xArr.push(v.x)
                    yArr.push(v.y)
                })
                let xMin = Math.min(...xArr);
                let xMax = Math.max(...xArr);
                let yMin = Math.min(...yArr);
                let yMax = Math.max(...yArr);
                if (point.x < xMin || point.x > xMax || point.y < yMin || point.y > yMax) {
                    flag = false
                }
                if (flag) {
                    flag = that.calculate(pointArr, point)
                }
                return flag
            },
            menuClick(item) {
                let that = this
                if (item.name == '删除') {
                    that.singleArr.splice(that.currentIndex, 1)
                    that.request(streetVillageApi.delArea, {
                        area_id: that.area_id
                    }, 'post').then((res) => {
                        that.$message.success('删除成功！')
                        that.getAreaList()
                        that.isDraw = false
                    })
                    that.showMenu = false
                } else if (item.name == '编辑') {
                    if (that.hasBind) {
                        that.$message.warn('该区域已绑定'+store.getters.config.single_name)
                    } else {
                        that.visible = true
                    }
                }
            },

        }
    };
</script>

<style lang="less" scoped>
    @rem: 192; //定义页面尺寸

    // 公共样式 
    .marTop {
        margin-top: 2.7%;
    }

    p {
        margin-bottom: 0;
    }

    .container {
        // background-image: url(../../../../assets/communityimg/cockpit_bg.png);
        background-color: RGBA(14, 22, 43, 1);
        width: 100vw;
        height: 100vh;
        background-size: cover;
        color: #666;
        font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
        font-size: 14/@rem * 1rem;
        position: relative;
        display: flex;
        flex-direction: column;
        color: #747b8b;
        font-size: 16/@rem * 1rem;
        overflow: hidden;

        .imgBox {
            position: absolute;
            width: 100vw;
            height: 100vh;
            // width: 660/@rem * 1rem;
            // height: 260/@rem * 1rem;
            background-color: rgba(0, 0, 0, 0);
            cursor: pointer;
            z-index: 99;
            .canvas_img{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
            #myCanvas {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
        }

        .fixed_box_1 {
            width: 98/@rem * 1rem;
            height: 87/@rem * 1rem;
            background-image: url(../../../../assets/communityimg/cockpit_icon_2.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: absolute;
            z-index: 99;
            cursor: pointer;

            .single_name {
                font-size: 12/@rem * 1rem;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #FFFFFF;
                position: absolute;
                top: 15/@rem * 1rem;
            }
        }

        .head_bg_3 {
            width: 100%;
            height: 105/@rem * 1rem;
            // background: linear-gradient(0deg, #141D33, #0C223E);
            box-shadow: 0/@rem * 1rem 6/@rem * 1rem 12/@rem * 1rem 0/@rem * 1rem rgba(15, 91, 144, 0.44);
        }

        .head_box {
            width: 100%;
            height: 10%;
            display: flex;
            flex-direction: row;
            align-items: center;
            z-index: 100;

            .logo_box {
                width: 425/@rem * 1rem;
                height: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;

                .logo_img {
                    display: block;
                    max-height: 100%;
                    max-width: 380/@rem * 1rem;
                }
            }

            .menu_box {
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-left: 60/@rem * 1rem;
                margin-top: 15/@rem * 1rem;

                .item_box_flex {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    background-image: url(../../../../assets/communityimg/cockpit_menu_2.png);
                    background-repeat: no-repeat;
                    width: 175/@rem * 1rem;
                    height: 58/@rem * 1rem;
                    background-size: 100% 100%;
                    margin-left: 23/@rem * 1rem;
                    cursor: pointer;

                    .menu_icon {
                        width: 28/@rem * 1rem;
                        height: 28/@rem * 1rem;
                    }

                    .title_1 {
                        font-size: 18/@rem * 1rem;
                        font-family: SimHei;
                        font-weight: bold;
                        color: #FFFFFF;
                        line-height: 15/@rem * 1rem;
                        margin-left: 10/@rem * 1rem;
                    }
                }

                .item_box_active {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    background-image: url(../../../../assets/communityimg/cockpit_menu_1.png);
                    background-repeat: no-repeat;
                    width: 175/@rem * 1rem;
                    height: 58/@rem * 1rem;
                    background-size: 100% 100%;
                    margin-left: 23/@rem * 1rem;
                    cursor: pointer;
                }
            }

            .admin_box {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                width: 445/@rem * 1rem;

                .time_text {
                    font-size: 18/@rem * 1rem;
                    font-family: Microsoft JhengHei;
                    font-weight: 400;
                    color: #FFFFFF;
                    line-height: 14/@rem * 1rem;
                    position: absolute;
                    top: 100/@rem * 1rem;
                    right: 42/@rem * 1rem;
                }

                .admin_flex {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    width: 325/@rem * 1rem;
                    height: 50/@rem * 1rem;
                    background: rgba(42, 117, 255, 0.15);
                    border: 1/@rem * 1rem solid #25B0FF;
                    border-radius: 4/@rem * 1rem;
                    margin-top: 10/@rem * 1rem;
                    margin-right: 42/@rem * 1rem;

                    .admin_name {
                        margin-left: 24/@rem * 1rem;
                        margin-right: 24/@rem * 1rem;
                        font-size: 20/@rem * 1rem;
                        font-family: Microsoft YaHei;
                        font-weight: 400;
                        color: #FFFFFF;
                        line-height: 18/@rem * 1rem;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        word-break: break-all;
                    }

                    .flex_icon {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        margin-right: 20/@rem * 1rem;

                        .cockpit_admin {
                            width: 29/@rem * 1rem;
                            height: 33/@rem * 1rem;
                        }

                        .line {
                            width: 2/@rem * 1rem;
                            height: 28/@rem * 1rem;
                            background: #FFFFFF;
                            margin: 0 10/@rem * 1rem;
                        }

                        .cockpit_loginout {
                            width: 30/@rem * 1rem;
                            height: 30/@rem * 1rem;
                        }
                    }
                }
            }
        }

        .current_1 {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 90%;
            padding: 0 20/@rem * 1rem;
            padding-top: 3.2%;
            position: relative;

            // 滚动公告
            .laba_box {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                /*移动自身的一半*/
                top: 2%;
                padding: 0 10/@rem * 1rem;
                align-items: center;
                margin: 0 auto;
                display: flex;
                flex-direction: row;
                flex: 1;
                z-index: 99;

                .marquee-inner-wrapper {
                    width: 603/@rem * 1rem;
                    overflow: hidden;
                    height: 40/@rem * 1rem;
                    font-size: 14/@rem * 1rem;
                    color: #FFFFFF;
                    line-height: 40/@rem * 1rem;
                    margin: 0 auto;
                    white-space: nowrap;
                    position: relative;
                    margin-left: 15/@rem * 1rem;

                    .paomadeng {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        .paomadeng_item {
                            width: 100%;
                            overflow: hidden;

                            &:nth-child(1) {
                                background-color: #999;
                            }

                            &:nth-child(2) {
                                background-color: #666;
                            }

                            &:nth-child(3) {
                                background-color: #333;
                            }
                        }
                    }
                }

                /* 需要将两个文字内容一样的span放在最右边 */
                .marquee-inner-wrapper span {
                    position: absolute;
                    top: 0;
                    left: 100%;
                    height: 100%;
                }

                /* 定义第一个span的animation：时长 动画名字 匀速 循环 正常播放 */
                .first-marquee {
                    -webkit-animation: 25s first-marquee linear infinite normal;
                    animation: 25s first-marquee linear infinite normal;
                    // padding-right: 70%;
                    cursor: pointer;

                    span {
                        display: flex;
                        align-items: center;
                        background-color: #000000;
                        z-index: 999;
                        overflow: visible;
                        transform: translateY(20px);

                        li {
                            list-style: none;
                            margin-left: 30px;

                            &:nth-child(1) {
                                margin-left: 0;
                            }
                        }
                    }
                }

                @keyframes first-marquee {
                    0% {
                        -webkit-transform: translate3d(0, 0, 0);
                        transform: translate3d(0, 0, 0);
                    }

                    /* 向左移动 */
                    100% {
                        -webkit-transform: translate3d(-200%, 0, 0);
                        transform: translate3d(-200%, 0, 0);
                        display: none;
                    }
                }

                .second-marquee {
                    /* 因为要在第一个span播完之前就得出现第二个span，所以就延迟12s才播放 */
                    -webkit-animation: 25s second-marquee linear 12s infinite normal;
                    animation: 25s second-marquee linear 12s infinite normal;
                    padding-right: 53%;
                    cursor: pointer;

                    span {
                        display: flex;
                        align-items: center;
                        background-color: #000000;
                        z-index: 999;
                        overflow: visible;
                        transform: translateY(20px);

                        li {
                            list-style: none;
                            margin-left: 30px;

                            &:nth-child(1) {
                                margin-left: 0;
                            }
                        }
                    }
                }

                @keyframes second-marquee {
                    0% {
                        -webkit-transform: translate3d(0%, 0, 0);
                        transform: translate3d(0%, 0, 0);
                    }

                    100% {
                        -webkit-transform: translate3d(-200%, 0, 0);
                        transform: translate3d(-200%, 0, 0);
                        display: none;
                    }
                }
            }

            // 切换按钮
            .switch_btn {
                position: absolute;
                top: 7.5%;
                right: 21.5%;
                cursor: pointer;
                z-index: 99;
            }

            // 背景图上传
            .up_bnt {
                display: flex;
                flex-direction: column;
                align-items: center;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 99;

                /*移动自身的一半*/
                .up_text {
                    color: #CCCCCC;
                }

                .up_btn_text {
                    background-color: rgba(24, 144, 255, 1);
                    border-radius: 5/@rem * 1rem;
                    width: 80/@rem * 1rem;
                    height: 30/@rem * 1rem;
                    line-height: 30/@rem * 1rem;
                    text-align: center;
                    color: #FFFFFF;
                    margin-top: 15/@rem * 1rem;
                    cursor: pointer;
                }
            }

            .left_box {
                height: 100%;
                z-index: 99;

                .BlockBox_c_1 {
                    .flex_box_1 {
                        width: 300/@rem * 1rem;
                        height: 80%;
                        padding-bottom: 5/@rem * 1rem;

                        .info_box {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            flex-wrap: wrap;
                            justify-content: flex-start;

                            .item_box {
                                height: 30/@rem * 1rem;
                                line-height: 30/@rem * 1rem;
                                margin-left: 30/@rem * 1rem;
                                margin-top: 3%;
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                justify-content: flex-start;

                                .icon_box {
                                    width: 45/@rem * 1rem;
                                    height: 30/@rem * 1rem;
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                    justify-content: flex-start;
                                }

                                .text_1 {
                                    font-size: 13/@rem * 1rem;
                                    font-family: Microsoft YaHei;
                                    font-weight: 400;
                                    color: #FFFFFF;
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                }

                                .text_2 {
                                    font-size: 20/@rem * 1rem;
                                    font-family: ArialNarrow;
                                    font-weight: 400;
                                    color: #03FFEA;
                                }
                            }

                            .item_box:first-of-type {
                                margin-left: 10/@rem * 1rem;
                            }

                            .item_box:nth-of-type(n+4) {
                                margin-top: 14/@rem * 1rem;
                            }

                            .item_box:nth-of-type(4) {
                                margin-left: 10/@rem * 1rem;
                            }
                        }

                        .info_box2 {
                            display: flex;
                            flex-direction: row;
                            width: 346/@rem * 1rem;
                            margin-top: 3%;

                            .left_flex_box {
                                display: flex;
                                flex-direction: column;

                                .flex_box_2 {
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                    justify-content: flex-start;
                                    margin-left: 10/@rem * 1rem;
                                    margin-top: 10/@rem * 1rem;

                                    .weather_icon {
                                        width: 25/@rem * 1rem;
                                        height: 25/@rem * 1rem;
                                    }

                                    .flex_mini_box {
                                        display: flex;
                                        flex-direction: column;
                                        justify-content: flex-start;
                                        margin-left: 10/@rem * 1rem;

                                        .flex_1 {
                                            display: flex;
                                            flex-direction: row;
                                            align-items: center;
                                            justify-content: space-between;

                                            .text_2 {
                                                font-size: 11/@rem * 1rem;
                                                font-family: Microsoft YaHei;
                                                font-weight: 400;
                                                color: #85D7FF;
                                            }

                                            .weather_text {
                                                display: flex;
                                                flex-direction: row;
                                                align-items: center;

                                                .text_3 {
                                                    font-size: 20/@rem * 1rem;
                                                    font-family: Arial;
                                                    font-weight: 400;
                                                    color: #85D7FF;
                                                    margin-bottom: 0;
                                                }

                                                .text_4 {
                                                    font-size: 10/@rem * 1rem;
                                                    font-family: Arial;
                                                    font-weight: 400;
                                                    color: #85D7FF;
                                                    margin-bottom: 0;
                                                }
                                            }
                                        }

                                        .flex_2 {
                                            width: 144/@rem * 1rem;
                                            height: 2/@rem * 1rem;
                                            background: rgba(26, 60, 110, 0.57);

                                            .bar {
                                                // width: 50/@rem * 1rem;
                                                height: 2/@rem * 1rem;
                                                background: #1BFF89;
                                            }
                                        }
                                    }
                                }
                            }

                            .my_echarts_1 {
                                width: 93/@rem * 1rem;
                                height: 93/@rem * 1rem;
                                margin-left: 30/@rem * 1rem;
                            }
                        }
                    }
                }

                .BlockBox_c_2 {
                    .info_text {
                        display: flex;
                        align-items: center;
                        font-size: 16/@rem * 1rem;
                        font-family: SimHei;
                        font-weight: 400;
                        color: #FFFFFF;

                        .text_1 {
                            font-size: 32/@rem * 1rem;
                            font-family: SimHei;
                            font-weight: 400;
                            color: rgba(3, 255, 234, 1);
                        }
                    }

                    .info_box {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-evenly;
                        width: 100%;

                        .item_box {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            height: 15/@rem * 1rem;

                            .icon_1 {
                                width: 9/@rem * 1rem;
                                height: 9/@rem * 1rem;
                                background: #39F05F;
                            }

                            .text_2 {
                                font-size: 12/@rem * 1rem;
                                font-family: SimHei;
                                font-weight: 400;
                                color: #FFFFFF;
                                margin-left: 6/@rem * 1rem;
                            }
                        }
                    }

                    .info_box_2 {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: flex-start;
                        flex-wrap: wrap;
                        width: 100%;
                        padding-bottom: 5/@rem * 1rem;

                        .item_box {
                            width: 50%;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            margin-top: 3%;
                            padding-left: 37/@rem * 1rem;

                            .left_flex_box {
                                max-width: 30/@rem * 1rem;
                                max-height: 30/@rem * 1rem;
                            }

                            .flex_1 {
                                display: flex;
                                flex-direction: column;
                                margin-left: 12/@rem * 1rem;

                                .text_2 {
                                    font-size: 13/@rem * 1rem;
                                    font-family: Microsoft YaHei;
                                    font-weight: 400;
                                    color: #FFFFFF;
                                }

                                .flex_mini_box {
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;

                                    .text_3 {
                                        font-size: 16/@rem * 1rem;
                                        font-family: Microsoft JhengHei;
                                        font-weight: bold;
                                        color: #39F05F;
                                        margin-left: 10/@rem * 1rem;
                                    }

                                    .text_3:first-of-type {
                                        margin-left: 0/@rem * 1rem;
                                    }
                                }
                            }
                        }
                    }
                }

                .BlockBox_c_3 {
                    .top_box_4 {
                        width: 100%;
                        height: 80%;
                        display: flex;
                        // justify-content: center;
                        align-items: center;

                        .mini_box_1 {
                            width: 100%;
                            height: 80%;
                            position: relative;

                            .table-right {
                                width: 100%;
                                height: 95%;
                                border: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                                position: relative;

                                .table-scroll_right {
                                    width: 100%;
                                    height: 100%;
                                    overflow-y: scroll;
                                    margin-top: 4.4%;

                                    .table-flex_body_right {
                                        width: 98%;
                                        display: flex;
                                        flex-direction: row;
                                        // background-color: rgba(38, 147, 174, 0.3);
                                        margin: 8/@rem * 1rem 0/@rem * 1rem;

                                        .text_1 {
                                            width: 100%;
                                            text-align: center;
                                            font-size: 12/@rem * 1rem;
                                            padding: 5/@rem * 1rem 0;
                                            color: rgba(3, 255, 234, 1);
                                            text-overflow: ellipsis;
                                            overflow: hidden;
                                            word-break: break-all;
                                            border-right: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                                            border-bottom: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                                            cursor: default;
                                        }

                                        .text_1:first-of-type {
                                            width: 100%;
                                            text-align: center;
                                            font-size: 12/@rem * 1rem;
                                            padding: 5/@rem * 1rem 0;
                                            color: rgba(3, 255, 234, 1);
                                            white-space: nowrap;
                                            text-overflow: ellipsis;
                                            overflow: hidden;
                                            word-break: break-all;
                                        }
                                    }

                                    .table-flex_body_right:nth-of-type(even) {
                                        width: 98%;
                                        display: flex;
                                        flex-direction: row;
                                        // background-color: rgba(38, 147, 174, 0.3);
                                        margin: 8/@rem * 1rem 0/@rem * 1rem;

                                        .text_1 {
                                            width: 100%;
                                            text-align: center;
                                            font-size: 12/@rem * 1rem;
                                            padding: 5/@rem * 1rem 0;
                                            color: rgba(147, 200, 254, 1) !important;
                                            text-overflow: ellipsis;
                                            overflow: hidden;
                                            word-break: break-all;
                                            border-right: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                                            border-bottom: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                                            cursor: default;
                                        }
                                    }

                                    .table-flex_body_right:nth-of-type(odd) {
                                        width: 98%;
                                        display: flex;
                                        flex-direction: row;
                                        // background-color: rgba(38, 147, 174, 0.3);
                                        margin: 8/@rem * 1rem 0/@rem * 1rem;

                                        .text_1 {
                                            width: 100%;
                                            text-align: center;
                                            font-size: 12/@rem * 1rem;
                                            padding: 5/@rem * 1rem 0;
                                            color: rgba(255, 255, 255, 1);
                                            text-overflow: ellipsis;
                                            overflow: hidden;
                                            word-break: break-all;
                                            border-right: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                                            border-bottom: 0/@rem * 1rem solid rgba(19, 60, 123, 1);
                                            cursor: default;
                                        }
                                    }

                                    .table-flex_body_right:first-of-type {
                                        width: 97%;
                                        display: flex;
                                        flex-direction: row;
                                        // background-color: rgba(33, 99, 129, 0.7);
                                        position: absolute;
                                        margin-top: -28/@rem * 1rem;

                                        .text_1 {
                                            width: 100%;
                                            text-align: center;
                                            font-size: 12/@rem * 1rem;
                                            padding: 5/@rem * 1rem 0;
                                            // background-color: rgba(0, 150, 255, 0.3);
                                            color: rgba(3, 255, 234, 1) !important;
                                            white-space: nowrap;
                                            text-overflow: ellipsis;
                                            overflow: hidden;
                                            word-break: break-all;
                                        }
                                    }

                                    .table-flex_body_right:first-of-type:hover {
                                        width: 97%;
                                        display: flex;
                                        flex-direction: row;
                                        // background-color: rgba(33, 99, 129, 0.7);
                                        position: absolute;
                                        margin-top: -28/@rem * 1rem;

                                        .text_1 {
                                            width: 100%;
                                            text-align: center;
                                            font-size: 12/@rem * 1rem;
                                            padding: 5/@rem * 1rem 0;
                                            // background-color: rgba(0, 150, 255, 0.3);
                                            // color: #58AEDB;
                                            white-space: nowrap;
                                            text-overflow: ellipsis;
                                            overflow: hidden;
                                            word-break: break-all;
                                        }
                                    }

                                    .table-flex_body_right:hover {
                                        // background-color: rgba(240, 171, 51, 1);

                                        .text_1 {
                                            // color: rgba(0, 0, 0, 1);
                                        }
                                    }
                                }
                            }
                        }

                        .tip_text_box {
                            width: 90%;
                            height: 80%;
                            margin: 15/@rem * 1rem 15/@rem * 1rem 15/@rem * 1rem 18/@rem * 1rem;
                            padding-right: 10/@rem * 1rem;
                            overflow-y: scroll;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            .tip_text {
                                font-size: 14/@rem * 1rem;
                                color: #0056af;
                            }
                        }
                    }
                }
            }

            .right_box {
                height: 100%;
                z-index: 99;

                .change_box {
                    height: 65%;
                }

                .BlockBox_c_4 {
                    .echarts_text {
                        position: absolute;
                        bottom: 8%;
                        right: 20%;
                        font-size: 17/@rem * 1rem;
                        font-family: Microsoft JhengHei;
                        font-weight: bold;
                        color: #FFFFFF;
                    }

                    .info_box_4 {
                        width: 346/@rem * 1rem;
                        display: flex;
                        flex-direction: row;
                        align-items: center;

                        .left_info_box {
                            width: 130/@rem * 1rem;
                            display: flex;
                            flex-direction: column;

                            .item_box_4 {
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                margin-top: 8%;

                                .img_1 {
                                    max-width: 42/@rem * 1rem;
                                }

                                .flex_4 {
                                    display: flex;
                                    flex-direction: column;
                                    margin-left: 12/@rem * 1rem;

                                    .text_5 {
                                        font-size: 12/@rem * 1rem;
                                        font-family: Microsoft YaHei;
                                        font-weight: 400;
                                        color: #FFFFFF;
                                    }

                                    .flex_bottom_box {
                                        display: flex;
                                        flex-direction: row;
                                        align-items: center;
                                        margin-top: 3/@rem * 1rem;

                                        .text_6 {
                                            font-size: 18/@rem * 1rem;
                                            font-family: Microsoft YaHei;
                                            font-weight: 400;
                                            color: #03FFEA;
                                        }

                                        .text_7 {
                                            font-size: 9/@rem * 1rem;
                                            font-family: Microsoft YaHei;
                                            font-weight: 400;
                                            color: rgba(255, 255, 255, 1);
                                        }
                                    }
                                }
                            }
                        }

                        .my_echarts_2 {
                            width: 216/@rem * 1rem;
                            height: 216/@rem * 1rem;
                            transform: translateY(-20/@rem * 1rem);
                            // padding-top: 2%;
                        }

                        .my_echarts_5 {
                            width: 216/@rem * 1rem;
                            height: 216/@rem * 1rem;
                            transform: translateY(-10/@rem * 1rem);
                        }
                    }
                }

                .BlockBox_c_5 {
                    .top_box_5 {
                        width: 316/@rem * 1rem;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-evenly;
                        margin-top: 8%;

                        .item_box_5 {
                            display: flex;
                            flex-direction: row;
                            align-items: center;

                            .square {
                                width: 11/@rem * 1rem;
                                height: 11/@rem * 1rem;
                                background-color: rgba(228, 255, 3, 1);
                            }

                            .text_8 {
                                font-size: 13/@rem * 1rem;
                                font-family: SimHei;
                                font-weight: 400;
                                color: #FFFFFF;
                                margin-left: 10/@rem * 1rem;
                            }
                        }
                    }

                    .bootom_box_5 {
                        width: 350/@rem * 1rem;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-evenly;
                        margin-top: 8%;
                        margin-bottom: 7%;

                        .item_box_6 {
                            display: flex;
                            flex-direction: row;
                            align-items: center;

                            .img_2 {
                                width: 36/@rem * 1rem;
                                height: 28/@rem * 1rem;
                            }

                            .right_box_5 {
                                display: flex;
                                flex-direction: column;
                                margin-left: 15/@rem * 1rem;

                                .text_9 {
                                    font-size: 13/@rem * 1rem;
                                    font-family: SimHei;
                                    font-weight: 400;
                                    color: #FFFFFF;
                                }

                                .flex_text_box_2 {
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                    vertical-align: text-bottom;

                                    .text_10 {
                                        font-size: 24/@rem * 1rem;
                                        font-family: Arial;
                                        font-weight: 400;
                                        color: #E4FF03;
                                        vertical-align: text-bottom;
                                    }

                                    .text_11 {
                                        width: 1/@rem * 1rem;
                                        height: 22/@rem * 1rem;
                                        background: linear-gradient(0deg, rgba(71, 184, 255, 0) 0%, rgba(71, 184, 255, 0.99) 49%, rgba(71, 184, 255, 0) 100%);
                                        margin: 0 5/@rem * 1rem;
                                    }

                                    .text_12 {
                                        font-size: 24/@rem * 1rem;
                                        font-family: Arial;
                                        font-weight: 400;
                                        color: #03FFEA;
                                        vertical-align: text-bottom;
                                        margin-right: 5/@rem * 1rem;
                                    }

                                    .text_13 {
                                        font-size: 12/@rem * 1rem;
                                        font-family: Arial;
                                        font-weight: 400;
                                        color: #FFFFFF;
                                        vertical-align: text-bottom;
                                    }
                                }
                            }
                        }
                    }
                }

                .BlockBox_c_6 {
                    .echarts_text_1 {
                        position: absolute;
                        bottom: 4%;
                        right: 17%;
                        font-size: 17/@rem * 1rem;
                        font-family: Microsoft JhengHei;
                        font-weight: bold;
                        color: #FFFFFF;
                    }

                    .info_box_6 {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        height: 77%;

                        .left_box_6 {
                            // margin-left: 20/@rem * 1rem;
                            display: flex;
                            flex-direction: column;
                            transform: scale(0.8);

                            .item_box_7 {
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                // margin-top: 1.5%;

                                .img_box {
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                    justify-content: flex-start;
                                    // max-width: 37/@rem * 1rem;
                                    // max-height: 33/@rem * 1rem;
                                    width: 36/@rem * 1rem;
                                    height: 36/@rem * 1rem;

                                    .img_2 {
                                        width: 36/@rem * 1rem;
                                        height: 36/@rem * 1rem;
                                    }
                                }

                                .right_text_box_1 {
                                    display: flex;
                                    flex-direction: column;
                                    margin-left: 18/@rem * 1rem;

                                    .text_14 {
                                        font-size: 16/@rem * 1rem;
                                        font-family: SimHei;
                                        font-weight: 400;
                                        color: #FFFFFF;
                                    }

                                    .flex_text_box_3 {
                                        display: flex;
                                        flex-direction: row;
                                        align-items: center;

                                        .text_15 {
                                            font-size: 20/@rem * 1rem;
                                            font-family: Microsoft JhengHei;
                                            font-weight: bold;
                                            color: #03FFEA;
                                        }

                                        .text_16 {
                                            font-size: 15/@rem * 1rem;
                                            font-family: Microsoft JhengHei;
                                            font-weight: bold;
                                            color: #FFFFFF;
                                        }
                                    }
                                }
                            }
                        }

                        .my_echarts_3 {
                            width: 216/@rem * 1rem;
                            height: 100%;
                            padding-top: 2%;
                        }

                        .my_echarts_4 {
                            width: 216/@rem * 1rem;
                            min-height: 176/@rem * 1rem;
                            max-height: 176/@rem * 1rem;
                            transform: translateY(-10/@rem * 1rem);
                        }
                    }
                }
            }
        }

        // 独立fixed元素
        .img_bg_1 {
            width: 1467/@rem * 1rem;
            height: 21.8%;
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 99;
        }

        .popup_content {
            width: 100%;
            padding: 30/@rem * 1rem 50/@rem * 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;

            .popup_flex_box {
                display: flex;
                flex-direction: row;
                align-items: center;
                flex-wrap: wrap;

                .popup_flex_1 {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    width: 50%;

                    .title {
                        font-size: 20/@rem * 1rem;
                        font-family: Microsoft YaHei;
                        font-weight: 400;
                        color: #3AF4FF;
                        line-height: 60/@rem * 1rem;
                    }

                    .text_1 {
                        font-size: 20/@rem * 1rem;
                        font-family: Microsoft YaHei;
                        font-weight: 400;
                        color: #FFFFFF;
                        line-height: 60/@rem * 1rem;
                    }
                }
            }

            .goinfo {
                width: 100/@rem * 1rem;
                height: 40/@rem * 1rem;
                background: #20B7FC;
                border-radius: 4/@rem * 1rem;
                font-size: 18/@rem * 1rem;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 40/@rem * 1rem;
                text-align: center;
                cursor: pointer;
            }
        }

        ::-webkit-scrollbar {
            width: 6/@rem * 1rem;
            height: 16/@rem * 1rem;
            background-color: rgba(0, 62, 142, 0.3);
            right: 5/@rem * 1rem;
        }

        /*定义滚动条轨道 内阴影+圆角*/
        ::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 2/@rem * 1rem rgba(0, 0, 0, 0.3);
            border-radius: 10/@rem * 1rem;
            background-color: rgba(0, 62, 142, 0.3);
        }

        /*定义滑块 内阴影+圆角*/
        ::-webkit-scrollbar-thumb {
            border-radius: 10/@rem * 1rem;
            -webkit-box-shadow: inset 0 0 6/@rem * 1rem rgba(0, 0, 0, .3);
            background-color: rgba(0, 150, 255, 0.8);
        }
    }

    .transition {
        transition: transform .5s linear;
    }
</style>
