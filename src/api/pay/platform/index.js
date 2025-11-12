const payPlatformApi = {
  getPayTypes: '/pay/platform.pay/getPayTypes', // 获取所有在线支付方式
  getPayTypeInfo: '/pay/platform.pay/getPayTypeInfo',//获取支付方式详情
  getChannels: '/pay/platform.pay/getChannels',//获取支付通道
  getChannelInfo: '/pay/platform.pay/getChannelInfo',//获取支付通道表单详情
  setChannelParams: '/pay/platform.pay/setChannelParams',//设置配置参数
}
  
  export default payPlatformApi