<template>
  <div class="main" style="margin-top: 70px">
    <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
      <!-- <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
      >
        <a-tab-pane key="tab1" tab="登录"> -->
      <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px" message="账户或密码错误" />
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="账户名"
          v-decorator="[
            'username',
            {
              rules: [{ required: true, message: '请输入帐户名或邮箱地址' }, { validator: handleUsernameOrEmail }],
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
          v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' }]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-row :gutter="8">
          <a-col :span="16">
            <a-input
              size="large"
              placeholder="请输入验证码"
              v-decorator="[
                'verify',
                {
                  rules: [
                    { required: true, message: L('请输入4位验证码') + '~' },
                    { len: 4, message: L('请输入4位验证码') + '~' },
                  ],
                },
              ]"
            >
            <a-icon slot="prefix" type="safety" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-col>
          <a-col :span="8">
            <img @click="getNewCode" style="width: 100%; height: 40px; cursor: pointer" :src="captcha_src" />
          </a-col>
        </a-row>
      </a-form-item>

      <!-- </a-tab-pane>
      </a-tabs> -->

      <!--      <a-form-item>-->
      <!--        <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">自动登录</a-checkbox>-->
      <!--        <router-link-->
      <!--          :to="{ name: 'recover', params: { user: 'aaa'} }"-->
      <!--          class="forge-password"-->
      <!--          style="float: right;"-->
      <!--        >忘记密码</router-link>-->
      <!--      </a-form-item>-->

      <a-form-item style="margin-top: 24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
          >登 录</a-button
        >
      </a-form-item>

      <div class="user-login-other">
        <span>其他登录方式</span>
        <a @click="handleWxLogin">
          <a-icon class="item-icon" style="color: #51b74d" type="wechat" />
        </a>
        <!--        <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>-->
      </div>
    </a-form>

    <a-modal v-model="wxLoginModalVisiable" title="微信扫码登录" style="text-align: center">
      <template slot="footer">
        <a-button key="close" @click="handleWxModalClose"> 关闭 </a-button>
      </template>
      <img :src="wxQrcode" style="height: 200px; width: 200px" />
    </a-modal>
  </div>
</template>

<script>
import md5 from 'md5'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import path from '@/router/router-path.js'
import userPlatformApi from '@/api/user/platform'
let timer = null

export default {
  components: {},
  data() {
    return {
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
      qrcodeId: '',
      captcha_src:userPlatformApi.loginCaptcha
    }
  },
  created() {},
  beforeDestroy() {
    timer = null
    window.clearInterval(timer)
  },
  methods: {
    ...mapActions(['Login', 'Logout', 'WxLogin']),
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
      const validateFieldsKey = ['username', 'password','verify']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          delete loginParams.username
          loginParams[!state.loginType ? 'email' : 'username'] = values.username
          // loginParams.password = md5(values.password)
          loginParams.password = values.password
          loginParams.verify = values.verify;
          // console.log(loginParams)
          Login({ userInfo: loginParams, url: userPlatformApi.login })
            .then((res) => this.loginSuccess(res))
            // .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
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
      window.clearInterval(timer)
      this.$router.push({ path: path.platformIndex })
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
      timer = window.setInterval(() => {
        const { WxLogin } = this
        WxLogin({ id, url: userPlatformApi.wxLoginResult })
          .then((res) => {
            if (res && res.ticket) {
              this.loginSuccess(res)
            }
          })
          .catch((err) => {
            window.clearInterval(timer)
          })
      }, 5000)
    },
    handleWxModalClose() {
      this.wxLoginModalVisiable = false
      window.clearInterval(timer)
    },
    // 获取图片验证码
    getNewCode() {
      this.captcha_src = userPlatformApi.loginCaptcha + '?t=' + (Math.random() * 1000)
    },
  },
}
</script>

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
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
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
