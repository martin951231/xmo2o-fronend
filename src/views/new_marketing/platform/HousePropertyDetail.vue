<template>
    <div class="bg-ff wrap">
        <div class="page-title">{{ detail.name || '' }}物业信息及订单</div>
        <div class="content">
            <div class="fw-bold fs-16">
                <span>物业基本信息</span>
            </div>
            <div class="mt-20">
                <a-row class="mb-10 mt-10">
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">物业名称：</span
                            ><span class="text-wrap">{{ detail.property_name || '-' }}</span>
                        </div></a-col
                    >
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">物业编号：</span
                            ><span class="text-wrap">{{ detail.id || '-' }}</span>
                        </div></a-col
                    >
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">物业注册时间：</span
                            ><span class="text-wrap">{{ detail.create_time || '-' }}</span>
                        </div></a-col
                    >
                </a-row>
                <a-row class="mt-10">
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">物业手机号：</span
                            ><span class="text-wrap">{{ detail.property_phone || '-' }}</span>
                        </div></a-col
                    >
                    <a-col :span="8"
                        ><div class="flex">
                            <span class="text-nowrap">物业地址：</span
                            ><span class="text-wrap">{{ detail.property_address || '-' }}</span>
                        </div></a-col
                    >
                </a-row>
            </div>
            <a-divider style="margin-top: 50px" />

            <a-table :columns="columns" :data-source="list" :pagination="pagination" rowKey="order_id" class="mt-20">
                <span slot="store_name" slot-scope="text, record">
                    <span v-if="text"
                        >{{ text }}<span class="cr-primary" v-if="record.order_type == '2'">(续费)</span></span
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
            <OrderDetail :orderId="orderId" :type="'mer'" :orderBusiness="1"></OrderDetail>
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
                    dataIndex: 'order_no',
                    align: 'center',
                },
                {
                    title: '下单套餐',
                    dataIndex: 'package_title',
                    scopedSlots: { customRender: 'package_title' },
                    align: 'center',
                    width: '12%',
                },
                {
                    title: '订单总金额',
                    dataIndex: 'order_money',
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
                id: this.id,
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }
            this.request(marketingPlatformApi.getHousePropertyDetail, params).then((res) => {
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