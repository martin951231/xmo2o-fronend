<template>
    <div class="mt-10 mb-10">
        <div class="main-box-content-min" style="padding-top: 5px">
            <a-tabs v-model="tabsIndex" @change="tabChange" :animated="false">
                <a-tab-pane :key="1" :value="1" :tab="L('订单记录')"></a-tab-pane>
                <a-tab-pane :key="2" :value="2" :tab="L('支付明细')"></a-tab-pane>
            </a-tabs>
            <a-form-model layout="inline" :model="formData" @submit="handleSubmit" @submit.native.prevent>
                <a-form-model-item>
                    <a-select style="width: 120px" :placeholder="L('请选择')" v-model="formData.search_type">
                        <a-select-option v-for="(item,index) in searchType" :value="item.value" :key="index">{{item.label}}</a-select-option>
                    </a-select>
                    <a-input v-model="formData.keywords" :placeholder="L('请输入')" style="width: 250px"></a-input>
                </a-form-model-item>
                <a-form-model-item :label="L('业务类型')">
                    <a-select style="width: 120px" :placeholder="L('请选择')" v-model="formData.order_type">
                        <a-select-option v-for="(item,index) of businessType" :value="index" :key="index">{{item}}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item :label="L('区域筛选')">
                    <a-cascader :fieldNames="{ label: 'area_name', value: 'area_id', children: 'children' }" :options="areaOptions" :placeholder="L('请选择')" @change="onAreaChange" />
                </a-form-model-item>
                <a-form-model-item :label="L('日期')">
                    <a-range-picker :ranges="{ '今天': [moment(), moment()], '本月': [moment(), moment().endOf('month')] }" format="YYYY/MM/DD" @change="onDateChange" />
                </a-form-model-item>
                <a-form-model-item v-if="tabsIndex == 2" :label="L('支付状态')">
                    <a-select style="width: 120px" v-model="formData.operation_type" :placeholder="L('请选择')">
                        <a-select-option :value="0">{{L('全部')}}</a-select-option>
                        <a-select-option :value="2">{{L('已支付')}}</a-select-option>
                        <a-select-option :value="3">{{L('已退款')}}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item>
                    <a-button type="primary" html-type="submit" class="mr-10">{{L('搜索')}}</a-button>
                    <a-button type="primary" @click="exportClick">{{L('导出')}}</a-button>
                </a-form-model-item>
            </a-form-model>
        </div>
        <div class="main-box-content-min">
            <div class="statistics" v-if="tabsIndex == 1">
                <div class="item" v-for="(item,index) in statistics" :key="index">
                    <div class="title">{{item.title}}</div>
                    <div class="money">￥{{item.money}}</div>
                </div>
            </div>
            <a-table rowKey="id" :loading="tableLoading" :columns="tabsIndex==1?columns:columns2" :data-source="tabList" :pagination="pagination" @change="handleTableChange" :scroll="{ x: 1700}">
                <template slot="id" slot-scope="text, record, index">
                    <span>{{index + 1}}</span>
                </template>
                <template slot="operation_type" slot-scope="text, record, index">
                    <span v-if="record.operation_type == 2">{{L('已支付')}}</span>
                    <span v-else-if="record.operation_type == 3">{{L('已退款')}}</span>
                </template>
                <template slot="operation" slot-scope="text,item">
                    <a class="mr-10" @click="paymentDetails(item)">{{L('支付明细')}}</a>
                </template>
            </a-table>
        </div>
    </div>
</template>

<script>
import internalCardMerchantApi from '@/api/InternalCard/merchant'
import moment from 'moment'
export default {
    data() {
        return {
            searchType: [
                {
                    value: 'store_name',
                    label: this.L('店铺名称'),
                },
                {
                    value: 'nickname',
                    label: this.L('用户姓名'),
                },
                {
                    value: 'phone',
                    label: this.L('手机号'),
                },
                {
                    value: 'order_no',
                    label: this.L('订单号'),
                },
            ],
            businessType: {},
            formData: {
                order_type: '',
                search_type: 'store_name',
                keywords: '',
                start_time: '',
                end_time: '',
                province_id: '',
                city_id: '',
                area_id: '',
                operation_type: 2,
            },
            columns: [
                {
                    title: this.L('序号'),
                    dataIndex: 'id',
                    key: 'id',
                    scopedSlots: { customRender: 'id' },
                },
                {
                    title: this.L('订单号'),
                    dataIndex: 'order_no',
                    key: 'order_no',
                    width: 200,
                },
                {
                    title: this.L('时间'),
                    dataIndex: 'create_time',
                    key: 'create_time',
                    width: 200,
                },
                {
                    title: this.L('店铺'),
                    dataIndex: 'store_name',
                    key: 'store_name',
                },
                {
                    title: this.L('用户姓名'),
                    dataIndex: 'nickname',
                    key: 'nickname',
                },
                {
                    title: this.L('手机号'),
                    dataIndex: 'phone',
                    key: 'phone',
                },
                {
                    title: this.L('业务类型'),
                    dataIndex: 'business_type_text',
                    key: 'business_type_text',
                },
                {
                    title: this.L('收银员'),
                    dataIndex: 'storestaff_name',
                    key: 'storestaff_name',
                },
                {
                    title: this.L('交易金额'),
                    dataIndex: 'money',
                    key: 'money',
                    sorter: (a, b) => a.money - b.money,
                    customRender: (text) => `¥ ${text.toLocaleString()}`,
                },
                {
                    title: this.L('退款状态'),
                    dataIndex: 'refund',
                    key: 'refund',
                    customRender: (text) => `${text==1?'已退款':'未退款'}`,
                },
                {
                    title: this.L('操作'),
                    dataIndex: 'operation',
                    scopedSlots: { customRender: 'operation' },
                    fixed: 'right',
                },
            ],
            columns2: [
                {
                    title: this.L('序号'),
                    dataIndex: 'id',
                    key: 'id',
                    scopedSlots: { customRender: 'id' },
                },
                {
                    title: this.L('订单号'),
                    dataIndex: 'order_no',
                    key: 'order_no',
                    width: 200,
                },
                {
                    title: this.L('时间'),
                    dataIndex: 'create_time',
                    key: 'create_time',
                    width: 200,
                },
                {
                    title: this.L('店铺'),
                    dataIndex: 'store_name',
                    key: 'store_name',
                },
                {
                    title: this.L('卡名称'),
                    dataIndex: 'card_name',
                    key: 'card_name',
                },
                {
                    title: this.L('卡号'),
                    dataIndex: 'card_no',
                    key: 'card_no',
                },
                {
                    title: this.L('用户姓名'),
                    dataIndex: 'nickname',
                    key: 'nickname',
                },
                {
                    title: this.L('手机号'),
                    dataIndex: 'phone',
                    key: 'phone',
                },
                {
                    title: this.L('归属单位'),
                    dataIndex: 'company_owner',
                    key: 'company_owner',
                },
                {
                    title: this.L('业务类型'),
                    dataIndex: 'business_type_text',
                    key: 'business_type_text',
                },
                {
                    title: this.L('支付状态'),
                    dataIndex: 'operation_type',
                    key: 'operation_type',
                    scopedSlots: { customRender: 'operation_type' },
                },
                {
                    title: this.L('交易金额'),
                    dataIndex: 'money',
                    key: 'money',
                    sorter: (a, b) => a.money - b.money,
                    customRender: (text) => `¥ ${text.toLocaleString()}`,
                },
                {
                    title: this.L('描述'),
                    dataIndex: 'describe',
                    key: 'describe',
                    width: 300,
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
            areaOptions: [],
            tabsIndex: 1,
            tabList: [],
            tableLoading: false,
            statistics: {
                total_money: {
                    title: this.L('总交易金额'),
                    money: 0,
                },
            },
        }
    },
    created() {
        this.getAllArea()
        this.getList()
        this.getBusinessType()
    },
    methods: {
        moment,
        getBusinessType() {
            this.request('/common/common.area/getAllArea', {}).then((res) => {
                this.areaOptions = res
            })
        },
        getAllArea() {
            this.request(internalCardMerchantApi.businessType, {}).then((res) => {
                let obj = {
                    '': this.L('全部'),
                }
                this.businessType = Object.assign({}, obj, res)
            })
        },
        getList(isSearch, isExprot) {
            if (isSearch) {
                this.pagination.current = 1
            }
            this.formData.page = this.pagination.current
            this.formData.page_size = this.pagination.pageSize
            let url = internalCardMerchantApi.orderList
            if (this.tabsIndex == 2) {
                url = internalCardMerchantApi.orderPayList
            }
            let params = this.formData
            if (this.tabsIndex == 1) {
                params.operation_type = 0
            }
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
                    this.tableLoading = false
                    this.pagination.total = res.total
                    this.statistics['total_money'].money = res.money_sum || 0
                    let table_total_money = res.data.reduce((accumulator, currentValue) => {
                        return (parseFloat(accumulator) + parseFloat(currentValue.money)).toFixed(2)
                    }, 0)

                    if (this.tabsIndex == 1) {
                        let index = this.columns.findIndex((v) => v.key == 'money')
                        this.columns[index].title = this.L(`交易金额`) + `(￥${table_total_money})`
                    } else if (this.tabsIndex == 2) {
                        let index = this.columns2.findIndex((v) => v.key == 'money')
                        this.columns2[index].title = this.L(`交易金额`) + `(￥${table_total_money})`
                    }
                })
                .catch((err) => {
                    this.tableLoading = false
                })
        },
        onDateChange(dates, dateStrings) {
            this.formData.start_time = dateStrings[0]
            this.formData.end_time = dateStrings[1]
        },
        onAreaChange(value) {
            this.formData.province_id = value[0] ? value[0] : ''
            this.formData.city_id = value[1] ? value[1] : ''
            this.formData.area_id = value[2] ? value[2] : ''
        },
        //提交
        handleSubmit(e) {
            this.getList(true)
        },
        //导出
        exportClick() {
            this.getList(true, true)
        },
        handleTableChange(e) {
            if (e.current && e.current > 0) {
                this.pagination.current = e.current
                this.pagination.pageSize = e.pageSize
                this.getList()
            }
        },
        paymentDetails(item) {
            this.formData.search_type = 'order_no'
            this.formData.keywords = item.order_no
            this.tabsIndex = 2
            this.tabChange(this.tabsIndex)
        },
        tabChange(e) {
            if (e == 1) {
                this.formData.search_type = 'store_name'
                this.formData.keywords = ''
                this.searchType = [
                    {
                        value: 'store_name',
                        label: this.L('店铺名称'),
                    },
                    {
                        value: 'nickname',
                        label: this.L('用户姓名'),
                    },
                    {
                        value: 'phone',
                        label: this.L('手机号'),
                    },
                    {
                        value: 'order_no',
                        label: this.L('订单号'),
                    },
                ]
            } else {
                this.searchType = [
                    {
                        value: 'store_name',
                        label: this.L('店铺名称'),
                    },
                    {
                        value: 'nickname',
                        label: this.L('用户姓名'),
                    },
                    {
                        value: 'phone',
                        label: this.L('手机号'),
                    },
                    {
                        value: 'order_no',
                        label: this.L('订单号'),
                    },
                    {
                        value: 'card_name',
                        label: this.L('卡号名称'),
                    },
                    {
                        value: 'card_id',
                        label: this.L('卡号'),
                    },
                    {
                        value: 'company_owner',
                        label: this.L('归属单位'),
                    },
                ]
            }
            setTimeout(() => {
                this.getList(true)
            }, 50)
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