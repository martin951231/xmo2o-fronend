const LiveBroadcastPlatformApi = {
    //直播商家
    merchantLists: '/wechatLive/platform.Live/merchantLists',
    //提交审核
    handleAudit: '/wechatLive/platform.Live/handleAudit',
    //禁播/恢复直播
    changeLiveAuth: '/wechatLive/platform.Live/changeLiveAuth',

    // 平台直播商品列表
    liveGoodsList: '/wechatLive/platform.LiveGoods/liveGoodsList',
    // 平台直播商品状态
    liveGoodsChangeStatus: '/wechatLive/platform.LiveGoods/liveGoodsChangeStatus',
    // 平台直播商品删除
    liveGoodsDelete: '/wechatLive/platform.LiveGoods/liveGoodsDelete',
    // 平台直播商品佣金比例
    liveGoodsSetCommissionRate: '/wechatLive/platform.LiveGoods/liveGoodsSetCommissionRate',

    //获取直播间列表
    getRooms: '/wechatLive/platform.Live/getRooms',
    //获取分享二维码
    getRoomShare: '/wechatLive/platform.Live/getRoomShare',
    //删除直播间
    delRoom: '/wechatLive/platform.Live/delRoom',
  }
  export default LiveBroadcastPlatformApi