<template>
    <div class="vehicle_management">
        <div class="header_search">
            <div class="search_item" style="margin-left: 10px;">
                <a-select v-if="clearSelect" show-search placeholder="请选择" style="width: 120px" :filter-option="filterOption"
                    @change="handleSelectChange" v-model="pageInfo.search_type">
                    <a-select-option v-for="(item,index) in searchType" :value="item.search_type" :key="index">
                        {{item.label}}
                    </a-select-option>
                </a-select>
                <a-input style="width: 200px;" placeholder="请输入搜索关键字" v-model="pageInfo.search_value" />
                
                <div class="search_item" style="margin-left: 20px;">
                    <a-select show-search placeholder="请选筛选项" style="width: 130px;margin-left: 10px;" v-model="pageInfo.date_type"   @change="handleDateSelect" >
                        <a-select-option  value="1">
                            录入时间
                        </a-select-option>
                        <a-select-option  value="2">
                            审核时间
                        </a-select-option>
                    </a-select>
                    <a-range-picker v-if="clearSelect" @change="ondateChange" />
                </div>
                
                <a-button type="primary" style="margin-left: 10px;" @click="queryThis()">查询</a-button>
                <a-button style="margin-left: 20px;" @click="clearThis()">清空</a-button>
            </div>
            <div class="search_item" style="margin-left: 30px;">
                <a-button type="primary" @click="addThis"  v-if="role_addcar==1">添加车辆</a-button>
                <a-upload
                    v-if="role_importcar==1"
                    :showUploadList="false"
                    :data="uploadData"
                    name="file"
                    :multiple="false"
                    action="/v20/public/index.php/community/village_api.Parking/uplodeCar"
                    :headers="headers"
                    @change="handleUploadChange">
                    <a-button type="primary" class="operation_btn">导入车辆</a-button>
                </a-upload>
                <a-button v-if="role_importcar==1" type="primary" class="operation_btn" :loading="exportLoadding2" @click="downModel">导入模板</a-button>
                <a-button v-if="role_exportcar==1" type="primary" class="operation_btn" :loading="exportLoadding1" @click="downCar">excel导出</a-button>
                <a-button v-if="role_delcar_all==1" type="danger" class="operation_btn" @click="deleteMany">批量删除</a-button>

            </div>
        </div>
        <div>
          <a-button style="margin-left: 50px;" type="primary" class="operation_btn" :loading="exportLoadding3" @click="synchronization('A1')" v-if="park_sys_type.includes('A1')">A1批量同步智慧停车</a-button>
          <a-button style="margin-left: 50px;" type="primary" class="operation_btn" :loading="exportLoadding4" @click="parkWhite" v-if="park_sys_type.includes('D3')">D3一键同步白名单</a-button>
          <a-button style="margin-left: 50px;" type="primary" class="operation_btn" :loading="exportLoadding4" @click="parkHXWhite" v-if="park_sys_type.includes('HXT85')">HXT85一键同步白名单</a-button>
          <a-button style="margin-left: 50px;" type="primary" class="operation_btn" :loading="exportLoadding5" @click="whiteList" v-if="park_sys_type.includes('D7')">D7一键同步</a-button>
          <a-tooltip placement="top">
              <template #title>
                  <span>同步未到期和停车卡类为[免费车]的车辆</span>
              </template>
              <a-button style="margin-left: 50px;"  type="primary" class="operation_btn" :loading="exportLoadding4" @click="parkWhite" v-if="park_sys_type.includes('A11')">A11一键同步白名单</a-button>
          </a-tooltip>
          
          <a-tooltip placement="top" v-if="park_sys_type.includes('third_ai_park')">
              <template #title>
                  <span>批量同步车辆车库设置成对接的第三方车库并且有姓名、手机号数据的车辆信息，编辑页面-》确定 也可以单个同步单个车辆信息</span>
              </template>
              <a-button style="margin-left: 50px;"  type="primary" class="operation_btn" :loading="exportLoadding4" @click="synchronization('third_ai_park')" v-if="park_sys_type.includes('third_ai_park')">批量同步车辆信息到第三方对接平台</a-button>
          </a-tooltip>
          
        </div>
        <div class="table_content">
            <a-table :columns="columns" :row-key="record=>record.car_id" :pagination="pageInfo" 
            :loading="tableLoadding" @change="handleTableChange"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :data-source="vehicleList" >
                <span slot="end_time" slot-scope="text, record">
                        <a @click="$refs.carBindPositionListModel.showBindPositionList(record)" v-if="is_garage_multiple==1">点击查看</a>
                        <span v-if="is_garage_multiple<1">{{record.end_time}}</span>
                </span>
            
                <span slot="action" slot-scope="text, record">
                    <a @click="$refs.carBindPositionListModel.showBindPositionList(record)" >绑定车位列表</a>
                    <a-divider type="vertical" />
                    <a @click="editThis(record.car_id)" v-if="role_editcar==1">编辑</a>
                    <a-divider type="vertical" />
                    <a-popconfirm v-if="role_delcar==1" title="确定要删除该项吗?" ok-text="是" cancel-text="否" @confirm="delConfirm(record)"
                        @cancel="delCancel">
                        <a style="color: red;">删除</a>
                    </a-popconfirm>
                </span>

                <span slot="car_user_name"  slot-scope="text, record">
                    <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ record.car_user_name }}</span>
                    </template>
                   {{ record.car_user_name.length > 12 ? record.car_user_name.substring(0,12) + '...' : record.car_user_name }}
                  </a-tooltip>
                </span>

            </a-table>
            <vehicle-model v-if="vehicleVisible" :car_id="car_id" :vehicle_type="vehicle_type" :visible="vehicleVisible" :modelTitle="modelTitle" @closeVehicle="closeVehicle"/>
        </div>
        <carBindPositionList ref="carBindPositionListModel" @ok="retrunOk"/>
    </div>
</template>

<script>
    import vehicleModel from './components/vehicleModel.vue';
    import carBindPositionList from './components/carBindPositionList.vue';
    import villageApi from '@/api/community/village';
    const columns = [
        {
            title: '车辆编号',
            dataIndex: 'car_id',
            key: 'car_id',
        },
        {
            title: '车辆类型',
            dataIndex: 'car_type_str',
            key: 'car_type_str',
        },
        {
            title: '车位号',
            dataIndex: 'position_num',
            key: 'position_num',
            
        },{
            title: '停车卡类',
            dataIndex: 'parking_car_type',
            key: 'parking_car_type',
        },{
            title: '车牌号码',
            dataIndex: 'car_number',
            key: 'car_number',
        },{
            title: '停车到期时间',
            dataIndex: 'end_time',
            key: 'end_time',
            width:120,
            scopedSlots: {
                customRender: 'end_time'
            },
        },{
            title: '姓名',

            dataIndex: 'car_user_name',
            key: 'car_user_name',
            scopedSlots: {
                customRender: 'car_user_name'
            }
        },{
            title: '手机号',
            dataIndex: 'car_user_phone',
            key: 'car_user_phone',
            width:120,
        },{
            title: '与业主关系',
            dataIndex: 'relationship',
            key: 'relationship',
            width:110,
        },{
            title: '录入时间',
            dataIndex: 'car_addtime',
            key: 'car_addtime',
            width:110,
        },{
            title: '审核时间',
            dataIndex: 'examine_time',
            key: 'examine_time',
            width:110,
        },{
            title: '审核状态',
            dataIndex: 'examine_status',
            key: 'examine_status',
        },{
            title: '操作',
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            },
            width:210,
        },
    ];
    
    const columns2Arr = [
        {
            title: '车辆编号',
            dataIndex: 'car_id',
            key: 'car_id',
        },
        {
            title: '车辆类型',
            dataIndex: 'car_type_str',
            key: 'car_type_str',
        },
        {
            title: '车位号',
            dataIndex: 'position_num',
            key: 'position_num',
            width:150,
        },{
            title: '停车卡类',
            dataIndex: 'parking_car_type',
            key: 'parking_car_type',
        },
        {title: '储值卡余额',dataIndex: 'stored_balance',key: 'stored_balance'},
        {
            title: '车牌号码',
            dataIndex: 'car_number',
            key: 'car_number',
            width:110,
        },{
            title: '停车到期时间',
            dataIndex: 'end_time',
            key: 'end_time',
            width:110,
            scopedSlots: {
                customRender: 'end_time'
            },
        },{
            title: '姓名',

            dataIndex: 'car_user_name',
            key: 'car_user_name',
            scopedSlots: {
                customRender: 'car_user_name'
            }
        },{
            title: '手机号',
            dataIndex: 'car_user_phone',
            key: 'car_user_phone',
            width:120,
        },{
            title: '与业主关系',
            dataIndex: 'relationship',
            key: 'relationship',
            width:100,
        },{
            title: '录入时间',
            dataIndex: 'car_addtime',
            key: 'car_addtime',
            width:110,
        },{
            title: '审核时间',
            dataIndex: 'examine_time',
            key: 'examine_time',
            width:110,
        },{
            title: '审核状态',
            dataIndex: 'examine_status',
            key: 'examine_status',
        },{
            title: '操作',
            key: 'action',
             width:210,
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];
    export default {
        data() {
            return {
                columns,
                vehicleVisible: false,
                selectedRowKeys: [],
                modelTitle: '',
                park_sys_type:'',
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    search_value: '',
                    search_type: 1,
                    date_type:"1",
                    record_date:'',
                    pass_date:'',
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                frequency: false,
                vehicleList: [],
                tableLoadding: false,
                vehicle_type: 'add',
                searchType: [{search_type: 1, label: '车牌号'}, {search_type: 3, label: '车位号'},{search_type: 5, label: '业主姓名'},{search_type: 6, label: '业主手机号'}],
                car_id: '',
                headers: {
                    authorization: 'authorization-text'
                },
                exportLoadding1: false,
                exportLoadding2: false,
                exportLoadding3: false,
                exportLoadding4: false,
                exportLoadding5:false,
                clearSelect: true,
                uploadData: {village_id: 0,system_type:'village'},
                role_addcar: 0,
                role_delcar: 0,
                role_delcar_all: 0,
                role_editcar: 0,
                role_exportcar: 0,
                role_importcar: 0,
                select_names: [],
                select_names_str: '',
                is_garage_multiple:'',
            }
        },
        
        components: {
            vehicleModel,
            carBindPositionList
        },
        
        mounted(){
            let params = {}
            let checkType = this.$route.query.checkType
            params['checkType'] = checkType
            console.log('params', params)
            this.getVehicleList(params)
        },

        methods: {
            queryThis(){
                if(this.frequency) {
                    this.$message.warn('请求频繁，请稍后再试')
                    return
                }
                this.frequency = true
                let timeout = setTimeout(()=>{
                    this.frequency = false
                    clearTimeout(timeout)
                }, 2000)
                this.pageInfo.page = 1
                this.getVehicleList()
            },
            retrunOk(){
                that.getVehicleList()
            },
            clearThis(){
                this.pageInfo = {
                    page: 1,
                    current: 1,
                    search_value: '',
                    search_type: 1,
                    date_type:"1",
                    pageSize: this.pageInfo.pageSize,
                    total: 0
                }
                this.clearSelect = false
                let timeout = setTimeout(()=>{
                    this.clearSelect = true
                    clearTimeout(timeout)
                }, 100)
                this.getVehicleList()
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getVehicleList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.pageSize = pageSize
                this.pageInfo.page = page
                this.getVehicleList()
                console.log('onTableChange==>', page, pageSize)
            },
            getVehicleList(params){
                let that = this
                that.tableLoadding = true
                if (params && params['checkType']) {
                    that.pageInfo['checkType'] = params['checkType']
                }
                that.request(villageApi.getCarlist, that.pageInfo).then((res) => {
                    that.vehicleList = res.list
                    that.pageInfo.total = res.count
                    that.uploadData.village_id = res.village_id
                    that.tableLoadding = false
                    that.park_sys_type=res.park_sys_type
                    if(res.is_car_stored_func=='1' || res.is_car_stored_func==1 ){
                        that.columns=columns2Arr;
                    }else{
                        that.columns=columns;
                    }
                    if(res.is_garage_multiple!= undefined){
                        this.is_garage_multiple=res.is_garage_multiple;
                    }
                    if (res.role_addcar != undefined) {
                        this.role_addcar = res.role_addcar;
                        this.role_delcar = res.role_delcar;
                        this.role_delcar_all = res.role_delcar_all;
                        this.role_editcar = res.role_editcar;
                        this.role_exportcar = res.role_exportcar;
                        this.role_importcar = res.role_importcar;
                    } else {
                        this.role_addcar = 1;
                        this.role_delcar = 1;
                        this.role_delcar_all = 1;
                        this.role_editcar = 1;
                        this.role_exportcar = 1;
                        this.role_importcar = 1;
                    }
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            
            handleSelectChange(value) {
                this.pageInfo.search_type = value
                console.log(`selected ${value}`);
            },
            handleDateSelect(value){
                this.pageInfo.date_type=value;
                if(value==2 || value=="2"){
                    this.pageInfo.pass_date = this.pageInfo.record_date
                    this.pageInfo.record_date = ''
                }else if(value==1 || value=="1"){
                    this.pageInfo.record_date = this.pageInfo.pass_date
                    this.pageInfo.pass_date = '';
                }
            },
            ondateChange(date, dateString) {
                console.log('date_type', this.pageInfo.date_type);
                 this.pageInfo.record_date = '';
                 this.pageInfo.pass_date = '';
                if(this.pageInfo.date_type==2 || this.pageInfo.date_type=="2"){
                    this.pageInfo.pass_date = dateString
                }else if(this.pageInfo.date_type==1 || this.pageInfo.date_type=="1"){
                    this.pageInfo.record_date = dateString;
                }
                console.log(date, dateString);
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
            
            editThis(record){
                this.modelTitle = '编辑车辆'
                this.vehicle_type = 'edit'
                this.car_id = record+''
                this.vehicleVisible = true
            },
            
            delConfirm(record) {
                let that = this
                that.request(villageApi.delCar, {car_id: record.car_id}).then((res) => {
                    that.$message.success('删除成功！')
                    that.getVehicleList()
                })
            },
            
            delBindConfirm(record){
                console.log("record=======>", record)
            },

            delCancel() {

            },

            closeVehicle(flag){
                this.car_id = ''
                this.vehicleVisible = false
                if(flag){
                    this.getVehicleList()
                }
            },
            
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
                this.select_names = []
                this.select_names_str = ''
                this.vehicleList.map(v => {
                    selectedRowKeys.map((item, index) => {
                        if (item == v.car_id) {
                            this.select_names.push(v)
                        }
                    })
                })
                this.select_names.map((v, i) => {
                    if (i + 1 < this.select_names.length) {
                        this.select_names_str += v.car_number + '、'
                    } else {
                        this.select_names_str += v.car_number
                    }
                })
            },
            
            handleUploadChange(info){
                if (info.file.status === 'done') {
                    if(info.file.response.status == 1000){
                        this.$message.success(`上传成功！`);
                        if (info.file.response.data.url){
                            window.location.href = info.file.response.data.url
                        } else{
                            this.getVehicleList()
                        }
                    } else {
                        this.$message.error(info.file.response.msg);
                    }
                } else if (info.file.status === 'error') {
                    this.$message.error(`上传失败！`);
                }
            },
            
            addThis(){
                this.modelTitle = '添加车辆'
                this.vehicle_type = 'add'
                this.vehicleVisible = true
            },
            
            downCar(){
                let that = this
                that.exportLoadding1 = true
                that.request('/community/village_api.Parking/downCar', that.pageInfo).then((res) => {
                    if(res.error == 0){
                        window.location.href = res.url
                        this.$message.success('导出成功')
                    } else{
                        this.$message.error('导出失败')
                    }
                    that.exportLoadding1 = false
                }).catch(e=>{
                    that.exportLoadding1 = false
                })
            },
            
            downModel(){
                let that = this
                that.exportLoadding2 = true
                that.request('/community/village_api.Parking/downCarModel', that.pageInfo).then((res) => {
                    if(res.error == 0){
                        window.location.href = res.url
                        that.$message.success('导出成功')
                    } else{
                        that.$message.error('导出失败')
                    }
                    that.exportLoadding2 = false
                }).catch(e=>{
                    that.exportLoadding2 = false
                })
            },
            parkHXWhite(){
                let that = this
                that.exportLoadding4 = true
                that.request('/community/village_api.Parking/allAddHXWhiteList',{}).then((res) => {
                    if(res.status){
                        this.$message.success(res.msg)
                    } else {
                        this.$message.error(res.msg)
                    }
                    that.exportLoadding4 = false
                }).catch(e=>{
                    that.exportLoadding4 = false
                })
            },
            parkWhite(){
                let that = this
                that.exportLoadding4 = true
                that.request('/community/village_api.Parking/allAddParkWhite',{}).then((res) => {
                    if(res.status){
                        this.$message.success(res.msg)
                    } else {
                        this.$message.error(res.msg)
                    }
                    that.exportLoadding4 = false
                }).catch(e=>{
                    that.exportLoadding4 = false
                })
            },
            whiteList(){
                let that = this
                that.exportLoadding5 = true
                that.request('/community/village_api.Parking/allAddWhiteList',{}).then((res) => {
                    if(res){
                        this.$message.success('同步成功！')
                    } else {
                        this.$message.error('同步失败！')
                    }
                    that.exportLoadding5 = false
                }).catch(e=>{
                    that.exportLoadding5 = false
                })
            },
            synchronization(xtype=''){
                let that = this
                that.exportLoadding3 = true
                that.request('/community/village_api.Parking/sysParkCarDevice',{xtype:xtype}).then((res) => {
                    if(res.is_job_exe){
                        this.$message.success('操作成功！')
                    }else if(res.retval.code == 1){
                        this.$message.success('同步成功！')
                    } else {
                        this.$message.error('同步失败！')
                    }
                    that.exportLoadding3 = false
                }).catch(e=>{
                    that.exportLoadding3 = false
                })
            },
            deleteMany() {
                let that = this
                if (that.selectedRowKeys.length == 0) {
                    that.$message.warn('请选择要删除的车辆')
                    return
                }
                that.$confirm({
                    title: '提示',
                    content: '确定要删除【' + that.select_names_str + '】这些数据吗',
                    onOk() {
                        that.request(villageApi.delCar, {
                            car_id: that.selectedRowKeys
                        }).then((res) => {
                            that.$message.success('删除成功！')
                            that.select_names_str = ''
                            that.selectedRowKeys = []
                            that.getVehicleList()
                        })
                    },
                    onCancel() {},
                });

            },
        },
    }
</script>

<style lang="less" scoped>
    .vehicle_management {
        width: 98%;
        background-color: #ffffff;
        margin: 10px;

        .header_search {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            display: flex;

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
