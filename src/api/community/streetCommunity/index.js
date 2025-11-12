const configStreetCommunityApi = {
  config: '/community/street_community.config/index', // 街道社区基本配置信息获取
  addIndex: '/community/street_community.config/addIndex', // 街道社区更新添加 
  streetUpload: '/community/street_community.config/upload', // 街道社区上传logo
  messageSuggestionsList: '/community/street_community.MessageSuggestionsList/getList', // 留言建议列表获取
  messageSuggestionsDetail: '/community/street_community.MessageSuggestionsList/detail', // 留言建议详情获取
  saveMessageSuggestionsReplyInfo: '/community/street_community.MessageSuggestionsList/saveMessageSuggestionsReplyInfo', // 回复留言建议
  deleteMessageSuggestionsReplyInfo: '/community/street_community.MessageSuggestionsList/deleteMessageSuggestionsReplyInfo', // 删除留言建议
  volunteerActivityList: '/community/street_community.VolunteerActivity/getList', // 获取志愿者活动列表
  volunteerActivityInfo: '/community/street_community.VolunteerActivity/getVolunteerActiveJoinDetail', // 获取志愿者活动
  uploadImgApi: '/community/street_community.volunteerActivity/uploadImgApi', // 图片上传
  subActiveJoin: '/community/street_community.volunteerActivity/subActiveJoin', // 修改报名信息

  addVolunteerActivity: '/community/street_community.VolunteerActivity/addVolunteerActivity', // 志愿者活动添加
  getVolunteerDetail: '/community/street_community.VolunteerActivity/getVolunteerDetail', // 志愿者活动详情
  delVolunteerActivity: '/community/street_community.VolunteerActivity/delVolunteerActivity', // 删除志愿者活动
  getActiveJoinList: '/community/street_community.VolunteerActivity/getActiveJoinList', // 获取志愿者活动加入列表
  delActivityJoin: '/community/street_community.VolunteerActivity/delActivityJoin', // 删除志愿者报名数据
  getVolunteerActiveJoinInfo: '/community/street_community.VolunteerActivity/getVolunteerActiveJoinInfo', // 报名详情

  getStreetShowUrl:'/community/street_community.Visualization/getStreetShowUrl',//获取街道可视化右侧页面视图
  getBannerList:'/community/street_community.Visualization/bannerList',//获取轮播图列表
  getBannerInfo:'/community/street_community.Visualization/getBannerInfo',//获取轮播图详情
  addBanner:'/community/street_community.Visualization/addBanner',//添加编辑轮播图
  getApplication:'/community/street_community.Visualization/getApplication',//获取街道应用
  bannerDel:'/community/street_community.Visualization/del',//删除轮播图
  upload:'/community/street_community.Visualization/upload',//上传图片

  getStreetNavList:'/community/street_community.StreetNav/getStreetNavList',//获取街道导航列表
  addStreetNav:'/community/street_community.StreetNav/addStreetNav',//添加编辑街道导航
  getStreetNavInfo:'/community/street_community.StreetNav/getStreetNavInfo',//获取街道导航详情
  streetNavDel:'/community/street_community.StreetNav/del',//删除街道导航

  getPartyBranch:'/community/street_community.PartyBranch/getList',//获取党支部列表
  getCommunity:'/community/street_community.PartyBranch/getCommunity',//获取社区及社区下的小区
  addPartyBranch:'/community/street_community.PartyBranch/addPartyBranch',//获取社区及社区下的小区
  getPartyInfo:'/community/street_community.PartyBranch/getPartyInfo',//获取党支部详情
  getPartyBranchType:'/community/street_community.PartyBranch/getPartyType',//获取党支部类型
  delPartyBranch:'/community/street_community.PartyBranch/delPartyBranch',//删除党支部列表
  getPartyLocation:'/community/street_community.PartyBranch/getPartyLocation',//获取街道经纬度
  getPartyBranchAll:'/community/street_community.PartyMember/getPartyBranchAll',//获取党支部集合

  getPartyMember:'/community/street_community.PartyMember/getList',//获取党员信息列表
  getPartyMemberInfo:'/community/street_community.PartyMember/getPartyMemberInfo',//获取党员信息列表
  getPartyUpload:'/community/street_community.PartyMember/upload',//党员上传图片
  subPartyMember:'/community/street_community.PartyMember/editPartyMember',//编辑党员资料
  getProvinceList:'/merchant/merchant.system.area/getProvinceList',//获取省
  getCity:'/merchant/merchant.system.area/getCityList',//获取城市
  getPartyMemberRoomInfo:'/community/street_community.PartyMember/getPartyMemberRoomInfo',//获取党员房间列表

  //三会一课 start
  getLessonsClassList:'/community/street_community.MeetingLesson/getLessonClassList',//获取分类列表
  getLessonsClassInfo:'/community/street_community.MeetingLesson/getClassInfo',//获取分类详情
  subLessonsClass:'/community/street_community.MeetingLesson/subLessonClass',//添加、编辑分类
  delLessonsClass:'/community/street_community.MeetingLesson/delLessonClass',//删除分类

  getMeetingList:'/community/street_community.MeetingLesson/getMeetingList',//获取会议列表
  getMeetingInfo:'/community/street_community.MeetingLesson/getMeetingInfo',//获取会议详情
  subMeeting:'/community/street_community.MeetingLesson/subMeeting',//添加、编辑会议
  uploadMeeting:'/community/street_community.MeetingLesson/upload',//会议封面图
  delMeeting:'/community/street_community.MeetingLesson/delMeeting',//删除分类
  subWeChatNotice:'/community/street_community.MeetingLesson/weChatNotice',//删除分类

  getReplyList:'/community/street_community.MeetingLesson/getReplyList',//获取回复列表
  actionReply:'/community/street_community.MeetingLesson/actionReply',//前端是否显示 已读 删除回复
  openReplySwitch:'/community/street_community.MeetingLesson/isOpenReplySwitch',//是否开启评论总开关
  getMeetingBranchType:'/community/street_community.MeetingLesson/getPartyType',//获取三会一课类型
  //三会一课 end

  //智慧党建之党内活动管理 start
  getPartyActivityList:'/community/street_community.PartyActivities/getPartyActivityList',//获取党内活动列表
  getPartyActivityInfo:'/community/street_community.PartyActivities/getPartyActivityInfo',//获取党内活动详情
  activityUpload:'/community/street_community.PartyActivities/upload',//党内活动上传图片
  subPartyActivity:'/community/street_community.PartyActivities/subPartyActivity',//添加、编辑党内活动
  delPartyActivity:'/community/street_community.PartyActivities/delPartyActivity',//删除党内活动

  //报名列表
  getApplyList:'/community/street_community.PartyActivities/getApplyList',//获取报名列表
  getApplyInfo:'/community/street_community.PartyActivities/getApplyInfo',//获取报名详情
  subApply:'/community/street_community.PartyActivities/subApply',//编辑报名
  delApply:'/community/street_community.PartyActivities/delApply',//删除报名
  //智慧党建之党内活动管理 end

  //党内资讯
  getPartyBuildList:'/community/street_community.PartyBuild/getPartyBuildLists',//党内资讯列表
  getPartyBuildInfo:'/community/street_community.PartyBuild/PartyBuildDetail',//党内资讯详情
  getPartyBuildCategoryInfo:'/community/street_community.PartyBuild/PartyBuildCategoryDetail',//党内资讯分类详情
  getPartyBuildCategoryList:'/community/street_community.PartyBuild/getPartyBuildCategoryLists',//党内资讯分类列表
  getPartyBuildReply:'/community/street_community.PartyBuild/getPartyBuildReplyLists',//党内资讯评论
  delPartyBuildCategory:'/community/street_community.PartyBuild/delPartyBuildCategory',//删除党内资讯分类
  addPartyBuildCategory:'/community/street_community.PartyBuild/addPartyBuildCategory',//添加党内资讯分类
  savePartyBuildCategory:'/community/street_community.PartyBuild/savePartyBuildCategory',//编辑党内资讯分类
  addPartyBuild:'/community/street_community.PartyBuild/addPartyBuild',//添加党内资讯
  savePartyBuild:'/community/street_community.PartyBuild/savePartyBuild',//编辑党内资讯
  delPartyBuild:'/community/street_community.PartyBuild/delPartyBuild',//删除党内资讯
  changeReplyStatus:'/community/street_community.PartyBuild/changeReplyStatus',//删除/更改党内资讯评论状态
  isSwitch:'/community/street_community.PartyBuild/isSwitch',//是否开启党内资讯评论总开关
  partyWeChatNotice:'/community/street_community.PartyBuild/weChatNotice',//党内咨询微信通知

  //综治管理
  userVulnerableGroupsLists:'/community/street_community.SpecialGroupManage/getUserVulnerableGroupsList',//弱势困难群体管理
  getSpecialGroupsRecordList:'/community/street_community.SpecialGroupManage/getSpecialGroupsRecordList',//跟踪记录
  addSpecialGroupsRecord:'/community/street_community.SpecialGroupManage/addSpecialGroupsRecord',//添加跟踪记录
  delSpecialGroupsRecord:'/community/street_community.SpecialGroupManage/delSpecialGroupsRecord',//删除跟踪记录
  getRecordDetail:'/community/street_community.SpecialGroupManage/getRecordDetail',//跟踪记录详情
  getGroupDetail:'/community/street_community.SpecialGroupManage/getGroupDetail',//人群详情
  getUserLabel:'/community/street_community.SpecialGroupManage/getUserLabel',//获取用户属性标签

  //网格化管理
  gridCustomList:'/community/street_community.GridCustom/getGridCustomList',//网格员列表
  addGridCustom:'/community/street_community.GridCustom/addGridCustom',//添加网格员
  saveGridCustom:'/community/street_community.GridCustom/saveGridCustom',//编辑网格员
  getGridCustomDetail:'/community/street_community.GridCustom/getGridCustomDetail',//网格员信息
  getStreetAreaInfo:'/community/street_community.GridCustom/getStreetDetail',//街道/社区详情
  addGridRange:'/community/street_community.GridCustom/addGridRange',//添加街道/社区网格
  getGridRange:'/community/street_community.GridCustom/getGridRange',//查找网格
  delGridRange:'/community/street_community.GridCustom/delGridRange',//删除网格
  getAreaList:'/community/street_community.GridCustom/getAreaList',//获取街道下社区列表
  getVillageList:'/community/street_community.GridCustom/getVillageList',//获取社区下小区列表
  getSingleList:'/community/street_community.GridCustom/getSingleList',//获取小区下楼栋列表
  getGridMember:'/community/street_community.GridCustom/getGridMember',//获取网格员列表
  getBindType:'/community/street_community.GridCustom/getBindType',//获取绑定类型
  getZoomLastGrid:'/community/street_community.GridCustom/getZoomLastGrid',//获取离当前层级最近的网格
  getNowType:'/community/street_community.GridCustom/getNowType',//获取当前绘制区域所有街道/社区
  showInfo:'/community/street_community.GridCustom/showInfo',//单机获取绘制区域信息
  getFloorInfo:'/community/street_community.GridCustom/getFloorInfo',//获取单元信息
  getOpenDoorList:'/community/street_community.GridCustom/getOpenDoorList',//获取小区开门记录
  getSingleInfo:'/community/street_community.GridCustom/getSingleInfo',//获取小区开门记录
  getLayerInfo:'/community/street_community.GridCustom/getLayerInfo',//获取小区开门记录
  getRoomUserList:'/community/street_community.GridCustom/getRoomUserList',//获取房间下住户信息
  getInOutRecord:'/community/street_community.GridCustom/getInOutRecord',//小区车辆进出场记录
  getUserInfo:'/community/street_community.GridCustom/getUserInfo',//住户信息
  saveRange:'/community/street_community.GridCustom/saveRange',//更新网格名
  delGridCustom:'/community/street_community.GridCustom/delGridCustom',//删除网格员
  getWorkers:'/community/street_community.GridEvent/getWorkers',//街道工作人员列表
  getMemberList:'/community/street_community.OrganizationStreet/getMemberList',//街道工作人员列表
  delWorker:'/community/street_community.OrganizationStreet/delWorker',//删除工作人员
  saveStreetWorker:'/community/street_community.OrganizationStreet/saveStreetWorker',//编辑工作人员
  getGridRangeInfo:'/community/street_community.GridCustom/getGridRangeInfo',//获取网格信息
  //政务事项
  getMatterCategoryList:'/community/street_community.Matter/getCategoryList',//分类列表
  getMatterCategoryDetail:'/community/street_community.Matter/getCategoryDetail',//分类详情
  handleCategory:'/community/street_community.Matter/handleCategory',//添加/编辑分类
  delCategory:'/community/street_community.Matter/delCategory',//删除分类
  getMatterList:'/community/street_community.Matter/getMatterList',//事项列表
  getMatterInfo:'/community/street_community.Matter/getMatterInfo',//事项详情
  subMatter:'/community/street_community.Matter/subMatter',//添加/编辑事项
  delMatter:'/community/street_community.Matter/delMatter',//删除事项
  //固定资产管理
  getClassifyNav:'/community/street_community.FixedAssets/getClassifyNav',//获取分类导航
  operateClassifyNav:'/community/street_community.FixedAssets/operateClassifyNav',//添加编辑分类
  getClassifyNavInfo:'/community/street_community.FixedAssets/getClassifyNavInfo',//获取分类详情
  delClassifyNav:'/community/street_community.FixedAssets/delClassifyNav',//删除分类
  getClassifyList:'/community/street_community.FixedAssets/getClassifyList',//获取分类列表
  subAssets:'/community/street_community.FixedAssets/subAssets',//添加编辑资产
  delAssets:'/community/street_community.FixedAssets/delAssets',//删除资产（二级分类）
  getAssetsInfo:'/community/street_community.FixedAssets/getAssetsInfo',//获取资产详情
  getAssetsList:'/community/street_community.FixedAssets/getAssetsList',//获取资产信息列表
  subLedRent:'/community/street_community.FixedAssets/subLedRent',//提交领取租借
  subTakeBack:'/community/street_community.FixedAssets/subTakeBack',//提交收回 报废
  getRecordList:'/community/street_community.FixedAssets/getRecordList',//获取租借记录
  getMaintainList:'/community/street_community.FixedAssets/getMaintainList',//获取维修记录列表
  getMaintainInfo:'/community/street_community.FixedAssets/getMaintainInfo',//获取维修记录详情
  subMaintain:'/community/street_community.FixedAssets/subMaintain',//添加编辑维修记录
  uploadStreet:'/community/street_community.FixedAssets/uploadStreet',//上传维修记录图片

  weditorUpload:'/community/street_community.config/weditorUpload',//富文本上传图片
  //组织架构
  getTissueNav:'/community/street_community.OrganizationStreet/getTissueNav',//组织架构
  getBranchInfo:'/community/street_community.OrganizationStreet/getBranchInfo',//获取部门详情
  subBranch:'/community/street_community.OrganizationStreet/addOrganization',//添加编辑部门

  delBranch:'/community/street_community.OrganizationStreet/delBranch',//删除编辑部门
  getMemberInfo:'/community/street_community.OrganizationStreet/getMemberInfo',//获取部门下人员信息
  subMemberBranch:'/community/street_community.OrganizationStreet/subMemberBranch',//添加修改部门下人员信息
  getTissueNavList:'/community/street_community.OrganizationStreet/getTissueNavList',//获取部门

  getEventCategoryList:'/community/street_community.GridEvent/getEventCategoryList',//获取事件分类列表
  addEventCategory:'/community/street_community.GridEvent/addEventCategory',//添加事件分类
  editEventCategory:'/community/street_community.GridEvent/editEventCategory',//编辑事件分类
  todayEventCount:'/community/street_community.GridEvent/todayEventCount',//今日上报事件
  eventData:'/community/street_community.GridEvent/eventData',//事件处理数据
  getCategoryList:'/community/street_community.GridEvent/getCategoryList',//获取事件分类列表（不分页）
  getWorkerOrderLists:'/community/street_community.GridEvent/getWorkerOrderLists',//事件处理中心列表
  getWorkerEventDetail:'/community/street_community.GridEvent/getWorkerEventDetail',//事件处理详情
  allocationWorker:'/community/street_community.GridEvent/allocationWorker',//事件处理
  getWorkersPage:'/community/street_community.GridEvent/getWorkersPage',//获取工作人员（分页）

  delWorkerOrder:'/community/street_community.GridEvent/delWorkerOrder',//删除工单
  getGridEventOrg:'/community/street_community.GridEvent/getGridEventOrg',//获取人员数据

  // todo 业主管理
  getStreetCommunityUserList: '/community/street_community.User/getUerList', // 业主列表
  getStreetCommunityAll: '/community/street_community.User/getCommunityAll', // 社区数据
  getStreetVillageAll: '/community/street_community.User/getVillageAll', // 小区数据
  getStreetSingleAll: '/community/street_community.User/getSingleAll', // 楼栋数据


  // 基础资源图绘制api
  addCoordinatefloor: '/community/village_api.Aockpit/addCoordinatefloor', // 添加绘制区域
  addAreaSingle: '/community/village_api.Aockpit/addAreaSingle', // 绑定楼栋区域
  getAreaCoordinate: '/community/village_api.Aockpit/getAreaCoordinate', // 绘制操作查询区域点位
  getSingleAreaCoordinate: '/community/village_api.Aockpit/getSingleAreaCoordinate', // 查询已绑定区域点位
  delArea: '/community/village_api.Aockpit/delArea', // 删除区域

  //todo 任务下达
  getTaskReleaseListColumns: '/community/street_community.TaskRelease/getTaskReleaseListColumns',//任务下达表头
  getTaskReleaseList: '/community/street_community.TaskRelease/getTaskReleaseList',//任务下达列表
  getTaskReleaseOne: '/community/street_community.TaskRelease/getTaskReleaseOne',//任务数据
  taskReleaseAdd: '/community/street_community.TaskRelease/taskReleaseAdd',//添加任务数据
  taskReleaseSub: '/community/street_community.TaskRelease/taskReleaseSub',//编辑任务数据
  taskReleaseDel: '/community/street_community.TaskRelease/taskReleaseDel',//删除任务数据
  getTaskReleaseRecord: '/community/street_community.TaskRelease/getTaskReleaseRecord',//任务记录
  getTaskReleaseType: '/community/street_community.TaskRelease/getTaskReleaseType',//获取街道任务类型

  //todo 社区关怀
  getCommunityCareType: '/community/street_community.TaskRelease/getCommunityCareType',//社区关怀类型
  getCommunityCareList: '/community/street_community.TaskRelease/getCommunityCareList',//社区关怀列表
  communityCareAdd: '/community/street_community.TaskRelease/communityCareAdd',//添加社区关怀
  communityCareOne: '/community/street_community.TaskRelease/communityCareOne',//查询社区关怀数据
  communityCareSub: '/community/street_community.TaskRelease/communityCareSub',//编辑社区关怀
  communityCareDel: '/community/street_community.TaskRelease/communityCareDel',//编辑社区关怀
  //todo 疫情防控
  getEpidemicPreventSeriesList: '/community/street_community.TaskRelease/getEpidemicPreventSeriesList',//系列列表
  epidemicPreventSeriesAdd: '/community/street_community.TaskRelease/epidemicPreventSeriesAdd',//添加系列
  epidemicPreventSeriesOne: '/community/street_community.TaskRelease/epidemicPreventSeriesOne',//获取系列
  epidemicPreventSeriesSub: '/community/street_community.TaskRelease/epidemicPreventSeriesSub',//编辑系列
  epidemicPreventSeriesDel: '/community/street_community.TaskRelease/epidemicPreventSeriesDel',//删除系列

  getEpidemicPreventTypeList: '/community/street_community.TaskRelease/getEpidemicPreventTypeList',//类型列表
  epidemicPreventTypeAdd: '/community/street_community.TaskRelease/epidemicPreventTypeAdd',//添加类型
  epidemicPreventTypeOne: '/community/street_community.TaskRelease/epidemicPreventTypeOne',//获取类型
  epidemicPreventTypeSub: '/community/street_community.TaskRelease/epidemicPreventTypeSub',//编辑类型
  epidemicPreventTypeDel: '/community/street_community.TaskRelease/epidemicPreventTypeDel',//删除类型

  getEpidemicPreventParamAll: '/community/street_community.TaskRelease/getEpidemicPreventParamAll',//获取疫情防护类型参数
  getEpidemicPreventRecordList: '/community/street_community.TaskRelease/getEpidemicPreventRecordList',//记录列表
  epidemicPreventRecordAdd: '/community/street_community.TaskRelease/epidemicPreventRecordAdd',//添加记录
  epidemicPreventRecordOne: '/community/street_community.TaskRelease/epidemicPreventRecordOne',//获取记录
  epidemicPreventRecordSub: '/community/street_community.TaskRelease/epidemicPreventRecordSub',//编辑记录
  epidemicPreventRecordDel: '/community/street_community.TaskRelease/epidemicPreventRecordDel',//删除记录

  getStreetCommunityTissueNav: '/community/street_community.TaskRelease/getTissueNav',//获取街道下社区
  getTaskReleaseTissueNav: '/community/street_community.TaskRelease/getTaskReleaseTissueNav',//获取街道下社区
  
  
  // 街道社区可视化大数据
  getIndex: '/community/street_community.CommunityCommittee/getIndex', //首页接口 （页面一加载就要调用该接口）
  getAreaStreetWorkersOrder: '/community/street_community.CommunityCommittee/getAreaStreetWorkersOrder', //中部广告滚动条（点击选项卡切换就需要调用该接口，更新数据）
  getPartyBuilding: '/community/street_community.CommunityCommittee/getPartyBuilding', //【社区党建页面】【党组织架构统计+三会一课+党内咨询+热点新闻】接口
  getStreetPartyActivity: '/community/street_community.CommunityCommittee/getPartyActivity', //【社区党建页面】【党建活动】接口
  getEventAnaly: '/community/street_community.CommunityCommittee/getEventAnaly' ,//【事件分析】【事件上报+社区关怀+社区物业统计+视频监控一+视频监控二】接口
  getPopulationAnaly: '/community/street_community.CommunityCommittee/getPopulationAnaly', //【人口分析 接口待定】【人口信息+男比例统计+年龄段统计+居民人口性质统计+教育水平统计+婚姻状况统计】接口 
  getPartyMemberStatistics: '/community/street_community.CommunityCommittee/getPartyMemberStatistics', //【社区党建页面 接口待定】党员数量统计接口 
  getEpidemicPrevent: '/community/street_community.CommunityCommittee/getEpidemicPrevent' ,//【事件分析】疫情防控数据统计接口 
  
  //街道社区可视化大数据  模块接口提取
  getPartyOrgStatistics:'/community/street_community.CommunityCommittee/getPartyOrgStatistics', //党组织架构统计
  getPartyMeetingStatistics:'/community/street_community.CommunityCommittee/getPartyMeetingStatistics', //三会一课统计
  getPartySeekStatistics:'/community/street_community.CommunityCommittee/getPartySeekStatistics', //党内咨询
  getPartyNewsStatistics:'/community/street_community.CommunityCommittee/getPartyNewsStatistics', //热点新闻
  getPopulationPersonStatistics:'/community/street_community.CommunityCommittee/getPopulationPersonStatistics', //人口信息
  getPopulationSexStatistics:'/community/street_community.CommunityCommittee/getPopulationSexStatistics', //男女比例统计
  getPopulationAgeStatistics:'/community/street_community.CommunityCommittee/getPopulationAgeStatistics', //年龄段统计
  getPopulationUserLabelStatistics:'/community/street_community.CommunityCommittee/getPopulationUserLabelStatistics', //居民人口性质统计
  getPopulationEducateStatistics:'/community/street_community.CommunityCommittee/getPopulationEducateStatistics', //教育水平统计
  getPopulationMarriageStatistics:'/community/street_community.CommunityCommittee/getPopulationMarriageStatistics', //婚姻状况统计
  getEventReportStatistics:'/community/street_community.CommunityCommittee/getEventReportStatistics', //事件上报
  getEventCareStatistics:'/community/street_community.CommunityCommittee/getEventCareStatistics', //社区关怀
  getEventVirtualStatistics:'/community/street_community.CommunityCommittee/getEventVirtualStatistics', //社区物业统计
  getEventVideo1Statistics:'/community/street_community.CommunityCommittee/getEventVideo1Statistics', //视频监控一
  getEventVideo2Statistics:'/community/street_community.CommunityCommittee/getEventVideo2Statistics', //视频监控二

  getStreetVillages:'/community/street_community.OrganizationStreet/getStreetXillages', //获取街道社区 小区
  getProvinceCityAreas:'/community/street_community.OrganizationStreet/getProvinceCityAreas',
  getStreetRolePermission:'/community/street_community.OrganizationStreet/getStreetRolePermission',
  saveStreetRolePermission:'/community/street_community.OrganizationStreet/saveStreetRolePermission',
  getPartyBranchPosition: '/community/street_community.CommunityCommittee/getPartyBranchPosition', //获取地图上党支部数据
  getStreetLibraryClass:'/community/street_community.Visualization/getStreetLibraryClass',//获取街道功能库二级详情

  getStreetWorkRecognition:'/community/street_community.OrganizationStreet/getRecognition', //街道扫码绑定微信公众号
  checkStreetWorkRecognition:'/community/street_community.OrganizationStreet/checkWorker', //校验工作人员是否绑定微信
  cancelStreetWorkRecognition:'/community/street_community.OrganizationStreet/cancelWorkerBind', //校验工作人员是否绑定微信
  getPopulationStreetNationStatistics:'/community/street_community.CommunityCommittee/getPopulationNationStatistics', //名族统计
  getStreetComunityList:'/community/street_community.Config/getStreetComunityList',
  getStreetComunityHouseList:'/community/street_community.Config/getStreetComunityHouseList',
  getStreetServiceNavList:'/community/street_community.StreetNav/getStreetServiceNavList',
  addStreetServiceNav:'/community/street_community.StreetNav/addStreetServiceNav',
  getStreetServiceNavInfo:'/community/street_community.StreetNav/getStreetServiceNavInfo',
  delStreetServiceNav:'/community/street_community.StreetNav/delStreetServiceNav',
}
  
  export default configStreetCommunityApi