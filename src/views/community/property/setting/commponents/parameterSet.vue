<template>
    <div class="paramiter_set">
        <a-alert message="提示信息" type="info">
            <template slot="description">
                <div class="desc_item">1、四舍五入：在设置保留的小数位基础上进行四舍五入的方法统计费用。</div>
                <div class="desc_item">2、全舍：保留了设置的小数位后，其余的小数全舍。</div>
                <div class="desc_item">3、当后台设置保留四位小数、三位小数、两位小数时，用户端，只展示两个数;当后台设置保留一位小数时，按照设置的值展示一个数</div>
                <div class="desc_item">4、预缴账单支付30分钟不缴费自动作废，和始终不作废两种模式</div>
            </template>
        </a-alert>
        <a-form-model ref="ruleForm" :model="parameterSetForm" :rules="rules" :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-form-model-item label="保留方式" prop="type">
                <a-radio-group v-model="parameterSetForm.type"> 
                    <a-radio :value="1">四舍五入</a-radio>
                    <a-radio :value="2">全舍</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="其他小数位数" prop="other_digit" extra="最多保留四位">
                <a-input-number :min="0" :max="4" class="form_width" v-model="parameterSetForm.other_digit" />
            </a-form-model-item>
            <a-form-model-item label="水电燃小数位数" prop="meter_digit" extra="最多保留四位">
                <a-input-number :min="0" :max="4" class="form_width" v-model="parameterSetForm.meter_digit" />
            </a-form-model-item>
            <a-form-model-item label="预缴账单作废" prop="deleteBillMin">
                <a-radio-group v-model="parameterSetForm.deleteBillMin">
                    <a-radio :value="0">不作废</a-radio>
                    <a-radio :value="30">30分钟作废</a-radio>
                </a-radio-group>
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 2 }">
                <a-button type="primary" @click="onSubmit">提交</a-button>
                <a-button style="margin-left: 10px;" @click="resetForm">重置</a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>

<script>
    import propertyApi from '@/api/community/property/packages';
    export default {
        name: 'parameterSet',
        data() {
            return {
                labelCol: {
                    span: 2
                },
                wrapperCol: {
                    span: 14
                },
                rules: {
                    type: [{
                        required: true,
                        message: '请选择保留方式',
                        trigger: 'blur'
                    }],
                    other_digit: [{
                        required: true,
                        message: '请输入其他小数位数',
                        trigger: 'blur'
                    }],
                    meter_digit: [{
                        required: true,
                        message: '请输入水电燃小数位数',
                        trigger: 'blur'
                    }],
                    deleteBillMin: [{
                        required: true,
                        message: '请选择预缴账单作废',
                        trigger: 'blur'
                    }],
                },
                parameterSetForm: {}
            }
        },
        mounted(){
            this.getParameterConfig()
        },
        methods: {
            getParameterConfig(){
                this.request(propertyApi.digitApi).then((res) => {
                    this.parameterSetForm = res
                    if(res.deleteBillMin == 0){
                        this.parameterSetForm.deleteBillMin = 0
                        return
                    }
                    if(!res.deleteBillMin){
                        this.parameterSetForm.deleteBillMin = 30
                    }
                })
            },
            
            onSubmit() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                       this.request(propertyApi.saveDigitApi, this.parameterSetForm).then((res) => {
                           this.$message.success('保存成功！')
                           this.getParameterConfig()
                       }) 
                    }
                });
            },
            resetForm() {
                this.parameterSetForm = {}
                this.$refs.ruleForm.resetFields();
            },
        },
    }
</script>

<style lang="less" scoped>
    .paramiter_set{
        .form_width{
            width: 300px;
        }
    }
    
    /deep/ .ant-alert{
        width: 60%;
    }
    
    /deep/ .ant-form label {
        width: 90px;
    }
</style>
