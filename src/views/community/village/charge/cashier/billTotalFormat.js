// 仅用于账单列表底部合计的显示，保留接口中的金额单位。
export function formatBillTotal(value) {
    const text = String(value == null ? '' : value).trim()
    const unit = /元$/.test(text) ? '元' : ''
    const amount = Number(text.replace(/[,，]/g, '').replace(/元$/, '').trim())
    const money = Number.isFinite(amount) ? amount : 0
    return money.toLocaleString('zh-CN', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        useGrouping: false
    }) + unit
}
