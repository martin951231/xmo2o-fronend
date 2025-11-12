<template>
    <div class="owner_msg">
        <div class="label_con" v-for="(item, index) in ownerForm" :key="index">
            <div class="title">{{item.label}}：</div>
            <div class="checkbox_con">
                <a-checkbox-group>
                    <a-checkbox v-for="(item1, index1) in item.value">{{item1.value}}</a-checkbox>
                </a-checkbox-group>
            </div>
        </div>
        <a-button v-if="ownerForm.length>0" style="margin-left: 20px;margin-top: 20px;" type="primary" @click="onSubmit">保存</a-button>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        watch,
        onMounted,
        nextTick,
        defineComponent
    } from '@vue/composition-api';
    import villageNew from "@/api/community/village/villageNewApi";
    export default defineComponent({
        props: {
            formParams: {
                type: Object,
                default: ()=>{return {}}
            }
        },
        setup(props, context) {
            const ownerForm = ref({})
            ownerForm.value = props.formParams.mark_list
            const onSubmit = ()=> {
                console.log('ownerForm===>', ownerForm.value)
            }
            return {
                ownerForm,
                onSubmit
            }
        }
    })
</script>

<style lang="less" scoped>
    .owner_msg{
        .label_con{
            margin-top: 20px;
            display: flex;
            align-items: center;
            margin-left: 20px;
            &:nth-child(1){
                margin-top: 0;
            }
            .title{
                font-weight: bold;
            }
            .checkbox_con{
                display: flex;
                align-items: center;
                margin-left: 10px;
            }
        }
    }
</style>
