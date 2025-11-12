/**
 * 向后端请求设置
 */
import Vue from 'vue'
import { request, old_request } from '@/utils/request'
import userPlatformApi from '@/api/user/platform'
import { urlConversion, getSystemName, setCookie, getTokenName, changeFavicon } from '@/utils/util'
import notification from 'ant-design-vue/es/notification'
import store from '../index'
import router from '../../router'
const sysName = getSystemName(location.hash)
const sessionLangListName = sysName + '_lang_list'
const sessionNowLangName = sysName + '_now_lang'
const config = {
    state: {
        config: {},
        langData: {}, //多语言
        setLangFinish: false, // 切换多语言成功标识
        nowLang: 'chinese', // 当前语言环境
    },
    mutations: {
        SET_CONFIG: (state, config) => {
            state.config = config
            state.config = Object.assign({}, state.config);
            //根据配置项动态设置网站ico
            if(config && config.site_favicon){
              changeFavicon(config.site_favicon)
            }
        },
        SET_LANG_FINISH: (state, finish) => {
            state.setLangFinish = finish
        },
        SET_LANG: (state, langData) => {
            state.langData = langData
        },
        SET_NOW_LANG: (state, nowLang) => {
            state.nowLang = nowLang
        },
        REPORT_LANG: (state, keywords) => {
            state.langData[keywords] = keywords
        },
    },
    actions: {
        SetVillageConfig({ commit }) {
            request('/community/village_api.VillageConfig/getConfig')
                .then((res) => {
                    commit('SET_CONFIG', res)
                    Vue.ls.set('system_config', res, null)
                    if (
                        res.open_multilingual == 1 &&
                        res.lang_config &&
                        res.lang_config.now_lang != config.state.nowLang
                    ) {
                        // 如果开启了多语言 选择默认语言
                        commit('SET_NOW_LANG', res.lang_config.now_lang)
                        this.dispatch('SetLang', { lang: res.lang_config.now_lang })
                    } else {
                        commit('SET_LANG_FINISH', true)
                    }
                })
                .catch((err) => {
                    console.log('err===>', err)
                })
        },
        // 基本设置
        SetConfig({ commit }) {
            getSystemConfig().then((res) => {
                commit('SET_CONFIG', res)
                Vue.ls.set('system_config', res, null)
                if (res.open_multilingual == 1 && res.lang_config && res.lang_config.now_lang != config.state.nowLang) {
                    // 如果开启了多语言 选择默认语言
                    commit('SET_NOW_LANG', res.lang_config.now_lang)
                    this.dispatch('SetLang', { lang: res.lang_config.now_lang })
                } else {
                    commit('SET_LANG_FINISH', true)
                }
            })
        },
        // 设置当前语言环境
        SetLang({ commit }, { lang = 'chinese' }) {
            commit('SET_LANG_FINISH', false)
            const sessionLangList = JSON.parse(sessionStorage.getItem(sessionLangListName))
            const sessionNowLang = sessionStorage.getItem(sessionNowLangName)
            if (sessionNowLang && sessionNowLang == lang && sessionLangList && Object.keys(sessionLangList).length) {
                // 如果当前语言为缓存中已有的（刷新）直接读取缓存的
                commit('SET_LANG', sessionLangList)
                commit('SET_NOW_LANG', lang)
                commit('SET_LANG_FINISH', true)
                return
            }
            if (!Object.keys(config.state.langData).length || config.state.nowLang != lang) {
                // 如果还没有获取多语言 || 切换语言
                getLangData(sysName, lang)
                    .then((res) => {
                        // 写入cookie和缓存
                        setCookie('system_lang', lang, null)
                        sessionStorage.setItem(sessionLangListName, JSON.stringify(res))
                        sessionStorage.setItem(sessionNowLangName, lang)
                        // 更新vuex触发更新（页面就不需要重载了）
                        commit('SET_LANG', res)
                        commit('SET_NOW_LANG', lang)
                        // 重新获取菜单
                        if (sysName == 'merchant') {
                            const tokenName = getTokenName(sysName)
                            store.dispatch('GetInfo', { tokenName }).then((res) => {
                                const roles = res && res.role
                                store.dispatch('GenerateRoutes', { roles, tokenName, url: location.hash }).then(() => {
                                    // 对照权限生成动态路由
                                    router.addRoutes(store.getters.addRouters)
                                    // 但是页面需要重新请求config接口(config接口内也有多语言内容)
                                    this.dispatch('SetConfig')
                                })
                            })
                        } else {
                            commit('SET_LANG_FINISH', true)
                        }
                    })
                    .catch((err) => {
                        console.log('切换语言失败了', err)
                        commit('SET_LANG_FINISH', true)
                        notification.error({
                            message: err,
                            duration: 4,
                        })
                    })
            }
        },
        // 上报语言
        ReportLang({ commit }, { keywords }) {
            old_request('/appapi.php?c=Lang&a=report', {
                from: sysName,
                keywords,
            })
                .then((res) => {
                    // console.log('上报成功')
                    // 上报成功后 扩充到langdata里，防止重复上报
                    commit('REPORT_LANG', keywords)
                })
                .catch((err) => {
                    console.log('上报失败')
                })
        },
    },
}

// 获取系统设置
function getSystemConfig() {
    return new Promise((resolve, reject) => {
        const parts = window.location.href.split('/')
        const lastPart = parts[parts.length - 1]
        let params = {
            xtype: '',
        }

        if (lastPart == 'Watchlogin' || lastPart == 'WatchBox') {
            params.xtype = 'sentryWatch'
        }
        request(userPlatformApi.config, params)
            .then((res) => {
                // 判断是否跳转https
                if (location.href.indexOf('http:') != -1 && res.use_https) {
                    // 换成https
                    window.location.href = urlConversion(location.href)
                }
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

// 修改默认选中语言
// function changeDefaultLang(lang) {
//   old_request('/merchant.php?g=Merchant&c=Public&a=change_lang', {
//     lang,
//   }, 'get').then(res => {
//     console.log('修改默认语言成功')
//   }).catch(err => {
//     console.log('修改默认语言失败', err)
//   })
// }

//获取多语言
function getLangData(from, lang) {
    return new Promise((resolve, reject) => {
        old_request('/appapi.php?c=Lang&a=get', {
            from,
            now_lang: lang,
        })
            .then((res) => {
                resolve(res.result)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

export default config
