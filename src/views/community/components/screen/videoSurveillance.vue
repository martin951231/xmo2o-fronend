<template>
    <div class="video_surveillance">
        <div class="top_monitor">
            <div class="left_video" v-for="(item, index) in params.v_list" :key="index">
                <div class="title">
                    <div class="left_icon">
                        <img src="https://hf.pigcms.com/static/wxapp/cockpitScreen/monitor_icon.png">
                    </div>
                    <div class="right_txt">
                        <a-tooltip placement="topRight">
                            <template slot="title">
                                <span>{{item.title}}</span>
                            </template>
                            {{item.title}}
                        </a-tooltip>
                    </div>
                </div>
                <div class="video_con">
                    <!-- <img :src="item.value"> -->
                    <video :id="'myFlvVideo' + index"
                        class="videoPlayer"
                        controls
                        :muted="false"
                        autoplay>
                    </video>
                </div>
            </div>
        </div>
        <div class="bottom_face">
            <div class="top_title" v-if="params.nav_list">
                <div class="left_con">
                    <div class="icon"></div>
                    <div class="title">{{params.nav_list[0].title}}：</div>
                    <div class="value">{{params.nav_list[0].value}}</div>
                </div>
                <div class="right_con">
                    <div class="icon"></div>
                    <div class="title">{{params.nav_list[1].title}}：</div>
                    <div class="value">{{params.nav_list[1].value}}%</div>
                    <div class="right_arr">
                        <img src="https://hf.pigcms.com/static/wxapp/cockpitScreen/right_arrow.png">
                    </div>
                </div>
            </div>
            <div class="bottom_avr">
                <div class="item" v-for="(item, index) in params.faceimg_list" :key="index">
                    <img preview='1' :src="item">
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import flvjs from 'flv.js';
    export default {
        props: {
            params: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        data() {
            return {
                videoSrc: 'https://cmgw-vpc.lechange.com:8890/flv/LCO/8F03A4EPAG5D721/0/0/20220819133149/26090cd7734e89b8033db7e12a874201.flv?proto=https',
                flvPlayer: null
            }
        },
        mounted() {
            let count = 0
            let interval = setTimeout(()=>{
                count ++
                if(this.params.v_list && this.params.v_list.length>0){
                    clearInterval(interval)
                    interval = null
                    this.params.v_list.map((v, i)=>{
                        this.createVideo('myFlvVideo'+i, v.value)
                    })
                }
                if(count>10){
                    clearInterval(interval)
                    interval = null
                }
            }, 1000)
            this.$previewRefresh()
        },
        beforeDestroy() {
            this.destoryVideo()
        },
        methods: {
            createVideo(id, url) {
                console.log('url==>',id, url)
                if (flvjs.isSupported()) {
                    var videoElement = document.getElementById(id)
                    this.flvPlayer = flvjs.createPlayer({
                        type: 'flv',
                        isLive: true,
                        hasAudio: false,
                        url: url
                    })
                    console.log('this.flvPlayer', this.flvPlayer)
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
                if (this.flvPlayer) {
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
    .video_surveillance {
        height: calc(30vh - 32px);
        width: 100%;
        padding-left: 20px;

        .top_monitor {
            width: 100%;
            display: flex;
            justify-content: space-between;
            height: 60%;

            .left_video {
                width: 50%;
                height: 100%;

                .title {
                    display: flex;

                    .left_icon {
                        width: 15px;

                        img {
                            width: 15px;
                        }
                    }

                    .right_txt {
                        color: #fff;
                        width: 170px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: inline-block;
                    }
                }

                .video_con {
                    width: 90%;
                    height: 80%;
                    .videoPlayer{
                        height: 100%;
                        width: 100%;
                    }
                    
                    .videoPlayer::-webkit-media-controls-timeline {
                            display: none;
                    }
                    
                    .videoPlayer::-webkit-media-controls-play-button {
                        display: none;
                    }
                    
                    img {
                        height: 100%;
                        width: 100%;
                    }
                }
            }
        }

        .bottom_face {
            width: 100%;
            height: 40%;

            .top_title {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .left_con {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    width: 50%;

                    .icon {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: transparent;
                        border: 3px solid #BFFDFF;
                    }

                    .title {
                        color: #ffffff;
                        font-size: 12px;
                        margin-left: 3px;
                    }

                    .value {
                        color: #5AE8F5;
                        font-size: 16px;
                        font-weight: bold;
                        margin-left: 3px;
                    }
                }

                .right_con {
                    width: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;

                    .icon {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: transparent;
                        border: 3px solid #BFFDFF;
                    }

                    .title {
                        color: #ffffff;
                        font-size: 12px;
                        margin-left: 3px;
                    }

                    .value {
                        color: #5AE8F5;
                        font-size: 16px;
                        font-weight: bold;
                        margin-left: 3px;
                    }

                    .right_arr {
                        width: 10px;
                        margin-left: 50px;

                        img {
                            width: 10px;
                        }
                    }
                }
            }

            .bottom_avr {
                display: flex;
                align-items: center;
                flex-wrap: nowrap;
                overflow-x: scroll;

                &::-webkit-scrollbar {
                    height: 0;
                }

                .item {
                    margin: 5px;
                    width: 50px;
                    height: 50px;
                    background-color: #5AE8F5;

                    &:nth-child(1) {
                        margin-left: 0;
                    }

                    img {
                        width: 50px;
                        height: 50px;
                    }
                }
            }
        }
    }
</style>
