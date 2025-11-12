const userPlatformApi = {
  config: '/common/platform.index/config', // 全局配置接口（平台标题，logo, copyright等

  login: '/common/platform.user.login/index', // 登录

  userInfo: '/common/platform.user.AdminUser/userInfo', // 获取用户信息

  menuList: '/common/platform.systemMenu/menuList', // 获取菜单

  wxLogin: '/common/platform.user.login/getAdminQrcode', // 微信扫码登录

  wxLoginResult: '/common/platform.user.login/scanLogin', // 轮询请求微信扫码登录结果

  loginCaptcha: '/v20/public/index.php/common/common.Index/captcha' // 轮询请求微信扫码登录结果
}

export default userPlatformApi