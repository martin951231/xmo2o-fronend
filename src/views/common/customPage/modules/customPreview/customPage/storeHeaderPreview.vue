<template>
    <div>
        <div
            class="store-header-box relative"
            :style="{
                height: content && content.style_type && content.style_type == '7' ? '171px' : '204px',
            }"
        >
            <div class="store-header-bg">
                <div
                    class="store-header-bg"
                    v-if="content && content.bg_color && !content.bg_img"
                    :style="{
                        'background-color': content && content.bg_color ? content.bg_color : '',
                    }"
                ></div>
                <img v-else :src="content.bg_img" alt="" class="store-header-bg" />
            </div>
            <!-- 样式一 -->
            <div
                class="first-type-info flex align-center bg-ff"
                v-if="content && content.style_type && content.style_type == '7'"
            >
                <div class="first-type-logo flex justify-center align-center" v-if="storeLogo">
                    <img :src="storeLogo" alt="" />
                </div>
                <div class="flex-1 flex flex-wrap align-center first-info-right justify-between">
                    <div class="first-type-title fw-bold">
                        <span>{{ storeName || L('老乡鸡（蜀山店）') }}</span>
                    </div>
                    <div class="flex first-info-bottom">
                        <div class="flex-1 flex flex-wrap align-center flex-column justify-center">
                            <span>0</span>
                            <span>{{ L('全部商品') }}</span>
                        </div>
                        <div class="flex-1 flex flex-wrap align-center flex-column justify-center">
                            <span><img src="@/assets/customPage/card_icon.png" alt="" /></span>
                            <span>{{ L('会员卡') }}</span>
                        </div>
                        <div class="flex-1 flex flex-wrap align-center flex-column justify-center pointer">
                            <span>0</span>
                            <span>{{ L('我的订单') }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 样式一 end -->

            <!-- 样式二 -->
            <div class="second-type-info bg-ff" v-else>
                <div class="second-type-logo bg-ff flex align-center justify-center" v-if="storeLogo">
                    <img :src="storeLogo" alt="" />
                </div>
                <div class="flex align-center flex-column justify-center second-type-content">
                    <div>
                        <span class="fw-bold" style="color: #333333">{{ storeName || L('老乡鸡（蜀山店）') }}</span>
                    </div>
                    <div class="flex justify-between second-type-content-txt">
                        <span>{{ L('全部商品999') }}</span>
                        <span class="pl-10 pr-10">|</span>
                        <span>{{ L('上新30') }}</span>
                    </div>
                </div>
            </div>
            <!-- 样式二 end -->
        </div>
    </div>
</template>

<script>
import customPageApi from '@/api/common/platform/customPage'
export default {
    props: {
        content: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {
            source: this.$route.query.source || '',
            storeName: '',
            storeLogo: '',
        }
    },
    computed: {
        sourceInfo() {
            return this.$store.state.customPage.sourceInfo
        },
    },
    mounted() {
        // 如果来源是店铺时，默认定位到当前店铺地址
        if (this.source && this.source == 'store') {
            this.getStoreInfo()
        }
    },
    methods: {
        // 获取店铺信息
        getStoreInfo() {
            let params = {
                source_id: this.sourceInfo.source_id,
            }
            this.request(customPageApi.getMerchantStoreMsg, params).then((res) => {
                if (res && res.store) {
                    this.storeName = res.store.name || ''
                    this.storeLogo = res.store.logo
                } else {
                    this.storeLogo = require('@/assets/customPage/store_header_def_logo.png')
                }
            })
        },
    },
}
</script>

<style scoped>
.store-header-box {
    width: 100%;
    box-sizing: border-box;
}
.store-header-bg {
    width: 100%;
    height: 108px;
}
/* 样式一 */
.first-type-info {
    width: 348px;
    height: 100px;
    border-radius: 10px;
    position: absolute;
    left: 0;
    top: 0;
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 70px;
    padding: 20px;
}
.first-type-logo {
    width: 60px;
    height: 60px;
    background-color: #ebedf1;
    border-radius: 6px;
    overflow: hidden;
}
.first-type-logo img {
    width: 100%;
    height: 100%;
}
.first-info-right {
    height: 100%;
    color: #333333;
    padding-left: 11px;
}
.first-type-title {
    padding-left: 11px;
    height: 26px;
    font-size: 15px;
}
.first-info-bottom {
    width: 100%;
    padding-left: 0px;
    font-size: 10px;
}

/* 样式二 */
.second-type-info {
    width: 100%;
    height: 96px;
}
.second-type-logo {
    width: 65px;
    height: 65px;
    border-radius: 100%;
    background-color: #f6f7f9;
    border: 2px solid #ffffff;
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 75px;
    margin-left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
}
.second-type-logo img {
    width: 100%;
    height: 100%;
}
.second-type-content {
    padding-top: 40px;
}
.second-type-content-txt {
    color: #999999;
    font-size: 12px;
    padding-top: 6px;
}
</style>
