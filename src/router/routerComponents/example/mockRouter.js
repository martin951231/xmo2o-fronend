
const mockRouter = [
  {
    'name': 'local',
    'parentId': 0,
    'id': 'local',
    'meta': {
      'title': 'local',
      'show': false,
    },
    'component': 'MerchantMallShippingList',
    'path': '/merchant/merchant.mall/shippingList'
  },
  {
    'name': 'local2',
    'parentId': 0,
    'id': 'local2',
    'meta': {
      'title': 'local2',
      'show': false,
    },
    'component': 'MerchantMallEditShipping',
    'path': '/merchant/merchant.mall/editShipping'
  },
  // system
  // {
  //   'name': 'system',
  //   'parentId': 0,
  //   'id': 200,
  //   'meta': {
  //     'title': '系统设置',
  //     'show': true,
  //     'permission': 'system'
  //   },
  //   'redirect': '/menu',
  //   'component': 'PageView'
  // },
  // {
  //   'name': 'menu',
  //   'parentId': 200,
  //   'id': 210,
  //   'meta': {
  //     'title': '菜单',
  //     'show': true,
  //     'permission': 'system'
  //   },
  //   'component': 'MenuList',
  //   'path': '/menu'
  // },
  // {
  //   'name': 'role',
  //   'parentId': 200,
  //   'id': 220,
  //   'meta': {
  //     'title': '角色',
  //     'show': true,
  //     'permission': 'system'
  //   },
  //   'component': 'RoleList',
  //   'path': '/role'
  // },
  // example
  //  社区后台登录页
  // {
  //   path: '/community/streetCommunity/partyAffairsManagement/partyBranchList',
  //   'parentId': 0,
  //   'id': 100861,
  //   name: 'streetCommunityPartyBranchList',
  //   meta: {
  //     'icon': 'control',
  //     'title': '党支部列表',
  //     'show': true,
  //     'permission': 'system'
  //   },
  //   component: 'streetCommunityPartyBranchList'
  // },
  // {
  //   path: '/community/streetCommunity/partyAffairsManagement/threeMeetings',
  //   'parentId': 0,
  //   'id': 100862,
  //   name: 'streetCommunitythreeMeetings',
  //   meta: {
  //     'icon': 'control',
  //     'title': '三会一课',
  //     'show': true,
  //     'permission': 'system'
  //   },
  //   component: 'streetCommunitythreeMeetings'
  // },
  // {
  //   path: '/community/streetCommunity/partyAffairsManagement/partyMembersManagement',
  //   'parentId': 0,
  //   'id': 100863,
  //   name: 'streetCommunitypartyMembersManagement',
  //   meta: {
  //     'icon': 'control',
  //     'title': '党员管理',
  //     'show': true,
  //     'permission': 'system'
  //   },
  //   component: 'streetCommunitypartyMembersManagement'
  // },
  // {
  //   'name': 'example',
  //   'parentId': 0,
  //   'id': 10086,
  //   'meta': {
  //     'icon': 'control',
  //     'title': '基本信息',
  //     'show': true,
  //     'permission': 'system'
  //   },
  //   'path': '/community/streetCommunity/config/index',
  //   'component': 'ConfigStreetComunityIndex'
  // },
  // {
  //   'name': 'example11',
  //   'parentId': 0,
  //   'id': 11100,
  //   'meta': {
  //     'icon': 'control',
  //     'title': '民生管理留言建议',
  //     'show': true,
  //     'permission': 'system'
  //   },
  //   'path': '/community/streetCommunity/peopleLivelihood/messageSuggestionsList1',
  //   'component': 'PeopleLivelihoodMessageSuggestionsList'
  // },
  // {
  //   'name': 'example999',
  //   'parentId': 0,
  //   'id': 11100,
  //   'meta': {
  //     'icon': 'control',
  //     'title': '大数据',
  //     'show': true,
  //     'permission': 'system'
  //   },
  //   'path': '/user/village/datastatistics',
  //   'component': 'dataStatisticsVillageBase'
  // },
  // {
  //   'name': 'example12',
  //   'parentId': 0,
  //   'id': 11100,
  //   'meta': {
  //     'icon': 'control',
  //     'title': '民生管理志愿者活动',
  //     'show': true,
  //     'permission': 'system'
  //   },
  //   'path': '/community/streetCommunity/peopleLivelihood/volunteerActivitiesList1',
  //   'component': 'PeopleLivelihoodVolunteerActivitiesList'
  // },
  // {
  //   'name': 'example',
  //   'parentId': 0,
  //   'id': 100,
  //   'meta': {
  //     'icon': 'control',
  //     'title': '代码示例',
  //     'show': true,
  //     'permission': 'system'
  //   },
  //   'redirect': '/platform/form/base-form',
  //   'component': 'RouteView'
  // },
  // // 表单
  // {
  //   'name': 'form',
  //   'parentId': 100,
  //   'id': 120,
  //   'meta': {
  //     'title': '表单页',
  //     'show': true
  //   },
  //   'redirect': '/platform/form/base-form',
  //   'component': 'RouteView'
  // },
  // {
  //   'name': 'BasicForm',
  //   'parentId': 120,
  //   'id': 111,
  //   'meta': {
  //     'title': '基础表单',
  //     'show': true,
  //   },
  //   'component': 'BasicForm',
  //   'path': '/platform/form/base-form'
  // },

  // // 表格
  // {
  //   'name': 'table',
  //   'parentId': 100,
  //   'id': 150,
  //   'meta': {
  //     'title': '列表页',
  //     'show': true
  //   },
  //   'redirect': '/platform/list/table-list',
  //   'component': 'RouteView'
  // },
  // {
  //   'name': 'TableList',
  //   'parentId': 150,
  //   'id': 151,
  //   'meta': {
  //     'title': '查询表格',
  //     'show': true,
  //   },
  //   'component': 'TableList',
  //   'path': '/platform/list/table-list'
  // },
  // {
  //   'name': 'TreeList',
  //   'parentId': 150,
  //   'id': 152,
  //   'meta': {
  //     'title': '树目录表格',
  //     'show': true,
  //   },
  //   'component': 'TreeList',
  //   'path': '/platform/list/tree-list'
  // },
  // {
  //   'name': 'TableInnerEditList',
  //   'parentId': 150,
  //   'id': 153,
  //   'meta': {
  //     'title': '内联编辑表格',
  //     'show': true,
  //   },
  //   'component': 'TableInnerEditList',
  //   'path': '/platform/list/edit-table'
  // },
  // {
  //   'name': 'StandardList',
  //   'parentId': 150,
  //   'id': 154,
  //   'meta': {
  //     'title': '标准列表',
  //     'show': true,
  //   },
  //   'component': 'StandardList',
  //   'path': '/platform/list/test.test1.index/basic-list'
  // },
  // {
  //   'name': 'CardList',
  //   'parentId': 150,
  //   'id': 155,
  //   'meta': {
  //     'title': '卡片列表',
  //     'show': true,
  //   },
  //   'component': 'CardList',
  //   'path': '/platform/list/card'
  // },
  // // account
  // {
  //   'name': 'account',
  //   'parentId': 100,
  //   'id': 10028,
  //   'meta': {
  //     'title': '个人页',
  //     'icon': 'user',
  //     'show': true
  //   },
  //   'redirect': '/platform/account/center',
  //   'component': 'RouteView'
  // },
  // {
  //   'name': 'center',
  //   'parentId': 10028,
  //   'id': 10029,
  //   'meta': {
  //     'title': '个人中心',
  //     'show': true
  //   },
  //   'component': 'AccountCenter',
  //   'path': '/platform/account/center',
  // },
  // // 特殊三级菜单
  // {
  //   'name': 'settings',
  //   'parentId': 10028,
  //   'id': 10030,
  //   'meta': {
  //     'title': '个人设置',
  //     'hideHeader': true, // 强制当前页面不显示 PageHeader 组件中的页面带的 面包屑和页面标题栏
  //     'hideChildren': true, // 隐藏子菜单
  //     'show': true
  //   },
  //   'redirect': '/platform/account/settings/base',
  //   'component': 'AccountSettings'
  // },
  // {
  //   'name': 'BaseSettings',
  //   'path': '/platform/account/settings/base',
  //   'parentId': 10030,
  //   'id': 10031,
  //   'meta': {
  //     'title': '基本设置',
  //     'show': false
  //   },
  //   'component': 'BaseSettings'
  // },
  // {
  //   'name': 'SecuritySettings',
  //   'path': '/platform/account/settings/security',
  //   'parentId': 10030,
  //   'id': 10032,
  //   'meta': {
  //     'title': '安全设置',
  //     'show': false
  //   },
  //   'component': 'SecuritySettings'
  // },
  // {
  //   'name': 'CustomSettings',
  //   'path': '/platform/account/settings/custom',
  //   'parentId': 10030,
  //   'id': 10033,
  //   'meta': {
  //     'title': '个性化设置',
  //     'show': false
  //   },
  //   'component': 'CustomSettings'
  // },
  // {
  //   'name': 'BindingSettings',
  //   'path': '/platform/account/settings/binding',
  //   'parentId': 10030,
  //   'id': 10034,
  //   'meta': {
  //     'title': '账户绑定',
  //     'show': false
  //   },
  //   'component': 'BindingSettings'
  // },
  // {
  //   'name': 'NotificationSettings',
  //   'path': '/platform/account/settings/notification',
  //   'parentId': 10030,
  //   'id': 10034,
  //   'meta': {
  //     'title': '新消息通知',
  //     'show': false
  //   },
  //   'component': 'NotificationSettings'
  // }
]

export default mockRouter
