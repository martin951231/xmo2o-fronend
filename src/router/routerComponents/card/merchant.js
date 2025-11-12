/**
 * 会员卡
 */
const MerchantCardComponents = {
  'MerchantCardGoodsList': () => import('@/views/card/merchant/goodsList'), //会员卡商品列表 
  
  'MerchantCardGoodsSort': () => import('@/views/card/merchant/goodsSort'), //会员卡商品类型列表 
  'MerchantCardVerificationList': () => import('@/views/card/merchant/verificationList'), //核销列表
  
  'MerchantCardCashBack': () => import('@/views/card/merchant/cardCashBackList'), //优惠买单返还记录

  'MerchantPointGoods': () => import('@/views/card/merchant/pointGoods'),//积分商品
  'MerchantPointGoodsType': () => import('@/views/card/merchant/pointGoodsType'),//积分商品分类管理
}
export default MerchantCardComponents