const lifeToolsMerchantComponents = {
  'lifeToolsMerchantTicketList': () => import('@/views/life_tools/merchant/TicketList'),//门票列表
  'lifeToolsMerchantTicketEdit': () => import('@/views/life_tools/merchant/TicketEdit'),//门票添加编辑
  'lifeToolsMerchantTools': () => import('@/views/life_tools/merchant/ToolsList'),//体育课程
  'lifeToolsMerchantToolsEdit': () => import('@/views/life_tools/merchant/ToolsEdit'),//添加体育课程
  'lifeToolsMerchantOrderList': () => import('@/views/life_tools/merchant/OrderList'),//订单列表
  'lifeToolsMerchantScenicReplyList': () => import('@/views/life_tools/merchant/ScenicReplyList'),//景区评价列表
  'lifeToolsMerchantScenicOrderList': () => import('@/views/life_tools/merchant/ScenicOrderList'),//景区订单列表
  'lifeToolsMerchantScenicTools': () => import('@/views/life_tools/merchant/ScenicToolsList'),//景区订单列表
  'lifeToolsMerchantScenicToolsEdit': () => import('@/views/life_tools/merchant/ScenicToolsEdit'),//添加景区
  'lifeToolsMerchantReplyList': () => import('@/views/life_tools/merchant/ReplyList'),//评价列表
  'lifeToolsMerchantVerifyList': () => import('@/views/life_tools/merchant/VerifyList'),//核销列表
  'lifeToolsMerchantAgencyList': () => import('@/views/life_tools/merchant/AgencyList'),//旅行社列表审核

  'lifeScenicLimitedActList': () => import('@/views/life_tools/merchant/ScenicToolsLimitList'),//秒杀列表
  'lifeScenicLimitedActEdit': () => import('@/views/life_tools/merchant/ScenicToolsLimitEdit'), // 秒杀编辑
  'lifeScenicLimitedActLook': () => import('@/views/life_tools/merchant/ScenicToolsLimitEdit'), //秒杀查看
  'lifeToolsMerchantScenicCardList': () => import('@/views/life_tools/merchant/CardList'),//次卡列表
  'lifeToolsMerchantScenicCardRecord': () => import('@/views/life_tools/merchant/CardRecord'),//次卡核销记录
  'lifeToolsMerchantScenicCardOrder': () => import('@/views/life_tools/merchant/CardOrder'),//次卡订单列表
  'lifeToolsSportsActivityList': () => import('@/views/life_tools/merchant/SportsActivityList'),//约战列表
   'lifeToolsMerchantAppointList': () => import('@/views/life_tools/merchant/AppointList'),//预约列表
  'lifeToolsSportsActivityEdit': () => import('@/views/life_tools/merchant/modules/SportsActivityEdit'),//预约新增编辑
  'lifeToolsSportsActivityOrderList': () => import('@/views/life_tools/merchant/SportsActivityOrderList'),//约战订单列表

  'LifeToolsSportsSecondsKillActList': () => import('@/views/life_tools/merchant/SportsSecondsKillActList'),//体育秒杀列表
  'LifeToolsSportsSecondsKillActEdit': () => import('@/views/life_tools/merchant/SportsSecondsKillActEdit'), // 体育秒杀编辑
  'LifeToolsSportsSecondsKillActLook': () => import('@/views/life_tools/merchant/SportsSecondsKillActEdit'), //体育秒杀查看


  'lifeToolsGroupTicketList': () => import('@/views/life_tools/merchant/GroupTicketList'),//团体票列表
  'lifeToolsGroupTicketSetting': () => import('@/views/life_tools/merchant/GroupTicketSetting'),//团体票配置
  'lifeToolsGroupOrderList': () => import('@/views/life_tools/merchant/GroupOrderList'),//团体票订单
  'lifeToolsGroupOrderAuditList': () => import('@/views/life_tools/merchant/GroupOrderAuditList'),//团体票订单审核


  'lifeToolsDistributorList': () => import('@/views/life_tools/merchant/DistributorList'),//分销员列表
  'lifeToolsDistributorStting': () => import('@/views/life_tools/merchant/DistributorStting'),//分销员审核
  'lifeToolsMerchantParkingLot': () => import('@/views/life_tools/merchant/ParkingLot'),//停车场
  
  'lifeToolsMerchantWiFi': () => import('@/views/life_tools/merchant/MerchantWiFi'),//其他 商家wifi
  
  'lifeToolsMerchantScenicMapPlaceCategory': () => import('@/views/life_tools/merchant/ScenicMapPlaceCategory'),//景区标注点分类
  'lifeToolsMerchantScenicMapList': () => import('@/views/life_tools/merchant/ScenicMapList'),//景区地图
  'lifeToolsMerchantScenicMapAdd': () => import('@/views/life_tools/merchant/ScenicMapAdd'),//景区地图添加 || 编辑
}
export default lifeToolsMerchantComponents