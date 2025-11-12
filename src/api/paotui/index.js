const paotuiPlatformApi = {
    getPriceTemplateLists: '/paotui/platform.PriceTemplate/getLists', // 计费模板列表
    savePriceTemplate: '/paotui/platform.PriceTemplate/savePriceTemplate', // 保存计费模板
    changePriceTemplateStatus: '/paotui/platform.PriceTemplate/changePriceTemplateStatus', // 切换计费模板状态
    deletePriceTemplate: '/paotui/platform.PriceTemplate/deletePriceTemplate', // 删除计费模板
    templateMerchant: '/paotui/platform.PriceTemplate/merchant', // 获取已绑定商家列表

    getAddedFeeLists: '/paotui/platform.AddedFee/getLists', // 增值费用列表
    saveAddedFee: '/paotui/platform.AddedFee/saveAddedFee', // 保存增值费用
    changeAddedFeeStatus: '/paotui/platform.AddedFee/changeAddedFeeStatus', // 切换增值费用状态
    deleteAddedFee: '/paotui/platform.AddedFee/deleteAddedFee', // 删除增值费用

    saveRiderCommissionSetting: '/paotui/platform.RiderCommissionSetting/saveRiderCommissionSetting', // 保存配送员佣金设置
    getRiderCommissionSetting: '/paotui/platform.RiderCommissionSetting/getRiderCommissionSetting', // 获取配送员佣金设置

    getGrabPoolLists: '/paotui/platform.GrabPool/getGrabPoolLists', // 获取抢单池列表
    saveGrabPool: '/paotui/platform.GrabPool/saveGrabPool', // 保存抢单池
    changeGrabPoolStatus: '/paotui/platform.GrabPool/changeGrabPoolStatus', // 修改抢单池状态
    deleteGrabPool: '/paotui/platform.GrabPool/deleteGrabPool', // 删除抢单池

    deliverUser: '/paotui/platform.GrabPool/deliverUser', // 获取配送员列表
    changeBindDeliverUserStatus: '/paotui/platform.GrabPool/changeBindDeliverUserStatus', // 绑定配送员

    merchant: '/paotui/platform.GrabPool/merchant', // 获取商家列表
    changeBindMerchantStatus: '/paotui/platform.GrabPool/changeBindMerchantStatus', // 绑定商家

    getMerchantLists : '/paotui/platform.Merchant/getLists', // 跑腿商家
    getTemplateSelect : '/paotui/platform.Merchant/getTemplateSelect', // 获取配送模板下拉选择
    bindTemplate : '/paotui/platform.Merchant/bindTemplate', // 绑定模板
    batchBindTemplate : '/paotui/platform.Merchant/batchBindTemplate', // 批量绑定模板
}
export default paotuiPlatformApi