/**
 *******************
 *   @author 万紫阳
 *   @date 2020-05-22
 *   @description 信息相关组件
 *******************
 */
const ConfigStreetComunityComponents = {
    // 你需要动态引入的页面组件 街道/社区基本信息
    'ConfigStreetComunityIndex': () => import('@/views/community/streetCommunity/config/index'),
    // 民生管理
    'PeopleLivelihoodMessageSuggestionsList': () => import('@/views/community/streetCommunity/peopleLivelihood/messageSuggestionsList'),

    //业主管理
    'PeopleLivelihoodUserList': () => import('@/views/community/streetCommunity/peopleLivelihood/userList'),


    // 志愿者活动管理
    'PeopleLivelihoodVolunteerActivitiesList': () => import('@/views/community/streetCommunity/peopleLivelihood/volunteerActivitiesList'),
    // 志愿者活动管理-添加编辑
    'PeopleLivelihoodAddVolunteerActivitiesInfo': () => import('@/views/community/streetCommunity/peopleLivelihood/addVolunteerActivitiesInfo'),
    // 报名志愿者活动管理
    'PeopleLivelihoodSignVolunteerActivitiesList': () => import('@/views/community/streetCommunity/peopleLivelihood/signVolunteerActivitiesList'),
    //可视化页面
    'VisualizationIndex':()=> import('@/views/community/streetCommunity/visualization/VisualizationIndex'),
    //党务管理-党务列表
    'PartyWorkList':()=> import('@/views/community/streetCommunity/partyWork/PartyWorkList'),
    //党员管理-党员信息
    'PartyMemberList':()=> import('@/views/community/streetCommunity/partyMember/PartyMemberList'),
    //智慧党建-会议分类
    'ThreeLessonsList':()=> import('@/views/community/streetCommunity/ThreeLessons/ThreeLessonsList'),
    //智慧党建-会议列表
    'MeetingList':()=> import('@/views/community/streetCommunity/ThreeLessons/MeetingList'),
    //会议评论列表
    'CommentsList':()=> import('@/views/community/streetCommunity/ThreeLessons/CommentsList'),
    //党内活动管理
    'PartyActivityList':()=>import('@/views/community/streetCommunity/PartyActivity/PartyActivityList'),
    //党内活动报名
    'ActivityApplyList':()=>import('@/views/community/streetCommunity/PartyActivity/ActivityApplyList'),
  //党内资讯
  'PartyBuildCategoryLists':()=>import('@/views/community/streetCommunity/PartyBuild/CategoryList'),
  'NewsList':()=>import('@/views/community/streetCommunity/PartyBuild/NewsList'),
  'ReplyList':()=>import('@/views/community/streetCommunity/PartyBuild/CommentsList'),

  //综治管理
  'userVulnerableGroupsLists':()=>import('@/views/community/streetCommunity/specialGroup/userVulnerableGroupsLists'),//弱势困难人群管理
  'importantGroupLists':()=>import('@/views/community/streetCommunity/specialGroup/importantGroupLists'),//重要人群管理
  'specialGroupLists':()=>import('@/views/community/streetCommunity/specialGroup/specialGroupLists'),//特殊人群管理
  'smartPension':()=>import('@/views/community/streetCommunity/specialGroup/smartPension'),//智慧养老
  'groupRecord':()=>import('@/views/community/streetCommunity/specialGroup/groupRecord'),//跟踪记录
    //网上政务
    //党内活动报名
    'MatterClassifyList':()=>import('@/views/community/streetCommunity/PoliticsMatter/MatterClassifyList'),
    'MatterList':()=>import('@/views/community/streetCommunity/PoliticsMatter/MatterList'),

  //网格化管理
  'GridCustomList':()=> import('@/views/community/streetCommunity/gridCustom/GridCustomList'), //网格员列表
  'GridManage':()=> import('@/views/community/streetCommunity/gridCustom/GridManage'),  //网格化管理
  'GridEvent':()=> import('@/views/community/streetCommunity/gridCustom/GridEvent'),  //网格事件分类管理
  'GridChildEvent':()=> import('@/views/community/streetCommunity/gridCustom/GridChildEvent'),  //网格事件子分类管理
  'GridEventCenter':()=> import('@/views/community/streetCommunity/gridCustom/GridEventCenter'),  //网格事件管理中心
    //固定资产管理
  'FixedAssetsList':()=>import('@/views/community/streetCommunity/fixedAssets/FixedAssetsList'),
  //网格-组织架构
  'OrganizationList':()=>import('@/views/community/streetCommunity/Organization/OrganizationList'),

    //任务下达
    'taskRelease': () => import('@/views/community/streetCommunity/taskRelease/list'),
    //疫情防控
    'epidemicPrevent': () => import('@/views/community/streetCommunity/epidemicPrevent/list'),
    //社区关怀
    'communityCare': () => import('@/views/community/streetCommunity/communityCare/list'),
    //服务管理
    'serviceSpecialNavList': () => import('@/views/community/streetCommunity/functPage/serviceSpecialNavList'),
    //服务中心管理
    'serviceCentreSpecialNavList': () => import('@/views/community/streetCommunity/functPage/serviceCentreSpecialNavList'),
}
export default ConfigStreetComunityComponents
  