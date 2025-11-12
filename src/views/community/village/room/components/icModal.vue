<template>
    <a-modal :width="750" :title="title" :visible="visible" @cancel="handleCancel" :footer="null">
        <a-button @click="addIcCard">添加ic卡</a-button>
        <a-table :pagination="pageInfo" :row-key="record=>record.bind_id" :columns="cardColumns" :loading="tableLoading" :data-source="tableList" @change="tableChange">
            <span slot="action" slot-scope="text, record">
                <a-popconfirm title="是否删除当前项？" placement="topLeft" ok-text="是" cancel-text="否" @confirm="deleteCard(record)">
                    <a style="color: red;">删除</a>
                </a-popconfirm>
            </span>
        </a-table>
        <addicModal :visible="addVisible" :roomId="roomId" @close="closeAdd" />
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    import addicModal from './addIc.vue'
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
        components: {
            addicModal
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
                { title: '操作', dataIndex: 'operation', key: 'operation', width: '120px', scopedSlots: { customRender: 'action' } }
            ];
            const addIcCard = () => {
                addVisible.value = true
            }
            const closeAdd = (flag) => {
                addVisible.value = false
                if(flag){
                    pageInfo.value.current = 1
                    pageInfo.value.pageSize = 10
                    getCardList()
                }
            }
            return {
                handleCancel,
                addIcCard,
                addVisible,
                closeAdd,
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

<style>
</style>
