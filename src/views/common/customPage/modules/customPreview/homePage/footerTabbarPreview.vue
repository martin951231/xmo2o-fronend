<template>
    <!-- 底部导航预览 -->
    <div 
        v-if="pageInfo && pageInfo.is_open" 
        class="footerTabbarWrap flex align-center justify-between"
        :style="{
            background: pageInfo.bg_color || '#ffffff'
        }">
        <div 
            v-for="(item,index) in pageInfo.content" 
            :key="index"
            class="flex-1 flex align-center flex-column pointer"
            @click="currentIndex = index">
            <img 
                class="tabbarImg"
                v-if="currentIndex != -1 && currentIndex == index" 
                :src="item.focus_image?item.focus_image:index == 0?indexDefaultIcon:$store.state.customPage.defaultImg"
                alt="">
            <img 
                v-else
                class="tabbarImg"
                :src="item.common_image?item.common_image:index == 0?indexDefaultIcon:$store.state.customPage.defaultImg" 
                alt="">
            <span 
                class="tabbarName"
                :style="{
                    color: currentIndex != -1 && currentIndex == index?pageInfo.select_color:pageInfo.nav_font_color || '#969799'
                }">{{item.name || L('导航名称')}}</span>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            currentIndex: -1,
            indexDefaultIcon: require('@/assets/customPage/tabBarIndexDefaultIcon.png')
        }
    },
    computed: {
        pageInfo() {
            return this.$store.state.customPage.pageInfo
        },
    },
    mounted() {
    },
    methods: {
    }
}
</script>

<style scoped>
.footerTabbarWrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 50px;
    background: #FFFFFF;
    box-shadow: 0 6px 22px 0 rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
}
.footerTabbarWrap div {
    padding: 4px 0;
    height: 100%;
    box-sizing: border-box;
    justify-content: space-around;
}
.tabbarImg {
    margin-bottom: 4px;
    width: 22px;
    height: 22px;
}
.tabbarName {
    font-size: 10px;
    font-weight: 400;
    color: #969799;
    line-height: 1;
}
</style>