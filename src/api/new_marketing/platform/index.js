const marketingPlatformApi = {
  regionalAgencyList: '/new_marketing/platform.RegionalAgency/regionalAgencyList',
  findArea: '/new_marketing/platform.RegionalAgency/findArea',
  findRight: '/new_marketing/platform.RegionalAgency/findRight',
  findRightEdit: '/new_marketing/platform.RegionalAgency/findRightEdit',
  addRegionalAgency: '/new_marketing/platform.RegionalAgency/addRegionalAgency',
  editRegionalAgency: '/new_marketing/platform.RegionalAgency/editRegionalAgency',
  saveRegionalAgency: '/new_marketing/platform.RegionalAgency/saveRegionalAgency',
  delRegionalAgency: '/new_marketing/platform.RegionalAgency/delRegionalAgency',

  reduceWin: '/new_marketing/platform.RegionalAgency/reduceWin',
  addReduce: '/new_marketing/platform.RegionalAgency/addReduce',
  getTeamList1: '/new_marketing/platform.RegionalAgency/getTeamList',
  updatePercent: '/new_marketing/platform.RegionalAgency/updatePercent',

  getMarketingArtisanList: '/new_marketing/platform.MarketingArtisan/getMarketingArtisanList', // 技术人员列表
  getMarketingArtisanCreate: '/new_marketing/platform.MarketingArtisan/getMarketingArtisanCreate', // 技术人员操作
  getMarketingArtisanInfo: '/new_marketing/platform.MarketingArtisan/getMarketingArtisanInfo', // 技术人员一条数据
  getMarketingArtisanDir: '/new_marketing/platform.MarketingArtisan/getMarketingArtisanDir', // 技术人员更换主管
  getDirectorList: '/new_marketing/platform.MarketingArtisan/getDirectorList', // 选择更换主管列表
  getMarketingArtisanDel: '/new_marketing/platform.MarketingArtisan/getMarketingArtisanDel', // 技术人员移除

  getMarketingDirectorList: '/new_marketing/platform.MarketingDirector/getMarketingDirectorList', // 技术主管列表
  getMarketingDirectorCreate: '/new_marketing/platform.MarketingDirector/getMarketingDirectorCreate', // 技术主管操作
  getMarketingDirectorInfo: '/new_marketing/platform.MarketingDirector/getMarketingDirectorInfo', // 技术主管一条数据
  getMarketingDirectorDel: '/new_marketing/platform.MarketingDirector/getMarketingDirectorDel', // 技术主管移除
  getMarketingDirectorRemove: '/new_marketing/platform.MarketingDirector/getMarketingDirectorRemove', // 技术主管/成员管理列表
  getMarketingDirectorArtisan: '/new_marketing/platform.MarketingDirector/getMarketingDirectorArtisan', // 技术主管移出

  getManagerList: '/new_marketing/platform.ServiceManager/serviceManagerList', // 获取业务经理列表
  addManager: '/new_marketing/platform.ServiceManager/addServiceManager', // 添加业务经理
  editManager: '/new_marketing/platform.ServiceManager/saveServiceManager', // 编辑业务经理
  delNoTeamManager: '/new_marketing/platform.ServiceManager/doDelManager', // 删除没有团队的业务经理
  getTeamMemberList: '/new_marketing/platform.ServiceManager/getTeamPerson', // 获取团队业务接手成员
  upgradeManager: '/new_marketing/platform.ServiceManager/doUpLevel', // 升级业务经理
  deleteManager: '/new_marketing/platform.ServiceManager/doDelServiceManager', // 移除业务经理
  demoteManager: '/new_marketing/platform.ServiceManager/doDownLevel', // 降级业务经理

  getAreaList: '/new_marketing/platform.Region/regionList', // 获取营销价格设置区域列表
  getClassifyPriceList: '/new_marketing/platform.Region/classPriceList', // 获取分类店铺价格设置列表
  saveAreaPriceForm: '/new_marketing/platform.Region/addRegion', // 保存地区信息
  saveClassifyPriceForm: '/new_marketing/platform.Region/addClassPrice', //  保存分类价格信息
  deleteAreaPriceForm: '/new_marketing/platform.Region/delRegion', // 删除地区信息
  getAreaMealList: '/new_marketing/platform.MarketingPackage/getAreaSearchList', // 获取地区套餐列表
  saveAreaMealForm: '/new_marketing/platform.MarketingPackage/editAreaPost', // 保存地区套餐价格
  saveAreaMealStatus: '/new_marketing/platform.MarketingPackage/setAreaStatus', // 更改地区套餐状态

  getStoreTypeList: '/new_marketing/platform.MarketingPackage/getStoreTypeList', // 获取店铺类型列表
  addMeal: '/new_marketing/platform.MarketingPackage/add', // 添加套餐
  getMealList: '/new_marketing/platform.MarketingPackage/getSearchList', // 获取套餐列表
  deleteMeal: '/new_marketing/platform.MarketingPackage/del', // 删除套餐
  editMeal: '/new_marketing/platform.MarketingPackage/editPost', // 编辑套餐

  getCommissionSearchData: '/new_marketing/platform.MarketingPersonSettle/getSearchData', // 获取人员提成搜索数据
  getCommissionList: '/new_marketing/platform.MarketingPersonSettle/getSearchList', // 获取人员提成搜索列表

  teamManagementList: '/new_marketing/platform.TeamManagement/teamManagementList', // 团队管理团队列表
  teamPerformance: '/new_marketing/platform.TeamManagement/teamPerformance', // 团队管理总业绩
  serviceManagerList: '/new_marketing/platform.TeamManagement/serviceManagerList', // 团队管理业务经理列表
  serviceManagerNoList: '/new_marketing/platform.TeamManagement/serviceManagerNoList', // 团队管理未绑定团队的业务经理列表
  regionalAgentList: '/new_marketing/platform.TeamManagement/regionalAgentList', // 团队管理区域代理列表
  artisanList: '/new_marketing/platform.TeamManagement/artisanList', // 团队管理技术人员列表
  teamManagementAdd: '/new_marketing/platform.TeamManagement/teamManagementAdd', // 团队管理创建团队
  teamManagementBasic: '/new_marketing/platform.TeamManagement/teamManagementBasic', // 团队管理团队基本信息
  teamManagementReplace: '/new_marketing/platform.TeamManagement/teamManagementReplace', // 团队详情更换团队
  teamManagementUpgrade: '/new_marketing/platform.TeamManagement/teamManagementUpgrade', // 团队详情团队业务员升级业务经理
  teamBusinessList: '/new_marketing/platform.TeamManagement/teamBusinessList', // 团队管理业务员
  teamManagementDel: '/new_marketing/platform.TeamManagement/teamManagementDel', // 团队管理团队基本信息业务员移除
  teamManagementTransfer: '/new_marketing/platform.TeamManagement/teamManagementTransfer', // 团队管理进本信息业务员业务转移
  teamManagementDiss: '/new_marketing/platform.TeamManagement/teamManagementDiss', // 解散团队
  teamMemberAdd: '/new_marketing/platform.TeamManagement/teamMemberAdd', // 团队管理团队成员添加编辑
  teamManagementEdit: '/new_marketing/platform.TeamManagement/teamManagementEdit', // 团队管理团队基本信息编辑
  teamMemberEdit: '/new_marketing/platform.TeamManagement/teamMemberEdit', // 团队管理团队成员提成比例批量设置
  teamMemberCode: '/new_marketing/platform.TeamManagement/teamMemberCode', // 团队管理新增成员用户id校验用户是否存在
  teamManagementSavage: '/new_marketing/platform.TeamManagement/teamManagementSavage', // 团队管理团队业绩详情列表
  teamManagementMerchantList: '/new_marketing/platform.TeamManagement/teamManagementMerchantList', // 团队管理注册商家列表
  teamManagementSavageDetail: '/new_marketing/platform.TeamManagement/teamManagementSavageDetail', // 店铺订单详情
  getCommunityOrderDetail: '/new_marketing/platform.TeamManagement/getCommunityOrderDetail', // 物业订单详情

  positionReviewList: '/new_marketing/platform.PositionReview/positionReviewList', // 职位审核列表
  getTeamList: '/new_marketing/platform.PositionReview/getTeamList', // 获取本团队的所有成员
  reviewAgree: '/new_marketing/platform.PositionReview/reviewAgree', // 审核通过
  reviewDisagree: '/new_marketing/platform.PositionReview/reviewDisagree', // 审核不通过

  getOrderList: '/new_marketing/platform.OrderInfo/orderList', // 订单数据-订单列表
  getAreaUidByProvince: '/new_marketing/platform.OrderInfo/getAreaUidByProvince', // 订单数据-根据区域获取区域代理列表
  getTeamIdByAreaUid: '/new_marketing/platform.OrderInfo/getTeamIdByAreaUid', // 订单数据-通过区域代理获取团队id
  getOrderDetail: '/new_marketing/platform.OrderInfo/getOrderInfo', // 订单数据-订单详情

  teamManagementMerchantTransferList: '/new_marketing/platform.TeamManagement/teamManagementMerchantTransferList', // 团队管理商家业务转移接受成员
  teamManagementMerchantTransferCreate: '/new_marketing/platform.TeamManagement/teamManagementMerchantTransferCreate', // 团队管理注册商家商家业务转移
  getMerchantList: '/new_marketing/platform.Merchant/getMerchantList', // 商家列表
  getMerchantStoreList: '/new_marketing/platform.Merchant/getMerchantStoreList', // 商家列表已创建店铺
  // 团队管理 团队基本信息 成员信息
  teamMembeInfo: '/new_marketing/platform.TeamManagement/teamMembeInfo',
  // 团队管理 团队详情 物业列表
  getPropertyList: '/new_marketing/platform.MarketingProperty/getPropertyList',
  // 团队管理 团队详情 物业列表 业务转移
  villageTransferBusiness: '/new_marketing/platform.MarketingProperty/transferBusiness',
  // 商家列表 商家信息及订单
  teamMerchantOrderList: '/new_marketing/platform.TeamManagement/teamMerchantOrderList',

  
  // 物业列表 
  getHousePropertyList: '/new_marketing/platform.HouseProperty/getHousePropertyList',// 获得物业列表
  getHousePropertyDetail: '/new_marketing/platform.HouseProperty/getHousePropertyDetail',// 获得物业详情
}
export default marketingPlatformApi
