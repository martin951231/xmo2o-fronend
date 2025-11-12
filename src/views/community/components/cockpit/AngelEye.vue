<template>
    <div class="current_2">
        <div class="equipPoint_container">
            <div class="draw_canvas" v-if="AngelEye.is_photo*1==1 && villagePhoto" ref="canvas_con" @click="selectPoint">
                <img v-if="AngelEye.is_photo*1==1" class="back_image" :src="villagePhoto"
                    :style="{width:canvasProp.width, height: canvasProp.height}" />
                <canvas v-if="AngelEye.is_photo*1==1" class="my_canvas" id="canvasAngel" :width="canvasProp.width" :height="canvasProp.height"></canvas>
            </div>
            <div v-if="AngelEye.is_photo*1!=1 || !villagePhoto" class="draw_canvas">
                <span v-if="$store.getters.config">你还没有上传{{$store.getters.config.house_name}}平面图</span>
                <div class="upload_btn" @click="navigateTo">立即添加</div>
            </div>
        </div>
        <div class="left_box_tab">
            <div class="left_box_tab_head"></div>
            <div class="left_box_tab_list" v-for="(item, index) in leftMenuList" @click="chooseNews(item, index)"
                :class="index === currentIndex? 'active': ''">
                <div class="left_box_tab_list_icon"><img src="../../village/images/cockpit_shequ.png"></div>
                <span class="left_box_tab_list_text">{{item.name}}</span>
            </div>
        </div>
        <!-- 新闻列表 -->
        <div class="right_content">
            <div class="right_content_top">
                <!-- <div class="right_content_top_btn" 
                :class="currentIndex2 == index? 'active': ''"
                v-for="(item, index) in btnList" 
                :key="index"
                @click="chooseBtn(item, index)"
                >{{item.name}}</div> -->
            </div>
            <div class="right_content_bottom">
                <div class="content_bottom_left">
                    <div class="bottom_left_con">
                        <div class="bottom_left_con_list" @click="chooseTypeList(item, index)" v-for="(item, index) in typeList">
                            <div class="list_icon" :style="{backgroundColor: item.color}"></div>
                            <div :class="item.checked == 1?'active_color':''" class="list_status">{{item.title}}</div>
                        </div>
                    </div>
                </div>
                <div class="content_bottom_middle">
                    <div class="bottom_middle_con"></div>
                </div>
                <!-- <div class="content_bottom_right">
                    <div class="bottom_right_list" v-for="(item, index) in deviceType"
                        :class="item.checked==1?'active': ''" :key="index" @click="chooseMultipleInt(item, index)">
                        <div class="right_list_image">
                            <img :src="item.series_img">
                        </div>
                        <div class="right_list_text">{{item.type_name}}</div>
                    </div>
                </div> -->
            </div>
            
            <a-modal title="选择子设备类型"
                :width="360" 
                :visible="childEquipVisible"
                @ok="handleChildOk"
                @cancel="handleChildCancel"
                :footer="null">
                <span>选择子设备：</span>
                <a-select mode="multiple" style="width: 200px" :token-separators="[',']" @change="handleChildChange" placeholder="请选择子设备" v-if="childEquipVisible">
                  <a-select-option :value="item.cate_id" v-for="(item,index) in childEquipList">
                    {{item.name}}
                  </a-select-option>
                </a-select>
            </a-modal>
            
        </div>
        <!-- 弹窗 -->
        <PopupBox ref="PopupBox" title="天使之眼设备">
            <div class="popup_content">
                <div class="flex_row flex_box_1">
                    <div class="square"></div>
                    <p class="popup_text_1">概要信息</p>
                </div>
                <div class="flex_box_2">
                    <div class="text_1" v-for="(item, index) in detailList" :key="index">{{item.key}}:
                        {{item.value? item.value:'暂无'}}</div>
                </div>
                <div class="flex_row flex_box_1">
                    <div class="square"></div>
                    <p class="popup_text_1">实时监控</p>
                </div>
                <div class="flex_box_3" v-if="!opennWindows">
                    <video v-if="!showIframe&&!opennWindows" ref="videoPlayer" controls :src="video_url" style="width: 80%; height: 100%; object-fit: fill"></video>
                    <iframe ref="IframeId" style="transform: translateY(30px);" v-if="showIframe" :src="video_url" width="100%" height="420px"></iframe>
                </div>
                <div class="flex_box_open_video_url" v-if="opennWindows">
                    <a-button type="Default" size="large" icon="video-camera" @click="openVideo(openVideoUrl)">点击播放</a-button>
                </div>
            </div>
        </PopupBox>
    </div>
</template>

<script>
    import PopupBox from '../../components/cockpit/PopupBox.vue'
    import Rem from '../../../../utils/rem.js';
    import configVillageApi from '@/api/community/village/index.js';
    import Vue from 'vue';
    Rem.getrem();
    export default {
        name: 'AngelEye',
        props: {
            village_id: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                statusName: '',
                leftMenuList: [{
                    id: 1,
                    name: '天使之眼'
                }],
                btnList: [{
                    name: '室外全景图'
                }, {
                    name: '地下地图'
                }],
                equipList: [],
                jump_url: '',
                currentIndex: 0,
                currentIndex2: 0,
                currentIndex3: -1,
                AngelEyeList: [{
                        name: '视频监控',
                        imgUrl: '../../../../assets/communityimg/cockpit_shipin.png'
                    }, {
                        name: '门禁系统',
                        imgUrl: '../../../../assets/communityimg/cockpit_menjin.png'
                    }, {
                        name: '停车系统',
                        imgUrl: '../../../../assets/communityimg/cockpit_tingche.png'
                    }, {
                        name: '信息发布',
                        imgUrl: '../../../../assets/communityimg/cockpit_xinxi.png'
                    }, {
                        name: '无线AP',
                        imgUrl: '../../../../assets/communityimg/cockpit_wuxian.png'
                    }, {
                        name: '环境监测',
                        imgUrl: '../../../../assets/communityimg/cockpit_huanjin.png'
                    }, {
                        name: '泛感知',
                        imgUrl: '../../../../assets/communityimg/cockpit_ganzhi.png'
                    },

                ],
                AngelEye: {
                    is_photo: 1,
                    jump_url: ''
                },
                typeList: [],
                villagePhoto: 'https://hf.pigcms.com/static/wxapp/images/builds_back_img_white.png',
                coordinateList: [],
                deviceType: [],
                canvasProp: {
                    width: 0,
                    height: 0,
                    top: 0,
                    left: 0
                },
                requestParams: {
                    village_id: 0,
                    type: 3,
                    device_type: '',
                    sub_series_type: '',
                    device_status: 0,
                    cate_id: ''
                },
                
                detailType: {},
                detailList: [],
                video_url: '',
                showIframe: true,
                childEquipVisible: false,
                childList: [{
                    id: 1,
                    name: '子设备1'
                },{
                    id: 2,
                    name: '子设备2'
                },{
                    id: 3,
                    name: '子设备2'
                }],
                childEquipList: [],
                multipleList: [],
                typeMultiple: [],
                opennWindows: false,
                openVideoUrl: '',
            }
        },
        components: {
            PopupBox
        },
        created() {

        },
        mounted() {
            let that = this
            let timeout = setTimeout(() => {
                let domWidth = that.$refs.canvas_con.clientWidth // 宽
                let domHeight = that.$refs.canvas_con.clientHeight // 高
                let canvasLeft = that.$refs.canvas_con.getBoundingClientRect().left
                let canvasTop = that.$refs.canvas_con.getBoundingClientRect().top
                that.canvasProp.width = domWidth - 10 + 'px'
                that.canvasProp.height = domHeight - 10 + 'px'
                that.canvasProp.top = canvasTop
                that.canvasProp.left = canvasLeft
                that.getMonitorDevice()
                clearTimeout(timeout)
            }, 200)
        },
        methods: {
            openVideo(url) {
                if (!url) {
                    url = this.openVideoUrl
                }
                window.open(url);
            },
            selectPoint($el) {
                let pointX = $el.x - this.canvasProp.left - 12.5
                let pointY = $el.y - this.canvasProp.top - 12.5
                let flag = true
                this.coordinateList.forEach(v => {
                    if (v.coordinate && flag) {
                        let distanceX = v.coordinate[0]
                        let distanceY = v.coordinate[1]
                        if (distanceX - 10 < pointX && pointX < distanceX + 10 && distanceY - 10 < pointY &&
                            pointY < distanceY + 10) {
                            console.log("v=========>", v)
                            this.getMonitorSpot(v.id, v.device_id)
                            this.$refs.PopupBox.open()
                            flag = false
                        }
                    }
                })
            },
            initDevicePoint() {
                let canvas = document.getElementById('canvasAngel');
                let ctx = canvas.getContext('2d');
                this.coordinateList.forEach(v => {
                    if (v.coordinate) {
                        let img = new Image()
                        if (v.img) {
                            img.src = v.img
                        } else {
                            img.src = "https://hf.pigcms.com/static/wxapp/equipPoint/equip_point1.png"
                        }
                        img.onload = () => {
                            let pat = ctx.createPattern(img, 'no-repeat');
                            ctx.fillStyle = pat;
                            // ctx.fillStyle = v.status_color;
                            let imgStatus = new Image()
                            if(v.device_status == '在线状态'){
                                imgStatus.src = "https://hf.pigcms.com/static/wxapp/images/on-line1.png"
                            } else{
                                imgStatus.src = "https://hf.pigcms.com/static/wxapp/images/off-line1.png"
                            }
                            imgStatus.onload = () => {
                                ctx.fillStyle = ctx.createPattern(imgStatus, 'no-repeat');
                                ctx.drawImage(imgStatus, v.coordinate[0] - 11, v.coordinate[1] - 11, 22, 22);
                                // ctx.fillRect(v.coordinate[0] - 27, v.coordinate[1] - 27, 10, 10);
                                ctx.drawImage(img, v.coordinate[0]-7, v.coordinate[1] - 7, 14, 14);
                            }
                            // ctx.fillRect(v.coordinate[0]-25, v.coordinate[1]-25, 50, 50);
                        }
                    }
                })
            },

            initData() {
                this.requestParams = {
                    village_id: 0,
                    type: 3,
                    device_type: '',
                    sub_series_type: '',
                    device_status: 0,
                    cate_id: ''
                }
                this.statusName = ''
                this.typeMultiple = []
                this.multipleList = []
            },

            clearCanvas() {
                let canvas = document.getElementById("canvasAngel");
                let ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, 1000, 1000);
            },
            chooseNews(item, index) {
                if (this.currentIndex == index) {
                    console.log("重复请求")
                } else {
                    this.initData()
                    this.currentIndex = index
                    this.currentIndex2 = 0
                    this.currentIndex3 = -1
                    if (this.currentIndex == 0) {
                        this.getMonitorDevice()
                    } else {

                    }
                }
            },
            
            changeType(item){
                if(this.statusName == item.title){
                    console.log('重复')
                } else{
                    this.statusName = item.title
                    this.requestParams.statusName = item.title
                    if(item.title == '离线状态'){
                        this.requestParams.device_status = 2
                    } else if(item.title == '在线状态'){
                        this.requestParams.device_status = 1
                    }
                    this.getMonitorDevice()
                }
            },
            // chooseBtn(item, index){
            //   if (this.currentIndex2 == index) {
            //     console.log("重复")
            //   } else {
            //     this.initData()
            //     this.currentIndex2 = index
            //     this.currentIndex3 = -1
            //     if(this.currentIndex2 == 0){
            //         this.requestParams.type = 4
            //         this.getFacilitiesData()
            //     } else if(this.currentIndex2 == 1){
            //         this.requestParams.type = 1
            //         this.getFacilitiesData()
            //     } else if(this.currentIndex2 == 2){
            //         this.requestParams.type = 2
            //         this.getFacilitiesData()
            //     }
            //   }
            // },
            chooseInt(item, index) {
                this.requestParams.cate_id = ''
                if(item.device_type){
                    this.requestParams.device_type = item.device_type
                }
                if(item.dev_cate&&item.dev_cate.length>0){
                    this.childEquipList = item.dev_cate
                    this.childEquipVisible = true
                }
                if (this.currentIndex3 == index) {
                    console.log("重复")
                } else {
                    this.currentIndex3 = index
                    this.requestParams.device_status = 0
                    this.statusName = ''
                    this.getMonitorDevice()
                }
            },
            chooseMultipleInt(item, index){
                let flag = false
                this.multipleList.map((v, i)=> {
                    if(v == item.device_type){
                        flag = true
                        this.multipleList.splice(i, 1)
                    }
                })
                if(!flag){
                    this.multipleList.push(item.device_type)
                    if(item.dev_cate&& item.dev_cate.length>0){
                        this.childEquipList = item.dev_cate
                        this.childEquipVisible = true
                    } else {
                        this.requestParams.cate_id = ''
                    }
                }
                this.requestParams.device_type = `${this.multipleList}`
                this.getMonitorDevice()
                console.log('this.multipleList===>', this.multipleList, `${this.multipleList}`, this.deviceType)
            },
            getMonitorDevice() {
                this.request(configVillageApi.getMonitorDevice, this.requestParams, 'post').then((res) => {
                    this.AngelEye = res
                    this.typeList = res.type
                    this.coordinateList = res.device_coordinate_list
                    this.deviceType = res.device_type_list
                    this.villagePhoto = res.village_photo[0]
                    // this.villagePhoto = 'https://hf.pigcms.com/static/wxapp/images/building_back.png'
                    this.updateMultiple()
                    this.clearCanvas()
                    this.initDevicePoint()
                })
            },
            
            chooseTypeList(item, index){
                let flag = false
                this.typeMultiple.map((v, i)=> {
                    if(v.title == item.title){
                        flag = true
                        this.typeMultiple.splice(i, 1)
                    }
                })
                if(!flag){
                    this.typeMultiple.push({type: index+1, title: item.title})
                }
                this.requestParams.device_status = `${this.typeMultiple.map(v=>{return v.type})}`
                this.requestParams.statusName = `${this.typeMultiple.map(v=>{return v.title})}`
                this.getMonitorDevice()
                console.log('this.typeMultiple===>', this.typeMultiple, `${this.typeMultiple}`, this.typeList)
            },
            
            updateMultiple(){
                this.typeList.map(v=>{
                    v.checked = 0
                })
                
                this.typeList.map(v=>{
                    this.typeMultiple.map(item=>{
                        if(v.title == item.title){
                            v.checked = 1
                        }
                    })
                })
                
                this.deviceType.map(v=>{
                    v.checked = 0
                })
                
                this.deviceType.map(v=>{
                    this.multipleList.map(item=>{
                        if(v.device_type == item){
                            v.checked = 1
                        }
                    })
                })
            },
            
            getMonitorSpot(id, device_id) {
                let that = this
                that.request(configVillageApi.getMonitorSpot, {
                    id: id,
                    device_id: device_id
                }, 'post').then((res) => {
                    that.detailList = res.list
                    that.detailType = res.type
                    if (res.openVideoUrl) {
                        that.openVideoUrl = res.openVideoUrl;
                        that.opennWindows = true
                    } else if(res.videoPreviewUrl){
                        that.$nextTick(()=>{
                            that.showIframe = true
                            let left = that.$refs.IframeId.getBoundingClientRect().left
                            let top = that.$refs.IframeId.getBoundingClientRect().top
                            that.video_url = res.videoPreviewUrl + '&left='+left+'&top='+top
                        })
                    } else{
                        that.video_url = res.url
                        that.showIframe = false
                    }
                })
            },
            
            navigateTo() {
                this.$router.push({
                    path: this.AngelEye.jump_url
                })
            },
            
            handleChildOk(){
                this.childEquipVisible = false
            },
            
            handleChildCancel(){
                this.childEquipVisible = false
            },
            
            handleChildChange(value){
                console.log(`${value}`, "color: orange;")
                this.requestParams.cate_id = `${value}`
                this.getMonitorDevice()
            }
        }
    }
</script>

<style lang="less" scoped>
    @rem: 192; //定义页面尺寸

    .current_2 {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 90%;
        // padding: 0 20/@rem * 1rem;
        padding-top: 0%;
        position: relative;

        .equipPoint_container {
            position: absolute;
            width: 100vw;
            height: 100vh;
            transform: translateY(-45px);
            display: flex;
            justify-content: center;

            .draw_canvas {
                width: 55%;
                height: 73vh;
                border-radius: 10/@rem * 1rem;
                transform: translateY(200px);
                border: 1/@rem * 1rem solid #202f54;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;

                .back_image {
                    position: absolute;
                }

                .my_canvas {
                    position: absolute;
                    cursor: pointer;
                }

                .upload_btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 80/@rem *1rem;
                    height: 30/@rem *1rem;
                    border-radius: 3/@rem *1rem;
                    background-color: #409EFF;
                    font-size: 14/@rem * 1rem;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #FFFFFF;
                    margin-top: 20/@rem * 1rem;
                    cursor: pointer;
                }
            }
        }

        p {
            margin-bottom: 0;
        }

        .flex_row {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .flex_column {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .left_box_tab {
            // width: 240/@rem * 1rem;
            width: 12%;
            height: 100%;
            background: #141D34;

            .left_box_tab_head {
                height: 30/@rem * 1rem;
                width: 100%;
                padding: 0 56/@rem * 1rem;
                display: flex;
                align-items: center;
                font-size: 16/@rem * 1rem;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #FFFFFF;
                // border-bottom: 1/@rem * 1rem solid #999;
            }

            .left_box_tab_list {
                width: 100%;
                height: 60/@rem * 1rem;
                display: flex;
                align-items: center;
                cursor: pointer;

                .left_box_tab_list_icon {
                    width: 20/@rem * 1rem;
                    height: 20/@rem * 1rem;
                    margin-left: 52/@rem * 1rem;
                    transform: translateY(-3/@rem * 1rem);

                    img {
                        width: 20/@rem * 1rem;
                        height: 20/@rem * 1rem;
                    }
                }

                .left_box_tab_list_text {
                    padding-left: 2/@rem * 1rem;
                    color: #ffffff;
                }
            }

            .active {
                background-image: url(../../../../assets/communityimg/cockpit_menuback.png);
                background-size: 100% 100%;
            }
        }

        .right_content {
            width: 88%;
            height: 100%;
            background-color: #0E162B;
            overflow-y: scroll;

            // 新闻列表
            .right_content_top {
                height: 60/@rem * 1rem;
                margin: 30/@rem * 1rem 56/@rem * 1rem;
                // border-bottom: 1/@rem * 1rem solid #999;
                display: flex;
                align-items: center;

                .right_content_top_btn {
                    width: 130/@rem * 1rem;
                    height: 50/@rem * 1rem;
                    border: 1/@rem * 1rem solid #25B0FF;
                    border-radius: 4/@rem * 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 60/@rem * 1rem;
                    cursor: pointer;

                    &:nth-child(1) {
                        margin-left: 0;
                    }
                }

                .active {
                    background: #0D3E70;
                }
            }

            .right_content_bottom {
                display: flex;

                .content_bottom_left {
                    flex: 2;
                    z-index: 99;
                    .bottom_left_con {
                        margin-top: 15/@rem * 1rem;
                        z-index: 999999;
                        .bottom_left_con_list {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            margin: 10/@rem * 1rem 0;
                            cursor: pointer;
                            .list_icon {
                                width: 18/@rem * 1rem;
                                height: 18/@rem * 1rem;
                                background: #4D4D4D;
                            }

                            .active {
                                background: #0F8FD0;
                            }

                            .list_status {
                                margin: 0 10/@rem * 1rem;
                                font-size: 14/@rem * 1rem;
                                font-family: Microsoft YaHei;
                                font-weight: 400;
                                color: #FFFFFF;
                            }
                            
                            .active_color{
                                color: #409EFF;
                            }
                        }
                    }
                }

                .content_bottom_middle {
                    flex: 10;
                    display: flex;
                    justify-content: center;
                    .bottom_middle_con {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 96%;
                        height: 660/@rem * 1rem;
                        .bottom_middle_con_upload {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;

                            .upload_btn {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 80/@rem *1rem;
                                height: 30/@rem *1rem;
                                border-radius: 3/@rem *1rem;
                                background-color: #409EFF;
                                font-size: 14/@rem * 1rem;
                                font-family: Microsoft YaHei;
                                font-weight: 400;
                                color: #FFFFFF;
                                margin-top: 20/@rem * 1rem;
                                cursor: pointer;
                            }
                        }

                        .bottom_middle_con_image {
                            width: 800/@rem * 1rem;
                            height: 570/@rem * 1rem;
                            // background-color: #fff;
                            border-radius: 10/@rem * 1rem;
                            overflow: hidden;
                        }
                    }
                }

                .content_bottom_right {
                    flex: 4;
                    height: 100%;
                    // background-color: #333;
                    display: flex;
                    flex-wrap: wrap;

                    .bottom_right_list {
                        z-index: 99;
                        width: 130/@rem * 1rem;
                        height: 70/@rem * 1rem;
                        border: 1/@rem * 1rem solid #25B0FF;
                        border-radius: 4/@rem * 1rem;
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        flex-direction: column;
                        margin: 24/@rem * 1rem;
                        cursor: pointer;

                        &:nth-child(1),
                        &:nth-child(2) {
                            margin-top: 0;
                        }

                        .right_list_image {
                            img {
                                width: 20/@rem * 1rem;
                                height: 20/@rem * 1rem;
                            }
                        }

                        .right_list_text {
                            font-size: 14/@rem * 1rem;
                            font-family: Microsoft YaHei;
                            font-weight: 400;
                            color: #FFFFFF;
                        }
                    }

                    .active {
                        background: #0D3E70;
                    }
                }
            }
        }

        .popup_content {
            margin: 0 20px;
            padding-bottom: 80px;

            .flex_box_1 {
                .square {
                    width: 7px;
                    height: 14px;
                    background: #1C98E0;
                }

                .popup_text_1 {
                    font-size: 14px;
                    font-family: Microsoft YaHei;
                    color: #FFFFFF;
                    line-height: 70px;
                    margin-left: 8px;
                }
            }

            .flex_box_2 {
                display: flex;
                // flex-direction: column;
                flex-wrap: wrap;

                .text_1,
                .text_2 {
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    color: #FFFFFF;
                    margin: 8px 50px;
                }
            }

            .flex_box_3 {
                height: 350px;
                display: flex;
                justify-content: center;
                align-items: center;
                // border: 2px solid #4BB1CF;
            }
            .flex_box_open_video_url {
                height: 45px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>
