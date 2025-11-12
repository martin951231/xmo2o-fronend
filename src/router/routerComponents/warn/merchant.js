/**
 *******************
 *   商家后台消息提醒
 *******************
 */
 const MerchantWarnComponents = {
    'WarnUser': () => import('@/views/warn/merchant/WarnUser'), // 列表
    'MerchantWarnConfig': () => import('@/views/warn/merchant/Config'), // 消息提醒基础设置
    // 消息列表
    "MsgList":() => import('@/views/warn/merchant/MsgList')
  }
  export default MerchantWarnComponents