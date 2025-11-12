// with polyfills 处理浏览器兼容性 兼容es5 es6新语法
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import VueBus from 'vue-bus'

import {
  VueAxios,
  request
} from './utils/request'
import {
  getRouterPath,
  switchLang,
  loadJs,
  getCache,
  getCookie,
  getTokenName,
} from './utils/util'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

import bootstrap from './core/bootstrap' // 初始化主题、样式等
import './core/lazy_use' // 引入需要的依赖插件以及组件
import './permission' // permission control
import './utils/filter' // global filter
import './components/global.less'
import {
  Dialog
} from '@/components'


import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
import common from '@/utils/variable'
import echarts from 'echarts' // 引入echarts
import BaiduMap from 'vue-baidu-map'
import PerfectScrollbar from "perfect-scrollbar"
import "perfect-scrollbar/css/perfect-scrollbar.css"

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

import VueDND from 'awe-dnd'

import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

// 浏览器打印机
import Print from 'vue-print-nb'
Vue.use(Print)


import VueClipBoard from 'vue-clipboard2'
Vue.use(VueClipBoard);
Vue.prototype.zhCN = zhCN

Vue.use(VueDND)
Vue.prototype.$echarts = echarts // 引入组件

Vue.config.productionTip = false
Vue.use(preview)

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
Vue.use(Dialog)
Vue.use(VueBus)

// 请求方法挂载
Vue.prototype.request = request
// 获取路由地址方法挂载
Vue.prototype.getRouterPath = getRouterPath
// 多语言转换方法
Vue.prototype.L = switchLang
//获取缓存
Vue.prototype.$getCache = getCache
Vue.prototype.$tiandituMapKey = ''
Vue.prototype.$mapConfig = ''

if (process.env.NODE_ENV === 'development') {
  console.log('开发环境')
  if (location.host === 'localhost:8086') {
    location.href = location.href.replace('localhost:8086', common.DEV_BASE_PATH)
  }
} else {
  if (location.host === 'localhost:8086') {
    location.href = location.href.replace('localhost:8086', common.PRO_BASE_PATH)
  }
  console.log = () => {}
  console.debug = () => {}
  console.error = () => {}
}

const el_scrollBar = (el, options, events) => {
  //在元素上加上私有属性，但要确保不会和已有属性重复
  if (el._ps_ instanceof PerfectScrollbar) {
    for (let option in options) {
      el._ps_.settings[option] = options[option]
    }

    el._ps_.update();
  } else {
    //el上挂一份属性
    el._ps_ = new PerfectScrollbar(el, { ...options
    });

    for (let event in events) {
      if (event.indexOf('ps-') === 0) {
        el.addEventListener(event, events[event]);
      }
    }
  }
};

// 自定义Vue指令
Vue.directive("perfectScrollBar", {
  //使用inserted钩子函数（初次创建DOM）获取使用自定义指令处的dom
  inserted(el, binding, vnode) {
    //判断其样式是否存在position 并且position为"fixed", "absolute"或"relative"
    //如果不符合条件，抛个警告然顺便给其position自动加上"relative"，因为PerfectScrollbar实现原理就是对dom注入两个div，一个是x轴一个是y轴，他们两的position都是absolute。
    const rules = ["fixed", "absolute", "relative"];
    if (!rules.includes(window.getComputedStyle(el, null).position)) {
      console.warn(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join("、")}`);
      el.style.position = 'relative';
    }
    //el上挂上私有属性
    el_scrollBar(el, binding.value, vnode.componentOptions.listeners);
  },
  //更新DOM的时候
  componentUpdated(el, binding, vnode, oldVnode) {
    try {
      //vnode.context其实就是vue实例，这里其实无需实例也可直接用Vue的静态方法，故而也可以写成Vue.nextTick
      vnode.context.$nextTick(
        () => {
          el_scrollBar(el, binding.value, vnode.componentOptions.listeners);
        }
      )
    } catch (error) {
      console.error(error);
      el_scrollBar(el, binding.value, vnode.componentOptions.listeners);
    }
  }
})

// 添加全局v-focus指令
Vue.directive("focus", {
  inserted: function(el, { modifiers: { noKeyboard } }) {
    try {
      const tagName = el.tagName
      if (tagName !== "INPUT") {
        let child = el.children[0]
        if (child && child.tagName === "INPUT") {
          el = child
        }
      }
      el.focus();
      // 不弹起软键盘
      if (noKeyboard) {
        el.setAttribute("readonly", "readonly")
        var timer = null
        timer = setTimeout(() => {
          el.removeAttribute("readonly")
          clearTimeout(timer)
        }, 100)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
})

// 设置功能链接库全局引入
import LinkBases from './views/common/platform/linkBases/LinkBases'
Vue.prototype.$LinkBases = LinkBases.install

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')

//地图配置接口
window.getMapConfig = ()=>{
  request("/common/platform.index/getWebBaiduKey", {}).then((res) => {
    Vue.prototype.$mapConfig = res.map_config
    var baidu_web_ak = res.baidu_map_ak_web ? res.baidu_map_ak_web : '';
     //ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key 
    Vue.use(BaiduMap, {
      ak: baidu_web_ak
    })
  
    //高德地图引入
    if(res.map_config == 'amap'){
      const gaodeMap_URL = `https://webapi.amap.com/maps?v=2.0&key=${res.amap_map_web_key}&plugin=AMap.Scale,AMap.ToolBar,AMap.ControlBar,AMap.Geocoder,AMap.MouseTool,AMap.PolygonEditor`;
      // 插入script脚本
      loadJs(gaodeMap_URL);
    }else {
      if(res.tianditu_web_key){
        Vue.prototype.$tiandituMapKey = res.tianditu_web_key
        //天地图引入
        const tiandituMap_URL = `https://api.tianditu.gov.cn/api?v=4.0&tk=${res.tianditu_web_key}`;
        // 插入script脚本
        loadJs(tiandituMap_URL);
      }
    }
  
    const BMap_URL = "https://api.map.baidu.com/api?ak=" + baidu_web_ak + "&v=2.0&s=1&callback=onBMapCallback";
    if(baidu_web_ak){
      loadJs("https://mapv.baidu.com/gl/examples/static/common.js");
      loadJs("https://api.map.baidu.com/api?type=webgl&v=1.0&ak=" + baidu_web_ak);
    }
    return new Promise((resolve, reject) => {
        // 如果已加载直接返回
        if(typeof BMap !== "undefined") {
            resolve(BMap);
            return true;
        }
        // 百度地图异步加载回调处理
        window.onBMapCallback = function () {
            console.log("百度地图脚本初始化成功");
            resolve(BMap);
        };
        // 插入script脚本
        loadJs(BMap_URL);
    });
  })
}

//判断如果存在token，即表示已登录，可以调用地图配置接口
const token = getCookie(getTokenName(location.hash)) || Vue.ls.get(getTokenName(location.hash))
if(token){
  window.getMapConfig()
}