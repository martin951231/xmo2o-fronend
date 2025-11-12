const lifeToolsPlatformComponents = {
  'lifeToolsPlatformDecorate': () => import('@/views/life_tools/platform/PlatformHomeDecorate'),//景点首页装修
  'lifeToolsSportsDecorate': () => import('@/views/life_tools/platform/PlatformSportsDecorate'),//体育健身首页装修
  'lifeToolsTicketDecorate': () => import('@/views/life_tools/platform/PlatformTicketDecorate'),//门票预约首页装修
  'lifeToolsPlatformReplyList': () => import('@/views/life_tools/platform/ReplyList'),//体育健身评价管理
  'lifeToolsPlatformScenicReplyList': () => import('@/views/life_tools/platform/ScenicReplyList'),//景区评价管理
  'lifeToolsPlatformSportsOrder': () => import('@/views/life_tools/platform/PlatformSportsOrderList'),//体育订单列表
  'lifeToolsPlatformSportsInformation': () => import('@/views/life_tools/platform/PlatformInformation'),//资讯
  'lifeToolsPlatformSports': () => import('@/views/life_tools/platform/PlatformSports'),//赛事列表
  'lifeToolsPlatformCategory': () => import('@/views/life_tools/platform/CategoryList'),//体育课程分类
  'lifeToolsPlatformToolsList': () => import('@/views/life_tools/platform/ToolsList'),//体育课程列表
  
  
  'lifeToolsPlatformScenicInformation': () => import('@/views/life_tools/platform/PlatformScenicInformation'),//景区资讯
  'lifeToolsPlatformScenicOrder': () => import('@/views/life_tools/platform/PlatformScenicOrderList'),//景区资讯
  
  'lifeToolsHelpNoticeList': () => import('@/views/life_tools/platform/HelpNoticeList'),//寻人求助
  'lifeToolsComplaintAdvice': () => import('@/views/life_tools/platform/ComplaintAdviceList'),//投诉建议
  'PlatformRecommendHot': () => import('@/views/life_tools/platform/PlatformRecommendHot'),
  'lifeToolsPlatformScenicKeFu': () => import('@/views/life_tools/platform/keFu'),//客服

  'lifeToolsPlatformAppointList': () => import('@/views/life_tools/platform/AppointList'),//预约列表
  'lifeToolsPlatformSaleBuilding': () => import('@/views/life_tools/platform/SaleBuildingList'),//在售楼盘
  'lifeToolsPlatformSaleBuildingEdit': () => import('@/views/life_tools/platform/modules/SaleBuildingEdit'),//在售楼盘新建编辑
  'lifeToolsPlatformSaleBuildingFloorPlan': () => import('@/views/life_tools/platform/SaleBuildingFloorPlanList'),//在售楼盘
  'lifeToolsPlatformSaleBuildingFloorPlanEdit': () => import('@/views/life_tools/platform/modules/SaleBuildingFloorPlanEdit'),
  'lifeToolsPlatformSaleBuildingManagement': () => import('@/views/life_tools/platform/modules/SaleBuildingManagement'),//在售楼盘楼栋管理
  'lifeToolsPlatformHouseBookingQueue': () => import('@/views/life_tools/platform/HouseBookingQueue'),//购房排卡
  'lifeToolsPlatformHouseBankCardUserList': () => import('@/views/life_tools/platform/modules/HouseBankCardUserList'),//购房排卡用户列表


  'LifeToolsPlatformScenicTicketSystem': () => import('@/views/life_tools/platform/ScenicTicketSystem'),
  'LifeToolsPlatformSportsTicketSystem': () => import('@/views/life_tools/platform/ScenicTicketSystem'),

  'lifeToolsPlatformPlatPublicSportsList': () => import('@/views/life_tools/platform/PlatPublicList'),
  'lifeToolsPlatformScenicAudit': () => import('@/views/life_tools/platform/PlatPublicList'),
  'lifeToolsPlatformPlatPublicSportsAudit': () => import('@/views/life_tools/merchant/ToolsEdit'),
  'lifeToolsPlatformPlatPublicScenicAudit': () => import('@/views/life_tools/merchant/ScenicToolsEdit'),
  'lifeToolsPlatformPlatPublicSportsTicketAudit': () => import('@/views/life_tools/merchant/TicketEdit'),
  'lifeToolsPlatformPlatPublicScenicTicketAudit': () => import('@/views/life_tools/merchant/TicketEdit'),

}
export default lifeToolsPlatformComponents