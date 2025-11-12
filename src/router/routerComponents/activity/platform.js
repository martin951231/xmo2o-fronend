const ActivityPlatformComponents = {
    // 转盘抽奖列表
    'ActivityPlatformTurntableLotteryList': () => import('@/views/activity/platform/turntableLottery/List'),
    // 广告列表
    'ActivityPlatformAdverList': () => import('@/views/activity/platform/adver/List'),
    // 【ID1018002】麻将牌 活动列表
    'ActivityMahjongCardList': () => import('@/views/activity/platform/mahjongCard/List'),
    // 【ID1018002】麻将牌 活动编辑
    'ActivityMahjongCardEdit': () => import('@/views/activity/platform/mahjongCard/Edit'),
    // 【ID1018002】麻将牌 兑奖规则列表
    'ActivityMahjongCardCashRulesList': () => import('@/views/activity/platform/mahjongCard/CashRulesList'),
    // 【ID1018002】麻将牌 中奖列表 && 兑奖列表
    'ActivityMahjongCardWinPrizeList': () => import('@/views/activity/platform/mahjongCard/WinPrizeList'),
}
export default ActivityPlatformComponents
  