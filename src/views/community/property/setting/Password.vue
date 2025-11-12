<template>
    <div class="property_password">
        <a-form-model ref="ruleForm" :model="pwdForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item has-feedback label="原密码" prop="old_password" extra="不修改密码可不填写">
                <a-input style="width: 300px;" v-model="pwdForm.old_password" type="password" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item has-feedback label="新密码" prop="password" extra="不修改密码请留空，最少6个字符">
                <a-input style="width: 300px;" v-model="pwdForm.password" type="password" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item has-feedback label="确认密码" prop="confirm_password" extra="请再输入一次上面的新密码，以便确认输对了">
                <a-input style="width: 300px;" v-model="pwdForm.confirm_password" type="password" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 2 }">
                <a-button type="primary" @click="submitForm()">
                    提交
                </a-button>
                <a-button style="margin-left: 10px" @click="resetForm()">
                    重置
                </a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>

<script>
    import propertyApi from '@/api/community/property/packages';
    export default {
        name: "propertyPassword",
        data() {
            return {
                labelCol: {
                    span: 2
                },
                wrapperCol: {
                    span: 14
                },
                rules: {
                    old_password: [{
                        required: true,
                        message: '请输入原密码',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请输入新密码',
                        trigger: 'blur'
                    }],
                    confirm_password: [{
                        required: true,
                        message: '请确认新密码',
                        trigger: 'blur'
                    },{
                        validator: this.validate,
                        trigger: 'blur'
                    }],
                },
                pwdForm: {}
            }
        },
        methods: {

            validate(rule, value, callback) {
                if (this.pwdForm.password != this.pwdForm.confirm_password) {
                    callback(new Error('新密码与确认密码不一致'));
                }
                callback();
            },

            submitForm() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        if (this.pwdForm.password != this.pwdForm.confirm_password) {
                            this.$message.warn('新密码与确认密码不一致')
                            return
                        }
                        this.saveChange()
                    }
                });
            },

            saveChange() {
                this.request(propertyApi.passwordChangeApi, this.pwdForm).then((res) => {
                    this.$message.success('修改成功！')
                    this.resetForm()
                })
            },

            resetForm() {
                this.pwdForm = {}
                this.$refs.ruleForm.resetFields();
            }
        },
    }
</script>

<style lang="less" scoped>
    .property_password {
        background-color: #ffffff;
        padding-top: 30px;
        width: 100%;
        height: 90%;
    }
</style>
