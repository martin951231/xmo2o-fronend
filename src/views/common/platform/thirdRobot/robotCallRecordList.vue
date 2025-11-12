<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <a-form-model layout="inline" :model="formData" @submit="getList($event, true)" @submit.native.prevent>
            <a-form-model-item>
                <a-input-group compact>
                    <a-select v-model="formData.search_type" style="width: 6vw" :options="searchTypeOptions">
                    </a-select>
                    <a-input style="width: 15vw" v-model="formData.keywords" :placeholder="L('请输入')" allowClear>
                    </a-input>
                </a-input-group>
            </a-form-model-item>
            <a-form-model-item :label="L('日期筛选')">
                <a-range-picker
                    style="width: 15vw"
                    :ranges="{
                        今日: [moment(), moment()],
                        近7天: [moment().subtract('days', 6), moment()],
                        近30天: [moment().subtract('days', 29), moment()],
                    }"
                    :value="formData.time"
                    format="YYYY-MM-DD"
                    @change="onDateRangeChange"
                    allowClear
                />
            </a-form-model-item>
            <a-form-model-item :label="L('状态')">
                <a-select v-model="formData.status" style="width: 6vw" :options="statusOptions"> </a-select>
            </a-form-model-item>
            <a-form-model-item>
                <a-button type="primary" html-type="submit" class="ml-40">
                    {{ L('查询') }}
                </a-button>
            </a-form-model-item>
        </a-form-model>

        <a-table :columns="columns" :data-source="list" :pagination="pagination" rowKey="id" class="mt-20">
            <span slot="order_no" slot-scope="text, record" class="text-wrap">
                {{ record.order_no }}
            </span>
            <span slot="role" slot-scope="text, record">
                {{ record.role == 'user'?L('用户召唤'):L('外卖配送') }}
            </span>
            <span slot="action" slot-scope="text, record">
                <template v-if="record.shop_order_id != 0">
                    <span>--</span>
                </template>
                <template v-else>
                    <a-button
                        type="link"
                        v-if="record.status != 10 && record.status != 70 && record.status != 12"
                        @click="refundHandle(record)"
                        >{{ L('退款') }}</a-button
                    >
                    <span v-else-if="record.status == 70 || record.status == 12" class="cr-99">{{ L('已退款') }}</span>
                    <span v-else>--</span>
                </template>
            </span>
        </a-table>
    </div>
</template>

<script>
import moment from 'moment'
import thirdRobotApi from '@/api/common/platform/thirdRobotApi'
export default {
    data() {
        return {
            searchTypeOptions: [
                {
                    label: this.L('订单号'),
                    value: 'order_no',
                },
                {
                    label: this.L('召唤人'),
                    value: 'start_user_name',
                },
                {
                    label: this.L('交付人'),
                    value: 'end_user_name',
                },
            ],
            // 1 待配送   2 配送中   3已完成
            statusOptions: [
                {
                    label: this.L('全部'),
                    value: '-1',
                },
                {
                    label: this.L('待配送'),
                    value: '1',
                },
                {
                    label: this.L('配送中'),
                    value: '2',
                },
                {
                    label: this.L('已完成'),
                    value: '3',
                },
            ],
            formData: {
                search_type: 'order_no',
                keywords: '',
                time: [],
                start_time: '',
                end_time: '',
                status: '-1',
            },
            columns: [
                {
                    title: this.L('订单号'),
                    dataIndex: 'order_no',
                    key: 'order_no',
                    scopedSlots: {
                        customRender: 'order_no',
                    },
                },
                {
                    title: this.L('订单类型'),
                    key: 'role',
                    scopedSlots: {
                        customRender: 'role',
                    },
                },
                {
                    title: this.L('召唤人'),
                    dataIndex: 'start_address_user_name',
                },
                {
                    title: this.L('召唤地'),
                    dataIndex: 'start_address_name',
                },
                {
                    title: this.L('交付人'),
                    dataIndex: 'end_address_user_name',
                },
                {
                    title: this.L('交付地'),
                    dataIndex: 'end_address_name',
                },
                {
                    title: this.L('配送费'),
                    dataIndex: 'delivery_price',
                },
                {
                    title: this.L('召唤时间'),
                    dataIndex: 'create_time',
                },
                {
                    title: this.L('状态'),
                    dataIndex: 'status_text',
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    scopedSlots: {
                        customRender: 'action',
                    },
                },
            ],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => this.L('共 X1 条记录', { X1: total }),
            },
            list: [],
        }
    },
    mounted() {
        this.getList()
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        moment,
        // 时间选择
        onDateRangeChange(date, dateString) {
            this.$set(this.formData, 'time', [date[0], date[1]])
            this.$set(this.formData, 'start_time', dateString[0])
            this.$set(this.formData, 'end_time', dateString[1])
        },
        // 列表 status 10 待支付 20 已支付 30 前往召唤人 40准备送货 50 前往目的地 60 订单完成 70 订单取消并退款
        getList(e, refresh = false) {
            if (refresh) {
                this.pagination.current = 1
            }
            let params = {
                page: this.pagination.current,
                page_size: this.pagination.pageSize,
                start_time: this.formData.start_time,
                end_time: this.formData.end_time,
                keywords: this.formData.keywords,
                type: this.formData.search_type,
                status: this.formData.status,
            }
            this.request(thirdRobotApi.thirdRobotDeliveryOrderList, params).then((res) => {
                this.list = res.data || []
                this.pagination.total = res.total || 0
            })
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
        // 退款
        refundHandle(record) {
            this.$confirm({
                title: this.L('是否确认退款'),
                okText: this.L('确认'),
                cancelText: this.L('取消'),
                onOk: () => {
                    let params = {
                        order_id: record.id,
                        uid: record.uid,
                    }
                    this.request(thirdRobotApi.cancelOrder, params).then((data) => {
                        this.$message.success(this.L('操作成功！'))
                        this.getList()
                    })
                },
            })
        },
    },
}
</script>

<style scoped lang="less"></style>
