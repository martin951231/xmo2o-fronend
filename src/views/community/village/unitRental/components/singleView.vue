<template>
    <a-drawer :title="$store.getters.config.single_name+'可视化'" width="1700" :closable="false" :visible="visible" @close="onClose">
        <singleVisualization />
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
    export default defineComponent({
        components: {
            singleVisualization
        },
        props: {
            single_id: {
                type: [String, Number],
                default: 0
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        setup(props, context) {
            const onClose = ()=>{
                context.emit('closeSingleView')
            }
            
            watch(()=>props.visible, (val)=>{
                if(val){
                    console.log('single_id===>', props.single_id)
                }
            },{
                deep: true
            })
            
            onMounted(()=>{
                
            })
            
            return {
                onClose
            }
        }
    })
</script>

<style lang="less" scoped>
    /deep/ .ant-drawer-body{
        padding: 0px;
    }
</style>
