const payPropertyApi = {
  getPayTypes      : '/pay/property.pay/getPayTypes',      // 获取所有在线支付方式
  getPayTypeInfo   : '/pay/property.pay/getPayTypeInfo',   //获取支付方式详情
  getChannels      : '/pay/property.pay/getChannels',      //获取支付通道
  getChannelInfo   : '/pay/property.pay/getChannelInfo',   //获取支付通道表单详情
  setChannelParams : '/pay/property.pay/setChannelParams', //设置配置参数
  getVillageAllinpayConfig: '/pay/property.pay/getVillageAllinpayConfig', // 获取各小区通联支付配置
  setVillageAllinpayConfig: '/pay/property.pay/setVillageAllinpayConfig', // 保存小区通联支付配置
  generateAllinpayPrivateKey: '/pay/property.pay/generateAllinpayPrivateKey', // 生成通联支付RSA私钥
}
export default payPropertyApi
