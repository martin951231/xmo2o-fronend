/**
 * 商家后台团购
 * @author 衡婷妹
 * @date 2020-11-16
 */
const MerchantGroupComponents = {
  // 添加商品 --> 团购商品
  'MerchantGroupAddGoods': () => import('@/views/group/merchant/GroupAddGoods'),
  // 场次预约
  'MerchantGroupBookingAppoint': () => import('@/views/group/merchant/BookingAppoint'),
  'MerchantGroupAddCashingGoods': () => import('@/views/group/merchant/GroupAddCashingGoods'),
  'MerchantGroupList': () => import('@/views/group/merchant/GroupList'),// 团购商品列表
  // 课程预约
  'MerchantGroupCourseAppoint': () => import('@/views/group/merchant/GroupCourseAppoint'),

  // 团购订单
  'MerchantGroupOrderList': () => import('@/views/group/merchant/OrderList'),

  // 预约管理
  'MerchantGroupAppointList': () => import('@/views/group/merchant/AppointList'),

    // 券码订单
    'MerchantGroupCouponList': () => import('@/views/group/merchant/CouponList'),

    //套餐管理
    'MerchantGroupPackageList': () => import('@/views/group/merchant/GroupPackageList'),
    //虚拟券码
    'VirtualCouponCodeList': () => import('@/views/group/merchant/VirtualCouponCodeList'),
}
export default MerchantGroupComponents
