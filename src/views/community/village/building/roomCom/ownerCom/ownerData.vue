<template>
    <div class="container" style="margin: 20px 0">
        <a-tabs :active-key="currentKey" @change="tabChange" tab-position="left">
            <a-tab-pane :key="item.key" v-for="(item, index) in tabList">
                <span slot="tab">{{item.label}}</span>
                <component v-if="currentKey == item.key" :is="item.component" :pigcms_id="pigcms_id" :formParams="formParams" />
            </a-tab-pane>
        </a-tabs>
    </div>
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
    import baseMsg from "../personCom/baseMsg.vue";
    import msgMarker from "../personCom/msgMarker.vue";
    import ownerMsg from "../personCom/ownerMsg.vue";
    import userLabel from "../personCom/userLabel.vue";
    export default defineComponent({
        props: {
            personId: {
                type: [String, Number],
                default: 0
            },
            roomId: {
                type: [String, Number],
                default: ''
            },
			pigcms_id:{
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
            const ruleForm = ref()
            const currentKey = ref(1)
            const tabChange =(key)=>{
                currentKey.value = key
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
                    value: 'msgMarker',
                    label: '信息标注',
                    component: 'msgMarker'
                }, {
                    key: 3,
                    value: 'userLabel',
                    label: '用户标签',
                    component: 'userLabel'
                }
            ])
            
            const formParams = ref({})
            let personStatus = ref(false)
            const getPersonInfo = () => {
                Vue.prototype.request('/community/village_api.Building/getRoomBindUserData', {
                    vacancy_id: props.roomId,
					pigcms_id: props.pigcms_id
                }).then((res) => {
                    formParams.value = res
                })
            }
            watch(()=>props.pigcms_id, val=>{
                if(val){
                    getPersonInfo()
                }
            })
            if(props.pigcms_id){
                getPersonInfo()
            }
            return {
                confirmLoading,
                personStatus,
                getPersonInfo,
                tabList,
                tabChange,
                handleCancel,
                currentKey,
                formParams
            }
        }
    })
</script>

<style lang="less" scoped>
</style>