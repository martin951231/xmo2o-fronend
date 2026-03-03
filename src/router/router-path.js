import common from '@/utils/variable'

const commonPath = process.env.NODE_ENV === 'development' ? common.DEV_FRONT_COMMON_PATH : common.PRO_FRONT_COMMON_PATH

const path = {
    commonPath,
    user: '/user', // 系统的用户页（基于userlayout)
    userBlank: '/usernew', // 重新定做的登录、注册等用户页（基于blanklayout）
    login: '/user/login',
    index: '/common/platform.iframe/menu_999999',
    notFound: '/404',
    /*
      系统免登陆白名单
      白名单名称要与 src/config/router.config.js 中 路径的 name 属性值相同，建议与下面声明的路由的名称保持一致
    */

    whiteList: [
        'notFound',
        'refresh',
        'platformLogin',
        'PlatformRecommendHot',
        'communityDataIndex',
        'GridEventCenter',
        'LoginResult',
        'communityLogin',
        'communityWatchLogin',
        'merchantLogin',
        'merchantAgreement',
        'merchantPrivacyPolicy',
        'communityRegister',
        'communityAppointIndex',
        'communityPackages',
        'storestaffLogin',
        'example',
        'dataStatisticsIndexPage',
        'villageDataStatisticsIndex',
        'meterLogin',
        'meterStatisticsIndex',
        'CityDataScreen',
        'villageRtspPlayer',
        'visitorAuthList',
        'WatchBox',
    ],

    // 没有左侧菜单的路由
    noNavList: [
        '/user/village/datastatistics',
        '/community/village/statistical',
        '/user/village/videoPreview',
        '/community/village/cockpit/datastatistics',
        '/community/village/cockpit/hotZone',
        '/community/village/cockpit/equipPoint',
        '/community/village/device/rtspPlayer', //rtsp页面
        '/community/platform.cockpit/dataScreen',
        '/community/property/package/LoginPackagesBuy',
        '/community/streetCommunity/gridCustom/GridEventCenter',
        '/community/streetCommunity/dataScreen/index',
        '/community/village/owner/uploadImage',
        '/community/platform.hardware/hardware',
        '/community/platform.hardware/deviceInfo',
        '/meter/meterStatistics',
        '/community/property/package/LoginPackagesRoomBuy',
        '/dialog/platform.viewpage/ShopSeckill',
        '/dialog/platform.hotwords/HotWordsList',
        '/dialog/platform.coupon/searchHotWords',
        '/dialog/platform.coupon/brandSelection',
        '/dialog/platform.mall/orderDetail',
        '/dialog/platform.foodshop/orderDetail',
        '/dialog/platform.coupon/SysUseRecords',
        '/dialog/platform.coupon/SysGetRecords',
        '/dialog/platform.coupon/MerUseRecords',
        '/dialog/platform.coupon/MerGetRecords',
        '/common/platform.custom/customPage',
        '/common/merchant.custom/customPage',
        '/common/merchant.custom/index',
        '/dialog/platform.viewpage/ShareSet/gid=index_share',
        '/dialog/platform.viewpage/ShareSet/gid=101',
        '/dialog/platform.viewpage/ShareSet/gid=102',
        '/dialog/platform.viewpage/ShareSet/gid=103',
        '/community/village/dataScreen/index',
        '/system/community/cityRegionManage/visualizationScreen',
        //聊天记录
        '/community/village/building/roomCom/ownerCom/chatRecord',
        // 外卖店铺装修导航列表
        '/dialog/merchant.shopNewEdit/SlideList',

        //骑手跑腿佣金设置
        '/dialog/paotui.platform/RiderCommissionSetting',


        //商场中心登录
        '/dialog/building.platform/login',

        //问卷调查
        '/common/platform.QuestionnaireSurvey/QuestionnaireSurveyDetail',
    ],

    //有左侧菜单但不需要验证权限的菜单
    navList: ['ShopSeckillCategory'],

    /*
    登录 首页 注册页 等
    注意： 登录页面和首页面的路径名称硬性要求为： 系统名称+Login 、 系统名称+Index 、 系统名称+Register
    */
    //  1.系统后台
    platformLogin: '/user/platform/login', // 登录
    platformIndex: '/common/platform.iframe/menu_999999', // 首页
    platformViewpageShopSeckill: '/common/platform/viewpage/ShopSeckill', // 可视化页面外卖秒杀
    // 2.1社区后台
    whiteLogin: [
        '/user/community/login',
        '/user/community/CommunityAppoint',
        '/user/community/LoginResult',
        '/user/community/Watchlogin',
    ], // 不进行跳转对应业主页面的路径
    communityLogin: '/user/community/login', // 登录
    communityWatchLogin: '/user/community/Watchlogin',
    communityRegister: '/user/community/register', // 注册
    communityPackages: '/user/community/packages', // 注册页功能套餐试用列表
    communityIndex: '/community/street_community.iframe/street_index', // 街道/社区首页
    // 2.2社区-物业后台
    propertyLogin: '/user/community/login', // 登录
    propertyIndex: '/property/property.iframe/property_index', // 物业首页
    propertyBuyPackages: '/property/property/package/LoginPackagesBuy', // 续费更换套餐
    propertyBuyPackagesRoom: '/property/property/package/LoginPackagesRoomBuy', // 续费更换房间套餐
    communityDataIndex: '/property/property/communityData', // 物业大数据
    GridEventCenter: '/community/streetCommunity/gridCustom/GridEventCenter', // 网络事件中心
    HardwareIndex: '/community/platform.hardware/hardware', // 硬件大数据
    WatchBox: '/community/platform.WatchBox/WatchBox', // 岗亭
    DeviceInfoIndex: '/community/platform.hardware/deviceInfo', // 硬件大数据 子页面数据1
    // 2.3社区-小区后台
    villageIndex: '/village/village.iframe/house_index_index', // 小区首页
    villageLogin: '/user/community/login', // 登录
    dataStatisticsIndex: '/user/village/datastatistics', // 大数据
    statisticalIndex: '/community/village/statistical', // 统计报表
    villageDataStatisticsIndex: '/community/village/cockpit/datastatistics', // 驾驶舱
    villageHotZoneindex: '/community/village/cockpit/hotZone', // 画热点区域
    villageEquipPointindex: '/community/village/cockpit/equipPoint', // 画热点区域
    villageRtspPlayer: '/community/village/device/rtspPlayer', //rtsp页面
    chatRecord: '/community/village/building/roomCom/ownerCom/chatRecord', //聊天记录
    // 2.4小区-智能电表
    meterLogin: '/user/meter/login', // 登录
    meterIndex: '/meter/adminUser/editPassword', // 重置密码
    meterAdminUser: '/meter/adminUser/adminUserList', // 管理员列表
    meterElectricArea: '/meter/electricPrice/getAreaList', // 城市列表
    meterElectricPrice: '/meter/electricPrice/addElectricPrice', // 添加收费标准
    meterOrderList: '/meter/payment/orderList', //账单管理
    meterElectricSet: '/meter/electric/set', //电表设置
    meterElectricList: '/meter/electric/electricList', //电表列表
    meterGroupList: '/meter/electric/groupList', //电表分组管理
    meterElectricEdit: '/meter/electric/set', //添加/编辑电表设置
    meterGroupEdit: '/meter/electric/groupList', //添加/编辑电表分组管理
    meterStatisticsIndex: '/meter/meterStatistics', // 电表大数据
    communityAppointIndex: '/user/community/CommunityAppoint', // 立即预约
    LoginResult: '/user/community/LoginResult', // 注册中转页面
    stepIndex: '/property/property/Step', // 立即预约
    // 3.商家后台
    merchantLogin: '/usernew/merchant/login',
    merchantAgreement: '/usernew/merchant/agreement', // 商家入驻协议
    merchantPrivacyPolicy: '/usernew/merchant/privacyPolicy', // 商家入驻隐私协议
    merchantIndex: '/merchant/merchant.iframe/menu_999999',
    merchantStoreList: '/merchant/merchant.mall/storeList',
    merchantLifeToolsOrderList: '/merchant/merchant.life_tools/OrderList', //体育订单列表
    merchantLifeToolsScenicOrderList: '/merchant/merchant.life_tools/scenicOrderList', //景区订单列表
    // 4.店员后台
    storestaffLogin: '/usernew/storestaff/login',
    // storestaffAgreement: '/usernew/storestaff/agreement',
    storestaffIndex: '/storestaff/storestaff.index/index',
    storestaffCashier: '/storestaff/storestaff.cashier/cashier', // 点餐台
    // 商城店员后台
    storestaffMall: '/storestaff/storestaff.mall/mall', // 订单管理

    // 核销店员后台
    scanelinformation: '/storestaff/storestaff.employee/employee', // 订单管理

    //店员后台活动预约核销
    staffappoint: '/storestaff/storestaff.life_tools/appoint',

    //店员后台体育管理
    staffsports: '/storestaff/storestaff.life_tools/sports',

    //店员后台景区管理
    staffscenic: '/storestaff/storestaff.life_tools/scenic',

    // 店员后台自主购票
    staffautonomously: '/storestaff/storestaff.life_tools/scenic',

    //店员后台优惠券核销
    staffCouponVerifiy: '/storestaff/storestaff.coupon_verifiy/Index',

    // 测试页面
    example: '/example',

    PlatformRecommendHot: '/dialog/platform.viewpage/PlatformRecommendHot',

    DataScreen: '/community/streetCommunity/dataScreen/index', //街道社区数据大屏
    CityDataScreen: '/system/community/cityRegionManage/visualizationScreen', //街道社区数据大屏
    faceUpload: '/community/village/owner/uploadImage', //人脸图片上传

    cameraPreview: '/user/village/videoPreview',

    villageDataScreenindex: '/community/platform.cockpit/dataScreen', // 画热点区域
    buildingManage: '/community/village/dataCenter/buildingManage', // 楼栋
    materialIframe: '/community/village/chatSidebar/materialIframe', // 楼栋

    orderTongji: '/community/village/workOrder/orderTongji/orderTongji',

    repairSubjectList: '/community/village/workOrder/repairCate/repairSubjectList', //工单类目列表
    repairCategoryList: '/community/village/workOrder/repairCate/repairCategoryList', //工单类目列表
    visitorTmpParking: '/views/community/village/Parking/TemParking/visitorTmpParking', // 临时停车列表

    parkingLot: '/views/community/village/yardManagement/parkingLot', //停车场管理
    parkingSpace: '/views/community/village/yardManagement/parkingSpace', //车位管理
    laneManage: '/views/community/village/yardManagement/laneManage', //车道管理
    couponManage: '/views/community/village/yardManagement/couponManage', //优惠券管理
    dataRecord: '/views/community/village/yardManagement/dataRecord', //数据记录
    onDutyCarStatistics: '/views/community/village/yardManagement/onDutyCarStatistics', //收费记录
    blackList: '/views/community/village/yardManagement/blackList', //黑名单记录
    freeCar: '/views/community/village/yardManagement/freeCar', //免费车记录
    labelManage: '/views/community/village/yardManagement/labelManage', //标签管理

    streetOrgnization: '/community/village/dataScreen/index', //街道社区组织机构
    showScreenSet: '/community/village/park/showScreenSet', // 显屏/语音内容设置
    offLineDevList: '/views/community/village/hardware/offLineDevList', // 设备预警列表 离线设备
    apDevice: '/community/village/ap/apDevice', // 无线AP
    unitRentalHouseList: '/views/community/village/unitRental/houseList',
    orderDataSetting: '/views/community/village/workOrder/orderTongji/workerSet', //工单设置

    //平台工单数据可视化
    platformOrderData: '/community/village/workOrder/orderTongji/platformOrderData', // 平台工单数据可视化
    // 平台小区广告审核设置
    platformAdvertCheckSet: '/system/platform.villageAdvert/checkSet',

    // 访客访问非业主设备权限
    visitorAuthList: '/village/village.device/visitorAuthList',
}

export default path
