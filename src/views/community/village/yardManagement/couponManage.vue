<template>
    <a-tabs style="background-color: #ffffff;" default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="店铺列表">
            <shop-list v-if="currentIndex == 1" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="优惠券列表">
            <coupon-list v-if="currentIndex == 2" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="购买记录">
            <buy-record v-if="currentIndex == 3" />
        </a-tab-pane>
    </a-tabs>
</template>

<script>
    import shopList from './components/shopList.vue'
    import couponList from './components/couponList.vue'
    import buyRecord from './components/buyRecord.vue'
    export default {
        data(){
            return{
                currentIndex: 1
            }
        },
        components: {
            shopList,
            couponList,
            buyRecord
        },
        methods: {
            callback(key) {
                this.currentIndex = key
            },
        },
    }
</script>

<style lang="less" scoped>
</style>
