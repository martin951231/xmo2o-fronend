<template>
    <div class="shop_list">
        <div class="header_search">
            <div class="search_item">
                <label class="label_title">提现单号：</label>
                <a-input style="width:200px;" placeholder="请输入提现单号" v-model="pageInfo.order_id" />
            </div>
            
            <div class="search_item">
                <label class="label_title">申请人：</label>
                <a-input style="width:200px;" placeholder="请输入申请人" v-model="pageInfo.name" />
            </div>
            
            <div class="search_item">
                <label class="label_title">手机号：</label>
                <a-input style="width:200px;" placeholder="请输入手机号" v-model="pageInfo.phone" />
            </div>
            
            <div class="search_item" style="margin-left: 20px;" v-if="clearTime">
                <label class="label_title">申请时间：</label>
                <a-range-picker @change="ondateChange" />
            </div>
            
            <div class="search_item" style="margin-left: 10px;">
                <a-button type="primary" @click="queryThis()">查询</a-button>
                <a-button style="margin-left: 10px;"  @click="clearThis()">清空</a-button>
            </div>
        </div>
        
        <div class="table_content">
            <a-table :columns="columns"
            :row-key="record=>record.m_id" :pagination="pageInfo"
            :loading="tableLoadding" @change="handleTableChange"
            :data-source="withdrawalList">
                <span slot="refuse_account" slot-scope="text, record">
                    {{record.refundType == 1?'微信':'平台余额'}}
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="lookRecord(record)">查看</a>
                    <a-divider type="vertical" v-if="record.status == 2" />
                    <a v-if="record.status == 2" @click="examineThis(record)">审核</a>
                </span>
            </a-table>
        </div>
        <withdrawalModal :visible="withdrawalVisible" :title="modalTitle" :id="withdrawal_id" @close="closeWithdrawal" />
    </div>
</template>

<script>
    import villageApi from '@/api/community/village';
    import withdrawalModal from "./components/withdrawalModal.vue";
    const columns = [
        {
            title: '提现单号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '申请人',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '真实姓名',
            dataIndex: 'true_name',
            key: 'true_name'
        },
        
        {
            title: '手机号',
            key: 'phone',
            key: 'phone'
        },
        {
            title: '申请时间',
            dataIndex: 'add_time',
            key: 'add_time'
        },
        {
            title: '申请金额',
            dataIndex: 'refund_money',
            key: 'refund_money'
        },
        {
            title: '退款账号',
            dataIndex: 'refund_account',
            key: 'refund_account',
            scopedSlots: {
                customRender: 'refuse_account'
            },
        },
        {
            title: '退款理由',
            dataIndex: 'refund_reason',
            key: 'refund_reason'
        },
        {
            title: '状态',
            dataIndex: 'status_txt',
            key: 'status_txt'
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
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    date: '',
                    m_name: '',
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100']
                },
                tableLoadding: false,
                withdrawal: [],
                frequency: false,
                clearTime: true,
                withdrawal_id: '',
                withdrawalList: [],
                withdrawalVisible: false,
                modalTitle: ''
            }
        },
        
        components: {
            withdrawalModal
        },
        
        activated() {
            this.getWithdrawalList()
        },
        
        // mounted(){
        //     this.getWithdrawalList()
        // },

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
                this.getWithdrawalList()
            },
            clearThis(){
                this.clearTime = false
                let timeout = setTimeout(()=>{
                    this.clearTime = true
                    clearTimeout(timeout)
                }, 10) 
                this.pageInfo = {
                    page: 1,
                    current: 1,
                    limit: 10,
                    pageSize: 10,
                    total: 0,
                    status: '',
                    name: '',
                    phone: '',
                    order_id: '',
                    start_time: '',
                    end_time: ''
                }
                this.getWithdrawalList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.pageInfo.pageSize = pageSize
                this.getWithdrawalList()
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getWithdrawalList()
            },
            
            getWithdrawalList(){
                let that = this
                that.tableLoadding = true
                that.request("/community/village_api.Pile/getWithdrawList", that.pageInfo).then((res) => {
                    that.withdrawalList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            
            ondateChange(date, dateString) {
                this.pageInfo.start_time = [0]
                this.pageInfo.end_time = [1]
                console.log(date, dateString);
            },
            
            lookRecord(record){
                this.withdrawal_id = record.id+''
                this.modalTitle = '查看'
                this.withdrawalVisible = true
            },
            
            examineThis(record){
                this.withdrawal_id = record.id+''
                this.modalTitle = '审核'
                this.withdrawalVisible = true
            },
            
            closeWithdrawal(flag){
                this.withdrawalVisible = false
                if(flag){
                    this.getWithdrawalList()
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .shop_list {
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
                margin-left: 10px;
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
