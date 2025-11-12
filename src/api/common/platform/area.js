/**
 *******************
 *   @author hengtingmei
 *   @date 2020-06-28
 *   @description 系统城市区域接口地址
 *******************
 */
const  areaPlatformApi = {
  getSelectProvince : '/common/platform.area.area/getSelectProvince', //获得城市区域筛选的省份信息
  getSelectCity : '/common/platform.area.area/getSelectCity', //获得城市区域筛选的城市信息
  getSelectArea : '/common/platform.area.area/getSelectArea', //获得城市区域筛选的城市信息
  getSelectPropertyProvince: '/merchant/merchant.system.area/getProvinceList', // 获取省(不需要登陆)
  getSelectPropertyCity: '/merchant/merchant.system.area/getCityList', // 获取市
  getSelectPropertyArea: '/merchant/merchant.system.area/getAreaList', // 获取县
  getSelectStreet: '/common/platform.area.area/getSelectStreet',  // 获取乡镇
  getSelectProvinceAndCity: '/common/platform.area.area/getSelectProvinceAndCity', // 获得省份和城市信息
}

export default areaPlatformApi
