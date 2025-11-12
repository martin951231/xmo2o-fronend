<template>
    <!-- 团购订单列表 -->
    <div class="ant-pro-page-header-wrap-children-content" style="margin: 24px 0 0">
        <template>
            <div class="mb-10">
                <a-form layout="inline">
                    <div class="flex search-content">
                        <div class="right flex">
                            <div>
                                <a-form-item label="核销人">
                                    <a-input v-model="queryParam.staff_name" style="width: 100px" />
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item label="店铺">
                                    <a-input v-model="queryParam.store_name" style="width: 100px" />
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item label="核销时间">
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
                                <a-form-item label="核销方式">
                                    <a-select
                                        v-model="queryParam.verify_type"
                                        style="width: 102px"
                                        @change="handleChange"
                                        placeholder="核销方式"
                                    >
                                        <a-select-option value="0"> 全部 </a-select-option>
                                        <a-select-option value="1"> 移动端核销 </a-select-option>
                                        <a-select-option value="2"> pc端核销 </a-select-option>
                                        <a-select-option value="99"> 未知的核销 </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item label="">
                                    <a-select
                                        v-model="queryParam.status"
                                        style="width: 102px"
                                        @change="handleChange"
                                        placeholder="状态"
                                    >
                                        <a-select-option value="0"> 全部状态 </a-select-option>
                                        <a-select-option value="1"> 待核销 </a-select-option>
                                        <a-select-option value="2"> 已核销 </a-select-option>
                                        <a-select-option value="3"> 已过期 </a-select-option>
                                        <a-select-option value="4"> 已退款 </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item>
                                    <a-select
                                        v-model="queryParam.select_type"
                                        style="width: 120px"
                                        @change="handleChange"
                                        placeholder="综合搜索"
                                    >
                                        <a-select-option value="group_pass"> 卡券序列号 </a-select-option>
                                        <a-select-option value="phone"> 手机号 </a-select-option>
                                        <a-select-option value="nickname"> 用户呢称 </a-select-option>
                                        <a-select-option value="real_orderid"> 卡券订单号 </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                            <div>
                                <a-form-item>
                                    <a-input v-model="queryParam.keyword" style="width: 100px" />
                                </a-form-item>
                            </div>
                            <div>
                                <a-button @click="resetForm()" class="ml-10 mr-10"> 重置</a-button>
                            </div>
                            <div>
                                <a-button type="primary" icon="search" @click="searchBtn()" style="margin-right: 15px">
                                    查询
                                </a-button>
                            </div>
                            <div>
                                <a-button
                                    icon="download"
                                    @click="exportOrder"
                                    style="margin-right: 15px"
                                    >导出订单
                                </a-button>
                            </div>
                        </div>
                    </div>
                </a-form>
            </div>
        </template>
        <a-card :bordered="false">
            <div class="message-suggestions-list-box">
                <a-table
                    :columns="columns"
                    :data-source="data"
                    class="components-table-demo-nested"
                    :pagination="pagination"
                    @change="tableChange"
                    rowKey="id"
                    :loading="loading"
                >
                    <span slot="status" slot-scope="text, record">
                        <div :style="'color:'+record.status_color">{{ record.status }}</div>
                    </span>
                    <span slot="sale_set" slot-scope="text, record">
                        <div>数量：{{ record.num }}</div>
                        <div>总价：{{ record.total_money }}</div>
                    </span>
                    <span slot="is_group_combine" slot-scope="text, record">
                        <div v-if="record.is_group_combine == 1">优惠组合</div>
                        <div v-if="record.is_group_combine == 0">
                            <div v-if="record.tuan_type == 0">团购券</div>
                            <div v-if="record.tuan_type == 1">代金券</div>
                            <div v-if="record.tuan_type == 2">实物</div>
                        </div>
                    </span>
                    <span slot="sale_count" slot-scope="text, record">
                        <div>用户ID：{{ record.uid }}</div>
                        <div>用户名：{{ record.user_name }}</div>
                        <div>订单手机号：{{ record.user_phone }}</div>
                    </span>
<!--                    <span slot="action" slot-scope="text, record">-->
<!--                        <a @click="selectStore(record.order_id,record.id)" class="ant-btn-link pointer" v-if="record.can_verify">核销</a>-->
<!--                    </span>-->
                </a-table>
            </div>
            <order-detail v-if="CouponDetailVisible" @notShowDetail="notShowDetail" :order_id="order_id" :group_pass_id="group_pass_id" />
            <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="queryParam" />
        </a-card>
    </div>
</template>

<script>
import moment from 'moment'
import groupMerchantApi from '@/api/group/merchant'
import OrderDetail from './CouponDetail.vue'
import ExportAdd from '@/views/common/export/ExportAdd.vue'

const data = []

export default {
    name: 'OrderList',
    components: {
        OrderDetail,
        ExportAdd,
    },
    data() {
        this.cacheData = data.map((item) => ({ ...item }))
        return {
            order_id: 0,
            group_pass_id: 0,
            form: this.$form.createForm(this),
            mdl: {},
            CouponDetailVisible: false,
            loading: true,
            id: 1,
            search_data: [],
            exportUrl: groupMerchantApi.orderExportUrl,
            // 查询参数
            queryParam: {
                verify_type: '0',
                select_type: 'group_pass',
                status: '0'
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
                    title: '券名称',
                    dataIndex: 'name',
                },
                {
                    title: '券序列码',
                    dataIndex: 'group_pass',
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    scopedSlots: {
                        customRender: 'status',
                    },
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
                    title: '券类型',
                    dataIndex: 'coupon_type',
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
                    title: '核销时间',
                    dataIndex: 'verify_time',
                },
                {
                    title: '核销方式',
                    dataIndex: 'verify_type',
                },
                {
                    title: '核销人',
                    dataIndex: 'staff_name',
                },
                // {
                //     title: '操作',
                //     dataIndex: 'action',
                //     scopedSlots: {
                //         customRender: 'action',
                //     },
                // },
            ],
            data,
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
            this.page = 1
            this.pagination.current = this.page
            this.getGoodsList()
        },
        // 标签
        getClick(cat_id, title) {
            this.$refs.specialModel.getGoodsOrderList(cat_id)
        },
        // 监听日期选择变化
        onDateRangeChange(date, dateString) {
            // 更新搜索框表单数据
            this.$set(this.queryParam, 'time', [date[0], date[1]])
            this.$set(this.queryParam, 'begin_time', dateString[0])
            this.$set(this.queryParam, 'end_time', dateString[1])
        },
        // 获取列表信息
        initList() {
            this.getGoodsList()
        },
        // 获取列表信息
        getGoodsList() {
            this.queryParam['page'] = this.page
            this.loading = true
            if (groupMerchantApi.getGoodsCouponList) {
                this.request(groupMerchantApi.getGoodsCouponList, this.queryParam).then((res) => {
                    this.loading = false
                    this.data = res.list
                    this.pagination.total = res.total
                })
            }
        },
        addGoods() {
            this.$refs.selectGoupCate.open()
        },
        handleChange() {},
        // 表格中变动  这里只针对页面页数切换
        tableChange(e) {
            this.queryParam['pageSize'] = e.pageSize
            if (e.current && e.current > 0) {
                this.pagination.current = e.current
                this.page = e.current
                this.getGoodsList()
            }
        },
        //导出订单
        exportOrder() {
            if(this.data.length){
                this.request(groupMerchantApi.exportGoodsCouponList, this.queryParam).then((data) => {
                    // 弹层提示
                    this.$message.loading({ content: '加载中,请耐心等待,数量越多时间越长。', key:'updatable', duration: 0 })
                    // console.log('添加导出计划任务成功')
                    // this.file_url = exportApi.downloadExportFile + '?id=' + date.export_id
                    // this.file_date = date
                    let url = data.file_url
                    if (url) {
                        window.open(url)
                    }
                    this.$message.success({ content: '下载成功!', key:'updatable', duration: 2 })
                })
            }else{
                this.$message.warn('当前没有可以导出的内容')
            }
        },
        // 重置表单
        resetForm() {
            this.$set(this, 'queryParam', { verify_type: '0', select_type: 'group_pass', status: '0' })
            this.$set(this.pagination, 'current', 1)
            this.getDataList({ store_id: this.store_id })
        },
        // 点击设置推荐店铺
        selectStore(order_id,group_pass_id) {
            this.CouponDetailVisible = true
            this.order_id = order_id
            this.group_pass_id = group_pass_id
        },
        // 选择店铺后的回调
        onStoreSelect(info) {
            this.selectStoreVisible = false
            const { storeName, storeIds } = info
            console.log(storeIds, 'storeIds')
        },

        //保存备注
        notShowDetail() {
            this.CouponDetailVisible = false
            this.getGoodsList()
        },
    },
}
</script>

<style scoped>
.detail-content >>> .ant-drawer-body {
    padding: 0;
}

.ant-table td {
    white-space: nowrap;
}

.goods-title {
    font-size: 20px;
    margin-right: 10px;
}

.search-content {
    justify-content: space-between;
    align-items: center;
}

.search-content .right {
    align-items: center;
}
</style>
