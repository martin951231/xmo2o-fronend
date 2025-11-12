const packagePlatformComponents = {
  // 动态引入的页面组件 功能套餐管理
  'PackageList': () => import('@/views/system/community/PackageList'),
  //  房间套餐管理  
  'RoomPackageList': () => import('@/views/system/community/RoomPackageList'),
  //  功能套餐账单  
  'PackageBillList': () => import('@/views/system/community/PackageBillList'),
  //  房间套餐账单
  'RoomPackageBillList': () => import('@/views/system/community/RoomPackageBillList'),
  //  海康6000C设备边缘 社区信息
  'Community6000CList': () => import('@/views/system/community/Community6000CList'),
  
  'HouseCityRegionManageBase': () => import('@/views/system/community/cityRegionManage/manageBase'), //城市区域管理
    //  子商户
    'MerList': () => import('@/views/system/childrenMerchant/MerList'),//子商户列表
    //投票活动
    'VoteList': () => import('@/views/system/vote/index'),
    'contributionRateList': () => import('@/views/system/houseStatistics/contributionRateList'),
    //  合同管理
    'ContractManage': () => import('@/views/system/contractManage/index'),
    'MerList': () => import('@/views/system/childrenMerchant/MerList'),//子商户列表
	//  垃圾回收
	'equipmentList': () => import('@/views/system/garbageRecycle/equipmentList/index'),//设备列表
	'releaseRecord': () => import('@/views/system/garbageRecycle/releaseRecord/index'),//投放记录
	'warningRecord': () => import('@/views/system/garbageRecycle/warningRecord/index'),//预警记录
}
export default packagePlatformComponents