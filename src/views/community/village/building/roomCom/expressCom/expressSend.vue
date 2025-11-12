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
            paymentTitle.value = [{ title: 'ID', dataIndex: 'send_id', key: 'send_id' },
            { title: '寄件人信息', dataIndex: 'send_phone', key: 'send_phone', width: 200, scopedSlots: { customRender: 'sendInfo' } },
            { title: '收件人信息', dataIndex: 'collect_phone', key: 'collect_phone', width: 200, scopedSlots: { customRender: 'collectInfo' } },
            { title: '物品重量', dataIndex: 'weightDesc', key: 'weightDesc' },
            { title: '文件类型', dataIndex: 'goods_type_text', key: 'goods_type_text' },
            { title: '快递公司', dataIndex: 'expressDesc', key: 'expressDesc' },
            { title: '代发费用', dataIndex: 'send_price', key: 'send_price' },
            { title: '备注', dataIndex: 'remarks', key: 'remarks' },
            { title: '提交时间', dataIndex: 'add_time', key: 'add_time' },
            { title: '最后导出时间', dataIndex: 'export_time', key: 'export_time' }]
            let pageInfo = ref({
                pageSize: 10,
                current: 1,
                total: 0,
				pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
				showSizeChanger: true
            })
            onMounted(()=>{
                getSendList()
            })
            const tableChange = ({pageSize, current})=>{
                pageInfo.value.current = current
                pageInfo.value.pageSize = pageSize
                getSendList()
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
                            getSendList()
                        })
                    },
                    onCancel() {},
                });
            }
            const getSendList = ()=>{
                tableLoading.value = true
                Vue.prototype.request('/community/village_api.ChatSidebar/getExpressList', {
                    type: 'send',
                    page: pageInfo.value.current,
                    limit: pageInfo.value.pageSize
                }).then((res) => {
                    tableLoading.value = false
                    if(res.length == 0) return
                    paymentData.value = res.list
                    pageInfo.value.total = res.count
                }).catch(res=>{
                    tableLoading.value = false
                })
            }
            
            return {
                paymentTitle,
                paymentData,
                getSendList,
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
