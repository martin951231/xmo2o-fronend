<template>
    <div class="storage_battery">
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
            
            <div class="search_item" style="margin-left: 20px;">
                <label class="label_title">日期：</label>
                <a-range-picker :format="dateFormat" v-model="dateValue" v-if="clearTime" @change="ondateChange" />
            </div>
            
            <div class="search_item" style="margin-left: 10px; padding-top: 0;">
                <a-button type="primary" @click="queryThis()">查询</a-button>
                <a-button style="margin-left: 10px;" @click="clearThis()">清空</a-button>
            </div>
        </div>
        
        <div class="table_content">
            <a-table :columns="columns" :data-source="batteryList" :row-key="record=>record.id" :pagination="pageInfo" :loading="tableLoadding"
            @change="handleTableChange">
            </a-table>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
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
            title: '订单编号',
            dataIndex: 'order_id',
            key: 'order_id',
        }
    ];
    export default {
        data() {
            return {
                dateValue: [moment().subtract('days', 7), moment()],
                dateFormat: 'YYYY-MM-DD',
                columns,
                modelTitle: '',
                batteryVisible: false,
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    date: [moment().subtract('days', 7).format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                    value: '',
                    param: 3,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                tableLoadding: false,
                batteryList: [],
                frequency: false,
                search_type: [{id: 1, label: '用户姓名'},{id: 2, label: '用户手机号'},{id: 3, label: '车牌号'}],
                clearTime: true
            }
        },
        
        mounted(){
            this.getbatteryList()
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
                this.getbatteryList()
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
                    param: 3,
                    value: ''
                }
                this.getbatteryList()
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getbatteryList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.pageInfo.pageSize = pageSize
                this.getbatteryList()
                console.log('onTableChange==>', page, pageSize)
            },
            getbatteryList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getElectricParkList, that.pageInfo).then((res) => {
                    that.batteryList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            
            ondateChange(date, dateString) {
                console.log(date, dateString);
            },
            
            exportThis(){
                
            },
            
            handleSelectChange(value) {
                this.pageInfo.param = value
                console.log(`selected ${value}`);
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
    .storage_battery {
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
