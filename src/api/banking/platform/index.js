const bankingPlatformApi = {
  'getBankingList':'/banking/platform.Banking/getList', // 金融产品列表
  'getBankingDetail':'/banking/platform.Banking/getDetail', // 金融产品详情
  'saveBanking':'/banking/platform.Banking/saveBanking', // 金融产品添加编辑
  'getBankingLogList':'/banking/platform.Banking/getLogList', // 金融产品添加编辑日志
  'delBanking':'/banking/platform.Banking/delBanking', // 删除金融产品
  'getApplyList':'/banking/platform.BankingApply/getList', // 获得申请列表
  'changeStatus':'/banking/platform.BankingApply/changeStatus', // 审核申请
  'exportUrl':'/banking/platform.BankingApply/export', // 导出申请
  'getVillageList':'/banking/platform.BankingApply/getVillageList', // 获取小区列表

  'getBankingConfigList':'/banking/platform.Banking/getConfigDataList',
  'editSeting':'/banking/platform.Banking/editSeting',
  'getInformationList':'/banking/platform.Banking/getInformationList',
  'delInformation':'/banking/platform.Banking/delInformation',
  'getInformationData':'/banking/platform.Banking/getInformationData',
  'editOrAddInformation':'/banking/platform.Banking/editOrAddInformation',
}
  
  export default bankingPlatformApi