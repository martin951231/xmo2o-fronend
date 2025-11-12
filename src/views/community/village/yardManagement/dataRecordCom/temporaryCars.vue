<template>
    <div class="temporary_cars">
        <div class="header_search" style="display: flex;">
            <div class="search_item">
                <a-select show-search placeholder="筛选项" style="width: 110px" :filter-option="filterOption"
                    @change="handleSelectChange" :value="pageInfo.param">
                    <a-select-option v-for="(item,index) in search_type" :key="item.id">
                        {{item.label}}
                    </a-select-option>
                </a-select>
                <a-input style="width:150px;" placeholder="请输入搜索关键字" v-model="pageInfo.value" />
            </div>
            
            <div class="search_item">
                <a-select show-search placeholder="筛选项" style="width: 110px;margin-left: 10px;"
                    @change="handlePlaceSelect" :value="pageInfo.place_type"  >
                    <a-select-option  value="1">
                        车场名称
                    </a-select-option>
                    <a-select-option  value="2">
                        车道名称
                    </a-select-option>
                </a-select>
                <a-input style="width:150px;" placeholder="请输入搜索关键字" v-model="pageInfo.place_value" />
            </div>
            <div class="search_item" style="margin-left: 10px;">
                <a-select show-search placeholder="请选筛选项" style="width: 110px;" v-model="pageInfo.date_type"   @change="handleDateSelect" >
                    <a-select-option  value="2">
                        出场日期
                    </a-select-option>
                    <a-select-option  value="1">
                        进场日期
                    </a-select-option>
                </a-select>
                <a-range-picker :format="dateFormat" v-model="dateValue" v-if="clearTime" @change="ondateChange" style="width: 320px;" />
                
            </div>
        
            <div class="search_item" style="margin-left: 10px;" v-if="pageInfo.date_type*1==2">
                <label class="label_title">停车时间：</label>
                <a-input-number id="stop_time" v-model="pageInfo.stop_time" :min="0.1" :precision="1" :step='0.5' :max="999999"  /><span style="margin-left: 5px;">内小时</span>
            </div>
            <div class="search_item" style="margin-left: 10px;" v-if="pageInfo.date_type*1==2">
                <a-select show-search placeholder="支付状况" style="width: 130px" v-model="pageInfo.pay_status">
                    <a-select-option v-for="(item,index) in pay_type_arr" :key="item.tkey">
                        {{item.tvalue}}
                    </a-select-option>
                </a-select>
            </div>
            
            <div class="search_item" style="margin-left: 15px; padding-top: 0;">
                <a-button type="primary" @click="queryThis()">查询</a-button>
                <a-button style="margin-left: 10px;" @click="clearThis()">清空</a-button>
            </div>
        </div>
        
        <div class="header_search" style="padding-top: 0;padding-bottom: 5px;">
            <a-button type="primary" :loading="exportLoadding" @click="exportThis" v-if="role_export3car==1" >excel导出</a-button>
        </div>
        
        <div class="table_content">
            <div style="padding-bottom: 5px;">合计费用：<span>{{allTotalMoney}}</span>元</div>
            <a-table :columns="columns" :data-source="temporaryList" :row-key="record=>record.record_id_index" :pagination="pageInfo" :loading="tableLoadding"
            @change="handleTableChange">
                <span slot="action" slot-scope="text, record">
                    <a @click="editThis(record)">详情</a>
                    <a-divider type="vertical" v-if="role_deltempcar==1" />
                    <a @click="delThis(record)" v-if="role_deltempcar==1">删除</a>
                </span>
            </a-table>
            <temporary-edit :temporary_id="temporary_id" :out_record_id="out_record_id" :visible="temporaryVisible" :modelTitle="modelTitle" @closeTemporary="closeTemporary"/>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import villageApi from '@/api/community/village';
    import temporaryEdit from './temporaryEdit.vue';
    const columns = [
        {
            title: '用户姓名',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: '用户手机号',
            dataIndex: 'user_phone',
            key: 'user_phone',
        },
        {
            title: '车场名称',
            dataIndex: 'park_name',
            key: 'park_name',
        },
        {
            title: '车牌号',
            dataIndex: 'car_number',
            key: 'car_number',
        },

        {
            title: '入场通道',
            dataIndex: 'in_channel_name',
            key: 'in_channel_name',
        },
        {
            title: '入场时间',
            dataIndex: 'in_accessTime',
            key: 'in_accessTime',
        },
        {
            title: '出场通道',
            dataIndex: 'out_channel_name',
            key: 'out_channel_name',
        },
        {
            title: '出场时间',
            dataIndex: 'out_accessTime',
            key: 'out_accessTime',
        },
        
        {
            title: '停车时间',
            dataIndex: 'park_time',
            key: 'park_time',
        },
        {
            title: '实付金额（元）',
            dataIndex: 'total',
            key: 'total',
        },
        
        {
            title: '订单编号',
            dataIndex: 'order_id',
            key: 'order_id',
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];
    const columns1 = [
        {
            title: '用户姓名',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: '用户手机号',
            dataIndex: 'user_phone',
            key: 'user_phone',
        },
        {
            title: '车场名称',
            dataIndex: 'park_name',
            key: 'park_name',
        },
        {
            title: '车牌号',
            dataIndex: 'car_number',
            key: 'car_number',
        },
        {
            title: '车辆卡类',
            dataIndex: 'park_car_type',
            key: 'park_car_type',
        },
        {
            title: '入场通道',
            dataIndex: 'in_channel_name',
            key: 'in_channel_name',
        },
        {
            title: '入场时间',
            dataIndex: 'in_accessTime',
            key: 'in_accessTime',
        },
        {
            title: '出场通道',
            dataIndex: 'out_channel_name',
            key: 'out_channel_name',
        },
        {
            title: '出场时间',
            dataIndex: 'out_accessTime',
            key: 'out_accessTime',
        },

        {
            title: '停车时间',
            dataIndex: 'park_time',
            key: 'park_time',
        },
        {
            title: '实付金额（元）',
            dataIndex: 'total',
            key: 'total',
        },

        {
            title: '订单编号',
            dataIndex: 'order_id',
            key: 'order_id',
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
                dateValue: [moment().subtract('days', 7), moment()],
                dateFormat: 'YYYY-MM-DD',
                columns,
                columns1,
                modelTitle: '',
                park_sys_type:'',
                temporaryVisible: false,
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    date: '',
                    outdate:[moment().subtract('days', 7).format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                    value: '',
                    param: 3,
                    place_type:'1',
                    place_value:'',
                    access_type:'0',
                    date_type:"2",
                    stop_time:'',
                    pay_status:'all',
                    showTotal: total => `共 ${total} 条`, // 显示总数
                },
                tableLoadding: false,
                temporary_type: 'add',
                temporary_id: '',
                temporaryList: [],
                frequency: false,
                search_type: [{id: 1, label: '用户姓名'},{id: 2, label: '用户手机号'},{id: 3, label: '车牌号'}],
                clearTime: true,
                exportLoadding: false,
                allTotalMoney:0,
                role_deltempcar:0,
                role_export3car:0,
                pay_type_arr:[{tkey:'all',tvalue:'全部'},{tkey:'free',tvalue:'免费出场'},{tkey:'paied',tvalue:'收费出场'}],
                out_record_id:'',
            }
        },
        
        components: {
            temporaryEdit
        },
        
        mounted(){
            this.getTemporaryList()
        },

        methods: {
            moment,
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
                this.getTemporaryList()
            },
            clearThis(){
                this.clearTime = false
                let timeout = setTimeout(()=>{
                    this.clearTime = true
                    clearTimeout(timeout)
                }, 10) 
                this.dateValue = null
                this.pageInfo = {
                    page: 1,
                    current: 1,
                    pageSize: this.pageInfo.pageSize,
                    total: 0,
                    date: [],
                    outdate:'',
                    param: 3,
                    value: '',
                    access_type:'0',
                    date_type:"2",
                    place_type:'1',
                }
                this.getTemporaryList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.pageInfo.pageSize = pageSize
                this.getTemporaryList()
                console.log('onTableChange==>', page, pageSize)
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getTemporaryList()
            },
            
            getTemporaryList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getTempParkList, that.pageInfo).then((res) => {
                    that.temporaryList = res.list
                    that.pageInfo.total = res.count
                    that.allTotalMoney = res.all_total_money ? res.all_total_money:0;
                    that.park_sys_type=res.park_sys_type
                    that.tableLoadding = false
                    if(res.role_export3car != undefined){
                        this.role_deltempcar=res.role_deltempcar;
                        this.role_export3car=res.role_export3car;
                    }else{
                        this.role_deltempcar=1;
                        this.role_export3car=1;
                    }
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            ondateChange(date, dateString) {
                console.log('date_type', this.pageInfo.date_type);
                 this.pageInfo.date = '';
                 this.pageInfo.outdate = '';
                if(this.pageInfo.date_type==2 || this.pageInfo.date_type=="2"){
                    this.pageInfo.outdate = dateString
                    this.pageInfo.date = ''
                }else if(this.pageInfo.date_type==1 || this.pageInfo.date_type=="1"){
                    this.pageInfo.outdate = '';
                    this.pageInfo.date = dateString
                }
                console.log(date, dateString);
            },
            editThis(record){
                this.temporary_id = record.record_id + ''
                this.out_record_id='';
                if(record.out_record_id){
                    this.out_record_id=record.out_record_id+'';
                }
                this.modelTitle = '临时车详情'
                this.temporaryVisible = true
            },
            delThis(record){
                let that = this
                let deldata={record_id:record.record_id};
                deldata.out_record_id=0;
                if(record.out_record_id){
                    deldata.out_record_id=record.out_record_id;
                }
                that.$confirm({
                    title: '操作提示',
                    cancelText: '取消',
                    okText: "确认删除",
                    content: '你确定要删除这条数据吗',
                    onOk() {
                        that.request(villageApi.delRecordCar, deldata).then((res) => {
                             that.$message.success('操作成功！')
                             that.getTemporaryList()
                        }).catch(e=>{
                            that.$message.error('操作失败！')
                        })
                    },
                    onCancel() {},
                });
            },
            delConfirm(record) {
                console.log("record=======>", record)
            },
            
            delCancel() {

            },
            
            exportThis(){
                let that = this
                that.exportLoadding = true
                that.request('/community/village_api.Parking/downTempPark', that.pageInfo).then((res) => {
                    if(res.error == 0){
                        window.location.href = res.url
                        this.$message.success('导出成功！')
                    } else{
                        this.$message.error('导出失败！')
                    }
                    that.exportLoadding = false
                }).catch(e=>{
                    that.exportLoadding = false
                })
            },
            
            closeTemporary(flag){
                this.temporary_id = ''
                this.temporaryVisible = false
                if(flag){
                    this.getTemporaryList()
                }
            },
            handleDateSelect(value){
                this.pageInfo.date_type=value;
                if(value==2 || value=="2"){
                    this.pageInfo.outdate = this.pageInfo.date
                    this.pageInfo.date = ''
                }else if(value==1 || value=="1"){
                    this.pageInfo.date = this.pageInfo.outdate
                    this.pageInfo.outdate = '';
                }
            },
            handleSelectChange(value) {
                this.pageInfo.param = value
                console.log(`selected ${value}`);
                this.$forceUpdate()
            },
            handlePlaceSelect(value) {
                this.pageInfo.place_type = value
                this.$forceUpdate()
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
        },
    }
</script>

<style lang="less" scoped>
    .temporary_cars {
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
