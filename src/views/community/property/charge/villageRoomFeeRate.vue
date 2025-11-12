<template>
    <div class="villagePropertyRoomFeeRate">
        <a-tabs :active-key="currentKey" @change="tabChange">
            <a-tab-pane v-for="(item, index) in tabList" :key="item.tab_id" :tab="item.tab_name">
                <comopnent :is="item.component" v-if="currentKey == item.tab_id" />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import villageRoomPaidFeeRate from './villageRoomPaidFeeRate.vue'
    import houseRoomUnpaidRateList from './houseRoomUnpaidRateList.vue'
    import houseRoomUnpaid2RateList from './houseRoomUnpaid2RateList.vue'
    export default {
        name: 'villagePropertyRoomFeeRate',
        components: {
            villageRoomPaidFeeRate,
            houseRoomUnpaidRateList,
            houseRoomUnpaid2RateList,
        },
        data() {
            return {
                tabList: [{
                            tab_name: '收费率（权责）',
                            component: 'villageRoomPaidFeeRate',
                            tab_id: 1
                        },{
                             tab_name: '往年追缴率(权责)',
                             component: 'houseRoomUnpaidRateList',
                             tab_id: 2
                         },
                         {
                              tab_name: '陈欠追缴率',
                              component: 'houseRoomUnpaid2RateList',
                              tab_id: 3
                          }],
                currentKey: 1,
            }
        },
        mounted() {
            
        },
        methods: {
            tabChange(key){
                this.currentKey = key
            },
        }
    }
</script>
<style lang="less" scoped>
    .villagePropertyRoomFeeRate{
        background: #ffffff;
    }
</style>