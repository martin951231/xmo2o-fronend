const storeMerchantApi = {
    getLists: '/merchant/merchant.MerchantShopManagement/storeList', // 新版商家中心--店铺--店铺列表
    getStoreMsg: '/merchant/merchant.MerchantShopManagement/storeMsg', // 新版商家中心--店铺--名称--店铺信息
    getStaffList: '/merchant/merchant.MerchantShopManagement/staffManagement', // 新版商家中心--店铺--店员列表
    staffEdit: '/merchant/merchant.MerchantShopManagement/staffEdit', // 新版商家中心--店铺--店员--编辑
    staffSet: '/merchant/merchant.MerchantShopManagement/staffSet', // 新版商家中心--店铺--店员--获取店员编辑信息
    staffDel: '/merchant/merchant.MerchantShopManagement/staffDelete', // 新版商家中心--店铺--店员--删除店员
    storeDiscount: '/merchant/merchant.MerchantShopManagement/discount', // 新版商家中心--店铺--店员--获取店铺优惠
    discountMsg: '/merchant/merchant.MerchantShopManagement/discountMsg', // 新版商家中心--店铺--店员--获取店铺优惠信息
    discountDel: '/merchant/merchant.MerchantShopManagement/discountDelete', // 新版商家中心--店铺--店员--删除店铺优惠信息
    discountAdd: '/merchant/merchant.MerchantShopManagement/discountAdd', // 新版商家中心--店铺--店员--店铺优惠新增编辑
    storeSliderList: '/merchant/merchant.MerchantShopManagement/storeSlider', // 新版商家中心--店铺--店员--店铺导航列表
    storeSliderEdit: '/merchant/merchant.MerchantShopManagement/storeSliderAdd', // 新版商家中心--店铺--店员--店铺导航编辑
    storeSliderDel: '/merchant/merchant.MerchantShopManagement/sliderDel', // 新版商家中心--店铺--店员--店铺导航删除
    storeSliderMsg: '/merchant/merchant.MerchantShopManagement/storeSliderMsg', // 新版商家中心--店铺--店员--店铺导航信息
    storeAuthEdit: '/merchant/merchant.MerchantShopManagement/authEdit', // 新版商家中心--店铺--店员--店铺资质编辑
    storeAuthMsg: '/merchant/merchant.MerchantShopManagement/authMsg', // 新版商家中心--店铺--店员--店铺资质信息
    storeEdit: '/merchant/merchant.MerchantShopManagement/storeEdit', // 新版商家中心--店铺编辑
    storeEditSave: '/merchant/merchant.MerchantShopManagement/saveStoreEdit', // 新版商家中心--店铺编辑
    storeAddSave: '/merchant/merchant.MerchantShopManagement/addStoreEdit', // 新版商家中心--店铺编辑
    getUrlencode: '/merchant/merchant.MerchantShopManagement/getUrlencode', // 百度云识别图文
    storeDel: '/merchant/merchant.MerchantShopManagement/storeDel', // 删除店铺
    getStreet:'/merchant/merchant.MerchantShopManagement/getStreet', // 新版商家中心--店铺--获取街道信息
    jobList: '/merchant/merchant.JobPerson/jobList', // 技师列表
    delJob: '/merchant/merchant.JobPerson/delJob', // 解除技师
    selJob: '/merchant/merchant.JobPerson/selJob', // 选择岗位
    resJob: '/merchant/merchant.JobPerson/resJob', // 验证账号
    addJob: '/merchant/merchant.JobPerson/addJob', // 新增技师
    authentica: '/merchant/merchant.JobPerson/authentica', // 提交申请
    editJob: '/merchant/merchant.JobPerson/editJob', // 提交申请
    updateJob: '/merchant/merchant.JobPerson/updateJob', // 提交申请

    getPersonList: '/merchant/merchant.StoreMarketingPerson/getPersonList', // 分销列表
    regPhone: '/merchant/merchant.StoreMarketingPerson/regPhone', // 验证手机号
    editPerson: '/merchant/merchant.StoreMarketingPerson/editPerson', // 编辑营销人员
    addPerson: '/merchant/merchant.StoreMarketingPerson/addPerson', // 添加保存分销员
    savePerson: '/merchant/merchant.StoreMarketingPerson/savePerson', // 修改保存数据
    delPerson: '/merchant/merchant.StoreMarketingPerson/delPerson', // 删除数据

    storeMarketingRecord: '/store_marketing/merchant.StoreMarketingPerson/storeMarketingRecord', // 分销记录列表
    getCircleList: '/merchant/merchant.MerchantShopManagement/getCircleList', // 获取商圈列表

    getPickAddress: '/merchant/merchant.MerchantShopManagement/getPickAddress', // 获取商家自提点列表

    staffLogin: '/merchant/merchant.MerchantShopManagement/staffLogin', // 店员自动登录
}
export default storeMerchantApi