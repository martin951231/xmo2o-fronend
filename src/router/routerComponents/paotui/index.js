const PaotuiPlatformComponents = {
    PaotuiPriceTemplate: () => import('@/views/paotui/platform/PriceTemplate'),  //价格模板
    PaotuiAddedFee: () => import('@/views/paotui/platform/AddedFee'), //增值费用
    PaotuiGrabPool: () => import('@/views/paotui/platform/GrabPool'), //跑腿抢单池
    PaotuiMerchant: () => import('@/views/paotui/platform/Merchant'), //跑腿商家
}
export default PaotuiPlatformComponents