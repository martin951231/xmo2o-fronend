/**
 *******************
 *   @author 郑亚莉
 *   @date 2020-05-18
 *   @description 示例
 *******************
 */
const exampleComponents = {
  'BasicForm': () => import('@/views/example/form/BasicForm'),
  'StepForm': () => import('@/views/example/form/stepForm/StepForm'),
  'AdvancedForm': () => import('@/views/example/form/advancedForm/AdvancedForm'),
  'TableList': () => import('@/views/example/list/TableList'),
  'TreeList': () => import('@/views/example/list/TreeList'),
  'TableInnerEditList': () => import('@/views/example/list/TableInnerEditList'),
  'StandardList': () => import('@/views/example/list/StandardList'),
  'CardList': () => import('@/views/example/list/CardList'),
  'Profile': () => import('@/views/example/profile/Index'),
  // 系统
  'MenuList': () => import('@/views/system/menu/MenuList'),
  'RoleList': () => import('@/views/system/role/RoleList'),
  // account
  'AccountCenter': () => import('@/views/example/account/center/Index'),
  'AccountSettings': () => import('@/views/example/account/settings/Index'),
  'BaseSettings': () => import('@/views/example/account/settings/BaseSetting'),
  'SecuritySettings': () => import('@/views/example/account/settings/Security'),
  'CustomSettings': () => import('@/views/example/account/settings/Custom'),
  'BindingSettings': () => import('@/views/example/account/settings/Binding'),
  'NotificationSettings': () => import('@/views/example/account/settings/Notification')
}
export default exampleComponents
