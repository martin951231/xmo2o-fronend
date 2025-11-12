<template>
    <div class="decoratePage bg-ff">
        <component :is="component" v-if="component"></component>
        <customPageDecorate v-else></customPageDecorate>
    </div>
</template>
<script>
import indexDecorate from './homePage/indexDecorate'
import myDecorate from './homePage/myDecorate'
import footerTabbarDecorate from '@/views/common/customPage/modules/customDecorate/homePage/footerTabbarDecorate'
import floatBtnDecorate from '@/views/common/customPage/modules/customDecorate/homePage/floatBtnDecorate'
import customPageIndexDecorate from '@/views/common/customPage/modules/customDecorate/customPage/indexDecorate'
import customPageDecorate from '@/views/common/customPage/modules/customDecorate/customPage/customPageDecorate'
// 装修组件
const components = {
    index: indexDecorate,
    my: myDecorate,
    footerTabbar: footerTabbarDecorate,
    floatBtn: floatBtnDecorate,
    customPageIndex: customPageIndexDecorate,
    customPageDecorate: customPageDecorate
}
export default {
    components,
    data() {
        return {
            component: '',
        }
    },
    computed: {
        componentId() {
            this.component = components[this.$store.state.customPage.componentId] || ''
            return this.$store.state.customPage.componentId
        }
    },
    watch: {
        // 监听组件id,切换组件
        componentId: {
            deep: true,
            handler(val) {
                // console.log(val,'val')
                this.component = components[val] || ''
            }
        }
    },
}
</script>
<style scoped>
.decoratePage {
    padding: 20px 0;
    width: 500px;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
}
</style>