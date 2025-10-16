/**
 *******************
 *   @author 万紫阳
 *   @date 2020-08-06
 *   @description 信息相关组件
 *******************
 */
const pageVillageComunityComponents = {
    // 你需要动态引入的页面组件 小区基本信息
    //小区基本设置
    villageConfig: () => import('@/views/community/village/setting/baseConfig'),
    dataStatisticsVillageBase: () => import('@/views/community/village/baseInfo/datastatistics'),
    engineIndex: () => import('@/views/community/village/workWx/contentEngine/engineIndex'),
    chatSidebar: () => import('@/views/community/village/workWx/contentEngine/chatSidebar'),
    codeIndex: () => import('@/views/community/village/workWx/channelCode/codeIndex'),
    addCode: () => import('@/views/community/village/workWx/channelCode/addCode'),
    messageList: () => import('@/views/community/village/workWx/sendMessage/messageList'),
    addQywxMessage: () => import('@/views/community/village/workWx/sendMessage/addQywxMessage'),
    dataCenter: () => import('@/views/community/village/workWx/dataCenter/dataCenter'),
    sessionFile: () => import('@/views/community/village/workWx/sessionFile/sessionFileIndex'),
    sessionFileSet: () => import('@/views/community/village/workWx/sessionFile/sessionFileSet'), //会话存档配置

    repairSubjectList: () => import('@/views/community/village/workOrder/repairCate/repairSubjectList'), //工单类目列表
    editRepairSubject: () => import('@/views/community/village/workOrder/repairCate/editRepairSubject'), //编辑工单类目
    repairCategoryList: () => import('@/views/community/village/workOrder/repairCate/repairCategoryList'), //工单类别列表
    newRepairCateList: () => import('@/views/community/village/workOrder/repairCate/newRepairCateList'), // 工单一级分类
    newRepairCateChildList: () => import('@/views/community/village/workOrder/repairCate/newRepairCateChildList'), // 工单二级分类

    orderDataSetting: () => import('@/views/community/village/workOrder/orderTongji/workerSet'), // 工单设置
    workOrderEvaluate: () => import('@/views/community/village/workOrder/orderTongji/workOrderEvaluate'), // 工单设置

    venueList: () => import('@/views/community/village/venue/activityList'), //场馆列表
    // 收银台
    cashierOrderList: () => import('@/views/community/village/charge/cashier/cashierOrderList'), // 列表
    cashierNewOrderList: () => import('@/views/community/village/charge/cashier/cashierNewOrderList'), // 新版收银台列表
    cashierDivideOrderList: () => import('@/views/community/village/charge/cashier/cashierDivideOrderList'), // 新版收银台列表
    cancelOrderList: () => import('@/views/community/village/charge/cashier/cancelOrderList'), // 作废账单
    onlineOrderList: () => import('@/views/community/village/charge/cashier/onlineOrderList'), // 线上支付订单
    payableOrderList: () => import('@/views/community/village/charge/cashier/payableOrderList'), // 已缴账单
    historicalArrears: () => import('@/views/community/village/charge/cashier/historicalArrears'), // 历史缴费账单
    refundOrderList: () => import('@/views/community/village/charge/cashier/refundOrderList'), // 退款账单
    payableOrderInfo: () => import('@/views/community/village/charge/cashier/payableOrderInfo'), // 退款纪录
    refundList: () => import('@/views/community/village/charge/cashier/refundList'), // 退款纪录
    addRefundInfo: () => import('@/views/community/village/charge/cashier/addRefundInfo'), // 添加退款纪录
    receivableOrderList: () => import('@/views/community/village/charge/cashier/receivableOrderList'), // 应收账单

    // 收费
    projectList: () => import('@/views/community/village/charge/standard/projectList'), // 收费项目列表
    ruleList: () => import('@/views/community/village/charge/standard/ruleList'), // 收费规则列表
    prepaidList: () => import('@/views/community/village/charge/standard/prepaidList'), // 预缴列表
    bindList: () => import('@/views/community/village/charge/standard/bindList'), // 绑定列表
    addBindList: () => import('@/views/community/village/charge/standard/addBindList'), // 添加绑定列表
    addBindInfo: () => import('@/views/community/village/charge/standard/addBindInfo'), // 添加绑定账单生成时间
    addVacancyBind: () => import('@/views/community/village/charge/standard/addVacancyBind'), // 批量绑定房间
    chargeStandardAll: () => import('@/views/community/village/charge/standard/chargeStandardAll'), // 收费标准管理
    chargeStandardAllDel: () => import('@/views/community/village/charge/standard/chargeStandardAllDel'), // 已删除的收费标准管理

    // 收费设置
    setCharge: () => import('@/views/community/village/charge/setCharge'), // 收费设置
    remindIndex: () => import('@/views/community/village/workWx/violation/remind/remindIndex'), //违规提醒
    monitorIndex: () => import('@/views/community/village/workWx/violation/monitor/monitorIndex'), //违规监控

    //抄表管理
    getMeterProject: () => import('@/views/community/village/charge/houseMeter/getMeterProject'), // 抄表列表

    //快递管理
    expressPickupLocation: () => import('@/views/community/village/express/pickup/expressPickupLocation'), // 快递代取地点列表
    commonPickupPerson: () => import('@/views/community/village/express/pickup/commonPickupPerson'), // 快递常用取件人
    deliveryCollectionApplication: () => import('@/views/community/village/express/pickup/deliveryCollectionApplication'), // 快递代取申请

    //预存功能
    storageUserList: () => import('@/views/community/village/storage/storageUserList'), // 预存用户列表
    storageUserList_old: () => import('@/views/community/village/storage/storageUserList_old'), // 预存用户列表

    // 小区-交易汇总
    HouseFeeSummary: () => import('@/views/community/village/charge/summary/feeSummaryList'), // 物业费汇总列表
    visitorTmpParking: () => import('@/views/community/village/Parking/TemParking/visitorTmpParking'), // 临时停车列表

    cloudIntercom: () => import('@/views/community/village/face/dopu/cloudIntercom'), // 朵普云对讲
    printTemplateSet: () => import('@/views/community/village/charge/cashier/printTemplateSet'), // 打印模板
    printTemplate: () => import('@/views/community/village/charge/cashier/printTemplate'), // 打印模板

    showScreenSet: () => import('@/views/community/village/park/showScreenSet'), // 显屏/语音内容设置

    offLineDevList: () => import('@/views/community/village/hardware/offLineDevList'), // 设备预警列表 离线设备
    changeHouseWorkerPwd: () => import('@/views/community/village/houseWorker/changeHouseWorkerPwd'), // 工作人员
    houseWorkerList: () => import('@/views/community/village/houseWorker/houseWorkerList'), // 工作人员
    houseWorkerEdit: () => import('@/views/community/village/houseWorker/houseWorkerEdit'), // 工作人员
    houseAdminGroupList: () => import('@/views/community/village/houseWorker/houseAdminGroupList'), // 工作人员
    houseAdminList: () => import('@/views/community/village/houseWorker/houseAdminList'), // 工作人员
    frameworkList: () => import('@/views/community/village/framework/frameworkList'), // 组织架构
    userLabelList: () => import('@/views/community/village/charge/standard/userLabelList'), // 打印模板
    parkingLot: () => import('@/views/community/village/yardManagement/parkingLot'), // 停车场管理
    parkingSpace: () => import('@/views/community/village/yardManagement/parkingSpace'), // 车位管理
    vehicleManagement: () => import('@/views/community/village/yardManagement/vehicleManagement'), // 车辆管理
    laneManage: () => import('@/views/community/village/yardManagement/laneManage'), // 车道管理
    couponManage: () => import('@/views/community/village/yardManagement/couponManage'), // 优惠券管理
    dataRecord: () => import('@/views/community/village/yardManagement/dataRecord'), // 数据记录
    blackList: () => import('@/views/community/village/yardManagement/blackList'), // 黑名单记录
    freeCar: () => import('@/views/community/village/yardManagement/freeCar'), // 免费车记录
    labelManage: () => import('@/views/community/village/yardManagement/labelManage'), // 标签管理

    houseProgrammeList: () => import('@/views/community/village/programme/programmeList'), // 权限方案
    //无线AP
    apDevice: () => import('@/views/community/village/apDevice/apDevice'), // 权限方案

    //视频监控
    cameraList: () => import('@/views/community/village/device/camera/cameraList'), // 列表
    intelligentAlarm: () => import('@/views/community/village/device/camera/intelligentAlarm'), // 列表
    replyList: () => import('@/views/community/village/device/camera/replyList'), // 权限审核列表
    replayChek: () => import('@/views/community/village/device/camera/replayChek'), // 权限审核
    hotWordManageList: () => import('@/views/community/village/hotWordManage/wordList'), //语音机器人
    hotWordMaterialManageList: () => import('@/views/community/village/hotWordManage/materialCategoryList'), //语音机器人

    //智能汽车充电桩
    deviceManagement: () => import('@/views/community/village/smartCharge/deviceManagement'), //设备管理
    siteInformation: () => import('@/views/community/village/smartCharge/siteInformation'), //站点信息
    chargeOrderList: () => import('@/views/community/village/smartCharge/chargeOrderList'), //订单列表
    refundOrder: () => import('@/views/community/village/smartCharge/refundOrder'), //退款订单
    userWalletBalance: () => import('@/views/community/village/smartCharge/userWalletBalance'), //用户余额
    withdrawalApplication: () => import('@/views/community/village/smartCharge/withdrawalApplication'), //提现申请

    //人车房
    building: () => import('@/views/community/village/building/index'), //楼栋管理
    unitfloor: () => import('@/views/community/village/building/unitfloor'), //单元楼层管理
    room: () => import('@/views/community/village/room/index'), //房间管理
    owner: () => import('@/views/community/village/owner/index'), //业主管理
    ownerUnbid: () => import('@/views/community/village/owner/unbind'), //业主解绑
    ownerReview: () => import('@/views/community/village/owner/review'), //业主申请
    enant: () => import('@/views/community/village/enant/index'), //租客列表
    family: () => import('@/views/community/village/family/index'), //家属列表
    pagesSingleVisualization: () => import('@/views/community/village/building/pages/singleVisualization.vue'), //楼栋可视化页面
    faceList: () => import('@/views/community/village/owner/faceList'), //人脸列表管理

    //公租房
    unitRentalSingleList: () => import('@/views/community/village/unitRental/singleList'), //楼栋管理
    unitRentalHouseList: () => import('@/views/community/village/unitRental/houseList'), //房间管理
    housePublicRentalApply: () => import('@/views/community/village/housePublicRental/apply/applyList'), // 入住申请
    housePublicRentalHandle: () => import('@/views/community/village/housePublicRental/apply/handleList'), // 办理入住
    housePublicRentalRenting: () => import('@/views/community/village/housePublicRental/renting/rentingList'), // 办理退租

    //日志
    villageSettingLog: () => import('@/views/community/village/villageLog/villageSettingLog'), //核心日志
    villageLoginLog: () => import('@/views/community/village/villageLog/villageLoginLog'), //登录日志日志

    // 大华云睿
    daHuaYunRuiDataSyn: () => import('@/views/community/village/device/daHuaYunRuiSynBuildsData'), // 大华云睿数据同步列表
    daHuaYunRuiSynUnitsData: () => import('@/views/community/village/device/daHuaYunRuiSynUnitsData'), // 大华云睿数据单元同步列表
    daHuaYunRuiSynRoomsData: () => import('@/views/community/village/device/daHuaYunRuiSynRoomsData'), // 大华云睿数据房屋同步列表

    // 三方数据导入

    thirdDataImportIndex: () => import('@/views/community/village/thirdDataImport/index'), // 三方房产车场车位业主家属租客收费导入

    houseGridRange: () => import('@/views/community/village/houseGridRange/griddingInfo'), //财务报表
    housePropertyFeeSummary: () => import('@/views/community/village/charge/summary/housePropertyFeeList'), //物业费统计
    housePropertyFeeTjExport: () => import('@/views/community/village/charge/summary/housePropertyFeeTjExport'), //财务报表
    houseFinancialNoPayStatement: () => import('@/views/community/village/charge/summary/houseFinancialNoPayStatement'), //财务报表
    houseFinancialIsPayStatement: () => import('@/views/community/village/charge/summary/houseFinancialIsPayStatement'), //财务报表
    orderTransactionRecordList: () => import('@/views/community/village/charge/summary/orderTransactionRecordList'), //财务报表
    houseFinancialPaidDay:()=>import('@/views/community/village/charge/summary/houseFinancialPaidDay'),//财务报表

    // 指纹锁
    NBFingerprintDeviceList: () => import('@/views/community/village/device/fingerprint/deviceList'), // 指纹锁
    NBFingerprintLockOpenRecord: () => import('@/views/community/village/device/fingerprint/openRecordList'), // 指纹锁开门记录

    //停暖功能
    closeHeatingList: () => import('@/views/community/village/closeHeating/closeHeating/closeHeatingList'), // 申请停暖列表
    flowChargingList: () => import('@/views/community/village/closeHeating/flowCharging/flowChargingList'), // 申请流量计费列表

    contractManage: () => import('@/views/community/village/contractManage/index'), //合同管理
    robLeasePosition: () => import('@/views/community/village/yardManagement/robLeasePosition'), //车位抢购租赁
    onDutyCarStatistics: () => import('@/views/community/village/yardManagement/onDutyCarStatistics'),
    //垃圾回收设备
    EquipmentList: () => import('@/views/community/village/garbageRecycle/equipmentList/index'), // 设备列表
    ReleaseRecord: () => import('@/views/community/village/garbageRecycle/releaseRecord/index'), // 投放记录
    WarningRecord: () => import('@/views/community/village/garbageRecycle/warningRecord/index'), // 预警记录
}
export default pageVillageComunityComponents
