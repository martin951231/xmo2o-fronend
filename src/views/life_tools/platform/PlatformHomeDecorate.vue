<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="景点首页">
        <a-row style="background:white;padding:20px;">
          <a-col :span="10">
            <a-list item-layout="horizontal" :data-source="data">
              <a-list-item slot="renderItem" slot-scope="item, index">
                <a-list-item-meta
                  :description="item.desc">
                  <a slot="title" id="title">{{ item.title }}</a>
                </a-list-item-meta>
                <a-switch
                  v-if="item.show_switch"
                  v-model="is_display"
                  @change="changeRec"/>
                <a-button type="primary" @click="getClick(item.click,item.title)">
                  {{item.button}}
                </a-button>
              </a-list-item>
            </a-list>
            <a-divider></a-divider>
          </a-col>
          <a-col :span="2"></a-col>
          <a-col :span="12" style="position: relative;display: flex;flex-direction: column;" >
            <iframe id="myframe" frameborder="0" :src="url"></iframe>
            <a-button style="width: 65px;margin-top: 10px" type="primary" @click="refreshFrame">刷新
            </a-button>
            <span style="position: absolute; bottom: 0; left: 70px;">(如果"装修"后样式未改变，请点击此刷新按钮)</span>
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
    <!--轮播图 | 导航列表 | 单图广告-->
    <decorate-adver ref="bannerModel"></decorate-adver>
    <!--相关推荐-->
    <rec-decorate ref="recModel"></rec-decorate>
    <!--店铺分类推荐-->
    <related-goods
      ref="relatedGoods"
      source="platform_rec"
    />
    <!--推荐景区列表-->
    <related-scenic
            ref="relatedCourse"
            source="platform_rec"
            :selectedList="list"
    ></related-scenic>
      <!--滚动公告列表-->
      <related-info
          ref="relatedInfo"
          source="platform_rec"
          :selectedList="list"
      />
       <!--推荐活动列表-->
      <related-scenic-hot-recommond
          ref="relatedScenicHotRecommond"
          source="platform_rec"
          :selectedList="list"
      />
  </div>
</template>

<script>
  import DecorateBanner from "@/views/life_tools/platform/modules/decorateAdver";
  import DecorateAdver from "@/views/life_tools/platform/modules/decorateAdver";
  import RecDecorate from "@/views/life_tools/platform/modules/recDecorate";
  import relatedGoods from "@/views/life_tools/platform/modules/relatedGoods";
  import lifeToolsPlatformApi from "@/api/life_tools/platform";
  import RelatedScenic from "./modules/relatedScenic";
  import relatedInfo from "@/views/life_tools/platform/modules/relatedInfo";
  import relatedScenicHotRecommond from "@/views/life_tools/platform/modules/relatedScenicHotRecommond";

  const data = [
    {
      title: '轮播图',
      desc: '尺寸为 355 * 160',
      button: '装修',
      show_switch: false,
      change: '',
      click: 'getBanner'
    },
    {
      title: '导航栏导航列表',
      desc: '每行展示五个，不设置不展示',
      button: '装修',
      show_switch: false,
      change: '',
      click: 'getNav'
    },
      {
          title: '滚动公告列表',
          desc: '选择公告进行首页轮播滚动显示',
          button: '装修',
          show_switch: false,
          change: 'changeRec',
          click: 'getRecInfo'
      },
      {
          title: '热门推荐',
          desc: '修改热门推荐的标题，添加热门推荐的商品',
          button: '装修',
          show_switch: false,
          change: 'changeRec',
          click: 'getScenicHotRecommond'
      },
    // {
    //   title: '周边美食',
    //   desc: '选择店铺分类进行推荐',
    //   button: '装修',
    //   show_switch: false,
    //   change: 'changeRec',
    //   click: 'getRec'
    // },
    // {
    //   title: '景区排名',
    //   desc: '选择景区进行首页排名显示',
    //   button: '装修',
    //   show_switch: false,
    //   change: 'changeRec',
    //   click: 'getCourse'
    // },
  ];

  export default {
    name: "PlatformHomeDecorate",
    components: {RelatedScenic, RecDecorate, DecorateAdver, DecorateBanner, relatedGoods, relatedInfo, relatedScenicHotRecommond},
    data() {
      return {
        is_display: '',
        data,
        url: '',
        list: []
      }
    },
    created() {
      this.getUrlAndRecSwitch()
    },
    methods: {
      //根据按钮调用不同方法
      getClick(fun, title) {
        this[fun](title);
      },
      getBanner(title) {
        this.$refs.bannerModel.getList('wap_life_tools_index_top', title)
      },
      getNav(title) {
        this.$refs.bannerModel.getList('wap_life_tools_slider', title)
      },
      getRec() {
        this.$refs.relatedGoods.openDialog()
      },
      getCourse() {
        this.$refs.relatedCourse.openDialog()
      },
        getRecInfo() {
            this.$refs.relatedInfo.openDialog('scenic')
        },
        getScenicHotRecommond(){
            this.$refs.relatedScenicHotRecommond.openDialog()
        },
      changeRec(val) {
        this.is_display = val == 1 ? true : false;
        this.request(lifeToolsPlatformApi.recDisplay, {is_display: val}).then(response => {
          if (response) {
            this.$message.success('修改成功')
          }
        })
      },
      getUrlAndRecSwitch() {
        this.request(lifeToolsPlatformApi.getUrlAndRecSwitch).then(response => {
          this.url = response.url
          this.is_display = response.is_display
        })
      },
      refreshFrame() {
        document.getElementById('myframe').contentWindow.location.reload(true);
      }
    }
  }
</script>

<style scoped>
  section#contentView {
    background-color: #fff !important;
  }

  #title {
    font-size: 15px;
    font-weight: bold;
  }

  iframe {
    height: 600px;
    width: 318px;
  }

  .refresh {
    top: 568px;
    right: -156px;
  }

  button.ant-switch {
    position: relative;
    bottom: -38px;
    right: -66px;
  }

</style>