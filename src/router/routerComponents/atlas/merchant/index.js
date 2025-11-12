/**
 *******************
 *   系统后台
 *   @author dengyuanhui
 *   @date 2021-05-21
 *   @description 图文模块
 *******************
 */
const AtlasComponents = {
    // 图文列表
    'AtlasArticle': () => import('@/views/atlas/merchant/AtlasArticleList'),
    // 分类列表
    'AtlasCategory': () => import('@/views/atlas/merchant/AtlasCategoryList'),
}
export default AtlasComponents