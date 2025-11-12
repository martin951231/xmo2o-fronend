const AppointPlatformComponents = {
    // 预约装修
    'Decorate': () => import('@/views/appoint/platform/Decorate'),
    // 预约活动页
    'AppointActivityList': () => import('@/views/appoint/platform/ActivityList'),
    // 预约快报资讯
    'InformationList': () => import('@/views/appoint/platform/InformationList'),
    // 打赏管理
    'RewardManagement': () => import('@/views/appoint/platform/RewardManagement'),
}
export default AppointPlatformComponents