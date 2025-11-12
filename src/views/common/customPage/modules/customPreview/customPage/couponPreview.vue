<template>
    <div
        class="coupon-wrap flex flex-wrap relative sx-hidden sy-hidden"
        v-if="list.length"
        :class="{
            'padding-6': content.style_type == '2' || content.style_type == '3',
        }"
        :style="[
            {
                'background-color': bgModuleColor,
            },
        ]"
    >
        <componentBgImage
            :bgImage="content.bg_image_module"
            :show="content.bg_color_style_module == 2 && content.bg_image_module ? true : false"
            :opacity="content.bg_color_opacity_module"
        ></componentBgImage>
        <div
            v-for="(item, index) in list"
            :key="item.coupon_id"
            class="coupon-item relative"
            :class="{
                'box-shadow': content.bg_color == '#ffffff',
                'width-50': content.style_type == '2',
                'width-33': content.style_type == '3',
            }"
        >
            <div
                class="coupon-item-content"
                :class="{
                    'box-shadow': content.bg_color == '#ffffff',
                    'coupon-item-content-circle': content.style_type == 1,
                }"
                :style="{
                    background:
                        content.list && content.list.length
                            ? content.bg_color || '#ffffff'
                            : index == 0
                            ? content.bg_color || '#ffffff'
                            : 'rgba(200, 201, 204, 1)',
                    color:
                        content.list && content.list.length
                            ? content.font_color || '#000000'
                            : index == 0
                            ? content.font_color || '#000000'
                            : '#ffffff',
                }"
            >
                <!-- 大图模式 -->
                <div v-if="content.style_type == '1'" class="couponItemWrap">
                    <div class="flex align-center flex-1 coupon-info-wrap">
                        <!-- 面值 -->
                        <div
                            v-if="item.discount && item.discount != 0"
                            class="flex align-end discount-wrap text-nowrap"
                            :style="{
                                color:
                                    content.list && content.list.length
                                        ? content.discount_font_color || content.font_color || '#ffffff'
                                        : index == 0
                                        ? content.discount_font_color || content.font_color || '#ffffff'
                                        : '#ffffff',
                            }"
                        >
                            <span class="discount">{{ item.discount }}</span>
                            <span class="unit">{{ L('元') }}</span>
                        </div>
                        <!-- 名称&&描述 -->
                        <div class="flex flex-column no-wrap discount-info-wrap ml-14">
                            <span class="name no-wrap">{{ item.name }}</span>
                            <span class="discount-txt no-wrap">{{ item.discount_txt }}</span>
                        </div>
                    </div>
                    <div
                        class="get-coupon flex align-center justify-center"
                        :style="{
                            'border-left-color':
                                content.list && content.list.length
                                    ? content.dashed_color || content.font_color || '#ffffff'
                                    : index == 0
                                    ? content.dashed_color || content.font_color || '#ffffff'
                                    : '#ffffff',
                        }"
                    >
                        <span>{{ L('领取') }}</span>
                    </div>
                </div>
                <!-- 一行两个 || 一行三个 -->
                <div
                    v-if="content.style_type == '2' || content.style_type == '3'"
                    class="flex flex-column justify-center align-center height-100 pl-12"
                >
                    <!-- 面值 || 折扣 -->
                    <div
                        v-if="
                            (item.discount && item.discount != 0 && item.is_discount == 0) ||
                            (item.is_discount == 1 && item.discount_value && item.discount_value != 0)
                        "
                        class="flex align-end discount-wrap text-nowrap"
                        :style="{
                            color:
                                content.list && content.list.length
                                    ? content.discount_font_color || content.font_color || '#ffffff'
                                    : index == 0
                                    ? content.discount_font_color || content.font_color || '#ffffff'
                                    : '#ffffff',
                        }"
                    >
                        <span class="discount">{{ item.is_discount == 0 ? item.discount : item.discount_value }}</span>
                        <span class="unit">{{ item.is_discount == 0 ? L('元') : L('折') }}</span>
                    </div>
                    <!-- 描述 -->
                    <div class="flex flex-column no-wrap discount-info-wrap justify-center align-center">
                        <span class="discount-txt no-wrap text-center">{{ item.discount_txt }}</span>
                    </div>
                </div>
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
            demoList: [
                {
                    coupon_id: 1, //优惠券id
                    name: this.L('优惠券名称'), //优惠券名称
                    discount: '100.01', //优惠金额
                    discount_txt: this.L('无门槛使用，全部商品'), //优惠券折扣信息
                },
                {
                    coupon_id: 2,
                    name: this.L('优惠券名称'),
                    discount: '100.01',
                    discount_txt: this.L('无门槛使用，全部商品'),
                },
                {
                    coupon_id: 3,
                    name: this.L('优惠券名称'),
                    discount: '100.01',
                    discount_txt: this.L('无门槛使用，全部商品'),
                },
                {
                    coupon_id: 4,
                    name: this.L('优惠券名称'),
                    discount: '100.01',
                    discount_txt: this.L('无门槛使用，全部商品'),
                },
            ],
        }
    },
    computed: {
        list() {
            let demoList = this.content.style_type == '3' ? this.demoList.slice(0, 3) : this.demoList
            let listNew = this.content && this.content.list && this.content.list.length ? this.content.list : demoList
            // is_show == 2隐藏已失效或已领完的券 status 0 未启用 1 启用 2过期 3领完了
            if (this.content && this.content.is_show && this.content.is_show == '2') {
                listNew = listNew.filter((item) => {
                    if (item.status != 2 && item.status != 3) {
                        return item
                    }
                })
            }
            return listNew
        },
        bgModuleColor() {
            if (!this.content) return ''
            if (this.content.bg_color_module == undefined) return 'unset'
            return colorRgb(this.content.bg_color_module, this.content.bg_color_opacity_module)
        },
    },
}
</script>

<style scoped>
.coupon-wrap {
    width: 100%;
    padding: 6px 0;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-size: cover;
}
.coupon-item {
    width: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
}
.coupon-item-content {
    position: relative;
    width: 100%;
    height: 90px;
    -webkit-mask: radial-gradient(circle at 4px, transparent 4px, red 0) -4px / 100% 12px;
}
.coupon-item-content-circle {
    -webkit-mask: radial-gradient(circle at 4px, red 4px, transparent 0) -4px 50% / 100% 12px,
        radial-gradient(circle at 8px 8px, transparent 8px, red 0) -16px -8px / 76.5%;
    -webkit-mask-composite: destination-out;
}
.coupon-info-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 90px);
    height: 100%;
    padding: 0 16px 0 12px;
    box-sizing: border-box;
}
.discount-wrap {
    font-weight: bold;
    line-height: 1;
}
.discount {
    font-size: 22px;
}
.unit {
    margin-left: 4px;
    font-size: 14px;
}
.ml-14 {
    margin-left: 14px;
}
.discount-info-wrap {
    line-height: 16px;
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
}
.name {
    font-size: 14px;
    font-weight: 500;
}
.discount-txt {
    margin-top: 6px;
    font-size: 13px;
    font-weight: 400;
    opacity: 0.6;
}
.get-coupon {
    position: absolute;
    top: 0;
    right: 0;
    width: 90px;
    height: 90px;
    border-left: 1px dashed #ffffff;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 500;
}
.box-shadow {
    box-shadow: 0px 0px 12px 4px rgba(231, 231, 231, 0.42);
}

/* 一行两个 */
.width-50 {
    padding-left: 6px;
    padding-right: 6px;
    width: 50%;
    box-sizing: border-box;
}
.padding-6 {
    padding: 6px;
    box-sizing: border-box;
}
.height-100 {
    height: 100%;
}
.width-33 {
    padding-left: 6px;
    padding-right: 6px;
    width: 33.33333%;
    box-sizing: border-box;
}
.pl-12 {
    padding: 0 12px;
}
</style>
