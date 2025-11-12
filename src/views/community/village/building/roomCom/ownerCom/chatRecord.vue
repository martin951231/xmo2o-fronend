<template>
    <div>
        <div v-if="empty === false" class="chatRecord" ref="chatRecord" id="chatRecord">
            <a-tabs type="card" @change="callback">
                <a-tab-pane :key="1" :tab="tabTitle">
                    <chatRecordDetail v-if="tabKey === 1" ref="chatRecordDetail" :chatType="type" :uid="pigcms_id*1"/>
                </a-tab-pane>
                <a-tab-pane :key="2" :tab="tabGroupTitle">
                    <chatRecordDetail v-if="tabKey === 2" ref="chatRecordDetail" :chatType="type" :uid="pigcms_id*1"/>
                </a-tab-pane>
            </a-tabs>
        </div>
        <a-empty :image="simpleImage" v-if="empty" class="empty">
            <span slot="description">暂无数据</span>
        </a-empty>
    </div>
</template>
<script>
    import {
        Empty
    } from 'ant-design-vue'
    import chatRecordDetail from '../../../chatSidebar/chatRecordDetail.vue'

    export default {
        name: 'chatRecord',
        components: {
            chatRecordDetail
        },
        data() {
            return {
                simpleImage: '',
                tabTitle: '',
                tabGroupTitle: '',
                type: 'single',
                tabKey: 1,
                empty: false,
                pigcms_id: 0
            }
        },
        created() {
            let recorParams = this.$route.query
            this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
            this.tabTitle = '与' + recorParams.name + '聊天记录'
            this.tabGroupTitle = '与' + recorParams.name + '所在群聊天记录'
            this.pigcms_id = recorParams.pigcms_id + ''
        },
        methods: {
            callback(value) {
                this.tabKey = value
                if (value === 2) {
                    this.type = 'group'
                } else {
                    this.type = 'single'
                }
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

    .tab_list {
        padding: 14px 0;
        text-align: center;
        font-size: 14px;
        border: 1px solid #ccc;
    }
    .chatRecord {
        height: 500px;
    }
</style>
