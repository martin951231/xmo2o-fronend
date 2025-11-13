<template>
    <div class="verifiyList">
        <div class="main-box-content-mini">
            <a-form-model layout="inline" @submit.native.prevent ref="ruleForm" :model="queryParams">
                <a-form-model-item :label="L('优惠券名称')">
                    <a-input style="width: 200px" :placeholder="L('请输入')" v-model="searchVal" />
                </a-form-model-item>
                <a-form-model-item :label="L('类型')">
                    <a-select v-model="queryParams.type" style="width: 120px">
                        <a-select-option value>{{L('全部')}}</a-select-option>
                        <a-select-option value="system">{{L('平台券')}}</a-select-option>
                        <a-select-option value="mer">{{L('商家券')}}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item :label="L('核销时间')" prop="order_time">
                    <a-range-picker @change="onPickerChange" v-model="queryParams.order_time" />
                </a-form-model-item>
                <a-form-model-item>
                    <a-button type="primary" @click="onSearch">{{ L('搜索') }}</a-button>
                </a-form-model-item>
                <a-form-model-item>
                    <a-button @click="resetForm">{{ L('重置') }}</a-button>
                </a-form-model-item>
                <a-form-model-item>
                    <a-button type="primary" @click="exportOrder">{{ L('导出') }}</a-button>
                </a-form-model-item>
            </a-form-model>
            <a-table :columns="columns" rowKey="id" :data-source="list" :pagination="pagination" class="table" :loading="tableLoading"></a-table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryParams: {
                page: 1,
                pageSize: 10,
                start_time: '',
                end_time: '',
                type: '',
                order_time: [],
            },
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => this.L(`共 X1 条记录`, { X1: total }),
            },
            columns: [
                {
                    title: this.L('序列号'),
                    dataIndex: 'code',
                },
                {
                    title: this.L('优惠券名称'),
                    dataIndex: 'name',
                },
                {
                    title: this.L('优惠金额'),
                    dataIndex: 'coupon_price_txt',
                },
                {
                    title: this.L('类型'),
                    dataIndex: 'type_txt',
                },
                {
                    title: this.L('平台补贴金额'),
                    dataIndex: 'sys_money',
                },
                {
                    title: this.L('商家补贴金额'),
                    dataIndex: 'mer_money',
                },
                {
                    title: this.L('操作人员'),
                    dataIndex: 'staff_user_name',
                },
                {
                    title: this.L('核销时间'),
                    dataIndex: 'verify_time',
                },
            ],
            list: [],
            searchVal: '',
            tableLoading: false,
        }
    },
    created() {
        this.getList()
    },
    methods: {
        onSearch() {
            this.pagination.current = 1
            this.getList()
        },
        resetForm() {
            this.$refs.ruleForm.resetFields()
            this.searchVal = ''
            this.queryParams.start_time = ''
            this.queryParams.end_time = ''
            this.queryParams.order_time = []
            this.queryParams.type = ''
            this.onSearch()
        },
        exportOrder() {
            this.getList('export')
        },
        getList(actions = '') {
            this.tableLoading = true
            this.queryParams.page = this.pagination.current
            this.queryParams.pageSize = this.pagination.pageSize
            let url = '/storestaff/storestaff.Coupon/getCouponVerifyRecord'
            let params = {
                ...this.queryParams,
                keywords: this.searchVal,
            }
            if (actions == 'export') {
                params.is_export = 1
            }
            this.request(url, params)
                .then((res) => {
                    this.tableLoading = false
                    if (actions == 'export') {
                        res.url && window.open(res.url)
                        return
                    }
                    this.list = res.data
                    this.pagination.total = res.total
                })
                .catch((err) => {
                    this.tableLoading = false
                })
        },
        onPickerChange(date, dateString) {
            this.queryParams.start_time = dateString[0]
            this.queryParams.end_time = dateString[1]
        },
        searchTypeChange(e) {
            this.queryParams[e] = ''
        },
        callback() {
            this.resetForm()
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
    },
}
</script>
<style lang="less" scoped>
@rem: 192 * 1rem; //定义页面尺寸
.verifiyList {
    width: 100%;
    height: 100%;
    background-color: #f7f7f7;
    padding: 20 / @rem;
}
.main-box-content-mini {
    background-color: #fff;
    padding: 20 / @rem;
}
.table {
    margin-top: 20 / @rem;
}
</style>