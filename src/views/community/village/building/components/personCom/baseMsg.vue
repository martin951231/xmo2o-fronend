<template>
    <a-form-model ref="ruleForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <div class="form_con" style="display: flex;flex-wrap: wrap;">
            <a-form-model-item :label="item.title" v-for="(item, index) in baseForm" :key="index" style="width: 33.3%;">
                <!-- 文本 -->
                <div class="form_item" v-if="item.type == 1">
                    <a-input :disabled="item.is_disabled" style="width: 200px;" v-model="baseForm[index].value" :placeholder="'请输入'+item.title" />
                </div>
                <!-- 单选 -->
                <div class="form_item" v-if="item.type == 2">
                    <a-select :disabled="item.is_disabled" v-model="baseForm[index].value" :placeholder="'请选择'+item.title" style="width: 200px;">
                        <a-select-option v-for="(item1, index2) in item.use_field" :value="item1">{{item1}}</a-select-option>
                    </a-select>
                </div>
                <!-- 籍贯 -->
                <div class="form_item" v-if="item.type == 3">
                    <a-input :disabled="item.is_disabled" v-model="baseForm[index].value" style="width: 200px;" :placeholder="'请输入'+item.title" />
                </div>
                <!-- 日期 -->
                <div class="form_item" v-if="item.type == 4">
                    <a-date-picker :disabled="item.is_disabled" v-if="baseForm[index].value" :default-value="moment(baseForm[index].value, 'YYYY-MM-DD')" style="width: 200px;" :placeholder="'请选择'+item.title" format="YYYY-MM-DD" />
                    <a-date-picker :disabled="item.is_disabled" v-else style="width: 200px;" :placeholder="'请选择'+item.title" format="YYYY-MM-DD" />
                </div>
            </a-form-model-item>
        </div>
        <a-form-model-item v-if="baseForm" :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="onSubmit">保存</a-button>
        </a-form-model-item>
    </a-form-model>
</template>

<script>
    import moment from 'moment';
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
            const labelCol = ref({
                span: 6
            })
            const wrapperCol = ref({
                span: 14
            })
            const baseForm = ref([])
            baseForm.value = props.formParams.field_list
            const rules = ref({})
            const ruleForm = ref()
            watch(()=>props.formParams, val=>{
                baseForm.value = val.field_list
            })
            const onSubmit = ()=> {
                let flag = false
                let resultParams = []
                baseForm.value.map(item=>{
                    if(item.is_must && !item.value){
                        flag = true
                    }
                    resultParams.push({
                        key: item.key,
                        value: item.value
                    })
                })
                console.log('resultParams===>', resultParams)
                if(flag){
                    console.log('val===>')
                }
            }
            const resetForm = () => {
                ruleForm.value.resetFields();
            }
            return {
                labelCol,
                wrapperCol,
                baseForm,
                rules,
                onSubmit,
                resetForm,
                moment
            }
        }
    })
</script>

<style lang="less" scoped>
    /deep/ textarea {
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
</style>
