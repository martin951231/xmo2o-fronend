/**
 *******************
 *   @author 张涛
 *   @date 2020-11-23
 *   @description 信息相关组件
 *******************
 */
const CouponPlatformComponents = {
    // 热搜词
    'SearchHotWords': () => import('@/views/coupon/platform/SearchHotWords'),
    //品牌精选
    'BrandSelection': () => import('@/views/coupon/platform/BrandSelection'),
    //系统优惠券核销记录
    'SysUseRecords': () => import('@/views/coupon/platform/SysUseRecords'),

    //商家优惠券核销记录
    'MerUseRecords': () => import('@/views/coupon/merchant/MerUseRecords'),

    //商家智能发券
    'SmartCoupon': () => import('@/views/coupon/merchant/SmartCoupon'),
}
export default CouponPlatformComponents
  