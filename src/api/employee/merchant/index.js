const employeeMerchantApi = {
    'getCardList': '/employee/merchant.EmployeeCard/getCardList', // 员工卡配置列表
    'editCard': '/employee/merchant.EmployeeCard/editCard', // 员工卡配置编辑
    'saveCard': '/employee/merchant.EmployeeCard/saveCard', // 员工卡配置保存
    'getCouponList': '/employee/merchant.EmployeeCard/getCouponList', // 优惠券列表
    'editCoupon': '/employee/merchant.EmployeeCard/editCoupon', // 编辑
    'saveCoupon': '/employee/merchant.EmployeeCard/saveCoupon', // 保存
    'delCoupon': '/employee/merchant.EmployeeCard/delCoupon', // 删除

    'getUserCardList': '/employee/merchant.EmployeeCardUser/getUserCardList', // 员工卡列表
    'exportUserCardList': '/employee/merchant.EmployeeCardUser/exportUserCardList', // 导出员工卡列表
    'editCardUser': '/employee/merchant.EmployeeCardUser/editCardUser', // 编辑
    'saveCardUser': '/employee/merchant.EmployeeCardUser/saveCardUser', // 保存
    'delData': '/employee/merchant.EmployeeCardUser/delData', // 删除
    'findUser': '/employee/merchant.EmployeeCardUser/findUser', // 查找
    'loadExcel': '/employee/merchant.EmployeeCardUser/loadExcel', // 查找
    'orderList': '/employee/merchant.EmployeeCardUser/orderList', // 订单列表
    'cardLogList': '/employee/merchant.EmployeeCard/cardLogList', // 核销列表
    'cardLogStorestaffList': '/employee/storestaff.EmployeeCardOrder/cardLogList', // 核销列表 店员端

    'paymentScan': '/employee/storestaff.EmployeePayCode/deductions', // 扫码核销
    'cardLogExport': '/employee/merchant.EmployeeCard/export', // 导出

    'employLableList': '/employee/merchant.EmployeeCardUser/employLableList', // 员工卡身份标签列表
    'employLableAddOrEdit': '/employee/merchant.EmployeeCardUser/employLableAddOrEdit', // 添加或编辑员工卡身份标签
    'employLableDel': '/employee/merchant.EmployeeCardUser/employLableDel', // 删除员工卡身份标签
    
    'dataStatistics': '/employee/merchant.EmployeeCardLog/dataStatistics', // 财务报表数据统计
	'getStoreConsumerList': '/employee/merchant.EmployeeCardLog/getStoreConsumerList', // 店铺消费列表
 	
	// 充值记录
    'dataRechargeStatistics': '/employee/merchant.EmployeeCardOrder/getEmployeeOrderStatistics', // 数据统计
    'dataRechargeStatisticsExport': '/employee/merchant.EmployeeCardOrder/getEmployeeOrderStatisticsExport', // 数据统计导出
    'dataRechargeOrderExport': '/employee/merchant.EmployeeCardOrder/getEmployeeOrderExport', // 列表导出
    'paymentMode': '/employee/merchant.EmployeeCardOrder/getPayType', // 获取支付方式
 	'getOrderList': '/employee/merchant.EmployeeCardOrder/getEmployeeOrderList', // 获取充值记录列表
	'refundMoney': '/employee/merchant.EmployeeCardOrder/employeeOrderRefund', // 退款
    'employeeCouponRefund': '/employee/merchant.EmployeeCardLog/employeeCouponRefund', //消费券退款 
    
    'isOpenUseMoney': '/employee/merchant.EmployeeCard/isOpenUseMoney', //开启关闭余额消费 
    'getLabelList': '/employee/merchant.EmployeeCardUser/getLabelList', //获取标签列表 
    
    'getSendCouponDateList': '/employee/merchant.EmployeeCard/getSendCouponDateList', //获取发券日期列表 
    'getCalcDateList': '/employee/merchant.EmployeeCard/getCalcDateList', //获取发券日期列表 
    
    'getStaffDataStatistics': '/employee/storestaff.EmployeeCardLog/dataStatistics', // 数据统计

    'delUserCard': '/employee/merchant.EmployeeCardUser/delUserCard', // 批量删除员工
    'openUserCard': '/employee/merchant.EmployeeCardUser/openUserCard', // 开启删除员工
    'closeUserCard': '/employee/merchant.EmployeeCardUser/closeUserCard', // 关闭删除员工
    
    'getClearScoreList': '/employee/merchant.EmployeeCard/getClearScoreList', // 积分清除记录
	
	'staffRefundMoney': '/employee/storestaff.EmployeeCardOrder/employeeOrderRefund', // 退款
    
    'openOrCloseUserCard': '/employee/merchant.EmployeeCardUser/openOrCloseUserCard', // 批量启用/禁用员工

    'getStoreList': '/employee/merchant.EmployeeCardUser/getStoreList', // 获取店员列表
    'lableBindStore': '/employee/merchant.EmployeeCardUser/lableBindStore', // 绑定标签
}
export default employeeMerchantApi
