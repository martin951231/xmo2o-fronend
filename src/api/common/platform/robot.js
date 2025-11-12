/**
 *******************
 *   @author hengtingmei
 *   @date 2020-12-23
 *   @description 系统后台机器人相关接口
 *******************
 */
const  robotPlatformApi = {
  getRobotList : '/common/platform.robot/getRobotList', //获得机器人列表
  getRobotDetail : '/common/platform.robot/getRobotDetail', //机器人详情
  editRobot : '/common/platform.robot/editRobot', //添加编辑机器人
  delRobot : '/common/platform.robot/delRobot', //删除机器人
  getRandName : '/common/platform.robot/getRandName', //获得随机姓名
}

export default robotPlatformApi
