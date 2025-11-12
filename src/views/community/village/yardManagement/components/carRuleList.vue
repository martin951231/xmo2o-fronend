<template>
    <a-drawer title="收费标准列表" :width="800" :visible="visible" @close="handleCancel" >
        <a-table :columns="columns" :row-key="record=>record.id" :pagination="pageInfo" 
            :loading="tableLoadding" @change="handleTableChange"
            :data-source="monthList">
            <span slot="action" slot-scope="text, record">
                <a-popconfirm title="确定要绑定该项吗?" v-if="record.status_txt!=1" ok-text="是" cancel-text="否" @confirm="bind(record)"
                              @cancel="bindCancel">
                        <a style="color: red;">绑定</a>
                    </a-popconfirm>
                <a-popconfirm title="确定要将该项解除绑定吗?" v-if="record.status_txt==1" ok-text="是" cancel-text="否" @confirm="unbind(record)"
                              @cancel="bindCancel">
                        <a style="color: dodgerblue;">解绑</a>
                    </a-popconfirm>
            </span>
        </a-table>
    </a-drawer>
</template>

<script>
    import villageApi from '@/api/community/village';
    const columns = [
      {
        title: '收费标准名称',
        dataIndex: 'charge_name',
        key: 'charge_name',
      },
      {
         title: '生效时间',
         dataIndex: 'charge_valid_time',
         key: 'charge_valid_time',
      },
        {
            title: '收费标准类型',
            dataIndex: 'fees_type_txt',
            key: 'fees_type_txt',
        },
      {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
      },
    ];
    
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            type_id:{
                type: String,
                default: ''
            },
            park_sys_type:{
                type: String,
                default: ''
            },
            garage_id:{
                type: String,
                default: ''
            },
        },
        watch: {
            visible: {
                immediate: true,
                handler (val) {
                        
                }
            },
            type_id:{
                immediate: true,
                handler (val) {
                    if(this.visible) {
                        this.pageInfo.type_id = val
                        this.getChargeCarType()
                    }
                } 
            }
        },
        data() {
            return {
                columns,
                confirmLoading: false,
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 20,
                    total:20,
                    type_id: '',
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                tableLoadding: false,
                monthList:[]
            }
        },
        components: {
            
        },

        methods: {
            handleCancel(e) {
                this.$emit('closeCarRule')
                this.monthList = []
            },

            getChargeCarType(){
                let that = this
                that.tableLoadding = true
                that.pageInfo.garage_id=this.garage_id
                that.request(villageApi.getChargeCarType,that.pageInfo).then((res) => {
                    console.log('cartype11',res)
                    that.monthList= res.list
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
                this.getChargeCarType()
                console.log('onTableChange==>', page, pageSize)
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getChargeCarType()
            },
            bindCancel(){
            },
            bind(record){
                let that = this
                that.tableLoadding = true
                let type_id=that.pageInfo.type_id
                let rule_id=record.id
                that.request(villageApi.addChargeCarType,{type_id,rule_id,garage_id:this.garage_id}).then((res) => {
                    that.$message.success('绑定成功！')
                    that.getChargeCarType()
                    that.tableLoadding = false
                }).catch(e=>{
                    that.tableLoadding = false
                })   
            },
            unbind(record){
                let that = this
                that.tableLoadding = true
                let type_id=that.pageInfo.type_id
                let rule_id=record.id
                that.request(villageApi.delChargeCarType,{type_id,rule_id,garage_id:this.garage_id}).then((res) => {
                    that.$message.success('解绑成功！')
                    that.getChargeCarType()
                    that.tableLoadding = false
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
        },
    }
</script>

<style>
</style>
