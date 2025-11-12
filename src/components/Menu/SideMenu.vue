<template>
  <a-layout-sider
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null, 'ant-custom-theme-'+theme]"
    :width="homeMenu ? '16%' : homeMenuWidth"
    style="height: 101% !important; max-width: 300px; min-width: 100px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null"
  >
    <template v-if="homeMenu && homeMenu.meta">
      <div class="app-title" key="showTitle" ref="appTitle" :style="{ color: primaryColor}" >
        <div v-if="homeMenu.meta.icon" class="app-icon">
          <IconFont :type="homeMenu.meta.icon" />
        </div>
        {{ homeMenu.meta.title }}
      </div>
      <app-menu
        :collapsed="collapsed"
        :menu="menus"
        :theme="theme"
        :mode="mode"
        @select="onSelect"
        style="padding: 16px 0px;"
        :style="[{maxHeight: `calc(100vh - ${appTitleHeight}px)`}]"
        class="app-menu"
      ></app-menu>
    </template>
    <template v-else>
      <logo :tabLeft="tabLeft" key="showLogo"/>
      <s-menu
        class="s_menu"
        :collapsed="collapsed"
        :menu="menus"
        :theme="theme"
        :mode="mode"
        @select="onSelect"
        style="padding: 16px 0; overflow-y: scroll;"
      ></s-menu>
    </template>
  </a-layout-sider>
</template>

<script>
import Vue from 'vue'
import Logo from '@/components/tools/Logo'
import SMenu from './index'
import AppMenu from './appIndex'
import { mixin, mixinDevice } from '@/utils/mixin'
import { primaryColor } from '@/config/defaultSettings'
import IconFont from '@/utils/icon'
import { getSystemName } from '@/utils/util'

export default {
  name: 'SideMenu',
  components: { Logo, SMenu, IconFont, AppMenu },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline',
    },
    theme: {
      type: String,
      required: false,
      default: 'dark',
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false,
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false,
    },
    menus: {
      type: Array,
      required: true,
    },
    tabLeft: {
        type: Array,
        default: ()=>{return []}
    }
  },
  data() {
    return {
      homeMenu: null,
      homeMenuWidth: '256px',
      appTitleHeight: 70
    }
  },
  mounted() {
    // 设置title
    let sysName = getSystemName(this.$route.path)
    if (sysName == 'village' || sysName == 'property') {
      this.homeMenuWidth = '226px'
    }
    const sysMenu = sysName + '_system_menu'
    const menuList = Vue.ls.get(sysMenu)
    const path = this.$route.path
    const arr = menuList.filter((item) => item.path == path)
    if (arr.length) {
      const app_id = arr[0].app_id
      if (app_id) {
        const storageName = 'home_menu_' + app_id
        const homeMenu = Vue.ls.get(storageName)
        if (homeMenu) {
          this.homeMenu = homeMenu
        }
      }
    }
    this.$nextTick(() => {
        if(this.$refs.appTitle) {
            this.appTitleHeight = this.$refs.appTitle.offsetHeight
        }
    })
  },
  methods: {
    onSelect(obj) {
      // console.log('onselected', obj)
      this.$emit('menuSelect', obj)
    },
  },
}
</script>
<style scoped lang="less">
@import '../../layouts/antMenuSide.less';
.app-title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-bottom: 1px solid #001529;
  padding: 20px;
}
.ant-custom-theme-light {
    .app-title {
        border-bottom-color: #f1f1f1;
        background-color: #ffffff!important;
    }
}
.ant-custom-theme-dark {
    .app-title {
        color: #ffffff!important;
        background-color: #001529!important;
    }
}
.app-icon {
    margin-right: 12px;
}
.app-menu {
    overflow-y: auto;
}
.app-menu::-webkit-scrollbar {
    width: 0;
}
</style>