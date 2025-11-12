<template>
    <a-tabs style="background-color: #ffffff;" default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="在场车辆" v-if="onlineCars">
            <online-cars v-if="currentIndex == 1" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="月租车进出记录" force-render v-if="monthCars">
            <month-cars v-if="currentIndex == 2" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="临时车进出记录" v-if="temporaryCars">
            <temporary-cars v-if="currentIndex == 3" />
        </a-tab-pane>
        <a-tab-pane key="4" tab="手动开闸记录" v-if="manualOpen">
            <manual-open v-if="currentIndex == 4" />
        </a-tab-pane>
        <a-tab-pane key="5" tab="不在场车辆记录" force-render v-if="notPresent">
            <not-present v-if="currentIndex == 5" />
        </a-tab-pane>
        <a-tab-pane key="6" tab="电瓶车进出统计" v-if="storageBattery">
            <storage-battery v-if="currentIndex == 6" />
        </a-tab-pane>
        <a-tab-pane key="7" tab="储值车记录" force-render v-if="storedValue">
            <stored-value v-if="currentIndex == 7" />
        </a-tab-pane>
    </a-tabs>
</template>

<script>
    import monthCars from './dataRecordCom/monthCars.vue'
    import onlineCars from './dataRecordCom/onlineCars.vue'
    import temporaryCars from './dataRecordCom/temporaryCars.vue'
    import manualOpen from './dataRecordCom/manualOpen.vue'
    import notPresent from './dataRecordCom/notPresent.vue'
    import storageBattery from './dataRecordCom/storageBattery.vue'
    import storedValue from './dataRecordCom/storedValue.vue'
    export default {
        data(){
            return{
                currentIndex: 1,
                onlineCars:true,
                monthCars:true,
                temporaryCars:true,
                manualOpen:true,
                notPresent:true,
                storageBattery:true,
                storedValue:true,
            }
        },
        components: {
            onlineCars,
            monthCars,
            notPresent,
            temporaryCars,
            manualOpen,
            storageBattery,
            storedValue
        },
        mounted(){
            this.getRecordShow()
        },
        methods: {
            callback(key) {
                this.currentIndex = key
            },
            getRecordShow(){
                this.request('/community/village_api.Parking/getRecordShow').then((res) => {
                    this.onlineCars=res.onlineCars
                    this.monthCars=res.monthCars
                    this.temporaryCars=res.temporaryCars
                    this.manualOpen=res.manualOpen
                    this.notPresent=res.notPresent
                    this.storageBattery=res.storageBattery
                    this.storedValue=res.storedValue
                })
            }
        },
    }
</script>

<style lang="less" scoped>
</style>
