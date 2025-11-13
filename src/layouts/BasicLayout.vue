<template>
  <a-layout :class="['layout', device,'ant-custom-theme-'+navTheme]" style="height: 100vh" class="scroll_content">
    <!-- SideMenu -->
    <a-drawer
      v-if="isMobile()"
      placement="left"
      :wrapClassName="`drawer-sider ${navTheme}`"
      :closable="false"
      :visible="collapsed"
      @close="drawerClose"
    >
      <side-menu
        mode="inline"
        :menus="menus"
        :theme="navTheme"
        :collapsed="false"
        :collapsible="true"
        @menuSelect="menuSelect"
      ></side-menu>
    </a-drawer>
    <div style="color: rgba(255, 255, 255, 0.65);" :style="{'background-color': tabBackgroundColor}" :width="tabChangeWidth" v-if="tabLeft&&tabLeft[0]&&tabChangeWidth">
      <div style="width:100%;height:64px;background-color: #001529;"></div>
      <div :style="{'background-color': tabBackgroundColor}" v-for="(item,index) in tabLeft" :key="index">
		  <!-- @mouseover="mouseoverChange($event,index)" @mouseout="mouseoutChange($event,index)" -->
        <div class="tabChoose" style="border:none;text-align: center;padding:10px 2px;cursor:pointer;" :style="{width:tabChangeWidth,background: item['backColor'], color: item['color']}" @click="goToUrl(item['href'])">
            <div v-if="item['icon']" class="app-icon">
             <IconFont :type="item['icon']" />
            </div>
            <div style="padding:5px;">{{item['tabTitle']}}</div>
        </div>
      </div>
    </div>
    <side-menu
      v-if="isSideMenu() && !isMobile() && !isFromIframe()"
      mode="inline"
      :menus="menus"
      :theme="navTheme"
      :collapsed="collapsed"
      :collapsible="true"
      style="height: 100%"
      class="scroll_content"
      :tabLeft="tabLeft.length>0?tabLeft: []"
      :class="tabLeft&&tabLeft[0]&&tabChangeWidth?'haveTabLeft':''"
    ></side-menu>

    <a-layout
      class="scroll_content"
      id="contentView"
      :class="[layoutMode, `content-width-${contentWidth}`]"
      :style="{ paddingLeft: contentPaddingLeft, height: '100%', overflowY: 'scroll' }"
    >
      <!-- layout header -->
      <global-header
        :mode="layoutMode"
        :menus="menus"
        :theme="navTheme"
        :collapsed="collapsed"
        :device="device"
        @toggle="toggle"
      />

      <!-- layout content -->
      <a-layout-content :style="{ height: '100%', margin: contentMargin, paddingTop: fixedHeader ? '64px' : '0' }">
        <multi-tab v-if="multiTab && !isFromIframe()"></multi-tab>
        <transition name="page-transition">
          <route-view />
        </transition>
      </a-layout-content>

      <!-- layout footer -->
      <!--      <a-layout-footer>-->
      <!--        <global-footer />-->
      <!--      </a-layout-footer>-->

      <!-- Setting Drawer (show in development mode) -->
      <setting-drawer v-if="!production"></setting-drawer>
    </a-layout>
  </a-layout>
</template>

<script>
import { triggerWindowResizeEvent,getSystemName } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import config from '@/config/defaultSettings'
import IconFont from '@/utils/icon'

import RouteView from './RouteView'
import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SettingDrawer from '@/components/SettingDrawer'
import { convertRoutes } from '@/utils/routeConvert'
import villageApi from '@/api/community/village'

export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    SettingDrawer,
    IconFont,
  },
  data() {
    return {
      production: config.production,
      collapsed: false,
      menus: [],
      tabNum: 1,
      contentMargin: '0px 10px',
      tabChangeWidth: '',
      sysName: '',
      tabBackgroundColor: 'rgb(24 62 98)',
      tabChooseColor: '#001529',
      tabLeft: [],
      isLoad:false,
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: (state) => state.permission.addRouters,
    }),
    contentPaddingLeft() {
      if (!this.fixSidebar || this.isMobile()) {
        return '0'
      }
      if (this.sidebarOpened) {
        return '256px'
      }
      return '80px'
    },
  },
  watch: {
    sidebarOpened(val) {
      this.collapsed = !val
    },
    '$store.getters.tabNum'(val) {
      this.tabNum = val
      if (val == 1) {
        this.contentMargin = '0px 10px'
      } else {
        this.contentMargin = '24px 10px 0 10px'
      }
    },
  },
  created() {
    const routes = convertRoutes(this.mainMenu.find((item) => item.path === '/'))
    this.menus = (routes && routes.children) || []
    this.collapsed = !this.sidebarOpened
    this.tabNum = this.$store.getters.tabNum
    if (this.tabNum == 1) {
      this.contentMargin = '0px 10px'
    } else {
      this.contentMargin = '24px 10px 0 10px'
    }
    let sysName = getSystemName(this.$route.path)
    if (sysName == 'village' || sysName == 'property') {
      this.getTabList();
    }
    this.sysName = sysName;
  },
  mounted() {
    const userAgent = navigator.userAgent
    let sysName = getSystemName(this.$route.path)
    if (sysName == 'village' || sysName == 'property') {
      this.getTabList();
    }
    this.sysName = sysName;
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
  },
  methods: {
    ...mapActions(['setSidebar']),
    toggle() {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    paddingCalc() {
      let left = ''
      if (this.sidebarOpened) {
        left = this.isDesktop() ? '256px' : '80px'
      } else {
        left = (this.isMobile() && '0') || (this.fixSidebar && '80px') || '0'
      }
      return left
    },
    menuSelect() {},
    drawerClose() {
      this.collapsed = false
    },
    goToUrl(url) {
      console.log('goToUrl', url)
      if (url) {
        window.top.location.href = url;
      }
    },
    mouseoverChange(event, index) {
      console.log('1mouseoverChange', event)
      console.log('2mouseoverChange', index)
      if (this.tabLeft[index]&&this.tabLeft[index]['sysName']!=this.sysName) {
        this.tabLeft[index]['color'] = '#ffffff';
      }
    },
    mouseoutChange(event, index) {
      console.log('1mouseoutChange', event)
      console.log('2mouseoutChange', index)
      if (this.tabLeft[index]&&this.tabLeft[index]['sysName']!=this.sysName) {
        this.tabLeft[index]['color'] = '';
      }
    },
    getTabList() {
      if (this.sysName != 'village' && this.sysName != 'property') {
          return false;
      }
      if (this.isLoad) {
          return false;
      }
      this.isLoad = true;
      let tokenName = this.sysName + '_access_token';
      let param = {
        tokenName: tokenName
      };
      this.request(villageApi.tabList,param).then(res => {
          console.log('+++++++tabLeft', res)
          this.isLoad = false;
          if (res.tabLeft) {
            this.tabLeft = res.tabLeft;
          }
          this.tabChangeWidth = '30px'
          if (res.tabChooseColor) {
            this.tabChooseColor = res.tabChooseColor;
          }
          if (res.tabBackgroundColor) {
            this.tabBackgroundColor = res.tabBackgroundColor;
          }
      });
    }
  },
}
</script>
<style lang="less">
@import './antMenuSide.less';
/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}


</style>
