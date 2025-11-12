<template>
    <div class="month_cars">
        <div class="header_search" style="display: flex;">
            <div class="search_item">
                <a-select show-search placeholder="筛选项" style="width: 120px" :filter-option="filterOption"
                    @change="handleSelectChange" :value="pageInfo.param">
                    <a-select-option v-for="(item,index) in search_type" :key="item.id">
                        {{item.label}}
                    </a-select-option>
                </a-select>
                <a-input style="width:200px;" placeholder="请输入搜索关键字" v-model="pageInfo.value" />
            </div>
            
            <div class="search_item" style="margin-left: 10px;">
                <a-select show-search placeholder="请选筛选项" style="width: 110px;" v-model="pageInfo.date_type"   @change="handleDateSelect" >
                    <a-select-option  value="1">
                        进场日期
                    </a-select-option>
                    <a-select-option  value="2">
                        出场日期
                    </a-select-option>
                </a-select>
                <a-range-picker :format="dateFormat" v-model="dateValue" v-if="clearTime" @change="ondateChange" style="width: 320px;" />
            </div>
            
            <div class="search_item" style="margin-left: 10px; padding-top: 0;">
                <a-button type="primary" @click="queryThis()">查询</a-button>
                <a-button style="margin-left: 10px;" @click="clearThis()">清空</a-button>
            </div>
        </div>
        
        <div class="header_search" style="padding-top: 0;">
            <a-button type="primary" :loading="exportLoadding" @click="exportThis" v-if="role_export2car==1">excel导出</a-button>
        </div>
        
        <div class="table_content">
            <a-table :columns="park_sys_type=='A11'?columns1:columns" :data-source="monthList" :row-key="record=>record.record_id" :pagination="pageInfo" :loading="tableLoadding"
            @change="handleTableChange">
                <span slot="action" slot-scope="text, record">
                    <a @click="editThis(record)">详情</a>
                </span>
            </a-table>
            <month-edit :month_id="month_id" :visible="monthVisible" :modelTitle="modelTitle" @closeMonth="closeMonth"/>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import monthEdit from './monthEdit.vue';
    import villageApi from '@/api/community/village';
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
                columns1,
                columns,
                modelTitle: '',
                monthVisible: false,
                park_sys_type:'',
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    date: [moment().subtract('days', 7).format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                    outdate:'',
                    value: '',
                    param: 3,
                    date_type:"1",
                    showTotal: total => `共 ${total} 条`, // 显示总数
                },
                tableLoadding: false,
                month_type: 'add',
                month_id: '',
                monthList: [],
                frequency: false,
                search_type: [{id: 1, label: '用户姓名'},{id: 2, label: '用户手机号'},{id: 3, label: '车牌号'}],
                clearTime: true,
                exportLoadding: false,
                role_export2car:0,
            }
        },
        
        mounted(){
            this.getMonthParkList()
        },
        
        components: {
            monthEdit
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
                this.getMonthParkList()
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
                    value: '',
                    param: 3
                }
                this.getMonthParkList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.pageInfo.pageSize = pageSize
                this.getMonthParkList()
                console.log('onTableChange==>', page, pageSize)
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getMonthParkList()
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
            getMonthParkList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getMonthParkList, that.pageInfo).then((res) => {
                    that.monthList = res.list
                    that.pageInfo.total = res.count
                    that.park_sys_type=res.park_sys_type
                    that.tableLoadding = false
                    if(res.role_export2car!= undefined){
                        this.role_export2car=res.role_export2car;
                    }else{
                        this.role_export2car=1;
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
                this.month_id = record.record_id+''
                this.modelTitle = '编辑在场车辆'
                this.monthVisible = true
                console.log("record==============>", record)
            },
            
            delConfirm(record) {
                console.log("record=======>", record)
            },
            
            delCancel() {

            },
            
            closeMonth(flag){
                this.month_id = ''
                this.monthVisible = false
                if(flag){
                    this.getMonthParkList()
                }
            },
            
            handleSelectChange(value) {
                this.pageInfo.param = value
                console.log(`selected ${value}`);
                this.$forceUpdate()
            },
            
            exportThis(){
                let that = this
                that.exportLoadding = true
                that.request('/community/village_api.Parking/downMonthPark', that.pageInfo).then((res) => {
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
            
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
        },
    }
</script>

<style lang="less" scoped>
    .month_cars {
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
