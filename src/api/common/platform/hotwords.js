/**
 *******************
 *   @author wangchen
 *   @date 2021-4-28
 *   @description 热门搜索词
 *******************
 */
const  hotwordsPlatformApi = {
    getHotWordsList: '/common/platform.HotWords/getHotWordsList',          // 热门搜索词--列表
    getWordDetail: '/common/platform.HotWords/getWordDetail',// 获取详情
    getHotWordsEdit: '/common/platform.HotWords/getHotWordsEdit',// 新增/编辑关键词
    getHotWordsEditSort: '/common/platform.HotWords/getHotWordsEditSort',// 保存排序
    delWords: '/common/platform.HotWords/delWords',// 删除关键词

}

export default hotwordsPlatformApi