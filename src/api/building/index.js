const buildingPlatformApi = {
  'getShoppingMallLists': '/building/platform.ShoppingMall/getLists', // 获取商场列表
  'changeShoppingMallStus': '/building/platform.ShoppingMall/changeStatus', //更改商场状态
  'getShoppingMall': '/building/platform.ShoppingMall/detail',  //获取商场详情
  'getBindStoreLists': '/building/platform.ShoppingMall/getBindStore',  //获取绑定店铺
  'getBindAdminUserLists': '/building/platform.ShoppingMall/getBindAdminUser',  //获取绑定管理员
  'changeBindAdminUserStatus': '/building/platform.ShoppingMall/changeBindStatus',  //解绑管理员

  'decorate': '/building/platform.ShoppingMall/decorate',  //装修数据

  'getAdverLists': '/building/platform.ShoppingMall/getAdverLists', // 获取轮播图列表
  'getAdver': '/building/platform.ShoppingMall/getAdver', ////获取轮播图详情
  'saveAdver': '/building/platform.ShoppingMall/saveAdver', // 保存轮播图
  'delAdver': '/building/platform.ShoppingMall/delAdver', // 删除轮播图

  'setMallConfig': '/building/platform.ShoppingMall/setMallConfig', // 设置底部导航文字颜色

  'getGuessYouLike': '/building/platform.ShoppingMall/getGuessYouLike', // 获取猜你喜欢设置
  'setGuessYouLike': '/building/platform.ShoppingMall/setGuessYouLike', // 设置猜你喜欢

  'saveTicketPointConfig': '/building/platform.ShoppingMall/saveTicketPointConfig', // 保存积分拍照基础配置
  'getTicketPointConfig': '/building/platform.ShoppingMall/getTicketPointConfig', // 获取积分拍照基础配置

  'getTicketPointLists': '/building/platform.ShoppingMall/getTicketPointLists', // 获取积分拍照申请记录
  'getTicketPointDetail': '/building/platform.ShoppingMall/getTicketPointDetail', // 获取积分拍照申请详情
  'handleTicketPoint': '/building/platform.ShoppingMall/handleTicketPoint', // 审核积分拍照申请
  'calTicketGetScore': '/building/platform.ShoppingMall/calTicketGetScore', // 根据金额预估获取积分数量
  'handleTicketPointLogs': '/building/platform.ShoppingMall/handleTicketPointLogs', // 审核记录

  'getWifiLists': '/building/platform.ShoppingMall/getWifiLists', // 获取WIFI列表
  'saveWifi': '/building/platform.ShoppingMall/saveWifi', // 添加/编辑WIFI
  'deleteWifi': '/building/platform.ShoppingMall/deleteWifi', // 删除WIFI
  'changeWifiStatus': '/building/platform.ShoppingMall/changeWifiStatus', // 切换WiFi状态


  'getUserLevels': '/building/platform.ShoppingMall/userLevels', // 获取用户会员等级
  'saveParkingDiscount': '/building/platform.ShoppingMall/saveParkingDiscount', // 添加/编辑会员等级停车优惠

  'saveShoppingMall' : '/building/platform.ShoppingMall/saveShoppingMall',// 保存商场
  'getCanBindAdminUser': '/building/platform.ShoppingMall/getCanBindAdminUser',// 获取可绑定的管理员

  'buildingGetList': '/building/platform.ShoppingMallBuilding/getList', // 获取商场下的楼栋列表
  'buildingSaveInfo': '/building/platform.ShoppingMallBuilding/saveInfo', //楼栋添加/编辑
  'buildingDelInfo': '/building/platform.ShoppingMallBuilding/delInfo', //楼栋删除
  'getFloorList': '/building/platform.ShoppingMallFloor/getList', //楼层删除
  'saveFloorInfo': '/building/platform.ShoppingMallFloor/saveInfo', //楼层删除
  'delFloorInfo': '/building/platform.ShoppingMallFloor/delInfo', //楼层删除
  'getMallBindStore': '/building/platform.ShoppingMallStore/getMallBindStore', //楼层店铺列表
  'storeBindFloor': '/building/platform.ShoppingMallStore/storeBindFloor', //店铺批量绑定楼层
  'getStoreList': '/building/platform.ShoppingMallStore/getStoreList', //获取店铺列表
  'mallBindStore': '/building/platform.ShoppingMallStore/mallBindStore', //商场绑定店铺
  'importStore': '/building/platform.ShoppingMallStore/importStore', //商场批量导入店铺
  'saveRoomInfo': '/building/platform.ShoppingMallFloor/saveRoomInfo', //添加/编辑房间
  'delRoomInfo': '/building/platform.ShoppingMallFloor/delRoomInfo', //删除房间
  'unbindStore': '/building/platform.ShoppingMallStore/unbindStore', //解绑店铺
  'getRoomList': '/building/platform.ShoppingMallFloor/getRoomList', //楼层房间列表
}
export default buildingPlatformApi