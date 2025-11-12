<template>
    <div class="bg-ff wrap">
        <div class="page-title">{{ detail.name || '' }}商家信息及订单</div>
        <div class="content">
            <div class="fw-bold fs-16">
                <span>商家基本信息</span>
            </div>
            <div class="mt-20">
                <a-row class="mb-10 mt-10">
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">商家名称：</span
                            ><span class="text-wrap">{{ detail.name || '-' }}</span>
                        </div></a-col
                    >
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">商家编号：</span
                            ><span class="text-wrap">{{ detail.mer_id || '-' }}</span>
                        </div></a-col
                    >
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">商家注册时间：</span
                            ><span class="text-wrap">{{ detail.reg_time || '-' }}</span>
                        </div></a-col
                    >
                </a-row>
                <a-row class="mt-10">
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">商家手机号：</span
                            ><span class="text-wrap">{{ detail.phone || '-' }}</span>
                        </div></a-col
                    >
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">营业店铺数：</span
                            ><span class="text-wrap">{{ detail.store_num || '0' }}</span>
                        </div></a-col
                    >
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">商家地址：</span
                            ><span class="text-wrap">{{ detail.address || '-' }}</span>
                        </div></a-col
                    >
                </a-row>
            </div>
            <a-divider style="margin-top: 50px" />

            <a-table :columns="columns" :data-source="list" :pagination="pagination" rowKey="order_id" class="mt-20">
                <span slot="store_name" slot-scope="text, record">
                    <span v-if="text"
                        >{{ text }}<span class="cr-primary" v-if="record.order_type == '1'">(续费)</span></span
                    >
                    <span v-else>-</span>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a-button type="link" @click="actionBtn(record)">查看详情</a-button>
                </span>
            </a-table>
        </div>
        <!-- 订单详情 -->
        <a-drawer
            width="60%"
            title="订单详情"
            placement="right"
            :closable="false"
            :visible="drawerVisible"
            @close="drawerVisible = false"
        >
            <OrderDetail :orderId="orderId" :type="'mer'"></OrderDetail>
        </a-drawer>
    </div>
</template>

<script>
import moment from 'moment'
import marketingPlatformApi from '@/api/new_marketing/platform/index'
import OrderDetail from '@/views/new_marketing/platform/modules/OrderDetail'
export default {
    components: {
        OrderDetail,
    },
    data() {
        return {
            id: '',
            detail: '',
            columns: [
                {
                    title: '订单编号',
                    dataIndex: 'orderid',
                    align: 'center',
                },
                {
                    title: '下单店铺',
                    dataIndex: 'store_name',
                    scopedSlots: { customRender: 'store_name' },
                    align: 'center',
                    width: '12%',
                },
                {
                    title: '订购数量',
                    dataIndex: 'buy_num',
                    align: 'center',
                },
                {
                    title: '店铺数量',
                    dataIndex: 'store_num',
                    align: 'center',
                },
                {
                    title: '订单总金额',
                    dataIndex: 'total_price',
                    align: 'center',
                },
                {
                    title: '支付时间',
                    dataIndex: 'pay_time',
                    align: 'center',
                    sortDirections: ['descend', 'ascend'],
                    sorter: (a, b) => moment(a.add_time).unix() - moment(b.add_time).unix(),
                },
                {
                    title: '订单类型',
                    dataIndex: 'order_type_status',
                    align: 'center',
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                    align: 'center',
                },
            ],
            list: [],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
            drawerVisible: false,
            // 订单id
            orderId: '',
        }
    },
    activated() {
        this.id = this.$route.query.id || ''
        this.getDetail()
    },
    methods: {
        moment,
        // 详情
        getDetail() {
            let params = {
                mer_id: this.id,
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }
            this.request(marketingPlatformApi.teamMerchantOrderList, params).then((res) => {
                this.detail = res.basic || ''
                this.list = res.list || []
                this.$set(this.pagination, 'total', res.count || 0)
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getDetail()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getDetail()
        },
        // 查看详情
        actionBtn(current) {
            this.drawerVisible = true
            this.orderId = current.order_id
        },
    },
}
</script>

<style lang="less" scoped>
.wrap {
    width: 100%;
    min-height: 100%;
    .page-title {
        padding: 20px 30px;
        border-bottom: 1px solid #f1f1f1;
        font-size: 18px;
        font-weight: bold;
        color: #000000;
    }
    .content {
        margin: 20px 30px;
        .text-wrap {
            white-space: pre-wrap;
            word-break: break-all;
            word-wrap: break-word;
        }
        .text-nowrap {
            white-space: nowrap;
        }
    }
}
</style>