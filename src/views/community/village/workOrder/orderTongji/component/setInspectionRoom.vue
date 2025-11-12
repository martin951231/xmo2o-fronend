<template>
    <a-modal title="督查室设置" :visible="visible" :width="600" @cancel="onClose" @ok="onSubmit">
        <a-alert message="督查室通知人员启用后，小区上报到督查室的工单由设置的人员接收模板信息" />
        <a-form-model ref="ruleForm" :model="workerForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="督查室通知人员设置" prop="notice_switch">
                <a-radio-group name="radioGroup" v-model="workerForm.notice_switch">
                    <a-radio :value="1">开启</a-radio>
                    <a-radio :value="2">关闭</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="管理员" prop="notice_admin_name">
                <a-select v-model="workerForm.notice_admin_name" show-search @change="handleSelectChange"
                    placeholder="请选择管理人员">
                    <a-select-option v-for="(item,index) in userList" :key="index" :value="item.name+'-'+item.id">
                        {{item.name}}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
        </a-form-model>
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    import villageApi from "@/api/community/village"
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        
        watch: {
            visible: {
                handler(val){
                    if(val){
                        this.getUserList()
                    }
                }
            }
        },
        
        data() {
            return {
                userList: [],
                workerForm: {
                    notice_switch: 1,
                    notice_admin_id: undefined,
                    notice_admin_name: undefined
                },
                labelCol: {
                    span: 8
                },
                wrapperCol: {
                    span: 14
                },
                rules: {
                    notice_switch: [{required: true, message: '请选择'} ],
                    notice_admin_name: [{required: true, message: '请选择'} ]
                },
            }
        },

        methods: {
            getUserList(){
                this.request('/community/platform.RepairWorkOrder/getAdminList').then(res=> {
                    this.userList = res.list
                    this.getConfig()
                })
            },
            onClose(){
                this.$refs.ruleForm.resetFields();
                this.workerForm = {
                    notice_switch: 1,
                    notice_admin_id: undefined,
                    notice_admin_name: undefined
                }
                this.$emit('close')
            },
            
            onSubmit(){
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        let params = {}
                        params.notice_switch = this.workerForm.notice_switch
                        params.notice_admin_id = this.workerForm.notice_admin_id
                        this.request('/community/platform.RepairWorkOrder/setSupervisionConfig', params).then(res=> {
                            this.$message.success('设置成功！')
                            this.$emit('close')
                        })
                    }
                });
                
            },
            getConfig(){
                this.request('/community/platform.RepairWorkOrder/getSupervisionConfig').then(res=> {
                    this.workerForm = res.config
                    let index = this.userList.findIndex(v=>v.id == res.config.notice_admin_id)
                    if(index != -1){
                        this.workerForm.notice_admin_name = this.userList[index].name + '-' + this.userList[index].id
                    }
                })
            },
            handleSelectChange(value){
                let index = this.userList.findIndex(v=>v.name+'-'+v.id == value);
                if(index != -1){
                    this.workerForm.notice_admin_id =this.userList[index].id
                }
                this.$forceUpdate()
            }
        },
    }
</script>

<style lang="less" scoped>
    
</style>
