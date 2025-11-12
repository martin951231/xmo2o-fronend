const userStorestaffApi = {

  login: '/storestaff/storestaff.user.login/index', // 登录

  qrcode: '/storestaff/storestaff.user.login/seeQrcode', // 获取登录二维码

  codeLoginResult: '/storestaff/storestaff.user.login/scanLogin', // 轮询请求微信扫码登录结果

  imgCode: '/v20/public/index.php/storestaff/storestaff.user.login/verify', // 图片验证码

  getIndexPageInfo: '/storestaff/storestaff.index/index', //首页信息

  orderNotice: '/storestaff/storestaff.index/orderNotice', //订单轮询
  
  getPrintHas: '/storestaff/storestaff.PrintDevice/getPrintHas', //获得打印机信息
  
  getOwnPrinter: '/storestaff/storestaff.PrintDevice/getOwnPrinter', //获得打印内容
}

export default userStorestaffApi