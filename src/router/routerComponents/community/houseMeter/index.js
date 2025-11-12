/**
 *******************
 *   @author zhubd
 *   @date 2021-02-13
 *   @description 信息相关组件
 *******************
 */
const pageHouseMeterComponents = {
  // 你需要动态引入的页面组件 修改密码页面
  'editPassword': () => import('@/views/community/houseMeter/adminUser/editPassword'),
  // 你需要动态引入的页面组件 管理员列表
  'adminUserList': () => import('@/views/community/houseMeter/adminUser/adminUserList'),
  // 你需要动态引入的页面组件 城市列表
  'electricAreaList': () => import('@/views/community/houseMeter/electricPrice/cityList'),
  // 你需要动态引入的页面组件 添加收费标准
  'electricPrice': () => import('@/views/community/houseMeter/electricPrice/price'),
  // 你需要动态引入的页面组件 账单管理
  'orderList': () => import('@/views/community/houseMeter/orderPayment/orderList'),

  // 你需要动态引入的页面组件 电表设置
  'electricSet': () => import('@/views/community/houseMeter/intellectMeter/setElectric'),
  // 你需要动态引入的页面组件 电表列表
  'electricList': () => import('@/views/community/houseMeter/intellectMeter/electricList'),
  // 你需要动态引入的页面组件 分组列表
  'groupList': () => import('@/views/community/houseMeter/intellectMeter/electricGroupList'),
  // 你需要动态引入的页面组件 编辑电表
  'electricEdit': () => import('@/views/community/houseMeter/intellectMeter/editElectric'),
  // 你需要动态引入的页面组件 编辑电表分组
  'groupEdit': () => import('@/views/community/houseMeter/intellectMeter/editElectricGroup'),

}
export default pageHouseMeterComponents
  