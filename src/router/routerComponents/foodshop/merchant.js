/**
 * 商家后台餐饮
 * @author 张涛
 * @date 2020-07-06
 */
const MerchantFoodshopComponents = {
  'MerchantFoodshopStoreList': () => import('@/views/foodshop/merchant/StoreList'), //店铺列表
  'MerchantFoodshopShopEdit': () => import('@/views/foodshop/merchant/ShopEdit'), //店铺编辑
  'MerchantFoodshopGoodsList': () => import('@/views/foodshop/merchant/GoodsList'),
  'MerchantFoodshopTableList': () => import('@/views/foodshop/merchant/TableList'), //桌台管理
  'MerchantFoodshopPrintRule': () => import('@/views/foodshop/merchant/PrintRule'), //打印设置
  'MerchantFoodshopEditPrintRule': () => import('@/views/foodshop/merchant/EditPrintRule'), //打印设置编辑
  'MerchantFoodshopPackageList': () => import('@/views/foodshop/merchant/PackageList'), //套餐管理
  'MerchantFoodshopEditPackage': () => import('@/views/foodshop/merchant/EditPackage'), //套餐编辑
}
export default MerchantFoodshopComponents