const houseCityApi = {
        getCityRegionInfo: '/community/platform.HouseCityRegionManage/getCityRegionInfo' ,// 获取登录者信息
        saveCityRegionInfo: '/community/platform.HouseCityRegionManage/saveCityRegionInfo' ,//保存设置信息
        // 街道社区可视化大数据
        getIndex: '/community/platform.HouseCityRegionManage/getIndex', //首页接口 （页面一加载就要调用该接口）
        getAreaStreetWorkersOrder: '/community/platform.HouseCityRegionManage/getAreaStreetWorkersOrder', //中部广告滚动条（点击选项卡切换就需要调用该接口，更新数据）
        getPartyBuilding: '/community/platform.HouseCityRegionManage/getPartyBuilding', //【社区党建页面】【党组织架构统计+三会一课+党内咨询+热点新闻】接口
        getStreetPartyActivity: '/community/platform.HouseCityRegionManage/getPartyActivity', //【社区党建页面】【党建活动】接口
        getEventAnaly: '/community/platform.HouseCityRegionManage/getEventAnaly' ,//【事件分析】【事件上报+社区关怀+社区物业统计+视频监控一+视频监控二】接口
        getPopulationAnaly: '/community/platform.HouseCityRegionManage/getPopulationAnaly', //【人口分析 接口待定】【人口信息+男比例统计+年龄段统计+居民人口性质统计+教育水平统计+婚姻状况统计】接口 
        getPartyMemberStatistics: '/community/platform.HouseCityRegionManage/getPartyMemberStatistics', //【社区党建页面 接口待定】党员数量统计接口 
        getEpidemicPrevent: '/community/platform.HouseCityRegionManage/getEpidemicPrevent' ,//【事件分析】疫情防控数据统计接口 
        
        //街道社区可视化大数据  模块接口提取
        getPartyOrgStatistics:'/community/platform.HouseCityRegionManage/getPartyOrgStatistics', //党组织架构统计
        getPartyMeetingStatistics:'/community/platform.HouseCityRegionManage/getPartyMeetingStatistics', //三会一课统计
        getPartySeekStatistics:'/community/platform.HouseCityRegionManage/getPartySeekStatistics', //党内咨询
        getPartyNewsStatistics:'/community/platform.HouseCityRegionManage/getPartyNewsStatistics', //热点新闻
        getPopulationPersonStatistics:'/community/platform.HouseCityRegionManage/getPopulationPersonStatistics', //人口信息
        getPopulationSexStatistics:'/community/platform.HouseCityRegionManage/getPopulationSexStatistics', //男女比例统计
        getPopulationAgeStatistics:'/community/platform.HouseCityRegionManage/getPopulationAgeStatistics', //年龄段统计
        getPopulationUserLabelStatistics:'/community/platform.HouseCityRegionManage/getPopulationUserLabelStatistics', //居民人口性质统计
        getPopulationEducateStatistics:'/community/platform.HouseCityRegionManage/getPopulationEducateStatistics', //教育水平统计
        getPopulationMarriageStatistics:'/community/platform.HouseCityRegionManage/getPopulationMarriageStatistics', //婚姻状况统计
        getEventReportStatistics:'/community/platform.HouseCityRegionManage/getEventReportStatistics', //事件上报
        getEventCareStatistics:'/community/platform.HouseCityRegionManage/getEventCareStatistics', //社区关怀
        getEventVirtualStatistics:'/community/platform.HouseCityRegionManage/getEventVirtualStatistics', //社区物业统计
        getEventVideo1Statistics:'/community/platform.HouseCityRegionManage/getEventVideo1Statistics', //视频监控一
        getEventVideo2Statistics:'/community/platform.HouseCityRegionManage/getEventVideo2Statistics', //视频监控二
        getPartyBranchPosition: '/community/platform.HouseCityRegionManage/getPartyBranchPosition', //获取地图上党支部数据
        getPopulationNationStatistics:'/community/platform.HouseCityRegionManage/getPopulationNationStatistics', //名族统计
        getNextCityRegions:'/community/platform.HouseCityRegionManage/getNextCityRegions', //获取下一级数据
  }
  export default houseCityApi