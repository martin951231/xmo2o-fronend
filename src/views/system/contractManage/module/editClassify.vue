<template>
    <a-modal
        :title="classifyInfo.id?'编辑类别':'添加类别'"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel">
        <a-form-model ref="ruleForm" :model="classifyForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="类型名称" prop="name">
                <a-input v-model="classifyForm.name" placeholder="请输入"/>
            </a-form-model-item>
            <a-form-model-item label="类型名称" prop="status">
                <a-radio-group v-model="classifyForm.status">
                    <a-radio :value="1">启用</a-radio>
                    <a-radio :value="2">禁用</a-radio>
                </a-radio-group>
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>

<script>
    export default{
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            classifyInfo: {
                type: Object,
                default: ()=>{return {}}
            }
        },
        
        watch: {
            visible: {
                handler(val){
                    if(val && this.classifyInfo.id){
                        Object.assign(this.classifyForm, this.classifyInfo)
                    }
                }
            }
        },
        
        data(){
            return{
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
                confirmLoading: false,
                classifyForm: {
                    name: '',
                    status: undefined
                },
                rules: {
                    name: [{ required: true, message: '必填', trigger: 'change' }],
                    status: [{ required: true, message: '必填', trigger: 'change' }]
                }
            }
        },
        
        methods: {
            handleOk(){
                this.$refs.ruleForm.validate(valid => {
                    let params = {}
                    Object.assign(params, this.classifyForm)
                    if(valid){
                        this.confirmLoading = true
                        this.request('/community/platform.contract.Classify/setClassifyInfo', params).then(res=>{
                            if(params.id){
                                this.$message.success('编辑成功！')
                            } else {
                                this.$message.success('添加成功！')
                            }
                            this.confirmLoading = false
                            this.clearForm()
                            this.$emit('close', true)
                        }).catch(err=> {
                            this.confirmLoading = false
                        })
                    }
                })
            },
            
            clearForm(){
                this.classifyForm = {
                    name: '',
                    status: undefined
                }
            },
            
            handleCancel(){
                this.clearForm()
                this.$refs.ruleForm.resetFields();
                this.$emit('close')
            },
        }
    }
</script>

<style lang="less" scoped>
</style>