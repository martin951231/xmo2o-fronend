const couponPlatformApi = {
    getConfig: '/common/platform.system.config/getConfig',// 获取相关领券中心配置
    saveConfig: '/common/platform.system.config/saveConfig',// 保存相关领券中心配置

    getSearchHotWords: '/common/platform.coupon/getSearchHotWords',// 获取优惠券搜索关键词
    getWordDetail: '/common/platform.coupon/getWordDetail',// 获取详情
    saveWords: '/common/platform.coupon/saveWords',// 新增/编辑关键词
    saveWordsSort: '/common/platform.coupon/saveWordsSort',// 保存排序
    delWords: '/common/platform.coupon/delWords',// 删除关键词

    getBrandSelectCoupon: '/common/platform.coupon/getBrandSelectCoupon',// 获取品牌精选优惠券
    chooseBrandSelectCoupon: '/common/platform.coupon/chooseBrandSelectCoupon',// 获取品牌精选优惠券
    addBrandCoupon: '/common/platform.coupon/addBrandCoupon',// 添加品牌精选优惠券
    delBrandCoupon: '/common/platform.coupon/delBrandCoupon',// 删除品牌精选优惠券


    sysCouponUseRecords: '/common/platform.coupon/sysCouponUseRecords',// 平台优惠券核销记录
    sysCouponGetRecords: '/common/platform.coupon/sysCouponGetRecords',// 平台优惠券领取记录
    exportSysGetRecords: '/common/platform.coupon/exportSysGetRecords',// 导出平台优惠券领取记录
    merCouponUseRecords: '/merchant/merchant.coupon/merCouponUseRecords',// 商家优惠券核销记录
    merCouponGetRecords: '/merchant/merchant.coupon/merCouponGetRecords',// 商家优惠券领取记录
    exportMerGetRecords: '/merchant/merchant.coupon/exportMerGetRecords',// 导出商家优惠券领取记录
    getStoreList: '/merchant/merchant.store/getStoreList',// 获取店铺列表
    updateUse: '/merchant/merchant.coupon/updateUse',// 回收
}

export default couponPlatformApi