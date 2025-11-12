<template>
    <div class="main login-sty" style="width: 380px">
        <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
            <a-tabs :activeKey="customActiveKey" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }">
                <a-tab-pane key="tab1" tab="登录">
                    <a-alert
                        v-if="isLoginError"
                        type="error"
                        showIcon
                        style="margin-bottom: 24px"
                        message="账户或密码错误"
                    />
                    <a-form-item>
                        <a-input
                            size="large"
                            type="text"
                            placeholder="账户名"
                            v-decorator="[
                                'username',
                                {
                                    rules: [
                                        { required: true, message: '请输入帐户名或邮箱地址' },
                                        { validator: handleUsernameOrEmail },
                                    ],
                                    validateTrigger: 'change',
                                },
                            ]"
                        >
                            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
                        </a-input>
                    </a-form-item>

                    <a-form-item>
                        <a-input
                            size="large"
                            type="password"
                            autocomplete="false"
                            placeholder="密码"
                            v-decorator="[
                                'password',
                                { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' },
                            ]"
                        >
                            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
                        </a-input>
                    </a-form-item>
                    <a-form-item v-if="Object.keys(login_role_arr).length > 0">
                        <a-select
                            size="large"
                            placeholder="请选择登录身份"
                            @change="handleChangeRole"
                            v-decorator="[
                                'login_role',
                                { rules: [{ required: true, message: '请选择登录身份' }], validateTrigger: 'blur' },
                            ]"
                        >
                            <a-select-option v-for="(item, key) in login_role_arr" :value="item.type" :key="key">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-tab-pane>
            </a-tabs>
            <a-form-item style="margin-top: 24px">
                <a-button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    class="login-button"
                    :loading="state.loginBtn"
                    :disabled="state.loginBtn"
                    >确定</a-button
                >
            </a-form-item>
            <!-- <router-link :to="{ name: register_v20_name, query: queryParam }" style="color: #b61d1d">
                <div class="user-login-other" style="text-align: center">注册账户</div>
            </router-link> -->
        </a-form>
        <a-modal v-model="wxLoginModalVisiable" title="微信扫码登录" style="text-align: center">
            <template slot="footer">
                <a-button key="close" @click="handleWxModalClose"> 关闭 </a-button>
            </template>
            <img :src="wxQrcode" style="height: 200px; width: 200px" />
        </a-modal>

        <a-modal
            v-model="wxLoginModalVisiable1"
            width="95%"
            title="企业微信介绍"
            style="text-align: center"
            :footer="null"
        >
            <template style="height: 1000px">
                <iframe
                    src="/static/html/qiweiwuye/qiweiwuye.html"
                    width="100%"
                    height="800px"
                    style="border: none"
                ></iframe>
            </template>
        </a-modal>
        <result :height="800" :width="1500" ref="createModalsss" />
    </div>
</template>

<script>
import md5 from 'md5'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import path from '@/router/router-path.js'
import userPlatformApi from '@/api/user/platform'
import userCommunityApi from '@/api/user/community'
import { TagSelect } from '@/components'
import userApi from '@/api/user/community'
const TagSelectOption = TagSelect.Option
import result from '@/views/user/community/LoginResult'

export default {
    components: {
        TagSelect,
        result,
        TagSelectOption,
    },
    data() {
        return {
            login_role_arr: [],
            login_token_arr: {},
            login_url_arr: {},
            register_v20_name: 'communityPackages',
            customActiveKey: 'tab1',
            loginBtn: false,
            // login type: 0 email, 1 username, 2 telephone
            loginType: 0,
            isLoginError: false,
            requiredTwoStepCaptcha: false,
            stepCaptchaVisible: false,
            form: this.$form.createForm(this),
            state: {
                time: 60,
                loginBtn: false,
                // login type: 0 email, 1 username, 2 telephone
                loginType: 0,
                smsSendBtn: false,
            },
            wxQrcode: '',
            wxLoginModalVisiable: false,
            wxLoginModalVisiable1: false,
            qrcodeId: '',
            queryParam: {},
            chooseRole: 0,
            authQyLogin: false,
            is_support_https:0,
            largeLoginImg: 'https://open.work.weixin.qq.com/service/img?id=ww21001813f8f04566&t=login&c=white&s=large',
            srcsetLoginImg:
                'https://open.work.weixin.qq.com/service/img?id=ww21001813f8f04566&t=login&c=white&s=large@2x 2x',
        }
    },
    created() {
        if (this.$route.params.village) {
            this.queryParam.village = this.$route.params.village
        }
        if (this.$route.params.property) {
            this.queryParam.property = this.$route.params.property
        }
        if (localStorage.getItem('watch_login_role')) {
            localStorage.removeItem('watch_login_role')
        }
        if (localStorage.getItem('watch_current_village_id')) {
            localStorage.removeItem('watch_current_village_id')
        }
    },
    mounted() {
        console.log('2-params', this.$route.params)
        if (this.$route.params.village) {
            this.queryParam.village = this.$route.params.village
        }
        if (this.$route.params.property) {
            this.queryParam.property = this.$route.params.property
        }
        console.log('2-this.queryParam', this.queryParam)
        this.getLoginConfig()
    },

    methods: {
        ...mapActions(['Login', 'Logout', 'WxLogin']),
        // 获取配置项
        getLoginConfig() {
            this.request(userCommunityApi.config, { xtype: 'sentryWatch' }).then((res) => {
                console.log('res', res)
                if (res.login_role) {
                    this.login_role_arr = res.login_role
                }
                if (res.login_token) {
                    this.login_token_arr = res.login_token
                }
                if (res.login_url) {
                    this.login_url_arr = res.login_url
                }
                if (res.register_v20_name) {
                    this.register_v20_name = res.register_v20_name
                }
                if (res.authQyLogin) {
                    this.authQyLogin = res.authQyLogin
                }
                if (res.largeLoginImg) {
                    this.largeLoginImg = res.largeLoginImg
                }
                if (res.srcsetLoginImg) {
                    this.srcsetLoginImg = res.srcsetLoginImg
                }
                if (res.is_support_https) {
                    this.is_support_https = res.is_support_https*1;
                }  
                // if (res.register) {
                //   console.log('register',res.register);
                //   this.$router.push({ path: res.register })
                // }
                // res即为接口返回值，在这里做对应的逻辑处理
            })
        },
        test() {
            this.wxLoginModalVisiable1 = true
        },
        // 用户名或邮箱登录
        handleUsernameOrEmail(rule, value, callback) {
            const { state } = this
            const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
            if (regex.test(value)) {
                state.loginType = 0
            } else {
                state.loginType = 1
            }
            callback()
        },
        // 选择登录身份
        handleChangeRole(value) {
            console.log(`selected ${value}`)
        },
        // 登录-提交表单
        handleSubmit(e) {
            e.preventDefault()
            const {
                form: { validateFields },
                state,
                customActiveKey,
                Login,
            } = this

            state.loginBtn = true
            // const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']
            const validateFieldsKey = ['username', 'password']
            if (this.login_role_arr && Object.keys(this.login_role_arr).length > 0) {
                validateFieldsKey.push('login_role')
            }
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    console.log('login form', values)
                    const loginParams = { ...values }
                    delete loginParams.username
                    loginParams[!state.loginType ? 'email' : 'username'] = values.username
                    // loginParams.password = md5(values.password)
                    loginParams.password = values.password
                    loginParams.login_role = values.login_role
                    loginParams.xtype = 'sentryWatch'

                    this.chooseRole = loginParams.login_role

                    console.log('loginParams', loginParams)
                    var token_info = ''
                    if (this.login_token_arr && this.login_token_arr[loginParams.login_role]) {
                        token_info = this.login_token_arr[loginParams.login_role]
                    } else if (loginParams.login_role == '3') {
                        token_info = 'property_access_token'
                    } else if (loginParams.login_role == '4') {
                        token_info = 'property_access_token'
                    } else if (loginParams.login_role == '5') {
                        token_info = 'village_access_token'
                    }
                    let loginUrl='/community/login.login/check';
                    if (loginParams.login_role * 1 == 401) {
                        this.request('/community/village_api.VillageConfig/getVillageInfo').then((res) => {
                            console.log(res, '1111111111111')
                            loginParams.village_id = res.village_id
                            Login({
                                userInfo: loginParams,
                                url: loginUrl,
                                token: token_info,
                                // village_id: res.village_id,
                            })
                                .then((res) => this.loginSuccess(res))
                                // .catch(err => this.requestFailed(err))
                                .finally(() => {
                                    state.loginBtn = false
                                })
                        })
                    } else {
                        Login({
                            userInfo: loginParams,
                            url: loginUrl,
                            token: token_info,
                        })
                            .then((res) => this.loginSuccess(res))
                            // .catch(err => this.requestFailed(err))
                            .finally(() => {
                                state.loginBtn = false
                            })
                    }
                } else {
                    setTimeout(() => {
                        state.loginBtn = false
                    }, 600)
                }
            })
        },
        getCaptcha(e) {
            e.preventDefault()
            const {
                form: { validateFields },
                state,
            } = this

            validateFields(['mobile'], { force: true }, (err, values) => {
                if (!err) {
                    state.smsSendBtn = true

                    const interval = window.setInterval(() => {
                        if (state.time-- <= 0) {
                            state.time = 60
                            state.smsSendBtn = false
                            window.clearInterval(interval)
                        }
                    }, 1000)

                    const hide = this.$message.loading('验证码发送中..', 0)
                    getSmsCaptcha({ mobile: values.mobile })
                        .then((res) => {
                            setTimeout(hide, 2500)
                            this.$notification['success']({
                                message: '提示',
                                description: '验证码获取成功，您的验证码为：' + res.result.captcha,
                                duration: 8,
                            })
                        })
                        .catch((err) => {
                            setTimeout(hide, 1)
                            clearInterval(interval)
                            state.time = 60
                            state.smsSendBtn = false
                            this.requestFailed(err)
                        })
                }
            })
        },
        stepCaptchaSuccess() {
            this.loginSuccess()
        },
        stepCaptchaCancel() {
            this.Logout().then(() => {
                this.loginBtn = false
                this.stepCaptchaVisible = false
            })
        },
        loginSuccess(res) {
            if (res && res.login_role) {
                localStorage.setItem('watch_login_role', res.login_role)
            }
            // 街道/社区
            if (res && res.is_err && res.v20_path) {
                this.$message.warning(res.err_msg)
                this.isLoginError = false
                this.$router.push({ path: res.v20_path })
            } else if (res && res.v20_path) {
                console.log('v20_path', res.v20_path)
                this.$router.push({ path: res.v20_path })
            } else if (this.login_url_arr && this.login_url_arr[this.chooseRole]) {
                var path = this.login_url_arr[this.chooseRole]
                console.log('path', path)
                this.$router.push({ path: path })
            } else if (res && (1 == res.login_role || 9 == res.login_role)) {
                console.log('街道社区后台', path.communityIndex)
                this.$router.push({ path: path.communityIndex })
            } else if ((res && 3 == res.login_role) || (res && 4 == res.login_role)) {
                // 物业总管理 || 物业普通管理员
                if (res.is_err) {
                    this.$message.warning(res.err_msg)
                    this.isLoginError = false
                    this.$router.push({ name: 'propertyLoginPackages' })
                    return false
                } else if (res.jump_path) {
                    console.log('物业后台jump_path', res.jump_path)
                    this.$router.replace({ path: res.jump_path })
                    // window.open(res.jump_url);
                } else {
                    console.log('物业后台', path.propertyIndex)
                    this.$router.push({ path: path.propertyIndex })
                }
            } else if (res && 5 == res.login_role) {
                this.$router.push({ path: path.villageIndex })
            }

            // 延迟 1 秒显示欢迎信息
            setTimeout(() => {
                this.$notification.success({
                    message: '欢迎',
                    description: `${timeFix()}，欢迎回来`,
                })
            }, 1000)
            this.isLoginError = false
        },
        requestFailed(err) {
            this.isLoginError = true
            // console.log(err)
            // this.$notification['error']({
            //   message: '错误',
            //   description: ((err.response || {}).data ||  || '请求出现错误，请稍后再试',
            //   duration: 4
            // })
        },
        handleWxLogin() {
            this.wxLoginModalVisiable = true
            this.request(userPlatformApi.wxLogin).then((res) => {
                this.qrcodeId = res.id
                this.wxQrcode = res.qrcode_url
                if (res.id) {
                    this.wxLoginCheck(res.id)
                }
            })
        },
        wxLoginCheck(id) {
            const t = setInterval(() => {
                const { WxLogin } = this
                WxLogin(id).then((res) => {
                    clearInterval(t)
                    this.loginSuccess(res)
                })
            }, 5000)
        },
        handleWxModalClose() {
            this.wxLoginModalVisiable = false
        },
    },
}
</script>
<style lang="less">
.user-login-other {
    width: 380px;
    border-top: solid #eee 1px;
    padding: 15px;
    margin-left: -40px;
    background-color: #fcfcfc;
    border-radius: 10px;
}
.login-sty {
    padding: 25px 40px 0px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 20px 30px 0 rgba(63, 63, 65, 0.06);
}
.ant-modal {
    top: 50px !important;
}
</style>
<style lang="less" scoped>
.user-layout-login {
    label {
        font-size: 14px;
    }
    .getCaptcha {
        display: block;
        width: 100%;
        height: 40px;
    }

    .forge-password {
        font-size: 14px;
    }

    button.login-button {
        padding: 0 15px;
        margin-bottom: 20px;
        font-size: 16px;
        height: 40px;
        width: 100%;
    }

    .user-login-other {
        text-align: left;
        line-height: 22px;

        .item-icon {
            font-size: 24px;
            color: rgba(0, 0, 0, 0.2);
            margin-left: 16px;
            vertical-align: middle;
            cursor: pointer;
            transition: color 0.3s;

            &:hover {
                color: #1890ff;
            }
        }

        .register {
            float: right;
        }
    }
}
</style>
