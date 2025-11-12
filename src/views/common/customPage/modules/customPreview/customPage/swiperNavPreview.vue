<template>
    <div class="wrap" ref="swiperNavWrap">
        <div v-for="(item, index) in list" :key="index" class="swiper-nav-wrap">
            <div class="flex flex-wrap" v-show="index == 0">
                <div
                    v-for="(subItem, subIndex) in item"
                    :key="subIndex"
                    class="swiper-nav-item flex flex-column align-center"
                    :class="content.style_type == '2' ? 'small-swiper-nav-item' : ''"
                >
                    <div
                        class="subItem-image-wrap flex align-center justify-center"
                        :style="{
                            height: content.style_type == '2' ? 'auto' : swiperItemHeight + 'px',
                            width: content.style_type == '2' ? '24px' : '100%',
                        }"
                    >
                        <img
                            v-if="subItem.image"
                            :src="subItem.image"
                            alt=""
                            :class="content.style_type == '2' ? 'subItem-small-image' : 'subItem-image'"
                        />
                        <img
                            v-else
                            :src="content.style_type == '2' ? defaultSmallImage : defaultImage"
                            alt=""
                            :class="content.style_type == '2' ? 'subItem-small-image' : 'subItem-image'"
                        />
                        <div
                            v-show="subItem.show_badge && subItem.show_badge == '1' && subItem.badge_val.trim() != ''"
                            class="badge"
                        >
                            <span>{{ subItem.badge_val.trim() }}</span>
                        </div>
                    </div>
                    <span class="swiper-nav-title text-nowrap text-els">{{ subItem.title }}</span>
                </div>
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

    data() {
        return {
            defaultImage: require('@/assets/customPage/swiperNavDefaultImage.png'),
            defaultSmallImage: require('@/assets/customPage/pic_nav_def_small.png'),
            demoList: [
                [
                    {
                        title: this.L('标题X1', { X1: 1 }),
                        link_url: '',
                        image: '',
                        show_badge: '2',
                        badge_val: '',
                    },
                    {
                        title: this.L('标题X1', { X1: 2 }),
                        link_url: '',
                        image: '',
                        show_badge: '2',
                        badge_val: '',
                    },
                    {
                        title: this.L('标题X1', { X1: 3 }),
                        link_url: '',
                        image: '',
                        show_badge: '2',
                        badge_val: '',
                    },
                    {
                        title: this.L('标题X1', { X1: 4 }),
                        link_url: '',
                        image: '',
                        show_badge: '2',
                        badge_val: '',
                    },
                    {
                        title: this.L('标题X1', { X1: 5 }),
                        link_url: '',
                        image: '',
                        show_badge: '2',
                        badge_val: '',
                    },
                ],
            ],
            swiperItemHeight: 0, // 高度设置
        }
    },
    computed: {
        list() {
            let list = []
            if(this.content && this.content.list) {
                list = this.content.list
            }
            list = !list.length?this.demoList:this.getSlider(list, this.content.show_column)
            return list
        },
    },
    mounted() {
        let clientWidth = 375
        if (this.$refs.swiperNavWrap.clientWidth) {
            clientWidth = this.$refs.swiperNavWrap.clientWidth
        }
        this.swiperItemHeight = clientWidth / 5 - 24
    },
    methods: {
        // 导航
        getSlider(list, show_column = 1) {
            let columnNum = Number(show_column) * 5
            let num = list.length / columnNum
            let slider = []
            if (num) {
                for (var i = 0; i < num; i++) {
                    slider[i] = list.slice(i * columnNum, (i + 1) * columnNum)
                    if (i + 1 == num && num * columnNum < list.length) {
                        slider[num] = list.slice(num * columnNum)
                    }
                }
            }
            return slider
        },
    },
}
</script>

<style scoped>
.wrap,
.swiper-nav-wrap {
    width: 100%;
}
.swiper-nav-item {
    padding: 12px;
    width: 20%;
    box-sizing: border-box;
}
.swiper-nav-title {
    margin-top: 10px;
    font-size: 11px;
    font-weight: 500;
    color: #000000;
}
.small-swiper-nav-item .swiper-nav-title {
    color: #333333;
}
.subItem-image-wrap {
    position: relative;
    width: 100%;
    height: calc(375px / 5 - 24px);
}
.small-swiper-nav-item .subItem-image-wrap {
    height: auto;
}
.subItem-image {
    width: 100%;
    height: 100%;
}
.subItem-small-image {
    width: 32px;
    height: 32px;
}
.badge {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(30%, -45%);
    padding: 0 4px;
    background: #ff6a48;
    border-radius: 12px 12px 12px 4px;
    font-size: 9px;
    font-weight: bold;
    color: #ffffff;
    vertical-align: middle;
    white-space: nowrap;
}
.small-swiper-nav-item .badge {
    transform: translate(50%, -45%);
}
</style>