<template>
    <div class="page">
        <a-page-header class="page-header" title="基础设置" />
        <a-form-model :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol" ref="ruleForm">
            <a-tabs :activeKey="activeKey" @change="onTabChange">
                <!-- 基本信息 -->
                <a-tab-pane key="1" tab="新版商城">
                    <a-card :bordered="false">
                        <a-form-model-item
                            label=""
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help=""
                        >
                            <span>商品库存阈值提醒小于等于：</span>
                            <a-input-number
                                :min="0"
                                :precision="0"
                                placeholder="请输入"
                                v-model="formData.mall.min_num"
                                :disabled="formData.is_start ? true : false"
                                style="width: 100px"
                            />
                            <span>提醒</span>
                        </a-form-model-item>
                        <a-form-model-item
                            label=""
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help=""
                        >
                            <span>申请售后订单超过：</span>
                            <a-input-number
                                :min="0"
                                :precision="0"
                                placeholder="请输入"
                                v-model="formData.mall.apply_after_sales_time"
                                :disabled="formData.is_start ? true : false"
                                style="width: 100px"
                            />
                            <span>分钟提醒警告</span>
                        </a-form-model-item>

                        <a-form-model-item
                            label="提醒规则"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            :wrapper-col="{ span: 18 }"
                            help=""
                        >
                            <a-radio-group v-model="formData.mall.is_warn_only_once">
                                <!--<a-radio :value="0"> 只提醒一次 </a-radio>-->
                                <a-radio :value="1"> 每天提醒一次 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item
                            label="状态"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            :wrapper-col="{ span: 18 }"
                            help=""
                        >
                            <a-radio-group v-model="formData.mall.status">
                                <a-radio :value="0"> 关闭 </a-radio>
                                <a-radio :value="1"> 开启 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                    </a-card>
                </a-tab-pane>

                <!-- 基本信息 end -->

                <!-- 规格数量设置 -->
                <a-tab-pane key="2" tab="外卖" force-render>
                    <a-card :bordered="false">
                        <a-form-model-item
                            label=""
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help=""
                        >
                            <span>商品库存阈值提醒小于等于：</span>
                            <a-input-number
                                :min="0"
                                :precision="0"
                                placeholder="请输入"
                                v-model="formData.shop.min_num"
                                style="width: 100px"
                            />
                            <span>提醒</span>
                        </a-form-model-item>
                        <a-form-model-item
                            label=""
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help=""
                        >
                            <span>申请售后订单超过：</span>
                            <a-input-number
                                :min="0"
                                :precision="0"
                                placeholder="请输入"
                                v-model="formData.shop.apply_after_sales_time"
                                style="width: 100px"
                            />
                            <span>分钟提醒警告</span>
                        </a-form-model-item>

                        <a-form-model-item
                            label="提醒规则"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            :wrapper-col="{ span: 18 }"
                            help=""
                        >
                            <a-radio-group v-model="formData.shop.is_warn_only_once">
                                <!--<a-radio :value="0"> 只提醒一次 </a-radio>-->
                                <a-radio :value="1"> 每天提醒一次 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item
                            label="状态"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            :wrapper-col="{ span: 18 }"
                            help=""
                        >
                            <a-radio-group v-model="formData.shop.status">
                                <a-radio :value="0"> 关闭 </a-radio>
                                <a-radio :value="1"> 开启 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                    </a-card>

                </a-tab-pane>

                <a-tab-pane key="3" tab="团购" force-render>
                    <a-card :bordered="false">
                        <a-form-model-item
                            label=""
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help=""
                        >
                            <span>商品库存阈值提醒小于等于：</span>
                            <a-input-number
                                :min="0"
                                :precision="0"
                                placeholder="请输入"
                                v-model="formData.group.min_num"
                                style="width: 100px"
                            />
                            <span>提醒</span>
                        </a-form-model-item>

                        <a-form-model-item
                            label="提醒规则"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            :wrapper-col="{ span: 18 }"
                            help=""
                        >
                            <a-radio-group v-model="formData.group.is_warn_only_once">
                                <!--<a-radio :value="0"> 只提醒一次 </a-radio>-->
                                <a-radio :value="1"> 每天提醒一次 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item
                            label="状态"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            :wrapper-col="{ span: 18 }"
                            help=""
                        >
                            <a-radio-group v-model="formData.group.status">
                                <a-radio :value="0"> 关闭 </a-radio>
                                <a-radio :value="1"> 开启 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                    </a-card>
                </a-tab-pane>
                <!--<a-tab-pane key="4" tab="预约" force-render>
                    <a-card :bordered="false">
                        <a-form-model-item
                            label=""
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help=""
                        >
                            <span>商品库存阈值提醒小于等于：</span>
                            <a-input-number
                                :min="0"
                                :precision="0"
                                placeholder="请输入"
                                v-model="formData.appoint.min_num"
                                style="width: 100px"
                            />
                            <span>提醒</span>
                        </a-form-model-item>
                        <a-form-model-item
                            label=""
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help=""
                        >
                            <span>申请售后订单超过：</span>
                            <a-input-number
                                :min="0"
                                :precision="0"
                                placeholder="请输入"
                                v-model="formData.appoint.apply_after_sales_time"
                                style="width: 100px"
                            />
                            <span>分钟提醒警告</span>
                        </a-form-model-item>

                        <a-form-model-item
                            label="是否多次提醒"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            :wrapper-col="{ span: 18 }"
                            help=""
                        >
                            <a-radio-group v-model="formData.appoint.is_warn_only_once">
                                <a-radio :value="0"> 只提醒一次 </a-radio>
                                <a-radio :value="1"> 每天提醒一次 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item
                            label="状态"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            :wrapper-col="{ span: 18 }"
                            help=""
                        >
                            <a-radio-group v-model="formData.appoint.status">
                                <a-radio :value="0"> 关闭 </a-radio>
                                <a-radio :value="1"> 开启 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                    </a-card>
                    <a-divider style="height: 10px; background-color: #eef0f3" />
                </a-tab-pane>
                <a-tab-pane key="5" tab="新版景区" force-render>
                    <a-card :bordered="false">
                        <a-form-model-item
                            label=""
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help=""
                        >
                            <span>商品库存阈值提醒小于等于：</span>
                            <a-input-number
                                :min="0"
                                :precision="0"
                                placeholder="请输入"
                                v-model="formData.scenic.min_num"
                                style="width: 100px"
                            />
                            <span>提醒</span>
                        </a-form-model-item>
                        <a-form-model-item
                            label=""
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            help=""
                        >
                            <span>申请售后订单超过：</span>
                            <a-input-number
                                :min="0"
                                :precision="0"
                                placeholder="请输入"
                                v-model="formData.scenic.apply_after_sales_time"
                                style="width: 100px"
                            />
                            <span>分钟提醒警告</span>
                        </a-form-model-item>

                        <a-form-model-item
                            label="是否多次提醒"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            :wrapper-col="{ span: 18 }"
                            help=""
                        >
                            <a-radio-group v-model="formData.scenic.is_warn_only_once">
                                <a-radio :value="0"> 只提醒一次 </a-radio>
                                <a-radio :value="1"> 每天提醒一次 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item
                            label="状态"
                            :colon="false"
                            :labelCol="{ span: 3 }"
                            :wrapper-col="{ span: 18 }"
                            help=""
                        >
                            <a-radio-group v-model="formData.scenic.status">
                                <a-radio :value="0"> 关闭 </a-radio>
                                <a-radio :value="1"> 开启 </a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                    </a-card>
                    <a-divider style="height: 10px; background-color: #eef0f3" />
                </a-tab-pane>-->
            </a-tabs>
        </a-form-model>

        <div class="page-header">
            <a-button class="ml-20 mt-20 mb-20" type="primary" @click="submitForm()"> 保存 </a-button>
        </div>
    </div>
</template>

<script>
import warnMerchantIndexApi from '@/api/warn/merchant/index'

export default {
    components: {
    },
    data() {
        return {
            activeKey: '1',
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            formData: {
                mall: {
                    pigcms_id: 0, // 不填为新增数据，填写为编辑数据
                    min_num: 0, // 库存提醒最小阈值，多规格商品，只要有一个规格小于这个值就提醒
                    apply_after_sales_time: 0, // 申请售后订单超过多少分钟警告
                    is_warn_only_once: 1, // 是否只提醒一次：0只提醒一次，1每天提醒一次
                    status: 0, // 是否只提醒一次：0关闭，1开启
                }, // 新版商城配置
                shop: {
                    pigcms_id: 0, // 不填为新增数据，填写为编辑数据
                    min_num: 0, // 库存提醒最小阈值，多规格商品，只要有一个规格小于这个值就提醒
                    apply_after_sales_time: 0, // 申请售后订单超过多少分钟警告
                    is_warn_only_once: 1, // 是否只提醒一次：0只提醒一次，1每天提醒一次
                    status: 0, // 是否只提醒一次：0关闭，1开启
                }, // 外卖配置
                group: {
                    pigcms_id: 0, // 不填为新增数据，填写为编辑数据
                    min_num: 0, // 库存提醒最小阈值，多规格商品，只要有一个规格小于这个值就提醒
                    apply_after_sales_time: 0, // 申请售后订单超过多少分钟警告
                    is_warn_only_once: 1, // 是否只提醒一次：0只提醒一次，1每天提醒一次
                    status: 0, // 是否只提醒一次：0关闭，1开启
                }, // 团购配置
                appoint: {
                    pigcms_id: 0, // 不填为新增数据，填写为编辑数据
                    min_num: 0, // 库存提醒最小阈值，多规格商品，只要有一个规格小于这个值就提醒
                    apply_after_sales_time: 0, // 申请售后订单超过多少分钟警告
                    is_warn_only_once: 1, // 是否只提醒一次：0只提醒一次，1每天提醒一次
                    status: 0, // 是否只提醒一次：0关闭，1开启
                }, // 预约配置
                scenic: {
                    pigcms_id: 0, // 不填为新增数据，填写为编辑数据
                    min_num: 0, // 库存提醒最小阈值，多规格商品，只要有一个规格小于这个值就提醒
                    apply_after_sales_time: 0, // 申请售后订单超过多少分钟警告
                    is_warn_only_once: 1, // 是否只提醒一次：0只提醒一次，1每天提醒一次
                    status: 0, // 是否只提醒一次：0关闭，1开启
                }, // 新版景区配置
            },
            canSave: true,
        }
    },
    mounted() {
        this.activeKey = '1'

        this.getWarnConfigDetail()
    },
    activated() {
        this.activeKey = '1'

        this.getWarnConfigDetail()
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        // 获取列表信息
        initList() {
            this.getWarnConfigDetail()
        },
        onTabChange(key) {
            this.activeKey = key
        },
        onTableCancel() {
            this.modalTable = false
        },
        // 获取提醒配置详情
        getWarnConfigDetail() {
            this.request(warnMerchantIndexApi.getConfig,{}).then((res) => {
                this.formData = {
                    ...res
                }
                // 新版商城
                this.formData.mall.pigcms_id = res.mall.pigcms_id
                this.formData.mall.min_num = res.mall.min_num
                this.formData.mall.apply_after_sales_time = res.mall.apply_after_sales_time
                this.formData.mall.is_warn_only_once = res.mall.is_warn_only_once
                this.formData.mall.status = res.mall.status

                // 外卖
                this.formData.shop.pigcms_id = res.shop.pigcms_id
                this.formData.shop.min_num = res.shop.min_num
                this.formData.shop.apply_after_sales_time = res.shop.apply_after_sales_time
                this.formData.shop.is_warn_only_once = res.shop.is_warn_only_once
                this.formData.shop.status = res.shop.status

                // 团购
                this.formData.group.pigcms_id = res.group.pigcms_id
                this.formData.group.min_num = res.group.min_num
                this.formData.group.apply_after_sales_time = res.group.apply_after_sales_time
                this.formData.group.is_warn_only_once = res.group.is_warn_only_once
                this.formData.group.status = res.group.status

                // 预约
                this.formData.appoint.pigcms_id = res.appoint.pigcms_id
                this.formData.appoint.min_num = res.appoint.min_num
                this.formData.appoint.apply_after_sales_time = res.appoint.apply_after_sales_time
                this.formData.appoint.is_warn_only_once = res.appoint.is_warn_only_once
                this.formData.appoint.status = res.appoint.status

                // 新版景区
                this.formData.scenic.pigcms_id = res.scenic.pigcms_id
                this.formData.scenic.min_num = res.scenic.min_num
                this.formData.scenic.apply_after_sales_time = res.scenic.apply_after_sales_time
                this.formData.scenic.is_warn_only_once = res.scenic.is_warn_only_once
                this.formData.scenic.status = res.scenic.status
            })
        },
        // 提交表单
        submitForm() {
            // 新增普通团购商品-提交
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.canSave = false
                    this.request(warnMerchantIndexApi.saveConfig, this.formData)
                        .then((data) => {
                            this.activeKey = '1'
                            if (!this.$route.query.group_id) {
                                Object.assign(this.$data, this.$options.data())
                            }

                            this.$message.success('提交成功！', 2, () => {
                                this.getWarnConfigDetail();
                            })
                        })
                        .catch((err) => {
                            this.canSave = true
                        })
                } else {
                    return false
                }
            })
        },
    },
}
function isEmpty(val) {
    return typeof val === 'undefined' || val === null || val === ''
}
</script>

<style scoped>
.page {
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    background: #ffffff;
}
.page-header {
    background-color: #eef0f3;
    padding: 14px 16px;
}
.page-header.ant-page-header >>> .ant-page-header-heading-title {
    font-size: 18px !important;
    color: #333333;
}
.ant-form >>> .ant-input-number {
    width: 70px;
    margin: 0 6px;
}
.ant-form >>> .ant-form-item label {
    margin-right: 20px;
}
.ant-upload-select-picture-card i {
    font-size: 20px;
    color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #999;
}
.clearfix >>> .ant-upload-list {
    margin-bottom: 0 !important;
}
.input-class {
    width: calc(100% - 80px);
}
.ant-card >>> .ant-card-body {
    padding: 10px 24px;
}
.questionIcon {
    width: 14px;
    height: 14px;
    border-radius: 14px;
    background-color: #dddddd;
    margin-left: 4px;
}
.singleSpecDel {
    position: absolute;
    right: 0;
    margin-right: -50px;
    color: red;
}
.spec-tab {
    width: 90%;
    min-height: 50px;
    background-color: #f8f9fa;
}
</style>
