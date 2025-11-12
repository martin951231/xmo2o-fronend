const cardMerchantApi = {
    getGoodsSortList: '/merchant/merchant.deposit.DepositGoodsSort/getGoodsSortList',// 会员卡商品类型列表 
    getGoodsSortEdit: '/merchant/merchant.deposit.DepositGoodsSort/handleGoodsSort',// 会员卡商品类型修改
    getGoodsSortInfo: '/merchant/merchant.deposit.DepositGoodsSort/getGoodsSortInfo',// 获取会员卡商品类型一条详情
    delGoodsSort: '/merchant/merchant.deposit.DepositGoodsSort/delGoodsSort',// 删除会员卡商品类型一条记录
    
    
    goodsEdit: '/merchant/merchant.deposit.DepositGoods/goodsEdit', //添加更新商品
    getGoodsSortSelect: '/merchant/merchant.deposit.DepositGoodsSort/getGoodsSortSelect',// 会员卡商品类型列表 
    getGoodsList: '/merchant/merchant.deposit.DepositGoods/getGoodsList',// 会员卡商品列表
    getGoodsDetail: '/merchant/merchant.deposit.DepositGoods/getGoodsDetail',// 会员卡商品详情
    delGoods: '/merchant/merchant.deposit.DepositGoods/delGoods',// 删除会员卡商品
    
    getVerificationList: '/merchant/merchant.deposit.DepositGoodsVerification/getVerificationList',// 核销列表
    getCashBackList: '/merchant/merchant.Store/getCashBackList',// 获取优惠买单返还记录
    exportCashBackList: '/merchant/merchant.Store/exportCashBackList',// 导出优惠买单返还记录


    goodsTypeList: '/merchant/merchant.CardGoods/goodsTypeList',// 积分商品类型列表
    goodsTypeAdd: '/merchant/merchant.CardGoods/goodsTypeAdd',// 导出优惠买单返还记录
    goodsTypeEdit: '/merchant/merchant.CardGoods/goodsTypeEdit',// 积分商品类型修改
    goodsTypeDel: '/merchant/merchant.CardGoods/goodsTypeDel',// 积分商品类型删除

    goodsList: '/merchant/merchant.CardGoods/goodsList',// 积分商品列表
    goodsAdd: '/merchant/merchant.CardGoods/goodsAdd',// 积分商品创建
    goodsEdit: '/merchant/merchant.CardGoods/goodsEdit',// 积分商品修改
    goodsDel: '/merchant/merchant.CardGoods/goodsDel',// 积分商品批量删除
    goodsDetail: '/merchant/merchant.CardGoods/goodsDetail',// 积分商品详情
    couponList: '/merchant/merchant.CardGoods/couponList',// 优惠券列表
    goodsExchangeList: '/merchant/merchant.CardGoods/goodsExchangeList',// 兑换商品列表
}

export default cardMerchantApi