const warnMerchantIndexApi = {
    getConfig: '/warn/merchant.Warn/getConfig', // 消息提醒配置信息
    saveConfig: '/warn/merchant.Warn/saveConfig', // 消息提醒配置保存
    getNoticeList: '/warn/merchant.Notice/getNoticeList', // 商家消息提醒列表
    msgRead: '/warn/merchant.Notice/read', // 消息已读
    msgUnreadNum: '/warn/merchant.Notice/unreadNum' // 获取未读消息数量
}
export default warnMerchantIndexApi