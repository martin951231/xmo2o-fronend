const MallPlatformComponents = {
  'hotSearch': () => import('@/views/mall/platform/HotSearch'),
  'platformMallGoods': () => import('@/views/mall/platform/MallGoods'),
  'ActivityLimitedRecommend': () => import('@/views/mall/platform/ActivityLimitedRecommend'), //秒杀活动商品推荐
  'ActivityGroupRecommend': () => import('@/views/mall/platform/ActivityGroupRecommend'), //拼团活动商品推荐
  'ActivityBargainRecommend': () => import('@/views/mall/platform/ActivityBargainRecommend'), //拼团活动商品推荐
  'platformComment': () => import('@/views/mall/platform/ReplyList'), // 评论管理
  'orderMange': () => import('@/views/mall/platform/OrderManage'), // 订单管理
  'orderDetail': () => import('@/views/mall/platform/OrderDetail'), // 订单管理
  'SystemPlatformDecorate': () => import('@/views/mall/platform/PlatformHomeDecorate'),//商城首页装修
  'platformMallPageView': () => import('@/views/mall/platform/platformMallPageView'), // 浏览量分享
  'platformMallPageView': () => import('@/views/mall/platform/platformMallPageView'), // 浏览量分享
  'MallCommodityAudit': () => import('@/views/mall/platform/MallCommodityAudit'),//商城商品审核
  'platformMallDeliverySetting': () => import('@/views/mall/platform/platformMallDeliverySetting'),//商城平台配送设置

  'productGuarantee': () => import('@/views/mall/platform/productGuarantee'),//服务保障
  'productBrands': () => import('@/views/mall/platform/Brands'),//品牌管理
}
export default MallPlatformComponents