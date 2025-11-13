// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import path from '@/router/router-path.js'
// 静态路由表
export const asyncRouterMap = [
    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        meta: {
            title: '首页',
        },
        redirect: '/index/index',
        children: [
            // 自定义路由
            // 1. 系统设置
            /*  {
        path: 'system',
        name: 'system',
        redirect: '/menu/menuList',
        component: PageView,
        meta: { title: '系统管理', keepAlive: true, icon: 'control', permission: [ 'system' ] },
        children: [
          {
            path: 'menu',
            name: 'menu',
            component: () => import('@/views/system/menu/MenuList'),
            meta: { title: '菜单列表', icon: 'unordered-list', keepAlive: false, permission: [ 'system' ] }
          },
          {
            path: 'role/:pageNo([1-9]\\d*)?',
            name: 'role',
            component: () => import('@/views/system/role/RoleList'),
            meta: { title: '角色列表', icon: 'team', keepAlive: false, permission: [ 'system' ] }
          }
        ]
      }, */
            // 2. 示例

            {
                path: path.streetCommunityPartyBranchList,
                name: 'streetCommunityPartyBranchList',
                meta: {
                    title: '示例',
                    keepAlive: true,
                    icon: 'highlight',
                    permission: ['example'],
                },
                component: () => import('@/views/community/streetCommunity/partyAffairsManagement/partyBranchList'),
            },
            {
                path: 'example',
                name: 'example',
                redirect: '/example/iframe',
                component: PageView,
                meta: {
                    title: '示例',
                    keepAlive: true,
                    icon: 'highlight',
                    permission: ['example'],
                },
                children: [
                    // 2.2 表单示例
                    {
                        path: '/form',
                        redirect: '/form/base-form',
                        component: RouteView,
                        meta: {
                            title: '表单页',
                            icon: 'form',
                            permission: ['form'],
                        },
                        children: [
                            {
                                path: '/form/base-form',
                                name: 'BaseForm',
                                component: () => import('@/views/example/form/BasicForm'),
                                meta: {
                                    title: '基础表单',
                                    keepAlive: true,
                                    permission: ['form'],
                                },
                            },
                            {
                                path: '/form/step-form',
                                name: 'StepForm',
                                component: () => import('@/views/example/form/stepForm/StepForm'),
                                meta: {
                                    title: '分步表单',
                                    keepAlive: true,
                                    permission: ['form'],
                                },
                            },
                            {
                                path: '/form/advanced-form',
                                name: 'AdvanceForm',
                                component: () => import('@/views/example/form/advancedForm/AdvancedForm'),
                                meta: {
                                    title: '高级表单',
                                    keepAlive: true,
                                    permission: ['form'],
                                },
                            },
                        ],
                    },
                    // 2.3 表格示例
                    {
                        path: '/list',
                        name: 'list',
                        component: RouteView,
                        redirect: '/list/table-list',
                        meta: {
                            title: '列表页',
                            icon: 'table',
                            permission: ['table'],
                        },
                        children: [
                            {
                                path: '/list/table-list/:pageNo([1-9]\\d*)?',
                                name: 'TableListWrapper',
                                hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
                                component: () => import('@/views/example/list/TableList'),
                                meta: {
                                    title: '查询表格',
                                    keepAlive: true,
                                    permission: ['table'],
                                },
                            },
                            {
                                path: '/list/tree-list',
                                name: 'TreeList',
                                component: () => import('@/views/example/list/TreeList'),
                                meta: {
                                    title: '树目录表格',
                                    keepAlive: true,
                                },
                            },
                            {
                                path: '/list/edit-table',
                                name: 'EditList',
                                component: () => import('@/views/example/list/TableInnerEditList'),
                                meta: {
                                    title: '内联编辑表格',
                                    keepAlive: true,
                                },
                            },
                            {
                                path: '/list/basic-list',
                                name: 'BasicList',
                                component: () => import('@/views/example/list/StandardList'),
                                meta: {
                                    title: '标准列表',
                                    keepAlive: true,
                                    permission: ['table'],
                                },
                            },
                            {
                                path: '/list/card',
                                name: 'CardList',
                                component: () => import('@/views/example/list/CardList'),
                                meta: {
                                    title: '卡片列表',
                                    keepAlive: true,
                                    permission: ['table'],
                                },
                            },
                        ],
                    },
                    // 2.4 详情页示例
                    {
                        path: '/profile',
                        name: 'profile',
                        component: () => import('@/views/example/profile/Index'),
                        meta: {
                            title: '详情页',
                            icon: 'profile',
                            permission: ['system'],
                        },
                    },
                    // 2.5 外链示例
                    {
                        path: 'https://www.baidu.com/',
                        name: 'link',
                        meta: {
                            title: '外部链接',
                            icon: 'link',
                            target: '_blank',
                        },
                    },
                    // 2.6 个人设置
                    {
                        path: '/account',
                        component: RouteView,
                        redirect: '/account/center',
                        name: 'account',
                        hidden: true,
                        meta: {
                            title: '个人页',
                            icon: 'user',
                            keepAlive: true,
                            permission: ['system'],
                        },
                        children: [
                            {
                                path: '/account/center',
                                name: 'center',
                                component: () => import('@/views/example/account/center/Index'),
                                meta: {
                                    title: '个人中心',
                                    keepAlive: true,
                                    permission: ['system'],
                                },
                            },
                            {
                                path: '/account/settings',
                                name: 'settings',
                                component: () => import('@/views/example/account/settings/Index'),
                                meta: {
                                    title: '个人设置',
                                    hideHeader: true,
                                    permission: ['system'],
                                },
                                redirect: '/account/settings/base',
                                hideChildrenInMenu: true,
                                children: [
                                    {
                                        path: '/account/settings/base',
                                        name: 'BaseSettings',
                                        component: () => import('@/views/example/account/settings/BaseSetting'),
                                        meta: {
                                            title: '基本设置',
                                            hidden: true,
                                            permission: ['system'],
                                        },
                                    },
                                    {
                                        path: '/account/settings/security',
                                        name: 'SecuritySettings',
                                        component: () => import('@/views/example/account/settings/Security'),
                                        meta: {
                                            title: '安全设置',
                                            hidden: true,
                                            keepAlive: true,
                                            permission: ['system'],
                                        },
                                    },
                                    {
                                        path: '/account/settings/custom',
                                        name: 'CustomSettings',
                                        component: () => import('@/views/example/account/settings/Custom'),
                                        meta: {
                                            title: '个性化设置',
                                            hidden: true,
                                            keepAlive: true,
                                            permission: ['system'],
                                        },
                                    },
                                    {
                                        path: '/account/settings/binding',
                                        name: 'BindingSettings',
                                        component: () => import('@/views/example/account/settings/Binding'),
                                        meta: {
                                            title: '账户绑定',
                                            hidden: true,
                                            keepAlive: true,
                                            permission: ['system'],
                                        },
                                    },
                                    {
                                        path: '/account/settings/notification',
                                        name: 'NotificationSettings',
                                        component: () => import('@/views/example/account/settings/Notification'),
                                        meta: {
                                            title: '新消息通知',
                                            hidden: true,
                                            keepAlive: true,
                                            permission: ['system'],
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            // 异常页
            /* {
       path: '/exception',
       name: 'exception',
       component: RouteView,
       redirect: '/exception/403',
       hidden: true,
       meta: { title: '异常页', icon: 'warning', permission: [ 'exception' ] },
       children: [
         {
           path: '/exception/403',
           name: 'Exception403',
           component: () => import(/!* webpackChunkName: "fail" *!/ '@/views/exception/403'),
           meta: { title: '403', permission: [ 'exception' ] }
         },
         {
           path: '/exception/404',
           name: 'Exception404',
           component: () => import(/!* webpackChunkName: "fail" *!/ '@/views/exception/404'),
           meta: { title: '404', permission: [ 'exception' ] }
         },
         {
           path: '/exception/500',
           name: 'Exception500',
           component: () => import(/!* webpackChunkName: "fail" *!/ '@/views/exception/500'),
           meta: { title: '500', permission: [ 'exception' ] }
         }
       ]
     }, */
        ],
    },
    {
        path: '*',
        redirect: path.notFound,
        hidden: true,
    },
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
    {
        path: path.user,
        component: UserLayout,
        hidden: true,
        children: [
            //  系统后台登录页
            {
                path: path.platformLogin,
                name: 'platformLogin',
                component: () => import('@/views/user/platform/Login'),
                meta: {
                    title: '登录',
                },
            },
            //  社区-街道社区后台登录页
            {
                path: path.communityLogin,
                name: 'communityLogin',
                component: () => import('@/views/user/community/Login'),
                meta: {
                    title: '登录',
                },
            },
            //  社区-岗亭登录页
            {
                path: path.communityWatchLogin,
                name: 'communityWatchLogin',
                component: () => import('@/views/user/community/WatchLogin'),
                meta: {
                    title: '岗亭登录',
                },
            },
            // 社区后台注册页
            {
                path: path.communityRegister,
                name: 'communityRegister',
                component: () => import('@/views/user/community/Register'),
                meta: {
                    title: '注册',
                },
            },
            // 智能电表-后台登录页
            {
                path: path.meterLogin,
                name: 'meterLogin',
                component: () => import('@/views/user/meter/Login'),
                meta: {
                    title: '登录',
                },
            },
        ],
    },
    // 社区后台功能套餐
    {
        path: path.communityPackages,
        name: 'communityPackages',
        component: () => import('@/views/user/community/Packages'),
        meta: {
            title: '社区后台功能套餐',
        },
    },
    //  社区-立即预约
    {
        path: path.LoginResult,
        name: 'LoginResult',
        component: () => import('@/views/user/community/LoginResult'),
        meta: {
            title: '登录中转页面',
        },
    },
    //  社区-小区大数据页面
    {
        path: path.dataStatisticsIndex,
        name: 'dataStatisticsIndexPage',
        component: () => import('@/views/user/community/Datastatistics'),
        meta: {
            title: '社区-小区大数据页面',
        },
    },

    //小区摄像头
    {
        path: path.cameraPreview,
        name: 'cameraPreview',
        component: () => import('@/views/user/community/videoPreview'),
        meta: {
            title: '社区-摄像头',
        },
    },

    //  社区-小区驾驶舱
    {
        path: path.villageDataStatisticsIndex,
        name: 'villageDataStatisticsIndex',
        component: () => import('@/views/community/village/cockpit/datastatistics'),
        meta: {
            title: '社区-小区驾驶舱',
        },
    },
    //  社区-小区画热点区域
    {
        path: path.villageHotZoneindex,
        name: 'villageHotZoneindex',
        component: () => import('@/views/community/village/cockpit/hotZone'),
        meta: {
            title: '社区-小区驾驶舱',
        },
    },
    //  社区-访客访问非业主设备权限
    {
        path: path.visitorAuthList,
        name: 'visitorAuthList',
        component: () => import('@/views/community/village/device/visitor/visitorAuth'),
        meta: {
            title: '社区-访客访问非业主设备权限',
        },
    },

    //  社区-小区画热点区域
    {
        path: path.chatRecord,
        name: 'chatRecord',
        component: () => import('@/views/community/village/building/roomCom/ownerCom/chatRecord'),
        meta: {
            title: '聊天记录',
        },
    },

    {
        path: path.buildingManage,
        name: 'buildingManage',
        component: () => import('@/views/community/village/dataCenter/buildingManage'),
        meta: {
            title: '社区-楼栋',
        },
    },

    {
        path: path.materialIframe,
        name: 'materialIframe',
        component: () => import('@/views/community/village/chatSidebar/materialIframe'),
        meta: {
            title: '文件管理',
        },
    },

    //  社区-小区画热点区域
    {
        path: path.villageEquipPointindex,
        name: 'villageEquipPointindex',
        component: () => import('@/views/community/village/cockpit/equipPoint'),
        meta: {
            title: '社区-小区驾驶舱',
        },
    },

    //社区rtsp监控页面

    {
        path: path.villageRtspPlayer,
        name: 'villageRtspPlayer',
        component: () => import('@/views/community/village/device/rtspPlayer'),
        meta: {
            title: '社区-小区驾驶舱',
        },
    },

    {
        path: path.villageDataScreenindex,
        name: 'villageDataScreenindex',
        component: () => import('@/views/community/village/cockpit/dataScreen'),
        meta: {
            title: '总后台-驾驶舱',
        },
    },

    //  街道社区后台组织架构人员管理优化-相关页面
    {
        path: path.streetOrgnization,
        name: 'streetOrgnization',
        component: () => import('@/views/community/village/dataScreen/index'),
        meta: {
            title: '社区-小区驾驶舱',
        },
    },

    //  物业-小区大数据页面
    {
        path: path.communityDataIndex,
        name: 'communityDataIndex',
        component: () => import('@/views/community/property/communityData/CommunityData'),
    },
    //  街道-网络事件中心
    {
        path: path.GridEventCenter,
        name: 'GridEventCenter',
        component: () => import('@/views/community/streetCommunity/gridCustom/GridEventCenter'),
    },

    //街道社区数据打屏
    {
        path: path.DataScreen,
        name: 'DataScreen',
        component: () => import('@/views/community/streetCommunity/dataScreen/index'),
        meta: {
            title: '街道社区数据大屏',
        },
    },

    //城市数据大屏
    {
        path: path.CityDataScreen,
        name: 'CityDataScreen',
        component: () => import('@/views/system/community/cityRegionManage/visualizationScreen'),
        meta: {
            title: '城市大数据',
        },
    },

    //街道社区数据打屏
    {
        path: path.faceUpload,
        name: 'faceUpload',
        component: () => import('@/views/community/village/owner/uploadImage'),
        meta: {
            title: '街道社区数据大屏',
        },
    },

    // 工单中心
    {
        path: path.orderTongji,
        name: 'orderTongji',
        component: () => import('@/views/community/village/workOrder/orderTongji/orderTongji'),
    },
    // 显屏/语音内容设置
    {
        path: path.showScreenSet,
        name: 'showScreenSet',
        component: () => import('@/views/community/village/park/showScreenSet'),
    },
    //  社区-硬件运维大数据面板
    {
        path: path.HardwareIndex,
        name: 'HardwareIndex',
        component: () => import('@/views/community/village/hardware/hardware'),
        meta: {
            title: '社区-小区大数据页面',
        },
    },
    //  岗亭--相关
    {
        path: path.WatchBox,
        name: 'WatchBox',
        component: () => import('@/views/community/village/WatchBox/WatchBox'),
        meta: {
            title: '社区-岗亭',
        },
    },
    //  平台-工单可视化
    {
        path: path.platformOrderData,
        name: 'platformOrderData',
        component: () => import('@/views/community/village/workOrder/orderTongji/platformOrderData'),
        meta: {
            title: '平台-工单可视化',
        },
    },
    // 平台-小区-广告审核设置
    {
        path: path.platformAdvertCheckSet,
        name: 'platformAdvertCheckSet',
        component: () => import('@/views/community/platform/village/advert/checkSet'),
        meta: {
            title: '小区广告审核设置',
        },
    },
    //  社区-硬件运维大数据面板 子页面
    {
        path: path.DeviceInfoIndex,
        name: 'DeviceInfoIndex',
        component: () => import('@/views/community/village/hardware/deviceInfo'),
        meta: {
            title: '社区-小区大数据页面',
        },
    },
    //  物业-购买套餐页面
    {
        path: path.propertyBuyPackages,
        name: 'propertyLoginPackages',
        component: () => import('@/views/community/property/package/LoginPackagesBuy'),
        meta: {
            title: '物业-购买套餐页面',
        },
    },
    //  物业-购买房间套餐页面
    {
        path: path.propertyBuyPackagesRoom,
        name: 'propertyLoginPackagesRoomBuy',
        component: () => import('@/views/community/property/package/LoginPackagesRoomBuy'),
        meta: {
            title: '物业-购买房间套餐页面',
        },
    },
    {
        path: path.userBlank,
        component: BlankLayout,
        hidden: true,
        children: [
            //  社区-立即预约
            {
                path: path.communityAppointIndex,
                name: 'communityAppointIndex',
                component: () => import('@/views/user/community/CommunityAppoint'),
                meta: {
                    title: '立即注册',
                },
            },

            //  社区-步骤
            {
                path: path.stepIndex,
                name: 'stepIndex',
                component: () => import('@/views/community/property/Step'),
                meta: {
                    title: '步骤',
                },
            },
            //  社区-步骤
            {
                path: path.meterStatisticsIndex,
                name: 'meterStatisticsIndex',
                component: () => import('@/views/community/houseMeter/meterStatistics/meterStatistics'),
                meta: {
                    title: '电表大数据',
                },
            },
            //  商家后台登录页
            {
                path: path.merchantLogin,
                name: 'merchantLogin',
                component: () => import('@/views/user/merchant/Login'),
                meta: {
                    title: '登录',
                },
            },
            // 同意商家入驻协议 merchantAgreement
            {
                path: path.merchantAgreement,
                name: 'merchantAgreement',
                component: () => import('@/views/user/merchant/Agreement'),
                meta: {
                    title: '入驻协议',
                },
            },
            {
                path: path.merchantPrivacyPolicy,
                name: 'merchantPrivacyPolicy',
                component: () => import('@/views/user/merchant/PrivacyPolicy'),
                meta: {
                    title: '隐私政策',
                },
            },
        ],
    },
    {
        path: path.userBlank,
        component: BlankLayout,
        hidden: true,
        children: [
            //  店员后台登录页
            {
                path: path.storestaffLogin,
                name: 'storestaffLogin',
                component: () => import('@/views/user/storestaff/Login'),
                meta: {
                    title: '登录',
                },
            },
            //  店员后台主页
            {
                path: path.storestaffIndex,
                name: 'storestaffIndex',
                component: () => import('@/views/home/storestaff/Index'),
                meta: {
                    title: '主页',
                },
            },
            //  店员点菜单
            {
                path: path.storestaffCashier,
                name: 'storestaffcashier',
                redirect: path.storestaffCashier + '/order',
                component: () => import('@/views/foodshop/storestaff/cashier/cashier'),
                children: [
                    {
                        path: 'order',
                        name: 'order',
                        component: () => import('@/views/foodshop/storestaff/cashier/cashier_routes/order'),
                        meta: {
                            title: '订单处理',
                        },
                    },
                    {
                        path: 'diningTable',
                        name: 'diningTable',
                        redirect: path.storestaffCashier + '/diningTable/dining',
                        component: () => import('@/views/foodshop/storestaff/cashier/cashier_routes/diningTable'),
                        children: [
                            {
                                path: 'dining',
                                name: 'dining',
                                component: () =>
                                    import('@/views/foodshop/storestaff/cashier/cashier_routes/dingChild/dining'),
                                meta: {
                                    title: '桌台管理',
                                },
                            },
                            {
                                path: 'menu',
                                name: 'menu',
                                component: () =>
                                    import('@/views/foodshop/storestaff/cashier/cashier_routes/dingChild/menu'),
                                meta: {
                                    title: '菜单',
                                },
                            },
                            {
                                path: 'foodDetails',
                                name: 'foodDetails',
                                component: () =>
                                    import('@/views/foodshop/storestaff/cashier/cashier_routes/dingChild/foodDetails'),
                                meta: {
                                    title: '菜品详情',
                                },
                            },
                            {
                                path: 'settlement_order',
                                name: 'settlement_order',
                                component: () =>
                                    import(
                                        '@/views/foodshop/storestaff/cashier/cashier_routes/dingChild/settlement_order'
                                    ),
                                meta: {
                                    title: '结算页',
                                },
                            },
                        ],
                    },
                    {
                        path: 'orderQuickly',
                        name: 'orderQuickly',
                        component: () => import('@/views/foodshop/storestaff/cashier/cashier_routes/orderQuickly'),
                        meta: {
                            title: '快速点单',
                        },
                    },
                    {
                        path: 'clear',
                        name: 'clear',
                        component: () => import('@/views/foodshop/storestaff/cashier/cashier_routes/clear'),
                        meta: {
                            title: '沽清',
                        },
                    },
                    {
                        path: 'query',
                        name: 'query',
                        component: () => import('@/views/foodshop/storestaff/cashier/cashier_routes/query'),
                        meta: {
                            title: '订单查询',
                        },
                    },
                    {
                        path: 'queueList',
                        name: 'queueList',
                        component: () => import('@/views/foodshop/storestaff/cashier/cashier_routes/queueList'),
                        meta: {
                            title: '排号列表',
                        },
                    },
                ],
            },
        ],
    },
    {
        path: path.userBlank,
        component: BlankLayout,
        hidden: true,
        children: [
            //  后台登录页
            {
                path: path.storestaffLogin,
                name: 'storestaffLogin',
                component: () => import('@/views/user/storestaff/Login'),
                meta: {
                    title: '登录',
                },
            },
            //  后台主页
            {
                path: path.storestaffIndex,
                name: 'storestaffIndex',
                component: () => import('@/views/home/storestaff/Index'),
                meta: {
                    title: '主页',
                },
            },
            //  核销主页
            {
                path: path.scanelinformation,
                name: 'scanelinformation',
                redirect: path.scanelinformation + '/cancelPay',
                component: () => import('@/views/employee/storestaff/cancel'),
                children: [
                    {
                        path: 'cancelPay',
                        name: 'cancelPay',
                        component: () => import('@/views/employee/storestaff/cancel_routers/cancelVerification'),
                        meta: {
                            title: '员工卡支付',
                        },
                    },
                    {
                        path: 'cancelList',
                        name: 'cancelList',
                        component: () => import('@/views/employee/storestaff/cancel_routers/cancelList'),
                        meta: {
                            title: '核销记录',
                        },
                    },
                ],
            }, //  活动预约核销/storestaff/storestaff.life_tools/appoint/verifiy
            {
                path: path.staffappoint,
                name: 'staffappoint',
                redirect: path.staffappoint + '/verifiy',
                component: () => import('@/views/life_tools/storestaff/appoint'),
                children: [
                    {
                        path: 'verifiy',
                        name: 'verifiy',
                        component: () => import('@/views/life_tools/storestaff/appoint/verifiy'),
                        meta: {
                            title: '活动预约核销',
                        },
                    },
                    {
                        path: 'verifiyList',
                        name: 'verifiyList',
                        component: () => import('@/views/life_tools/storestaff/appoint/verifiyList'),
                        meta: {
                            title: '核销记录',
                        },
                    },
                ],
            }, //体育管理
            {
                path: path.staffsports,
                name: 'staffsports',
                redirect: path.staffsports + '/verifiy',
                component: () => import('@/views/life_tools/storestaff/sports'),
                children: [
                    {
                        path: 'verifiy',
                        name: 'verifiy',
                        component: () => import('@/views/life_tools/storestaff/sports/verifiy'),
                        meta: {
                            title: '体育核销',
                        },
                    },
                    {
                        path: 'verifiyList',
                        name: 'verifiyList',
                        component: () => import('@/views/life_tools/storestaff/sports/verifiyList'),
                        meta: {
                            title: '核销记录',
                        },
                    },
                ],
            }, //景区管理
            {
                path: path.staffscenic,
                name: 'staffscenic',
                redirect: path.staffscenic + '/verifiy',
                component: () => import('@/views/life_tools/storestaff/scenic'),
                children: [
                    {
                        path: 'verifiy',
                        name: 'verifiy',
                        component: () => import('@/views/life_tools/storestaff/scenic/verifiy'),
                        meta: {
                            title: '景区核销',
                        },
                    },
                    {
                        path: 'verifiyList',
                        name: 'verifiyList',
                        component: () => import('@/views/life_tools/storestaff/scenic/verifiyList'),
                        meta: {
                            title: '核销记录',
                        },
                    },
                    {
                        path: 'ScenicOrderList',
                        name: 'ScenicOrderList',
                        component: () => import('@/views/life_tools/storestaff/scenic/ScenicOrderList'),
                        meta: {
                            title: '订单列表',
                        },
                    },
                ],
            },
            // 自主买票
            {
                path: path.staffautonomously,
                name: 'staffautonomously',
                redirect: path.staffautonomously + '/autonomously',
                component: () => import('@/views/life_tools/storestaff/autoscenic'),
                children: [
                    {
                        path: 'autonomously',
                        name: 'autonomously',
                        component: () => import('@/views/life_tools/storestaff/scenic/autonomously'),
                        meta: {
                            title: '自主买票',
                        },
                    },
                ],
            },
            // 优惠券核销
            {
                path: path.staffCouponVerifiy,
                name: 'staffCouponVerifiy',
                redirect: path.staffCouponVerifiy + '/CouponVerifiy',
                component: () => import('@/views/coupon/storestaff/Index'),
                keepAlive: false,
                children: [
                    {
                        path: 'couponVerifiy',
                        name: 'CouponVerifiy',
                        component: () => import('@/views/coupon/storestaff/CouponVerifiy'),
                        meta: {
                            title: '优惠券核销'
                        }
                    },
                    {
                        path: 'verifiyList',
                        name: 'VerifiyList',
                        component: () => import('@/views/coupon/storestaff/VerifiyList'),
                        meta: {
                            title: '核销记录'
                        }
                    }
                ]
            }
        ],
    },

    // 商城店员
    {
        path: path.storestaffMall,
        name: 'storestaffMall',
        redirect: path.storestaffMall + '/order',
        component: () => import('@/views/mall/storestaff/index'),
        children: [
            {
                path: 'SendGoods',
                name: 'SendGoods',
                component: () => import('@/views/mall/storestaff/SendGoods'),
                meta: {
                    title: '批量发货',
                    keepAlive: false,
                },
            },
            {
                path: 'orderCopy',
                name: 'orderCopy',
                component: () => import('@/views/mall/storestaff/OrderManageCopy'),
                meta: {
                    title: '订单处理',
                    keepAlive: false,
                },
            },
            {
                path: 'orderDetailCopy',
                name: 'orderDetailCopy',
                component: () => import('@/views/mall/storestaff/OrderDetailCopy'),
                meta: {
                    title: '订单详情',
                    keepAlive: false,
                },
            },
        ],
    },
    // 刷新中转页
    {
        path: '/refresh',
        component: BlankLayout,
        hidden: true,
        children: [
            {
                path: '/refresh',
                name: 'refresh',
                component: () => import('@/views/common/refresh/refresh'),
            },
        ],
    },
    // 所有权限的菜单
    {
        path: '/common',
        component: BasicLayout,
        hidden: true,
        children: [
            {
                path: '/common/platform.viewpage/ShopSeckillCategory',
                name: 'ShopSeckillCategory',
                component: () => import('@/views/common/platform/viewpage/ShopSeckillCategory'),
                meta: {
                    title: '限时秒杀商品分类列表',
                    hidden: true,
                    keepAlive: true,
                    permission: ['system'],
                },
            },
            {
                path: '/common/platform.viewpage/ShopSeckillCategoryGoods',
                name: 'ShopSeckillCategory',
                component: () => import('@/views/common/platform/viewpage/ShopSeckillCategoryGoods'),
                meta: {
                    title: '限时秒杀商品列表',
                    hidden: true,
                    keepAlive: true,
                    permission: ['system'],
                },
            },
        ],
    },

{
  path: '/dialog',
  component: BlankLayout,
  hidden: true,
  children: [{
    path: '/dialog/platform.coupon/searchHotWords',
    name: 'searchHotWords',
    component: () => import('@/views/coupon/platform/SearchHotWords')
  },
  {
      path: '/dialog/platform.coupon/brandSelection',
      name: 'BrandSelection',
      component: () => import('@/views/coupon/platform/BrandSelection')
  },
  {
    path: '/dialog/platform.mall/orderDetail', //商城订单详情
    name: 'DialogMallOrderDetail',
    component: () => import('@/views/mall/platform/OrderDetail.vue')
  },
  {
    path: '/dialog/platform.foodshop/orderDetail', //餐饮订单详情
    name: 'DialogFoodshopOrderDetail',
    component: () => import('@/views/foodshop/platform/orderDetail.vue')
  },
  {
      path: '/dialog/platform.coupon/SysUseRecords',
      name: 'SysUseRecords',
      component: () => import('@/views/coupon/platform/SysUseRecords')
  },
  {
      path: '/dialog/platform.coupon/MerUseRecords',
      name: 'MerUseRecords',
      component: () => import('@/views/coupon/merchant/MerUseRecords')
  },
  {
    path: '/dialog/platform.coupon/MerGetRecords',
    name: 'MerGetRecords',
    component: () => import('@/views/coupon/merchant/MerGetRecords')
  },
  {
    path: '/dialog/merchant.coupon/MerUseRecords',
    name: 'MerUseRecords',
    component: () => import('@/views/coupon/merchant/MerUseRecords')
  },
  {
    path: '/dialog/merchant.coupon/MerGetRecords',
    name: 'MerGetRecords',
    component: () => import('@/views/coupon/merchant/MerGetRecords')
  },
  {
      path: '/dialog/platform.viewpage/ShopSeckill',
      name: 'ShopSeckill',
      component: () => import('@/views/common/platform/viewpage/ShopSeckill')
    },
    {
      path: '/dialog/platform.viewpage/ShareSet/gid=index_share',
      name: 'ShareSet',
      component: () => import('@/views/config/platform/ConfigData')
    },
    {
      path: '/dialog/platform.viewpage/ShareSet/gid=101',
      name: 'ShareSet',
      component: () => import('@/views/config/platform/ConfigData')
    },
    {
      path: '/dialog/platform.viewpage/ShareSet/gid=102',
      name: 'ShareSet',
      component: () => import('@/views/config/platform/ConfigData')
    },
    {
      path: '/dialog/platform.viewpage/ShareSet/gid=103',
      name: 'ShareSet',
      component: () => import('@/views/config/platform/ConfigData')
    },
    {
      path: '/dialog/platform.viewpage/PlatformRecommendHot',
      name: 'PlatformRecommendHot',
      component: () => import('@/views/life_tools/platform/PlatformRecommendHot')
    },
    {
        path: '/dialog/platform.hotwords/HotWordsList',
        name: 'HotWordsList',
        component: () => import('@/views/common/platform/hotwords/HotWordsList')
    },
    {
        path: '/dialog/platform.coupon/SysGetRecords',
        name: 'SysGetRecords',
        component: () => import('@/views/coupon/platform/SysGetRecords')
    },
    // 外卖店铺装修导航列表
    {
        path: '/dialog/merchant.shopNewEdit/SlideList',
        name: 'ShopNewSliderList',
        component: () => import('@/views/shop_new/merchant/ShopNewSliderList')
    },
    // ID1015232 pc店员端机器人配送选择配送机器人及地址
    {
        path: '/dialog/storestaff.shopNew/thirdRobotDelivery',
        name: 'ShopNewThirdRobotDelivery',
        component: () => import('@/views/shop_new/storestaff/ThirdRobotDelivery')
    },
    //商场轮播图装修
    //商场导航栏装修
    //商场猜你喜欢装修
    //商场广告装修


    //骑手跑腿佣金设置
    {
        path: '/dialog/paotui.platform/RiderCommissionSetting',
        name: 'RiderCommissionSetting',
        component: () => import('@/views/paotui/platform/RiderCommissionSetting')
    },
    {
      path: '/dialog/building.platform/login',
      name: 'SystemBuildingPlatformLogin',
      component: () => import('@/views/building/platform/login')
    },
  ]
},
  {
    path: '/common',
    hidden: true,
    component: BlankLayout,
    children: [
      {
        path: '/common/platform.custom/index',
        name: 'homePage',
        component: () => import('@/views/common/customPage/homePage'),
        meta: {
          title: '微页面装修',
          keepAlive: false
        }
      },
      {
        path: '/common/merchant.custom/index',
        name: 'homePage',
        component: () => import('@/views/common/customPage/homePage'),
        meta: {
          title: '主页装修',
          keepAlive: false
        }
      },
      {
        path: '/common/merchant.custom/customPage',
        name: 'customPage',
        component: () => import('@/views/common/customPage/customPage'),
        meta: {
          title: '微页面装修',
          keepAlive: false
        }
      },
      {
        path: '/common/platform.custom/customPage',
        name: 'customPage',
        component: () => import('@/views/common/customPage/customPage'),
        meta: {
          title: '微页面装修',
          keepAlive: false
        }
      },
      {
        path: '/common/platform.custom/catCustomPage',
        name: 'catCustomPage',
        component: () => import('@/views/common/customPage/catCustomPage'),
        meta: {
          title: '分类装修',
          keepAlive: false
        }
      },
      {
        path: '/common/platform.diypageFeed/DiypageFeedCategory',
        name: 'DiypageFeedCategory',
        component: () => import('@/views/common/platform/diypageFeed/DiypageFeedCategory'),
        meta: {
          title: '分类导航',
          keepAlive: true,
          hidden: true,
          permission: ['system']
        }
      },
      {
        path: '/common/platform.diypageFeed/DiypageFeedCategoryEdit',
        name: 'DiypageFeedCategoryEdit',
        component: () => import('@/views/common/platform/diypageFeed/DiypageFeedCategoryEdit'),
        meta: {
          title: '分类导航编辑',
          keepAlive: true,
          hidden: true,
          permission: ['system']
        }
      },
      {
        path: '/common/platform.diypageFeed/DiypageFeedCategoryStore',
        name: 'DiypageFeedCategoryStore',
        component: () => import('@/views/common/platform/diypageFeed/DiypageFeedCategoryStore'),
        meta: {
          title: '分类导航编辑',
          keepAlive: true,
          hidden: true,
          permission: ['system']
        }
      },
      {
        path: '/common/platform.kfChatHistory/KFChatHistory',
        name: 'KFChatHistory',
        component: () => import('@/views/common/platform/KFChatHistory/KFChatHistory'),
        meta: {
          title: '聊天记录',
          keepAlive: true,
          hidden: true,
          permission: ['system']
        }
      },
      {
        path: '/common/platform.QuestionnaireSurvey/QuestionnaireSurveyDetail',
        name: 'KFChatHistory',
        component: () => import('@/views/common/platform/QuestionnaireSurvey/QuestionnaireSurveyDetail'),
        meta: {
          title: '问卷调查详情',
          keepAlive: true,
          hidden: true,
          permission: ['system']
        }
      },
    ]
  },
  {
    path: '/merchant',
    hidden: true,
    component: BlankLayout,
    children: [
      {
        path: '/merchant/platform/StoreCategoryEdit',
        name: 'StoreCategoryEdit',
        component: () => import('@/views/merchant/platform/StoreCategoryEdit'),
        meta: {
          title: '店铺分类编辑',
          keepAlive: true,
          hidden: true,
          permission: ['system']
        }
      },
      {
        path: '/merchant/platform/HistoricalContracts',
        name: 'HistoricalContracts',
        component: () => import('@/views/merchant/platform/HistoricalContracts'),
        meta: {
          title: '历史合同',
          keepAlive: true,
          hidden: true,
          permission: ['system']
        }
      },
      {
        path: '/merchant/platform/NetInDetail',
        name: 'NetInDetail',
        component: () => import('@/views/merchant/platform/NetInDetail'),
        meta: {
          title: '入网信息',
          keepAlive: true,
          hidden: true,
          permission: ['system']
        }
      },
    ]
  },
{
  path: path.notFound,
  name: 'notFound',
  component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403')
},
{
  path: '/village/village.charge.cashier/printTemplate',
  name: 'printTemplate',
  component: () => import('@/views/community/village/charge/cashier/printTemplate')
},
{
    path: '/village/village.chatSidebar/userInfo',
    name: 'userInfo',
    component: () => import('@/views/community/village/chatSidebar/userInfo')
},
{
    path: '/village/village.device/daHuaYuiRuiBindAuth',
    name: 'daHuaYuiRuiBindAuth',
    component: () => import('@/views/community/village/device/daHuaYuiRuiBindAuth')
},
{
    path: '/village/village.device/userFingerprintInfo',
    name: 'NbUserFingerprintInfo',
    component: () => import('@/views/community/village/device/fingerprint/userFingerprintInfo')
},
{
    path: '/village/village.houseWorker/sendAiMessageSetWorker',
    name: 'sendAiMessageSetWorker',
    component: () => import('@/views/community/village/houseWorker/sendAiMessageSetWorker')
},
{
  path: '/village/village.materiel/setPrintTemplate',
  name: 'materielPrintPage',
  component: () => import('@/views/community/village/materiel/setPrintTemplate')
},
{
  path: '/village/village.materiel/materielCheckouts',
  name: 'materielCheckoutsName',
  component: () => import('@/views/community/village/materiel/materielCheckouts')
},
]
