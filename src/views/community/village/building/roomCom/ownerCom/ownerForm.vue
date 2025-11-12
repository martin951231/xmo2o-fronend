<template>
    <div class="parking_space">
        <a-table :pagination="pageInfo" :columns="paymentTitle" :loading="tableLoading" :data-source="paymentData" @change="tableChange">
            <span slot="action" slot-scope="text, record">
                <a style="color: red;" @click="deleteBill(record)">删除</a>
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
                default: () => {
                    return {}
                }
            },
            roomId: {
                type: [String, Number],
                defalut: ''
            },
            pigcms_id: {
                type: [String, Number],
                defalut: ''
            }
        },
        setup(props, context) {
            //车辆管理
            let paymentTitle = ref([])
            let paymentData = ref([])
            let tableLoading = ref(false)
            paymentTitle.value = [{ title: 'ID', dataIndex: 'id', key: 'id' },
            { title: '模板标题', dataIndex: 'title', key: 'title' },
            { title: '申请填写时间', dataIndex: 'add_time', key: 'add_time' },
            { title: '附件', scopedSlots: { customRender: 'enclosure' } },
            { title: '备注', scopedSlots: { customRender: 'remark' } },
            { title: '状态', dataIndex: 'diy_tatus_txt', key: 'diy_tatus_txt' },
            { title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' } }]
            let pageInfo = ref({
                pageSize: 10,
                current: 1,
                total: 0,
				pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
				showSizeChanger: true
            })
            onMounted(()=>{
                getDecorationList()
            })
            const tableChange = ({pageSize, current})=>{
                pageInfo.value.current = current
                pageInfo.value.pageSize = pageSize
                getDecorationList()
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
                            getDecorationList()
                        })
                    },
                    onCancel() {},
                });
            }
            const getDecorationList = ()=>{
                tableLoading.value = true
                Vue.prototype.request('/community/village_api.ChatSidebar/getDecorationOrderList', {
                    pigcms_id: props.pigcms_id,
                    page: pageInfo.value.current,
                    limit: pageInfo.value.pageSize
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
                getDecorationList,
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
