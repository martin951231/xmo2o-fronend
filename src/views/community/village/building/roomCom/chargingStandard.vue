<template>
    <div class="charging_standard">
        <a-table :pagination="pageInfo" :columns="chargeColumns" :loading="tableLoading" :data-source="tableList" @change="tableChange">
            <span slot="action" slot-scope="text, record">
                <a-popconfirm title="是否删除当前项？" placement="topLeft" ok-text="是" cancel-text="否" @confirm="deleteStandard(record)">
                    <a style="color: red;">删除</a>
                </a-popconfirm>
            </span>
        </a-table>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        watch,
        reactive,
        onMounted,
        onUpdated,
        defineComponent
    } from '@vue/composition-api';
    export default defineComponent({
        props: {
            roomParams: {
                type: Object,
                default: ()=>{return {}}
            },
            roomId: {
                type: [String, Number],
                defalut: ''
            }
        },
        setup(props, context) {
            //收费标准
            let chargeColumns = ref([])
            let pageInfo = ref({
                pageSize: 10,
                current: 1,
                total: 0,
                pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
                showSizeChanger: true
            })
            let tableList = ref([])
            let tableLoading = ref(false)
            onMounted(()=>{
                getChargeList()
            })
            const tableChange = ({pageSize, current})=>{
                pageInfo.value.current = current
                pageInfo.value.pageSize = pageSize
                getChargeList()
            }
            const deleteStandard = (record) => {
                Vue.prototype.request('/community/village_api.cashier/delChargeStandardBind', {
                    charge_standard_bind_id: record.bind_id,
                }).then((res) => {
                    Vue.prototype.$message.success('删除成功！')
                    pageInfo.value.current = 1
                    pageInfo.value.pageSize = 10
                    getChargeList()
                })
            }
            const getChargeList = ()=>{
                tableLoading.value = true
                Vue.prototype.request('/community/village_api.Building/getRoomBindChargeRuleList', {
                    vacancy_id: props.roomId,
                    page: pageInfo.value.current,
                    limit: pageInfo.value.pageSize
                }).then((res) => {
                    tableList.value = res.list
                    pageInfo.value.total = res.count
                    tableLoading.value = false
                }).catch(res=>{
                    tableLoading.value = false
                })
            }
            chargeColumns.value = [
                { title: '所属收费科目', dataIndex: 'subject_name', key: 'subject_name' },
                { title: '收费项目名称', dataIndex: 'project_name', key: 'project_name' },
                { title: '收费标准名称', dataIndex: 'charge_name', key: 'charge_name' },
                { title: '收费标准生效时间', dataIndex: 'charge_valid_time', key: 'charge_valid_time' },
                { title: '计费模式', dataIndex: 'fees_type', key: 'fees_type' },
                { title: '账单生成周期设置', dataIndex: 'bill_create_set', key: 'bill_create_set' },
                { title: '账单欠费模式', dataIndex: 'bill_arrears_set', key: 'bill_arrears_set' },
                { title: '生成账单模式', dataIndex: 'bill_type', key: 'bill_type' },
                { title: '是否支持预缴', dataIndex: 'is_prepaid', key: 'is_prepaid' },
                { title: '未入住房屋折扣', dataIndex: 'not_house_rate', key: 'not_house_rate' },
                { title: '操作', dataIndex: 'operation', key: 'operation', width: '120px', scopedSlots: { customRender: 'action' } ,}
            ];
            return{
                chargeColumns,
                pageInfo,
                tableList,
                tableLoading,
                getChargeList,
                tableChange,
                deleteStandard
            }
        }
    })
</script>

<style lang="less" scoped>
</style>