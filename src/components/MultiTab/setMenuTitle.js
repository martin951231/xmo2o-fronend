// 针对有些页面需要根据参数设置不同的title

export function setCustomTitle(route) {
    const path = route.path
    // const fullPath = route.fullPath
    const query = route.query
    let title = ''
    switch (path) {
        case '/pay/platform.paytype/index':
            if (query.code == 'wechat') {
                title = '微信支付配置'
            } else if (query.code == 'alipay') {
                title = '支付宝支付配置'
            }
            break
        case '/merchant/merchant.foodshop/editPrintRule':
            if (!query.id) {
                title = '新版餐饮打印设置新增'
            }
            break
        case '/merchant/merchant.mall/editShipping':
            if (!query.id) {
                title = '新增满包邮'
            }
            break
        case '/merchant/merchant.mall/editPrepare':
            if (!query.id) {
                title = '新增预售'
            }
            break
        case '/merchant/merchant.mall/editPeriodic':
            if (!query.id) {
                title = '新增周期购'
            }
            break
        case '/merchant/merchant.mall/editMinusDiscount':
            if (!query.id) {
                title = '新增满减满折'
            }
            break
        case '/merchant/merchant.mall/editGoods':
            if (!query.goods_id) {
                title = '新增商品'
            }
            break
        case '/merchant/merchant.mall/editReached':
            if (!query.id) {
                title = '新增N元N件'
            }
            break
        case '/merchant/merchant.mall/editLimited':
            if (!query.id) {
                title = '新增秒杀'
            }
            break
        case '/merchant/merchant.mall/editGroup':
            if (!query.id) {
                title = '新增拼团'
            }
            break
        case '/merchant/merchant.mall/EditGive':
            if (!query.id) {
                title = '新增满赠'
            }
            break
        case '/merchant/merchant.mall/editBargain':
            if (!query.id) {
            title = '新增砍价'
            }
            break
        case '/village/village.workWx.channelCode/addCode':
            if (!query.code_id) {
                title = '添加渠道码'
            } else {
                title = '编辑渠道码'
            }
            break
        case '/property/property.workWx.channelCode/addCode':
            if (!query.code_id) {
                title = '添加渠道码'
            } else {
                title = '编辑渠道码'
            }
            break

        case '/douyin/merchant.Activity/ActivityAdd':
            if (!query.tools_id) {
                title = '添加活动'
            } else {
                title = '编辑活动'
            }
            break

        case '/merchant/merchant.life_tools/TicketEdit':
            if (!query.id) {
                title = '添加门票'
            } else {
                title = '编辑门票'
            }
            break
        case '/merchant/merchant.life_tools/Edit':
            if (!query.tools_id) {
                if(query.type == 'stadium'){
                    title = '添加体育馆';
                }else{
                    title = '添加体育课程';
                }
                
            } else {
                if(query.type == 'stadium'){
                    title = '编辑体育馆';
                }else{
                    title = '编辑体育课程';
                }
            }
            break
        default:
            break;
    }
    return title
}
