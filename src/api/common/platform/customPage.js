const customPageApi = {
    getMicroPageList: '/common/common.DecoratePage/getMicroPageList', //列表模板 微页面列表
    getpersonalDec: '/common/common.DecoratePage/getpersonalDec', // 获取个人中心装修信息
    delMicroPage: '/common/common.DecoratePage/delMicroPage', // 微页面删除
    setHomePage: '/common/common.DecoratePage/setHomePage', // 微页面列表设为主页
    addOrEditpersonalDec: '/common/common.DecoratePage/addOrEditpersonalDec', // 编辑或添加个人中心装修
    getNavBottomDec: '/common/common.DecoratePage/getNavBottomDec', // 获取底部导航装修信息
    addOrEditNavBottom: '/common/common.DecoratePage/addOrEditNavBottom', // 底部导航编辑或添加
    getSuspendedWindow: '/common/common.DecoratePage/getSuspendedWindow', // 获取悬浮窗装修信息
    addOrEditSuspendedWindow: '/common/common.DecoratePage/addOrEditSuspendedWindow', // 编辑或添加悬浮框
    getIndexPage: '/common/common.DecoratePage/getIndexPage', // 获取主页装修
    getEditMicoPage: '/common/common.DecoratePage/getEditMicoPage', // 微页面详情
    getCoupons: '/common/common.DecoratePage/getCoupons', // 优惠券
    getActInfo: '/common/common.DecoratePage/getActInfo', // 营销活动
    getMallActInfo: '/common/common.DecoratePage/getMallActInfo', // 商城活动列表
    getMallGoods: '/common/common.DecoratePage/getMallGoods', // 商城商品列表
    getMallGoodsGroup: '/common/common.DecoratePage/getMallGoodsGroup', // 商城商品分组
    getShopGoodsGroup: '/common/common.DecoratePage/getShopGoodsGroup', // 外卖商品分组
    getShopGoods: '/common/common.DecoratePage/getShopGoods', // 外卖商品
    addOrEditMicroPage: '/common/common.DecoratePage/addOrEditMicroPage', // 微页面添加或编辑
    getMerchantStoreMsg: '/common/common.DecoratePage/getMerchantStoreMsg', // 获取店铺信息
    getPageId: '/common/common.DecoratePage/getPageId', // 获取微页面id

    // 分类装修
    getDiypageModel: '/common/platform.diypage/getDiypageModel', // 获得装修组件
    getDiypageDetail: '/common/platform.diypage/getDiypageDetail', // 获得装修详情
    getFeedCategoryList: '/common/platform.diypage/getFeedCategoryList', // 获得feed流导航分类列表
    getSearchHotList: '/common/platform.diypage/getSearchHotList', // 获得热搜词列表
    saveDiypage: '/common/platform.diypage/saveDiypage', // 保存装修数据
    getMerchantCategoryChildList: '/common/platform.diypage/getMerchantCategoryChildList', // 获得店铺子分类列表

    getStoreList: '/common/common.DecoratePage/getStore', // 获取店铺列表

    // 预约商品列表
    activityAppointList: '/appoint/platform.AppointDecorate/activityAppointList',
    // 预约分类
    appointCategoryList:'/appoint/platform.AppointDecorate/categoryList'
}

export default customPageApi
