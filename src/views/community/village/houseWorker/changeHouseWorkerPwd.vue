<template>
    <div class="property_password">
       <a-alert message="温馨提示" type="success" style="width: 45%; margin: 0px 0px 20px 20px;padding-left: 42px;">
         <p slot="description" >
           此处只修改，以工作人员账号登录的（{{$store.getters.config.house_name}}物业管理员角色登录的）当前登录工作人员账密码
         </p>
       </a-alert>
       <p style="margin-left: 75px;">您当前登录的账号是：{{logInfo.account_str}}</p>
    <div >
        <a-form-model ref="ruleForm" :model="pwdForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-model-item has-feedback label="原密码" prop="old_password" extra="请输入原来的旧密码">
                <a-input style="width: 300px;" v-model.trim="pwdForm.old_password" type="password" autocomplete="off" placeholder="请输入原来的旧密码"/>
            </a-form-model-item>
            <a-form-model-item has-feedback label="新密码" prop="password" extra="新密码最少6个字符">
                <a-input style="width: 300px;" v-model.trim="pwdForm.password" type="password" autocomplete="off" placeholder="请输入新密码" />
            </a-form-model-item>
            <a-form-model-item has-feedback label="确认密码" prop="confirm_password" extra="请再输入一次上面的新密码，以便确认输对了">
                <a-input style="width: 300px;" v-model.trim="pwdForm.confirm_password" type="password" autocomplete="off" placeholder="请再次输入新密码" />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 2 }">
                <a-button type="primary" @click="submitForm()" :loading="loading">
                    提交
                </a-button>
                <a-button style="margin-left: 10px" @click="resetForm()" :loading="loading">
                    重置
                </a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
     </div>
</template>

<script>
    import villageApi from '@/api/community/village'
    export default {
        name: "changeHouseWorkerPwd",
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
                    },{
                        validator: this.validateNew,
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
                pwdForm: {},
                logInfo:{},
                loading: false,
            }
        },
        activated () {
          this.getCurrentLoginInfo()
        },
        methods: {
            getCurrentLoginInfo(){
                this.request(villageApi.getCurrentLoginInfo).then((res) => {
                    this.logInfo=res;
                })
            },
            validateNew(rule, value, callback) {
                if(this.pwdForm.password.length<6){
                    callback(new Error('新密码最少6个字符'));
                }
                callback();
            },
            validate(rule, value, callback) {
                if (this.pwdForm.password != this.pwdForm.confirm_password) {
                    callback(new Error('新密码与确认密码不一致'));
                }
                callback();
            },

            submitForm() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        if(this.pwdForm.password.length<6){
                            this.$message.warn('新密码最少6个字符！')
                            return
                        }
                        if (this.pwdForm.password != this.pwdForm.confirm_password) {
                            this.$message.warn('新密码与确认密码不一致！')
                            return
                        }
                        this.saveChange()
                    }
                });
            },

            saveChange() {
                let postData=this.pwdForm;
                postData.wid=this.logInfo.wid;
                postData.village_id=this.logInfo.village_id;
                this.loading=true;
                this.request(villageApi.changeHouseWorkerPwd, postData).then((res) => {
                    this.$message.success('修改成功，下次登录请用新密码登录哦！')
                    this.resetForm()
                    this.loading=false;
                }).catch(error => {
                    console.log('error',error)
                    this.loading=false;
                });
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
