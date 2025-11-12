<template>
    <div class="black_list">
    <div class="worker_order">
        <a-tabs
            default-active-key="baseSet"
            tab-position="left"
            size="large"
            :tab-bar-style="{width:150}"
            @change="tabChange">
            <a-tab-pane v-for="item in tabList" :tab="item.name" :key="item.key">
                <component @toChild="getFlag" @toCustomized="getOpen" @toCommonTabList="getCommonTabList" v-if="currentTab == item.key" :is="item.key"></component>
            </a-tab-pane>
        </a-tabs>
    </div>
    </div>
</template>

<!--{name: '评价设置', key:'remarkSet'}-->

<script>
    import baseSet from './component/baseSet.vue';
    import chargeSet from './component/chargeSet.vue';
    import remarkSet from './component/remarkSet.vue';
    import commentPoint from './component/commentPoint.vue';
    import orderReviewSet from './component/orderReviewSet.vue';
    import supervision from './component/supervision.vue';
    export default {
        name: 'workerSet',
        data(){
            return{
                tabList: [{name: '基本设置', key:'baseSet'}, {name: '收费设置', key:'chargeSet'}],
                currentTab: 'baseSet',
                is_comment_point: 0,
                is_jz_customized_open: 0,
                is_supply_station: 0,
                comment_point_table: [
                    {name: '基本设置', key:'baseSet'},
                    {name: '收费设置', key:'chargeSet'},
                    {name: '评价积分设置', key:'commentPoint'},
                    {name: '评价设置', key:'remarkSet'},
                ],
                default_table: [
                    {name: '基本设置', key:'baseSet'},
                    {name: '收费设置', key:'chargeSet'},
                    {name: '评价设置', key:'remarkSet'},
                ],
                comment_point_and_customized_open_table: [
                    {name: '基本设置', key:'baseSet'}, 
                    {name: '收费设置', key:'chargeSet'},
                    {name: '评价积分设置', key:'commentPoint'},
                    {name: '评价设置', key:'remarkSet'},
                    {name: '转单审批设置', key:'orderReviewSet'},
                    {name: '推送督查室设置', key:'supervision'},
                ],
                customized_open_table: [
                    {name: '基本设置', key:'baseSet'},
                    {name: '收费设置', key:'chargeSet'},
                    {name: '评价设置', key:'remarkSet'},
                    {name: '转单审批设置', key:'orderReviewSet'},
                    {name: '推送督查室设置', key:'supervision'},
                ],
                comment_point_and_customized_open_table1: [
                    {name: '基本设置', key:'baseSet'}, 
                    {name: '收费设置', key:'chargeSet'},
                    {name: '评价积分设置', key:'commentPoint'},
                    {name: '评价设置', key:'remarkSet'},
                    {name: '转单审批设置', key:'orderReviewSet'},
                    {name: '推送督查室设置', key:'supervision'},
                ],
                customized_open_table1: [
                    {name: '基本设置', key:'baseSet'},
                    {name: '收费设置', key:'chargeSet'},
                    {name: '评价设置', key:'remarkSet'},
                    {name: '转单审批设置', key:'orderReviewSet'},
                    {name: '推送督查室设置', key:'supervision'},
                ],
                hasCommentTable: 0,
            }
        },
        
        components: {
            baseSet,
            chargeSet,
            remarkSet,
            commentPoint,
            orderReviewSet,
            supervision
        },
        
        methods: {
            tabChange(e){
                this.currentTab = e
                console.log('e===>', e)
            },
            getCommonTabList(commentTable) {
                console.log('commentTable===>', commentTable)
                this.hasCommentTable = 1
                this.tabList = commentTable;
            },
            getFlag(value){
                if (this.hasCommentTable == 1) {
                    this.hasCommentTable = 1
                } else if (value=='is_comment_point'){
                    this.is_comment_point = 1;
                    this.tabList = this.comment_point_table;
                }else{
                    this.is_comment_point = 0;
                    this.tabList = this.default_table;
                }
            },
            getOpen(value) {
                console.log('getOpen===>', value)
                if (this.hasCommentTable == 1) {
                    this.hasCommentTable = 1
                } else if(value=='is_jz_customized_open'){
                    this.is_jz_customized_open = 1;
                    if (this.is_comment_point == 1) {
                        this.tabList = this.comment_point_and_customized_open_table;
                    } else {
                        this.tabList = this.customized_open_table;
                    }
                } else if(value=='is_jz_customized_open_1'){
                    this.is_jz_customized_open = 1;
                    this.is_supply_station = 1;
                    if (this.is_comment_point == 1) {
                        this.tabList = this.comment_point_and_customized_open_table1;
                    } else {
                        this.tabList = this.customized_open_table1;
                    }
                } else {
                    this.is_jz_customized_open = 0;
                }
            }
        },
        
        mounted() {
            
        }
    }
</script>

<style lang="less" scoped>
    
    .black_list {
        width: 98%;
        background-color: #ffffff;
        margin: 10px;
        display: flex;
        padding-top: 25px;
        .worker_order{
            min-height: 840px;
        }
        /deep/ .ant-tabs-nav-wrap{
            width: 160px;
        }
        /deep/ .ant-tabs .ant-tabs-left-bar .ant-tabs-tab{
            text-align:center;
        }
          
    }
    
</style>