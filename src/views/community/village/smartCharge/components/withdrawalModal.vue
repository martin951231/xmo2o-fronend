<template>
    <a-modal
        :title="title"
        :visible="visible"
        :width="700"
        :footer="title=='审核'?undefined:null"
        @ok="handleOk"
        @cancel="handleCancel">
        <a-form-model ref="ruleForm" :model="formObj" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-model-item label="提现单号">
                <a-input :disabled="true" placeholder="请输入" v-model="formObj.id" />
            </a-form-model-item>
            <a-form-model-item label="申请人">
                <a-input :disabled="true" placeholder="请输入" v-model="formObj.name" />
            </a-form-model-item>
            <a-form-model-item label="真实姓名">
                <a-input :disabled="true" placeholder="" v-model="formObj.true_name" />
            </a-form-model-item>
            <a-form-model-item label="手机号">
                <a-input :disabled="true" placeholder="请输入" v-model="formObj.phone" />
            </a-form-model-item>
            <a-form-model-item label="申请时间">
                <a-input :disabled="true" placeholder="请输入" v-model="formObj.add_time" />
            </a-form-model-item>
            <a-form-model-item label="申请金额">
                <a-input :disabled="true" placeholder="请输入" v-model="formObj.refund_money" />
            </a-form-model-item>
            <a-form-model-item label="申请提现理由">
                <a-textarea :disabled="true" style="padding: 5px width:200px; height: 100px; resize:none;" placeholder="请输入" v-model="formObj.refund_reason" />
            </a-form-model-item>
            
            <a-form-model-item label="提现至">
                <a-select :disabled="true" :value="formObj.refundType" @change="selectChange">
                  <a-select-option v-for="(item, index) in typeList" :value="item.value" :key="index">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
            </a-form-model-item>
            
            <a-form-model-item label="审核结果" v-if="title=='查看'">
                <span v-if="formObj.status == 3" style="color: green;">审核通过</span>
                <span v-if="formObj.status == 4" style="color: red;">审核拒绝</span>
            </a-form-model-item>
            
            <a-form-model-item label="拒绝原因" v-if="title=='审核'">
                <a-textarea style="padding: 5px width:200px; height: 100px; resize:none;" placeholder="请输入" v-model="formObj.reason" />
            </a-form-model-item>
            
            <a-form-model-item label="状态" v-if="title=='审核'">
                <a-radio-group name="radioGroup" v-model="formObj.status">
                    <a-radio :value="3">同意</a-radio>
                    <a-radio :value="4">拒绝</a-radio>
                </a-radio-group>
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
                    name: '',
                    phone: '',
                    add_time: '',
                    refund_money: '',
                    refund_reason: '',
                    refundType: '',
                    status: 3,
                    true_name:'',
                },
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
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
            title:{
                type: String,
                default: ''
            }
        },
        watch:{
            visible: {
                handler(val){
                    if(val){
                        this.getDetail(this.id)
                    }
                },
                immediate: true
            }
        },
        
        methods: {
            getDetail(id){
                let that = this
                that.request('/community/village_api.Pile/getWithdrawInfo ', {id, }).then(res => {
                    that.formObj = res
                })
            },
            handleOk(){
                let that = this
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.formObj.id = that.id
                        that.request('/community/village_api.Pile/checkWithdraw', that.formObj).then(res => {
                            that.$message.success("审核成功！")
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
                    name: '',
                    phone: '',
                    add_time: '',
                    refund_money: '',
                    refund_reason: '',
                    refundType: '',
                    status: 3,
                    true_name:'',
                }
                that.$emit("close", false)
            },
            selectChange(value){
                this.formObj.refundType = value
                this.$forceUpdate()
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ textarea{
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
</style>