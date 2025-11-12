const atlascategoryPlatformApi = {
    'getAtlasArticleList':'/atlas/api.AtlasArticle/getAtlasArticleList', // 获取图文管理列表
    'getAtlasArticleClass':'/atlas/api.AtlasArticle/getAtlasArticleClass', // 获取图文管理分类
    'getAtlasArticleOption':'/atlas/api.AtlasArticle/getAtlasArticleOption', // 获取图文管理分类标签
    'getAtlasArticleDetail':'/atlas/api.AtlasArticle/getAtlasArticleDetail', // 获取一条图文管理数据
    'getAtlasArticleCreate':'/atlas/api.AtlasArticle/getAtlasArticleCreate', // 图文管理编辑/添加
    'getAtlasArticleDel':'/atlas/api.AtlasArticle/getAtlasArticleDel', // 图文管理删除

    'getAtlasCategoryList':'/atlas/api.AtlasCategory/getAtlasCategoryList', // 获取分类列表
    'getAtlasCategoryInfo':'/atlas/api.AtlasCategory/getAtlasCategoryInfo', // 获取一条分类数据
    'getAtlasCategoryCreate':'/atlas/api.AtlasCategory/getAtlasCategoryCreate', // 分类编辑/添加
    'getAtlasCategoryDel':'/atlas/api.AtlasCategory/getAtlasCategoryDel', // 分类删除
    'getAtlasArticleSecond':'/atlas/api.AtlasCategory/getAtlasArticleSecond', // 图文管理获取对应二级分类列表
    
    'getAtlasSpecialList':'/atlas/api.AtlasSpecial/getAtlasSpecialList', // 获取分类标签列表
    'getAtlasSpecialInfo':'/atlas/api.AtlasSpecial/getAtlasSpecialInfo', // 获取一条分类标签列表
    'getAtlasSpecialCreate':'/atlas/api.AtlasSpecial/getAtlasSpecialCreate', // 分类标签编辑/添加
    'getAtlasSpecialDel':'/atlas/api.AtlasSpecial/getAtlasSpecialDel', // 分类标签删除
}
export default atlascategoryPlatformApi