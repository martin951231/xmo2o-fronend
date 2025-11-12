<template>
    <a-modal title="收款" :visible="visible" :width="500" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel" centered>
        <a-form-model ref="ruleForm" :model="repaireForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-model-item label="收款方式" prop="pay_type">
                <a-select placeholder="请选择" style="width: 100%;" v-model="repaireForm.pay_type">
                   <!-- <a-select-option :value="1">
                        扫码支付
                    </a-select-option> -->
                    <a-select-option :value="2">
                        线下支付
                    </a-select-option>
                    <!-- <a-select-option :value="3">
                        扫码枪收款
                    </a-select-option> -->
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="线下支付方式" prop="offline_pay_type" v-if="repaireForm.pay_type == 2">
                <a-select placeholder="请选择" style="width: 100%;" v-model="repaireForm.offline_pay_type">
                    <a-select-option v-for="online in offline_pay_type_arr" :key="online.id">
                        {{ online.name }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="应收费用" prop="total_money">
                {{repaireInfo.total_money}}
            </a-form-model-item>
            <a-form-model-item label="合计实收费用" prop="pay_money">
                <div>{{ repaireInfo.pay_money }}<span style="color:#073397;">{{ (repaireInfo.discount_money>0 ? '（已减优惠：'+repaireInfo.discount_money+'）':'') }}</span></div>
            </a-form-model-item>
            <a-form-model-item label="备注" prop="remark">
                <a-textarea :rows="4" v-model="repaireForm.remark" placeholder="请输入备注" :autosize="true" />
            </a-form-model-item>
            <a-form-model-item label="微信扫码支付" prop="wx_pay" v-if="repaireForm.pay_type == 1 && payImage">
                <viewer :images="[payImage]">
                    <img style="width:100px" :src="payImage" title="点击放大查看" />
                </viewer>
            </a-form-model-item>
            <a-form-model-item label="生成收款码" prop="generate_code" v-if="repaireForm.pay_type == 1">
                <a-button type="primary" @click="generateErcode()">生成收款码</a-button>
            </a-form-model-item>
            <a-form-model-item label="付款码号" prop="pay_code" v-if="repaireForm.pay_type == 3">
                <a-input v-model="auth_code" @input="authCodePay(3)" placeholder="扫微信或支付宝付款码" />
            </a-form-model-item>
        </a-form-model>
        
        <print-order ref="PrintOrderModel"/>
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    import villageApi from '@/api/community/village';
    import PrintOrder from '@/views/community/village/charge/cashier/printOrder';
    import 'viewerjs/dist/viewer.css';
    import Viewer from 'v-viewer';
    Vue.use(Viewer)
    export default {
        components: {
            PrintOrder
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            repaireInfo: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            orderList: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },

        watch: {
            visible: {
                handler(val) {
                    if (val) {
                        this.getSelectList()
                    }
                }
            }
        },

        data() {
            return {
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 16
                },
                repaireForm: {
                    offline_pay_type: undefined,
                    pay_type: 2,
                    remark: ''
                },
                rules: {
                    pay_type: [{
                        required: true,
                        message: '请选择',
                        trigger: 'blur'
                    }, ],
                    offline_pay_type: [{
                        required: true,
                        message: '请选择',
                        trigger: 'blur'
                    }, ],
                    remark: [{
                        required: false,
                        message: '请输入修改原因',
                        trigger: 'blur'
                    }, ]
                },
                offline_pay_type_arr: [],
                payImage: '',
                auth_code: '',
                
                confirmLoading: false
            }
        },
        methods: {
            clearForm() {
                this.payImage = ''
                this.auth_code = ''
                this.repaireForm = {
                    offline_pay_type: undefined,
                    pay_type: 2,
                    remark: ''
                }
            },

            generateErcode() {
                let that = this
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let params = {}
                        Object.assign(params, that.repaireForm)
                        params.order_list = that.orderList
                        that.request('/community/village_api.CashierHangOrder/goPay', params).then(res => {
                            that.payImage = res.ticket
                        }).catch(err => {})
                    }
                });
            },

            handleOk() {
                let that = this
                that.confirmLoading = true
                that.$refs.ruleForm.validate(valid => {
                    if (that.repaireForm.pay_type == 2 && !that.repaireForm.offline_pay_type) {
                        that.$message.warn('请选择线下支付方式')
                        return
                    }
                    if (that.repaireForm.pay_type == 1) {
                        that.$message.warning('扫码支付微信扫描二维码即可完成支付')
                        return
                    }
                    if (that.repaireForm.pay_type == 3 && !that.auth_code) {
                        that.$message.warn('请选中付款码让用户扫描')
                        return
                    }
                    let params = {}
                    Object.assign(params, that.repaireForm)
                    params.order_list = that.orderList
                    params.auth_code = that.auth_code
                    params.model_type = 1
                    that.request('/community/village_api.CashierHangOrder/goPay', params).then((res) => {
                        that.confirmLoading = false
                        that.$message.success('收费成功')
                        that.checkPrint(1, that.orderList)
                        that.$refs.ruleForm.resetFields();
                        that.clearForm()
                        that.$emit('close', true)
                    }).catch((error) => {
                        that.confirmLoading = false
                    })
                })
            },

            handleCancel() {
                this.$refs.ruleForm.resetFields();
                this.clearForm()
                this.$emit('close')
            },

            getSelectList() {
                let that = this
                that.request(villageApi.getOfflineList, {}).then((res) => {
                    that.offline_pay_type_arr = res
                })
            },

            // 付款码支付
            authCodePay(pay_type) {
                let that = this
                if (that.auth_code == '') {
                    that.$message.error('请选中付款码让用户扫描')
                    return
                }

                if (that.auth_code.length < 18) {
                    return
                }

                // 农商行付款码位数19位，微信支付宝付款码位数18.其他位数的付款码先过滤
                if (that.auth_code.length != 18 && that.auth_code.length != 19) {
                    return
                }

                // 农商行是62开头，付款码位数19位
                if (that.auth_code.substring(0, 2) == '62' && that.auth_code.length < 19) {
                    return
                }

                that.request('/community/village_api.CashierHangOrder/goPay', {
                    order_list: that.orderList,
                    pay_type: that.repaireForm.pay_type,
                    auth_code: that.auth_code,
                    model_type: 1
                }).then((res) => {
                    if (res.status == 0) {
                        that.$message.error('支付失败')
                    } else if (res.status == 1) {
                        that.$message.success('收费成功')
                        that.handleCancel()
                    } else {
                        that.$message.warning('扫码成功，等待客户付款')
                        that.queryScanPay(res.info.paid_orderid, res.info.pay_type, res.info.summary_id)
                    }
                    that.handleCancel()
                })
            },

            checkPrint(type, data) {
                let that = this
                if (type == 1 && data.length == 0) {
                    return
                }
                that.request(villageApi.checkSetPrint).then((res) => {
                    let elements = []
                    if (res.template_id && res.template_id > 0) {
                        if ((type == 1 && data.length == 1) || type == 2) {
                            let tmp_elements = (type == 1) ? data[0] : data
                            if (tmp_elements.detail_order != undefined && tmp_elements.detail_order &&
                                tmp_elements.detail_order.length > 1) {
                                for (var ii = 0; ii < tmp_elements.detail_order.length; ii++) {
                                    elements.push({
                                        orderid: tmp_elements.detail_order[ii]['order_id'],
                                        pigcms_id: tmp_elements.detail_order[ii]['pigcms_id']
                                    })
                                    that.$refs.PrintOrderModel.add(0, res.template_id, 0, elements)
                                }
                            } else {
                                elements = tmp_elements
                                that.$refs.PrintOrderModel.add(elements.order_id, res.template_id, elements
                                    .pigcms_id, [])
                            }
                        } else {
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].detail_order != undefined && data[i].detail_order && data[i]
                                    .detail_order.length > 1) {
                                    for (var ii = 0; ii < data[i].detail_order.length; ii++) {
                                        elements.push({
                                            orderid: data[i].detail_order[ii]['order_id'],
                                            pigcms_id: data[i].detail_order[ii]['pigcms_id']
                                        })
                                    }
                                } else {
                                    elements.push({
                                        orderid: data[i]['order_id'],
                                        pigcms_id: data[i]['pigcms_id']
                                    })
                                }
                            }
                            that.$refs.PrintOrderModel.add(0, res.template_id, 0, elements)
                        }
                    }
                })
            },

            // 查询订单支付状态
            queryScanPay(paid_orderid, pay_type, summary_id) {
                let that = this
                that.request(villageApi.queryScanPay, {
                    order_no: paid_orderid,
                    pay_type: pay_type,
                    summary_id: summary_id
                }).then((res) => {
                    if (res.status == 0) {
                        that.$message.error('支付失败')
                    } else if (res.status == 1) {
                        that.$message.success('收费成功')
                        that.checkPrint(1, that.orderList)
                    } else {
                        that.queryScanPay(paid_orderid, pay_type, summary_id)
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ textarea {
        height: 70px !important;
        overflow-x: hidden;
        overflow-y: scroll !important;
        resize: none;
        /* 禁止拉伸 */
    }
</style>