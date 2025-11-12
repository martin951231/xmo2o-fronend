<template>
    <a-modal
        title="编辑卡号"
        :visible="visible"
        :width="600"
        @ok="handleOk"
        @cancel="handleCancel">
        <a-form-model ref="ruleForm" :model="formObj" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-model-item label="逻辑卡号" prop="card_no">
                <a-input placeholder="请输入" v-model="formObj.card_no" />
            </a-form-model-item>
            <a-form-model-item label="物理卡号" prop="pile_card_no">
                <a-input placeholder="请输入" v-model="formObj.pile_card_no" />
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
                    card_no: '',
                    pile_card_no: ''
                },
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
                rules: {
                    card_no: [{required: true, message: '请输入', trigger: 'blur'}],
                    pile_card_no: [{required: true, message: '请输入', trigger: 'blur'}]
                }
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
            }
        },
        watch:{
            visible: {
                handler(val){
                    if(val){
                        console.log('qwertyui===>', this.id)
                        this.getDetail(this.id)
                    }
                },
                immediate: true
            }
        },
        
        methods: {
            getDetail(id){
                let that = this
                that.request('/community/village_api.Pile/getUserCardInfo ', {id, }).then(res => {
                    that.formObj = res
                })
            },
            handleOk(){
                let that = this
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.formObj.id = that.id
                        that.request('/community/village_api.Pile/editUserCard', that.formObj).then(res => {
                            that.$message.success("保存成功！")
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
                    card_no: '',
                    pile_card_no: ''
                }
                that.$emit("close", false)
            },
        }
    }
</script>

<style>
</style>