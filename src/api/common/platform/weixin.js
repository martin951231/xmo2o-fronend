/**
 *******************
 *   @author hengtingmei
 *   @date 2020-10-26
 *   @description 系统后台微信相关接口
 *******************
 */
const  weixinPlatformApi = {
  getWxappTemplateList : '/common/platform.weixin.WxappTemplate/getWxappTemplateList', //获得微信小程序订阅消息模板列表
  editWxappTemplate : '/common/platform.weixin.WxappTemplate/editWxappTemplate', //修改微信小程序订阅消息模板
  addTemplate : '/common/platform.weixin.WxappTemplate/addTemplate', //获取模板id
}

export default weixinPlatformApi
