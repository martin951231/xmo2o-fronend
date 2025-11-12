<template>
    <a-modal
        title="编辑卡号"
        :visible="visible"
        :width="600"
        @ok="handleOk"
        @cancel="handleCancel">
        <a-form-model ref="ruleForm" :model="formObj" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-model-item label="姓名">
                {{userInfo.name}}
            </a-form-model-item>
            <a-form-model-item label="手机号">
                {{userInfo.phone}}
            </a-form-model-item>
            <a-form-model-item label="钱包余额（元）">
                {{userInfo.current_money}}
            </a-form-model-item>
            <a-form-model-item label="申请金额" prop="current_money">
                <a-input placeholder="请输入金额" v-model="formObj.current_money" />
            </a-form-model-item>
            <a-form-model-item label="申请提现理由" prop="reason">
                <a-input placeholder="请输入提现理由" v-model="formObj.reason" />
            </a-form-model-item>
            <a-form-model-item label="真实姓名" extra="微信提现时必填">
                <a-input placeholder="请输入真实姓名" v-model="formObj.true_name" />
            </a-form-model-item>
            <a-form-model-item label="提现至" prop="type">
                <a-select :default-value="formObj.type" @change="selectChange">
                  <a-select-option v-for="(item, index) in typeList" :value="item.value" :key="index">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>

<script>
    export default {
        data(){
            return {
                formObj: {
                    id: '',
                    current_money: '',
                    reason: '',
                    type: 1,
                    true_name:'',
                },
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
                rules: {
                    current_money: [{required: true, message: '请输入', trigger: 'blur'}],
                    reason: [{required: true, message: '请输入', trigger: 'blur'}]
                },
                typeList: [{label: '微信', value: 1}, {label: '平台余额', value: 2}]
            }
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            id: {
                type: [String, Number],
                default: 0
            },
            userInfo: {
                type: Object,
                default: ()=>{return {}}
            }
        },
        methods: {
            handleOk(){
                let that = this
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.formObj.id = that.id
                        if(that.formObj.type*1==1 && !that.formObj.true_name){
                            that.$message.error("微信提现时，真实姓名必填！")
                            return false;
                        }
                        that.request('/community/village_api.Pile/withdraw', that.formObj).then(res => {
                            that.$message.success("提现成功！")
                            that.$emit("close", true)
                        })
                    }
                });
            },
            handleCancel(){
                let that = this
                that.$refs.ruleForm.resetFields()
                that.formObj = {
                    id: '',
                    current_money: '',
                    reason: '',
                    type: 1
                }
                that.$emit("close", false)
            },
            selectChange(value){
                this.formObj.type = value
                this.$forceUpdate()
            }
        }
    }
</script>

<style>
</style>