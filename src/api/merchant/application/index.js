const MerchantApplicationApi = {
    getPhysicalCardList: '/merchant/merchant.PhysicalCard/getList', //商家-实体卡列表
    addPhysicalCard: '/merchant/merchant.PhysicalCard/addCard', //商家-添加实体卡
    delPhysicalCard: '/merchant/merchant.PhysicalCard/delCard', //商家-删除实体卡
    exportPhysicalCard: '/merchant/merchant.PhysicalCard/exportCard', //商家-实体卡列表-导出
    getPhysicalCardOrderList: '/merchant/merchant.PhysicalCard/getCardOrderList', //商家-实体卡-消费详情列表
    getBuyOrderGiveCouponList: '/merchant/merchant.BuyOrderGiveCoupon/getList', //商家-优惠买单返券统计
    buyOrderGiveCouponExport: '/merchant/merchant.BuyOrderGiveCoupon/export', //商家-优惠买单返券统计-导出
}
export default MerchantApplicationApi
