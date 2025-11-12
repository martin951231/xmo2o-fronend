/**
 * 后台问答管理
 */
const QAComponents = {
    //***********************商家后台***********************
    // 问答列表
    'MerchantStoreAskLists': () => import('@/views/qa/merchant/AskLists'),

    //***********************系统后台***********************
    'PlatformAskLists': () => import('@/views/qa/platform/AllAsk'),
}
export default QAComponents