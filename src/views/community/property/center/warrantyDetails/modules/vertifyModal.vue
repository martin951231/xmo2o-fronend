<template>
    <a-modal title="审核" :width="500" :visible="visible" :confirmLoading="confirmLoading" @cancel="onClose" @ok="handleOk" centered>
        <a-form-model :model="vertifyForm" layout="vertical" ref="ruleForm" :rules="rules">
            <a-form-model-item label="所属类别" prop="status">
                <a-radio-group v-model="vertifyForm.status">
                    <a-radio-button :value="1">审核通过</a-radio-button>
                    <a-radio-button :value="2">审核拒绝</a-radio-button>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="审核拒绝原因" prop="refuse_reason">
                <a-textarea placeholder="请输入" style="height: 100px; resize: none" v-model="vertifyForm.refuse_reason" />
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
            applyInfo: {
                type: Object,
                default: ()=>{return {}}
            }
        },
        
        watch: {
            visible: {
                handler(val){
                    if(val && this.applyInfo.id){
                        this.vertifyForm.id = this.applyInfo.id
                        this.vertifyForm.status = this.applyInfo.status
                        this.vertifyForm.refuse_reason = this.applyInfo.refuse_reason
                    }
                }
            }
        },
        
        data() {
            return {
                confirmLoading: false,
                vertifyForm: {
                    id: 0,
                    status: 1,
                    refuse_reason: '',
                },
                cateList: [],
                rules: {
                    status: [
                        { required: true, message: '请选择', trigger: 'change' },
                    ],
                    refuse_reason: [
                        { required: true, message: '请输入' },
                    ],
                },
            };
        },
        methods: {
            onClose(){
                this.$emit('close')
                this.clearForm()
            },
            
            clearForm(){
                this.vertifyForm = {
                    id: 0,
                    status: 1,
                    refuse_reason: '',
                }
                this.$refs.ruleForm.resetFields();
            },
            
            handleOk(){
                let that = this
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        that.confirmLoading = true
                        that.request('/community/property_api.workorder.CommunityQuality/checkApply', that.vertifyForm).then((res) => {
                            that.$message.success('审核成功')
                            that.confirmLoading = false
                            that.$emit('close', true)
                            that.clearForm()
                        }).catch(err=>{
                            that.confirmLoading = false
                        })
                    }
                });
            }
        },
    };
</script>

<style lang="less" scoped>
    /deep/ textarea {
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
</style>