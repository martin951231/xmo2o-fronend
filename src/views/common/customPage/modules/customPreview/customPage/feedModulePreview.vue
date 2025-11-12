<template>
    <div class="wrap">
        <template v-if="content && content.list && content.list.length">
            <!-- 分类导航 -->
            <div class="nav-wrap flex align-center bg-ff">
                <div
                    class="nav-item"
                    v-for="(item, index) in content.list"
                    :key="index"
                    :class="{
                        active: index === 0,
                        'flex-1': content.list.length < 5,
                        'nav-item-swiper': content.list.length > 4,
                    }"
                >
                    {{ item.title }}
                    <span class="line" v-show="index === 0" :style="{
                        background: pageMainColor
                    }"></span>
                </div>
            </div>
        </template>

        <!-- 子分类筛选条件 -->
        <template v-else-if="catInfo && catInfo.cat_fid != 0">
            <div class="nav-wrap flex align-center bg-ff">
                <div
                    class="nav-item flex-1 fliter-title"
                    v-for="(item, index) in filterList"
                    :key="index"
                    :style="{
                        color: index === 0 ? 'rgba(255, 106, 72, 1)' : 'rgba(102, 102, 102, 1)',
                    }"
                >
                    {{ item.title ? item.title : index === 0 ? catInfo.cat_name : ''
                    }}<a-icon :type="index == 0 ? 'up' : 'down'" style="font-size: 10px; margin-left: 4px" />
                </div>
            </div>
        </template>
        <!-- 店铺列表 -->
        <template v-if="(content && content.list && content.list.length) || (catInfo && catInfo.cat_fid != 0)"
        >
            <div
                v-if="storeList && storeList.length"
                :class="{
                    'flex flex-wrap plr-6 bg-f4': showType == '3',
                }"
            >
                <template v-for="(item, index) in storeList">
                    <!-- 样式1 -->
                    <div v-if="showType == '1'" :key="index" class="store-wrap bg-ff">
                        <div class="flex">
                            <div class="img-wrap">
                                <img :src="item.image ? item.image : defaultImg" alt="" />
                            </div>
                            <div class="content flex-1 text-nowrap text-els">
                                <div class="name-wrap flex justify-between align-center text-nowrap text-els">
                                    <div class="name flex text-nowrap text-els">{{ item.name }}</div>
                                    <div class="bus-label-wrap">
                                        <span
                                            v-for="(busItem, busIndex) in item.bus_label"
                                            :key="busIndex"
                                            class="bus-tag text-nowrap"
                                            :style="{
                                                backgroundColor: busItem.bg_color,
                                                color: busItem.font_color,
                                            }"
                                        >
                                            {{ busItem.name }}
                                        </span>
                                    </div>
                                </div>
                                <div class="score-wrap flex justify-between align-center mt-5">
                                    <div class="flex-1 flex align-center">
                                        <div
                                            class="flex justify-center align-center"
                                            v-for="(startItem, startIndex) in item.score_mean_arr"
                                            :key="startIndex"
                                        >
                                            <img
                                                v-if="startItem == '2'"
                                                src="@/assets/customPage/startFullIcon.png"
                                                class="start-icon"
                                            />
                                            <img
                                                v-if="startItem == '1'"
                                                src="@/assets/customPage/startHalfIcon.png"
                                                class="start-icon"
                                            />
                                            <img
                                                v-if="startItem == '0'"
                                                src="@/assets/customPage/startEmptyIcon.png"
                                                class="start-icon"
                                            />
                                        </div>
                                        <span>{{ item.score_mean }}</span>
                                    </div>
                                    <div class="range">{{ item.range }}</div>
                                </div>
                                <div class="address text-nowrap text-els mt-5">
                                    {{ item.address }}
                                </div>
                                <div class="cat-name text-nowrap text-els mt-5">#{{ item.cat_name }}</div>
                            </div>
                        </div>
                        <div
                            class="content-group text-nowrap text-els"
                            v-show="item.groupGoodsList && item.groupGoodsList.length"
                        >
                            <template v-for="(groupItem, groupIndex) in item.groupGoodsList">
                                <div
                                    :key="groupIndex"
                                    v-if="groupIndex < 3"
                                    class="flex justify-between align-center text-nowrap text-els mt-5"
                                >
                                    <div class="flex-1 flex align-center text-nowrap text-els">
                                        <span
                                            class="group-tag cr-white text-nowrap"
                                            :style="{
                                                background: groupItem.bg_color,
                                            }"
                                            >{{ groupItem.tag }}</span
                                        >
                                        <span class="price">￥{{ groupItem.price }}</span>
                                        <span class="flex-1 text-nowrap text-els group-content">{{
                                            groupItem.name
                                        }}</span>
                                    </div>
                                    <div class="sale-count">
                                        {{ L('销量X1', { X1: groupItem.sale_count }) }}
                                    </div>
                                </div>
                            </template>
                            <div v-show="item.groupGoodsList.length > 3" class="more">
                                {{ L('查看全部10个商品') }}<a-icon type="right" />
                            </div>
                        </div>
                    </div>

                    <!-- 样式2 -->
                    <div v-if="showType == '2'" :key="index" class="store-wrap bg-ff flex">
                        <div class="img-wrap">
                            <img :src="item.image ? item.image : defaultImg" alt="" />
                        </div>
                        <div class="content flex-1 text-nowrap text-els">
                            <div class="name-wrap flex justify-between align-center text-nowrap text-els">
                                <div class="name flex text-nowrap text-els">{{ item.name }}</div>
                                <div class="bus-label-wrap">
                                    <span
                                        v-for="(busItem, busIndex) in item.bus_label"
                                        :key="busIndex"
                                        class="bus-tag"
                                        :style="{
                                            backgroundColor: busItem.bg_color,
                                            color: busItem.font_color,
                                        }"
                                    >
                                        {{ busItem.name }}
                                    </span>
                                </div>
                            </div>
                            <div class="score-wrap flex justify-between align-center mt-5">
                                <div class="flex-1 flex align-center">
                                    <div
                                        class="flex justify-center align-center"
                                        v-for="(startItem, startIndex) in item.score_mean_arr"
                                        :key="startIndex"
                                    >
                                        <img
                                            v-if="startItem == '2'"
                                            src="@/assets/customPage/startFullIcon.png"
                                            class="start-icon"
                                        />
                                        <img
                                            v-if="startItem == '1'"
                                            src="@/assets/customPage/startHalfIcon.png"
                                            class="start-icon"
                                        />
                                        <img
                                            v-if="startItem == '0'"
                                            src="@/assets/customPage/startEmptyIcon.png"
                                            class="start-icon"
                                        />
                                    </div>
                                    <span>{{ item.score_mean }}</span>
                                </div>
                                <div class="range">{{ item.range }}</div>
                            </div>
                            <div class="address text-nowrap text-els mt-5">
                                {{ item.address }}
                            </div>
                            <div class="cat-name text-nowrap text-els mt-5">#{{ item.cat_name }}</div>
                            <div
                                class="content-group text-nowrap text-els"
                                v-show="item.groupGoodsList && item.groupGoodsList.length"
                            >
                                <template v-for="(groupItem, groupIndex) in item.groupGoodsList">
                                    <div
                                        :key="groupIndex"
                                        v-if="groupIndex < 3"
                                        class="flex justify-between align-center text-nowrap text-els mt-5"
                                    >
                                        <div class="flex-1 flex align-center text-nowrap text-els">
                                            <span
                                                class="group-tag cr-white text-nowrap"
                                                :style="{
                                                    background: groupItem.bg_color,
                                                }"
                                                >{{ groupItem.tag }}</span
                                            >
                                            <span class="flex-1 text-nowrap text-els group-content">{{
                                                groupItem.name
                                            }}</span>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- 样式3 -->
                    <div v-if="showType == '3'" :key="index" class="store-wrap-other">
                        <div class="store-content">
                            <div class="img-wrap">
                                <img :src="item.image ? item.image : defaultImg" alt="" />
                            </div>
                            <div class="content text-nowrap text-els bg-ff">
                                <div class="name-wrap flex justify-between align-center text-nowrap text-els">
                                    <div class="name flex flex-1 text-nowrap text-els" style="display: inline-block">
                                        {{ item.name }}
                                    </div>
                                    <div class="bus-label-wrap" v-if="item.bus_label && item.bus_label.length">
                                        <template v-for="(busItem, busIndex) in item.bus_label">
                                            <span
                                                v-if="busIndex == 0"
                                                :key="busIndex"
                                                class="bus-tag text-nowrap"
                                                :style="{
                                                    backgroundColor: busItem.bg_color,
                                                    color: busItem.font_color,
                                                }"
                                            >
                                                {{ busItem.name }}
                                            </span>
                                        </template>
                                    </div>
                                </div>
                                <div class="score-wrap flex justify-between align-center mt-5">
                                    <div class="flex-1 flex align-center">
                                        <div
                                            class="flex justify-center align-center"
                                            v-for="(startItem, startIndex) in item.score_mean_arr"
                                            :key="startIndex"
                                        >
                                            <img
                                                v-if="startItem == '2'"
                                                src="@/assets/customPage/startFullIcon.png"
                                                class="start-icon"
                                            />
                                            <img
                                                v-if="startItem == '1'"
                                                src="@/assets/customPage/startHalfIcon.png"
                                                class="start-icon"
                                            />
                                            <img
                                                v-if="startItem == '0'"
                                                src="@/assets/customPage/startEmptyIcon.png"
                                                class="start-icon"
                                            />
                                        </div>
                                        <span>{{ item.score_mean }}</span>
                                    </div>
                                </div>
                                <div class="cat-name text-nowrap text-els mt-5">#{{ item.cat_name }}</div>
                                <div class="address flex justify-between align-center text-nowrap text-els mt-5">
                                    <span class="flex-1 text-nowrap text-els">{{ item.address }}</span>
                                    <span class="range">{{ item.range }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </template>
        <template v-else>
            <div class="feed-wrap-empty flex align-center justify-center">
                <span>{{ L('feed流区域') }}</span>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: [String, Object],
            default: '',
        }
    },
    data() {
        return {
            defaultImg: require('@/assets/customPage/defaultImg.png'),
            storeList: [
                {
                    name: this.L('此处显示店铺名称'), // 店铺名称
                    image: '', //店铺图片
                    score_mean: '5.0', //评分
                    range: '3.56 km', //距离
                    address: this.L('此处显示店铺地址'), // 店铺地址
                    cat_name: this.L('此处显示店铺子分类名称'),
                    bus_label: [
                        //右侧标识
                        {
                            type: 'book',
                            name: this.L('订'),
                        },
                        {
                            type: 'queue',
                            name: this.L('排'),
                        },
                    ],
                    group_goods: {
                        //团，券，订（样式1使用）
                        count: '10', //商品总数
                        list: [
                            {
                                group_id: '2', //团购id
                                name: this.L('此处显示团购名称'), //团购名称
                                price: '10', //团购价
                                sale_count: '99', // 销量
                                tag: this.L('团'), //标签名 团（团购商品），券（代金券），订（场次预订）
                                group_cate: 'normal',
                            },
                            {
                                group_id: '2', //团购id
                                name: this.L('此处显示团购名称'), //团购名称
                                price: '10', //团购价
                                sale_count: '99', // 销量
                                tag: this.L('券'), //标签名 团（团购商品），券（代金券），订（场次预订）
                                group_cate: 'cashing',
                            },
                            {
                                group_id: '2', //团购id
                                name: this.L('此处显示团购名称'), //团购名称
                                price: '10', //团购价
                                sale_count: '99', // 销量
                                tag: this.L('订'), //标签名 团（团购商品），券（代金券），订（场次预订）
                                group_cate: 'booking_appoint',
                            },
                        ],
                    },
                    discount_list: [
                        //（样式3使用）
                        {
                            type: 'group', //惠(团购)
                            list: [
                                {
                                    //惠(团购)（样式3使用）
                                    group_id: '2', //团购id
                                    name: this.L('此处显示团购名称'), //团购名称
                                    sale_count: '', // 销量
                                },
                            ],
                        },
                        {
                            type: 'shop', //外，外卖优惠
                            list: [
                                {
                                    //外，外卖优惠
                                    name: this.L('满$2.00减$1'),
                                },
                            ],
                        },
                        {
                            type: 'store', //买，快速买单优惠
                            list: [
                                {
                                    //买，快速买单优惠
                                    name: this.L('满$2.00减$1'),
                                },
                            ],
                        },
                    ],
                },
                {
                    name: this.L('此处显示店铺名称'), // 店铺名称
                    image: '', //店铺图片
                    score_mean: '5.0', //评分
                    range: '3.56 km', //距离
                    address: this.L('此处显示店铺地址'), // 店铺地址
                    cat_name: this.L('此处显示店铺子分类名称'),
                    bus_label: [
                        //右侧标识
                        {
                            type: 'book',
                            name: this.L('订'),
                        },
                        {
                            type: 'queue',
                            name: this.L('排'),
                        },
                    ],
                    group_goods: {
                        //团，券，订（样式1使用）
                        count: '10', //商品总数
                        list: [
                            {
                                group_id: '2', //团购id
                                name: this.L('此处显示团购名称'), //团购名称
                                price: '10', //团购价
                                sale_count: '99', // 销量
                                tag: this.L('团'), //标签名 团（团购商品），券（代金券），订（场次预订）
                                group_cate: 'normal',
                            },
                            {
                                group_id: '2', //团购id
                                name: this.L('此处显示团购名称'), //团购名称
                                price: '10', //团购价
                                sale_count: '99', // 销量
                                tag: this.L('券'), //标签名 团（团购商品），券（代金券），订（场次预订）
                                group_cate: 'cashing',
                            },
                            {
                                group_id: '2', //团购id
                                name: this.L('此处显示团购名称'), //团购名称
                                price: '10', //团购价
                                sale_count: '99', // 销量
                                tag: this.L('订'), //标签名 团（团购商品），券（代金券），订（场次预订）
                                group_cate: 'booking_appoint',
                            },
                        ],
                    },
                    discount_list: [
                        //（样式3使用）
                        {
                            type: 'group', //惠(团购)
                            list: [
                                {
                                    //惠(团购)（样式3使用）
                                    group_id: '2', //团购id
                                    name: this.L('此处显示团购名称'), //团购名称
                                    sale_count: '', // 销量
                                },
                            ],
                        },
                        {
                            type: 'shop', //外，外卖优惠
                            list: [
                                {
                                    //外，外卖优惠
                                    name: this.L('满$2.00减$1'),
                                },
                            ],
                        },
                        {
                            type: 'store', //买，快速买单优惠
                            list: [
                                {
                                    //买，快速买单优惠
                                    name: this.L('满$2.00减$1'),
                                },
                            ],
                        },
                    ],
                },
                {
                    name: this.L('此处显示店铺名称'), // 店铺名称
                    image: '', //店铺图片
                    score_mean: '5.0', //评分
                    range: '3.56 km', //距离
                    address: this.L('此处显示店铺地址'), // 店铺地址
                    cat_name: this.L('此处显示店铺子分类名称'),
                    bus_label: [
                        //右侧标识
                        {
                            type: 'book',
                            name: this.L('订'),
                        },
                        {
                            type: 'queue',
                            name: this.L('排'),
                        },
                    ],
                    group_goods: {
                        //团，券，订（样式1使用）
                        count: '10', //商品总数
                        list: [
                            {
                                group_id: '2', //团购id
                                name: this.L('此处显示团购名称'), //团购名称
                                price: '10', //团购价
                                sale_count: '99', // 销量
                                tag: this.L('团'), //标签名 团（团购商品），券（代金券），订（场次预订）
                                group_cate: 'normal',
                            },
                            {
                                group_id: '2', //团购id
                                name: this.L('此处显示团购名称'), //团购名称
                                price: '10', //团购价
                                sale_count: '99', // 销量
                                tag: this.L('券'), //标签名 团（团购商品），券（代金券），订（场次预订）
                                group_cate: 'cashing',
                            },
                            {
                                group_id: '2', //团购id
                                name: this.L('此处显示团购名称'), //团购名称
                                price: '10', //团购价
                                sale_count: '99', // 销量
                                tag: this.L('订'), //标签名 团（团购商品），券（代金券），订（场次预订）
                                group_cate: 'booking_appoint',
                            },
                        ],
                    },
                    discount_list: [
                        //（样式3使用）
                        {
                            type: 'group', //惠(团购)
                            list: [
                                {
                                    //惠(团购)（样式3使用）
                                    group_id: '2', //团购id
                                    name: this.L('此处显示团购名称'), //团购名称
                                    sale_count: '', // 销量
                                },
                            ],
                        },
                        {
                            type: 'shop', //外，外卖优惠
                            list: [
                                {
                                    //外，外卖优惠
                                    name: this.L('满$2.00减$1'),
                                },
                            ],
                        },
                        {
                            type: 'store', //买，快速买单优惠
                            list: [
                                {
                                    //买，快速买单优惠
                                    name: this.L('满$2.00减$1'),
                                },
                            ],
                        },
                    ],
                },
                {
                    name: this.L('此处显示店铺名称'), // 店铺名称
                    image: '', //店铺图片
                    score_mean: '5.0', //评分
                    range: '3.56 km', //距离
                    address: this.L('此处显示店铺地址'), // 店铺地址
                    cat_name: this.L('此处显示店铺子分类名称'),
                    bus_label: [
                        //右侧标识
                        {
                            type: 'book',
                            name: this.L('订'),
                        },
                        {
                            type: 'queue',
                            name: this.L('排'),
                        },
                    ],
                    group_goods: {
                        //团，券，订（样式1使用）
                        count: '10', //商品总数
                        list: [
                            {
                                group_id: '2', //团购id
                                name: this.L('此处显示团购名称'), //团购名称
                                price: '10', //团购价
                                sale_count: '99', // 销量
                                tag: this.L('团'), //标签名 团（团购商品），券（代金券），订（场次预订）
                                group_cate: 'normal',
                            },
                            {
                                group_id: '2', //团购id
                                name: this.L('此处显示团购名称'), //团购名称
                                price: '10', //团购价
                                sale_count: '99', // 销量
                                tag: this.L('券'), //标签名 团（团购商品），券（代金券），订（场次预订）
                                group_cate: 'cashing',
                            },
                            {
                                group_id: '2', //团购id
                                name: this.L('此处显示团购名称'), //团购名称
                                price: '10', //团购价
                                sale_count: '99', // 销量
                                tag: this.L('订'), //标签名 团（团购商品），券（代金券），订（场次预订）
                                group_cate: 'booking_appoint',
                            },
                        ],
                    },
                    discount_list: [
                        //（样式3使用）
                        {
                            type: 'group', //惠(团购)
                            list: [
                                {
                                    //惠(团购)（样式3使用）
                                    group_id: '2', //团购id
                                    name: this.L('此处显示团购名称'), //团购名称
                                    sale_count: '', // 销量
                                },
                            ],
                        },
                        {
                            type: 'shop', //外，外卖优惠
                            list: [
                                {
                                    //外，外卖优惠
                                    name: this.L('满$2.00减$1'),
                                },
                            ],
                        },
                        {
                            type: 'store', //买，快速买单优惠
                            list: [
                                {
                                    //买，快速买单优惠
                                    name: this.L('满$2.00减$1'),
                                },
                            ],
                        },
                    ],
                },
            ],
            filterList: [
                {
                    title: '',
                },
                {
                    title: this.L('附近'),
                },
                {
                    title: this.L('智能排序'),
                },
            ],
        }
    },
    computed: {
        showType() {
            return this.content && this.content.list && this.content.list.length
                ? this.content.list[0].show_type
                : this.catInfo && this.catInfo.cat_fid != 0
                ? '1'
                : ''
        },
        // 是否为子分类装修
        catInfo() {
            let pageInfo = this.$store.state.customPage.pageInfo
            let info = {
                cat_id: pageInfo.source_id || '',
                cat_name: pageInfo.cat_name || '',
                cat_fid: pageInfo.cat_fid || '0',
            }
            return info
        },
        pageMainColor() {
            return this.$store.state.customPage.pageMainColor || '#ffffff'
        },
    },
    created() {
        this.storeList = this.storeList.map((item) => {
            if (item.bus_label && item.bus_label.length) {
                item.bus_label = item.bus_label.filter((bus_label_item) => {
                    if (bus_label_item.type === 'queue') {
                        bus_label_item.bg_color = 'rgba(235, 245, 255, 1)'
                        bus_label_item.font_color = 'rgba(127, 185, 246, 1)'
                    } else if (bus_label_item.type === 'shop') {
                        bus_label_item.bg_color = 'rgba(254, 244, 237, 1)'
                        bus_label_item.font_color = 'rgba(235, 133, 46, 1)'
                    } else if (bus_label_item.type === 'book') {
                        bus_label_item.bg_color = 'rgba(238, 252, 217, 1)'
                        bus_label_item.font_color = 'rgba(78, 149, 27, 1)'
                    } else if (bus_label_item.type === 'check') {
                        bus_label_item.bg_color = 'rgba(254, 237, 235, 1)'
                        bus_label_item.font_color = 'rgba(249, 77, 42, 1)'
                    }
                    return bus_label_item
                })
            }

            item.groupGoodsList = []

            if (this.showType == '1' && item.group_goods && item.group_goods.list && item.group_goods.list.length) {
                item.groupGoodsList = item.group_goods.list.filter((groupItem) => {
                    if (groupItem.group_cate == 'normal') {
                        groupItem.bg_color = 'RGBA(255, 74, 16, 1)'
                    } else if (groupItem.group_cate == 'booking_appoint') {
                        groupItem.bg_color = 'RGBA(245, 106, 113, 1)'
                    } else if (groupItem.group_cate == 'cashing') {
                        groupItem.bg_color = 'RGBA(255, 136, 34, 1)'
                    }
                    return groupItem
                })
            }

            if (this.showType == '2') {
                if (item.discount_list && item.discount_list.length) {
                    item.groupGoodsList = item.discount_list.map((item) => {
                        if (item.list && item.list.length) {
                            item.name = item.list
                                .map((subItem) => {
                                    return subItem.name
                                })
                                .join(',')
                        } else {
                            item.name = ''
                        }
                        if (item.type == 'group') {
                            item.tag = this.L('惠')
                            item.bg_color = 'RGBA(255, 74, 16, 1)'
                        } else if (item.type == 'shop') {
                            item.tag = this.L('外')
                            item.bg_color = 'RGBA(255, 136, 34, 1)'
                        } else if (item.type == 'store') {
                            item.tag = this.L('买')
                            item.bg_color = 'RGBA(255, 185, 34, 1)'
                        }

                        return item
                    })
                }
            }

            // 星级评分
            item.score_mean_arr = this.scoreHandle(item.score_mean - 0)
            return item
        })
    },
    methods: {
        // 星级评分
        scoreHandle(score) {
            const value = score ? score : 0
            const starList = []
            const floorValue = Math.floor(value)
            const ceilValue = Math.ceil(value)
            for (let i = 0; i < 5; i++) {
                if (floorValue > i) {
                    // 满星
                    starList.push(2)
                } else if (ceilValue - 1 === i) {
                    // 半星
                    starList.push(1)
                } else {
                    // 无星
                    starList.push(0)
                }
            }
            return starList
        },
    },
}
</script>

<style scoped>
.mt-5 {
    margin-top: 5px;
}
.plr-6 {
    padding-left: 6px;
    padding-right: 6px;
}
.nav-wrap {
    padding: 6px 0;
    width: 100%;
    overflow: hidden;
}
.nav-item {
    font-size: 15px;
    font-weight: 500;
    color: #000000;
    text-align: center;
}
.nav-item.active {
    position: relative;
    font-size: 20px;
    font-weight: bold;
}
.nav-item-swiper {
    padding: 0 16px;
    white-space: nowrap;
}
.line {
    position: absolute;
    left: 50%;
    bottom: -6px;
    width: 10px;
    height: 4px;
    background: transparent;
    border-radius: 4px;
    transform: translate(-50%, 0);
}
.nav-item.active .line {
    background: #ff814c;
}

.store-wrap {
    padding: 15px 10px;
    width: 100%;
    border-bottom: 1px solid #eeeeee;
    box-sizing: border-box;
}
.img-wrap {
    margin-right: 10px;
    width: 65px;
    height: 65px;
    border-radius: 6px;
}
.img-wrap img {
    width: 100%;
    height: 100%;
}
.content {
    width: 100%;
}
.start-icon {
    margin-right: 2px;
    width: 11px;
    height: 11px;
}
.name {
    font-size: 16px;
    font-weight: bold;
    color: #333333;
}
.bus-tag {
    margin: 0 6px;
    padding: 4px;
    line-height: 1;
    font-size: 11px;
    font-weight: 500;
}
.group-tag {
    margin-right: 6px;
    padding: 2px;
    line-height: 1;
    font-size: 11px;
    font-weight: 500;
}
.bus-tag:last-child {
    margin-right: 0;
}
.range,
.address {
    font-size: 12px;
    font-weight: 500;
    color: #666666;
}
.cat-name {
    font-size: 11px;
    font-weight: 500;
    color: #ff6a48;
}
.price {
    margin-right: 6px;
    font-size: 13px;
    font-weight: bold;
    color: #fd2c07;
}
.group-content {
    font-size: 12px;
    font-weight: 500;
    color: #333333;
}
.sale-count {
    margin-left: 10px;
    font-size: 10px;
    font-weight: 500;
    color: #999999;
}
.more {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 500;
    color: #333333;
}
.store-wrap-other {
    margin: 6px 0;
    padding: 0 6px;
    width: 50%;
    box-sizing: border-box;
}
.store-content {
    width: 100%;
    box-sizing: border-box;
    box-shadow: 0px 0px 35px 0px rgba(228, 228, 228, 0.89);
    border-radius: 6px 6px 8px 8px;
    overflow: hidden;
}
.store-content .content {
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
}
.store-wrap-other .img-wrap {
    margin-right: 0;
    width: 100%;
    height: auto;
}

/* feed流 */
.feed-wrap-empty {
    flex: auto;
    width: 100%;
    min-height: 667px;
    background: #f4f4f4;
}

.fliter-title {
    font-size: 14px;
    font-weight: 500;
}
</style>