/**
 *******************
 *   @author 私域流量
 *   @date 2021-03-06
 *   @description 私域流量相关模块
 *******************
 */
const PrivateFlowComponents = {
    'CommonPrivateActivityList': () => import('@/views/common/privateflow/activityManagement/activityList'),
    'CommonPrivateActivityEdit': () => import('@/views/common/privateflow/activityManagement/activityEdit'),
    'Setting': () => import('@/views/common/privateflow/activityManagement/setting'),
}
export default PrivateFlowComponents
