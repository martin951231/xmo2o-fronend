<template>
    <div id="app" class="scroll_content">
        <a-config-provider :locale="locale">
            <router-view v-if="isRouterAlive && loadLangFinish" />
        </a-config-provider>
    </div>
</template>

<script>
import { AppDeviceEnquire } from '@/utils/mixin'
import { getSystemName,commonStatHandle } from '@/utils/util'
import { setSystemStyle } from '@/utils/domUtil'
import zhCN from 'ant-design-vue/lib/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
let _this = null
// 平台独有样式
const currentSystem = getSystemName(location.hash)
const PLATFORM_STYLE = '.ant-form-explain{ font-size: 12px !important;}'
import {orderNotice,clearNotice} from '@/utils/storestaff'
import Vue from 'vue'
export default {
  mixins: [AppDeviceEnquire],
  provide() {
    // 父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload,
    }
  },
  data() {
    return {
      locale: zhCN,
      isRouterAlive: true, // 控制视图是否显示的变量
      loadLangFinish: false,
    }
  },
  mounted() {
    const tokenName = Vue.ls.get('storestaff_access_token')
    if(currentSystem == 'storestaff' && tokenName && tokenName != null) {
        clearNotice()
        orderNotice()
    }
    currentSystem && commonStatHandle()

    _this = this
    this.relaodLang(this.$store.getters.setLangFinish)
    this.setStyles()
  },
  beforeDestroy() {
    if(currentSystem == 'storestaff') {
        clearNotice()
    }
    currentSystem && commonStatHandle()
  },
  watch: {
    '$store.getters.setLangFinish'(val) {
      this.relaodLang(val)
    },
  },
  methods: {
    reload() {
      this.isRouterAlive = false // 先关闭
      this.$nextTick(function () {
        this.isRouterAlive = true // 再打开
      })
    },
    relaodLang(val) {
      if (currentSystem == 'merchant' || currentSystem == 'storestaff') {
        this.loadLangFinish = val
      } else {
        this.loadLangFinish = true
      }
    },
    // 动态添加style标签
    setStyles() {
      if (currentSystem == 'platform') {
        setSystemStyle(PLATFORM_STYLE)
      }
    },
  },
}
// 在window对象上暴露出一个变量，赋值一个函数
window.a = () => {
  // 当iframe中的报表提交按钮点击之后，回调此方法
  window.scrollTo(0, 0)
}

// 标识当前页面是否是O2O页面
window.isO2OSystem = true
</script>

<style lang="less">
@import './common/css/common.css';
@import './common/css/global.css';
</style>
