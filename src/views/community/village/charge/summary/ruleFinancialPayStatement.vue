<template>
        <div class="houseFinancialIsPayStatement x_rule">
            <a-tabs :active-key="currentKey" @change="tabChange" type="card">
                <a-tab-pane v-for="(item, index) in tabList" :key="item.tab_id" :tab="item.tab_name">
                    <component :is="item.component" v-if="currentKey == item.tab_id" />
                </a-tab-pane>
            </a-tabs>
        </div>
</template>
<script>
    import dailyPaidStatementList from './components/dailyPaidStatementList.vue'
    import monthlyPaidStatementList from './components/monthlyPaidStatementList.vue'
    import yearlyPaidStatementList from './components/yearlyPaidStatementList.vue'
    export default {
        name: 'ruleFinancialPayStatement',
        components: {
            dailyPaidStatementList,
            monthlyPaidStatementList,
            yearlyPaidStatementList
        },
        data() {
            return {
                tabList: [{
                    tab_name: '日报表',
                    component: 'dailyPaidStatementList',
                    tab_id: 1
                },{
                    tab_name: '月报表',
                    component: 'monthlyPaidStatementList',
                    tab_id: 2
                },{
                    tab_name: '年报表',
                    component: 'yearlyPaidStatementList',
                    tab_id: 3,
                    
                }],
                currentKey: 1,
            }
           
        },
        mounted() {},
        methods: {
            tabChange(key){
                this.currentKey = key
            },
        }
    }
</script>
<style lang="less" scoped>
    .houseFinancialIsPayStatement{
        background: #ffffff;
    }
</style>