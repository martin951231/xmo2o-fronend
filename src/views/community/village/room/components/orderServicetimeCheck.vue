<template>
    <a-drawer :title="xtitle" placement="right" width="1550" :visible="visible" @close="closeOrderServicetime">
        <div class="search_con" style="display: flex;margin: 0px 10px 10px 10px;">
            <div class="search_item">
                <span>收费类别：</span>
                <a-select v-model="searchInfo.charge_type" style="width: 200px" @change="handleChargeNumberChange">
                    <a-select-option v-for="item in orderChargeTypes" :key="item.key"
                        :value="item.key">{{ item.value }}</a-select-option>
                </a-select>

            </div>
            <div class="search_item">
                <span>收费项目：</span>
                <a-select v-model="searchInfo.project_id" style="width: 250px" placeholder="请选择收费项目">
                    <a-select-option v-for="xitem in orderChargeProjects" :key="xitem.id"
                        :value="xitem.id">{{ xitem.name }}</a-select-option>
                </a-select>
            </div>
            <div class="search_item">
                <span>审核状态：</span>
                <a-select v-model="searchInfo.status" style="width: 100px" placeholder="请选择审核状态">
                    <a-select-option v-for="xitem in applyStatusArr" :key="xitem.key"
                        :value="xitem.key">{{ xitem.value }}</a-select-option>
                </a-select>
            </div>
            <div class="search_item">
                <span>{{$store.getters.config.room_name}}：</span>
                <a-cascader style="width: 300px;" :options="roomOptions" :load-data="loadDataFunc"
                    :placeholder="'请选择'+$store.getters.config.room_name" change-on-select @change="setVisionsFunc" />
            </div>
            
             <a-button type="primary" @click="queryCheckData">查询</a-button>
        </div>
        <div class="associated_card_no">
            <a-table :pagination="pageInfo" :columns="applyColumns" :loading="tableLoading" :data-source="tableList"
                @change="tableChange" :rowKey="record=>record.id">
                <div slot="service_time" slot-scope="text, record">
                    <p style="margin-bottom:10px;">申请时的：{{ record.applyCurrentServiceTime }}</p>
                    <p style="color: #000;font-weight: bold;margin-bottom:2px;">申请的：{{ record.service_start_time_str }} 至 {{ record.service_end_time_str }}</p>
                </div>
                    <div slot="apply_info" slot-scope="text, record">
                        <p style="margin-bottom:10px;">申请人：{{ record.apply_name }}</p>
                        <p style="margin-bottom:2px;">申请时间：{{ record.add_time_str }}</p>
                    </div>
                    <div slot="status_info" slot-scope="text, record">
                        <p :style="record.status_color" style="margin-bottom:10px;">审核状态：{{ record.status_str }}</p>
                        <p style="margin-bottom:2px;">审核时间：{{ record.apply_time_str }}</p>
                    </div>
                    <div slot="action" slot-scope="text, record">
                        <a v-if="record.my_check_status==1" @click="$refs.checkRefundModel.add(0,record,'order_servicetime_check')">需审核</a>
                        <span v-if="record.my_check_status==2 || record.my_check_status==3" style="color: #808080;">您已审核了</span>
                    </div>
            </a-table>
            <check-refund-info ref="checkRefundModel" @ok="getApplyCheckList"/>
        </div>
    </a-drawer>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        watch,
        reactive,
        onMounted,
        onActivated,
        onUpdated,
        defineComponent
    } from '@vue/composition-api';
    import villageApi from '@/api/community/village';
    import checkRefundInfo from '@/views/community/village/charge/cashier/checkRefundInfo'
    import store from '@/store';
    export default defineComponent({
         components: {
             checkRefundInfo
         },
        props: {
            room_id: {
                type: [String, Number],
                defalut: ''
            },
            xtitle: {
                type: String,
                defalut: "房间修改计费时间申请列表"
            },
            visible: {
                type: Boolean,
                default: false
            },
        },
        setup(props, context) {
            //收费标准
            let applyColumns = ref([])
            let roomOptions = ref([])
            let searchInfo = ref({
                charge_type: '',
                project_id: '',
                status: 0,
                vacancy_id:'',
                single_id:'',
                floor_id:'',
                layer_id:'',
                page:1,
            })
            let orderChargeTypes = ref([])
            let orderChargeProjects = ref([])
            let applyStatusArr= ref([{'key':0,'value':'全部'},{'key':1,'value':'审核中'},{'key':2,'value':'审核通过'},{'key':3,'value':'审核未通过'}])
            let pageInfo = ref({
                pageSize: 10,
                current: 1,
                total: 0,
            })
            let tableList = ref([])
            let tableLoading = ref(false)
            //组件挂载完成后执行的函数(只执行一次)
            onMounted(() => {
               
            });
           //组件被激活时执行的函数(每次进去都执行)
           onActivated(() => {
                 
           })
           watch(()=>props.visible, (val)=>{
               if(val){
                   getSingleListByVillage();
                   getPropertyChargeTypes();
                   getApplyCheckList();
               }
           }, {
               deep: false
           })
           
            const tableChange = ({
                pageSize,
                current
            }) => {
                searchInfo.value.page = current
            }
            const closeOrderServicetime = () => {
                context.emit("closeServicetimeCheck")
            }
            const getApplyCheckList = () => {
                tableLoading.value = true
                let searchParam={}
                searchParam.charge_type=searchInfo.value.charge_type;
                searchParam.project_id=searchInfo.value.project_id;
                searchParam.status=searchInfo.value.status;
                searchParam.vacancy_id=searchInfo.value.vacancy_id;
                searchParam.single_id=searchInfo.value.single_id;
                searchParam.floor_id=searchInfo.value.floor_id;
                searchParam.layer_id=searchInfo.value.layer_id;
                searchParam.page=searchInfo.value.page;
                Vue.prototype.request('/community/village_api.Building/getApplyServicetimeCheckList',searchParam).then((res) => {
                    tableList.value = res.list
                    pageInfo.value.total = res.count
                    pageInfo.value.pageSize=res.page_size
                    tableLoading.value = false
                }).catch(res => {
                    tableLoading.value = false
                })
            }
            applyColumns.value = [{
                    title: '房间',
                    dataIndex: 'room_address',
                    key: 'room_address'
                },
                {
                    title: '申请收费类别',
                    dataIndex: 'charge_type_name',
                    key: 'charge_type_name'
                },
                {
                    title: '申请收费项目',
                    dataIndex: 'project_name',
                    key: 'project_name'
                },
                {
                    title: '计费时间审核',
                    dataIndex: 'service_time',
                    key: 'service_time',
                    scopedSlots: {
                        customRender: 'service_time'
                    }
                },
                {
                    title: '申请信息',
                    dataIndex: 'apply_info',
                    key: 'apply_info',
                    scopedSlots: {
                        customRender: 'apply_info'
                    }
                },
                {
                    title: '申请原因',
                    dataIndex: 'apply_reason',
                    key: 'apply_reason'
                },
                {
                    title: '状态',
                    dataIndex: 'status_str',
                    key: 'status_str',
                    scopedSlots: {
                        customRender: 'status_info'
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    width: '120px',
                    scopedSlots: {
                        customRender: 'action'
                    }
                }
            ];
           const queryCheckData=()=>{
               searchInfo.value.page=1;
               getApplyCheckList()
           }
            // 科目发生变动时触发
            const handleChargeNumberChange = (charge_type) => {
                orderChargeProjects.value = [];
                searchInfo.value.project_id = '';
                if (charge_type) {
                    getChargeProject(charge_type)
                }
            }
            // 获取项目
            const getChargeProject = (charge_type) => {
                let param = {
                    charge_type: charge_type,
                    type: 'selectdata_nodel',
                    project_type: 'cycle',
                }
                orderChargeProjects.value = [];
                Vue.prototype.request('/community/village_api.Charge/ChargeProjectList', param).then(
                res => {
                    if (res.list) {
                        orderChargeProjects.value = res.list
                    }
                })
            }
            const getPropertyChargeTypes = () => {
                let param = {
                    room_id: 0,
                    getapplystatus:1,
                }
                orderChargeTypes.value = [];
                Vue.prototype.request('/community/village_api.Building/getRoomOrderServiceTimeInfo', param)
                    .then(res => {
                        if (res.charge_types) {
                            orderChargeTypes.value = res.charge_types
                        }
                        if(res.applyStatus){
                            applyStatusArr.value=res.applyStatus
                        }
                    })

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
                        roomOptions.value = array
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
                    searchInfo.value.single_id = ''
                    searchInfo.value.floor_id = ''
                    searchInfo.value.layer_id = ''
                    searchInfo.value.vacancy_id = ''
                }
                if (selectedOptions.length == 4) {
                    searchInfo.value.vacancy_id = selectedOptions[3]
                }
                if (selectedOptions.length === 1) {
                    searchInfo.value.single_id = selectedOptions[0]
                    const options_temp = [...roomOptions.value];
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
                    roomOptions.value = options_temp
                } else if (selectedOptions.length === 2) {
                    searchInfo.value.floor_id = selectedOptions[1]
                    const apps = await getLayerList(selectedOptions[1]);
                    const options_temp = [...roomOptions.value];
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
                    roomOptions.value = options_temp
                } else if (selectedOptions.length === 3) {
                    searchInfo.value.layer_id = selectedOptions[2]
                    const apps = await getVacancyList(selectedOptions[2])
                    const options_temp = [...roomOptions.value];
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
                    roomOptions.value = options_temp
                }
            }
            return {
                applyColumns,
                pageInfo,
                tableList,
                tableLoading,
                tableChange,
                roomOptions,
                loadDataFunc,
                getSingleListByVillage,
                getFloorList,
                getLayerList,
                getVacancyList,
                setVisionsFunc,
                closeOrderServicetime,
                handleChargeNumberChange,
                searchInfo,
                orderChargeTypes,
                getChargeProject,
                orderChargeProjects,
                getPropertyChargeTypes,
                queryCheckData,
                getApplyCheckList,
                applyStatusArr,
            }
        }
    })
</script>

<style lang="less" scoped>
    .search_con {
        .search_item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-right: 15px;
        }
    }
</style>