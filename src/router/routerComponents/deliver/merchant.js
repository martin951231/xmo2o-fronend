/**
 * 商家后台配送
 * @author 汪晨
 * @date 2021/7/20
 */
const DeliverMerchantComponents = {
  'DeliverCouponList': () => import('@/views/deliver/merchant/DeliverCouponList'), //配送优惠发放列表
  'DeliverCoupon': () => import('@/views/deliver/merchant/DeliverCoupon'), //配送优惠发放
}
export default DeliverMerchantComponents