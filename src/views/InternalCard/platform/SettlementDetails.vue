<template>
    <div class="mt-10 mb-10">
        <div class="main-box-content">
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
                <a-form-model-item :label="L('区域筛选')">
                    <a-cascader :fieldNames="{ label: 'area_name', value: 'area_id', children: 'children' }" :options="areaOptions" :placeholder="L('请选择')" @change="onAreaChange" />
                </a-form-model-item>
                <a-form-model-item>
                    <a-select style="width: 100px" :placeholder="L('请选择')" v-model="formData.search_type">
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
        <div class="main-box-content">
            <div class="statistics">
                <div class="item" v-for="(item,index) of statistics" :key="index">
                    <div class="title">{{item.title}}</div>
                    <div class="money">￥{{item.money}}</div>
                </div>
            </div>
            <a-table rowKey="id" :loading="tableLoading" :columns="columns" :data-source="tabList" :pagination="pagination" @change="handleTableChange">
                <template slot="operation" slot-scope="text,item">
                    <a class="mr-10" @click="actions('settlementDetail',item)">{{L('卡明细')}}</a>
                    <a class="mr-10" @click="actions('settlement',item)">{{L('结算')}}</a>
                    <a @click="actions('settlementLog',item)">{{L('结算记录')}}</a>
                </template>
            </a-table>
        </div>

        <a-modal :title="L('结算')" v-model="visible" :confirm-loading="confirmLoading" @ok="settlementHandleOk">
            <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item ref="name" :label="L('结算金额')" prop="bill_money">
                    <a-input v-model="form.bill_money" :placeholder="L('请输入')" />
                </a-form-model-item>
                <a-form-model-item ref="name" :label="L('结算方式')" prop="bill_type">
                    <a-select style="width: 100%" :placeholder="L('请选择')" v-model="form.bill_type">
                        <a-select-option :value="1">{{L('现金')}}</a-select-option>
                        <a-select-option :value="2">{{L('对公转账')}}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item ref="name" :label="L('票务类型')" prop="tax_ticket_type">
                    <a-select style="width: 100%" :placeholder="L('请选择')" v-model="form.tax_ticket_type">
                        <a-select-option :value="1">{{L('专票')}}</a-select-option>
                        <a-select-option :value="2">{{L('普票')}}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item ref="name" :label="L('税点')" prop="tax_point">
                    <a-input v-model="form.tax_point" :placeholder="L('请输入')" />
                </a-form-model-item>
                <a-form-model-item ref="name" :label="L('备注')" prop="remark">
                    <a-input v-model="form.remark" :placeholder="L('请输入')" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
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
                    value: 'wait_bill_money',
                    label: this.L('待结算金额'),
                },
                {
                    value: 'already_bill_money',
                    label: this.L('已结算金额'),
                },
                {
                    value: 'service_fee',
                    label: this.L('服务费'),
                },
            ],
            searchType: [
                {
                    value: 'merchant_name',
                    label: this.L('商家名称'),
                },
            ],
            formData: {
                min_money: 0,
                max_money: 0,
                search_type: 'merchant_name',
                keywords: '',
                type: 'pay_money',
                province_id: '',
                city_id: '',
                area_id: '',
            },
            columns: [
                {
                    title: this.L('商家ID'),
                    dataIndex: 'mer_id',
                    key: 'mer_id',
                },
                {
                    title: this.L('商家名称'),
                    dataIndex: 'merchant_name',
                    key: 'merchant_name',
                },
                {
                    title: this.L('商家区域'),
                    dataIndex: 'area_address',
                    key: 'area_address',
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
                {
                    title: this.L('待算金额'),
                    dataIndex: 'wait_bill_money',
                    key: 'wait_bill_money',
                    sorter: (a, b) => a.wait_bill_money - b.wait_bill_money,
                    customRender: (text) => `¥ ${text.toLocaleString()}`,
                },
                {
                    title: this.L('已结算金额'),
                    dataIndex: 'already_bill_money',
                    key: 'already_bill_money',
                    sorter: (a, b) => a.already_bill_money - b.already_bill_money,
                    customRender: (text) => `¥ ${text.toLocaleString()}`,
                },
                {
                    title: this.L('操作'),
                    dataIndex: 'operation',
                    scopedSlots: { customRender: 'operation' },
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
                pay_money_sum: {
                    title: this.L('交易金额'),
                    money: 0,
                },
                bill_money_sum: {
                    title: this.L('总结算金额'),
                    money: 0,
                },
                wait_bill_money_sum: {
                    title: this.L('待结算金额'),
                    money: 0,
                },
                already_bill_money_sum: {
                    title: this.L('已结算金额'),
                    money: 0,
                },
                service_fee_sum: {
                    title: this.L('总服务费'),
                    money: 0,
                },
            },
            visible: false,
            confirmLoading: false,
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
            form: {
                bill_date: '', //账单日期
                mer_id: '', //商家ID
                bill_money: '', //结算金额
                bill_type: '', //结算方式 1现金 2对公转账
                tax_ticket_type: '', //票务类型 1专票 2普票
                tax_point: '', //税点
                remark: '', //备注
            },
            rules: {
                bill_money: [{ required: true, message: this.L('请输入结算金额'), trigger: 'blur' }],
                bill_type: [{ required: true, message: this.L('请选择结算方式'), trigger: 'blur' }],
                tax_ticket_type: [{ required: true, message: this.L('请选择票务类型'), trigger: 'blur' }],
                tax_point: [{ required: true, message: this.L('请输入税点'), trigger: 'blur' }],
                remark: [{ required: true, message: this.L('请输入备注'), trigger: 'blur' }],
            },
            tableLoading: false,
            businessType: '',
            tabList: [],
            areaOptions: [],
        }
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    created() {
        //获取业务类型
        if (this.$route.path.indexOf('merchant') > -1) {
            this.businessType = 'merchant'
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
            ]
        }
        this.formData.bill_date = this.$route.query.bill_date
        this.getTableList()
        this.getAllArea()
    },
    methods: {
        moment,
        getAllArea() {
            this.request('/common/common.area/getAllArea', {}).then((res) => {
                this.areaOptions = res
            })
        },
        getTableList(isSearch, isExprot) {
            if (isSearch) {
                this.pagination.current = 1
            }
            this.formData.page = this.pagination.current
            this.formData.page_size = this.pagination.pageSize
            let url = internalCardPlatformApi.billList
            let params = this.formData
            //导出
            if (isExprot) {
                params.export = 1
            }else{
                params.export = 0
                this.tableLoading = true
            }
            if (this.businessType == 'platform') {
                params.date_group = 0
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
            let url = internalCardPlatformApi.billSum
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

        //表格操作事件
        actions(type, item) {
            switch (type) {
                //卡详情
                case 'settlementDetail':
                    this.$router.push({
                        path: '/views/InternalCard/platform/cardDetails',
                        query: {
                            bill_date: item.bill_date,
                            mer_id: item.mer_id,
                            merchant_name: item.merchant_name
                        },
                    })
                    break
                case 'settlement':
                    //结算弹窗
                    this.form.mer_id = item.mer_id
                    this.visible = true
                    this.$nextTick(() => {
                        this.$refs.ruleForm.resetFields()
                    })
                    break
                case 'settlementLog':
                    //结算记录
                    this.$router.push({
                        path: '/views/InternalCard/platform/SettlementLog',
                        query: {
                            bill_date: item.bill_date,
                            mer_id: item.mer_id,
                            merchant_name: item.merchant_name
                        },
                    })
                    break
                default:
                    break
            }
        },
        settlementHandleOk() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.form.bill_date = this.$route.query.bill_date
                    this.request(internalCardPlatformApi.merBill, this.form).then((res) => {
                        this.visible = false
                        this.$message.success(this.L('操作成功'))
                        this.getTableList()
                    })
                }
            })
        },
        onAreaChange(value) {
            this.formData.province_id = value[0] ? value[0] : ''
            this.formData.city_id = value[1] ? value[1] : ''
            this.formData.area_id = value[2] ? value[2] : ''
        },
        navClick(item) {
            if (item.type == 'SettlementManage') {
                this.$router.go(-1)
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