/**
 *******************
 *   @author 郑亚莉
 *   @date 2020-05-14
 *   @description 前端路由-组件对应表
 *******************
 */

import {
    BasicLayout,
    BlankLayout,
    PageView,
    RouteView,
    AppLayout,
    SocialActivityBasicLayout
} from '@/layouts'
import userPlaformComponents from './common/plaform/user'
import weixinPlaformComponents from './common/plaform/weixin'
import robotPlaformComponents from './common/plaform/robot'
import exampleComponents from './example'
import foodshopPlatformComponents from './foodshop/platform'
import configPlatformComponents from './config/config'
import ConfigStreetComunityComponents from './community/config'
import payComponents from './pay'
import MerchantFoodshopComponents from "./foodshop/merchant";
import MerchantCardComponents from "./card/merchant";
import pageVillageComunityComponents from "./community/village/index";
import packagePlatformComponents from "./community/system/platform";
import pagePropertyComunityComponents from "./community/property/index";
import packageStreetCommunityComponents from "./community/streetCommunity/index";
import MerchantMallComponents from "./mall/merchant/index"
import MerchantStoreComponents from "./merchant/store/index"
import MerchantComponents from "./merchant/platform/index"
import MallEInvoiceComponents from "./mall/merchant/invoice"
import MallPlatformComponents from './mall/platform/index'
import mallGoodsCategoryCompoment from './mall/mallGoodsCategory/index'
import CouponPlatformComponents from "./coupon/platform"
import PlatformGroupComponents from "./group/platform"
import MerchantGroupComponents from "./group/merchant"
import customPageComponents from './common/plaform/customPage'
import GrowGrassComponents from './grow_grass/merchant'
import MarriageHelperComponents from './marriage_helper/merchant'
import AtlasComponents from './atlas/merchant'
import QAComponents from './qa'
import pageHouseMeterComponents from "@/router/routerComponents/community/houseMeter";
import PrivateFlowComponents from './common/privateflow'
import lifeToolsPlatformComponents from "./life_tools/platform";
import lifeToolsMerchantComponents from "./life_tools/merchant";
import ScanPlatComponents from './scan/platform/index';
import MerchantRecruitComponents from "./recruit/merchant";
import PlatformRecruitComponents from "./recruit/platform";
import GrowGrassPlatformComponents from "./grow_grass/platform";
import MarketingPlatformComponents from './new_marketing/platform/index';
import MarketingMerchantComponents from './new_marketing/merchant/index';
import platformMallPageViewComponents from './mall/platform/index';
import douyinMerchant from './douyin/merchant';
import EmployeeMerchantComponents from './employee/merchant/index';
import EmployeePlatformComponents from './employee/platform/index';
import bankingPlatformComponents from './banking/platform/index';
import AgencyListformComponents from './life_tools/merchant/index';
import DistributorListformComponents from './life_tools/merchant/index';
import ScenicTicketSystemComponents from './life_tools/platform/index';
import SportsTicketSystemComponents from './life_tools/platform/index';
import Real_estatePlatformComponents from './real_estate/platform/index';
import MerchantWarnComponents from './warn/merchant';
import MerchantShopNewComponents from './shop_new/merchant';
import PlatFormShopNewComponents from './shop_new/platform';

import MerchantApplicationComponents from './merchant/application/index';
import AppointPlatformComponents from './appoint/platform/index'//新版预约页面装修
import AppointMerchantComponents from './appoint/merchant/index'
import PlatFormClassifyInfoComponents from './classify_info/platform';
import PlatformViewPageComponents from './common/plaform/viewpage';


// 商家关于用户端的配置项
import MerchantClientComponents from './merchant/client/index'
// 商家
import MerchantMerComponents from './merchant/merchant/index'
import hotWordManageComponents from './common/plaform/hotWordManage';
import MerchantLiveBroadcastComponents from './live_broadcast/merchant/index';//商家后台直播页面


// 转盘抽奖
import ActivityPlatformComponents from './activity/platform'

import thirdRobotManageComponents from './common/plaform/thirdRobotManage';

import MerchanliveBroadcastComponents from './liveBroadcast/merchant'
import PlatFormLiveBroadcastComponents from './liveBroadcast/platform'

import SystemChannelCode from './channel_code/index'

//一卡通
import InternalCardPlatformComponents from './InternalCard/platform/index'
import InternalCardMerchantComponents from './InternalCard/merchant/index'

//商城系统
import buildingPlatformComponents from  './building/platform/index'


//跑腿
import PaotuiPlatformComponents from './paotui/index'

//问卷调查
import QuestionnaireSurveyComponents from  './common/plaform/QuestionnaireSurvey'

// 社群活动
import SocialActivityComponents from './social_activity/index'
import SocialActivityPlatformComponents from './social_activity/platform/index'


const routerComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  AppLayout: AppLayout,
  SocialActivityBasicLayout: SocialActivityBasicLayout,
  // 异常页面
  '403': () => import('@/views/exception/403'),
  '404': () => import('@/views/exception/404'),
  '500': () => import('@/views/exception/500'),
  'Exception403': () => import('@/views/exception/403'),
  'Exception404': () => import('@/views/exception/404'),
  'Exception500': () => import('@/views/exception/500'),
  // 示例页面
  ...exampleComponents,
  // 首页
  'PlatformIndex': () => import('@/views/home/platform/index'),
  // 动态页面
  ...userPlaformComponents,
  ...weixinPlaformComponents,
  ...robotPlaformComponents,
  ...foodshopPlatformComponents,
  ...configPlatformComponents,
  ...ConfigStreetComunityComponents,
  ...payComponents,
  ...MerchantFoodshopComponents,
  ...MerchantCardComponents,
  ...pageVillageComunityComponents,
  ...packagePlatformComponents,
  ...pagePropertyComunityComponents,
  ...packageStreetCommunityComponents,
  ...MerchantMallComponents,
  ...MerchantStoreComponents,
  ...MerchantComponents,
  ...MallEInvoiceComponents,
  ...MallPlatformComponents,
  ...mallGoodsCategoryCompoment,
  ...CouponPlatformComponents,
  ...PlatformGroupComponents,
  ...MerchantGroupComponents,
  ...customPageComponents,
  ...GrowGrassComponents,
  ...MarriageHelperComponents,
  ...AtlasComponents,
  ...QAComponents,
  ...pageHouseMeterComponents,
  ...lifeToolsPlatformComponents,
  ...lifeToolsMerchantComponents,
  ...PrivateFlowComponents,
  ...ScanPlatComponents,
  ...MerchantRecruitComponents,
  ...PlatformRecruitComponents,
  ...GrowGrassPlatformComponents,
  ...MarketingPlatformComponents,
  ...MarketingMerchantComponents,
  ...platformMallPageViewComponents,
  ...EmployeeMerchantComponents,
  ...EmployeePlatformComponents,
  ...bankingPlatformComponents,
  ...AgencyListformComponents,
  ...DistributorListformComponents,
  ...ScenicTicketSystemComponents,
  ...SportsTicketSystemComponents,
  ...douyinMerchant,
  ...Real_estatePlatformComponents,
  ...MerchantWarnComponents,
  ...hotWordManageComponents,
  ...MerchantShopNewComponents,
  ...MerchantWarnComponents,
  ...PlatFormShopNewComponents,
  ...MerchantWarnComponents,
  ...MerchantClientComponents,
  ...MerchantMerComponents,
  ...MerchantLiveBroadcastComponents,
  ...MerchantMerComponents,
  ...MerchantApplicationComponents,
  ...MerchantMerComponents,
  ...AppointPlatformComponents,
  ...AppointMerchantComponents,
  ...ActivityPlatformComponents,
  ...thirdRobotManageComponents,
  ...PlatFormClassifyInfoComponents,
  ...MerchanliveBroadcastComponents,
  ...PlatFormLiveBroadcastComponents,
  ...SystemChannelCode,
  ...InternalCardPlatformComponents,
  ...InternalCardMerchantComponents,
  ...PlatformViewPageComponents,
  ...buildingPlatformComponents,
  ...PaotuiPlatformComponents,
  ...QuestionnaireSurveyComponents,
  ...SocialActivityComponents,
  ...SocialActivityPlatformComponents,
}
export default routerComponents
