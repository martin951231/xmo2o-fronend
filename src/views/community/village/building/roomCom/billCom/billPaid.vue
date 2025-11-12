<template>
    <div class="parking_space">
        <a-table :pagination="pageInfo" :columns="paymentTitle" :loading="tableLoading" :data-source="paymentData" @change="tableChange">
           <!-- <span slot="action" slot-scope="text, record">
                <a style="color: red;" @click="deleteBill(record)">删除</a>
            </span> -->
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
                default: () => {
                    return {}
                }
            },
            roomId: {
                type: [String, Number],
                defalut: ''
            }
        },
        setup(props, context) {
            //车辆管理
            let paymentTitle = ref([])
            let paymentData = ref([])
            let tableLoading = ref(false)
            paymentTitle.value = [{
                    title: '收费标准',
                    dataIndex: 'charge_name',
                    key: 'charge_name'
                },
                {
                    title: '收费项目',
                    dataIndex: 'project_name',
                    key: 'project_name'
                },
                {
                    title: '收费科目',
                    dataIndex: 'subject_name',
                    key: 'subject_name'
                },
                {
                    title: '实付金额',
                    dataIndex: 'pay_money',
                    key: 'pay_money'
                },
                {
                    title: '支付时间',
                    dataIndex: 'pay_time',
                    key: 'pay_time'
                },
                {
                    title: '账单生成时间',
                    dataIndex: 'add_time',
                    key: 'add_time'
                },
                {
                    title: '上次止度',
                    dataIndex: 'last_ammeter',
                    key: 'last_ammeter'
                },
                {
                    title: '本次度数',
                    dataIndex: 'now_ammeter',
                    key: 'now_ammeter'
                },
                {
                    title: '审核状态',
                    dataIndex: 'check_status',
                    key: 'check_status'
                },
                {
                    title: '支付方式',
                    dataIndex: 'pay_type',
                    key: 'pay_type'
                },
                {
                    title: '开票状态',
                    dataIndex: 'invoicing_status',
                    key: 'invoicing_status'
                },
                {
                    title: '账单状态',
                    dataIndex: 'order_status',
                    key: 'order_status'
                },
                {
                    title: '计费开始时间',
                    dataIndex: 'service_start_time',
                    key: 'service_start_time'
                },
                {
                    title: '计费结束时间',
                    dataIndex: 'service_end_time',
                    key: 'service_end_time'
                },
                // {
                //     title: '操作',
                //     dataIndex: 'operation',
                //     key: 'operation',
                //     width: '120px',
                //     scopedSlots: {
                //         customRender: 'action'
                //     }
                // }
            ]
            let pageInfo = ref({
                pageSize: 10,
                current: 1,
                type: 2,
                total: 0,
				pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
				showSizeChanger: true
            })
            onMounted(()=>{
                getPaymentBill()
            })
            const tableChange = ({pageSize, current})=>{
                pageInfo.value.current = current
                pageInfo.value.pageSize = pageSize
                getPaymentBill()
            }
            const deleteBill = (record) => {
                Vue.prototype.$confirm({
                    title: '提示',
                    content: '确定要删除此项吗？',
                    onOk() {
                        Vue.prototype.request('/community/village_api.cashier/delChargeStandardBind', {
                            charge_standard_bind_id: record.bind_id,
                        }).then((res) => {
                            Vue.prototype.$message.success('删除成功！')
                            pageInfo.value.current = 1
                            pageInfo.value.pageSize = 10
                            getPaymentBill()
                        })
                    },
                    onCancel() {},
                });
            }
            const getPaymentBill = ()=>{
                tableLoading.value = true
                Vue.prototype.request('/community/village_api.Building/getRoomBindBillList', {
                    vacancy_id: props.roomId,
                    page: pageInfo.value.current,
                    limit: pageInfo.value.pageSize,
                    type:2,
                }).then((res) => {
                    paymentData.value = res.list
                    pageInfo.value.total = res.count
                    tableLoading.value = false
                }).catch(res=>{
                    tableLoading.value = false
                })
            }
            
            return {
                paymentTitle,
                paymentData,
                getPaymentBill,
                deleteBill,
                tableLoading,
                tableChange,
                pageInfo
            }
        }
    })
</script>

<style lang="less" scoped>
</style>
