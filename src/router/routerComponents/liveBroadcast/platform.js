const PlatFormLiveBroadcastComponents = {
    // 平台直播商品库列表
    'PlatFormLiveCommodityList': () => import('@/views/liveBroadcast/platform/liveCommodityList'),
    //直播商家列表
    'LiveMerchantList': () => import('@/views/liveBroadcast/platform/liveMerchantList'),

    //直播间
    'LiveRoomList': () => import('@/views/liveBroadcast/platform/liveRoom'),
  }
  export default PlatFormLiveBroadcastComponents