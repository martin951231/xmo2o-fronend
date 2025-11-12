/**
 * 商家后台餐饮
 * @author 张涛
 * @date 2020-07-06
 */
const MerchantShopComponents = {
  'MerchantGoodsNthOffList': () => import('@/views/shop/merchant/GoodsNthOffList'), //营销活动>第n件优惠
  'MerchantGoodsNthOffEdit': () => import('@/views/shop/merchant/GoodsNthOffEdit'), //营销活动>第n件优惠>新增编辑
}
export default MerchantShopComponents