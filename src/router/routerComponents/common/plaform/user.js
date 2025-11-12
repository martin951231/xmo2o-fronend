/**
 *******************
 *   @author 郑亚莉
 *   @date 2020-05-14
 *   @description 用户相关组件
 *******************
 */
const userPlaformComponents = {
  // 你需要动态引入的页面组件
  'System': () => import('@/views/common/iframePage/IframePage'),
  'Index': () => import('@/views/common/iframePage/IframePage'),
  'Mail': () => import('@/views/common/platform/user/MailList'),
  'Complaint': () => import('@/views/common/platform/user/ComplaintManage'),
}
export default userPlaformComponents
