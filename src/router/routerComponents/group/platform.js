/**
 *******************
 *   系统后台团购
 *   @author 衡婷妹
 *   @date 2020-11-16
 *   @description 系统后台团购相关组件
 *******************
 */
const PlatformGroupComponents = {
    // 团购组合列表
    'PlatformGroupCombineList': () => import('@/views/group/platform/GroupCombineList'),
    // 添加编辑团购组合
    'PlatformGroupCombineEdit': () => import('@/views/group/platform/GroupCombineEdit'),
    // 团购组合订单列表
    'PlatformGroupCombineOrderList': () => import('@/views/group/platform/GroupCombineOrderList'),
    // 团购组合添加机器人
    'PlatformGroupCombineBindRobot': () => import('@/views/group/platform/GroupCombineBindRobot'),
    // 团购首页装修
    'PlatformGroupDecorate': () => import('@/views/group/platform/PlatformHomeDecorate'),
    // 团购首页装修 优选商品
    'PlatformGroupSelectEdit': () => import('@/views/group/platform/GroupSelectEdit'),
    // 团购首页装修 超值组合
    'PlatformGroupRenovationCombineEdit': () => import('@/views/group/platform/groupRenovationCombine'),
    // 团购分类
    'PlatformGroupCategoryList': () => import('@/views/group/platform/GroupCategoryList'),
    // 团购首页装修 店铺活动推荐列表店铺管理
    'PlatformGroupRenovationCustomStore': () => import('@/views/group/platform/GroupRenovationCustomStore'),
    // 团购发现页装修 团购分类展示列表商品管理
    'PlatformGroupRenovationCustomGroup': () => import('@/views/group/platform/GroupRenovationCustomGroup'),
    // 团购分类编辑
    'PlatformGroupCategoryEdit': () => import('@/views/group/platform/GroupCategoryEdit'),
    // 团购子分类列表
    'PlatformGroupSubCategoryList': () => import('@/views/group/platform/GroupSubCategoryList'),
    // 团购频道分类页热搜词
    'PlatformGroupRenovationSearchHot': () => import('@/views/group/platform/GroupSearchHotList'),
    // 团购优惠组合评价列表
    'PlatformGroupCombineReplyList': () => import('@/views/group/platform/GroupCombineReplyList'),
    
    //社区团购
    'PlatformVillageGroupShareList': () => import('@/views/group/platform/PlatformVillageGroupShareList'),
}
export default PlatformGroupComponents
  