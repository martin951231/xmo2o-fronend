const userMerchantApi = {
  config: '/merchant/merchant.index/config', // 全局配置接口（平台标题，logo, copyright等

  login: '/merchant/merchant.user.login/index', // 登录

  qrcode: '/merchant/merchant.user.login/seeQrcode', // 获取登录二维码

  userInfo: '/merchant/merchant.user.user/userInfo', // 获取用户信息

  menuList: '/merchant/merchant.system.merchantMenu/menuList', // 获取菜单

  codeLoginResult: '/merchant/merchant.user.login/scanLogin', // 轮询请求微信扫码登录结果

  getSmsCode: '/merchant/merchant.user.register/sendSms', // 发送短信验证码

  getCurrentLocation: '/merchant/merchant.system.area/getLocation', // 默认所在地

  getProvinceData: '/merchant/merchant.system.area/getProvinceList', // 获取所有省份

  getCityeData: '/merchant/merchant.system.area/getCityList', // 获取省内所有城市

  getAreaData: '/merchant/merchant.system.area/getAreaList', // 获取城市所有区域

  getStreetData: '/merchant/merchant.system.area/getStreetList', // 获取城市所有街道

  register: '/merchant/merchant.user.register/index', // 注册

  imgCode: '/v20/public/index.php/merchant/merchant.user.register/verify', // 图片验证码

  regForm: '/merchant/merchant.user.Register/regForm', // 自定义表单
  getNationalData: '/common/common.Address/getAreaCode', // 获取手机号码区号

  getConfig: '/common/platform.index/config', // 全局配置接口（平台标题，logo, copyright等
}

export default userMerchantApi