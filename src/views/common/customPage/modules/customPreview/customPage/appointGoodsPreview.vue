<template>
    <div>
        <div
            class="title-wrap flex justify-between"
            v-if="
                content.goods_type == 1 &&
                (content.title || (content.goods_sort_style && content.goods_sort_style.length > 1))
            "
        >
            <div class="text-wrap" style="font-size: 17px" :style="[{ color: content.title_color || '#333333' }]">
                {{ content.title }}
            </div>
            <div v-if="content.goods_sort_style.length > 1" class="text-nowrap">
                <span
                    class="sort-tab"
                    v-for="(item, index) in content.goods_sort_style"
                    :key="item"
                    :class="[{ active: index == 0 }]"
                    :style="[{ backgroundColor: index == 0 ? content.buyBtn_bg_color : 'unset' }]"
                    >{{ getLabel(item) }}</span
                >
            </div>
        </div>

        <div :class="[{ flex: content.goods_classify_type == '2' }]" :style="[{height:content.goods_classify_type == '2'?'667px':'auto',overflowY:content.goods_classify_type == '2'?'hidden':'unset'}]">
            <!-- 商品分组 -->
            <div
                v-if="content.goods_type == 2 && catList.length"
                :class="[
                    {
                        'flex justify-between': content.goods_classify_type == 1,
                        goodsGroupSideWrap: content.goods_classify_type == '2',
                    },
                ]"
            >
                <div class="flex-1 sx-hidden text-nowrap">
                    <div
                        v-for="(item, index) in catList"
                        :key="index"
                        class="goodsGroupItem"
                        :class="{
                            goodsGroupItemLine:
                                content.goods_classify_type == '1' && content.goods_classify_style == '1',
                            goodsGroupItemRadius:
                                content.goods_classify_type == '1' && content.goods_classify_style == '2',
                            goodsGroupItemBlock:
                                content.goods_classify_type == '1' && content.goods_classify_style == '3',
                            goodsGroupItemSide: content.goods_classify_type == '2',
                            active: index == 0,
                        }"
                        :style="[
                            {
                                '--cat-active-color': content.buyBtn_bg_color,
                                fontWeight: index == 0?'bold':'normal'
                            },
                        ]"
                    >
                        <span>{{ item.cat_name_show || item.cat_name }}</span>
                    </div>
                </div>
                <div
                    v-if="content.goods_sort_style.length > 1 && content.goods_classify_type == 1"
                    class="text-nowrap flex align-center"
                    style="padding: 0 16px; height: inherit"
                >
                    <a-icon type="swap" style="transform: rotate(90deg)" />
                </div>
            </div>

            <!-- 商品 -->
            <div v-if="goodsList.length" :class="[{ 'flex-1': content.goods_classify_type == '2' }]">
                <div
                    class="goods-list-wrap"
                    :style="[
                        {
                            paddingLeft: content.page_distance + 'px',
                            paddingRight: content.page_distance + 'px',
                            overflowX: 'hidden',
                        },
                    ]"
                    :class="[
                        {
                            'text-nowrap': content.style_type == 5,
                        },
                    ]"
                >
                    <template v-for="(item, index) in goodsList">
                        <div
                            class="goods-item-wrap"
                            :key="item.appoint_id"
                            :style="[
                                {
                                    borderRadius: content.goods_radius == 1 ? '8px' : '0',
                                    margin: content.goods_distance + 'px',
                                    width: goodsWidth,
                                },
                            ]"
                            :class="[`goods-item-wrap-${content.style_type} goods-style-${content.goods_style}`]"
                            v-if="content.style_type != 4"
                        >
                            <div
                                class="goods-image flex align-center justify-center"
                                :class="[`goods-image-${content.style_type}`]"
                                :style="[
                                    {
                                        backgroundColor: item.list_pic ? 'unset' : '#ebedf1',
                                        height: goodsImageInfo.height
                                    },
                                ]"
                            >
                                <img
                                    :src="item.list_pic ? item.list_pic : defaultImg"
                                    :class="[{ 'goods-img-default': !item.list_pic }]"
                                />
                                <span class="goods-tag tag" v-if="content.style_type == 2 || content.style_type == 5">{{
                                    item.appoint_type == 0 ? L('到店') : L('上门')
                                }}</span>
                            </div>
                            <div class="goods-content">
                                <div class="flex justify-between">
                                    <span
                                        class="flex-1 cr-333"
                                        :class="[
                                            {
                                                'fs-16': content.style_type == 1,
                                                'fs-14': content.style_type != 1,
                                                'text-wrap': content.style_type == 1,
                                                'no-wrap': content.style_type != 1,
                                            },
                                        ]"
                                        :style="[{ fontWeight: content.font_weight }]"
                                        >{{ item.appoint_name }}</span
                                    >
                                    <span
                                        class="text-nowrap goods-comment-tag"
                                        v-if="content.style_type == 1 && showTag(item, 'score')"
                                        >{{ showTag(item, 'score') }}</span
                                    >
                                </div>
                                <div class="mt-10 text-wrap" v-if="content.style_type == 1">
                                    <span class="goods-tag tag">{{
                                        item.appoint_type == 0 ? L('到店') : L('上门')
                                    }}</span>
                                    <span class="goods-tag" v-if="showTag(item, 'expend_time')">{{
                                        showTag(item, 'expend_time')
                                    }}</span>
                                    <span class="goods-tag" v-if="showTag(item, 'appoint_sum')">{{
                                        showTag(item, 'appoint_sum')
                                    }}</span>
                                </div>
                                <div
                                    class="text-wrap"
                                    v-if="content.style_type == 2 || content.style_type == 5"
                                    style="margin-top: 5px; line-height: 12px; min-height: 13px"
                                >
                                    <span class="goods-tag-text" v-if="showTag(item, 'expend_time')">{{
                                        showTag(item, 'expend_time')
                                    }}</span>
                                    <span
                                        class="goods-tag-text-line"
                                        v-if="showTag(item, 'expend_time') && showTag(item, 'appoint_sum')"
                                        >|</span
                                    >
                                    <span class="goods-tag-text" v-if="showTag(item, 'appoint_sum')">{{
                                        showTag(item, 'appoint_sum')
                                    }}</span>
                                    <template v-if="content.style_type != 5 && showTag(item, 'score')">
                                        <span class="goods-tag-text-line">|</span>
                                        <span class="goods-tag-text">{{ showTag(item, 'score') }}</span>
                                    </template>
                                </div>
                                <div
                                    class="flex justify-between mt-10"
                                    v-if="isShowFiled('price') || isShowFiled('buy_btn')"
                                >
                                    <span
                                        class="price"
                                        :class="[{ 'price-small': content.style_type != 1 }]"
                                        v-if="isShowFiled('price')"
                                        ><span class="currency">{{ currency }}</span
                                        >{{ priceFormat(item)[0]
                                        }}<span class="currency" v-if="priceFormat(item).length > 1"
                                            >.{{ priceFormat(item)[1] }}</span
                                        ></span
                                    >
                                    <span v-if="!isShowFiled('price') && isShowFiled('buy_btn')"></span>
                                    <template v-if="isShowFiled('buy_btn')">
                                        <span
                                            class="buy-btn"
                                            :style="[
                                                {
                                                    backgroundColor: content.buyBtn_bg_color,
                                                    borderRadius: content.buyBtn_style == 1 ? '14px' : '8px',
                                                },
                                            ]"
                                            v-if="content.buyBtn_style != 3"
                                            :class="[{ 'buy-btn-small': content.style_type != 1 }]"
                                            >{{ L('立即预约') }}</span
                                        >
                                        <a-icon
                                            v-if="content.buyBtn_style == 3"
                                            type="plus-circle"
                                            theme="filled"
                                            :style="{
                                                color: content.buyBtn_bg_color,
                                                fontSize: '22px',
                                            }"
                                        />
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div
                            v-if="content.style_type == 4"
                            :key="item.appoint_id"
                            class="goods-item-wrap"
                            :style="[
                                {
                                    borderRadius: content.goods_radius == 1 ? '8px' : '0',
                                    margin: content.goods_distance + 'px',
                                    width: goodsWidth,
                                },
                            ]"
                            :class="[`goods-item-wrap-${content.style_type} goods-style-${content.goods_style}`]"
                        >
                            <div class="flex">
                                <div
                                    style="
                                        width: 76px;
                                        height: 76px;
                                        border-radius: 5px;
                                        margin-right: 10px;
                                        background-color: #ebedf1;
                                        overflow: hidden;
                                    "
                                    class="flex align-center justify-center"
                                >
                                    <img
                                        :src="item.list_pic ? item.list_pic : defaultImg"
                                        alt=""
                                        :style="[
                                            {
                                                width: item.list_pic ? '100%' : '50%',
                                                height: item.list_pic ? '100%' : 'auto',
                                                objectFit: 'cover',
                                            },
                                        ]"
                                    />
                                </div>

                                <div class="flex-1" style="overflow: hidden">
                                    <div class="fs-16 text-wrap cr-333" :style="[{ fontWeight: content.font_weight }]">
                                        <span>{{ item.appoint_name }}</span>
                                    </div>
                                    <div class="text-wrap cr-99 mt-10 appoint_content" style="font-size: 13px">
                                        <span>{{ item.appoint_content || zanweiStr}}</span>
                                    </div>
                                    <div class="flex justify-between text-wrap">
                                        <span class="price" v-if="isShowFiled('price')"
                                            ><span class="currency">{{ currency }}</span
                                            >{{ priceFormat(item)[0]
                                            }}<span class="currency" v-if="priceFormat(item).length > 1"
                                                >.{{ priceFormat(item)[1] }}</span
                                            ></span
                                        >
                                        <span
                                            class="goods-tag-text"
                                            style="font-size: 12px"
                                            v-if="showTag(item, 'appoint_sum')"
                                            >{{ showTag(item, 'appoint_sum') }}</span
                                        >
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-between" style="margin-top: 24px">
                                <div>
                                    <span
                                        class="text-nowrap goods-comment-tag mr-10"
                                        style="margin-bottom: 8px"
                                        v-if="showTag(item, 'score')"
                                        >{{ showTag(item, 'score') }}</span
                                    >
                                    <span class="goods-tag">{{ item.appoint_type == 0 ? L('到店') : L('上门') }}</span>
                                    <span class="goods-tag" v-if="showTag(item, 'expend_time')">{{
                                        showTag(item, 'expend_time')
                                    }}</span>
                                </div>
                                <template v-if="isShowFiled('buy_btn')">
                                    <span
                                        class="buy-btn text-nowrap"
                                        :style="[
                                            {
                                                backgroundColor: content.buyBtn_bg_color,
                                                borderRadius: content.buyBtn_style == 1 ? '14px' : '8px',
                                            },
                                        ]"
                                        v-if="content.buyBtn_style != 3"
                                        :class="[{ 'buy-btn-small': content.style_type != 1 }]"
                                        >{{ L('立即预约') }}</span
                                    >
                                    <a-icon
                                        v-if="content.buyBtn_style == 3"
                                        type="plus-circle"
                                        theme="filled"
                                        :style="{
                                            color: content.buyBtn_bg_color,
                                            fontSize: '22px',
                                        }"
                                    />
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <div v-if="showLoadMore" class="load-more">{{ L('点击加载更多') }}</div>
        </div>
    </div>
</template>

<script>
let goodsDemoList = new Array(4).fill({
    appoint_id: '',
    appoint_name: '此处显示预约名称',
    appoint_price: '10',
    appoint_sum: 10,
    score: '5.0',
    expend_time: '40',
    appoint_content: '此处显示预约描述',
    list_pic: '',
    appoint_type: 0,
})
goodsDemoList = JSON.parse(JSON.stringify(goodsDemoList)).map((item, index) => {
    item.appoint_id = index
    return item
})
const catDemoList = [
    {
        cat_name: '分组一',
        cat_id: 1,
    },
    {
        cat_name: '分组二',
        cat_id: 2,
    },
]
import customPageApi from '@/api/common/platform/customPage'
export default {
    props: {
        content: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {
            defaultImg: require('@/assets/customPage/goodsDefaultImg.png'),
            currency: '￥',
            currentId: -1,
            goodsSortStyleOptions: [
                {
                    value: 'create_time',
                    label: this.L('最新'),
                },
                {
                    value: 'views',
                    label: this.L('人气'),
                },
                {
                    value: 'price',
                    label: this.L('价格'),
                },
                {
                    value: 'goods_comment',
                    label: this.L('星级'),
                },
            ],
            goodsDemoList,
            goodsList: [],
            goodsTotal: 0,
            zanweiStr: '   ',
        }
    },
    computed: {
        // 商品宽度
        goodsWidth() {
            let windowWidth = '375px'
            if (!this.content) return windowWidth
            // 侧边菜单宽度
            let sliderWidth = '88px'
            // 1 大图模式 2 一行两个 4 详情列表 5 横向滑动
            const { style_type, page_distance, goods_distance, goods_classify_type } = this.content
            if (style_type == 1 || style_type == 4) {
                // 商品分组侧边菜单
                if (goods_classify_type == '2') {
                    return `calc(${windowWidth} - ${sliderWidth} - ${page_distance * 2}px - ${goods_distance * 2}px)`
                } else {
                    return `calc(${windowWidth} - ${page_distance * 2}px - ${goods_distance * 2}px)`
                }
            }
            if (style_type == 2) {
                return `calc((${windowWidth} - ${page_distance * 2}px - ${goods_distance * 4}px) / 2)`
            }
            if (style_type == 5) {
                // 横向滑动 宽度固定
                return `calc(244px / 2)`
            }
        },
        //图片的宽高（2、5、4为宽高一致）
        goodsImageInfo(){
            let params = {
                width: this.goodsWidth,
                height: '100%'
            }
            if (!this.content) return params
            this.content.style_type == 2 || this.content.style_type == 5 ? this.goodsWidth : 'calc(378px / 2)'
            if(this.content.style_type == 2 || this.content.style_type == 5 || this.content.style_type == 4){
                params.height = this.goodsWidth
            }else if(this.content.style_type == 1){
                params.height = 'calc(378px / 2)'
            }
            return params
        },
        // 价格处理
        priceFormat() {
            return ({ appoint_price = 0, is_autotrophic = 0 }) => {
                return is_autotrophic == 1
                    ? ['面议']
                    : isNaN(appoint_price)
                    ? [appoint_price]
                    : Number(appoint_price).toFixed(2).split('.')
            }
        },
        // 分组
        catList() {
            if (!this.content) return []
            let list = this.content.list || catDemoList
            if (this.content.goods_classify_type == 1 && this.content.show_allClassify == 1) {
                list = [
                    {
                        cat_name: '全部',
                        cat_id: -1,
                    },
                ].concat(list)
            }
            return list
        },
        // 加载更多显隐 商品分组
        showLoadMore() {
            let show = false
            if (!this.content) return show
            if(this.content.style_type == 5 || this.content.goods_classify_type == 2) return show
            if (this.content.list && this.content.list.length) {
                let cat_id = this.catList[0]['cat_id']
                let appoint_num = this.catList[0]['appoint_num'] || 0
                let goodsListLen = this.goodsList.length || 0
                let show_num = this.catList[0]['show_num'] || 1
                if (
                    this.content.goods_type == 1 &&
                    this.content.goods_type_val == 2 &&
                    goodsListLen < Number(appoint_num)
                ) {
                    show = true
                }
                if (this.content.goods_type == 2) {
                    if (cat_id == -1 && goodsListLen < Number(this.goodsTotal)) {
                        show = true
                    } else {
                        // 显示个数全部
                        if (show_num == 2 && goodsListLen < Number(appoint_num)) {
                            show = true
                        }
                    }
                }
            }
            return show
        },
    },
    watch: {
        'content.list'() {
            this.getList()
        },
    },
    mounted() {
        this.getList()
    },
    methods: {
        showTag(item, field) {
            let str = ''
            switch (field) {
                case 'score':
                    str = Number(item.score) > 0 ? this.L('X1星级', { X1: item.score }) : ''
                    break
                case 'expend_time':
                    str = Number(item.expend_time) > 0 ? this.L('X1分钟', { X1: item.expend_time }) : ''
                    break
                case 'appoint_sum':
                    str = Number(item.appoint_sum) > 0 ? this.L('已售X1', { X1: item.appoint_sum }) : ''
                    break
                default:
                    break
            }
            return str
        },
        getLabel(item) {
            return this.goodsSortStyleOptions.find((sItem) => sItem.value == item).label
        },
        isShowFiled(filed) {
            let show_filed = this.content.show_filed || []
            let show = true
            if (show_filed.length) {
                show_filed.forEach((item) => {
                    if (item.value == filed) {
                        show = item.is_checked
                    }
                })
            }
            return show
        },
        // 获取列表
        async getList() {
            let list = this.goodsDemoList
            if (this.content && this.content.list && this.content.list.length) {
                const {
                    goods_type = 1,
                    goods_type_val = 1,
                    goods_classify_type = 1,
                    show_allClassify = 1,
                } = this.content
                // 商品
                let params = {}
                if (goods_type == 1 && goods_type_val == 1) {
                    params.ids = this.content.list
                    params.page_size = this.content.list.length
                    params.page = 1
                } else {
                    // 分组
                    params.page_size = 10
                    params.page = 1
                    if (goods_classify_type == 1 && show_allClassify == 1) {
                        // 全部分组显示
                        params.cat_fid = ''
                    } else {
                        let firstCat = this.content.list[0]
                        params.cat_fid = firstCat.cat_id
                        if (goods_type == 2 && firstCat.show_num == 1) {
                            params.page_size = firstCat.show_num_val
                        }
                    }
                }
                params.sort = this.content.goods_sort_style && this.content.goods_sort_style.length?this.content.goods_sort_style[0]:''
                let result = await this.request(customPageApi.activityAppointList, params)
                list = result.data || []
                this.goodsTotal = result.total || 0
            }
            this.goodsList = list
        },
    },
}
</script>

<style scoped lang="less">
.title-wrap {
    padding: 5px 18px;
    box-sizing: border-box;
    font-size: 17px;
    font-weight: bold;
    color: #333333;
    .sort-tab {
        margin-left: 18px;
        padding: 4px 6px;
        font-size: 13px;
        border-radius: 5px;
        &.active {
            color: #ffffff;
        }
    }
}

.goods-list-wrap {
    box-sizing: border-box;
    .goods-item-wrap {
        overflow: hidden;
        box-sizing: border-box;
        &.goods-item-wrap-2,
        &.goods-item-wrap-5 {
            display: inline-block;
        }
        .goods-image {
            overflow: hidden;
            &.goods-image-1 {
                height: calc(378px / 2);
            }
            &.goods-image-2,
            &.goods-image-5 {
                height: 88px;
                position: relative;
                .goods-tag.tag {
                    position: absolute;
                    top: 6px;
                    left: 6px;
                }
            }
            img {
                object-fit: cover;
                width: 100%;
                height: 100%;
                &.goods-img-default {
                    object-fit: cover;
                    width: 54px;
                    height: 50px;
                }
            }
        }
        .goods-content {
            padding: 14px 12px;
            background-color: #ffffff;
            box-sizing: border-box;
            min-height: 102px;
        }
        .goods-comment-tag {
            align-self: flex-start;
            padding: 4px 6px;
            font-size: 11px;
            font-weight: 500;
            color: #efe3d7;
            background: linear-gradient(90deg, #323232, #181818);
            border-radius: 3px;
            line-height: 1;
            display: inline-block;
        }
        .goods-tag {
            display: inline-block;
            margin-right: 8px;
            margin-bottom: 8px;
            padding: 2px 4px;
            line-height: 1;
            white-space: nowrap;
            font-size: 12px;
            font-weight: 500;
            color: #755926;
            border-radius: 3px;
            border: 1px solid #baa891;
            box-sizing: border-box;
            &.tag {
                padding: 4px 4px;
                background: linear-gradient(0deg, #faeab9, #fedaa4);
                color: #483f2d;
                border: none;
                font-size: 10px;
            }
        }
        .price {
            font-size: 18px;
            font-weight: bold;
            color: #ff3000;
            .currency {
                font-size: 13px;
            }
            &.price-small {
                font-size: 16px;
                .currency {
                    font-size: 11px;
                }
            }
        }
        .buy-btn {
            padding: 8px 13px;
            line-height: 1;
            font-size: 12px;
            font-weight: 500;
            color: #ffffff;
            align-self: flex-start;
            &.buy-btn-small {
                padding: 6px 10px;
                font-size: 10px;
            }
        }
        .goods-tag-text {
            font-size: 10px;
            font-weight: 500;
            color: #999999;
        }
        .goods-tag-text-line {
            margin: 0 4px;
            color: #d6d6d6;
            font-size: 10px;
        }
        .appoint_content{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
    }
    .goods-item-wrap-4 {
        padding: 17px 21px;
        box-sizing: border-box;
        background-color: #ffffff;
    }
    .goods-style-1 {
        background-color: #ffffff;
    }
    .goods-style-2 {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
    }
    .goods-style-3 {
        border: 1px solid rgba(50, 50, 51, 0.1);
        background: #ffffff;
    }
}

.cat-name {
    padding: 10px 14px;
}
.goodsGroupItem {
    position: relative;
    padding: 0 16px;
    font-size: 14px;
    color: #646566;
    box-sizing: border-box;
    min-width: 25%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.goodsGroupItemLine {
    height: 44px;
}
.goodsGroupItemLine:after {
    content: '';
    width: 27%;
    height: 3px;
    background: transparent;
    position: absolute;
    left: 50%;
    bottom: 5px;
    transform: translate(-50%, 0);
    border-radius: 3px;
}
.goodsGroupItemLine.active {
    color: var(--cat-active-color, #f44);
}
.goodsGroupItemLine.active.goodsGroupItemLine:after {
    background: var(--cat-active-color, #f44);
}
.goodsGroupItemRadius.active span {
    padding: 6px 12px;
    height: 32px;
    background: var(--cat-active-color, #f44);
    color: #ffffff;
    border-radius: 32px;
    box-sizing: border-box;
}
.goodsGroupItemBlock {
    height: 40px;
    line-height: 40px;
}
.goodsGroupItemBlock.active {
    background: var(--cat-active-color, #f44);
    color: #ffffff;
}
.goodsGroupSideWrap {
    width: 88px;
    background: #f2f2f2;
}
.goodsGroupItemSide {
    min-height: 44px;
}
.goodsGroupItemSide.active {
    background: #ffffff;
}
.goodsGroupItemSide.active::before {
    content: '';
    width: 2px;
    height: 40%;
    background: #f44;
    position: absolute;
    top: 50%;
    left: 2px;
    transform: translate(0, -50%);
}
.load-more {
    width: 100%;
    font-size: 12px;
    padding: 10px 0;
    text-align: center;
}
</style>
