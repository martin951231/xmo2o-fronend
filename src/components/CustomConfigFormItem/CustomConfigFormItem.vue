<template>
    <div class="custom-form">
        <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol" v-if="formShow">
            <div v-for="(item,index) in formDataList" :key="index" class="custom-item">
                <a-form-model-item label=" " :colon="false">
                    <div class="title">
                        <span class="mr-10">{{L('配送时间段') + (index+1)}}</span>
                        <a-popconfirm :title="L('是否删除？')" :ok-text="L('是')" :cancel-text="L('否')" @confirm="popconfirm(item,index)">
                            <a-button size="small" type="danger">{{L('删除')}}</a-button>
                        </a-popconfirm>
                    </div>
                </a-form-model-item>
                <a-form-model-item :label="L('配送时间段')">
                    <a-row :gutter="8">
                        <a-col :span="12">
                            <a-time-picker
                                :format="timeFormat"
                                :value="item.start_time?moment(item.start_time, timeFormat):null"
                                :default-open-value="moment('00:00:00', timeFormat)"
                                @change="onTimeChange($event,'start_time',index)"
                            />
                            <span class="ml-10 mr-10">-</span>
                            <a-time-picker
                                :format="timeFormat"
                                :value="item.end_time?moment(item.end_time, timeFormat):null"
                                :default-open-value="moment('00:00:00', timeFormat)"
                                @change="onTimeChange($event,'end_time',index)"
                            />
                        </a-col>
                    </a-row>
                </a-form-model-item>
                <a-form-model-item :label="L('初始重量')">
                    <a-row :gutter="8">
                        <a-col :span="12">
                            <a-input-number v-model="item.delivery_weight" :min="0" class="input-number" />
                        </a-col>
                        <a-tooltip placement="right">
                            <template slot="title">
                                <span>{{item.delivery_weight_desc}}</span>
                            </template>
                            <a-icon type="question-circle" />
                        </a-tooltip>
                    </a-row>
                </a-form-model-item>
                <a-form-model-item :label="L('超出重量每公斤费用')">
                    <a-row :gutter="8">
                        <a-col :span="12">
                            <a-input-number v-model="item.per_weight_fee" :min="0" class="input-number" />
                        </a-col>
                        <a-tooltip placement="right">
                            <template slot="title">
                                <span>{{item.per_weight_fee_desc}}</span>
                            </template>
                            <a-icon type="question-circle" />
                        </a-tooltip>
                    </a-row>
                </a-form-model-item>
                <a-form-model-item :label="L('起步配送费')">
                    <a-row :gutter="8">
                        <a-col :span="12">
                            <a-input-number v-model="item.delivery_fee" :min="0" class="input-number" />
                        </a-col>
                        <a-tooltip placement="right">
                            <template slot="title">
                                <span>{{item.delivery_fee_desc}}</span>
                            </template>
                            <a-icon type="question-circle" />
                        </a-tooltip>
                    </a-row>
                </a-form-model-item>
                <a-form-model-item :label="L('初始公里')">
                    <a-row :gutter="8">
                        <a-col :span="12">
                            <a-input-number v-model="item.delivery_distance" :min="0" class="input-number" />
                        </a-col>
                        <a-tooltip placement="right">
                            <template slot="title">
                                <span>{{item.delivery_distance_desc}}</span>
                            </template>
                            <a-icon type="question-circle" />
                        </a-tooltip>
                    </a-row>
                </a-form-model-item>
                <a-form-model-item :label="L('超出每公里配送费')">
                    <a-row :gutter="8">
                        <a-col :span="12">
                            <a-input-number v-model="item.per_km_fee" :min="0" class="input-number" />
                        </a-col>
                        <a-tooltip placement="right">
                            <template slot="title">
                                <span>{{item.per_km_fee_desc}}</span>
                            </template>
                            <a-icon type="question-circle" />
                        </a-tooltip>
                    </a-row>
                </a-form-model-item>
            </div>
            <a-form-model-item label=" " :colon="false" v-if="tabId == 'village_group_deliver_custom'">
                <a-button size="small" type="primary" @click="addFormItem">{{L('添加配送时间段')}}</a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    props: {
        list: {
            type: Array,
            default: [],
        },
        //  左侧标题占空
        labelCol: {
            type: Object,
            default: function () {
                return { lg: { span: 6 }, sm: { span: 7 } }
            },
        },
        // 右侧表单填写项占空
        wrapperCol: {
            type: Object,
            default: function () {
                return { lg: { span: 14 }, sm: { span: 17 } }
            },
        },
        formMaxNum: {
            type: Number,
            default: -1,
        },
        tabId: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: '',
        },
        formName: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            form: {},
            form_initial: {},
            timeFormat: 'HH:mm',
            formShow: false,
            formDataList: [], //表单列表
        }
    },
    mounted() {
        //社区团购别名自定义配送费计算配置
        if (this.tabId == 'village_group_deliver_custom' && this.type == 'custom') {
            this.formDataList = JSON.parse(JSON.stringify(this.list))
            this.form_initial = {
                start_time: '00:00',
                end_time: '00:00',
                delivery_weight: 0,
                delivery_weight_desc: '平台初始重量 (kg)',
                per_weight_fee: 0,
                per_weight_fee_desc: '超出初始重量时收取的费用 (单位:元)',
                delivery_distance: 0,
                delivery_distance_desc: '平台初始距离（km）',
                delivery_fee: 0,
                delivery_fee_desc: '平台配送时收取每单在起步范围内的配送费',
                per_km_fee: 0,
                per_km_fee_desc: '超出起步距离的路程每公里的单价',
            }
            this.form = JSON.parse(JSON.stringify(this.form_initial))
            this.formShow = true
        }
        //等多类型...
    },

    methods: {
        moment,
        //获取提交值
        getFormData() {
            let params = {}
            //社区团购自定义配送费计算配置
            if (this.tabId == 'village_group_deliver_custom') {
                params[this.formName] = this.formDataList
            }
            return params
        },
        //选择时间改变事件
        onTimeChange(e, type, index) {
            this.formDataList[index][type] = moment(e).format(this.timeFormat)
        },
        //控制表单是否显隐
        initFormShow(boolean) {
            this.formShow = boolean
        },
        //添加
        addFormItem() {
            //社区团购自定义配送费计算配置
            if (this.tabId == 'village_group_deliver_custom') {
                if (this.formDataList.length < this.formMaxNum && this.formMaxNum != -1) {
                    this.formDataList.push(JSON.parse(JSON.stringify(this.form_initial)))
                } else {
                    this.$message.info(this.L('最多添加3个配送时间段'))
                }
            }
        },
        //删除
        deleteFormItem(item, index) {
            this.$delete(this.formDataList, index)
        },
        popconfirm(item, index) {
            this.deleteFormItem(item, index)
        },
    },
}
</script>

<style lang="less" scoped>
.custom-form {
    .custom-item {
        margin-bottom: 20px;
        background-color: #f8f8f8;
        border-radius: 4px;
        padding: 5px 0;
        .title {
            font-weight: bold;
            font-size: 16px;
            color: #333;
            display: flex;
            align-items: center;
        }
        .input-number {
            width: 100%;
        }
    }
}
</style>