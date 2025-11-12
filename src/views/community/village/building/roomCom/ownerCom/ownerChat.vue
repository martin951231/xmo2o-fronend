<template>
    <div style="margin-top: 10px;">
        <iframe name="myiframe" id="myrame" :src="webUrl" frameborder="0"  width="1330" height="500">
            <p>你的浏览器不支持iframe标签</p>
        </iframe>
    </div>
</template>

<script>
    import chatRecord from "./chatRecord.vue";
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
            username: {
                type: String,
                defalut: ''
            },
            pigcms_id: {
                type: [String, Number],
                defalut: 0
            }
        },
        setup(props, context) {
            let webUrl = ref('')
            webUrl.value = '/v20/public/platform/#/community/village/building/roomCom/ownerCom/chatRecord?name='+props.username+'&pigcms_id='+props.pigcms_id
            return {
                webUrl
            }
        }
    })
</script>

<style lang="less" scoped>
</style>
