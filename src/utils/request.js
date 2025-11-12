import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { getTokenName, getCookie, setCookie, getSystemName } from './util'

const baseUrl = location.protocol + '//' + location.host + '/v20/public/index.php' // 后端基础地址
const old_baseUrl = location.protocol + '//' + location.host
// const baseUrl = 'https://www.zhongxiang2020.com/v20/public/index.php' // 后端基础地址
// const old_baseUrl = 'https://www.zhongxiang2020.com'
// 创建 axios 实例
const service = axios.create({
    baseURL: baseUrl, // api base_url
    timeout: 600000, // 请求超时时间
})

// 老版本接口
const old_service = axios.create({
    baseURL: old_baseUrl, // api base_url
    timeout: 600000, // 请求超时时间
})

/**
 *******************
 *   @author 郑亚莉
 *   @date 2020-05-13
 *   @description  请求公共方法 异步
 *   @params url 请求路径
 *   @params data 请求参数
 *   @params method 请求方式 默认为post 不传默认为post
 *******************
 */
function request(url, data = {}, method = 'post', msgFunc) {
    data = data || {}

    var tokenName = getTokenName(url)
    if (data && data.tokenName) {
        tokenName = data.tokenName
        delete data.tokenName
    }
    var hash_arr = location.hash.split('requestType=')
    if (hash_arr && hash_arr[1]) {
        data.requestType = hash_arr[1]
    }
    data.system_type = getSystemName(tokenName)
    let token = Vue.ls.get(tokenName)
    const cookieToken = getCookie(tokenName)
    if (!cookieToken) {
        // 如果没有cookie 也清除ticket
        token = null
        Vue.ls.remove(tokenName)
    } else if (cookieToken && token != cookieToken) {
        // 保持cookie和token值相同
        token = cookieToken
        Vue.ls.set(tokenName, token, null)
    }
    return new Promise((resolve, reject) => {
        const options = {
            url,
            method,
        }
        if (method.toLowerCase() === 'get') {
            options.params = data
        } else {
            options.data = data
        }
        if (token) {
            options.headers = {
                ticket: token,
            }
        }
        service(options)
            .then((res) => {
                if (typeof res.refresh_ticket != 'undefined' && res.refresh_ticket) {
                    // 后台反馈了 刷新token 替换当当前存储的中
                    console.log('刷新token', res.refresh_ticket)
                    Vue.ls.set(tokenName, res.refresh_ticket, null) // vue.ls存储到localstorage,持久化存储
                    setCookie(tokenName, res.refresh_ticket, null) // 存入到cookie中
                }
                if (res.data) {
                    // console.log('post', res, tokenName)
                    if (res.data.err_code == '2') {
                        notification.error({
                            message: '登录超时',
                            description: res.data.msg,
                        })
                        localStorage.removeItem('watch_login_role')
                        localStorage.removeItem('watch_current_village_id')
                        this.$router.push({ name: 'communityWatchLogin' })
                    }
                    resolve(res.data)
                } else {
                    resolve(res)
                }
                typeof msgFunc === 'function' && msgFunc(res.msg)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/**
 *******************
 *   @author 郑亚莉
 *   @date 2020-05-13
 *   @description 错误拦截
 *  * @param  integer $status    状态码
 *                            1000 		= 正常
 *                            1001		= 必填参数缺失错误
 *                            1002		= 用户权限错误（需跳转登录）
 *                            1003		= 业务逻辑错误
 *                            1004		= 请求地址错误
 *                            1005      = 服务器端代码异常
 *                            1301      = 新开窗口跳转地址（data存放跳转地址）
 *                            1302      = 当前窗口跳转地址（data存放跳转地址）
 *******************
 */
const err = (error) => {
    console.log('请求发生了错误', error)
    const errStatus = error.status
    if (errStatus == 1002) {
        notification.error({
            message: '登录过期',
            duration: 4,
        })
        // 登出
        const tokenName = getTokenName(window.location.hash)
        store.dispatch('Logout', tokenName).then(() => {
            window.location.reload()
        })
    } else if (errStatus == 1501) {
        console.log('请求发生了错误11', error.data)
        var title = error.data.title ? error.data.title : '提示'
        var tip = error.data.tip ? error.data.tip : '注意跳转'
        var url = error.data.url ? error.data.url : ''
        var logout = error.data.logout ? error.data.logout : 0
        console.log('title', title)
        console.log('tip', tip)
        console.log('url', url)
        Vue.prototype.$info({
            title: title,
            content: tip,
            centered: true,
            onOk() {
                console.log('ok')
                if (logout) {
                    const tokenName = getTokenName(window.location.hash)
                    store.dispatch('Logout', tokenName).then(() => {
                        if (url) {
                            window.location.href = url
                        } else {
                            window.location.reload()
                        }
                    })
                } else {
                    if (url) {
                        window.location.href = url
                    }
                }
            },
        })
    } else if (errStatus == 1301) {
        window.open(error.data, '_blank')
    } else if (errStatus == 1302) {
        location.href = error.data
    } else {
        let msg = '系统错误，请重试'
        switch (errStatus) {
            case 1001:
                msg = '必填参数缺失'
                break
            case 1003:
                msg = '业务逻辑错误'
                break
            case 1004:
                msg = '请求地址错误'
                break
            case 1005:
                msg = '服务器端代码异常'
                break
            default:
                break
        }
        notification.error({
            message: '错误',
            description: error.msg || msg,
            duration: 4,
        })
    }
    return Promise.reject(error)
}

/**
 *******************
 *   @author 郑亚莉
 *   @date 2020-05-13
 *   @description 发出请求拦截器
 *******************
 */
service.interceptors.request.use((config) => {
    return config
}, err)

/**
 *******************
 *   @author 郑亚莉
 *   @date 2020-05-13
 *   @description 返回数据处理
 *******************
 */
service.interceptors.response.use((response) => {
    // zhengyali response data 不需要打印就注掉、、zyl
    // eslint-disable-next-line new-cap
    // const resConsole = new resData(response)
    // console.table(resConsole)
    // 状态码判断 除1000以外都为异常
    if (response.data.status === 1000) {
        // 请求成功返回数据
        return response.data
    } else {
        return err(response.data)
    }
}, err)

const installer = {
    vm: {},
    install(Vue) {
        Vue.use(VueAxios, service)
    },
}

function resData(res) {
    this.status = res.data.status
    this.url = res.config.url
    this.responseData = JSON.stringify(res.data.data)
    this.msg = res.data.msg
}

function old_request(url, data = {}, method = 'post') {
    return new Promise((resolve, reject) => {
        const options = {
            url,
            method,
        }
        if (method.toLowerCase() === 'get') {
            options.params = data
        } else {
            options.data = data
        }
        old_service(options)
            .then((res) => {
                resolve(res.data)
            })
            .catch((error) => {
                reject(error)
                console.error(error)
            })
    })
}

export { installer as VueAxios, service as axios, request, old_request }

// 导出请求方法
// export default request
