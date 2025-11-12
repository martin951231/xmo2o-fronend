const deviceApi = {
    // 设备接口
    getDeviceHikCloudCommunitiesList : '/community/platform.Community6000C/getDeviceHikCloudCommunitiesList' ,// 社区列表
    deleteSystemCommunities          : '/community/platform.Community6000C/deleteSystemCommunities' ,// 删除获取的社区
    unBindHouseToSystemCommunity     : '/community/platform.Community6000C/unBindHouseToSystemCommunity' ,// 解绑社区和小区绑定
    getSystemCommunities             : '/community/platform.Community6000C/getSystemCommunities' ,// 获取设备云平台相关信息
    getCommunity                     : '/community/platform.Community6000C/getCommunity' ,// 获取设备云平台相关信息
    getVillageList                   : '/community/platform.Community6000C/getVillageList' ,// 获取小区列表
    bindHouseToSystemCommunity       : '/community/platform.Community6000C/bindHouseToSystemCommunity' ,// 绑定社区和小区
  }
  export default deviceApi