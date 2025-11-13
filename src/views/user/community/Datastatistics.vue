<template>
    <div class="bg-box">
        <!-- top -->
        <big-img v-if="showImg" :imgSrc="imgSrc" @clickit="clickit"></big-img>
        <div class="top-box">
            <img :src="village_logo" class="logo-img" />
            <div class="title">{{ village_name }}</div>
            <img
                v-if="showSwidth"
                @click="swichLeft"
                class="switchBtn"
                style="left: 62px"
                src="https://hf.pigcms.com/static/wxapp/cockpitScreen/switch_icon.png"
                alt=""
            />
            <img
                v-if="$store.getters.config.jz_open"
                @click="showSexAge = !showSexAge"
                class="switchBtn"
                src="../../../assets/communityimg/cockpit_switch.png"
                alt=""
            />
        </div>
        <!-- container -->
        <div class="container">
            <div class="flex_1" v-show="changeLeft">
                <div class="flex_left_1">
                    <div class="left_box_1">
                        <img src="../../../assets/images/border_1.png" class="border_1" alt="" />
                        <img src="../../../assets/images/border_2.png" class="border_2" alt="" />
                        <img src="../../../assets/images/border_3.png" class="border_3" alt="" />
                        <img src="../../../assets/images/border_4.png" class="border_4" alt="" />
                        <div class="top_title_box">
                            <img src="../../../assets/images/left_icon.png" alt="" />
                            <div class="mini_title" v-if="$store.getters.config">
                                {{ $store.getters.config.house_name }}人口
                            </div>
                            <img src="../../../assets/images/right_icon.png" alt="" />
                        </div>
                        <div class="mini_box_1">
                            <div class="mini_box" title="真实业主+家属+租客的总和">
                                <div class="text_1">总人口</div>
                                <div class="text_1 font_20">{{ msg1.all_population }}</div>
                            </div>
                            <div class="mini_box" title="真实业主+家属的总和">
                                <div class="text_1">业主</div>
                                <div class="text_1 font_20">{{ msg1.owner_count }}</div>
                            </div>
                            <div class="mini_box">
                                <div class="text_1">租客</div>
                                <div class="text_1 font_20">{{ msg1.tenant_count }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="left_box_1">
                        <img src="../../../assets/images/border_1.png" class="border_1" alt="" />
                        <img src="../../../assets/images/border_2.png" class="border_2" alt="" />
                        <img src="../../../assets/images/border_3.png" class="border_3" alt="" />
                        <img src="../../../assets/images/border_4.png" class="border_4" alt="" />
                        <div class="top_title_box">
                            <img src="../../../assets/images/left_icon.png" alt="" />
                            <div class="mini_title">今日人流量</div>
                            <img src="../../../assets/images/right_icon.png" alt="" />
                        </div>
                        <div class="mini_box_9" v-if="msg7.today_open_count >= 0">
                            <div class="mini_box6">
                                <div class="pulse1">
                                    <img src="../../../assets/images/1_icon.png" alt="" />
                                </div>
                            </div>
                            <div class="mini_box7">
                                <div class="text_8">今日开门</div>
                                <div class="text_9">{{ msg7.today_open_count }}</div>
                            </div>
                        </div>
                        <div class="tip_text_box" v-else>
                            <div
                                class="tip_text"
                                style="text-align: center; margin-top: 5%; font-size: 14px; color: #179ee3"
                            >
                                该套餐不包含此功能
                            </div>
                        </div>
                    </div>
                    <div class="left_box_2">
                        <img src="../../../assets/images/border_1.png" class="border_1" alt="" />
                        <img src="../../../assets/images/border_2.png" class="border_2" alt="" />
                        <img src="../../../assets/images/border_3.png" class="border_3" alt="" />
                        <img src="../../../assets/images/border_4.png" class="border_4" alt="" />
                        <div class="top_title_box">
                            <img src="../../../assets/images/left_icon.png" alt="" />
                            <div class="mini_title">{{ showSexAge ? '男女比例统计' : '房屋数据' }}</div>
                            <img src="../../../assets/images/right_icon.png" alt="" />
                        </div>
                        <div class="mini_box_2" v-show="!showSexAge">
                            <div id="main" style="width: 100%; height: 100%"></div>
                        </div>
                        <div class="mini_box_2" v-show="showSexAge">
                            <genderRatio />
                        </div>
                    </div>
                    <div class="left_box_2">
                        <img src="../../../assets/images/border_1.png" class="border_1" alt="" />
                        <img src="../../../assets/images/border_2.png" class="border_2" alt="" />
                        <img src="../../../assets/images/border_3.png" class="border_3" alt="" />
                        <img src="../../../assets/images/border_4.png" class="border_4" alt="" />
                        <div class="top_title_box">
                            <img src="../../../assets/images/left_icon.png" alt="" />
                            <div class="mini_title">{{ showSexAge ? '年龄段统计' : '今日车流量' }}</div>
                            <img src="../../../assets/images/right_icon.png" alt="" />
                        </div>
                        <div class="mini_box_10" v-if="msg8.inCount >= 0 && !showSexAge">
                            <div class="mini_box8">
                                <div class="pulse_box">
                                    <div class="pulse1">
                                        <img src="../../../assets/images/2_icon.png" alt="" />
                                    </div>
                                </div>
                                <div class="text_box">
                                    <div class="text_10">今日进场</div>
                                    <div class="text_11">{{ msg8.inCount }}</div>
                                </div>
                            </div>
                            <div class="mini_box9">
                                <div class="pulse_box">
                                    <div class="pulse1">
                                        <img src="../../../assets/images/3_icon.png" alt="" />
                                    </div>
                                </div>
                                <div class="text_box">
                                    <div class="text_10">今日出场</div>
                                    <div class="text_11">{{ msg8.outCount }}</div>
                                </div>
                            </div>
                        </div>

                        <div class="mini_box_10" v-show="showSexAge">
                            <ageRatio />
                        </div>

                        <div class="tip_text_box" v-if="msg8.inCount == 0 && !showSexAge">
                            <div
                                class="tip_text"
                                style="text-align: center; margin-top: 5%; font-size: 14px; color: #179ee3"
                            >
                                该套餐不包含此功能
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex_left_2">
                    <img src="../../../assets/images/border_1.png" class="border_1" alt="" />
                    <img src="../../../assets/images/border_2.png" class="border_2" alt="" />
                    <img src="../../../assets/images/border_3.png" class="border_3" alt="" />
                    <img src="../../../assets/images/border_4.png" class="border_4" alt="" />
                    <div class="top_title_box">
                        <img src="../../../assets/images/left_icon.png" alt="" />
                        <div
                            class="mini_title"
                            :title="
                                '1.总车位为实际车位数；2.已用车位为进入' +
                                $store.getters.config.house_name +
                                '的车辆数；3.存在一位多车故已用车位可能大于总车位'
                            "
                        >
                            {{ showSexAge ? '用户标签统计' : '车场数据' }}
                        </div>
                        <img src="../../../assets/images/right_icon.png" alt="" />
                    </div>

                    <div class="mini_box_3" v-show="!showSexAge">
                        <!-- show time -->

                        <div class="left_mini_box">
                            <!--<div id="main1" style="width: 100%;height:100%;" ></div>-->
                            <div class="mini_box_left_2">
                                <div class="mini-info-line">
                                    <div>总车位</div>
                                    <div class="text_line1">{{ msg8.positionCount }}</div>
                                </div>
                                <div class="mini-info info_left">
                                    <div class="text_2">已用车位</div>
                                    <div class="text_3">{{ msg8.usedCount }}</div>
                                </div>
                                <div class="mini-info">
                                    <div class="text_2">剩余车位</div>
                                    <div class="text_3">{{ msg8.remain }}</div>
                                </div>
                                <div class="mini-info info_left">
                                    <div class="text_2">今日临停收费</div>
                                    <div class="text_3">¥ {{ msg8.temporaryMoney }}</div>
                                </div>
                                <div class="mini-info">
                                    <div class="text_2">本月累计临停收费</div>
                                    <div class="text_3">¥ {{ msg8.parkCount }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="line"></div>
                        <div class="right_mini_box">
                            <!-- <div id="main2" style="width: 100%;height:100%;"></div> -->
                            <carList />
                        </div>
                    </div>

                    <div class="mini_box_33" v-show="showSexAge">
                        <userOrder />
                    </div>
                </div>

                <div class="flex_left_3">
                    <div class="left_box_3">
                        <img src="../../../assets/images/border_1.png" class="border_1" alt="" />
                        <img src="../../../assets/images/border_2.png" class="border_2" alt="" />
                        <img src="../../../assets/images/border_3.png" class="border_3" alt="" />
                        <img src="../../../assets/images/border_4.png" class="border_4" alt="" />
                        <div class="top_title_box">
                            <img src="../../../assets/images/left_icon.png" alt="" />
                            <div class="mini_title">工单处理数据</div>
                            <img src="../../../assets/images/right_icon.png" alt="" />
                        </div>
                        <div class="mini_box_4" v-if="hideshow">
                            <div class="left_mini_box_1">
                                <div id="main3" style="width: 100%; height: 100%"></div>
                            </div>
                            <div class="right_mini_box_1">
                                <div id="main4" style="width: 100%; height: 100%"></div>
                            </div>
                        </div>
                        <div class="tip_text_box" v-else>
                            <div
                                class="tip_text"
                                style="text-align: center; margin-top: 5%; font-size: 14px; color: #179ee3"
                            >
                                该套餐不包含此功能
                            </div>
                        </div>
                    </div>
                    <div class="left_box_4">
                        <img src="../../../assets/images/border_1.png" class="border_1" alt="" />
                        <img src="../../../assets/images/border_2.png" class="border_2" alt="" />
                        <img src="../../../assets/images/border_3.png" class="border_3" alt="" />
                        <img src="../../../assets/images/border_4.png" class="border_4" alt="" />
                        <div class="top_title_box">
                            <img src="../../../assets/images/left_icon.png" alt="" />
                            <div class="mini_title">巡检数据</div>
                            <img src="../../../assets/images/right_icon.png" alt="" />
                        </div>
                        <div v-if="msg6.patrol_show">
                            <div class="mini_box_5" v-if="!msg6_nodata">
                                <div class="right_mini_box_2" v-for="(item, index) in msg6.list">
                                    <div class="mini_box3">
                                        {{ item.cate_name }}
                                    </div>
                                    <div class="mini_box4" v-if="item.is_complete == 1">已完成</div>
                                    <div class="mini_box4" style="color: rgba(231, 57, 111, 1)" v-else>未完成</div>
                                </div>
                            </div>
                            <div class="tip_text_box" v-else>
                                <div class="tip_text">暂无数据</div>
                            </div>
                        </div>
                        <div class="tip_text_box" v-else>
                            <div
                                class="tip_text"
                                style="text-align: center; margin-top: 5%; font-size: 14px; color: #179ee3"
                            >
                                该套餐不包含此功能
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 左侧数据切换 -->
            <newLeftData v-if="!changeLeft" />

            <div class="flex_2">
                <div class="map">
                    <baidu-map
                        :center="center"
                        :zoom="zoom"
                        @ready="handler"
                        class="BMap"
                        style="width: 100%; height: 100%"
                    >
                        <bm-marker
                            v-for="(item, index) in msg10.list"
                            :position="'{lng:' + item.lng + ',lat:' + item.lat + '}'"
                            :dragging="false"
                            animation="BMAP_ANIMATION_BOUNCE"
                            :icon="{
                                url: 'http://shequ-demo.fastwhale.com.cn/static/images/map-icon-data.png',
                                size: { width: 300, height: 157 },
                            }"
                        ></bm-marker>
                    </baidu-map>
                    <div class="ceshi"></div>
                </div>
                <div class="flex_center_2">
                    <div
                        class="center_box_1"
                        style="cursor: pointer"
                        @click="goUrl(item.url)"
                        v-for="(item, index) in msg4"
                    >
                        <img :src="item.img" alt="" class="center_img" />
                        <div class="center_title">{{ item.name }}</div>
                    </div>
                </div>
                <div class="flex_center_3">
                    <img src="../../../assets/images/border_1.png" class="border_1" alt="" />
                    <img src="../../../assets/images/border_2.png" class="border_2" alt="" />
                    <img src="../../../assets/images/border_3.png" class="border_3" alt="" />
                    <img src="../../../assets/images/border_4.png" class="border_4" alt="" />
                    <div class="top_title_box">
                        <img src="../../../assets/images/left_icon.png" alt="" />
                        <div class="mini_title">人脸门禁实时记录</div>
                        <img src="../../../assets/images/right_icon.png" alt="" />
                    </div>
                    <div v-if="this.msg9.machine_show">
                        <div class="center_box_2" v-if="!msg9_nodata">
                            <div class="table-scroll">
                                <div class="table-flex_body" v-for="(item, index) in msg9.list">
                                    <div v-if="items.type == 1" class="text_6" v-for="(items, indexs) in item">
                                        <img
                                            @click="previewImage(items.title)"
                                            :src="items.title"
                                            style="width: 30px; height: 30px; display: inline-block"
                                            alt=""
                                        />
                                    </div>
                                    <div v-if="items.type == 0" class="text_6" v-for="(items, indexs) in item">
                                        {{ items.title ? items.title : '暂无数据' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tip_text_box" v-else>
                            <div class="tip_text">暂无人脸门禁开门记录</div>
                        </div>
                    </div>
                    <div class="tip_text_box" v-else>
                        <div
                            class="tip_text"
                            style="text-align: center; margin-top: 5%; font-size: 14px; color: #179ee3"
                        >
                            该套餐不包含此功能
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex_3">
                <div class="flex_right_1">
                    <img src="../../../assets/images/border_1.png" class="border_1" alt="" />
                    <img src="../../../assets/images/border_2.png" class="border_2" alt="" />
                    <img src="../../../assets/images/border_3.png" class="border_3" alt="" />
                    <img src="../../../assets/images/border_4.png" class="border_4" alt="" />
                    <div class="top_title_box">
                        <img src="../../../assets/images/left_icon.png" alt="" />
                        <div class="mini_title">设备管理</div>
                        <img src="../../../assets/images/right_icon.png" alt="" />
                    </div>
                    <div class="right_box_2">
                        <div class="mini_box_6" v-if="machine_show">
                            <div class="mini_box5">
                                <div id="main5" style="width: 100%; height: 100%"></div>
                            </div>
                            <div class="mini_box5">
                                <div id="main6" style="width: 100%; height: 100%"></div>
                            </div>
                            <div class="mini_box5">
                                <div id="main7" style="width: 100%; height: 100%"></div>
                            </div>
                        </div>
                        <div class="mini_box_7" v-if="msg7.list && msg7.list.length > 0">
                            <div class="table-right">
                                <div class="table-scroll_right">
                                    <div class="table-flex_body_right" v-for="(item, index) in msg7.list">
                                        <div class="text_7" v-for="(items, indexs) in item">{{ items.title }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tip_text_box" v-else>
                            <div
                                class="tip_text"
                                style="text-align: center; margin-top: 5%; font-size: 14px; color: #179ee3"
                            >
                                该套餐不包含此功能
                            </div>
                        </div>
                    </div>
                    <div class="right_box_3" v-if="msg7.list && msg7.list.length > 0">
                        设备总数：{{ msg7.device_total }}
                    </div>
                </div>
                <div class="flex_right_2">
                    <img src="../../../assets/images/border_1.png" class="border_1" alt="" />
                    <img src="../../../assets/images/border_2.png" class="border_2" alt="" />
                    <img src="../../../assets/images/border_3.png" class="border_3" alt="" />
                    <img src="../../../assets/images/border_4.png" class="border_4" alt="" />
                    <div class="top_title_box">
                        <img src="../../../assets/images/left_icon.png" alt="" />
                        <div class="mini_title">收费统计</div>
                        <img src="../../../assets/images/right_icon.png" alt="" />
                    </div>
                    <div class="right_box_4" v-if="money_show">
                        <div id="main8" style="width: 100%; height: 100%"></div>
                    </div>
                    <div class="tip_text_box" v-else>
                        <div
                            class="tip_text"
                            style="text-align: center; margin-top: 5%; font-size: 14px; color: #179ee3"
                        >
                            该套餐不包含此功能
                        </div>
                    </div>
                </div>
                <div class="flex_right_3">
                    <img src="../../../assets/images/border_1.png" class="border_1" alt="" />
                    <img src="../../../assets/images/border_2.png" class="border_2" alt="" />
                    <img src="../../../assets/images/border_3.png" class="border_3" alt="" />
                    <img src="../../../assets/images/border_4.png" class="border_4" alt="" />
                    <div class="top_title_box">
                        <img src="../../../assets/images/left_icon.png" alt="" />
                        <div class="mini_title">事项列表</div>
                        <img src="../../../assets/images/right_icon.png" alt="" />
                    </div>
                    <div class="right_box_5">
                        <div class="mini_box_8">
                            <div class="right_mini_box_2" v-for="(item, index) in msg3.front">
                                <div class="mini_box3">
                                    {{ item.name }}
                                </div>
                                <div class="mini_box4">
                                    {{ item.num }}
                                </div>
                            </div>
                        </div>
                        <div class="line"></div>
                        <div class="mini_box_8">
                            <div class="right_mini_box_2" v-for="(item, index) in msg3.end">
                                <div class="mini_box3">
                                    {{ item.name }}
                                </div>
                                <div class="mini_box4">
                                    {{ item.num }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts' //引入echarts
import 'echarts-liquidfill/src/liquidFill.js'
import datastatisticsApi from '@/api/community/datastatistics'
import BigImg from './BigImg.vue'
import Rem from '../../../utils/rem.js'
import newLeftData from './newLeftData.vue'
import genderRatio from './components/genderRatio.vue'
import ageRatio from './components/ageRatio.vue'
import userOrder from './components/userOrder.vue'
import carList from './components/carList.vue'
Rem.getrem()
export default {
    // name: '大数据',
    data() {
        return {
            columns: [],
            msg1: {},
            msg2: {},
            msg3: {},
            msg4: [],
            msg5: {},
            msg6: [],
            msg6_nodata: false,
            msg7: {},
            msg8: {},
            msg9: {},
            msgDong: {},
            msg9_nodata: false,
            msg10: {},
            msg11: {},
            center: {
                lng: 0,
                lat: 0,
            },
            zoom: 20,
            points: [],
            markerPoint: {},
            village_name: '',
            village_logo: '',
            hideshow: true,
            money_show: true,
            machine_show: true,
            showImg: false,
            imgSrc: '',
            changeLeft: true,
            showSwidth: false,
            interval1: null,
            interval2: null,
            interval3: null,
            interval5: null,
            interval6: null,
            interval7: null,
            interval8: null,
            interval9: null,

            showSexAge: false,
        }
    },
    components: {
        BigImg,
        newLeftData,
        genderRatio,
        ageRatio,
        userOrder,
        carList,
    },
    mounted() {
        this.getData()
        this.getInfo1()
        this.getInfo2()
        this.getInfo3()
        this.getInfo4()
        this.getInfo5()
        this.getInfo6()
        this.getInfo7()
        this.getInfo8()
        this.getInfo9()
        this.getInfo10()
        this.getInfo11()
        this.getConfig()
        this.getInfoDong()
        // 小区人口
        this.interval1 = setInterval(() => {
            this.getInfo1()
        }, 1 * 60 * 1000)
        // 今日人流量&设备管理
        this.interval7 = setInterval(() => {
            this.getInfo7()
        }, 3 * 60 * 1000)
        //房屋数据&今日车流量&车场数据
        this.interval8 = setInterval(() => {
            this.getInfo8()
            // this.getInfoDong()
        }, 6 * 60 * 1000)
        //工单处理数据
        this.interval2 = setInterval(() => {
            this.getInfo2()
        }, 3 * 60 * 1000)
        //巡检数据
        this.interval6 = setInterval(() => {
            this.getInfo6()
        }, 3 * 60 * 1000)
        //收费统计
        this.interval5 = setInterval(() => {
            this.getInfo5()
        }, 3 * 60 * 1000)
        //事项列表
        this.interval3 = setInterval(() => {
            this.getInfo3()
        }, 3 * 60 * 1000)
        //人脸门禁实时记录&开门地图定位
        this.interval9 = setInterval(() => {
            this.getInfo9()
            this.getInfo10()
        }, 1 * 60 * 1000)
    },
    beforeDestroy() {
        clearInterval(this.interval1)
        clearInterval(this.interval7)
        clearInterval(this.interval8)
        clearInterval(this.interval2)
        clearInterval(this.interval6)
        clearInterval(this.interval5)
        clearInterval(this.interval3)
        clearInterval(this.interval9)
        this.interval1 = null
        this.interval7 = null
        this.interval8 = null
        this.interval2 = null
        this.interval6 = null
        this.interval5 = null
        this.interval3 = null
        this.interval9 = null
    },
    methods: {
        swichLeft() {
            this.changeLeft = !this.changeLeft
        },

        getData() {
            let that = this
            this.request('/community/village_api.DataStatistics/getD7ParkCount', {}).then((res) => {
                if (res.length == 0) {
                    that.showSwidth = false
                } else {
                    that.showSwidth = true
                }
            })
        },
        getConfig() {
            const config = this.$store.getters.config
            if (config) {
                this.config = config
                if (!this.village_logo && this.config.system_admin_logo) {
                    this.village_logo = this.config.system_admin_logo
                }
                console.log('this.config', this.config)
                console.log('this.village_logo', this.village_logo)
            } else {
                setTimeout(() => {
                    this.getConfig()
                }, 300)
            }
        },
        handler({ BMap, map }) {
            // console.log(BMap, map)
            // this.getInfo10()
            // console.log('--------------', this.msg10)
            // this.center['lng'] = this.msg10.info.long
            // this.center['lat'] = this.msg10.info.lat
            // this.markerPoint['lng'] = this.msg10.info.long
            // this.markerPoint['lat'] = this.msg10.info.lat
            // this.zoom = 15
        },

        goUrl(url) {
            if (url == '') {
                let msgs = '该套餐不包含此功能'
                this.openNotificationWithIcon(msgs)
                return false
            } else if (url == 1) {
                return false
            }
            window.open(url)
        },
        openNotificationWithIcon(msgs) {
            this.$notification.open({
                message: '提示',
                description: msgs,
            })
        },
        //房间和住户的数量1
        getInfo1() {
            this.request(datastatisticsApi.villagePopulation).then((res) => {
                console.log('+++++++', res)
                if (res) {
                    this.msg1 = res
                    console.log('this.msg', this.msg1)
                    this.myEcharts()
                }
            })
        },
        //工单数据处理2
        getInfo2() {
            this.request(datastatisticsApi.workOrder).then((res) => {
                console.log('+++++++', res)
                if (res && res.hasOwnProperty('all_count')) {
                    this.msg2 = res
                    console.log('this.msg1324131231231', this.msg2)
                    this.hideshow = true
                    this.myEcharts3()
                    this.myEcharts4()
                } else {
                    this.hideshow = false
                }
            })
        },
        //事项列表3
        getInfo3() {
            this.request(datastatisticsApi.itemsLists).then((res) => {
                console.log('+++++++', res)
                if (res) {
                    this.msg3 = res
                    console.log('this.msg', this.msg3)
                }
            })
        },
        //中间菜单4
        getInfo4() {
            this.request(datastatisticsApi.menuLists).then((res) => {
                console.log('+++++++', res)
                if (res) {
                    this.msg4 = res
                    console.log('this.msg', this.msg4)
                }
            })
        },
        //收费统计5
        getInfo5() {
            this.request(datastatisticsApi.chargeStatistics).then((res) => {
                console.log('+++++++', res)
                if (res && res.hasOwnProperty('total_money')) {
                    this.msg5 = res
                    console.log('this.msg', this.msg5)
                    this.money_show = true
                    this.myEcharts6()
                } else {
                    this.money_show = false
                }
            })
        },
        //巡检数据6
        getInfo6() {
            this.request(datastatisticsApi.inspectionData).then((res) => {
                console.log('+++++++', res)
                if (res) {
                    this.msg6 = res
                    if (res.list.length == 0) {
                        this.msg6_nodata = true
                    }
                    console.log('this.msg', this.msg6)
                }
            })
        },
        //今日人流量、设备管理7
        getInfo7() {
            this.request(datastatisticsApi.deviceStatistics).then((res) => {
                console.log('+++++++rererererererer', res)
                if (res) {
                    this.msg7 = res
                    console.log('this.msg', this.msg7)
                    this.myEcharts5()
                }
                if (res.hasOwnProperty('list') && res.list.length > 0) {
                    this.machine_show = true
                } else {
                    this.machine_show = false
                }
            })
        },
        //今日车流量，车场数据8
        getInfo8() {
            this.request(datastatisticsApi.carStatistics).then((res) => {
                console.log(res, '丢失的效果后')
                if (res) {
                    this.msg8 = res
                    console.log('this.msg', this.msg8)
                    //this.myEcharts1();
                    // this.myEcharts2();
                    this.myEcharts22()
                }
            })
        },
        //今日车流量，车场数据8
        getInfoDong() {
            this.request(datastatisticsApi.userNum).then((res) => {
                if (res) {
                    this.msgDong = res
                    this.myEchartsDong()
                }
            })
        },
        //人脸门禁实时记录9
        getInfo9() {
            this.request(datastatisticsApi.openDoorLog, {}).then((res) => {
                if (res) {
                    this.msg9 = res
                    if (res.list.length == 0) {
                        this.msg9_nodata = true
                    }
                    console.log('this.msg9', this.msg9)
                }
            })
        },
        //开门地图定位10
        getInfo10() {
            this.request(datastatisticsApi.openDoorLocation).then((res) => {
                console.log('+++++++', res)
                if (res) {
                    console.log('res+++++++++++++++++', res)
                    this.msg10 = res
                    this.center['lng'] = this.msg10.info.long
                    this.center['lat'] = this.msg10.info.lat
                }
            })
        },
        //标题
        getInfo11() {
            this.request(datastatisticsApi.config).then((res) => {
                console.log('+++++++', res)
                if (res) {
                    console.log('res+++++++++++++++++', res)
                    this.msg11 = res
                    document.title = this.msg11.config_site_name
                    this.village_name = this.msg11.village_info.village_name
                    document.title = this.village_name + '-可视化大数据'
                    if (!this.village_logo && res.system_admin_logo) {
                        this.village_logo = res.system_admin_logo
                    }
                }
            })
        },
        myEcharts() {
            // 基于准备好的dom，初始化echarts实例
            const myChart = this.$echarts.init(document.getElementById('main'))
            console.log('this.msg1', this.msg1)
            const data = [
                {
                    name: '住宅',
                    value: this.msg1.home_count,
                    rate: 12,
                    itemStyle: {
                        color: '#00f6ff',
                    },
                },
                {
                    name: '办公',
                    value: this.msg1.office_count,
                    rate: 20,
                    itemStyle: {
                        color: '#febe03',
                    },
                },
                {
                    name: '商铺',
                    value: this.msg1.shop_count,
                    rate: -40,
                    itemStyle: {
                        color: '#387cfa',
                    },
                },
                {
                    name: '空置',
                    value: this.msg1.no_use,
                    rate: -15,
                    itemStyle: {
                        color: '#e4007f',
                    },
                },
            ]
            const option = {
                title: {
                    text: '{header1|房屋总数}\n{text1|' + this.msg1.all_room + '}',
                    textAlign: 'left',
                    left: '5%',
                    top: '15%',
                    textStyle: {
                        color: '#00caff',
                        rich: {
                            header1: {
                                width: 130,
                                fontSize: 14,
                            },
                            text1: {
                                width: 130,
                                color: 'rgba(19, 241, 253, 1)',
                                fontSize: 24,
                                fontWeight: 700,
                                lineHeight: 40,
                            },
                        },
                    },
                },
                legend: {
                    // selectedMode: false, // 取消图例上的点击事件
                    type: 'plain',
                    icon: 'roundRect',
                    orient: 'horizontal',
                    width: 150,
                    left: '5%',
                    top: '60%',
                    align: 'left',
                    itemGap: 25,
                    itemWidth: 8, // 设置宽度
                    itemHeight: 2, // 设置高度
                    symbolKeepAspect: false,
                    textStyle: {
                        color: '#ffffff',
                        marginLeft: 15,
                        lineHeight: 0,
                        rich: {
                            name: {
                                verticalAlign: 'center',
                                align: 'left',
                                width: 50,
                                fontSize: 15,
                            },
                        },
                    },
                    data: data.map((item) => item.name),
                },
                series: [
                    {
                        name: '数量',
                        type: 'pie',
                        width: 120,
                        height: 120,
                        left: '46%',
                        top: '10%',
                        radius: ['50%', '80%'],
                        data: data,
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                                formatter: '{text|{c}}',
                                rich: {
                                    text: {
                                        align: 'center',
                                        verticalAlign: 'middle',
                                        padding: 0,
                                        fontSize: 20,
                                    },
                                },
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '12',
                                },
                            },
                        },
                        labelLine: {
                            normal: {
                                show: true,
                            },
                        },
                    },
                ],
            }
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option)
        },
        /*
    myEcharts1() {
      // 基于准备好的dom，初始化echarts实例
      const myChart1 = this.$echarts.init(document.getElementById('main1'));
      const data = [{
          name: '业主车位',
          value: this.msg8.ownerBindCount,
          rate: 12,
          itemStyle: {
            color: '#00f6ff',
            fontSize: 14,
          },
        },
        {
          name: '临时车位',
          value: this.msg8.temporaryCount,
          rate: 20,
          itemStyle: {
            color: '#febe03',
            fontSize: 14,
          },
        },
        {
          name: '已用车位',
          value: this.msg8.usedCount,
          rate: -40,
          itemStyle: {
            color: '#387cfa',
            fontSize: 14,
          },
        },
        {
          name: '剩余车位',
          value: this.msg8.remain,
          rate: -15,
          itemStyle: {
            color: '#e4007f',
            fontSize: 14,
          },
        },
      ]
      const option = {
        title: {
          text: '{header1|总车位}\n{text1|' + this.msg8.positionCount + '}',
          textAlign: 'left',
          left: '46%',
          top: '3%',
          textStyle: {
            color: '#00caff',
            rich: {
              header1: {
                width: 130,
                fontSize: 14,
                lineHeight: 40,
              },
              text1: {
                width: 130,
                color: 'rgba(19, 241, 253, 1)',
                fontSize: 27,
                fontWeight: 700,
                lineHeight: 40,
                textAlign: 'center',
              },
            }
          }
        },
        legend: {
          // selectedMode: false, // 取消图例上的点击事件
          type: 'plain',
          icon: 'circle',
          orient: 'vertical',
          width: 100,
          left: '10%',
          top: '55%',
          align: 'left',
          itemGap: 10,
          itemWidth: 8, // 设置宽度
          itemHeight: 8, // 设置高度
          symbolKeepAspect: false,
          textStyle: {
            color: 'rgba(159, 164, 185, 1)',
            rich: {
              name: {
                verticalAlign: 'right',
                align: 'left',
                width: 60,
                fontSize: 12
              },
            }
          },
          data: data.map(item => item.name),
        },
        series: [{
          name: '数量',
          type: 'pie',
          width: 120,
          height: 120,
          left: '5%',
          top: '2%',
          radius: ['42%', '75%'],
          data: data,
          label: {
            normal: {
              show: false,
              position: 'center',
              formatter: '{text|{c}}',
              rich: {
                text: {
                  align: 'center',
                  verticalAlign: 'middle',
                  padding: 0,
                  fontSize: 20
                },
              }
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '12'
              }
            }
          },
          labelLine: {
            normal: {
              show: true
            }
          }
        }]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart1.setOption(option);
    },
    */
        myEcharts22() {
            var myCharts = echarts.init(document.getElementById('main2'))
            var params = this.msg8.car_pay_info
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                legend: {
                    data: params.legend_data,
                    textStyle: {
                        color: '#fff',
                        fontSize: 12,
                    },
                },
                xAxis: [
                    {
                        type: 'category',
                        data: params.xAxis_data,
                        axisLabel: {
                            //x轴文字的配置
                            show: true,
                            rotate: 45, // 设置x轴标签旋转角度
                            textStyle: {
                                color: 'RGBA(255, 255, 255, 0.7)',
                            },
                        },
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: 'dashed',
                                color: 'RGBA(1, 100, 173, 0.7)',
                            },
                        },
                        axisLabel: {
                            //y轴文字的配置
                            textStyle: {
                                color: 'RGBA(255, 255, 255, 0.7)',
                                margin: 15,
                            },
                        },
                    },
                ],
                series: [
                    {
                        name: '月租车缴费金额',
                        type: 'bar',
                        barWidth: 10,
                        emphasis: {
                            focus: 'series',
                        },
                        data: params.series.monthlycar,
                        itemStyle: {
                            color: '#09b9ff',
                        },
                    },
                    {
                        name: '临时车缴费金额',
                        type: 'bar',
                        barWidth: 10,
                        emphasis: {
                            focus: 'series',
                        },
                        data: params.series.temporarycar,
                        itemStyle: {
                            color: '#07af0e',
                        },
                    },
                ],
            }
            myCharts.setOption(option)
        },

        myEcharts2() {
            // 基于准备好的dom，初始化echarts实例
            const myChart2 = this.$echarts.init(document.getElementById('main2'))
            const params = this.msg8.proportion
            const option = {
                series: [
                    {
                        type: 'liquidFill',
                        width: 40,
                        height: 40,
                        center: ['50%', '37%'],
                        data: [0.3, 0.3],
                        radius: '58%',
                        outline: {
                            show: false,
                        },
                        backgroundStyle: {
                            color: '#0350C1',
                        },
                        shape: 'path://M761 326.6L512 64 263 326.6c-137.2 144.8-137.2 380 0 524.8C331.6 923.8 421.8 960 512 960s180.4-36.2 249-108.6c137.4-144.8 137.4-380 0-524.8z',
                        label: {
                            normal: {
                                position: ['50%', '55%'],
                                formatter: params,
                                textStyle: {
                                    fontSize: 22,
                                    color: 'rgba(52,255,212,1)',
                                },
                            },
                        },
                    },
                ],
            }
            // 使用刚指定的配置项和数据显示图表。
            myChart2.setOption(option)
        },

        myEchartsDong() {
            // 基于准备好的dom，初始化echarts实例
            const myChartDong = this.$echarts.init(document.getElementById('main_Dong'))

            const params = this.msgDong

            const option = {
                tooltip: {
                    trigger: 'item',
                },

                xAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#4aa1d8',
                        },
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#4aa1d8',
                            width: 1,
                            type: 'solid',
                        },
                    },
                    axisLabel: {
                        color: '#4aa1d8',
                    },
                },
                yAxis: {
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            color: '#4aa1d8',
                        },
                    },
                    axisLabel: {
                        color: '#4aa1d8',
                    },
                    data: params.axis_label,
                },
                series: [],
            }
            params.series.forEach((item) => {
                option.series.push({
                    name: item.name,
                    data: item.data,
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true,
                    },
                    emphasis: {
                        focus: 'series',
                    },
                })
            })

            // 使用刚指定的配置项和数据显示图表。
            myChartDong.setOption(option)
        },

        myEcharts3() {
            // 基于准备好的dom，初始化echarts实例
            const myChart3 = this.$echarts.init(document.getElementById('main3'))
            const handred = this.msg2.all_count
            let point = this.msg2.favorable_comments_count
            let favorable_comments_rate = this.msg2.favorable_comments_rate

            const option = {
                title: {
                    text: '{header1|工单总数}\n{text1|' + this.msg2.all_count + '}',
                    textAlign: 'center',
                    left: '42%',
                    top: '10%',
                    textStyle: {
                        color: '#00caff',
                        rich: {
                            header1: {
                                fontSize: 14,
                            },
                            text1: {
                                width: 130,
                                fontSize: 16,
                                color: 'rgba(19, 241, 253, 1)',
                                fontWeight: 700,
                                lineHeight: 40,
                            },
                        },
                    },
                },
                tooltip: {
                    formatter: function (params) {
                        return params.percent + ' %'
                    },
                },
                series: [
                    {
                        name: 'circle',
                        type: 'pie',
                        left: '-16%',
                        top: '35%',
                        clockWise: false,
                        radius: ['46%', '56%'],

                        itemStyle: {
                            normal: {
                                label: {
                                    show: false,
                                },
                                labelLine: {
                                    show: false,
                                },
                            },
                        },
                        hoverAnimation: false,
                        data: [
                            {
                                value: favorable_comments_rate,
                                name: '占比',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'center',
                                        formatter: '{header1|好评率}\n{text|{c}}{text1|%}',
                                        rich: {
                                            header1: {
                                                align: 'center',
                                                verticalAlign: 'bottom',
                                                position: 'absolute',
                                                paddingTop: '15px',
                                                top: '10%',
                                                lineHeight: 20,
                                                fontSize: 13,
                                                color: 'rgba(255, 255, 255, 0.9)',
                                            },
                                            text: {
                                                align: 'center',
                                                verticalAlign: 'bottom',
                                                padding: 0,
                                                lineHeight: 20,
                                                fontSize: 13,
                                                color: '#3886ff',
                                            },
                                            text1: {
                                                align: 'center',
                                                verticalAlign: 'bottom',
                                                padding: 0,
                                                fontSize: 10,
                                                color: '#3886ff',
                                            },
                                        },
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '12',
                                        },
                                    },
                                },
                                itemStyle: {
                                    normal: {
                                        color: {
                                            // 颜色渐变
                                            colorStops: [
                                                {
                                                    offset: 0,
                                                    color: '#4FADFD', // 0% 处的颜色
                                                },
                                                {
                                                    offset: 1,
                                                    color: '#28E8FA', // 100% 处的颜色1
                                                },
                                            ],
                                        },
                                        label: {
                                            show: false,
                                        },
                                        labelLine: {
                                            show: false,
                                        },
                                    },
                                },
                            },
                            {
                                name: '剩余',
                                value: handred - point,
                                itemStyle: {
                                    normal: {
                                        color: '#111F42',
                                    },
                                },
                            },
                        ],
                    },
                ],
            }
            // 使用刚指定的配置项和数据显示图表。
            myChart3.setOption(option)
        },
        myEcharts4() {
            // 基于准备好的dom，初始化echarts实例
            const myChart4 = this.$echarts.init(document.getElementById('main4'))

            const option = {
                xAxis: {
                    data: ['处理中', '待处理', '已处理'],
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#3d5269',
                        },
                    },
                    axisTick: {
                        //y轴刻度线
                        show: false,
                    },
                    axisLabel: {
                        color: 'rgba(49, 171, 227, 1)',
                        fontSize: 12,
                    },
                },
                grid: {
                    height: '45%',
                },
                yAxis: {
                    show: false,
                },
                series: [
                    {
                        type: 'bar',
                        barWidth: 10,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: '#5ef3ff',
                                        },
                                        {
                                            offset: 1,
                                            color: '#06a4f4',
                                        },
                                    ],
                                    false
                                ),
                            },
                        },
                        label: {
                            normal: {
                                show: true,
                                fontSize: 12,
                                fontWeight: 'bold',
                                color: '#ffffff',
                                position: 'top',
                            },
                        },
                        data: [this.msg2.processing_count, this.msg2.untreated_count, this.msg2.processed_count],
                    },
                ],
            }
            // 使用刚指定的配置项和数据显示图表。
            myChart4.setOption(option)
        },
        myEcharts5() {
            // 基于准备好的dom，初始化echarts实例
            const myChart5 = this.$echarts.init(document.getElementById('main5'))
            const myChart6 = this.$echarts.init(document.getElementById('main6'))
            const myChart7 = this.$echarts.init(document.getElementById('main7'))
            var dataArr = this.msg7.ratio.normal
            var dataArr1 = this.msg7.ratio.fault
            var dataArr2 = this.msg7.ratio.off
            var colorSet = {
                color: '#468EFD',
            }
            const option = {
                // backgroundColor: "#000",
                xAxis: {
                    splitLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                },
                yAxis: {
                    splitLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                },

                series: [
                    // 内圆
                    {
                        type: 'pie',
                        radius: ['0', '15%'],
                        center: ['50%', '50%'],
                        z: 4,
                        hoverAnimation: false,
                        data: [
                            {
                                name: '积分',
                                value: dataArr,
                                itemStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                            {
                                                offset: 0,
                                                color: 'rgba(23,161,255,0)',
                                            },
                                            {
                                                offset: 1,
                                                color: 'rgba(17,90,233,0) ',
                                            },
                                        ]),
                                    },
                                },
                                label: {
                                    normal: {
                                        color: 'rgb(0,250,168)',
                                        align: 'center',
                                        fontSize: 25,
                                        formatter: function (params) {
                                            return dataArr + '%'
                                        },
                                        position: 'center',
                                        show: true,
                                    },
                                },
                                labelLine: {
                                    show: false,
                                },
                            },
                        ],
                    },
                    {
                        name: '内部进度条',
                        type: 'gauge',
                        center: ['50%', '50%'],
                        radius: '90%',

                        splitNumber: 10,
                        axisLine: {
                            lineStyle: {
                                color: [
                                    [dataArr / 100, colorSet.color],
                                    [1, '#111F42'],
                                ],
                                width: 10,
                            },
                        },
                        axisLabel: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        splitLine: {
                            show: false,
                        },
                        itemStyle: {
                            show: false,
                        },
                        detail: {
                            show: false,
                        },
                        label: {
                            show: false,
                        },
                        title: {
                            //标题
                            show: false,
                        },
                        data: [
                            {
                                name: 'title',
                                value: dataArr,
                            },
                        ],
                        pointer: {
                            show: false,
                        },
                    },
                    // 刻度
                    {
                        type: 'gauge',
                        radius: '26%',
                        startAngle: 220,
                        endAngle: -40,
                        z: 2,
                        axisTick: {
                            show: false,
                            lineStyle: {
                                color: '#6B9DD7',
                                width: 1,
                            },
                            length: -8,
                        }, //刻度样式
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: '#6B9DD7',
                                width: 1,
                            },
                            length: -8,
                        }, //分隔线样式
                        axisLabel: {
                            color: 'rgba(255,255,255,0)',
                            fontSize: 12,
                        }, //刻度节点文字颜色
                        pointer: {
                            show: false,
                        },
                        axisLine: {
                            show: false,
                        },
                        label: {
                            show: false,
                        },
                        //仪表盘详情，用于显示数据。
                        detail: {
                            show: true,
                            offsetCenter: ['5%', '280%'],
                            color: '#A2C7F3',
                            backgroundColor: 'rgba(8, 9, 126, 1)',
                            borderRadius: 13,
                            borderColor: 'rgba(27, 31, 255, 1)',
                            borderWidth: 1,
                            borderStyle: 'solid',
                            formatter: function (params) {
                                return '正常百分比'
                            },
                            textStyle: {
                                fontSize: 12,
                            },
                        },
                    },
                ],
            }
            const option1 = {
                // backgroundColor: "#000",
                xAxis: {
                    splitLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                },
                yAxis: {
                    splitLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                },

                series: [
                    // 内圆
                    {
                        type: 'pie',
                        radius: ['0', '15%'],
                        center: ['50%', '50%'],
                        z: 4,
                        hoverAnimation: false,
                        data: [
                            {
                                name: '积分',
                                value: dataArr1,
                                itemStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                            {
                                                offset: 0,
                                                color: 'rgba(23,161,255,0)',
                                            },
                                            {
                                                offset: 1,
                                                color: 'rgba(17,90,233,0) ',
                                            },
                                        ]),
                                    },
                                },
                                label: {
                                    normal: {
                                        color: 'rgb(0,250,168)',
                                        align: 'center',
                                        fontSize: 25,
                                        formatter: function (params) {
                                            return dataArr1 + '%'
                                        },
                                        position: 'center',
                                        show: true,
                                    },
                                },
                                labelLine: {
                                    show: false,
                                },
                            },
                        ],
                    },
                    {
                        name: '内部进度条',
                        type: 'gauge',
                        center: ['50%', '50%'],
                        radius: '90%',

                        splitNumber: 10,
                        axisLine: {
                            lineStyle: {
                                color: [
                                    [dataArr1 / 100, colorSet.color],
                                    [1, '#111F42'],
                                ],
                                width: 10,
                            },
                        },
                        axisLabel: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        splitLine: {
                            show: false,
                        },
                        itemStyle: {
                            show: false,
                        },
                        detail: {
                            show: false,
                        },
                        label: {
                            show: false,
                        },
                        title: {
                            //标题
                            show: false,
                        },
                        data: [
                            {
                                name: 'title',
                                value: dataArr1,
                            },
                        ],
                        pointer: {
                            show: false,
                        },
                    },
                    // 刻度
                    {
                        type: 'gauge',
                        radius: '26%',
                        startAngle: 220,
                        endAngle: -40,
                        z: 2,
                        axisTick: {
                            show: false,
                            lineStyle: {
                                color: '#6B9DD7',
                                width: 1,
                            },
                            length: -8,
                        }, //刻度样式
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: '#6B9DD7',
                                width: 1,
                            },
                            length: -8,
                        }, //分隔线样式
                        axisLabel: {
                            color: 'rgba(255,255,255,0)',
                            fontSize: 12,
                        }, //刻度节点文字颜色
                        pointer: {
                            show: false,
                        },
                        axisLine: {
                            show: false,
                        },
                        label: {
                            show: false,
                        },
                        //仪表盘详情，用于显示数据。
                        detail: {
                            show: true,
                            offsetCenter: ['5%', '280%'],
                            color: '#A2C7F3',
                            backgroundColor: 'rgba(8, 9, 126, 1)',
                            borderRadius: 13,
                            borderColor: 'rgba(27, 31, 255, 1)',
                            borderWidth: 1,
                            borderStyle: 'solid',
                            formatter: function (params) {
                                return '故障百分比'
                            },
                            textStyle: {
                                fontSize: 12,
                            },
                        },
                    },
                ],
            }
            const option2 = {
                // backgroundColor: "#000",
                xAxis: {
                    splitLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                },
                yAxis: {
                    splitLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                },

                series: [
                    // 内圆
                    {
                        type: 'pie',
                        radius: ['0', '15%'],
                        center: ['50%', '50%'],
                        z: 4,
                        hoverAnimation: false,
                        data: [
                            {
                                name: '积分',
                                value: dataArr2,
                                itemStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                            {
                                                offset: 0,
                                                color: 'rgba(23,161,255,0)',
                                            },
                                            {
                                                offset: 1,
                                                color: 'rgba(17,90,233,0) ',
                                            },
                                        ]),
                                    },
                                },
                                label: {
                                    normal: {
                                        color: 'rgb(0,250,168)',
                                        align: 'center',
                                        fontSize: 25,
                                        formatter: function (params) {
                                            return dataArr2 + '%'
                                        },
                                        position: 'center',
                                        show: true,
                                    },
                                },
                                labelLine: {
                                    show: false,
                                },
                            },
                        ],
                    },
                    {
                        name: '内部进度条',
                        type: 'gauge',
                        center: ['50%', '50%'],
                        radius: '90%',

                        splitNumber: 10,
                        axisLine: {
                            lineStyle: {
                                color: [
                                    [dataArr2 / 100, colorSet.color],
                                    [1, '#111F42'],
                                ],
                                width: 10,
                            },
                        },
                        axisLabel: {
                            show: false,
                        },
                        axisTick: {
                            show: false,
                        },
                        splitLine: {
                            show: false,
                        },
                        itemStyle: {
                            show: false,
                        },
                        detail: {
                            show: false,
                        },
                        label: {
                            show: false,
                        },
                        title: {
                            //标题
                            show: false,
                        },
                        data: [
                            {
                                name: 'title',
                                value: dataArr2,
                            },
                        ],
                        pointer: {
                            show: false,
                        },
                    },
                    // 刻度
                    {
                        type: 'gauge',
                        radius: '26%',
                        startAngle: 220,
                        endAngle: -40,
                        z: 2,
                        axisTick: {
                            show: false,
                            lineStyle: {
                                color: '#6B9DD7',
                                width: 1,
                            },
                            length: -8,
                        }, //刻度样式
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: '#6B9DD7',
                                width: 1,
                            },
                            length: -8,
                        }, //分隔线样式
                        axisLabel: {
                            color: 'rgba(255,255,255,0)',
                            fontSize: 12,
                        }, //刻度节点文字颜色
                        pointer: {
                            show: false,
                        },
                        axisLine: {
                            show: false,
                        },
                        label: {
                            show: false,
                        },
                        //仪表盘详情，用于显示数据。
                        detail: {
                            show: true,
                            offsetCenter: ['5%', '280%'],
                            color: '#A2C7F3',
                            backgroundColor: 'rgba(8, 9, 126, 1)',
                            borderRadius: 13,
                            borderColor: 'rgba(27, 31, 255, 1)',
                            borderWidth: 1,
                            borderStyle: 'solid',
                            formatter: function (params) {
                                return '离线百分比'
                            },
                            textStyle: {
                                fontSize: 12,
                            },
                        },
                    },
                ],
            }
            // 使用刚指定的配置项和数据显示图表。
            myChart5.setOption(option)
            myChart6.setOption(option1)
            myChart7.setOption(option2)
        },
        myEcharts6() {
            // 基于准备好的dom，初始化echarts实例
            const myChart8 = this.$echarts.init(document.getElementById('main8'))
            var property_price = this.msg5.list.map((item) => {
                return item.property_price
            })
            var parking_price = this.msg5.list.map((item) => {
                return item.parking_price
            })
            var custom_price = this.msg5.list.map((item) => {
                return item.custom_price
            })
            var name = this.msg5.type.map((item) => {
                return item.name
            })
            const option = {
                title: {
                    text: '月总收入￥' + this.msg5.total_money,
                    textStyle: {
                        fontWeight: '700',
                        fontSize: 16,
                        color: 'rgba(19, 241, 253, 1)',
                    },
                    left: '2%',
                    top: '7%',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#57617B',
                        },
                    },
                },
                legend: {
                    icon: 'rect',
                    itemWidth: 10,
                    itemHeight: 3,
                    itemGap: 13,
                    data: name,
                    right: '4%',
                    top: '10%',
                    textStyle: {
                        fontSize: 12,
                        color: '#F1F1F3',
                    },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: 'rgba(31, 99, 163, 1)',
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            margin: 10,
                            textStyle: {
                                color: 'rgba(138, 158, 207, 1)',
                                fontSize: 12,
                            },
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(31, 99, 163, 0.1)',
                            },
                        },
                        data: this.msg5.date,
                    },
                    {
                        axisPointer: {
                            show: false,
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(31, 99, 163, 1)',
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        // name: '单位（%）',
                        axisTick: {
                            show: false,
                        },
                        axisLine: {
                            lineStyle: {
                                color: 'rgba(31, 99, 163, 1)',
                            },
                        },
                        axisLabel: {
                            margin: 10,
                            textStyle: {
                                color: 'rgba(138, 158, 207, 1)',
                                fontSize: 12,
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                color: 'rgba(31, 99, 163, 1)',
                            },
                        },
                    },
                ],
                series: [
                    {
                        name: name[0],
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 5,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1,
                            },
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: 'rgba(219, 50, 51, 1)',
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(219, 50, 51, 0.3)',
                                        },
                                    ],
                                    false
                                ),
                                shadowColor: 'rgba(0, 0, 0, 0.1)',
                                shadowBlur: 10,
                            },
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgb(219, 50, 51)',
                                borderColor: 'rgba(219, 50, 51,0.27)',
                                borderWidth: 12,
                            },
                        },
                        data: property_price,
                    },
                    {
                        name: name[1],
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 5,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1,
                            },
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: 'rgba(254, 190, 3, 1)',
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(254, 190, 3, 0.3)',
                                        },
                                    ],
                                    false
                                ),
                                shadowColor: 'rgba(0, 0, 0, 0.1)',
                                shadowBlur: 10,
                            },
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgb(254, 190, 3)',
                                borderColor: 'rgba(254, 190, 3,0.2)',
                                borderWidth: 12,
                            },
                        },
                        data: parking_price,
                    },
                    {
                        name: name[2],
                        type: 'line',
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 5,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1,
                            },
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: 'rgba(79, 249, 250, 1)',
                                        },
                                        {
                                            offset: 1,
                                            color: 'rgba(79, 249, 250, 0.3)',
                                        },
                                    ],
                                    false
                                ),
                                shadowColor: 'rgba(0, 0, 0, 0.1)',
                                shadowBlur: 10,
                            },
                        },
                        itemStyle: {
                            normal: {
                                color: 'rgb(79, 249, 250)',
                                borderColor: 'rgba(79, 249, 250,0.2)',
                                borderWidth: 12,
                            },
                        },
                        data: custom_price,
                    },
                ],
            }
            // 使用刚指定的配置项和数据显示图表。
            myChart8.setOption(option)
        },

        previewImage(src) {
            this.showImg = true
            this.imgSrc = src
        },
        clickit() {
            // console.log('点击了切换')
            this.showImg = false
        },
    },
}
</script>

<style lang="less" scoped>
@rem: 192; //定义页面尺寸

.bg-box {
    background-image: url(../../../assets/images/newbg.png);
    width: 100%;
    height: 100%;
    background-size: cover;
    color: #666;
    font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
    font-size: 14 / @rem * 1rem;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 20 / @rem * 1rem;
    color: #747b8b;
    font-size: 16 / @rem * 1rem;
    overflow: hidden;
}

//公用css
.font_20 {
    font-size: 20 / @rem * 1rem !important;
    color: rgba(19, 241, 253, 1) !important;
    font-weight: 700 !important;
}

.border_1 {
    position: absolute;
    top: 0;
    left: 0;
}

.border_2 {
    position: absolute;
    top: 0;
    right: 0;
}

.border_3 {
    position: absolute;
    bottom: 0;
    right: 0;
}

.border_4 {
    position: absolute;
    bottom: 0;
    left: 0;
}

.top_title_box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-image: url(../../../assets/images/rgba_bg.png);
    height: 30 / @rem * 1rem;
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .mini_title {
        font-size: 12 / @rem * 1rem;
        font-weight: 700;
        font-stretch: normal;
        line-height: 30 / @rem * 1rem;
        letter-spacing: 0 / @rem * 1rem;
        color: #31abe3;
        margin: 0 / @rem * 1rem 5 / @rem * 1rem;
    }
}

//公用css end
.top-box {
    width: 100%;
    height: 57 / @rem * 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;

    .switchBtn {
        position: absolute;
        width: 42px;
        height: 42px;
        top: 20px;
        left: 10px;
        cursor: pointer;
    }

    .logo-img {
        width: 32 / @rem * 1rem;
        height: 32 / @rem * 1rem;
        display: inline-block;
    }

    .title {
        font-size: 27 / @rem * 1rem;
        font-weight: 700;
        font-stretch: normal;
        line-height: 57 / @rem * 1rem;
        letter-spacing: 0 / @rem * 1rem;
        color: #ffffff;
        margin-left: 8 / @rem * 1rem;
    }
}

.container {
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 82 / @rem * 1rem);
    padding-top: 20 / @rem * 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;

    .flex_1 {
        flex: 1;
        height: 100%;
        padding-right: 5 / @rem * 1rem;

        .flex_left_1 {
            width: 100%;
            height: 40%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            overflow: hidden;

            .left_box_1 {
                width: 49%;
                height: 40%;
                position: relative;
                border: 1px solid #0b1363;

                .mini_box_1 {
                    height: 76%;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;

                    .mini_box {
                        width: 30%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;

                        .text_1 {
                            font-size: 14 / @rem * 1rem;
                            font-weight: normal;
                            font-stretch: normal;
                            line-height: 30 / @rem * 1rem;
                            letter-spacing: 0 / @rem * 1rem;
                            color: #08d1ea;
                        }
                    }
                }

                .mini_box_9 {
                    width: 100%;
                    height: 76%;
                    display: flex;
                    flex-direction: row;

                    .mini_box6 {
                        width: 50%;
                        height: 100%;
                        position: relative;
                        display: flex;
                        justify-content: center;

                        .pulse1 {
                            width: 90 / @rem * 1rem;
                            height: 90 / @rem * 1rem;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            /* border: 30px solid rgba(9, 97, 89,1); */
                            background-image: radial-gradient(
                                circle,
                                rgba(9, 97, 89, 0),
                                rgba(9, 97, 89, 0.5),
                                rgba(9, 97, 89, 1)
                            );
                            -webkit-border-radius: 50%;
                            -moz-border-radius: 50%;
                            border-radius: 50%;
                            z-index: 1;
                            opacity: 1;
                            -webkit-animation: warn1 3s ease-out;
                            -moz-animation: warn1 3s ease-out;
                            animation: warn1 3s ease-out;
                            -webkit-animation-iteration-count: infinite;
                            -moz-animation-iteration-count: infinite;
                            animation-iteration-count: infinite;
                            /* box-shadow: 1px 1px 30px red; */
                        }
                    }

                    .mini_box7 {
                        width: 50%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: flex-start;

                        .text_8 {
                            font-size: 14 / @rem * 1rem;
                            font-weight: normal;
                            font-stretch: normal;
                            line-height: 30 / @rem * 1rem;
                            letter-spacing: 0 / @rem * 1rem;
                            color: rgba(0, 202, 255, 1);
                        }

                        .text_9 {
                            font-size: 28 / @rem * 1rem;
                            width: 56 / @rem * 1rem;
                            font-weight: 700;
                            font-stretch: normal;
                            line-height: 30 / @rem * 1rem;
                            letter-spacing: 0 / @rem * 1rem;
                            color: rgba(19, 241, 253, 1);
                            text-align: center;
                        }
                    }
                }
            }

            .left_box_2 {
                width: 49%;
                height: 54%;
                margin-top: 2%;
                position: relative;
                border: 1 / @rem * 1rem solid #0b1363;

                .mini_box_2 {
                    width: 100%;
                    height: 83%;
                }

                .mini_box_10 {
                    width: 100%;
                    height: 83%;
                    display: flex;
                    flex-direction: row;

                    .mini_box8 {
                        width: 50%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;

                        .pulse_box {
                            width: 100%;
                            height: 50%;
                            position: relative;
                            display: flex;
                            justify-content: center;

                            .pulse1 {
                                width: 90 / @rem * 1rem;
                                height: 90 / @rem * 1rem;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                /* border: 30px solid rgba(9, 97, 89,1); */
                                background-image: radial-gradient(
                                    circle,
                                    rgba(117, 96, 43, 0),
                                    rgba(117, 96, 43, 0.5),
                                    rgba(117, 96, 43, 1)
                                );
                                -webkit-border-radius: 50%;
                                -moz-border-radius: 50%;
                                border-radius: 50%;
                                z-index: 1;
                                opacity: 1;
                                -webkit-animation: warn1 3s ease-out;
                                -moz-animation: warn1 3s ease-out;
                                animation: warn1 3s ease-out;
                                -webkit-animation-iteration-count: infinite;
                                -moz-animation-iteration-count: infinite;
                                animation-iteration-count: infinite;
                                /* box-shadow: 1px 1px 30px red; */
                            }
                        }

                        .text_box {
                            width: 100%;
                            height: 50%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            padding-top: 10 / @rem * 1rem;

                            .text_10 {
                                font-size: 14 / @rem * 1rem;
                                font-weight: normal;
                                font-stretch: normal;
                                line-height: 30 / @rem * 1rem;
                                letter-spacing: 0 / @rem * 1rem;
                                color: rgba(0, 202, 255, 1);
                            }

                            .text_11 {
                                font-size: 24 / @rem * 1rem;
                                width: 48 / @rem * 1rem;
                                font-weight: 700;
                                font-stretch: normal;
                                line-height: 30 / @rem * 1rem;
                                letter-spacing: 0 / @rem * 1rem;
                                color: rgba(19, 241, 253, 1);
                                text-align: center;
                            }
                        }
                    }

                    .mini_box9 {
                        width: 50%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;

                        .pulse_box {
                            width: 100%;
                            height: 50%;
                            position: relative;
                            display: flex;
                            justify-content: center;

                            .pulse1 {
                                width: 90 / @rem * 1rem;
                                height: 90 / @rem * 1rem;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                /* border: 30px solid rgba(9, 97, 89,1); */
                                background-image: radial-gradient(
                                    circle,
                                    rgba(88, 14, 86, 0),
                                    rgba(88, 14, 86, 0.5),
                                    rgba(88, 14, 86, 1)
                                );
                                -webkit-border-radius: 50%;
                                -moz-border-radius: 50%;
                                border-radius: 50%;
                                z-index: 1;
                                opacity: 1;
                                -webkit-animation: warn1 3s ease-out;
                                -moz-animation: warn1 3s ease-out;
                                animation: warn1 3s ease-out;
                                -webkit-animation-iteration-count: infinite;
                                -moz-animation-iteration-count: infinite;
                                animation-iteration-count: infinite;
                                /* box-shadow: 1px 1px 30px red; */
                            }
                        }

                        .text_box {
                            width: 100%;
                            height: 50%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            padding-top: 10 / @rem * 1rem;

                            .text_10 {
                                font-size: 14 / @rem * 1rem;
                                font-weight: normal;
                                font-stretch: normal;
                                line-height: 30 / @rem * 1rem;
                                letter-spacing: 0 / @rem * 1rem;
                                color: rgba(0, 202, 255, 1);
                            }

                            .text_11 {
                                font-size: 24 / @rem * 1rem;
                                font-weight: 700;
                                font-stretch: normal;
                                line-height: 30 / @rem * 1rem;
                                letter-spacing: 0 / @rem * 1rem;
                                color: rgba(19, 241, 253, 1);
                            }
                        }
                    }
                }
            }
        }

        .flex_left_2 {
            width: 100%;
            height: 32%;
            margin-top: 2%;
            position: relative;
            border: 1 / @rem * 1rem solid #0b1363;

            .mini_box_3 {
                width: 100%;
                height: 88%;
                display: flex;
                flex-direction: row;
                align-items: center;

                .left_mini_box {
                    width: 40%;
                    height: 100%;
                    position: relative;

                    .mini_box1 {
                        width: 50%;
                        height: 52%;
                        position: absolute;
                        top: 43%;
                        left: 48%;
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;

                        .mini-info {
                            width: 50%;
                            height: 50%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;

                            .text_2 {
                                font-size: 14 / @rem * 1rem;
                                font-weight: normal;
                                font-stretch: normal;
                                line-height: 30 / @rem * 1rem;
                                letter-spacing: 0 / @rem * 1rem;
                                color: #00caff;
                                // text-align: center;
                            }

                            .text_3 {
                                font-size: 18 / @rem * 1rem;
                                font-weight: 700;
                                font-stretch: normal;
                                line-height: 30 / @rem * 1rem;
                                letter-spacing: 0 / @rem * 1rem;
                                color: rgba(19, 241, 253, 1);
                                // text-align: center;
                            }
                        }
                    }

                    .mini_box_left_2 {
                        width: 100%;
                        height: 40%;
                        position: absolute;
                        top: 8%;
                        left: 5%;
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;

                        .mini-info-line {
                            width: 100%;
                            height: 52%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            font-size: 20 / @rem * 1rem;
                            font-weight: normal;
                            font-stretch: normal;
                            line-height: 28 / @rem * 1rem;
                            letter-spacing: 0 / @rem * 1rem;
                            color: #00caff;
                            margin-bottom: 15px;

                            .text_line1 {
                                font-weight: bold;
                                font-size: 26 / @rem * 1rem;
                                margin-top: 5px;
                            }
                        }

                        .mini-info {
                            width: 50%;
                            height: 54%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;

                            .text_2 {
                                font-size: 14 / @rem * 1rem;
                                font-weight: normal;
                                font-stretch: normal;
                                line-height: 30 / @rem * 1rem;
                                letter-spacing: 0 / @rem * 1rem;
                                color: #00caff;
                            }

                            .text_3 {
                                font-size: 16 / @rem * 1rem;
                                font-weight: 700;
                                font-stretch: normal;
                                line-height: 30 / @rem * 1rem;
                                letter-spacing: 0 / @rem * 1rem;
                                color: rgba(19, 241, 253, 1);
                            }
                        }

                        .info_left {
                            width: 40%;
                            margin-bottom: 10px;
                        }
                    }
                }

                .line {
                    width: 1 / @rem * 1rem;
                    height: 70%;
                    background-color: #00c1f5;
                    opacity: 0.1;
                    margin-top: 5%;
                }

                .right_mini_box {
                    width: 60%;
                    height: 100%;
                    position: relative;

                    .mini_box2 {
                        width: 80%;
                        height: 30%;
                        position: absolute;
                        top: 70%;
                        left: 10%;
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;

                        .mini-info1 {
                            width: 50%;
                            height: 50%;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            align-items: center;
                            justify-content: space-between;
                            flex-shrink: 0;

                            .text_4 {
                                font-size: 12 / @rem * 1rem;
                                font-weight: normal;
                                font-stretch: normal;
                                line-height: 30 / @rem * 1rem;
                                letter-spacing: 0 / @rem * 1rem;
                                color: #00caff;
                            }

                            .text_5 {
                                font-size: 20 / @rem * 1rem;
                                font-weight: 700;
                                font-stretch: normal;
                                line-height: 30 / @rem * 1rem;
                                letter-spacing: 0 / @rem * 1rem;
                                color: #13f1fd;
                            }
                        }
                    }
                }
            }

            .mini_box_33 {
                width: 100%;
                height: 80%;
                // display: flex;
                // flex-direction: row;
                // align-items: center;
            }
        }

        .flex_left_3 {
            width: 100%;
            height: 25%;
            margin-top: 2%;
            position: relative;
            display: flex;
            flex-direction: row;

            .left_box_3 {
                width: 55%;
                height: 100%;
                position: relative;
                border: 1 / @rem * 1rem solid #0b1363;

                .mini_box_4 {
                    width: 100%;
                    height: 85%;
                    display: flex;
                    flex-direction: row;

                    .left_mini_box_1 {
                        width: 30%;
                        height: 100%;
                    }

                    .right_mini_box_1 {
                        width: 70%;
                        height: 100%;
                    }
                }
            }

            .left_box_4 {
                width: 44%;
                height: 100%;
                position: relative;
                border: 1 / @rem * 1rem solid #0b1363;
                margin-left: 10 / @rem * 1rem;

                .mini_box_5 {
                    width: 91%;
                    height: 170px;
                    margin: 15 / @rem * 1rem 15 / @rem * 1rem 15 / @rem * 1rem 18 / @rem * 1rem;
                    padding-right: 10 / @rem * 1rem;
                    overflow-y: scroll;

                    .right_mini_box_2 {
                        width: 100%;
                        height: 20%;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        flex-shrink: 0;

                        .mini_box3 {
                            width: 60%;
                            font-size: 12 / @rem * 1rem;
                            font-weight: normal;
                            font-stretch: normal;
                            letter-spacing: 0 / @rem * 1rem;
                            color: #b8bade;
                        }

                        .mini_box4 {
                            width: 30%;
                            font-size: 12 / @rem * 1rem;
                            font-weight: normal;
                            font-stretch: normal;
                            letter-spacing: 0 / @rem * 1rem;
                            color: #00faa8;
                            text-align: end;
                        }
                    }

                    .right_mini_box_2::before {
                        content: '';
                        display: inline-block;
                        width: 3 / @rem * 1rem;
                        height: 3 / @rem * 1rem;
                        border-radius: 4 / @rem * 1rem;
                        background-color: rgba(42, 206, 215, 0.6);
                    }
                }

                .tip_text_box {
                    width: 91%;
                    height: 72%;
                    margin: 15 / @rem * 1rem 15 / @rem * 1rem 15 / @rem * 1rem 18 / @rem * 1rem;
                    padding-right: 10 / @rem * 1rem;
                    overflow-y: scroll;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .tip_text {
                        font-size: 14 / @rem * 1rem;
                        color: #0056af;
                    }
                }
            }
        }
    }

    .flex_2 {
        width: 30%;
        height: 100%;

        .map {
            height: 35%;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            position: relative;

            .ceshi {
                background-image: url(../../../assets/images/map_bg.png);
                width: 100%;
                height: 100%;
                background-size: 100% 101%;
                background-repeat: no-repeat;
                z-index: 9999999;
                position: absolute;
                top: 0;
                left: 0;
                pointer-events: none;
            }
        }

        .flex_center_2 {
            width: 100%;
            height: 30%;
            margin-top: 2%;
            position: relative;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            overflow: hidden;

            .center_box_1 {
                width: 23.67%;
                height: 48%;
                background-color: #141858;
                border-radius: 4 / @rem * 1rem;
                border: solid 1 / @rem * 1rem #0d15ef;
                margin-left: 1.33%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                .center_img {
                    display: block;
                }

                .center_title {
                    font-size: 13 / @rem * 1rem;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0 / @rem * 1rem;
                    color: #00caff;
                }
            }

            .center_box_1:nth-of-type(4n-3) {
                width: 23.68%;
                margin-left: 0 / @rem * 1rem;
            }

            .center_box_1:nth-of-type(n + 5) {
                margin-top: 10 / @rem * 1rem;
            }
        }

        .flex_center_3 {
            width: 100%;
            height: 32.5%;
            margin-top: 2%;
            position: relative;
            border: 1 / @rem * 1rem solid #0b1363;

            .center_box_2 {
                width: 97%;
                height: 83%;
                border: 1 / @rem * 1rem solid rgba(19, 60, 123, 1);
                margin: 8 / @rem * 1rem;
                position: relative;

                .table-scroll {
                    width: 100%;
                    height: 21vh;
                    overflow-y: scroll;
                    margin-top: 5%;

                    .table-flex_body {
                        width: 100%;
                        display: flex;
                        flex-direction: row;

                        .text_6 {
                            width: 100%;
                            text-align: center;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            font-size: 12 / @rem * 1rem;
                            padding: 5 / @rem * 1rem;
                            color: rgba(0, 202, 255, 1);
                            text-overflow: ellipsis;
                            overflow: hidden;
                            word-break: break-all;
                            border-right: 1 / @rem * 1rem solid rgba(19, 60, 123, 1);
                            border-bottom: 1 / @rem * 1rem solid rgba(19, 60, 123, 1);
                        }

                        .text_6:first-of-type {
                            width: 100%;
                            text-align: center;
                            color: rgba(0, 202, 255, 1);
                            border-right: 1 / @rem * 1rem solid rgba(19, 60, 123, 1);
                            border-bottom: 1 / @rem * 1rem solid rgba(19, 60, 123, 1);
                        }
                    }

                    .table-flex_body:first-of-type {
                        width: 100%;
                        display: flex;
                        flex-direction: row;
                        background-color: rgba(255, 255, 255, 0.2);
                        position: absolute;
                        margin-top: -28 / @rem * 1rem;

                        .text_6 {
                            width: 100%;
                            text-align: center;
                            font-size: 12 / @rem * 1rem;
                            padding: 5 / @rem * 1rem;
                            color: rgba(171, 186, 228, 1);
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            word-break: break-all;
                            border-right: 0 / @rem * 1rem solid rgba(19, 60, 123, 1);
                            border-bottom: 0 / @rem * 1rem solid rgba(19, 60, 123, 1);
                        }
                    }
                }
            }

            .tip_text_box {
                width: 97%;
                height: 83%;
                border: 1 / @rem * 1rem solid rgba(19, 60, 123, 1);
                margin: 8 / @rem * 1rem;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;

                .tip_text {
                    font-size: 14 / @rem * 1rem;
                    color: #0056af;
                }
            }
        }
    }

    .flex_3 {
        flex: 1;
        height: 100%;
        padding-left: 5 / @rem * 1rem;

        .flex_right_1 {
            width: 100%;
            height: 40%;
            position: relative;
            border: 1 / @rem * 1rem solid #0b1363;

            .right_box_2 {
                width: 100%;
                height: 91%;

                .mini_box_6 {
                    width: 100%;
                    height: 45%;
                    display: flex;
                    flex-direction: row;

                    .mini_box5 {
                        width: 100%;
                        height: 100%;
                    }
                }

                .mini_box_7 {
                    width: 100%;
                    height: 55%;
                    position: relative;

                    .table-right {
                        width: 98%;
                        height: 89%;
                        border: 1 / @rem * 1rem solid rgba(19, 60, 123, 1);
                        margin: 8 / @rem * 1rem;
                        position: relative;
                        overflow: hidden;

                        .table-scroll_right {
                            width: 100%;
                            height: 82%;
                            overflow-y: scroll;
                            margin-top: 4.4%;

                            .table-flex_body_right {
                                width: 100%;
                                display: flex;
                                flex-direction: row;

                                .text_7 {
                                    width: 100%;
                                    text-align: center;
                                    font-size: 12 / @rem * 1rem;
                                    padding: 5 / @rem * 1rem;
                                    color: rgba(0, 202, 255, 1);
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                    word-break: break-all;
                                    border-right: 1 / @rem * 1rem solid rgba(19, 60, 123, 1);
                                    border-bottom: 1 / @rem * 1rem solid rgba(19, 60, 123, 1);
                                }
                            }

                            .table-flex_body_right:first-of-type {
                                width: 99.6%;
                                display: flex;
                                flex-direction: row;
                                background-color: rgba(255, 255, 255, 0.1);
                                position: absolute;
                                margin-top: -29 / @rem * 1rem;

                                .text_7 {
                                    width: 100%;
                                    text-align: center;
                                    font-size: 12 / @rem * 1rem;
                                    padding: 5 / @rem * 1rem;
                                    color: rgba(120, 138, 189, 1);
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                    overflow: hidden;
                                    word-break: break-all;
                                }
                            }
                        }
                    }
                }
            }

            .right_box_3 {
                font-size: 14 / @rem * 1rem;
                font-weight: 700;
                font-stretch: normal;
                line-height: 30 / @rem * 1rem;
                letter-spacing: 0 / @rem * 1rem;
                color: rgba(49, 171, 227, 1);
                position: absolute;
                top: 0;
                right: 5%;
            }
        }

        .flex_right_2 {
            width: 100%;
            height: 35%;
            margin-top: 2%;
            position: relative;
            border: 1 / @rem * 1rem solid #0b1363;

            .right_box_4 {
                width: 100%;
                height: 89%;
            }
        }

        .flex_right_3 {
            width: 100%;
            height: 22%;
            margin-top: 2%;
            position: relative;
            border: 1 / @rem * 1rem solid #0b1363;

            .right_box_5 {
                width: 100%;
                height: 83%;
                display: flex;
                flex-direction: row;
                align-items: center;

                .mini_box_8 {
                    width: 50%;
                    height: 100%;
                    padding: 15 / @rem * 1rem 30 / @rem * 1rem;

                    .right_mini_box_2 {
                        width: 100%;
                        height: 25%;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;

                        .mini_box3 {
                            width: 58%;
                            font-size: 12 / @rem * 1rem;
                            font-weight: normal;
                            font-stretch: normal;
                            letter-spacing: 0 / @rem * 1rem;
                            color: #b8bade;
                        }

                        .mini_box4 {
                            width: 30%;
                            text-align: end;
                            font-size: 12 / @rem * 1rem;
                            font-weight: normal;
                            font-stretch: normal;
                            letter-spacing: 0 / @rem * 1rem;
                            color: rgba(0, 202, 255, 1);
                        }
                    }

                    .right_mini_box_2::before {
                        content: '';
                        display: inline-block;
                        width: 3 / @rem * 1rem;
                        height: 3 / @rem * 1rem;
                        border-radius: 4 / @rem * 1rem;
                        background-color: rgba(42, 206, 215, 0.6);
                    }
                }

                .line {
                    width: 1 / @rem * 1rem;
                    height: 80%;
                    background-color: #00c1f5;
                    opacity: 0.1;
                }
            }
        }
    }
}

::-webkit-scrollbar {
    width: 3 / @rem * 1rem;
    height: 16 / @rem * 1rem;
    background-color: rgba(0, 62, 142, 0.3);
    right: 5 / @rem * 1rem;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 2 / @rem * 1rem rgba(0, 0, 0, 0.3);
    border-radius: 10 / @rem * 1rem;
    background-color: rgba(0, 62, 142, 0.3);
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 10 / @rem * 1rem;
    -webkit-box-shadow: inset 0 0 6 / @rem * 1rem rgba(0, 0, 0, 0.3);
    background-color: rgba(0, 72, 165, 1);
}

@keyframes warn1 {
    0% {
        transform: scale(0.75);
        -webkit-transform: scale(0.75);
        opacity: 0.8;
    }

    25% {
        transform: scale(0.78);
        -webkit-transform: scale(0.78);
        opacity: 0.9;
    }

    50% {
        transform: scale(0.8);
        -webkit-transform: scale(0.8);
        opacity: 1;
    }

    75% {
        transform: scale(0.78);
        -webkit-transform: scale(0.78);
        opacity: 0.9;
    }

    100% {
        transform: scale(0.75);
        -webkit-transform: scale(0.75);
        opacity: 0.8;
    }
}
</style>
