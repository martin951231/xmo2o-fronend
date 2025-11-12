/**
 *******************
 *   系统后台结婚
 *   @author dengyuanhui
 *   @date 2021-05-31
 *   @description 结婚模块
 *******************
 */
const MarriageHelperComponents = {
    // 结婚攻略列表
    'ToolList': () => import('@/views/marriage_helper/merchant/ToolList'),
    'PlanList': () => import('@/views/marriage_helper/merchant/PlanList'),

    // 结婚预算列表
    'BudgetList': () => import('@/views/marriage_helper/merchant/BudgetList'),

    // 高手列表
    'PersonList': () => import('@/views/marriage_helper/merchant/PersonList'),

    // 分类管理列表
    'CategoryList': () => import('@/views/marriage_helper/merchant/CategoryList'),
}
export default MarriageHelperComponents