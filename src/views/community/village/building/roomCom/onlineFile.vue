<template>
    <div class="online_file">
        显示所有该{{$store.getters.config.room_name}}下所有用户参与的在线文件管理
    </div>
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
        setup(props, context) {
            return{
                
            }
        }
    })
</script>

<style lang="less" scoped>
</style>