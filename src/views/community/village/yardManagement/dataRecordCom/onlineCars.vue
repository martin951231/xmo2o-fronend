<template>
    <div class="coupon_list">
        <div class="header_search" style="display: flex; padding-bottom: 0;">
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
                <label class="label_title">时间：</label>
                <a-range-picker :format="dateFormat" v-model="dateValue" v-if="clearTime" @change="ondateChange" />
            </div>
            
            <div class="search_item" style="margin-left: 10px;">
                <a-button type="primary" @click="queryThis()">查询</a-button>
                <a-button style="margin-left: 10px;" @click="clearThis()">清空</a-button>
            </div>
        </div>
        <div class="header_search" style="width: 100%;">
            <a-collapse accordion>
                <a-collapse-panel key="1" header="操作说明">
                    每个通道二维码可自行打印出来，张贴在对应的通道处</br>
                    入口二维码：用于无牌车扫码登记进入。</br>
                    出口二维码：用户车辆到达出口扫码付费时，系统会自动快速读取当前车辆的车牌号，免输入，方便快捷。</br>
                </a-collapse-panel>
            </a-collapse>
        </div>
        
        <div class="header_search" style="padding-top: 0;">
            <a-button type="primary" :loading="exportLoadding" @click="exportThis" v-if="role_export1car==1">excel导出</a-button>
        </div>
        
        <div class="table_content">
            <a-table :columns="park_sys_type=='A11'?columns1:columns" :data-source="onlineList" :row-key="record=>record.record_id" :pagination="pageInfo" :loading="tableLoadding"
            @change="handleTableChange">
                <a-tag  slot="car_type" slot-scope="text, record"  :color="record.car_type=='汽车'?'green':'blue'" >
                    {{ record.car_type}}
                </a-tag>
                <span slot="action" slot-scope="text, record">
                    <a @click="editThis(record)"  v-if="role_edit1car==1" >编辑</a>
                    <a-divider type="vertical"  v-if="role_del1car==1" />
                    <a @click="delThis(record)"  v-if="role_del1car==1" >删除</a>
                </span>
            </a-table>
            <online-edit :online_id="online_id" :visible="onlineVisible" :modelTitle="modelTitle" @closeOnline="closeOnline"/>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import onlineEdit from './onlineEdit.vue';
    import villageApi from '@/api/community/village';
    const columns = [
        {
            title: '车场',
            dataIndex: 'park_name',
            key: 'park_name',
        },
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
            title: '车牌号',
            dataIndex: 'car_number',
            key: 'car_number',
        },
        {
            title: '入场时间',
            dataIndex: 'accessTime',
            key: 'accessTime',
        },
        
        {
            title: '车辆类型',
            dataIndex: 'car_type',
            key: 'car_type',
            scopedSlots: {
                customRender: 'car_type'
            },
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
            title: '车场',
            dataIndex: 'park_name',
            key: 'park_name',
        },
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
            title: '入场时间',
            dataIndex: 'accessTime',
            key: 'accessTime',
        },

        {
            title: '车辆类型',
            dataIndex: 'car_type',
            key: 'car_type',
            scopedSlots: {
                customRender: 'car_type'
            },
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
                onlineVisible: false,
                park_sys_type:'',
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
                online_type: 'add',
                online_id: '',
                onlineList: [],
                frequency: false,
                search_type: [{id: 1, label: '用户姓名'},{id: 2, label: '用户手机号'},{id: 3, label: '车牌号'}],
                clearTime: true,
                exportLoadding: false,
                role_del1car: 0,
                role_edit1car: 0,
                role_export1car: 0,
            }
        },
        
        mounted(){
            this.getOnlineList()  
        },
        
        components: {
            onlineEdit
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
                this.getOnlineList()
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
                this.getOnlineList()
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getOnlineList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.pageInfo.pageSize = pageSize
                this.getOnlineList()
                console.log('onTableChange==>', page, pageSize)
            },
            getOnlineList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getInParkList, that.pageInfo).then((res) => {
                    that.park_sys_type=res.park_sys_type
                    that.onlineList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                    if (res.role_edit1car != undefined) {
                        this.role_del1car = res.role_del1car;
                        this.role_edit1car = res.role_edit1car;
                        this.role_export1car = res.role_export1car;
                    } else {
                        this.role_del1car = 1;
                        this.role_edit1car = 1;
                        this.role_export1car = 1;
                    }
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            
            ondateChange(date, dateString) {
                this.pageInfo.date = dateString
                console.log(date, dateString);
            },
            
            editThis(record){
                this.modelTitle = '编辑在场车辆'
                this.onlineVisible = true
                this.online_id = record.record_id+''
                console.log("record================>",record)
            },
            delThis(record){
                let that = this
                that.$confirm({
                    title: '操作提示',
                    cancelText: '取消',
                    okText: "确认删除",
                    content: '你确定要删除这条数据吗',
                    onOk() {
                        that.request(villageApi.delRecordCar, {record_id:record.record_id}).then((res) => {
                             that.$message.success('操作成功！')
                             that.getOnlineList()
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
                that.request('/community/village_api.Parking/downInPark', that.pageInfo).then((res) => {
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
            
            closeOnline(flag){
                this.online_id = ''
                this.onlineVisible = false
                if(flag){
                    this.getOnlineList()
                }
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
    .coupon_list {
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
