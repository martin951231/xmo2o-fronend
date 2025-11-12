<template>
    <div class="associated_work_order">
        <a-table :pagination="pageInfo" :columns="orderColumns" :loading="tableLoading" :data-source="tableList" @change="tableChange">
            <span slot="status_arr" slot-scope="text, record">
                <a-tag :color="record.status_arr.status_color">{{record.status_arr.status_txt}}</a-tag>
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
            let orderColumns = ref([])
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
                getOrderList()
            })
            const tableChange = ({pageSize, current})=>{
                pageInfo.value.current = current
                pageInfo.value.pageSize = pageSize
                getOrderList()
            }
            const deleteOrder = (record) => {
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
                            getOrderList()
                        })
                    },
                    onCancel() {},
                });
            }
            const getOrderList = ()=>{
                tableLoading.value = true
                Vue.prototype.request('/community/village_api.Building/getRoomBindWorksOrderList', {
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
            orderColumns.value = [
                { title: '上报人', dataIndex: 'name', key: 'name' },
                { title: '手机号', dataIndex: 'phone', key: 'phone' },
                { title: '上报时间', dataIndex: 'add_time', key: 'add_time' },
                { title: '工单详情', dataIndex: 'order_content', key: 'order_content' },
                { title: '上报状态', dataIndex: 'status_arr', key: 'status_arr', scopedSlots: { customRender: 'status_arr' } },
                { title: '上报位置', dataIndex: 'address_txt', key: 'address_txt' },
                { title: '上报分类', dataIndex: 'cate_name', key: 'cate_name' },
                { title: '工单类目', dataIndex: 'subject_name', key: 'subject_name' },
                // { title: '操作', dataIndex: 'operation', key: 'operation', width: '120px', scopedSlots: { customRender: 'action' } }
            ];
            return{
                orderColumns,
                pageInfo,
                tableList,
                tableLoading,
                getOrderList,
                tableChange,
                deleteOrder
            }
        }
    })
</script>

<style lang="less" scoped>
</style>