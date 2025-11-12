/**
 *******************
 *   @author 郑亚莉
 *   @date 2020-04-29
 *   @description 公共方法
 *******************
 */
import { SYSTEM_TYPES } from '@/store/mutation-types'
import path from '@/router/router-path'
import Vue from 'vue'
import moment from 'moment'
import store from '@/store'
import { old_request, request } from './request'
import { getUserMenu } from '@/api/user/user'
import router from '@/router'
import { message } from 'ant-design-vue'
import Coordinate from "@/utils/coordinate"

const dateFormat = 'YYYY-MM-DD'
const timeFormat = 'HH:mm:ss'
const dtFormat = 'YYYY-MM-DD HH:mm:ss'

// 获取cookie
export function getCookie(name) {
    var arr = []
    var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if ((arr = document.cookie.match(reg))) {
        return unescape(arr[2])
    } else {
        return null
    }
}

// 设置cookie,增加到vue实例方便全局调用
// eslint-disable-next-line camelcase
export function setCookie(c_name, value, expiredays, path) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    // eslint-disable-next-line camelcase
    // console.log(c_name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString()) + ((path == null) ? ';path=/' : ';path=' + path));
    document.cookie =
        c_name + '=' + escape(value) + (expiredays == null ? '' : ';expires=' + exdate.toGMTString()) + ';path=/'
}

// 删除cookie
export function delCookie(name) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 100000)
    var cval = getCookie(name)
    if (cval != null) {
        document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/'
    }
}

// 判断接口或路由所属系统并返回当前系统名称
export function getSystemName(url) {
    let systemName_arr = []
    if (url) {
        url = url.toLowerCase()
        systemName_arr = SYSTEM_TYPES.filter((item) => url.indexOf(item) !== -1)
        if (systemName_arr.length > 1) {
            if (systemName_arr[0] == 'community') {
                if (systemName_arr[2] == 'meter') {
                    return systemName_arr[2]
                }
                return systemName_arr[1]
            }
            systemName_arr = SYSTEM_TYPES.filter((item) => url.indexOf('/' + item) !== -1)
        }
    }
    return systemName_arr.length ? systemName_arr[0] : null
}

// 获取系统后台的名称 url为系统名或者接口、路由等
export function getSystemTitle(url) {
    const systemName = getSystemName(url)
    let title = '系统后台'
    let nameTitle = ''
    switch (systemName) {
        case 'platform':
            title = '系统后台'
            break
        case 'merchant':
            title = '商家后台'
            break
        case 'storestaff':
            title = '店员后台'
            break
        case 'community':
            nameTitle = '街道/社区后台'
        case 'property':
            if (!nameTitle) {
                nameTitle = '物业后台'
            }
        case 'village':
            if (!nameTitle) {
                nameTitle = '小区后台'
            }
            let user = store.getters.userInfo
            if (user.loginTitle) {
                title = user.loginTitle
            } else {
                title = nameTitle
            }
            break
    }
    return title
}

// 判断接口或路由所属系统并返回token名称 url:接口请求路径或路由
export function getTokenName(url, token = '') {
    if (token) {
        return token
    }
    return getSystemName(url) + '_access_token'
}

/**
根据系统名称返回不同的登录路由首页路由等
system 系统名称 或 接口名 或 路由地址
type 获取的页面 login: 登录页面; index: 首页; register: 注册页;
*/
export function getRouter(system, type) {
    const systemName = getSystemName(system)
    let routerName = ''
    // console.log('systemName', systemName, system, type)
    if (!systemName && type === 'login') {
        // 如果路由不带系统信息则默认跳入系统后台
        routerName = 'platformLogin'
    } else if (type === 'login') {
        routerName = systemName + 'Login'
    } else if (type === 'index') {
        routerName = systemName + 'Index'
    } else if (type === 'register') {
        routerName = systemName + 'Register'
    }
    return path[routerName]
}

/**
根据路由name返回路由的path
*/
export function getRouterPath(name) {
    const sysMenu = getSystemName(window.location.hash) + '_system_menu'
    const menu = Vue.ls.get(sysMenu)
    if (menu && menu.length) {
        const menuObj = menu.find((item) => {
            return item['name'] == name
        })
        return menuObj.path
    } else {
        return '/'
    }
}

/**
修改switch默认值
list: 后端获取的form数据数组 数组
formData：表单数据 对象
types：需要修改的type 数组
*/
export function transferFormValue(list, formData, types) {
    if (types.length && list.length) {
        for (const type of types) {
            switch (type) {
                case 'switch':
                    const switchs = list.filter((item) => {
                        return item['type'] == type
                    })
                    if (switchs.length) {
                        for (const item of switchs) {
                            formData[item.name] = formData[item.name] ? '1' : '0'
                        }
                    }
                    break
                case 'date':
                    const dates = list.filter((item) => {
                        return item['type'] == type
                    })
                    if (dates.length) {
                        for (const item of dates) {
                            formData[item.name] = moment(formData[item.name]).format(dateFormat)
                        }
                    }
                    break
                case 'time':
                    const times = list.filter((item) => {
                        return item['type'] == type
                    })
                    if (times.length) {
                        for (const item of times) {
                            formData[item.name] = moment(formData[item.name]).format(timeFormat)
                        }
                    }
                    break
                case 'image':
                    const images = list.filter((item) => {
                        return item['type'] == type
                    })
                    if (images.length) {
                        for (const item of images) {
                            if (formData[item.name] && formData[item.name].length) {
                                formData[item.name] = formData[item.name][0]
                            }
                        }
                    }
                    break
                default:
                    break
            }
        }
    }
    return formData
}

//  表单数据里的日期moment格式转化为string
export function dateToDateString(formData, types) {
    for (const t in types) {
        for (const k in formData) {
            // 要转化的格式
            if (t == k) {
                if (formData[k] != null && typeof formData[k] === 'object') {
                    // 数组
                    if (typeof formData[k].length === 'number' && formData[k].length > 0) {
                        formData[k].forEach((i) => {
                            if (i != null && typeof i === 'object') {
                                i = timeToString(i, types[t])
                            }
                        })
                    } else {
                        formData[k] = timeToString(formData[k], types[t])
                    }
                }
            }
        }
    }
    return formData
}
// 验证对象是否是moment格式 如果是返回时间的字符串格式
function timeToString(obj, type) {
    if (type == 'date') {
        return moment(obj).format(dateFormat)
    } else if (type == 'time') {
        return moment(obj).format(timeFormat)
    } else if (type == 'datetime') {
        return moment(obj).format(dtFormat)
    } else {
        return false
    }
}

export function timeFix() {
    const time = new Date()
    const hour = time.getHours()
    return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
    const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
    const index = Math.floor(Math.random() * arr.length)
    return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
    const event = document.createEvent('HTMLEvents')
    event.initEvent('resize', true, true)
    event.eventType = 'message'
    window.dispatchEvent(event)
}

export function handleScrollHeader(callback) {
    let timer = 0

    let beforeScrollTop = window.pageYOffset
    callback = callback || function () {}
    window.addEventListener(
        'scroll',
        (event) => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                let direction = 'up'
                const afterScrollTop = window.pageYOffset
                const delta = afterScrollTop - beforeScrollTop
                if (delta === 0) {
                    return false
                }
                direction = delta > 0 ? 'down' : 'up'
                callback(direction)
                beforeScrollTop = afterScrollTop
            }, 50)
        },
        false
    )
}

export function isIE() {
    const bw = window.navigator.userAgent
    const compare = (s) => bw.indexOf(s) >= 0
    const ie11 = (() => 'ActiveXObject' in window)()
    return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
    if (id === '') {
        return
    }
    setTimeout(() => {
        document.body.removeChild(document.getElementById(id))
    }, timeout)
}

// 判断数据是否为空
export function isEmpty(data) {
    if (!data || (data instanceof Array && data.length == 0)) {
        // 空字符串、undefined、 空数组
        return true
    } else if (data instanceof Object && JSON.stringify(data) == '{}') {
        // 空对象
        return true
    } else {
        return false
    }
}

// http => https
export function urlConversion(path) {
    let reg = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i
    path = path.replace(reg, 'https://$2$3$4$5$6')
    return path
}

//获取当前日期
export function getNowFormatDate() {
    var date = new Date()
    var seperator1 = '-'
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    if (month >= 1 && month <= 9) {
        month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate
    return currentdate
}

/**
 *
 * @param property 对象数组 根据对象中某个字段排序
 * @param sort 1正序 2倒序
 * @returns {function(*, *): *}
 */
export function compare(property, sort = 1) {
    return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        if (sort == 1) {
            return value1 - value2
        } else {
            return value2 - value1
        }
    }
}

/**
 * @param keywords 要替换的文字
 * @param params 文字中的参数 可不传
 * @param defaultTxt 默认文本 可不传
 * @returns keywords 替换后的文字
 */
export function switchLang(keywords = '', params = {}, defaultTxt = '') {
    const config = store.getters.config
    if (!keywords) {
        return ''
    }
    if (config.open_multilingual == 1) {
        if (store.getters.nowLang == 'chinese' && defaultTxt) {
            keywords = defaultTxt
        } else {
            keywords = changeText(keywords, params)
        }
    } else {
        keywords = changeText(keywords, params)
    }
    return keywords
}
function changeText(keywords, params) {
    const langList = store.getters.langData
    if (langList && Object.keys(langList).length) {
        // 如果有多语言
        let langTxt = langList[keywords]
        if (langTxt == undefined) {
            // 没有返回
            store.dispatch('ReportLang', { keywords })
        }
        if (langTxt == '' || !langTxt) {
            // 没有翻译 || 就是中文
            langTxt = keywords
        }
        keywords = langTxt
    }
    // 替换变量
    if (keywords.indexOf('X1') != -1) {
        keywords = keywords.replace(/X1/, params.X1)
    }
    if (keywords.indexOf('X2') != -1) {
        keywords = keywords.replace(/X2/, params.X2)
    }
    return keywords
}

function reportLanguage(keywords) {
    store.dispatch('ReportLang', { keywords })
}
export function getLangDisplay(key) {
    const config = store.getters.config
    let text = key
    if (config && config.lang_config && config.lang_config.lang_list && config.lang_config.lang_list.length) {
        const list = config.lang_config.lang_list
        list.forEach((item) => {
            if (item.val == key) {
                text = item.display
            }
        })
    }
    return text
}

// 登录后跳转菜单里第一个页面
export function routerPushMenuFirstPage(menus = []) {
    if (!menus.length) return ''
    let firstPage = ''
    for (let item of menus) {
        if (!item.hideChildrenInMenu && item.children && item.children.length) {
            firstPage = routerPushMenuFirstPage(item.children)
            break
        } else {
            if (item.hideChildrenInMenu) {
                let children = item.children || []
                if (children.length) {
                    let index = children.findIndex((sItem) => !sItem.hidden)
                    if (index != -1) {
                        firstPage = children[index]
                        break
                    } else {
                        firstPage = item
                        break
                    }
                } else {
                    firstPage = item
                    break
                }
            } else {
                if (!item.hidden) {
                    firstPage = item
                    break
                }
            }
        }
    }
    return firstPage
}

// 平台管理员、商家、店员登录成功之后 轮询 后台更改了用户密码  账号不会自动退出重新登录
let commonStatHandleTimer = null
export function commonStatHandle(tokenName = '', time = 10) {
    tokenName = tokenName || getTokenName(location.hash)
    if (!tokenName) return
    let commonStatHandleTimerClear = () => {
        if (commonStatHandleTimer) {
            window.clearInterval(commonStatHandleTimer)
            clearInterval(commonStatHandleTimer)
            commonStatHandleTimer = null
        }
    }
    const token = getCookie(tokenName) || Vue.ls.get(tokenName)
    if (!token || token == 'null' || token == 'undefined') {
        commonStatHandleTimerClear()
        return
    }

    request('/common/common.Index/stat', { tokenName })
        .then((res) => {
            commonStatHandleTimerClear()
            commonStatHandleTimer = setInterval(() => {
                commonStatHandle(tokenName, time)
            }, time * 1000)
        })
        .catch(() => {
            commonStatHandleTimerClear()
        })
}

export function loadJs(url, callback) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    if (typeof callback != 'undefined') {
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null
                    callback()
                }
            }
        } else {
            script.onload = function () {
                callback()
            }
        }
    }
    script.src = url
    document.body.appendChild(script)
}

// 更新左侧菜单
export function _updateMenu(path, _this, callback) {
    //path当前子路由,页面的this,callback回调
    let tokenName = getSystemName(_this.$route.path) + '_access_token'
    let url = path
    store.dispatch('GetInfo', { tokenName }).then((res) => {
        const roles = res && res.role
        store.dispatch('GenerateRoutes', { roles, tokenName, url: url }).then(() => {
            // 发射全局事件去更新路由
            _this.$bus.$emit('updateMenu', store.state.permission.addRouters)
            router.addRoutes(store.getters.addRouters)
            callback && callback()
        })
    })
}

// 颜色16进制转rgba
export function colorRgb(colorHex, opacityVal = 1) {
    // 16进制颜色值的正则
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    // 把颜色值变成小写
    let color = colorHex.toLowerCase()
    if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
            let colorNew = '#'
            for (let i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1))
            }
            color = colorNew
        }
        // 处理六位的颜色值，转为RGB
        let colorChange = []
        for (let i = 1; i < 7; i += 2) {
            colorChange.push(parseInt('0x' + color.slice(i, i + 2)))
        }
        return 'rgba(' + colorChange.join(',') + ',' + opacityVal + ')'
    } else {
        return color
    }
}

// 获取系统缓存数据
export function getCache(key) {
    return Vue.ls.get(key)
}

/**唯一标识符
 * @param {Number} len uuid的长度
 * @param {String} initial 首字母置
 * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
 */
let guid = (len = 32, initial = true, radix = null) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const uuid = []
    radix = radix || chars.length

    if (len) {
        // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
        for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
    } else {
        let r
        // rfc4122标准要求返回的uuid中,某些位为固定的字符
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | (Math.random() * 16)
                uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
            }
        }
    }
    // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
    if (initial) {
        uuid.shift()
        return `${initial}${uuid.join('')}`
    }
    return uuid.join('')
}
export { guid }

/**
 *  图片fileList
 */
export function imgUploadFileListHandle(list = [], prefix = 'img', keyName = '') {
    if (!list.length) return []
    let fileList = list.map((item, index) => {
        let uid = `${guid(12, prefix)}_${prefix}_${index}`
        return {
            name: `${uid}_name_${index}`,
            status: 'done',
            uid: uid,
            url: keyName ? item[keyName] : item,
            response: {
                code: 1000,
                msg: '',
                data: {
                    fileUrl: keyName ? item[keyName] : item,
                },
            },
        }
    })
    return fileList
}

/**
 *  图片上传
 */
export function imgUploadHandle(info, multiple = false) {
    const status = info.file.status
    let fileList = [...info.fileList]
    let resultData = multiple ? [] : {}
    if (status == 'uploading') {
        return {
            fileList,
            resultData,
        }
    }
    if(!multiple && fileList.length > 1) {
        fileList = fileList.splice(-1)
    }
    if (status == 'done' && fileList.length) {
        fileList.map((file, index) => {
            if (file.response) {
                const { code = 1000, msg = '上传失败', data = '' } = file.response
                let fileUrl = {
                    fileUrl: data
                }
                if (code == 1000) {
                    if (multiple) {
                        resultData.push(fileUrl)
                    } else {
                        resultData = { ...fileUrl }
                    }
                } else {
                    message.error(msg)
                    fileList.splice(index, 1)
                }
            }
        })
    } else if (status === 'error') {
        message.error('上传失败')
    }
    return {
        fileList,
        resultData,
    }
}

// 图片上传 预览originFileObj 转base64
export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

export function initKFMessage (text,emojiJSON)  {
    if (!text) return;
    // 定义一个函数来将特定格式的字符串替换为图片
    function replaceWithEmojiImages(text) {
      // 定义一个正则表达式来匹配 /::1f600::/ 格式的字符串
      const regex = /\/::(.*?)::\//g;

      // 使用 replace 方法和回调函数进行替换
      return text.replace(regex, (match, p1) => {
        // 构建图片标签
        const imgSrc = `${emojiJSON[match] ? emojiJSON[match].img_url : ""}`; // 假设图片存储在这个路径
        return `<img data-code="${match}" src="${imgSrc}" class="emoji-img"/>`;
      });
    }

    // 调用函数进行替换
    const outputText = replaceWithEmojiImages(text);
    return outputText;
}

export function getKFUid(str){
    let result = str.split('_').slice(0, 2).join('_');
    return result
}

export function sleep(value)  {
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve();
        }, value);
    });
}

//更新网站头部ico
export function changeFavicon(iconUrl) {
    // 查找现有的 favicon <link rel="icon">
    let link = document.querySelector("link[rel='icon']");

    // 如果没有找到 <link rel="icon">，就创建一个新的
    if (!link) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        document.head.appendChild(link);
    }

    // 如果当前 favicon 与传入的 iconUrl 不同，才更新 href
    if (link.href !== iconUrl) {
        link.href = iconUrl;
    }
}

//经纬度转换
export function coordinateFun(_lng, _lat, type='') {
	// wgs84ToBd09,gcj02ToBd09,gcj02ToWgs84,bd09ToGcj02,bd09ToWgs84
    let newFun = null
    let flag = type == 'submit'
    let funName = ''
    let params = {
        lat: _lat,
        lng: _lng,
    }
    let obj = {
        'amap': 'bd09ToGcj02',
        'tmap': 'bd09ToWgs84',
    }
    //提交的时候转成百度的
    if(type && type != 'submit'){
        //传了类型根据类型转
		newFun = Coordinate[type]
	}else if(Vue.prototype.$mapConfig == 'amap'){
        //高德地图
        funName = flag?'gcj02ToBd09':obj['amap']
        newFun = Coordinate[funName]
	}else{
		//天地图
		if(Vue.prototype.$tiandituMapKey){
            funName = flag?'wgs84ToBd09':obj['tmap']
            console.log(funName);
            newFun = Coordinate[funName]
		}
	}
    if(newFun){
        const [lng,lat] = newFun(_lng,_lat)
        params.lat = lat
        params.lng = lng
    }

    return params
}