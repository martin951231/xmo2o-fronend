<template>
    <div class="mallActivitiesWrap bg-ff" v-if="content">
        <div class="title">
            {{ content.title }}
        </div>
        <div
            class="mall-activities-goods-wrap flex"
            :class="{
                'flex-wrap': content.style_type != '5',
                'overflow-x': content.style_type == '5',
            }"
        >
            <div
                v-for="(item, index) in list"
                :key="index"
                :class="{
                    'width-100': content.style_type == '1' || content.style_type == '4',
                    'width-50': content.style_type == '2',
                    'goods-item': content.style_type != '5',
                }"
            >
                <div
                    class="goods-item-wrap"
                    :class="{
                        flex: content.style_type == '4',
                        'goods-item-detail-wrap': content.style_type == '5',
                    }"
                >
                    <!-- 商品图 -->
                    <div
                        class="goods-img-wrap"
                        :class="{
                            'mr-14': content.style_type == '4',
                            'goods-img-big-wrap': content.style_type == '1',
                            'goods-img-middle-wrap': content.style_type == '2' || content.style_type == '4',
                            'goods-img-small-wrap': content.style_type == '5',
                        }"
                    >
                        <div
                            class="goods-img"
                            :class="{
                                'goods-img-big': content.style_type == '1',
                                'goods-img-middle': content.style_type == '2' || content.style_type == '4',
                                'goods-img-small': content.style_type == '5',
                            }"
                        >
                            <img :src="item.image" v-if="item.image" class="goods-image" alt="" />
                            <img :src="defaultImg" class="default-img" v-else alt="" />
                            <!-- 砍价 -->
                            <span
                                v-if="
                                    item.bar_num &&
                                    item.bar_num != 0 &&
                                    content.hd_type == 'bargain' &&
                                    isShowFiled('bar_num')
                                "
                                class="bar-num-tag"
                            >
                                {{ L('X1人已砍', { X1: item.bar_num }) }}
                            </span>
                            <!-- 拼团 -->
                            <span
                                v-if="item.nums && item.nums != 0 && content.hd_type == 'group' && isShowFiled('nums')"
                                class="bar-num-tag"
                            >
                                {{ L('X1人已团', { X1: item.nums }) }}
                            </span>
                            <!-- 周期购 -->
                            <img
                                v-if="content.hd_type == 'periodic'"
                                src="@/assets/customPage/mallPeriodicIcon.png"
                                alt=""
                                class="mall-periodic-icon"
                            />
                        </div>
                        <div
                            class="act-desc-wrap cr-white flex align-center justify-between"
                            :style="{
                                height: content.style_type == '1' ? '42px' : '26px',
                            }"
                            v-if="isShowFiled('count_down') && content.hd_type != 'periodic'"
                        >
                            <div class="hd-type-txt" v-if="content.style_type == '1'">
                                {{ content.hd_type_txt }}
                            </div>
                            <div class="over-txt" v-else>
                                {{ L('距结束') }}
                            </div>
                            <div class="flex flex-column justify-around" v-if="content.style_type == '1'">
                                <span class="countdown-label text-right">
                                    {{ L('抢购倒计时') }}
                                </span>
                                <span class="countdown">00 {{ L('时') }} 00 {{ L('分') }} 00 {{ L('秒') }}</span>
                            </div>
                            <div v-else class="countdown-txt">
                                <span>00:00:00</span>
                            </div>
                        </div>
                    </div>
                    <!-- 商品名称等信息 -->
                    <div
                        class="goods-info-wrap flex flex-column justify-between"
                        :class="{
                            'flex flex-column ptb-6 justify-between': content.style_type == '4',
                        }"
                        :style="{
                            minHeight: content.hd_type == 'periodic'?'105px':'144px'
                        }"
                    >
                        <div>
                            <div
                                :class="{
                                    'no-wrap': content.style_type == '1',
                                    'no-wrap-multiRow': content.style_type != '1',
                                    'mt-12 mb-12': content.style_type != '4',
                                }"
                                v-if="
                                    isShowFiled('goods_name') ||
                                    (item.reduce_money &&
                                        item.reduce_money != 0 &&
                                        content.style_type != '5' &&
                                        content.hd_type == 'limited') ||
                                    content.hd_type == 'bargain' ||
                                    content.hd_type == 'group'
                                "
                            >
                                <!-- 秒杀 -->
                                <span
                                    v-if="
                                        isShowFiled('reduce_money') &&
                                        item.reduce_money &&
                                        item.reduce_money != 0 &&
                                        content.style_type != '5' &&
                                        content.hd_type == 'limited'
                                    "
                                    class="tags"
                                    >{{ L('减') }}{{ currency }}{{ item.reduce_money }}</span
                                >
                                <!-- 砍价 -->
                                <span class="tags" v-if="isShowFiled('tag') && content.hd_type == 'bargain'">
                                    {{ L('砍价拿') }}
                                </span>
                                <!-- 拼团 -->
                                <span class="tags" v-if="isShowFiled('team_num') && content.hd_type == 'group'">
                                    {{ L('X1人团', { X1: item.team_num }) }}
                                </span>
                                <!-- 周期购 -->
                                <!-- <span 
                                    class="tags" 
                                    v-if="content.hd_type == 'periodic'">
                                    周期购
                                </span> -->
                                <span class="flex-1 goods-name" v-if="isShowFiled('goods_name')">
                                    {{ item.goods_name }}
                                </span>
                            </div>
                            <div
                                class="stock mt-12 mb-12"
                                v-if="
                                    isShowFiled('act_stock_num') &&
                                    item.act_stock_num &&
                                    item.act_stock_num != 0 &&
                                    content.hd_type != 'periodic'
                                "
                            >
                                <span>{{
                                    L('仅售X1件', { X1: Number(item.act_stock_num) > 0 ? item.act_stock_num : '9999' })
                                }}</span>
                            </div>
                        </div>
                        <div
                            class="flex align-center justify-between"
                            v-if="
                                isShowFiled('act_price') ||
                                isShowFiled('orgin_price') ||
                                (isShowFiled('buy_btn') && content.style_type != '5')
                            "
                            :class="{
                                'mt-12': content.hd_type != 'periodic',
                            }"
                        >
                            <!-- price -->
                            <div
                                class="flex price-wrap"
                                :class="{
                                    'flex-column align-start': content.style_type == '2' || content.style_type == '4',
                                    'align-end': content.style_type == '1' || content.style_type == '5',
                                }"
                                v-if="
                                    (isShowFiled('act_price') && (item.act_price || item.act_price == 0)) ||
                                    (isShowFiled('orgin_price') && item.orgin_price) ||
                                    (content.hd_type == 'periodic' && item.price && item.price != 0)
                                "
                            >
                                <div
                                    class="price"
                                    v-if="
                                        isShowFiled('act_price') &&
                                        (item.act_price ||
                                            item.act_price == 0 ||
                                            (content.hd_type == 'periodic' && item.price && item.price != 0))
                                    "
                                >
                                    <span class="currency">{{ currency }}</span>
                                    <span>{{ content.hd_type == 'periodic' ? item.price : item.act_price }}</span>
                                </div>
                                <div
                                    class="old-price"
                                    v-if="
                                        isShowFiled('orgin_price') &&
                                        item.orgin_price != 0 &&
                                        item.act_price != item.orgin_price &&
                                        content.hd_type != 'periodic'
                                    "
                                    :class="{
                                        'mt-4': content.style_type == '2' || content.style_type == '4',
                                    }"
                                >
                                    <span class="currency">{{ currency }}</span>
                                    <span>{{ item.orgin_price }}</span>
                                </div>
                            </div>
                            <!-- 占位 -->
                            <div v-else class="flex-1"></div>
                            <!-- btn -->
                            <div
                                v-if="
                                    isShowFiled('buy_btn') &&
                                    content.style_type != '5' &&
                                    content.buyBtn_name.trim() !== ''
                                "
                                class="buy-btn"
                                :class="{
                                    'buy-btn-border': content.buyBtn_style == '1',
                                    'buy-btn-border-bg': content.buyBtn_style == '2',
                                    'buy-btn-radius': content.buyBtn_style == '3',
                                    'buy-btn-radius-bg': content.buyBtn_style == '4',
                                }"
                            >
                                <span>{{ content.buyBtn_name }}</span>
                            </div>
                        </div>
                    </div>
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
            defaultImg: require('@/assets/customPage/goodsDefaultImg.png'),
            currency: '￥',
            demoList: [
                {
                    act_name: this.L('活动名称'), //活动名称
                    start_time: '2021-01-02 00:00:00', //开始时间
                    end_time: '2021-12-20 00:00:59', //结束时间
                    goods_id: 1, //商品id
                    goods_name: this.L('此处显示商品名称，最多显示两行'), //商品名称
                    image: '', //商品图片
                    link_url: '', //链接地址
                    price: '59.99', //周期购原价
                    act_price: '59.99', //活动价
                    orgin_price: '99.99', //原价
                    act_stock_num: '20', // 剩余库存 -1为无限量
                    team_num: '2', //每个团所需人数
                    nums: '5', //多少人已成团
                    reduce_money: '12', //减少的钱
                    bar_num: '2', //多少人已砍
                },
                {
                    act_name: this.L('活动名称'), //活动名称
                    start_time: '2021-01-02 00:00:00', //开始时间
                    end_time: '2021-12-20 00:00:59', //结束时间
                    goods_id: 1, //商品id
                    goods_name: this.L('此处显示商品名称，最多显示两行'), //商品名称
                    image: '', //商品图片
                    link_url: '', //链接地址
                    price: '59.99', //周期购原价
                    act_price: '59.99', //活动价
                    orgin_price: '99.99', //原价
                    act_stock_num: '20', // 剩余库存 -1为无限量
                    team_num: '2', //每个团所需人数
                    nums: '5', //多少人已成团
                    reduce_money: '12', //减少的钱
                    bar_num: '2', //多少人已砍
                },
                {
                    act_name: this.L('活动名称'), //活动名称
                    start_time: '2021-01-02 00:00:00', //开始时间
                    end_time: '2021-12-20 00:00:59', //结束时间
                    goods_id: 1, //商品id
                    goods_name: this.L('此处显示商品名称，最多显示两行'), //商品名称
                    image: '', //商品图片
                    link_url: '', //链接地址
                    price: '59.99', //周期购原价
                    act_price: '59.99', //活动价
                    orgin_price: '99.99', //原价
                    act_stock_num: '20', // 剩余库存 -1为无限量
                    team_num: '2', //每个团所需人数
                    nums: '5', //多少人已成团
                    reduce_money: '12', //减少的钱
                    bar_num: '2', //多少人已砍
                },
                {
                    act_name: this.L('活动名称'), //活动名称
                    start_time: '2021-01-02 00:00:00', //开始时间
                    end_time: '2021-12-20 00:00:59', //结束时间
                    goods_id: 1, //商品id
                    goods_name: this.L('此处显示商品名称，最多显示两行'), //商品名称
                    image: '', //商品图片
                    link_url: '', //链接地址
                    price: '59.99', //周期购原价
                    act_price: '59.99', //活动价
                    orgin_price: '99.99', //原价
                    act_stock_num: '20', // 剩余库存 -1为无限量
                    team_num: '2', //每个团所需人数
                    nums: '5', //多少人已成团
                    reduce_money: '12', //减少的钱
                    bar_num: '2', //多少人已砍
                },
            ],
        }
    },
    computed: {
        list() {
            let listNew =
                this.content && this.content.list && this.content.list.length ? this.content.list : this.demoList
            return listNew
        },
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
    },
}
</script>

<style scoped>
.width-100 {
    width: 100%;
}
.width-50 {
    width: 50%;
}
.mr-14 {
    margin-right: 14px;
}
.ptb-6 {
    padding-top: 6px;
    padding-bottom: 6px;
}
.mt-4 {
    margin-top: 4px;
}
.mt-12 {
    margin-top: 12px;
}
.mb-12 {
    margin-bottom: 12px;
}
.overflow-x {
    overflow-x: hidden;
}
.no-wrap-multiRow {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.title {
    padding: 25px 14px;
    width: 100%;
    box-sizing: border-box;
    font-size: 15px;
    font-weight: bold;
    color: #000000;
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
}
.mall-activities-goods-wrap {
    padding-bottom: 20px;
    width: 100%;
}
.goods-item {
    margin-bottom: 20px;
}
.goods-item:last-child {
    margin-bottom: 0;
}
.goods-item-wrap {
    padding: 0 15px;
    width: 100%;
    box-sizing: border-box;
}
.goods-item-wrap.goods-item-detail-wrap {
    margin-right: 15px;
    padding: 0 2px 0 15px;
    width: 145px;
    box-sizing: border-box;
}

.goods-img-wrap {
    width: 100%;
    background: #ebedf1;
    border-radius: 4px;
    box-sizing: border-box;
    overflow: hidden;
}
.goods-img {
    position: relative;
    width: 100%;
    text-align: center;
    overflow: hidden;
}
.default-img {
    width: 34px;
}
.goods-img-big-wrap {
    width: 100%;
}
.goods-img-big {
    height: 342px;
    line-height: 342px;
}
.goods-img-big .default-img {
    width: 54px;
}
.goods-img-middle-wrap {
    width: 160px;
}
.goods-img-middle {
    width: 160px;
    height: 160px;
    line-height: 160px;
}
.goods-img-small-wrap {
    width: 145px;
}
.goods-img-small {
    width: 145px;
    height: 145px;
    line-height: 145px;
}
.goods-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-width: 100%;
    min-height: 100%;
}

/* 周期购 */
.mall-periodic-icon {
    position: absolute;
    top: 6px;
    left: 4px;
    width: 40px;
}
.goods-img-big .mall-periodic-icon {
    width: 80px;
}

/* 活动 */
.act-desc-wrap {
    padding: 0 13px 0 16px;
    width: 100%;
    height: 42px;
    background: #fd5131;
    box-sizing: border-box;
}
.hd-type-txt {
    font-size: 18px;
    font-weight: bold;
    line-height: 1;
}
.countdown-label {
    font-size: 12px;
    font-weight: 400;
    line-height: 1;
    opacity: 0.6;
}
.countdown {
    margin-top: 5px;
    font-size: 12px;
    font-weight: bold;
    line-height: 1;
}
.goods-info-wrap {
    flex: 1;
    min-height: 144px;
}
.tags {
    margin-right: 6px;
    padding: 2px 7px;
    line-height: 22px;
    background: rgba(253, 81, 49, 0.35);
    border-radius: 11px;
    font-size: 12px;
    font-weight: 400;
    color: #fd5131;
}
.goods-name {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
}
.stock {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 1;
}
.price-wrap {
    font-weight: 400;
    line-height: 1;
}
.currency {
    font-size: 12px;
}
.price {
    font-size: 20px;
    color: rgba(255, 68, 68, 1);
}
.old-price {
    color: rgba(200, 201, 204, 1);
    text-decoration: line-through;
    font-size: 10px;
    font-weight: 400;
}
.buy-btn {
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1;
    box-sizing: border-box;
    border: 1px solid transparent;
}
/* 方形线框 */
.buy-btn-border {
    border-color: #fd5131;
    border-radius: 4px;
    background: #ffffff;
    color: #fd5131;
}
/* 方形实心 */
.buy-btn-border-bg {
    border-color: #fd5131;
    border-radius: 4px;
    background: #fd5131;
    color: #ffffff;
}
/* 圆角线框 */
.buy-btn-radius {
    border-color: #fd5131;
    border-radius: 16px;
    background: #ffffff;
    color: #fd5131;
}
/* 圆角实心 */
.buy-btn-radius-bg {
    border-color: #fd5131;
    border-radius: 16px;
    background: #fd5131;
    color: #ffffff;
}
.over-txt {
    font-size: 12px;
    font-weight: 400;
    color: #ffffff;
    opacity: 0.6;
}
.countdown-txt {
    font-size: 12px;
    font-weight: bold;
    color: #ffffff;
}
.goods-desc {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 1;
}
.bar-num-tag {
    position: absolute;
    left: 4px;
    bottom: 8px;
    padding: 2px 7px;
    line-height: 16px;
    background: #747b7e;
    color: #ffffff;
    font-size: 12px;
    border-radius: 4px;
}
</style>