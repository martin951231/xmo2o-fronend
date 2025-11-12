<template>
    <div class="user_wallet_balance">
        <div class="header_search">
            <div class="search_item">
                <label class="label_title">姓名：</label>
                <a-input style="width:200px;" placeholder="请输入姓名" v-model="pageInfo.name" />
            </div>
            
            <div class="search_item" style="margin-left: 20px;">
                <label class="label_title">手机号：</label>
                <a-input style="width:200px;" placeholder="请输入手机号" v-model="pageInfo.phone" />
            </div>
            
            <div class="search_item" style="margin-left: 20px;">
                <label class="label_title">充电卡号：</label>
                <a-input style="width:200px;" placeholder="请输入充电卡号" v-model="pageInfo.card_no" />
            </div>
            
            <div class="search_item" style="margin-left: 10px;">
                <a-button type="primary" @click="queryThis()">查询</a-button>
                <a-button style="margin-left: 10px;"  @click="clearThis()">清空</a-button>
            </div>
        </div>
        
        <div class="header_search" style="padding-top: 0;">
            <a-button type="primary" @click="addThis">提现须知</a-button>
        </div>
        
        <div class="table_content">
            <a-table :columns="columns" 
            :row-key="record=>record.uid" :pagination="pageInfo"
            :loading="tableLoadding" @change="handleTableChange"
            :data-source="balanceList">
                <span slot="action" slot-scope="text, record">
                    <a @click="editCardNo(record)">编辑充电卡号</a>
                    <a-divider type="vertical" />
                    <a @click="viewRechargeDetails(record)">充值明细</a>
                    <a-divider type="vertical" />
                    <a @click="viewChargeRecord(record)">充电记录</a>
                    <a-divider type="vertical" />
                    <a @click="viewWithdrawalMoney(record)">提现</a>
                </span>
            </a-table>
        </div>
        <editCard :visible="showEditcard" :id="user_id" @close="closeEditCard" />
        <rechargeDetails :visible="showRechargeDetails" :id="user_id" @close="closeRecharge" />
        <chargeRecords :visible="showChargeRecords" :id="user_id" @close="closeRecharge" />
        <noticeOnCash :visible="noticeVisible" :id="user_id" @close="closeRecharge" />
        <withdrawalMoney :visible="showWithdrawalMoney" :id="user_id" @close="closeRecharge" :userInfo="userInfo" />
    </div>
</template>

<script>
    import villageApi from '@/api/community/village';
    import editCard from "./components/editCard.vue";
    import rechargeDetails from "./components/rechargeDetails.vue";
    import chargeRecords from "./components/chargeRecords.vue";
    import noticeOnCash from "./components/noticeOnCash.vue";
    import withdrawalMoney from "./components/withdrawalMoney.vue";
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: '物理卡号',
            dataIndex: 'card_no',
            key: 'card_no'
        },
        {
            title: '逻辑卡号',
            dataIndex: 'pile_card_no',
            key: 'pile_card_no'
        },
        {
            title: '钱包余额（元）',
            dataIndex: 'current_money',
            key: 'current_money'
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];

    export default {
        data() {
            return {
                columns,
                showEditcard: false,
                noticeVisible: false,
                modelTitle: '',
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total: 10,
                    name: '',
                    phone: '',
                    card_no: '',
                    limit: 10,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条` // 显示总数
                },
                tableLoadding: false,
                user_id: '',
                balanceList: [],
                frequency: false,
                showRechargeDetails: false,
                showChargeRecords: false,
                showWithdrawalMoney: false,
                userInfo: {}
            }
        },
        
        components: {
            editCard,
            rechargeDetails,
            chargeRecords,
            noticeOnCash,
            withdrawalMoney
        },
        
        mounted(){
            this.getBalanceList()
        },

        methods: {
            queryThis(){
                if(this.frequency) {
                    this.$message.warn('请求频繁，请稍后再试')
                    return
                }
                this.frequency = true
                let timeout = setTimeout(()=>{
                    this.frequency = false
                    clearTimeout(timeout)
                }, 2000)
                this.pageInfo.page = 1
                this.getBalanceList()
            },
            clearThis(){
                this.pageInfo = {
                    page: 1,
                    current: 1,
                    pageSize: 10,
                    total: 0,
                    limit: 10,
                    name: '',
                    phone: '',
                    card_no: ''
                }
                this.getBalanceList()
            },
            
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.pageInfo.limit = pagenation.pageSize
                this.getBalanceList()
            },
            
            getBalanceList(){
                let that = this
                that.tableLoadding = true
                that.request('/community/village_api.Pile/getUserMoneyList ', that.pageInfo).then((res) => {
                    that.balanceList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            
            editCardNo(record){
                console.log("record_id", record)
                this.user_id = record.uid+''
                this.showEditcard = true
            },
            
            viewRechargeDetails(record){
                this.user_id = record.uid+''
                this.showRechargeDetails = true
            },
            
            viewChargeRecord(record){
                console.log('record===>', record)
                this.$router.push({path:"/village/smartCharge/chargeOrderList", query: {uid: record.uid}})
                // this.user_id = record.uid+''
                // this.showChargeRecords = true
            },
            
            viewWithdrawalMoney(record){
                this.user_id = record.uid+''
                this.userInfo = record
                this.showWithdrawalMoney = true
            },
            
            closeEditCard(flag){
                this.user_id = ''
                this.userInfo = {}
                this.showEditcard = false
                if(flag){
                    this.getBalanceList()
                }
            },
            
            closeRecharge(){
                this.user_id = ''
                this.showRechargeDetails = false
                this.showChargeRecords = false
                this.noticeVisible = false
                this.showWithdrawalMoney = false
            },
            
            addThis(){
                this.noticeVisible = true
            }
        },
    }
</script>

<style lang="less" scoped>
    .user_wallet_balance {
        width: 98%;
        background-color: #ffffff;
        margin: 10px;

        .header_search {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            display: flex;

            .search_item {
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }
            
            .operation_btn{
                margin-left: 20px;
            }
        }

        .table_content {
            padding: 0 20px;
            margin: 10px 0;
        }
    }
    
</style>
