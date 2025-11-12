<template>
    <div 
        v-if="content"
        class="mall-goods-search-wrap"
        :style="{
            'background': content.bg_color
        }">
        <div 
            class="search-box"
            :class="{
                'border-radius-20': content.style_type == '1',
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
            <span class="ml-5">{{L('搜索商品')}}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: [String,Object],
            default: ''
        }
    },
}
</script>

<style scoped>
.mall-goods-search-wrap {
    padding: 5px 15px;
    width: 100%;
    box-sizing: border-box;
}
.search-box {
    padding: 0 15px;
    width: 100%;  
    font-size: 13px;
    font-weight: 400;
    box-sizing: border-box;
}
.border-radius-4 {
    border-radius: 4px;
}
.border-radius-20 {
    border-radius: 20px;
}
.search-icon {
    width: 12px;
    vertical-align: baseline;
}
</style>