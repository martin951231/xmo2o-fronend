<template>
  <div class="current_4">
    <div class="left_box_tab">
      <div class="left_box_tab_head">
        新闻公告
      </div>
      <!-- :style="{border: index == currentIndex ? '1px dashed #fff': ''}"  是否显示虚线边框-->
      <div class="left_box_tab_list" v-for="(item, index) in leftMenuList" @click="chooseNews(item, index)"
        :class="index === currentIndex? 'active': ''">
        <span class="left_box_tab_list_text">{{item.cat_name}}</span>
      </div>
    </div>
    <!-- 新闻列表 -->
    <div class="right_content" v-if="isShowNewsList">
      <div class="right_content_top">
        <div class="right_content_top_icon"></div>
        <div class="right_content_top_title">{{titleBar? titleBar: '新闻公告'}}</div>
      </div>
      <div class="right_content_list" v-for="(item, index) in newsList" @click="gotoDetail(item.news_id)">
        <div class="right_content_list_left">
          <div class="right_content_list_left_icon"></div>
          <div class="right_content_list_left_title">
            {{item.title}}
          </div>
        </div>
        <div class="right_content_list_right">{{item.add_time}}</div>
      </div>
      <NoData v-if="newsList.length==0"></NoData>
      <div class="right_content_pagehelper" v-if="newsList.length!=0">
        <PageHelper ref="pageHelper" :totalP="totalPage" :sizeP="pageSize" :pageP="params.page"
          @changePage="changePage"></PageHelper>
      </div>
    </div>
    <!-- 新闻详情 -->
    <div class="right_content" v-else>
      <div class="right_content_top">
        <div class="right_content_top_icon"></div>
        <div class="right_content_top_title">{{titleBar}}</div>
      </div>
      <div class="right_content_nav">
        <div class="content_nav_list" @click="goToList">{{titleBar}}</div>
        <div class="content_nav_icon"> > </div>
        <div class="content_nav_detail">新闻详情</div>
      </div>
      <div class="right_content_detail_title">
        {{newsDetail.info.title}}
      </div>
      <div class="right_content_detail_time">
        {{newsDetail.info.add_time}}
      </div>
      <div class="right_content_detail_pic" v-html="htmlStr"></div>
      <div class="right_content_bottom_nav">
        <div class="bottom_nav_previous" @click="bottomNav('provious')">
          上一篇：{{newsDetail.last_news.title}}
        </div>
        <div class="bottom_nav_next" @click="bottomNav('next')">
          下一篇：{{newsDetail.next_news.title}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Rem from '../../../../utils/rem.js';
  import configVillageApi from '@/api/community/village/index.js';
  import NoData from "./NoData.vue"
  import PageHelper from '../pagehelper/PageHelper.vue';
  import Vue from 'vue';
  Rem.getrem();
  export default {
    name: 'NewsList',
    props: {
      // width: {
      //   type: String,
      //   default: 386/192 * 1
      // },
      news_id: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        flag: true,
        leftMenuList: [],
        newsList: [],
        currentIndex: 0,
        imagePath: '../../../../assets/communityimg/cockpit_menuback.png',
        noimage: '',
        isShowNewsList: true,
        params: {
          cat_id: 0,
          page: 1
        },
        totalPage: 0,
        pageSize: 12,
        newsDetail: {
          info: {
            title: '',
            add_time: ''
          },
          last_news: {
            title: ''
          },
          next_news: {
            title: ''
          }
        },
        titleBar: '',
        htmlStr: ''
      }
    },
    components: {
      PageHelper,
      NoData
    },
    created() {
      this.getNewsCate()
    },
    mounted() {

    },
    methods: {
      goToList(){
        this.isShowNewsList = true
        this.news_id = 0
        this.getNewsCate()
        
      },
      gotoDetail(news_id) {
        this.isShowNewsList = false
        this.request(configVillageApi.getNewsDetail, {
          news_id: news_id
        }, 'get').then((res) => {
          this.newsDetail = res
          this.htmlStr = this.newsDetail.info.content.replace(/<img/g, "<img style='width:100%;height:auto'");
        })
      },

      getNewsCate() {
        console.log("====================>getNewsCate")
        this.request(configVillageApi.getNewsCategory, {}, 'post').then((res) => {
          this.leftMenuList = res
          this.params.cat_id = res[0].cat_id
          this.titleBar = res[0].cat_name
          console.log("this.news_id======>", this.news_id)
          if(this.news_id!=0){
            this.gotoDetail(this.news_id)
          } else{
            this.getNewsList(res[0].cat_id)
          }
        })
      },

      chooseNews(item, index) {
        this.isShowNewsList = true
        this.currentIndex = index
        this.titleBar = item.cat_name
        this.params.cat_id = item.cat_id
        this.params.page = 1
        this.getNewsList(item.cat_id)
      },

      getNewsList(cat_id) {
        this.request(configVillageApi.getNewsLists, this.params, 'get').then((res) => {
          this.totalPage = res.count
          this.newsList = res.list
        })
      },

      changePage(page) {
        this.params.page = page
        this.getNewsList(this.params)
      },

      bottomNav(type) {
        if (type == 'provious') {
          if (this.newsDetail.last_news.news_id == 0) {
            this.$message.info("上一篇没有数据了哦。。。")
          } else {
            this.gotoDetail(this.newsDetail.last_news.news_id)
          }
        } else {
          if (this.newsDetail.next_news.news_id == 0) {
            this.$message.info("下一篇没有数据了哦。。。")
          } else {
            this.gotoDetail(this.newsDetail.next_news.news_id)
          }
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  @rem: 192; //定义页面尺寸

  .current_4 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 90%;
    // padding: 0 20/@rem * 1rem;
    padding-top: 0%;
    position: relative;

    .left_box_tab {
      // width: 240/@rem * 1rem;
      width: 12%;
      height: 100%;
      background: #141D34;

      .left_box_tab_head {
        height: 60/@rem * 1rem;
        width: 100%;
        padding: 0 56/@rem * 1rem;
        display: flex;
        align-items: center;
        font-size: 16/@rem * 1rem;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #FFFFFF;
        border-bottom: 1/@rem * 1rem solid #999;
      }

      .left_box_tab_list {
        width: 100%;
        height: 60/@rem * 1rem;
        display: flex;
        align-items: center;
        cursor: pointer;

        .left_box_tab_list_text {
          margin-left: 56/@rem * 1rem;
          color: #ffffff;
        }
      }

      .active {
        background-image: url(../../../../assets/communityimg/cockpit_menuback.png);
        background-size: 100% 100%;
      }
    }

    .right_content {
      width: 88%;
      height: 100%;
      background-color: #0E162B;
      overflow-y: scroll;

      // 新闻列表
      .right_content_top {
        height: 60/@rem * 1rem;
        margin: 0 56/@rem * 1rem;
        border-bottom: 1/@rem * 1rem solid #999;
        display: flex;
        align-items: center;

        .right_content_top_icon {
          width: 7/@rem * 1rem;
          height: 20/@rem * 1rem;
          background: #1C98E0;
          margin-top: 10/@rem *1rem;
        }

        .right_content_top_title {
          width: 74/@rem * 1rem;
          height: 17/@rem * 1rem;
          font-size: 18/@rem * 1rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #FFFFFF;
          margin-left: 6/@rem *1rem;
        }
      }

      .right_content_list {
        height: 50/@rem * 1rem;
        margin: 0 56/@rem * 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;

        .right_content_list_left {
          display: flex;
          align-items: center;

          .right_content_list_left_icon {
            width: 4/@rem * 1rem;
            height: 4/@rem * 1rem;
            background: #0C86C7;
            margin-top: 10/@rem *1rem;
          }

          .right_content_list_left_title {
            height: 16/@rem * 1rem;
            font-size: 16/@rem * 1rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #DBDBDB;
            margin-left: 6/@rem *1rem;
          }
        }

        .right_content_list_right {
          height: 12/@rem * 1rem;
          font-size: 16/@rem * 1rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #81838B;
        }
      }

      .right_content_pagehelper {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 88%;
        height: 60/@rem * 1rem;
        bottom: 30/@rem * 1rem;
      }


      // 新闻详情
      .right_content_nav {
        height: 60/@rem * 1rem;
        margin: 0 56/@rem * 1rem;
        display: flex;
        align-items: center;

        .content_nav_list {
          font-size: 14/@rem * 1rem;
          font-family: Microsoft YaHei;
          font-weight: 600;
          color: #DBDBDB;
          cursor: pointer;
        }

        .content_nav_icon {
          margin: 0 10/@rem * 1rem;
        }

        .content_nav_detail {
          font-size: 14/@rem * 1rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
        }
      }

      .right_content_detail_title {
        margin: 0 56/@rem * 1rem;
        height: 60/@rem * 1rem;
        font-size: 22/@rem * 1rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #DBDBDB;
        line-height: 60/@rem * 1rem;
      }

      .right_content_detail_time {
        margin: 0 56/@rem * 1rem;
        height: 30/@rem * 1rem;
        font-size: 16/@rem * 1rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #81838B;
        line-height: 30/@rem * 1rem;
        opacity: 0.8;
      }

      .right_content_detail_pic {
        margin: 30/@rem * 1rem 56/@rem * 1rem;
        // background: #FFFFFF;
      }

      .right_content_detail_desc {
        margin: 0 56/@rem * 1rem;
        // height: 76/@rem * 1rem;
        font-size: 16/@rem * 1rem;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #999999;
        line-height: 30/@rem * 1rem;
      }

      .right_content_bottom_nav {
        margin: 80/@rem * 1rem 56/@rem * 1rem;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        height: 60/@rem * 1rem;
        bottom: 30/@rem * 1rem;

        .bottom_nav_previous,
        .bottom_nav_next {
          height: 20/@rem * 1rem;
          cursor: pointer;
          font-size: 14/@rem * 1rem;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #FFFFFF;
          opacity: 0.28;
        }
      }
    }
  }
</style>
