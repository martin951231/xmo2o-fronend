<template>
    <div class="ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">

        <a-card :bordered="false">
            <!--搜索栏-->
            <a-form layout="inline">
                <a-row :gutter="24">
                    <a-col>
                        <a-form-item label="业务">
                            <a-select
                                    label-in-value
                                    :default-value="{ key: queryParam.business_type }"
                                    style="width: 120px"
                                    @change="handleBusinessTypeChange"
                            >
                                <a-select-option value="shop">外卖</a-select-option>
                                <a-select-option value="mall">商城</a-select-option>
                                <a-select-option value="group">团购</a-select-option>
                                <a-select-option value="store">优惠买单</a-select-option>
                                <a-select-option value="cash">店内收银</a-select-option>
                                <!--<a-select-option value="foodshop">餐饮</a-select-option>-->
                            </a-select>
                        </a-form-item>
                        <a-form-item label="券类型">
                            <a-select
                                    label-in-value
                                    :default-value="{ key:queryParam.is_discount }"
                                    style="width: 120px"
                                    @change="handleIsDiscountChange"
                            >
                                <a-select-option value="-1">全部</a-select-option>
                                <a-select-option value="1">折扣券</a-select-option>
                                <a-select-option value="0">普通券</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="核销端口">
                            <a-select
                                    label-in-value
                                    :default-value="{ key: queryParam.is_mobile_pay }"
                                    style="width: 120px"
                                    @change="handleIsMobilePayChange"
                            >
                                <a-select-option value="-1">全部</a-select-option>
                                <a-select-option value="1">微信端</a-select-option>
                                <a-select-option value="2">APP</a-select-option>
                                <a-select-option value="3">小程序</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item label="有效时间">
                            <a-range-picker
                                    @change="dateOnChange"
                                    :ranges="{
                                    今日: [moment(), moment()],
                                    昨日: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                                    近七天: [moment().subtract(7, 'days'), moment()],
                                    近30天: [moment().subtract(30, 'days'), moment()],
                                  }"
                                    :allowClear="true"
                                    v-model="search_data"
                                    style
                            >
                                <a-icon slot="suffixIcon" type="calendar" />
                            </a-range-picker>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24" style="margin-top: 15px;margin-bottom: 15px">
                    <a-col>
                        <a-form-item label="关键字">
                            <a-input-group compact>
                                <a-input style="width: 235px" allow-clear v-model="queryParam.keyword" />
                            </a-input-group>

                        </a-form-item>
                        <a-form-item>
                            <a-button type="primary" icon="search" @click="searchBtn()" style="margin-right: 15px">查询</a-button>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>

            <a-table :columns="columns" :data-source="searchHotList" :pagination="pagination" rowKey="order_id" @change="tableChange">
                <template v-for="col in ['sort']" :slot="col" slot-scope="text, record, index">
                    <div :key="col">
                        <template>
                            {{ text }}
                        </template>
                    </div>
                </template>
            </a-table>
            <create-brand-selection-coupon ref="createModal" @ok="handleOk" />
        </a-card>
    </div>

</template>

<style type="text/css">
    .icon_btn {
        margin-right: 1rem;
        border-color: #1890ff;
        color: #1890ff;
    }
    .del_center{
        top:35%
    }
</style>

<script>
    import moment from 'moment'
    import couponPlatformApi from '@/api/coupon/platform';
    import CreateBrandSelectionCoupon from '../modules/CreateBrandSelectionCoupon.vue'
    const hotMap = {
        0: {
            status: 'default',
            text: '否'
        },
        1: {
            status: 'error',
            text: '是'
        }
    }
    const searchHotList = [];
    export default {
        name: 'SearchHotList',
        components: {
            CreateBrandSelectionCoupon
        },
        data() {
            this.cacheData = searchHotList.map(item => ({ ...item }));
            return {
                search_data: [],
                couponMainBrandAlias:'',
                sortedInfo: null,
                searchHotList,
                queryParam:{
                    page:1,
                    pageSize:10,
                    business_type:'shop',
                    is_discount:'-1',
                    is_mobile_pay:'-1',
                    keyword:'',
                },
                pagination: {
                    pageSize: 10,
                    total: 10,
                    'show-total': total => `共 ${total} 条记录`,
                    'show-size-changer':true,
                    'show-quick-jumper':true
                },
                editingKey: '',
                selectedRowKeys: [],  //选中的行
            }
        },
        filters: {
            statusFilter (type) {
                return hotMap[type].text
            },
            statusTypeFilter (type) {
                return hotMap[type].status
            }
        },
        created() {},
        computed: {
            columns() {
                let {
                    sortedInfo,
                    filteredInfo
                } = this;
                sortedInfo = sortedInfo || {};
                filteredInfo = filteredInfo || {};
                const columns = [
                    {
                        title: '时间',
                        dataIndex: 'use_date',
                    },
                    {
                        title: '优惠券ID',
                        dataIndex: 'coupon_id',
                    },
                    {
                        title: '券名',
                        dataIndex: 'name',
                    },
                    {
                        title: '核销端口',
                        dataIndex: 'mobile_pay_str',
                    },
                    {
                        title: '店铺',
                        dataIndex: 'store_name',
                    },
                    {
                        title: '用户昵称',
                        dataIndex: 'nickname',
                    }
                ];
                return columns;
            },
        },
        mounted() {
            this.getSearchHotList();
        },
        methods: {
            moment,
            // 日期切换，重新赋值
            dateOnChange(date, dateString) {
                this.queryParam.start_time = dateString[0]
                this.queryParam.end_time = dateString[1]
                console.log('search_data', this.queryParam)
            },
            handleIsMobilePayChange(value) {
                this.queryParam.is_mobile_pay = value.key;
            },
            handleBusinessTypeChange(value) {
                this.queryParam.business_type = value.key;
            },
            handleIsDiscountChange(value) {
                this.queryParam.is_discount = value.key;
            },
            onSelectChange(selectedRowKeys) {
                console.log(selectedRowKeys)
                this.selectedRowKeys = selectedRowKeys;
            },
            getSearchHotList() {
                this.request(couponPlatformApi.sysCouponUseRecords,this.queryParam)
                    .then((res) => {
                        console.log('res', res)
                        this.searchHotList = res.list
                        this.pagination.total = res.total
                    })
            },

            searchBtn() {
                this.page = 1
                this.pagination.current = this.page
                this.queryParam.page = 1;
                this.getSearchHotList()
            },
            handleOk() {
                this.getSearchHotList()
            },
            // 表格中变动  这里只针对页面页数切换
            tableChange(e, filters, sorter) {
                // this.filteredInfo = filters;
                // this.sortedInfo = sorter;

                this.queryParam['pageSize'] = e.pageSize;
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current;
                    this.getSearchHotList()
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    .table-operator {
        margin-bottom: 24px;
    }
</style>
