<template>
    <div class="build_index">
        <div class="table-operations top-box-padding">
            <a-button @click="editBuild('', 0)" type="primary" >添加{{$store.getters.config.single_name}}</a-button>
        </div>
        <a-table :columns="columns" :row-key="record => record.id" :data-source="buildingList" :pagination="false"
            :loading="loading">
            <template slot="status" slot-scope="status, record">
                <a-switch checked-children="开启" un-checked-children="关闭" :checked="status==1?true:false" @change="(value)=>switchChange(value, record)" />
            </template>
            <span slot="floor_manage_action" slot-scope="text, record">
                <a @click="floor_manage(record)">管理{{$store.getters.config.floor_name}}</a>
            </span>
            
            <span slot="action" slot-scope="text, record">
                <a @click="editBuild(record, 1)">{{$store.getters.config.single_name}}管家</a>
                <a-divider type="vertical" />
                <a @click="editBuild(record, 2)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定要删除该项吗?" ok-text="是" cancel-text="否" @confirm="delConfirm(record)"
                    @cancel="delCancel">
                    <a style="color: red;">删除</a>
                </a-popconfirm>
            </span>
        </a-table>
        <div class="total_number">
            总{{$store.getters.config.single_name}}数：<span style="color: #F56C6C;">{{total}}</span>栋
        </div>
        <building-edit :visible="buildVisible" :single_id="single_id" :floor_id="0" @closeDrawer="closeDrawer" />
        <buildingHousekeeper :visible="manageVisible" :single_id="single_id" @closeDrawer="closeDrawer"/>
        <uploadModal :visible="uploadVisbile" @exit="closeUploadModal" />
        <singleView :visible="singleViewVisible" @closeSingleView="closeDrawer" />
        
        <floorManage :floor_visible="floorManageVisible" :singleObj="singleRecord" @closeDrawer="closeDrawer" />
    </div>
</template>

<script>
    import Vue from 'vue';
    import buildingEdit from "./components/buildingEdit.vue"
    import buildingHousekeeper from "./components/buildingHousekeeper.vue"
    import uploadModal from "./components/uploadModal.vue"
    import singleView from "./components/singleView.vue"
    import floorManage from "./components/floorManage.vue"
    import {
        ref,
        reactive,
        onMounted,
        defineComponent,
        getCurrentInstance,
    } from '@vue/composition-api';
    import villageNew from "@/api/community/village/villageNewApi";
    import store from "@/store";
    export default defineComponent({
        name: 'unitRentalSingleList',
        components: {
            buildingEdit,
            buildingHousekeeper,
            uploadModal,
            singleView,
            floorManage
        },
        setup(props, context) {
            const columns = ref([{
                    title: store.getters.config.single_name+'名称',
                    dataIndex: 'single_name',
                }, {
                    title: store.getters.config.single_name+'编号',
                    dataIndex: 'single_number',
                }, {
                    title: store.getters.config.single_name+'层数',
                    dataIndex: 'upper_layer_num',
                }, {
                    title: store.getters.config.single_name+'面积(m²)',
                    dataIndex: 'measure_area',
                }, {
                    title: store.getters.config.floor_name+'列表',
                    dataIndex: 'floor_num',
                },{
                    title: store.getters.config.floor_name+'管理',
                    key: 'floor_manage_action',
                    scopedSlots: {
                        customRender: 'floor_manage_action'
                    },
                }, {
                    title: '合同开始时间',
                    dataIndex: 'contract_time_start',
                }, {
                    title: '合同结束时间',
                    dataIndex: 'contract_time_end',
                }, {
                    title: '排序',
                    dataIndex: 'sort',
                    sorter: (a, b) => a.sort - b.sort,
                }, {
                    title: '状态',
                    dataIndex: 'status',
                    scopedSlots: {
                        customRender: 'status'
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    scopedSlots: {
                        customRender: 'action'
                    },
                },
            ]);
            let single_id = ref('')
            let buildVisible = ref(false)
            let manageVisible = ref(false)
            let floorManageVisible=ref(false)
            let loading = ref(false)
            let buildingList = ref([])
            let total = ref(0)
            let singleRecord = ref({})
            const getBuildingList = () => {
                Vue.prototype.request(villageNew.unitRentalList, {}).then((res) => {
                    buildingList.value = res.building
                    total.value = res.count
                    loading.value = false;
                }).catch(e => {
                    loading.value = false;
                })
            }

            const delCancel = () => {

            }
            
            const changeStatus = ref(true)
            
            const switchChange = (value, record)=>{
                if(!changeStatus.value){
                    Vue.prototype.$message.warn('请求频繁！')
                    return
                }
                let status = value?1:0
                changeSingleStatus(record.id, status)
            }
            
            const changeSingleStatus = (single_id, status)=>{
                changeStatus.value = false
                Vue.prototype.request(villageNew.updateUnitRentalStatus, {single_id, status,}).then((res) => {
                    changeStatus.value = true
                    getBuildingList()
                    Vue.prototype.$message.success('修改成功！')
                }).catch(e => {
                    getBuildingList()
                    changeStatus.value = true
                })
            }
            
            const deleteBiuld=(single_id)=>{
                Vue.prototype.request(villageNew.deleteUnitRental, {single_id,}).then((res) => {
                    loading.value = true;
                    getBuildingList()
                    Vue.prototype.$message.success('删除成功！')
                }).catch(e => {
                })
            }

            const delConfirm = (record) => {
                deleteBiuld(record.id)
            }
            
            const editBuild = (record, type)=>{
                if(type==0){
                    buildVisible.value = true
                    single_id.value = 0
                }else if(type == 1){
                    manageVisible.value = true
                    single_id.value = record.id
                }else if(type == 2){
                    buildVisible.value = true
                    single_id.value = record.id
                }
                
            }
            const floor_manage=(record)=>{
                floorManageVisible.value = true
                singleRecord.value=record
            }
            const singleViewVisible = ref(false)
            const showSingleView = ()=>{
                singleViewVisible.value = true
            }
            
            const closeDrawer = (flag) => {
                buildVisible.value = false
                manageVisible.value = false
                singleViewVisible.value = false
                floorManageVisible.value = false
                singleRecord.value={}
                if(flag){
                    loading.value = true;
                    getBuildingList()
                    getCurrentInstance()
                }
            }
            
            const uploadVisbile = ref(false)
            
            const uploadExcelFile = ()=>{
                uploadVisbile.value = true
            }
            
            const closeUploadModal = () =>{
                uploadVisbile.value = false
            }

            onMounted(() => {
                loading.value = true;
                getBuildingList();
            })

            return {
                columns,
                buildingList,
                loading,
                getBuildingList,
                total,
                delCancel,
                delConfirm,
                deleteBiuld,
                editBuild,
                buildVisible,
                single_id,
                closeDrawer,
                manageVisible,
                switchChange,
                changeSingleStatus,
                changeStatus,
                uploadExcelFile,
                uploadVisbile,
                closeUploadModal,
                singleViewVisible,
                showSingleView,
                floorManageVisible,
                floor_manage,
                singleRecord
            }
        }
    })
</script>

<style lang="less" scoped>
    .build_index{
        background-color: #ffffff;
        padding: 0 20px;
    }
    .top-box-padding {
        border-bottom: 1px solid #ebedf0;
        padding: 20px 0;
    }

    .status-color-ok {
        color: green;
    }

    .status-color-fail {
        color: red;
    }
    .total_number{
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 50px;
        padding-right: 20px;
    }
</style>
