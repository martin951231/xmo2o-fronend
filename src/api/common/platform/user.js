/**
 *******************
 *   @author mrdeng
 *   @date 2021-05-24
 *   @description 平台消息推送接口
 *******************
 */
const mailPlatformApi = {
    mailList: '/common/platform.user.Mail/mailList', //首页重要配置提示
    mailEdit: '/common/platform.user.Mail/editMail', //首页重要配置提示
    delData: '/common/platform.user.Mail/delData', //删除
    addData: '/common/platform.user.Mail/addData', //新增数据
    getComplaintList:'/complaint/platform.Complaint/getList', // 投诉列表
    getComplaintTypeList: 'complaint/platform.Complaint/getTypeList', // 获取业务类型
    changeComplaintStatus: '/complaint/platform.Complaint/changeStatus', // 投诉状态更改
    deleteComplaint: '/complaint/platform.Complaint/delete', // 投诉删除

    getComplaintGroupList: '/complaint/platform.ComplaintGroup/getList', // 投诉业务类型列表
    addComplaintGroup: '/complaint/platform.ComplaintGroup/add', // 投诉业务类型-添加
    editComplaintGroup: '/complaint/platform.ComplaintGroup/edit', // 投诉业务类型-编辑
    delComplaintGroup: '/complaint/platform.ComplaintGroup/del', // 投诉业务类型-删除
    addComplaintGroupType: '/complaint/platform.ComplaintGroupType/add', // 举报类型添加
    editComplaintGroupType: '/complaint/platform.ComplaintGroupType/edit', // 举报类型编辑
    getComplaintGroupTypeList: '/complaint/platform.ComplaintGroupType/getList', // 举报类型列表
    delComplaintGroupType: '/complaint/platform.ComplaintGroupType/del', // 举报类型删除
}

export default mailPlatformApi