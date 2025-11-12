/**
* 评论列表
*/
<template>
  <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
    <!-- 搜索栏 -->
    <a-form-model layout="inline" :model="searchForm">
      <a-form-model-item label="搜索">
    <!--    <a-select
          v-model="searchForm.type"
          style="width:115px;"
        >
          <a-select-option :value="0"> 全部</a-select-option>
          <a-select-option :value="2"> 体育馆</a-select-option>
          <a-select-option :value="3"> 体育课程</a-select-option>
        </a-select> -->
        <a-input v-model="searchForm.content" placeholder="请输入名称" style="width:215px;"/>
      </a-form-model-item>
      <!--<a-form-model-item label="是否回复">
        <a-select
          v-model="searchForm.status"
          style="width:115px;"
        >
          <a-select-option :value="2"> 全部</a-select-option>
          <a-select-option :value="0"> 未回复</a-select-option>
          <a-select-option :value="1"> 已回复</a-select-option>
        </a-select>
      </a-form-model-item>-->
      <a-form-model-item label="评论时间">
        <a-range-picker
          :ranges="{
            过去30天: [moment().subtract(30, 'days'), moment()],
            过去15天: [moment().subtract(15, 'days'), moment()],
            过去7天: [moment().subtract(7, 'days'), moment()],
            今日: [moment(), moment()],
          }"
          :value="searchForm.time"
          format="YYYY-MM-DD"
          @change="onDateRangeChange"
        />
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" icon="search" @click="submitForm(true)"> 查询</a-button>
        <!--<a-button @click="resetForm()" class="ml-20"> 重置</a-button>-->
      </a-form-model-item>
    </a-form-model>
    <!-- 数据列表 -->
    <a-table class="mt-20" rowKey="rpl_id" :columns="columns" :data-source="dataList" :pagination="pagination">
      <!-- 自定义table部分标题 -->
      <span slot="comment" slot-scope="text,record">
        <div>
         <span>
           {{record.showCommentText && !record.show?record.showCommentText:text}}
          </span> 
          <a-button 
            type="link" 
            v-if="!record.show" 
            @click="foldOpt(record,'unfold')">展开</a-button>
        </div>
        <div v-if="record.show && (record.reply_mv_nums == 1 || record.reply_pic.length || record.showCommentText)" class="showMore">
          <div v-if="record.reply_mv_nums == 1" >
            <video-player  class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="record.playerOption"
            ></video-player>
          </div>
          <viewer :images="record.reply_pic">
            <img
              v-for="(src,index) in record.reply_pic"
              :src="src"
              :key="index"
              width="80px"
              height="80px"
            >
          </viewer>
          <a-button 
            class="fold"
            type="link" 
            v-if="record.status"
            @click="foldOpt(record,'fold')">收起</a-button>
        </div>
      </span>
      <!-- 商品信息 -->
      <span slot="goods_name" slot-scope="text, record">
        <div class="product-info">
          <div>
            <img :src="record.goods_image"/>
          </div>
          <div>
            <div>{{ text }}</div>
            <div>{{ record.goods_sku_dec }}</div>
          </div>
        </div>
      </span>
      <!-- 评价等级 -->
      <span slot="goodsScoreTitle">
        评价等级
        <a-tooltip trigger="hover">
          <template slot="title">商品评星1-2星为差;3星为一般;4星为好;5星为非常好 </template>
          <a-icon class="ml-10" type="question-circle" />
        </a-tooltip>
      </span>
      <span slot="goodsScore" slot-scope="text">
        <template>
         <a-rate :default-value="text" disabled />
        </template>
        {{text}}星
      </span>
      <!-- 状态 -->
      <span slot="replys_time" slot-scope="text">
        <a-badge v-if="text == 0" status="default" text="未回复" />
        <a-badge v-if="text >0" status="success" text="已回复" />
      </span>
      <!-- 是否展示 --> 
      <span slot="status" slot-scope="text,record">
         <a class="ml-10 inline-block" v-if="text == 0" @click="displaySwitch(record.rpl_id)">展示</a>
         <a class="ml-10 inline-block" v-if="text == 1" @click="displaySwitch(record.rpl_id)">不展示</a>
      </span>
      <!-- 操作栏 -->
      <span slot="action" slot-scope="text">
         <a class="ml-10 inline-block" @click="$refs.replyUser.reply(text)">回复评价</a>
       <a class="ml-10 inline-block" @click="$refs.replyModel.showReply(text)">查看</a>
       <a class="ml-10 inline-block" @click="removeComment(text)">删除</a>
      </span>
    </a-table>
    <reply-detail @loadRefresh="getDataList" ref="replyModel"/>
    <reply-user @loadRefresh="getDataList" @getDataListReset="getDataListReset" ref="replyUser"></reply-user>
    <reply-user></reply-user>
  </div>
</template>

<script>
import moment from 'moment'
import ReplyDetail from './modules/ReplyDetail.vue'
import lifeToolsPlatformApi from '@/api/life_tools/merchant/index'

import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'

Vue.use(Viewer)

import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css';
import ReplyUser from "../../life_tools/merchant/modules/replyUser";

export default {
  name: 'ReplyList',
  components: {
    ReplyUser,
    ReplyDetail,
    videoPlayer,
  },
  data() {
    return {
      //   搜索框表单
      searchForm: {
        content: '', // 搜索内容
        type: 1,// 搜索类型
        time: [],
        begin_time: '', // 开始时间
        end_time: '', // 结束时间
        status:2,
      },
      store_list: [], // 店铺列表
      //   table表格头部
      columns: [
        {
          title: '评论内容',
          dataIndex: 'comment',
          scopedSlots: { customRender: 'comment' },
          width: '350px',
        },
        {
          title: '商品信息',
          dataIndex: 'goods_name',
          scopedSlots: { customRender: 'goods_name' },
          width: '300px',
        },
        {
          title: '商家名称',
          dataIndex: 'mer_name',
          key: 'mer_name',
        },
        {
          title: '评价时间',
          dataIndex: 'create_time',
          key: 'create_time',
          width: '160px'
        },
        {
          dataIndex: 'goods_score',
          key: 'goods_score',
          slots: { title: 'goodsScoreTitle' },
          scopedSlots: { customRender: 'goodsScore' },
        },
        {
          title: '是否回复',
          dataIndex: 'replys_time',
          key: 'replys_time',
          scopedSlots: {customRender: 'replys_time'},
          width: '100px',
        }, 
        {
          title: '是否展示',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' },
          width: '100px',
        },
        {
          title: '操作',
          dataIndex: 'rpl_id',
          key: 'rpl_id',
          scopedSlots: {customRender: 'action'},
        },
      ],
      //   列表数据
      dataList: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageSizeChange,
        showTotal: (total) => `共 ${total} 条记录`,
      },
    }
  },
  created() {
    this.getDataList({is_search: false})
  },
  methods: {
    moment,
    // 获取table数据
    getDataList(param) {
      let params = {...this.searchForm}
      delete params.time
      if (param.is_search == true) {
        params.page = 1
        this.$set(this.pagination, 'current', 1)
      } else {
        params.page = this.pagination.current
        this.$set(this.pagination, 'current', this.pagination.current)
      }
      params.pageSize = this.pagination.pageSize
      this.request(lifeToolsPlatformApi.getReplyList, params).then((res) => {
        this.dataList = res.list
        this.$set(this.pagination, 'total', res.count)
        if (this.dataList && this.dataList.length) {
          this.dataList = this.dataList.filter(item => {
            if (item.comment && item.comment.length > 32) {
              item.showCommentText = item.comment.substring(0,32) + '...'
            }

            if (item.reply_mv_nums == 1 || item.reply_pic.length || item.showCommentText) {
              item.show = false
            } else {
              item.show = true
            }
            return item
          })
        }
      })
    },
    getDataListReset() {
      this.dataList = []
      let params = {...this.searchForm}
      delete params.time
      params.page = this.pagination.current
      this.$set(this.pagination, 'current', this.pagination.current)
      params.pageSize = this.pagination.pageSize
      this.request(lifeToolsPlatformApi.getReplyList, params).then((res) => {
        this.dataList = res.list
        this.$set(this.pagination, 'total', res.count)
        if (this.dataList && this.dataList.length) {
          this.dataList = this.dataList.filter(item => {
            if (item.comment && item.comment.length > 32) {
              item.showCommentText = item.comment.substring(0, 32) + '...'
            }

            if (item.reply_mv_nums == 1 || item.reply_pic.length || item.showCommentText) {
              item.show = false
            } else {
              item.show = true
            }
            return item
          })
        }
      })
    },
    // 监听日期选择变化
    onDateRangeChange(date, dateString) {
      // 更新搜索框表单数据
      this.$set(this.searchForm, 'time', [date[0], date[1]])
      this.$set(this.searchForm, 'begin_time', dateString[0])
      this.$set(this.searchForm, 'end_time', dateString[1])
    },
    // 提交搜索表单
    submitForm(is_search = false) {
      let params = {...this.searchForm}
      delete params.time
      params.is_search = is_search
      console.log(params)
      this.getDataList(params)
    },
    // 页码变化
    onPageChange(page, pageSize) {
      this.$set(this.pagination, 'current', page)
      this.submitForm()
    },
    onPageSizeChange(page, pageSize) {
      this.$set(this.pagination, 'pageSize', pageSize)
      this.submitForm()
    },
    // 重置表单
    resetForm() {
      this.$set(this, 'searchForm', {content: '', begin_time: '', end_time: '', type: 1, status: 2})
      this.$set(this.pagination, 'current', 1)
      this.getDataList({store_id: this.store_id, is_search: false})
    },
    // 删除评论
    removeComment(id) {
      this.$confirm({
        title: '是否确定删除该评论?',
        centered: true,
        onOk: () => {
          this.request(lifeToolsPlatformApi.delReply, { rpl_id: id }).then((res) => {
            this.$message.success('操作成功！')
            this.getDataListReset()
          })
        },
        onCancel() {},
      })
    },
    // 展开
    foldOpt(record, type) {
      this.dataList.forEach((item,index) => {
        if (item.rpl_id == record.rpl_id) {
          item.show = type == 'unfold'? true : false
          this.$set(this.dataList, index, item)
        }
      })
    },
    //展示/不展示
    displaySwitch(rpl_id)
    { 
       this.request(lifeToolsPlatformApi.isShowReply, { rpl_id: rpl_id }).then((res) => {
         this.$message.success('操作成功！')
           this.getDataList({is_search: false});
       })
    }
  }
}
</script>
<style scoped lang="less">
  *{font-size: 14px;}
.product-info {
  display: flex;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
    margin-right: 15px;
  }
}

img {
  width: 50px;
  height: 50px;
  margin: 10px;
  border-radius: 5px;
  position: relative;
  display: inline-block;
  border: 1px solid #d9d9d9;
}

.video-player{
  margin: 10px auto;
}
.showMore {
  position: relative;
}
.fold {
  position: absolute;
  right: 0;
  bottom: 4px;
}
</style>