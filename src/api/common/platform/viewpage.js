/**
 *******************
 *   @author hengtingmei
 *   @date 2020-12-21
 *   @description 后台可视化页面
 *******************
 */
const  viewpagePlatformApi = {
  getShopSeckillIndex : '/common/platform.viewpage.ShopSeckill/getDefaultInfo', // 外卖首页-限时秒杀功能 获得基本配置信息
  getCategoryDetail : '/common/platform.viewpage.ShopSeckill/getCategoryDetail', // 外卖首页-限时秒杀功能 获得分类详情
  editCategory : '/common/platform.viewpage.ShopSeckill/editCategory', // 外卖首页-限时秒杀功能 编辑分类信息
  getCategoryList : '/common/platform.viewpage.ShopSeckill/getCategoryList', // 外卖首页-限时秒杀功能 获得分类列表
  delCategory:'/common/platform.viewpage.ShopSeckill/delCategory', // 外卖首页-限时秒杀功能 删除分类列表
  getCategoryGoodsList:'/common/platform.viewpage.ShopSeckill/getCategoryGoodsList', // 外卖首页-限时秒杀功能 获得商品列表
  editCategoryGoodsSort:'/common/platform.viewpage.ShopSeckill/editCategoryGoodsSort', // 外卖首页-限时秒杀功能 修改分类绑定的商品的排序
  delCategoryGoods:'/common/platform.viewpage.ShopSeckill/delCategoryGoods', // 外卖首页-限时秒杀功能 删除分类绑定的商品
  addCategoryGoods:'/common/platform.viewpage.ShopSeckill/addCategoryGoods', // 外卖首页-限时秒杀功能 添加分类绑定的商品
  searchRankingGetList:'/common/platform.HomeSearchRanking/getList', // 排行榜列表
  searchRankingSaveData:'/common/platform.HomeSearchRanking/saveData', // 排行榜添加/编辑
  searchRankingChangeInfo:'/common/platform.HomeSearchRanking/changeInfo', // 排行榜排序值修改
  searchRankingDelete:'/common/platform.HomeSearchRanking/delete', // 排行榜删除
}

export default viewpagePlatformApi
