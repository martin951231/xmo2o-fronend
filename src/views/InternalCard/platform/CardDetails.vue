<template>
    <div class="mt-10 mb-10">
        <div :class="getClass">
            <div class="mb-20" v-if="breadcrumbList.length > 0">
                <a-breadcrumb>
                    <a-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">
                        <a @click="navClick(item)">{{item.title}}</a>
                    </a-breadcrumb-item>
                </a-breadcrumb>
            </div>
            <a-form-model layout="inline" :model="formData" @submit="handleSubmit" @submit.native.prevent>
                <a-form-model-item>
                    <a-select style="width: 120px" :placeholder="L('请选择')" v-model="formData.type">
                        <a-select-option v-for="(item,index) in tradeType" :value="item.value" :key="index">{{item.label}}</a-select-option>
                    </a-select>
                    <span class="ml-10"></span>
                    <a-input-number v-model="formData.min_money" :min="0" />
                    <span class="mr-10 ml-10">-</span>
                    <a-input-number id="inputNumber" v-model="formData.max_money" :min="0" />
                </a-form-model-item>
                <a-form-model-item>
                    <a-select style="width: 120px" :placeholder="L('请选择')" v-model="formData.search_type">
                        <a-select-option v-for="(item,index) in searchType" :value="item.value" :key="index">{{item.label}}</a-select-option>
                    </a-select>
                    <a-input v-model="formData.keywords" :placeholder="L('请输入')" style="width: 250px"></a-input>
                </a-form-model-item>
                <a-form-model-item>
                    <a-button type="primary" html-type="submit" class="mr-10">{{L('搜索')}}</a-button>
                    <a-button type="primary" @click="exportClick">{{L('导出')}}</a-button>
                </a-form-model-item>
            </a-form-model>
        </div>
        <div :class="getClass">
            <div class="statistics">
                <div class="item" v-for="(item,index) in statistics" :key="index">
                    <div class="title">{{item.title}}</div>
                    <div class="money">￥{{item.money}}</div>
                </div>
            </div>
            <a-table rowKey="id" :columns="columns" :data-source="tabList" :pagination="pagination" @change="handleTableChange"></a-table>
        </div>
    </div>
</template>

<script>
import internalCardMerchantApi from '@/api/InternalCard/merchant'
import internalCardPlatformApi from '@/api/InternalCard/platform'
import moment from 'moment'
export default {
    data() {
        return {
            breadcrumbList: [],
            tradeType: [
                {
                    value: 'pay_money',
                    label: this.L('交易金额'),
                },
                {
                    value: 'bill_money',
                    label: this.L('总结算金额'),
                },
                {
                    value: 'service_fee',
                    label: this.L('总服务费'),
                },
            ],
            searchType: [
                {
                    value: 'card_name',
                    label: this.L('卡名称'),
                },
            ],
            formData: {
                min_money: 0,
                max_money: 0,
                type: 'pay_money',
                bill_date: '',
                search_type: 'card_name',
                keywords: '',
            },
            tabList: [],
            columns: [
                {
                    title: this.L('卡名称'),
                    dataIndex: 'card_name',
                    key: 'card_name',
                },
                {
                    title: this.L('商家名称'),
                    dataIndex: 'merchant_name',
                    key: 'merchant_name',
                },
                {
                    title: this.L('卡区域'),
                    dataIndex: 'area_name',
                    key: 'area_name',
                    width: 400,
                },
                {
                    title: this.L('交易总额'),
                    dataIndex: 'pay_money',
                    key: 'pay_money',
                    sorter: (a, b) => a.pay_money - b.pay_money,
                    customRender: (text) => `¥ ${text.toLocaleString()}`,
                },
                {
                    title: this.L('服务费'),
                    dataIndex: 'service_fee',
                    key: 'service_fee',
                    sorter: (a, b) => a.service_fee - b.service_fee,
                    customRender: (text) => `¥ ${text.toLocaleString()}`,
                },
                {
                    title: this.L('总结算金额'),
                    dataIndex: 'bill_money',
                    key: 'bill_money',
                    sorter: (a, b) => a.bill_money - b.bill_money,
                    customRender: (text) => `¥ ${text.toLocaleString()}`,
                },
            ],
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            statistics: {
                bill_money_sum: {
                    title: this.L('总结算金额'),
                    money: 0,
                },
                service_fee_sum: {
                    title: this.L('总服务费'),
                    money: 0,
                },
            },
            businessType: '',
        }
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    computed: {
        getClass() {
            let classList = []
            if (this.businessType == 'merchant') {
                classList.push('main-box-content-min')
            } else {
                classList.push('main-box-content')
            }
            return classList
        },
    },
    created() {
        //获取业务类型
        if (this.$route.path.indexOf('merchant') > -1) {
            this.businessType = 'merchant'
            this.breadcrumbList = [
                {
                    path: '/views/InternalCard/merchant/SettlementManage',
                    type: 'SettlementManage',
                    title: this.L('结算账单管理'),
                },
                {
                    path: '',
                    type: 'cardDetails',
                    title: this.L(this.$route.query.bill_date + '卡明细'),
                },
            ]
        } else if (this.$route.path.indexOf('platform') > -1) {
            this.businessType = 'platform'
            this.breadcrumbList = [
                {
                    path: '/views/InternalCard/platform/SettlementManage',
                    type: 'SettlementManage',
                    title: this.L('结算账单管理'),
                },
                {
                    path: '',
                    type: 'SettlementDetails',
                    title: this.L(this.$route.query.bill_date + '账单明细'),
                },
                {
                    path: '',
                    type: 'cardDetails',
                    title: this.L(this.$route.query.merchant_name + '卡明细'),
                },
            ]
        }
        this.formData.bill_date = this.$route.query.bill_date
        this.formData.mer_id = this.$route.query.mer_id
        this.getTableList()
    },
    methods: {
        moment,
        getTableList(isSearch, isExprot) {
            if (isSearch) {
                this.pagination.current = 1
            }
            this.formData.page = this.pagination.current
            this.formData.page_size = this.pagination.pageSize
            let url = internalCardPlatformApi.merCardList
            if (this.businessType == 'merchant') {
                url = internalCardMerchantApi.merCardList
            }
            let params = this.formData
            //导出
            if (isExprot) {
                params.export = 1
            }else{
                params.export = 0
                this.tableLoading = true
            }
            this.request(url, this.formData)
                .then((res) => {
                    if (res.file_url && isExprot) {
                        window.open(res.file_url)
                        return
                    }
                    this.tabList = res.data
                    this.pagination.total = res.total
                    this.tableLoading = false
                })
                .catch((err) => {
                    this.tableLoading = false
                })
            this.getBillSum()
        },
        getBillSum() {
            let url = internalCardPlatformApi.merCardBillSum
            if (this.businessType == 'merchant') {
                url = internalCardMerchantApi.merCardBillSum
            }
            this.request(url, this.formData).then((res) => {
                let data = res
                for (let key in data) {
                    if (this.statistics[key]) {
                        this.statistics[key].money = data[key] || 0
                    }
                }
            })
        },
        //提交
        handleSubmit(e) {
            this.getTableList(true)
        },
        //导出
        exportClick() {
            this.getTableList(true, true)
        },
        handleTableChange(e) {
            if (e.current && e.current > 0) {
                this.pagination.current = e.current
                this.pagination.pageSize = e.pageSize
                this.getTableList()
            }
        },
        navClick(item) {
            if (item.type == 'SettlementDetails') {
                this.$router.go(-1)
            } else if (item.path) {
                this.$router.replace(item.path)
            }
        },
    },
}
</script>

<style lang="less" scoped>
.statistics {
    display: grid;
    grid-template-columns: repeat(5, 1fr); /*创建三列，每列占据可用空间的1/3 */
    grid-gap: 30px; /*网格项之间的间距为10rpx */
    column-gap: 50px; /*网格项上下之间的间距为10rpx */
    margin-bottom: 20px;
    .item {
        flex: 1;
        border: 1px solid rgba(153, 153, 153, 0.4);
        padding: 25px 30px;
        .title {
            color: #000;
            margin-bottom: 5px;
            font-size: 16px;
            text-align: left;
        }
        .money {
            color: #272727;
            font-size: 22px;
            font-weight: bold;
            text-align: center;
        }
    }
}
</style>