<template>
    <div>
        <a-modal width="60%" v-model="visible" :title="L('发送记录')" :footer="null">
            <div class="mb-20">
                <a-form-model layout="inline" @submit.native.prevent :model="queryParams">
                    <a-form-model-item>
                        <a-select style="width: 150px" v-model="queryParams.searchType">
                            <a-select-option value="nickname">{{ L('用户昵称') }}</a-select-option>
                            <a-select-option value="phone">{{ L('用户手机号') }}</a-select-option>
                        </a-select>
                        <a-input style="width: 200px" :placeholder="L('请填写关键词')" v-model="queryParams.keywords" />
                    </a-form-model-item>
                    <a-form-model-item :label="L('发送时间')">
                        <a-select style="width: 200px" mode="multiple" :placeholder="L('请选择日期')"
                            v-model="queryParams.type_day" :options="days" @change="typeDay1Change">
                        </a-select>
                        <!-- <a-button @click="selectAll" style="margin-left: 10px">{{
                            L(isSelectAll
                                ? '取消全选'
                                : '全选') }}</a-button> -->
                    </a-form-model-item>
                    <a-form-model-item :label="L('状态')">
                        <a-select style="width: 200px" :placeholder="L('请选择状态')"
                            v-model="queryParams.status">
                                <a-select-option :value="-1">{{ L('全部') }}</a-select-option>
                                <a-select-option :value="0">{{ L('未发放') }}</a-select-option>
                                <a-select-option :value="1">{{ L('已发放') }}</a-select-option>
                                <a-select-option :value="2">{{ L('发放失败') }}</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item>
                        <a-button type="primary" @click="onSearch" icon="search">{{ L('搜索') }}</a-button>
                    </a-form-model-item>
                    <a-form-model-item>
                        <a-button @click="resetClick">{{ L('重置') }}</a-button>
                    </a-form-model-item>
                </a-form-model>
            </div>
            <div style=" padding: 10px 20px;background: #fafafa">
                <a-row :gutter="16">
                    <a-col :span="6" v-for="item in statistic" :key="item.title">
                        <a-statistic :title="item.title" :value="item.count" ></a-statistic>
                    </a-col>
                </a-row>
            </div>
            <a-table :columns="columns" rowKey="id" :data-source="list" :pagination="pagination"
                :loading="tableLoading">
            </a-table>
        </a-modal>
    </div>
</template>

<script>
import couponMerchantApi from '@/api/coupon/merchant'
import moment from 'moment'
import { Statistic } from 'ant-design-vue';
export default {
    components: {
        AStatistic: Statistic,
    },
    data() {
        return {
            visible: false,
            days: [],
            queryParams: {},
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => this.L(`共 X1 条数据`, { X1: total }),
            },
            columns: [
                {
                    title: this.L('用户昵称'),
                    dataIndex: 'nickname',
                },
                {
                    title: this.L('用户手机号'),
                    dataIndex: 'phone',
                },
                {
                    title: this.L('优惠券名称'),
                    dataIndex: 'coupon_name',
                },
                {
                    title: this.L('优惠券数量'),
                    dataIndex: 'coupon_count',
                },
                {
                    title: this.L('发送时间'),
                    dataIndex: 'create_time',
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status_text',
                },
                {
                    title: this.L('失败原因'),
                    dataIndex: 'fail_reason',
                },
            ],
            list: [],
            tableLoading: false,
            record: {},
            isSelectAll: false,
            statistic: [], //统计数据
        }
    },
    methods: {
        open(record, days = []) {
            if (record.type == 2) {
                this.days = days.map((v, i) => {
                    return {
                        label: v,
                        value: i + 1
                    }
                });
            } else {
                this.days = days
            }
            this.record = record;
            this.visible = true;
            this.resetClick()
            this.onSearch()
        },
        onSearch() {
            this.pagination.current = 1
            this.getList()
        },
        getList() {
            this.tableLoading = true
            this.queryParams.page = this.pagination.current
            this.queryParams.pageSize = this.pagination.pageSize
            if (this.queryParams.searchType) {
                this.queryParams[this.queryParams.searchType] = this.queryParams.keywords
            }
            let params = {
                ...this.queryParams,
                plan_id: this.record.id,
            }
            this.request(couponMerchantApi.couponSendRecord, params)
                .then((res) => {
                    this.tableLoading = false
                    this.list = res.data
                    this.pagination.total = res.total

                    if(params.page == 1) {
                        this.statistic = res.statistic || []
                    }
                })
                .catch((err) => {
                    this.tableLoading = false
                })
        },
        resetClick() {
            this.queryParams = {
                page: 1,
                pageSize: 10,
                type_day: undefined,
                keywords: '',
                searchType: 'nickname',
                status:-1
            }
            this.isSelectAll = true
            this.selectAll()
        },
        selectAll() {
            this.isSelectAll = !this.isSelectAll
            this.queryParams.type_day = !this.isSelectAll ? [] : this.days.map(v => v.value)
        },
        typeDay1Change(e) {
            if (e.length == 0) {
                this.isSelectAll = false
            }
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getList()
        },
    }
}
</script>

<style lang="less" scoped></style>