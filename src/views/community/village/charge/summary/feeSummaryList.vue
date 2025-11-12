<template>
    <div class="feeSummaryHouseProperty">
        <a-tabs :active-key="currentKey" @change="tabChange">
            <a-tab-pane v-for="(item, index) in tabList" :key="item.tab_id" :tab="item.tab_name">
                <comopnent :is="item.component" v-if="currentKey == item.tab_id" />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import feeSummaryNewList from './feeSummaryNewList.vue'
    import housePropertyFeeList from './housePropertyFeeList.vue'
    import houseAllOrderFeeList from './houseAllOrderFeeList.vue'
    import houseRoomFeeRateList from './houseRoomFeeRateList.vue'
    import houseRoomUnpaidRateList from './houseRoomUnpaidRateList.vue'
    import houseRoomUnpaid2RateList from './houseRoomUnpaid2RateList.vue'
    import villageApi from '@/api/community/village'
	import store from '@/store';
    export default {
        name: 'feeSummaryHousePropertyAll',
        components: {
            feeSummaryNewList,
            housePropertyFeeList,
            houseRoomFeeRateList,
            houseRoomUnpaidRateList,
            houseRoomUnpaid2RateList,
            houseAllOrderFeeList,
        },
        data() {
            return {
                tabList: [{
                    tab_name: store.getters.config.room_name+'收缴率',
                    component: 'feeSummaryNewList',
                    tab_id: 1
                },{
                    tab_name: '物业费收缴率',
                    component: 'housePropertyFeeList',
                    tab_id: 2
                },
                ],
                currentKey: 1,
                is_aihorse_customized:0,
                jz_wsxdsj_customized:0,
            }
        },
        mounted() {
            
            this.getConfigCustomization()
        },
        methods: {
            tabChange(key){
                this.currentKey = key
            },
            getConfigCustomization () {
              this.is_aihorse_customized=0;
              this.request(villageApi.getConfigCustomization).then(res => {
                if (res) {
                   this.is_aihorse_customized=res.is_aihorse_customized ? res.is_aihorse_customized*1:0;
                   this.jz_wsxdsj_customized=res.jz_wsxdsj_customized ? res.jz_wsxdsj_customized*1:0;
                   if(this.is_aihorse_customized>0){
                       this.tabList=[
                           {
                               tab_name: '收缴率',
                               component: 'housePropertyFeeList',
                               tab_id: 1
                           },
                           {
                                tab_name: '陈欠追缴率',
                                component: 'houseRoomUnpaid2RateList',
                                tab_id: 2
                            },
                            {
                                 tab_name: '收费率（权责）',
                                 component: 'houseRoomFeeRateList',
                                 tab_id: 3
                             },
                             {
                                  tab_name: '往年追缴率(权责)',
                                  component: 'houseRoomUnpaidRateList',
                                  tab_id: 4
                              }
                       ];
                       
                   }else if(this.jz_wsxdsj_customized>0){
                       this.tabList.push(                {
                            tab_name: '收费标准收费率统计',
                            component: 'houseAllOrderFeeList',
                            tab_id: 3
                        });
                   }
                 }
              })
            },
        }
    }
</script>
<style lang="less" scoped>
    .feeSummaryHouseProperty{
        background: #ffffff;
    }
</style>