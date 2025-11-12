const real_estatePlatformApi = {
    /* 购买流程start */
    getList: '/real_estate/platform.Process/getList',// 购买流程-列表
    payNameList: '/real_estate/platform.Process/payNameList',// 购买流程-付款类型列表   
    add: '/real_estate/platform.Process/add',// 购买流程-添加   
    edit: '/real_estate/platform.Process/edit',// 购买流程-编辑   
    show: '/real_estate/platform.Process/show',// 购买流程-详情   
    delete: '/real_estate/platform.Process/delete',// 购买流程-删除
    changeSort: '/real_estate/platform.Process/changeSort',// 购买流程-步骤值修改
    /* 购买流程end */

    /* 项目列表start */
    getProjectList: 'real_estate/platform.Project/getList',// 列表
    addProjectList: 'real_estate/platform.Project/add',// 添加
    editProjectList: 'real_estate/platform.Project/edit',// 编辑
    showProjectList: 'real_estate/platform.Project/show',// 详情
    deleteProjectList: 'real_estate/platform.Project/delete',// 删除
    /* 项目列表end */

    /* 房产类型start */
    getPropertyTypeList: 'real_estate/platform.PropertyType/getList',// 列表
    addPropertyTypeList: 'real_estate/platform.PropertyType/add',// 添加
    editPropertyTypeList: 'real_estate/platform.PropertyType/edit',// 编辑
    showPropertyTypeList: 'real_estate/platform.PropertyType/show',// 详情
    deletePropertyTypeList: 'real_estate/platform.PropertyType/delete',// 删除
    /* 房产类型end */

    /* 购房意愿start */
    getOtherList: 'real_estate/platform.Wish/getOtherList',// 其他类型列表
    getWishList: 'real_estate/platform.Wish/getList',// 列表
    changeProcess: 'real_estate/platform.Wish/changeProcess',// 单个/批量修改状态
    changeStatus: 'real_estate/platform.Wish/changeStatus',// 佣金支付状态修改
    addWish: 'real_estate/platform.Wish/add',// 添加
    editWish: 'real_estate/platform.Wish/edit',// 编辑
    showWish: 'real_estate/platform.Wish/show',// 详情
    exportData: 'real_estate/platform.Wish/exportData',// 导出数据列表
    deleteWish: 'real_estate/platform.Wish/delete',// 删除
    getUserList: 'real_estate/platform.Wish/getUserList',// 置业顾问列表
    /* 购房意愿end */

  }
  export default real_estatePlatformApi
  