/**
 *******************
 *   系统后台
 *   @author hengtingmei
 *   @date 2022-01-05
 *   @description 金融产品
 *******************
 */
 const bankingPlatformComponents = {
  // 基本设置
  'bankingPlatformSeting': () => import('@/views/banking/platform/Seting'),
  // 金融产品管理
  'bankingPlatformBankingList': () => import('@/views/banking/platform/BankingList'),
  // 金融产品订单
  'bankingPlatformApplyList': () => import('@/views/banking/platform/ApplyList'),
  // 普惠金融知识
  'bankingPlatformInformationList': () => import('@/views/banking/platform/InformationList'),
  // 新建贷款
  'bankingPlatformBankingLoansEdit': () => import('@/views/banking/platform/BankingLoansEdit'),
  // 新建信用卡
  'bankingPlatformBankingCreditCardEdit': () => import('@/views/banking/platform/BankingCreditCardEdit'),
  // 新建E支付
  'bankingPlatformBankingEcardEdit': () => import('@/views/banking/platform/BankingEcardEdit'),
  // 新建存款
  'bankingPlatformBankingDepositEdit': () => import('@/views/banking/platform/BankingDepositEdit'),
}
export default bankingPlatformComponents