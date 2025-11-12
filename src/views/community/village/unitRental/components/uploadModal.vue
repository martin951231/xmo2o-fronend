<template>
    <a-modal title="导入向导" :width="600" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk"
        @cancel="handleCancel">
        <a-tabs :default-active-key="1">
            <a-tab-pane :key="1" tab="导入操作">
                <a-upload name="file" :multiple="true" action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    :headers="headers" @change="handleChange">
                    <a-button>
                        <a-icon type="upload" /> 点击上传
                    </a-button>
                </a-upload>
            </a-tab-pane>
            <a-tab-pane :key="2" tab="导入日志">
                导入日志
            </a-tab-pane>
        </a-tabs>
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        watch,
        reactive,
        onMounted,
        nextTick,
        defineComponent
    } from '@vue/composition-api';
    import villageNew from "@/api/community/village/villageNewApi";
    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            upload_type: {
                type: [String, Number],
                default: 0
            }
        },

        setup(props, context) {
            let confirmLoading = ref(false)
            let currentIndex = ref(0)
            const handleOk = () => {
                context.emit('exit', true)
            }

            const handleCancel = () => {
                context.emit('exit', false)
            }

            const callback = (e) => {
                currentIndex.value = e
            }

            const headers = reactive({
                authorization: 'authorization-text'
            })

            const handleChange = (info) => {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    Vue.prototype.$message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    Vue.prototype.$message.error(`${info.file.name} file upload failed.`);
                }
            }

            watch(() => props.visible, (val) => {

            }, {
                deep: true
            })

            return {
                handleOk,
                handleCancel,
                callback,
                confirmLoading,
                headers,
                handleChange,
                currentIndex
            }
        }
    })
</script>

<style lang="less" scoped>
</style>
