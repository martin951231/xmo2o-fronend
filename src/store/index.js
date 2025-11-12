/**
 *******************
 *   @author 郑亚莉
 *   @date 2020-05-08
 *   @description
 *******************
 */

import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import storestaff from './modules/storestaff.js'
import createPersistedState from 'vuex-persistedstate'
import keepalive from './modules/keepalive'
import config from './modules/config'
import customPage from './modules/customPage'

// default router permission control
// import permission from './modules/permission'

// 动态路由 + 权限控制
import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)
import { getSystemName } from '@/utils/util'

export default new Vuex.Store({
  // 持久化存储
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    reducer(val) {
      return {
        storestaff: val.storestaff,
      }
    }
  })],
  modules: {
    app,
    user,
    permission,
    storestaff,
    keepalive,
    config,
    customPage
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
