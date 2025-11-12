<template>
    <div class="fee-summary-list-box">
        <a-collapse accordion>
            <a-collapse-panel key="1" header="相关说明">
                <div class="fee-summary-list-tip-box">
                    <a-alert message="" type="info">
                        <div slot="description">
                            <div> 1、以下数据只统计已生成的账单包括未支付账单、已支付账单、挂单账单，不包括作废账单</div>
                            <div> 2、除了暖气费类别下的账单，其他账单都根据选择的计费时间进行拆分统计。（例如物业费周期为2024年5月5日至2025年5月4日，筛选计费时间2024年1月1日-2024年12月31日统计，统计金额算出账单每日要计费多少钱再乘与筛选的天数）</div>
                            <div> 3、暖气费：暖气费类别系统不进行拆单处理，可以把筛选相关切换成计费开始时间（试用场景：暖气费9月到次年2月，统计计费开始时间是）</div>
                            <div> 4、账单费用：筛选日期内账单已缴金额+优惠金额+未缴费用（除暖气费需要拆单）</div>
                            <div> 5、欠费费用：筛选日期内容欠费账单应收费用（除暖气费需要拆单）</div>
                            <div> 6、已缴费用：筛选日期内容已缴金额（除暖气费需要拆单）</div>
                            <div> 7、预计固定费用算法：当前标准计费模式是 ：单价*计量单位，计量单位是 ：房屋面积 才会显示预计固定费用。
                            <div style="margin-left: 145px;">预计固定费用 = 总面积 * 单价 * 周期。总面积：是当前标准绑定的房间面积总和，单价：是当前标准的收费金额，周期：标准是按年的值是 1，标准是按月的值是 12，标准是按日的值是 365</div>

                            </div>
                        </div>
                    </a-alert>
                </div>
            </a-collapse-panel>
        </a-collapse>

        <div class="search-box">
            <a-row :gutter="48">
                <a-col :md="4" :sm="24" style="padding-right:0px;">
                    <label style="margin-top: 5px;">收费类别：</label>
                    <a-select v-model="search.charge_type" style="width: 160px" @change="handleChargeTypeChange"
                        placeholder="请选择收费类别">
                        <a-select-option v-for="item in chargeType" :key="item.key">{{ item.value }}</a-select-option>
                    </a-select>
                </a-col>
                <a-col :md="5" :sm="24" style="padding-right: 1px;padding-left: 10px;">
                    <label style="margin-top: 5px;">收费项目：</label>
                    <a-select v-model="search.charge_project_id" style="width: 210px" placeholder="请选择收费项目">
                        <a-select-option v-for="itemp in chargeProject"
                            :key="itemp.id">{{ itemp.name }}</a-select-option>
                    </a-select>
                </a-col>
                <a-col :md="4" :sm="12" style="padding-left: 1px;padding-right: 2px">
                    <label style="margin-top: 5px;">收费标准：</label>
                    <a-input style="width: 170px" placeholder="请输入收费标准名称" v-model="search.rule_name" />
                </a-col>
                <a-col :md="8" :sm="24" style="padding-left: 1px;padding-right: 1px;width: 490px">
                    <label style="margin-top: 5px;">计费时间：</label>
                    <a-select placeholder="请选择账单计费时间" style="width: 150px" v-model="search.order_service_type"
                        @change="changeOrderServiceType">
                        <a-select-option value="0">计费开始时间</a-select-option>
                        <a-select-option value="1">计费结束时间</a-select-option>
                        <a-select-option value="2">计费开始结束时间</a-select-option>
                    </a-select>
                    <a-range-picker @change="dateOnChange" :format="dateFormat" :allowClear='true' v-model="search_data"
                        style="width: 260px">
                        <a-icon slot="suffixIcon" type="calendar" />
                    </a-range-picker>
                </a-col>
                <a-col :md="6" :sm="24" style="padding-left: 20px;padding-right: 1px;width: 90px;">
                    <a-button type="primary" icon="search" @click="searchList()">
                        查询
                    </a-button>
                </a-col>
                <a-col :md="6" :sm="24" style="padding-left: 10px;padding-right: 1px;width: 90px;">
                    <a-button class="ml-20" icon="refresh" @click="resetList"> 重置</a-button>
                </a-col>
            </a-row>
        </div>
        <div class="fee-summary-page-summary-box">
            <a-row type="flex" justify="start">
                <a-col :span="4">
                    <span class="page-title-box">
                        总收应缴金额：
                    </span>
                    <span class="page-number-box">
                        <span class="pageRmbSymbol">¥</span>{{pageOrderInfo.xTotalMoney}}
                    </span>
                </a-col>
                <a-col :span="4">
                    <span class="page-title-box">
                        总欠费金额：
                    </span>
                    <span class="page-number-box">
                        <span class="pageRmbSymbol">¥</span>{{pageOrderInfo.xNopayMoney}}
                    </span>
                </a-col>
                <a-col :span="4">
                    <span class="page-title-box">
                        总已缴金额：
                    </span>
                    <span class="page-number-box">
                        <span class="pageRmbSymbol">¥</span>{{pageOrderInfo.xPayMoney}}
                    </span>
                </a-col>
                <a-col :span="4">
                    <span class="page-title-box">
                        总优惠金额：
                    </span>
                    <span class="page-number-box">
                        <span class="pageRmbSymbol">¥</span>{{pageOrderInfo.xDiscountMoney}}
                    </span>
                </a-col>
                <a-col :span="4">
                    <span class="page-title-box">
                        总缴费率：
                    </span>
                    <span class="page-number-box">
                        <span class="pageRmbSymbol">¥</span>{{pageOrderInfo.xRate}}
                    </span>
                </a-col>
            </a-row>
        </div>
        <a-table :columns="columns" :data-source="data" class="components-table-demo-nested" :pagination="pagination"
            @change='table_change' :row-key="record => record.order_id" :loading="loading" bordered>
            <span slot="rule_name_d" slot-scope="text, record">{{record.rule_name}}<span v-if="record.is_show_house_price>0" style="margin-left: 10px;">（预计固定费用：{{record.room_house_price}}）</span>
             <div v-if="record.is_show_house_price>0">总面积：{{record.housesize}}，单价：{{record.unit_price}}，周期：{{record.cycl_num}}</div>
            </span>
        </a-table>
    </div>
</template>
<script>
    import moment from 'moment';
    import villageApi from '@/api/community/village'
    const columns = [{
            title: '收费类别',
            dataIndex: 'order_name',
            key: 'order_name'
        },
        {
            title: '收费项目',
            dataIndex: 'project_name',
            key: 'project_name'
        },
        {
            title: '收费标准',
            dataIndex: 'rule_name',
            key: 'rule_name',
            width: 330,
            scopedSlots: {
                customRender: 'rule_name_d'
            }
        },
        {
            title: '应收费用',
            dataIndex: 'x_total_money',
            key: 'x_total_money'
        },
        {
            title: '欠费金额',
            dataIndex: 'x_nopay_money',
            key: 'x_nopay_money'
        },
        {
            title: '已缴金额',
            dataIndex: 'x_pay_money',
            key: 'x_pay_money'
        },
        {
            title: '优惠金额',
            dataIndex: 'x_discount_money',
            key: 'x_discount_money'
        },
        {
            title: '缴费率',
            dataIndex: 'x_rate',
            key: 'x_rate'
        },
    ];
    const data = [];
    export default {
        name: 'HousePropertyFeeSummary',
        data() {
            return {
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 10,
                    showSizeChanger: false, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                },
                search: {
                    charge_type: '',
                    charge_project_id: '',
                    rule_name: '',
                    order_service_type: '0',
                    date: [moment().year()+'-01-01',moment().year()+'-12-31'],
                },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                page: 1,
                chargeType: [],
                chargeProject: [],
                search_data: [moment(moment().year()+'-01-01'),moment(moment().year()+'-12-31')],
                dateFormat: 'YYYY-MM-DD',
                pageOrderInfo: {
                    'xTotalMoney': 0,
                    'xModifyMoney': 0,
                    'payTotalMoney': 0,
                    'xNopayMoney': 0,
                    'xPayMoney': 0,
                    'xDiscountMoney': 0,
                    'xRate': ''
                },
                isGeteOrderInfo:true,
            };
        },
        mounted() {
            this.isGeteOrderInfo=true;
            this.getList()
            this.getChargeTypeList()
            
        },
        methods: {
        moment,
            // 获取列表信息
            getList() {
                this.loading = true;
                this.search['xtype'] = '';
                this.search['page'] = this.page;
                this.search['limit'] = this.pagination.pageSize;
                this.request('/community/village_api.TransactionSummary/getOrderInfoByRuleList', this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false
                        this.getOrderTotalInfoByServiceTime();
                    }).catch(e => {
                        this.loading = false
                    })
            },

            getOrderTotalInfoByServiceTime() {
                if(!this.isGeteOrderInfo){
                    return false;
                }
                let postData = {
                    ...this.search
                };
                this.pageOrderInfo = {
                    'xTotalMoney': 0,
                    'xModifyMoney': 0,
                    'payTotalMoney': 0,
                    'xNopayMoney': 0,
                    'xPayMoney': 0,
                    'xDiscountMoney': 0,
                    'xRate': ''
                };
                postData.xtype = 'getOrderTotalInfoByServiceTime';
                this.request('/community/village_api.TransactionSummary/getOrderInfoByRuleList', postData)
                    .then((res) => {
                        this.pageOrderInfo = res.pageOrderInfo
                    }).catch(e => {

                    })
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                if (e.current && e.current > 0) {
                    this.isGeteOrderInfo=false;
                    this.pagination.current = e.current;
                    this.page = e.current;
                    this.getList()
                }
            },
            // 日期切换，重新赋值
            dateOnChange(date, dateString) {
                this.isGeteOrderInfo=true;
                this.search.date = dateString;
            },
            // 进行搜索
            searchList() {
                this.isGeteOrderInfo=true;
                this.page = 1;
                this.pagination.current =1;
                if(!this.search.date || this.search.date.length!=2 || !this.search.date[0]){
                     this.$message.warn('请选择一段计费时间日期！')
                     return false;
                }
                this.page = 1;
                this.getList()
            },
            getChargeTypeList() {
                this.isGeteOrderInfo=true;
                this.request(villageApi.getChargeTypeList).then(res => {
                    if (res) {
                        this.chargeType = res;
                    }
                });
            },
            handleChargeTypeChange(value) {
                this.isGeteOrderInfo=true;
                this.search.charge_project_id = '请选择收费项目'
                this.request(villageApi.getChargeProjectByTypeList, {
                    charge_type_key: value
                }).then(res => {
                    if (res) {
                        this.chargeProject = res;
                    }
                });
            },
            changeOrderServiceType(typeV) {
                this.isGeteOrderInfo=true;
                this.search_data = [moment(moment().year()+'-01-01'),moment(moment().year()+'-12-31')];
                this.search.date = [moment().year()+'-01-01',moment().year()+'-12-31'];
            },
            // 进行重置
            resetList() {
                this.isGeteOrderInfo=true;
                this.search = {
                    charge_type: '',
                    charge_project_id: '',
                    rule_name: '',
                    order_service_type: '0',
                    date:[moment().year()+'-01-01',moment().year()+'-12-31'],
                };
                this.search_data = [moment(moment().year()+'-01-01'),moment(moment().year()+'-12-31')];
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