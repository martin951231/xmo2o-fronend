/**
 *******************
 *   @author 万紫阳
 *   @date 2020-05-20
 *   @description 登录、路由、菜单、权限等用户信息接口地址
 *******************
 */

const common = {
  config: '/community/login.login/config', // 全局配置接口（平台标题，logo, copyright等

  login: '/community/login.login/check', // 登录
  sendCode: '/community/login.PropertyGuide/sendCode', // 登录
  addInformation: '/community/login.PropertyGuide/addInformation', // 登录
  propertyGuide: '/community/login.PropertyGuide/propertyGuide', // 流程引导页内容获取
  completePropertyGuide: '/community/login.PropertyGuide/completePropertyGuide', // 完成-流程引导页
  workerAdd: '/community/common.Framework/workerAdd', //添加人员接口
  workerSub: '/community/common.Framework/workerSub', //添加人员编辑
  workerDel: '/community/common.Framework/workerDel', //添加人员编辑
  workerQuery: '/community/common.Framework/workerQuery' ,//人员查询接口
  organizationDel: '/community/common.Framework/organizationDel' ,//人员信息删除
  organizationAdd: '/community/common.Framework/organizationAdd', //人员信息添加
  organizationSub: '/community/common.Framework/organizationSub' ,//人员信息编辑
  
  organizationSynQw: '/community/common.Framework/organizationSynQw' ,//物业同步信息至企业微信
  getPropertyWorkerList:'/community/common.Framework/getPropertyWorkerList', //员工管理
  addPropertyWorkerToGroup:'/community/common.Framework/addPropertyWorkerToGroup', //员工管理
  synHouseWorkerToProperty:'/community/common.Framework/synHouseWorkerToProperty', //员工管理
}

export default common
