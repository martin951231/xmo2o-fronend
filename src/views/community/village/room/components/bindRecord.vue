<template>
    <a-modal :width="700" :title="title" :visible="visible" @cancel="handleCancel" :footer="null">
        <a-table :pagination="pageInfo" :row-key="record=>record.bind_id" :columns="cardColumns" :loading="tableLoading" :data-source="tableList" @change="tableChange"></a-table>
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        watch,
        toRefs,
        computed,
        reactive,
        onMounted,
        onUpdated,
        defineComponent,
        getCurrentInstance
    } from '@vue/composition-api';
    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            roomId: {
                type: [String, Number],
                default: 0
            }
        },
        setup(props, context) {
            const handleCancel = () => {
                context.emit('close')
            }
            let addVisible = ref(false)
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
            watch(()=>props.roomId, val=>{
                if(val){
                    getCardList()
                }
            })
            const tableChange = ({pageSize, current})=>{
                pageInfo.value.current = current
                pageInfo.value.pageSize = pageSize
                getCardList()
            }
           
            const getCardList = ()=>{
                tableLoading.value = true
                Vue.prototype.request('/community/village_api.Building/getRoomUnbindingUserList', {
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
                { title: '名称', dataIndex: 'name', key: 'name' },
                { title: '手机号', dataIndex: 'phone', key: 'phone' },
                { title: '入住时间', dataIndex: 'check_in_time', key: 'check_in_time' },
                { title: '解绑时间', dataIndex: 'add_time', key: 'add_time' }
            ];
            return {
                handleCancel,
                addVisible,
                cardColumns,
                pageInfo,
                tableList,
                tableLoading,
                getCardList,
                tableChange,
            }
        }
    })
</script>

<style>
</style>
