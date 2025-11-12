<template>
    <a-modal title="报警工单设置" :visible="visible" @ok="handleOk" @cancel="handleCancel">
        <a-alert message="报警工单设置启用后，设备报警记录会根据绑定的工单类目、工单分类，在工单处理中心显示"></a-alert>
        <a-form-model style="margin-top: 10px;" ref="ruleForm" :model="addForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item label="保警工单设置" prop="switch_on">
                <a-switch checked-children="启用" un-checked-children="禁用" v-model="switchVal" @change="onCheckedChange" />
            </a-form-model-item>
            <a-form-model-item label="工单类目" prop="repair_cate_id">
                <a-select style="width: 100%;" v-model="addForm.repair_cate_id" placeholder="请选择" @change="(value)=>handleSelectChange(value, 'cate')">
                    <a-select-option v-for="(item, index) in cateList" :key="index" :value="item.category_id">
                       {{item.subject_name}}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item label="工单分类" prop="repair_cate_sub_id">
                <a-select style="width: 100%;" v-model="addForm.repair_cate_sub_id" placeholder="请选择" @change="(value)=>handleSelectChange(value, 'sub')">
                    <a-select-option v-for="(item, index) in subList" :key="index" :value="item.id">
                       {{item.name}}
                    </a-select-option>
                </a-select>
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
            }
        },
        
        watch: {
            visible: {
                handler(val){
                    if(val){
                        this.getSubject()
                        this.getDetail()
                    }
                },
                immediate: true
            }
        },
        data() {
            return {
                switchVal: false,
                labelCol: { span: 6 },
                wrapperCol: { span: 16 },
                protocolList: [],
                rules: {
                    switch_on: [{ required: false, message: '请选择' }],
                    repair_cate_id: [{ required: true, message: '请选择' }],
                    repair_cate_sub_id: [{ required: true, message: '请选择' }],
                },
                addForm: {
                    switch_on: 0,
                    repair_cate_id: undefined,
                    repair_cate_sub_id: undefined,
                },
                cateList: [],
                subList: []
            }
        },
        
        methods: {
            handleOk(){
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.request('/community/village_api.AlarmDevice/setAlarmNewRepair', this.addForm).then(res=>{
                            this.$message.success('设置成功!')
                            this.$emit('close')
                        })
                    }
                });
            },
            handleCancel(){
                this.$emit('close')
                this.addForm = {
                    switch_on: 0,
                    repair_cate_id: undefined,
                    repair_cate_sub_id: undefined
                }
                this.$refs.ruleForm.resetFields();
            },
            onCheckedChange(val){
                this.addForm.switch_on = val?1:0
            },
            
            getCate(category_id){
                this.request('/community/village_api.RepairCenter/getCate', {category_id,}).then(res=>{
                    this.subList = res
                })
            },
            
            getSubject(){
                this.request('/community/village_api.RepairCate/getSubject', {}).then(res=>{
                    this.cateList = res
                })
            },
            
            getDetail(){
                this.request('/community/village_api.AlarmDevice/getAlarmNewRepair', {}).then(res=>{
                    this.switchVal = res.setInfo.switch_on?true:false
                    this.addForm.switch_on = res.setInfo.switch_on
                    if(res.setInfo.repair_cate_id){
                        this.getCate(res.setInfo.repair_cate_id)
                    }
                    this.addForm.repair_cate_id = res.setInfo.repair_cate_id
                    this.addForm.repair_cate_sub_id = res.setInfo.repair_cate_sub_id
                })
            },
            
            handleSelectChange(value, type){
                if(type == 'cate'){
                    this.addForm.repair_cate_id = value
                    this.subList = []
                    this.addForm.repair_cate_sub_id = undefined
                    this.getCate(value)
                } else {
                    this.addForm.repair_cate_sub_id = value
                }
            }
            
        },
    }
</script>

<style lang="less" scoped>
</style>
