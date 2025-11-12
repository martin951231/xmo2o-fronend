<template>
    <div class="intelligent_alart">
        <div>
            <a-collapse>
                <a-collapse-panel key="1" header="注意事项">
                    <p>1. 智能报警器仅支持海康云眸（ 企业内部应用开发-社区 ）报警通知</p>
                    <p>2. 在添加海康或大华设备时，请先检查该设备是否已在海康或大华平台中存在（若已存在，请先删除对应设备）。完成这一操作后，您可以在智慧社区平台中添加设备信息，并同步到海康和大华系统。</p>
                </a-collapse-panel>
            </a-collapse>
        </div>
        <div class="top_search">
            <a-form-model class="form_con" :model="searchForm" layout="vertical">
                <a-form-model-item class="form_item" label="设备名称">
                    <a-input placeholder="请输入" v-model="searchForm.device_name" />
                </a-form-model-item>
                <a-form-model-item class="form_item" label="设备序号">
                    <a-input placeholder="请输入" v-model="searchForm.device_serial" />
                </a-form-model-item>
                <a-form-model-item class="form_item" label="楼栋单元">
                    <a-cascader
                      style="width: 100%;"
                      :options="options"
                      :load-data="loadDataFunc"
                      placeholder="请选择楼栋单元"
                      change-on-select
                      @change="setVisionsFunc"
                      v-model="searchForm.single_floor" />
                </a-form-model-item>
               <!-- <a-form-model-item class="form_item" label="设备状态">
                    <a-select v-model="searchForm.equip_type" placeholder="请选择">
                        <a-select-option :value="0">离线</a-select-option>
                        <a-select-option :value="1">在线</a-select-option>
                    </a-select>
                </a-form-model-item> -->
                <a-form-model-item class="form_item" label="搜索" style="width: 300px;">
                    <a-button type="primary" @click="onSubmit">
                        搜索
                    </a-button>
                    <a-button style="margin-left: 10px;" @click="resetForm">
                        清空
                    </a-button>
                </a-form-model-item>
            </a-form-model>
        </div>

        <div class="bth_con">
            <a-button type="primary" style="margin-left: 10px;" @click="addAlarm">添加</a-button>
            <a-button type="primary" style="margin-left: 10px;" @click="orderSet">报警工单设置</a-button>
        </div>

        <div class="table_con">
            <a-table :rowKey="record=>record.device_id" :pagination="pageInfo" :loading="tableLoading" :columns="columns" :data-source="tableList" @change="handleTableChange">
                <span slot="device_status_arr" slot-scope="text, record">
                    <a-tag :color="record.device_status_arr.color">{{record.device_status_arr.label}}</a-tag>
                </span>
                <span slot="cloud_arr" slot-scope="text, record">
                    <a-tag :color="record.cloud_arr.color">{{record.cloud_arr.label}}</a-tag>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="editAlarm(record)">编辑</a>
                    <a-divider type="vertical"></a-divider>
                    <a @click="lookAlarmRecord(record)">报警记录</a>
                    <a-divider type="vertical"></a-divider>
                    <a-popconfirm
                        title="确认是否删除此设备一旦删除无法恢复！"
                        ok-text="确定"
                        cancel-text="取消"
                        placement="topRight"
                        @confirm="deleteConfirm(record)"
                        @cancel="()=>{}">
                        <a style="color: red;">删除</a>
                    </a-popconfirm>
                </span>
            </a-table>
        </div>
        
        <addAlarmModal :device_id="device_id" :visible="addVisible" @close="closeAdd" />
        <orderSetModal :visible="setVisible" @close="closeSet" />
        <alarmRecord :device_id="device_id" :visible="alarmVisible" @close="closeAlarm" />
    </div>
</template>

<script>
    import addAlarmModal from '../components/addAlarmModal.vue';
    import orderSetModal from '../components/orderSetModal.vue';
    import alarmRecord from '../components/alarmRecord.vue';
    import villageApi from '@/api/community/village';
    const columns = [{
            title: '设备ID',
            dataIndex: 'device_id',
            key: 'device_id',
        },{
            title: '设备序号',
            dataIndex: 'device_serial',
            key: 'device_serial',
        },
        {
            title: '设备名称',
            dataIndex: 'device_name',
            key: 'device_name',
        },
        {
            title: '设备状态',
            key: 'device_status_arr',
            dataIndex: 'device_status_arr',
            scopedSlots: {
                customRender: 'device_status_arr'
            },
        },
        {
            title: '同步状态',
            key: 'cloud_arr',
            dataIndex: 'cloud_arr',
            scopedSlots: {
                customRender: 'cloud_arr'
            },
        },
        {
            title: '交互最新时间',
            dataIndex: 'interaction_time_txt',
            key: 'interaction_time_txt',
        },
        {
            title: '添加时间',
            dataIndex: 'add_time_txt',
            key: 'add_time_txt',
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];

    export default {
        data() {
            return {
                searchForm: {
                    device_name: '',
                    device_serial: '',
                    single_floor: [],
                    single_id: '',
                    floor_id: ''
                },
                tableList: [],
                tableLoading: false,
                addVisible: false,
                pageInfo: {
                    page: 1,
                    current: 1,
                    pageSize: 10,
                    total: 0
                },
                columns,
                setVisible: false,
                alarmVisible: false,
                options: [],
                device_id: null
            }
        },
        
        components: {
            addAlarmModal,
            orderSetModal,
            alarmRecord
        },
        
        mounted(){
            this.getTableList()
            this.getSingleListByVillage()
        },
        
        methods: {
            onSubmit() {
                if(this.searchForm.single_floor.length == 1){
                    this.searchForm.single_id = this.searchForm.single_floor[0]
                } else if(this.searchForm.single_floor.length == 2){
                    this.searchForm.single_id = this.searchForm.single_floor[0]
                    this.searchForm.floor_id = this.searchForm.single_floor[1]
                } else {
                    this.searchForm.single_id = ''
                    this.searchForm.floor_id = ''
                }
                this.getTableList()
            },
            resetForm() {
                this.pageInfo = {
                    page: 1,
                    current: 1,
                    pageSize: 10,
                    total: 0
                }
                this.searchForm = {
                    device_name: '',
                    device_serial: '',
                    single_floor: [],
                    single_id: '',
                    floor_id: ''
                }
                this.getTableList()
            },
            
            getTableList(){
                this.tableLoading = true
                let params = {}
                Object.assign(params, this.pageInfo)
                Object.assign(params, this.searchForm)
                this.request('/community/village_api.AlarmDevice/getAlarmDeviceList', params).then((res) => {
                    this.tableLoading = false
                    this.tableList = res.list
                    this.pageInfo.total = res.count
                }).catch(err=>{
                    this.tableLoading = false
                })
            },
            
            handleTableChange(pagination, filters, sorte){
                this.pageInfo.current = pagination.current
                this.pageInfo.page = pagination.current
                this.pageInfo.pageSize = pagination.pageSize
                this.getTableList()
            },
            
            closeAdd(flag){
                this.addVisible = false
                this.device_id = null
                if(flag){
                    this.getTableList()
                }
            },
            
            addAlarm(){
                this.addVisible = true
            },
            
            orderSet(){
                this.setVisible = true
            },
            
            closeSet(){
                this.setVisible = false
            },
            
            editAlarm(record){
                this.addVisible = true
                this.device_id = record.device_id
            },
            
            lookAlarmRecord(record){
                this.alarmVisible = true
                this.device_id = record.device_id
            },
            
            closeAlarm() {
                this.alarmVisible = false
                this.device_id = ''
            },
            
            deleteConfirm(record){
                this.request('/community/village_api.AlarmDevice/deleteAlarmDevice', {device_id: record.device_id}).then(res=> {
                    this.$message.success('删除成功！')
                    this.getTableList()
                })
            },
            
            // 楼栋号
            getSingleListByVillage() {
                this.request(villageApi.getSingleListByVillage).then(res => {
                    if (res) {
                        const array = []
                        res.map(pro => {
                            array.push({
                                label: pro.name,
                                value: pro.id,
                                isLeaf: false
                            })
                        })
                        this.options = array
                    }
                })
            },
            // 单元楼
            getFloorList(id) {
                return new Promise(resolve => {
                    this.request(villageApi.getFloorList, {
                        pid: id
                    }).then(res => {
                        resolve(res)
                    })
                })
            },
            
            async loadDataFunc(selectedOptions) {
                const targetOption = selectedOptions[selectedOptions.length - 1];
                // targetOption.loading = true;
                // setTimeout(function() {
                //     targetOption.loading = false;
                // }, 100)
            },
            
            async setVisionsFunc(selectedOptions) {
                if (selectedOptions.length == 1) {
                    const options_temp = [...this.options];
                    const res = await this.getFloorList(selectedOptions[0]);
                    const children = [];
                    res.map(pro => {
                        children.push({
                            label: pro.name,
                            value: pro.id,
                            isLeaf: true
                        });
                        options_temp['children'] = children
                        return true;
                    });
                    options_temp.find(item => item.value == selectedOptions[0])['children'] = children;
                    this.options = options_temp
                }
            },
        },
    }
</script>

<style lang="less" scoped>
    .intelligent_alart {
        padding: 20px;
        background-color: #fff;
        height: 100%;
        .top_search {
            margin-top: 10px;
            .form_con {
                display: flex;
                align-items: center;

                .form_item {
                    width: 200px;
                    margin-left: 10px;
                }
            }
        }

        .bth_con {
            display: flex;
            align-items: center;
        }
        
        .table_con{
            margin-top: 10px;
            margin-left: 10px;
        }
    }
</style>
