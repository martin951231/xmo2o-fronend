<template>
    <div
        v-if="content"
        class="mallGoodsPreviewWrap"
        :class="{
            'flex mallGoodsPreviewSideWrap': content.goods_classify_type == '2',
        }"
        :style="{
            'padding-left': content.goods_type == '1' ? content.page_distance + 'px' : 0,
            'padding-right': content.goods_type == '1' ? content.page_distance + 'px' : 0,
        }"
    >
        <!-- 商品分组 -->
        <div
            :class="{
                'goodsGroupWrap flex': content.goods_classify_type == '1',
                goodsGroupSideWrap: content.goods_classify_type == '2',
            }"
            v-if="content.goods_type == '2' && catList.length > 1"
        >
            <div
                v-for="(item, index) in catList"
                :key="index"
                class="goodsGroupItem flex align-center justify-center"
                :class="{
                    goodsGroupItemLine: content.goods_classify_type == '1' && content.goods_classify_style == '1',
                    goodsGroupItemRadius: content.goods_classify_type == '1' && content.goods_classify_style == '2',
                    goodsGroupItemBlock: content.goods_classify_type == '1' && content.goods_classify_style == '3',
                    goodsGroupItemSide: content.goods_classify_type == '2',
                    active: index == 0,
                }"
            >
                <span>{{ item.cat_name_show || item.cat_name }}</span>
            </div>
        </div>
        <!-- 商品列表 -->
        <div
            class="goodsListWrap flex"
            :style="{
                'padding-left': content.goods_type == '2' ? content.page_distance + 'px' : 0,
                'padding-right': content.goods_type == '2' ? content.page_distance + 'px' : 0,
            }"
            :class="{
                'flex-wrap': content.style_type != '5',
                'overflow-x': content.style_type == '5',
                overflowHidden: content.style_type != '5',
                'flex-1': content.goods_classify_type == '2',
                'flex-row': content.style_type == '4' && content.goods_classify_type == '2',
            }"
        >
            <!-- 分组名称 -->
            <div v-if="content.style_type == '4' && content.goods_classify_type == '2'" class="catName">
                {{ catList[0].cat_name_show || catList[0].cat_name }}
            </div>
            <template v-for="(item, index) in goodsList">
                <div
                    :key="index"
                    :class="{
                        'width-100': content.style_type == '1' || content.style_type == '4',
                        'width-50': content.style_type == '2',
                        'width-30': content.style_type == '5',
                    }"
                    :style="{
                        margin: content.goods_classify_type == '1' ? content.goods_distance + 'px' : 0,
                        'margin-bottom': content.goods_distance + 'px',
                        width: goodsWidth,
                        'border-radius': content.goods_radius == '1' ? '8px' : '0',
                        overflow:content.goods_radius == '1' && content.goods_style != 2?'hidden':'unset'
                    }"
                >
                    <div
                        class="goodsItem"
                        :style="{
                            'border-radius':
                                content.goods_classify_type == '1' && content.goods_radius == '1' ? '8px' : '0',
                        }"
                        :class="{
                            goods_style_1: content.goods_style == '1',
                            goods_style_2: content.goods_style == '2',
                            goods_style_3: content.goods_style == '3',
                            flex: content.style_type == '4',
                        }"
                    >
                        <div
                            class="goodsImgWrap"
                            :class="{
                                goodsImgBigWrap: content.style_type == '1',
                                goodsImgMiddleWrap: content.style_type == '2' || content.style_type == '4',
                                goodsImgSmallWrap: content.style_type == '5',
                                goodsImgSideWrap: content.goods_classify_type == '2',
                            }"
                            :style="{
                                'border-radius':
                                    content.goods_classify_type == '2' && content.goods_radius == '1' ? '8px' : '0',
                            }"
                        >
                            <img :src="item.image" alt="" v-if="item.image" style="width: 100%; height: 100%" />
                            <img :src="defaultImg" alt="" v-else class="defaultImg" />

                            <!-- 角标 -->
                            <div
                                class="goodsBadgeWrap"
                                v-if="isShowFiled('goods_badge')"
                                :style="{
                                    top:
                                        content.goodsBadge_style == '2'
                                            ? '10px'
                                            : content.goodsBadge_style == '3'
                                            ? 0
                                            : content.goodsBadge_style == '4'
                                            ? '10px'
                                            : '10px',
                                    left:
                                        content.goodsBadge_style == '2'
                                            ? '10px'
                                            : content.goodsBadge_style == '3'
                                            ? '10px'
                                            : content.goodsBadge_style == '4'
                                            ? '10px'
                                            : content.goodsBadge_style == '5'
                                            ? '10px'
                                            : '0',
                                }"
                            >
                                <span v-if="content.goodsBadge_style == '1'" class="goodsBadge_style_1">
                                    {{ L('新品') }}
                                </span>
                                <span v-if="content.goodsBadge_style == '2'" class="goodsBadge_style_2">
                                    {{ L('热卖') }}
                                </span>
                                <span v-if="content.goodsBadge_style == '3'" class="goodsBadge_style_3"> NEW </span>
                                <span v-if="content.goodsBadge_style == '4'" class="goodsBadge_style_4">
                                    <span>HOT</span>
                                </span>
                                <span
                                    v-if="content.goodsBadge_style == '5' && !content.goodsBadge_style_val"
                                    class="goodsBadge_style_5"
                                >
                                    {{ L('角标区域') }}
                                </span>
                                <img
                                    v-if="content.goodsBadge_style == '5' && content.goodsBadge_style_val"
                                    :src="content.goodsBadge_style_val"
                                    alt=""
                                    class="goodsBadgeImg"
                                />
                            </div>
                        </div>
                        <div
                            class="goodsInfoWrap bg-ff"
                            v-if="
                                (isShowFiled('goods_name') && item.goods_name) ||
                                (isShowFiled('price') && (item.price || item.price == 0)) ||
                                isShowFiled('buy_btn')
                            "
                            :style="{
                                'min-height':
                                    content.style_type != '1' && content.style_type != '5'
                                        ? content.goods_classify_type == 2?'108':'112px'
                                        : content.style_type == '5'
                                        ? '80px'
                                        : 'auto',
                                'padding-top': content.style_type == '4' || content.style_type == '5' ? '8px' : '14px',
                                'padding-bottom':
                                    content.style_type == '4' || content.style_type == '5' ? '8px' : '14px',
                            }"
                            :class="{
                                'flex flex-column justify-between': content.style_type != '1',
                                'flex-1': content.goods_classify_type == '2',
                                goodsInfoMiddleWrap: content.style_type == '4',
                            }"
                        >
                            <div
                                class="goodsName"
                                :style="{
                                    'font-weight': content.font_weight,
                                    'text-align': content.text_align,
                                }"
                                v-if="isShowFiled('goods_name') && item.goods_name"
                            >
                                <span>{{ item.goods_name }}</span>
                            </div>
                            <div
                                class="flex align-center justify-between"
                                v-if="
                                    (isShowFiled('price') && (item.price || item.price == 0)) || isShowFiled('buy_btn')
                                "
                                :class="{
                                    'flex-column': content.text_align == 'center',
                                }"
                            >
                                <div
                                    class="flex align-end priceWrap no-wrap flex-1"
                                    v-if="isShowFiled('price') && (item.price || item.price == 0)"
                                    :class="{
                                        'mt-5': content.style_tyle == '5',
                                        'mt-10': content.style_tyle != '5',
                                    }"
                                >
                                    <span class="currency">{{ currency }}</span>
                                    <span
                                        class="price no-wrap flex-1"
                                        :style="{
                                            'font-weight': content.font_weight,
                                        }"
                                        >{{ item.price }}</span
                                    >
                                </div>
                                <!-- 占位 -->
                                <div v-else></div>
                                <div
                                    class="buyBtnWrap"
                                    v-if="isShowFiled('buy_btn')"
                                    :class="{
                                        'mt-5': content.style_tyle == '5',
                                        'mt-10': content.style_tyle != '5',
                                    }"
                                >
                                    <a-icon v-if="content.buyBtn_style == '1'" type="plus-circle" class="buyBtnIcon" />
                                    <img
                                        v-if="content.buyBtn_style == '2'"
                                        src="@/assets/customPage/shoppingCartIcon.png"
                                        class="shoppingCartIcon"
                                    />
                                    <span
                                        v-if="content.buyBtn_style == '3' || content.buyBtn_style == '4'"
                                        class="buyBtn"
                                        :class="{
                                            buyBtn_3: content.buyBtn_style == '3',
                                            buyBtn_4: content.buyBtn_style == '4',
                                        }"
                                    >
                                        {{ L('购买') }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <div v-if="showLoadMore" class="load-more">{{ L('点击加载更多') }}</div>
        </div>
    </div>
</template>

<script>
let goodsDemoList = new Array(4).fill({
    goods_id: 1, // 商品id
    goods_name: '此处显示商品名称', //  商品名称
    image: '', // 商品图片
    price: '59.99', // 商品价格
    show: true,
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
            goodsDemoList,
            groupDemoList: [
                {
                    id: '1',
                    cat_name: this.L('分组一'),
                    children: goodsDemoList,
                },
                {
                    id: '2',
                    cat_name: this.L('分组二'),
                    children: goodsDemoList,
                },
            ],
            goodsList: [],
            goodsTotal: 0,
            list: [],
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
                    return `calc(${windowWidth} - ${sliderWidth} - ${page_distance * 2}px)`
                } else {
                    return `calc(${windowWidth} - ${page_distance * 2}px - ${goods_distance * 2}px)`
                }
            }
            if (style_type == 2) {
                return `calc((${windowWidth} - ${page_distance * 2}px - ${goods_distance * 4}px) / 2)`
            }
            if (style_type == 5) {
                // 横向滑动 宽度固定
                return `calc(310px / 2)`
            }
        },
        // 分组
        catList() {
            if (!this.content) return []
            let list = this.content.list && this.content.list.length ? this.content.list : catDemoList
            return list
        },
        // 加载更多显隐 商品分组
        showLoadMore() {
            let show = false
            if (!this.content) return show
            if (this.content.style_type == 5 || this.content.goods_classify_type == 2) return show
            if (this.content.list && this.content.list.length) {
                let cat_id = this.catList[0]['cat_id']
                let goods_total_num = this.catList[0]['goods_total_num'] || 0
                let goodsListLen = this.goodsList.length || 0
                let show_num = this.catList[0]['show_num'] || 1
                if (
                    this.content.goods_type == 1 &&
                    this.content.goods_type_val == 2 &&
                    goodsListLen < Number(goods_total_num)
                ) {
                    show = true
                }
                if (this.content.goods_type == 2) {
                    if (cat_id == -1 && goodsListLen < Number(this.goodsTotal)) {
                        show = true
                    } else {
                        // 显示个数全部
                        if (show_num == 2 && goodsListLen < Number(goods_total_num)) {
                            show = true
                        }
                    }
                }
            }
            return show
        },
        sourceInfo() {
            return this.$store.state.customPage.sourceInfo
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
        // 获取商品列表
        async getList() {
            if (this.content && this.content.list && this.content.list.length) {
                let {
                    goods_type = 1,
                    goods_type_val = 1,
                    goods_classify_type = 1,
                    show_allClassify = 1,
                    list = [],
                } = this.content
                // 商品
                let params = {
                    source: this.sourceInfo.source,
                    source_id: this.sourceInfo.source_id,
                }
                list = list.map((item) => {
                    if (item.id) {
                        return item.id
                    } else if (item.goods_id) {
                        return item.goods_id
                    } else {
                        return item
                    }
                })
                if (goods_type == 1 && goods_type_val == 1) {
                    params.ids = list
                    params.page_size = this.content.list.length
                    params.page = 1
                } else {
                    // 分组
                    params.page_size = 10
                    params.page = 1
                    let firstCat = this.content.list[0]
                    params.cat_id = firstCat.cat_id
                    if (this.content.componentId == 'mallGoods') {
                        params.level = firstCat.level
                    }
                    if (goods_type == 2 && firstCat.show_num == 1) {
                        params.page_size = firstCat.show_num_val
                    }
                }
                let api = {
                    mallGoods: customPageApi.getMallGoods,
                    shopGoods: customPageApi.getShopGoods,
                }
                let result = await this.request(api[this.content.componentId], params)
                list = result.data || []
                this.goodsTotal = result.total || 0
                this.goodsList = list
            } else {
                this.goodsList = this.goodsDemoList
            }
        },
    },
}
</script>

<style scoped>
.width-100 {
    width: 100%;
    flex-shrink: 0;
}
.width-50 {
    width: 50%;
    flex-shrink: 0;
}
.width-30 {
    width: 35%;
    flex-shrink: 0;
}
.overflowHidden {
    overflow: hidden;
}
.overflow-x {
    width: 100%;
    overflow-x: hidden;
}
/* 商品分组 */
.goodsGroupWrap {
    padding: 0 8px;
    width: 100%;
    height: 44px;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0 2px 12px rgb(100 101 102 / 12%);
    overflow: hidden;
}
.goodsGroupItem {
    position: relative;
    padding: 0 16px;
    flex: 1 0 auto;
    font-size: 14px;
    color: #646566;
    box-sizing: border-box;
}
.goodsGroupItemLine {
    height: 44px;
}
.goodsGroupItemLine:after {
    content: '';
    width: 40%;
    height: 2px;
    background: transparent;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);
}
.goodsGroupItemLine.active {
    color: #f44;
}
.goodsGroupItemLine.active.goodsGroupItemLine:after {
    background: #f44;
}
.goodsGroupItemRadius.active span {
    padding: 6px 12px;
    height: 32px;
    background: #f44;
    color: #ffffff;
    border-radius: 32px;
    box-sizing: border-box;
}
.goodsGroupItemBlock {
    height: 44px;
    line-height: 44px;
}
.goodsGroupItemBlock.active {
    background: #f44;
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

/* 商品列表 */
.goods_style_1 {
    background: #ffffff;
}
.goods_style_2 {
    box-shadow: 0 2px 12px rgba(100,101,102,0.12);
}
.goods_style_3 {
    border: 1px solid rgba(50, 50, 51, 0.1);
    background: #ffffff;
}
.goodsImgWrap,
.goodsItem {
    position: relative;
    overflow: hidden;
}
.goodsImgWrap {
    width: 100%;
    background: #ebedf1;
    box-sizing: border-box;
}
.goodsImgBigWrap {
    height: 342px;
}
.goodsImgMiddleWrap {
    height: 160px;
}
.goodsImgSmallWrap {
    height: 97px;
}
.goodsImgSideWrap {
    width: 108px;
    height: 108px;
}
.defaultImg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.goodsInfoWrap {
    padding: 0 14px;
    width: 100%;
    box-sizing: border-box;
}
.goodsName {
    font-size: 16px;
    color: #333333;
    line-height: 24px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
}
.width-30 .goodsInfoWrap {
    padding: 8px;
}
.width-30 .goodsName {
    font-size: 12px;
    line-height: 16px;
}
.goodsInfoMiddleWrap .goodsName {
    font-size: 14px;
    line-height: 16px;
}
.priceWrap {
    font-weight: 400;
    color: #ff4444;
    line-height: 1;
}
.currency {
    font-size: 13px;
}
.price {
    font-size: 20px;
}
.width-30 .price,
.goodsInfoMiddleWrap .price {
    font-size: 15px;
}
.buyBtnIcon {
    font-size: 24px;
    color: #ff4444;
}
.width-30 .buyBtnIcon,
.goodsInfoMiddleWrap .buyBtnIcon {
    font-size: 18px;
}

.buyBtn {
    display: inline-block;
    padding: 0 10px;
    height: 24px;
    border-radius: 12px;
    line-height: 24px;
    font-size: 12px;
    font-weight: 400;
    box-sizing: border-box;
}
.width-30 .buyBtn,
.goodsInfoMiddleWrap .buyBtn {
    height: 18px;
    line-height: 18px;
}
.width-30 .shoppingCartIcon,
.goodsInfoMiddleWrap .shoppingCartIcon {
    width: 18px;
    vertical-align: top;
}
.width-30 .defaultImg {
    width: 28px;
}
.buyBtn_3 {
    border: 1px solid #ff4444;
    color: #ff4444;
}
.buyBtn_4 {
    background: #ff4444;
    color: #ffffff;
}

/* 角标 */
.goodsBadgeWrap {
    position: absolute;
}
.goodsBadge_style_1 {
    padding: 2px 8px;
    font-size: 10px;
    line-height: 1;
    background: #ff4444;
    border-radius: 0 40px 40px 0;
    color: #ffffff;
}
.goodsBadge_style_2 {
    padding: 2px 0;
    max-width: 20px;
    background: #ff4444;
    border-radius: 4px;
    color: #ffffff;
    display: inline-block;
    text-align: center;
    line-height: 16px;
}
.goodsBadge_style_3 {
    padding: 8px 4px 6px 4px;
    font-size: 10px;
    line-height: 1;
    background: #ff4444;
    border-radius: 0 0 10px 10px;
    color: #ffffff;
    display: inline-block;
}
.goodsBadge_style_4 {
    position: relative;
    width: 30px;
    height: 30px;
    display: inline-block;
}
.goodsBadge_style_4 span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 10px;
    text-align: center;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
}
.goodsBadge_style_4::before {
    content: '';
    width: 100%;
    height: 100%;
    background: #ff4444;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}
.goodsBadge_style_4::after {
    content: '';
    width: 100%;
    height: 100%;
    background: #ff4444;
    position: absolute;
    top: 0;
    left: 0;
    transform: rotate(45deg);
    z-index: 2;
}
.goodsBadge_style_5 {
    padding: 2px 0;
    max-width: 40px;
    background: rgba(136, 196, 221, 0.2);
    border-radius: 4px;
    color: #ff4444;
    display: inline-block;
    text-align: center;
    line-height: 16px;
}
.goodsBadgeImg {
    max-width: 50px;
    max-height: 50px;
}
.catName {
    padding: 8px 0;
    color: #666;
    font-size: 14px;
    line-height: 18px;
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
}
.mallGoodsPreviewSideWrap {
    height: 667px;
    overflow-y: hidden;
}
.mallGoodsPreviewSideWrap .goodsImgWrap .defaultImg {
    width: 32px;
}
.load-more {
    width: 100%;
    font-size: 12px;
    padding: 10px 0;
    text-align: center;
}
</style>
