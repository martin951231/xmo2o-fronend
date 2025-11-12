<template>
    <div 
        v-if="content"
        class="mall-goods-search-wrap"
        :style="{
            'background-color': bgColor
        }">
        <div 
            class="search-box"
            :class="{
                'border-radius-14': content.style_type == '1',
                'border-radius-4': content.style_type == '2'
            }"
            :style="{
                'background': content.content_bg_color,
                'color': content.font_color,
                'height': content.height_value + 'px',
                'line-height': content.height_value + 'px',
                'text-align': content.text_align
            }">
            <img src="@/assets/customPage/searchIcon.png" alt="" class="search-icon">
            <span class="ml-5">{{L('搜索关键词')}}</span>
        </div>
    </div>
</template>

<script>
import {colorRgb} from '@/utils/util'
export default {
    props: {
        content: {
            type: [String,Object],
            default: ''
        }
    },
    computed: {
        bgColor() {
            if(!this.content) return ''
            return colorRgb(this.content.bg_color,this.content.bg_color_opacity)
        }
    }
}
</script>

<style scoped>
.mall-goods-search-wrap {
    padding: 5px 12px;
    width: 100%;
    box-sizing: border-box;
}
.search-box {
    padding: 0 15px 0 25px;
    width: 100%;  
    font-size: 13px;
    font-weight: 400;
    box-sizing: border-box;
}
.border-radius-4 {
    border-radius: 4px;
}
.border-radius-14 {
    border-radius: 14px;
}
.search-icon {
    width: 12px;
    vertical-align: baseline;
}
</style>