const MarketingMerchantComponents = {
  // 开店
  OpenShop: () => import('@/views/new_marketing/merchant/OpenShop'),
  // 续订详情
  RenewalDetail: () => import('@/views/new_marketing/merchant/RenewalDetail'),
  // 店铺商城
  StoreMarket: () => import('@/views/new_marketing/merchant/storeMarket'),
  // 店铺使用情况
  StoreUseDetail: () => import('@/views/new_marketing/merchant/storeUseDetail'),
  // 分类店铺详情
  CategoryStoreUseDetail: () => import('@/views/new_marketing/merchant/categoryStoreUseDetail'),
  // 店铺商城 购买详情
  PurchaseDetail: () => import('@/views/new_marketing/merchant/PurchaseDetail'),
}
export default MarketingMerchantComponents
