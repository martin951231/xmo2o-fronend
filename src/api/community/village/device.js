const configDeviceApi = {
    //------------------------指纹锁------------------------
    getFingerprintDeviceList              : '/community/village_api.DeviceFingerprint/getFingerprintDeviceList', //取指纹器信息列表 支持条件搜索
    getFingerprintBrandList               : '/community/village_api.DeviceFingerprint/getFingerprintBrandList', //获取指纹锁设备相关设备品牌
    getFingerprintBrandSeriesList         : '/community/village_api.DeviceFingerprint/getFingerprintBrandSeriesList', //获取指纹锁设备相关设备品牌的系列
    addFingerprintDevice                  : '/community/village_api.DeviceFingerprint/addFingerprintDevice', // 添加指纹设备
    getFingerprintDeviceDetail            : '/community/village_api.DeviceFingerprint/getFingerprintDeviceDetail', // 指纹设备详情
    fingerprintDeviceDeleteDevice         : '/community/village_api.DeviceFingerprint/deleteDevice', // 指纹设备删除
    fingerprintGetHouseUserlog            : '/community/village_api.DeviceFingerprint/getHouseUserlog', // 获取指纹锁开门记录
    fingerprintGetPersonFingerprintDetail : '/community/village_api.DeviceFingerprint/getPersonFingerprintDetail', // 获取用户指纹信息
}
export default configDeviceApi