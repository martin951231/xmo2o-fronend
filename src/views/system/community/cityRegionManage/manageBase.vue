<template>
    <div class="houseCityRegionManageBase">
        <a-tabs :active-key="currentKey" @change="tabChange">
            <a-tab-pane v-for="(item, index) in tabList" :key="item.tab_id" :tab="item.tab_name">
                <component :is="item.component" v-if="currentKey == item.tab_id" />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>
<script>
    import manageBaseSet from './manageBaseSet.vue'
    import manageBaseNavSet from './manageBaseNavSet.vue'
    export default {
        name: 'HouseCityRegionManageBase',
        components: {
            manageBaseSet,
            manageBaseNavSet,
        },
        data() {
            return {
                tabList: [{
                    tab_name: '基本设置',
                    component: 'manageBaseSet',
                    tab_id: 1
                },{
                    tab_name: '可视化导航配置',
                    component: 'manageBaseNavSet',
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
    .houseCityRegionManageBase{
        background: #ffffff;
    }
</style>