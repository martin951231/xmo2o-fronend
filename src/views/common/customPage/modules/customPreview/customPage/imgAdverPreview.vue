<template>
    <div>
        <div v-if="list.length">
            <!-- 显示方式为轮播图 -->
            <div
                v-if="content && content.style_type && content.style_type == '6'"
                :style="{
                    'margin-left': content.page_distance + 'px',
                    'margin-right': content.page_distance + 'px',
                }"
            >
                <a-carousel autoplay>
                    <template v-for="(item, index) in content.list">
                        <div :key="index" class="slider-img" v-if="item.pic">
                            <div class="relative sx-hidden sy-hidden">
                                <a :href="item.link_url" class="block sx-hidden">
                                    <img
                                        v-if="item.pic"
                                        :src="item.pic"
                                        alt=""
                                        class="slider-img"
                                        :style="{
                                            'border-radius': content.pic_radius == '2' ? '10px' : '0',
                                        }"
                                    />
                                </a>
                                <!-- 标题 -->
                                <div
                                    class="title-box cr-white fs-14 text-left absolute"
                                    v-if="item.name"
                                    :style="
                                        content.pic_radius == '2' ? 'border-radius:0 0 10px 10px' : 'border-radius:0'
                                    "
                                    style="padding-left: 10px"
                                >
                                    <span class="text-nowrap">{{ item.name }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </a-carousel>
            </div>
            <!-- 显示方式为轮播图 end -->

            <!-- 一行一个和一行两个 -->
            <div
                class="flex align-center"
                :class="{
                    'flex-column justify-center': content.style_type == '1',
                    'justify-between flex-wrap': content.style_type == '2',
                }"
                v-else
                :style="{
                    'margin-left': content.page_distance + 'px',
                    'margin-right': content.page_distance + 'px',
                }"
            >
                <template v-for="(item, index) in content.list">
                    <div
                        :key="index"
                        :style="{
                            width: content.style_type == '1' ? '100%' : '',
                            'margin-top':
                                content.style_type &&
                                content.style_type == '1' &&
                                content.list.length > 1 &&
                                index != 0 &&
                                item.pic
                                    ? '10px'
                                    : 0,
                        }"
                        v-if="item.pic"
                    >
                        <div class="relative">
                            <a :href="item.link_url" class="block">
                                <!-- 一行一个 -->
                                <img
                                    v-if="item.pic && content.style_type && content.style_type == '1'"
                                    :src="item.pic"
                                    alt=""
                                    class="img-size-one"
                                    :style="{
                                        'border-radius': content.pic_radius == '2' ? '10px' : '0',
                                    }"
                                />
                                <!-- 占位 -->
                                <div
                                    v-if="!item.pic && content.style_type && content.style_type == '1'"
                                    class="img-size-one"
                                />
                                <!-- 一行两个 -->
                                <img
                                    v-if="item.pic && content.style_type && content.style_type == '2'"
                                    :src="item.pic"
                                    alt=""
                                    class="img-size-two"
                                    :style="{
                                        'border-radius': content.pic_radius == '2' ? '10px' : '0',
                                        width: 185 - content.page_distance + 'px',
                                    }"
                                />
                            </a>
                            <!-- 标题 -->
                            <div
                                class="title-box cr-white fs-14 text-center flex-1 absolute"
                                v-if="item.name"
                                :style="{
                                    'border-radius': content.pic_radius == '2' ? '0 0 10px 10px' : '0',
                                    height: content.style_type == '1' ? '36px' : '22px',
                                    'line-height': content.style_type == '1' ? '36px' : '22px',
                                }"
                            >
                                <span class="text-nowrap">{{ item.name }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- 图片广告默认样式 -->
        <div class="adver-box flex justify-center align-center flex-column" v-else>
            <div class="content-img flex justify-center align-end">
                <img src="@/assets/customPage/def_img_adver.png" alt="" />
            </div>
            <div class="def-des fs-14 flex">
                <p style="margin-top: 30px; color: #9a9a9c; margin-bottom: 0">点击编辑图片广告</p>
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
        list() {
            let arr = []
            const { list = [] } = this.content
            if (list.length) {
                arr = list.filter((item) => item.pic)
            }
            return arr
        },
    },
}
</script>

<style scoped>
.img-size-one {
    width: 100%;
    height: auto;
}
.img-size-two {
    height: 99px;
}
/* 默认展示时的样式 */
.adver-box {
    height: 200px;
    background-color: #f1f3f5;
}
.content-img {
    width: 150px;
    height: 126px;
}
.def-des {
    height: 74px;
}

/* 轮播图样式 */
.ant-carousel >>> .slick-slide {
    height: 168px;
}
.ant-carousel >>> .slick-dots > li > button {
    /* background-color: rgba(0, 0, 0, 0.4); */
    width: 6px;
    height: 6px;
    border-radius: 100%;
}
.ant-carousel >>> .slick-list {
    width: 100%;
    height: 168px;
}
.ant-carousel >>> .slick-active {
    width: 12px;
    height: 6px;
    border-radius: 6px;
    background-color: #ffffff;
}
.slider-img {
    width: 100%;
    height: 168px;
}
.title-box {
    width: 100%;
    line-height: 36px;
    background-color: rgba(0, 0, 0, 0.6);
    bottom: 0;
    left: 0;
}
</style>
