const voteApi = {
  // 投票活动
    getVoteList: '/community/platform.Vote/getVoteList' ,// 投票活动列表
    getVoteDetail: '/community/platform.Vote/getVoteDetail' ,// 查看投票活动详情
    getVoteResult: '/community/platform.Vote/getVoteResult' ,// 查看投票活动结果
    getVoteResultOne: '/community/platform.Vote/getVoteResultOne' ,// 查看投票活动结果详情

    getContributionRateList: '/community/platform.Statistics/getContributionRateList' ,// 获取缴费率
    getRepairRateList: '/community/platform.Statistics/getRepairRateList' ,// 获取工单完成率
    getPatrolInspectionRateList: '/community/platform.Statistics/getPatrolInspectionRateList' ,// 获取巡检完成率
}
export default voteApi;