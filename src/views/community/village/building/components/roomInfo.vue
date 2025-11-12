<template>
    <a-drawer :title="drawerTitle?drawerTitle:title" placement="right" width="1400" :visible="visible" @close="onRoomClose">
        <a-tabs :active-key="currentKey" @change="tabChange" v-if="visible">
            <a-tab-pane v-for="item in tabList" :key="item.key">
                <span slot="tab">
                    <a-icon :type="item.icon_type" />
                    {{item.tab_name}}
                </span>
                <component @hideUserTab="hideUserTab" @getRoomAddress="getAddress" v-if="currentKey == item.key" :is="item.component" :roomId="roomId" :roomParams="roomParams" />
            </a-tab-pane>
        </a-tabs>
        
        <!-- <roomInformation v-if="type=='room_edit' && visible" :roomId="roomId" :roomParams="roomParams" /> -->
    </a-drawer>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        watch,
        reactive,
        onMounted,
        onUpdated,
        defineComponent
    } from '@vue/composition-api';
    import personnelInformation from "../roomCom/personnelInformation.vue";
    import roomInformation from "../roomCom/roomInformation.vue";
    import chargingStandard from "../roomCom/chargingStandard.vue";
    import parkingSpace from "../roomCom/parkingSpace.vue";
    import propertyBill from "../roomCom/propertyBill.vue";
    import associatedWorkOrder from "../roomCom/associatedWorkOrder.vue";
    import onlineFile from "../roomCom/onlineFile.vue";
    import userInformation from "../roomCom/userInformation.vue";
    import associatedCardNo from "../roomCom/associatedCardNo.vue";
    import warrantyDetail from "../roomCom/arrantyDetail.vue";
    import villageNew from "@/api/community/village/villageNewApi";
	import store from '@/store';
    export default defineComponent({
        props: {
            title: {
                type: String,
                defalut: store.getters.config.room_name+"信息"
            },
            visible: {
                type: Boolean,
                defalut: false
            },
            roomId: {
                type: [String, Number],
                defalut: ''
            },
            type: {
                type: String,
                defalut: ''
            }
        },
        components:{
            personnelInformation,
            roomInformation,
            chargingStandard,
            propertyBill,
            associatedWorkOrder,
            onlineFile,
            userInformation,
            parkingSpace,
            associatedCardNo,
            warrantyDetail
        },
        
        setup(props, context) {
            
            let currentKey = ref('')
            const onRoomClose = () => {
                context.emit("closeRoom")
            }
            
            let drawerTitle = ref('')
            const getAddress = (address) => {
                drawerTitle.value = address
            }
            
            const tabChange=(key)=>{
                currentKey.value = key
            }
            
            watch(()=>props.visible, (val)=>{
                if(val){
                   getRoomTab()
                }
            }, {
                deep: true
            })
            
            const tabList = ref([])
            
            const roomParams = ref({})
            
            const getRoomTab = ()=>{
                Vue.prototype.request('/community/village_api.Building/getRoomOptionType', {
                    vacancy_id: props.roomId
                }).then((res) => {
                    tabList.value = res.option_list
                    currentKey.value = res.option_list[0].key
                    roomParams.value = res
                })
            }
            
            const hideUserTab = () => {
                let index = tabList.value.findIndex(v=>v.component == 'userInformation')
                tabList.value.splice(index, 1)
                currentKey.value = tabList.value[0].key
            }

            return {
                onRoomClose,
                tabList,
                getRoomTab,
                roomParams,
                tabChange,
                currentKey,
                getAddress,
                drawerTitle,
                hideUserTab
            }
        }
    })
</script>

<style lang="less" scoped>
</style>
