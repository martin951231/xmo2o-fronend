/**
 *******************
 *   系统后台一卡通管理
 *******************
 */
const InternalCardPlatformComponents = {
    InternalCardPlatformSettlementManage: () => import('@/views/InternalCard/platform/SettlementManage'), // 结算管理
    InternalCardPlatformSettlementDetails: () => import('@/views/InternalCard/platform/SettlementDetails'), // 结算明细
    InternalCardPlatformSettlementLog: () => import('@/views/InternalCard/platform/SettlementLog'), // 结算记录
    InternalCardPlatformDetails: () => import('@/views/InternalCard/platform/CardDetails'), // 卡明细
}
export default InternalCardPlatformComponents
