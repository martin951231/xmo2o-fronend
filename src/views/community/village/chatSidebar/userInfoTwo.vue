<template>
    <div class="user_info">
        <div>
            <a-tabs type="card" @change="callback">
                <a-tab-pane :key="index" :tab="item" :value="item.id" v-for="(item,index) in tab_list">
                </a-tab-pane>
            </a-tabs>
        </div>
        <div class="tab_components">
            <component v-if="visible" :is="currentTab" :pigcmsId="params.pigcms_id*1" :roomId="params.room_id*1" :roomKey="params.room_key"
                :villageId="village_id"></component>
        </div>
    </div>
</template>
<script>
    import payableOrderList from './payableOrderList'
    import receivableOrderList from './receivableOrderList'
    import auditInformation from './auditInformation'
    import materialManagement from './materialManagement'
    import trackInformation from './trackInformation'
    import ownerInformation from './ownerInformation'
    import workOrder from './workOrder'
    import chatRecord from './chatRecord'
    import decorationOrder from './decorationOrder'
    import expressManagement from './expressManagement'
    import depositManagement from '../charge/cashier/receivableOrderList'
    import villageApi from '@/api/community/village'

    export default {
        name: 'userInfo',
        components: {
            payableOrderList,
            trackInformation,
            ownerInformation,
            workOrder,
            chatRecord,
            decorationOrder,
            expressManagement,
            depositManagement,
            receivableOrderList,
            auditInformation,
            materialManagement
        },
        props: {
            params: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        watch: {
            params: {
                immediate: true,
                handler(newVal, oldVal) {
                    if (newVal.room_id) {
                        this.getUserInfo(newVal)
                    }
                }
            }
        },
        data() {
            return {
                visible: false,
                tab_list: [],
                bind_id: 0,
                village_id: 0,
                uid: 0,
                currentTab: 'payableOrderList'
            }
        },
        methods: {
            callback(key) {
                this.currentTab = key
            },

            getUserInfo(params) {
                params.pingcms_id = params.pigcms_id
                this.request(villageApi.getCommunityUserInfo, params)
                    .then((res) => {
                        if(params.pigcms_id){
                            this.village_id = res.userInfo.village_id
                            this.uid = res.userInfo.uid
                        }
                        this.room_id = params.room_id
                        this.tab_list = res.tab_list
                        this.visible = true
                    })
            }
        }
    }
</script>
<style>
    .statistical_data {
        margin: 20px 20px;
        padding: 14px 0;
        text-align: center;
        background-color: #eee;
        font-size: 14px;
    }

    .statistical_fir_p {
        font-size: 16px;
    }

    .statistical_data p {
        margin: 0 0;
    }

    .is_wx {
        font-size: 12px;
        color: #0BB20C;
        padding: 0 5px;
    }

    .community_name {
        padding: 0 5px;
    }

    .edit_btn {
        padding: 0 5px;
        cursor: pointer;
    }

    .user_info {
        margin-top: 10px;
    }
</style>
