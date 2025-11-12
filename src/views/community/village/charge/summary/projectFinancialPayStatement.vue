<template>
        <div class="houseFinancialIsPayStatement x_project">
            <a-tabs :active-key="currentKey" @change="tabChange" type="card">
                <a-tab-pane v-for="(item, index) in tabList" :key="item.tab_id" :tab="item.tab_name">
                    <component :is="item.component" v-if="currentKey == item.tab_id" />
                </a-tab-pane>
            </a-tabs>
        </div>
</template>
<script>
    import dailyPaidProjectList from './components/dailyPaidProjectList.vue'
    import monthlyPaidProjectList from './components/monthlyPaidProjectList.vue'
    import yearlyPaidProjectList from './components/yearlyPaidProjectList.vue'
    export default {
        name: 'projectFinancialPayStatement',
        components: {
            dailyPaidProjectList,
            monthlyPaidProjectList,
            yearlyPaidProjectList
        },
        data() {
            return {
                tabList: [{
                    tab_name: '日报表',
                    component: 'dailyPaidProjectList',
                    tab_id: 1
                },{
                    tab_name: '月报表',
                    component: 'monthlyPaidProjectList',
                    tab_id: 2
                },{
                    tab_name: '年报表',
                    component: 'yearlyPaidProjectList',
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