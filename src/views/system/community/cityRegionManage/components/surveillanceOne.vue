<!-- 视频监控1 -->
<template>
    <div id="charts_container_14">
        <video id="myFlvVideo1" 
            class="videoPlayer1" 
            controls
            :muted="false"
            autoplay>
        </video>
        <!-- <div class="introduce">视频简介1</div> -->
    </div>
</template>

<script>
    import houseCityApi from '@/api/system/community/house';
    import flvjs from 'flv.js';
    export default {
        props: {
            addressParams: {
                type: Object,
                default: ()=>{return {}}
            }
        },
        data() {
            return {
                videoSrc: '',
                flvPlayer: null
            }
        },

        mounted() {
            this.getData()
        },
        
        beforeDestroy() {
            if(this.videoSrc){
                this.destoryVideo()
            }
        },

        methods: {
            getData() {
                console.log('视频简介1', houseCityApi.getEventVideo1Statistics)
                let self = this
                self.request(houseCityApi.getEventVideo1Statistics,this.addressParams).then((res) => {
                    self.videoSrc = res.url
                    if(self.videoSrc){
                        self.createVideo()
                    }
                })
            },
            createVideo() {
                if (flvjs.isSupported()) {
                    var videoElement = document.getElementById('myFlvVideo1')
                    this.flvPlayer = flvjs.createPlayer({
                        type: 'flv',
                        isLive: true,
                        hasAudio: false,
                        url: this.videoSrc
                    })
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
            }
        }
    }
</script>

<style lang="less" scoped>
    #charts_container_14 {
        width: calc(100vw/4 - 10px);
        height: calc((100vh - 90px - 6px)/3 - 42px);
        position: relative;

        .videoPlayer1 {
            width: 92%;
            height: 92%;
            object-fit: fill;
            position: absolute;
            left: 20px;
            top: 10px;
        }

        .introduce {
            position: absolute;
            left: 25px;
            top: 15px;
            color: #ffffff;
            z-index: 99;
        }
    }
    
    #myFlvVideo1::-webkit-media-controls-timeline {
        display: none;
    }
    
    #myFlvVideo1::-webkit-media-controls-play-button {
        display: none;
    }
</style>
