<template>
    <div class="cashier">
        <div class="nav_container">
            <!-- 导航 -->
            <div class="navcontent">
                <div 
                    v-for="(items, index) in navList" 
                    :key="index" 
                    class="nav_items_wrapper" 
                    :class="currentindex == index ? 'item_active' : ''" 
                    @click="goroute(index, items.path)">
                <div class="icon iconfont" v-html="items.icon"></div>
                <div class="items_name">{{ items.name }}</div>
                </div>
            </div>
            <!-- 返回 -->
            <div class="dateinfo_container">
                <div class="backbtn iconfont" @click="backfnc()">&#xe60b;返回</div>
            </div>
        </div>
        <!-- 页面路由 -->
        <div class="content_wrapper">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive" @getcurrent="changecurrent" :refresh="refresh"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"  @getcurrent="changecurrent" :refresh="refresh"></router-view>
        </div>
    </div>
</template>

<script>
import Rem from '../../../utils/rem.js';
import Vue from 'vue';
import { Button } from 'ant-design-vue';
Vue.use(Button);
Rem.getrem();
export default {
    props: {},
    data() {
        return {
            currentindex: 0,
            navList: [
                // {
                //     icon: '&#xe6e5;',
                //     name: '订单处理',
                //     path: 'order'
                // },
              {
                icon: '&#xe6e5;',
                name: '订单处理',
                path: 'orderCopy'
              },
              {
                icon: '&#xe6e5;',
                name: '批量发货',
                path: 'SendGoods'
              },
            ],
            refresh: 0,
            routePath: '/storestaff/storestaff.mall/mall/'
        };
    },
    created() {
        // this.$bus.$on('changecurrent', e => {
        //   this.changecurrent(e);
        // });
        this.currentindex = sessionStorage.getItem('dyz25');
        if(sessionStorage.getItem('dyz25')=="" || sessionStorage.getItem('dyz25')==null || sessionStorage.getItem('dyz25')==undefined || !sessionStorage.getItem('dyz25')){
            this.currentindex =0
        }
        this.staffname = Vue.ls.get('storestaff_page_info');
            if (!Vue.ls.get('storestaff_page_info')) {
            this.$router.replace({ name: 'storestaffLogin' });
        }
    },
    mounted() {},
    methods: {
        goroute(idx, path) {

            this.refresh++
            this.currentindex = idx
            this.$router.replace({ path: `${this.routePath}${path}` })
            console.log(this.$route,'this.$route')
            this.$route.meta.keepAlive = false
            sessionStorage.setItem('dyz25', idx);
            this.removeTabStatus()
        },

        changecurrent(e) {
            this.currentindex = e;
        },
        backfnc(){
            sessionStorage.setItem('dyz25', 0)
            this.$router.replace('/storestaff/storestaff.index/index')
            this.removeTabStatus()
        },

        removeTabStatus() {
            let tabStatus = sessionStorage.getItem('tabStatus') || ''
            if (tabStatus) {
                sessionStorage.removeItem('tabStatus')
            }
        }
    }
};
</script>

<style lang="less" scoped>
@rem: 192; //定义页面尺寸
@font-face {
    font-family: 'iconfont'; /* project id 1997987 */
    src: url('https://at.alicdn.com/t/font_1997987_c00o7bb6ctc.eot');
    src: url('https://at.alicdn.com/t/font_1997987_c00o7bb6ctc.eot?#iefix') format('embedded-opentype'), url('https://at.alicdn.com/t/font_1997987_c00o7bb6ctc.woff2') format('woff2'),
        url('https://at.alicdn.com/t/font_1997987_c00o7bb6ctc.woff') format('woff'), url('https://at.alicdn.com/t/font_1997987_c00o7bb6ctc.ttf') format('truetype'),
        url('https://at.alicdn.com/t/font_1997987_c00o7bb6ctc.svg#iconfont') format('svg');
}
    .iconfont {
        font-family: 'iconfont' !important;
    }
.cashier {
    width: 100%;
    max-height: 100vh;
    height: 100vh;
    display: flex;
    background-color: #2e2e2e;
    box-sizing: border-box;
    .nav_container {
        width: 5.2%;
        height: 100%;
        max-height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .navcontent {
            flex: 1;
            width: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
            .nav_items_wrapper {
                width: 100%;
                height: 150 / @rem * 1rem;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                flex-direction: column;
                border-bottom: 1px solid rgba(165, 171, 201, 0.1);
                justify-content: center;
                user-select: none;
                cursor: pointer;
                .icon {
                    color: #c6c6c6;
                    opacity: 0.8;
                    font-size: 28 / @rem * 1rem;
                }
                .items_name {
                    width: 44 / @rem * 1rem;
                    // height: 45 / @rem * 1rem;
                    box-sizing: border-box;
                    color: #c6c6c6;
                    text-align: center;
                    // position: relative;
                    opacity: 0.8;
                    font-size: 22 / @rem * 1rem;
                    // transform: scale(0.5);
                }
        }
        .item_active {
            .icon {
                color: #18c6b6;
            }
            .items_name {
                color: #18c6b6;
            }
        }
    }
        .backbtn{
            width: 100%;
            padding: 15/ @rem * 1rem;
            border-top: 1px solid rgba(165, 171, 201, 0.1);
            cursor: pointer;
            text-align: center;
            font-size: 20 / @rem * 1rem;
            letter-spacing: 0px;
            color: #c6c6c6;
            margin-top: 30 / @rem * 1rem;
        }
    }
    .content_wrapper {
        flex: 1;
        width: 94.8%;
        height: 100vh;
        max-height: 100vh;
        // background: url(../../../assets/storestaff/cashinerback.png);
        // background-size: 100% 100%;
        background: #ffffff;
        box-sizing: border-box;
        overflow: auto;
    }
}

.rotatecls {
    animation: turn 0.5s linear infinite;
}
@keyframes turn {
    0% {
        -webkit-transform: rotate(0deg);
    }
    25% {
        -webkit-transform: rotate(90deg);
    }
    50% {
        -webkit-transform: rotate(180deg);
    }
    75% {
        -webkit-transform: rotate(270deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
    }
}
</style>
