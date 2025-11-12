<template>
    <a-drawer :title="single_name" width="1700" :closable="false" :visible="visible" @close="onClose">
        <singleVisualization :singleId="singleId"/>
    </a-drawer>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        watch,
        reactive,
        onMounted,
        defineComponent
    } from '@vue/composition-api';
    import singleVisualization from "../pages/singleVisualization.vue";
    import villageNew from "@/api/community/village/villageNewApi";
	import store from "@/store"; 
    export default defineComponent({
        components: {
            singleVisualization
        },
        props: {
            single_id: {
                type: [String, Number],
                default: 0
            },
            single_name: {
                type: String,
                default: store.getters.config.single_name+'可视化'
            },
            visible: {
                type: Boolean,
                default: false
            },
        },
        setup(props, context) {
            let singleId = ref(0)
            const onClose = ()=>{
                context.emit('closeSingleView')
                singleId.value = 0
            }
            watch(()=>props.visible, (val)=>{
                if(val){
                    singleId.value = props.single_id
                }
            },{
                deep: true
            })
            
            onMounted(()=>{
                
            })
            
            return {
                onClose,
                singleId
            }
        }
    })
</script>

<style lang="less" scoped>
    /deep/ .ant-drawer-body{
        padding: 0px;
    }
</style>
