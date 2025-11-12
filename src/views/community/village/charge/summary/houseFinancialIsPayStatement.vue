<template>
    <div style="background: #ffffff;margin-top: 10px;">
        <a-tabs
            :default-active-key="currentIndex"
            tab-position="left"
            size="small"
             type="line"
            @change="tabMenuChange">
            <a-tab-pane :key="index" v-for="(item,index) in tabMenuList" :tab="item.name" style="margin-left: -25px;">
              <component v-if="currentIndex == index" :is="item.component" />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import projectFinancialPayStatement from './projectFinancialPayStatement.vue'
    import ruleFinancialPayStatement from './ruleFinancialPayStatement.vue'
    export default {
        name: 'houseFinancialIsPayStatement',
        components: {
            projectFinancialPayStatement,
            ruleFinancialPayStatement,
        },
        data() {
            return {
                tabMenuList:[
                    {name: '项目汇总', component:'projectFinancialPayStatement'},
                    {name: '标准汇总', component:'ruleFinancialPayStatement'},
                 ],
                 currentIndex: 0
            }
           
        },
        mounted() {},
        methods: {
            tabMenuChange(activeKey){
                this.currentIndex =activeKey;
            }
        }
    }
</script>
<style lang="less" scoped>
    .houseFinancialIsPayStatement{
        background: #ffffff;
    }
</style>