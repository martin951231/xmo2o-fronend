/**
 *******************
 *   @author mrdeng
 *   @date 2021-05-24
 *   @description 平台消息推送接口
 *******************
 */
const thirdRobotApi = {
    getThirdRobotList: '/thirdRobot/platform.ThirdRobotManage/getRoboterList', //机器人列表
	getAllRobotsList: '/thirdRobot/platform.ThirdRobotManage/getAllRobotsList',
	getRemoteRobotList:'/thirdRobot/platform.ThirdRobotManage/getRemoteRobotList', //机器人列表
	getOneDetailInfo:'/thirdRobot/platform.ThirdRobotManage/getOneDetailInfo', //机器人列表
	getAllVillages:'/community/property_api.Power/getPropertyVillages', //机器人列表
	getProvinceCityAreas:'/community/property_api.Power/getProvinceCityAreas', //机器人列表
	getStreetCommunityList:'/community/property_api.Power/getStreetCommunityList', //机器人列表
	robotBindVillageOpt:'/thirdRobot/platform.ThirdRobotManage/robotBindVillageOpt', //机器人列表
	getThirdRobotTaskList:'/thirdRobot/platform.ThirdRobotManage/getThirdRobotTaskList', //机器人列表
	getRemoteRobotTaskList:'/thirdRobot/platform.ThirdRobotManage/getRemoteRobotTaskList', //机器人列表
	geteRobotTaskDetails:'/thirdRobot/platform.ThirdRobotManage/geteRobotTaskDetails', //机器人列表
	getRemoteRobotAlarmList:'/thirdRobot/platform.ThirdRobotManage/getRemoteRobotAlarmList', //机器人列表
	getRobotAlarmList:'/thirdRobot/platform.ThirdRobotManage/getRobotAlarmList', //机器人列表
	getAdminWorkers:'/thirdRobot/platform.ThirdRobotManage/getAdminWorkers', //机器人列表
	saveAlarmNoticeSet:'/thirdRobot/platform.ThirdRobotManage/saveAlarmNoticeSet', //机器人列表
	getAlarmNoticeList:'/thirdRobot/platform.ThirdRobotManage/getAlarmNoticeList', //机器人列表
	delAlarmNoticeSet:'/thirdRobot/platform.ThirdRobotManage/delAlarmNoticeSet', //机器人列表
	robotBranchBindVillageOpt:'/thirdRobot/platform.ThirdRobotManage/robotBranchBindVillageOpt', //机器人列表
    saveUpdateRobotSet:'/thirdRobot/platform.ThirdRobotManage/saveUpdateRobotSet', //机器人列表
    // 召唤记录
    thirdRobotDeliveryOrderList:'/thirdRobot/platform.ThirdRobotDeliveryOrder/orderList',
    // 机器人服务费
    setRobotDeliveryPrice:'/thirdRobot/platform.ThirdRobotDeliveryOrder/setRobotDeliveryPrice',
    // 订单退款
    cancelOrder:'/thirdRobot/platform.ThirdRobotDeliveryOrder/cancelOrder',
    // 商家端获取机器人列表
    merRobotList:'/thirdRobot/merchant.Robot/robotList',
    // 商家端获取机器人点位列表
    merRobotBizPointList:'/thirdRobot/merchant.Robot/robotBizPointList',
    // 店铺绑定机器人
    saveStoreRobot:'/thirdRobot/merchant.Robot/saveStoreRobot',
    // 机器人与店铺解绑
    delMerchantStoreRobot:'/thirdRobot/merchant.Robot/delMerchantStoreRobot',
    // 机器人与店铺绑定列表
    merchantStoreRobotList:'/thirdRobot/merchant.Robot/merchantStoreRobotList',
    // 店员端获取机器人与店铺绑定的列表
    storeStaffStoreRobotList: '/thirdRobot/storestaff.Robot/storeRobotList',
    // 员工召唤机器人
    storeStaffCreateOrder:'/thirdRobot/storestaff.Robot/createOrder'
}

export default thirdRobotApi