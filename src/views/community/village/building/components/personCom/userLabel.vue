<template>
    <div class="user_label">
        <div class="label_con" v-for="(item, index) in labelForm.list" :key="index">
            <div class="title">{{item.name}}：</div>
            <div class="radio_con">
                <a-radio-group v-model="valueGroup[index]" @change="radioChange">
                    <a-radio :value="item1.id" v-for="(item1, index1) in item.children" :key="item.value">{{item1.name}}</a-radio>
                </a-radio-group>
            </div>
        </div>
        <a-button style="margin-left: 20px;margin-top: 20px;" type="primary" @click="onSubmit">保存</a-button>
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
            const labelForm = ref({})
            const valueGroup = ref([])
            labelForm.value = props.formParams.label_list
            valueGroup.value = props.formParams.label_list.value
            const radioChange = (value)=>{
                console.log('value===>', value)
            }
            const onSubmit = ()=> {
                console.log('labelForm===>', labelForm.value.value)
            }
            return {
                labelForm,
                onSubmit,
                valueGroup,
                radioChange
            }
        }
    })
</script>

<style lang="less" scoped>
    .user_label{
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
            .radio_con{
                display: flex;
                align-items: center;
                margin-left: 10px;
            }
        }
    }
</style>
