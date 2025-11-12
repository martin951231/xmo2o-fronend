<template>
    <div class="room_main">
        <div v-if="explainTips">
            <a-collapse>
                <a-collapse-panel key="1" header="说明">
                    <p>{{explainTips}}</p>
                </a-collapse-panel>
            </a-collapse>
        </div>
        <div class="search_con" style="display: flex;margin-top: 10px;">
            <div class="search_item">
                <a-select :value="searchInfo.find_type" style="width: 120px;" placeholder="请选择"
                    @change="(value)=>handleSelectChange(value, 'find_type')">
                    <a-select-option v-for="(item, index) in searchList" :key="index"
                        :value="item.key">{{item.value}}</a-select-option>
                </a-select>
                <a-input v-model="searchInfo.find_value" style="width: 120px;" placeholder="请输入关键字" />
            </div>

            <div class="search_item" style="margin-left: 10px;">
                <span>状态：</span>
                <a-select allowClear v-model="searchInfo.room_status" style="width: 120px;" placeholder="请选择"
                    @change="(value)=>handleSelectChange(value, 'room_status')">
                    <a-select-option v-for="(item, index) in statusList" :key="index"
                        :value="item.key">{{item.value}}</a-select-option>
                </a-select>
            </div>

            <div class="search_item" style="margin-left: 10px;">
                <span>{{$store.getters.config.room_name}}：</span>
                <a-cascader style="width: 240px;" :options="options" :load-data="loadDataFunc"
                    :placeholder="'请选择'+$store.getters.config.room_name" change-on-select @change="setVisionsFunc" />
            </div>

            <div class="btn_con" style="display: flex;margin-left: 20px;">
                <a-button type="primary" @click="queryThis">查询</a-button>
                <a-button style="margin-left: 10px;" type="danger" @click="batchDelete"
                    v-if="role_del==1">批量删除</a-button>

                <a-button style="margin-left: 10px;" type="primary" @click="excelExportOut"
                    v-if="role_export==1">导出数据</a-button>
                <a-button style="margin-left: 10px;" type="primary" @click="importExcel('uploadRoom')"
                    v-if="role_import==1">导入数据</a-button>
                <a-button v-if="buttonList.is_customized_meter_reading" style="margin-left: 10px;" type="primary"
                    @click="importExcel('uploadThreeTable')">导入三表</a-button>

                <a-tooltip placement="top">
                    <template slot="title">
                        <span>按照楼宇系统小区模式需要的数据格式把所有房间进行导出</span>
                    </template>
                    <a-button style="margin-left: 10px;" type="primary" icon="download" @click="exportRoomDataForLouYu"
                        :loading="loading" v-if="role_import==1">导出楼宇小区格式数据</a-button>
                </a-tooltip>
                    <a-badge :count="apply_count" :overflow-count="100">
                      <a-button style="margin-left: 10px;" type="primary"  @click="showOrderServicetimeCheck()">申请修改计费时间记录</a-button>
                    </a-badge>
            </div>
        </div>

        <div style="margin-top: 10px;"></div>
        <a-table :columns="tableColumn"
            :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
            :row-key="record => record.pigcms_id" :data-source="roomList" :pagination="pagination" :loading="loading"
            @change="tableChange">
            <span slot="unbound" slot-scope="text, record">
                <a @click="lookUnBind(record)">点击查看</a>
            </span>
            <span slot="ic_manage" slot-scope="text, record">
                <a @click="lookIcManage(record)">点击查看</a>
            </span>
            <template slot="status" slot-scope="status"> <span
                    :class="status ? 'status-color-ok' : 'status-color-fail'"> {{ status ? "开启" : "关闭" }} </span>
            </template>
            <span slot="action" slot-scope="text, record">
                <a @click="getRoominfo(record)" v-if="role_edit==1">查看/编辑</a>
                <a-divider type="vertical" v-if="role_del==1" />
                <a-popconfirm v-if="role_del==1" placement="topLeft" ok-text="确定删除" cancel-text="取消"
                    @confirm="deleteRoom([record.pigcms_id])">
                    <template slot="title">
                        <p>是否确定要删除当前{{$store.getters.config.room_name}}数据？</p>
                        <p v-if="record.notpayordercount>0">删除时此{{$store.getters.config.room_name}}的未缴账单将被作废</p>
                    </template>
                    <a v-if="role_del==1" style="color: red;">删除</a>
                </a-popconfirm>
                <a-divider type="vertical" />
                <a @click="mdfyOrderServiceTime(record.pigcms_id)">申请修改计费时间</a>
            </span>
        </a-table>
        <roomInfo :visible="roomVisible" type="room_edit" :roomId="roomId" :title="roomDrawerTitle"
            @closeRoom="onRoomClose" />
        <icModal :visible="icVisible" :title="icModelTitle" :roomId="roomId" @close="closeIcModel" />
        <bindRecord :visible="bindVisible" :title="bindModelTitle" :roomId="roomId" @close="closeBindModel" />
        <a-modal title="请稍等,正在为您导出数据..." :visible="tips_visible" :closable="false" :mask-closable="false" :footer="null"
            :width="550">
            <div>
                <a-spin size="large" />
                <span style=" margin-left: 25px;">加载中,请耐心等待,数量越多时间越长。</span>
                <p style="margin: 15px;">若长时间未成功导出，建议调整筛选条件减少导出数，然后分多次导出。</p>
            </div>
        </a-modal>
        <uploadUnit v-if="unitVisible" :visible="unitVisible" @exit="closeUnitModal" :uploadType="uploadType" />

        <a-modal title="申请账单计费时间" :visible="order_servicetime_visible" :mask-closable="false" :width="680"
            :confirmLoading="confirmLoading" @ok="handleServicetimeSubmit" @cancel="handleServicetimeCancel">
            <div>
                <a-alert  message="物业费时间请去 人员管理 -> 业主列表 -> 修改服务时间" type="info" show-icon
                    style="margin-bottom: 10px;" />
                <a-form  :wrapperCol="{ span: 18}" :labelCol=" {span: 5 }">
                    <a-form-item label="收费类别" >
                      <a-select v-model="applyServiceTime.charge_type" style="width: 400px" @change="handleChargeNumberChange">
                        <a-select-option v-for="item in orderChargeTypes" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
                      </a-select>
                    </a-form-item>

                    <a-form-item label="收费项目">
                      <a-select v-model="applyServiceTime.project_id" style="width: 400px" @change="getRoomCurrentServiceTime" placeholder="请选择收费项目" >
                        <a-select-option v-for="xitem in orderChargeProjects" :key="xitem.id" :value="xitem.id" >{{ xitem.name }}</a-select-option>
                      </a-select>
                    </a-form-item>
                    <a-form-item label="当前计费时间">
                        <a-input :disabled="true" placeholder="当前计费时间" v-model="applyServiceTime.currentServiceTime" />
                    </a-form-item>

                    <a-form-item label="修改服务时间">
                        <a-range-picker @change="dateOnChange" :allowClear="true" v-model="applyServiceTime.serviceTime">
                          <a-icon slot="suffixIcon" type="calendar" />
                        </a-range-picker>
                    </a-form-item>

                    <a-form-item label="申请原因">
                        <a-input placeholder="申请原因" v-model="applyServiceTime.apply_reason" />
                    </a-form-item>

                </a-form>
            </div>
        </a-modal>
        
        <orderServicetimeCheck :visible="orderServicetimeCheckVisible" xtitle="房间修改计费时间申请列表" room_id="0" @closeServicetimeCheck="closeOrderServicetimeCheck"/>
        
    </div>
</template>

<script>
    import Vue from 'vue';
    import villageNew from "@/api/community/village/villageNewApi";
    import villageApi from '@/api/community/village';
    import roomInfo from "../building/components/roomInfo.vue";
    import orderServicetimeCheck from "./components/orderServicetimeCheck.vue";
    import icModal from "./components/icModal.vue";
    import bindRecord from "./components/bindRecord.vue";
    import uploadUnit from "../building/components/uploadUnit.vue";
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
    import store from '@/store';
    export default defineComponent({
        components: {
            roomInfo,
            icModal,
            bindRecord,
            uploadUnit,
            orderServicetimeCheck
        },
        setup(props, context) {
            const pagination = ref({
                pageSize: 10,
                current: 1,
                total: 10,
                showTotal: total => `共 ${total} 条`, // 显示总数
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                showSizeChanger: true
            })
            let searchInfo = ref({
                find_type: null,
                find_value: '',
                room_status: undefined,
                single_id: null,
                floor_id: null,
                layer_id: null,
                vacancy_id: null
            })
            const loading = ref(false)
            let state = reactive({
                selectedRowKeys: []
            })
            let roomVisible = ref(false)
            let roomDrawerTitle = ref('')
            let searchList = ref([])
            let statusList = ref([])
            let explainTips = ref('')
            let buttonList = ref({})
            let tableColumn = ref([])
            let roomList = ref([])
            let options = ref([])
            let roomId = ref('')
            let notpayordercount = ref(0)
            let bindVisible = ref(false)
            let bindModelTitle = ref('')
            let icVisible = ref(false)
            const closeIcModel = () => {
                icVisible.value = false
                roomId.value = null
            }
            let tips_visible = ref(false)
            let excelExportOutUrl = ref('')
            let excelExportOutFileUrl = ref('')
            let export_out_id = ref(0)
            let setTimeoutS = ref(null)
            let role_export = ref(0)
            let role_import = ref(0)
            let role_edit = ref(0)
            let role_del = ref(0)
            let order_servicetime_visible = ref(false)
            let confirmLoading = ref(false)
            let applyServiceTime=ref({
                charge_type:'',
                project_id:'',
                currentServiceTime:'',
                serviceTime:[],
                apply_reason:'',
            })
            let orderChargeTypes=ref([])
            let orderChargeProjects=ref([])
            let room_id=ref(0)
            let orderServicetimeCheckVisible= ref(false)
            let apply_count= ref(0)
            const getSearchObj = () => {
                Vue.prototype.request('/community/village_api.Building/getRoomListConfig', {}).then((
                res) => {
                    searchList.value = res.search_list
                    statusList.value = res.status_list
                    explainTips.value = res.explain_tips
                    buttonList.value = res.button_list
                    tableColumn.value = res.table_list
                    // tableColumn.value.map(v=>{
                    //     if(v.dataIndex == 'sort'){
                    //         v.sorter = (a, b) => a.sort - b.sort
                    //     }
                    // })
                    if (res.search_list && res.search_list.length > 0) {
                        searchInfo.value.find_type = res.search_list[0].key
                    }
                    // if(res.status_list && res.status_list.length>0){
                    //     searchInfo.value.room_status = res.status_list[0].key
                    // }
                }).catch(e => {})
            }

            const getTableList = () => {
                loading.value = true
                Vue.prototype.request('/community/village_api.Building/getRoomDataList', {
                    page: pagination.value.current,
                    limit: pagination.value.pageSize,
                    find_type: searchInfo.value.find_type,
                    find_value: searchInfo.value.find_value,
                    room_status: searchInfo.value.room_status,
                    single_id: searchInfo.value.single_id,
                    floor_id: searchInfo.value.floor_id,
                    layer_id: searchInfo.value.layer_id,
                    vacancy_id: searchInfo.value.vacancy_id,
                }).then((res) => {
                    roomList.value = res.list
                    pagination.value.total = res.count;
                    loading.value = false;
                    excelExportOutUrl.value = res.excelExportOutUrl;
                    excelExportOutFileUrl.value = res.excelExportOutFileUrl;
                    tips_visible.value = false;
                    setTimeoutS.value = null;
                    role_export.value = res.role_export;
                    role_import.value = res.role_import;
                    role_edit.value = res.role_edit;
                    role_del.value = res.role_del;
                    apply_count.value= res.apply_count ? res.apply_count :0;
                }).catch(e => {
                    loading.value = false
                })
            }

            const tableChange = ({
                pageSize,
                current
            }) => {
                pagination.value.current = current
                pagination.value.pageSize = pageSize
                state.selectedRowKeys = []
                getTableList()
            }

            getSearchObj()
            getTableList()

            const onSelectChange = (rowKeys, rowDatas) => {
                state.selectedRowKeys = rowKeys;
                notpayordercount.value = 0;
                if (rowDatas.length > 0) {
                    rowDatas.forEach((item, index) => {
                        if (item.notpayordercount * 1 > 0) {
                            notpayordercount.value = item.notpayordercount;
                        }
                    })
                }
                console.log('rowDatas', rowDatas, 'notpayordercount', notpayordercount);
            }
            const mdfyOrderServiceTime = (tmp_room_id) => {
                let param = {
                    room_id: tmp_room_id
                }
                confirmLoading.value=false;
                room_id.value=tmp_room_id;
                orderChargeTypes.value=[];
                orderChargeProjects.value=[];
                applyServiceTime.value.charge_type='';
                applyServiceTime.value.project_id='';
                applyServiceTime.value.currentServiceTime='';
                applyServiceTime.value.serviceTime=[];
                applyServiceTime.value.apply_reason='';
                Vue.prototype.request('/community/village_api.Building/getRoomOrderServiceTimeInfo',param).then(res => {
                    if (res.charge_types) {
                        orderChargeTypes.value=res.charge_types
                    }
                })
                order_servicetime_visible.value = true;
            }
            const handleServicetimeSubmit = () => {
                let postparam={};
                console.log('applyServiceTime',applyServiceTime)
                if(!applyServiceTime.value.charge_type){
                    Vue.prototype.$message.error('请选择一个收费类别！')
                    return false;
                }
                postparam.charge_type=applyServiceTime.value.charge_type;
                if(!applyServiceTime.value.project_id){
                    Vue.prototype.$message.error('请选择一个收费项目！')
                    return false;
                }
                postparam.project_id=applyServiceTime.value.project_id;
                if(applyServiceTime.value.serviceTime.length<1){
                    Vue.prototype.$message.error('请选择修改服务时间！')
                    return false;
                }
                postparam.service_new_time=applyServiceTime.value.serviceTime;
                
                if(!applyServiceTime.value.apply_reason){
                    Vue.prototype.$message.error('请写申请原因！')
                    return false;
                }
                postparam.apply_reason=applyServiceTime.value.apply_reason;
                postparam.room_id=room_id.value;
                confirmLoading.value=true;
                Vue.prototype.request('/community/village_api.Building/saveRoomOrderNewServiceTime',postparam).then(res => {
                    confirmLoading.value=false;
                    if (res.msg) {
                        Vue.prototype.$message.success(res.msg)
                    }else{
                         Vue.prototype.$message.success('操作成功！')
                    }
                    handleServicetimeCancel();
                    getTableList()
                }).catch((error) => {
                     confirmLoading.value=false;
                })
            }
            const handleServicetimeCancel = () => {
                confirmLoading.value=false;
                room_id.value=0;
                orderChargeProjects.value=[];
                applyServiceTime.value.charge_type='';
                applyServiceTime.value.project_id='';
                applyServiceTime.value.currentServiceTime='';
                applyServiceTime.value.serviceTime=[];
                applyServiceTime.value.apply_reason='';
                order_servicetime_visible.value = false;
            }
            // 科目发生变动时触发
           const handleChargeNumberChange= (charge_type) =>{
               orderChargeProjects.value=[];
               applyServiceTime.value.project_id='';
               if(charge_type){
                   getChargeProject(charge_type)
               }
            }
            // 获取项目
           const getChargeProject= (charge_type) => {
                let param = {
                    charge_type: charge_type,
                    type:'selectdata_nodel',
                    project_type:'cycle',
                }
                orderChargeProjects.value=[];
                Vue.prototype.request('/community/village_api.Charge/ChargeProjectList',param).then(res => {
                    if (res.list) {
                        orderChargeProjects.value=res.list
                    }
                })
            }
            // 日期切换，重新赋值
            const dateOnChange =(date, dateString) =>{
                console.log('dateString',dateString);
                applyServiceTime.value.serviceTime = dateString
            }
            const getRoomCurrentServiceTime=(project_id)=>{
                let param = {
                    room_id: room_id.value,
                    project_id:project_id
                }
                applyServiceTime.value.project_id=project_id;
                applyServiceTime.value.currentServiceTime='';
                Vue.prototype.request('/community/village_api.Building/getRoomOrderServiceTimeInfo',param).then(res => {
                    if (res.currentServiceTime) {
                        applyServiceTime.value.currentServiceTime=res.currentServiceTime
                    }else{
                        applyServiceTime.value.currentServiceTime='暂无'
                    }
                    console.log('applyServiceTime',applyServiceTime);
                })
            }
            const getRoominfo = (item) => {
                roomVisible.value = true
                roomId.value = item.pigcms_id
                roomDrawerTitle.value = item.address
            }
            const onRoomClose = () => {
                roomVisible.value = false
                getTableList()
            }
            const handleSelectChange = (value, type) => {
                searchInfo.value[type] = value
            }

            const loadDataFunc = async (selectedOptions) => {
                const targetOption = selectedOptions[selectedOptions.length - 1];
            }
            const getSingleListByVillage = () => {
                Vue.prototype.request(villageApi.getSingleListByVillage).then(res => {
                    if (res) {
                        let array = []
                        res.map(pro => {
                            array.push({
                                label: pro.name,
                                value: pro.id,
                                isLeaf: false
                            });
                        })
                        options.value = array
                    }
                })
            }
            // 单元楼
            const getFloorList = (id) => {
                return new Promise(resolve => {
                    Vue.prototype.request(villageApi.getFloorList, {
                        pid: id
                    }).then(res => {
                        resolve(res);
                    })
                });
            }
            // 楼层
            const getLayerList = (id) => {
                return new Promise(resolve => {
                    Vue.prototype.request(villageApi.getLayerList, {
                        pid: id
                    }).then(res => {
                        if (res) {
                            resolve(res);
                        }
                    })
                })
            }
            // 房间
            const getVacancyList = (id) => {
                return new Promise(resolve => {
                    Vue.prototype.request(villageApi.getVacancyList, {
                        pid: id
                    }).then(res => {
                        if (res) {
                            resolve(res);
                        }
                    })
                })
            }
            // 处理加载漏洞单元（选择、编辑时可用）
            const setVisionsFunc = async (selectedOptions) => {
                if (selectedOptions.length == 0) {
                    searchInfo.value.single_id = null
                    searchInfo.value.floor_id = null
                    searchInfo.value.layer_id = null
                    searchInfo.value.vacancy_id = null
                }
                if (selectedOptions.length == 4) {
                    searchInfo.value.vacancy_id = selectedOptions[3]
                }
                if (selectedOptions.length === 1) {
                    searchInfo.value.single_id = selectedOptions[0]
                    const options_temp = [...options.value];
                    const res = await getFloorList(selectedOptions[0]);
                    const children = [];
                    res.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        });
                        options_temp['children'] = children
                        return true;
                    });
                    options_temp.find(_ => _.value === selectedOptions[0])['children'] = children;
                    options.value = options_temp
                } else if (selectedOptions.length === 2) {
                    searchInfo.value.floor_id = selectedOptions[1]
                    const apps = await getLayerList(selectedOptions[1]);
                    const options_temp = [...options.value];
                    const children = [];
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: false
                        });
                        return true;
                    });
                    const product = options_temp.find(_ => _.value === selectedOptions[0]);
                    product.children.find(_ => _.value === selectedOptions[1])['children'] = children;
                    options.value = options_temp
                } else if (selectedOptions.length === 3) {
                    searchInfo.value.layer_id = selectedOptions[2]
                    const apps = await getVacancyList(selectedOptions[2])
                    const options_temp = [...options.value];
                    const children = [];
                    apps.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: true
                        });
                        return true;
                    });
                    const product = options_temp.find(_ => _.value === selectedOptions[0]);
                    const product_1 = product.children.find(_ => _.value === selectedOptions[1])
                    product_1.children.find(_ => _.value === selectedOptions[2])['children'] = children;
                    options.value = options_temp
                }
            }

            const deleteRoom = (id) => {
                Vue.prototype.request('/community/village_api.Building/delRoomOperation', {
                    vacancy_id: id
                }).then(res => {
                    getTableList()
                    Vue.prototype.$message.success('删除成功！')
                }).catch((error) => {

                })
            }

            const lookUnBind = (record) => {
                bindModelTitle.value = '已解绑住户记录' + '（' + record.address + '）'
                roomId.value = record.pigcms_id
                bindVisible.value = true
            }

            let icModelTitle = ref('')
            const lookIcManage = (record) => {
                icModelTitle.value = 'ic卡管理' + '（' + record.address + '）'
                roomId.value = record.pigcms_id
                icVisible.value = true
            }

            const queryThis = () => {
                pagination.value.current = 1
                pagination.value.pageSize = 10
                getTableList()
            }

            const closeBindModel = () => {
                bindVisible.value = false
                roomId.value = null
            }
            const closeOrderServicetimeCheck= () => {
                orderServicetimeCheckVisible.value = false
            }
           const showOrderServicetimeCheck= () => {
                orderServicetimeCheckVisible.value = true
            }
            
            const excelExportOut = () => {
                tips_visible.value = true;
                let searchparam = {};
                searchparam.tokenName = 'village_access_token';
                searchparam.find_type = searchInfo.value.find_type ? searchInfo.value.find_type : 1;
                searchparam.find_value = searchInfo.value.find_value ? searchInfo.value.find_value : '';
                searchparam.status = searchInfo.value.room_status ? searchInfo.value.room_status : 0;
                searchparam.single_id = searchInfo.value.single_id ? searchInfo.value.single_id : 0;
                searchparam.floor_id = searchInfo.value.floor_id ? searchInfo.value.floor_id : 0;
                searchparam.layer_id = searchInfo.value.layer_id ? searchInfo.value.layer_id : 0;
                searchparam.vacancy_id = searchInfo.value.vacancy_id ? searchInfo.value.vacancy_id : 0;

                Vue.prototype.request(excelExportOutUrl.value, searchparam)
                    .then((res) => {
                        export_out_id = res.export_id
                        excelExportOutFileUrl.value = excelExportOutFileUrl.value + '&id=' + res
                            .export_id
                        CheckExportOutStatus();
                    })
            }
            const CheckExportOutStatus = () => {
                let excelExportOutFileUrlCheck = excelExportOutFileUrl.value + '&ajax=village_ajax'
                Vue.prototype.request(excelExportOutFileUrlCheck, {
                        tokenName: 'village_access_token',
                        ajax: 'village_ajax'
                    })
                    .then((res) => {
                        console.log('exportOutStatus', res)
                        if (res.error_code == 0) {
                            clearTimeout(setTimeoutS.value)
                            setTimeoutS.value = null
                            window.location.href = excelExportOutFileUrl.value;
                            tips_visible.value = false;
                            return false;
                        } else {
                            setTimeoutS.value = setTimeout(CheckExportOutStatus, 2000);
                        }
                    })
            }
            const batchDelete = () => {
                if (state.selectedRowKeys.length == 0) {
                    Vue.prototype.$message.warn('请选择要删除的' + store.getters.config.room_name + '数据！')
                    return
                }
                console.log('selectedRowKeys', state.selectedRowKeys);
                let xcontent = '确定要删除选中的' + store.getters.config.room_name + '数据吗？';
                if (notpayordercount.value > 0) {
                    xcontent = '确定要删除选中的' + store.getters.config.room_name + '数据吗 ？ 删除时如果' + store.getters
                        .config.room_name + '有未缴的账单将被作废。';
                }
                Vue.prototype.$confirm({
                    title: '提示',
                    content: xcontent,
                    onOk() {
                        deleteRoom(state.selectedRowKeys)
                    },
                    onCancel() {},
                })
            }

            const exportRoomDataForLouYu = () => {
                loading.value = true
                Vue.prototype.request('/community/village_api.Room/exportRoomDataForLouYu', {}).then(
                res => {
                    var downloadPath = res.url
                    var downloadLink = document.createElement('a')
                    downloadLink.style.display = 'none' // 使其隐藏
                    downloadLink.href = downloadPath
                    downloadLink.download = ''
                    downloadLink.click()
                    downloadLink.remove()
                    loading.value = false
                }).catch((error) => {
                    loading.value = false
                })
            }

            onMounted(() => {
                getSingleListByVillage()
            })

            let uploadType = ref('')
            const unitVisible = ref(false)
            const closeUnitModal = (flag) => {
                if (flag == 'room') {
                    queryThis()
                    return
                }
                unitVisible.value = false
            }
            const importExcel = (type) => {
                uploadType.value = type
                unitVisible.value = true
            }

            return {
                pagination,
                loading,
                state,
                roomVisible,
                roomDrawerTitle,
                tableChange,
                getRoominfo,
                onRoomClose,
                onSelectChange,

                searchList,
                statusList,
                explainTips,
                buttonList,
                tableColumn,
                getTableList,
                roomList,
                handleSelectChange,

                options,
                getSingleListByVillage,
                getFloorList,
                getLayerList,
                getVacancyList,
                setVisionsFunc,
                loadDataFunc,
                roomId,
                deleteRoom,

                lookUnBind,
                lookIcManage,
                searchInfo,
                queryThis,
                closeIcModel,
                icVisible,
                icModelTitle,

                bindVisible,
                bindModelTitle,
                closeBindModel,
                batchDelete,
                tips_visible,
                excelExportOutUrl,
                excelExportOutFileUrl,
                export_out_id,
                setTimeoutS,
                excelExportOut,
                CheckExportOutStatus,
                unitVisible,
                closeUnitModal,
                importExcel,
                uploadType,
                role_export,
                role_import,
                role_edit,
                role_del,
                uploadType,
                notpayordercount,
                exportRoomDataForLouYu,
                mdfyOrderServiceTime,
                handleServicetimeSubmit,
                handleServicetimeCancel,
                order_servicetime_visible,
                confirmLoading,
                handleChargeNumberChange,
                getChargeProject,
                applyServiceTime,
                orderChargeProjects,
                orderChargeTypes,
                dateOnChange,
                getRoomCurrentServiceTime,
                room_id:0,
                orderServicetimeCheckVisible,
                closeOrderServicetimeCheck,
                showOrderServicetimeCheck,
                apply_count
            }
        }
    })
</script>

<style lang="less" scoped>
    .room_main {
        background: #ffffff;
        padding: 10px;
        margin-top: 10px;
    }

    .top-box-padding {
        border-bottom: 1px solid #ebedf0;
        padding: 42px 24px 50px;
    }

    .status-color-ok {
        color: green;
        font-weight: bold;
    }

    .status-color-fail {
        color: red;
        font-weight: bold;
    }

    .search_con {
        .search_item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
    }
</style>