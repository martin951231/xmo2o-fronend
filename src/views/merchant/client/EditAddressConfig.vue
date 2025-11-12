<template>
    <div class="mt-20 ml-10 mr-10 mb-20 bg-ff pt-10 pb-10 pl-10 pr-10">
        <div class="desc mb-20">
            <span class="text-wrap">{{ L('功能介绍') }}</span>
            <ul class="desc-list-wrap">
                <li v-for="(item, index) in descList" :key="index">
                    {{ L(item) }}
                </li>
            </ul>
        </div>

        <a-tabs v-model="activeKey" @change="activeKeyChange">
            <a-tab-pane :key="item.key" :tab="L(item.tab)" v-for="item in tabList">
                <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <!-- 平台配送 -->
                    <template v-if="activeKey == 1">
                        <a-form-model-item :label="L('是否开启修改地址')">
                            <a-radio-group v-model="form.platform_allow">
                                <a-radio :value="1"> {{ L('开启') }} </a-radio>
                                <a-radio :value="2"> {{ L('禁止') }} </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item :label="L('支持业务')">
                            <a-checkbox-group v-model="form.platform_type">
                                <a-checkbox
                                    v-for="itemCheck in bussinessList"
                                    :value="itemCheck.value"
                                    :name="itemCheck.value"
                                    :key="itemCheck.value"
                                >
                                    {{ L(itemCheck.label) }}
                                </a-checkbox>
                            </a-checkbox-group>
                        </a-form-model-item>
                        <a-form-model-item :label="L('可以修改地址订单状态')">
                            <a-radio-group v-model="form.address_edit_order_status" :disabled="true">
                                <a-radio
                                    :value="orderStatusItem.value"
                                    v-for="orderStatusItem in orderStatusOption"
                                    :key="orderStatusItem.value"
                                >
                                    {{ L(orderStatusItem.label) }}
                                </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item :label="L('多少公里内可以免费修改地址')">
                            <a-input-number
                                v-model="form.address_edit_distribution_distance"
                                :min="0"
                                :disabled="true"
                            ></a-input-number>
                            <span class="ml-10">{{ L('公里') }}</span>
                        </a-form-model-item>
                    </template>
                    <!-- 商家配送 -->
                    <template v-if="activeKey == 2">
                        <a-form-model-item :label="L('是否开启修改地址')">
                            <a-radio-group v-model="form.merchant_allow">
                                <a-radio :value="1"> {{ L('开启') }} </a-radio>
                                <a-radio :value="2"> {{ L('禁止') }} </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item :label="L('支持业务')">
                            <a-checkbox-group v-model="form.merchant_type">
                                <a-checkbox
                                    v-for="itemCheck in bussinessList"
                                    :value="itemCheck.value"
                                    :name="itemCheck.value"
                                    :key="itemCheck.value"
                                >
                                    {{ L(itemCheck.label) }}
                                </a-checkbox>
                            </a-checkbox-group>
                        </a-form-model-item>
                        <a-form-model-item :label="L('可以修改地址订单状态')">
                            <a-radio-group v-model="form.order_status">
                                <a-radio
                                    :value="orderStatusItem.value"
                                    v-for="orderStatusItem in orderStatusOption"
                                    :key="orderStatusItem.value"
                                >
                                    {{ L(orderStatusItem.label) }}
                                </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item :label="L('多少公里内可以免费修改地址')">
                            <a-input-number v-model="form.distribution_distance" :min="0"></a-input-number>
                            <span class="ml-10">{{ L('公里') }}</span>
                        </a-form-model-item>
                        <a-form-model-item
                            :label="L('是否开启店铺审核')"
                            :help="L('注：开启，用户修改收货地址需要商家店员进行审核才能成功；关闭，则无需审核。')"
                        >
                            <a-radio-group v-model="form.has_check">
                                <a-radio :value="1"> {{ L('开启') }} </a-radio>
                                <a-radio :value="2"> {{ L('关闭') }} </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                    </template>

                    <a-form-model-item
                        :wrapper-col="{
                            offset: 6,
                        }"
                    >
                        <a-button type="primary" @click="submitForm()">{{ L('保存') }}</a-button>
                    </a-form-model-item>
                </a-form-model>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import MerchantApi from '@/api/merchant/merchant/index'
export default {
    data() {
        return {
            descList: [
                '1、商家开通自助修改地址服务后，消费者可以通过平台个人中心订单列表、订单详情页等入口自助提交修改收货地址申请。',
                '2、自助修改地址服务可降低商家消费者改地址诉求导致的退款，同时也能提升商家接待效率。目前仅适用于外卖业务。',
                '3、用户修改地址后，商家打印机会再次打印一张小票用于替换上一张小票，新的小票头部有修改地址订单字样。',
                '4、用户修改地址后，店员端会有语音提醒用户修改地址。',
            ],
            activeKey: '1',
            tabList: [
                {
                    key: '1',
                    tab: '平台配送',
                },
                {
                    key: '2',
                    tab: '商家配送',
                },
            ],
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
            bussinessList: [
                {
                    value: 'shop',
                    label: '外卖',
                },
            ],
            orderStatusOption: [
                {
                    value: 1,
                    label: '店铺接单前',
                },
                {
                    value: 2,
                    label: '骑手接单前',
                },
                {
                    value: 3,
                    label: '骑手到店前',
                },
            ],
            form: {
                platform_allow: 1,
                platform_type: [],
                address_edit_order_status: 1,
                address_edit_distribution_distance: 0,
                merchant_allow: 1,
                merchant_type: [],
                order_status: 1,
                distribution_distance: 0,
                has_check: 1,
            },
        }
    },
    mounted() {
        this.getForm()
    },
    methods: {
        activeKeyChange(e) {
            this.activeKey = e
        },
        getForm() {
            this.request(MerchantApi.addressSettingConfig, {}).then((res) => {
                this.form = {
                    ...res,
                    // 商家是否使用 平台设置的开启修改地址：' 1:同意|2:关闭'
                    platform_allow: res.platform_allow - 0,
                    // 商家是否使用 平台支持的业务类型，逗号拼接，目前只有外卖shop
                    platform_type: res.platform_type ? res.platform_type.split(',') : [],
                    // 修改地址订单状态 '1:店铺接单前|2:骑手接单前|3:骑手到店前'
                    address_edit_order_status: res.address_edit_order_status - 0,
                    // 多少公里内可以免费修改地址
                    address_edit_distribution_distance: res.address_edit_distribution_distance - 0,
                    // 商家是否开启修改地址：' 1:同意|2:关闭'
                    merchant_allow: res.merchant_allow - 0,
                    // 商家支持的业务类型，逗号拼接，目前只有外卖shop
                    merchant_type: res.merchant_type ? res.merchant_type.split(',') : [],
                    // 修改地址订单状态 '1:店铺接单前|2:骑手接单前|3:骑手到店前'
                    order_status: res.order_status - 0,
                    // 多少公里内可以免费修改地址
                    distribution_distance: res.distribution_distance - 0,
                    // 商家是否开启店铺审核 '1:开启|2:禁止'
                    has_check: res.has_check - 0,
                }
            })
        },
        // 保存
        submitForm() {
            if (this.form.platform_allow == 1 && !this.form.platform_type.length) {
                this.$message.error(this.L('请选择平台配送支持业务'))
                if (this.activeKey != '1') {
                    this.activeKey = '1'
                }
                return
            }
            if (this.form.merchant_allow == 1 && !this.form.merchant_type.length) {
                this.$message.error(this.L('请选择商家配送支持业务'))
                if (this.activeKey != '2') {
                    this.activeKey = '2'
                }
                return
            }
            let params = {
                ...this.form,
                platform_type: this.form.platform_type.join(','),
                merchant_type: this.form.merchant_type.join(','),
            }
            this.request(MerchantApi.addressSettingEdit, params).then((res) => {
                this.$message.success(this.L('操作成功'))
            })
        },
    },
}
</script>

<style scoped>
.desc {
    padding: 15px;
    border: 1px solid #bce8f1;
    background-color: #d9edf7;
    color: #31708f;
    font-size: 14px;
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
}
.desc-list-wrap {
    margin: 0;
    padding: 0;
    list-style-type: none;
}
</style>