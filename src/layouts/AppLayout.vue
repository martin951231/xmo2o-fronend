<template>
  <a-layout :class="['layout', device]" ref="container" style="height: 100vh">
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
        :collapsible="false"
        @menuSelect="menuSelect"
      ></side-menu>
    </a-drawer>

    <side-menu
      v-else-if="isSideMenu() && menus.length > 1"
      mode="inline"
      :menus="menus"
      :theme="navTheme"
      :collapsed="false"
      :collapsible="false"
      ref="sideMenu"
      class="side_platform"
      style="height: 100%;"
    ></side-menu>

    <a-layout
      id="contentView"
      :class="[layoutMode, `content-width-${contentWidth}`]"
      class="scroll_content scroll_content_platform"
      :style="{
        paddingLeft: contentPaddingLeft,
        maxHeight: sideMenuHeight,
        overflowY: 'hidden',
        background: '#f7f7f7',
      }"
    >
    <!-- /common/platform.custom/index 自定义装修页面 -->
      <a-layout-content
        class="scroll_content"
        :style="{ height: '100%', margin: '0', padding: $route.path.indexOf('custom/index') != -1?0:'10px 20px', overflowY: 'scroll',boxSizing: 'border-box' }"
      >
        <!-- <multi-tab v-if="multiTab"></multi-tab> -->
        <transition name="page-transition">
          <route-view />
        </transition>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { triggerWindowResizeEvent } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import config from '@/config/defaultSettings'

import RouteView from './RouteView'
import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SettingDrawer from '@/components/SettingDrawer'
import { convertRoutes } from '@/utils/routeConvert'

export default {
  name: 'AppLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    SettingDrawer,
  },
  data() {
    return {
      production: config.production,
      collapsed: false,
      menus: [],
      sideMenuHeight: '100vh',
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
  },
  created() {
    const routes = convertRoutes(this.mainMenu.find((item) => item.path === '/'))
    this.menus = (routes && routes.children) || []
    this.collapsed = !this.sidebarOpened
    //接收全局更新菜单事件
    this.$bus.$on('updateMenu', (menus)=>{
      this.menus = [];
      const routes = convertRoutes(menus.find((item) => item.path === '/'))
      this.menus = (routes && routes.children) || []
    });
  },
  mounted() {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
    setTimeout(() => {
      this.init()
    }, 600)
    window.onresize = () => {
      setTimeout(() => {
        this.init()
      }, 600)
    }
  },
  methods: {
    ...mapActions(['setSidebar']),
    init() {
      this.$nextTick(() => {
        if (this.$refs.sideMenu) {
          this.sideMenuHeight = window.getComputedStyle(this.$refs.sideMenu.$el).height
        }
      })
    },
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
  },
}
</script>

<style lang="less">
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
