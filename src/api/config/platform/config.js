/**
 *******************
 *   @author chenxiang
 *   @date 2020-05-20
 *   @description 系统配置信息接口地址
 *******************
 */
const  configPlatformApi = {
  config : '/common/platform.system.config/index', //获取系统配置信息
  amendConfig : '/common/platform.system.config/amend', //提交系统配置信息
  uploadConfig : '/common/platform.system.config/upload',//图片上传
  configData : '/common/platform.system.configData/index', //获取配置信息
  configDataAmend : '/common/platform.system.configData/amend', //提交系统配置信息
}

export default configPlatformApi
