<template>
    <a-locale-provider :locale="zh_CN">
 
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">

        <a-row style="margin-top:10px;">
            <a-col :span="24">

                <a-input-group compact>
                    <label style="line-height: 30px;margin-left: 15px;">搜索：</label>
                    <a-select :value="queryParams.search_by" @change="selectSearchBy" style="width: 120px;">
                        <a-select-option v-for="(item, index) in searchBy" :key="item.key">
                            {{ item.value }}
                        </a-select-option>
                    </a-select>
                    <a-input style="width: 220px" :placeholder="'请输入'+searchByMap[queryParams.search_by]"
                        :value="queryParams.keywords" @change="keywordsChange" />

                    <label style="line-height: 30px;margin-left: 15px;">选择日期：</label>
                    <a-select :value="queryParams.date_by" @change="selectDateBy" style="width: 100px;">
                        <a-select-option v-for="(item, index) in dateBy" :key="item.key">
                            {{ item.value }}
                        </a-select-option>
                    </a-select>
                    <a-range-picker @change="selectDate" />
                    <a-button type="primary" @click="searchBtn" style="width: 80px;margin-left: 10px;">搜索</a-button>

                </a-input-group>
            </a-col>
        </a-row>


        <a-row style="margin-top:15px;">

            <a-tabs :active-key="queryParams.type" @change="changeTabs">

                <a-tab-pane v-for="pane in typeList" :key="pane.key" :tab="pane.title">

                    <a-table style="background: #ffffff" :columns="columns" rowKey="id" :data-source="dataList"
                        @change="changePage" :pagination="pagination">


                       <span slot="action" slot-scope="text,item">
                            <a @click="showDetail(item.order_id)">详情</a>
                       </span>

                    </a-table>
                </a-tab-pane>
            </a-tabs>
        </a-row>
        <card-order-detail  ref="cardOrderDetailModel" />
    </div>
    
    </a-locale-provider>
</template>

<script>
    import lifeToolsStorestaffApi from '@/api/life_tools/storestaff/index'
    import cardOrderDetail from './modules/cardOrderDetail.vue'
    
     import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
      import moment from 'moment';
      import 'moment/locale/zh-cn';
    
      moment.locale('zh-cn');
    export default {
         components: {cardOrderDetail},
        data() {
            return { 
                zh_CN,
                queryParams: {
                    search_by: 1,
                    keywords: '',
                    start_date: '',
                    end_date: '',
                    page_size: 10,
                    type: 'ticket',
                    date_by: 1
                },
                typeList: [{
                        key: "ticket",
                        title: "门票"
                    },
                    // {
                    //     key: "card",
                    //     title: "次卡"
                    // }
                ],
                searchBy: [{
                        key: 1,
                        value: '订单号'
                    },
                    {
                        key: 2,
                        value: '活动名称'
                    },
                    {
                        key: 3,
                        value: '手机号'
                    },
                    {
                        key: 4,
                        value: '景区名称'
                    }
                ],
                searchByMap: {
                    '1': '订单号',
                    '2': '活动名称',
                    '3': '手机号',
                    '4': '景区名称',
                },
                dateBy: [{
                        key: 1,
                        value: '下单日期'
                    },
                    {
                        key: 2,
                        value: '核销日期'
                    }
                ],
                store_id: 0,
                dataList: [],
                isAllCheck: false,
                pagination: {
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 1
                },
                columns: [{
                        title: this.L('订单号'),
                        dataIndex: 'orderid'
                    }, 
                    {
                        title: this.L('订单名称'),
                        dataIndex: 'title'
                    },
                    {
                        title: this.L('用户昵称'),
                        dataIndex: 'nickname'
                    },
                    {
                        title: this.L('用户手机号'),
                        dataIndex: 'phone'
                    },
                    {
                        title: this.L('数量'),
                        dataIndex: 'num'
                    },
                    {
                        title: this.L('总价'),
                        dataIndex: 'total_price'
                    },
                    {
                        title: this.L('订单状态'),
                        dataIndex: 'order_status_text'
                    },
                    {
                        title: this.L('下单时间'),
                        dataIndex: 'add_time_text'
                    },
                    {
                        title: this.L('核销时间'),
                        dataIndex: 'verify_time_text'
                    },
                    {
                        title: this.L('操作'),
                        dataIndex: 'action',
                        key: 'action',
                        scopedSlots: {
                            customRender: 'action'
                        },
                    },
                ],
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                this.queryParams.page_size = this.pagination.pageSize
                this.queryParams.page = this.pagination.current;
                this.request(lifeToolsStorestaffApi.scenicVerifyList, this.queryParams).then((res) => {
                    console.log(res.data)
                    this.pagination.total = res.total
                    this.dataList = res.data

                });
            },
            keywordsChange(e) {
                this.queryParams.keywords = e.target.value
            },

            selectSearchBy(val) {
                this.queryParams.search_by = val
            },
            selectDateBy(val) {
                this.queryParams.date_by = val
            },
            searchBtn() {
                this.getData()
            },
            selectDate(value, dateString) {
                this.queryParams.start_date = dateString[0]
                this.queryParams.end_date = dateString[1]
            },
            changePage(page, pageSize) {
                this.pagination.current = page.current;
                this.getData();
            },
            onSearch(val) {
                this.queryParam.keywords = val
            },
            searchByChange(val) {
                this.queryParam.search_by = val
            },
            changeTabs(val) {
                this.queryParams.type = val
                if(val == 'card'){
                    this.searchBy = [{
                            key: 1,
                            value: '次卡名称'
                        },
                        {
                            key: 2,
                            value: '用户昵称'
                        },
                        {
                            key: 3,
                            value: '用户手机号'
                        }
                    ];
                    this.searchByMap = {
                        '1': '次卡名称',
                        '2': '用户昵称',
                        '3': '用户手机号'
                    };
                    this.queryParams.search_by = 1
                    
                    this.columns = [{
                        title: this.L('次卡名称'),
                        dataIndex: 'card_title'
                    }, 
                    {
                        title: this.L('用户昵称'),
                        dataIndex: 'nickname'
                    },
                    {
                        title: this.L('用户电话'),
                        dataIndex: 'phone'
                    },
                    {
                        title: this.L('核销时间'),
                        dataIndex: 'add_time_text'
                    },
                    {
                        title: this.L('操作'),
                        dataIndex: 'action',
                        key: 'action',
                        scopedSlots: {
                            customRender: 'action'
                        },
                    },
                    ]
                }else{
                    this.searchBy = [{
                            key: 1,
                            value: '订单号'
                        },
                        {
                            key: 2,
                            value: '活动名称'
                        },
                        {
                            key: 3,
                            value: '手机号'
                        },
                        {
                            key: 4,
                            value: '景区名称'
                        }
                    ];
                    this.searchByMap = {
                        '1': '订单号',
                        '2': '活动名称',
                        '3': '手机号',
                        '4': '景区名称',
                    };
                    
                    this.columns = [{
                        title: this.L('订单号'),
                        dataIndex: 'orderid'
                    }, 
                    {
                        title: this.L('订单名称'),
                        dataIndex: 'title'
                    },
                    {
                        title: this.L('用户昵称'),
                        dataIndex: 'nickname'
                    },
                    {
                        title: this.L('用户手机号'),
                        dataIndex: 'phone'
                    },
                    {
                        title: this.L('数量'),
                        dataIndex: 'num'
                    },
                    {
                        title: this.L('总价'),
                        dataIndex: 'total_price'
                    },
                    {
                        title: this.L('订单状态'),
                        dataIndex: 'order_status_text'
                    },
                    {
                        title: this.L('下单时间'),
                        dataIndex: 'add_time_text'
                    },
                    {
                        title: this.L('核销时间'),
                        dataIndex: 'verify_time_text'
                    },
                    {
                        title: this.L('操作'),
                        dataIndex: 'action',
                        key: 'action',
                        scopedSlots: {
                            customRender: 'action'
                        },
                    },
                    ]
                }
                this.getData()
            },
            showDetail(order_id){
                this.$refs.cardOrderDetailModel.getData(order_id, this.queryParams.type);
            }
        },
    }
</script>

<style>
</style>
