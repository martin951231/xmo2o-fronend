import Vue from 'vue'
import { welcome, setCookie, delCookie,commonStatHandle } from '@/utils/util'
import { request } from '@/utils/request'
import userPlatformApi from '@/api/user/platform/index'
import { getTokenName } from '@/utils/util'
import { getUserInfo } from '@/api/user/user'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    roles: [],
    info: {},
    config: undefined,
    tokenName: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_TOKEN_NAME: (state, tokenName) => {
      state.tokenName = tokenName
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 账号密码登录
    Login({ commit }, { userInfo, url, token = '' }) { // userinfo为用户信息，对象（包括账号密码验证码等）;url为请求路径
      return new Promise((resolve, reject) => {
        request(url, userInfo)
          .then(response => {
            const tokenName = getTokenName(url, token)
            Vue.ls.set(tokenName, response.ticket, null) // vue.ls存储到localstorage,持久化存储
            setCookie(tokenName, response.ticket, null) // 存入到cookie中
            commit('SET_TOKEN', response.ticket)// 存入到vuex
            commonStatHandle(tokenName)
            window.getMapConfig && window.getMapConfig()//获取地图配置
            resolve(response)
          }).catch(error => {
            reject(error)
          })
      })
    },
    // 微信扫码登录
    WxLogin({ commit }, { id, url }) {
      return new Promise((resolve, reject) => {
        request(url, { qrcode_id: id })
          .then(response => {
            if (response.ticket) {
              const tokenName = getTokenName(url)
              Vue.ls.set(tokenName, response.ticket, null)
              setCookie(tokenName, response.ticket, null)
              commit('SET_TOKEN', response.ticket)
              commonStatHandle(tokenName)
              window.getMapConfig && window.getMapConfig()//获取地图配置
              resolve(response)
            } else {
              resolve(false)
            }
          }).catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit }, params) {
      const url = getUserInfo(params.tokenName)
      return new Promise((resolve, reject) => {
        request(url, { tokenName: params.tokenName }).then(response => {
          const result = response
          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role) // 用户角色权限信息
            commit('SET_INFO', result) // 用户基本信息
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          commit('SET_NAME', { name: result.name, welcome: welcome() })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout({ commit, state }, tokenName) {
      // console.log('tokenName', tokenName)
      return new Promise((resolve) => {
        // 清除token和角色信息
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(tokenName)
        delCookie(tokenName)
        // delCookie('SYSTEM_ACCESS_TOKEN')
        commonStatHandle(tokenName)
        resolve()
      })
    }

  }
}

export default user
