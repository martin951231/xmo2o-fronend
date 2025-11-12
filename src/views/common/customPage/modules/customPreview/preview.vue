<template>
    <!-- 中间预览区域 -->
    <div @click.self="handleReleaseSelected" class="previewWrap" id="previewWrap">
        <!-- 主要布局，中间，最小宽度 375x667 -->
        <div class="mainLayout flex flex-column" v-if="pageType == 'catCustomPage'">
            <catCustomPagePreview @scrollTopOpt="scrollTopOpt"></catCustomPagePreview>
        </div>

        <div
            class="mainLayout flex flex-column relative"
            v-else
            :style="{
                backgroundColor: pageHeaderInfo.bg_color || '#ffffff',
            }"
        >
            <!-- 图片背景 -->
            <div
                v-if="pageHeaderInfo.bg_color_style == 2 && pageHeaderInfo.bg_image && pageHeaderInfo.bg_image.length"
                class="bg-image-wrap"
            >
                <img
                    v-for="(item, index) in pageHeaderInfo.bg_image"
                    :src="item"
                    :key="index"
                    style="width: 100%; height: auto"
                />
            </div>

            <div
                class="mainHeader"
                v-if="componentId != 'my'"
                :style="{
                    backgroundColor: bgColorNav || '#ffffff',
                }"
                @click="headerOpt()"
                :class="[
                    {
                        'mainHeader-box-shadow': pageHeaderInfo.bg_color_style == 1,
                    },
                ]"
            >
                <div
                    class="mainTitle text-center no-wrap"
                    :style="{
                        color: pageHeaderInfo.title_color || '#000000',
                    }"
                >
                    {{
                        pageHeaderInfo && (pageHeaderInfo.page_title || pageHeaderInfo.page_title == 0)
                            ? pageHeaderInfo.page_title
                            : ''
                    }}
                </div>
                <componentBgImage
                    :bgImage="pageHeaderInfo.bg_image_nav"
                    :show="pageHeaderInfo.bg_color_nav_style == 2 && pageHeaderInfo.bg_image_nav ? true : false"
                    :opacity="pageHeaderInfo.bg_color_nav_opacity"
                ></componentBgImage>
                <img :src="headerImg" class="header-img" />
            </div>

            <div
                class="mainContent flex-1"
                v-if="componentId != 'index'"
                :style="{
                    backgroundColor:
                        pageHeaderInfo.bg_color_style == 1 ? pageHeaderInfo.bg_color || '#ffffff' : 'unset',
                }"
            >
                <!-- 预览 -->
                <component v-if="component" :is="component"></component>

                <!-- 微页面主页装修 -->
                <div class="isEmpty text-center" v-else-if="!custom.length">
                    <img src="@/assets/customPage/customPreviewEmptyBg.png" class="isEmptyBg" />
                    <div>{{ L('点击左侧组件库模块，装修您的专属页面') }}</div>
                </div>
                <!-- 微页面预览组件 -->
                <customPagePreview v-else @scrollTopOpt="scrollTopOpt"></customPagePreview>
            </div>
        </div>
    </div>
</template>

<script>
import myPreview from '@/views/common/customPage/modules/customPreview/homePage/myPreview'
import footerTabbarPreview from '@/views/common/customPage/modules/customPreview/homePage/footerTabbarPreview'
import floatBtnPreview from '@/views/common/customPage/modules/customPreview/homePage/floatBtnPreview'
import customPagePreview from '@/views/common/customPage/modules/customPreview/customPage/customPagePreview'
import catCustomPagePreview from '@/views/common/customPage/modules/customPreview/customPage/catCustomPagePreview'
import componentBgImage from '@/views/common/customPage/modules/common/componentBgImage.vue'
// 预览组件
const components = {
    my: myPreview,
    footerTabbar: footerTabbarPreview,
    floatBtn: floatBtnPreview,
}

import { colorRgb } from '@/utils/util'

export default {
    components: {
        customPagePreview,
        catCustomPagePreview,
        componentBgImage,
    },
    data() {
        return {
            component: '',
            headerImg: require('@/assets/customPage/customPreviewHeaderBg.png'),
        }
    },
    computed: {
        componentId() {
            this.component = components[this.$store.state.customPage.componentId] || ''
            return this.$store.state.customPage.componentId
        },
        pageInfo() {
            return this.$store.state.customPage.pageInfo
        },
        pageHeaderInfo() {
            if (this.$store.state.customPage.pageType == 'customPage') {
                return this.$store.state.customPage.pageInfo
            } else {
                return this.$store.state.customPage.pageHeaderInfo
            }
        },
        // homePage customPage
        pageType() {
            return this.$store.state.customPage.pageType
        },
        // 微页面组件
        custom() {
            return this.pageInfo && this.pageInfo.custom && this.pageInfo.custom.length ? this.pageInfo.custom : []
        },
        bgColorNav() {
            if (!this.pageHeaderInfo) return ''
            return colorRgb(this.pageHeaderInfo.bg_color_nav, this.pageHeaderInfo.bg_color_nav_opacity)
        },
        bgBackground() {
            if (!this.pageHeaderInfo) return ''
            if (this.pageHeaderInfo.bg_color_style != 2) return
            let bgImageArr = this.pageHeaderInfo.bg_image
            if (!bgImageArr.length) return ''
            let bgImageStr = bgImageArr.map((item) => `url(${item})`).join(',')
            return {
                backgroundImage: bgImageStr,
            }
        },
    },
    watch: {
        // 监听组件id,切换组件
        componentId: {
            deep: true,
            handler(val) {
                // console.log(val,'val')
                this.component = components[val] || ''
            },
        },
    },
    methods: {
        // 释放组件选中效果
        handleReleaseSelected() {
            /*if (['index','my','footerTabbar','floatBtn'].indexOf(this.componentId) == -1) {
                this.$store.dispatch('updateComponentId', '');
            }
            this.$store.dispatch('updateCustomIndex', -1)*/
        },
        // 头部点击
        headerOpt() {
            if (this.pageType != 'customPage') return
            this.$store.dispatch('updateComponentId', 'customPageIndex')
        },
        // 页面滚动
        scrollTopOpt(offsetTop) {
            this.$nextTick(() => {
                let previewWrap = document.getElementById('previewWrap')
                if (previewWrap) {
                    previewWrap.scrollTop = offsetTop - 70
                }
            })
        },
    },
}
</script>

<style scoped>
.previewWrap {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid transparent;
    overflow-y: auto;
}
.mainLayout {
    margin: 60px auto;
    width: 375px;
    min-height: 667px;
    border: 1px solid #f2f2f2;
    box-shadow: 0px 0px 12px 4px rgba(231, 231, 231, 0.42);
    box-sizing: content-box;
}
.bg-image-wrap {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    overflow: hidden;
}
.mainHeader {
    position: relative;
    width: 100%;
    height: 64px;
    box-sizing: border-box;
    overflow: hidden;
}
.mainHeader-box-shadow {
    box-shadow: 0px 1px 0px 0px #f7f7f7;
}
.header-img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    z-index: 2;
}
.mainTitle {
    position: absolute;
    top: 20px;
    left: 50%;
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    font-weight: bold;
    color: #000000;
    max-width: 160px;
    transform: translate(-50%, 0);
    text-align: center;
    z-index: 3;
}

.mainContent {
    width: 100%;
    position: relative;
}
.isEmpty {
    width: 100%;
    height: 603px;
    font-size: 14px;
    font-weight: 400;
    color: #adadad;
}
.isEmptyBg {
    margin: 179px auto 28px;
    width: 121px;
    height: auto;
}
</style>
