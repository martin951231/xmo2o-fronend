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
            paymentTitle.value = [{ title: '快递信息', dataIndex: 'collect_info', key: 'collect_info', scopedSlots: { customRender: 'collect_info' } },
            { title: '收件人手机号', dataIndex: 'phone', key: 'phone' },
            { title: '收件人地址', dataIndex: 'collect_address', key: 'collect_address' },
            { title: '取件码', dataIndex: 'fetch_code', key: 'fetch_code' },
            { title: '送件费用', dataIndex: 'money', key: 'money' },
            { title: '状态', dataIndex: 'express_msg', key: 'express_msg' },
            { title: '预约代送时间', dataIndex: 'send_time', key: 'send_time' },
            { title: '添加时间', dataIndex: 'add_time', key: 'add_time' },
            // { title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' } },
            ]
            let pageInfo = ref({
                pageSize: 10,
                current: 1,
                total: 0,
				pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
                showSizeChanger: true
            })
            onMounted(()=>{
                getCollectList()
            })
            const tableChange = ({pageSize, current})=>{
                pageInfo.value.current = current
                pageInfo.value.pageSize = pageSize
                getCollectList()
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
                            getCollectList()
                        })
                    },
                    onCancel() {},
                });
            }
            const getCollectList = ()=>{
                tableLoading.value = true
                Vue.prototype.request('/community/village_api.ChatSidebar/getExpressList', {
                    type: 'collect',
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
                getCollectList,
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
