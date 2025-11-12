const shopNewMerchantApi = {
    // 集点返券start
    getRebateList: '/shop/merchant.Rebate/getList', // 集点返券列表
    changeRebateStatus: '/shop/merchant.Rebate/changeStatus', // 集点返券列表修改状态
    rebateShowDetail: '/shop/merchant.Rebate/showDetail', // 集点返券列表活动详情
    addRebate: '/shop/merchant.Rebate/add', // 集点返券列表添加
    editRebate: '/shop/merchant.Rebate/edit', // 集点返券编辑
    getGoodsList: '/shop/merchant.Rebate/getGoodsList', // 获取商品详情
    deleteRebate: '/shop/merchant.Rebate/delete', // 删除
    getRebateCouponList: '/shop/merchant.Rebate/getCouponList', // 优惠券列表
    // 集点返券 end
    // 店铺装修导航栏列表
    shopEditSliderList: '/merchant/merchant.ShopSlider/getSlider',
    // 店铺装修导航栏导航添加
    shopEditAddSlider: '/merchant/merchant.ShopSlider/addSlider',
    // 店铺装修导航栏导航编辑
    shopEditEditSlider:'/merchant/merchant.ShopSlider/editSlider',
    // 店铺装修导航栏导航删除
    shopEditDelSlider:'/merchant/merchant.ShopSlider/delSlider'
}
export default shopNewMerchantApi
