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
                    <a-select style="width: 120px" :placeholder="L('请选择')" v-model="formData.search_type">
                        <a-select-option v-for="(item,index) in searchType" :value="item.value" :key="index">{{item.label}}</a-select-option>
                    </a-select>
                    <a-input v-model="formData.keywords" :placeholder="L('请输入账单名称')" style="width: 250px"></a-input>
                </a-form-model-item>
                <a-form-model-item :label="L('结算方式')">
                    <a-select style="width: 120px" :placeholder="L('请选择')" v-model="formData.bill_type">
                        <a-select-option v-for="(item,index) in bill_type_list" :value="item.value" :key="index">{{item.label}}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item :label="L('票价类型')">
                    <a-select style="width: 120px" :placeholder="L('请选择')" v-model="formData.tax_ticket_type">
                        <a-select-option v-for="(item,index) in tax_ticket_type_list" :value="item.value" :key="index">{{item.label}}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item>
                    <a-button type="primary" html-type="submit" class="mr-10">{{L('搜索')}}</a-button>
                    <a-button type="primary" @click="exportClick">{{L('导出')}}</a-button>
                </a-form-model-item>
            </a-form-model>
        </div>
        <div :class="getClass">
            <a-table rowKey="id" :loading="tableLoading" :columns="columns" :data-source="tabList" :pagination="pagination" @change="handleTableChange">
                <template slot="id" slot-scope="text, record, index">
                    <span>{{index + 1}}</span>
                </template>
            </a-table>
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
            searchType: [
                {
                    value: 'admin_user_name',
                    label: this.L('经办人'),
                },
                {
                    value: 'tax_point',
                    label: this.L('税点'),
                },
                {
                    value: 'bill_money',
                    label: this.L('结算金额'),
                },
            ],
            bill_type_list: [
                {
                    value: 0,
                    label: this.L('全部'),
                },
                {
                    value: 1,
                    label: this.L('现金'),
                },
                {
                    value: 2,
                    label: this.L('对公转账'),
                },
            ],
            tax_ticket_type_list: [
                {
                    value: 0,
                    label: this.L('全部'),
                },
                {
                    value: 1,
                    label: this.L('专票'),
                },
                {
                    value: 2,
                    label: this.L('普票'),
                },
            ],
            formData: {
                search_type: 'admin_user_name',
                bill_type: 0,
                tax_ticket_type: 0,
                keywords: '',
            },
            list: [{}],
            columns: [
                {
                    title: this.L('序号'),
                    dataIndex: 'id',
                    key: 'id',
                    scopedSlots: { customRender: 'id' },
                },
                {
                    title: this.L('时间'),
                    dataIndex: 'create_time',
                    key: 'create_time',
                },
                {
                    title: this.L('经办人'),
                    dataIndex: 'admin_user_name',
                    key: 'admin_user_name',
                },
                {
                    title: this.L('备注'),
                    dataIndex: 'remark',
                    key: 'remark',
                },
                {
                    title: this.L('结算方式'),
                    dataIndex: 'bill_type_text',
                    key: 'bill_type_text',
                },
                {
                    title: this.L('票据类型'),
                    dataIndex: 'tax_ticket_type_text',
                    key: 'tax_ticket_type_text',
                },
                {
                    title: this.L('税点'),
                    dataIndex: 'tax_point',
                    key: 'tax_point',
                },
                {
                    title: this.L('结算金额'),
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
            businessType: '',
            tabList: [],
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
                    type: 'SettlementLog',
                    title: this.L(this.$route.query.bill_date + '结算记录'),
                },
            ]
        } else if (this.$route.path.indexOf('platform') > -1) {
            //平台需要传商家id查看结算记录
            this.businessType = 'platform'
            this.formData.mer_id = this.$route.query.mer_id
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
                    type: 'SettlementLog',
                    title: this.L(this.$route.query.merchant_name + '结算记录'),
                },
            ]
        }
        this.formData.bill_date = this.$route.query.bill_date
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
            let url = internalCardPlatformApi.merBillRecord
            if (this.businessType == 'merchant') {
                url = internalCardMerchantApi.merBillRecord
            }
            let params = this.formData
            //导出
            if (isExprot) {
                params.export = 1
            } else {
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
</style>