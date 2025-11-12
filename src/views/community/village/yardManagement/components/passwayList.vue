<template>
    <a-modal title="通道列表" :width="1000" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk"
        @cancel="handleCancel" :footer="null">

        <a-table :columns="columns" :row-key="record=>record.id" :pagination="pageInfo" 
            :loading="tableLoadding" @change="handleTableChange"
            :data-source="laneList">
            <span slot="passage_direction" slot-scope="text, record">
                <span>{{record.passage_direction == 0?'出口':record.passage_direction == 1?'入口':'出入口'}}</span>
            </span>
            <span slot="status" slot-scope="text, record">
                <span>{{record.status_txt}}</span>
            </span>
        </a-table>
    </a-modal>

</template>

<script>
    import villageApi from '@/api/community/village';
    const columns = [
      {
        title: '通道名称',
        dataIndex: 'passage_name',
        key: 'passage_name',
      },
      {
        title: '通道号',
        dataIndex: 'channel_number',
        key: 'channel_number',
      },
      {
        title: '通道类型',
        key: 'passage_direction',
        scopedSlots: { customRender: 'passage_direction' },
      },
      {
        title: '通道状态',
        key: 'status',
        scopedSlots: { customRender: 'status' },
      }
    ];
    
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            garage_id:{
                type: String,
                default: ''
            }
        },
        
        watch:{
            garage_id: {
                immediate: true,
                handler (val) {
                    if(this.visible){
                        this.pageInfo.garage_id = val
                        this.getPassageList()
                    }
                }
            },
        },
        
        data() {
            return {
                columns,
                confirmLoading: false,
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 10,
                    total:10,
                    garage_id: '',
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                tableLoadding: false,
                laneList:[]
            }
        },

        methods: {
            handleOk(e) {
                this.confirmLoading = true;
                setTimeout(() => {
                    this.$emit('closePass')
                    this.confirmLoading = false;
                }, 2000);
            },
            handleCancel(e) {
                this.$emit('closePass')
                this.confirmLoading = false;
            },
            
            getPassageList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getPassageList, that.pageInfo).then((res) => {
                    that.laneList = res.list
                    that.pageInfo.total = res.count
                    that.tableLoadding = false
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.pageInfo.pageSize = pageSize
                this.getPassageList()
                console.log('onTableChange==>', page, pageSize)
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getPassageList()
            },
            
            bindThis(record){
                
            }
        },
    }
</script>

<style>
</style>
