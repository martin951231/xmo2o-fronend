<template>
    <div class="clear_wrapper">
        <div class="left_wrapper">
            <div class="headertop_content">
                <div class="pagetitle">{{ L('点菜单') }}</div>
            </div>
            <div class="headerbottom_content">
                <div class="white_info_wrapper">
                    <div class="shopping_Cart">
                        <div class="cart_left_wrapper">
                            <div class="orderTotal_info">
                                <div class="info_container">
                                    <div class="left_infoContent">
                                        <div class="table_orderTime">
                                            <div class="table">
                                                {{ L('下单时间') }}：{{ ORDER_INFO.create_time_str }}
                                            </div>
                                        </div>
                                        <div class="table_orderTime">
                                            <div class="table">{{ L('店员') }}：{{ staffname }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="slider_cart_wrapper">
                                <div class="slider_cart_container">
                                    <div class="order_List">
                                        <div
                                            class="order_items"
                                            v-for="(items, index) in PAGE_INFO.goods_list"
                                            :key="index"
                                            :class="items.is_selected ? 'selected_item' : ''"
                                            @click="selectFood(index)"
                                        >
                                            <orderGoodsItem :goods="items"></orderGoodsItem>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="bottom_tatol_info_wrapper">
                                <div class="tatol_info_container">
                                    <div class="order_food_info">
                                        <div class="order_tatol_num">{{ L('已加菜X1项', { X1: PAGE_INFO.num }) }}</div>
                                        <div class="order_tatol_price">
                                            <span>￥</span>
                                            {{ PAGE_INFO.total_price }}
                                        </div>
                                    </div>
                                    <div
                                        class="confirmOrder_btn"
                                        :class="canshow ? 'cantOrder' : ''"
                                        @click="confirmOrder()"
                                    >
                                        {{ L('确定下单') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="cart_right_wrapper">
                            <div class="food_operation">
                                <div class="change_num" v-if="nowSelectgooods.num">
                                    <div class="reduce_icon" @click="reduceFoodcount()"><a-icon type="minus" /></div>
                                    <div class="countnum">{{ nowSelectgooods.num }}</div>
                                    <div class="add_icon" @click="addFoodcount()"><a-icon type="plus" /></div>
                                </div>
                                <div class="clean_up">
                                    <div
                                        class="clean_up_btn"
                                        :class="canshow ? 'cantOrder' : ''"
                                        @click="clearallgoods()"
                                    >
                                        {{ L('清空') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 内容主体 -->
        <div class="right_wrapper">
            <div class="menu_wrapper">
                <div class="header_info_container">
                    <div class="header_left_content">
                        <div class="header_title">{{ L('菜单') }}</div>
                    </div>
                    <!-- 刷新 -->
                    <div class="refresh_box" :class="animateshow ? 'rotatecls' : ''" @click="addanimate()">
                        <a-icon type="reload" class="iconfont" />
                    </div>
                </div>

                <div class="body_cashier_container">
                    <!--  菜品分类  -->
                    <div class="tablesize_container">
                        <div class="switchbox" :class="!foodnavshow ? 'hiddenbox' : ''">
                            <div class="leftslidericon">
                                <div class="iconfont circlebox" @click="slidetoright()">
                                    <img src="../../../../../assets/storestaff/lefts.png" alt="" />
                                </div>
                            </div>
                            <div class="center_slider_container" id="slidercontent" ref="slidercontent">
                                <!-- <div class="sliderList_content" ref="sliderbox" :style="'transform:translateX(' + leftscroll + 'px)'" @mousewheel="changeslidernum"> -->
                                <div class="sliderList_content" ref="sliderbox" @mousewheel="changeslidernum">
                                    <div
                                        class="table_items"
                                        v-for="(items, index) in foodMenu"
                                        :key="index"
                                        :class="tableCurrent == index ? 'table_items_active' : ''"
                                        @click="screenFoodtype(index)"
                                    >
                                        <div class="items_content">
                                            <div class="table_name" style="position: relative">
                                                <span>{{ items.cat_name }}</span>
                                                <span
                                                    class="table_count"
                                                    style="position: absolute"
                                                    v-if="items.counts > 0"
                                                    >{{ items.counts }}</span
                                                >
                                            </div>
                                            <div class="bottomborder"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="rightslidericon">
                                <div class="iconfont circlebox" @click="slidetoleft()">
                                    <img src="../../../../../assets/storestaff/rights.png" alt="" />
                                </div>
                            </div>
                        </div>

                        <!-- 搜索菜品 -->
                        <div class="search_content" :class="foodnavshow ? '' : 'searching_box'">
                            <div class="searchiconbox" @click="searchFood()">
                                <img src="../../../../../assets/storestaff/search.png" alt="" />
                            </div>
                            <input
                                v-if="!foodnavshow"
                                ref="selfinput"
                                class="self_input"
                                v-model="searchText"
                                type="text"
                                :placeholder="L('请输入菜品名称')"
                                @input="keyWordsearch()"
                            />
                            <div class="forkiconbox" v-if="!foodnavshow" @click="forkclk()">
                                <img src="../../../../../assets/storestaff/fork.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <!--  菜单列表 -->
                    <a-spin
                        :spinning="loadingdata"
                        :indicator="indicator"
                        size="large"
                        style="height: 75%"
                        class="changecolor"
                    />
                    <div v-if="!loadingdata" class="tableList_wrapper">
                        <template v-if="!isSearchText">
                            <div class="table_list_sliderbox" v-if="goods_list && goods_list.length">
                                <template v-for="(items, indexs) in goods_list">
                                    <goodsItem
                                        :goods="items"
                                        :key="indexs"
                                        :ORDER_ID="ORDER_ID"
                                        @watchmenu="watchmenu"
                                        :otherpage="otherpage"
                                    ></goodsItem>
                                </template>
                            </div>
                        </template>
                        <template v-else>
                            <div class="table_list_sliderbox flex-direction" v-if="goods_list && goods_list.length">
                                <div class="goods_list_wrap">
                                    <div class="goods_list_title">{{ L('菜品') }}</div>
                                    <div class="goods_list">
                                        <template v-for="(items, indexs) in goods_list">
                                            <goodsItem
                                                v-if="!items.is_package_goods"
                                                :goods="items"
                                                :key="indexs"
                                                :ORDER_ID="ORDER_ID"
                                                @watchmenu="watchmenu"
                                                :otherpage="otherpage"
                                            ></goodsItem>
                                        </template>
                                    </div>
                                </div>
                                <div class="goods_list_wrap">
                                    <div class="goods_list_title">{{ L('套餐') }}</div>
                                    <div class="goods_list">
                                        <template v-for="items in goods_list">
                                            <goodsItem
                                                v-if="items.is_package_goods"
                                                :goods="items"
                                                :key="items.product_id"
                                                :ORDER_ID="ORDER_ID"
                                                @watchmenu="watchmenu"
                                                :otherpage="otherpage"
                                            ></goodsItem>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div class="emptyTips" v-if="!goods_list">
                            <div>{{ L('暂无菜品') }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import TWEEN from '@tweenjs/tween.js'
import goodsItem from '../components/goodsItem.vue'
import orderGoodsItem from '@/views/foodshop/storestaff/cashier/components/orderGoodsItem'
export default {
    components: {
        goodsItem,
        orderGoodsItem,
    },
    data() {
        return {
            ORDER_ID: '', //订单id
            staffname: '', //店员名称
            animateshow: false, //动画类名
            loadingdata: true, //加载动画开关
            indicator: <a-icon type="loading-3-quarters" font-size="30px" spin />,

            tableCurrent: 0, //筛选菜品分类
            listenopen: false, //滑动相关

            warningShow: false,

            foodnavshow: true, //控制菜单导航栏展示

            goods_list: '', //菜单数据
            foodMenu: '', // 本页数据
            canshow: true, //下单按钮状态

            slideshake: true,
            numTween: 0,
            leftscroll: 0,

            // 页面元素尺寸信息
            slidercontentwidth: '',
            sliderwidth: '',

            searchText: '', // 搜索框文字

            // 购物车信息
            PAGE_INFO: {},
            ORDER_INFO: {},
            nowSelectgooods: '', //当前选中的菜品信息
            nowSelectgooodsNum: '',
            buffer: true,
            // TABLE_INFO:{},
            isSearchText: false,
            otherpage: 4,
            // 控制快速点击，上一次加购物车还没完成又再次添加
            watchmenuNum: 0
        }
    },
    watch: {
        '$store.state.storestaff.nowSelectgooodsNum'(nval, oval) {
            this.nowSelectgooodsNum = nval
        },
        numTween(nval, oval) {
            new TWEEN.Tween({
                number: oval,
            })
                .to(
                    {
                        number: nval,
                    },
                    100
                )
                .onUpdate((tween) => {
                    this.leftscroll = tween.number.toFixed(0)
                    document.getElementById('slidercontent').scrollLeft = this.leftscroll
                    if (this.leftscroll - document.getElementById('slidercontent').scrollLeft > 150) {
                        this.numTween = document.getElementById('slidercontent').scrollLeft
                    }
                })
                .start()
            function animate() {
                if (TWEEN.update()) {
                    requestAnimationFrame(animate)
                }
            }
            animate()
        },
    },
    mounted() {
        this.$emit('getcurrent', 'orderQuickly')
        this.staffname = Vue.ls.get('storestaff_page_info').staff_name
        this.getAllfood() //菜单信息
        this.getOrderinfo() //获取订单信息
        if (this.$route.query.clean) {
            this.$store.commit('changenowSelectgooodsNum', '')
        }
        setTimeout(() => {
            this.sliderwidth = window.getComputedStyle(this.$refs.sliderbox).width.replace('px', '')
            this.slidercontentwidth = window.getComputedStyle(this.$refs.slidercontent).width.replace('px', '')
            if (this.foodMenu) {
                this.screenFoodtype(0)
            }
        }, 200)
    },
    methods: {
        uplaodMenufc(data) {
        //data.goods_list 是左侧购物车商品
        if (data.goods_list.length > 0) {
                if (this.foodMenu && this.foodMenu.length) {
                //右侧菜单列表
                this.foodMenu.forEach((x, y) => {
                    x.counts = 0
                    //菜单下的商品列表
                    x.goods_list.forEach((m, n) => {
                        m.counts = 0
                        data.goods_list.forEach((items) => {
                            //如果购物车和右侧菜单都不是套餐
                            if(!m.is_package_goods && !items.is_package_goods && m.product_id == items.goods_id){
                                m.counts += items.num
                            }
                            //如果购物车和右侧菜单都是套餐并且套餐id一致
                            if(m.is_package_goods && items.is_package_goods && m.product_id == items.package_id){
                                //循环菜单下套餐的组合列表
                                m.subsidiary_piece.forEach(subsidiary=>{
                                    //循环套餐组合下的商品列表
                                    subsidiary.goods.forEach(goods=>{
                                        //查询到商品就加1
                                        const goodsId = items.sub_list.find(sub=>sub.goods_id == goods.product_id)
                                        if(goodsId){
                                            m.counts += items.num
                                        }
                                    })
                                })
                            }
                        })
                        if (m.counts > 0) {
                            x.counts += m.counts
                        }
                    })
                    this.$set(this.foodMenu, y, x)
                })
                }

            } else {
                if (this.foodMenu && this.foodMenu.length) {
                    this.foodMenu.forEach((x, y) => {
                        x.counts = 0
                        x.goods_list.forEach((m, n) => {
                            m.counts = 0
                        })
                        this.$set(this.foodMenu, y, x)
                        this.$forceUpdate()
                    })
                }
            }
            if(this.searchText && this.goods_list && this.goods_list.length) {
                // 搜索后添加商品更新数量
                this.goods_list.forEach((item,index) => {
                    item.counts = 0
                    if(data.goods_list.length) {
                        let findArr = data.goods_list.filter(goodsItem => goodsItem.goods_id == item.product_id)
                        if(findArr.length) {
                            let nums = findArr.reduce(function(prev, cur) {
                                    return cur.num + prev;
                                }, 0);
                            item.counts = item.counts + nums
                        }
                    } 
                    this.$set(this.goods_list[index],'counts',item.counts)
                    this.$forceUpdate()
                })
                this.goods_list = JSON.parse(JSON.stringify(this.goods_list))
            } else {
                this.screenFoodtype(this.tableCurrent)
            }
        },

        // 获取菜单
        getAllfood() {
            this.loadingdata = true
            this.request('/foodshop/storestaff.goods/goodsListTree', {
                is_clear_stock: 1,
            }).then((res) => {
                this.loadingdata = false
                this.foodMenu = res
                this.screenFoodtype(this.tableCurrent)
            })
        },

        //获取订单信息
        getOrderinfo() {
            this.request('/foodshop/storestaff.order/quickOrder').then((res) => {
                this.ORDER_ID = res.order_id
                this.getShopcartInfo() //获取购物车信息
            })
        },

        // 获取购物车信息
        getShopcartInfo() {
            this.request('/foodshop/storestaff.order/cartDetail', { order_id: this.ORDER_ID }).then((res) => {
                this.PAGE_INFO = res
                this.ORDER_INFO = res.order.order
                this.uplaodMenufc(res)
                if (this.PAGE_INFO.goods_list.length > 0) {
                    this.canshow = false
                } else {
                    this.canshow = true
                }
                this.initData()
            }).finally(() => {
                this.watchmenuNum = 0
                this.buffer = true
            })
        },

        // 初始化数据
        initData() {
            if (this.PAGE_INFO.goods_list.length > 0) {
                this.PAGE_INFO.goods_list.map((items) => {
                    if (this.$store.state.storestaff.nowSelectgooodsNum == items.uniqueness_number) {
                        items.is_selected = true
                        this.nowSelectgooods = items
                        this.nowSelectgooodsNum = items.uniqueness_number
                    } else {
                        items.is_selected = false
                    }
                })
                var ishas = this.PAGE_INFO.goods_list.some((itm) => {
                    return itm.uniqueness_number == this.nowSelectgooods.uniqueness_number
                })
                if (!ishas) {
                    this.nowSelectgooods = ''
                    this.nowSelectgooodsNum = ''
                    this.$store.commit('changenowSelectgooodsNum', '')
                }
            } else {
                this.nowSelectgooods = ''
                this.nowSelectgooodsNum = ''
                this.$store.commit('changenowSelectgooodsNum', '')
            }
        },

        //监听菜单加菜{
        watchmenu(foodinfo) {
            if(this.watchmenuNum) return
            this.watchmenuNum++
            if (this.nowSelectgooodsNum) {
                var ishas = this.PAGE_INFO.goods_list.some((itm) => {
                    return itm.uniqueness_number == this.nowSelectgooodsNum
                })
                if (ishas) {
                    this.PAGE_INFO.goods_list.forEach((item, index) => {
                        if (item.uniqueness_number == this.nowSelectgooodsNum) {
                            this.nowSelectgooods = item
                            item.is_selected = true
                            item.nowSelectgooodsNum = item.uniqueness_number
                            this.addFoodcount()
                        } else {
                            item.is_selected = false
                        }
                        this.$set(this.PAGE_INFO.goods_list, index, item)
                    })
                } else {
                    this.request('/foodshop/storestaff.order/addCart', {
                        order_id: this.ORDER_ID,
                        product: foodinfo.length ? foodinfo : [foodinfo],
                        number: foodinfo.mini_num == 0 ? '1' : foodinfo.mini_num,
                        operate_type: 0,
                    }).then((res) => {
                        if (res.msg == this.L('商品已售罄') || res.msg == '商品已售罄') {
                            this.$message.error(this.L('商品已售罄!'))
                        }
                        this.getShopcartInfo()
                    })
                }
            }
        },

        // 点击已点菜品
        selectFood(idx) {
            this.PAGE_INFO.goods_list.forEach((items, index) => {
                if (idx == index) {
                    items.is_selected = true
                    if (items.is_selected) {
                        this.nowSelectgooods = items
                        this.$store.commit('changenowSelectgooodsNum', items.uniqueness_number)
                    }
                } else {
                    items.is_selected = false
                }
                this.$set(this.PAGE_INFO.goods_list, index, items)
            })

            this.$forceUpdate()
        },

        // 菜品数量操作
        reduceFoodcount() {
            if(!this.buffer) return
            this.buffer = false
            if (this.nowSelectgooods.num > this.nowSelectgooods.mini_num) {
                var reduceCounts = 1
            } else {
                var reduceCounts = this.nowSelectgooods.mini_num || 1
            }
            this.request('/foodshop/storestaff.order/addCart', {
                order_id: this.ORDER_ID,
                uniqueness_number: this.nowSelectgooods.uniqueness_number,
                number: reduceCounts,
                operate_type: 1,
                product: [],
            }).then((res) => {
                this.getShopcartInfo()
            })
        },

        addFoodcount() {
            if(!this.buffer) return
            this.buffer = false
            if (this.nowSelectgooods.num < this.nowSelectgooods.mini_num) {
                var reduceCounts = this.nowSelectgooods.mini_num
            } else {
                var reduceCounts = 1
            }
            this.request('/foodshop/storestaff.order/addCart', {
                order_id: this.ORDER_ID,
                uniqueness_number: this.nowSelectgooods.uniqueness_number,
                number: reduceCounts,
                product: [],
                operate_type: 0,
            }).then((res) => {
                if (res.status == 0) {
                    this.$message.error(res.msg)
                }
                this.getShopcartInfo()
            })
        },

        // 添加刷新动画
        addanimate() {
            this.animateshow = true
            this.isSearchText = false
            setTimeout(() => {
                this.animateshow = false
                location.reload()
            }, 500)
        },

        // 搜索按钮操作相关
        searchFood() {
            this.foodnavshow = false
            this.$nextTick(() => {
                this.$refs.selfinput.focus()
            })
            this.goods_list = []
        },

        // 关键词搜索
        keyWordsearch() {
            if (this.searchText != '') {
                this.isSearchText = true
                this.request('/foodshop/storestaff.goods/goodsListTree', {
                    keyword: this.searchText,
                    is_clear_stock: 1,
                }).then((res) => {
                    this.loadingdata = true
                    this.loadingdata = false
                    this.goods_list = res
                    this.getOrderinfo()
                })
            }
        },

        forkclk() {
            this.searchText = ''
            this.foodnavshow = true
            this.isSearchText = false
            this.getAllfood()
            this.getOrderinfo() 
        },

        //桌台点击
        screenFoodtype(idx) {
            this.tableCurrent = idx
            if (this.foodMenu && this.foodMenu.length) {
                this.foodMenu.forEach((items, index) => {
                    if (index == idx) {
                        if (items.goods_list && items.goods_list.length) {
                            this.goods_list = []
                            items.goods_list.forEach((goods_item, goods_index) => {
                                this.$nextTick(() => {
                                    this.$set(this.goods_list, goods_index, goods_item)
                                    this.$set(this.goods_list[goods_index], 'counts', goods_item.counts)
                                    this.$forceUpdate()
                                })
                            })
                        }
                    }
                })
            }
        },

        // 滑动开始
        canlisten() {
            this.listenopen = true
        },

        changeslidernum(e) {
            if (this.slideshake) {
                this.slideshake = false
                if (this.numTween > -1) {
                    if (e.deltaY > 0) {
                        this.numTween += 150
                    } else {
                        this.numTween -= 150
                    }
                } else {
                    this.numTween = 0
                }
                this.slideshake = true
            }
        },
        slidetoleft() {
            if (this.numTween > -1) {
                this.numTween += 150
            } else {
                this.numTween = 0
            }
        },
        slidetoright() {
            if (this.numTween > -1) {
                this.numTween -= 150
            } else {
                this.numTween = 0
            }
        },

        // 清空购物车
        clearallgoods() {
            this.$confirm({
                title: this.L('提示'),
                content: this.L('确定要清空购物车吗') + '？',
                okText: this.L('确认'),
                centered: true,
                cancelText: this.L('取消'),
                onOk: () => {
                    this.request('/foodshop/storestaff.order/clearCart', {
                        order_id: this.ORDER_ID,
                    }).then((res) => {
                        this.nowSelectgooods = ''
                        this.$store.commit('changenowSelectgooodsNum', '')
                        this.getShopcartInfo()
                    })
                },
            })
        },

        confirmOrder() {
            this.$store.commit('changeleftState', 3)
            this.$router.push({ name: 'settlement_order', query: { orderId: this.ORDER_ID, otherpage: 4 } })
            // this.request('/foodshop/storestaff.order/saveCart', {
            //     order_id: this.ORDER_ID,
            // }).then((res) => {
            //     this.$store.commit('changeleftState', 3)
            //     this.$router.push({
            //         name: 'settlement_order',
            //         query: { orderId: this.ORDER_ID, otherpage: this.otherpage },
            //     })
            // })
        },
    },
}
</script>

<style lang="less" scoped>
@rem: 192; //定义页面尺寸
.clear_wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    user-select: none;
    .left_wrapper {
        width: 635 / @rem * 1rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        .headertop_content {
            width: 100%;
            height: 12%;
            padding-left: 20 / @rem * 1rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            .pagetitle {
                font-size: 30 / @rem * 1rem;
                font-weight: bold;
                color: #ffffff;
                margin-bottom: 20 / @rem * 1rem;
            }
        }
        .headerbottom_content {
            width: 100%;
            height: 86%;
            box-sizing: border-box;
            padding-left: 20 / @rem * 1rem;
            display: flex;
            flex-direction: column;
            .white_info_wrapper {
                width: 100%;
                height: 100%;
                background-color: #ffffff;
                border-radius: 10 / @rem * 1rem;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                .shopping_Cart {
                    width: 100%;
                    height: 100%;
                    background-color: #f7f7f7;
                    display: flex;
                    box-sizing: border-box;
                    user-select: none;
                    .cart_left_wrapper {
                        width: 84%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        .orderTotal_info {
                            width: 100%;
                            height: 11%;
                            box-sizing: border-box;
                            padding: 0 24 / @rem * 1rem;
                            .info_container {
                                width: 100%;
                                height: 100%;
                                border-bottom: 1px solid #eaeaea;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                .right_iconbox {
                                    width: 25 / @rem * 1rem;
                                    height: 25 / @rem * 1rem;
                                    display: flex;
                                    img {
                                        width: 100%;
                                        height: 100%;
                                    }
                                }
                                .left_infoContent {
                                    display: flex;
                                    align-items: center;
                                    justify-content: space-between;
                                    width: 100%;
                                    padding-right: 10 / @rem * 1rem;
                                    .table_orderTime {
                                        font-size: 18 / @rem * 1rem;
                                        line-height: 24 / @rem * 1rem;
                                        color: #666666;
                                        .underbox {
                                            margin-top: 20 / @rem * 1rem;
                                        }
                                    }
                                }
                            }
                        }
                        .slider_cart_wrapper {
                            width: 100%;
                            height: 75%;
                            box-sizing: border-box;
                            overflow-x: hidden;
                            overflow-y: scroll;
                            -webkit-overflow-scrolling: touch;
                            position: relative;
                            .slider_cart_container {
                                position: absolute;
                                width: 100%;
                                display: flex;
                                .order_List {
                                    width: 100%;
                                    display: flex;
                                    flex-direction: column;
                                    .order_items {
                                        width: 100%;
                                        padding: 0 24 / @rem * 1rem;
                                    }
                                    .selected_item {
                                        background-color: #ededf0;
                                        .items_content {
                                            .mainCourse_info {
                                                .foodname_count {
                                                    .foode_name {
                                                        color: #ff8d00;
                                                    }
                                                    .count {
                                                        color: #ff8d00;
                                                    }
                                                }
                                                .food_totalprice {
                                                    color: #ff8d00;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        .slider_cart_wrapper::-webkit-scrollbar {
                            width: 0px;
                        }

                        .bottom_tatol_info_wrapper {
                            width: 520 / @rem * 1rem;
                            height: 14%;
                            background-color: #ffffff;
                            .tatol_info_container {
                                width: 100%;
                                height: 100%;
                                padding: 0 20 / @rem * 1rem;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                white-space: nowrap;
                                .order_food_info {
                                    display: flex;
                                    align-items: flex-end;
                                    font-size: 20 / @rem * 1rem;
                                    font-weight: 500;
                                    line-height: 36 / @rem * 1rem;
                                    color: #666666;
                                    .order_tatol_price {
                                        color: rgba(102, 102, 102, 1);
                                        font-size: 36 / @rem * 1rem;
                                        line-height: 40 / @rem * 1rem;
                                        font-weight: bold;
                                        color: #ff3333;
                                        text-align: center;
                                        display: flex;
                                        align-items: flex-end;
                                        span {
                                            font-size: 28 / @rem * 1rem;
                                            line-height: 36 / @rem * 1rem;
                                        }
                                    }
                                }
                                .confirmOrder_btn {
                                    width: 210 / @rem * 1rem;
                                    height: 75 / @rem * 1rem;
                                    background-color: #18c6b6;
                                    border-radius: 10 / @rem * 1rem;
                                    font-size: 30 / @rem * 1rem;
                                    font-weight: bold;
                                    color: rgba(255, 255, 255, 1);
                                    line-height: 75 / @rem * 1rem;
                                    text-align: center;
                                }
                                .cantOrder {
                                    pointer-events: none;
                                    background-color: #dcdcdc;
                                }
                            }
                        }
                    }
                    .cart_right_wrapper {
                        width: 16%;
                        height: 100%;
                        background-color: #ffffff;
                        padding: 0 8 / @rem * 1rem;
                        box-sizing: border-box;
                        border-left: 1px solid #eaeaea;
                        .food_operation {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            width: 100%;
                            height: 100%;
                            .change_num {
                                width: 100%;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                .reduce_icon {
                                    width: 50 / @rem * 1rem;
                                    height: 50 / @rem * 1rem;
                                    border: solid 2 / @rem * 1rem #f2f2f2;
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    box-sizing: border-box;
                                    cursor: pointer;
                                    span {
                                        display: block;
                                        font-size: 26 / @rem * 1rem;
                                        color: #999999;
                                    }
                                }
                                .countnum {
                                    font-size: 25 / @rem * 1rem;
                                    font-weight: bold;
                                    color: #18c6b6;
                                    line-height: 25 / @rem * 1rem;
                                    margin: 25 / @rem * 1rem 0;
                                }
                                .add_icon {
                                    width: 50 / @rem * 1rem;
                                    height: 50 / @rem * 1rem;
                                    border: solid 2 / @rem * 1rem #18c6b6;
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    box-sizing: border-box;
                                    cursor: pointer;
                                    span {
                                        display: block;
                                        font-size: 26 / @rem * 1rem;
                                        color: #18c6b6;
                                    }
                                }
                            }
                            .cancel_order {
                                width: 100%;
                                margin-top: 100 / @rem * 1rem;
                                .cancel_order_btn {
                                    width: 100%;
                                    height: 75 / @rem * 1rem;
                                    border-radius: 10 / @rem * 1rem;
                                    border: solid 1 / @rem * 1rem #dddddd;
                                    text-align: center;
                                    line-height: 75 / @rem * 1rem;
                                    font-size: 24 / @rem * 1rem;
                                    font-weight: 500;
                                    color: #999999;
                                    cursor: pointer;
                                }
                            }

                            .clean_up {
                                width: 100%;
                                margin-top: 20 / @rem * 1rem;
                                .clean_up_btn {
                                    width: 100%;
                                    height: 100 / @rem * 1rem;
                                    border-radius: 10 / @rem * 1rem;
                                    text-align: center;
                                    background-color: #fe9c00;
                                    line-height: 100 / @rem * 1rem;
                                    font-size: 24 / @rem * 1rem;
                                    font-weight: 500;
                                    color: #ffffff;
                                    cursor: pointer;
                                }
                                .cantOrder {
                                    pointer-events: none;
                                    background-color: #dcdcdc;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .right_wrapper {
        width: calc(100% - 635 / @rem * 1rem);
        height: 100%;
        box-sizing: border-box;
        padding: 0 20 / @rem * 1rem;
        .menu_wrapper {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            .header_info_container {
                width: 100%;
                height: 12%;
                display: flex;
                justify-content: space-between;
                .header_left_content {
                    display: flex;
                    align-items: flex-end;
                    .header_title {
                        font-size: 30 / @rem * 1rem;
                        font-weight: bold;
                        color: #ffffff;
                        margin-bottom: 20 / @rem * 1rem;
                    }
                }
                .refresh_box {
                    margin-top: 20 / @rem * 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 66 / @rem * 1rem;
                    height: 66 / @rem * 1rem;
                    border: solid 4 / @rem * 1rem #ffffff;
                    border-radius: 50%;
                    opacity: 0.7;
                    .iconfont {
                        text-align: center;
                        font-size: 36 / @rem * 1rem;
                        color: #ffffff;
                        box-sizing: border-box;
                        line-height: 1;
                        cursor: pointer;
                    }
                }
            }
            .body_cashier_container {
                width: 100%;
                height: 86%;
                display: flex;
                flex-direction: column;
                align-content: center;
                box-sizing: border-box;
                .changecolor {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    /deep/svg {
                        color: #9f9f9f;
                    }
                    /deep/.ant-spin-container {
                        height: 100%;
                    }
                }
                .tablesize_container {
                    width: 100%;
                    height: 70 / @rem * 1rem;
                    border-radius: 6px;
                    display: flex;
                    padding: 0 20 / @rem * 1rem;
                    box-sizing: border-box;
                    background-color: rgba(65, 65, 65, 0.8);
                    align-items: center;
                    overflow: hidden;
                    .switchbox {
                        display: flex;
                        height: 100%;
                        width: 100%;
                        .leftslidericon {
                            width: 75 / @rem * 1rem;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            // background-image:linear-gradient(to right, rgba(65, 65, 65, 0), rgba(65, 65, 65, 0));
                            cursor: pointer;
                            .circlebox {
                                width: 24 / @rem * 1rem;
                                height: 24 / @rem * 1rem;
                                box-sizing: border-box;
                                background-color: rgba(256, 256, 256, 0.2);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border-radius: 50%;
                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                        .rightslidericon {
                            width: 75 / @rem * 1rem;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            .circlebox {
                                width: 24 / @rem * 1rem;
                                height: 24 / @rem * 1rem;
                                box-sizing: border-box;
                                background-color: rgba(256, 256, 256, 0.2);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border-radius: 50%;
                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                        .center_slider_container {
                            position: relative;
                            height: 100%;
                            width: 100%;
                            overflow-x: scroll;
                            overflow-y: hidden;
                            -webkit-overflow-scrolling: touch;
                            .sliderList_content {
                                height: 70 / @rem * 1rem;
                                top: 0;
                                left: 0;
                                z-index: 10;
                                user-select: none;
                                position: absolute;
                                transition: all 0.5s linear;
                                display: flex;
                                white-space: nowrap;
                                align-items: center;
                                .table_items {
                                    display: inline-block;
                                    height: 100%;
                                    margin: 0 30 / @rem * 1rem;
                                    .items_content {
                                        display: flex;
                                        height: 100%;
                                        flex-direction: column;
                                        align-items: center;
                                        justify-content: flex-end;
                                        cursor: pointer;
                                        .table_name {
                                            width: 100%;
                                            font-size: 26 / @rem * 1rem;
                                            color: #b9b9b9;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            .pos_el {
                                                display: block;
                                            }
                                            .table_count {
                                                width: 60 / @rem * 1rem;
                                                height: 40 / @rem * 1rem;
                                                background-color: #ff3333;
                                                border-radius: 10px 10px 10px 2px;
                                                right: -45 / @rem * 1rem;
                                                top: -15 / @rem * 1rem;
                                                font-size: 32 / @rem * 1rem;
                                                color: #ffffff;
                                                text-align: center;
                                                line-height: 40 / @rem * 1rem;
                                                transform: scale(0.5);
                                            }
                                        }
                                        .bottomborder {
                                            width: 56 / @rem * 1rem;
                                            height: 5 / @rem * 1rem;
                                            background-color: transparent;
                                            border-radius: 3 / @rem * 1rem;
                                            margin-top: 15 / @rem * 1rem;
                                        }
                                    }
                                }
                                .table_items_active {
                                    .items_content {
                                        .table_name {
                                            color: #ffffff;
                                        }
                                        .bottomborder {
                                            background-color: #ffffff;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    .hiddenbox {
                        opacity: 0;
                        pointer-events: none;
                    }

                    .search_content {
                        display: flex;
                        align-items: center;
                        margin-left: 12 / @rem * 1rem;
                        height: 48 / @rem * 1rem;
                        border: 0px;
                        .searchiconbox {
                            width: 28 / @rem * 1rem;
                            height: 28 / @rem * 1rem;
                            display: flex;
                            margin-right: 10 / @rem * 1rem;
                            cursor: pointer;
                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .forkiconbox {
                            width: 20 / @rem * 1rem;
                            height: 20 / @rem * 1rem;
                            display: flex;
                            margin-left: 10 / @rem * 1rem;
                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .self_input {
                            background-color: transparent;
                            border: none; //去除边框
                            outline: none; //可以去除点击input时的border
                            font-size: 24 / @rem * 1rem;
                            font-weight: bold;
                            width: 180 / @rem * 1rem;
                            color: #ffffff;
                        }
                    }

                    .searching_box {
                        width: 330 / @rem * 1rem;
                        border: 2 / @rem * 1rem solid #ffac00;
                        border-radius: 40 / @rem * 1rem;
                        animation: stretching 0.2s 1 linear;
                        box-sizing: border-box;
                        padding: 0 15 / @rem * 1rem;
                    }

                    @keyframes stretching {
                        0% {
                            width: 30 / @rem * 1rem;
                            border: 2 / @rem * 1rem solid #ffac00;
                            border-radius: 0;
                        }

                        100% {
                            width: 310 / @rem * 1rem;
                            border: 2 / @rem * 1rem solid #ffac00;
                            border-radius: 20 / @rem * 1rem;
                        }
                    }
                }
                .center_slider_container::-webkit-scrollbar {
                    height: 0px;
                }

                .tableList_wrapper {
                    width: 100%;
                    height: calc(100% - 70 / @rem * 1rem);
                    display: flex;
                    position: relative;
                    overflow-y: scroll;
                    overflow-x: hidden;
                    user-select: none;
                    .emptyTips {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        div {
                            padding-bottom: 60 / @rem * 1rem;
                            font-size: 30 / @rem * 1rem;
                            font-weight: 500;
                            color: #ffffff;
                        }
                    }
                    .table_list_sliderbox {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        display: flex;
                        flex-wrap: wrap;
                        align-items: flex-start;
                        .goods_list_wrap {
                            width: 100%;
                            .goods_list_title {
                                padding: 15 / @rem * 1rem;
                                font-size: 26 / @rem * 1rem;
                                font-weight: bold;
                                color: #ffffff;
                            }
                            .goods_list {
                                width: 100%;
                                display: flex;
                                flex-wrap: wrap;
                                align-items: flex-start;
                            }
                        }
                    }
                }

                .tableList_wrapper::-webkit-scrollbar {
                    width: 0;
                }
            }
        }
    }
}
</style>
