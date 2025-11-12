<template>
    <div class="owner_msg">
        <div class="label_con" v-for="(item, index) in ownerForm" :key="index">
            <div class="title">{{item.label}}：</div>
            <div class="choose_con" v-if="item.type == 1" style="display: flex;align-items: center;">
                <a-radio-group v-model="ownerForm[index].data.value">
                    <a-radio v-for="(item1, index1) in item.value" :value="item1.label">{{item1.value}}</a-radio>
                </a-radio-group>
                <a-select v-model="partyId" v-if="ownerForm[index].data.value == 1" placeholder="请选择党支部" style="width: 200px; margin-left: 5px;" @change="selectChange">
                    <a-select-option v-for="(item1, index1) in item.data.street_party_branch" :value="item1.id">{{item1.name}}</a-select-option>
                </a-select>
            </div>
            <div class="choose_con" v-if="item.type == 0">
                <a-checkbox-group v-model="ownerForm[index].data.value">
                    <a-checkbox :value="item1.label+''" v-for="(item1, index1) in item.value">{{item1.value}}</a-checkbox>
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
            }
        },
        setup(props, context) {
            const ownerForm = ref({})
            const partyId = ref('')
            ownerForm.value = props.formParams.mark_list
            const selectChange = (value) => {
                console.log('value===>', value)
                console.log('partyId===>', partyId.value)
            }
            const onSubmit = ()=> {
                console.log('ownerForm===>', ownerForm.value)
                let resultParams = []
                ownerForm.value.map((item, index)=>{
                    if(item.type == 1 && item.data.value == 1){
                        resultParams.push({
                            partyId: partyId.value,
                            key: item.field,
                            value: item.data.value
                        })
                    } else {
                        resultParams.push({
                            key: item.field,
                            value: item.data.value
                        })
                    }
                })
                console.log('resultParams===>', resultParams)
            }
            return {
                ownerForm,
                onSubmit,
                partyId,
                selectChange
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
            .choose_con{
                display: flex;
                align-items: center;
                margin-left: 10px;
            }
        }
    }
</style>
