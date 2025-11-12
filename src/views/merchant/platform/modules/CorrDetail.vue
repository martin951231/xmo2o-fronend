<template>
  <a-modal :title="title" :width="810" :height="640" :visible="visible" @cancel="handleCancel" :footer="null">
    <div>
      <a-row class="mb-20">
        <a-col :span="1"></a-col>
          <a-col :span="22">
            <viewer :images="detail.pic">
                <img
                  v-for="(src,index) in detail.pic"
                  :src="src"
                  :key="index"
                >
              </viewer>
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

import merchantPlatformApi from '@/api/merchant/platform/index'
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
      title: '反馈内容',
      visible: false,
      rpl_id: 0,
      detail: {
        content: '',
        pic: [],
      },
    }
  },
  methods: {
    // 查看详情
    showCorr(id) {
      this.visible = true
      this.id = id
      this.request(merchantPlatformApi.getCorrDetails, {id: this.id}).then((res) => {
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