/**
 *******************
 *   商家后台抖音探店
 *   @author 徐达
 *   @date 2022-03-21
 *   @description 商家后台相关的抖音探店
 *******************
 */
 const System = {
    'ActivityList': () => import('@/views/douyin/merchant/ActivityList'), // 列表
    'ActivityAdd': () => import('@/views/douyin/merchant/ActivityAdd'), // 添加数据
    'MaterialLibrary': () => import('@/views/douyin/merchant/MaterialLibrary'), // 视频素材库
  }
  export default System