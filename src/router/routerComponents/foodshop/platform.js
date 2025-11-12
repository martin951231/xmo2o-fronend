/**
 *******************
 *   @author 衡婷妹
 *   @date 2020-05-22
 *   @description 信息相关组件
 *******************
 */
const ConfigStreetComunityComponents = {
    // 你需要动态引入的页面组件 餐饮分类
    'FoodshopStoreCategoryList': () => import('@/views/foodshop/platform/StoreCategoryList'),
    // 店铺列表
    'FoodshopStoreList': () => import('@/views/foodshop/platform/StoreList'),
    // 搜索发现列表
    'FoodshopSearchHotList': () => import('@/views/foodshop/platform/SearchHotList'),
    // 订单列表
    'FoodshopOrderList': () => import('@/views/foodshop/platform/OrderList'),
   
}
export default ConfigStreetComunityComponents
  