<template>
  <a-modal :title="title" :width="900" :height="640" :visible="visible" @cancel="handleCancel" :footer="null">
    <div>
      <a-row class="mb-20">
        <a-col :span="1"></a-col>
        <a-col :span="10">
          商家名称: <span>  {{ detail.mer_name }}</span>
        </a-col>
        <a-col :span="1"></a-col>
        <a-col :span="10">
          店铺名称: <span>  {{ detail.store_name }}</span>
        </a-col>
      </a-row>
      <a-row class="mb-20">
        <a-col :span="1"></a-col>
        <a-col :span="10">
          商品名称: <span>  {{ detail.goods_name }}</span>
        </a-col>
        <a-col :span="1"></a-col>
        <a-col :span="10">
          商品规格: <span>  {{ detail.goods_sku_dec }}</span>
        </a-col>
      </a-row>
      <a-row class="mb-20">
        <a-col :span="1"></a-col>
        <a-col :span="10">
          评论时间： <span>  {{ detail.reply_time }}</span>
        </a-col>
        <a-col :span="1"></a-col>
        <a-col :span="10">
          商品评价:
          <template>
            <a-rate v-model="detail.goods_score" disabled/>
          </template>
        </a-col>
      </a-row>
      <a-row class="mb-20">
        <a-col :span="1"></a-col>
        <a-col :span="10">
          物流服务:
          <template>
            <a-rate v-model="detail.logistics_score" disabled/>
          </template>
        </a-col>
        <a-col :span="1"></a-col>
        <a-col :span="10">
          服务态度:
          <template>
            <a-rate v-model="detail.service_score" disabled/>
          </template>
        </a-col>
      </a-row>
      <a-row class="mb-20">
        <a-col :span="1"></a-col>
        <a-col :span="21">
          评论内容: <span>  {{ detail.comment }}</span>
        </a-col>
      </a-row>
      <a-row class="mb-20">
        <a-col :span="1"></a-col>
        <div v-if="detail.reply_mv_nums == 1">
          <a-col :span="10">
            <video-player  class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="detail.playerOption"
            ></video-player>
          </a-col>
          <a-col :span="11">
            <viewer :images="detail.reply_pic">
                <img
                  v-for="(src,index) in detail.reply_pic"
                  :src="src"
                  :key="index"
                >
              </viewer>
          </a-col>
        </div>
        <div v-if="detail.reply_mv_nums == 2">
          <a-col :span="21">
            <viewer :images="detail.reply_pic">
                <img
                  v-for="(src,index) in detail.reply_pic"
                  :src="src"
                  :key="index"
                >
              </viewer>
          </a-col>
        </div>
      </a-row>
      <a-row class="mb-20">
        <a-col :span="1"></a-col>
        <a-col :span="19">
          回复内容（{{ detail.merchant_reply_time }}）: 
          <a-textarea
            v-model="detail.merchant_reply_content"
            placeholder="请输入内容"
            :auto-size="{ minRows: 6, maxRows: 10 }"
            :disabled="true"
          />
        </a-col>
        <a-col :span="2"></a-col>
      </a-row>
      <a-row class="mb-20">
        <a-col :span="1"></a-col>
        <a-col :span="21">
          用户回复 ({{detail.user_reply_merchant_time}}): 
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="1"></a-col>
        <a-col :span="21">
          <span>  {{ detail.user_reply_merchant }}</span>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>

<script>

import mallPlatformApi from '@/api/mall/platform/index'
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
      title: '查看详情',
      visible: false,
      rpl_id: 0,
      detail: {
        mer_name: '',
        store_name: '',
        reply_time: '',
        goods_name: '',
        goods_sku_dec: '',
        service_score: 0,
        goods_score: 0,
        logistics_score: 0,
        comment: '',
        reply_pic: [],
        reply_mv_nums:2,
        playerOption:{},
        merchant_reply_content: '',
        merchant_reply_time: '',
      },
    }
  },
  methods: {
    // 查看详情
    showReply(id) {
      this.visible = true
      this.rpl_id = id
      this.request(mallPlatformApi.getReplyDetails, {rpl_id: this.rpl_id}).then((res) => {
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
  width: 80px;
  height: 80px;
  margin: 10px;
  border-radius: 5px;
  position: relative;
  display: inline-block;
  border: 1px solid #d9d9d9;
}

</style>