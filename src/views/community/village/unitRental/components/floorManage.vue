<template>
    <a-drawer :title="$store.getters.config.floor_name+'管理'" :visible="floor_visible" :width="1500" @close="closeFloorManage" :mask-closable="false" :body-style="{ paddingBottom: '80px' }">
    <div class="build_index">
        <div class="table-operations top-box-padding">
            <a-button @click="editBuild('', 0)" type="primary" >添加{{$store.getters.config.floor_name}}</a-button>
        </div>
        <a-table :columns="columns" :row-key="record => record.floor_id" :data-source="singleFloorList" :pagination="false"
            :loading="loading">
            <template slot="status" slot-scope="status, record">
                <a-switch checked-children="开启" un-checked-children="关闭" :checked="status==1 || status=='1' ? true:false" @change="(value)=>switchChange(value, record)" />
            </template>
            <span slot="layer_manage_action" slot-scope="text, record">
                <a @click="layer_manage(record)">管理楼层</a>
            </span>
            
            <span slot="action" slot-scope="text, record">
                <a @click="editBuild(record, 1)">{{$store.getters.config.floor_name}}管家</a>
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
            总{{$store.getters.config.floor_name}}数：<span style="color: #F56C6C;">{{total}}</span>{{$store.getters.config.floor_name}}
        </div>
        <floorEdit :visible="buildVisible" :single_id="single_id" :floor_id="floor_id" @closeDrawer="closeFloorDrawer" />
        <buildingHousekeeper :visible="manageVisible" :single_id="single_id" :floor_id="floor_id" @closeDrawer="closeFloorDrawer"/>
        <layerManage :layer_visible="layerManageVisible" @closeDrawer="closeFloorDrawer" :single_id="single_id" :floor_id="floor_id" />
    </div>
     </a-drawer>
</template>

<script>
    import Vue from 'vue';
    import floorEdit from "./floorEdit.vue"
    import buildingHousekeeper from "./buildingHousekeeper.vue"
    import layerManage from "./layerManage.vue"
    import {
        ref,
        watch,
        reactive,
        onMounted,
        defineComponent,
        getCurrentInstance,
    } from '@vue/composition-api';
    import villageNew from "@/api/community/village/villageNewApi";
    import store from "@/store";
    export default defineComponent({
        props: {
            floor_visible: {
                type: Boolean,
                default: false
            },
            singleObj: {
                type: Object,
                default: {}
            }
        },
        name: 'unitRentalFloorList',
        components: {
            floorEdit,
            buildingHousekeeper,
            layerManage
        },
        setup(props, context) {
            watch(() => props.floor_visible, (val) => {
                if(val){
                    singleRecord.value=props.singleObj;
                    getSingleFloorList(props.singleObj)
                }
            }, {
                deep: true
            })
            const columns = ref([{
                    title: store.getters.config.single_name+'名称',
                    dataIndex: 'single_name',
                }, {
                    title: store.getters.config.floor_name+'名称',
                    dataIndex: 'floor_name',
                }, {
                    title: store.getters.config.floor_name+'编号',
                    dataIndex: 'floor_number',
                }, {
                    title: '排序',
                    dataIndex: 'sort',
                    sorter: (a, b) => a.sort - b.sort,
                }, {
                    title: '门禁编号',
                    dataIndex: 'door_control',
                }, {
                    title: '添加时间',
                    dataIndex: 'add_time_str',
                },{
                    title: '楼层管理',
                    key: 'layer_manage_action',
                    scopedSlots: {
                        customRender: 'layer_manage_action'
                    },
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
            let singleRecord = ref({})
            let buildVisible = ref(false)
            let manageVisible = ref(false)
            let layerManageVisible=ref(false)
            let loading = ref(false)
            let singleFloorList = ref([])
            let floor_id=ref(0)
            let single_id=ref(0)
            let total = ref(0)
            const getSingleFloorList = () => {
                let postArr={'single_id':singleRecord.value.id};
                Vue.prototype.request(villageNew.unitRentalFloorList, postArr).then((res) => {
                    singleFloorList.value = res.dataList
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
                changeSingleStatus(record.floor_id, status)
            }
            const closeFloorManage = (flag) => {
                context.emit('closeDrawer', flag)
            }

            const closeFloorDrawer = (flag) => {
                buildVisible.value = false
                manageVisible.value = false
                layerManageVisible.value = false
                if(flag){
                    loading.value = true;
                    getSingleFloorList()
                }
            }
            
            const changeSingleStatus = (floor_id, status)=>{
                changeStatus.value = false
                Vue.prototype.request(villageNew.updateUnitRentalFloorStatus, {floor_id, status,}).then((res) => {
                    changeStatus.value = true
                    getSingleFloorList()
                    Vue.prototype.$message.success('修改成功！')
                }).catch(e => {
                    getSingleFloorList()
                    changeStatus.value = true
                })
            }
            
            const deleteBiuld=(floor_id,single_id)=>{
                Vue.prototype.request(villageNew.deleteUnitRentalFloor, {floor_id,single_id,}).then((res) => {
                    loading.value = true;
                    getSingleFloorList()
                    Vue.prototype.$message.success('删除成功！')
                }).catch(e => {
                })
            }

            const delConfirm = (record) => {
                deleteBiuld(record.floor_id,record.single_id)
            }
            
            const editBuild = (record, type)=>{
                single_id.value = singleRecord.value.id
                if(type==0){
                    buildVisible.value = true
                    floor_id.value = 0
                }else if(type == 1){
                    manageVisible.value = true
                    floor_id.value = record.floor_id
                }else if(type == 2){
                    buildVisible.value = true
                    floor_id.value = record.floor_id
                }
                
            }
            const layer_manage=(record)=>{
                single_id.value = singleRecord.value.id
                floor_id.value = record.floor_id
                layerManageVisible.value = true
                
            }

            /*
            onMounted(() => {
                loading.value = true;
                getSingleFloorList();
            })
            */

            return {
                columns,
                singleFloorList,
                loading,
                getSingleFloorList,
                total,
                delCancel,
                delConfirm,
                deleteBiuld,
                editBuild,
                buildVisible,
                manageVisible,
                switchChange,
                changeSingleStatus,
                changeStatus,
                layerManageVisible,
                layer_manage,
                closeFloorManage,
                closeFloorDrawer,
                singleRecord,
                floor_id,
                single_id
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
