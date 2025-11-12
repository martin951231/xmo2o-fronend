<template>
    <div class="chargeStandard">
        <a-tabs :active-key="currentKey" @change="tabChange">
            <a-tab-pane v-for="(item, index) in tabList" :key="item.tab_id" :tab="item.tab_name">
                <comopnent :is="item.component" v-if="currentKey == item.tab_id" />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import villageApi from '@/api/community/village'
    import chargeStandardNew from './chargeStandardNew.vue'
    import chargeStandardAllDel from './chargeStandardAllDel.vue'
    export default {
        name: 'ChargeStandardAll',
        components: {
            chargeStandardNew,
            chargeStandardAllDel
        },
        data() {
            return {
                tabList: [{
                    tab_name: '收费标准管理',
                    component: 'chargeStandardNew',
                    tab_id: 1
                },{
                    tab_name: '已删除收费标准',
                    component: 'chargeStandardAllDel',
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
    .chargeStandard{
        background: #ffffff;
    }
</style>