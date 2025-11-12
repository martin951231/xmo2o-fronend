/**
 *******************
 *   @description 语音机器人组件
 *******************
 */
const hotWordManageComponents = {
  // 你需要动态引入的页面组件
  'hotWordList': () => import('@/views/common/platform/hotWordManage/wordList'),
  'materialCategoryList': () => import('@/views/common/platform/hotWordManage/materialCategoryList'),
}
export default hotWordManageComponents
