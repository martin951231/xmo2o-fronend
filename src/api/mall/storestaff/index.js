const mallStorestaffApi = {
  'getOrderList': '/mall/storestaff.MallOrder/getOrderList', // 订单列表
  'exportOrder': '/mall/storestaff.MallOrder/exportOrder', // 导出
  'orderTaking': '/mall/storestaff.MallOrder/orderTaking', // 接单
  'deliverGoodsByHouseman': '/mall/storestaff.MallOrder/deliverGoodsByHouseman', // 骑手配送
  'staffVerify': '/mall/storestaff.MallOrder/staffVerify', // 店员核销
  'postponeDelivery': '/mall/storestaff.MallOrder/postponeDelivery', // 顺延发货
  'agreeRefund': '/mall/storestaff.MallOrder/AgreeRefund', // 同意退款
  'getExpress': '/mall/storestaff.MallOrder/getExpress', // 获取快递
  'deliverGoodsByExpress': '/mall/storestaff.MallOrder/deliverGoodsByExpress', // 快递发货
  'viewLogistics': '/mall/storestaff.MallOrder/viewLogistics', // 查看物流
  'refuseRefund': '/mall/storestaff.MallOrder/RefuseRefund', // 拒绝退款
  'clerkDiscount': '/mall/storestaff.MallOrder/clerkDiscount', // 店员修改价格
  'getOrderDetails': '/mall/storestaff.MallOrder/getOrderDetails', // 点单详情
  'clerkNotes': '/mall/storestaff.MallOrder/clerkNotes', // 店员备注
  'getPeriodicList': '/mall/storestaff.MallOrder/getPeriodicList', // 查看配送周期
  'downExcel': '/mall/storestaff.MallOrder/downExcel', // 下载批量
  'downFailExcel': '/mall/storestaff.MallOrder/downFailExcel', // 下载批量
  'uploadUrl': '/common/common.UploadFile/uploadFile', //上传
  'uploadExcel': '/mall/storestaff.MallOrder/uploadFile',//上传excel
  'getList': '/mall/storestaff.MallOrder/shopGoodsBatchLogList',//上传excel
  'getOrderListCopy': '/mall/storestaff.MallOrder/getOrderListCopy', // 订单列表
  'getOrderDetailsCopy': '/mall/storestaff.MallOrder/getOrderDetailsCopy', // 订单详情
  // 打印小票
  'orderPrintTicket': '/mall/storestaff.MallOrder/printOrder',
  // 店员修改配送方式
  'changeDeliveryType': '/mall/storestaff.MallOrder/changeDeliveryType',
  // 店员上传配送方式
  'uploadOrderDeliveryExcel': '/mall/storestaff.MallOrder/uploadOrderDeliveryExcel',
}
export default mallStorestaffApi