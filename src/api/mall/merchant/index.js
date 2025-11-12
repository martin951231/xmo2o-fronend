const mallMerchantApi = {
    getLists: '/mall/merchant.MerchantStoreMall/getStoreList', // 商家中心商城业务店铺列表
    perfectedStore: '/mall/merchant.MerchantStoreMall/perfectedStore', // 编辑/完善店铺
    getStoreConfigList: '/mall/merchant.MerchantStoreMall/getStoreConfigList', //获取店铺配置
    getShippingList: '/mall/merchant.MallShipping/getShippingList', // 满包邮-列表
    updateShipping: '/mall/merchant.MallShipping/addShipping', // 满包邮-添加或编辑
    changeState: '/mall/merchant.MallShipping/changeState', // 满包邮-失效
    removeShipping: '/mall/merchant.MallShipping/del', // 满包邮-删除
    getShippingInfo: '/mall/merchant.MallShipping/edit', // 满包邮-编辑信息回显
    getMerchantSort: '/mall/merchant.MallGoods/getMerchantSort', // 添加商品 获取分类
    getMallGoods: '/mall/merchant.MallGoods/getMallGoodsSelect', // 添加商品 获取商品
    getGiveList: '/mall/merchant.MallGive/getGiveList', // 满赠-列表
    giveAdd: '/mall/merchant.MallGive/addGive', // 满赠-添加或编辑
    giveChangeState: '/mall/merchant.MallGive/changeState', // 满赠-失效操作
    giveDel: '/mall/merchant.MallGive/del', // 满赠-删除操作
    getGiveInfo: '/mall/merchant.MallGive/edit', // 满赠-信息查询
    getPlatSort: '/mall/merchant.MallGoods/getPlatformSort', // 获取平台分类
    getStoreSort: '/mall/merchant.MallGoods/getMerchantSort', // 获取店铺分类
    getPrepareList: '/mall/merchant.MallPrepare/getPrepareList', // 预售-列表
    updatePrepare: '/mall/merchant.MallPrepare/addPrepare', // 预售-添加或编辑
    prepareChangeState: '/mall/merchant.MallPrepare/changeState', // 预售-失效
    removePrepare: '/mall/merchant.MallPrepare/del', // 预售-删除
    getPrepareInfo: '/mall/merchant.MallPrepare/edit', // 预售-编辑信息回显
    getReachedList: '/mall/merchant.MallReached/getReachedList', // N元N价-列表
    updateReachedList: '/mall/merchant.MallReached/addReached', // N元N价添加或保存
    getReachedInfo: '/mall/merchant.MallReached/edit', // N元N价编辑页
    reachedChangeState: '/mall/merchant.MallReached/changeState', // N元N价-失效操作
    reachedDel: '/mall/merchant.MallReached/del', // N元N价-删除操作
    addRobot: '/mall/merchant.MallGroup/addRobot', // 拼团添加机器人
    delRobot: '/mall/merchant.MallGroup/delRobot', // 拼团删除机器人
    getRobotList: '/mall/merchant.MallGroup/getRobotList', // 拼团机器人列表
    getRobotName: '/mall/merchant.MallGroup/getRobotName', // 拼团随机获取机器人名称
    getUploadImages: '/common/common.UploadFile/getUploadImages', //获取素材库
    getGoodsSort: '/mall/merchant.MallGoods/getMerchantSort', // 获取商品分类
    getGoodsStatus: '/mall/merchant.MallGoods/getNumbers',// 获取商品状态
    getGoodsList: '/mall/merchant.MallGoods/getGoodsList', // 获取商品列表
    changeGoodsStatus: '/mall/merchant.MallGoods/setStatusLot', // 商品上下架
    setVirtualSales: '/mall/merchant.MallGoods/setVirtualSales', // 批量设置虚拟销量
    changeGoodsSort: '/mall/merchant.MallGoods/setSort', // 修改商品排序
    getGoodsSkuPrice: '/mall/merchant.MallGoods/getGoodsSkuInfo', // 获取多规格商品的价格
    changeGoodsPrice: '/mall/merchant.MallGoods/setGoodsSkuInfo',// 修改商品价格
    getPlatProps: '/mall/merchant.MallGoods/getPlatformProperties',// 获取平台分类属性
    getFreightList: '/mall/merchant.MallGoods/getfreightList',// 获取运费模板
    getServiceList: '/mall/merchant.MallGoods/dealService',// 获取运费模板
    removeGoods: '/mall/merchant.MallGoods/delGoods', // 删除商品
    updateGoods: '/mall/merchant.MallGoods/addOrEditGoods', // 添加、编辑商品
    exportGoods: '/mall/merchant.MallGoods/exportGoods', // 导出商品
    getGoodsInfo: '/mall/merchant.MallGoods/getEditGoods', // 获取已编辑的商品信息
    getGroupList: '/mall/merchant.MallGroup/getGroupList', // 拼团活动列表
    groupAdd: '/mall/merchant.MallGroup/addGroup', // 拼团-添加或编辑
    groupChangeState: '/mall/merchant.MallGroup/changeState', // 拼团-失效操作
    groupDel: '/mall/merchant.MallGroup/del', // 拼团-删除
    getGroupInfo: '/mall/merchant.MallGroup/editDetail', // 拼团-详情
    getPeriodicList: '/mall/merchant.MallPeriodic/getPeriodicList', // 周期购-列表
    updatePeriodic: '/mall/merchant.MallPeriodic/addPeriodic', // 周期购-添加或编辑
    periodicChangeState: '/mall/merchant.MallPeriodic/changeState', // 周期购-失效
    removePeriodic: '/mall/merchant.MallPeriodic/del', // 周期购-删除
    getPeriodicInfo: '/mall/merchant.MallPeriodic/edit', // 周期购-编辑信息回显
    getBargainList: '/mall/merchant.MallBargain/getBargainList', // 砍价活动列表
    bargainAdd: '/mall/merchant.MallBargain/addBargain', // 砍价-添加或编辑
    bargainChangeState: '/mall/merchant.MallBargain/changeState', // 砍价-失效操作
    bargainDel: '/mall/merchant.MallBargain/del', // 砍价-删除
    getBargainInfo: '/mall/merchant.MallBargain/editDetail', // 砍价-详情
    getMinusDiscountList: '/mall/merchant.MallFullMinusDiscount/getFullMinusDiscountList', // 满减满折-列表
    updateMinusDiscount: '/mall/merchant.MallFullMinusDiscount/addFullMinusDiscount', // 满减满折-添加或编辑
    minusDiscountChangeState: '/mall/merchant.MallFullMinusDiscount/changeState', // 满减满折-失效
    removeMinusDiscount: '/mall/merchant.MallFullMinusDiscount/del', // 满减满折-删除
    getMinusDiscountInfo: '/mall/merchant.MallFullMinusDiscount/edit', // 满减满折-编辑信息回显
    getLimitedList: '/mall/merchant.MallLimited/getLimitedList', // 秒杀-列表
    updateLimited: '/mall/merchant.MallLimited/addLimited', // 秒杀-添加或编辑
    limitedChangeState: '/mall/merchant.MallLimited/changeState', // 秒杀-失效
    removeLimited: '/mall/merchant.MallLimited/del', // 秒杀-删除
    getLimitedInfo: '/mall/merchant.MallLimited/edit', // 秒杀-编辑信息回显
    getGoodsSortList: '/mall/merchant.MallGoodsSort/getSortList', // 获取商城商品分类列表
    delGoodsSort: '/mall/merchant.MallGoodsSort/delSort', // 删除商城商品分类
    editGoodsSort: '/mall/merchant.MallGoodsSort/addOrEditSort', // 添加或编辑商城商品分类
    getEditSort: '/mall/merchant.MallGoodsSort/getEditSort', // 获取商城商品分类信息
    editSort: '/mall/merchant.MallGoodsSort/saveSort', // 编辑商城商品分类排序
    saveStatus: '/mall/merchant.MallGoodsSort/saveStatus', // 编辑商城商品分类状态
    getAllGoodsSort: '/mall/merchant.MallGoodsSort/getSort', // 获取商城商品分类父级分类
    getStoreList: '/mall/merchant.MallMerchantReply/getStores', // 获取商家所有店铺列表
    getReplyList: '/mall/merchant.MallMerchantReply/searchReply', // 获取商家所有评论列表
    addComment: '/mall/merchant.MallMerchantReply/merchantReply', // 商家回复评论
    getReplyDetails: '/mall/merchant.MallMerchantReply/getReplyDetails', // 商家获取评论详情
    getShowHomePage: '/mall/merchant.MallMerchantReply/getShowHomePage', // 设置展示主页
    getQualityReviews: '/mall/merchant.MallMerchantReply/getQualityReviews', // 设置优质评论
    getShowHomePageCancel: '/mall/merchant.MallMerchantReply/getShowHomePageCancel', // 取消展示主页
    getQualityReviewsCancel: '/mall/merchant.MallMerchantReply/getQualityReviewsCancel', // 取消优质评论
    getOrderList: '/mall/merchant.MallOrder/searchOrders',
    getOrderDetails: '/mall/merchant.MallOrder/getOrderDetails',
    getCollect: '/mall/merchant.MallOrder/getCollect',
    getDiscount: '/mall/merchant.MallOrder/getDiscount',
    exportOrder: '/mall/merchant.MallOrder/exportOrder ',
    deleteJudge: '/mall/merchant.MallGoods/deleteJudge ',
    getTemplateList: '/mall/merchant.ExpressTemplate/index',
    getTemplateAreaList: '/mall/merchant.ExpressTemplate/ajax_area',
    getTemplateAreaNameList: '/mall/merchant.ExpressTemplate/get_area_name',
    addTemplate: '/mall/merchant.ExpressTemplate/save',
    editTemplate: '/mall/merchant.ExpressTemplate/edit',
    delTemplate: '/mall/merchant.ExpressTemplate/delete',
    goodsBatch: '/mall/merchant.MallGoods/goodsBatch',
    viewLogistics: '/mall/merchant.MallOrder/viewLogistics', // 查看物流
    // 打印小票
    orderPrintTicket: '/mall/merchant.MallOrder/printOrder', 
    // 获取快递
    getExpress:'/mall/merchant.MallOrder/getExpress',
    // 修改快递
    deliverGoodsByExpress:'/mall/merchant.MallOrder/deliverGoodsByExpress',
    getGroupOrderList:'/mall/merchant.MallOrder/getGroupOrderList',// 拼团小组列表
    joinRobot:'/mall/merchant.MallOrder/joinRobot',// 手动机器人拼团
    getTeamUser:'/mall/merchant.MallOrder/getTeamUser',// 拼团成员列表
    getAreaList: '/mall/merchant.MallGoodsArea/getAreaList', // 区域列表
    addMallGoodsArea:'/mall/merchant.MallGoodsArea/addMallGoodsArea', // 修改展示区域成功
    findAreaList:'/mall/merchant.MallGoodsArea/findAreaList', // 查看区域
    importGoodsArea: '/mall/merchant.MallGoodsArea/importGoodsArea', // 商家-批量导入商品城市区域
    exportViewArea: '/mall/merchant.MallGoodsArea/exportViewArea',  //商家导出商品展示区域

    getBrandsList: '/mall/merchant.MallGoods/getBrandsList',  //获取品牌列表
    getGuaranteeList: '/mall/merchant.MallGoods/getGuaranteeList',  //获取保障服务
    setStoreGoodsSort: '/mall/merchant.MallGoods/setStoreGoodsSort', // 批量设置商品所属店铺分类
    setGoodsBrand: '/mall/merchant.MallGoods/setGoodsBrand', // 批量给商品设置品牌
}
export default mallMerchantApi