import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle } from '@/utils/domUtil'
import path from '@/router/router-path.js'
import {
    getTokenName,
    getRouter,
    getSystemName,
    getSystemTitle,
    urlConversion,
    getCookie,
    routerPushMenuFirstPage,
} from './utils/util'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = path.whiteList //免登陆白名单
const noNavList = path.noNavList // 无菜单路由
const whiteLogin = path.whiteLogin //免自动跳转登录页面
// 路由导航钩子
// 1.进入路由之前 进行路由拦截
router.beforeEach((to, from, next) => {
    // 检查系统设置
    const sysConfig = store.getters.config
    if (Object.keys(sysConfig).length) {
        if (location.href.indexOf('http:') != -1 && sysConfig.use_https) {
            // 换成https
            window.location.href = urlConversion(location.href)
        }
    } else {
        store.dispatch('SetConfig')
    }
    // 主题切换
    const sysName = getSystemName(to.path)
    if ((sysName == 'platform' || sysName == 'property' || sysName == 'village') && to.meta.app_id == null) {
        if (store.getters.theme == 'light') {
            store.dispatch('ToggleTheme', 'dark')
        }
    } else {
        if (store.getters.theme == 'dark') {
            store.dispatch('ToggleTheme', 'light')
        }
    }
    console.log('路由钩子', to, from)
    const loginPath = getRouter(to.path, 'login') // 登录
    const defaultRoutePath = getRouter(to.path, 'index') // 首页
    const tokenName = getTokenName(to.path)
    const fullPath = to.fullPath

    NProgress.start()
    // 设置页面title
    const title = to.meta.documentTitle || to.meta.title
    to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(title, getSystemTitle(to.path))
    console.log('tokenName===>', tokenName)
    if (
        (Vue.ls.get(tokenName) || getCookie(tokenName) || path.navList.includes(to.name)) &&
        !whiteLogin.includes(fullPath)
    ) {
        // 不同系统对应不同的 token
        /* has token */
        if (to.path === loginPath) {
            next({ path: defaultRoutePath }) // 根据路由规范判断进入哪个首页
            NProgress.done()
        } else {
            if (sysName == 'storestaff' || noNavList.includes(to.path)) {
                // 店员不需要左侧菜单 直接进入首页
                next()
                NProgress.done()
            } else if (store.getters.roles.length === 0) {
                // 若未获取用户信息和权限信息，则请求用户信息
                store
                    .dispatch('GetInfo', { tokenName })
                    .then((res) => {
                        const roles = res && res.role
                        store.dispatch('GenerateRoutes', { roles, tokenName, url: to.path }).then(() => {
                            // 对照权限生成动态路由
                            // 动态添加可访问路由表
                            router.addRoutes(store.getters.addRouters)

                            // GOMENUFIRST = 1 跳转左侧菜单第一个
                            let query = to.query
                            if (query && query.GOMENUFIRST && query.GOMENUFIRST == 1) {
                                let firstPageInfo = routerPushMenuFirstPage(store.getters.addRouters)
                                Vue.delete(query, 'GOMENUFIRST')
                                if (firstPageInfo && (firstPageInfo.path || firstPageInfo.redirect)) {
                                    next({
                                        path: firstPageInfo.redirect || firstPageInfo.path,
                                        query: query,
                                    })
                                } else {
                                    next({
                                        path: to.path,
                                        query: query,
                                    })
                                }
                            } else {
                                next({
                                    path: to.path,
                                    query: to.query,
                                })
                            }
                        })
                    })
                    .catch(() => {
                        notification.error({
                            message: '登录超时',
                            description: '请重新登录',
                        })
                        store.dispatch('Logout', tokenName).then(() => {
                            next({ path: loginPath }) // 根据路由规范判断进入哪个登录页
                        })
                    })
            } else {
                next()
            }
        }
    } else {
        if (whiteList.includes(to.name)) {
            // 在免登录白名单，直接进入
            next()
        } else {
            //, query: { redirect: to.fullPath }
            next({ path: loginPath })
            NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
        }
    }
})

// 2. 进入路由之后
router.afterEach(() => {
    NProgress.done() // finish progress bar
})
