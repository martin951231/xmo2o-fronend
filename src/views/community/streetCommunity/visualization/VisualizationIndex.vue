<template>
  <div class="card-container">
  <a-tabs type="card" class="tab-head" @change="callback">
    <a-tab-pane key="1" tab="首页">
      <a-list item-layout="horizontal" :data-source="data" class="tab-list">
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-list-item-meta :description="item.content">
            <a slot="title" href="#">{{ item.title }}</a>
          </a-list-item-meta>
          <div class="table-operator">
          <a-button type="primary" html-type="submit" @click="onclickCreate(item.onUrl)">装修</a-button>
          </div>
        </a-list-item>
      </a-list>
      <div class="rights">
        <div class="zhez"></div>
          <iframe frameborder=0 name="showHere" width="100%" height="100%" :src="url" scrolling="auto" ></iframe>
      </div>
    </a-tab-pane>
    </a-tabs>
    <slide-shows :height='800' :width="1200" ref="createModalSlide" />
    <bott-navigation :height='800' :width="1200" ref="createModalBott" />
    <four-advertising :height='800' :width="1200" ref="createModalFour" />
    <content-slide-show :height='800' :width="1200" ref="createModalContent" />
    <bulletin-manage :height='800' :width="1350" ref="bulletinManage" />
  </div>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import SlideShows from './SlideShow.vue';
    import BottNavigation from './BottNavigation.vue';
    import FourAdvertising from './FourAdvertising.vue';
    import ContentSlideShow from './ContentSlideShow.vue';
    import bulletinManage from './bulletinManage.vue';
    export default {
        name: 'VisualizationIndex',
        components: {
            SlideShows,
            BottNavigation,
            FourAdvertising,
            ContentSlideShow,
            bulletinManage,
        },
        data() {
            return {
                url:'',
                data:[],
                visible: false,
            };
        },
        mounted(){
          this.streetUrl()
        },
        created() {},
        methods: {
            callback(key) {
            },
            streetUrl() {
                this.request(streetCommunityApi.getStreetShowUrl)
                    .then((res) => {
                        this.url = res.url;
                        this.data = res.list;
                    })
            },
            onclickCreate(type)
            {
                console.log('type',type);
                if(type === 2)
                {
                    this.$refs.createModalBott.navigations();
                }else if(type === 3){
                    this.$refs.createModalContent.slideshowList();
                }else if(type === 4){
                    this.$refs.createModalFour.slideshowList();
                }else if(type === 5){
                    this.$refs.bulletinManage.slideshowList();
                }else{
                    this.$refs.createModalSlide.slideshowList();
                }
            }
        },
    };
</script>
<style>
  .tab-head{
    /*border:1px solid red;*/
    background-color: #fff;
    margin: 20px 10px 10px 10px;
    padding: 10px;
  }
  .tab-list{
    /*border:1px solid red;*/
    margin: 15px;
    width: 60%;
    float: left;
  }
  .rights{
    border:1px solid #ccc;
    width: 25%;
    height: 1600px;
    margin: 10px 40px 10px 10px;
    float: right;
  }
  .zhez{
    /*position: absolute;*/
    width: 310px;
    height: 1600px;
    top: 0px;
    right: 70px;
    z-index: 2;
    position:fixed;
    background-color:#eee;
    opacity:0.01;
  }
</style>