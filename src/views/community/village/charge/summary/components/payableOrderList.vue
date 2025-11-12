<template>
    <a-drawer :title="title" placement="right" :width="widthDrawer" :closable="true" :visible="drawer_visible"
        @close="onClose">
        <div class="top_box">
            <div class="flex_text_box">
                <div class="text_1">物业编号：</div>
                <div class="text_2">{{user_info.usernum?user_info.usernum:'暂无'}}</div>
            </div>
            <div class="flex_text_box">
                <div class="text_1">业主：</div>
                <div class="text_2">{{user_info.name?user_info.name:'暂无'}}</div>
            </div>
            <div class="flex_text_box">
                <div class="text_1">电话：</div>
                <div class="text_2">{{user_info.phone?user_info.phone:'暂无'}}</div>
            </div>
            <div class="flex_text_box">
                <div class="text_1" v-if="user_info.room">{{$store.getters.config.room_name}}号：</div>
                <div class="text_2">{{user_info.room}}</div>
            </div>
            <div class="flex_text_box" v-if="user_info.housesize">
                <div class="text_1">房屋面积：</div>
                <div class="text_2">{{user_info.housesize}}</div>
            </div>
            <div class="flex_text_box" v-if="user_info.is_car_position">
                <div class="text_1">车场面积：</div>
                <div class="text_2">{{user_info.position_area?user_info.position_area:'暂无'}}</div>
            </div>
        </div>
        <div class="message-suggestions-box-1">

            <a-table :columns="columns" :data-source="data"
                class="components-table-demo-nested" :pagination="pagination" @change="table_change" :loading="loading">
                <span slot="action" slot-scope="text, record">
                    <a @click="$refs.OrderModel.add(record.order_id,record.check_apply_id)">详情</a>
                </span>

            </a-table>
            <payable-order-info ref="OrderModel" />
        </div>
    </a-drawer>
</template>
<script>
    import villageApi from '@/api/community/village'
    import PayableOrderInfo from '@/views/community/village/charge/cashier/payableOrderInfo'
    import {
        Collapse
    } from 'ant-design-vue'

    const columns = [{
            title: '收费项目名称',
            dataIndex: 'project_name',
            key: 'project_name'
        },
        {
            title: '实际缴费金额',
            dataIndex: 'pay_money',
            key: 'pay_money'
        },
        {
            title: '支付方式',
            dataIndex: 'pay_type',
            key: 'pay_type'
        },
        {
            title: '支付时间',
            dataIndex: 'pay_time',
            key: 'pay_time'
        },
        {
            title: '开票状态',
            dataIndex: 'record_status',
            key: 'record_status'
        },
        {
            title: '账单状态',
            dataIndex: 'order_status',
            key: 'order_status'
        },
        {
            title: '计费开始时间',
            dataIndex: 'service_start_time',
            key: 'service_start_time'
        },
        {
            title: '计费结束时间',
            dataIndex: 'service_end_time',
            key: 'service_end_time'
        },
        {
            title: '账单生成时间',
            dataIndex: 'add_time',
            key: 'add_time'
        },
        {
            title: '已退款金额',
            dataIndex: 'refund_money',
            key: 'refund_money'
        },
        
        {
            title: '操作',
            key: 'action',
            width: '100px',
            dataIndex: '',
            scopedSlots: {
                customRender: 'action'
            }
        }
    ]
    const data = []
    export default {
        name: 'PayableOrderList',
        filters: {

        },
        components: {
            PayableOrderInfo,
            'a-collapse': Collapse,
            'a-collapse-panel': Collapse.Panel
        },
        data() {
            return {
                reply_content: '',
                title: '详细订单列表',
                pagination: {
                    current: 1,
                    pageSize: 15,
                    total: 15,
                },
                search: {
                    'record_id':0,
                    'order_id': 0,
                    'sub_order_ids': '',
                    'table_name': '',
                    'room_id':0
                },
                drawer_visible: false,
                loading: false,
                data,
                columns,
                search_data: '',
                page: 1,
                widthDrawer: 1500,
                confirmLoading: false,
                record: {},
                user_info:{},
            }
        },

        created() {
            if (window.screen.width < 1400) {
                this.widthDrawer = 900
            } else if (window.screen.width < 1600) {
                this.widthDrawer = 1300
            }
        },
        activated() {

        },
        methods: {

            onClose() {
                this.drawer_visible = false
            },
            // 获取列表信息
            getList() {
                this.loading = true
                this.search['page'] = this.page
                this.search['limit'] = this.pagination.pageSize
                this.request(villageApi.getHouseNewPayOrderList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        if(res.user_info){
                            this.user_info=res.user_info;
                        }
                        this.loading = false
                    })
            },
            bindOk() {
                this.getList()
            },
            // 日期切换，重新赋值
            dateOnChange(date, dateString) {
                this.search.date = dateString
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('table_change', e)
                if (e.current && e.current > 0) {
                    this.pagination.current = e.current
                    this.page = e.current
                    this.getList()
                }
            },
            search_btn(record) {
                this.drawer_visible = true;
                this.record = record;
                this.search = {
                    'record_id':record.id,
                    'order_id': record.order_id,
                    'sub_order_ids': record.sub_order_ids,
                    'table_name': record.table_name,
                    'room_id':record.room_id,
                }
                this.searchList()
            },
            // 进行搜索
            searchList() {
                this.page = 1
                const val = {
                    current: 1,
                    pageSize: 10,
                    total: 10
                }
                this.table_change(val)
            },
            //数组去重
            arrUnique(arr, ff = 'pigcms_id') {
                var arr1 = []; // 新建一个数组来存放arr中的值
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr1.indexOf(arr[i][ff]) === -1) {
                        arr1.push(arr[i][ff]);
                    }
                }
                return arr1;
            },

        }
    }
</script>
<style lang="less" scoped>
    .message-suggestions-box-1 {
        background-color: white;
        margin-top: 15px;
    }

    .message-suggestions-box-1 .search-box {
        padding: 0px 20px;
        border: 1px solid #e4dfdf;
        padding-bottom: 15px;
    }

    .message-suggestions-box-1 .add-box {
        padding: 20px 20px 0;
    }

    .message-suggestions-box-1 .components-table-demo-nested {
        // padding: 20px;
    }

    .message-suggestions-box-1 .message_box {
        padding: 20px;
    }

    .lbsf {
        float: right;
        margin-right: 24px;
    }

    .padding-tp10 {
        padding-top: 15px;
    }

    .mg5_box {
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0.5%;
    }

    .top_box {
        width: 100%;
        border: 1px solid #F1F1F1;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px;

        .flex_text_box {
            display: flex;
            flex-direction: row;
            align-items: center;

            .text_1 {
                flex-shrink: 0;
            }
        }
    }
</style>