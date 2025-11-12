<template>
    <div class="build_index">
        <a-row>
            <a-collapse accordion>
                <a-collapse-panel key="1" header="操作说明">
                    <p>
                        导入说明。<br/>
                        1、可以按照 导入{{$store.getters.config.single_name}}-->导入{{$store.getters.config.floor_name}}-->导入楼层-->导入{{$store.getters.config.room_name}} 顺序进行导入数据，也可以直接 导入{{$store.getters.config.room_name}}；<br/>
                        2、导入的时候必须要等待当前导入数据执行完毕才可以继续导入；<br/>
                        3、导入可以不用下载模板直接上传有对应数据的文件即可完成导入<br/> 
                    </p>
                </a-collapse-panel>
            </a-collapse>
        </a-row>
        <div class="table-operations top-box-padding" style="width: 42%; display:flex; align-items:center;" v-if="role_import==1">
            <a-steps size="small" status="process"  style="cursor: pointer">
                <a-step status="finish" :title="'导入'+$store.getters.config.single_name" @click="uploadUnitExcel('uploadBuilding')">
<!--                    <a-icon slot="icon" type="right" />-->
                    <a-icon slot="icon" type="cloud-upload" />
                </a-step>
                <a-step status="finish" :title="'导入'+$store.getters.config.floor_name" @click="uploadUnitExcel('uploadUnit')">
                    <a-icon slot="icon" type="right" />
                    <a-icon slot="icon" type="cloud-upload" />
                </a-step>
                <a-step status="finish" title="导入楼层" @click="uploadUnitExcel('uploadFloor')">
                    <a-icon slot="icon" type="right" />
                    <a-icon slot="icon" type="cloud-upload" />
                </a-step>
                <a-step status="finish" :title="'导入'+$store.getters.config.room_name" @click="uploadUnitExcel('uploadRoom')">
                    <a-icon slot="icon" type="right" />
                    <a-icon slot="icon" type="cloud-upload" />
                </a-step>
            </a-steps>
            <!-- <a-button style="margin-left: 15px"  @click="uploadExcelFile()">导入测试</a-button> -->
            <a-button style="margin-left: 35px" type="primary" v-if="hik_info_vision_i_community==1" @click="getHikInfoCommunityRegionsHouses()">拉取更新海康智慧社区管理平台房屋信息</a-button>
            
        </div>
        <a-table :columns="columns" :row-key="record => record.id" :data-source="buildingList" :pagination="false"
            :loading="loading">
            <template slot="status" slot-scope="status, record">
              <a-switch v-if="record.allowChangeStatus" checked-children="开启" un-checked-children="关闭" :checked="status==1?true:false" @change="(value)=>switchChange(value, record)" />
              <a-tooltip v-else placement="top">
                    <template slot="title">
                    <span>{{record.allowChangeStatusTip}}</span>
                    </template>
                    <a-switch :disabled="true" checked-children="开启" un-checked-children="关闭" :checked="status==1?true:false"/>
              </a-tooltip>
            
            </template>
            <template slot="floorPath" slot-scope="floorPath, record">
                <a @click="showSingleView(record, 1)">管理</a>
            </template>
            <span slot="action" slot-scope="text, record">
                <a v-if="record.is_draw" @click="goSingleCanvas(record)">绘制区域</a>
                <a-divider v-if="record.is_draw" type="vertical" />
                <a @click="editBuild(record, 1)" v-if="role_housekeep==1 && record.allowEditHousekeeper">{{$store.getters.config.single_name}}管家</a>
                <a-divider type="vertical" v-if="role_edit==1 && record.allowEdit"/>
                <a @click="editBuild(record, 2)" v-if="role_edit==1 && record.allowEdit">编辑</a>
                <a-divider type="vertical" v-if="role_del==1 && record.allowDelete"/>
                <a-popconfirm v-if="role_del==1 && record.allowDelete" title="确定要删除该项吗?" ok-text="是" cancel-text="否" @confirm="delConfirm(record)" @cancel="delCancel">
                    <a style="color: red;">删除楼栋</a>
                </a-popconfirm>
                <a-divider type="vertical" v-if="role_del_all==1 && record.allowDelete"/>
                <a-popconfirm v-if="role_del_all==1 && record.allowDelete" title="一键删除该楼栋及楼栋下的所有单元、楼层、房间数据以及房间绑定的住户， 请再次确认是否需要操作，此操作不可恢复。" ok-text="是的，我已经知晓" cancel-text="我再想想" @confirm="delConfirmAll(record)"
                    @cancel="delCancel">
                    <a style="color: red;">删除楼栋所有数据</a>
                </a-popconfirm>
                <a-divider v-if="record.allowCommunityQuality" type="vertical"/>
                <a v-if="record.allowCommunityQuality" @click="lookArranty(record)">质检明细</a>
            </span>
        </a-table>
        <div class="total_number">
            总{{$store.getters.config.single_name}}数：<span style="color: #F56C6C;">{{total}}</span>栋
        </div>
        <building-edit :title="titleTips" :visible="buildVisible" :single_id="single_id" @closeDrawer="closeDrawer" />
        <buildingHousekeeper :title="titleTips" :visible="manageVisible" :single_id="single_id" @closeDrawer="closeDrawer"/>
        <uploadModal :visible="uploadVisibile" @exit="closeUploadModal" />
        <singleView :visible="singleViewVisible" :single_name="single_name" :single_id="single_id" @closeSingleView="closeDrawer" />
        <uploadUnit v-if="unitVisible" :visible="unitVisible" @exit="closeUnitModal" :uploadType="uploadType" />
        <arrantyDetail :visible="arrantyVisible" :singleInfo="singleInfo" @close="closeArranty" />
        <a-modal title="请稍等,正在为您拉取数据..." :visible="tips_visible" :closable="false" :mask-closable="false" :footer="null"
            :width="550">
            <div>
                <a-spin size="large" />
                <span style=" margin-left: 25px;">请稍等, 正在为您拉取更新海康智慧社区管理平台房屋信息</span>
                <p style="margin: 15px;" >请赖心等待会</p>
                <p style="margin: 15px;color: green;font-weight: bold;" v-if="tips_visible_success" >楼栋单元信息已跟新，您可以去绑定楼栋单元信息了，房间信息已经转入后台拉取更新，请过十分钟后再去绑定房间信息</p>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import Vue from 'vue';
    import buildingEdit from "./components/buildingEdit.vue"
    import buildingHousekeeper from "./components/buildingHousekeeper.vue"
    import uploadModal from "./components/uploadModal.vue"
    import uploadUnit from "./components/uploadUnit.vue"
    import singleView from "./components/singleView.vue"
    import arrantyDetail from './components/arrantyDetail.vue';
    import {
        toRefs,
        ref,
        reactive,
        onMounted,
        defineComponent,
        getCurrentInstance
    } from '@vue/composition-api';
    import villageNew from "@/api/community/village/villageNewApi";
    import store from '@/store';
    export default defineComponent({
        components: {
            buildingEdit,
            buildingHousekeeper,
            uploadModal,
            singleView,
            uploadUnit,
            arrantyDetail
        },
        emits: ['close'],
        setup(props, context) {
            const columns = ref([{
                    title: store.getters.config.single_name+'名称',
                    dataIndex: 'single_name',
                }, {
                    title: store.getters.config.single_name+'编号',
                    dataIndex: 'single_number',
                }
                // , {
                //     title: '楼栋层数',
                //     dataIndex: 'upper_layer_num',
                // }
                , {
                    title: store.getters.config.single_name+'面积(m²)',
                    dataIndex: 'measure_area',
                }, {
                    title: store.getters.config.floor_name+'列表',
                    dataIndex: 'floorPath',
                    scopedSlots: {
                        customRender: 'floorPath'
                    }
                },{
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
            
            const state = reactive({
                arrantyVisible: false,
                singleInfo: {}
            })
            
            const lookArranty = (record) => {
                state.arrantyVisible = true
                state.singleInfo = record
            }
            
            const closeArranty = (flag) => {
                state.arrantyVisible = false
                state.singleInfo = {}
                if(flag){
                    getBuildingList()
                }
            }
            
            let currentSet = ref(3)
            let single_id = ref('')
            let single_name = ref('')
            let buildVisible = ref(false)
            let manageVisible = ref(false)
            let loading = ref(false)
            let buildingList = ref([])
            let allowImport = ref(false)
            let allowRoomImport = ref(false)
			let role_del= ref(0)
            let role_del_all= ref(0)
			let role_edit= ref(0)
			let role_housekeep= ref(0)
			let role_import= ref(0)
            let total = ref(0)
            let titleTips = ref('')
            let tips_visible = ref(false)
            let tips_visible_success= ref(false)
            let hik_info_vision_i_community= ref(0)
            const getBuildingList = () => {
                loading.value = true
                tips_visible.value=false;
                tips_visible_success.value=false;
                Vue.prototype.request(villageNew.buildingList, {}).then((res) => {
                    buildingList.value = res.building
                    total.value = res.count
                    allowImport.value = res.allowImport
                    allowRoomImport.value = res.allowRoomImport
                    if(res.hik_info_vision_i_community){
                        hik_info_vision_i_community.value=res.hik_info_vision_i_community
                    }
					role_del.value=res.role_del
                    role_del_all.value=res.role_del_all
					role_edit.value=res.role_edit
					role_housekeep.value=res.role_housekeep
					role_import.value=res.role_import
                    loading.value = false;
                }).catch(e => {
                    loading.value = false;
                })
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
                Vue.prototype.request(villageNew.updateBuildingStatus, {single_id, status,}).then((res) => {
                    changeStatus.value = true
                    getBuildingList()
                    Vue.prototype.$message.success('修改成功！')
                }).catch(e => {
                    getBuildingList()
                    changeStatus.value = true
                })
            }
        
            const deleteBiuld=(single_id,is_all=0)=>{
                Vue.prototype.request(villageNew.deleteBuilding, {single_id,is_all:is_all}).then((res) => {
                    loading.value = true;
                    getBuildingList()
                    Vue.prototype.$message.success('删除成功！')
                }).catch(e => {
                })
            }

            const delConfirm = (record) => {
                deleteBiuld(record.id)
            }
            const delConfirmAll = (record) => {
                deleteBiuld(record.id,1)
            }
            
            const editBuild = (record, type)=>{
                let tips=store.getters.config.single_name+'名称:【'+record.single_name+'】';
                if(type == 1){
                    tips+=store.getters.config.single_name+'管家';
                    manageVisible.value = true
                }
                if(type == 2){
                    tips+='编辑';
                    buildVisible.value = true
                }
                titleTips.value=tips;
                single_id.value = record.id
            }
            
            const singleViewVisible = ref(false)
            
            const showSingleView = (record)=>{
                singleViewVisible.value = true
                single_id.value = record.id
                single_name.value = store.getters.config.single_name+'名称:【'+record.single_name + '】可视化'
            }
            
            const closeDrawer = (flag) => {
                buildVisible.value = false
                manageVisible.value = false
                singleViewVisible.value = false
                single_id.value = 0
                if(flag){
                    getBuildingList()
                    getCurrentInstance()
                }
            }
            
            let uploadVisibile = ref(false)
            let unitVisible = ref(false)
            let uploadType = ref('')
            const uploadExcelFile = ()=>{
                uploadVisibile.value = true
            }
            const delCancel= ()=>{
                
            }
            const closeUploadModal = () =>{
                uploadVisibile.value = false
            }
            
            const uploadUnitExcel = (value) => {
                uploadType.value = value
                unitVisible.value = true
            }
            
            const closeUnitModal = (flag) => {
                if(flag == 'building'){
                    getBuildingList()
                    return
                }
                unitVisible.value = false
            }
            
            const getHikInfoCommunityRegionsHouses=()=>{
                 tips_visible.value=true;
                Vue.prototype.request(villageNew.getHikInfoCommunityRegionsHouses, {}).then((res) => {
                    tips_visible_success.value=true;
                    setTimeout(function(){
                        tips_visible_success.value=false;
                        tips_visible.value=false;
                    }, 7000);

                }).catch(e => {
                    tips_visible.value=false;
                })
            }
            
            const goSingleCanvas = (record) => {
                window.open('/v20/public/platform/#/community/village/cockpit/hotZone?single_id='+record.id)
            }
            
            onMounted(() => {
                getBuildingList();
            })
            
            return {
                columns,
                buildingList,
                allowImport,
                allowRoomImport,
                loading,
                getBuildingList,
                total,
                delConfirm,
                delConfirmAll,
                deleteBiuld,
                editBuild,
                buildVisible,
                single_id,
                single_name,
                closeDrawer,
                manageVisible,
                switchChange,
                changeSingleStatus,
                changeStatus,
                uploadExcelFile,
                uploadVisibile,
                closeUploadModal,
                singleViewVisible,
                showSingleView,
                currentSet,
                titleTips,
                
                unitVisible,
                closeUnitModal,
                uploadUnitExcel,
                uploadType,
                goSingleCanvas,
                hik_info_vision_i_community,
                getHikInfoCommunityRegionsHouses,
                tips_visible,
                tips_visible_success,
				role_del,
                role_del_all,
				role_edit,
				role_housekeep,
				role_import,
                lookArranty,
                closeArranty,
                delCancel,
                ...toRefs(state)
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
