/**
 *******************
 *   @description 物业机器人组件
 *******************
 */
const thirdRobotManageComponents = {
  // 你需要动态引入的页面组件
  'platformThirdRobotList': () => import('@/views/common/platform/thirdRobot/robotList'),
  // 机器人召唤记录
  'platformRobotCallRecordList': () => import('@/views/common/platform/thirdRobot/robotCallRecordList'),
}
export default thirdRobotManageComponents
