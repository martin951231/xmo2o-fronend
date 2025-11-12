<template>
    <a-modal
        title="添加人员"
        :visible="visible"
        :width="950"
        :confirm-loading="confirmLoading"
        :footer="null"
        @cancel="handleCancel">
        <a-tabs :default-active-key="currentIndex" @change="tabChange">
            <a-tab-pane :key="item.key" v-for="(item, index) in tabList">
                <span slot="tab">{{item.label}}</span>
                <component v-if="currentIndex == item.key" :is="item.component" :formParams="formParams" />
            </a-tab-pane>
        </a-tabs>
    </a-modal>
</template>

<script>
    import Vue from 'vue';
    import moment from 'moment';
    import {
        ref,
        watch,
        onMounted,
        nextTick,
        defineComponent
    } from '@vue/composition-api';
    import villageNew from "@/api/community/village/villageNewApi";
    import baseMsg from "./personCom/baseMsg.vue";
    import msgMarker from "./personCom/msgMarker.vue";
    import ownerMsg from "./personCom/ownerMsg.vue";
    import userLabel from "./personCom/userLabel.vue";
    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            personId: {
                type: [String, Number],
                default: 0
            },
            roomId: {
                type: [String, Number],
                default: ''
            }
        },
        components: {
            baseMsg,
            msgMarker,
            ownerMsg,
            userLabel  
        },
        setup(props, context){
            const confirmLoading = ref(false)
            const personForm = ref({})
            const ruleForm = ref()
            const currentIndex = ref(1)
            const tabChange =(key)=>{
                currentIndex.value = key
            }
            const handleCancel = ()=>{
                context.emit('close')
            }
            const tabList = ref([
                {
                    key: 1,
                    value: 'baseMsg',
                    label: '基本信息',
                    component: 'baseMsg'
                }, {
                    key: 2,
                    value: 'ownerMsg',
                    label: '业主资料',
                    component: 'ownerMsg'
                }, {
                    key: 3,
                    value: 'msgMarker',
                    label: '信息标注',
                    component: 'msgMarker'
                }, {
                    key: 4,
                    value: 'userLabel',
                    label: '用户标签',
                    component: 'userLabel'
                }
            ])
            
            const formParams = ref({})
            
            let personStatus = ref(false)
            
            const getPersonInfo = () => {
                console.log("context.roomId===>", props.roomId)
                Vue.prototype.request('/community/village_api.Building/getRoomBindUserData', {
                    vacancy_id: props.roomId
                }).then((res) => {
                    personForm.value = res
                })
            }
            
            watch(() => props.visible, (val) => {
                if(val){
                    getPersonInfo()
                }
            }, {
                deep: true
            })
            
            return {
                confirmLoading,
                personForm,
                personStatus,
                getPersonInfo,
                tabList,
                tabChange,
                handleCancel,
                currentIndex,
                formParams
            }
        }
    })
</script>

<style>
</style>