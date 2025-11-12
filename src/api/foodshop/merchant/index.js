const foodshopMerchantApi = {
  getLists: '/foodshop/merchant.FoodshopStore/getStoreList', // 商家中心餐饮业务店铺列表
  seeQrcode: '/foodshop/merchant.FoodshopStore/seeQrcode', // 商家中心餐饮业务店铺二维码
  orderList: '/foodshop/merchant.order/orderList', // 商家中心餐饮业务订单列表
  orderDetail: '/foodshop/merchant.order/orderDetail', // 商家中心餐饮业务订单详情
  orderExportUrl: '/foodshop/merchant.order/export', // 商家中心餐饮业务订单导出
  sortList: '/foodshop/merchant.sort/sortList', // 商品分类列表
  changeSort: '/foodshop/merchant.sort/changeSort', // 商品分类排序
  geSortDetail: '/foodshop/merchant.sort/geSortDetail', // 商品分类详情
  editSort: '/foodshop/merchant.sort/editSort', // 商品分类添加编辑
  delSort: '/foodshop/merchant.sort/delSort', // 商品分类删除
  selectSortList: '/foodshop/merchant.sort/selectSortList', // 商品分类列表
  goodsList: '/foodshop/merchant.goods/goodsList', // 商品列表
  goodsDetail: '/foodshop/merchant.goods/goodsDetail', // 商品详情
  editSingleGoods: '/foodshop/merchant.goods/editSingleGoods', // 编辑单个商品
  editGoods: '/foodshop/merchant.goods/editGoods', // 编辑商品
  addGoods: '/foodshop/merchant.goods/addGoods', // 批量添加商品
  goodsDel: '/foodshop/merchant.goods/goodsDel', // 删除商品
  changeStatus: '/foodshop/merchant.goods/changeStatus', // 修改商品状态
  editGoodsBatch: '/foodshop/merchant.goods/editGoodsBatch', // 批量修改
  getShopDetail: '/foodshop/merchant.FoodshopStore/getShopDetail', // 店铺详情
  shopEdit: '/foodshop/merchant.FoodshopStore/shopEdit', // 店铺详情
  storePrintList: '/foodshop/merchant.print/getStorePrintList', // 获得店铺打印机列表
  tableTypeList: '/foodshop/merchant.FoodshopStore/tableTypeList', // 获取桌台分类
  tableList: '/foodshop/merchant.FoodshopStore/tableList', // 获取桌台列表
  getTableType: '/foodshop/merchant.FoodshopStore/getTableType', // 获取桌台分类详情
  saveTableType: '/foodshop/merchant.FoodshopStore/saveTableType', // 保存桌台分类（新增+修改）
  delTableType: '/foodshop/merchant.FoodshopStore/delTableType', // 删除桌台分类
  getTable: '/foodshop/merchant.FoodshopStore/getTable', // 获取桌台详情
  saveTable: '/foodshop/merchant.FoodshopStore/saveTable', // 保存桌台（新增+修改）
  delTable: '/foodshop/merchant.FoodshopStore/delTable', // 删除桌台
  downloadQrcodeTable: '/foodshop/merchant.FoodshopStore/downloadQrcodeTable', //下载桌台码
  downloadQrcodeStore: '/foodshop/merchant.FoodshopStore/downloadQrcodeStore', //下载店铺通用码

  // 打印机设置
  getPrintRuleList: '/foodshop/merchant.print/getPrintRuleList', // 店铺打印机规则列表
  getPrintRuleDetail: '/foodshop/merchant.print/getPrintRuleDetail', // 店铺打印机规则详情
  editPrintRule: '/foodshop/merchant.print/editPrintRule', // 添加编辑规则
  delPrintRule: '/foodshop/merchant.print/delPrintRule', // 删除规则
  getPrintGoodsList: '/foodshop/merchant.print/getPrintGoodsList', // 获得打印机选择商品列表


  // 套餐管理
  getPackageList: '/foodshop/merchant.Package/getPackageList', // 获取套餐列表
  removePackage: '/foodshop/merchant.Package/delPackage', // 删除套餐
  getPackageDetail: '/foodshop/merchant.Package/getPackageDetail', // 套餐详情
  editPackage: '/foodshop/merchant.Package/editPackage', // 套餐编辑
  getPackageDetailList: '/foodshop/merchant.Package/getPackageDetailList', // 套餐分组列表详情
  editPackageDetail: '/foodshop/merchant.Package/editPackageDetail', // 添加套餐分组
  getPackageDetailInfo: '/foodshop/merchant.Package/getPackageDetailInfo', // 套餐分组详情
  delPackageDetail: '/foodshop/merchant.Package/delPackageDetail', // 删除套餐分组
  getPackageDetailGoodsList: '/foodshop/merchant.Package/getPackageDetailGoodsList', // 套餐分组商品数据
  getPackageGoodsList: '/foodshop/merchant.Package/getPackageGoodsList', // 获得套餐选择商品列表

}
export default foodshopMerchantApi