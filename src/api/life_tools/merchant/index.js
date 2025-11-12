const lifeToolsMerchantApi = {
  'getTicketList': 'life_tools/merchant.LifeToolsTicket/getList',// 获取门票列表
  'getTicketDetail': 'life_tools/merchant.LifeToolsTicket/getDetail',// 获取门票详情
  'ticketDel': 'life_tools/merchant.LifeToolsTicket/del',// 删除门票
  'TicketEdit': 'life_tools/merchant.LifeToolsTicket/addOrEdit',// 新增编辑门票
  'getLifeToolsList': 'life_tools/merchant.LifeTools/getInformationList',// 场馆课程列表
  'setLifeToolsAttrs': 'life_tools/merchant.LifeTools/setLifeToolsAttrs',// 设置场馆课程属性
  'getSportsOrderList': '/life_tools/merchant.SportsOrder/getOrderList',//订单列表
    'exportToolsOrder': '/life_tools/merchant.SportsOrder/exportToolsOrder',//导出订单
  'getSportsOrderDetail': '/life_tools/merchant.SportsOrder/getOrderDetail',//订单详情
  'agreeSportsOrderRefund': '/life_tools/merchant.SportsOrder/agreeRefund',//同意退款
  'refuseSportsOrderRefund': '/life_tools/merchant.SportsOrder/refuseRefund',//拒绝退款
  'getEditInfo': 'life_tools/merchant.LifeToolsTicket/getEditInfo',// 获得编辑添加所需参数
  'getCategoryList': 'life_tools/merchant.LifeToolsCategory/getCategoryList',// 获得分类列表
  'getMapConfig': 'life_tools/merchant.LifeTools/getMapConfig',// 获得地图配置
  'getAddressList': 'life_tools/merchant.LifeTools/getAddressList',// 获得城市列表
  'addEditLifeTools': 'life_tools/merchant.LifeTools/addEditLifeTools',// 编辑场馆课程
  'getLifeToolsDetail': 'life_tools/merchant.LifeTools/getLifeToolsDetail',// 获取场馆课程详情
  'delLifeTools': 'life_tools/merchant.LifeTools/delLifeTools',// 删除场馆课程
  'getReplyList': '/life_tools/merchant.LifeToolsReply/searchReply',//评价列表
  'isShowReply': '/life_tools/merchant.LifeToolsReply/isShowReply',
  'getReplyDetails': '/life_tools/merchant.LifeToolsReply/getReplyDetails',//评价详情
  'delReply': '/life_tools/merchant.LifeToolsReply/delReply',//删除
  'subReply': '/life_tools/merchant.LifeToolsReply/subReply',//回复评价
  'getReplyContent': '/life_tools/merchant.LifeToolsReply/getReplyContent',

  'getCardList': '/life_tools/merchant.EmployeeCard/getCardList',//员工卡配置列表
  'editCard': '/life_tools/merchant.EmployeeCard/editCard',//员工卡配置编辑
  'saveCard': '/life_tools/merchant.EmployeeCard/saveCard',//员工卡配置保存
  'delCard': '/life_tools/merchant.EmployeeCard/delCard',//员工卡配置删除

  'getSportsVerifyList': '/life_tools/merchant.SportsOrder/getVerifyList',//核销列表
  'exportVerifyRecord': '/life_tools/merchant.SportsOrder/exportVerifyRecord',//导出核销列表

  'getLimitedList': '/life_tools/merchant.LifeScenicLimitedAct/getLimitedList', // 秒杀-列表
  'updateLimited': '/life_tools/merchant.LifeScenicLimitedAct/addLimited', // 秒杀-添加或编辑
  'limitedChangeState': '/life_tools/merchant.LifeScenicLimitedAct/changeState', // 秒杀-失效
  'removeLimited': '/life_tools/merchant.LifeScenicLimitedAct/del', // 秒杀-删除
  'getLimitedInfo': '/life_tools/merchant.LifeScenicLimitedAct/edit', // 秒杀-编辑信息回显
  'getMerchantSort': '/life_tools/merchant.LifeToolsTicket/getMerchantSort', // 景区门票列表
  'getLifeToolsTicket': '/life_tools/merchant.LifeToolsTicket/getLifeToolsTicket', // 景区门票列表
  'getToolsCardList': '/life_tools/merchant.LifeTools/getToolsCardList',//次卡列表
  'AddOrEditToolsCard': '/life_tools/merchant.LifeTools/AddOrEditToolsCard',//添加或编辑次卡
  'getToolsCardEdit': '/life_tools/merchant.LifeTools/getToolsCardEdit',//获取次卡编辑信息
  'delToolsCard': '/life_tools/merchant.LifeTools/delToolsCard',//删除次卡
  'getAllToolsList': '/life_tools/merchant.LifeTools/getAllToolsList',//获取所有景区体育健身
  'getToolsCardRecord': '/life_tools/merchant.LifeTools/getToolsCardRecord',//
  'getCardOrderList': '/life_tools/merchant.LifeTools/getCardOrderList',//获取次卡订单列表
  'getCardOrderDetail': '/life_tools/merchant.LifeTools/getCardOrderDetail',//次卡订单详情
  'agreeCardOrderRefund': '/life_tools/merchant.LifeTools/agreeCardOrderRefund',//同意退款-次卡订单
  'refuseCardOrderRefund': '/life_tools/merchant.LifeTools/refuseCardOrderRefund',//拒绝退款-次卡订单
  'getSportsActivityList':'/life_tools/merchant.LifeToolsSportsActivity/getSportsActivityList',//约战列表
  'updateSportsActivityStatus':'/life_tools/merchant.LifeToolsSportsActivity/updateSportsActivityStatus',//约战状态更新
  'getSportsActivityOrderList':'/life_tools/merchant.LifeToolsSportsActivity/getSportsActivityOrderList',//约战订单列表
   'addSportsActivity':'/life_tools/merchant.LifeToolsSportsActivity/addSportsActivity',//约战保存
   'editSportsActivity':'/life_tools/merchant.LifeToolsSportsActivity/editSportsActivity',//约战编辑
   'getTravelList': '/life_tools/merchant.LifeToolsGroupTravelAgency/getTravelList', // 旅行社审核列表
   'agencyAudit': '/life_tools/merchant.LifeToolsGroupTravelAgency/audit', // 旅行社审核列表
   'getStaffList': '/life_tools/merchant.LifeToolsTicket/getStaffList', // 新版商家中心--店铺--店员列表
    /******************** 预约 start**************************/ 
    'getAppointList': 'life_tools/merchant.LifeToolsAppoint/getList', //预约列表
    'getAppointMsg': 'life_tools/merchant.LifeToolsAppoint/getToolAppointMsg', //获取信息
    'saveAppoint': 'life_tools/merchant.LifeToolsAppoint/saveToolAppoint', //保存信息
    'lookAppointUser': 'life_tools/merchant.LifeToolsAppoint/lookAppointUser', //报名信息
    'closeAppoint': 'life_tools/merchant.LifeToolsAppoint/closeAppoint', //关闭信息
    'exportAppointUserOrder': 'life_tools/merchant.LifeToolsAppoint/exportUserOrder', //关闭信息
    'delAppoint': 'life_tools/merchant.LifeToolsAppoint/delAppoint', //关闭信息客服
    'getSeatMap': '/life_tools/merchant.LifeToolsAppoint/getSeatMap', // 获取座位分布列表
    'getAppointOrderDetail':'life_tools/merchant.LifeToolsAppoint/getAppointOrderDetail', //订单详情
    /******************** 预约 end**************************/ 
    'auditRefund': 'life_tools/merchant.LifeToolsAppoint/auditRefund', //审核退款
    'suspend':'life_tools/merchant.LifeToolsAppoint/suspend', // 设置暂停活动
    /******************** 预约 end**************************/


    /******************** 体育秒杀 start**************************/ 
  'getSportsSecondsKillList': '/life_tools/merchant.LifeToolsSportsSecondsKill/getSecondsKillList', // 秒杀-列表
  'saveSportsSecondsKill': '/life_tools/merchant.LifeToolsSportsSecondsKill/saveSecondsKill', // 秒杀-添加或编辑
  'ChangeSportsSecondsKill': '/life_tools/merchant.LifeToolsSportsSecondsKill/ChangeSportsSecondsKill', // 
  'delSportsSecondsKill': '/life_tools/merchant.LifeToolsSportsSecondsKill/delSecondsKill', // 秒杀-删除
  'getSportsSecondsKillDetail': '/life_tools/merchant.LifeToolsSportsSecondsKill/getSecondsKillDetail', // 秒杀-获得秒杀详情
  /******************** 体育秒杀 end**************************/

  /******************** 团购门票 start**************************/
  'getGroupTicketList': 'life_tools/merchant.group/getGroupTicketList', //获取已选择的景区门票
  'getGroupLifeToolsTicket': 'life_tools/merchant.LifeToolsTicket/getLifeToolsTicket', //获取供选择的景区门票
  'addGroupTicket': 'life_tools/merchant.group/addGroupTicket', //添加团购门票
  'delGroupTicket': 'life_tools/merchant.group/delGroupTicket', //删除团购门票
  'editSettingData': 'life_tools/merchant.group/editSettingData', //保存团购门票配置
  'editGroupTicket':'life_tools/merchant.group/editGroupTicket', //修改团购门票配置
  'getSettingDataDetail':'life_tools/merchant.group/getSettingDataDetail', //获取团购门票配置
  /******************** 团购门票 end**************************/
  
  /******************** 团体票 start**************************/
  'getStatisticsData':'life_tools/merchant.LifeToolsGroupOrder/getStatisticsData', //团体票统计数据
  'getOrderList':'life_tools/merchant.LifeToolsGroupOrder/getOrderList', //团体票订单列表
 'getOrderAuditList': '/life_tools/merchant.LifeToolsGroupOrder/getAuditGroupOrderList', // 团体票订单审核列表
  'orderAudit': '/life_tools/merchant.LifeToolsGroupOrder/audit', // 团体票订单审核
   'groupOrderRefand':'life_tools/merchant.LifeToolsGroupOrder/groupOrderRefand', //团体票订单列表
  /******************** 团体票 end**************************/



    /* ******************* 三级分销 start**************************/
    'editDistributionPrice': 'life_tools/merchant.LifeToolsDistribution/editDistributionPrice', //配置分销价格
    'getDistributionSettingDataDetail': '/life_tools/merchant.LifeToolsDistribution/getSettingDataDetail', // 三级分销配置信息获取
    'getDistributionSettingeditSetting': '/life_tools/merchant.LifeToolsDistribution/editSetting', // 三级分销配置信息保存
    'getAtatisticsInfo': '/life_tools/merchant.LifeToolsDistribution/getAtatisticsInfo', // 获取分销员列表统计数据
    'getDistributorList': '/life_tools/merchant.LifeToolsDistribution/getDistributorList', // 获取分销员列表
    'getLowerLevel': '/life_tools/merchant.LifeToolsDistribution/getLowerLevel', // 获取分销员下级用户
    'audit': '/life_tools/merchant.LifeToolsDistribution/audit', // 分销员审核
    'getDistributionOrderList': '/life_tools/merchant.LifeToolsDistribution/getDistributionOrderList', // 查询指定用户的分销清单
    'editDistributionOrderNote': '/life_tools/merchant.LifeToolsDistribution/editDistributionOrderNote', // 修改分销清单备注
    'delDistributor': '/life_tools/merchant.LifeToolsDistribution/delDistributor', // 修改分销清单备注
    'addStatement': '/life_tools/merchant.LifeToolsDistribution/addStatement', // 生成结算单
    'getStatementList':'/life_tools/merchant.LifeToolsDistribution/getStatement', // 结算单列表
    'getStatementDetail': '/life_tools/merchant.LifeToolsDistribution/getStatementDetail', // 结算单详情
    /* ******************* 三级分销 end**************************/

  /******************** 体育审核 start**************************/
  'lifeToolsAudit':'/life_tools/platform.LifeTools/lifeToolsAudit', //体育课程审核
  'auditTicket':'/life_tools/platform.LifeToolsTicket/auditTicket', //体育门票审核
  /******************** 团体票 end**************************/

  /******************** 停车场 start**************************/
  'getMapCity':'/g=Index&c=Map&a=suggestion', //地图经纬度位置
  'getCarParkList':'/life_tools/merchant.LifeToolsCarPark/getCarParkList', //停车场列表接口
  'addCarPark':'/life_tools/merchant.LifeToolsCarPark/addCarPark', //停车场添加/编辑
  'showCarPark':'/life_tools/merchant.LifeToolsCarPark/showCarPark', //停车场详情
  'getToolsList':'/life_tools/merchant.LifeToolsCarPark/getToolsList', //获取景区/（体育课，课程列表）
  'deleteCarPark':'/life_tools/merchant.LifeToolsCarPark/deleteCarPark', //停车场-删除
  'statusCarPark':'/life_tools/merchant.LifeToolsCarPark/statusCarPark', //停车场-状态修改
  
  /******************** 停车场 end**************************/

  /******************** 商家wifi start**************************/
  'wifiList':'life_tools/merchant.LifeToolsWifi/wifiList', //商家wifi列表
  'wifiAdd':'life_tools/merchant.LifeToolsWifi/wifiAdd', //商家wifi添加/修改
  'wifiShow':'life_tools/merchant.LifeToolsWifi/wifiShow', //商家wifi详情
  'wifiStatusChange':'life_tools/merchant.LifeToolsWifi/wifiStatusChange', //商家wifi状态修改
  'wifiDelete':'life_tools/merchant.LifeToolsWifi/wifiDelete', //商家wifi删除
  /******************** 商家wifi end**************************/

  /******************** 景区地图 start**************************/
  'scenicMapSave': '/life_tools/merchant.LifeToolsScenicMap/saveMap', // 景区地图添加
  'scenicMapPlaceList': '/life_tools/merchant.LifeToolsScenicMap/mapPlaceList', // 景区地图标注列表
  'scenicMapPlaceSave': '/life_tools/merchant.LifeToolsScenicMap/saveMapPlace', // 景区地图标注添加/修改
  'scenicMapPlaceDel': '/life_tools/merchant.LifeToolsScenicMap/mapPlaceDel', // 景区地图标注删除
  'scenicMapLineList': '/life_tools/merchant.LifeToolsScenicMap/mapLineList', // 景区地图路线列表
  'scenicMapLineSave': '/life_tools/merchant.LifeToolsScenicMap/saveMapLine', // 景区地图路线添加/修改
  'scenicMapLineDel': '/life_tools/merchant.LifeToolsScenicMap/mapLineDel', // 景区地图路线删除
  'scenicMapScenicList': '/life_tools/merchant.LifeToolsScenicMap/scenicList', // 景区地图绑定景区列表
  'scenicMapPlaceCatList': '/life_tools/merchant.LifeToolsScenicMap/categoryList', // 景区地图标注点绑定分类列表
  'scenicMapPlaceCategoryDel': '/life_tools/merchant.LifeToolsScenicMap/categoryDel', // 景区地图标注点绑定分类删除
  'scenicMapPlaceCategorySave': '/life_tools/merchant.LifeToolsScenicMap/saveCategory', // 景区地图标注点绑定分类新建/修改
  'scenicMapList': '/life_tools/merchant.LifeToolsScenicMap/mapList', // 景区地图列表
  'scenicMapDel': '/life_tools/merchant.LifeToolsScenicMap/mapDel', // 景区地图删除
  'scenicMapStatusSave': '/life_tools/merchant.LifeToolsScenicMap/saveMapStatus', // 景区地图状态修改

  /******************** 景区地图 end**************************/

  /******************** 景区暂停/开启状态修改 start**************************/
  'changeCloseStatus':'life_tools/merchant.LifeTools/changeCloseStatus',
  /******************** 景区暂停/开启状态修改 end**************************/

  'getAddEditCardMerchantInfo': '/life_tools/merchant.LifeTools/getAddEditCardMerchantInfo', // 添加编辑次卡时获取商家信息

}
export default lifeToolsMerchantApi