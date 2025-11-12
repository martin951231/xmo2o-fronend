/**
 *******************
 *   @author Liz
 *   @date 2021-01-08
 *   @description 平台首页接口
 *******************
 */
const indexPlatformApi = {
    getMainBasicData: '/common/platform.Main/getMainBasicData', //首页重要配置提示
    getMiddleStatisticsData: '/common/platform.Main/getMiddleStatisticsData', //首页统计数据
    getBacklog: '/common/platform.Main/getBacklog', //首页待办事项
    getHotMenu: '/common/platform.plugin/getHotMenu', //首页常用功能
    editHotMenu: '/common/platform.plugin/editHotMenu', //首页常用功能编辑
    getAllMenuTree: '/common/platform.plugin/getAllMenuTree', //获得应用中心所有菜单
    closeOldShow: '/common/platform.Main/closeOldShow', //关闭旧版商城和餐饮的按钮是否展示
    closeOld: '/common/platform.Main/closeOld', //关闭旧版商城和餐饮
}

export default indexPlatformApi