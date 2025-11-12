<template>
    <a-drawer title="领取记录" :width="900" :visible="visible" :footer="null" @close="handleCancel">
        <a-table :columns="columns" :row-key="record=>record.id" :pagination="pageInfo"
            :loading="tableLoadding" @change="handleTableChange"
            :data-source="accessList">
        </a-table>
    </a-drawer>
</template>

<script>
    import villageApi from '@/api/community/village';
    const columns = [
        {
            title: '领取人',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: '领取时间',
            dataIndex: 'add_time',
            key: 'add_time',
        },
        {
            title: '车牌号',
            dataIndex: 'car_number',
            key: 'car_number',
        }
    ];
    
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            
            coupons_id: {
                type: String,
                default: ''
            }
        },
        
        watch:{
            coupons_id: {
                immediate: true,
                handler (val) {
                    this.pageInfo.coupons_id = val
                    this.getAccessList()
                }
            },
        },
        
        data() {
            return {
                columns,
                confirmLoading: false,
                couponVisible: false,
                modelTitle: '',
                detailVisible: true,
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    coupons_id: '',
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                tableLoadding: false,
                accessList: []
            }
        },

        methods: {
            handleCancel(e) {
                this.$emit('closeDetail')
            },
            
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getAccessList()
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.pageInfo.pageSize = pageSize
                this.getAccessList()
                console.log('onTableChange==>', page, pageSize)
            },
            getAccessList(){
                let that = this
                if(that.pageInfo.coupons_id){
                    that.tableLoadding = true
                    that.request(villageApi.getInParkList, that.pageInfo).then((res) => {
                        that.accessList = res.list
                        that.pageInfo.total = res.count
                        that.tableLoadding = false
                    }).catch(e=>{
                        that.tableLoadding = false
                    })
                }
            }
        }
    }
</script>

<style>
</style>
