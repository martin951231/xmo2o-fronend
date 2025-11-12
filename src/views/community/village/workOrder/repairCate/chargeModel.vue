<template>
    <a-modal title="收费设置" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel" width="800px">
       <a-alert message="工单类别为选中状态时，新版工单启用收费流程；工单类别未选中状态时，新版工单不启用收费流程。" type="info"  banner  style="margin-top: -10px;margin-bottom: 10px;"/>
       <a-alert message="工单类别在启用收费流程操作时，该工单类别下的工单必须全部是已关闭状态或没有工单时，才能启用成功。" type="info"  banner  style="margin-top: -10px;margin-bottom: 10px;"/>
       <a-alert message="工单类别在关闭收费流程操作时，该工单类别下的工单必须全部是已关闭状态或没有工单时，才能关闭成功。" type="info"  banner  style="margin-top: -10px;margin-bottom: 10px;"/>
       <a-form-model :model="chargeForm" :rules="rules" ref="ruleForm" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="工单类目" prop="subject_id">
                <a-tree
                :tree-data="treeData"
                :default-expand-all="defaultExpandAll"
                :defaultExpandedKeys="['0-0']"
                v-model="chargeForm.subject_id"
                checkable />
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>

<script>
    import villageApi from "@/api/community/village";
    export default{
        props: {
            visible: {
                type: Boolean,
                default: false
            },
        },
        data(){
            return{
                rules: {subject_id: [{ required: false, message: '请选择工单类目', trigger: 'blur' }]},
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                chargeForm: {charge_type:1, subject_id:[]},
                treeData: [],
                defaultExpandAll: true,
                confirmLoading: false
            }
        },
        
        mounted(){
            this.getRepairCharge()
        },
        
        methods: {
            getRepairCharge(){
                let that = this
                that.request(villageApi.getRepairCharge).then((res) => {
                    that.treeData = res.res;
                    that.chargeForm.subject_id = res.subject_ids
                    that.defaultExpandAll = false; //默认只展开第一级
                })
            },
            
            handleOk(){
                let that = this
                that.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let that = this
                        that.confirmLoading = true
                        that.request(villageApi.setRepairCharge, that.chargeForm).then((res) => {
                            that.$message.success('设置成功！')
                            that.handleCancel()
                            that.confirmLoading = false
                        }).catch(e=>{
                            that.confirmLoading = false
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            
            handleCancel(){
                this.$refs.ruleForm.resetFields();
                this.chargeForm = {charge_type:1, subject_id:[]}
                this.$emit('closeCharge')
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>
