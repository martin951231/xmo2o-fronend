const groupPlatformApi = {
  // 优惠组合
  groupCombineList: '/group/platform.groupCombine/groupCombinelist' ,// 团购组合列表
  getGroupCombineDetail: '/group/platform.groupCombine/getGroupCombineDetail' ,// 获得活动详情
  editGroupCombine: '/group/platform.groupCombine/editGroupCombine' ,// 编辑活动
  getGroupCombineGoodsList: '/group/platform.group/getGroupCombineGoodsList' ,// 获得团购优惠组合可选择的商品列表
  getGroupCombineOrderList: '/group/platform.groupOrder/getGroupCombineOrderList' ,// 获得团购优惠组合订单列表
  exportCombineOrder: '/group/platform.groupOrder/exportCombineOrder' ,// 团购组合订单列表导出
  getRobotList: '/group/platform.groupCombine/getRobotList' ,// 获得机器人列表
  addRobot: '/group/platform.groupCombine/addRobot' ,// 添加机器人
  delRobot: '/group/platform.groupCombine/delRobot' ,// 删除机器人
  editSpreadNum: '/group/platform.groupCombine/editSpreadNum' ,// 编辑机器人推荐人数

  // 团购商品
  getGroupGoodsList: '/group/platform.group/getGroupGoodsList' ,// 获得团购商品列表

  // 团购分类
  getGroupFirstCategorylist: '/group/platform.groupCategory/getGroupFirstCategorylist' ,// 团购分类一级列表
  getCategoryTree: '/group/platform.groupCategory/getCategoryTree' ,// 团购分类列表

  // 获得全部支付方式
  getPayMethodList: '/group/platform.groupOrder/getPayMethodList' ,// 获得全部支付方式

  // 团购订单
  getOrderDetail: '/group/platform.groupOrder/getOrderDetail',// 获得订单详情
  editOrderNote:  '/group/platform.groupOrder/editOrderNote',// 修改订单备注

  // 团购首页频道页装修
  getCfgInfo: '/group/platform.groupRenovation/getInfo',// 获得基本信息
  editCfgInfo: '/group/platform.groupRenovation/editCfgInfo',// 优选商品编辑基本信息
  editCfgSort: '/group/platform.groupRenovation/editCfgSort',// 优选商品编辑排序
  getRenovationGoodsList: '/group/platform.groupRenovation/getRenovationGoodsList' ,// 获得团购优选商品已装修的商品列表
  editCombineCfgInfo: '/group/platform.groupRenovation/editCombineCfgInfo',// 超值组合编辑基本信息
  editCombineCfgSort: '/group/platform.groupRenovation/editCombineCfgSort',// 超值组合编辑排序
  getRenovationCombineGoodsList: '/group/platform.groupRenovation/getRenovationCombineGoodsList',// 获得团购超值组合已装修的商品列表
  getRenovationCustomList: '/group/platform.groupRenovation/getRenovationCustomList',// 获得店铺活动推荐
  addRenovationCustom: '/group/platform.groupRenovation/addRenovationCustom',// 编辑店铺活动推荐
  getRenovationCustomInfo: '/group/platform.groupRenovation/getRenovationCustomInfo',// 获取店铺活动推荐基本信息
  delRenovationCustom: '/group/platform.groupRenovation/delRenovationCustom',// 删除店铺活动推荐
  getGroupCategoryList: '/group/platform.group/getGroupCategoryList',// 获得团购商品有效分类
  getRenovationCustomStoreSortList: '/group/platform.groupRenovation/getRenovationCustomStoreSortList',// 获得团购首页自定义活动推荐店铺管理列表
  editRenovationCustomStoreSort: '/group/platform.groupRenovation/editRenovationCustomStoreSort',// 团购首页自定义活动推荐店铺管理排序
  getRenovationCustomGroupSortList: '/group/platform.groupRenovation/getRenovationCustomGroupSortList',// 获得团购发现页团购分类商品管理列表
  editRenovationCustomGroupSort: '/group/platform.groupRenovation/editRenovationCustomGroupSort',// 团购发现页团购分类商品管理排序
  getGroupCategorylist: '/group/platform.groupCategory/getGroupCategorylist', // 团购分类列表
  delGroupCategory: '/group/platform.groupCategory/delGroupCategory', // 团购分类删除
  addGroupCategory: '/group/platform.groupCategory/addGroupCategory', // 添加编辑团购分类信息
  configGroupCategory: '/common/platform.index/config', // 编辑器数量和编辑器标题两栏根据网站基本信息接口
  uploadPictures: '/common/common.UploadFile/uploadPictures', // 上传图片
  getGroupCategoryInfo: '/group/platform.groupCategory/getGroupCategoryInfo', // 获取团购分类信息
  groupCategorySaveSort: '/group/platform.groupCategory/saveSort', // 团购分类 保存排序
  getGroupCategoryCueList: '/group/platform.groupCategory/getGroupCategoryCueList', // 团购分类购买须知填写项列表
  getGroupCategoryCatFieldList: '/group/platform.groupCategory/getCatFieldList', // 团购分类管理商品属性字段 列表
  getGroupCategoryWriteFieldList: '/group/platform.groupCategory/getWriteFieldList', // 团购分类自定义填写选项列表
  delGroupCategoryCue: '/group/platform.groupCategory/delGroupCategoryCue', // 团购分类购买须知填写项删除
  delGroupCategoryWriteField: '/group/platform.groupCategory/delWriteField', // 团购分类定制-自定义填写选项添加字段 删除
  groupCategoryCatFieldShow: '/group/platform.groupCategory/catFieldShow', // 团购分类定制-管理商品属性字段 前端显示隐藏
  editGroupCategoryCue: '/group/platform.groupCategory/editGroupCategoryCue', // 团购分类购买须知填写项编辑
  groupCategoryAddWriteField: '/group/platform.groupCategory/addWriteField', // 团购分类定制-自定义填写选项添加字段 操作
  groupCategoryAddCatField: '/group/platform.groupCategory/addCatField', // 团购分类定制-管理商品属性字段 添加
  getAdverList: '/group/platform.groupAdver/getAdverList',// 获取广告列表
  getAllArea: '/common/common.area/getAllArea',// 获取区域
  addGroupAdver: '/group/platform.groupAdver/addGroupAdver',// 团购添加广告
  delGroupAdver: '/group/platform.groupAdver/delGroupAdver',// 团购删除广告
  getEditAdver: '/group/platform.groupAdver/getEditAdver',// 获取团购广告信息
  updateGroupCategoryBgColor: '/group/platform.groupCategory/updateGroupCategoryBgColor', // 更新团购分类背景色
  getGroupSearchHotList: '/group/platform.groupSearchHot/getGroupSearchHotList', // 获得团购频道页子分类页热搜词列表
  addGroupSearchHot: '/group/platform.groupSearchHot/addGroupSearchHot', // 编辑团购频道页子分类页热搜词
  getGroupSearchHotInfo: '/group/platform.groupSearchHot/getGroupSearchHotInfo', // 获取团购频道页子分类页热搜词信息
  saveSearchHotSort: '/group/platform.groupSearchHot/saveSearchHotSort',// 保存团购频道页子分类页热搜词排序
  delSearchHot: '/group/platform.groupSearchHot/delSearchHot',// 删除团购频道页子分类页热搜词
  getUrl: '/group/platform.group/getUrl',// 获取团购新版装修页
  changeShow: '/group/platform.groupHomeMenu/changeShow',// 修改附近好点是否显示
  getShow: '/group/platform.groupHomeMenu/getShow',// 获取附近好店显示状态
  getReply: '/group/platform.groupCombine/getReply',// 优惠组合套餐-评论列表
  getReplyDetail: '/group/platform.groupCombine/getReplyDetail',// 优惠组合套餐-评论详情

  //社区团购
  groupOrderShareList: '/villageGroup/platform.GroupOrder/groupOrderShareList',// 社区团购分享明细
  // 团购首页装修顶部装修配置
  getHomeTopConfig:'/group/platform.groupHomeMenu/getHomeTopConfig',
  // 团购首页装修顶部装修配置
  editHomeTopConfig:'/group/platform.groupHomeMenu/editHomeTopConfig',

  // 团购首页装饰-修改活动推荐配置
  changeActivityType:'/group/platform.groupHomeMenu/changeActivityType',
  // 商品活动推荐-添加/编辑置顶商品
  addGoodsCustomGroup:'/group/platform.groupRenovation/addGoodsCustomGroup',
  // 商品活动推荐-删除置顶商品
  delGoodsCustomGroup:'/group/platform.groupRenovation/delGoodsCustomGroup',
  // 商品活动推荐-修改置顶商品排序值
  changeGoodsCustomSort:'/group/platform.groupRenovation/changeGoodsCustomSort',
}
  
  export default groupPlatformApi