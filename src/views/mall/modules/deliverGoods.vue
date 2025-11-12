<template>
    <a-modal
        :title="title"
        :visible="visible"
        :maskClosable="false"
        :destroyOnClose="true"
        @cancel="handleCancel"
        width="60%"
        :bodyStyle="{
            maxHeight: '70vh',
            overflowY: 'auto',
        }"
    >
        <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div v-for="(item, index) in formData.extra_delivery" :key="item.key">
                <a-form-model-item label="快递">
                    <div class="flex">
                        <a-select
                            placeholder="请选择"
                            @change="hanleChange($event, index)"
                            v-model="item.express_id"
                            style="width: 80%"
                        >
                            <a-select-option v-for="item in expressOptions" :key="item.id">
                                {{ item.name }}{{ item.is_singface == '1' ? '（电子面单）' : '' }}
                            </a-select-option>
                        </a-select>
                        <a-button v-if="index != 0" class="ml-10" type="danger" @click="handleExpress('del', index)"
                            >删除</a-button
                        >
                    </div>
                </a-form-model-item>
                <a-form-model-item label="快递单号">
                    <a-input v-model="item.express_no" placeholder="请输入快递单号" style="width: 80%" />
                </a-form-model-item>
                <a-form-model-item label="发货商品" help="不选择，为空表示发货所有商品。">
                    <a-select mode="multiple" style="width: 80%" placeholder="请选择" v-model="item.order_detail_ids">
                        <a-select-option v-for="goodsItem in goodsList" :key="goodsItem.id" :value="goodsItem.id">
                            {{ goodsItem.show_name }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
            </div>
        </a-form-model>
        <template slot="footer">
            <div class="flex justify-center align-center">
                <a-button key="add" class="mr-20" @click="handleExpress('add')"> 添加快递 </a-button>
                <a-button key="back" class="mr-20" @click="btnOpt(2)"> 普通发货 </a-button>
                <a-button key="submit" type="primary" :disabled="isCanSingface" @click="btnOpt(1)">
                    电子面单发货
                </a-button>
            </div>
        </template>
    </a-modal>
</template>

<script>
import mallStorestaffApi from '@/api/mall/storestaff/index'
import mallMerchantApi from '@/api/mall/merchant/index'
export default {
    props: {
        visible: Boolean,
        title: String,
        order: Object,
        // 周期购
        nowPeriodicItem: {
            type: Object,
            default: {},
        },
        // 发货=1 修改快递=2
        fh_type: [String, Number],
        // storestaff = 店员发货 merchant = 商家发货
        pageType: {
            type: String,
            default: 'storestaff',
        },
    },
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
            formData: {
                order_id: '',
                activity_type: '',
                periodic_order_id: '',
                current_periodic: '',
                periodic_count: '',
                express_type: '', // 1= 电子面单 2=普通发货
                express_no: '',
                express_id: '',
                express_name: '',
                fh_type: '1', // 发货=1 修改快递=2
                // 多包裹发货
                extra_delivery: [
                    {
                        express_id: undefined,
                        express_name: '',
                        express_no: '',
                        order_detail_ids: [],
                        is_singface: 0,
                        key: 0,
                    },
                ],
            },
            expressOptions: [],
        }
    },
    computed: {
        // 发货商品
        goodsList() {
            let list = this.order.children || []
            if (list.length) {
                list = list.map((item) => {
                    item.show_name = item.goods_name
                    if (item.sku_info) {
                        item.show_name = item.show_name + `(${item.sku_info})`
                    }
                    return item
                })
            }
            return list
        },
        // 是否支持电子面单发货
        isCanSingface() {
            let disabled = false
            if (this.fh_type == 2) {
                disabled = true
            } else {
                if (this.formData.extra_delivery.length > 1) {
                    disabled = true
                } else {
                    if (this.formData.extra_delivery[0]['is_singface'] != 1) {
                        disabled = true
                    }
                }
            }
            return disabled
        },
    },
    created() {
        this.getExpress()
    },
    methods: {
        // 获取快递
        getExpress() {
            let api = {
                merchant: mallMerchantApi.getExpress,
                storestaff: mallStorestaffApi.getExpress,
            }
            this.request(api[this.pageType], {}).then((data) => {
                this.expressOptions = data || []
                this.handleExtraDelivery()
            })
        },
        handleExtraDelivery() {
            if (this.fh_type == 2) {
                // 修改快递
                this.$set(this.formData, 'express_id', this.order.express_id || '')
                this.$set(this.formData, 'express_no', this.order.express_num || '')
                this.$set(this.formData, 'express_name', this.order.express_name || '')
                let delivery = []
                if (this.order.goods_activity_type == 'periodic' && this.nowPeriodicItem) {
                    delivery = this.nowPeriodicItem.delivery || []
                } else {
                    delivery = this.order.delivery || []
                }
                if (Array.isArray(delivery) && delivery.length) {
                    let extra_delivery = delivery.map((item, index) => {
                        let order_detail_ids = item.order_detail_ids ? item.order_detail_ids.split(',') : []
                        if (order_detail_ids.length) {
                            order_detail_ids = order_detail_ids.map((idItem) => idItem - 0)
                        }
                        return {
                            express_id: item.express_id,
                            express_name: item.express_name,
                            express_no: item.express_num,
                            order_detail_ids: order_detail_ids,
                            key: index,
                        }
                    })
                    this.$set(this.formData, 'extra_delivery', extra_delivery)
                } else {
                    if (this.order.goods_activity_type != 'periodic' && this.order.express_id) {
                        let extra_delivery = [
                            {
                                express_id: this.order.express_id,
                                express_name: this.order.express_name,
                                express_no: this.order.express_num,
                                order_detail_ids: [],
                                key: 0,
                            },
                        ]
                        this.$set(this.formData, 'extra_delivery', extra_delivery)
                    }
                }
            }
            console.log('this.formData',this.formData)
        },
        // 快递选择
        hanleChange(e, index) {
            let cur = this.formData.extra_delivery[index]
            cur.express_id = e

            this.expressOptions.forEach((item) => {
                if (item.id == e) {
                    cur.express_name = item.name
                    cur.is_singface = item.is_singface
                }
            })

            this.$set(this.formData.extra_delivery, index, cur)
        },
        btnOpt(express_type) {
            this.$set(this.formData, 'express_type', express_type)

            let isExpress = this.formData.extra_delivery.some((item) => !item.express_id)
            if (isExpress) {
                this.$message.error('请选择快递')
                return
            }

            if (express_type == 2) {
                if (this.formData.extra_delivery.some((item) => !item.express_no)) {
                    this.$message.error('请输入快递单号')
                    return
                } else {
                    let reg = /[\u4e00-\u9fa5]/
                    if (this.formData.extra_delivery.some((item) => reg.test(item.express_no))) {
                        this.$message.error('不能输入中文')
                        return
                    }
                }
            }
            let extra_delivery = this.formData.extra_delivery.map((item) => {
                return {
                    express_id: item.express_id,
                    express_no: item.express_no,
                    order_detail_ids: item.order_detail_ids.length ? item.order_detail_ids.join(',') : '',
                    express_name: item.express_name
                }
            })
            let { order_id, goods_activity_type, order_type, current_periodic, periodic_count } = this.order
            let periodic_order_id =
                this.nowPeriodicItem && this.nowPeriodicItem.purchase_order_id
                    ? this.nowPeriodicItem.purchase_order_id
                    : ''
            this.$set(this.formData, 'order_id', order_id)
            this.$set(this.formData, 'activity_type', goods_activity_type)
            // 周期购订单
            if (order_type == 'periodic') {
                this.$set(this.formData, 'periodic_order_id', periodic_order_id)
                this.$set(this.formData, 'current_periodic', current_periodic)
                this.$set(this.formData, 'periodic_count', periodic_count)
            }
            this.$set(this.formData, 'fh_type', this.fh_type)
            let params = {
                ...this.formData,
                express_id: extra_delivery[0].express_id,
                express_no: extra_delivery[0].express_no,
                express_name: extra_delivery[0].express_name,
                extra_delivery: express_type == 2 ? extra_delivery : [],
                store_id: this.order.store_id || ''
            }
            let api = {
                merchant: mallMerchantApi.deliverGoodsByExpress,
                storestaff: mallStorestaffApi.deliverGoodsByExpress,
            }
            this.request(api[this.pageType], params).then((data) => {
                let text = this.fh_type == '1' ? '订单发货成功' : '快递更改成功'
                this.$message.success(text)
                this.handleCancel()
                this.$emit('updateList')
            })
        },
        handleCancel() {
            this.$emit('handleCancel')
            this.formData = {
                order_id: '',
                activity_type: '',
                periodic_order_id: '',
                current_periodic: '',
                periodic_count: '',
                express_type: '', // 1= 电子面单 2=普通发货
                express_no: '',
                express_id: '',
                express_name: '',
                fh_type: '1', // 发货=1 修改快递=2
                // 多包裹发货
                extra_delivery: [
                    {
                        express_id: undefined,
                        express_name: '',
                        express_no: '',
                        order_detail_ids: [],
                        is_singface: 0,
                        key: 0,
                    },
                ],
            }
        },
        // 添加 || 刪除快递
        handleExpress(type, index) {
            if (type == 'add') {
                let extra_delivery = this.formData.extra_delivery
                extra_delivery.push({
                    express_id: undefined,
                    express_name: '',
                    express_no: '',
                    order_detail_ids: [],
                    is_singface: 0,
                    key: extra_delivery.length,
                })
                this.$set(this.formData, 'extra_delivery', extra_delivery)
            }
            if (type == 'del') {
                this.$delete(this.formData.extra_delivery, index)
            }
        },
    },
}
</script>

<style scoped></style>
