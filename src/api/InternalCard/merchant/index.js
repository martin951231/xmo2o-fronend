const internalCardMerchantApi = {
    orderList: 'internal_card/merchant.InternalCard/orderList', // 一卡通订单支付列表
    orderPayList: 'internal_card/merchant.InternalCard/orderPayList', //一卡通订单支付明细
    billList: '/internal_card/merchant.InternalCard/billList', //一卡通支付账单列表
    billSum: '/internal_card/merchant.InternalCard/billSum', //一卡通支付账单汇总
    merCardList: '/internal_card/merchant.InternalCard/merCardList', //一卡通商家卡明细
    merCardBillSum: '/internal_card/merchant.InternalCard/merCardBillSum', //一卡通商家卡明细汇总
    merBillRecord: '/internal_card/merchant.InternalCard/merBillRecord', //一卡通商家结算记录
    businessType: '/internal_card/index/businessType', //一卡通业务类型
}
export default internalCardMerchantApi
