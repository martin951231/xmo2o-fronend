/**
 *******************
 *   系统后台团购
 *   @author dengyuanhui
 *   @date 2021-05-15
 *   @description 种草模块
 *******************
 */
const GrowGrassComponents = {
    // 评论列表
    'GrowGrassCommentList': () => import('@/views/grow_grass/platform/CommentManageList'),
    // 话题列表
    'GrowGrassCategory': () => import('@/views/grow_grass/merchant/CategoryManageList'),
    // 发布列表
    'GrowGrassArticle': () => import('@/views/grow_grass/merchant/ArticleManageList'),
}
export default GrowGrassComponents