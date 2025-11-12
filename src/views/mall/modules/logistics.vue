<template>
    <a-modal
        :title="title"
        :visible="visible"
        :maskClosable="false"
        @ok="handleCancel"
        @cancel="handleCancel"
        :footer="null"
        width="60%"
        :bodyStyle="{
            maxHeight: '80vh',
            overflowY: 'auto',
            paddingTop: extraDelivery.length > 1 ? '10px' : '24px',
        }"
    >
        <span v-if="rider_name">
            <span>骑手：{{ rider_name }}</span>
            <a-divider type="virticle"></a-divider>
            <span>骑手号码：{{ rider_phone }}</span>
            <a-divider></a-divider>
        </span>
        <template v-if="order && order.express_style == 1">
            <a-timeline :pending="pending" :reverse="true" v-if="!noData">
                <a-timeline-item v-for="(item, index) in logistics" :key="index">
                    <p class="mb-0">{{ moment(item.time).format('YYYY-MM-DD HH:mm') }}</p>
                    <span>{{ item.context }}</span>
                </a-timeline-item>
            </a-timeline>
            <a-empty :image="simpleImage" v-else>
                <span slot="description">暂无骑手轨迹</span>
            </a-empty>
        </template>
        <template v-if="order && order.express_style == 2">
            <template v-if="!noData">
                <div 
                    class="flex align-center" 
                    :class="[{'mb-20':extraDelivery.length == 1}]"
                    v-if="periodicInfo.length">
                    <span class="ant-form-item-label">配送周期：</span>
                    <a-select
                        placeholder="请选择"
                        @change="handleChange($event)"
                        v-model="currentPeriodic"
                        style="width: 200px"
                    >
                        <a-select-option v-for="item in periodicInfo" :key="item.current_periodic">
                            第{{ item.current_periodic }}期
                        </a-select-option>
                    </a-select>
                </div>
                <template v-if="extraDelivery.length == 1">
                    <div class="text-wrap mb-20">
                        <span class="mr-20">物流名称：{{ extraDelivery[0]['express_name'] || '---' }}</span>
                        <span>物流单号：{{ extraDelivery[0]['express_num'] || '---' }}</span>
                    </div>
                    <div class="text-wrap mb-20 flex" v-if="extraDelivery[0]['goods_detail']">
                        <span>包含商品：</span>
                        <div class="flex flex-1" style="flex-wrap: wrap">
                            <div
                                v-for="(goodsItem, goodsIndex) in extraDelivery[0]['goods_detail']"
                                :key="goodsIndex"
                                class="ml-10 mb-10 flex flex-column"
                            >
                                <img :src="goodsItem.image" alt="" style="width: 50px; height: 50px" />
                                <span class="no-wrap" style="max-width: 50px" :title="goodsItem.name">{{
                                    goodsItem.name
                                }}</span>
                            </div>
                        </div>
                    </div>
                    <div style="max-height: 52vh; overflow-y: auto; padding-top: 10px">
                        <a-timeline :pending="pending" :reverse="true" v-if="extraDelivery[0].logistics && extraDelivery[0].logistics.data && extraDelivery[0].logistics.data.length">
                            <a-timeline-item v-for="(item, index) in extraDelivery[0].logistics.data" :key="index">
                                <p class="mb-0">{{ moment(item.time).format('YYYY-MM-DD HH:mm') }}</p>
                                <span>{{ item.context }}</span>
                            </a-timeline-item>
                        </a-timeline>
                        <p v-else>{{ extraDelivery[0].logistics.stateMessage || '暂无物流信息' }}</p>
                    </div>
                </template>
                <template v-if="extraDelivery.length > 1">
                    <a-tabs @change="tabsChange" v-model="activeKey">
                        <a-tab-pane :key="index" :tab="'包裹' + (index + 1)" v-for="(item, index) in extraDelivery">
                            <div class="text-wrap mb-20">
                                <span class="mr-20">物流名称：{{ item.express_name || '---' }}</span>
                                <span>物流单号：{{ item.express_num || '---' }}</span>
                            </div>
                            <div class="text-wrap mb-20 flex" v-if="item.goods_detail">
                                <span>包含商品：</span>
                                <div class="flex flex-1" style="flex-wrap: wrap">
                                    <div
                                        v-for="(goodsItem, goodsIndex) in item.goods_detail"
                                        :key="goodsIndex"
                                        class="ml-10 mb-10 flex flex-column"
                                    >
                                        <img :src="goodsItem.image" alt="" style="width: 50px; height: 50px" />
                                        <span class="no-wrap" style="max-width: 50px" :title="goodsItem.name">{{
                                            goodsItem.name
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                            <div style="max-height: 52vh; overflow-y: auto; padding-top: 10px">
                                <a-timeline :pending="pending" :reverse="true" v-if="item.logistics && item.logistics.data && item.logistics.data.length">
                                    <a-timeline-item v-for="(item, index) in item.logistics.data" :key="index">
                                        <p class="mb-0">{{ moment(item.time).format('YYYY-MM-DD HH:mm') }}</p>
                                        <span>{{ item.context }}</span>
                                    </a-timeline-item>
                                </a-timeline>
                                <p v-else>{{ item.logistics.stateMessage || '暂无物流信息' }}</p>
                            </div>
                        </a-tab-pane>
                    </a-tabs>
                </template>
            </template>

            <a-empty :image="simpleImage" v-else>
                <span slot="description">暂无物流信息</span>
            </a-empty>
        </template>
    </a-modal>
</template>

<script>
import Vue from 'vue'
import mallPlatformApi from '@/api/mall/platform/index'
import mallStorestaffApi from '@/api/mall/storestaff/index'
import mallMerchantApi from '@/api/mall/merchant/index'
import { timeline, Empty } from 'ant-design-vue'

Vue.use(timeline)
Vue.use(Empty)
import moment from 'moment'

export default {
    props: {
        visible: Boolean,
        title: String,
        order: Object,
        //  platform = 平台 merchant = 商家 storestaff = 店员
        pageType: {
            type: String,
            default: 'platform',
        },
        nowPeriodicItem: [Object],
    },
    data() {
        return {
            logistics: [],
            pending: false,
            simpleImage: '',
            rider_name: '',
            rider_phone: '',
            noData: false,
            // 多包裹发货物流信息
            extraDelivery: [],
            activeKey: 0,
            periodicInfo: [],
            currentPeriodic: undefined
        }
    },
    beforeCreate() {
        this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
    },
    mounted() {
        // 已发货
        if (this.order.status == 20 || (this.nowPeriodicItem && this.nowPeriodicItem.is_complete == 20)) {
            this.pending = '正在配送中...'
        }
        if(this.order.order_type == 'periodic' && (!this.nowPeriodicItem || (this.nowPeriodicItem && !Object.keys(this.nowPeriodicItem).length))) {
            this.getOrderDetail(this.order.order_id)
        } else {
            this.viewLogistics()
        }
    },
    methods: {
        moment,
        // 查询物流
        viewLogistics(periodic_order_id = '') {
            let { order_id, order_type, express_style } = this.order
            let api = {
                platform: mallPlatformApi.viewLogistics,
                merchant: mallMerchantApi.viewLogistics,
                storestaff: mallStorestaffApi.viewLogistics,
            }
            if (order_type == 'periodic' && !periodic_order_id) {
                if (this.nowPeriodicItem) {
                    periodic_order_id = this.nowPeriodicItem.purchase_order_id || ''
                } else {
                    periodic_order_id = this.order.periodic_order_id  || ''
                }
            }

            this.request(api[this.pageType], {
                order_id: order_id,
                periodic_order_id: periodic_order_id,
                order_type: order_type,
                express_style: express_style,
            }).then((data) => {
                if (data) {
                    if (express_style == 1) {
                        this.logistics = data.list || []
                        this.rider_name = data.rider_name
                        this.rider_phone = data.rider_phone
                        this.noData = !this.logistics.length ? true : false
                    }

                    if(express_style == 2) {
                        this.extraDelivery = data || []
                        this.noData = !this.extraDelivery.length ? true : false
                    }
                } else if (data.errCode === 1) {
                    this.$message.warn(data.errMsg)
                }
            })
        },
        handleCancel() {
            this.activeKey = 0
            this.$emit('handleCancel')
        },
        tabsChange(e) {
            this.activeKey = e
        },
        // 订单详情
        getOrderDetail(order_id = '') {
            if(!order_id) return
            let api = {
                platform: mallPlatformApi.getOrderDetails,
                merchant: mallMerchantApi.getOrderDetails,
                storestaff: mallStorestaffApi.getOrderDetailsCopy
            }

            this.request(api[this.pageType], {
                order_id: order_id,
                periodic_order_id: this.order.periodic_order_id,
                refund_id: this.order.refund_id,
                noTip: true
            }).then((data) => {
                this.periodicInfo = data.periodic_info || []
                if(this.periodicInfo.length) {
                    this.currentPeriodic = this.periodicInfo[0]['current_periodic']
                    this.viewLogistics(this.periodicInfo[0]['purchase_order_id'])
                }
            })
        },
        handleChange(e) {
            this.currentPeriodic = e
            let periodicInfo = this.periodicInfo.find(item => item.current_periodic == this.currentPeriodic)
            this.viewLogistics(periodicInfo.purchase_order_id)
        }
    },
}
</script>

<style scoped>
.mb-0 {
    margin-bottom: 0;
}
</style>
