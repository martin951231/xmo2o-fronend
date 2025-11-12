<template>
    <div
        class="wrap"
        :style="{
            padding: content.show_distance == '1' ? `${Number(content.page_distance)/2}px` : 0,
        }"
    >
        <div class="swiper-wrap" :class="{
            'swiper-wrap-border-radius':content.show_distance == '1'
        }">
            <img
                v-if="content && content.list && content.list.length && !content.list[0]['image']"
                src="@/assets/customPage/def_img_adver.png"
                alt=""
                class="defImg"
            />
            <img
                v-else
                :src="content && content.list && content.list.length && content.list[0]['image']"
                alt=""
                class="list-img"
            />
            <div class="swiper-dots-wrap">
                <span class="swiper-dots active" :style="{ background: pageMainColor }"></span>
                <span class="swiper-dots"></span>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        content: {
            type: [String, Object],
            default: '',
        },
    },
    computed: {
        pageMainColor() {
            return this.$store.state.customPage.pageMainColor || '#ffffff'
        },
    },
}
</script>


<style scoped>
.wrap {
    width: 100%;
    box-sizing: border-box;
}
.swiper-wrap {
    position: relative;
    width: 100%;
    background: #f1f3f5;
    
    box-sizing: border-box;
    text-align: center;
    overflow: hidden;
}
.swiper-wrap-border-radius {
    border-radius: 10px;
}
.swiper-dots-wrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 20px;
    height: 3px;
    text-align: center;
}
.swiper-dots {
    margin: 0 2px;
    display: inline-block;
    width: 9px;
    height: 100%;
    background: #ffffff;
    opacity: 0.8;
    border-radius: 1px;
}
.swiper-dots.active {
    background: #ff814c;
    opacity: 1;
}
.defImg {
    margin: 8px 0;
    width: 79px;
    height: 55px;
}
.list-img {
    width: 100%;
    height: auto;
}
</style>