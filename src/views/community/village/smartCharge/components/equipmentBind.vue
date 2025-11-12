<template>
    <a-modal
        title="绑定设备"
        :visible="visible"
        :width="1000"
        @ok="handleOk"
        :footer="null"
        @cancel="handleCancel">
        <!-- :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
        <a-table 
            @change="tabChange" 
            :columns="columns" 
            :data-source="tableList" 
            :loading="tableLoading" 
            :pagination="pageInfo"
            :rowKey="record=>record.id">
            <span slot="action" slot-scope="text, record">
                <a v-if="record.bind == 0" @click="bindDevice(record)">绑定</a>
            </span>
        </a-table>
        <!-- <a-button @click="batchBind">批量绑定</a-button> -->
    </a-modal>
</template>

<script>
    const columns = [{
            title: '设备名称',
            key: 'equipment_name',
            dataIndex: 'equipment_name',
            width: 130
        },
        {
            title: '设备编号',
            dataIndex: 'equipment_num',
            key: 'equipment_num',
            width: 130
        },
        {
            title: '设备品牌',
            dataIndex: 'device_brand',
            key: 'device_brand',
            width: 130
        },
        {
            title: '设备类型',
            dataIndex: 'type_txt',
            key: 'type_txt',
            width: 130
        },
        {
            title: '绑定状态',
            dataIndex: 'bind_status',
            key: 'bind_status',
            width: 130
        },
        {
            title: '设备状态',
            dataIndex: 'status_txt',
            key: 'status_txt',
            width: 130
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
            ruleId: {
                type: Number,
                default: 0
            }
        },
        watch: {
            visible: {
                handler(val){
                    if(val){
                        this.pageInfo.rule_id = this.ruleId
                        this.getRuleEquipmentList()
                    }
                },
                immediate: true
            }
        },
        data(){
            return{
                columns,
                tableLoading: false,
                pageInfo: {
                    page: 1,
                    limit: 10,
                    current: 1,
                    pageSize: 10,
                    total: 0,
                    rule_id: 0
                },
                tableList:[],
                selectedRowKeys: [],
                bindParams: {
                    
                }
            }
        },
        
        methods: {
            getRuleEquipmentList(){
                let that = this
                that.tableLoading = true
                that.request('/community/village_api.Pile/getRuleEquipmentList', this.pageInfo).then(res => {
                    that.pageInfo.total = res.count
                    that.tableList = res.list
                    that.tableLoading = false
                })
            },
            tabChange({current}){
                this.pageInfo.page = current
                this.pageInfo.current = current
                this.getRuleEquipmentList()
            },
            handleCancel(){
                this.$emit('close')
            },
            handleOk(){
                
            },
            bindDevice(record){
                let that = this
                that.request('/community/village_api.Pile/bind', {
                    rule_id: this.ruleId,
                    id: record.id
                }).then(res => {
                    that.getRuleEquipmentList()
                    that.$message.success("绑定成功！")
                })
            },
            onSelectChange(selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys);
                this.selectedRowKeys = selectedRowKeys;
            },
            
            batchBind(record){
                
            }
        }
    }
</script>

<style lang="less" scoped>
</style>