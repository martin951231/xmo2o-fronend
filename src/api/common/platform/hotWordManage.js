/**
 *******************
 *   @author mrdeng
 *   @date 2021-05-24
 *   @description 平台消息推送接口
 *******************
 */
const hotWordManageApi = {
    getHouseHotWordLists: '/voice_robot/platform.HotWordManage/hotWordList', //查询关键词列表
    setHouseHotWordStatus: '/voice_robot/platform.HotWordManage/editHotWordStatus', //设置关键词
    saveHotWordData: '/voice_robot/platform.HotWordManage/editHotWord', //编辑关键词
    deleteHouseHotWord: '/voice_robot/platform.HotWordManage/delHotWord', //删除关键词
    getOneHouseHotWord: '/voice_robot/platform.HotWordManage/hotWordDetail', //查看关键词详情

    getHouseHotWordMaterialCategoryLists: '/voice_robot/platform.MaterialCategory/materialCategoryList', //查询分类列表
    deleteHouseHotWordMaterialCategory: '/voice_robot/platform.MaterialCategory/delMaterialCategory', //删除分类列表
    saveMaterialCategoryData: '/voice_robot/platform.MaterialCategory/editMaterialCategory', //编辑分类列表
    exportHotWordMaterial: '/voice_robot/platform.MaterialCategory/exportMaterialCategory', //导入分类列表

    getHouseHotWordMaterialLists: '/voice_robot/platform.MaterialCategory/contentList', //查询分类内容列表
    deleteHouseHotWordMaterialContent: '/voice_robot/platform.MaterialCategory/delContent', //删除分类内容列表
    saveHouseHotWordMaterialSetData: '/voice_robot/platform.MaterialCategory/saveContent', //编辑分类内容列表

    getHotWordMaterialLibrary:'/voice_robot/platform.MaterialCategory/getHotWordMaterialLibrary', //获取素材库
    getHotWordMaterialLibraryDetails:'/voice_robot/platform.MaterialCategory/getHotWordMaterialLibraryDetail', //获取素材详情
}

export default hotWordManageApi