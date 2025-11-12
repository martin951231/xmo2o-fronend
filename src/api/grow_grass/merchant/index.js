const growGrassCommentApi = {
    'getCommentList': '/grow_grass/platform.GrowGrassArticleReply/getCommentList', // 种草评论管理列表
    'updateGrowGrassArticleReply': '/grow_grass/platform.GrowGrassArticleReply/updateGrowGrassArticleReply', // 种草评论修改状态
    'getCategoryList': '/grow_grass/api.Category/getCategoryList', // 种草话题管理列表
    'getCategoryEdit': '/grow_grass/api.Category/getCategoryEdit', // 种草话题管理保存
    'getCategoryDetail':'/grow_grass/api.Category/getCategoryDetail', // 种草话题编辑
    'getCategoryDel':'/grow_grass/api.Category/getCategoryDel', // 种草话题删除
    'getCategorySort':'/grow_grass/api.Category/getCategorySort', // 种草话题排序
    'getCategoryClass':'/grow_grass/api.Category/getCategoryClass', // 种草话题分类

    'getArticleLists': '/grow_grass/api.Article/getArticleLists', // 种草发布管理列表
    'getEditArticle': '/grow_grass/api.Article/getEditArticle', // 种草发布管理操作
    'getArticleDetails':'/grow_grass/api.Article/getArticleDetails', // 种草发布文字查看
    'getArticleCategoryDetails':'/grow_grass/api.Article/getArticleCategoryDetails', // 种草发布话题查看
    'getArticle':'/grow_grass/api.Article/getArticleEditInfo', // 查看发布内容
}
export default growGrassCommentApi