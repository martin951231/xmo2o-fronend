const configHouseMeterApi = {
  passwordEdit: '/community/house_meter.AdminUser/passwordEdit', // 修改密码
  adminUserList: '/community/house_meter.AdminUser/adminUserList', // 管理员列表
  adminUserAdd: '/community/house_meter.AdminUser/adminUserAdd ', // 添加管理员
  adminUserEdit: '/community/house_meter.AdminUser/adminUserEdit', // 编辑管理员
  adminUserInfo: '/community/house_meter.AdminUser/adminUserInfo', // 查询管理员账户信息
  adminUserDelete: '/community/house_meter.AdminUser/adminUserDelete', // 删除管理员
  areaList: '/community/house_meter.AdminUser/areaList', // 获取城市列表

  villageBindList: '/community/house_meter.Power/villageBindList', // 获取小区列表
  meterVillageAdd: '/community/house_meter.Power/meterVillageAdd', // 绑定小区
  meterVillageAddll: '/community/house_meter.Power/meterVillageAddll', // 批量绑定
  meterVillageDelete: '/community/house_meter.Power/meterVillageDelete', // 移除绑定
  getVillageInfo: '/community/house_meter.Power/getVillageInfo', // 获取小区详情


  meterElectricList: '/community/house_meter.MeterElectric/meterElectricList', // 获取电表列表
  meterElectricInfo: '/community/house_meter.MeterElectric/meterElectricInfo', // 获取电表信息
  meterElectricAdd: '/community/house_meter.MeterElectric/meterElectricAdd', // 添加电表
  meterElectricEdit: '/community/house_meter.MeterElectric/meterElectricEdit', // 修改电表信息
  meterElectricDelete: '/community/house_meter.MeterElectric/meterElectricDelete', //删除电表
  getMeasureList: '/community/house_meter.MeterElectric/getMeasureList', //查询测量点
  switch: '/community/house_meter.MeterElectric/switch', //开关闸
  meterReading: '/community/house_meter.MeterElectric/now_reading_electric', //手动抄表


  meterElectricGroupList:'/community/house_meter.MeterElectricGroup/meterElectricGroupList',//获取分组列表
  meterElectricGroupAdd:'/community/house_meter.MeterElectricGroup/meterElectricGroupAdd',//添加分组信息
  meterElectricGroupEdit:'/community/house_meter.MeterElectricGroup/meterElectricGroupEdit',//编辑分组信息
  meterElectricGroupInfo:'/community/house_meter.MeterElectricGroup/meterElectricGroupInfo',//获取分组信息

  meterElectricSetInfo:'/community/house_meter.MeterElectric/meterElectricSetInfo',//查询电表设置详情
  meterElectricSetEdit:'/community/house_meter.MeterElectric/meterElectricSetEdit',//修改设置信息
  MeterReadingList:'/community/house_meter.MeterElectric/getMeterReadingList',//获取实时电量

  getAreaList:'/community/house_meter.MeterElectricPrice/getAreaList',//获取城市列表
  getAreaPriceList:'/community/house_meter.MeterElectricPrice/getAreaPriceList',//获取电表收费标准
  meterElectricPriceAdd:'/community/house_meter.MeterElectricPrice/meterElectricPriceAdd',//添加收费标准
  meterElectricPriceEdit:'/community/house_meter.MeterElectricPrice/meterElectricPriceEdit',//编辑收费标准




  payorderList:'/community/house_meter.MeterUserPayorder/payorderList',//获取账单列表
  payorderPrint:'/community/house_meter.MeterUserPayorder/payorderPrint',//导出账单列表



  //获取省市区等信息
  getAreasList:'/community/house_meter.MeterElectric/getAreaList',//查询省市区
  getCommunityList:'/community/house_meter.MeterElectric/getCommunityList',//查询街道社区
  getVillageList:'/community/house_meter.MeterElectric/getVillageList',//查询小区
  getSingleList:'/community/house_meter.MeterElectric/getSingleList',//查询楼栋
  getFloorList:'/community/house_meter.MeterElectric/getFloorList',//查询单元
  getLayerList:'/community/house_meter.MeterElectric/getLayerList',//查询楼层
  getVacancyList:'/community/house_meter.MeterElectric/getVacancyList',//查询房间

  uploadFile:'/community/house_meter.MeterElectric/uploadFile',//导入
  
  //电表大数据
  getTongjiCount:'/community/house_meter.DataStatistics/getTongjiCount',//大屏头部数据统计
  getEleWarnList:'/community/house_meter.DataStatistics/getEleWarnList',//设备告警管理
  powerConsumptionAnalysis:'/community/house_meter.DataStatistics/powerConsumptionAnalysis',//设备耗电分析
  deviceManage:'/community/house_meter.DataStatistics/deviceManage',//设备管理
  powerConsumptionFeeAnalysis:'/community/house_meter.DataStatistics/powerConsumptionFeeAnalysis',//设备耗电费用分析
  getTongjiCountByCity:'/community/house_meter.DataStatistics/getTongjiCountByCity',//地图数据


}

  export default configHouseMeterApi