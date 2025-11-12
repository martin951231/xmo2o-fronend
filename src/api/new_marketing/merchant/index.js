const marketingMerchantApi = {
  // 店铺商城 分类一级列表
  getCatList: '/new_marketing/merchant.MarketingPackage/getCatList',
  // 店铺商城 分类店铺列表
  getCatStoreList: '/new_marketing/merchant.MarketingPackage/getCatSearchList',
  // 店铺商城 套餐列表
  getMealList: '/new_marketing/merchant.MarketingPackage/getSearchList',
  // 店铺商城 分类店铺详情
  getClassifyDetail: '/new_marketing/merchant.MarketingPackage/getCatDetail',
    // 店铺商城 套餐详情
  getMealDetail: '/new_marketing/merchant.MarketingPackage/getpackageDetail',
  // 店铺商城 详情购买价格
  getPrice: '/new_marketing/merchant.MarketingPackage/getDiscountPayPrice',
  // 店铺商城 购买方式
  getPayType: '/new_marketing/merchant.Order/pay_check',
  // 店铺商城 下单
  checkOrder: '/new_marketing/merchant.Order/pay',
  // 店铺商城  查询订单是否支付成功 
  checkOrderPayOk: '/new_marketing/merchant.Order/searchPayStatus',
  // 店铺使用情况 订单列表
  getOrderList: '/new_marketing/merchant.order/getOrderList',
  // 店铺使用情况 详情
  getStoreUserdDetail: '/new_marketing/merchant.store/getStoreUserdDetail',
  // 店铺使用情况 订单详情
  getOrderDetail: '/new_marketing/merchant.order/getOrderDetail',
  // 店铺使用情况 分类店铺详情
  getCategoryStoreDetail: '/new_marketing/merchant.store/getCategoryStoreDetail',
  // 去开店 店铺分类列表
  getCategoryStoreList:'/new_marketing/merchant.store/getCategoryStoreList',
  // 续费 获得续费订单支付信息
  getRenewPayInfo:'/new_marketing/merchant.order/getPayInfo',
  // 续费 保存续费订单
  savePayInfo:'/new_marketing/merchant.order/savePayInfo',
  // 续费 去支付
  goPay:'/merchant/merchant.pay/goPay',
}
export default marketingMerchantApi
