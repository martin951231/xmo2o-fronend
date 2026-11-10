import Vue from 'vue'
import ManualBillModal from '@/views/community/village/charge/cashier/manualBillModal.vue'
import villageApi from '@/api/community/village'

const flushPromises = () => new Promise(resolve => setImmediate(resolve))

function createModal() {
    const Modal = Vue.extend(ManualBillModal)
    const vm = new Modal()
    vm.request = jest.fn().mockResolvedValue({})
    vm.$message = { warning: jest.fn(), success: jest.fn() }
    return vm
}

function selectRule(vm) {
    vm.form.project_id = 11
    vm.form.rule_id = 22
    vm.form.unit_price = 310
    vm.form.service_start_time = '2026-08-01'
    vm.form.service_end_time = '2026-08-31'
    vm.ruleInfo = { fees_type_status: 1, bill_date_ranges: [] }
}

describe('single parking manual bill', () => {
    let vm
    beforeEach(() => { vm = createModal() })
    afterEach(() => { vm.$destroy() })

    test('opens a position with clean room state and requests parking projects', async () => {
        vm.roomInfo = { property_service_end_date: '2020-01-01' }
        vm.ruleList = [{ id: 99 }]
        vm.projectList = [{ id: 98 }]
        vm.openPosition(42)
        expect(vm.roomId).toBe(0)
        expect(vm.roomInfo).toEqual({})
        expect(vm.ruleList).toEqual([])
        expect(vm.projectList).toEqual([])
        expect(vm.modalTitle).toBe('新增车位管理费账单')
        expect(vm.targetAreaLabel).toBe('车位面积')
        expect(vm.request).toHaveBeenCalledWith(villageApi.manualBillMeta, {
            room_id: 0, position_id: 42, bill_kind: 'parking_management',
        })
        await flushPromises()
    })

    test('switching back to a room resets the position and preserves room date limits', () => {
        vm.loadMeta = jest.fn()
        vm.openPosition(42)
        vm.open(7)
        vm.roomInfo = { property_service_end_date: '2026-08-15' }
        selectRule(vm)
        expect(vm.positionId).toBe(0)
        expect(vm.billKind).toBe('bill')
        expect(vm.applyPropertyServiceEndLimit()).toBe(true)
        expect(vm.form.service_end_time).toBe('2026-08-15')
    })

    test('an old room metadata response cannot overwrite parking projects or area', async () => {
        let resolveRoom
        vm.request.mockImplementationOnce(() => new Promise(resolve => { resolveRoom = resolve }))
        vm.open(7)
        vm.request.mockResolvedValueOnce({ project_list: [{ id: 11 }], target_info: { position_area: 12 } })
        vm.openPosition(42)
        await flushPromises()
        resolveRoom({ project_list: [{ id: 99 }], room_info: { housesize: 200 } })
        await flushPromises()
        expect(vm.projectList).toEqual([{ id: 11 }])
        expect(vm.form.area).toBe(12)
    })

    test('an old room rule list cannot overwrite parking standards', async () => {
        vm.loadMeta = jest.fn()
        vm.open(7)
        vm.form.project_id = 99
        let resolveRoom
        vm.request.mockImplementationOnce(() => new Promise(resolve => { resolveRoom = resolve }))
        vm.getRuleList(99, 'ruleList')
        vm.openPosition(42)
        vm.form.project_id = 11
        vm.request.mockResolvedValueOnce([{ id: 22 }])
        vm.getRuleList(11, 'ruleList')
        await flushPromises()
        resolveRoom([{ id: 100 }])
        await flushPromises()
        expect(vm.ruleList).toEqual([{ id: 22 }])
    })

    test('parking ignores any associated room service date limits', () => {
        vm.loadMeta = jest.fn()
        vm.openPosition(42)
        vm.roomInfo = { property_service_start_date: '2030-01-01', property_service_end_date: '2020-01-01' }
        selectRule(vm)
        expect(vm.getPropertyServiceStartDate()).toBe('')
        expect(vm.applyPropertyServiceEndLimit(true)).toBe(true)
        expect(vm.form.service_end_time).toBe('2026-08-31')
    })

    test('requests parking monthly rules and submits the position instead of a room', async () => {
        vm.loadMeta = jest.fn()
        vm.openPosition(42)
        selectRule(vm)
        vm.getRuleList(11, 'ruleList')
        expect(vm.request).toHaveBeenCalledWith(villageApi.manualBillRuleList, {
            charge_project_id: 11, bill_kind: 'parking_management', room_id: 0, position_id: 42,
        })
        vm.calcMoney()
        expect(vm.request).toHaveBeenCalledWith(villageApi.manualBillCalc, expect.objectContaining({ position_id: 42, room_id: 0 }))
        const onOk = jest.fn()
        vm.$on('ok', onOk)
        vm.form.merge_bill = 0
        vm.form.allow_deposit_deduct = false
        vm.createBill()
        expect(vm.request).toHaveBeenCalledWith(villageApi.manualBillCreate, expect.objectContaining({
            room_id: 0, position_id: 42, bill_kind: 'parking_management', generate_mode: 'day',
            merge_bill: 0, allow_deposit_deduct: 0,
            service_start_time: '2026-08-01', service_end_time: '2026-08-31',
        }))
        await flushPromises()
        expect(onOk).toHaveBeenCalledTimes(1)
        expect(vm.visible).toBe(false)
        expect(vm.loading).toBe(false)
    })

    test('a rejected unbound standard is cleared and cannot be submitted', async () => {
        vm.loadMeta = jest.fn()
        vm.openPosition(42)
        selectRule(vm)
        vm.request.mockRejectedValueOnce(new Error('当前车位未绑定所选收费标准'))
        vm.handleRuleChange(22)
        await flushPromises()
        expect(vm.form.rule_id).toBeUndefined()
        expect(vm.form.unit_price).toBe(0)
        expect(vm.ruleInfo).toEqual({})
        vm.request.mockClear()
        vm.createBill()
        expect(vm.request).not.toHaveBeenCalled()
        expect(vm.$message.warning).toHaveBeenCalled()
    })

    test('an old rule rejection cannot clear a newly selected rule', async () => {
        vm.loadMeta = jest.fn()
        vm.openPosition(42)
        selectRule(vm)
        let rejectOld
        vm.request.mockImplementationOnce(() => new Promise((resolve, reject) => { rejectOld = reject }))
        vm.handleRuleChange(22)
        vm.form.rule_id = 23
        vm.ruleInfo = { charge_name: '新标准' }
        rejectOld(new Error('旧请求失败'))
        await flushPromises()
        expect(vm.form.rule_id).toBe(23)
        expect(vm.ruleInfo.charge_name).toBe('新标准')
    })

    test('existing bill dates block overlaps across standards but allow the following day', () => {
        vm.loadMeta = jest.fn()
        vm.openPosition(42)
        selectRule(vm)
        vm.ruleInfo.bill_date_ranges = [{ project_id: 11, rule_id: 99, start_date: '2026-08-10', end_date: '2026-08-20' }]
        expect(vm.disabledBillDate({ format: () => '2026-08-15' })).toBe(true)
        vm.createBill()
        expect(vm.request).not.toHaveBeenCalled()
        vm.form.service_start_time = '2026-08-21'
        expect(vm.validateBillDateRange()).toBe(true)
        vm.form.service_start_time = '2026-09-01'
        expect(vm.validateBillDateRange()).toBe(false)
    })

    test('a selected project continues from the latest bill across standards on the next day', () => {
        vm.loadMeta = jest.fn()
        vm.openPosition(42)
        selectRule(vm)
        vm.ruleInfo.bill_date_ranges = [
            { project_id: 11, rule_id: 22, start_date: '2026-07-01', end_date: '2026-07-31' },
            { project_id: 11, rule_id: 99, start_date: '2026-08-01', end_date: '2026-08-31' },
            { project_id: 12, rule_id: 22, start_date: '2026-09-01', end_date: '2026-09-30' },
        ]
        expect(vm.fillStartTimeByLatestBill()).toBe(true)
        expect(vm.form.service_start_time).toBe('2026-09-01')
        expect(vm.form.service_end_time).toBe('2027-08-31')
    })
})
