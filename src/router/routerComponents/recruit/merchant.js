/**
 * author wangchen
 * 商家中心
 */
 const MerchantRecruitComponents = {
    'TalentManagementList1': () => import('@/views/recruit/merchant/TalentManagementList'),  // 人才管理
    'RecruitHrList1': () => import('@/views/recruit/merchant/RecruitHrList'),  // HR管理
    'MerchantJobList1': () => import('@/views/recruit/merchant/MerchantJobList'),
    'Company1': () => import('@/views/recruit/merchant/Company'),  // 公司信息
    'RecruitWelfareLabelList1': () => import('@/views/recruit/merchant/RecruitWelfareLabelList'),  // 福利标签
  }
  
  export default MerchantRecruitComponents