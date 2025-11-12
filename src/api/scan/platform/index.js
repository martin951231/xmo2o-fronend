const scanPlatformApi = {
    index: '/scan/platform.ScanSend/index', // 扫码列表
    editData: '/scan/platform.ScanSend/edit', // 扫码更新
    addData: '/scan/platform.ScanSend/add', // 扫码添加
    setStatus: '/scan/platform.ScanSend/setStatus', // 更新状态
    recordList: '/scan/platform.ScanSend/getRecordList', // 领取记录
    setConfig: '/scan/platform.ScanSend/setConfig', // 设置提示语
    exportEwm: '/scan/platform.ScanSend/exportEwm', // 导出二维码
    exportRecordList: '/scan/platform.ScanSend/exportRecordList', // 导出领取记录列表
    recordAllList: '/scan/platform.ScanSend/getAllRecordList', // 领取记录
    singleDelete: '/scan/platform.ScanSend/singleDelete', // 单个记录删除
    multipleDelete: '/scan/platform.ScanSend/multipleDelete', // 批量记录删除
}
export default scanPlatformApi