const recruitMerchantApi = {
    getRecruitHrList: '/recruit/merchant.NewRecruitHr/getRecruitHrList', // HR列表
    getRecruitHrCreate: '/recruit/merchant.NewRecruitHr/getRecruitHrCreate', // HR保存
    getRecruitHrInfo: '/recruit/merchant.NewRecruitHr/getRecruitHrInfo', // HR单条
    getRecruitHrDel: '/recruit/merchant.NewRecruitHr/getRecruitHrDel', // HR删除
    getJobList: '/recruit/merchant.RecruitMerchant/getJobList' ,// 职位管理
    updateJob: '/recruit/merchant.RecruitMerchant/updateJob' ,// 职位状态变更
    delJob: '/recruit/merchant.RecruitMerchant/delJob' ,// 职位删除
    getJobSearch: '/recruit/merchant.RecruitMerchant/getJobSearch' ,// 职位搜索条件
    getJobDetail: '/recruit/merchant.RecruitMerchant/getJobDetail' ,// 职位详情
    industryTree: '/recruit/merchant.Company/industryTree', // 行业树状图
    getInfo: '/recruit/merchant.Company/getInfo', // 商家公司信息
    saveInfo: '/recruit/merchant.Company/saveInfo', // 保存商家公司信息
    getRecruitWelfareLabelList: '/recruit/merchant.Company/getRecruitWelfareLabelList', // 福利标签列表
    getRecruitWelfareLabelCreate: '/recruit/merchant.Company/getRecruitWelfareLabelCreate', // 福利标签保存
    getRecruitWelfareLabelInfo: '/recruit/merchant.Company/getRecruitWelfareLabelInfo', // 福利标签获取

    getList: '/recruit/merchant.TalentManagement/getList', // 人才管理列表
    getLibMsgLIst: '/recruit/merchant.TalentManagement/getLibMsgLIst', // 历史记录
    getResumeMsg: '/recruit/merchant.TalentManagement/getResumeMsg', // 简历
}
export default recruitMerchantApi