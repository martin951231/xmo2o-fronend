/**
 * @type {{}}
 * 招聘
 * deng
 * 2021-06-22
 */

const recruitPlatformApi = {
    getMerchantList: '/recruit/platform.RecruitMerchant/getMerchantList',// 商家管理
    updateMerchant: '/recruit/platform.RecruitMerchant/updateMerchant',// 更新商家管理
    categoryList: '/recruit/platform.RecruitJobCategory/categoryList',//职位分类
    childList: '/recruit/platform.RecruitJobCategory/childList',//职位子分类
    addCategory: '/recruit/platform.RecruitJobCategory/addCategory',//新增职位分类
    editCategory: '/recruit/platform.RecruitJobCategory/editCategory',//编辑职位分类
    updateCategory: '/recruit/platform.RecruitJobCategory/updateCategory',//更新编辑职位分类
    delCategory: '/recruit/platform.RecruitJobCategory/delCategory',//更新编辑职位分类
    delCategorys: '/recruit/platform.RecruitJobCategory/delCategorys',//批量删除职位分类
    changeSort: '/recruit/platform.RecruitJobCategory/changeSort',//排序职位分类
    childChangeSort:'/recruit/platform.RecruitJobCategory/childChangeSort',//子排序职位分类
    getCategory: '/recruit/platform.RecruitJobCategory/getCategory',//获取下拉职位分类
    byOtherCategory: '/recruit/platform.RecruitJobCategory/byOtherCategory',//重新绑定分类
    getChildCategory: '/recruit/platform.RecruitJobCategory/getChildCategory' ,// 三级分类列表
    updateChildCategory: '/recruit/platform.RecruitJobCategory/updateChildCategory' ,// 更新三级分类列表
    getJobList: '/recruit/platform.RecruitMerchant/getJobList' ,// 职位管理
    updateJob: '/recruit/platform.RecruitMerchant/updateJob' ,// 职位状态变更
    delJob: '/recruit/platform.RecruitMerchant/delJob' ,// 职位删除
    getJobSearch: '/recruit/platform.RecruitMerchant/getJobSearch' ,// 职位搜索条件
    getJobDetail: '/recruit/platform.RecruitMerchant/getJobDetail' ,// 职位详情

    getRecruitBannerList: '/recruit/platform.RecruitBanner/getRecruitBannerList' ,// 首页Banner列表
    getRecruitBannerCreate: '/recruit/platform.RecruitBanner/getRecruitBannerCreate' ,// 首页Banner保存
    getRecruitBannerInfo: '/recruit/platform.RecruitBanner/getRecruitBannerInfo' ,// 首页Banner一条
    getRecruitBannerSort: '/recruit/platform.RecruitBanner/getRecruitBannerSort' ,// 首页Banner排序
    getRecruitBannerDis: '/recruit/platform.RecruitBanner/getRecruitBannerDis' ,// 首页Banner展示
    getRecruitBannerDel: '/recruit/platform.RecruitBanner/getRecruitBannerDel' ,// 首页Banner删除

    getRecruitIndustryList: '/recruit/platform.RecruitIndustry/getRecruitIndustryList' ,// 行业管理列表
    getRecruitIndustryCreate: '/recruit/platform.RecruitIndustry/getRecruitIndustryCreate' ,// 行业管理保存
    getRecruitIndustryInfo: '/recruit/platform.RecruitIndustry/getRecruitIndustryInfo' ,// 行业管理一条
    getRecruitIndustrySort: '/recruit/platform.RecruitIndustry/getRecruitIndustrySort' ,// 行业管理排序
    getRecruitIndustryDis: '/recruit/platform.RecruitIndustry/getRecruitIndustryDis' ,// 行业管理展示
    getRecruitIndustryDel: '/recruit/platform.RecruitIndustry/getRecruitIndustryDel' ,// 行业管理删除
    getRecruitIndustryLevelList: '/recruit/platform.RecruitIndustry/getRecruitIndustryLevelList' ,// 二级行业管理列表
    getRecruitIndustryLevelCreate: '/recruit/platform.RecruitIndustry/getRecruitIndustryLevelCreate' ,// 二级行业管理列表
    getRecruitIndustryLevelDel: '/recruit/platform.RecruitIndustry/getRecruitIndustryLevelDel' ,// 二级行业管理列表


    getRecruitWelfareList: '/recruit/platform.RecruitWelfare/getRecruitWelfareList' ,// 企业福利列表
    getRecruitWelfareCreate: '/recruit/platform.RecruitWelfare/getRecruitWelfareCreate' ,// 企业福利保存
    getRecruitWelfareInfo: '/recruit/platform.RecruitWelfare/getRecruitWelfareInfo' ,// 企业福利一条
    getRecruitWelfareDis: '/recruit/platform.RecruitWelfare/getRecruitWelfareDis' ,// 企业福利展示
    getRecruitWelfareDel: '/recruit/platform.RecruitWelfare/getRecruitWelfareDel' ,// 企业福利删除

    getList: '/recruit/platform.TalentManagement/getList', // 人才管理列表
    getLibMsgLIst: '/recruit/platform.TalentManagement/getLibMsgLIst', // 历史记录
    getResumeMsg: '/recruit/platform.TalentManagement/getResumeMsg', // 简历
}
export default recruitPlatformApi