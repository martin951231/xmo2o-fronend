const MarketingPlatformComponents = {
  regionalAgencyList: () => import('@/views/new_marketing/platform/regionalAgencyList'),
  // 技术主管
  MarketingDirectorList: () => import('@/views/new_marketing/platform/MarketingDirectorList'),
  // 技术人员
  MarketingArtisanList: () => import('@/views/new_marketing/platform/MarketingArtisanList'),
  // 团队管理
  TeamManagementList: () => import('@/views/new_marketing/platform/teamManagementList'),
  MarketingAreaTeamList: () => import('@/views/new_marketing/platform/MarketingAreaTeamList'),

  regionalAgencyList: () => import('@/views/new_marketing/platform/regionalAgencyList'),
  // 技术主管
  MarketingDirectorList: () => import('@/views/new_marketing/platform/MarketingDirectorList'),
  // 技术人员
  MarketingArtisanList: () => import('@/views/new_marketing/platform/MarketingArtisanList'),
  // 业务经理
  ManagerList: () => import('@/views/new_marketing/platform/ManagerList'),
  //   团队详情
  TeamDetail: () => import('@/views/new_marketing/platform/teamDetail'),
  //   商家列表
  MerchantList: () => import('@/views/new_marketing/platform/merchantList'),
  //   商家信息及订单
  MerchantDetail: () => import('@/views/new_marketing/platform/merchantDetail'),
  //   物业列表
  HousePropertyList: () => import('@/views/new_marketing/platform/HousePropertyList'),
  //   物业信息及订单
  HousePropertyDetail: () => import('@/views/new_marketing/platform/HousePropertyDetail'),
  // 人员提成查询
  CommissionList: () => import('@/views/new_marketing/platform/CommissionList'),
  // 店铺价格设置
  SetClassifyPrice: () => import('@/views/new_marketing/platform/SetClassifyPrice'),
  // 套餐管理
  SetMealManagement: () => import('@/views/new_marketing/platform/SetMealManagement'),
  // 订单列表
  OrderInfo: () => import('@/views/new_marketing/platform/OrderInfo'),
  // 审核列表
  PositionReviewList: () => import('@/views/new_marketing/platform/PositionReviewList')
}
export default MarketingPlatformComponents
