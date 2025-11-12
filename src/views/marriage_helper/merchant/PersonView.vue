<template>
  <a-modal title="信息查看" :width="600" :height="640" :visible="visible" @cancel="handleCancel" :footer="null">
    <p style="margin-left:206px"><img :src="detail.headimg" style="width:120px;height:120px;border-radius: 50%;"></p>
    <p style="text-align:center;font-weight:bold">{{detail.name}}</p>
    <p style="text-align:center">{{detail.desc}}</p>
    <p style="text-align:left">{{detail.pos_name}} | 从业{{detail.job_time}}</p>
    <p style="text-align:left">{{detail.store_name}}</p>
    <p style="text-align:left">{{detail.province_name}}{{detail.city_name}}</p>
    <p style="text-align:left">详细描述：</p>
    <p style="text-align:left">{{detail.detail}}</p>
  </a-modal>
</template>

<script>
import marriageHelperCommentApi from '@/api/marriage_helper/platform'
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
      this.request(marriageHelperCommentApi.getPersonView, {id: this.id}).then((res) => {
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