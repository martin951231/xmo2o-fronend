const employeeMerchantApi = {
    'lifeToolsEmployeeCardList': () => import('@/views/employee/merchant/EmployeeCardList'),
    'editEmployeeCard': () => import('@/views/employee/merchant/modules/editEmployeeCard'),
    

    'lifeToolsEmployeeCardConsumeList': () => import('@/views/employee/merchant/employeeCardConsume'), // 员工卡核销列表
    'lifeToolsEmployeeCardRechargeList': () => import('@/views/employee/merchant/lifeToolsEmployeeCardRecharge'), // 充值记录

    'lifeToolsEmployeeCardConsumeList': () => import('@/views/employee/merchant/employeeCardConsume'),//员工卡核销列表
    'lifeToolsEmployeeCardBillList': () => import('@/views/employee/merchant/employeeCardBill'),//员工卡核销列表
    'lifeToolsEmployeeCardClearScoreList': () => import('@/views/employee/merchant/employeeCardClearScore'),//员工卡积分清零记录

}
export default employeeMerchantApi