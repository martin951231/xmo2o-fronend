<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">

        <h3><a>优惠买单返还记录</a></h3>
        <a-divider style="margin-top: 10px;" />

        <!-- 店铺、会员卡、手机号、时间段 -->


        <a-row style="margin-top: 10px;">
            <a-input-group compact>
                <a-select v-model="queryParam.search_by" style="width: 90px;">
                    <a-select-option :value="0">店铺</a-select-option>
                    <a-select-option :value="1">会员卡</a-select-option>
                    <a-select-option :value="2">手机号</a-select-option>
                </a-select>
                <a-input v-model="queryParam.keywords" placeholder="请输入搜索内容" style="width: 240px;" />


                <a-range-picker @change="selectDate" style="margin-left: 30px;" />



                <a-button type="primary" style="margin-left: 20px;" @click="onSearch">搜索</a-button>
                
                <a-button type="primary" style="margin-left: 20px;" @click="exportData">导出</a-button>
                
            </a-input-group>
        </a-row>
        <a-row style="margin-top: 20px;">
            
            <span style="margin-left: 10px; font-weight: 600;">汇总返还总额：{{total_back_num}}</span>
            <a-table style="background: #ffffff" @change="changePage" :columns="columns" rowKey="id" :data-source="dataList"
                :pagination="pagination">
                <span slot="cash_back_rate" slot-scope="text">
                    {{text}}%
                </span>
            </a-table>
        </a-row>
    </div>
</template>

<script>
    import cardMerchantApi from '@/api/card/merchant'
    const columns = []

    export default {
        components: {},
        data() {
            return {
                queryParam: {
                    page: 1,
                    page_size: 10,
                    search_by: 0,
                    start_date: null,
                    end_date: null,
                    keywords: ''
                },
                total_back_num: 0,
                dataList: [],
                pagination: {
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 1
                },
                columns: [{
                        title: this.L('ID'),
                        dataIndex: 'id'
                    },
                    {
                        title: this.L('店铺名称'),
                        dataIndex: 'store_name'
                    },
                    {
                        title: this.L('支付金额'),
                        dataIndex: 'pay_money'
                    },
                    {
                        title: this.L('返还比例'),
                        dataIndex: 'cash_back_rate',
                        key: 'cash_back_rate',
                        scopedSlots: {
                            customRender: 'cash_back_rate'
                        },
                    },
                    {
                        title: this.L('返还金额'),
                        dataIndex: 'cash_back_price'
                    },
                    {
                        title: this.L('会员卡ID'),
                        dataIndex: 'card_id'
                    },
                    {
                        title: this.L('日期'),
                        dataIndex: 'add_time_text'
                    }
                ],
            }
        },
        created() {
            this.getData()
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                this.queryParam.page_size = this.pagination.pageSize
                this.queryParam.page = this.pagination.current;
                this.request(cardMerchantApi.getCashBackList, this.queryParam).then((res) => {
                    this.pagination.total = res.total
                    this.dataList = res.data
                    this.total_back_num = res.total_back_num

                });
            },
            changePage(page, pageSize) {
                this.pagination.current = page.current;
                this.getData();
            },
            onSearch() {
                this.getData();
            },
            selectDate(value, dateString) {
                this.queryParam.start_date = dateString[0];
                this.queryParam.end_date = dateString[1];
            },
            exportData(){
                this.request(cardMerchantApi.exportCashBackList, this.queryParam).then((res) => {
                    if(res.file_url){
                        this.$message.success('导出成功');
                        location.href = res.file_url
                    }
                });
            }
        },
    }
</script>

<style>
</style>
