<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-row type="flex" align="middle" style="line-height: 3;">
            <span>{{L('栏目')}}：</span>
            <a-select style="width: 90px" v-model="formData.type">
                <a-select-option :value="item.value" v-for="item in searchTypeList1" :key="item.value">{{item.label}}</a-select-option>
            </a-select>
            <div class="mr-10"></div>
            <a-select style="width: 130px" v-model="formData.searchtype">
                <a-select-option :value="item.value" v-for="item in searchTypeList2" :key="item.value">{{item.label}}</a-select-option>
            </a-select>
            <div class="mr-10"></div>
            <a-input class="mr-10" v-model="formData.keyword" :placeholder="L('请输入关键词')" style="width: 200px" @search="onSearch" />
            <span>{{L('下单日期')}}：</span>
            <a-range-picker @change="rangePickerOnChange" />
            <div class="mr-10"></div>
            <a-select style="width: 100px" v-model="formData.status">
                <a-select-option :value="item.value" v-for="item in searchTypeList3" :key="item.value">{{item.label}}</a-select-option>
            </a-select>
            <div class="mr-10"></div>
            <a-button class="mr-10" type="primary" @click="onSearch">{{L('查询')}}</a-button>
        </a-row>
        <div class="card">
            <span class="mr-20">{{L('订单总数')}}：{{total_order_nums + L('单')}}</span>
            <!-- <span class="mr-20">{{L('营收总额')}}：{{0}}</span> -->
            <span class="mr-20">{{L('佣金总额')}}：{{total_author_money}}</span>
        </div>
        <div class="mt-10">
            <a-table :columns="columns" :data-source="goodList" :pagination="pagination" rowKey="id">
                <span slot="type" slot-scope="text, record">
                    <span v-if="!record.type || record.type == 'liveshow'">{{L('直播')}}</span>
                    <span v-else-if="record.type == 'livevideo'">{{L('短视频')}}</span>
                </span>
                <span slot="status" slot-scope="text, record">
                    <span v-if="record.status == 1 || record.status == 2">{{L('已消费')}}</span>
                    <span v-else>{{L('未消费')}}</span>
                </span>
            </a-table>
        </div>
    </div>
</template>
<script>
import liveBroadcastMerchantApi from '@/api/live_broadcast/merchant/index.js'
export default {
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            formData: {
                page: 1,
                pageSize: 10,
                keyword: '',
                type: 'liveshow',
                searchtype: 'uid',
                begin_time: '',
                end_time: '',
                status: 0,
            },
            business_type: '', //业务类型 village_group=社区团购，group团购 mall=商城，shop外卖
            columns: [
                {
                    title: this.L('类型'),
                    dataIndex: 'type',
                    key: 'type',
                    scopedSlots: { customRender: 'type' },
                },
                {
                    title: this.L('主播'),
                    dataIndex: 'author',
                    key: 'author',
                },
                {
                    title: this.L('直播ID'),
                    key: 'live_id',
                    dataIndex: 'live_id',
                },
                {
                    title: this.L('订单号'),
                    key: 'order_id',
                    dataIndex: 'order_id',
                },
                {
                    title: this.L('下单时间'),
                    key: 'create_time',
                    dataIndex: 'create_time',
                },
                {
                    title: this.L('订单总金额'),
                    key: 'total_price',
                    dataIndex: 'total_price',
                },
                {
                    title: this.L('消费状态'),
                    key: 'status',
                    dataIndex: 'status',
                    scopedSlots: { customRender: 'status' },
                },
                // {
                //     title: this.L('营收'),
                //     key: 'live_merchant_money',
                // },
                {
                    title: this.L('佣金'),
                    key: 'live_author_money',
                    dataIndex: 'live_author_money',
                },
            ],
            goodList: [],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            searchTypeList2: [
                {
                    label: this.L('主播/作者UID'),
                    value: 'uid',
                },
                {
                    label: this.L('直播房间号'),
                    value: 'liveno',
                },
                {
                    label: this.L('订单编号'),
                    value: 'real_orderid',
                },
                {
                    label: this.L('订单流水号'),
                    value: 'orderid',
                },
                {
                    label: this.L('下单人ID'),
                    value: 'customer_id',
                },
            ],
            searchTypeList1: [
                {
                    label: this.L('直播'),
                    value: 'liveshow',
                },
                {
                    label: this.L('短视频'),
                    value: 'livevideo',
                },
            ],
            searchTypeList3: [
                {
                    label: this.L('全部状态'),
                    value: 0,
                },
                {
                    label: this.L('已消费'),
                    value: 1,
                },
                {
                    label: this.L('未消费'),
                    value: 2,
                },
            ],
            total_author_money: '',
            total_order_nums: '',
        }
    },
    created() {
        if (this.$route.path.indexOf('business_type') != -1) {
            this.business_type = this.$route.path.slice(this.$route.path.indexOf('=') + 1)
        }
        this.onSearch();
    },

    methods: {
        onSearch() {
            this.pagination.current = 1
            this.getGoodList()
        },
        getGoodList() {
            this.formData.page = this.pagination.current
            this.formData.pageSize = this.pagination.pageSize
            this.formData.goods_type = this.business_type
            this.request(liveBroadcastMerchantApi.liveShowOrder, this.formData).then((res) => {
                this.goodList = res.order_list.data
                this.total_author_money = res.total_author_money
                this.total_order_nums = res.total_order_nums
                this.$set(this.pagination, 'total', res.order_list.total)
            })
        },
        //日期选择器
        rangePickerOnChange(date, dateString) {
            console.log(date, dateString)
            this.formData.begin_time = dateString[0]
            this.formData.end_time = dateString[1]
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getGoodList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getGoodList()
        },
    },
}
</script>
<style lang="less" scoped>
.card {
    background-color: #d9edf7;
    border-color: #bce8f1;
    border-radius: 4px;
    padding: 20px;
    margin: 20px 0;
    span {
        color: #31708f;
        font-weight: 700;
    }
}
</style>