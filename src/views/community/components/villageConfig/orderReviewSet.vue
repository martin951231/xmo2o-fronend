<template>
    <div class="order_review_set">
        <a-alert type="info" show-icon>
            <template slot="description">
                <div class="title" style="font-weight: bold;">提示说明</div>
                <div class="desc">1、设置应收账单的作废、已缴账单的退款的审核管理人员</div>
                <div class="desc">2、退款审核流程从上往下进行设置，最多可以设置5人进行审核。审核流程可根据当前角色减少申请流程（只有设置的审批人发起作废或退款会减少审核流程）</div>
                <div class="desc">例：收银台客服发起退款申请流程→客服主管审核→物业经理审核→物业总经理审核→财务主管审核</div>
                <div class="desc">例：收银台物业经理发起退款申请流程→物业总经理审核→财务主管审核</div>
            </template>
        </a-alert>
        <a-form-model ref="ruleForm" :model="orderReviewForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-model-item label="是否开启订单退款（作废）审核流程" prop="refund_order_check_open"
                extra="有在审核的流程未结束（由admin-染坊社区发起的作废审核，订单ID为80886），不可改动相关设置">
                <a-radio-group name="radioGroup" v-model="orderReviewForm.refund_order_check_open">
                    <a-radio :value="0">关闭</a-radio>
                    <a-radio :value="1">开启</a-radio>
                </a-radio-group>
            </a-form-model-item>

            <a-form-model-item label="添加审批人">
                <div class="select_container">
                    <div class="select_item" v-for="(item, index) in selectList" :key="index">
                        <a-select show-search placeholder="请选择智能访客开门最长时效" style="width: 200px"
                            @change="(value)=>handleChange(value, index)">
                            <a-select-option :value="1">测试一</a-select-option>
                            <a-select-option :value="2">测试二</a-select-option>
                        </a-select>
                        <a-button @click="operateThis(item, index)" style="margin-left: 10px;"
                            :type="index==0?'primary':'danger'">{{index==0?'增加':'删除'}}</a-button>
                    </div>
                </div>
            </a-form-model-item>

            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" @click="onSubmit">保存</a-button>
                <a-button style="margin-left: 10px;" @click="resetForm">重置</a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        reactive,
        onMounted,
        defineComponent
    } from '@vue/composition-api';
    export default defineComponent({
        name: 'orderReviewSet',
        setup(props, context) {
            let valueArr = ref([])
            let selectList = ref([{
                value: '',
                index: 0
            }])
            let orderReviewForm = ref({})
            let ruleForm = ref(null)
            const labelCol = ref({
                span: 4
            })
            const wrapperCol = ref({
                span: 14
            })
            const rules = reactive({})
            const onSubmit = () => {
                Vue.prototype.$confirm({
                    title: '提示',
                    content: '确定要保存此表单内容吗？',
                    onOk() {
                        ruleForm.value.validate(valid => {
                            if (valid) {
                                saveForm()
                            }
                        })
                    },
                    onCancel() {},
                });
            }

            const resetForm = () => {
                orderReviewForm.value = {}
                ruleForm.value.resetFields()
            }

            const saveForm = () => {
                Vue.prototype.request('/community/village_api.VillageConfig/villageInfoUpdate',
                    orderReviewForm.value).then((res) => {
                    Vue.prototype.$message.success('保存成功！')
                })
            }

            const operateThis = (item, index) => {
                let flag = false
                valueArr.value.map(v => {

                })
                if (index == 0) {
                    selectList.value.push({
                        value: '',
                        index: selectList.value.length
                    })
                } else {
                    selectList.value.splice(index, 1)
                    valueArr.value.splice(index, 1)
                }
                console.log('selectList.value===>', selectList.value)
            }

            const handleChange = (value, index) => {
                valueArr.value[index] = value
            }

            onMounted(() => {

            })

            return {
                selectList,
                orderReviewForm,
                ruleForm,
                labelCol,
                wrapperCol,
                rules,
                onSubmit,
                resetForm,
                saveForm,
                handleChange,
                operateThis,
                valueArr
            }
        }
    })
</script>

<style lang="less" scoped>
    .order_review_set {
        width: 100%;
    }
</style>
