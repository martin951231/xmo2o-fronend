import Vue from 'vue'
import store from '@/store'

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const socialactivityAction = Vue.directive('saction', {
  inserted: function (el, binding, vnode) {
    const actionNames = binding.arg.split(',')
    const permissions = vnode.context.$route.meta.permissions || []
    
    // 检查是否有任一权限（支持多个action用逗号分隔，满足一个即可）
    const hasPermission = actionNames.some(actionName => {
      return permissions.some(p => p.action === actionName.trim())
    })
    
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  }
})

export default socialactivityAction
