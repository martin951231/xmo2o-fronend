<template>
    <div id="components-layout-demo-basic">
        <a-layout>
            <a-layout-content
                    :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '100px' }">
                <a-tabs>
                    <a-tab-pane key="1" tab="预约来店列表">
                       <appoint-arrive-store-list></appoint-arrive-store-list>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="预约礼">
                        <appoint-gift-list></appoint-gift-list>
                    </a-tab-pane>
                    <!-- <a-button slot="tabBarExtraContent">
                         Extra Action
                     </a-button>-->
                </a-tabs>
            </a-layout-content>
        </a-layout>
    </div>

</template>

<script>
    import AppointGiftList from "./AppointGiftList";
    import AppointArriveStoreList from "./AppointArriveStoreList";


    export default {
        name: "AppointList",
        components: {AppointArriveStoreList, AppointGiftList},
        data() {
            return {
                mer_id: ""
            }
        },
    }
</script>

<style scoped>

</style>