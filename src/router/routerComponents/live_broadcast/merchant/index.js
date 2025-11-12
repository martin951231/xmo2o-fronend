/**
 * 商家后台直播
 */
const MerchantLiveBroadcastComponents = {
    PromoteProductLibrary: () => import('@/views/live_broadcast/merchant/PromoteProductLibrary'), //推广商品库
    RebateRevenueList: () => import('@/views/live_broadcast/merchant/RebateRevenueList'), //返佣营收
}
export default MerchantLiveBroadcastComponents
