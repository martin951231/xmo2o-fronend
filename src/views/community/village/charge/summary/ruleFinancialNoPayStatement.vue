<template>
    <div class="houseFinancialNoPayStatement x_rule">
        <a-tabs :active-key="currentKey" @change="tabChange" type="card">
            <a-tab-pane v-for="(item, index) in tabList" :key="item.tab_id" :tab="item.tab_name">
                <component :is="item.component" v-if="currentKey == item.tab_id" />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import dailyStatementList from './components/dailyStatementList.vue'
    import monthlyStatementList from './components/monthlyStatementList.vue'
    import yearlyStatementList from './components/yearlyStatementList.vue'
    export default {
        name: 'houseFinancialNoPayStatement',
        components: {
            dailyStatementList,
            monthlyStatementList,
            yearlyStatementList
        },
        data() {
            return {
                tabList: [{
                    tab_name: '日报表',
                    component: 'dailyStatementList',
                    tab_id: 1
                },{
                    tab_name: '月报表',
                    component: 'monthlyStatementList',
                    tab_id: 2
                },{
                    tab_name: '年报表',
                    component: 'yearlyStatementList',
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