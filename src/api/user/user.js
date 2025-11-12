import { getSystemName} from '@/utils/util'
import userPlatformApi from './platform/index'
import userCommunityApi from './community/index'
import userPropertyApi from './community/property'
import userVillageApi from './community/village'
import userMerchantApi from './merchant/index'
import userMeterApi from './meter/index'
import {PLATFORM_ACCESS_TOKEN, COMMUNITY_ACCESS_TOKEN, PROPERTY_ACCESS_TOKEN,VILLAGE_ACCESS_TOKEN, MERCHANT_ACCESS_TOKEN, METER_ACCESS_TOKEN} from '@/store/mutation-types'
/*
根据系统名称返回不同的获取用户权限接口
system 系统名称 或 接口名 或 路由地址
*/
export function getUserInfo(system) {
    const systemName = getSystemName(system)
    let userInfoApi = null
    switch(systemName){
        case PLATFORM_ACCESS_TOKEN:
            userInfoApi = userPlatformApi.userInfo
            break
        case COMMUNITY_ACCESS_TOKEN:
            userInfoApi = userCommunityApi.userInfo
            break
        case PROPERTY_ACCESS_TOKEN:
            userInfoApi = userPropertyApi.userInfo
            break
        case VILLAGE_ACCESS_TOKEN:
            userInfoApi = userVillageApi.userInfo
            break
        case MERCHANT_ACCESS_TOKEN:
            userInfoApi = userMerchantApi.userInfo
            break
        case METER_ACCESS_TOKEN:
            userInfoApi = userMeterApi.userInfo
            break
        default:
            userInfoApi = userPlatformApi.userInfo
            break
    }
    return userInfoApi
  }

  /*
根据系统名称返回不同的获取用户菜单
system 系统名称 或 接口名 或 路由地址
*/
export function getUserMenu(system) {
    const systemName = getSystemName(system)
    let userMenuApi = null
    switch(systemName){
        case PLATFORM_ACCESS_TOKEN:
            userMenuApi = userPlatformApi.menuList
            break
        case COMMUNITY_ACCESS_TOKEN:
            userMenuApi = userCommunityApi.menuList
            break
        case PROPERTY_ACCESS_TOKEN:
            userMenuApi = userPropertyApi.menuList
            break
        case VILLAGE_ACCESS_TOKEN:
            userMenuApi = userVillageApi.menuList
            break
        case MERCHANT_ACCESS_TOKEN:
            userMenuApi = userMerchantApi.menuList
            break
        case METER_ACCESS_TOKEN:
            userMenuApi = userMeterApi.menuList
            break
        default:
            userMenuApi = userPlatformApi.menuList
            break
    }
    return userMenuApi
  }