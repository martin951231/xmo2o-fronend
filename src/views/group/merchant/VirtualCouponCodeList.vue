<template>
    <!-- 团购订单列表 -->
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <div class="mb-10">
            <a-form layout="inline">
                <div class="flex search-content">
                    <div class="right flex">
                        <div>
                            <a-form-item label="支付时间">
                                <a-range-picker
                                    :ranges="{
                                            过去30天: [moment().subtract(30, 'days'), moment()],
                                            过去15天: [moment().subtract(15, 'days'), moment()],
                                            过去7天: [moment().subtract(7, 'days'), moment()],
                                            今日: [moment(), moment()],
                                        }"
                                    v-model="queryParam.time"
                                    format="YYYY-MM-DD"
                                    style="width: 260px"
                                    @change="onDateRangeChange"
                                />
                            </a-form-item>
                        </div>
                        <div>
                            <a-form-item label="状态">
                                <a-select v-model="queryParam.status" style="width: 120px">
                                    <a-select-option :value="item.key" v-for="item in status_arr" :key="item.key">{{item.label}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                        <div>
                            <a-form-item>
                                <a-select v-model="queryParam.search_type" style="width: 102px">
                                    <a-select-option :value="item.key" v-for="item in search_type_arr" :key="item.key">{{item.label}}</a-select-option>
                                </a-select>
                                <a-input v-model="queryParam.keywords" style="width: 200px" placeholder="请输入关键字" />
                            </a-form-item>
                        </div>
                        <div>
                            <a-button @click="resetForm()" class="ml-10 mr-10">重置</a-button>
                        </div>
                        <div>
                            <a-button type="primary" icon="search" @click="searchBtn()" style="margin-right: 15px">查询</a-button>
                        </div>
                        <div>
                            <a-button icon="download" @click="getGoodsList(1)" style="margin-right: 15px">导出订单</a-button>
                        </div>
                    </div>
                </div>
            </a-form>
        </div>
        <a-card :bordered="false">
            <div class="message-suggestions-list-box">
                <a-table :columns="columns" :data-source="data" class="components-table-demo-nested" :pagination="pagination" @change="tableChange" rowKey="id" :loading="loading"></a-table>
            </div>
        </a-card>
    </div>
</template>

<script>
import moment from 'moment'
import groupMerchantApi from '@/api/group/merchant'
const data = []
export default {
    name: 'OrderList',
    data() {
        return {
            form: this.$form.createForm(this),
            loading: true,
            exportUrl: groupMerchantApi.orderExportUrl,
            // 查询参数
            queryParam: {
                search_type: '',
                status: '-1',
                keywords: '',
                start_date: '',
                end_date: '',
                page: 1,
                pageSize: 10,
            },
            pagination: {
                current: 1,
                pageSize: 10,
                total: 10,
                'show-total': (total) => `共 ${total} 条记录`,
                'show-size-changer': true,
                'show-quick-jumper': true,
            },
            // 表头
            columns: [
                {
                    title: '团购名称',
                    dataIndex: 'goods_name',
                },
                {
                    title: '券序列码',
                    dataIndex: 'code',
                },
                {
                    title: '状态',
                    dataIndex: 'status_txt',
                },
                {
                    title: '店铺名称',
                    dataIndex: 'store_name',
                },
                {
                    title: '卡券订单号',
                    dataIndex: 'real_orderid',
                },
                {
                    title: '用户昵称',
                    dataIndex: 'nickname',
                },
                {
                    title: '手机号',
                    dataIndex: 'phone',
                },
                {
                    title: '支付时间',
                    dataIndex: 'pay_time',
                },
            ],
            data,
            search_type_arr: [],
            status_arr: [],
        }
    },

    watch: {
        $route() {
            this.initList()
        },
    },
    mounted() {
        this.initList()
    },
    methods: {
        moment,
        // 点击查询按钮
        searchBtn() {
            this.pagination.current = 1
            this.getGoodsList()
        },
        // 监听日期选择变化
        onDateRangeChange(date, dateString) {
            // 更新搜索框表单数据
            this.$set(this.queryParam, 'time', [date[0], date[1]])
            this.$set(this.queryParam, 'start_date', dateString[0])
            this.$set(this.queryParam, 'end_date', dateString[1])
        },
        // 获取列表信息
        initList() {
            this.getGoodsList()
        },
        // 获取列表信息
        getGoodsList(is_export = 0) {
            this.queryParam.page = this.pagination.current
            this.queryParam.pageSize = this.pagination.pageSize
            this.loading = true
            this.request(groupMerchantApi.getGroupRedemptionCodeList, { is_export, ...this.queryParam })
                .then((res) => {
                    this.loading = false
                    if (is_export == 1) {
                        window.open(res.file_url)
                        return
                    }
                    this.data = res.data
                    this.pagination.total = res.total

                    this.search_type_arr = res.search_type
                    this.status_arr = res.status_arr

                    if (!this.queryParam.search_type && this.search_type_arr.length) {
                        this.queryParam.search_type = this.search_type_arr[0].key
                    }
                })
                .catch((err) => {
                    this.loading = false
                })
        },
        // 表格中变动  这里只针对页面页数切换
        tableChange(e) {
            this.queryParam['pageSize'] = e.pageSize
            if (e.current && e.current > 0) {
                this.pagination.current = e.current
                this.getGoodsList()
            }
        },
        // 重置表单
        resetForm() {
            this.$set(this, 'queryParam', {
                search_type: '',
                status: '',
                keywords: '',
                start_date: '',
                end_date: '',
            })
            if (this.search_type_arr.length) {
                this.queryParam.search_type = this.search_type_arr[0].key
            }
            if (this.status_arr.length) {
                this.queryParam.status = this.status_arr[0].key
            }
            this.$set(this.pagination, 'current', 1)
        },
    },
}
</script>

<style scoped>
</style>