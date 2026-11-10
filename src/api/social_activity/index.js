const socialActivityApi = {
  getRefundList: '/social_activity/socialactivity.SocialActivityRefund/getList',
  queryRefundStatus: '/social_activity/socialactivity.SocialActivityRefund/queryStatus',
  //订单管理接口
  getOrderList: '/social_activity/socialactivity.SocialActivityOrder/getOrderList', //获取订单列表
  applyWithdraw: '/social_activity/socialactivity.SocialActivityOrder/applyWithdraw', //申请提现
  getWithdrawRecordList: '/social_activity/socialactivity.SocialActivityOrder/getWithdrawRecordList', //获取提现记录列表
  getIndexInfo: '/social_activity/socialactivity.SocialActivityIndex/getInfo',
  //可视化页面接口
  getUrlAndRecSwitch: '/social_activity/socialactivity.Decoration/getUrlAndRecSwitch',
  getDecorationAdverList: '/social_activity/socialactivity.Decoration/getAdAdverList', //获取广告列表
  getDecorationAdverDetail: '/social_activity/socialactivity.Decoration/getAdAdverDetail', //获取广告详情
  saveDecorationAdver: '/social_activity/socialactivity.Decoration/saveAdAdver', //保存广告
  deleteDecorationAdver: '/social_activity/socialactivity.Decoration/deleteAdAdver', //删除广告
  changeSelect: '/social_activity/socialactivity.Decoration/changeSelect', //修改导航栏行数和每行数量
  //分类管理接口
  getCategoryList: '/social_activity/socialactivity.SocialActivityCategory/getCategoryList', //获取分类列表
  saveCategory: '/social_activity/socialactivity.SocialActivityCategory/saveCategory', //保存分类（新增/编辑）
  deleteCategory: '/social_activity/socialactivity.SocialActivityCategory/deleteCategory', //删除分类
  //活动管理接口
  getActivityList: '/social_activity/socialactivity.SocialActivity/getList', //获取活动列表
  getEditInfo: '/social_activity/socialactivity.SocialActivity/getEditInfo', //获取相关信息
  getActivityDetail: '/social_activity/socialactivity.SocialActivity/getDetail', //获取活动详情
  saveActivity: '/social_activity/socialactivity.SocialActivity/saveActivity', //保存活动（新增/编辑）
  auditActivity: '/social_activity/socialactivity.SocialActivity/auditActivity', //审核活动
  cancelAuditActivity: '/social_activity/socialactivity.SocialActivity/cancelAuditActivity', // 消审活动
  recommendActivity: '/social_activity/socialactivity.SocialActivity/recommendActivity', //推荐/撤回活动
  cancelActivity: '/social_activity/socialactivity.SocialActivity/cancelActivity', //取消活动
  getSessionList: '/social_activity/socialactivity.SocialActivity/getSessionList', //获取场次列表
  getSignUpList: '/social_activity/socialactivity.SocialActivity/getSignUpList', //获取报名列表
  getSignUpStatistics: '/social_activity/socialactivity.SocialActivity/getSignUpStatistics', //获取报名统计
  getSignUpQrcode: '/social_activity/socialactivity.SocialActivity/getSignUpQrcode', //获取签到二维码
  exportSignUpList: '/social_activity/socialactivity.SocialActivity/exportSignUpList', //导出报名列表
  getOrderSurveyForm: '/social_activity/socialactivity.SocialActivity/getOrderSurveyForm', //获取订单报名表单
    // 组织管理
    getAdminList: '/social_activity/socialactivity.SocialActivityAdmin/getAdminList',
    saveAdmin: '/social_activity/socialactivity.SocialActivityAdmin/saveAdmin',
    deleteAdmin: '/social_activity/socialactivity.SocialActivityAdmin/deleteAdmin',
    getVillageList: '/social_activity/socialactivity.SocialActivityAdmin/getVillageList',
    // 权限套餐管理
    getRoleList: '/social_activity/socialactivity.SocialActivityRole/getRoleList',
    saveRole: '/social_activity/socialactivity.SocialActivityRole/saveRole',
    getMenuTreeList: '/social_activity/socialactivity.SocialActivityMenu/getMenuTreeList',
    deleteRole: '/social_activity/socialactivity.SocialActivityRole/deleteRole',
    //积分规则
    getPointRuleList: '/social_activity/socialactivity.SocialActivityPointRule/getPointRuleList', //获取积分规则列表
    savePointRule: '/social_activity/socialactivity.SocialActivityPointRule/savePointRule', //保存积分规则（新增/编辑）
    deletePointRule: '/social_activity/socialactivity.SocialActivityPointRule/deletePointRule', //删除积分规则
    //积分明细
    getPointDetailList: '/social_activity/socialactivity.SocialActivityPointRule/getPointDetailList', //获取积分明细列表
    //评论设置
    getCommentSettings: '/social_activity/socialactivity.SocialActivityComment/getSettings', //获取评论设置
    saveCommentSettings: '/social_activity/socialactivity.SocialActivityComment/saveSettings', //保存评论设置
    // 支付设置
    getPayConfig: '/social_activity/socialactivity.SocialActivityPayConfig/getConfig', // 获取支付配置
    savePayConfig: '/social_activity/socialactivity.SocialActivityPayConfig/saveConfig', // 保存支付配置
    //敏感词管理
    getSensitiveWordList: '/social_activity/socialactivity.SocialActivitySensitiveWord/getList', //获取敏感词列表
    saveSensitiveWord: '/social_activity/socialactivity.SocialActivitySensitiveWord/save', //保存敏感词（新增/编辑）
    deleteSensitiveWord: '/social_activity/socialactivity.SocialActivitySensitiveWord/delete', //删除敏感词
    //活动评论管理
    getCommentList: '/social_activity/socialactivity.SocialActivityComment/getCommentList', //获取活动评论列表
    auditComment: '/social_activity/socialactivity.SocialActivityComment/auditComment', //审核评论
    batchAuditComment: '/social_activity/socialactivity.SocialActivityComment/batchAuditComment', //批量审核评论
    selectComment: '/social_activity/socialactivity.SocialActivityComment/selectComment', //精选评论
    cancelSelectComment: '/social_activity/socialactivity.SocialActivityComment/cancelSelectComment', //取消精选评论
}
export default socialActivityApi
