const datastatisticsApi = {
  villagePopulation: '/community/village_api.DataStatistics/villagePopulation', //房间和住户的数量
  workOrder: '/community/village_api.DataStatistics/workOrder', // 工单数据处理
  itemsLists: '/community/village_api.DataStatistics/itemsLists', // 事项列表
  menuLists: '/community/village_api.DataStatistics/menuLists', // 中间菜单
  chargeStatistics: '/community/village_api.DataStatistics/chargeStatistics', // 收费统计
  inspectionData: '/community/village_api.DataStatistics/inspectionData', // 巡检数据
  deviceStatistics: '/community/village_api.DataStatistics/deviceStatistics', // 今日人流量、设备管理
  carStatistics: '/community/village_api.DataStatistics/carStatistics', // 今日车流量，车场数据
  openDoorLog: '/community/village_api.DataStatistics/openDoorLog', // 人脸门禁实时记录
  openDoorLocation: '/community/village_api.DataStatistics/openDoorLocation', // 开门地图定位
  config: '/community/village_api.DataStatistics/config', // 开门地图定位
  userNum: '/community/village_api.DataStatistics/getUserLableStatistics', // 用户标签统计
}

export default datastatisticsApi
