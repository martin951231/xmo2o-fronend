const foodshopPlatformApi = {
  categoryList: '/foodshop/platform.StoreCategory/categoryList' ,// 餐饮店铺分类
  getEditInfo: '/foodshop/platform.StoreCategory/getEditInfo' ,// 获得分类添加编辑所需信息
  editSort: '/foodshop/platform.StoreCategory/editSort' ,// 编辑分类
  delSort: '/foodshop/platform.StoreCategory/delSort' ,// 删除分类
  
  storeList: '/foodshop/platform.Store/storeList' ,// 店铺列表
  saveSort:'/foodshop/platform.Store/saveSort' ,// 编辑店铺排序
  searchHotList:'/foodshop/platform.SearchHot/searchHotList',// 搜索发现列表
  saveSearchHot:'/foodshop/platform.SearchHot/saveSearchHot',// 搜索发现编辑
  getSearchHotDetail:'/foodshop/platform.SearchHot/getSearchHotDetail',// 搜索发现详情
  delSearchHot:'/foodshop/platform.SearchHot/delSearchHot',// 搜索发现删除
  saveSearchHotSort:'/foodshop/platform.SearchHot/saveSort',// 搜索发现排序
  orderList:'/foodshop/platform.order/orderList',// 订单列表
  orderDetail:'/foodshop/platform.order/orderDetail',// 订单详情
  orderExportUrl:'/foodshop/platform.order/export',// 订单导出


  merchantAutoLogin:'/foodshop/platform.login/merchantAutoLogin',// 登陆商家后台
  staffAutoLogin:'/foodshop/platform.login/staffAutoLogin',// 登陆店员后台
  
}
  
  export default foodshopPlatformApi