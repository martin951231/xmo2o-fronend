<template>
    <div id="userLayout" :class="['user-layout-wrapper', device]">
        <div class="container">
            <div class="top">
                <div class="header">
                    <a href="/">
                        <img
                            v-if="show && config.system_admin_logo"
                            :src="config.system_admin_logo"
                            class="logo"
                            alt="logo"
                        />
                        <span class="title" v-if="show && config.site_name">{{ config.site_name }}</span>
                    </a>
                </div>
                <div class="desc">{{ config.site_desc }}</div>
            </div>

            <route-view></route-view>
        </div>
    </div>
</template>

<script>
import RouteView from './RouteView'
import { mixinDevice } from '@/utils/mixin'
import { urlConversion, getSystemName } from '@/utils/util'
import Vue from 'vue'
import userPlatformApi from '@/api/user/platform'
import userCommunityApi from '@/api/user/community/village'
import userPropertyApi from '@/api/user/community/property'

export default {
    name: 'UserLayout',
    components: { RouteView },
    mixins: [mixinDevice],
    data() {
        return {
            config: {
                site_name: '',
                site_desc: '',
                site_logo: '',
                system_admin_logo: '',
            },
            show: false,
        }
    },
    mounted() {
        document.body.classList.add('userLayout')
        this.getConfig()
    },
    methods: {
        getConfig() {
            const config = this.$store.getters.config
            if (Object.keys(config).length) {
                this.config = config
                if (typeof config['property_self_logo'] != 'undefined' && config['property_self_logo'] == 1) {
                    let tokenName = ''
                    let query = this.$route.query
                    if (query && query['property']) {
                        tokenName = 'property_access_token'
                        let property_id = query['property']
                        let param = {
                            tokenName: this.tokenName,
                            property_id: property_id,
                        }
                        this.request(userPropertyApi.configList, param).then((res) => {
                            if (res.logo) {
                                this.$set(this.config, 'system_admin_logo', res.logo)
                            } else {
                                this.$set(this.config, 'system_admin_logo', '')
                            }
                            if (res.name) {
                                this.$set(this.config, 'site_name', res.name)
                            }
                            this.show = true
                        })
                    } else if (query && query['village']) {
                        tokenName = 'village_access_token'
                        let village_id = query['village']
                        let param = {
                            tokenName: this.tokenName,
                            village_id: village_id,
                        }
                        console.log('走进来了')
                        this.request(userCommunityApi.configList, param).then((res) => {
                            if (res.logo) {
                                this.$set(this.config, 'system_admin_logo', res.logo)
                            } else {
                                this.$set(this.config, 'system_admin_logo', '')
                            }
                            if (res.name) {
                                this.$set(this.config, 'site_name', res.name)
                            }
                            this.show = true
                        })
                    } else {
                        this.show = true
                    }
                } else {
                    this.show = true
                }
            } else {
                setTimeout(() => {
                    this.getConfig()
                }, 300)
            }
        },
    },
    beforeDestroy() {
        document.body.classList.remove('userLayout')
    },
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
    height: 100%;

    &.mobile {
        .container {
            .main {
                max-width: 368px;
                width: 98%;
            }
        }
    }

    .container {
        width: 100%;
        min-height: 100%;
        background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
        background-size: 100%;
        padding: 110px 0 144px;
        position: relative;

        a {
            text-decoration: none;
        }

        .top {
            text-align: center;

            .header {
                height: 44px;
                line-height: 44px;

                .badge {
                    position: absolute;
                    display: inline-block;
                    line-height: 1;
                    vertical-align: middle;
                    margin-left: -12px;
                    margin-top: -10px;
                    opacity: 0.8;
                }

                .logo {
                    height: 44px;
                    vertical-align: top;
                    margin-right: 16px;
                    border-style: none;
                }

                .title {
                    font-size: 33px;
                    color: rgba(0, 0, 0, 0.85);
                    font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
                    font-weight: 600;
                    position: relative;
                    top: 2px;
                }
            }
            .desc {
                font-size: 14px;
                color: rgba(0, 0, 0, 0.45);
                margin-top: 12px;
                margin-bottom: 40px;
            }
        }

        .main {
            min-width: 260px;
            width: 368px;
            margin: 0 auto;
        }

        .footer {
            position: absolute;
            width: 100%;
            bottom: 0;
            padding: 0 16px;
            margin: 48px 0 24px;
            text-align: center;

            .links {
                margin-bottom: 8px;
                font-size: 14px;
                a {
                    color: rgba(0, 0, 0, 0.45);
                    transition: all 0.3s;
                    &:not(:last-child) {
                        margin-right: 40px;
                    }
                }
            }
            .copyright {
                color: rgba(0, 0, 0, 0.45);
                font-size: 14px;
            }
        }
    }
}
</style>
