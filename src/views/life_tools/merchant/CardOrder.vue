<template>
    <div style="margin-top: 20px;padding:20px;background-color: #fff;">
        <a-form-model layout="inline" :model="searchForm">
            <a-form-model-item label="搜索">
                <a-select
                    v-model="searchForm.search_type"
                    style="width:100px;"
                >
                    <a-select-option :value="1">订单号</a-select-option>
                    <a-select-option :value="2">用户昵称</a-select-option>
                    <a-select-option :value="3">手机号</a-select-option>
                    <a-select-option :value="4">次卡名称</a-select-option>
                    <a-select-option :value="5">景区名称</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="">
                <a-input v-model="searchForm.keyword" placeholder="关键词"></a-input>
            </a-form-model-item>

            <a-form-model-item label="次卡类型">
               
                <a-select
                    v-model="searchForm.type"
                    style="width:100px;"
                >
                    <a-select-option value="all">全部</a-select-option>
                    <a-select-option value="sports">体育次卡</a-select-option>
                    <a-select-option value="scenic">景区次卡</a-select-option>
                </a-select>

            </a-form-model-item>

            <a-form-model-item label="日期">
                <a-select
                    v-model="searchForm.time_type"
                    style="width:100px;"
                >
                    <a-select-option :value="1">下单时间</a-select-option>
                    <a-select-option :value="2">过期时间</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="">
                <a-range-picker
                    :ranges="{
            过去30天: [moment().subtract(30, 'days'), moment()],
            过去15天: [moment().subtract(15, 'days'), moment()],
            过去7天: [moment().subtract(7, 'days'), moment()],
            今日: [moment(), moment()],
          }"
                    :value="searchForm.time"
                    format="YYYY-MM-DD"
                    @change="onDateRangeChange"
                />
            </a-form-model-item>
            <a-form-model-item label="订单状态">
                <a-select
                    v-model="searchForm.status"
                    style="width:120px;"
                >
                    <a-select-option :value="-1">全部</a-select-option>
                    <a-select-option :value="10">未支付</a-select-option>
                    <a-select-option :value="20">已支付</a-select-option>
                    <a-select-option :value="30">已核销</a-select-option>
                    <a-select-option :value="40">已完成</a-select-option>
                    <a-select-option :value="50">售后中</a-select-option>
                    <a-select-option :value="51">已退款</a-select-option>
                    <a-select-option :value="60">已取消</a-select-option>
                    <a-select-option :value="70">已过期</a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" @click="submitForm(true)" class="ml-20">搜索</a-button>
                <a-button @click="resetForm()" class="ml-20">重置</a-button>
                <a-popconfirm
                    v-if="this.selectedRows.length > 0"
                    title="确认同意退款吗?"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="agreeAll()"
                >
                    <a-button class="ml-20" type="primary">同意退款
                    </a-button>
                </a-popconfirm>
                <a-button class="ml-20" v-if="this.selectedRows.length > 0" @click="refuseAll()">
                    拒绝退款
                </a-button>
            </a-form-model-item>
        </a-form-model><br>
        <a-table :row-selection="rowSelection" rowKey="order_id" :columns="columns" :data-source="datalist" :pagination="pagination" bordered>
        <span slot="numTitle">
        数量
        <a-tooltip trigger="hover">
          <template slot="title">订单总数量：{{ all_num }}</template>
          <a-icon class="ml-10" type="question-circle" />
        </a-tooltip>
      </span>
            <span slot="priceTitle">
        总价
        <a-tooltip trigger="hover">
          <template slot="title">订单总金额：{{ all_price }}</template>
          <a-icon class="ml-10" type="question-circle" />
        </a-tooltip>
      </span>
            <span slot="tools_title" slot-scope="text, record" v-if="record.tools_sub_title != ''">
            <a-tooltip trigger="hover">
              <template slot="title">{{ text }}</template>
                {{ record.tools_sub_title }}
            </a-tooltip>
        </span>
            <span slot="tools_title" slot-scope="text, record" v-else>
            {{ text }}
        </span>
            <span slot="action" slot-scope="text, record">
         <a @click="() => handleDetail(record.order_id)">详情</a>
        <a style="margin-left: 10px;"></a>
        <router-link :to="{ path: '/merchant/merchant.life_tools/cardRecord?order_id=' + record.order_id}">核销记录</router-link>
      </span>
        </a-table>
        <!-- 详情 -->
        <cardOrderDetail
            v-if="currentBtn.props === 'orderDetail'"
            :visible="detailVisible"
            :title="currentBtn.title"
            @getDataList="getDataList"
            @handleCancel="detailVisible = false"
            :formData="currentBtn.data"
        ></cardOrderDetail>
        <!-- 拒绝退款 -->
        <a-modal
            :visible="refusevisible"
            :title="refusetitle"
            width="20%"
            @cancel="refuseCancel"
            @ok="refuseOk"
        >
            <a-input v-model="refusereason" type="textarea" />
        </a-modal>
    </div>
</template>
<script>

import lifeToolsMerchantApi from "@/api/life_tools/merchant";
import cardOrderDetail from '@/views/life_tools/merchant/modules/cardOrderDetail'
import moment from 'moment'

const columns = [
    {
        title: '订单号',
        dataIndex: 'orderid',
        key: 'orderid',
    },
    {
        title: '次卡类型',
        dataIndex: 'type_txt',
        key: 'type_txt',
    },
    {
        title: '次卡名称',
        dataIndex: 'card_title',
        key: 'card_title',
    },

    {
        title: '用户昵称',
        dataIndex: 'nickname',
        key: 'nickname',
    },
    {
        title: '用户手机号',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        dataIndex: 'total_price',
        slots: { title: 'priceTitle' },
        key: 'total_price',
    },
    {
        title: '订单状态',
        dataIndex: 'order_status_val',
        key: 'order_status_val',
    },
	{
        title: '总次数',
        dataIndex: 'total_num',
        key: 'total_num',
    },
    {
        title: '已使用',
        dataIndex: 'use_num',
        key: 'use_num',
    },
    {
        title: '首次使用日期',
        dataIndex: 'first_time_text',
        key: 'first_time_text',
    },
    {
        title: '过期时间',
        dataIndex: 'out_time',
        key: 'out_time',
    },
    {
        title: '下单时间',
        dataIndex: 'add_time',
        key: 'add_time',
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
    },
];
const ids = []
export default {
    components: {cardOrderDetail},
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            datalist: [],
            columns,
            detailVisible: false, //详情
            currentBtn: {}, // 当前点击的操作按钮
            all_num: 0,
            all_price: 0,
            //搜索框表单
            searchForm: {
                search_type: 1,
                time_type: 1,
                keyword: '',
                type: 'all',
                status: -1,
                time: [],
                begin_time: '', // 开始时间
                end_time: '', // 结束时间
            },
            selectedRowKeys: [],
            selectedRows: [],
            refusetitle: '请填写拒绝退款原因',
            refusevisible: false,
            refusereason: '',
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
        };
    },
    created() {
        this.getDataList(false)
    },
    methods: {
        moment,
        // 获取table数据
        getDataList(is_search) {
            let params = {...this.searchForm}
            if (is_search === true) {
                params.page = 1
                this.$set(this.pagination, 'current', 1)
            } else {
                params.page = this.pagination.current
                this.$set(this.pagination, 'current', this.pagination.current)
            }
            params.pageSize = this.pagination.pageSize
            this.request(lifeToolsMerchantApi.getCardOrderList, params).then((res) => {
                this.datalist  = res.data
                this.all_num   = res.all_num
                this.all_price = res.all_price
                this.$set(this.pagination, 'total', res.total)
            })
        },
        // 提交搜索表单
        submitForm(is_search = false) {
            this.getDataList(is_search)
        },
        // 重置表单
        resetForm() {
            this.$set(this, 'searchForm', {
                search_type: 1,
                time_type: 1,
                keyword: '',
                type: 'all',
                status: -1,
                time: [],
                begin_time: '', // 开始时间
                end_time: '', // 结束时间
            })
            this.$set(this.pagination, 'current', 1)
            this.getDataList()
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.submitForm()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.submitForm()
        },
        handleDetail(order_id) {
            this.request(lifeToolsMerchantApi.getCardOrderDetail, {order_id: order_id}, 'GET').then((res) => {
                this.currentBtn = {
                    'props': 'orderDetail',
                    'title': '订单详情',
                    'data': res
                }
                this.detailVisible = true
            })
        },
        // 监听日期选择变化
        onDateRangeChange(date, dateString) {
            // 更新搜索框表单数据
            this.$set(this.searchForm, 'time', [date[0], date[1]])
            this.$set(this.searchForm, 'begin_time', dateString[0])
            this.$set(this.searchForm, 'end_time', dateString[1])
        },
        agreeAll() {
            for (var i = 0; i < this.selectedRows.length; i++) {
                ids.push(this.selectedRows[i]['order_id']);
            }
            this.request(lifeToolsMerchantApi.agreeCardOrderRefund, {order_ids: ids}).then((res) => {
                this.$message.success('操作成功')
                this.selectedRowKeys = []
                this.selectedRows = []
                this.getDataList()
            })
        },
        refuseCancel() {
            this.refusevisible = false
        },
        refuseAll() {
            this.refusevisible = true
        },
        refuseOk() {
            let reason = this.refusereason
            if (reason == '') {
                this.$message.error('请填写拒绝原因！')
                return
            }
            for (var i = 0; i < this.selectedRows.length; i++) {
                ids.push(this.selectedRows[i]['order_id']);
            }
            this.request(lifeToolsMerchantApi.refuseCardOrderRefund, {order_ids: ids, reason: reason}).then((res) => {
                this.$message.success('操作成功')
                this.refusevisible = false
                this.selectedRowKeys = []
                this.selectedRows = []
                this.getDataList()
            })
        },
    },
    computed: {
        rowSelection() {
            return {
                onChange: (selectedRowKeys, selectedRows) => {
                    this.selectedRowKeys = selectedRowKeys;
                    this.selectedRows = selectedRows;
                },
                getCheckboxProps: record => ({
                    props: {
                        disabled: record.status != 50,
                    },
                }),
            };
        },
    },
};
</script>