import Mock from 'mockjs2'
import { builder } from '../util'

// 获取用户基本信息
const info = (options) => {
   const userInfo = {
      'name': 'zhengyali1', // 用户名
      'role': { // 用户权限（菜单和按钮的权限
        'id': 'admin', // 所属角色id
        'name': '管理员', // 角色名称
        'permissions': [ // 菜单权限
          {
            'permissionId': 'index', // 菜单的权限标识
            // 'actions': null, // 该菜单下的所有按钮集合,可不传
            'actionEntitySet': null // 本用户能看见和操作的按钮
          },
          {
            'permissionId': 'system',
            'actionEntitySet': [
              {
                'action': 'query',
                'describe': '查询',
                'defaultCheck': false
              },
              {
                'action': 'add',
                'describe': '新增',
                'defaultCheck': false
              }, {
                'action': 'delete',
                'describe': '删除',
                'defaultCheck': false
              }, {
                'action': 'edit',
                'describe': '修改',
                'defaultCheck': false
              }, {
                'action': 'enable',
                'describe': '是否禁用',
                'defaultCheck': false
              }]
          },
          {
            'permissionId': 'example',
            'actionEntitySet': [
              {
                'action': 'query',
                'describe': '查询',
                'defaultCheck': false
              },
              {
                'action': 'add',
                'describe': '新增',
                'defaultCheck': false
              },
              {
                'action': 'edit',
                'describe': '修改',
                'defaultCheck': false
              }, {
                'action': 'delete',
                'describe': '删除',
                'defaultCheck': false
              }]
          },
          {
            'permissionId': 'link',
            'actionEntitySet': null
          }
        ]
      }
    }
  return builder(userInfo)
}

// 获取菜单
const userNav = (options) => {
  const nav = [
    // 首页
    {
      'name': 'index', // 菜单name，保持唯一
      'parentId': 0, // 父菜单id，0表示为一级菜单
      'id': 1,
      'meta': { // 菜单显示配置
        'icon': 'control', // 菜单左侧图标，非必须
        'title': '首页test', // 菜单名称
        'show': true, // 菜单是否在左侧菜单栏显示
        'permission': 'index' // 菜单权限标识，无则所有角色可见
      },
      'component': 'Index', // 对应前端组件名称
      'path': '/index'// 显示路由
    },
    // system
    {
      'name': 'system',
      'parentId': 0,
      'id': 200,
      'meta': {
        'title': '系统设置',
        'show': true,
        'permission': 'system'
      },
      'redirect': '/menu',
      'component': 'PageView'
    },
    {
      'name': 'menu',
      'parentId': 200,
      'id': 210,
      'meta': {
        'title': '菜单',
        'show': true,
        'permission': 'system'
      },
      'component': 'MenuList',
      'path': '/menu'
    },
    {
      'name': 'role',
      'parentId': 200,
      'id': 220,
      'meta': {
        'title': '角色',
        'show': true,
        'permission': 'system'
      },
      'component': 'RoleList',
      'path': '/role'
    },
    // example
    {
      'name': 'example',
      'parentId': 0,
      'id': 100,
      'meta': {
        'icon': 'control',
        'title': 'example',
        'show': true,
        'permission': 'example'
      },
      'redirect': '/example/iframe/src=https%3a%2f%2fhf.pigcms.com%2fadmin.php%3fg%3dSystem%26c%3dIndex%26a%3dindex',
      'component': 'RouteView'
    },
    {
      'name': 'iframe2',
      'parentId': 100,
      'id': 1101,
      'meta': {
        'title': 'iframe2',
        'show': true,
        'permission': 'example'
      },
      'component': 'IframePage',
      'path': '/example/iframe/src=https%3a%2f%2fhf.pigcms.com%2fadmin.php%3fg%3dSystem%26c%3dIndex%26a%3dindex'
    },
    {
      'name': 'iframe3',
      'parentId': 100,
      'id': 1102,
      'meta': {
        'title': 'iframe3',
        'show': true,
        'permission': 'example'
      },
      'component': 'IframePage',
      'path': '/example/iframe/src=https%3A%2F%2Fwww.tapd.cn%2F'
    },
    {
      'name': 'form',
      'parentId': 100,
      'id': 120,
      'meta': {
        'title': '表单页',
        'show': true,
        'permission': 'example'
      },
      'redirect': '/form/base-form',
      'component': 'RouteView'
    },
    {
      'name': 'BasicForm',
      'parentId': 120,
      'id': 111,
      'meta': {
        'title': '基础表单',
        'show': true,
        'permission': 'example'
      },
      'component': 'BasicForm',
      'path': '/form/base-form'
    },

    // account
    {
      'name': 'account',
      'parentId': 0,
      'id': 10028,
      'meta': {
        'title': '个人页',
        'icon': 'user',
        'show': true
      },
      'redirect': '/account/center',
      'component': 'RouteView'
    },
    {
      'name': 'center',
      'parentId': 10028,
      'id': 10029,
      'meta': {
        'title': '个人中心',
        'show': true
      },
      'component': 'AccountCenter'
    },
    // 特殊三级菜单
    {
      'name': 'settings',
      'parentId': 10028,
      'id': 10030,
      'meta': {
        'title': '个人设置',
        'hideHeader': true, // 强制当前页面不显示 PageHeader 组件中的页面带的 面包屑和页面标题栏
        'hideChildren': true, // 隐藏子菜单
        'show': true
      },
      'redirect': '/account/settings/base',
      'component': 'AccountSettings'
    },
    {
      'name': 'BaseSettings',
      'path': '/account/settings/base',
      'parentId': 10030,
      'id': 10031,
      'meta': {
        'title': '基本设置',
        'show': false
      },
      'component': 'BaseSettings'
    },
    {
      'name': 'SecuritySettings',
      'path': '/account/settings/security',
      'parentId': 10030,
      'id': 10032,
      'meta': {
        'title': '安全设置',
        'show': false
      },
      'component': 'SecuritySettings'
    },
    {
      'name': 'CustomSettings',
      'path': '/account/settings/custom',
      'parentId': 10030,
      'id': 10033,
      'meta': {
        'title': '个性化设置',
        'show': false
      },
      'component': 'CustomSettings'
    },
    {
      'name': 'BindingSettings',
      'path': '/account/settings/binding',
      'parentId': 10030,
      'id': 10034,
      'meta': {
        'title': '账户绑定',
        'show': false
      },
      'component': 'BindingSettings'
    },
    {
      'name': 'NotificationSettings',
      'path': '/account/settings/notification',
      'parentId': 10030,
      'id': 10034,
      'meta': {
        'title': '新消息通知',
        'show': false
      },
      'component': 'NotificationSettings'
    }
  ]
  return builder(nav)
}

Mock.mock(/\/api\/user\/info/, 'get', info)
Mock.mock(/\/api\/user\/nav/, 'get', userNav)
