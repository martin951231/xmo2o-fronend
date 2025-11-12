<template>
    <div class="charging_standard">
        <a-table :row-key="record=>record.add_time" :pagination="pageInfo" :columns="chargeColumns" :loading="tableLoading" :data-source="tableList" @change="tableChange">
            <span slot="file_url" slot-scope="text, record">
                <a v-if="record.status==0" @click="goUrl(record.file_url)">点击查看</a>
                <span v-else>--</span>
            </span>
            <span slot="duration" slot-scope="text, record">
                {{record.duration}}s
            </span>
            <span slot="status" slot-scope="text, record">
                <span :style="{color: record.status==0?'red':'green'}">{{record.status==0?'存在导入失败的数据':'导入成功'}}</span>
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
            type: {
                type: String,
                default: ''
            },
            yw_common_id: {
                type: [String, Number],
                default: 0
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
                getRecordList()
            })
            const tableChange = ({pageSize, current})=>{
                pageInfo.value.current = current
                pageInfo.value.pageSize = pageSize
                getRecordList()
            }
            const getRecordList = ()=>{
                tableLoading.value = true
                Vue.prototype.request('/community/common.BillExcel/getVillageImportRecord', {
                    tokenName: 'village_access_token',
                    type: props.type,
                    yw_common_id:props.yw_common_id,
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
                { title: '文件名称', dataIndex: 'file_name', key: 'file_name' },
                { title: '详情', dataIndex: 'file_url', key: 'file_url', scopedSlots: { customRender: 'file_url' } ,},
                { title: '时长', dataIndex: 'duration', key: 'duration', scopedSlots: { customRender: 'duration' } ,},
                { title: '结果', dataIndex: 'import_msg', key: 'import_msg' },
                { title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' } ,},
                { title: '时间', dataIndex: 'add_time', key: 'add_time' }
            ];
            const goUrl = (url) => {
                window.open(url)
            }
            return{
                chargeColumns,
                pageInfo,
                tableList,
                tableLoading,
                getRecordList,
                tableChange,
                goUrl
            }
        }
    })
</script>

<style lang="less" scoped>
</style>