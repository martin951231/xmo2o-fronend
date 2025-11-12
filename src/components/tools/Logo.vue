<template>
    <div
        class="logo"
        style="position: relative; overflow: visible"
        :class="logoTitleStyle == 1 ? 'logoTitleStyle' : ''"
        v-if="hasTab"
        :style="{ width: '100%', transition: $store.state.app.sidebar ? 'linear 0.25s' : 'linear 0.01s' }"
    >
        <div
            style="
                position: absolute;
                left: -30px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: calc(100% + 30px);
                overflow: hidden;
            "
        >
            <router-link
                :to="{ name: 'index' }"
                style="display: flex; align-items: center; width: 100%; justify-content: center"
            >
                <img style="flex-shrink: 0" v-if="show && config.system_admin_logo" :src="config.system_admin_logo" />
                <h1
                    :class="show && config.system_admin_logo ? 'h1_image' : 'h1_no_image'"
                    v-if="show && showTitle && $store.state.app.sidebar"
                    :style="logoTitleStyle == 1 ? 'font-size:18px;margin-left: 5px;' : ''"
                >
                    <a-tooltip>
                        <template slot="title" placement="right">
                            {{ config.site_name }}
                        </template>
                        {{ config.site_name }}
                    </a-tooltip>
                </h1>
            </router-link>
        </div>
    </div>

    <div
        class="logo"
        style="overflow: hidden"
        :class="logoTitleStyle == 1 ? 'logoTitleStyle' : ''"
        :style="{ width: '100%', transition: $store.state.app.sidebar ? 'linear 0.25s' : 'linear 0.01s' }"
        v-else
    >
        <router-link
            :to="{ name: 'index' }"
            style="display: flex; align-items: center; width: 100%; justify-content: center"
        >
            <img style="flex-shrink: 0" v-if="show && config.system_admin_logo" :src="config.system_admin_logo" />
            <h1
                :class="show && config.system_admin_logo ? 'h1_image' : 'h1_no_image'"
                v-if="show && showTitle && $store.state.app.sidebar"
                :style="logoTitleStyle == 1 ? 'font-size:18px;margin-left: 5px;' : ''"
            >
                <a-tooltip>
                    <template slot="title" placement="right">
                        {{ config.site_short_name?config.site_short_name:config.site_name }}
                    </template>
                    {{ config.site_short_name?config.site_short_name:config.site_name }}
                </a-tooltip>
            </h1>
        </router-link>
    </div>
</template>

<script>
import Vue from 'vue'
import { getSystemName } from '@/utils/util'
import userCommunityApi from '@/api/user/community/village'
import userPropertyApi from '@/api/user/community/property'
import store from '@/store'
let _this
export default {
    name: 'Logo',
    props: {
        title: {
            type: String,
            default: '小猪CMS',
            required: false,
        },
        showTitle: {
            type: Boolean,
            default: true,
            required: false,
        },
        tabLeft: {
            type: Array,
            default: () => {
                return []
            },
        },
    },
    data() {
        return {
            config: {
                site_name: '',
                site_desc: '',
                site_logo: '',
                system_admin_logo: '',
            },
            logoTitleStyle: 0,
            show: false,
            hasTab: true,
        }
    },
    watch: {
        '$store.getters.config': {
            deep: true,
            handler: function (val) {
                _this.getConfig(val)
            },
        },
        tabLeft: {
            handler(val) {
                if (val && val.length > 0) {
                    this.hasTab = true
                } else {
                    this.hasTab = false
                }
            },
        },
    },
    mounted() {
        _this = this
        this.getConfig(this.$store.getters.config)
    },
    methods: {
        getConfig(config) {
            this.config = config
            const sysName = getSystemName(location.hash)
            if (sysName == 'platform') {
                this.$set(this.config, 'site_name', '系统后台')
            }
            if (typeof config['property_self_logo'] != 'undefined' && config['property_self_logo'] == 1) {
                let tokenName = ''
                if (sysName == 'property') {
                    this.$set(this.config, 'site_name', '物业')
                    tokenName = 'property_access_token'
                    let param = {
                        tokenName: this.tokenName,
                    }
                    this.request(userPropertyApi.configList, param).then((res) => {
                        if (res.logo) {
                            this.$set(this.config, 'system_admin_logo', res.logo)
                        } else {
                            // 物业不返回logo 不显示
                            this.$set(this.config, 'system_admin_logo', '')
                        }
                        if (this.config.site_name.length && this.config.site_name.length > 5) {
                            this.logoTitleStyle = 1
                        } else {
                            this.logoTitleStyle = 0
                        }
                        this.show = true
                    })
                } else if (sysName == 'village') {
                    this.$set(this.config, 'site_name', store.getters.config.house_name)
                    tokenName = 'village_access_token'
                    let param = {
                        tokenName: this.tokenName,
                    }
                    this.request(userCommunityApi.configList, param).then((res) => {
                        if (res.logo) {
                            this.$set(this.config, 'system_admin_logo', res.logo)
                        } else {
                            // 小区不返回logo 不显示
                            this.$set(this.config, 'system_admin_logo', '')
                        }
                        if (this.config.site_name.length && this.config.site_name.length > 5) {
                            this.logoTitleStyle = 1
                        } else {
                            this.logoTitleStyle = 0
                        }
                        this.show = true
                    })
                } else {
                    if (this.config.site_name.length && this.config.site_name.length > 5) {
                        this.logoTitleStyle = 1
                    } else {
                        this.logoTitleStyle = 0
                    }
                    this.show = true
                }
            } else {
                if (this.config.site_name.length && this.config.site_name.length > 5) {
                    this.logoTitleStyle = 1
                } else {
                    this.logoTitleStyle = 0
                }
                this.show = true
            }
        },
    },
}
</script>

<style scoped lang="less">
.logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 256px;
}
.logoTitleStyle {
    padding: 0 !important;
    text-align: center;
}
.h1_image {
    max-width: calc(100% - 49px);
    white-space: nowrap;
    overflow: hidden;
}

.h1_no_image {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
}
</style>
