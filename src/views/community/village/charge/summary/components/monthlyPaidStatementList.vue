<template>
    <div class="fee-summary-list-box">
        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="8" :sm="24" style="padding-left: 5px;padding-right: 1px;width: 480px">
                    <a-select placeholder="请选择账单计费时间" style="width: 150px" v-model="search.order_service_type" @change="changeOrderServiceType">
                        <a-select-option value="0">支付时间</a-select-option>
                        <a-select-option value="1">计费开始时间</a-select-option>
                        <a-select-option value="2">计费结束时间</a-select-option>
                        <a-select-option value="3">计费开始结束时间</a-select-option>
                    </a-select>

                    <a-month-picker
                      v-model="search.date"
                      style="width: 140px"
                      @change="serviceDateOnChange"
                      placeholder="请选择开始月份"
                    /> 
                    <a-month-picker
                      v-model="search.end_date"
                      style="width: 140px;margin-left: 5px;"
                      @change="serviceEndDateOnChange"
                      placeholder="请选择结束月份"
                    /> 
                </a-col>
                <a-col :md="5" :sm="12" style="padding-left: 5px;padding-right: 1px">
                    <label style="margin-top: 5px;">收费项目：</label>
                    <a-select default-value="0" style="width: 230px" placeholder="请选择项目"
                        v-model="search.charge_project_id" @change="projectItemChange">
                        <a-select-option value="0">
                            全部
                        </a-select-option>
                        <a-select-option :value="item1.id" v-for="(item1,index1) in project_list" :key="index1">
                            {{ item1.name }}
                        </a-select-option>
                    </a-select>
                </a-col>
                <a-col :md="5" :sm="12" style="padding-left: 5px;padding-right: 10px">
                    <label style="margin-top: 5px;">收费标准：</label>
                    <a-select default-value="0" style="width: 230px" placeholder="收费标准" v-model="search.rule_id">
                        <a-select-option value="0">
                            全部
                        </a-select-option>
                        <a-select-option :value="item2.id" v-for="(item2,index2) in project_rule_list" :key="index2">
                            {{ item2.charge_name }}
                        </a-select-option>
                    </a-select>
                </a-col>
                <a-col :md="6" :sm="24" style="padding-left: 20px;padding-right: 1px;width: 90px;">
                    <a-button type="primary" icon="search" @click="searchList()">
                        查询
                    </a-button>
                </a-col>
                <a-col :md="6" :sm="24" style="padding-left: 20px;padding-right: 1px;width: 90px;">
                    <a-button class="ml-20" icon="refresh" @click="resetList"> 重置</a-button>
                </a-col>
                <a-col :md="3" :sm="12" class="suggestions_col_btn" style="padding-left: 40px;">
                  <a-button type="primary" @click="excelExportOut()" >Excel导出</a-button>
                </a-col>
            </a-row>
        </div>

        <a-table :columns="columns" :data-source="data" class="components-table-demo-nested" :pagination="pagination"
            @change='table_change' :row-key="record => record.order_id" :loading="loading" :scroll="xscroll" bordered>
            <template slot="address" slot-scope="text, record">
                <span style="display: inline-block; width: 150px; overflow:hidden; text-overflow:ellipsis; white-space: nowrap;">
                    <a-tooltip placement="topLeft" :title="record.address">
                        {{record.address}}
                    </a-tooltip>
                </span>
            </template>
        </a-table>
        <a-modal title="请稍等,正在为您导出数据..." :visible="tips_visible" :closable="false" :mask-closable="false" :footer="null"
            :width="550">
            <div>
                <a-spin size="large" />
                <span style=" margin-left: 25px;">导出数据中,请耐心等待,数量越多时间越长。</span>
                <p style="margin: 15px;">若长时间未成功导出，建议调整筛选条件减少导出数，然后分多次导出。</p>
            </div>
        </a-modal>
    </div>
</template>
<script>
    import moment from 'moment';
    import villageApi from '@/api/community/village'
	import store from '@/store';
    const columns = [{
            title: store.getters.config.room_name+'号/车位号',
            dataIndex: 'address',
            key: 'address',
            fixed: 'left',
            width:180,
            scopedSlots: { customRender: 'address' }
        },
        {
            title: '业主',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width:120
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
            fixed: 'left',
            width:120
        },
        {
            title: '计费开始时间',
            dataIndex: 'service_start_time_str',
            key: 'service_start_time_str',
            fixed: 'left',
            width:120
        },
        {
            title: '计费结束时间',
            dataIndex: 'service_end_time_str',
            key: 'service_end_time_str',
            fixed: 'left',
            width:120
        },
        {
            title: '合计',
            dataIndex: 'all_total_money',
            key: 'all_total_money',
            fixed: 'right',
            width:140
        },
    ];
    const data = [];
    export default {
        name: 'dailyStatementList',
        data() {
            return {
                pagination: {
                    current: 1,
                    pageSize: 11,
                    total: 10,
                },
                search: {
                    order_service_type: '0',
                    charge_project_id: '0',
                    rule_id: '0',
                    date: moment().format('YYYY-MM'),
                    end_date:'',
                },
                visible: false,
                loading: false,
                data,
                columns,
                page: 1,
                project_rule_list: [],
                project_list: [],
                search_data: moment().format('YYYY-MM'),
                xscroll:{x: 1400},
                tips_visible:false,
                excelExportOutFileUrl:'',
                export_out_id:0,
                setTimeoutS:null,
            };
        },
        mounted() {
            this.getOrderRuleList()
            this.getList()
            this.getProjectList()
            this.getProjectRuleList()
            
        },
        methods: {

            // 获取列表信息
            getList() {
                this.tips_visible=false;
                this.loading = true;
                this.search['page'] = this.page;
                this.search['pay_status'] = 'is_pay';
                this.search['xtype'] = 'monthly';
                if(this.search.date && this.search.end_date){
                    let s_date=this.search.date.replace('-','');
                    s_date=parseInt(s_date);
                    let e_date=this.search.end_date.replace('-','');
                    e_date=parseInt(e_date);
                    if(e_date<s_date){
                        let prefix_err='';
                         if(this.search.order_service_type*1==0){
                             prefix_err='支付时间'
                         }else if(this.search.order_service_type*1==1){
                             prefix_err='计费开始时间'
                         }else if(this.search.order_service_type*1==2){
                             prefix_err='计费结束时间'
                         }else if(this.search.order_service_type*1==3){
                             prefix_err='计费开始结束时间'
                         }
                         this.loading = false
                         this.$message.error(prefix_err+'结束月份不能小月开始月份！')
                         return false;
                    }
                }
                this.request(villageApi.getSummaryByRoomAndRuleList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 11
                        this.data = res.lists
                        this.loading = false
                        this.excelExportOutFileUrl=res.excelExportOutFileUrl;
                    })
            },
            // 导出Excel
            excelExportOut () {
                this.tips_visible = true;
                this.loading = true;
                this.search['pay_status'] = 'is_pay';
                this.search['xtype'] = 'monthly';
                this.request(villageApi.excelExportFinancialOutUrl, this.search).then((res) => {
                        this.export_out_id = res.export_id
                        this.excelExportOutFileUrl= this.excelExportOutFileUrl + '&id=' + res.export_id
                        console.log('excelExportOutFileUrl',this.excelExportOutFileUrl)
                        this.CheckExportOutStatus();
                    }).catch((error) => {
                    this.loading = false
                })
            },
            
             CheckExportOutStatus () {
                let excelExportOutFileUrlCheck = this.excelExportOutFileUrl + '&ajax=village_ajax'
                console.log('excelExportOutFileUrlCheck',this.excelExportOutFileUrlCheck)
                this.request(excelExportOutFileUrlCheck, {
                        tokenName: 'village_access_token',
                        ajax: 'village_ajax'
                    })
                    .then((res) => {
                        console.log('exportOutStatus',res)
                        if (res.error_code == 0) {
                            clearTimeout(this.setTimeoutS)
                            this.setTimeoutS = null
                            window.location.href = this.excelExportOutFileUrl;
                            this.tips_visible = false;
                            this.loading = false
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
            serviceDateOnChange(date, dateString) {
                this.search.date = dateString;
                console.log('search', this.search);
            },
            serviceEndDateOnChange(date, dateString) {
                this.search.end_date = dateString;
                console.log('end_date', this.search);
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
            getOrderRuleList() {
                this.request(villageApi.getOrderTableRuleList, {
                        'pay_status': 'is_pay',
                        'xtype':'monthly',
                    })
                    .then((res) => {
                        if (res.lists && res.lists.length > 0) {
                            this.xscroll.x=1400;
                            this.columns = [{
                                    title: store.getters.config.room_name+'号/车位号',
                                    dataIndex: 'address',
                                    key: 'address',
                                    fixed: 'left',
                                    width:180,
                                    scopedSlots: { customRender: 'address' }
                                },
                                {
                                    title: '业主',
                                    dataIndex: 'name',
                                    key: 'name',
                                    fixed: 'left',
                                    width: 120
                                },
                                {
                                    title: '电话',
                                    dataIndex: 'phone',
                                    key: 'phone',
                                    fixed: 'left',
                                    width: 120
                                },
                            ];
                            if (res.count > 5) {
                                this.columns.push({
                                    title: '计费开始时间',
                                    dataIndex: 'service_start_time_str',
                                    key: 'service_start_time_str',
                                    fixed: 'left',
                                    width: 110
                                });
                                this.columns.push({
                                    title: '计费结束时间',
                                    dataIndex: 'service_end_time_str',
                                    key: 'service_end_time_str',
                                    fixed: 'left',
                                    width: 110
                                });
                            } else {
                                this.columns.push({
                                    title: '计费开始时间',
                                    dataIndex: 'service_start_time_str',
                                    key: 'service_start_time_str',
                                    fixed: 'left',
                                    width: 120
                                });
                                this.columns.push({
                                    title: '计费结束时间',
                                    dataIndex: 'service_end_time_str',
                                    key: 'service_end_time_str',
                                    fixed: 'left',
                                    width: 120
                                });
                            }

                            if(res.count && res.count>5){
                                this.xscroll.x=res.count*140;
                            } else {
                                this.xscroll.x=0
                            }
                            for(let ii=0;ii<res.lists.length;ii++){
                                this.columns.push(                                {
                                    title: res.lists[ii].charge_name,
                                    dataIndex: 'rule_'+res.lists[ii].id,
                                    key: 'rule_'+res.lists[ii].id,
                                    width:140
                                });
                            }
                            
                            this.columns.push({
                                    title: '合计',
                                    dataIndex: 'all_total_money',
                                    key: 'all_total_money',
                                    fixed: 'right',
                                    width:140
                                });
                        } else {
                            this.columns = [{
                                    title: store.getters.config.room_name+'号/车位号',
                                    dataIndex: 'address',
                                    key: 'address',
                                    fixed: 'left',
                                    width:180,
                                    scopedSlots: { customRender: 'address' }
                                },
                                {
                                    title: '业主',
                                    dataIndex: 'name',
                                    key: 'name',
                                    fixed: 'left',
                                    width:120
                                },
                                {
                                    title: '电话',
                                    dataIndex: 'phone',
                                    key: 'phone',
                                    fixed: 'left',
                                    width:120
                                },
                                {
                                    title: '计费开始时间',
                                    dataIndex: 'service_start_time_str',
                                    key: 'service_start_time_str',
                                    fixed: 'left',
                                    width:120
                                },
                                {
                                    title: '计费结束时间',
                                    dataIndex: 'service_end_time_str',
                                    key: 'service_end_time_str',
                                    fixed: 'left',
                                    width:120
                                },
                                {
                                    title: '合计',
                                    dataIndex: 'all_total_money',
                                    key: 'all_total_money',
                                    fixed: 'right',
                                    width:140
                                },
                            ];
                        }
                    })
                    .catch((error) => {
                        this.loading = false
                    })
            },
            getProjectList() {
                this.request(villageApi.ChargeProjectList, {
                        type: 'selectdata'
                    })
                    .then((res) => {
                        this.project_list = res.list
                    })
                    .catch((error) => {
                        this.loading = false
                    })
            },
            changeOrderServiceType(typeV){
                this.search_data = null;
                this.search.date = '';
                this.search.end_date='';
            },
            projectItemChange(v_id) {
                this.getProjectRuleList();
            },
            getProjectRuleList() {
                this.project_rule_list = [];
                this.search.rule_id = '0';
                let postTmpData = {
                    charge_project_id: this.search.charge_project_id,
                    type: 'selectdata'
                };
                this.request(villageApi.ChargeRuleList, postTmpData)
                    .then((res) => {
                        this.project_rule_list = res.list
                        console.log(this.project_rule_list);
                    })
                    .catch((error) => {
                        this.loading = false
                    })
            },

            // 进行重置
            resetList() {
                this.search = {
                    order_service_type: '1',
                    charge_project_id: '0',
                    rule_id: '0'
                };
                this.search_data = null;
                this.getList()
            }
        }
    };
</script>
<style lang="less" scoped>
    .fee-summary-list-box {
        background-color: white;
    }

    .fee-summary-list-box .search-box {
        padding-left: 40px;
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
    /deep/ .ant-table-tbody > tr{
        &:nth-last-child(1){
            background: #676767;
            color: #fff;
            font-weight: bold;
            pointer-events:none;
        }
    }
</style>