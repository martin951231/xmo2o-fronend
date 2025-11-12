<template>
  <a-modal :title="detail.title" :width="810" :height="640" :visible="visible" @cancel="handleCancel" :footer="null">
    <div style="margin-top:-14px;font-width:bold">{{ detail.add_time }}<a style="padding-left:10px">本站</a></div>
    <div>
      <a-row class="mb-20">
        <a-col :span="1"></a-col>
          <a-col :span="22">
            <viewer :images="detail.img">
                <img
                  v-for="(src,index) in detail.img"
                  :src="src"
                  :key="index"
                  style="max-width:680px"
                >
              </viewer>
          </a-col>
      </a-row>
      <a-row class="mb-20">
        <a-col :span="1"></a-col>
        <a-col :span="21">
          <span v-html="detail.content">  {{ detail.content }}</span>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>

import atlascategoryPlatformApi from '@/api/recruit/platform';
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
      },
    }
  },
  methods: {
    // 查看详情
    view(id) {
      this.visible = true
      this.id = id
      this.request(atlascategoryPlatformApi.getAtlasArticleDetail, {id: this.id}).then((res) => {
        this.detail = res
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