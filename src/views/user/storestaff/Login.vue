<template>
  <div id="merchantLogin">
    <!-- 头部 -->
    <section id="header">
      <div class="left item" v-if="config">
        <div
          class="logo"
          @click="openUrl"
          :data-url="config.site_url"
          :style="'background-image:url(' + config.site_logo + ')'"
        >
          <div class="title" @click.stop>{{ L('店员登录') }}</div>
        </div>
      </div>
      <div class="right item">
        <div v-if="config.is_demo_domain">{{ L('小猪O2O致力于为快速构建本地生活服务平台提供专业的解决方案') }}</div>
        <div v-if="config.open_multilingual == 1 && config.lang_config">
          <a-dropdown :trigger="['click']">
            <a-menu slot="overlay" v-if="config.lang_config.lang_list && config.lang_config.lang_list.length">
              <a-menu-item
                @click="changeLang"
                v-for="item of config.lang_config.lang_list"
                :key="item.val"
                :style="now_lang == item.val ? 'color:#1890FF' : ''"
              >
                {{ item.display }}
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px"> {{ lang_txt }} <a-icon type="down" /> </a-button>
          </a-dropdown>
        </div>
      </div>
    </section>
    <!-- 内容区域 -->
    <section id="content">
      <a-card class="form-card" key="login-card">
        <a-tabs :active-key="loginType" size="large" :tabBarStyle="{ textAlign: 'center', fontSize: '16px' }" @change="handleTabChange">
          <a-tab-pane key="code" :tab="L('扫码登录')">
            <!-- 扫码登录start -->
            <div class="code-container">
              <img   class="code-img" v-if="codeInfo.qrcode" :src="codeInfo.qrcode" />
              <div v-else class="code-img">
                <a-spin />
              </div>
            </div>
            <div class="tip">
              {{ L('打开') }}
              <span style="color: red; margin-right: 10px">{{ L('手机微信') }}</span>
              <span>{{ L('扫描二维码') }}</span>
            </div>
            <div class="characteristic">
              <div class="item" key="noinput"><a-icon class="item-icon" type="edit" />{{ L('免输入') }}</div>
              <div class="item" key="faster"><a-icon class="item-icon" type="rocket" />{{ L('更快') }}</div>
              <div class="item" key="safer"><a-icon class="item-icon" type="safety" />{{ L('更安全') }}</div>
            </div>
            <!-- 扫码登录end -->
          </a-tab-pane>
          <a-tab-pane key="account" :tab="L('账户登录')">
            <!-- 登录表单start -->
            <login-form :agreementChecked="agreementChecked" @handleLogin="handleAccountLogin" ref="loginForm" />
            <!-- 登录表单end -->
          </a-tab-pane>
          <a-tab-pane key="phoneCode" :tab="L('验证码登录')">
              <!-- 登录表单start -->
              <login-form loginType="phoneCode" :agreementChecked="agreementChecked" @handleLogin="handleAccountLogin" ref="loginForm" />
              <!-- 登录表单end -->
          </a-tab-pane>
        </a-tabs>
        <div class="tip">
              <a-checkbox v-if="loginType != 'code'" v-model="agreementChecked" style="height: 20px;">
                  <span style="font-size: 12px;">{{ L('登录代表你已经同意') }}</span>
              </a-checkbox>
              <span v-else style="font-size: 12px;">{{ L('登录代表你已经同意') }}</span>
              
              <router-link tag="a" target="_blank" :to="{ name: 'merchantAgreement',query:{actionType: 'login'} }"
                  >《{{ config.site_short_name }}{{ L('用户协议') }}》</router-link
              >
              <router-link tag="a" target="_blank" :to="{ name: 'merchantPrivacyPolicy' }"
                  >《{{ config.site_short_name }}{{ L('隐私政策') }}》</router-link
              >
          </div>
      </a-card>
    </section>
    <section class="footer">
      <div class="copyright" v-if="config && config.copyright_txt">{{ config.copyright_txt }}</div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import { getTokenName, setCookie, getLangDisplay } from '@/utils/util'
import { mapActions } from 'vuex'
import path from '@/router/router-path.js'
import userStorestaffApi from '@/api/user/storestaff'
// 登录表单
import LoginForm from './modules/LoginForm.vue'

export default {
  components: {
    LoginForm,
  },
  data() {
    return {
      // 登录时选择的tab的key值 code扫码登录 account账户登录
      loginType: 'code',
      // 图片验证码信息
      codeInfo: {},
      interval: null,
      config: null,
      now_lang: '',
      lang_txt: '',
      agreementChecked: false,
    }
  },
  watch: {
    '$store.getters.config'(val) {
      this.config = val
    },
    '$store.getters.nowLang'(val) {
      this.now_lang = val
      this.lang_txt = getLangDisplay(val)
    },
  },
  created() {
    this.config = this.$store.getters.config
    this.now_lang = this.$store.getters.nowLang
    this.lang_txt = getLangDisplay(this.now_lang)
    this.getLoginCode()
  },
  beforeDestroy() {
    this.clearInterval()
  },
  methods: {
    ...mapActions(['Login', 'SetLang','WxLogin']),
    handleTabChange(key) {
      if(key == 'code') {
        if(this.interval) {
          this.clearInterval()
        }
        this.setInterval()
      }else {
         this.clearInterval()
      }
      this.loginType = key
    },
    // 切换语言
    changeLang(e) {
      this.SetLang({ lang: e.key }).then((res) => {
        this.now_lang = e.key
        this.lang_txt = getLangDisplay(this.now_lang)
      })
    },
    // 获取登录二维码
    getLoginCode() {
      this.request(userStorestaffApi.qrcode, { mer_id: 1 }).then((res) => {
        // console.log('res', res)
        this.codeInfo = res
       this.setInterval()
      })
    },
    setInterval() {
      if( this.codeInfo &&  this.codeInfo.qrcode_id) {
        this.interval = window.setInterval(() => {
            //  二维码登录
            const { WxLogin } = this
            WxLogin({ id:this.codeInfo.qrcode_id, url: userStorestaffApi.codeLoginResult })
            .then((res) => {
                if (res && res.ticket) {
                this.loginSuccess(res)
                }
            })
            .catch((err) => {
                this.clearInterval()
            })
        }, 3000) 
      }
    },
    // 账号密码登录
    handleAccountLogin(userInfo) {
      const { Login } = this
      Login({ userInfo, url: userStorestaffApi.login })
        .then((res) => this.loginSuccess(res))
        .catch((err) => this.requestFailed(err))
        .finally(() => {
          this.$refs.loginForm.loginBtn = false
        })
    },
    // 登录成功
    loginSuccess(res) {
      if (res) {
        this.clearInterval()
        this.$message.success(this.L('登录成功！正在跳转~'))
        window.setTimeout(() => {
          this.$router.push({ path: path.storestaffIndex })
        }, 600)
      }
    },
    // 登录失败
    requestFailed(err) {
      // 更换验证码
      this.$refs.loginForm.getNewCode()
    },
    // 打开链接
    openUrl(e) {
      console.log(e.target.dataset.url)
      window.open(e.target.dataset.url, '_blank')
    },
    clearInterval() {
       window.clearInterval(this.interval)
       this.interval = null
    }
  },
}
</script>

<style lang="less" scoped>
#merchantLogin {
  width: 100%;
  height: 100%;
  background: url('../../../assets/merchant/login_bg.png') top left no-repeat;
  background-size: cover;
  color: #666;
  font-family: Microsoft YaHei, Arial, Helvetica, sans-serif;
  font-size: 12px;
  position: relative;
  #header {
    position: fixed;
    width: 100%;
    height: 80px;
    top: 0;
    background-color: #ffffff;
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: space-between;
    .item {
      flex: 1;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 0 20px;
    }
    .left {
      .logo {
        position: relative;
        width: 300px;
        height: 50px;
        background: url(https://o2o-demo-img.oss-cn-hangzhou.aliyuncs.com/upload/config/000/000/030/5c6116472db32894.png);
        background-repeat: no-repeat;
        background-size: 160px auto;
        background-position: center left;
        vertical-align: middle;
        display: flex;
        align-items: center;
        cursor: pointer;
        .title {
          cursor: default;
          position: absolute;
          left: 180px;
          border-left: 2px solid rgba(0, 0, 0, 0.1);
          width: 100px;
          height: 30px;
          line-height: 30px;
          vertical-align: middle;
          padding-left: 20px;
          font-size: 16px;
        }
      }
    }
  }
  #content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .form-card {
      width: 430px;
      border: none;
      border-radius: 6px;
      box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.07);
      .ant-card-actions {
        border: none;
        color: #b61d1d;
      }
      .code-container {
        text-align: center;
        margin-top: 20px;
        .code-img {
          display: inline-block;
          width: 200px;
          height: 200px;
          line-height: 160px;
          vertical-align: middle;
          padding: 20px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 2px;
          &.code-mask{
              filter: blur(10px);
          }
        }
      }
      .tip {
        text-align: center;
        margin-top: 20px;
        font-size: 12px;
        .link:hover {
          color: #1890ff;
        }
      }
      .characteristic {
        text-align: center;
        margin: 15px 40px 0 40px;
        font-size: 12px;
        display: flex;
        justify-content: space-around;
        font-size: 14px;
        color: #999999;

        .item {
          flex: 1;
          .item-icon {
            margin-right: 10px;
            border-radius: 50%;
            border: 1px solid #dcdcdc;
            padding: 4px;
          }
        }
      }
      .register-title {
        height: 56px;
        line-height: 56px;
        vertical-align: middle;
        text-align: center;
        color: #1890ff;
        border-bottom: 1px solid #e8e8e8;
        font-weight: 500;
        font-size: 16px;
      }
    }
  }
  .footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 0 16px;
    margin: 48px 0 24px;
    text-align: center;
    .copyright {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
    }
  }
  #btns {
    position: fixed;
    width: 80px;
    height: 320px;
    bottom: 80px;
    right: 20px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    .item {
      width: 80px;
      height: 80px;
      box-shadow: 0px -4px 4px 0px #f1f1f1;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .tip-icon {
        font-size: 20px;
        margin-bottom: 10px;
      }
      &:hover {
        background: #1890ff;
        color: #ffffff;
        box-shadow: none;
      }
    }
    .active {
      background: #1890ff;
      color: #ffffff;
    }
  }
}
::v-deep .ant-checkbox{
  .ant-checkbox-inner{
    border-color: #1890ff !important;
  }
} 
</style>
