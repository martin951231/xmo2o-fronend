/**
 *******************
 *   @author 万紫阳
 *   @date 2020-08-18
 *   @description 信息相关组件
 *******************
 */
const pagePropertyComunityComponents = {
    // 你需要动态引入的页面组件 物业购买套餐页面
    'propertyPackages': () => import('@/views/community/property/package/PackagesBuy'),
    // 你需要动态引入的页面组件 物业购买房屋套餐页面
    'propertyPackagesRoomBuy': () => import('@/views/community/property/package/PackagesRoomBuy'),
    // 你需要动态引入的页面组件 物业购买房屋套餐页面
    'propertyPackagesRoomOrderBuy': () => import('@/views/community/property/package/PackagesRoomOrderBuy'),
    // 你需要动态引入的页面组件 物业单独购买房屋套餐页面
    'propertyPackagesRoomSingleBuy': () => import('@/views/community/property/package/PackagesRoomSingleBuy'),
    // 你需要动态引入的页面组件 物业单独购买房屋套餐订单页面
    'propertyPackagesRoomSingleBuyOrder': () => import('@/views/community/property/package/PackagesRoomSingleBuyOrder'),
    // 你需要动态引入的页面组件 物业购买功能套餐列表页
    'propertyPackageBuyList': () => import('@/views/community/property/package/PackageBuyList'),
    // 你需要动态引入的页面组件 物业购买房间套餐列表页
    'propertyPackageRoomBuyList': () => import('@/views/community/property/package/PackageRoomBuyList'),
    // 登录后判断需要跳转续费或者更换套餐的页面
    // 你需要动态引入的页面组件 登录跳转物业购买套餐页面
    'propertyLoginPackages': () => import('@/views/community/property/package/LoginPackagesBuy'),
    // 你需要动态引入的页面组件 登录跳转物业购买房屋套餐页面
    'propertyLoginPackagesRoomBuy': () => import('@/views/community/property/package/LoginPackagesRoomBuy'),
    // 你需要动态引入的页面组件 登录跳转物业购买房屋套餐页面
    'propertyCommunityData': () => import('@/views/community/property/communityData/CommunityData'),
    // 企业微信功能相关
    'propertyCodeIndex':()=>import('@/views/community/village/workWx/channelCode/codeIndex'),
    'propertyAddCode':()=>import('@/views/community/village/workWx/channelCode/addCode'),
    'propertyEngineIndex':()=>import('@/views/community/village/workWx/contentEngine/engineIndex'),
    'propertyChatSidebar':()=>import('@/views/community/village/workWx/contentEngine/chatSidebar'),
    'propertyMessageList':()=>import('@/views/community/village/workWx/sendMessage/messageList'),
    'propertyAddQywxMessage':()=>import('@/views/community/village/workWx/sendMessage/addQywxMessage'),
    'propertyDataCenter':()=>import('@/views/community/village/workWx/dataCenter/dataCenter'),
    'propertySessionFileIndex':()=>import('@/views/community/village/workWx/sessionFile/sessionFileIndex'),
    'propertySessionFileSet':()=>import('@/views/community/village/workWx/sessionFile/sessionFileSet'),//会话存档配置


    //新版收费管理生效时间设置
    'chargeTimeSet':()=>import('@/views/community/property/charge/enableTimeSet/chargeTimeSet'),//新版收费管理生效时间设置
    'chargeNumberList':()=>import('@/views/community/property/charge/chargeNumber/chargeNumberList'),//科目列表
    'editChargeNumber':()=>import('@/views/community/property/charge/chargeNumber/editChargeNumber'), //编辑收费科目
    'offlinePayList':()=>import('@/views/community/property/charge/offlinePay/offlinePayList'),//线下支付方式列表
    'editOfflinePay':()=>import('@/views/community/property/charge/offlinePay/editOfflinePay'), //编辑线下支付方式
    'countFeeList':()=>import('@/views/community/property/charge/countFeeList'), //小区费用统计
    'villageMonthlyBill':()=>import('@/views/community/property/charge/village_monthly_bill'), //小区账单报表
    'villageRoomFeeRate':()=>import('@/views/community/property/charge/villageRoomFeeRate'), //费用费率特殊定制的
    //物业数据管理中心
    'warrantyDetails': ()=>import('@/views/community/property/center/warrantyDetails/index'), //质保明细

    'propertyRemindIndex':()=>import('@/views/community/village/workWx/violation/remind/remindIndex'), //违规提醒
    'propertyMonitorIndex':()=>import('@/views/community/village/workWx/violation/monitor/monitorIndex'), //违规监控

    //物业组织架构
    'frameworkList': () => import('@/views/community/property/framework/frameworkList'),// 物业组织架构

    //物业权限管理
    'powerList': () => import('@/views/community/property/power/powerList'),// 物业权限管理
    'propertyConfigSet': () => import('@/views/community/property/setting/BasicSet'),// 物业基本信息设置
    'propertyPassword': () => import('@/views/community/property/setting/Password'),// 物业基本信息 -- 修改密码
    
    //安全中心 
    'propertyLoginLog' : ()=> import('@/views/community/property/security/loginLog'),//物业登录账号
    'propertyCommonLog' : ()=> import('@/views/community/property/security/commonLog'),//物业登录账号
    'propertyWorker': () => import('@/views/community/property/framework/propertyWorker'),// 物业组织架构
    'orderTicketNumber':()=>import('@/views/community/property/charge/orderTicketNumber'), //小区费用统计

}
export default pagePropertyComunityComponents
  