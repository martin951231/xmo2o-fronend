<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="门票预约首页">
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
    <!--推荐课程列表-->
    <related-tools
      ref="relatedTools"
      source="platform_rec"
      :selectedList="list"
    />
  </div>
</template>

<script>
  import DecorateBanner from "@/views/life_tools/platform/modules/decorateAdver";
  import DecorateAdver from "@/views/life_tools/platform/modules/decorateAdver";
  import RecDecorate from "@/views/life_tools/platform/modules/recDecorate";
  import relatedTools from "@/views/life_tools/platform/modules/relatedTools";
  import lifeToolsPlatformApi from "@/api/life_tools/platform";

  const data = [
    {
      title: '轮播图',
      desc: '尺寸为 640 * 240',
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
      title: '推荐列表',
      desc: '选择数据首页推荐显示',
      button: '装修',
      show_switch: false,
      change: 'changeRec',
      click: 'getTools'
    },
  ];

  export default {
    name: "PlatformTicketDecorate",
    components: {RecDecorate, DecorateAdver, DecorateBanner, relatedTools},
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
        this.$refs.bannerModel.getList('wap_life_tools_ticket_index_top', title)
      },
      getNav(title) {
        this.$refs.bannerModel.getList('wap_life_tools_ticket_slider', title)
      },
      getTools() {
        console.log(222222);
        this.$refs.relatedTools.openDialog()
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
        this.request(lifeToolsPlatformApi.getUrlAndRecSwitchTicket).then(response => {
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