<template>
    <a-modal title="押金列表" :width="1000" :visible="visible" @cancel="handleCancel" :footer="null">
        <a-table :columns="columns" :row-key="record=>record.order_id" :pagination="pageInfo" :loading="tableLoadding"
            @change="handleTableChange" :data-source="depositList">
            <span slot="action" slot-scope="text, record">
                <a @click="viewDetail(record)">详情</a>
            </span>
        </a-table>
    </a-modal>
</template>

<script>
    import villageApi from '@/api/community/village';
    const columns = [{
            title: '订单编号',
            dataIndex: 'order_id',
            key: 'order_id',
        },
        {
            title: '金额变更前（元）',
            dataIndex: 'before_money',
            key: 'before_money',
        },
        {
            title: '状态',
            dataIndex: 'type_txt',
            key: 'type_txt',
        },
        {
            title: '时间',
            dataIndex: 'add_time',
            key: 'add_time',
        },
        {
            title: '退款金额',
            dataIndex: 'money',
            key: 'money',
        },
        {
            title: '金额变更后记录',
            dataIndex: 'total_money',
            key: 'total_money',
        },
        {
            title: '账单',
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];

    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            roomId: {
                type: String,
                default: ''
            }
        },

        watch: {
            visible: {
                immediate: true,
                handler(val) {
                    if (val) {
                        this.pageInfo.room_id = this.roomId
                        this.getDepositList()
                    }
                }
            },
        },

        data() {
            return {
                columns,
                pageInfo: {
                    page: 1,
                    current: 1,
                    pageSize: 20,
                    total: 0,
                    room_id: 0
                },
                tableLoadding: false,
                depositList: []
            }
        },

        methods: {
            handleTableChange(pagenation, filters, sorter) {
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getDepositList()
            },

            getDepositList() {
                let that = this
                that.tableLoadding = true
                that.request('/community/village_api.Cashier/getDepositList', that.pageInfo).then((res) => {
                    that.depositList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                }).catch(e => {
                    that.tableLoadding = false
                })
            },

            handleCancel(e) {
                this.$emit('closeDeposit')
                this.confirmLoading = false;
            },

            viewDetail(record) {
                this.$emit('showDepositDetail', record)
            }
        },
    }
</script>

<style>
</style>
