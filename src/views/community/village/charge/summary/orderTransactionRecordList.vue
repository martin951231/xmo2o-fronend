<template>
    <div class="fee-summary-list-box">
        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="8" :sm="24" style="padding-right:0px;">
                    <a-select v-model="search.order_type" style="width: 160px" placeholder="请选择单号类别">
                        <a-select-option key="1" value="1">业务订单编号</a-select-option>
                        <a-select-option key="2" value="2">商户支付订单号</a-select-option>
                        <a-select-option key="3" value="3">第三方支付流水号</a-select-option>
                    </a-select>
                    <a-input style="width: 260px" placeholder="请输入单号" v-model="search.order_no" />
                </a-col>

                <a-col :md="8" :sm="24" style="padding-left: 5px;padding-right: 1px;width: 430px">
                    <label style="margin-top: 5px;">支付时间：</label>
                    <a-range-picker @change="dateOnChange" :allowClear='true' v-model="search_data"
                        style="width: 320px">
                        <a-icon slot="suffixIcon" type="calendar" />
                    </a-range-picker>
                </a-col>
                <a-col :md="4" :sm="24" style="padding-right:0px;">
                    <label style="margin-top: 5px;">订单状态：</label>
                    <a-select v-model="search.order_status" style="width: 150px" placeholder="请选择单号类别">
                        <a-select-option key="0" value="0">全部</a-select-option>
                        <a-select-option key="1" value="1">已支付</a-select-option>
                        <a-select-option key="2" value="2">部分退款</a-select-option>
                        <a-select-option key="3" value="3">全额退款</a-select-option>
                    </a-select>
                </a-col>
            </a-row>
            <a-row style="margin-top: 15px;">

                <a-col :md="5" :sm="24" style="padding-right: 1px">
                    <label style="margin-top: 5px;">所属业务：</label>
                    <a-select v-model="search.business_type" style="width: 230px" placeholder="全部">
                        <a-select-option key="" value="" >全部</a-select-option>
                        <a-select-option v-for="item in business_arr" :key="item.key"
                            :value="item.key">{{ item.value }}</a-select-option>
                    </a-select>
                </a-col>
                <a-col :md="6" :sm="24" style="padding-left: 25px;padding-right: 1px;width: 90px;">
                    <a-button type="primary" icon="search" @click="searchList()">
                        查询
                    </a-button>
                </a-col>
                <a-col :md="6" :sm="24" style="padding-left: 25px;padding-right: 1px;width: 90px;">
                    <a-button class="ml-20" icon="refresh" @click="resetList"> 重置</a-button>
                </a-col>
                <a-col :md="3" :sm="12" class="suggestions_col_btn" style="padding-left: 40px;">
                  <a-button type="primary" @click="excelExportOut()" >Excel导出</a-button>
                </a-col>
            </a-row>
        </div>

        <a-table :columns="columns" :data-source="data" class="components-table-demo-nested" :pagination="pagination"
            @change='table_change' :row-key="record => record.id" :scroll="xscroll" :loading="loading" bordered>
            <span slot="action_opt" slot-scope="text, record">
              <a  @click="$refs.PayableOrderRecordModel.search_btn(record)" v-if="record.house_new_pay_order_list==1 ">
                子订单列表
              </a>
            </span>
        </a-table>
        <a-modal title="请稍等,正在为您导出数据..." :visible="tips_visible" :closable="false" :mask-closable="false" :footer="null"
            :width="550">
            <div>
                <a-spin size="large" />
                <span style=" margin-left: 25px;">导出数据中,请耐心等待,数量越多时间越长。</span>
                <p style="margin: 15px;">若长时间未成功导出，建议调整筛选条件减少导出数，然后分多次导出。</p>
            </div>
        </a-modal>
        
        <PayableOrderRecordModel ref="PayableOrderRecordModel" />
    
    </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import PayableOrderRecordModel from './components/payableOrderList.vue'
    const columns = [{
            title: '商户支付订单号',
            dataIndex: 'pay_order_no',
            key: 'pay_order_no',
            fixed: 'left',
            width:220,
        },
        {
            title: '业务订单编号',
            dataIndex: 'order_no',
            key: 'order_no',
            fixed: 'left',
            width:200,
        },
        {
            title: '第三方支付流水号',
            dataIndex: 'third_transaction_no',
            key: 'third_transaction_no',
            fixed: 'left',
            width:250,
        },
        {
            title: '应收费用',
            dataIndex: 'order_money',
            key: 'order_money',
            width:120
        },
        {
            title: '实际缴费金额',
            dataIndex: 'pay_money',
            key: 'pay_money',
            width:120
        },
        {
            title: '支付时间',
            dataIndex: 'pay_time_str',
            key: 'pay_time_str',
            width:160
        },
        {
            title: '余额支付金额',
            dataIndex: 'balance_money',
            key: 'balance_money',
            width:120
        },
        {
            title: '支付方式',
            dataIndex: 'pay_type_str',
            key: 'pay_type_str',
            width:160
        },
        {
            title: '积分抵扣金额',
            dataIndex: 'score_money',
            key: 'score_money',
            width:120
        },
        {
            title: '退款金额',
            dataIndex: 'refund_money',
            key: 'refund_money',
            width:120
        },{
            title: '退款时间',
            dataIndex: 'refund_time_str',
            key: 'refund_time_str',
            width:160
        },
        {
            title: '订单状态',
            dataIndex: 'order_status_str',
            key: 'order_status_str',
            width:120
        },
        {
            title: '所属业务',
            dataIndex: 'business_type_name',
            key: 'business_type_name',
            fixed: 'right',
            width:200,
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'action_opt',
            fixed: 'right',
            width: 150, scopedSlots: { customRender: 'action_opt' } 
        },
    ];
    const data = [];
    export default {
        name: 'orderTransactionRecordList',
        components: {
            PayableOrderRecordModel,
        },
        data() {
            return {
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 10,
                },
                search: {
                    order_type: '1',
                    business_type: '',
                    order_status: '0',
                    date:''
                },
                visible: false,
                loading: false,
                data,
                columns,
                xscroll:{x: 1500},
                page: 1,
                search_data: null,
                business_arr: [],
                tips_visible:false,
                excelExportOutFileUrl:'',
                export_out_id:0,
                setTimeoutS:null,
            };
        },
        mounted() {
            this.getList()
            this.getOrderBusinessTypeInfo();
        },
        methods: {
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['page'] = this.page;
                this.search['limit'] = this.pagination.pageSize;
                this.request(villageApi.getPaidOrderRecordList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.lists
                        this.excelExportOutFileUrl=res.excelExportOutFileUrl;
                        this.loading = false
                    })
            },
            getOrderBusinessTypeInfo(){
                this.request(villageApi.getOrderBusinessTypeInfo)
                    .then((res) => {
                        this.business_arr = res.lists
                    })
            },
            // 导出Excel
            excelExportOut () {
                this.tips_visible = true;
                this.loading = true;
                this.request(villageApi.excelExportPaidOrderRecordOut, this.search).then((res) => {
                        this.export_out_id = res.export_id
                        this.excelExportOutFileUrl= this.excelExportOutFileUrl + '&id=' + res.export_id
                        this.CheckExportOutStatus();
                    }).catch((error) => {
                     this.loading = false
                })
            },
            
             CheckExportOutStatus () {
                let excelExportOutFileUrlCheck = this.excelExportOutFileUrl + '&ajax=village_ajax'
                this.request(excelExportOutFileUrlCheck, {
                        tokenName: 'village_access_token',
                        ajax: 'village_ajax'
                    })
                    .then((res) => {
                        if (res.error_code == 0) {
                            clearTimeout(this.setTimeoutS)
                            this.setTimeoutS = null
                            window.location.href = this.excelExportOutFileUrl;
                            this.loading = false
                            this.tips_visible = false;
                            return false;
                        } else if(res.error_code == 404){
                             this.tips_visible = false;
                             this.loading = false
                            clearTimeout(this.setTimeoutS)
                            this.setTimeoutS = null
                            this.$message.error(res.error_msg)
                            return false
                        }else {
                            this.setTimeoutS = setTimeout(this.CheckExportOutStatus, 2000);
                        }
                    }).catch((error) => {
                        this.$message.error('出错了，请刷新页面重试！')
                        this.tips_visible = false;
                        this.loading = false
                    })
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current > 0) {
                    this.pagination.current = e.current;
                    this.page = e.current;
                    this.getList()
                }
            },
            // 日期切换，重新赋值
            dateOnChange(date, dateString) {
                this.search.date = dateString;
                console.log('search', this.search);
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.page = 1;
                let val = {
                    current: 1,
                }
                this.table_change(val)
            },
            // 进行重置
            resetList() {
                this.search={
                    order_type: '1',
                    business_type: '',
                    order_status: '0',
                    date:''
                };
                this.search_data = null;
                this.getList()
            }
        }
    };
</script>
<style lang="less" scoped>
    .fee-summary-list-box {
        margin: 30px 20px;
        background-color: white;
    }

    .fee-summary-list-box .search-box {
        padding: 20px 20px 0;
    }

    .fee-summary-list-box .add-box {
        padding: 20px 20px 0;
    }

    .fee-summary-list-box .components-table-demo-nested {
        padding: 20px;
    }

    .fee-summary-list-box .message_box {
        padding: 20px;
    }

    .lbsf {
        float: right;
        margin-right: 24px;
    }

    .padding-tp10 {
        padding-top: 15px;
        padding-bottom: 15px;
    }

    .fee-summary-list-tip-box {
        padding: 0px 4px;
    }

    .fee-summary-list-summary-box {
        color: white;
        margin: 10px 0;
        padding-left: 20px;
    }

    .fee-summary-list-summary-box .ant-col.ant-col-4 {
        border-radius: 5px;
        padding: 10px;
    }

    .fee-summary-list-summary-box .title-box {
        font-size: 10px;
    }

    .fee-summary-list-summary-box .summary_number-box {
        font-size: 22px;
        text-align: center;
        font-weight: 600;
        padding: 18px 0;
    }

    .fee-summary-page-summary-box {
        margin-top: 20px;
        padding-left: 20px;
    }

    .fee-summary-page-summary-box .page-title-box {
        font-size: 12px;
        font-weight: 600;
    }

    .fee-summary-page-summary-box .page-number-box {
        font-size: 16px;
        font-weight: 600;
    }
</style>