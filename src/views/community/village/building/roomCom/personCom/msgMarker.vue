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
            },
            pigcms_id: {
                type: [String, Number],
                default: ''
            }
        },
        setup(props, context) {
            const ownerForm = ref({})
            const partyId = ref('')
            let delayPost = ref(false)
            ownerForm.value = props.formParams.mark_list
            const selectChange = (value) => {
                console.log('value===>', value)
                console.log('partyId===>', partyId.value)
            }
            const onSubmit = ()=> {
                if(delayPost.value){
                    Vue.prototype.$message.warn('正在提交中，请稍等...')
                    return
                }
                delayPost.value = true
                let resultParams = {}
                ownerForm.value.map((item, index)=>{
                    resultParams[item.field] = item.data.value
                })
                if(resultParams.user_political_affiliation == 1){
                    resultParams['user_party_id'] = partyId.value
                } else {
                    resultParams['user_party_id'] = 0
                }
                resultParams['pigcms_id'] = props.pigcms_id
                Vue.prototype.request('/community/village_api.Building/subStreetPartyBindUser', resultParams).then((res) => {
                    delayPost.value = false
                    Vue.prototype.$message.success('保存成功！')
                }).catch(e=>{
                    delayPost.value = false
                })
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
