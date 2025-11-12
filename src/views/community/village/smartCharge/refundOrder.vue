<template>
    <div class="refund_order">
        <div class="search_container">
            <div class="search_item">
                <div class="input_con">
                    <a-select placeholder="请选择" :default-value="screenList[0].value" style="width: 80px" @change="(value)=>handleSelectChange(value, 'screen_type')">
                        <a-select-option v-for="(item, index) in screenList" :key="index" :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                    <a-input style="width: 160px;" placeholder="请输入" v-model="searchParams.screen_value"></a-input>
                </div>
            </div>
            
            <div class="search_item">
                <div class="label">设备名称：</div>
                <div class="input_con">
                    <a-input style="width: 160px;" placeholder="请输入" v-model="searchParams.device_name"></a-input>
                </div>
            </div>

            <div class="search_item">
                <div class="label">支付方式：</div>
                <div class="input_con">
                    <a-input style="width: 160px;" placeholder="请输入" v-model="searchParams.unique_code"></a-input>
                </div>
            </div>

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
                <a-button type="primary">查询</a-button>
            </div>
        </div>

        <div class="tabel_con">
            <a-table :columns="columns" :data-source="data">
                <span slot="action" slot-scope="text, record">
                    <a @click="showOrderDetail">详情</a>
                    <a-divider type="vertical" />
                    <a>审核</a>
                </span>
            </a-table>
        </div>
        <orderDetail :visible="orderVisible" @closeOrder="closeThis" />
    </div>
</template>

<script>
    import orderDetail from "./components/orderDetail.vue"
    const columns = [{
            title: '支付订单编号',
            dataIndex: 'pay_order_no',
            key: 'pay_order_no',
        },
        {
            title: '交易流水号',
            dataIndex: 'serial_number',
            key: 'serial_number',
        },
        {
            title: '设备名称',
            dataIndex: 'device_name',
            key: 'device_name',
        },
        {
            title: '设备唯一编码',
            key: 'device_unique_code',
            dataIndex: 'device_unique_code'
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '充电开始时间',
            dataIndex: 'start_time',
            key: 'start_time',
        },
        {
            title: '充电结束时间',
            dataIndex: 'end_time',
            key: 'end_time',
        },
        {
            title: '充电时长',
            dataIndex: 'charge_duration',
            key: 'charge_duration',
        },
        {
            title: '充电车牌号',
            dataIndex: 'license_plate_number',
            key: 'license_plate_number',
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
                msg: 'refund_order',
                searchParams: {
                    device_name: '',
                    unique_code: '',
                    charge_pile_type: '',
                    gun_head_status: '',
                    status: '',
                    screen_value: ''
                },
                chargePileList: [],
                gunTypeList: [],
                statusList: [],
                data: [],
                columns,
                orderVisible: false,
                screenList: [{label: '订单号', value: 1}, {label: '姓名', value: 2}, {label: '联系方式', value: 3}],
                statusList: [{label: '订单号', value: 1}, {label: '姓名', value: 2}, {label: '联系方式', value: 3}]
            }
        },
        
        components: {
            orderDetail
        },
        
        mounted() {

        },

        methods: {
            handleSelectChange(value, type) {
                console.log(value, type)
            },
            onDateChange(date, dateString) {
                console.log(date, dateString);
            },
            closeThis(){
                this.orderVisible = false
            },
            showOrderDetail(){
                this.orderVisible = true
            }
        }
    }
</script>

<style lang="less" scoped>
    .refund_order {
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
