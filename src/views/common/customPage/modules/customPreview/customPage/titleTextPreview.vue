<template>
    <div>
        <div
            v-if="content && !content.desc_txt && !content.title_txt"
            :style="{
                'text-align': content.text_align ? content.text_align : 'left',
                'background-color': bgColor || 'transparent',
            }"
            class="relative sx-hidden sy-hidden"
        >
            <componentBgImage
                :bgImage="content.bg_image"
                :show="content.bg_color_style == 2 && content.bg_image ? true : false"
                :opacity="content.bg_color_opacity"
            ></componentBgImage>
            <div class="def-title relative">
                <strong>{{ L('主标题') }}</strong>
            </div>
            <div class="def-subtitle relative">{{ L('我是副标题') }}</div>
        </div>
        <div
            v-else
            class="flex justify-center align-start bg-ff flex-column title-text-wrap relative sx-hidden sy-hidden"
            :style="{
                'text-align': content.text_align ? content.text_align : 'left',
                'background-color': bgColor || 'transparent',
            }"
        >
             <componentBgImage
                :bgImage="content.bg_image"
                :show="content.bg_color_style == 2 && content.bg_image ? true : false"
                :opacity="content.bg_color_opacity"
            ></componentBgImage>
            <div
                v-if="content && content.title_txt"
                class="main-title-con text-wrap relative"
                :class="{
                    title_text_large: content.title_font_size == '16',
                    title_text_middle: content.title_font_size == '14',
                    title_text_small: content.title_font_size == '12',
                    title_thickness_normal: content.title_font_weight == 'normal',
                    title_thickness_bold: content.title_font_weight == 'bold',
                }"
                :style="{ color: content.title_color, 'margin-bottom': content.desc_txt ? '6px' : '' }"
            >
                <span>{{ content.title_txt }}</span>
            </div>
            <div
                v-if="content && content.desc_txt"
                class="describe-txt text-wrap relative"
                :class="{
                    title_text_large: content.desc_font_size == '16',
                    title_text_middle: content.desc_font_size == '14',
                    title_text_small: content.desc_font_size == '12',
                    title_thickness_normal: content.desc_font_weight == 'normal',
                    title_thickness_bold: content.desc_font_weight == 'bold',
                }"
                :style="{ color: content.desc_color }"
            >
                <span>{{ content.desc_txt }}</span>
            </div>
        </div>
        <div v-if="content && content.show_bottom_line && content.show_bottom_line == 1" class="line-bottom"></div>
    </div>
</template>

<script>
import { colorRgb } from '@/utils/util'
import componentBgImage from '@/views/common/customPage/modules/common/componentBgImage.vue'
export default {
    props: {
        content: {
            type: [String, Object],
            default: '',
        },
    },
    components: {
        componentBgImage,
    },
    data() {
        return {}
    },
    computed: {
        bgColor() {
            if (!this.content) return ''
            return colorRgb(this.content.bg_color, this.content.bg_color_opacity)
        },
    },
}
</script>

<style scoped>
.def-title {
    font-size: 15px;
    padding: 5px 13px;
}
.def-subtitle {
    font-size: 12px;
    padding: 0 0 5px 13px;
}
.title-text-wrap {
    min-height: 40px;
    box-sizing: border-box;
    padding: 11px 13px;
}
.title-text-wrap .main-title-con {
    font-size: 15px;
    color: #000;
    font-weight: bold;
    width: 100%;
}
.title-text-wrap .describe-txt {
    font-size: 12px;
    color: #000;
    width: 100%;
}
/* 文字大小 */
.title-text-wrap .title_text_large {
    font-size: 16px;
}
.title-text-wrap .title_text_middle {
    font-size: 14px;
}
.title-text-wrap .title_text_small {
    font-size: 12px;
}
/* 文字粗细 */
.title-text-wrap .title_thickness_normal {
    font-weight: normal;
}
.title-text-wrap .title_thickness_bold {
    font-weight: bold;
}
.line-bottom {
    box-sizing: border-box;
    border-bottom: 1px solid #eeeeee;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 343px;
    margin-left: 50%;
    transform: translateX(-50%);
}
</style>
