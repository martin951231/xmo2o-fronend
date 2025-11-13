<template>
  <div id="LoginForm">
    <a-form id="components-form-demo-normal-login" :form="form" class="login-form" @submit="handleSubmit">
      <template v-if="loginType == 'phoneCode'">
        <a-form-item>
          <a-input
            @focus="handleFocus"
            size="large"
            type="number"
            v-decorator="[
              'account',
              {
                rules: [
                  { required: true, message: L('请输入手机号码') + '~' },
                  { whitespace: true, message: L('输入值不能为空') + '~' },
                ],
              },
            ]"
            :placeholder="L('手机号')"
          >
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="8">
            <a-col :span="16">
              <a-input
              @focus="handleFocus"
              size="large"
              type="number"
                v-decorator="[
                  'smscode',
                  {
                    rules: [
                      { required: true, message: L('请填写短信验证码') + '~' },
                      { whitespace: true, message: L('输入值不能为空') + '~' },
                    ],
                  },
                ]"
                :placeholder="L('请填写短信验证码')"
              />
            </a-col>
            <a-col :span="8">
              <a-button style="width: 115px" size="large" v-if="time == 0" key="get-code" type="primary" @click="getPhoneCode" :loading="codeLoading">{{ codeLoading?'':L('获取验证码') }}</a-button>
              <a-button style="width: 115px" size="large" v-else type="primary" key="code-count">{{ time }} s</a-button>
            </a-col>
          </a-row>
        </a-form-item>
      </template>
      <template v-else>
      <a-form-item>
        <a-input
          @focus="handleFocus"
          size="large"
          v-decorator="[
            'account',
            {
              rules: [
                { required: true, message: L('请输入账号') + '~' },
                { whitespace: true, message: L('输入值不能为空' + '~') },
              ],
            },
          ]"
          :placeholder="L('账号')"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          @focus="handleFocus"
          size="large"
          v-decorator="[
            'pwd',
            {
              rules: [
                { required: true, message: L('请输入账号密码') + '~' },
                { whitespace: true, message: L('输入值不能为空') + '~' },
              ],
            },
          ]"
          type="password"
          :placeholder="L('密码')"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-row :gutter="8">
          <a-col :span="12">
            <a-input
              @focus="handleFocus"
              size="large"
              type="number"
              v-decorator="[
                'verify',
                {
                  rules: [
                    { required: true, message: L('请输入4位验证码') + '~' },
                    { len: 4, message: L('请输入4位验证码') + '~' },
                  ],
                },
              ]"
            />
          </a-col>
          <a-col :span="8"
            ><img style="width: 100%; height: 40px; cursor: pointer" :src="src" @click="getNewCode"
          /></a-col>
          <a-col :span="4">
            <div
              @click="getNewCode"
              style="
                height: 40px;
                line-height: 20px;
                vertical-aligin: middle;
                font-size: 12px;
                text-align: center;
                cursor: pointer;
              "
            >
              <span>{{ L('看不清') }}</span>
              <br />
              <span>{{ L('换一张') }}</span>
            </div>
          </a-col>
        </a-row>
      </a-form-item>
    </template>
      <a-form-item
        ><a-button
          type="primary"
          size="large"
          html-type="submit"
          class="login-form-button"
          :loading="loginBtn"
          :disabled="loginBtn?true:!agreementChecked"
          >{{ L('登录') }}</a-button
        ></a-form-item
      >
    </a-form>
  </div>
</template>

<script>
import userStorestaffApi from '@/api/user/storestaff'
import { old_request } from '@/utils/request'
export default {
  name: 'LoginFormStaff',
  components: {},
  props: {
    agreementChecked: {
      type: Boolean,
      default: false
    },
    loginType: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      loginBtn: false,
      src: '',
      time: 0,
      smscode: '',
      codeLoading: false,
    }
  },
  created() {
    this.getNewCode()
  },
  methods: {
    // 获取图片验证码
    getNewCode() {
      const num = Math.random() * 1000
      this.src = userStorestaffApi.imgCode + '?t=' + num
    },
    // 提交表单
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields },
      } = this

      const validateFieldsKey = ['account', 'pwd', 'verify','phone','smscode']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          this.loginBtn = true
          if(this.loginType == 'phoneCode'){
            values.ltype = 3
          }
          this.$emit('handleLogin', values)
        }
      })
    },
    getPhoneCode(){
      const {
        form: { validateFields },
      } = this
      const validateFieldsKey = ['account']
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const params = {
            phone: values.account,
            type: 70,
            app_type:"pc",
          }
          this.codeLoading = true
          old_request('/appapi.php?c=Login&a=sendCode', params).then((res) => {
            if (res) {
              this.codeLoading = false
              this.time = 60
              const interval = window.setInterval(() => {
                if (this.time == 0) {
                  window.clearInterval(interval)
                } else {
                  this.time--
                }
              }, 1000)
            }
          }).catch(err=>{
            this.codeLoading = false
          })
        }
      })
    },
    handleFocus(e) {
      setTimeout(() => {
        e.target.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 400);
    }
  },
}
</script>

<style lang="less" scoped>
.login-form {
  padding: 20px 10px 0 10px;
  .login-form-button {
    width: 100%;
    height: 40px;
    margin-top: 20px;
  }
}
</style>
