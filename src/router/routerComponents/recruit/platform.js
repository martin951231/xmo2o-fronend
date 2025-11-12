/**
 *******************
 *   @author 邓远辉
 *   @date 2021-06-22
 *   @description 招聘组件
 *******************
 */
const RecruitComponents = {
    // 商家管理列表
    'RecruitMerchantList': () => import('@/views/recruit/platform/MerchantList'),
    'RecruitJobCategory': () => import('@/views/recruit/platform/RecruitJobCategory'),//职位类别
    'JobList': () => import('@/views/recruit/platform/JobList'),
    // 首页Banner列表
    'RecruitBannerList': () => import('@/views/recruit/platform/RecruitBannerList'),
    // 行业管理列表
    'RecruitIndustryList': () => import('@/views/recruit/platform/RecruitIndustryList'),
    // 企业福利列表
    'RecruitWelfareList': () => import('@/views/recruit/platform/RecruitWelfareList'),
    // 人才管理列表
    'TalentManagementList': () => import('@/views/recruit/platform/TalentManagementList'),
}
export default RecruitComponents