<template>
    <div class="houseFinancialNoPayStatement x_project">
        <a-tabs :active-key="currentKey" @change="tabChange" type="card">
            <a-tab-pane v-for="(item, index) in tabList" :key="item.tab_id" :tab="item.tab_name">
                <component :is="item.component" v-if="currentKey == item.tab_id" />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import dailyUnpayProjectList from './components/dailyUnpayProjectList.vue'
    import monthlyUnpayProjectList from './components/monthlyUnpayProjectList.vue'
    import yearlyUnpayProjectList from './components/yearlyUnpayProjectList.vue'
    export default {
        name: 'projectFinancialPayStatement',
        components: {
            dailyUnpayProjectList,
            monthlyUnpayProjectList,
            yearlyUnpayProjectList
        },
        data() {
            return {
                tabList: [{
                    tab_name: '日报表',
                    component: 'dailyUnpayProjectList',
                    tab_id: 1
                },{
                    tab_name: '月报表',
                    component: 'monthlyUnpayProjectList',
                    tab_id: 2
                },{
                    tab_name: '年报表',
                    component: 'yearlyUnpayProjectList',
                    tab_id: 3,
                    
                }],
                currentKey: 1
            }
        },
        mounted() {},
        methods: {
            tabChange(key){
                this.currentKey = key
            }
        }
    }
</script>
<style lang="less" scoped>
    .houseFinancialNoPayStatement{
        background: #ffffff;
    }
</style>