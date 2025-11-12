const qaApi = {
    searchMerchant: '/qa/platform.Ask/searchMerchant', // 商家搜索

    //***********************商家后台***********************
    storeLists: '/merchant/merchant.Store/getStoreList', //商家店铺列表
    askLists: '/qa/merchant.Ask/lists', // 提问列表
    setIndexShow: '/qa/merchant.Ask/setIndexShow', // 设置推荐到首页展示
    saveLabels: '/qa/merchant.Ask/saveLabels', // 保存标签
    getLabels: '/qa/merchant.Ask/getLabels', // 标签列表
    saveAskLabel: '/qa/merchant.Ask/saveAskLabel', // 问答关联标签
    askDetail: '/qa/merchant.Ask/askDetail', // 问答详情

    //***********************系统后台***********************
    getAll: '/qa/platform.Ask/getAll', // 提问+回答列表
    delete: '/qa/platform.Ask/delete', // 删除评论
    showDetail: '/qa/platform.Ask/askDetail', // 删除评论
}
export default qaApi