<template>
    <div class="page_loading"></div>
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
    export default defineComponent({
        
    })
</script>

<style lang="less" scoped>
    .page_loading{
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: fixed;
        background-color: rgba(0, 0, 0, .3);
        left: 0;
        top: 0;
        z-index: 9999999999;
    }
</style>