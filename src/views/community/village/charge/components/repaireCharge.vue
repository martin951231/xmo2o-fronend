<template>
    <a-modal title="修改费用" :visible="visible" :width="500" @ok="handleOk" @cancel="handleCancel" centered>
        <a-form-model ref="ruleForm" :model="repaireForm" :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-model-item label="应收费用" prop="need_money">
                {{repaireInfo.modify_money}}
            </a-form-model-item>
            <a-form-model-item label="修改后费用" prop="modify_money">
                <a-input v-model="repaireForm.modify_money" placeholder="请输入" />
            </a-form-model-item>
            <a-form-model-item label="修改原因" prop="modify_reason">
                <a-textarea :rows="4" v-model="repaireForm.modify_reason" placeholder="请输入修改原因" :autosize="true" />
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>

<script>
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            repaireInfo: {
                type: Object,
                default: () => {return {}}
            }
        },
        
        watch: {
            visible: {
                handler(val){
                    if(val){
                        console.log('repaireInfo===>', this.repaireInfo)
                    }
                }
            }
        },
        
        data() {
            return {
                labelCol: { span: 6 },
                wrapperCol: { span: 16 },
                repaireForm: {
                    modify_money: '',
                    modify_reason: ''
                },
                rules: {
                    modify_money: [{ required: true, message: '请输入修改后费用', trigger: 'blur' },],
                    modify_reason: [{ required: true, message: '请输入修改原因', trigger: 'blur' },]
                }
            }
        },
        methods: {
            clearForm(){
                this.repaireForm = {
                    modify_money: '',
                    modify_reason: ''
                }
            },
            handleOk() {
                let that = this
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let params = {}
                        Object.assign(params, that.repaireForm)
                        params.order_id = that.repaireInfo.order_id
                        params.position_id = that.repaireInfo.position_id
                        params.project_id = that.repaireInfo.project_id
                        params.room_id = that.repaireInfo.room_id
                        that.request('/community/village_api.Cashier/modifyMoney', params).then(res=>{
                            that.$message.success('修改成功！')
                            that.clearForm()
                            that.$emit('close', true)
                        }).catch(err=>{
                        })
                    }
                });
            },
            handleCancel() {
                this.$refs.ruleForm.resetFields();
                this.clearForm()
                this.$emit('close')
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ textarea {
        height: 70px !important;
        overflow-x: hidden;
        overflow-y: scroll !important;
        resize: none; /* 禁止拉伸 */
    }
</style>