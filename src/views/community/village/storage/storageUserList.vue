<template>
    <div class="storageUserBalanceStatement">
        <a-tabs :active-key="currentKey" @change="tabChange">
            <a-tab-pane v-for="(item, index) in tabList" :key="item.tab_id" :tab="item.tab_name">
                <component :is="item.component" v-if="currentKey == item.tab_id" />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import storageUserBalanceList from './storageUserBalanceList.vue'
    import storageUserBalanceUseList from './storageUserBalanceUseList.vue'
    export default {
        name: 'storageUserBalanceStatement',
        components: {
            storageUserBalanceList,
            storageUserBalanceUseList,
        },
        data() {
            return {
                tabList: [{
                    tab_name: '住户余额',
                    component: 'storageUserBalanceList',
                    tab_id: 1
                },{
                    tab_name: '预存/抵扣记录',
                    component: 'storageUserBalanceUseList',
                    tab_id: 2
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
    .storageUserBalanceStatement{
        background: #ffffff;
    }
</style>