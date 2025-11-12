<template>
    <div class="video_preview">
        <div class="left_menu" v-if="fullScreen">
            <div class="search_con">
                <a-input v-model="searchVal" placeholder="请输入搜索内容" />
                <a-button icon="search" @click="searchThis" />
            </div>
            <div class="menu_list" :class="currentChoose == index?'active':''"
            v-for="(item,index) in menuList"
            :key="index" @click="chooseVideo(item, index)">
                {{item.camera_name}}
            </div>
        </div>
        <div class="right_container" :style="{width: fullScreen?'88vw':'100vw'}">
            <div class="top_tab">
                <div class="left_view">
                    <div class="tab_list" :class="currentIndex == index?'active':''" v-for="(item, index) in tabList"
                        :key="index" @click="changeScreen(index)">{{item.name}}</div>
                   <div class="tab_list" style="margin-left: 10px;" :key="99999" @click="openScreen()">
                        {{fullScreen?'全屏':'取消全屏'}}
                    </div>
                </div>
               <!-- <div class="right_view">
                    <a-pagination style="margin-left: 300px;" :current="pageInfo.page" :pageSize="pageInfo.limit" :total="totalCount" @change="paginationChange"/>
                </div> -->
            </div>
            
            <div class="bottom_container" v-if="reloadVideo">
                <div class="video_list" :style="styleList[currentIndex]" v-for="(item, index) in videoList" :key="index">
                    <div class="video_msg" style="position: absolute;top: 0;left: 0;color: #fff;z-index:999;">
                        【设备名】：{{item.camera_name}}， 【设备状态】：{{item.camera_status_txt}}
                    </div>
                    <video v-if="item.lookUrlType == 'flv' && reloadVideo" :id="'myVideo' + index" style="width: 100%; height: 100%;" class="videoPlayer" controls :muted="false" :autoplay="true"></video>
                    <hlsVideo v-else-if="item.lookUrlType == 'hls' && reloadVideo" style="width: 100%; height:100%;" :videoType="item.lookUrlType" :videoUrl="item.look_url" :videoIndex="index" />
                    <!-- <video v-else-if="item.lookUrlType == 'hls' && reloadVideo" :id="'videoPlayer'+index" class="video-js" controls style="width: 100%; height: 100%;" :options="options"></video> -->
                    <!-- <rtspPlayer style="width: 100%; height:100%;" v-else-if="item.lookUrlType == 'rtsp'" :videoType="1" :videoUrl="item.look_url" :companyVideoData="JSON.parse(item.gatewayinfo)" :divPlugin="'divPlugin'+index"  /> -->
                    <div v-else-if="item.lookUrlType == 'rtsp'" :id="'rtspPlayer'+index" style="width: 100%; height: 100%;">
                        <iframe v-if="item.showFrame" :src="baseUrl+JSON.stringify({
                            id: 'divPlugin'+index,
                            play_url: item.look_url,
                            ...item.gatewayinfo,
                            top: item.top,
                            left: item.left,
                            gatewayPluginDownload: item.gatewayPluginDownload
                        })" width="100%" height="100%" frameborder="0"></iframe>
                    </div>
                    <div class="no_video" style="width: 100%; height: 100%; background-color: #fff;" v-else></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    // flv
    import flvjs from 'flv.js';
    import hlsVideo from './hlsVideo';
    import rtspPlayer from './rtspPlayer.vue';
    export default {
        components: {
            hlsVideo,
            rtspPlayer
        },
        data() {
            return {
                showFrame: true,
                baseUrl: '/v20/public/platform/#/community/village/device/rtspPlayer?rtspParams=',
                tabList: [{
                    name: '单屏幕',
                    type: 1
                }, {
                    name: '四分屏',
                    type: 2
                }, {
                    name: '九分屏',
                    type: 3
                }, {
                    name: '十六分屏',
                    type: 4
                }],
                currentIndex: 0,
                videoList: [],
                styleList: [{
                    width: '100%',
                    height: '100%'
                }, {
                    width: '50%',
                    height: '50%'
                }, {
                    width: '33.3%',
                    height: '33.3%'
                }, {
                    width: '25%',
                    height: '25%'
                }],
                // flv格式
                videoSrc: 'https://flvopen.ys7.com:9188/openlive/daac42b18e4b4bd1826e52d50f84add5.flv',
                flvPlayer: null,
                fullScreen: true,
                
                options: {
                    autoplay: true, // 设置自动播放
                    muted: true, // 设置了它为true，才可实现自动播放,同时视频也被静音 （Chrome66及以上版本，禁止音视频的自动播放）
                    preload: "auto", // 预加载
                    controls: true, // 显示播放的控件
                },
                player: null,
                videoId: "",
                pageInfo: {
                    page: 1,
                    limit: 1
                },
                totalCount: 0,
                reloadVideo: true,
                menuList: [],
                currentChoose: -1,
                searchVal: '',
                frequency: false
            }
        },
        
        mounted() {
            // this.getVideoList()
            this.getLeftMenuList()
        },

        beforeDestroy() {
            if (this.videoSrc) {
                this.destoryVideo()
            }
        },
        methods: {
            // paginationChange(current){
            //     this.pageInfo.page = current;
            //     this.getVideoList()
            // },
            searchThis(){
                let that = this
                if (that.frequency) {
                    that.$message.warn('请求频繁，请稍后再试')
                    return
                }
                that.frequency = true
                let timeout = setTimeout(() => {
                    that.frequency = false
                    clearTimeout(timeout)
                }, 2000)
                that.getLeftMenuList()
            },
            chooseVideo(item, index){
                let that = this
                if(index == that.currentChoose){
                    console.log("重复")
                    return
                }
                let flag = false
                that.videoList.map((v, i)=>{
                    if(item.camera_id == v.camera_id){
                        flag = true
                    }
                })
                if(flag){
                    that.$message.warn('当前视频已在预览中')
                    return
                }
                that.currentChoose = index
                that.destoryVideo()
                let arr = []
                that.videoList.map(v=>{
                    arr.push(v)
                })
                arr.splice(0, 1)
                arr.push(item)
                that.videoList = []
                setTimeout(()=>{
                    that.reloadVideo = true
                    that.videoList = arr
                    that.$nextTick(()=>{
                        that.videoList.map((v, i)=>{
                            that.createVideo(v, i, v.lookUrlType)
                        })
                    })
                }, 500)
            },
            
            openScreen() {
                this.fullScreen = !this.fullScreen
                this.videoList.map((v, i)=>{
                    this.createVideo(v, i, v.lookUrlType)
                })
            },
            
            getVideoList(){
                let that = this
                that.request('/community/village_api.CameraDevice/cameraDeviceLinks', that.pageInfo).then((res) => {
                    that.totalCount = res.count
                    that.reloadVideo = false
                    that.destoryVideo()
                    setTimeout(()=>{
                        that.reloadVideo = true
                        that.videoList = res.list
                        that.$nextTick(()=>{
                            that.videoList.map((v, i) => {
                                that.createVideo(v, i, v.lookUrlType)
                            })
                        })
                    }, 500)
                })
            },
            
            getLeftMenuList(){
                let that = this
                that.request('/community/village_api.CameraDevice/cameraDeviceLinks', {page: -1, name: that.searchVal}).then(res => {
                    that.menuList = res.list
                    if(that.videoList.length>0){
                        return
                    }
                    that.videoList = [res.list[0]]
                    that.reloadVideo = true
                    that.destoryVideo()
                    that.$nextTick(()=>{
                        if(res.list.length>0){
                            that.createVideo(res.list[0], 0, res.list[0]['lookUrlType'])
                        }
                    })
                })
            },

            changeScreen(index) {
                let that = this
                if (that.currentIndex == index) {
                    console.log("重复")
                    return
                }
                that.currentIndex = index
                that.videoList = []
                that.destoryVideo()
                that.menuList.map((v, i)=>{
                     if(i<(index+1)*(index+1)){
                        that.videoList.push(v)
                    }
                })
                that.$nextTick(()=>{
                        that.videoList.map((v, i)=>{
                            setTimeout(()=>{
                                that.createVideo(v, i, v.lookUrlType)
                            },i*1000);
                        })
                })
               that.reloadVideo = true
            },
            
            createVideo(item, index, lookUrlType = 'flv') {
                
                let param = {}
                param['camera_id'] = item.camera_id
                param['channelId'] = item.channelId
                param['channel_id'] = item.channel_id ? item.channel_id:0;
                let that = this;
                this.request('/community/village_api.CameraDevice/getLiveAddress', param)
                    .then((res) => {
                        if(res && res.look_url){
                            item.look_url=res.look_url;
                            this.createVideoElement(item, index, lookUrlType);
                        }else{
                            this.createVideoElement(item, index, lookUrlType);
                        }
                    }).catch((error) => {
                            this.createVideoElement(item, index, lookUrlType);
                    })
            },
            
            createVideoElement(item, index, lookUrlType = 'flv'){
                if (lookUrlType == 'flv') {
                    if (flvjs.isSupported()) {
                        var videoElement = document.getElementById('myVideo' + index)
                        this.flvPlayer = flvjs.createPlayer({
                            type: 'flv',
                            isLive: true,
                            hasAudio: false,
                            url: item.look_url
                        })
                        if (!this.flvPlayer) return
                        this.flvPlayer.attachMediaElement(videoElement)
                        this.flvPlayer.load()
                        this.flvPlayer.play()
                        // 报错重连
                        this.flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
                            if (this.flvPlayer) {
                                this.destoryVideo()
                            }
                        })
                    }
                } else if(lookUrlType == 'rtsp'){
                    this.showFrame = false
                    this.videoList[index]['showFrame'] = false;
                    this.$nextTick(()=>{
                        this.videoList[index]['left'] = document.getElementById('rtspPlayer' + index).getBoundingClientRect().left
                        this.videoList[index]['top'] = document.getElementById('rtspPlayer' + index).getBoundingClientRect().top
                        this.videoList[index]['showFrame'] = true;
                        this.showFrame = true
                    })
                }
            },
            
            destoryVideo() {
                if (this.flvPlayer) {
                    this.flvPlayer.pause()
                    this.flvPlayer.unload()
                    this.flvPlayer.detachMediaElement()
                    this.flvPlayer.destroy()
                    this.flvPlayer = null
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    .video_preview {
        width: 100vw;
        height: 100vh;
        display: flex;
        .left_menu{
            width: 12vw;
            height: 100vh;
            background: #ffffff;
            display: flex;
            align-items: center;
            flex-direction: column;
            overflow-y: scroll;
            .search_con{
                display: flex;
                align-items: center;
                padding-top: 14px;
                position: fixed;
                background-color: #ffffff;
                z-index: 2;
            }
            .menu_list{
                width: 200px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 10px;
                font-size: 17px;
                background-color: transparent;
                color: #333333;
                cursor: pointer;
                &:nth-child(2){
                    margin-top: 50px;
                }
            }
            .active{
                background-color: #5091F9;
                color: #ffffff;
            }
        }
        
        .left_menu::-webkit-scrollbar{
            width: 0;
        }
        
        .right_container{
            height: 100vh;
            .top_tab {
                height: 60px;
                width: 100%;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                
                .left_view{
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    .tab_list {
                        padding: 5px 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #ffffff;
                        border: 1px solid #dddddd;
                        cursor: pointer;
                        background-color: rgba(0, 0, 0, .3);
                    }
                    
                    .active {
                        background-color: #333;
                    }
                    
                    .search_con{
                        display: flex;
                        margin-left: 30px;
                        .search_input{
                            width: 200px;
                        }
                    }
                }
                
                .right_view{
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                }
            }
            
            .bottom_container {
                width: 100%;
                margin: 0 auto;
                height: calc(100vh - 60px);
                display: flex;
                align-content: flex-start;
                flex-wrap: wrap;
                overflow-y: hidden;
                .video_list {
                    color: #fff;
                    background-color: #999;
                    width: 100%;
                    height: 100%;
                    border: 1px solid #dddddd;
                    position: relative;
                }
            }
        }
    }
</style>
