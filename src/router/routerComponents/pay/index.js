/**
 * author lumin
 * 支付中心
 */
const payComponents = {
  'PayPlatformConfig': () => import('@/views/pay/platform/Config'),//支付配置页
  'PayPlatformPayTypeIndex': () => import('@/views/pay/platform/PayTypeIndex'),//单个支付方式配置首页
}

export default payComponents