const douyinMerchantApi = {
    // 抖音探店活动列表Api
    getActivityList: '/douyin/merchant.DouyinActivity/getActivityList', // 活动列表
    setActivityStatus: '/douyin/merchant.DouyinActivity/setActivityStatus', // 修改状态
    delActivity: '/douyin/merchant.DouyinActivity/delActivity', // 删除活动
    getStoreList: '/douyin/merchant.DouyinActivity/getStoreList', // 获取店铺
    getCouponList: '/douyin/merchant.DouyinActivity/getCouponList', // 获取优惠券
    addOrEditActivity: '/douyin/merchant.DouyinActivity/addOrEditActivity', // 添加编辑活动
    getActivityDetail: '/douyin/merchant.DouyinActivity/getActivityDetail', // 获取活动详情
    getSourceMaterialLists: '/douyin/merchant.DouyinActivity/getSourceMaterialLists', // 获取素材列表
    saveSourceMaterial: '/douyin/merchant.DouyinActivity/saveSourceMaterial', // 添加/编辑素材
    delSourceMaterial: '/douyin/merchant.DouyinActivity/delSourceMaterial', // 删除素材
}
export default douyinMerchantApi