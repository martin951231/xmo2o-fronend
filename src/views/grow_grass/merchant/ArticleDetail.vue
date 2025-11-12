<template>
  <a-modal :title="title" :width="810" :height="640" :visible="visible" @cancel="handleCancel" :footer="null">
    <div>
      <a-row class="mb-20">
        <a-col :span="1"></a-col>
        <a-col :span="21">
          <span>  {{ detail.name }}</span>
        </a-col>
      </a-row>
      <a-row class="mb-20" v-if="detail.img">
        <a-col :span="1"></a-col>
        <a-col :span="22">
          <viewer :images="detail.img">
            <img
                    v-for="(src,index) in detail.img"
                    :src="src"
                    :key="index"
            >
          </viewer>
        </a-col>
      </a-row>

      <a-row class="mb-20" v-if="detail.video_url">
        <a-col :span="1"></a-col>
        <a-col :span="22">
          <video-player  class="video-player vjs-custom-skin"
                         ref="videoPlayer"
                         :playsinline="true"
                         :options="playerOptions"
          ></video-player>
        </a-col>
      </a-row>
      <a-row class="mb-20">
        <a-col :span="1"></a-col>
        <a-col :span="21">
          <span>  {{ detail.content }}</span>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>

  import growGrassCommentApi from '@/api/grow_grass/merchant'
  import 'viewerjs/dist/viewer.css'
  import Viewer from 'v-viewer'
  import Vue from 'vue'

  Vue.use(Viewer)

  import { videoPlayer } from 'vue-video-player'
  import 'video.js/dist/video-js.css'

  export default {
    components: {
      videoPlayer,
    },
    data() {
      return {
        title: '文章内容',
        visible: false,
        rpl_id: 0,
        detail: {
          name: '',
          content: '',
          img: [],
          video_img:"",
          video_url:"",
        },
        playerOptions: {
          playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
          autoplay: false, // 如果为true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 是否视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "video/mp4", // 类型
            src:'' // url地址
          }],
          poster: '', // 封面地址
          notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true, // 当前时间和持续时间的分隔符
            durationDisplay: true, // 显示持续时间
            remainingTimeDisplay: false, // 是否显示剩余时间功能
            fullscreenToggle: true // 是否显示全屏按钮
          }
        },
      }
    },
    methods: {
      // 查看详情
      showArticle(id) {
        this.visible = true
        this.id = id
        this.request(growGrassCommentApi.getArticleDetails, {id: this.id}).then((res) => {
          this.detail = res
          this.playerOptions.sources[0]['src']=res.video_url
          this.playerOptions.poster=res.video_img
          console.log(this.detail)
        })
      },
      handleCancel() {
        this.detail.reply_mv_nums = 2
        this.visible = false
      },
    }
  }
</script>
<style lang="less" scoped>
  img {
    width: 210px;
    height: 170px;
    margin: 10px;
    border-radius: 5px;
    position: relative;
    display: inline-block;
    border: 1px solid #d9d9d9;
  }

</style>