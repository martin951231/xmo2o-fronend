/**
 * 商家管理
 * @author deng
 * @date 2021-05-07
 *  @description 页面对应地址
 */
const MerchantComponents = {
    'StoreCategoryList': () => import('@/views/merchant/platform/StoreCategoryList'),//店铺分类列表
    'StoreCategoryEdit': () => import('@/views/merchant/platform/StoreCategoryEdit'),//店铺分类列表编辑
    'StoreCategoryChildList': () => import('@/views/merchant/platform/StoreCategoryChildList'),//店铺分类列表编辑

    'CorrList': () => import('@/views/merchant/platform/CorrList'),//营业信息纠错列表
    'PositionList': () => import('@/views/merchant/platform/PositionList'),//店铺岗位管理列表
    'TechnicianList': () => import('@/views/merchant/platform/TechnicianList'),//店铺技师认证列表
}
export default MerchantComponents