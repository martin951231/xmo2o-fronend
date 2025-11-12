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
                <router-link to='/merchant/merchant.life_tools/employeeBillList'>
                    <span>财务报表</span>
                </router-link>
            </div>
            <div class="card_tab">
                <span class="on">积分清零记录</span>
            </div>
        </a-row>

        <a-row style="margin-top: 20px;">
            <a-col :span="20">

                选择日期：
                <a-range-picker @change="selectDate2" />
                <a-button type="primary" @click="onSearch" style="height: 30px;margin-left: 20px;">
                    搜索
                </a-button>
            </a-col>


        </a-row>

        <a-row style="margin-top: 20px;">
            <a-col :span="10">
                <a-alert :message="'此时间段内清除总积分：'+clearScore" type="info"  show-icon />
            </a-col>
        </a-row>

        <a-row>
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
                clearScore: 0,
                columns: [{
                        title: this.L('员工名称'),
                        dataIndex: 'user_name'
                    },
                    {
                        title: this.L('手机号'),
                        dataIndex: 'user.phone'
                    },
                    {
                        title: this.L('清除积分'),
                        dataIndex: 'clear_score'
                    },
                    {
                        title: this.L('剩余积分'),
                        dataIndex: 'now_score'
                    },
                    {
                        title: this.L('清零时间'),
                        dataIndex: 'create_time'
                    }
                ],
                dataList: [],
                pagination: {
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 10
                },
                StoreConsumerParams: {
                    start_date: '',
                    end_date: '',
                    keywords: '',
                    page: 1,
                    page_size: 10
                },

            }
        },
        mounted() {
            this.getStoreConsumerList();
        },
        methods: {

            getStoreConsumerList() {
                this.StoreConsumerParams.page_size = this.pagination.pageSize
                this.StoreConsumerParams.page = this.pagination.current;
                this.request(lifeMerchantApi.getClearScoreList, this.StoreConsumerParams).then((res) => {
                    this.pagination.total = res.total
                    this.dataList = res.data
                    this.clearScore = res.total_score
                })
            },


            selectDate2(value, dateString) {
                this.StoreConsumerParams.start_date = dateString[0];
                this.StoreConsumerParams.end_date = dateString[1];
            },

            changePage(page, pageSize) {
                this.pagination.current = page.current;
                this.getStoreConsumerList();
            },
            keywordsSearch(e) {
                this.StoreConsumerParams.keywords = e.target.value
            },
            onSearch() {
                this.getStoreConsumerList();
            },

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
