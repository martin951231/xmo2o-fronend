/**
 * 新版商家后台管理
 * @author mrdeng
 * @date 2021-04-07
 */
const MerchantStoreComponents = {
    'MerchantStoreList': () => import('@/views/merchant/store/StoreList'),//新版店铺，店铺列表
    'MerchantAuthEdit': () => import('@/views/merchant/store/AuthEdit'),//新版店铺，店铺资质
    'MerchantStaffList': () => import('@/views/merchant/store/StaffList'),//新版店铺，店员管理
  /*  'MerchantStaffAdd': () => import('@/views/merchant/store/StaffAdd'),//新版店铺，店员新增
    'MerchantStaffEdit': () => import('@/views/merchant/store/StaffEdit'),//新版店铺，店员编辑*/
    'MerchantStoreDiscount': () => import('@/views/merchant/store/StoreDiscount'),//新版店铺，店铺优惠
    'MerchantStoreSlider': () => import('@/views/merchant/store/StoreSlider'),//新版店铺，店铺导航
    'MerchantStoreEdit': () => import('@/views/merchant/store/StoreEdit'),//新版店铺，店铺导航
    'StoreMarketingPerson': () => import('@/views/merchant/store/StoreMarketingPerson'),//分销管理
}
export default MerchantStoreComponents