<template>
    <div
        v-if="list.length"
        class="flex nav-wrap relative sx-hidden sy-hidden"
        :style="{
            'background-color': content.bg_color_style == 1 ? bgColor : 'unset',
        }"
    >
        <componentBgImage
            :bgImage="content.bg_image"
            :show="content.bg_color_style == 2 && content.bg_image ? true : false"
            :opacity="content.bg_color_opacity"
        ></componentBgImage>
        <div
            v-for="(item, index) in list"
            :key="index"
            class="flex flex-1 align-center justify-between relative"
            style="flex-wrap: nowrap; flex-direction: column; overflow: hidden"
        >
            <img
                :src="item.nav_icon ? item.nav_icon : defaultImg"
                alt=""
                :class="[
                    {
                        'img-size-1': list.length == 1,
                        'img-size-2': list.length == 2,
                        'img-size-3': list.length == 3,
                        'img-size-4': list.length == 4,
                        'img-size-5': list.length == 5,
                    },
                ]"
            />

            <!-- 导航标题 -->
            <div
                v-if="item.name"
                class="txt-name text-els"
                :style="{
                    color: content.font_color,
                    marginTop: list.length == 1 ? '10px' : '',
                }"
            >
                {{ item.name || '' }}
            </div>
        </div>
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
        return {
            defaultImg: require('@/assets/customPage/pic_nav_def_middle.png'),
            defContent: [
                {
                    name: this.L('导航一'),
                    link_url: '',
                    nav_icon: '',
                },
                {
                    name: this.L('导航二'),
                    link_url: '',
                    nav_icon: '',
                },
                {
                    name: this.L('导航三'),
                    link_url: '',
                    nav_icon: '',
                },
                {
                    name: this.L('导航四'),
                    link_url: '',
                    nav_icon: '',
                },
            ],
        }
    },
    computed: {
        sourceInfo() {
            return this.$store.state.customPage.sourceInfo
        },
        list() {
            if (this.sourceInfo.source == 'appoint_activity' && this.defContent.length < 5) {
                this.defContent = this.defContent.concat([
                    {
                        name: this.L('导航五'),
                        link_url: '',
                        nav_icon: '',
                    },
                ])
            }
            return this.content && this.content.list && this.content.list.length ? this.content.list : this.defContent
        },
        bgColor() {
            if (!this.content) return ''
            return colorRgb(this.content.bg_color, this.content.bg_color_opacity)
        },
    },
}
</script>

<style scoped>
.nav-wrap {
    padding: 12px 0;
}
.txt-name {
    color: #000000;
    width: 100%;
    margin-top: 10px;
    text-align: center;
    font-size: 12px;
}

.img-size-1 {
    width: 116px;
    height: 116px;
}

.img-size-2 {
    width: 64px;
    height: 64px;
}

.img-size-3 {
    width: 54px;
    height: 54px;
}

.img-size-4 {
    width: 42px;
    height: 42px;
}

.img-size-5 {
    width: 50px;
    height: 50px;
}
</style>
