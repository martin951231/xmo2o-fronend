<template>
    <div class="user_label">
        <div class="label_con" v-for="(item, index) in labelForm.list" :key="index">
            <div class="title">{{item.name}}：</div>
            <div class="radio_con">
                <a-checkbox-group v-model="labelForm.list[index].value" @change="radioChange">
                    <a-checkbox :value="item1.id*1" v-for="(item1, index1) in item.children" :key="item1.id">{{item1.name}}</a-checkbox>
                </a-checkbox-group>
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
            },
            pigcms_id: {
                type: [String, Number],
                default: ''
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
            let delayPost = ref(false)
            const onSubmit = ()=> {
                let params = []
                labelForm.value.list.map(v=>{
                    params = [...params, ...v.value]
                })
                if(delayPost.value){
                    Vue.prototype.$message.warn('正在提交中，请稍等...')
                    return
                }
                delayPost.value = true
                let resultParams = {
                    pigcms_id: props.pigcms_id,
                    user_label_groups: params
                }
                Vue.prototype.request('/community/village_api.Building/subBindUserLabel', resultParams).then((res) => {
                    delayPost.value = false
                    Vue.prototype.$message.success('保存成功！')
                }).catch(e=>{
                    delayPost.value = false
                })
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
