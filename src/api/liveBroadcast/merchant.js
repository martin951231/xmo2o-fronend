const LiveBroadcastMerchantApi = {
  //获取商家直播申请权限
  getAuditInfo: '/wechatLive/merchant.Live/getWechatLiveApply',
  //商家提交申请
  submitWechatLiveApply: '/wechatLive/merchant.Live/submitWechatLiveApply',
  //获取商家主播
  getRoles: '/wechatLive/merchant.Live/getRoles',
  //保存主播
  saveRole: '/wechatLive/merchant.Live/saveRole',
  //删除主播
  delRole: '/wechatLive/merchant.Live/delRole',

  // 商家直播商品列表
  liveGoodsList: '/wechatLive/merchant.LiveGoods/liveGoodsList',
  // 商家直播商品添加
  liveGoodsAdd: '/wechatLive/merchant.LiveGoods/liveGoodsAdd',
  // 商家直播商品编辑
  liveGoodsEdit: '/wechatLive/merchant.LiveGoods/liveGoodsEdit',
  // 商家直播商品删除
  liveGoodsDelete: '/wechatLive/merchant.LiveGoods/liveGoodsDelete',
  // 商家直播商品状态
  liveGoodsChangeStatus: '/wechatLive/merchant.LiveGoods/liveGoodsChangeStatus',
  // 商家直播商品选择
  goodsList: '/wechatLive/merchant.LiveGoods/goodsList',
  //直播商品状态同步
  liveGoodsStatusUpdate: '/wechatLive/merchant.LiveGoods/liveGoodsStatusUpdate',
  
  //获取直播间列表
  getRooms: '/wechatLive/merchant.Live/getRooms',
  //获取分享二维码
  getRoomShare: '/wechatLive/merchant.Live/getRoomShare',
  //删除直播间
  delRoom: '/wechatLive/merchant.Live/delRoom',
}
export default LiveBroadcastMerchantApi