<template>
    <div class="lane_management">
        <div class="header_search">
            <a-collapse accordion>
                <a-collapse-panel key="1" header="操作说明">
                    每个通道二维码可自行打印出来，张贴在对应的通道处<br />
                    入口二维码：用于无牌车扫码登记进入。<br />
                    出口二维码：用户车辆到达出口扫码付费时，系统会自动快速读取当前车辆的车牌号，免输入，方便快捷。<br />
                </a-collapse-panel>
            </a-collapse>
        </div>

        <div class="header_search" style="padding-top: 0;">
            <a-button type="primary" @click="addThis" v-if="role_addcarlane==1">添加车道</a-button>
        </div>

        <div class="table_content">
            <a-table :columns="columns" :row-key="record=>record.id" :pagination="pageInfo" :loading="tableLoadding" @change="handleTableChange" :data-source="laneList">
                <a-tag  slot="passage_direction" slot-scope="text, record" style="width: 50px;height: 25px;text-align: center;" :color="record.passage_direction==0?'green':(record.passage_direction == 1?'blue':'blue')" >
                    {{ record.passage_direction == 0?'出口':record.passage_direction == 1?'入口':'出入口'}}
                </a-tag>
                <template slot="status" slot-scope="text, record">
                    <a-switch checked-children="开启" un-checked-children="关闭" :checked="record.status==1 || record.status=='1' ? true:false" @change="(value)=>switchChange(value, record)" />
                </template>
                <template slot="mac_address" slot-scope="text, record">
                    <a :href="record.mac_address_uri" target="_blank" v-if="record.mac_address_uri" >{{record.mac_address}}</a>
                    <span v-if="!record.mac_address_uri" >{{record.mac_address}}</span>
                </template>
                <span slot="action" slot-scope="text, record">
                    <a v-if="record.is_button_show && (record.park_sys_type=='D3' || record.park_sys_type=='A11' || record.park_sys_type=='HXT85' )" @click="$refs.showScreenSetModel.add(record.id)">设置显屏内容</a>
                    <a-divider v-if="record.is_button_show && (record.park_sys_type=='D3' || record.park_sys_type=='A11' || record.park_sys_type=='HXT85')" type="vertical" />
                    <a v-if="record.is_button_show" @click="manualLiftingrod(record)">手动抬杆</a>
                    <a-divider v-if="record.is_button_show" type="vertical" />
                    <a @click="lookErcode(record)">{{record.passage_direction == 1?'入口二维码':'出口二维码'}}</a>

                     <a-divider v-if="record.is_button_show" type="vertical" />
                    <a v-if="record.is_button_show" @click="$refs.addParkInfoModel.add(record.id,record.passage_direction)">{{record.passage_direction == 1?'添加入场纪录':'添加出场纪录'}}</a>

                    <a-divider type="vertical" />
                    <a @click="editThis(record)">编辑</a>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确定要删除该项吗?" ok-text="是" cancel-text="否" @confirm="delConfirm(record)"
                        @cancel="delCancel">
                        <a style="color: red;">删除</a>
                    </a-popconfirm>

                </span>

                <span slot="passage_name"  slot-scope="text, record">
                    <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ record.passage_name }}</span>
                    </template>
                   {{ record.passage_name.length > 10 ? record.passage_name.substring(0,10) + '...' : record.passage_name }}
                  </a-tooltip>

                </span>

            </a-table>
            <add-park-info ref="addParkInfoModel"/>
            <show-screen-set ref="showScreenSetModel"/>
            <lane-model :lane_id="lane_id" :lane_type="lane_type" :park_sys_type="park_sys_type" :device_protocol_change="device_protocol_change" :visible="laneVisible" :modelTitle="modelTitle" @closeLane="closeLane" :device_detail_info="device_detail_info" :device_detail_info_port="device_detail_info_port" :device_protocol_change_tips="device_protocol_change_tips" />
            <a-modal :title="codeTitle" :width="500" :visible="erCodeVisible" @ok="handleCodeOk"
                @cancel="handleCodeCancel" :footer="null">
                <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
                    <img style="width: 150px; height: 150px;" :src="ercodeUrl">
                </div>
            </a-modal>

            <a-modal :title="openTitle" :width="500" :visible="openGateVisible" :maskClosable="false" @ok="handleOpenGateOk" @cancel="handleOpenGateCancel" >
                <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
                    <div class="add_black">
                        <a-form-model-item label="开闸车牌号" prop="car_number">
                            <a-input v-model="openGate.car_number" placeholder="请输入开闸车牌号"></a-input>
                        </a-form-model-item>
                        <a-form-model-item label="类型" prop="open_type" v-if="park_open_show">
                            <a-radio-group name="open_type" v-model="openGate.open_type" @change="changeOpenType">
                                <a-radio :value="2">免费放行</a-radio>
                                <a-radio :value="1">收取费用</a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item label="停车时长" prop="car_number" v-if="pay_show">
                            <a-input v-model="openGate.park_time" placeholder="请输入停车时长（单位：分钟）"></a-input>
                        </a-form-model-item>
                        <a-form-model-item label="停车费用" prop="car_number" v-if="pay_show">
                            <a-input v-model="openGate.price" placeholder="请输入停车费用（单位：元）"></a-input>
                        </a-form-model-item>
                      <a-form-model-item label="线下支付方式" prop="pay_type" v-if="pay_show">
                            <a-select  placeholder="请选择" style="width: 200px"  @change="(value) => handleSelectChange(value, 'pay_type')"  :value="openGate.pay_type">
                                <a-select-option v-for="(item,index) in parkTypeList" :value="item.id">
                                    {{item.name}}
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </div>
                </a-form-model>
            </a-modal>
        </div>
    </div>
</template>

<script>
    import laneModel from './components/laneModel.vue';
    import addParkInfo from './components/addParkInfo.vue';
    import showScreenSet from './components/showScreenSet';
    import villageApi from '@/api/community/village';
    import Vue from "vue";
    import villageNew from "@/api/community/village/villageNewApi";
    const columns = [
        {
            title: '车道名称',
            dataIndex: 'passage_name',
            key: 'passage_name',
            width: 180,
            scopedSlots: {
                customRender: 'passage_name'
            }
        },
        {
            title: '所属车库',
            dataIndex: 'garage_name',
            key: 'garage_name',
        },
        {
            title: '所属区域',
            dataIndex: 'area_name',
            key: 'area_name',
        }, {
            title: '通道号',
            dataIndex: 'channel_number',
            key: 'channel_number',
        },{
            title: '设备编号',
            dataIndex: 'device_number',
            key: 'device_number',
        },
        {
            title: '设备MAC',
            dataIndex: 'mac_address',
            key: 'mac_address',
            scopedSlots: {
                customRender: 'mac_address'
            }
        },
        {
            title: '车道类型',
            key: 'passage_direction',
            scopedSlots: {
                customRender: 'passage_direction'
            },
        },
        {
            title: '车道状态',
            dataIndex: 'status_txt',
            key: 'status_txt',
            scopedSlots: {
                customRender: 'status'
            },
        },
        {
            title: '最新心跳时间',
            dataIndex: 'last_heart_time',
            key: 'last_heart_time',
        },
        {
            title: '操作',
            key: 'action',
            width: 560,
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];

    export default {
        data() {
            return {
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
				codeTitle:'',
                openTitle:'是否开闸',
                parklotName: '',
                columns,
                park_open_show:false,
                pay_show:false,
                openGateVisible:false,
                laneVisible: false,
                selectedRowKeys: [],
                modelTitle: '',
                erCodeVisible: false,
                tableLoadding: false,
                openGate:{
				    id:'',
                    passage_direction:'',
                    car_number:'',
                    open_type:2,
                    price:'',
                    park_time:'',
                    pay_type:''

                },
                pageInfo: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showTotal: total => `共 ${total} 条`, // 显示总数
                },
                laneList: [],
                parkTypeList: [],
                lane_type: 'add',
                lane_id: '',
                park_sys_type: '',
                ercodeUrl: '',
                role_addcarlane: 0,
                role_delcarlane: 0,
                role_editcarlane: 0,
                role_ewmcarlane: 0,
                role_liftingrod: 0,
                role_recordcar: 0,
                role_screenset: 0,
                device_protocol_change:0,
                device_detail_info:0,
                device_detail_info_port:0,
                device_protocol_change_tips:0,
            }
        },
        
        components: {
            laneModel,
            addParkInfo,
            showScreenSet
        },

        mounted() {
            this.getLaneList()
        },

        methods: {
             switchChange(value, record){
                let that = this
                let id=record.id
                let status = value?1:2
                 that.request('/community/village_api.Parking/editPassageStatus', {id, status}).then((res) => {
                     this.getLaneList()
                     this.$message.success('修改成功！')
                 }).catch(e => {
                     this.getLaneList()
                 })
                 
            },
            manualLiftingrod(record){
                let that = this
                that.openGate.id=record.id
                console.log('record1111',record)
                if (record.passage_direction==1){
                    that.park_open_show=false
                }else{
                    that.park_open_show=true
                }
                that.pay_show=false
                that.openGate.passage_direction='';
                that.openGate.pay_type='';
                that.openGate.car_number='';
                that.openGate.open_type=2;
                that.openGate.price='';
                that.openGate.park_time='';
                that.openGateVisible = true;
                that.parkTypeList=[];

            },
            handleOpenGateOk(){
                let that = this
                that.request(villageApi.open_gate, that.openGate).then((res) => {
                    if(res != '0'){
                        that.$message.success('抬杆成功！')
                    } else{
                        that.$message.error('抬杆失败！')
                    }
                    that.openGateVisible = false;
                    that.openGate.passage_direction='';
                    that.openGate.car_number='';
                    that.openGate.open_type=2;
                    that.openGate.id='';
                })
            },
            handleSelectChange(value, type) {
                this.openGate[type] = value
                this.$forceUpdate()
            },
            changeOpenType(value){
                console.log('value11',value.target.value)
                this.openGate.pay_type='';
                this.parkTypeList=[];
                this.openGate.price='';
                this.openGate.park_time='';
                if (value.target.value==1){
                    this.pay_show=true
                    this.request(villageApi.getOfflineList).then((res) => {
                       console.log('pay_type11',res)
                        this.parkTypeList=res
                    })
                }else{
                    this.pay_show=false
                }
            },
            editThis(record){
                this.modelTitle = '编辑车道'
                this.lane_type='edit'
                this.laneVisible = true
                this.lane_id = record.id+''
                this.park_sys_type = record.park_sys_type
            },
            
            delConfirm(record) {
                let that = this
                that.request(villageApi.delPassage, {id: record.id}).then((res) => {
                    that.$message.success('删除成功！')
                    that.getLaneList()
                })
            },
            
            getLaneList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getPassageList, that.pageInfo).then((res) => {
                    that.laneList = res.list
                    that.pageInfo.total = res.count
                    that.park_sys_type=res.park_sys_type
                    that.tableLoadding = false
                    if (res.role_addcarlane != undefined) {
                        this.role_addcarlane = res.role_addcarlane;
                        this.role_delcarlane = res.role_delcarlane;
                        this.role_editcarlane = res.role_editcarlane;
                        this.role_ewmcarlane = res.role_ewmcarlane;
                        this.role_liftingrod = res.role_liftingrod;
                        this.role_recordcar = res.role_recordcar;
                        this.role_screenset = res.role_screenset;
                    } else {
                        this.role_addcarlane = 1;
                        this.role_delcarlane = 1;
                        this.role_editcarlane = 1;
                        this.role_ewmcarlane = 1;
                        this.role_liftingrod = 1;
                        this.role_recordcar = 1;
                        this.role_screenset = 1;
                    }
                    if(res.device_protocol_change!= undefined){
                        this.device_protocol_change=res.device_protocol_change;
                    }
                    if(res.device_detail_info!= undefined){
                        this.device_detail_info=res.device_detail_info;
                    }
                     if(res.device_detail_info_port!= undefined){
                         this.device_detail_info_port=res.device_detail_info_port;
                     }   
                     if(res.device_protocol_change_tips!= undefined){
                         this.device_protocol_change_tips=res.device_protocol_change_tips*1;
                     }   
                    
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            
            delCancel() {
                
            },

            closeLane(flag){
                this.lane_id = ''
                this.park_sys_type = ''
                this.laneVisible = false
                if(flag){
                    this.getLaneList()
                }
            },
            
            addThis(){
                this.modelTitle = '添加车道'
                this.lane_type='add'
                this.laneVisible = true
            },
            
            lookErcode(record){
                let that = this
                if(record.passage_direction == 1){
                    this.codeTitle = '查看入口二维码'
                } else{
                    this.codeTitle = '查看出口二维码'
                }
                that.request(villageApi.getQrcodePassage, {passage_id: record.id}).then((res) => {
                    that.ercodeUrl = res.qrcode
                    that.erCodeVisible = true
                })
            },
            
            handleCodeOk(){
                this.erCodeVisible = false
            },
            
            handleCodeCancel(){
                this.ercodeUrl = ''
                this.erCodeVisible = false
            },
            handleOpenGateCancel(){
                this.openGate.id=''
                this.openGateVisible = false
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getLaneList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.pageSize = pageSize
                this.getLaneList()
                console.log('onTableChange==>', page, pageSize)
            },
        },
    }
</script>

<style lang="less" scoped>
    .lane_management {
        width: 98%;
        background-color: #ffffff;
        margin: 10px;

        .header_search {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            // display: flex;

            .search_item {
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }
            
            .operation_btn{
                margin-left: 20px;
            }
        }

        .table_content {
            padding: 0 20px;
            margin: 10px 0;
        }
    }
    
</style>
