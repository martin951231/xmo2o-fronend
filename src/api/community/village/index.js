const configVillageApi = {
    engineMenuList: '/community/village_api.ContentEngine/engineMenuList', //内容引擎的左侧导航
    subEngineGroup: '/community/village_api.ContentEngine/subEngineGroup', //添加分组
    getGroupInfo: '/community/village_api.ContentEngine/getGroupInfo', //获取分组详情
    delGroup: '/community/village_api.ContentEngine/delGroup', //删除分组
    getContentList: '/community/village_api.ContentEngine/getContentList', //获取内容列表
    getContentInfo: '/community/village_api.ContentEngine/getContentInfo', //获取内容详情
    getMenuSelect: '/community/village_api.ContentEngine/getMenuSelect', //分组
    subContent: '/community/village_api.ContentEngine/subContent', //提交内容
    delContent: '/community/village_api.ContentEngine/delContent', //删除内容
    uploadFile: '/community/village_api.ContentEngine/uploadFile', //上传图片
    uploadFiles: '/community/village_api.ContentEngine/uploadFiles', //上传文件
    uploadVideo: '/community/village_api.ContentEngine/uploadVideo', //上传视频
    functionLibraryData: '/community/village_api.ContentEngine/functionLibrary', //功能库
    childLibrary: '/community/village_api.ContentEngine/childLibrary', //子集功能库
    getChannelCodeList: '/community/village_api.ContentEngine/getChannelCodeList', //渠道码
    delChannelCode: '/community/village_api.ContentEngine/delChannelCode', //删除渠道码
    uploadFileTxt: '/community/village_api.ContentEngine/uploadFileTxt', //侧边栏上传文件
    butSet: '/community/village_api.ContentEngine/butSet', //侧边栏
    setColumn: '/community/village_api.ContentEngine/setColumn', //侧边栏
    uploadExcel: '/community/village_api.ContentEngine/uploadExcel', //上传
    importExcel: '/community/village_api.ContentEngine/importExcel', //导入
    downloadExcel: '/community/village_api.ContentEngine/downloadExcel', //下载
    addAgent: '/community/village_api.ContentEngine/addAgent', //添加或编辑应用
    getAgentList: '/community/village_api.ContentEngine/getAgentList', //获取应用列表
    // channelCode 渠道活码
    channelMenuList: '/community/village_api.ChannelCode/channelMenuList', //渠道活码的左侧导航
    subCodeGroup: '/community/village_api.ChannelCode/subCodeGroup', //渠道活码的添加编辑分组
    getCodeGroupInfo: '/community/village_api.ChannelCode/getGroupInfo', //渠道活码的获取分组详情
    delCodeGroup: '/community/village_api.ChannelCode/delGroup', //渠道活码的删除分组
    channelCodeList: '/community/village_api.ChannelCode/channelCodeList', //渠道活码列表获取
    addCodeInfo: '/community/village_api.ChannelCode/addCodeInfo', //渠道活码添加信息获取
    getLabelData: '/community/village_api.ChannelCode/getLabelData', //渠道活码单独获取标签信息
    getWorkList: '/community/village_api.ChannelCode/getWorkList', //渠道活码获取工作人员列表
    addCode: '/community/village_api.ChannelCode/addCode', //渠道活码添加编辑
    delCode: '/community/village_api.ChannelCode/delCode', //渠道活码删除
    batchDelCode: '/community/village_api.ChannelCode/batchDelCode', //渠道活码批量删除
    uploadCode: '/community/village_api.ChannelCode/uploadCode', //渠道活码批量下载
    //==========sendMessage=========
    getSendMessageList: '/community/village_api.SendQywxMessage/getSendMessageList', //群发消息列表
    delSendMessage: '/community/village_api.SendQywxMessage/delSendMessage', //删除群发消息
    getQywxLabelList: '/community/village_api.SendQywxMessage/getQywxLabelList', //标签组列表
    getTissueNav: '/community/village_api.SendQywxMessage/getTissueNav', //标签组列表
    getLabelGroupInfo: '/community/village_api.SendQywxMessage/getLabelGroupInfo', //标签组信息
    addLabelGroup: '/community/village_api.SendQywxMessage/addLabelGroup', //添加标签组
    addLabel: '/community/village_api.SendQywxMessage/addLabel', //添加标签
    getMessageContent: '/community/village_api.SendQywxMessage/getMessageContent', //群发消息内容
    getWorker: '/community/village_api.SendQywxMessage/getWorker', //工作人员信息
    getQywxContactUser: '/community/village_api.SendQywxMessage/getQywxContactUser', //用户列表
    addQywxMessage: '/community/village_api.SendQywxMessage/addQywxMessage', //添加群发消息
    getMessageRecord: '/community/village_api.SendQywxMessage/getMessageRecord', //用户群发记录
    getStaffConfirm: '/community/village_api.SendQywxMessage/getStaffConfirm',
    DataCenterIndex: '/community/village_api.DataCenter/index',
    DataCenterTongji: '/community/village_api.DataCenter/tongji',
    //--------会话存档------
    getConversationSet: '/community/village_api.SessionFiles/getConversationSet', //获取配置
    conversationSet: '/community/village_api.SessionFiles/conversationSet', //设置配置
    getMemberList: '/community/village_api.SessionFiles/getMemberList', //获取工作人员列表
    getChatMember: '/community/village_api.SessionFiles/getChatMember', //获取聊天人员（群）列表
    getChatMsg: '/community/village_api.SessionFiles/getChatMsg', //获取对应的消息列表
    getChatGroupInfo: '/community/village_api.SessionFiles/getChatGroupInfo', //获取获取群成员

    //------------------违规监控--------------
    getMonitorList: '/community/village_api.ViolationMonitor/monitorList', //获取监控列表
    groupChatList: '/community/village_api.ViolationMonitor/groupChatList', //查询群聊信息
    getSensitiveList: '/community/village_api.ViolationMonitor/sensitiveList', //获取敏感词列表
    delSensitive: '/community/village_api.ViolationMonitor/delSensitive', //删除敏感词
    editSensitiveStatus: '/community/village_api.ViolationMonitor/editSensitiveStatus', //修改敏感词状态
    addSensitive: '/community/village_api.ViolationMonitor/addSensitive', //修改敏感词状态

    //------------------违规提醒--------------
    //员工违规
    getViolationRemindList: '/community/village_api.ViolationRemind/getViolationRemindList', //获取违规员工
    choiceSensitive: '/community/village_api.ViolationRemind/choiceSensitive', //获取敏感词
    addViolationStaff: '/community/village_api.ViolationRemind/addViolationStaff', //添加违规员工
    editViolationStaff: '/community/village_api.ViolationRemind/editViolationStaff', //编辑违规员工
    subViolationStaff: '/community/village_api.ViolationRemind/subViolationStaff', //提交编辑违规员工
    delViolationStaff: '/community/village_api.ViolationRemind/delViolationStaff', //删除违规员工
    //群聊违规
    getGroupAction: '/community/village_api.ViolationRemind/getGroupAction', //获取群聊行为
    addViolationGroup: '/community/village_api.ViolationRemind/addViolationGroup', //添加群聊配置
    editViolationGroup: '/community/village_api.ViolationRemind/editViolationGroup', //编辑违规员工
    delViolationGroup: '/community/village_api.ViolationRemind/delViolationGroup', //删除群聊配置
    subViolationGroup: '/community/village_api.ViolationRemind/subViolationGroup', //提交编辑群聊配置

    // 小区驾驶舱
    getHomeStatistic: '/community/village_api.Aockpit/getHomeStatistic', //首页接口统计
    getNewsCategory: '/community/village_api.Aockpit/getNewsCategory', //新闻公告分类
    getNewsLists: '/community/village_api.Aockpit/getNewsLists', //新闻列表
    getNewsDetail: '/community/village_api.Aockpit/getNewsDetail', //新闻详情

    getServiceCategory: '/community/village_api.Aockpit/getServiceCategory', //社区服务分类

    getFacilitiesData: '/community/village_api.Aockpit/getFacilitiesData', //智能设施
    getFacilitiesData1: '/community/village_api.Aockpit/getFacilitiesData1', //智能设施
    getMonitorDevice: '/community/village_api.Aockpit/getMonitorDevice', //天使之眼

    getPopulationStatistic: '/community/village_api.Aockpit/getPopulationStatistic', // 小区人口信息
    getWeather: '/community/village_api.Aockpit/getWeather', // 小区人口信息
    getBuildingInfo: '/community/village_api.Aockpit/getBuildingInfo', //点击楼栋部分信息接口
    getBuildingData: '/community/village_api.Aockpit/getBuildingData', //楼栋详细信息接口
    getVacancyData: '/community/village_api.Aockpit/getVacancyData', //楼栋下房间接口
    getVillgePayOrder: '/community/village_api.Aockpit/getVillgePayOrder', //缴费信息
    getVillgeRepair: '/community/village_api.Aockpit/getVillgeRepair', //工单信息

    getVillageArea: '/community/village_api.Aockpit/getVillageArea', //查询小区底图
    getSingleList: '/community/village_api.Aockpit/getSingleList', //查询楼栋列表
    addVillgeArea: '/community/village_api.Aockpit/addVillgeArea', //查询楼栋列表
    getVillgeAreaList: '/community/village_api.Aockpit/getVillgeAreaList', //查询楼栋区域列表
    getNotice: '/community/village_api.Aockpit/getNotice', //公告
    editVillgeArea: '/community/village_api.Aockpit/editVillgeArea', //公告
    //------------------工单管理--------------
    //工单类目
    getSubjectList: '/community/village_api.RepairCate/getSubjectList', //获取类目列表
    getSubjectInfo: '/community/village_api.RepairCate/getSubjectInfo', //获取类目详情
    addSubject: '/community/village_api.RepairCate/addSubject', //添加类目
    editSubject: '/community/village_api.RepairCate/editSubject', //编辑类目

    getCategoryList: '/community/village_api.RepairCate/getCategoryList', //获取类别列表
    getCategoryInfo: '/community/village_api.RepairCate/getCategoryInfo', //获取类别详情
    addCategory: '/community/village_api.RepairCate/addCategory', //添加类别
    editCategory: '/community/village_api.RepairCate/editCategory', //编辑类别
    delCategory: '/community/village_api.RepairCate/delCategory', //删除类别

    getCateList: '/community/village_api.RepairCate/getCateList', //获取分类列表
    getCateInfo: '/community/village_api.RepairCate/getCateInfo', //获取分类详情
    addCate: '/community/village_api.RepairCate/addCate', //添加分类
    editCate: '/community/village_api.RepairCate/editCate', //编辑分类
    delCate: '/community/village_api.RepairCate/delCate', //删除分类
    deleteHouseNewRepairCate: '/community/village_api.RepairCate/deleteHouseNewRepairCate', //删除分类会删除对应子分类

    getCateCustomList: '/community/village_api.RepairCate/getCateCustomList', //获取自定义字段列表
    getCateCustomInfo: '/community/village_api.RepairCate/getCateCustomInfo', //获取自定义字段详情
    addCateCustom: '/community/village_api.RepairCate/addCateCustom', //添加自定义字段
    delCateCustom: '/community/village_api.RepairCate/delCateCustom', //删除自定义字段

    getDirectortree: '/community/village_api.RepairCate/getDirectortree', //获取物业的组织架构

    getScheduling: '/community/village_api.RepairCate/getScheduling', //查询指定日期的负责人列表
    getDirectorList: '/community/village_api.RepairCate/getDirectorList', //获取负责人排班列表
    getDirectorLists: '/community/village_api.RepairCate/getDirectorLists', //根据id获取负责人排班列表
    getDirectorInfo: '/community/village_api.RepairCate/getDirectorInfo', //获取负责人排班详情
    addDirector: '/community/village_api.RepairCate/addDirector', //添加负责人排班
    editDirector: '/community/village_api.RepairCate/editDirector', //编辑负责人排班

    //======================工单处理中心================================
    getTongji: '/community/village_api.RepairCenter/getTongji', //今日上报/回复/处理工单
    getPropertyRating: '/community/village_api.RepairCenter/getPropertyRating', //物业评分
    orderTongji: '/community/village_api.RepairCenter/orderTongji', //物业工单统计
    RepairGetOrderList: '/community/village_api.RepairCenter/getOrderList', //物业工单列表
    updateWorkOrder: '/community/village_api.RepairCenter/updateWorkOrder', //工单处理中心回复
    getSubject: '/community/village_api.RepairCenter/getSubject', //物业工单类目列表
    getWorkOrderDetail: '/community/village_api.User.RepairApi/getWorkOrderDetail', //物业工单详情
    repairGetOrderLog: '/community/village_api.User.RepairApi/repairGetOrderLog', //获取工单操作记录
    getCate: '/community/village_api.RepairCenter/getCate', //物业工单类别列表
    getFidCate: '/community/village_api.RepairCenter/getFidCate', //物业工单分类

    //------------------场馆--------------
    venueActivityList: '/community/village_api.venue/activityList', //场馆活动列表
    venueActivityOpen: '/community/village_api.venue/activityOpen', //场馆活动删除
    venueActivityClose: '/community/village_api.venue/activityClose', //场馆活动删除
    venueActivityDel: '/community/village_api.venue/activityDel', //场馆活动删除
    venueClassifyData: '/community/village_api.venue/classifyData', //场馆活动分类
    venueActivityAdd: '/community/village_api.venue/activityAdd', //场馆活动添加
    venueActivityEdit: '/community/village_api.venue/activityEdit', //场馆活动编辑
    venueActivitySub: '/community/village_api.venue/activityEditSub', //场馆活动编辑提交
    venueClassifyList: '/community/village_api.venue/classifyList', //场馆活动分类列表
    venueClassifyAdd: '/community/village_api.venue/classifyAdd', //场馆活动分类添加
    venueClassifyEdit: '/community/village_api.venue/classifyEdit', //场馆活动编辑
    venueClassifySub: '/community/village_api.venue/classifySub', //场馆活动分类提交
    venueClassifyDel: '/community/village_api.venue/classifyDel', //场馆活动分类提交
    venueRecordList: '/community/village_api.venue/recordList', //场馆活动记录列表
    venueRecordEdit: '/community/village_api.venue/recordEdit', //场馆活动记录列表
    venueRecordSub: '/community/village_api.venue/recordSub', //场馆活动记录列表
    venueActivityGetSet: '/community/village_api.venue/activityGetSet', //场馆活动开启审核
    venueActivitySubSet: '/community/village_api.venue/activitySubSet', //场馆活动开启审核
    venueActivityLocation: '/community/village_api.venue/activityLocation', //场馆活动开启审核
    venueActivityUpload: '/community/village_api.venue/upload', //场馆活动上传图片

    //------------------工单管理--------------
    //-----工单优化
    newRepairCateAdd: '/community/village_api.RepairCate/newRepairCateAdd', //一级分类添加
    newRepairCateEdit: '/community/village_api.RepairCate/newRepairCateEdit', //一级分类编辑
    newRepairIsTimely: '/community/village_api.RepairCate/checkIsTimely', //是否开启新版工单及时率
    getBindVillageRepairCate: '/community/village_api.RepairCate/getBindVillageRepairCate', //获取供暖站分类

    //======================工单处理中心================================
    RepairOrderList: '/community/village_api.RepairCenter/getOrderList', //物业工单列表
    getRepairOrderEvaluateList: '/community/village_api.RepairCenter/getRepairOrderEvaluateList', //物业工单列表
    excelExportRepairWorksOrder: '/community/village_api.RepairCenter/excelExportRepairWorksOrder', //物业工单列表
    //----------------收费项目列表-----------------------
    ChargeProjectList: '/community/village_api.Charge/ChargeProjectList', //收费项目列表
    getHouseTissueNav: '/community/village_api.Cashier/getHouseTissueNav', //收银台房产树结构数据
    getCarTissueNav: '/community/village_api.Cashier/getCarTissueNav', //收银台车场树结构数据
    getDetailTree: '/community/village_api.Cashier/getDetailTree', //收银台房产树结构数据
    getSingleListByVillage: '/community/common.BasicResources/getSingleListByVillage', //收银台楼栋接口
    getFloorList: '/community/common.BasicResources/getFloorList', //收银台单元接口
    getLayerList: '/community/common.BasicResources/getLayerList', //收银台楼层接口
    getLayerSingleList: '/community/common.BasicResources/getLayerSingleList', //收银台楼层接口
    getVacancyList: '/community/common.BasicResources/getVacancyList', //收银台房间接口
    getOrderList: '/community/village_api.Cashier/getOrderList', //收银台未交列表
    getCharges: '/community/village_api.Cashier/getCharges', //收银台收费项列表
    getPayOrderInfo: '/community/village_api.Cashier/getPayOrderInfo', //收银台订单详情
    getPayOrderList: '/community/village_api.Cashier/getPayOrderList', //收银台欠费项目对应的订单列表
    discardOrder: '/community/village_api.Cashier/discardOrder', //收银台作废账单
    getOrderStatisticsByYears: '/community/village_api.Cashier/getOrderStatisticsByYears', //获取应收明细年月应收金额统计
    modifyMoney: '/community/village_api.Cashier/modifyMoney', //收银台修改账单金额
    getChargeSubject: '/community/village_api.Charge/getChargeSubject', //科目数据
    ChargeProjectAdd: '/community/village_api.Charge/ChargeProjectAdd', //添加数据
    ChargeProjectEdit: '/community/village_api.Charge/ChargeProjectEdit', //编辑数据
    ChargeProjectSub: '/community/village_api.Charge/ChargeProjectSub', //提交数据
    deleteProjectId: '/community/village_api.Charge/delChargeProject', //删除收费项目（没有收费标准的可以直接删除)
    getChargeProject: '/community/village_api.Charge/getChargeProject', // 获取科目下的收费项目列表

    //-----------------收银台----------------------------------
    CancelOrderList: '/community/village_api.cashier/cancelOrderList', //作废订单
    onlineOrderList: '/community/village_api.cashier/onlineOrderList', //线上支付订单
    refundOrderList: '/community/village_api.cashier/refundOrderList', //退款账单
    exportRefundOrderList: '/community/village_api.cashier/exportRefundOrders', //导出退款账单
    payableOrderList: '/community/village_api.cashier/payableOrderList', //已缴账单
    historicalArrears: '/community/village_api.cashier/historicalArrears', //历史缴费账单
    payOrderInfo: '/community/village_api.cashier/payOrderInfo', //账单详情
    refundList: '/community/village_api.cashier/refundList', //退款纪录
    addRefundInfo: '/community/village_api.cashier/addRefundInfo', //退款纪录
    verifyCheckauthApply: '/community/village_api.cashier/verifyCheckauthApply', //审核退款
    getCheckauthDetail: '/community/village_api.cashier/getCheckauthDetail', //审核退款明细
    getRefundtype: '/community/village_api.cashier/getRefundtype', //查询退款模式
    printPayOrderList: '/community/village_api.cashier/printPayOrderList', //导出账单列表
    printOnlineOrderList: '/community/village_api.cashier/printOnlineOrderList', //导出线上支付账单列表
    printReceivableOrder: '/community/village_api.cashier/printReceivableOrder', //导出应收账单列表
    receivableOrderImport: '/community/village_api.cashier/receivableOrderImport', //导出应收账单明细
    getTemplate: '/community/village_api.cashier/getTemplate', //查询打印模板列表
    getPrintInfo: '/community/village_api.cashier/getPrintInfo', //查询打印信息
    getPrintCustomConfigureList: '/community/village_api.PrintTemplate/getPrintCustomConfigureList', //获取新版打印模板配置区选择字段列表
    addPrintTemplateCustom: '/community/village_api.PrintTemplate/addPrintTemplateCustom', //保存新版打印模板配置
    manualCall: '/community/village_api.cashier/manualCall', //手动生成账单
    delChargeStandardBind: '/community/village_api.cashier/delChargeStandardBind', //移除收费项
    ChargeProjectLists: '/community/village_api.cashier/ChargeProjectList', //收费项列表
    ChargeRuleLists: '/community/village_api.cashier/ChargeRuleList', //收费项目对应的标准列表
    ruleInfo: '/community/village_api.cashier/ruleInfo', //消费标准信息
    bindRule: '/community/village_api.cashier/bindRule', //添加收费项
    getMoney: '/community/village_api.cashier/getMoney', //获取应收金额和合计金额
    getPrepaid: '/community/village_api.cashier/getPrepaid', //获取收费标准预缴周期列表
    getPrepaidDetail: '/community/village_api.cashier/getPrepaidDetail', //获取预缴账单详情
    getProjectServiceTime: '/community/village_api.cashier/getProjectServiceTime', //获取项目的服务时间
    prepaidCall: '/community/village_api.cashier/prepaidCall', //生成预缴账单
    goPay: '/community/village_api.cashier/goPay', //生成支付账单
    queryScanPay: '/community/village_api.cashier/queryScanPay', //查询订单支付状态
    afterPay: '/community/village_api.cashier/afterPay', //扫码枪支付回调
    receivableOrderList: '/community/village_api.cashier/receivableOrderList', //生成支付账单
    receivableOrderInfo: '/community/village_api.cashier/receivableOrderInfo', //应收账单明细
    getNewPayOrders: '/community/village_api.cashier/getNewPayOrders', //生成支付账单
    sendMessage: '/community/village_api.cashier/sendMessage', //发送缴费通知
    getCarConfig: '/community/village_api.Cashier/getCarConfig', //获取添加车辆的相关参数
    getCarDetail: '/community/village_api.Cashier/getCarDetail', //获取车辆信息
    addCar: '/community/village_api.Cashier/addCar', //添加车辆
    getParkCarDetail: '/community/village_api.Parking/getCarDetail', //获取车辆信息
    addParkCar: '/community/village_api.Parking/addCar', //添加车辆
    delPosition: '/community/village_api.Parking/delPosition', //删除车位
    getOfflineList: '/community/village_api.FrontCashier/getOfflineList', //线下支付方式
    payTypeList: '/community/village_api.cashier/payTypeList', //查询车库列表
    getCashierOrderListSearch: '/community/village_api.cashier/getCashierOrderListSearch', // 模糊搜索 输入部分以后有选择提示
    checkSetPrint: '/community/village_api.cashier/checkSetPrint', //校验是否设置打印模板
    editSetPrint: '/community/village_api.cashier/editSetPrint', //设置打印模板
    clearCache: '/community/village_api.cashier/clearCache', //清空缓存

    //----------------收费规则列表------------------------------
    ChargeRuleList: '/community/village_api.Charge/ChargeRuleList', //收费项目列表
    ProjectInfo: '/community/village_api.Charge/getProjectInfo', //收费项目列表
    checkChargeRule: '/community/village_api.Charge/checkChargeRule', //返收费标准参数
    ChargeRuleBillParam: '/community/village_api.Charge/ChargeRuleBillParam', //返回账单类型数据
    ChargeRuleAdd: '/community/village_api.Charge/ChargeRuleAdd', //添加收费标准
    ChargeProjectIcon: '/community/village_api.Charge/ChargeProjectIcon', //返回收费科目图标
    ChargeRuleEdit: '/community/village_api.Charge/ChargeRuleEdit', //添加收费标准
    ChargeRuleSub: '/community/village_api.Charge/ChargeRuleSub', //提交数据
    ChargeRuleDel: '/community/village_api.Charge/ChargeRuleDel', //删除数据
    checkTakeEffectTime: '/community/village_api.Charge/checkTakeEffectTime',

    //----------------预缴周期列表-------------------------------
    ChargePrepaidList: '/community/village_api.Charge/ChargePrepaidList', //预缴周期列表
    getPrepaidCycle: '/community/village_api.Charge/getPrepaidCycle', //获取预缴周期参数
    ChargePrepaidAdd: '/community/village_api.Charge/ChargePrepaidAdd', //添加预缴周期参数
    ChargePrepaidEdit: '/community/village_api.Charge/ChargePrepaidEdit', //编辑数据
    ChargePrepaidSub: '/community/village_api.Charge/ChargePrepaidSub', //提交数据
    ChargePrepaidDel: '/community/village_api.Charge/ChargePrepaidDel', //删除数据

    //----------------收费设置-------------------------------
    editChargeSet: '/community/village_api.Charge/editChargeSet', //编辑收费设置
    chargeSetInfo: '/community/village_api.Charge/chargeSetInfo', //查询新版收费设置

    //----------------收费标准绑定-------------------------------
    standardBindList: '/community/village_api.Charge/standardBindList', //获取绑定列表
    addStandardBind: '/community/village_api.Charge/addStandardBind', //添加绑定
    delStandardBind: '/community/village_api.Charge/delStandardBind', //解除绑定
    garageList: '/community/village_api.Charge/getGarageList', //查询车库列表
    abbBindList: '/community/village_api.Charge/abbBindList', //查询添加绑定列表
    getRuleInfo: '/community/village_api.Charge/getRuleInfo', //查询收费标准详情

    //----------------抄表管理-------------------------------
    getMeterProject: '/community/village_api.HouseMeter/getMeterProject', //抄表列表
    getMeterDirectorList: '/community/village_api.HouseMeter/getMeterDirectorList', //负责人列表
    addMeterDirector: '/community/village_api.HouseMeter/addMeterDirector', //添加负责人
    saveMeterDirector: '/community/village_api.HouseMeter/saveMeterDirector', //修改负责人
    delMeterDirector: '/community/village_api.HouseMeter/delMeterDirector', //删除负责人
    getWorkers: '/community/village_api.HouseMeter/getWorkers', //工作人员列表
    getWorkerInfo: '/community/village_api.HouseMeter/getWorkerInfo', //负责人详情
    getMeterReadingRecord: '/community/village_api.HouseMeter/getMeterReadingRecord', //抄表记录
    meterReadingAdd: '/community/village_api.HouseMeter/meterReadingAdd', //抄表录入
    printRecordList: '/community/village_api.HouseMeter/printRecordList', //导出抄表记录
    getLastMeter: '/community/village_api.HouseMeter/getLastMeter', //获取上一次抄表止度
    getVillagePropertyId: '/community/village_api.AdminMenu/getVillagePropertyId', //
    uploadMeterFiles: '/community/village_api.HouseMeter/uploadFiles', //导入抄表
    exportMeter: '/community/village_api.HouseMeter/exportMeter', //导入抄表
    getIsBind: '/community/village_api.HouseMeter/getIsBind', //判断房间是否绑定项目
    setMeterReadingDay: '/community/village_api.HouseMeter/setMeterReadingDay', //设置每月抄表时间
    getOneMeterReading: '/community/village_api.HouseMeter/getOneMeterReading', //获取一条抄表记录
    meterReadingEdit: '/community/village_api.HouseMeter/meterReadingEdit', //抄表录入
    getMeterReadingMdylog: '/community/village_api.HouseMeter/getMeterReadingMdylog', //抄表录入
    addMdyMeterReadingOrder: '/community/village_api.HouseMeter/addMdyMeterReadingOrder', //抄表录入
    getAddMeterDemo: '/community/village_api.HouseMeter/getAddMeterDemo', //获取抄表导入模板
    //----------------业主预存-------------------------------
    storageUserList: '/community/village_api.Storage/getUserList', //业主列表
    storageUserBalance: '/community/village_api.Storage/getUserBalance', //获取业主余额
    storageUserBalanceChange: '/community/village_api.Storage/userBalanceChange', //业主余额变更
    storageUserBalanceRecord: '/community/village_api.Storage/getUserBalanceRecord', //业主余额记录
    storageUserOrderRecord: '/community/village_api.Storage/getUserOrderRecord', //业主消费记录
    storageUserSendMessage: '/community/village_api.Storage/sendMessage', //一键催缴

    //---------------------用户标签管理---------------------------
    getUserLabelList: '/community/village_api.ChatSidebar/getHouseVillageLabel', //用户标签列表
    changeUserLabel: '/community/village_api.ChatSidebar/changeUserLabel', //编辑用户标签
    getLabelType: '/community/village_api.ChatSidebar/getLabelType', //获取用户标签类型
    getUserLabelInfo: '/community/village_api.ChatSidebar/getUserLabelInfo', //获取用户标签详情

    // ---------------------业主详情---------------------------
    getCommunityUserInfo: '/community/village_api.ChatSidebar/getCommunityUserInfo', // 获取业主企微相关信息
    getUserInfo: '/community/village_api.ChatSidebar/getUserInfo', // 获取业主资料信息
    editUserInfo: '/community/village_api.ChatSidebar/editUserInfo', // 获取业主资料信息
    getLivingPaymentLog: '/community/village_api.ChatSidebar/getLivingPaymentLog', // 获取缴费记录
    getActionTrail: '/community/village_api.ChatSidebar/getActionTrail', // 获取轨迹记录
    getProvinceCity: '/community/village_api.ChatSidebar/getProvinceCity', // 获取省市
    getWorkOrderList: '/community/village_api.ChatSidebar/getWorkOrderList', // 业主工单
    getWorkOrderInfo: '/community/village_api.ChatSidebar/getWorkOrderInfo', // 业主工单详情
    getDecorationOrderList: '/community/village_api.ChatSidebar/getDecorationOrderList', // 业主装修申请单
    getWriteFileList: '/community/village_api.ChatSidebar/getWriteFileList', // 业主装修申请单 附件列表
    delWriteFileList: '/community/village_api.ChatSidebar/delWriteFileList', // 业主装修申请单 删除附件
    addWriteFile: '/community/village_api.ChatSidebar/addWriteFile', // 业主装修申请单 上传附件
    getRemarkList: '/community/village_api.ChatSidebar/getRemarkList', // 业主装修申请单 备注列表
    addRemark: '/community/village_api.ChatSidebar/addRemark', // 业主装修申请单 新增备注
    delRemark: '/community/village_api.ChatSidebar/delRemark', // 业主装修申请单 删除备注
    getExpressList: '/community/village_api.ChatSidebar/getExpressList', // 业主快递管理
    getExpressInfo: '/community/village_api.ChatSidebar/getExpressInfo', // 业主快递管理 代收快递详情
    delExpress: '/community/village_api.ChatSidebar/delExpress', // 业主快递管理 删除代收快递
    getChatLeftList: '/community/village_api.ChatSidebar/getChatLeftList', // 获取聊天记录左侧员工或群聊列表
    chatSessionlog: '/community/village_api.ChatSidebar/chatSessionlog', // 获取聊天记录列表

    //----------------小区交易汇总-------------------------------
    feeSummaryList: '/community/village_api.TransactionSummary/houseSummaryList', //物业费汇总
    getChargeTypeList: '/community/village_api.TransactionSummary/getChargeTypeList', //物业费统计
    getChargeProjectByTypeList: '/community/village_api.TransactionSummary/getChargeProjectList', //物业费统计
    getSummaryByRuleList: '/community/village_api.TransactionSummary/getSummaryByRuleList', //物业费统计
    //----------------工作人员-------------------------------
    getWorkerList: '/community/village_api.HouseWorker/getWorkerList', //工作人员
    getRecognition: '/community/village_api.HouseWorker/getRecognition', //  工作人员
    disableWorkerAccount: '/community/village_api.HouseWorker/disableWorkerAccount', //  工作人员
    cancelWorkerAccount: '/community/village_api.HouseWorker/cancelWorkerAccount', //  工作人员
    getWorkerOrderList: '/community/village_api.HouseWorker/getWorkerOrderList', //  工作人员
    getRepairInfo: '/community/village_api.HouseWorker/getRepairInfo', //  工作人员
    saveWorkerEdit: '/community/village_api.HouseWorker/saveWorkerEdit', //  工作人员
    getRolePermissionMenus: '/community/village_api.HouseWorker/getRolePermissionMenus', //  工作人员
    getAdminRoleList: '/community/village_api.HouseWorker/getRoleList', //  工作人员
    saveHouseAdminEdit: '/community/village_api.HouseWorker/saveHouseAdminEdit', //  工作人员
    getHouseAdminGroupList: '/community/village_api.HouseWorker/getGroupList', //  工作人员
    getGroupPermissionMenus: '/community/village_api.HouseWorker/getGroupPermissionMenus', //  工作人员
    saveHouseGroupEdit: '/community/village_api.HouseWorker/saveHouseGroupEdit', //  工作人员
    deleteHouseGroup: '/community/village_api.HouseWorker/delHouseGroup', //  工作人员
    getPropertyvillage: '/community/property_api.Power/getPropertyVillages', //  工作人员
    savePropertyEdit: '/community/property_api.Power/savePropertyEdit', //  工作人员
    getPropertyRolePermission: '/community/property_api.Power/getPropertyRolePermission', //  工作人员
    getPropertyVillageRolePermission: '/community/property_api.Power/getPropertyVillageRolePermission', //  工作人员
    getProvinceCityAreas: '/community/property_api.Power/getProvinceCityAreas', //  工作人员
    getOrganizationTree: '/community/village_api.HouseWorker/getOrganizationTree', //  工作人员
    synAdminToWorker: '/community/village_api.HouseWorker/synAdminToWorker', //  工作人员
    checkWorker0629: '/community/village_api.HouseWorker/checkWorker', //  校验工作人员是否绑定微信
    getAllWorkerList: '/community/village_api.HouseWorker/getAllWorkerList', //工作人员
    getCurrentLoginInfo: '/community/village_api.HouseWorker/getCurrentLoginInfo', //  工作人员
    changeHouseWorkerPwd: '/community/village_api.HouseWorker/changeHouseWorkerPwd', //  工作人员
    // 岗亭相关
    // WatchBox: '/community/village_api.Hardware/index',
    //硬件运维大数据
    hardwareIndex: '/community/village_api.Hardware/index', //首页接口
    getFaceDeviceStatistics: '/community/village_api.Hardware/getFaceDeviceStatistics', //门禁设备状态
    getPileEquipmentStatistics: '/community/village_api.Hardware/getPileEquipmentStatistics', //小区充电桩消费统计
    getOpenDoorStatistics: '/community/village_api.Hardware/getOpenDoorStatistics', //开门方式统计接口
    getOpenDoorLog: '/community/village_api.Hardware/getOpenDoorLog', //人脸门禁实时记录
    getWarningLog: '/community/village_api.Hardware/getWarningLog', //报警信息
    getDeviceParam: '/community/village_api.Hardware/getDeviceParam', //设备搜索参数
    getFaceDeviceList: '/community/village_api.Hardware/getFaceDeviceList', //门禁设备列表
    getPileEquipmentList: '/community/village_api.Hardware/getPileEquipmentList', //门禁设备列表
    // 朵普对讲平台
    getCloudIntercomConfig: '/community/village_api.CloudIntercom/getCloudIntercomConfig', // 朵普对讲平台配置接口
    saveCloudIntercomConfig: '/community/village_api.CloudIntercom/saveCloudIntercomConfig', // 保存朵普对讲平台配置接口
    getFaceDataList: '/community/village_api.CloudIntercom/getFaceDataList', // 朵普对讲平台推送的人脸数据列表
    getThirdUserInfo: '/community/village_api.CloudIntercom/getThirdUserInfo', // 获取朵普对讲平台推送的人脸数据详情
    editThirdUserInfo: '/community/village_api.CloudIntercom/editThirdUserInfo', // 编辑朵普对讲平台推送的人脸数据详情
    getDeviceDataList: '/community/village_api.CloudIntercom/getDeviceDataList', // 获取朵普对讲平台推送的设备数据列表
    getVillageSinglePublic: '/community/village_api.CloudIntercom/getVillageSinglePublic', // 获取公共区域和楼栋列表列表
    editDeviceInfo: '/community/village_api.CloudIntercom/editDeviceInfo', // 保存设备信息
    sendThirdUserToDevice: '/community/village_api.CloudIntercom/sendThirdUserToDevice', // 下发人员到设备
    getNmvChargeList: '/community/village_api.CloudIntercom/getNmvChargeList', // 获取收费规则列表
    editNmvChargeInfo: '/community/village_api.CloudIntercom/editNmvChargeInfo', // 编辑收费规则
    getNmvChargeOrderList: '/community/village_api.CloudIntercom/getNmvChargeOrderList', // 获取缴费记录
    getNmvCardList: '/community/village_api.CloudIntercom/getNmvCardList', // 获取非机动车卡号列表
    sendNmvMessage: '/community/village_api.CloudIntercom/sendNmvMessage', // 发送公众号模板消息

    addCoordinate: '/community/village_api.Aockpit/addCoordinate', //添加定位坐标
    addDeviceCoordinate: '/community/village_api.Aockpit/addDeviceCoordinate', //绑定设备
    getAngeleyeImg: '/community/village_api.Aockpit/getAngeleyeImg', //天使之眼设备底图
    delCoordinate: '/community/village_api.Aockpit/delCoordinate', //删除坐标
    editCoordinate: '/community/village_api.Aockpit/editCoordinate', //编辑定位坐标

    getFacilitiesDetails: '/community/village_api.Aockpit/getFacilitiesDetails', //获取设备点位信息

    getMonitorSpot: '/community/village_api.Aockpit/getMonitorSpot', //天使之眼点位接口

    getDeviceList: '/community/village_api.Aockpit/getDeviceList', //查询设备列表
    getFinshOrder: '/community/village_api.RepairCenter/getFinshOrder', //工单结案率统计接口
    visitorTmpParking: '/community/village_api.Parking/getVisitorTmpParkingList', //临时停车记录

    templateList: '/community/village_api.PrintTemplate/getPrintTemplateList', // 打印模板列表
    getTemplateDetail: '/community/village_api.PrintTemplate/getTemplateDetail', // 打印模板详情
    templateAdd: '/community/village_api.PrintTemplate/templateAdd', // 新增打印模板
    delTemplate: '/community/village_api.PrintTemplate/delTemplate', // 删除打印模板
    printRecordUrl: '/community/village_api.PrintTemplate/printRecordUrl', // 打印模板后，更改开票状态接口

    getOffLineDevList: '/community/village_api.Hardware/getOffLineDevList', // 设备预警列表
    getNoticeWorkers: '/community/village_api.Hardware/getNoticeWorkers', //工作人员列表
    saveNoticeWorkers: '/community/village_api.Hardware/saveNoticeWorkers', //工作人员列表
    houseProgrammeList: '/community/village_api.HouseProgramme/getProgrammeList', //方案组列表
    houseProgrammeGroupAll: '/community/village_api.HouseProgramme/getGroupAll', //获取分组数据
    houseProgrammeProgrammeQuery: '/community/village_api.HouseProgramme/programmeQuery', //获取方案数据
    houseProgrammeTissueNav: '/community/village_api.HouseProgramme/getTissueNav', //获取部门数据
    houseProgrammeProgrammeAdd: '/community/village_api.HouseProgramme/programmeAdd', //添加方案组
    houseProgrammeProgrammeSub: '/community/village_api.HouseProgramme/programmeSub', //编辑方案组
    houseProgrammeProgrammeDel: '/community/village_api.HouseProgramme/programmeDel', //删除方案组

    powerLabelAll: '/community/village_api.HouseWorker/getPowerLabelAll', //  权限管理=》获取权限标签数据
    powerLabel: '/community/village_api.HouseWorker/getPowerLabel', //  权限管理=》获取权限标签

    setRepairCharge: '/community/village_api.RepairCate/setRepairCharge', //配置类别的收费设置
    getRepairCharge: '/community/village_api.RepairCate/getRepairCharge', //查询类别的收费设置
    getVillageRepairConfig: '/community/village_api.RepairCate/getVillageRepairConfig', // 获取工单设置数据
    saveVillageRepairConfig: '/community/village_api.RepairCate/saveVillageRepairConfig', // 保存工单设置数据

    getHousePosition: '/community/village_api.RepairCate/getHousePosition', //获取位置
    getHousePositionChidren: '/community/village_api.RepairCate/getHousePositionChidren', //获取子集

    getSubjectOrders: '/community/village_api.RepairCate/getSubject', //工单类目
    getRepairCate: '/community/village_api.RepairCate/getRepairCate', //工单分类

    getLabel: '/community/manage_api.v1.RepairOrders/getLabel', //标签
    repairOrderAdd: '/community/village_api.RepairCate/repairOrderAdd', //提交工单
    getWorkOrderEvaluateList: '/community/village_api.RepairCenter/getWorkOrderEvaluateList', //提交工单
    newRepairTissueNav: '/community/village_api.RepairCate/getTissueNav', //新版工单 获取部门数据

    // 新版智慧停车改版
    addParkingGarage: '/community/village_api.Parking/addParkingGarage', //添加车库信息
    editParkingGarage: '/community/village_api.Parking/editParkingGarage', //编辑车库信息
    getGarageList: '/community/village_api.Parking/getGarageList', //下拉框查询车库列表信息
    getParkGarageList: '/community/village_api.Parking/getParkGarageList', //查询车库信息列表
    getParkGarageInfo: '/community/village_api.Parking/getParkGarageInfo', //查询车库信息

    addParkPosition: '/community/village_api.Parking/addParkPosition', //添加车位信息
    editParkPosition: '/community/village_api.Parking/editParkPosition', //编辑车位信息
    getPositionInfo: '/community/village_api.Parking/getPositionInfo', //查询车位信息
    getPositionList: '/community/village_api.Parking/getPositionList', //查询车位信息列表

    getAddCarInfo: '/community/village_api.Parking/getAddCarInfo', //添加车辆页面的信息查询

    editCar: '/community/village_api.Parking/editCar', //编辑车辆信息
    getCarInfo: '/community/village_api.Parking/getCarInfo', //查询车辆信息

    getCarlist: '/community/village_api.Parking/getCarlist', //查询车辆信息列表

    addPassage: '/community/village_api.Parking/addPassage', //添加车道信息
    editPassage: '/community/village_api.Parking/editPassage', //编辑车道信息
    getPassageInfo: '/community/village_api.Parking/getPassageInfo', //查询车道信息
    getPassageList: '/community/village_api.Parking/getPassageList', //查询车道列表
    delPassage: '/community/village_api.Parking/delPassage', //删除车道信息
    getQrcodePassage: '/community/village_api.Parking/getQrcodePassage', //获取通道二维码

    getParkDeviceSetting: '/community/village_api.Parking/getParkDeviceSetting', //查询车道设备配置项

    addLabelCat: '/community/village_api.Parking/addLabelCat', //添加标签分类信息
    editLabelCat: '/community/village_api.Parking/editLabelCat', //编辑标签分类信息

    getLabelCatInfo: '/community/village_api.Parking/getLabelCatInfo', //查询标签分类信息

    getLabelCatList: '/community/village_api.Parking/getLabelCatList', //查询标签分类列表

    getLabelCatsList: '/community/village_api.Parking/getLabelCatsList', //查询标签分类列表

    delLabelCat: '/community/village_api.Parking/delLabelCat', //删除标签分类

    addParkLabel: '/community/village_api.Parking/addLabel', //编辑标签信息
    editLabel: '/community/village_api.Parking/editLabel', //编辑标签信息

    getLabelInfo: '/community/village_api.Parking/getLabelInfo', //查询标签信息
    getLabelList: '/community/village_api.Parking/getLabelList', //查询标签列表

    delLabel: '/community/village_api.Parking/delLabel', //删除标签

    getParkShopList: '/community/village_api.Parking/getParkShopList', //获取店铺列表
    add_park_shop: '/community/village_api.Parking/add_park_shop', //添加店铺信息
    edit_park_shop: '/community/village_api.Parking/edit_park_shop', //编辑店铺信息
    del_park_shop: '/community/village_api.Parking/del_park_shop', //删除店铺
    getParkShopInfo: '/community/village_api.Parking/getParkShopInfo', //获取店铺详情
    shop_search: '/community/village_api.Parking/shop_search', //sousuodianpu

    add_park_coupons: '/community/village_api.Parking/add_park_coupons', //添加优惠券信息
    edit_park_coupons: '/community/village_api.Parking/edit_park_coupons', //编辑优惠券信息
    get_park_coupons_info: '/community/village_api.Parking/get_park_coupons_info', //查询优惠券信息
    getParkCouponsList: '/community/village_api.Parking/getParkCouponsList', //查询优惠券列表
    del_park_coupons: '/community/village_api.Parking/del_park_coupons', //删除优惠券
    getParkingGarageSelectList: '/community/village_api.Parking/getParkingGarageSelectList', //获取停车场列表
    getParkCouponGarage: '/community/village_api.Parking/getParkCouponGarage', //获取停车优惠券归属停车场信息

    add_park_shop_coupons: '/community/village_api.Parking/add_park_shop_coupons', //添加店铺优惠券信息

    addFreeCar: '/community/village_api.Parking/addFreeCar', //添加免费车信息
    editFreeCar: '/community/village_api.Parking/editFreeCar', //编辑免费车信息

    getFreeCarInfo: '/community/village_api.Parking/getFreeCarInfo', //查询免费车信息
    getFreeCar: '/community/village_api.Parking/getFreeCar', //查询免费车列表

    getParkType: '/community/village_api.Parking/getParkType', //查询免费车下拉列表

    addBlackCar: '/community/village_api.Parking/addBlackCar', //添加黑名单信息
    getBlackCarInfo: '/community/village_api.Parking/getBlackCarInfo', //编辑黑名单信息
    getBlackCar: '/community/village_api.Parking/getBlackCar', //查询黑名单列表
    delBlackCar: '/community/village_api.Parking/delBlackCar', //删除黑名单
    editBlackCar: '/community/village_api.Parking/editBlackCar', //编辑
    getParkProvice: '/community/village_api.Parking/getParkProvice', //获取省份列表

    getPayCouponsList: '/community/village_api.Parking/getPayCouponsList', //查询优惠券购买记录列表
    getReceiveCouponsList: '/community/village_api.Parking/getReceiveCouponsList', //查询优惠券领取记录
    getShopCouponsList: '/community/village_api.Parking/getShopCouponsList', //查询店铺优惠券列表

    getPayCouponsList: '/community/village_api.Parking/getPayCouponsList', //查询优惠券购买记录列表
    getReceiveCouponsList: '/community/village_api.Parking/getReceiveCouponsList', //查询优惠券领取记录
    getShopCouponsList: '/community/village_api.Parking/getShopCouponsList', //查询店铺优惠券列表
    sendCouponToCarUse: '/community/village_api.Parking/sendCouponToCarUse', //查询店铺优惠券列表

    getQrcodeCoupons: '/community/village_api.Parking/getQrcodeCoupons', //优惠券二维码
    getQrcodeShop: '/community/village_api.Parking/getQrcodeShop', //店铺二维码
    addParkConfig: '/community/village_api.Parking/addParkConfig', //添加配置星系
    getParkConfigInfo: '/community/village_api.Parking/getParkConfigInfo', //获取配置星系

    getParkConfig: '/community/village_api.Parking/getParkConfig',

    getInParkList: '/community/village_api.Parking/getInParkList', //查询在场车辆记录
    getInParkInfo: '/community/village_api.Parking/getInParkInfo', //查询在场车辆详情
    editInParkInfo: '/community/village_api.Parking/editInParkInfo', //编辑在场车辆信息

    getMonthParkList: '/community/village_api.Parking/getMonthParkList', // 查询月租车进出记录
    getMonthParkInfo: '/community/village_api.Parking/getMonthParkInfo', // 查询月租车进出详情
    getTempParkList: '/community/village_api.Parking/getTempParkList', // 查询月租车进出记录
    getTempParkInfo: '/community/village_api.Parking/getTempParkInfo', // 查询临时车进出详情
    getOpenGateList: '/community/village_api.Parking/getOpenGateList', // 查询手动开闸记录
    getTemporaryParkList: '/community/village_api.Parking/getTemporaryParkList', // 查询储值车出入记录
    getOutParkInfo: '/community/village_api.Parking/getOutParkInfo', // 查询储值车充值记录
    getMonthParkRuleList: '/community/village_api.Charge/getMonthParkRuleList', //约租车收费规则

    delParkPosition: '/community/village_api.Parking/delParkPosition', //删除车位
    delCar: '/community/village_api.Parking/delCar', //删除车两
    delFreeCar: '/community/village_api.Parking/delFreeCar', //删除免费车
    delRecordCar: '/community/village_api.Parking/delRecordCar', //删除车两记录
    getAreaList: '/community/village_api.Parking/getAreaList',
    getChannelList: '/community/village_api.Parking/getD7ChannelList',

    addBindAllPosition: '/community/village_api.Charge/addBindAllPosition', //绑定车库
    getQrcodeSpread: '/community/village_api.Parking/getQrcodeSpread', //产看预付二维码
    getLabelFunction: '/community/village_api.Parking/getLabelFunction', //标签关联功能
    moveLabel: '/community/village_api.Parking/moveLabel', //移动标签

    editOutParkInfo: '/community/village_api.Parking/editOutParkInfo', //编辑不在场车辆标签
    open_gate: '/community/village_api.Parking/open_gate', //手动抬竿接口
    getPositionLists: '/community/village_api.Parking/getPositionLists', //根据车库id获取车位列表
    getPositionBindCarList: '/community/village_api.Parking/getPositionBindCarList', //获取车辆列表
    downPositionModel: '/community/village_api.Parking/downPositionModel',
    downPosition: '/community/village_api.Parking/downPosition',
    getOpenGateInfo: '/community/village_api.Parking/getOpenGateInfo',

    //----------------停车显屏/语音配置-------------------------------  //
    getVoiceSet: '/community/village_api.Parking/getVoiceSet', // 获取语音配置内容
    getScreenSet: '/community/village_api.Parking/getScreenSet', // 获取显屏配置内容
    setVoiceSet: '/community/village_api.Parking/setVoiceSet', // 设置语音配置内容
    setScreenSet: '/community/village_api.Parking/setScreenSet', // 设置显屏配置内容
    getOutParkList: '/community/village_api.Parking/getOutParkList', //不在场车辆
    getElectricParkList: '/community/village_api.Parking/getElectricParkList', //电瓶车
    getParkLabelList: '/community/village_api.Parking/getParkLabelList', //不在场车辆标签
    getTemporaryPayList: '/community/village_api.Parking/getTemporaryPayList', // 充值记录
    getPassageLabelList: '/community/village_api.Parking/getPassageLabelList', //车道标签

    delAllParkPosition: '/community/village_api.Parking/delAllParkPosition', //多项删除
    delParkingGarage: '/community/village_api.Parking/delParkingGarage', //删除车库
    delAllLabel: '/community/village_api.Parking/delAllLabel', //批删标签
    getParkCouponsLists: '/community/village_api.Parking/getParkCouponsLists', //获取优惠券列表
    addCarLabel: '/community/village_api.Parking/addLabel', // 添加停车标签
    getParkUserInfo: '/community/village_api.Parking/getUserInfo', // 获取业主列表
    getParkUser0629: '/community/village_api.Parking/getParkUserInfo', // 获取用户信息
    getA11CarType: '/community/village_api.Parking/getA11CarType', // 获取用户信息
    getChargeCarType: '/community/village_api.Parking/getChargeCarType', // 获取用户信息
    addChargeCarType: '/community/village_api.Parking/addChargeCarType', // 获取用户信息
    delChargeCarType: '/community/village_api.Parking/delChargeCarType', // 获取用户信息
    getCarTypeA11: '/community/village_api.Parking/getCarTypeA11', // 获取用户信息
    addCarTypeA11: '/community/village_api.Parking/addCarTypeA11', // 获取用户信息
    delCarTypeA11: '/community/village_api.Parking/delCarTypeA11', // 获取用户信息
    getPassageTypeList: '/community/village_api.Parking/getPassageTypeList', // 获取用户信息
    checkParkingCarType: '/community/village_api.Parking/checkParkingCarType', // 获取用户信息
    getPositionBindNum: '/community/village_api.Parking/getPositionBindNum', // 获取车位号绑定数量
    //----------------无线AP-------------------------------
    getApDeviceList: '/community/village_api.ApDevice/getDeviceList', //查询无线Ap设备列表
    getDeviceInfo: '/community/village_api.ApDevice/getDeviceInfo', //查询无线Ap设备详情
    editDevice: '/community/village_api.ApDevice/editDevice', //编辑无线Ap设备
    addDevice: '/community/village_api.ApDevice/addDevice', //添加无线Ap设备
    delDevice: '/community/village_api.ApDevice/delDevice', //删除无线Ap设备
    getAddressList: '/community/village_api.ApDevice/getAddressList', //获取位置列表
    getAddDeviceList: '/community/village_api.ApDevice/getAddDeviceList', //添加设备获取设备下拉框列表
    getAockpit: '/community/village_api.Aockpit/getDeviceInfo', //一键同步

    //视频监控
    getThirdProtocol: '/community/village_api.CameraDevice/getThirdProtocol', //设备使用的对接协议
    getCameraList: '/community/village_api.CameraDevice/getCameraList', //视频监控列表
    delCamera: '/community/village_api.CameraDevice/delCamera', //删除视频监控
    getBrandList: '/community/village_api.CameraDevice/getBrandList', //设备品牌
    getDeviceTypeList: '/community/village_api.CameraDevice/getDeviceTypeList', //设备类型
    addCameraDevice: '/community/village_api.CameraDevice/addCameraDevice', //添加视频监控
    getCameraInfo: '/community/village_api.CameraDevice/getCameraInfo', //视频监控详情
    getReplyList: '/community/village_api.CameraDevice/getReplyList', //视频权限申请列表
    videoV2CamerasPreviewURLs: '/community/village_api.CameraDevice/videoV2CamerasPreviewURLs', //获取预览视频地址
    getVmonitorTypeList: '/community/village_api.CameraDevice/getVmonitorTypeList', //获取预览视频地址
    addVmonitorType: '/community/village_api.CameraDevice/addVmonitorType', //获取预览视频地址
    delVmonitorType: '/community/village_api.CameraDevice/delVmonitorType', //获取预览视频地址
    getReplyInfo: '/community/village_api.CameraDevice/getReplyInfo', //视频权限申请信息
    checkReplyInfo: '/community/village_api.CameraDevice/checkReplyInfo', //视频权限审核
    getCameraDeviceType: '/community/village_api.CameraDevice/getCameraType', //获取视频类型
    getCameraDeviceInfo: '/community/village_api.CameraDevice/getDeviceInfo', //获取视频设备的信息
    getCameraLiveAddress: '/community/village_api.CameraDevice/getLiveAddress', //获取监控地址
    getDeviceByCommunityId: '/community/village_api.CameraDevice/getDeviceByCommunityId', //查询社区下的设备列表
    getVideoGatewayList: '/community/village_api.CameraDevice/getVideoGatewayList', //获取海康网关的监控设备允许的协议类型

    // 大华云睿获取楼栋单元信息
    getDHBuidingUnitRoomList: '/community/village_api.DaHua/getDHBuidingUnitRoomList', //获取楼栋单元房屋信息
    setDHBuildingToDeviceCloud: '/community/village_api.DaHua/setDHBuildingToDeviceCloud', //批量新增楼栋单元房屋
    bindDHBuildUnitRoomsList: '/community/village_api.DaHua/bindDHBuildUnitRoomsList', //获取楼栋单元房屋信息
    bindDHBuildUnitRoom: '/community/village_api.DaHua/bindDHBuildUnitRoom', //绑定楼栋单元楼层房屋
    dhDeviceBindAuthList: '/community/village_api.DaHua/deviceBindAuthList', // 设备绑定权限
    deviceVillageWorksAuth: '/community/village_api.DaHua/deviceVillageWorksAuth', //获取对应设备未绑定的小区工作人员
    dhAddDeviceAuth: '/community/village_api.DaHua/addDeviceAuth', // 添加设备权限
    dhDelDeviceAuth: '/community/village_api.DaHua/delDeviceAuth', // 删除设备权限

    //快捷账单
    getQuickRuleInfo: '/community/village_api.cashier/getQuickRuleInfo', //快捷账单查询收费标准信息
    quickCall: '/community/village_api.cashier/quickCall', //添加快捷账单

    // 超级管理员物业小区整合左侧导航栏
    tabList: '/community/common.BasicResources/tabList', //左侧物业小区整合导航栏
    changeVillage: '/community/common.BasicResources/changeVillage', //小区直接切换

    //公租房
    publicRentalApplyList: '/community/village_api.HousePublicRental/getApplyList', //申请入住列表
    publicRentalEnclosureList: '/community/village_api.HousePublicRental/getEnclosureList', //附件列表
    publicRentalEnclosureDel: '/community/village_api.HousePublicRental/enclosureDel', //删除附件
    publicRentalUpload: '/common/common.UploadFile/uploadPublicRental', //上传附件
    publicRentalAddFile: '/community/village_api.HousePublicRental/enclosureAddFile', //写入附件
    publicRentalApplyDel: '/community/village_api.HousePublicRental/applyDel', //删除申请入住
    publicRentalHandleApplyList: '/community/village_api.HousePublicRental/getHandleApplyList', //办理入住列表
    publicRentalGetArrangingSet: '/community/village_api.HousePublicRental/getQueuingRule', //排号规则查询
    publicRentalSubArrangingSet: '/community/village_api.HousePublicRental/addQueuingRule', //排号规则编辑
    publicRentalGetContractStatus: '/community/village_api.HousePublicRental/getContractStatus', //获取生成合同状态
    publicRentalGetContractList: '/community/village_api.HousePublicRental/getContractList', //获取合同列表
    publicRentalChoiceContract: '/community/village_api.HousePublicRental/choiceContract', //选择合同
    publicRentalRentingList: '/community/village_api.HousePublicRental/getRentingList', //办理退租列表
    publicRentalRentingDel: '/community/village_api.HousePublicRental/rentingDel', //删除 申请办理退租

    //------------------------住户余额------------------
    getUserRoomList: '/community/village_api.Storage/getUserRoomList', //查询用户在当前小区的关联房间列表
    getUserPositionList: '/community/village_api.Storage/getUserPositionList', //查询用户在当前小区的关联车位列表
    addAllVillageUserMoney: '/community/village_api.Storage/addAllVillageUserMoney', //批量修改住户余额
    uploadUserMoneyFiles: '/community/village_api.Storage/uploadFiles', //导入抄表
    exportUserMoney: '/community/village_api.Storage/exportMeter', //导入抄表

    saveHotWordData: '/community/village_api.HouseHotWordManage/saveHotWordData', //语音关键词管理
    getHouseHotWordLists: '/community/village_api.HouseHotWordManage/getHotWordList', //语音关键词管理
    setHouseHotWordStatus: '/community/village_api.HouseHotWordManage/setHouseHotWordStatus', //语音关键词管理
    deleteHouseHotWord: '/community/village_api.HouseHotWordManage/deleteHotWord', //语音关键词管理
    getOneHouseHotWord: '/community/village_api.HouseHotWordManage/getOneHouseHotWord', //语音关键词管理
    getHotWordFuncApplication: '/community/village_api.HouseHotWordManage/getFuncApplication', //语音关键词管理
    getHotWordFuncApplicationDetails: '/community/village_api.HouseHotWordManage/getFuncApplicationDetail', //语音关键词管理
    getHotWordAllVillages: '/community/village_api.HouseHotWordManage/getAllVillages', //语音关键词管理
    getAreaStreetCommunity: '/community/village_api.HouseHotWordManage/getAreaStreetCommunity', //语音关键词管理
    copyAvillageKeyword: '/community/village_api.HouseHotWordManage/copyAvillageKeyword', //语音关键词管理
    saveMaterialCategoryData: '/community/village_api.HouseHotWordManage/saveMaterialCategoryData', //语音关素材管理
    getHouseHotWordMaterialCategoryLists: '/community/village_api.HouseHotWordManage/getMaterialCategoryList', //语音关素材管理
    deleteHouseHotWordMaterialCategory: '/community/village_api.HouseHotWordManage/delMaterialCategoryData', //语音关素材管理
    saveHouseHotWordMaterialSetData: '/community/village_api.HouseHotWordManage/saveMaterialSetData', //语音关素材管理
    getHouseHotWordMaterialLists: '/community/village_api.HouseHotWordManage/getMaterialList', //语音关素材管理
    getHotWordMaterialLibrary: '/community/village_api.HouseHotWordManage/getHotWordMaterialLibrary', //语音关素材管理
    getHotWordMaterialLibraryDetails: '/community/village_api.HouseHotWordManage/getHotWordMaterialLibraryDetails', //语音关素材管理
    deleteHouseHotWordMaterialContent: '/community/village_api.HouseHotWordManage/delHouseHotWordMaterialContent', //语音关素材管理
    exportHotWordMaterial: '/community/village_api.HouseHotWordManage/exportHotWordMaterial', //语音关素材管理

    getUnitRentalRooms: '/community/village_api.UnitRentalRoom/index', //公租房列表
    getUnitRentalRoomDetail: '/community/village_api.UnitRentalRoom/getRoomDetail', //公租房列表
    saveUnitRentalRoomEdit: '/community/village_api.UnitRentalRoom/saveRoomEdit', //公租房列表
    deleteUnitRentalRoom: '/community/village_api.UnitRentalRoom/deleteRoom', //公租房列表
    getUserRecordList: '/community/village_api.UnitRentalRoom/getUserRecordList', //公租房列表
    getRoomIcCardList: '/community/village_api.UnitRentalRoom/getRoomIcCardList', //公租房列表
    deleteRoomIcCardUrl: '/community/village_api.UnitRentalRoom/deleteRoomIcCard', //公租房列表

    //------------------------操作日志------------------------
    villageSettingLogApi: '/community/village_api.VillageLog/VillageSettingLog', //操作日志
    villageSettingLogDetailApi: '/community/village_api.VillageLog/VillageSettingLogDetail', //操作日志详细
    villageLoginLogApi: '/community/village_api.VillageLog/VillageLoginLog', //登录日志
    villageLoginLogDetailApi: '/community/village_api.VillageLog/VillageLoginLogDetail', //登录日志详细
    getConfigCustomization: '/community/village_api.Cashier/getConfigCustomization',

    getNmvChargePayInfo: '/community/village_api.CloudIntercom/getNmvChargePayInfo', //电动车缴纳支持后台收费
    nmvPcOfflinePay: '/community/village_api.CloudIntercom/nmvPcOfflinePay', //电动车缴纳支持后台收费

    //------------------------小区新版网格管理------------------------
    HouseGridGetMap:'/community/village_api.HouseGridRange/getHouseMap', //获取地图位置
    HouseGridGetRangeList:'/community/village_api.HouseGridRange/getHouseGridRange', //获取网格集合
    
    standardCreateManyOrderByRuleId:'/community/village_api.Charge/standardCreateManyOrderByRuleId', //标准手动生成账单
    
    saveHouseNewChargePrepaidDiscount:'/community/village_api.Charge/savePrepaidDiscount', //预交抵扣优惠保存
    getPrecisionNum:'/community/village_api.Charge/getPrecisionNum', //获取折扣率小数位数
    getChargePrepaidDiscountList:'/community/village_api.Charge/chargePrepaidDiscountList', //预交抵扣优惠保存
    chargePrepaidDiscountEdit:'/community/village_api.Charge/getchargePrepaidDiscountEdit', //预交抵扣优惠保存
    chargePrepaidDiscountDel:'/community/village_api.Charge/delChargePrepaidDiscount', //预交抵扣优惠保存
    
    getChargeOtherConfigInfo:'/community/village_api.Charge/getChargeOtherConfigInfo',  //获取一些其他必须配置信息
    
    exportHouseVillageFeeTj:'/community/village_api.TransactionSummary/exportHouseVillageFee',
    excelExportBalanceRecord:'/community/village_api.Storage/excelExportBalanceRecord', //住户余额
    exportUserBalanceRecord:'/community/village_api.Storage/exportUserBalanceRecord',//住户余额
    storageLimitBalanceTips:'/community/village_api.Storage/storageLimitBalanceTips',//住户余额
    getCarBindPositionList:'/community/village_api.Parking/getCarBindPositionList',//车
    storageFeePrestoreSet:'/community/village_api.Storage/storageFeePrestoreSet',//住户余额
    getFaceList:'/community/village_api.People.Owner/getFaceList',//人脸列表
    getFaceDeviceSyncList:'/community/village_api.People.Owner/getFaceDeviceSyncList',//人脸设备列表
    getSynLogList:'/community/village_api.People.Owner/getSynLogList',//人脸设备下发日志列表
    bindFaceDevice:'/community/village_api.People.Owner/bindFaceDevice',//绑定设备
    bindFaceDevices:'/community/village_api.People.Owner/bindFaceDevices',//批量绑定默认设备
    syncFace:'/community/village_api.People.Owner/syncFace',//批量同步
    getBindDevice:'/community/village_api.People.Owner/getBindDevice',//获取人脸绑定的设备
    getFaceInfo:'/community/village_api.People.Owner/getFaceInfo',//获取用户人脸

    getOrderTableRuleList:'/community/village_api.TransactionSummary/getOrderTableRuleList',  //财务报表
    getSummaryByRoomAndRuleList:'/community/village_api.TransactionSummary/getSummaryByRoomAndRuleList', //财务报表
    getSummaryByYearAndRuleList:'/community/village_api.TransactionSummary/getSummaryByYearAndRuleList', //财务报表
    excelExportFinancialOutUrl:'/community/village_api.TransactionSummary/excelExportFinancialOut', //财务报表
    getPaidOrderRecordList:'/community/village_api.TransactionSummary/getPaidOrderRecordList', //财务报表
    getOrderBusinessTypeInfo:'/community/village_api.TransactionSummary/getOrderBusinessTypeInfo', //财务报表
    getHouseNewPayOrderList:'/community/village_api.TransactionSummary/getHouseNewPayOrderList', //财务报表
    excelExportPaidOrderRecordOut:'/community/village_api.TransactionSummary/excelExportPaidOrderRecordOut', //财务报表
    getSummaryByProjectList:'/community/village_api.TransactionSummary/getSummaryByProjectList', //财务报表

    getOrderTableProjectList:'/community/village_api.TransactionSummary/getOrderTableProjectList',  //财务报表

    //------------------------停暖管理------------------------
    closeHeatingList: '/community/village_api.Heating/closeHeatingList', //申请停暖列表
    getCloseHeatingProtocol: '/community/village_api.Heating/getCloseHeatingProtocol', //展示停暖协议以及账单提醒设置
    editCloseHeatingProtocol: '/community/village_api.Heating/editCloseHeatingProtocol', //编辑停暖协议
    setOrderNotice: '/community/village_api.Heating/setOrderNotice', //编辑账单提醒设置
    addCloseHeating: '/community/village_api.Heating/addCloseHeating', //新增申请停暖
    getCloseHeatingInfo: '/community/village_api.Heating/getCloseHeatingInfo', //申请停暖记录详情
    auditCloseHeating: '/community/village_api.Heating/auditCloseHeating', //申请停暖记录-审核
    inspectCloseHeating: '/community/village_api.Heating/inspectCloseHeating', //申请停暖记录-检查
    delCloseHeating: '/community/village_api.Heating/delCloseHeating', //申请停暖记录-删除
    flowChargingList: '/community/village_api.Heating/flowChargingList', //申请流量计费列表
    addFlowCharging: '/community/village_api.Heating/addFlowCharging', //新增申请流量计费
    getFlowChargingInfo: '/community/village_api.Heating/getFlowChargingInfo', //查看申请流量计费详情
    auditFlowCharging: '/community/village_api.Heating/auditFlowCharging', //审核流量计费申请
    delFlowCharging: '/community/village_api.Heating/delFlowCharging', //删除流量计费申请
    getFlowChargingProtocol: '/community/village_api.Heating/getFlowChargingProtocol', //查看流量计费申请协议
    editFlowChargingProtocol: '/community/village_api.Heating/editFlowChargingProtocol', //编辑流量计费申请协议
    getFlowChargingRoom: '/community/village_api.Heating/getFlowChargingRoom', //查询是否是流量计费房间
    getRoomInfo: '/community/village_api.Heating/getRoomInfo', //获取房间业主信息

    getVillageCommonConfigCustomization: '/community/common.BasicResources/getVillageConfigCustomization',
    getMeterCustomizedInfo: '/community/village_api.HouseMeter/getMeterCustomizedInfo', //获取抄表定制信息
    hangOrder: '/community/village_api.CashierHangOrder/hangOrder', //挂单操作
    getResetBtnShow: '/community/village_api.CashierHangOrder/getResetBtnShow', //挂单操作
    getCommunityQualitySingleList: '/community/village_api.workorder.CommunityQuality/getSingleList', //获取楼栋
    getSingleCommunityQualityList: '/community/village_api.workorder.CommunityQuality/getSingleCommunityQualityList', //获取楼栋下正常的未绑定的
    handleApartOrderBydate: '/community/village_api.Cashier/handleApartOrderBydate', //拆分订单
    parkingPositionSet: '/community/village_api.Parking/parkingPositionSet', //车位设置
    getRobleasePositionOrderList: '/community/village_api.Parking/getRobleasePositionOrderList', //车位设置
    handlePositionOrderStatus: '/community/village_api.Parking/handlePositionOrderStatus', //车位设置
    getRobleasePositionOrderDetail: '/community/village_api.Parking/getRobleasePositionOrderDetail', //车位设置
    createRoomTmpOrder: '/community/village_api.Cashier/createRoomTmpOrder', //车位设置

    // 访客访问非业主设备权限页面
    getVisitorAuthList: '/community/device.DeviceVisitorAuth/getVisitorAuthList', // 获取访客访问非业主设备权限
    switchChangeOpenAuth: '/community/device.DeviceVisitorAuth/switchChangeOpenAuth', // 更换开关
    getRootAiNoticeWorkers: '/community/village_api.Hardware/getRootAiNoticeWorkers', // 设备预警列表
    saveRootAiNoticeWorkers: '/community/village_api.Hardware/saveRootAiNoticeWorkers', //工作人员列表

    commonGetWorks: '/community/common.Materiel/getWorks',
    commonGetTypeMsgList: '/community/common.Materiel/getTypeMsgList',
    commonMaterielCheckoutsAdd: '/community/common.Materiel/materielCheckoutsAdd',
    
    getAihorseThirdGarageInfo:'/community/village_api.AiParking/getAihorseThirdGarageInfo', //智慧停车服务商系统
    getAihorseGaragePassageList:'/community/village_api.AiParking/getAihorseGaragePassageList', //智慧停车服务商系统
    getCanUseTicketNumberList: '/community/village_api.Cashier/getCanUseTicketNumberList',
    getVillageRoomFeeRateList:'/community/village_api.TransactionSummary/getVillageRoomFeeRateList',//物业费汇总 收费率分析
    getVillageSingleKeepers:'/community/village_api.TransactionSummary/getVillageSingleKeepers',//物业费汇总 收费率分析
    getVillageRoomUnPayRateList:'/community/village_api.TransactionSummary/getVillageRoomUnPayRateList',//物业费汇总 收费率分析
    getOfflinePayTypeList:'/community/village_api.Cashier/getOfflinePayTypeList',  //获取线下支付列表
    getRoomRateSummaryRecordList:'/community/village_api.TransactionSummary/getRoomRateSummaryRecordList',//物业费汇总 收费率分析

}

export default configVillageApi
