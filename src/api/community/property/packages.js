/**
 *******************
 *   @author 万紫阳
 *   @date 2020-08-18
 *   @description 物业套餐相关接口地址
 *******************
 */

const common = {
    propertyGetOrderPackage: '/community/property_api.PrivilagePackage/getOrderPackage', // 获取对应物业相关套餐列表
    propertyGetPackageRoom: '/community/property_api.PrivilagePackage/getPackageRoom', // 获取功能套餐/房间套餐
    propertyGetPackageRoomList: '/community/property_api.PrivilagePackage/getPackageRoomList', // 获取功能套餐/房间套餐
    propertyCreateOrder: '/community/property_api.PrivilagePackage/createOrder', // 计算订单金额/生成新的订单
    propertygetRoomOrderPrice: '/community/property_api.PrivilagePackage/getRoomOrderPrice',//计算购买房间的价格
    propertyCreateRoomOrderNew: '/community/property_api.PrivilagePackage/createRoomOrderNew',//购买房间套餐生成新的订单

    propertyGetPayType: '/community/property_api.PrivilagePackage/getPayType', // 获取支付方式
    propertyCreateQrCode:'/community/property_api.PrivilagePackage/createQrCode', // 获取支付扫码图
    propertyCreateRoomQrCode:'/community/property_api.PrivilagePackage/createRoomQrCode', // 获取支付扫码图
    propertyQueryOrderPayStatus:'/community/property_api.PrivilagePackage/queryOrderPayStatus', // 轮训获取支付结果
    // 房屋购买
    propertyGetRoomList: '/community/property_api.RoomPackage/getRoomList', // 房屋套餐列表
    propertyGetBuyRoom: '/community/property_api.RoomPackage/getBuyRoom', // 购买房间套餐  获取选中房间套餐单个房间的金额及总金额
    propertyCreateRoomOrder: '/community/property_api.RoomPackage/createRoomOrder', // 购买房间套餐  获取选中房间套餐单个房间的金额及总金额
    propertyRoomCreateQrCode: '/community/property_api.RoomPackage/createQrCode', // 购买房间套餐  轮训获取支付结果
    propertyRoomQueryOrderPayStatus: '/community/property_api.RoomPackage/queryOrderPayStatus', // 购买房间套餐  轮训获取支付结果
    // 购买订单或者记录
    propertyGetPrivilagePackage: '/community/property_api.BuyPackage/getPrivilagePackage', // 物业订购功能套餐
    propertyGetRoomPackage: '/community/property_api.BuyPackage/getRoomPackage', // 物业购买的所有房间套餐


   //设置新版收费生效时间
    chargeTimeInfo: '/community/property_api.ChargeTime/takeEffectTimeInfo', // 查询生效时间
    setChargeTime: '/community/property_api.ChargeTime/takeEffectTimeSet', // 设置生效时间

    chargeNumberList: '/community/property_api.ChargeTime/chargeNumberList', // 查询科目列表
    chargeNumberInfo: '/community/property_api.ChargeTime/chargeNumberInfo', // 查询科目详情
    addChargeNumber: '/community/property_api.ChargeTime/addChargeNumber', // 添加科目
    editChargeNumber: '/community/property_api.ChargeTime/editChargeNumber', // 编辑科目
    editChargeTypeCode: '/community/property_api.ChargeTime/editChargeTypeCode', // 编辑缴费编号
    getChargeType: '/community/property_api.ChargeTime/getChargeType', // 查询收费类别
    getChargeTypeCode: '/community/property_api.ChargeTime/getChargeTypeCode', // 查询收费类别缴费编号
    chargeWaterType: '/community/property_api.ChargeTime/chargeWaterType', // 定制水费类型

    offlinePayList: '/community/property_api.ChargeTime/offlinePayList', // 查询线下支付方式列表
    offlinePayInfo: '/community/property_api.ChargeTime/offlinePayInfo', // 查询线下支付方式详情
    addOfflinePay: '/community/property_api.ChargeTime/addOfflinePay', // 添加线下支付方式
    editOfflinePay: '/community/property_api.ChargeTime/editOfflinePay', // 编辑线下支付方式
    delOfflinePay: '/community/property_api.ChargeTime/delOfflinePay', // 删除线下支付方式
    getCountFeeList: '/community/property_api.ChargeTime/countVillageFee', // 小区费用统计
    villageLogin: '/community/property_api.ChargeTime/village_login', // 登录小区后台
    propertyChargeProjectList: '/community/property_api.Charge/chargeProjectList', // 物业下所有小区收费项目
    propertyVillageMonthlyBill: '/community/property_api.Charge/villageMonthlyBill', // 小区月度已缴报表
    propertyvillageMonthlyBillExport: '/community/property_api.Charge/villageMonthlyBillExport', // 小区月度已缴报表(导出)
    propertyChargeRuleList: '/community/property_api.Charge/chargeRuleList', // 标准数据列表
    getPropertyVillageList: '/community/property_api.Charge/getVillageList', // 标准数据列表
    
    propertyVillageYearlyBill: '/community/property_api.Charge/villageYearlyBill', // 小区年度已缴报表
    propertyVillageYearlyBillExport: '/community/property_api.Charge/villageYearlyBillExport', // 小区年度已缴报表(导出)
    propertyVillageYearlyReceivable: '/community/property_api.Charge/villageYearlyReceivable', // 小区年度应收报表
    

    //物业组织架构
    frameworkTissueNav: '/community/common.Framework/getTissueNav', // 获取物业组织架构数据
    frameworkTissueUser: '/community/common.Framework/getTissueUser', // 组织架构下人员数据
    frameworkGroupParam: '/community/common.Framework/getGroupParam', // 获取组织架构参数
    frameworkPropertyVillage: '/community/common.Framework/getPropertyVillage', // 获取未绑定物业的小区
    frameworkOrganizationAdd: '/community/common.Framework/organizationAdd', // 添加子组织
    frameworkOrganizationQuery: '/community/common.Framework/organizationQuery', // 返回编辑子组织
    frameworkOrganizationSub: '/community/common.Framework/organizationSub', // 提交编辑子组织
    frameworkOrganizationDel: '/community/common.Framework/organizationDel', // 删除组织
    frameworkWorkerAdd: '/community/common.Framework/workerAdd', // 添加人员
    frameworkWorkerSub: '/community/common.Framework/workerSub', // 编辑人员
    getFrameworkConfig: '/community/common.Framework/getFrameworkConfig', // 配置信息

    //物业权限管理
    powerRoleList: '/community/property_api.Power/getRoleList', // 获取用户列表
    powerRoleDel: '/community/property_api.Power/roleDel', // 删除角色

    //物业设置
    propertyConfigSetApi : '/community/property_api.Property/config', //基本信息
    passwordChangeApi : '/community/property_api.Property/passwordChange', //基本信息-修改密码
    digitApi : '/community/property_api.Property/digit', //基本信息-参数设置
    saveDigitApi : '/community/property_api.Property/saveDigit', //基本信息-参数设置-更新
    
    ajaxProvince: "/community/property_api.Property/ajaxProvince",
    ajaxCity: "/community/property_api.Property/ajaxCity",
    ajaxArea: "/community/property_api.Property/ajaxArea",
    saveConfig: "/community/property_api.Property/saveConfig",
    
    //安全中心
    loginLogList    : '/community/property_api.Security/loginLog', //登录日志
    loginLogDetail  : '/community/property_api.Security/loginLogDetail', //登录日志详情
    commonLog       : '/community/property_api.Security/commonLog', //系统日志
    commonLogDetail : '/community/property_api.Security/commonLogDetail', //系统日志详情


    showAbChina : '/community/property_api.ChargeTime/showAbChina', //查询农行参数配置是否展示
    setAbChina : '/community/property_api.ChargeTime/setAbChina', //基本信息-农行参数设置
    editAbChina : '/community/property_api.ChargeTime/editAbChina', //基本信息-农行参数设置
    
    //建行支付配置
    getConstructionStatus : '/community/property_api.ChargeTime/getConstructionStatus', //是否展示收费账号配置
    getChargeNumberLogInfo : '/community/property_api.ChargeTime/getChargeNumberLogInfo', //获取收费科目变更记录
    savePropertyWorkerInfo:'/community/property_api.PropertyWorker/savePropertyWorkerInfo', //员工管理
    getPropertyWorkerList:'/community/property_api.PropertyWorker/getPropertyWorkerList', //员工管理
    disableWorkerAccount:'/community/property_api.PropertyWorker/disableWorkerAccount', //员工管理
    delPropertyWorker:'/community/property_api.PropertyWorker/delPropertyWorker', //员工管理
    getOnePropertyWorkerInfo:'/community/property_api.PropertyWorker/getOnePropertyWorkerInfo', //员工管理

    getOrderTicketNumberList:'/community/property_api.OrderTicketNumber/getOrderTicketNumberList', //票据管理
    generateTicketNumber:'/community/property_api.OrderTicketNumber/generateTicketNumber', //票据管理
    delTicketNumber:'/community/property_api.OrderTicketNumber/delTicketNumber', //票据管理
    clearTicketNumberStatus:'/community/property_api.OrderTicketNumber/clearTicketNumberStatus', //票据管理

    getPropertySingleKeepers:'/community/property_api.PropertyWorker/getPropertySingleKeepers',  //收费率分析
    getRoomFeeRateList:'/community/property_api.Charge/getRoomFeeRateList', //收费率分析
    getRoomUnPayRateList:'/community/property_api.Charge/getRoomUnPayRateList', //收费率分析
    getPropertyRateSummaryRecordList:'/community/property_api.Charge/getRoomRateSummaryRecordList', //收费率分析
    
  }
  
  export default common
  