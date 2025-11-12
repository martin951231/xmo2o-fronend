const mallPlatformApi = {
  'getSearchHotList': '/mall/platform.MallSearchHot/getSearchHotList',
  'getHotRecord': '/mall/platform.MallSearchHot/getHotRecord',
  'addOrEditSearchHot': '/mall/platform.MallSearchHot/addOrEditSearchHot',
  'getEditSearchHot': '/mall/platform.MallSearchHot/getEditSearchHot',
  'delSearchHot': '/mall/platform.MallSearchHot/delSearchHot',
  'saveSort': '/mall/platform.MallSearchHot/saveSort',
  'getGoodsList': '/mall/platform.MallPlatformGoods/getGoodsList',
  'getMerOrStoreList': '/mall/platform.MallPlatformGoods/getMerOrStoreList',
  'goodsCategoryList': '/mall/platform.MallGoodsCategory/goodsCategoryList',
  'goodsSetSort': '/mall/platform.MallPlatformGoods/setSort',
  'getGoodsListByName': '/mall/platform.MallPlatformGoods/getGoodsListByName',
  'exportGoods': '/mall/platform.MallPlatformGoods/exportGoods',
  'goodsSetIntegral': '/mall/platform.MallPlatformGoods/setIntegral',
  'goodsSetCommission': '/mall/platform.MallPlatformGoods/setCommission',
  'goodsSetVirtual': '/mall/platform.MallPlatformGoods/setVirtual',
  'goodsSetStatus': '/mall/platform.MallPlatformGoods/setStatus',
  'goodsSetFirst': '/mall/platform.MallPlatformGoods/setFirst',
  'merchantGoodsEdit': '/mall/platform.mallPlatformGoods/merchantGoodsEdit',
  'getActivityRecommendList': '/mall/platform.MallActivityRecommend/getActivityRecommendList',
  'getLimitedRecommendList': '/mall/platform.mallActivityRecommend/getLimitedRecommendList',
  'getBargainRecommendList': '/mall/platform.mallActivityRecommend/getBargainRecommendList',
  'getGroupRecommendList': '/mall/platform.mallActivityRecommend/getGroupRecommendList',
  'editLimitedRecommend': '/mall/platform.mallActivityRecommend/editLimitedRecommend',
  'editBargainRecommend': '/mall/platform.mallActivityRecommend/editBargainRecommend',
  'editGroupRecommend': '/mall/platform.mallActivityRecommend/editGroupRecommend',
  'setFirstLimited': '/mall/platform.mallActivityRecommend/setFirstLimited',
  'setFirstBargain': '/mall/platform.mallActivityRecommend/setFirstBargain',
  'setFirstGroup': '/mall/platform.mallActivityRecommend/setFirstGroup',
  'setSortGroup': '/mall/platform.mallActivityRecommend/setSortGroup',
  'setSortLimited': '/mall/platform.mallActivityRecommend/setSortLimited',
  'setSortBargain': '/mall/platform.mallActivityRecommend/setSortBargain',
  'bannerList': '/mall/platform.mallActivityRecommend/bannerList',
  'addOrEditBanner': '/mall/platform.mallActivityRecommend/addOrEditBanner',
  'delBanner': '/mall/platform.mallActivityRecommend/delBanner',
  'getReplyList': '/mall/platform.MallPlatformReply/searchReply',
  'exportReplyList': '/mall/platform.MallPlatformReply/exportReplyList',
  'getReplyDetails': '/mall/platform.MallPlatformReply/getReplyDetails',
  'delReply': '/mall/platform.MallPlatformReply/delReply',
  'getOrderList': '/mall/platform.MallOrder/searchOrders',
  'getOrderDetails': '/mall/platform.MallOrder/getOrderDetails',
  'getStores': '/mall/platform.MallOrder/getStores',
  'getMers': '/mall/platform.MallOrder/getMers',
  'loginMer': '/mall/platform.MallOrder/loginMer',
  'loginStore': '/mall/platform.MallOrder/loginStore',
  'getAllArea': '/mall/platform.MallOrder/getAllArea',
  'getDiscount': '/mall/platform.MallOrder/getDiscount',
  'getOrderLog': '/mall/platform.MallOrder/getOrderLog',
  'exportOrder': '/mall/platform.MallOrder/exportOrder',
  'getList': 'mall/platform.MallHomeDecorate/getList',
  'getDel': 'mall/platform.MallHomeDecorate/getDel',
  'getEdit': 'mall/platform.MallHomeDecorate/getEdit',
  'addOrEditDecorate': 'mall/platform.MallHomeDecorate/addOrEdit',
  'getSixList': 'mall/platform.MallHomeDecorate/getSixList',
  'getSixEdit': 'mall/platform.MallHomeDecorate/getSixEdit',
  'addOrEditSixAdver': 'mall/platform.MallHomeDecorate/addOrEditSixAdver',
  'delSixAdver': 'mall/platform.MallHomeDecorate/delSixAdver',
  'getRecList': 'mall/platform.MallHomeDecorate/getRecList',
  'addOrEditRec': 'mall/platform.MallHomeDecorate/addOrEditRec',
  'getRecEdit': 'mall/platform.MallHomeDecorate/getRecEdit',
  'delRecAdver': 'mall/platform.MallHomeDecorate/delRecAdver',
  'recDisplay': 'mall/platform.MallHomeDecorate/recDisplay',
  'getActGoods': 'mall/platform.MallHomeDecorate/getActGoods',
  'addRelatedGoods': 'mall/platform.MallHomeDecorate/addRelatedGoods',
  'getUrlAndRecSwitch': 'mall/platform.MallHomeDecorate/getUrlAndRecSwitch',
  'getRelatedList': 'mall/platform.MallHomeDecorate/getRelatedList',
  'saveRelatedSort': '/mall/platform.MallHomeDecorate/saveRelatedSort',
  'delOne': '/mall/platform.MallHomeDecorate/delOne',
  'viewLogistics': '/mall/platform.MallOrder/viewLogistics', // 查看物流
  'getPeriodicList': '/mall/platform.MallOrder/getPeriodicList', // 查看配送周期

  'setRecommend': '/mall/platform.MallPlatformGoods/setRecommend',//设置推荐
  'cancelRecommend': '/mall/platform.MallPlatformGoods/cancelRecommend',//取消推荐
  'isShowReply': '/mall/platform.MallPlatformReply/isShowReply', //
  'getMallBrowse': '/mall/platform.MallBrowse/getMallBrowse', // 获取商城首页或者商品商品的统计数据
  'MallBrowseExport': '/mall/platform.MallBrowse/export', // 商品浏览量列表导出
  'exportBrowseTotalExport': '/mall/platform.MallBrowse/exportBrowseTotal', // 商品和商城首页浏览量汇总导出
  'getAuditGoodsList': '/mall/platform.MallPlatformGoods/getAuditGoodsList', //新版商城-获取商品审核列表
  'auditGoods': '/mall/platform.MallPlatformGoods/auditGoods', //新版商城-商品审核
  'loginMerchant': '/mall/platform.MallPlatformGoods/loginMerchant', //新版商城-审核伪登录

  // 打印小票
  'orderPrintTicket':'/mall/platform.MallOrder/printOrder',
  'merchantStoreList': '/mall/platform.MallPlatformDelivery/merchantStoreList', //新版商城店铺列表
  'deliverySetting': '/mall/platform.MallPlatformDelivery/deliverySetting', //新版商城店铺设置配送范围
  'deliverCustom': '/mall/platform.MallPlatformDelivery/deliverCustom', //新版商城店铺范围列表

  //服务保障
  'getGuaranteeList': '/mall/platform.ProductGuarantee/getLists', //列表
  'saveGuarantee': '/mall/platform.ProductGuarantee/save', //新增和编辑
  'delGuarantee': '/mall/platform.ProductGuarantee/delete', //删除
  'changeGuaranteeStatus': '/mall/platform.ProductGuarantee/changeStatus', //切换状态

   //品牌管理
   'getBrandsList': '/mall/platform.Brands/getLists', //列表
   'saveBrand': '/mall/platform.Brands/save', //新增和编辑
   'delBrand': '/mall/platform.Brands/delete', //删除
   'changeBrandStatus': '/mall/platform.Brands/changeStatus', //切换状态
}
export default mallPlatformApi