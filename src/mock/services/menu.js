/**
 *******************
 *   @author 郑亚莉
 *   @date 2020-04-27
 *   @description 菜单列表mock数据
 *******************
 */

import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const menu = (options) => {
  return builder({
    'data': [
      //首页
      {
        'key': '0',
        'path': '/index',
        'type': 1,// 1路由 2按钮
        'description': '',
        'sort': 1,
        'title': '首页test',
      },
      // 系统设置
      {
        'key': '1',
        'title': '系统管理',
        'path': '/system',
        'type': 1,
        'description': '这是系统设置菜单',
        'sort': 1,
        'children': [
          {
            'key': '2',
            'title': '菜单管理',
            'path': '/system/menu',
            'type': 1,
            'description': '菜单管理描述',
            'sort': 1,
            'children': [
              {
                'key': '3',
                'title': '新建',
                'type': 2,
                'sort': 1

              },
              {
                'key': '4',
                'title': '编辑',
                'type': 2,
                'sort': 2
              },
              {
                'key': '5',
                'title': '删除',
                'type': 2,
                'sort': 3
              }
            ]
          },
          {
            'key': '6',
            'title': '角色管理',
            'path': '/system/role',
            'type': 1,
            'description': '',
            'sort': 2
          }
        ]
      },
      // 示例
      {
        'key': '7',
        'title': '示例',
        'type': 1,
        'description': '这是示例菜单',
        'sort': 1,
        'children': [
          {
            'key': '8',
            'title': '表单页',
            'path': '/example/form',
            'type': 1,
            'description': '表单页',
            'sort': 1,
            'children': [
              {
                'key': '9',
                'title': '编辑',
                'type': 2,
                'sort': 2
              }
            ]
          },
          {
            'key': '10',
            'title': '列表页',
            'path': '/example/list',
            'type': 1,
            'description': '',
            'sort': 2
          },
          {
            'key': '11',
            'title': '详情页',
            'path': '/example/profile',
            'type': 1,
            'description': '',
            'sort': 2
          }
        ]
      },
    ]
  })
}

const checkedMenu = (options) => {
  const checked = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  return builder({ data: checked })
}

Mock.mock(/\/menu\/list/, 'get', menu)
Mock.mock(/\/menu\/checkedMenu/, 'get', checkedMenu)
