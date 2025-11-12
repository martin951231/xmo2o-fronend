/**
 * 新版商家后台用户端相关配置
 */
const MerchantClientComponents = {
    // 用户端下单后是否支持修改地址配置
    'MerchantClientEditAddressConfig': () => import('@/views/merchant/client/EditAddressConfig'),
}
export default MerchantClientComponents