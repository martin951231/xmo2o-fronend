<template>
    <div class="parking_space">
        <a-table :pagination="pageInfo" :columns="carportColumns" :loading="tableLoading" :data-source="carportData" @change="tableChange">
            <!-- <span slot="action" slot-scope="text, record">
                <a style="color: red;" @click="deleteStandard(record)">删除</a>
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
            let carportColumns = ref([])
            let carportData = ref([])
            let tableLoading = ref(false)
            carportColumns.value = [{
                    title: '所属车库',
                    dataIndex: 'garage_num',
                    key: 'garage_num'
                },
                {
                    title: '所属车位号',
                    dataIndex: 'position_num',
                    key: 'position_num'
                },
                {
                    title: '车牌号',
                    dataIndex: 'car_number',
                    key: 'car_number'
                },
                {
                    title: '车主姓名',
                    dataIndex: 'name',
                    key: 'name'
                },
                {
                    title: '车主手机号',
                    dataIndex: 'phone',
                    key: 'phone'
                },
                {
                    title: '车辆到期时间',
                    dataIndex: 'end_time',
                    key: 'end_time'
                },
                {
                    title: '审核状态',
                    dataIndex: 'examine_status',
                    key: 'examine_status'
                },
                {
                    title: '审核说明',
                    dataIndex: 'examine_response',
                    key: 'examine_response'
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
                total: 0,
				pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
				showSizeChanger: true
            })
            onMounted(()=>{
                getCarList()
            })
            const tableChange = ({pageSize, current})=>{
                pageInfo.value.current = current
                pageInfo.value.pageSize = pageSize
                getCarList()
            }
            const deleteStandard = (record) => {
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
                            getCarList()
                        })
                    },
                    onCancel() {},
                });
            }
            const getCarList = ()=>{
                tableLoading.value = true
                Vue.prototype.request('/community/village_api.Building/getRoomBindVehicleList', {
                    vacancy_id: props.roomId,
                    page: pageInfo.value.current,
                    limit: pageInfo.value.pageSize
                }).then((res) => {
                    carportData.value = res.list
                    pagination.value.total = res.count
                    tableLoading.value = false
                }).catch(res=>{
                    tableLoading.value = false
                })
            }
            
            // carportData.value = [{
            //         key: 1,
            //         garage_num: "东边车库",
            //         position_num: '0323',
            //         position_area: "15",
            //         children_type_txt: "母车位",
            //         parent_position_num: "",
            //         position_note: "个人车位"
            //     },
            //     {
            //         key: 2,
            //         garage_num: "西边车库",
            //         position_num: '0323',
            //         position_area: "15",
            //         children_type_txt: "母车位",
            //         parent_position_num: "",
            //         position_note: "个人车位"
            //     },
            // ]
         
            return {
                carportColumns,
                carportData,
                getCarList,
                deleteStandard,
                tableLoading,
                tableChange,
                pageInfo
            }
        }
    })
</script>

<style lang="less" scoped>
</style>
