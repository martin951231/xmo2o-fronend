/**
 *******************
 *   @author 万紫阳
 *   @date 2020-05-20
 *   @description 登录、路由、菜单、权限等用户信息接口地址
 *******************
 */

const userCommunityApi = {
  config: '/community/login.login/config', // 登录配置接口

  login: '/community/login.login/check', // 登录

  qyRegister: '/community/login.login/qyRegister', // 注册企业微信（2021/7/29 新增 zbd）

  qyIstall: '/community/login.login/qyIstall', // 安装企业微信（2021/7/29 新增 zbd）

  qyLogin: '/community/login.login/qyLogin', // 企业微信登录（2021/7/29 新增 zbd）

  getResult: '/community/login.login/getResult', // 查询注册/安装企业微信结果（2021/8/3 新增 zbd）

  regCheck: '/community/login.login/regCheck', // 注册 （2020/7/7 新增加 weili）

  userInfo: '/community/login.login/userInfo', // 获取用户信息

  menuList: '/community/street_community.adminMenu/menuList', // 获取菜单

  getPackageList:'/community/login.login/getPackageList',//获取所有功能套餐及对应功能应用列表 （2020/8/15 新增 weili）
}

export default userCommunityApi
