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
    import PartyMemberVillageList from './PartyMemberVillageList.vue'
    import PartyMemberStreetWorkerList from './PartyMemberStreetWorkerList.vue'
    import villageApi from '@/api/community/village'
    export default {
        name: 'PartyMemberList',
        components: {
            PartyMemberVillageList,
            PartyMemberStreetWorkerList,
        },
        data() {
            return {
                tabList: [{
                    tab_name: '小区住户党员',
                    component: 'PartyMemberVillageList',
                    tab_id: 1
                }],
                currentKey: 1,
                street_worker_party_member:0,
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
              this.street_worker_party_member=0;
              this.request('/community/street_community.Config/getConfigCustomization').then(res => {
                if (res && res.street_worker_party_member) {
                   this.street_worker_party_member=res.street_worker_party_member*1;
                   if(this.street_worker_party_member>0){
                       this.tabList=[{
                        tab_name: '小区住户党员',
                        component: 'PartyMemberVillageList',
                        tab_id: 1
                    },{
                        tab_name: '街道工作人员党员',
                        component: 'PartyMemberStreetWorkerList',
                        tab_id: 2
                    }];
                       
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