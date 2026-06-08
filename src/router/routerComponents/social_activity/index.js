// 启明星社群页面start
const SocialActivityComponents = {
    'SocialActivityIndex': () => import('@/views/social_activity/SocialActivityIndex/SocialActivityIndex'),
    'SocialActivityList': () => import('@/views/social_activity/SocialActivityList/SocialActivityList'),
    'DecorationIndex': () => import('@/views/social_activity/DecorationIndex/DecorationIndex'),
    'SocialActivityCategory': () => import('@/views/social_activity/SocialActivityList/SocialActivityCategory'),
    'AdminList': () => import('@/views/social_activity/Admin/AdminList'),
    'IntegralRules': () => import('@/views/social_activity/IntegralRules/IntegralRules.vue'),
    'IntegralDetail': () => import('@/views/social_activity/IntegralRules/IntegralDetail.vue'),
    'CommentSettings': () => import('@/views/social_activity/CommentSettings/CommentSettings.vue'),
    'ActivityComments': () => import('@/views/social_activity/CommentSettings/ActivityComments.vue'),
    'RegistrationForm': () => import('@/views/social_activity/RegistrationForm/RegistrationForm'),
    'SocialActivityOrderList': () => import('@/views/social_activity/SocialActivityOrderList/SocialActivityOrderList'),
  }
// 启明星社群页面 end
  export default SocialActivityComponents