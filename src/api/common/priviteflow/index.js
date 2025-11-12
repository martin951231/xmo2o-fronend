/**
 *******************
 *   @author zhengyali
 *   @date 2021-03-06
 *   @description 私域流量接口地址
 *******************
 */
const privateFlowApi = {
    getActivityList: '/common/platform.PrivateDomainFlow/activityLists', //活动列表
    getShowPages: '/common/platform.PrivateDomainFlow/pages', //展示页面
    getUserList: '/common/platform.Crm/users', //企业用户列表
    saveActivity: '/common/platform.PrivateDomainFlow/saveActivity', //新建、编辑活动
    delActivity: '/common/platform.PrivateDomainFlow/delActivity', //删除活动
    getActivityInfo: '/common/platform.PrivateDomainFlow/showActivity', //活动信息
    getAllArea: '/common/platform.area.Area/getAllArea', //所有区域信息
    assignArea: '/common/platform.PrivateDomainFlow/assignArea', //指定区域
    alertTemplates: '/common/platform.PrivateDomainFlow/alertTemplates', //弹层模板
    hoverTemplates: '/common/platform.PrivateDomainFlow/hoverTemplates', //悬浮模板
    getStoreList: '/common/platform.PrivateDomainFlow/storeLists', //店铺列表
    assignStore: '/common/platform.PrivateDomainFlow/assignStore', //指定店铺
    makeupPic: '/common/platform.PrivateDomainFlow/buildAlertPic', //在线制图
    isBind: '/common/platform.Crm/isBind', //是否绑定企业微信
    register: '/common/platform.Crm/register', //注册
    getLoginUrl: '/common/platform.Crm/getLoginUrl', //去登陆
}

export default privateFlowApi