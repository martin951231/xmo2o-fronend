<template>
    <div id="merchantLogin">
        <!-- 头部 -->
        <section id="header">
            <div class="left item">
                <div class="logo" @click="openUrl" :data-url="config.site_url"
                    :style="'background-image:url(' + config.site_logo + ')'">
                    <div class="title" @click.stop>{{ L('社群登录') }}</div>
                </div>
            </div>
            <div class="right item">
                <div v-if="config.is_demo_domain">
                    {{ L('小猪O2O致力于为快速构建本地生活服务平台提供专业的解决方案') }}
                </div>
                <div v-if="config.open_multilingual == 1 && config.lang_config">
                    <a-dropdown :trigger="['click']">
                        <a-menu slot="overlay"
                            v-if="config.lang_config.lang_list && config.lang_config.lang_list.length">
                            <a-menu-item @click="changeLang" v-for="item of config.lang_config.lang_list"
                                :key="item.val" :style="now_lang == item.val ? 'color:#1890FF' : ''">
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
            <a-card v-show="type == 'login'" class="form-card" key="login-card">
                <a-tabs :default-active-key="loginType" size="large" @change="handleTabChange"
                    :tabBarStyle="{ textAlign: 'center', fontSize: '16px' }">
                    <a-tab-pane key="account" :tab="L('账户登录')">
                        <!-- 登录表单start -->
                        <login-form :agreementChecked="true" @handleLogin="handleAccountLogin"
                            v-if="type == 'login'" ref="loginForm" />
                        <!-- 登录表单end -->
                    </a-tab-pane>
                </a-tabs>
            </a-card>
        </section>
        <section class="footer">
            <div class="copyright" v-if="config && config.copyright_txt">{{ config.copyright_txt }}</div>
        </section>
    </div>
</template>

<script>
import { getTokenName, setCookie, getLangDisplay } from '@/utils/util'
import { mapActions } from 'vuex'
import path from '@/router/router-path.js'
// 登录表单
import LoginForm from './modules/LoginForm.vue'

export default {
    components: {
        LoginForm,
    },
    data() {
        return {
            // 登录和注册表单显示 login register
            type: 'login',
            // 登录时选择的tab的key值 code扫码登录 account账户登录
            loginType: 'account',
            interval: null,
            config: null,
            now_lang: '',
            lang_txt: '',
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
        if (this.$route.query.token) {
            this.handleAccountLogin({}, this.$route.query.token)
        }
    },
    methods: {
        ...mapActions(['Login', 'SetLang', 'WxLogin']),
        // 切换语言
        changeLang(e) {
            this.SetLang({ lang: e.key }).then((res) => {
                this.now_lang = e.key
                this.lang_txt = getLangDisplay(this.now_lang)
            })
        },
        // tab切换
        handleTabChange(type) {
            this.loginType = type
        },
        // 账号密码登录
        handleAccountLogin(userInfo = {}, token = null) {
            const { Login } = this
            let params = {
                account: userInfo.account,
                password: userInfo.pwd,
            }
            if (token) {
                params = {
                    v20_ticket: token
                }
            }
            Login({ userInfo: params, url: '/social_activity/socialactivity.login/login' })
                .then((res) => this.loginSuccess(res))
                .catch((err) => this.requestFailed(err))
                .finally(() => {
                    setTimeout(() => {
                        this.$refs.loginForm.loginBtn = false
                    }, 1000)
                })
        },
        // 登录成功
        loginSuccess(res) {
            if (res) {
                this.clearInterval()
                this.$message.success(this.L('登录成功！正在跳转~'))
                // GOMENUFIRST = 1 跳转菜单第一个
                this.$router.push({ path: path.socialactivityIndex})
            }
        },
        // 登录失败
        requestFailed(err) {
            // 更换验证码
            this.$refs.loginForm.getNewCode()
        },
        // 打开链接
        openUrl(e) {
            window.open(e.target.dataset.url, '_blank')
        },
        clearInterval() {
            window.clearInterval(this.interval)
            this.interval = null
        },
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

    @media (max-height: 768px) {
        height: 800px !important;
        overflow-y: scroll;
    }

    #header {
        position: fixed;
        width: 100%;
        height: 80px;
        top: 0;
        background-color: #ffffff;
        box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: space-between;
        z-index: 1000;

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
            width: 480px;
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
                    transition: all .15s;

                    &.code-mask {
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
        height: 240px;
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
</style>
