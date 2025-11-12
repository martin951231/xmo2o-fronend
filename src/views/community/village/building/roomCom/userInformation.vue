<template>
    <div>
        <a-page-header
            v-if="ownerObj.is_person"
            style="border: 1px solid rgb(235, 237, 240)"
            :title="userInfo.name"
            sub-title="业主">
            <template slot="footer">
                <a-tabs :default-active-key="currentKey" @change="changeTab">
                    <a-tab-pane :key="item.key" v-for="(item, index) in roomParams.user_type_list">
                        <span slot="tab">{{item.value}}</span>
                        <component v-if="currentKey == item.key" :is="item.key" :username="userInfo.name" :pigcms_id="pigcms_id" :roomId="roomId"></component>
                    </a-tab-pane>
                </a-tabs>
            </template>
            <div class="content" style="display: flex;align-items: center">
                <img style="width: 90px;margin: 0;padding: 0;border: 0;" :src="userInfo.avatar" alt="">
                <div class="main" style="margin-left: 15px;">
                    <a-descriptions size="small" :column="3">
                        <a-descriptions-item v-for="(item, index) in ownerObj.user_field_list" :label="item.label">
                            {{item.value?item.value:'暂无'}}
                        </a-descriptions-item>
                    </a-descriptions>
                </div>
                <div class="extra">
                    <div :style="{
                        display: 'flex',
                        width: 'max-content',
                        justifyContent: 'flex-end'}">
                    </div>
                </div>
            </div>
        </a-page-header>
        
        <div v-else style="display: flex; align-items: center; justify-content:center; flex-direction: column;">
            <div>该{{$store.getters.config.room_name}}无人员</div>
            <!-- <a-button type="primary" style="margin-top: 15px;" @click="addPerson">添加人员</a-button>
            <iframe name="myiframe" id="myrame" :src="ownerObj.add_jump_url+'&from_type=1'" frameborder="0"  width="1370" height="750">
                <p>你的浏览器不支持iframe标签</p>
            </iframe> -->
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        watch,
        reactive,
        onMounted,
        onUpdated,
        defineComponent
    } from '@vue/composition-api';
    import ownerCard from "./ownerCom/ownerCard.vue";
    import ownerData from "./ownerCom/ownerData.vue";
    import ownerFace from "./ownerCom/ownerFace.vue";
    import ownerMark from "./ownerCom/ownerMark.vue";
    import ownerType from "./ownerCom/ownerType.vue";
    import ownerFamily from "./ownerCom/ownerFamily.vue";
    import ownerTrajectory from "./ownerCom/ownerTrajectory.vue";
    import ownerForm from "./ownerCom/ownerForm.vue";
    import ownerExpress from "./ownerCom/ownerExpress.vue";
    import ownerChat from "./ownerCom/ownerChat.vue";
    export default defineComponent({
        props: {
            roomParams: {
                type: Object,
                default: ()=>{return {}}
            },
            roomId: {
                type: [String, Number],
                defalut: ''
            }
        },
        components: {
            ownerCard,
            ownerData,
            ownerFace,
            ownerMark,
            ownerType,
            ownerFamily,
            ownerTrajectory,
            ownerForm,
            ownerExpress,
            ownerChat
        },
        
        setup(props, context) {
            let currentKey = ref('')
            currentKey.value = props.roomParams.user_type_list[0].key
            const ownerObj = ref({})
            const userInfo = ref({})
            const pigcms_id = ref(0)
            const changeTab = (key) => {
                currentKey.value = key
            }
            const getOwner = () =>{
                Vue.prototype.request('/community/village_api.Building/getRoomBindOwnerData', {vacancy_id: props.roomId}).then((res) => {
                    ownerObj.value = res
                    userInfo.value = res.user_info
                    pigcms_id.value = res.user_info.pigcms_id
					context.emit('getRoomAddress', res.room_address)
                    if(!ownerObj.value.is_person){
                        context.emit('hideUserTab')
                    }
                })
            }
            const addPerson = () => {
                window.location.href = ownerObj.value.add_jump_url
            }
            getOwner()
            return{
                currentKey,
                changeTab,
                getOwner,
                ownerObj,
                userInfo,
                pigcms_id,
                addPerson
            }
        }
    })
</script>

<style lang="less" scoped>
    
</style>