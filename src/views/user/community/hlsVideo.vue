<template>
    <div class="hls_video">
        <video v-if="videoType == 'hls'" :id="'videoPlayer'+videoIndex" class="video-js" controls style="width: 100%; height: 100%;" :options="options"></video>
    </div>
</template>

<script>
    // hls
    import Videojs from "video.js";
    import "videojs-contrib-hls";
    import "video.js/dist/video-js.css";
    export default{
        props: {
            videoType: {
                type: String,
                default: ''
            },
            videoUrl: {
                type: String,
                default: ''
            },
            videoIndex: {
                type: Number,
                default: 0
            }
        },
        data(){
            return{
                options: {
                    autoplay: true, // 设置自动播放
                    muted: true, // 设置了它为true，才可实现自动播放,同时视频也被静音 （Chrome66及以上版本，禁止音视频的自动播放）
                    preload: "auto", // 预加载
                    controls: true, // 显示播放的控件
                },
                singlePlayer: null,
                reloadVideo: true
            }
        },
        
        mounted() {
            let that = this
            that.$nextTick(()=>{
                that.initHls()
            })
        },
        
        methods: {
            initHls(){
                let that = this
                that.singlePlayer = Videojs("videoPlayer"+this.videoIndex, that.options, function onPlayerReady() {});
                that.singlePlayer.src([{
                    src: that.videoUrl,
                    type: "application/x-mpegURL",
                }]);
                that.singlePlayer.play();
            },
        },
        
        beforeDestroy() {
            let that = this
            if(that.singlePlayer){
                that.singlePlayer.dispose()
            }
        }
    }
</script>

<style lang="less" scoped>
</style>