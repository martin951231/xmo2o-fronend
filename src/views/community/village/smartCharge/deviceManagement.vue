<template>
    <div class="device_management">
        <div class="top_list">
            <div class="list_item" v-for="(item, index) in topList" :key="index">
                <div class="left_icon">
                    <img :src="item.icon" alt="">
                </div>
                <div class="right_con">
                    <div class="label">{{item.label}}</div>
                    <div class="value">{{item.value}}</div>
                </div>
            </div>
        </div>

        <div class="search_container">
            <div class="search_item">
                <div class="label">设备名称：</div>
                <div class="input_con">
                    <a-input style="width: 160px;" placeholder="请输入" v-model="searchParams.equipment_name"></a-input>
                </div>
            </div>

            <div class="search_item">
                <div class="label">设备唯一编码：</div>
                <div class="input_con">
                    <a-input style="width: 160px;" placeholder="请输入" v-model="searchParams.equipment_num"></a-input>
                </div>
            </div>

            <div class="search_item">
                <div class="label">电桩类型：</div>
                <div class="input_con">
                    <a-select placeholder="请选择" style="width: 160px" @change="(value)=>handleSelectChange(value, 'type')" :value="searchParams.type">
                        <a-select-option v-for="(item, index) in chargePileList" :key="index" :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                </div>
            </div>

           <!-- <div class="search_item">
                <div class="label">枪头状态：</div>
                <div class="input_con">
                    <a-select placeholder="请选择" style="width: 160px" @change="(value)=>handleSelectChange(value, 'gun_head_status')" :value="searchParams.gun_head_status">
                        <a-select-option v-for="(item, index) in gunTypeList" :key="index" :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                </div>
            </div> -->

            <div class="search_item">
                <div class="label">状态：</div>
                <div class="input_con">
                    <a-select style="width: 160px" @change="(value)=>handleSelectChange(value, 'status')" :value="searchParams.status">
                        <a-select-option v-for="(item, index) in statusList" :key="index" :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                </div>
            </div>

            <div class="search_item">
                <a-button type="primary" @click="queryThis">查询</a-button>
                <a-button icon="plus" type="primary" style="margin-left: 10px;" @click="addMyDevice(0, 'add')">添加设备</a-button>
            </div>
        </div>

        <div class="mode_con">
            <div class="btn_item" :class="currentModeIndex == index?'active': ''" @click="changeModel(item, index)"
                v-for="(item, index) in modeList" :key="index">{{item.label}}</div>
        </div>

        <div class="tabel_con" v-if="currentModeIndex == 0">
            <a-table :columns="columns" :data-source="tableList" @change="handleTableChange" :loading="tableLoading" :pagination="searchParams">
                <span slot="action" slot-scope="text, record">
                    <a @click="lookDetail(record.id)">查看</a>
                    <a-divider type="vertical" />
                    <a @click="addMyDevice(record.id, 'edit')">编辑</a>
                    <a-divider type="vertical" />
                   <!-- <a @click="calibration()">校时校价</a>
                    <a-divider type="vertical" />
                    <a @click="lookErcode()">二维码</a>
                    <a-divider type="vertical" /> -->
                    <a style="color: red;" @click="deleteThis(record)">删除</a>
                </span>
            </a-table>
        </div>

        <div class="array_mode" v-else>
            <div class="container" v-if="tableList.length>0">
                <div class="array_item" v-for="(item, index) in tableList" :key="index">
                    <a-tooltip placement="topLeft">
                        <template slot="title">
                            <span>{{item.equipment_num}}</span>
                        </template>
                        <div class="charge_number">{{item.equipment_num}}</div>
                    </a-tooltip>
                    <div class="charge_icon">
                        <img :src="item.icon" alt="">
                    </div>
                    <a-tooltip placement="topLeft">
                        <template slot="title">
                            <span>{{item.equipment_name}}</span>
                        </template>
                        <div class="charge_title">{{item.equipment_name}}</div>
                    </a-tooltip>
                    <a-tooltip placement="topLeft">
                        <template slot="title">
                            <span>{{item.type_txt}}</span>
                        </template>
                        <div class="charge_type">{{item.type_txt}}</div>
                    </a-tooltip>
                    <a-tooltip placement="topLeft">
                        <template slot="title">
                            <span>{{item.brand_type_txt}}</span>
                        </template>
                        <div class="charge_num">品牌类型：{{item.brand_type_txt}}</div>
                    </a-tooltip>
                    <div class="operate_btn" @click="lookDetail(item.id)">详情</div>
                </div>
            </div>
            <div class="no_data" style="width: 100%;text-align: center;" v-else>
                暂无数据
            </div>
            <a-pagination
            @change="handleTableChange1"
            v-if="tableList.length>0"
            style="float: right;margin: 30px;"
            :total="searchParams.total"
            :current="searchParams.current"
            :pageSize="searchParams.limit"/>
        </div>
        
        <addDevice :device_id="device_id" :visible="deviceVisible" @closeDevice="closeThis" />
        <deviceDetail :device_id="device_id" :visible="detailVisible" @closeDetail="closeThis" />
    </div>
</template>

<script>
    import addDevice from "./components/addDevice.vue";
    import deviceDetail from "./components/deviceDetail.vue";
    const columns = [{
            title: '设备品牌',
            dataIndex: 'device_brand_txt',
            key: 'device_brand_txt',
            width: 160
        },
        {
            title: '品牌类型',
            dataIndex: 'brand_type_txt',
            key: 'brand_type_txt',
            width: 160
        },
        {
            title: '设备名称',
            dataIndex: 'equipment_name',
            key: 'equipment_name',
            width: 160
        },
        {
            title: '设备唯一编码',
            key: 'equipment_num',
            dataIndex: 'equipment_num',
            width: 190
        },
        
        {
            title: '设备状态',
            key: 'status_txt',
            dataIndex: 'status_txt',
            width: 160
        },
        
        {
            title: '设备类型',
            key: 'type_txt',
            dataIndex: 'type_txt',
            width: 160
        },
        
        {
            title: '备注',
            key: 'remark',
            dataIndex: 'remark',
            width: 220
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
                msg: 'device_management',
                topList: [],
                searchParams: {
                    equipment_name: '',
                    equipment_num: '',
                    type: '',
                    gun_head_status: '',
                    status: '',
                    page: 1,
                    limit: 10,
                    current: 1,
                    pageSize: 10,
                    total: 0
                },

                modeList: [{
                    label: '表格模式'
                }, {
                    label: '阵列模式'
                }],
                currentModeIndex: 0,
                chargePileList: [{label: '全部', value: ''}, {label: '直流', value: 1}, {label: '交流', value: 2}],
                gunTypeList: [{label: '全部', value: ''}, {label: '空闲', value: 1}, {label: '插枪', value: 2},{label: '充电中', value: 3}, {label: '充满', value: 4},{label: '异常', value: 5}],
                statusList: [{label: '全部', value: ''}, {label: '在线', value: 1}, {label: '离线', value: 3}, {label: '故障', value: 4}],
                tableList: [],
                columns,
                deviceVisible: false,
                detailVisible: false,
                isRequest: true,
                count: 0,
                limit: 0,
                tableLoading: false,
                device_id: 0
            }
        },
        
        components: {
            addDevice,
            deviceDetail
        },
        
        mounted() {
            this.getCountPileEquipment()
            this.getEquipmentList()
        },

        methods: {
            changeModel(item, index) {
                console.log(item, index)
                if (this.currentModeIndex == index) {
                    console.log("重复")
                    return
                }
                this.currentModeIndex = index
            },
            handleSelectChange(value, type) {
                this.searchParams[type] = value
                this.$forceUpdate()
            },
            addMyDevice(id, type){
                console.log(id, type)
                if(type == 'edit'){
                    this.device_id = id*1
                } else {
                    this.device_id = 0
                }
                this.deviceVisible = true
            },
            closeThis(flag){
                this.deviceVisible = false
                this.detailVisible = false
                this.device_id = 0
                if(flag == 'refrash'){
                    this.getEquipmentList()
                }
            },
            lookDetail(id){
                this.device_id = id*1
                this.detailVisible = true
            },
            calibration(record){
                console.log(record)
            },
            lookErcode(record){
                console.log(record)
            },
            deleteThis(record){
                let that = this
                this.$confirm({
                    title: '提示',
                    content: '确定要删除此项内容吗？',
                    onOk() {
                        that.request('/community/village_api.Pile/delEquipment', {id: record.id}).then((res) => {
                            that.searchParams.current = 1
                            that.searchParams.page = 1
                            that.getEquipmentList()
                            that.$message.success('删除成功！')
                        })
                    },
                    onCancel() {},
                });
            },
            
            getCountPileEquipment(){
                let that = this
                that.request('/community/village_api.Pile/countPileEquipment').then((res) => {
                    that.topList = [{label: '设备总数', value: res.sum_count + '个', icon: "https://hf.pigcms.com/static/wxapp/newCharge/status_2.png"},
                                    {label: '在线数量', value: res.use_count + '个', icon: "https://hf.pigcms.com/static/wxapp/newCharge/status_1.png"},
                                    {label: '空闲设备', value: res.free_count + '个', icon: "https://hf.pigcms.com/static/wxapp/newCharge/status_4.png"},
                                    {label: '离线设备', value: res.offline_count + '个', icon: "https://hf.pigcms.com/static/wxapp/newCharge/status_5.png"},
                                    {label: '故障设备', value: res.fault_count + '个', icon: "https://hf.pigcms.com/static/wxapp/newCharge/status_3.png"}]
                })
            },
            
            getEquipmentList(){
                let that = this
                that.tableLoading = true
                that.request('/community/village_api.Pile/getEquipmentList', that.searchParams).then((res) => {
                    that.tableList = res.list
                    that.count = res.count
                    that.limit = res.limit
                    that.tableLoading = false
                    that.searchParams.total = res.count
                })
            },
            
            handleTableChange({current, pageSize}){
                this.searchParams.page = current
                this.searchParams.current = current
                this.getEquipmentList()
            },
            
            queryThis(){
                if(this.isRequest){
                    this.isRequest = false
                    this.searchParams.page = 1
                    this.searchParams.current = 1
                    this.getEquipmentList()
                } else {
                    this.$message.warn("请求频繁~~~")
                }
                let timeout = setTimeout(()=>{
                    this.isRequest = true
                    clearInterval(timeout)
                },2000)
            },
            handleTableChange1(val){
                this.searchParams.page = val
                this.searchParams.current = val
                this.getEquipmentList()
            }
        }
    }
</script>

<style lang="less" scoped>
    .device_management {
        width: 100%;
        background: #ffffff;

        .top_list {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-top: 10px;
            padding: 15px;
            .list_item {
                margin-left: 10px;
                padding: 15px;
                background-color: #eeeeee;
                border: 1px solid #dddddd;
                display: flex;
                align-items: center;
                justify-content: space-around;

                &:nth-child(1) {
                    margin-left: 0;
                }

                .left_icon {
                    width: 50px;
                    height: 50px;

                    img {
                        width: 50px;
                        height: 50px;
                    }
                }

                .right_con {
                    margin-left: 57px;
                    .label {
                        color: #999999;
                    }
                    .value {
                        margin-top: 3px;
                        color: #666666;
                    }
                }
            }
        }

        .search_container {
            display: flex;
            padding: 15px;
            background: #ffffff;
            align-items: center;
            .search_item {
                display: flex;
                align-items: center;
                margin-left: 10px;

                &:nth-child(1) {
                    margin-left: 0;
                }
                .label {}
                .input_con {}
            }
        }

        .mode_con {
            display: flex;
            margin-top: 10px;
            .btn_item {
                padding: 8px 22px;
                background-color: #ffffff;
                color: #999999;
                border: 1px solid #999999;
                cursor: pointer;
                &:nth-child(1) {
                    border-top-left-radius: 5px;
                    border-bottom-left-radius: 5px;
                    margin-left: 10px;
                }
                &:nth-child(2) {
                    border-top-right-radius: 5px;
                    border-bottom-right-radius: 5px;
                }
            }

            .active {
                color: #1890ff;
                border: 1px solid #1890ff;
            }
        }

        .array_mode{
            padding: 20px 0;
            .container{
                display: flex;
                flex-wrap: wrap;
                .array_item{
                    padding: 15px;
                    background-color: #ffffff;
                    border: 1px solid #dddddd;
                    border-radius: 5px;
                    margin: 10px;
                    display: flex;
                    flex-direction: column;
                    .charge_number{
                        width: 140px;
                        display: inline-block;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .charge_icon{
                        img{
                        }
                    }
                    .charge_title{
                        color: #333333;
                        width: 140px;
                        display: inline-block;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .charge_type{
                        width: 140px;
                        display: inline-block;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .charge_num{
                        width: 140px;
                        display: inline-block;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .operate_btn{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        margin-top: 30px;
                        background-color: #1890ff;
                        border-radius: 5px;
                        padding: 2px;
                        cursor: pointer;
                        color: #ffffff;
                    }
                }
            }
        }
    }
</style>
