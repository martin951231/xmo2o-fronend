<template>
    <a-modal :title="modelTitle" :width="900" :visible="visible" :footer="null" @cancel="handleCancel">
        <a-table :columns="columns" :row-key="record=>record.id" :pagination="pageInfo"
            :loading="tableLoadding" @change="handleTableChange"
            :data-source="payList">
        </a-table>
    </a-modal>
</template>

<script>
    import villageApi from '@/api/community/village';
	import store from '@/store';
    const columns = [
        {
            title: '车牌号',
            dataIndex: 'car_number',
            key: 'car_number',
        },
        {
            title: store.getters.config.house_name+'名称',
            dataIndex: 'park_name',
            key: 'park_name',
        },
        {
            title: '支付金额',
            dataIndex: 'pay_money',
            key: 'pay_money',
        },
        {
            title: '支付时间',
            dataIndex: 'pay_time',
            key: 'pay_time',
        },
        {
            title: '存储金额',
            dataIndex: 'stored_balance',
            key: 'stored_balance',
        },
    ];
    
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            modelTitle: {
                type: String,
                default: ''
            }
        },
        
        watch:{
            visible: {
                immediate: true,
                handler (val) {
                    if(val){
                        this.getPayList()
                    }
                }
            },
        },
        
        data() {
            return {
                columns,
                confirmLoading: false,
                couponVisible: false,
                detailVisible: true,
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                tableLoadding: false,
                payList: []
            }
        },
       
        methods: {
            handleCancel(e) {
                this.$emit('closeDetail')
            },
            
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getPayList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.pageInfo.pageSize = pageSize
                this.getPayList()
                console.log('onTableChange==>', page, pageSize)
            },
            getPayList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getTemporaryPayList, that.pageInfo).then((res) => {
                    that.payList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                }).catch(e=>{
                    that.tableLoadding = false
                })
            }
        }
    }
</script>

<style>
</style>
