/**
 * @author deng
 * @date 2021-05-7
 * @type {{getSearchHotList: string}}
 * @description 接口对应地址
 */

const merchantPlatformApi = {
    'getStoreCategoryList': '/merchant/platform.MerchantStoreCategory/getStoreCategoryList',
    'editStoreCategory': '/merchant/platform.MerchantStoreCategory/editStoreCategory',
    'saveStoreCategory': '/merchant/platform.MerchantStoreCategory/saveStoreCategory',
    'delStoreCategory': '/merchant/platform.MerchantStoreCategory/delStoreCategory',
    'updateSort': '/merchant/platform.MerchantStoreCategory/updateSort',
    'getCorrList': '/merchant/platform.Corr/searchCorr',
    'getCorrDetails': '/merchant/platform.Corr/getCorrDetails',
    'getEditCorr': '/merchant/platform.Corr/getEditCorr',

    'getPositionList': '/merchant/platform.Position/getPositionList',   // 岗位列表
    'getPositionCreate': '/merchant/platform.Position/getPositionCreate',   // 岗位操作
    'getPositionInfo': '/merchant/platform.Position/getPositionInfo',   // 岗位详情
    'getPositionCategoryList': '/merchant/platform.Position/getPositionCategoryList',   // 岗位分类
    'getPositionDelAll': '/merchant/platform.Position/getPositionDelAll',   // 岗位删除

    'getTechnicianList': '/merchant/platform.Technician/getTechnicianList',   // 技师认证列表
    'getTechnicianView': '/merchant/platform.Technician/getTechnicianView',   // 技师认证查看
    'getTechnicianExamine': '/merchant/platform.Technician/getTechnicianExamine',   // 技师认证审核
    'getTechnicianDel': '/merchant/platform.Technician/getTechnicianDel',   // 技师认证拉黑

    'getContractList': '/common/platform.merchant.MerchantContract/getList',   // 商家签约合同列表
    'addResignTip': '/common/platform.merchant.MerchantContract/addResignTip',   // 重新签署合同

    'getMerchantYibaoInfo': '/merchant/platform.MerchantYibao/getMerchantYibaoInfo',//查看入网信息

}
export default merchantPlatformApi