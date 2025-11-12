<template>
    <div class="bind_wx">
        <div class="container">
            <div class="label">扫描二维码：</div>
            <a-button @click="viewCode" type="link">查看二维码</a-button>
        </div>
        <a-modal title="查看二维码" :width="360" :visible="codeVisible" @cancel="handleCancel" :footer="null">
            <div class="img_view"
                style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                <img :src="codeUrl" style="width:150px; height: 150px;">
            </div>
        </a-modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {
        ref,
        reactive,
        onMounted,
        defineComponent
    } from '@vue/composition-api';
    export default defineComponent({
        name: 'bindWx',
        setup(props, context) {
            onMounted(() => {

            })
            const codeUrl = ref('https://hf.pigcms.com/static/wxapp/images/bill_msg_image_1.png')
            const codeVisible = ref(false)
            const viewCode = () => {
                codeVisible.value = true
            }

            const handleCancel = () => {
                codeVisible.value = false
            }

            return {
                codeVisible,
                viewCode,
                handleCancel,
                codeUrl
            }
        }
    })
</script>

<style lang="less" scoped>
    .bind_wx {
        width: 100%;

        .container {
            display: flex;
            align-items: center;
            justify-content: flex-start;
        }
    }
</style>
