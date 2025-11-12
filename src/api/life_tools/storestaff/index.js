const lifeToolsStorestaffApi = {
    'verification': 'life_tools/storestaff.LifeToolsAppoint/verification', //核销
    'verifyList': 'life_tools/storestaff.LifeToolsAppoint/verifyList', //核销列表
    'sportsVerification': 'life_tools/storestaff.LifeToolsSports/verification', //体育核销
    'sportsVerifyList': 'life_tools/storestaff.LifeToolsSports/verifyList', //体育核销列表
    'scenicVerification': 'life_tools/storestaff.LifeToolsScenic/verification', //景区核销
    'scenicVerifyList': 'life_tools/storestaff.LifeToolsScenic/verifyList', //景区核销列表
    'getCardOrderDetail': 'life_tools/storestaff.LifeToolsScenic/getCardOrderDetail', //次卡详情

    // 自主买票
    'getScenic': 'life_tools/storestaff.LifeToolsScenic/getScenic', // 获取门票的分类
    'getTicket': 'life_tools/storestaff.LifeToolsScenic/getTicket', // 获取门票的分类
    'confirmPrice': 'life_tools/storestaff.LifeToolsOrder/confirm', // 确认信息页，返回总金额
    'saveOrde': 'life_tools/storestaff.LifeToolsOrder/saveOrder', // 订单提交确认
    'goPay': 'life_tools/storestaff.LifeToolsOrder/goPay', // 支付
    
    // 订单列表
    'getScenicOrderList': '/life_tools/storestaff.LifeToolsScenic/getOrderList',//订单列表
    'exportToolsOrder': '/life_tools/storestaff.LifeToolsScenic/exportToolsOrder',//导出订单
    'getScenicOrderDetail': '/life_tools/storestaff.LifeToolsScenic/getOrderDetail',//订单详情
    'agreeScenicOrderRefund': '/life_tools/storestaff.LifeToolsScenic/agreeRefund',//同意退款
    'refuseScenicOrderRefund': '/life_tools/storestaff.LifeToolsScenic/refuseRefund',//拒绝退款
    'sportsTimeCardVerifyOrderDetail': '/life_tools/storestaff.LifeToolsScenic/getCardOrderDetail', // 体育次卡核销详情
}
export default lifeToolsStorestaffApi