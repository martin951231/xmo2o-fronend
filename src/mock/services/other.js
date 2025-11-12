import Mock from 'mockjs2'
import { builder } from '../util'

const orgTree = () => {
  return builder([{
    'key': 'key-01',
    'title': '研发中心',
    'icon': 'mail',
    'children': [{
      'key': 'key-01-01',
      'title': '后端组',
      'icon': null,
      'group': true,
      children: [{
        'key': 'key-01-01-01',
        'title': 'JAVA',
        'icon': null
      },
      {
        'key': 'key-01-01-02',
        'title': 'PHP',
        'icon': null
      },
      {
        'key': 'key-01-01-03',
        'title': 'Golang',
        'icon': null
      }
      ]
    }, {
      'key': 'key-01-02',
      'title': '前端组',
      'icon': null,
      'group': true,
      children: [{
        'key': 'key-01-02-01',
        'title': 'React',
        'icon': null
      },
      {
        'key': 'key-01-02-02',
        'title': 'Vue',
        'icon': null
      },
      {
        'key': 'key-01-02-03',
        'title': 'Angular',
        'icon': null
      }
      ]
    }]
  }, {
    'key': 'key-02',
    'title': '财务部',
    'icon': 'dollar',
    'children': [{
      'key': 'key-02-01',
      'title': '会计核算',
      'icon': null
    }, {
      'key': 'key-02-02',
      'title': '成本控制',
      'icon': null
    }, {
      'key': 'key-02-03',
      'title': '内部控制',
      'icon': null,
      'children': [{
        'key': 'key-02-03-01',
        'title': '财务制度建设',
        'icon': null
      },
      {
        'key': 'key-02-03-02',
        'title': '会计核算',
        'icon': null
      }
      ]
    }]
  }])
}

const role = () => {
  return builder({
    'data': [{
      'id': 'admin',
      'name': '管理员',
      'describe': '拥有所有权限',
      'status': 1, // 1启用 2禁用
      'creatorId': 'system',
      'createTime': '2019-12-12 14:00',
    },
      {
        'id': 'user',
        'name': '普通用户',
        'describe': '普通用户',
        'status': 1,
        'creatorId': 'system',
        'createTime': '2019-12-12 14:00',
      },
      {
        'id': 'test',
        'name': '测试用户',
        'describe': '测试用户',
        'status': 2,
        'creatorId': 'system',
        'createTime': '2019-12-12 14:00',
      }
    ],
    'pageSize': 10,
    'pageNo': 0,
    'totalPage': 1,
    'totalCount': 5
  })
}

const permissionNoPager = () => {
  return builder([{
    'id': 'marketing',
    'name': '营销管理',
    'describe': null,
    'status': 1,
    'actionData': '[{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
    'sptDaTypes': null,
    'optionalFields': null,
    'parents': null,
    'type': null,
    'deleted': 0,
    'actions': [
      'add',
      'query',
      'get',
      'edit',
      'delete'
    ]
  },
  {
    'id': 'member',
    'name': '会员管理',
    'describe': null,
    'status': 1,
    'actionData': '[{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
    'sptDaTypes': null,
    'optionalFields': '[]',
    'parents': null,
    'type': 'default',
    'deleted': 0,
    'actions': [
      'add',
      'query',
      'get',
      'edit',
      'delete'
    ]
  },
  {
    'id': 'menu',
    'name': '菜单管理',
    'describe': null,
    'status': 1,
    'actionData': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"查询"},{"action":"edit","defaultCheck":false,"describe":"修改"}]',
    'sptDaTypes': null,
    'optionalFields': '[]',
    'parents': null,
    'type': 'default',
    'deleted': 0,
    'actions': [
      'add',
      'import',
      'get',
      'edit'
    ]
  },
  {
    'id': 'order',
    'name': '订单管理',
    'describe': null,
    'status': 1,
    'actionData': '[{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
    'sptDaTypes': null,
    'optionalFields': '[]',
    'parents': null,
    'type': 'default',
    'deleted': 0,
    'actions': [
      'add',
      'query',
      'get',
      'edit',
      'delete'
    ]
  },
  {
    'id': 'permission',
    'name': '权限管理',
    'describe': null,
    'status': 1,
    'actionData': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"查询"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
    'sptDaTypes': null,
    'optionalFields': '[]',
    'parents': null,
    'type': 'default',
    'deleted': 0,
    'actions': [
      'add',
      'get',
      'edit',
      'delete'
    ]
  },
  {
    'id': 'role',
    'name': '角色管理',
    'describe': null,
    'status': 1,
    'actionData': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"查询"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
    'sptDaTypes': null,
    'optionalFields': '[]',
    'parents': null,
    'type': 'default',
    'deleted': 0,
    'actions': [
      'add',
      'get',
      'edit',
      'delete'
    ]
  },
  {
    'id': 'test',
    'name': '测试权限',
    'describe': null,
    'status': 1,
    'actionData': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"}]',
    'sptDaTypes': null,
    'optionalFields': '[]',
    'parents': null,
    'type': 'default',
    'deleted': 0,
    'actions': [
      'add',
      'get'
    ]
  },
  {
    'id': 'user',
    'name': '用户管理',
    'describe': null,
    'status': 1,
    'actionData': '[{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
    'sptDaTypes': null,
    'optionalFields': '[]',
    'parents': null,
    'type': 'default',
    'deleted': 0,
    'actions': [
      'add',
      'get'
    ]
  }
  ])
}

const permissions = () => {
  return builder({
    'data': [{
      'id': 'marketing',
      'name': '营销管理',
      'describe': null,
      'status': 1,
      'actionData': '[{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      'sptDaTypes': null,
      'optionalFields': null,
      'parents': null,
      'type': null,
      'deleted': 0,
      'actions': [
        'add',
        'query',
        'get',
        'edit',
        'delete'
      ]
    },
    {
      'id': 'member',
      'name': '会员管理',
      'describe': null,
      'status': 1,
      'actionData': '[{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      'sptDaTypes': null,
      'optionalFields': '[]',
      'parents': null,
      'type': 'default',
      'deleted': 0,
      'actions': [
        'add',
        'query',
        'get',
        'edit',
        'delete'
      ]
    },
    {
      'id': 'menu',
      'name': '菜单管理',
      'describe': null,
      'status': 1,
      'actionData': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"查询"},{"action":"edit","defaultCheck":false,"describe":"修改"}]',
      'sptDaTypes': null,
      'optionalFields': '[]',
      'parents': null,
      'type': 'default',
      'deleted': 0,
      'actions': [
        'add',
        'import',
        'get',
        'edit'
      ]
    },
    {
      'id': 'order',
      'name': '订单管理',
      'describe': null,
      'status': 1,
      'actionData': '[{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      'sptDaTypes': null,
      'optionalFields': '[]',
      'parents': null,
      'type': 'default',
      'deleted': 0,
      'actions': [
        'add',
        'query',
        'get',
        'edit',
        'delete'
      ]
    },
    {
      'id': 'permission',
      'name': '权限管理',
      'describe': null,
      'status': 1,
      'actionData': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"查询"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      'sptDaTypes': null,
      'optionalFields': '[]',
      'parents': null,
      'type': 'default',
      'deleted': 0,
      'actions': [
        'add',
        'get',
        'edit',
        'delete'
      ]
    },
    {
      'id': 'role',
      'name': '角色管理',
      'describe': null,
      'status': 1,
      'actionData': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"查询"},{"action":"edit","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      'sptDaTypes': null,
      'optionalFields': '[]',
      'parents': null,
      'type': 'default',
      'deleted': 0,
      'actions': [
        'add',
        'get',
        'edit',
        'delete'
      ]
    },
    {
      'id': 'test',
      'name': '测试权限',
      'describe': null,
      'status': 1,
      'actionData': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"}]',
      'sptDaTypes': null,
      'optionalFields': '[]',
      'parents': null,
      'type': 'default',
      'deleted': 0,
      'actions': [
        'add',
        'get'
      ]
    },
    {
      'id': 'user',
      'name': '用户管理',
      'describe': null,
      'status': 1,
      'actionData': '[{"action":"add","describe":"新增","defaultCheck":false},{"action":"get","describe":"查询","defaultCheck":false}]',
      'sptDaTypes': null,
      'optionalFields': '[]',
      'parents': null,
      'type': 'default',
      'deleted': 0,
      'actions': [
        'add',
        'get'
      ]
    }
    ],
    'pageSize': 10,
    'pageNo': 0,
    'totalPage': 1,
    'totalCount': 5
  })
}

Mock.mock(/\/org\/tree/, 'get', orgTree)
Mock.mock(/\/role/, 'get', role)
Mock.mock(/\/permission\/no-pager/, 'get', permissionNoPager)
Mock.mock(/\/permission/, 'get', permissions)
