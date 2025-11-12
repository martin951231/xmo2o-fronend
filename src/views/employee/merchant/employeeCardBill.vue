<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row>
            <div class="card_tab">
                <router-link to='/merchant/merchant.life_tools/employee_card'>
                    <span>商家员工卡列表</span>
                </router-link>
            </div>
            <div class="card_tab">
                <router-link to='/merchant/merchant.life_tools/employeeCardConsume'>
                    <span>核销列表</span>
                </router-link>
            </div>
            <div class="card_tab">
                <router-link to='/merchant/merchant.life_tools/employeeCardRechargeList'>
                <span>充值记录</span>
                </router-link>
            </div>
            <div class="card_tab">
                <span class="on">财务报表</span>
            </div>
            <div class="card_tab">
                <router-link to='/merchant/merchant.life_tools/employeeClearScoreList'>
                    <span>积分清零记录</span>
                </router-link>
            </div>
        </a-row>

        <a-row style="margin-top: 20px;">
            <a-col :span="10">
                选择日期：
                <a-range-picker @change="selectDate" />
            </a-col>
            <a-col :span="6" :offset="8" align="right">
                <a-select :value="exportParams.exportType" style="width: 120px" @change="selectExportType">
                    <a-select-option v-for="(item,index) in exportType" :key="index">
                        {{item}}
                    </a-select-option>
                </a-select>
                <a-button type="primary" @click="exportTable(exportUrl, exportParams)">
                    导出
                </a-button>
            </a-col>


        </a-row>


        <a-row style="margin-top: 40px;" :gutter="24">
            <a-col :sm="24" :md="12" :xl="4" style="" class="card-item">
                <chart-card title="食堂总收入" :total="total_price">
                    <div>
                        <mini-area :data="price_list" />
                    </div>
                    <template slot="footer">
                        <span slot="term">今日收入： {{today_price}}</span>
                    </template>
                </chart-card>
            </a-col>

            <a-col :sm="24" :md="12" :xl="4" style="" class="card-item">
                <chart-card title="食堂总补贴" :total="total_grant">
                    <div>
                        <mini-area :data="grant_list" />
                    </div>
                    <template slot="footer">
                        <span slot="term">今日补贴： {{today_grant}}</span>
                    </template>
                </chart-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="4" style="" class="card-item">
                <chart-card title="员工余额消费" :total="total_money">
                    <div>
                        <mini-area :data="money_list" />
                    </div>
                    <template slot="footer">
                        <span slot="term">今日余额消费： {{today_money}}</span>
                    </template>
                </chart-card>
            </a-col>
            <a-col :sm="24" :md="12" :xl="4" style="" class="card-item">
                <chart-card title="员工积分消费" :total="total_score">
                    <div>
                        <mini-area :data="score_list" />
                    </div>
                    <template slot="footer">
                        <span slot="term">今日积分消费 ： {{today_score}}</span>
                    </template>
                </chart-card>
            </a-col>

        </a-row>



        <a-row style="margin-top: 50px;">
            <a-col :span="20">
                食堂名称：
                <a-input placeholder="请输入食堂名称" @change="keywordsSearch" style="width: 300px;margin-right: 20px;" />
                选择日期：
                <a-range-picker @change="selectDate2" />
                <a-button type="primary" @click="onSearch" style="height: 30px;margin-left: 20px;">
                    搜索
                </a-button>
            </a-col>
            <a-col :span="4" align="right">
                <a-button type="primary" @click="exportTable(exportUrl2, StoreConsumerParams)">
                    导出
                </a-button>
            </a-col>

        </a-row>

        <a-row style="margin-top: 20px;">
            <a-table style="background: #ffffff" :columns="columns" rowKey="id" :data-source="dataList"
                @change="changePage" :pagination="pagination">


                <!-- 操作栏 -->
                <!-- <span slot="action" slot-scope="text">
                    <a class="inline-block" @click="$refs.goodsSortModel.showEdit(text)"
                        style="margin-right: 10px">{{ L('编辑') }}</a>
                    <a class="inline-block" @click="delGoodsSort(text)">{{ L('删除') }}</a>
                </span> -->

            </a-table>
        </a-row>
    </div>
</template>

<script>
    import lifeMerchantApi from '@/api/employee/merchant/index'
    import {
        ChartCard,
        MiniArea,
        MiniBar,
        RankList,
        Bar,
        Trend,
        NumberInfo,
        MiniSmoothArea
    } from '@/components'
    export default {
        components: {
            ChartCard,
            MiniArea,
            MiniBar,
            RankList,
            Bar,
            Trend,
            NumberInfo,
            MiniSmoothArea
        },
        data() {
            return {
                exportType: [
                    "按日导出",
                    "按月导出",
                    "按年导出",
                ],
                exportUrl: "/employee/merchant.EmployeeCardLog/exportBillData",
                exportUrl2: "/employee/merchant.EmployeeCardLog/exportStoreList",
                exportParams: {
                    exportType: 0
                },
                columns: [{
                        title: this.L('食堂名称'),
                        dataIndex: 'name'
                    },
                    {
                        title: this.L('食堂收入'),
                        dataIndex: 'total_money'
                    },
                    {
                        title: this.L('食堂总补贴'),
                        dataIndex: 'grant_price'
                    },
                    {
                        title: this.L('员工现金总支付'),
                        dataIndex: 'money'
                    },
                    {
                        title: this.L('员工积分总支付'),
                        dataIndex: 'score'
                    }
                ],
                dataList: [],
                pagination: {
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 10
                },
                DataCountParams: {
                    start_date: '',
                    end_date: ''
                },
                StoreConsumerParams:{
                    start_date: '',
                    end_date: '',
                    keywords: '',
                    page: 1,
                    page_size: 10
                },
                total_price: 0,
                today_price: 0,
                price_list: [],
                total_grant: 0,
                today_grant: 0,
                grant_list: [],
                total_money: 0,
                today_money: 0,
                money_list: [],
                total_score: 0,
                today_score: 0,
                score_list: [],
            }
        },
        mounted() {
            this.getDataStatistics();
            this.getStoreConsumerList();
        },
        methods: {
            getDataStatistics() {
                this.request(lifeMerchantApi.dataStatistics, this.DataCountParams).then((res) => {
                    this.total_price = res.total_price;
                    this.today_price = res.today_price;
                    this.price_list = res.price_list;

                    this.total_grant = res.total_grant;
                    this.today_grant = res.today_grant;
                    this.grant_list = res.grant_list;

                    this.total_money = res.total_money;
                    this.today_money = res.today_money;
                    this.money_list = res.money_list;

                    this.total_score = res.total_score;
                    this.today_score = res.today_score;
                    this.score_list = res.score_list;
                })
            },
            getStoreConsumerList(){
                this.StoreConsumerParams.page_size = this.pagination.pageSize
                this.StoreConsumerParams.page = this.pagination.current;
                this.request(lifeMerchantApi.getStoreConsumerList, this.StoreConsumerParams).then((res) => {
                    this.pagination.total = res.total
                    this.dataList = res.data
                })
            },
            
            selectDate(value, dateString) {
                this.DataCountParams.start_date = this.exportParams.start_date = dateString[0];
                this.DataCountParams.end_date = this.exportParams.end_date = dateString[1];
                this.getDataStatistics();
            },
            selectDate2(value, dateString) {
                this.StoreConsumerParams.start_date = dateString[0];
                this.StoreConsumerParams.end_date = dateString[1];
            },
            selectExportType(val) {
                this.exportParams.exportType = val
            },
            changePage(page, pageSize) {
                this.pagination.current = page.current;
                this.getStoreConsumerList();
            },
            keywordsSearch(e){
                this.StoreConsumerParams.keywords = e.target.value
            },
            onSearch(){
                this.getStoreConsumerList();
            },
            exportTable(exportUrl, exportParams){
                this.request(exportUrl, exportParams).then((res)=>{
                    let url = res.file_url;
                    if(url){
                        window.open(url)
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        min-height: 100%;
    }

    .page-title {
        padding: 20px 30px;
        border-bottom: 1px solid #f1f1f1;
        font-size: 15px;
        font-weight: bold;
        color: #000000;
    }

    .content {
        margin: 20px 30px;
    }

    .ant-row-flex {
        margin-bottom: 12px;
    }

    .ant-form-item {
        display: flex;
        align-items: center;
    }

    .ant-form-item-control-wrapper {
        padding-right: 100px;
        flex: 1;
        box-sizing: border-box;
    }

    .ant-form-item-children {
        width: 100%;
        display: inline-block;
    }

    .total-performance {
        margin: 20px 0;
        padding: 0 30px;
        width: 100%;
        background-color: #e6f7ff;
        border: 1px solid #91d5ff;
        border-radius: 4px;
        font-size: 14px;
        line-height: 1;
    }

    .cr-f1 {
        color: #f1f1f1;
    }

    .card_tab {
        text-align: center;
        width: 140px;
        float: left;
        margin: 0 0 20px 0;
    }

    .card_tab span {
        color: #000000;
        font-size: 15px;
        padding: 7px 10px;
    }

    .card_tab span.on {
        color: #1890ff;
        border-bottom: 2px solid #1890ffcc;
    }

    .card-item {
        border: 1px solid #efefef;
        margin-left: 80px;
    }
</style>
