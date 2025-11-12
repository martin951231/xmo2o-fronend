<template>
    <div class="associated_card_no">
        <a-table :pagination="pageInfo" :columns="cardColumns" :loading="tableLoading" :data-source="tableList" @change="tableChange"> 
            <a-popconfirm title="是否删除当前项？" placement="topLeft" ok-text="是" cancel-text="否" @confirm="deleteCard(record)">
                <a style="color: red;">删除</a>
            </a-popconfirm>
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
            let cardColumns = ref([])
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
                getCardList()
            })
            const tableChange = ({pageSize, current})=>{
                pageInfo.value.current = current
                pageInfo.value.pageSize = pageSize
                getCardList()
            }
            const deleteCard = (record) => {
                Vue.prototype.request('/community/village_api.Building/delVacancyIcCard', {
                    bind_id: record.bind_id,
                }).then((res) => {
                    Vue.prototype.$message.success('删除成功！')
                    pageInfo.value.current = 1
                    pageInfo.value.pageSize = 10
                    getCardList()
                })
            }
            const getCardList = ()=>{
                tableLoading.value = true
                Vue.prototype.request('/community/village_api.Building/getRoomBindIcCardList', {
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
            cardColumns.value = [
                { title: '设备品牌', dataIndex: 'device_brand', key: 'device_brand' },
                { title: '设备类型', dataIndex: 'device_type', key: 'device_type' },
                { title: 'IC卡号', dataIndex: 'ic_card', key: 'ic_card' },
                { title: '添加时间', dataIndex: 'add_time', key: 'add_time' },
                // { title: '操作', dataIndex: 'operation', key: 'operation', width: '120px', scopedSlots: { customRender: 'action' } }
            ];
            return{
                cardColumns,
                pageInfo,
                tableList,
                tableLoading,
                getCardList,
                tableChange,
                deleteCard
            }
        }
    })
</script>

<style lang="less" scoped>
</style>