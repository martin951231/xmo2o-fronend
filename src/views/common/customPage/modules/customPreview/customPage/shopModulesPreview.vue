<template>
    <div v-if="content" class="shop-modules-wrap flex flex-column">
        <!-- 公告 -->
        <div class="notice-wrap flex align-center">
            <img class="mr-10" src="@/assets/customPage/shopNoticeIcon.png" alt="" />
            <span class="flex-1 no-wrap">
                {{ content.notice || L('请填写内容，如果过长，将会在手机上滚动显示') }}
            </span>
        </div>

        <!-- 商品详情切换 -->
        <div class="flex align-center shop-tags" v-if="content.show_merDetail && content.show_merDetail == '1'">
            <div class="flex-1 active">{{ L('商品') }}</div>
            <div class="flex-1">{{ L('详情') }}</div>
        </div>

        <!-- 商品列表 -->
        <div v-if="list.length" class="flex-1 flex shop-goods-list-wrap">
            <div class="side-menu">
                <div
                    v-for="(item, index) in list"
                    :key="index"
                    class="side-menu-item"
                    :class="{
                        active: index == 0,
                    }"
                >
                    {{ item.name }}
                </div>
            </div>
            <div v-if="list[0].children && list[0].children.length" class="flex-1 goods-list">
                <template v-for="(goodsItem, goodsIndex) in list[0].children">
                    <div
                        :key="goodsIndex"
                        v-if="
                            list[0].show_num_type == 2 ||
                            (list[0].show_num_type == 1 && list[0].show_num && goodsIndex < Number(list[0].show_num))
                        "
                        class="goods-item-wrap flex justify-between"
                    >
                        <div class="goods-img">
                            <img v-if="goodsItem.image" :src="goodsItem.image" class="goods-img" alt="" />
                            <img v-else :src="defaultImg" class="default-img" alt="" />
                        </div>
                        <div class="flex-1 goods-info-wrap flex flex-column justify-between">
                            <div class="goods-name">
                                <span>{{ goodsItem.goods_name }}</span>
                            </div>
                            <div class="flex align-center justify-between line-height-none">
                                <div v-if="goodsItem.price && goodsItem.price != 0" class="goods-price flex-1">
                                    <span>￥</span>
                                    <span class="fw-bold">{{ goodsItem.price }}</span>
                                </div>
                                <div v-else class="flex-1"></div>
                                <div class="add-btn">
                                    <a-icon theme="filled" type="plus-circle" />
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
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
            demoList: [
                {
                    id: '1',
                    name: this.L('分组一'),
                    show_num_type: '2',
                    children: [
                        {
                            goods_id: '1', //商品id
                            goods_name: this.L('此处显示商品名称'), //商品名称
                            image: '', //商品图片
                            price: '59.99', //商品价格
                        },
                        {
                            goods_id: '2',
                            goods_name: this.L('此处显示商品名称'),
                            image: '',
                            price: '59.99',
                        },
                        {
                            goods_id: '3',
                            goods_name: this.L('此处显示商品名称'),
                            image: '',
                            price: '59.99',
                        },
                        {
                            goods_id: '4',
                            goods_name: this.L('此处显示商品名称'),
                            image: '',
                            price: '59.99',
                        },
                    ],
                },
                {
                    id: '2',
                    name: this.L('分组二'),
                    show_num_type: '2',
                    children: [
                        {
                            goods_id: '1', //商品id
                            goods_name: this.L('此处显示商品名称'), //商品名称
                            image: '', //商品图片
                            price: '59.99', //商品价格
                        },
                        {
                            goods_id: '2',
                            goods_name: this.L('此处显示商品名称'),
                            image: '',
                            price: '59.99',
                        },
                        {
                            goods_id: '3',
                            goods_name: this.L('此处显示商品名称'),
                            image: '',
                            price: '59.99',
                        },
                        {
                            goods_id: '4',
                            goods_name: this.L('此处显示商品名称'),
                            image: '',
                            price: '59.99',
                        },
                    ],
                },
            ],
        }
    },
    computed: {
        list() {
            return this.content && this.content.list && this.content.list.length ? this.content.list : this.demoList
        },
    },
}
</script>

<style scoped>
.shop-modules-wrap {
    width: 100%;
    height: 667px;
    overflow-y: hidden;
}
.notice-wrap {
    padding: 0 10px;
    width: 100%;
    height: 40px;
    background: #fff8e9;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    color: #717171;
}
.shop-tags {
    width: 100%;
    height: 32px;
    background: #e2e2e2;
    font-size: 12px;
    font-weight: 400;
    color: #666666;
}
.shop-tags div {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.shop-tags .active {
    background: #1890ff;
    color: #ffffff;
}
.shop-goods-list-wrap {
    width: 100%;
    height: 100px;
    max-height: 667px;
    overflow: hidden;
}
.side-menu {
    width: 76px;
    height: 100%;
    background: #f4f4f4;
}
.side-menu-item {
    padding: 16px;
    width: 100%;
    box-sizing: border-box;
    font-size: 12px;
    font-weight: 400;
    color: #666666;
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
}
.side-menu-item.active {
    background: #ffffff;
    color: #000000;
}
.goods-list {
    padding-left: 10px;
    width: 100%;
    box-sizing: border-box;
    background: #ffffff;
}
.goods-item-wrap {
    padding: 16px 10px 16px 0;
    width: 100%;
    border-bottom: 1px solid #f2f2f2;
    box-sizing: border-box;
}
.goods-item-wrap:last-child {
    border: none;
}
.goods-img {
    position: relative;
    width: 52px;
    height: 52px;
    background: #f4f5f6;
    border-radius: 4px;
    overflow: hidden;
    box-sizing: border-box;
}
.goods-img .goods-img {
    width: 100%;
    height: 100%;
}
.goods-img .default-img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 23px;
}
.goods-info-wrap {
    padding: 0 5px 0 10px;
    width: 100%;
}
.goods-name {
    font-size: 14px;
    font-weight: 400;
    color: #111111;
    line-height: 20px;
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
}
.goods-price {
    font-size: 12px;
    color: #ff4444;
}
.add-btn {
    font-size: 18px;
    color: #1890ff;
}
.line-height-none {
    line-height: 1;
}
</style>