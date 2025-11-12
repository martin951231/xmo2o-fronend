const MerchantApi = {
    seeWxQrcode: '/merchant/merchant.qrcode.index/seeWxQrcode', // 微信渠道二维码
    seeH5Qrcode: '/merchant/merchant.qrcode.index/seeH5Qrcode', //网页二维码
    // 配送员接单前支持修改配送地址配置
    addressSettingConfig: '/merchant/merchant.MerchantShopManagement/addressSetting',
    // 配送员接单前支持修改配送地址配置提交
    addressSettingEdit: '/merchant/merchant.MerchantShopManagement/addressSettingEdit',
    // 商家子账号管理 账号列表
    merAccountList: '/merchant/merchant.system.MerchantMenu/userAccountList',
    // 商家子账号管理 账号删除
    merAccountDel: '/merchant/merchant.system.MerchantMenu/userAccountDelete',
    // 商家子账号管理 账号添加 || 编辑
    merAccountEdit:'/merchant/merchant.system.MerchantMenu/userAccountAddOrEdit',
    // 商家子账号管理 批量添加
    importMerAccount:'/merchant/merchant.system.MerchantMenu/importAccount',
    // 商家子账号管理 权限菜单
    merchantMenu:'/merchant/merchant.system.MerchantMenu/merchantMenu',
    // 商家子账号管理 岗位列表
    merStationsList:'/merchant/merchant.system.MerchantMenu/stations',
    // 商家子账号管理 岗位添加 || 编辑
    merStationsSave: '/merchant/merchant.system.MerchantMenu/saveStation',
    // 商家子账号管理 岗位删除
    merStationsDel:'/merchant/merchant.system.MerchantMenu/delStation'
}
export default MerchantApi
