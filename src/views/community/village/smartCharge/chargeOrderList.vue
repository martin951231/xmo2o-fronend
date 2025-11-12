<template>
    <div class="charge_order_llist">
        <div class="search_container">
            <!-- <div class="search_item">
                <div class="input_con">
                    <a-select placeholder="请选择" :default-value="screenList[0].value" style="width: 80px" @change="(value)=>handleSelectChange(value, 'screen_type')">
                        <a-select-option v-for="(item, index) in screenList" :key="index" :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                    <a-input style="width: 160px;" placeholder="请输入" v-model="searchParams.screen_value"></a-input>
                </div>
            </div> -->
            
            <div class="search_item">
                <div class="label">订单编号：</div>
                <div class="input_con">
                    <a-input style="width: 160px;" placeholder="请输入" v-model="searchParams.order_no"></a-input>
                </div>
            </div>
            
            <div class="search_item">
                <div class="label">设备名称：</div>
                <div class="input_con">
                    <a-input style="width: 160px;" placeholder="请输入" v-model="searchParams.equipment_name"></a-input>
                </div>
            </div>

          <!--  <div class="search_item">
                <div class="label">支付方式：</div>
                <div class="input_con">
                    <a-input style="width: 160px;" placeholder="请输入" v-model="searchParams.unique_code"></a-input>
                </div>
            </div> -->

           <div class="search_item">
                <div class="label">状态：</div>
                <div class="input_con">
                    <a-select placeholder="请选择" :default-value="statusList[0].value" style="width: 160px" @change="(value)=>handleSelectChange(value, 'status')">
                        <a-select-option v-for="(item, index) in statusList" :key="index" :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                </div>
            </div>

            <div class="search_item">
                <div class="label">时间筛选：</div>
                <div class="input_con">
                    <a-range-picker @change="onDateChange" />
                </div>
            </div>

            <div class="search_item">
                <a-button type="primary" @click="queryThis()">查询</a-button>
            </div>
        </div>

        <div class="tabel_con">
            <a-table :columns="columns" :data-source="tableList" @change="handleTableChange" :loading="tableLoading" :pagination="pagination">
                <span slot="action" slot-scope="text, record">
                    <a @click="showOrderDetail(record.id)">详情</a>
                </span>
            </a-table>
            <div style="display: inline-block;position: relative;top: -40px;left: 30px;color: red; font-size: 18px;">合计费用：<span>{{totalPaiedMoney}}</span><span style="margin-left:30px;">合计总充电量：</span>{{totalUseEle}}</div>
        </div>
        <orderDetail :order_id="order_id" :visible="orderVisible" @closeOrder="closeThis" />
    </div>
</template>

<script>
    import orderDetail from "./components/orderDetail.vue"
    const columns = [{
            title: '支付订单编号',
            dataIndex: 'order_no',
            key: 'order_no',
        },
        {
            title: '交易流水号',
            dataIndex: 'order_serial',
            key: 'order_serial',
        },
        {
            title: '设备名称',
            dataIndex: 'equipment_name',
            key: 'equipment_name',
        },
        {
            title: '设备唯一编码',
            key: 'equipment_num',
            dataIndex: 'equipment_num'
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '充电时长',
            dataIndex: 'continued_time',
            key: 'continued_time',
        },
        {
            title: '支付方式',
            dataIndex: 'pay_type',
            key: 'pay_type',
        },
        {
            title: '支付时间',
            dataIndex: 'pay_time',
            key: 'pay_time',
        },
        {
            title: '支付金额',
            dataIndex: 'use_money',
            key: 'use_money',
        },
        {
            title: '充电电量',
            dataIndex: 'use_ele',
            key: 'use_ele',
        },
        {
            title: '结束功率',
            dataIndex: 'end_power',
            key: 'end_power',
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
                msg: 'charge_order_llist',
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                },
                searchParams: {
                    equipment_name: '',
                    status: '',
                    order_no: '',
                    start_time: '',
                    end_time: '',
                    page: 1,
                },
                chargePileList: [],
                gunTypeList: [],
                statusList: [],
                tableList: [],
                columns,
                orderVisible: false,
                screenList: [{label: '订单号', value: 1}],
                statusList: [{label: '已结束', value: 1}, {label: '充电中', value: 2}],
                tableLoading: false,
                isRequest: true,
                order_id: 0,
                totalPaiedMoney:0,
                totalUseEle:0,
            }
        },
        
        components: {
            orderDetail
        },
        
        activated() {
            if(this.$route.query && this.$route.query.uid){
                this.searchParams.uid = this.$route.query.uid
            }
            this.getOrderList()
        },

        methods: {
            handleSelectChange(value, type) {
                this.searchParams[type] = value
            },
            onDateChange(date, dateString) {
                this.searchParams.start_time = dateString[0]
                this.searchParams.end_time = dateString[1]
            },
            closeThis(){
                this.orderVisible = false
            },
            showOrderDetail(id){
                this.order_id = id*1
                this.orderVisible = true
            },
            
            getOrderList(){
                let that = this
                that.tableLoading = true
                that.request('/community/village_api.Pile/getOrderList', that.searchParams).then((res) => {
                    that.tableList = res.list
                    that.pagination.total = res.count
                    that.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    that.tableLoading = false
                    if(res.totalPaiedMoney){
                       that.totalPaiedMoney = res.totalPaiedMoney;
                    }
                    if(res.totalUseEle){
                       that.totalUseEle = res.totalUseEle;
                    }
                })
            },
            
            handleTableChange({current, pageSize}){
                this.searchParams.page = current
                this.pagination.current = current
                this.getOrderList()
            },
            
            queryThis(){
                if(this.isRequest){
                    this.isRequest = false
                    this.searchParams.page = 1
                    this.pagination.current = 1
                    this.getOrderList()
                } else {
                    this.$message.warn("请求频繁~~~")
                }
                let timeout = setTimeout(()=>{
                    this.isRequest = true
                    clearInterval(timeout)
                },2000)
            },
        }
    }
</script>

<style lang="less" scoped>
    .charge_order_llist {
        width: 100%;
        background: #ffffff;
        .search_container {
            display: flex;
            padding: 15px;
            background: #ffffff;
            align-items: center;
            margin: 10px 0;
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
    }
</style>
