<template>
    <div style="background: #ffffff;margin-top: 10px;">
        <a-tabs
            :default-active-key="currentIndex"
            tab-position="left"
            size="small"
             type="line"
            @change="tabMenuChange"  >
            <a-tab-pane :key="index" v-for="(item,index) in tabMenuList" :tab="item.name" style="margin-left: -25px;">
              <component v-if="currentIndex == index" :is="item.component"/>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import projectFinancialNoPayStatement from './projectFinancialNoPayStatement.vue'
    import ruleFinancialNoPayStatement from './ruleFinancialNoPayStatement.vue'
    export default {
        name: 'houseFinancialIsPayStatement',
        components: {
            projectFinancialNoPayStatement,
            ruleFinancialNoPayStatement,
        },
        data() {
            return {
                tabMenuList:[
                    {name: '项目汇总', component:'projectFinancialNoPayStatement'},
                    {name: '标准汇总', component:'ruleFinancialNoPayStatement'},
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