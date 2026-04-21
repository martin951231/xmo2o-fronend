const configDeviceApi = {
  // ------------------------鎸囩汗閿?-----------------------
  getFingerprintDeviceList: '/community/village_api.DeviceFingerprint/getFingerprintDeviceList', // 鍙栨寚绾瑰櫒淇℃伅鍒楄〃 鏀寔鏉′欢鎼滅储
  getFingerprintBrandList: '/community/village_api.DeviceFingerprint/getFingerprintBrandList', // 鑾峰彇鎸囩汗閿佽澶囩浉鍏宠澶囧搧鐗?
  getFingerprintBrandSeriesList: '/community/village_api.DeviceFingerprint/getFingerprintBrandSeriesList', // 鑾峰彇鎸囩汗閿佽澶囩浉鍏宠澶囧搧鐗岀殑绯诲垪
  addFingerprintDevice: '/community/village_api.DeviceFingerprint/addFingerprintDevice', // 娣诲姞鎸囩汗璁惧
  getFingerprintDeviceDetail: '/community/village_api.DeviceFingerprint/getFingerprintDeviceDetail', // 鎸囩汗璁惧璇︽儏
  fingerprintDeviceDeleteDevice: '/community/village_api.DeviceFingerprint/deleteDevice', // 鎸囩汗璁惧鍒犻櫎
  fingerprintGetHouseUserlog: '/community/village_api.DeviceFingerprint/getHouseUserlog', // 鑾峰彇鎸囩汗閿佸紑闂ㄨ褰?
  fingerprintGetPersonFingerprintDetail: '/community/village_api.DeviceFingerprint/getPersonFingerprintDetail', // 鑾峰彇鐢ㄦ埛鎸囩汗淇℃伅
  // ------------------------浜戦棬绂?-----------------------
  accessDeviceIndex: '/community/device.HouseAccessDevice/device_index', // 闂ㄧ璁惧鍒楄〃
  accessDeviceAdd: '/community/device.HouseAccessDevice/device_add', // 娣诲姞闂ㄧ璁惧
  accessDeviceEdit: '/community/device.HouseAccessDevice/device_edit', // 缂栬緫闂ㄧ璁惧
  accessDeviceDelete: '/community/device.HouseAccessDevice/device_del', // 鍒犻櫎闂ㄧ璁惧
  accessSensorsIndex: '/community/device.HouseAccessSensors/sensors_list', // 闂ㄧ鎰熷簲鍣ㄥ垪琛?
  accessSensorsAdd: '/community/device.HouseAccessSensors/sensors_add', // 娣诲姞闂ㄧ鎰熷簲鍣?
  accessSensorsEdit: '/community/device.HouseAccessSensors/sensors_edit', // 缂栬緫闂ㄧ鎰熷簲鍣?
  accessSensorsDelete: '/community/device.HouseAccessSensors/sensors_del', // 鍒犻櫎闂ㄧ鎰熷簲鍣?
  accessRecordsIndex: '/community/device.HouseAccessRecords/records_index', // 闂ㄧ鍑哄叆璁板綍鍒楄〃
  accessRecordsAdd: '/community/device.HouseAccessRecords/records_add', // 娣诲姞闂ㄧ鍑哄叆璁板綍
  accessRecordsEdit: '/community/device.HouseAccessRecords/records_edit', // 缂栬緫闂ㄧ鍑哄叆璁板綍
  accessRecordsDelete: '/community/device.HouseAccessRecords/records_del', // 鍒犻櫎闂ㄧ鍑哄叆璁板綍
  nonMotorizedVehicleIndex: '/community/device.HouseNonMotorizedVehicle/non_motorized_vehicle_index', // 闈炴満鍔ㄨ溅绠＄悊鍒楄〃
  nonMotorizedVehicleAdd: '/community/device.HouseNonMotorizedVehicle/non_motorized_vehicle_add', // 娣诲姞闈炴満鍔ㄨ溅鏄犲皠
  nonMotorizedVehicleEdit: '/community/device.HouseNonMotorizedVehicle/non_motorized_vehicle_edit', // 缂栬緫闈炴満鍔ㄨ溅鏄犲皠
  nonMotorizedVehicleDelete: '/community/device.HouseNonMotorizedVehicle/non_motorized_vehicle_del', // 鍒犻櫎闈炴満鍔ㄨ溅鏄犲皠
  nonMotorizedVehicleSensorOptions: '/community/device.HouseNonMotorizedVehicle/non_motorized_vehicle_sensor_options', // 闈炴満鍔ㄨ溅-杞︾墝涓嬫媺
  nonMotorizedVehicleUserOptions: '/community/device.HouseNonMotorizedVehicle/non_motorized_vehicle_user_options' // 闈炴満鍔ㄨ溅-鐢ㄦ埛涓嬫媺
}

export default configDeviceApi
