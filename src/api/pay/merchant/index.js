const payMerchantApi = {
  getPayTypes: '/pay/merchant.pay/getPayTypes', // 获取所有在线支付方式
  getPayTypeInfo: '/pay/merchant.pay/getPayTypeInfo',//获取支付方式详情
  getChannels: '/pay/merchant.pay/getChannels',//获取支付通道
  getChannelInfo: '/pay/merchant.pay/getChannelInfo',//获取支付通道表单详情
  setChannelParams: '/pay/merchant.pay/setChannelParams',//设置配置参数
}
  
  export default payMerchantApi