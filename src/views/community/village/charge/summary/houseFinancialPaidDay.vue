<template>
    <div class="fee-summary-list-box">
        <div class="search-box" style="padding-top: 20px;">
            <a-row :gutter="48" >
                <a-col :md="8" :sm="24" style="padding-left: 5px;padding-right: 1px;width: 380px">
                     <label style="margin-top: 5px;">选择日期：</label>
                    <a-date-picker
                        v-model="search.date"
                       style="width: 250px"
                       @change="dateOnChange"
                       format="YYYY-MM-DD"
                    />
                    
                </a-col>
                <a-col :md="5" :sm="12" style="padding-left: 5px;padding-right: 1px">
                    <label style="margin-top: 5px;">收费项目：</label>
                    <a-select default-value="0" style="width: 250px" placeholder="请选择项目"
                        v-model="search.charge_project_id" @change="projectItemChange">
                        <a-select-option value="0">
                            全部
                        </a-select-option>
                        <a-select-option :value="item1.id" v-for="(item1,index1) in project_list" :key="index1">
                            {{ item1.name }}
                        </a-select-option>
                    </a-select>
                </a-col>
                <a-col :md="6" :sm="24" style="padding-left: 20px;padding-right: 1px;width: 90px;">
                    <a-button type="primary" icon="search" @click="searchList()">
                        查询
                    </a-button>
                </a-col>
                <a-col :md="3" :sm="12" class="suggestions_col_btn" style="padding-left: 40px;">
                  <a-button type="primary" @click="excelExportOut()" >Excel导出</a-button>
                </a-col>
            </a-row>
        </div>

        <a-table :columns="columns" :data-source="data" class="components-table-demo-nested" :pagination="pagination"
            @change='table_change' :row-key="record => record.id" :loading="loading" :scroll="xscroll" bordered>
            <span slot="all_refund_money" slot-scope="text, record">
                
                <span v-if="record.all_refund_money>0" style="color:red;">-{{record.all_refund_money}}</span>
                <span v-if="record.all_refund_money<=0" >{{record.all_refund_money}}</span>
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
        
    </div>
</template>
<script>
    import moment from 'moment';
    import villageApi from '@/api/community/village'
	import store from '@/store';
    const columns = [
        {
            title: '项目名称',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width:180
        },
        {
            title: '本日实收',
            dataIndex: 'all_pay_money',
            key: 'all_pay_money',
            fixed: 'left',
            width:120
        },
        {
            title: '付款方式',
            children: [

            ]
        },
        {
            title: '当日退款金额',
            dataIndex: 'all_refund_money',
            key: 'all_refund_money',
            fixed: 'right',
            scopedSlots: { customRender: 'all_refund_money' },
            width:100
        },
        {
            title: '收银台修改优惠',
            dataIndex: 'modify_discount_money',
            key: 'modify_discount_money',
            fixed: 'right',
            width:100
        },
        {
            title: '减免优惠',
            dataIndex: 'discount_money',
            key: 'discount_money',
            fixed: 'right',
            width:100
        },

    ];
    const data = [];
    export default {
        name: 'houseFinancialPaidDay',
        data() {
            return {
                pagination: {
                    current: 1,
                    pageSize: 11,
                    total: 10,
                },
                search: {
                    charge_project_id: '0',
                    date: moment().format('YYYY-MM-DD'),
                },
                visible: false,
                loading: false,
                data,
                columns,
                page: 1,
                project_list: [],
                xscroll:{x: 1400},
                tips_visible:false,
                excelExportOutFileUrl:'',
                export_out_id:0,
                setTimeoutS:null,
            };
        },
        mounted() {
            this.getAllPayList()
            this.getList()
            this.getProjectList()
        },
        methods: {

            // 获取列表信息
            getList() {
                this.tips_visible=false;
                this.loading = true;
                this.search['page'] = this.page;
                this.search['pay_status'] = 'is_pay';
                this.search['xtype'] = 'daily';
                this.request(villageApi.getSummaryByProjectList, this.search)
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
                this.search['xtype'] = 'daily';
                this.search['export_type'] = 'house_financial_by_project'; 
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
            dateOnChange(date, dateString) {
                this.search.date = dateString;
                console.log('search', this.search);
            },
            // 进行搜索
            searchList() {
                this.page = 1;
                let val = {
                    current: 1,
                }
                this.table_change(val)
            },
            getAllPayList() {
                this.request(villageApi.payTypeList, {
                        'type':'',
                        'cfromtype':'houseFinancialPaidDay',
                    }).then((resData) => {
                        if (resData && resData.length > 0) {
                            let mc_x=0;
                            this.columns['2'].children=[];
                            for(let ii=0;ii<resData.length;ii++){
                                this.columns['2'].children.push({
                                        title: resData[ii].name,
                                        dataIndex: 'paytype_'+resData[ii].id,
                                        key: 'paytype_'+resData[ii].id,
                                        width:140,
                                    });
                                    mc_x+=140;
                                }
                                mc_x=mc_x+140;
                                if(mc_x>this.xscroll.x){
                                    this.xscroll.x=mc_x;
                                }
                                if(resData.length<8){
                                    this.xscroll.x=0;
                                }
                         }else{
                             this.xscroll.x=0;
                         }
                         console.log('columns', this.columns);
                    }).catch((error) => {
                        this.loading = false
                    })
            },
            getProjectList() {
                this.request(villageApi.ChargeProjectList, {
                        type: 'selectdata_nodel',
                    })
                    .then((res) => {
                        this.project_list = res.list
                    })
                    .catch((error) => {
                        this.loading = false
                    })
            },
            projectItemChange(v_id) {
               console.log('charge_project_id', v_id);
            },
            // 进行重置
            resetList() {
                this.search = {
                    charge_project_id: '0',
                };
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
    

</style>