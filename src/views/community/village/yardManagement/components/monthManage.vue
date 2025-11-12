<template>
    <a-modal title="月租车收费规则" :width="1000" :visible="visible" :confirm-loading="confirmLoading"
        @cancel="handleCancel" :footer="null">
        <a-table :columns="columns" :row-key="record=>record.id" :pagination="pageInfo" 
            :loading="tableLoadding" @change="handleTableChange"
            :data-source="monthList">
            <span slot="action" slot-scope="text, record">
                <a @click="$refs.BindModel.list(record.id, record.charge_type,record)">绑定</a>
            </span>
        </a-table>
        <bindList ref="BindModel" @ok="bindOk"/>
    </a-modal>
</template>

<script>
    import villageApi from '@/api/community/village'; 
    import bindList from '../../charge/standard/bindList.vue'
    const columns = [
      {
        title: '收费规则',
        dataIndex: 'charge_txt',
        key: 'charge_txt',
      },
      {
        title: '账单生成周期设置',
        dataIndex: 'bill_create_set_txt',
        key: 'bill_create_set_txt',
      },
      {
        title: '收费标准名称',
        dataIndex: 'charge_name',
        key: 'charge_name',
      },
      {
        title: '收费标准生效时间',
        dataIndex: 'charge_valid_time',
        key: 'charge_valid_time',
      },
      {
        title: '生成账单模式',
        dataIndex: 'bill_type_txt',
        key: 'bill_type_txt',
      },
      // {
      //   title: '绑定费用对象',
      //   dataIndex: 'address',
      //   key: 'address',
      // },
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
                        this.getMonthRuleList()
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
                monthList:[]
            }
        },
        components: {
            bindList
        },

        methods: {
            handleCancel(e) {
                this.$emit('closeManage')
                this.monthList = []
                this.confirmLoading = false;
            },
            
            getMonthRuleList(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getMonthParkRuleList, that.pageInfo).then((res) => {
                    that.monthList = res.list
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
                this.getMonthRuleList()
                console.log('onTableChange==>', page, pageSize)
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getMonthRuleList()
            },
            bindOk(){
                this.getMonthRuleList()
            }
        },
    }
</script>

<style>
</style>
