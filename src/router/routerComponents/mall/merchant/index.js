/**
 * 商家后台商城3.0管理
 * @author zhumengqun
 * @date 2020-09-21
 */
const MerchantMallComponents = {
  'MerchantMallStoreList': () => import('@/views/mall/merchant/StoreList'),//店铺列表
  'MerchantMallActiveList': () => import('@/views/mall/merchant/ActiveList'),//营销活动列表
  'MerchantMallPerfectedStore': () => import('@/views/mall/merchant/PerfectedStore'),//完善店铺配置

  'MerchantMallShippingList': () => import('@/views/mall/merchant/ShippingList'), // 营销活动-满包邮列表
  'MerchantMallEditShipping': () => import('@/views/mall/merchant/ShippingEdit'), // 营销活动-满包邮编辑
  'MerchantMallEditShippingLook': () => import('@/views/mall/merchant/ShippingEdit'), // 营销活动-满包邮编辑

  'MerchantMallGoodsList': () => import('@/views/mall/merchant/GoodsList'), // 商品列表
  'MerchantMallEditGoods': () => import('@/views/mall/merchant/GoodsEdit'), // 添加、编辑商品
  
  'MallCommodityExamine': () => import('@/views/mall/merchant/GoodsEdit'),//商城商品审核编辑详情

  'MerchantMallgiveList': () => import('@/views/mall/merchant/GiveList'), // 营销活动-满赠列表
  'MerchantMallEditGive': () => import('@/views/mall/merchant/GiveEdit'), // 营销活动-满赠编辑
  'MerchantMallEditGiveLook': () => import('@/views/mall/merchant/GiveEdit'), // 营销活动-满赠编辑

  'MerchantMallPrepareList': () => import('@/views/mall/merchant/PrepareList'), // 营销活动-预售列表
  'MerchantMallEditPrepare': () => import('@/views/mall/merchant/PrepareEdit'), // 营销活动-预售编辑
  'MerchantMallEditPrepareLook': () => import('@/views/mall/merchant/PrepareEdit'), // 营销活动-预售查看

  'MerchantMallRobotList': () => import('@/views/mall/merchant/RobotList'), // 营销活动-拼团机器人列表
  'MerchantMallGroupList': () => import('@/views/mall/merchant/GroupList'), // 营销活动-拼团活动列表
  'MerchantMallGroupBookingDetail': () => import('@/views/mall/merchant/GroupBookingDetail'), // 营销活动-拼团活动详情
  'MerchantMallEditGroup': () => import('@/views/mall/merchant/GroupEdit'), // 营销活动-拼团活动添加、编辑
  'MerchantMallEditGroupLook': () => import('@/views/mall/merchant/GroupEdit'), // 营销活动-拼团活动查看

  'MerchantMallPeriodicList': () => import('@/views/mall/merchant/PeriodicList'), // 营销活动-周期购列表
  'MerchantMallEditPeriodic': () => import('@/views/mall/merchant/PeriodicEdit'), // 营销活动-周期购编辑
  'MerchantMallEditPeriodicLook': () => import('@/views/mall/merchant/PeriodicEdit'), // 营销活动-周期购查看

  'MerchantMallMinusDiscountList': () => import('@/views/mall/merchant/MinusDiscountList'), // 营销活动-满减满折列表
  'MerchantMallEditMinusDiscount': () => import('@/views/mall/merchant/MinusDiscountEdit'), // 营销活动-满减满折编辑
  'MerchantMallEditMinusDiscountLook': () => import('@/views/mall/merchant/MinusDiscountEdit'), // 营销活动-满减满折编辑

  'MerchantMallReachedList': () => import('@/views/mall/merchant/ReachedList'), // 营销活动-N元N件列表
  'MerchantMallReachedEdit': () => import('@/views/mall/merchant/ReachedEdit'), // 营销活动-N元N件编辑
  'MerchantMallReachedEditLook': () => import('@/views/mall/merchant/ReachedEdit'), // 营销活动查看

  'MerchantMallLimitedList': () => import('@/views/mall/merchant/LimitedList'), // 营销活动-秒杀列表
  'MerchantMallEditLimited': () => import('@/views/mall/merchant/LimitedEdit'), // 营销活动-秒杀编辑
  'MerchantMallEditLimitedLook': () => import('@/views/mall/merchant/LimitedEdit'), // 营销活动-秒杀查看

  'MerchantMallBargainList': () => import('@/views/mall/merchant/BargainList'), // 营销活动-砍价活动列表
  'MerchantMallEditBargain': () => import('@/views/mall/merchant/BargainEdit'), // 营销活动-砍价活动添加、编辑
  'MerchantMallEditBargainLook': () => import('@/views/mall/merchant/BargainEdit'), // 营销活动-砍价活动查看

  'MerchantMallGoodsSortList': () => import('@/views/mall/merchant/GoodsSortList'), // 分类列表
  'MerchantMallReplyList': () => import('@/views/mall/merchant/ReplyList'), // 评论列表
  'MerchantMallOrder': () => import('@/views/mall/merchant/OrderManage'), // 订单管理
  'MerchantMallOrderDetail': () => import('@/views/mall/merchant/OrderDetail'), // 订单详情

  'MerchantMallTemplateList': () => import('@/views/mall/merchant/TemplateList'),//运费模板列表
  'MerchantMallTemplateEdit': () => import('@/views/mall/merchant/TemplateEdit'),//新增运费模板
}
export default MerchantMallComponents