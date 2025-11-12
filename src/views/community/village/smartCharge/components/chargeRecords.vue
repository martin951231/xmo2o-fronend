<template>
    <a-modal
        title="充值明细"
        :visible="visible"
        :width="900"
        :footer="null"
        @cancel="handleCancel">
            <a-table :columns="columns"
            :row-key="record=>record.id"
            :loading="tableLoadding" @change="handleTableChange"
            :data-source="logList">
            </a-table>
    </a-modal>
</template>

<script>
    const columns = [
        {
            title: '订单编号',
            dataIndex: 'order_id',
            key: 'order_id',
        },
        {
            title: '预存时间',
            dataIndex: 'add_time',
            key: 'add_time',
        },
        {
            title: '金额变更前（元）',
            dataIndex: 'current_money',
            key: 'current_money',
        },
        {
            title: '缴费金额（元）',
            dataIndex: 'money',
            key: 'money',
        },
        {
            title: '金额变更后（元）',
            dataIndex: 'after_price',
            key: 'after_price',
        },
        {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
        }
    ];

    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            id: {
                type: [String, Number],
                default: 0
            }
        },
        watch:{
            visible: {
                handler(val){
                    if(val){
                        this.getUserMoneyLog(this.id)
                    }
                },
                immediate: true
            }
        },
        data() {
            return {
                columns,
                pageInfo: {
                    current:1,
                    page:1,
                    limit: 10,
                    pageSize: 10,
                    total:10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100']
                },
                tableLoadding: false,
                logList: [],
            }
        },
        
        methods: {
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getUserMoneyLog()
            },
            getUserMoneyLog(){
                let that = this
                that.tableLoadding = true
                that.pageInfo.id = that.id
                that.request('/community/village_api.Pile/getUserMoneyLog', that.pageInfo).then(res => {
                    that.logList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            handleCancel(){
                this.$emit("close")
            }
        }
    }
</script>

<style lang="less" scoped>
    .recharge_details {
        width: 98%;
        background-color: #ffffff;
        margin: 10px;
    }
    
</style>
