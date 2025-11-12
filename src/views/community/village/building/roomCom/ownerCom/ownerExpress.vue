<template>
    <a-tabs :default-active-key="1" @change="tabChange">
        <a-tab-pane v-for="(item, index) in tabList" :key="item.key" :tab="item.label">
            <component v-if="currentKey == item.key" :is="item.value" :roomId="roomId"></component>
        </a-tab-pane>
    </a-tabs>
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
    import expressSend from "../expressCom/expressSend.vue";
    import expressCollect from "../expressCom/expressCollect.vue";
    export default defineComponent({
        props: {
            roomParams: {
                type: Object,
                default: ()=>{return {}}
            },
            roomId: {
                type: [String, Number],
                defalut: ''
            }
        },
        components: {
            expressSend,
            expressCollect
        },
        setup(props, context) {
            const tabList = ref([{
                key: 1,
                label: '快递代收',
                value: 'expressCollect'
            }, {
                key: 2,
                label: '快递代发',
                value: 'expressSend'
            }])
            let currentKey = ref(1)
            const tabChange = (key) => {
                currentKey.value = key
            }
            return{
                tabList,
                tabChange,
                currentKey
            }
        }
    })
</script>

<style lang="less" scoped>
</style>