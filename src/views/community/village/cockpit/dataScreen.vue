<template>
    <div class="data_screen" :style="{backgroundImage: 'url('+backImage+')'}">
        <div class="left_content">
            <div class="left_top_view">
                <div class="date_view">
                    <div class="time">
                        <div class="top">{{nowTime}}</div>
                        <div class="bottom">{{nowDate}}</div>
                    </div>
                    <div class="week">
                        {{nowWeek}}
                    </div>
                </div>
                <div class="weather_view" v-if="baseConfig.weatherInfo">
                    <div class="temperature">
                        {{baseConfig.weatherInfo.temperature_str}}
                    </div>
                    <div class="air_quality">
                        <div class="top">PM2.5</div>
                        <div class="bottom">{{baseConfig.weatherInfo.pm25}}
                            <img style="width: 7px;height: 12px; margin-left: 3px;" src="https://hf.pigcms.com/static/wxapp/cockpitScreen/decline_arrow.png">
                        </div>
                    </div>
                </div>
            </div>
            <div class="left_box_item" v-for="(item,index) in leftNavList" :key="index" :style="{height: item.height}">
                <div class="item_title" style="color: #34A5EE;" :style="{backgroundImage: 'url('+item.titleBack+')', width: item.titleWidth+'px', height: item.titleHeight+'px'}">{{item.title}}</div>
                <div class="item_content">
                    <component :is="item.component" :params="item.paramObj"></component>
                </div>
            </div>
        </div>
        <div class="middle_content">
            <div class="middle_top">
                <div class="top_title">{{baseConfig.screentitle}}</div>
                <div class="top_icon">
                    <div class="top_icon_item" v-for="(item, index) in 13" :key="index">
                        <img src="https://hf.pigcms.com/static/wxapp/cockpitScreen/nav_item_same.png" alt="">
                    </div>
                </div>
            </div>
            <div class="main_view">
                
            </div>
            <div class="moddle_bottom">
                <div class="nav_list">
                    <div class="nav_item" v-for="(item, index) in bottomimg" :key="index">
                        <div class="item_icon">
                            <img :src="item.icon" alt="">
                        </div>
                        <div class="item_title">{{item.title}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right_content">
            <div class="right_top_view" >
                <div class="search_view" style="display: flex;align-items: center;position: relative;" @mouseover="showInput">
                    <input @mouseout="hideInput" v-show="showThis" type="text" style="width: 150px;height: 27px; border: 1px solid #44FFFF;border-radius: 3px;outline: none;background-color: transparent;color: #fff;">
                    <img style="width: 20px;height: 20px;cursor: pointer;position: absolute;right: 10px;" src="https://hf.pigcms.com/static/wxapp/cockpitScreen/search_icon.png">
                </div>
                <div class="user_choose">
                    <img style="width: 15px;height: 15px;" src="https://hf.pigcms.com/static/wxapp/cockpitScreen/user_icon.png">
                    <div style="margin-left: 7px;">{{baseConfig.user_name}}</div>
                </div>
            </div>
            <div class="right_box_item" v-for="(item,index) in rightNavList" :key="index" :style="{height: item.height}">
                <div class="item_title" style="color: #44FFFF;" :style="{backgroundImage: 'url('+item.titleBack+')', width: item.titleWidth+'px', height: item.titleHeight+'px'}">{{item.title}}</div>
                <div class="item_content">
                    <component :is="item.component" :params="item.paramObj"></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import communityProfile from "../../components/screen/communityProfile.vue";
    import communitySecurity from "../../components/screen/communitySecurity.vue";
    import communityFireProtection from "../../components/screen/communityFireProtection.vue";
    import healthCare from "../../components/screen/healthCare.vue";
    import communityEnvironment from "../../components/screen/communityEnvironment.vue";
    import eventList from "../../components/screen/eventList.vue";
    import IOTSensingEquipment from "../../components/screen/IOTSensingEquipment.vue";
    import videoSurveillance from "../../components/screen/videoSurveillance.vue";
    import communityAnnouncement from "../../components/screen/communityAnnouncement.vue";
    export default{
        data(){
            return{
                leftNavList: [
                    {component: 'communityProfile', height: '20vh', title: '社区概况', titleBack: 'https://hf.pigcms.com/static/wxapp/cockpitScreen/title_back_img_1.png', titleWidth: 120, titleHeight: 32, paramObj:{}},
                    {component: 'communitySecurity', height: '20vh', title: '社区安防', titleBack: 'https://hf.pigcms.com/static/wxapp/cockpitScreen/title_back_img_1.png', titleWidth: 120, titleHeight: 32, paramObj:{}},
                    {component: 'communityFireProtection', height: '17.5vh', title: '社区安防', titleBack: 'https://hf.pigcms.com/static/wxapp/cockpitScreen/title_back_img_1.png', titleWidth: 120, titleHeight: 32, paramObj:{}},
                    {component: 'healthCare', height: '20vh', title: '健康养老', titleBack: 'https://hf.pigcms.com/static/wxapp/cockpitScreen/title_back_img_1.png', titleWidth: 120, titleHeight: 32, paramObj:{}},
                    {component: 'communityEnvironment', height: '15vh', title: '社区环境', titleBack: 'https://hf.pigcms.com/static/wxapp/cockpitScreen/title_back_img_1.png', titleWidth: 120, titleHeight: 32, paramObj:{}},
                ],
                rightNavList: [
                    {component: 'eventList', height: '27.5vh', title: '事件列表', titleBack: 'https://hf.pigcms.com/static/wxapp/cockpitScreen/title_back_img_2.png', titleWidth: 120, titleHeight: 32, paramObj:{}},
                    {component: 'IOTSensingEquipment', height: '17.5vh', title: '物联感知设备', titleBack: 'https://hf.pigcms.com/static/wxapp/cockpitScreen/title_back_img_3.png', titleWidth: 150, titleHeight: 32, paramObj:{}},
                    {component: 'videoSurveillance', height: '30vh', title: '健康养老', titleBack: 'https://hf.pigcms.com/static/wxapp/cockpitScreen/title_back_img_2.png', titleWidth: 120, titleHeight: 32, paramObj:{}},
                    {component: 'communityAnnouncement', height: '17.5vh', title: '社区公告', titleBack: 'https://hf.pigcms.com/static/wxapp/cockpitScreen/title_back_img_2.png', titleWidth: 120, titleHeight: 32, paramObj:{}},
                ],
                navList:[{icon: '', title: '总览'},
                        {icon: '', title: '智慧安防'},
                        {icon: '', title: '智慧消防'},
                        {icon: '', title: '环境监测'},
                        {icon: '', title: '智慧物业'},
                        {icon: '', title: '智慧养老'},
                        {icon: '', title: '智慧健康'},
                        {icon: '', title: 'AR实验'}],
                nowDate: '',
                nowTime: '',
                nowWeek: '',
                baseConfig: {},
                bottomimg: [],
                backImage: '',
                showThis: false
            }
        },
        
        components: {
            communityProfile,
            communitySecurity,
            communityFireProtection,
            healthCare,
            communityEnvironment,
            eventList,
            IOTSensingEquipment,
            videoSurveillance,
            communityAnnouncement
        },
        
        mounted() {
          this.getTime()
          this.getIndex()
        },
        
        beforeDestroy() {
          clearInterval(this.interval)
          this.interval = null
        },
        
        methods: {
            getTime(){
                let that = this
                that.interval = setInterval(()=>{
                    that.formData(new Date())
                }, 1000)
            },
            
            showInput(){
                this.showThis = true
                console.log("showInput===>", this.showThis)
            },
            
            hideInput(){
                this.showThis = false
                console.log("hideInput===>", this.showThis)
            },
            
            getIndex(){
                this.request('/community/village_api.SkyCockpitInfo/getCockpitDatas', {}, 'post').then(res => {
                    this.baseConfig = res.baseinfo
                    this.bottomimg = res.bottomimg
                    this.backImage = res.baseinfo.bg_img
                    this.leftNavList[0].title = res.info1data.navtitle
                    this.leftNavList[0]['paramObj'] = {
                        nav_list: res.info1data.nav_list,
                    }
                    this.leftNavList[1].title = res.info2data.navtitle
                    this.leftNavList[1]['paramObj'] = {
                        nav_list: res.info2data.nav_list,
                        links: res.info2data.links,
                        tj_list: res.info2data.tj_list,
                        tj_title: res.info2data.tj_title,
                    }
                    this.leftNavList[2].title = res.info3data.navtitle
                    this.leftNavList[2]['paramObj'] = {
                        nav_list: res.info3data.nav_list,
                        chart_title: res.info3data.chart_title,
                        chart_x: res.info3data.chart_x,
                        chart_y: res.info3data.chart_y,
                        tj_title: res.info3data.tj_title,
                    }
                    this.leftNavList[3].title = res.info4data.navtitle
                    this.leftNavList[3]['paramObj'] = {
                        nav_list: res.info4data.nav_list,
                        chart_title: res.info4data.chart_title,
                        chart_x: res.info4data.chart_x,
                        chart_y: res.info4data.chart_y,
                        tj_title: res.info4data.tj_title,
                        tj_list: res.info4data.tj_list,
                        color_list: res.info4data.color_list
                    }
                    this.leftNavList[4].title = res.info5data.navtitle
                    this.leftNavList[4]['paramObj'] = {
                        nav_list: res.info5data.nav_list,
                        tj_list: res.info5data.tj_list,
                        tj_title: res.info5data.tj_title
                    }
                    this.rightNavList[0].title = res.info6data.navtitle
                    this.rightNavList[0]['paramObj'] = {
                        nav_list: res.info6data.nav_list,
                        tj_list: res.info6data.tj_list,
                        nav_left: res.info6data.nav_left
                    }
                    this.rightNavList[1].title = res.info7data.navtitle
                    this.rightNavList[1]['paramObj'] = {
                        nav_list: res.info7data.nav_list
                    }
                    this.rightNavList[2].title = res.info8data.navtitle
                    this.rightNavList[2]['paramObj'] = {
                        nav_list: res.info8data.nav_list,
                        v_list: res.info8data.v_list,
                        faceimg_list: res.info8data.faceimg_list
                    }
                    this.rightNavList[3].title = res.info9data.navtitle
                    this.rightNavList[3]['paramObj'] = {
                        nav_list: res.info9data.nav_list
                    }
                }).catch(e=>{
                })
            },
            
            formData(date){
                let Y = date.getFullYear() + ".";
                let M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + ".";
                let D = date.getDate();
                let h = date.getHours() + ":";
                let m = (date.getMinutes() < 10 ? "0" + (date.getMinutes()) : date.getMinutes())+':';
                let s = (date.getSeconds() < 10 ? "0" + (date.getSeconds()) : date.getSeconds());
                let week = date.getDay();
                let weeks = ["日","一","二","三","四","五","六"];
                this.nowDate = Y + M + D;
                this.nowTime = h + m + s;
                this.nowWeek = "星期" + weeks[week];
            }
        },
    }
</script>

<style lang="less" scoped>
    .data_screen{
        width: 100vw;
        height: 100vh;
        background-image: url('https://hf.pigcms.com/static/wxapp/images/builds_back_img.jpg');
        background-size: 100% 100%;
        display: flex;
        .left_content{
            width: 25%;
            height: 100%;
            .left_top_view{
                width: 100%;
                height: 7.5vh;
                background-color: rgba(4, 54, 125, .8);
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: #ffffff;
                .date_view{
                    display: flex;
                    align-items: center;
                    margin-left: 20px;
                    .time{
                        .top{
                            font-size: 14px;
                            text-align: right;
                        }
                        .bottom{
                            font-size: 12px;
                            text-align: right;
                        }
                    }
                    .week{
                        font-size: 16px;
                        margin-left: 7px;
                    }
                }
                .weather_view{
                    display: flex;
                    align-items: center;
                    margin-right: 50px;
                    .temperature{
                        font-size: 16px;
                        margin-right: 7px;
                    }
                    .air_quality{
                        .top{
                            font-size: 14px;
                        }
                        .bottom{
                            font-size: 12px;
                            display: flex;
                            align-items: center;
                        }
                    }
                }
            }
            
            .left_box_item{
                width: 100%;
                background-color: rgba(4, 54, 125, .3);
                
                .item_title{
                    margin-left: 13px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    background-size: 100% 100%;
                    font-size: 14px;
                    line-height: 14px;
                }
                .item_content{
                    height: calc(100% - 32px);
                    width: 100%;
                }
            }
        }
        .middle_content{
            width: 50%;
            height: 100%;
            .middle_top{
                width: 100%;
                height: 25%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                .top_title{
                    background-image: url('https://hf.pigcms.com/static/wxapp/cockpitScreen/title_back.png');
                    background-size: 100% 100%;
                    width: 240px;
                    height: 50px;
                    font-size: 20px;
                    color: #ffffff;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .top_icon{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 10px;
                    .top_icon_item{
                        width: 35px;
                        height: 30px;
                        background-color: rgba(4, 54, 125, .5);
                        margin: 5px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        img{
                            width: 35px;
                            height: 30px;
                        }
                    }
                }
            }
            .main_view{
                width: 100%;
                height: 60%;
            }
            .moddle_bottom{
                width: 100%;
                height: 15%;
                display: flex;
                align-items: center;
                justify-content: center;
                .nav_list{
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    transform: translateY(-20px);
                    height: 100px;
                    width: 100%;
                    .nav_item{
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        margin: 0 5px;
                        cursor: pointer;
                        flex-shrink: 0;
                        &:hover{
                            .item_icon{
                                flex-shrink: 0;
                                width: 46px;
                                height: 50px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                img{
                                    width: 46px;
                                    height: 50px;
                                }
                            }
                            .item_title{
                                flex-shrink: 0;
                                margin-top: 5px;
                                font-size: 14px;
                                color: rgb(251, 255, 255);
                            }
                        }
                        .item_icon{
                            flex-shrink: 0;
                            width: 37px;
                            height: 42px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            img{
                                width: 37px;
                                height: 42px;
                            }
                        }
                        .item_title{
                            flex-shrink: 0;
                            font-size: 12px;
                            color: rgb(158, 166, 179);
                            margin-top: 5px;
                        }
                    }
                }
            }
        }
        .right_content{
            width: 25%;
            height: 100%;
            .right_top_view{
                width: 100%;
                height: 7.5vh;
                background-color: rgba(4, 54, 125, .8);
                display: flex;
                align-items: center;
                justify-content: center;
                .search_view{
                    
                }
                .user_choose{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 14px;
                    font-weight: bold;
                    margin-left: 20px;
                }
            }
            
            .right_box_item{
                width: 100%;
                background-color: rgba(4, 54, 125, .3);
                .item_title{
                    margin-left: 13px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 14px;
                    line-height: 14px;
                    background-size: 100% 100%;
                }
                .item_content{
                    height: calc(100% - 32px);
                    width: 100%;
                }
            }
        }
    }
</style>