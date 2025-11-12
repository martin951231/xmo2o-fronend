const packageApi = {
  // 功能套餐接口
  packageList: '/community/platform.PrivilegePackage/getList' ,// 套餐列表
  getEditInfo: '/community/platform.PrivilegePackage/detailPrivilegePackage' ,// 获得套餐添加编辑所需信息
  getFunctionApp: '/community/platform.PrivilegePackage/getFunctionApplication' ,// 功能应用
  delPackage: '/community/platform.PrivilegePackage/delPrivilegePackage' ,// 删除
  addPackage: '/community/platform.PrivilegePackage/addPrivilegePackage' ,// 添加和编辑
  // 功能套餐账单接口
  packageOrderList: '/community/platform.PackageOrder/getList' ,// 订单列表
  packageOrderInfo: '/community/platform.PackageOrder/getInfo' ,// 订单详情
  // 房间套餐接口
  roomPackageList: '/community/platform.RoomPackage/getList' ,// 房间套餐列表
  addRoomPackage: '/community/platform.RoomPackage/addRoomPackage' ,// 房间套餐-添加和编辑
  detailRoomPackage: '/community/platform.RoomPackage/getDetails' ,// 获得套餐添加编辑所需信息
  delRoomPackage: '/community/platform.RoomPackage/delRoomPackage' ,// 删除
  // 房间套餐账单接口
  packageRoomOrderList: '/community/platform.PackageRoomOrder/getList' ,// 订单列表
  packageRoomOrderInfo: '/community/platform.PackageRoomOrder/getInfo' ,// 订单详情
}
export default packageApi