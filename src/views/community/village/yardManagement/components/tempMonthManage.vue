<template>
    <a-drawer title="停车卡类" :width="1000" :visible="visible" @close="handleCancel" >
        <a-table :columns="columns" :row-key="record=>record.car_type_id" :pagination="pageInfo" 
            :loading="tableLoadding" @change="handleTableChange"
            :data-source="monthList">
            <span slot="action" slot-scope="text, record">
                <a @click="ruleThis(record)">绑定收费标准</a>
                <a-divider type="vertical" v-if="record.car_type_id>8&&record.car_type_id<17"/>
                <a @click="typeThis(record)" v-if="record.car_type_id>8&&record.car_type_id<17">绑定车牌类型</a>
            </span>
        </a-table>
        <carRule :type_id="type_id"  :garage_id="garage_id" :visible="carRuleVisible" @closeCarRule="closeCarRule"/>
        <carType :type_id="type_id" :garage_id="garage_id" :visible="carTypeVisible" @closeCarRule="closeCarType"/>
    </a-drawer>
</template>

<script>
    import villageApi from '@/api/community/village'; 
    import carRule from './carRuleList';
    import carType from './carTypeList';
    const columns = [
      {
        title: '停车卡类',
        dataIndex: 'car_type',
        key: 'car_type',
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
            garage_id:{
                type: [ String , Number ],
                default: ''
            },
            park_sys_type:{
                type: String,
                default: ''
            }
        },
        watch: {
            visible: {
                immediate: true,
                handler (val) {
                    if (this.park_sys_type.includes('A11')) {
                        this.getA11CarType()
                    } 
                }
            }
        },
        data() {
            return {
                columns,
                confirmLoading: false,
                carRuleVisible:false,
                carTypeVisible:false,
                type_id:'',
                pageInfo: {
                    current:1,
                    page:1,
                    pageSize: 20,
                    total:20,
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
            carRule,
            carType
        },

        methods: {
            handleCancel(e) {
                this.$emit('closeTempManage')
                this.monthList = []
            },
            ruleThis(record){
                this.type_id = record.car_type_id+''
                this.carRuleVisible = true  
            },
            typeThis(record){
                this.type_id = record.car_type_id+''
                this.carTypeVisible = true
            },
            closeCarRule(){
                this.type_id = ''
                this.carRuleVisible = false
            },
            closeCarType(){
                this.type_id = ''
                this.carTypeVisible = false 
            },
            getA11CarType(){
                let that = this
                that.tableLoadding = true
                that.request(villageApi.getA11CarType,{garage_id:that.garage_id}).then((res) => {
                    that.monthList= res.list
                    that.pageInfo.total = 16
                    that.tableLoadding = false
                }).catch(e=>{
                    that.tableLoadding = false
                })
            },
            onTableChange(page,pageSize){
                this.pageInfo.current = page
                this.pageInfo.page = page
                this.pageInfo.pageSize = pageSize
                this.getA11CarType()
                console.log('onTableChange==>', page, pageSize)
            },
            handleTableChange(pagenation, filters, sorter){
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getA11CarType()
            },
            bindOk(){
                this.getA11CarType()
            }
        },
    }
</script>

<style>
</style>
