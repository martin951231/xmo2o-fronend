const activityPlatformApi = {
    // 大转盘列表
    turntableLotteryGetList:'/roundabout/platform.Activity/getList',
    // 大转盘状态修改
    turntableLotteryChangeStatus:'/roundabout/platform.Activity/changeStatus',
    // 大转盘删除
    turntableLotteryDelActivity:'roundabout/platform.Activity/delActivity',
    // 大转盘添加
    turntableLotteryAddActivity:'/roundabout/platform.Activity/addActivity',
    // 大转盘编辑
    turntableLotteryEditActivity:'/roundabout/platform.Activity/editActivity',
    // 大转盘详情
    turntableLotteryDetailActivity:'/roundabout/platform.Activity/detailActivity',
    // 大转盘中奖列表
    turntableLotteryGetUserList:'/roundabout/platform.Activity/getUserList',
    // 大转盘优惠券列表
    turntableLotteryGetCouponList:'roundabout/platform.Activity/getCouponList',
    // 首页弹窗-弹窗广告列表
    AdverGetList:'/roundabout/platform.Adver/getList',
    // 首页弹窗-弹窗广告状态修改
    AdverChangeStatus:'/roundabout/platform.Adver/changeStatus',
    // 首页弹窗-弹窗广告删除
    AdverDel:'/roundabout/platform.Adver/delAdver',
    // 首页弹窗-弹窗广告添加
    AdverAdd:'/roundabout/platform.Adver/addAdver',
    // 首页弹窗-弹窗广告编辑
    AdverEdit:'/roundabout/platform.Adver/editAdver',
    // 大转盘商家优惠券列表
    turntableLotteryGetMerCouponList:'/roundabout/platform.Activity/getMerCouponList',
    // 获取平台广告指定区域
    getAdverArea:'/roundabout/platform.Adver/getAdverArea',
    // 平台广告指定区域
    adverAreaSet:'/roundabout/platform.Adver/adverAreaSet',
    // 翻牌活动列表
    mahjongCardGetList:'/flipping_event/platform.FlippingEvent/getList',
    // 翻牌活动删除
    mahjongCardDel:'/flipping_event/platform.FlippingEvent/delete',
    // 翻牌活动添加 || 编辑
    mahjongCardSave:'/flipping_event/platform.FlippingEvent/saveData',
    // 翻牌活动详情
    mahjongCardDetail:'/flipping_event/platform.FlippingEvent/getDetail',
    // 翻牌活动兑奖规则列表
    mahjongCardRulesList:'/flipping_event/platform.FlippingEventRules/getRulesList',
    // 翻牌活动兑奖规则保存
    mahjongCardRulesSave:'/flipping_event/platform.FlippingEventRules/saveData',
    // 翻牌活动兑奖规则删除
    mahjongCardRulesDel:'/flipping_event/platform.FlippingEventRules/delete',
    // 翻牌活动中奖列表
    mahjongCardAwardLogList:'/flipping_event/platform.FlippingEventAwardsLog/getAwardLogList',
    // 翻牌活动兑奖列表
    mahjongCardRulesLogList:'/flipping_event/platform.FlippingEventRulesLog/getRulesLogList',
    // 翻牌活动兑奖手动兑换
    mahjongCardRulesLogChangeStatus:'/flipping_event/platform.FlippingEventRulesLog/changeStatus'
}
export default activityPlatformApi