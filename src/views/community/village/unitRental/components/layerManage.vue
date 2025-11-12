<template>
    <a-drawer title="楼层管理" :visible="layer_visible" :width="1300" :mask-closable="false" @close="closeLayerManage" :body-style="{ paddingBottom: '80px' }">
    <div class="build_index">
        <div class="table-operations top-box-padding">
            <a-button @click="editBuild('', 0)" type="primary" >添加楼层</a-button>
        </div>
        <a-table :columns="columns" :row-key="record => record.id" :data-source="buildingList" :pagination="false"
            :loading="loading">
            <template slot="status" slot-scope="status, record">
                <a-switch checked-children="开启" un-checked-children="关闭" :checked="status==1?true:false" @change="(value)=>switchChange(value, record)" />
            </template>
            <span slot="action" slot-scope="text, record">
                <a @click="editBuild(record, 1)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm title="确定要删除该项吗?" ok-text="是" cancel-text="否" @confirm="delConfirm(record)"
                    @cancel="delCancel">
                    <a style="color: red;">删除</a>
                </a-popconfirm>
            </span>
        </a-table>
        <div class="total_number">
            总楼层数：<span style="color: #F56C6C;">{{total}}</span>层
        </div>
        <layer-edit :visible="layerEditVisible" :single_id="single_id" :floor_id="floor_id" :layer_id="layer_id" @closeLayerDrawer="closeLayerDrawer" />

    </div>
     </a-drawer>
</template>

<script>
    import Vue from 'vue';
    import layerEdit from "./layerEdit.vue"
    import {
        ref,
        watch,
        reactive,
        onMounted,
        defineComponent,
        getCurrentInstance,
    } from '@vue/composition-api';
    import villageNew from "@/api/community/village/villageNewApi";
    import store from '@/store'
    export default defineComponent({
        props: {
            layer_visible: {
                type: Boolean,
                default: false
            },
            single_id: {
                type: [String, Number],
                default: 0
            },
             floor_id: {
                type: [String, Number],
                default: 0
            }
        },
        name: 'unitRentalLayerList',
        components: {
            layerEdit,
        },
        setup(props, context) {
            watch(() => props.layer_visible, (val) => {
                if(val){
                    getSingleLayerList()
                }
            }, {
                deep: true
            })
            const columns = ref([
                {
                    title: '楼层名称',
                    dataIndex: 'layer_name',
                }, {
                    title: '楼层编号',
                    dataIndex: 'layer_number',
                },
                {
                    title: store.getters.config.single_name+'名称',
                    dataIndex: 'single_name',
                }, {
                    title: store.getters.config.floor_name+'名称',
                    dataIndex: 'floor_name',
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
            let layer_id = ref(0)
            let layerEditVisible = ref(false)
            let loading = ref(false)
            let buildingList = ref([])
            let total = ref(0)
            const getSingleLayerList = () => {
                Vue.prototype.request(villageNew.unitRentalLayerList, {single_id:props.single_id,floor_id:props.floor_id}).then((res) => {
                    buildingList.value = res.dataList
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
                changeSingleStatus(record.id, status,record.floor_id)
            }
            const closeLayerManage = (flag) => {
                console.log('closeLayerManage');
                context.emit('closeDrawer', flag)
            }
            const changeSingleStatus = (layer_id, status,floor_id)=>{
                changeStatus.value = false
                Vue.prototype.request(villageNew.updateUnitRentalLayerStatus, {layer_id, status,floor_id}).then((res) => {
                    changeStatus.value = true
                    getSingleLayerList()
                    Vue.prototype.$message.success('修改成功！')
                }).catch(e => {
                    getSingleLayerList()
                    changeStatus.value = true
                })
            }
            
            const deleteBiuld=(layer_id,floor_id)=>{
                Vue.prototype.request(villageNew.deleteUnitRentalLayer, {layer_id,floor_id}).then((res) => {
                    loading.value = true;
                    getSingleLayerList()
                    Vue.prototype.$message.success('删除成功！')
                }).catch(e => {
                })
            }

            const delConfirm = (record) => {
                deleteBiuld(record.id,record.floor_id)
            }
            
            const editBuild = (record, type)=>{
                if(type==0){
                    layerEditVisible.value = true
                    layer_id.value = 0
                }else if(type == 1){
                    layerEditVisible.value = true
                    layer_id.value = record.id
                }
                
            }
            const closeLayerDrawer = (flag) => {
                layerEditVisible.value = false
                if(flag){
                    loading.value = true;
                    getSingleLayerList()
                }
            }
            return {
                columns,
                buildingList,
                loading,
                getSingleLayerList,
                total,
                delCancel,
                delConfirm,
                deleteBiuld,
                editBuild,
                layer_id,
                closeLayerDrawer,
                switchChange,
                changeSingleStatus,
                changeStatus,
                layerEditVisible,
                closeLayerManage,
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
