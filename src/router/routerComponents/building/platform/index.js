/**
 * 商场
 */
const buildingPlatformComponents = {
  // 商场管理
  'SystemBuildingPlatformShoppingMall': () => import('@/views/building/platform/shoppingMall'),
  // 商场装修
  'SystemBuildingPlatformDecorate': () => import('@/views/building/platform/homeDecorate'),

  // 拍照积分
  'SystemBuildingPlatformTicketPoint': () => import('@/views/building/platform/ticketPoint'),

  // 商场模块店铺管理
  'SystemBuildingPlatformStore': () => import('@/views/building/platform/store'),

  // 商场模块拍照积分
  'SystemBuildingPlatformMallTicketPoint': () => import('@/views/building/platform/ticketPoint'),

  // 商场模块停车优惠
  'SystemBuildingPlatformParking': () => import('@/views/building/platform/parking'),

  // 商场模块wifi管理
  'SystemBuildingPlatformWifi': () => import('@/views/building/platform/wifi'),

  // 商场模块楼层管理
  'SystemBuildingPlatformfloorManage': () => import('@/views/building/platform/floorManage'),
}
export default buildingPlatformComponents