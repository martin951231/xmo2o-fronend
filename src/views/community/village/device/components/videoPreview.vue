<template>
    <a-modal
        :title="videoTitle"
        :visible="visible"
        :footer="null"
        :width="1000"
        @cancel="handleCancel">
        <video id="myFlvVideo"
            v-if="videoType == 'flv'"
            class="videoPlayer"
            controls
            :muted="false"
            autoplay>
        </video>
        <video-player v-if="visible && videoType == 'hls'" class="video-player" ref="videoPlayer" :playsinline="true" :options="playerOptions" @play="onPlayerPlay($event)" ></video-player>
        <div ref="rtspPlayer" class="rtsp_player" v-if="visible && videoType == 'rtsp'">
            <!-- <rtspPlayer :divPlugin="'divPlugin'" style="left: 0px; top: 0px;" :videoType="1" :videoUrl="videoUrl" :companyVideoData="gatewayinfo" /> -->
            <iframe v-if="showFrame" :src="baseUrl+JSON.stringify({
                id: 'divPlugin',
                play_url: videoUrl,
                ...rtspParams
            })" width="100%" height="100%" frameborder="0"></iframe>
        </div>
        <div v-if="visible && !videoType" class="no_video" style="width: 100%; height: 600px;display: flex;align-items: center;justify-content: center;">
            <h1>暂无数据源</h1>
        </div>
    </a-modal>
</template>

<script>
    import flvjs from 'flv.js';
    import { videoPlayer } from "vue-video-player";
    import rtspPlayer from './rtspPlayer.vue';
    import "video.js/dist/video-js.css";
    import 'videojs-contrib-hls';
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            videoUrl: {
                type: String,
                default: ''
            },
            videoType: {
                type: String,
                default: 'flv'
            },
            videoTitle: {
                type: String,
                default: '视频预览'
            },
            gatewayinfo: {
                type: Object,
                default: ()=>{return {}}
            },
            gatewayPluginDownload: {
                type: String,
                default: ''
            }
        },
        watch: {
            visible: {
                handler(val){
                    if(val && this.videoUrl && this.videoType == 'flv'){
                        this.$nextTick(()=>{
                            this.createVideo()
                        })
                    }
                    
                    if(val && this.videoUrl && this.videoType == 'hls'){
                        this.playerOptions.sources[0].src = this.videoUrl
                    }
                    
                    if(val && this.videoUrl && this.videoType == 'rtsp'){
                        this.showFrame = false
                        this.$nextTick(()=>{
                            this.showFrame = true
                            Object.assign(this.rtspParams, this.gatewayinfo)
                            this.rtspParams['left'] = this.$refs.rtspPlayer.getBoundingClientRect().left
                            this.rtspParams['top'] = this.$refs.rtspPlayer.getBoundingClientRect().top
                            this.rtspParams['gatewayPluginDownload'] = this.gatewayPluginDownload
                        })
                    }
                }
            }
        },
        
        components: {
            videoPlayer,
            rtspPlayer
        },
        
        data(){
            return{
                showFrame: true,
                rtspParams: {},
                baseUrl: '/v20/public/platform/#/community/village/device/rtspPlayer?rtspParams=',
                // flv格式
                videoSrc: 'https://cmgw-vpc.lechange.com:8890/flv/LCO/8F03A4EPAG5D721/0/0/20220819133149/26090cd7734e89b8033db7e12a874201.flv?proto=https',
                flvPlayer: null,
                
                // m3u8格式
                m3u8Src: 'http://hls01open.ys7.com/openlive/daac42b18e4b4bd1826e52d50f84add5.m3u8',
                playerOptions: {
                    // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                    autoplay: true, //如果true,浏览器准备好时开始回放。
                    muted: true, // 默认情况下将会消除任何音频。
                    loop: false, // 导致视频一结束就重新开始。
                    preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: "zh-CN",
                    aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [
                        {
                            type: "application/x-mpegURL",
                            src: "http://hls01open.ys7.com/openlive/daac42b18e4b4bd1826e52d50f84add5.m3u8"
                        }
                    ],
                    // poster: require('../assets/logo.png'), //你的封面地址
                    // width: document.documentElement.clientWidth, //播放器宽度
                    notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    controlBar: {
                        timeDivider: true,
                        durationDisplay: true,
                        remainingTimeDisplay: false,
                        fullscreenToggle: true //全屏按钮
                    }
                },
                interval: null
            }
        },
        
        mounted() {
        },
        
        beforeDestroy() {
            if(this.videoUrl){
                this.destoryVideo()
            }
        },
        
        methods: {
            onPlayerPlay(e){
                console.log(e)
            },
            createVideo() {
                if (flvjs.isSupported()) {
                    var videoElement = document.getElementById('myFlvVideo')
                    this.flvPlayer = flvjs.createPlayer({
                        type: 'flv',
                        isLive: true,
                        hasAudio: false,
                        url: this.videoUrl
                    })
                    if(!this.flvPlayer) return
                    this.flvPlayer.attachMediaElement(videoElement)
                    this.flvPlayer.load()
                    this.flvPlayer.play()
                    // 报错重连
                    this.flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
                        console.log('errorType:', errType)
                        console.log('errorDetail:', errDetail)
                        if (this.flvPlayer) {
                            this.destoryVideo()
                            this.createVideo()
                        }
                    })
                }
            },
            destoryVideo() {
                if(this.flvPlayer){
                    this.flvPlayer.pause()
                    this.flvPlayer.unload()
                    this.flvPlayer.detachMediaElement()
                    this.flvPlayer.destroy()
                    this.flvPlayer = null
                }
            },
            handleCancel(){
                this.$emit('closeVideo')
            }
        }
    }
</script>

<style lang="less" scoped>
    .videoPlayer{
        width: 100%;
        height: 600px;
    }
    
    .rtsp_player{
        width: 100%; 
        height: 600px;
        position: relative;
    }
    
    #myFlvVideo::-webkit-media-controls-timeline {
        display: none;
    }
    
    #myFlvVideo::-webkit-media-controls-play-button {
        display: none;
    }
    
    /deep/ .ant-modal-body{
        padding: 0;
    }
</style>