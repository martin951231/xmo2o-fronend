<template>
    <div class="equipment_list">
        <div class="search_con">
            <div class="search_item">
                <div class="label">设备编号：</div>
                <div class="value">
                    <a-input style="width: 120px;" placeholder="请输入" v-model="pageInfo.device_no" />
                </div>
            </div>

            <div class="search_item">
                <div class="label">名称：</div>
                <div class="value">
                    <a-input style="width: 120px;" placeholder="请输入" v-model="pageInfo.name" />
                </div>
            </div>

            <div class="search_item">
                <div class="label">设备类型：</div>
                <div class="value">
                    <a-select placeholder="请选择" style="width: 200px;" v-model="pageInfo.type">
                        <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.key">{{item.value}}</a-select-option>
                    </a-select>
                </div>
            </div>

            <div class="search_item">
                <div class="label">设备状态：</div>
                <div class="value">
                    <a-select placeholder="请选择" style="width: 120px;" v-model="pageInfo.status">
                        <a-select-option :value="0">全部</a-select-option>
                        <a-select-option :value="1">在线</a-select-option>
                        <a-select-option :value="2">离线</a-select-option>
                        <a-select-option :value="3">维修中</a-select-option>
                        <a-select-option :value="4">维修完成</a-select-option>
                    </a-select>
                </div>
            </div>
            
            <a-button type="primary" style="margin-left: 10px;" @click="queryThis">查询</a-button>
            <a-button type="default" style="margin-left: 10px;" @click="clearThis">清空</a-button>
            <a-button type="primary" style="margin-left: 10px;" @click="pullMachine">拉取设备数据</a-button>
        </div>

        <div class="table_con">
            <a-table rowKey="id" :loading="tableLoading" :columns="tableColumns" :data-source="tableList" :pagination="pageInfo" @change="handleTableChange">
                <span slot="village_name" slot-scope="text">
                    {{ text || L('未绑定') }}
                </span>
                <template slot="action" slot-scope="record">
                    <a-button type="link" @click="lookRecord(record)">查看</a-button>
                    <a-divider type="vertical" />
                    <a-button v-if="record.village_id > 0" type="link" @click="unbindEquip(record)">取消绑定</a-button>
                    <a-button v-else type="link" @click="bindEquip(record)">绑定</a-button>
                </template>
            </a-table>
        </div>
        
        <bindVillage :equip_id="equip_id" :visible="bindVisible" @close="closeBind" />
        <detailModal :equip_id="equip_id" :visible="detailVisible" @close="closeDetail" />
    </div>
</template>

<script>
    import Vue from 'vue';
    import bindVillage from './modules/bindVillage.vue';
    import detailModal from './modules/detailModal.vue';
    export default {
        components: {
            bindVillage,
            detailModal
        },
        data() {
            return {
                pageInfo: {
                    device_no: '',
                    name: '',
                    type: 0,
                    status: 0,
                    
                    pageSize: 10,
                    page: 1,
                    current: 1,
                    total: 0,
                    village_id: '',
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
                },
                tableColumns: [{
                        title: '设备编号',
                        dataIndex: 'device_no'
                    },
                    {
                        title: '名称',
                        dataIndex: 'name'
                    },
                    {
                        title: '设备类型',
                        dataIndex: 'type_str'
                    },
                    {
                        title: '详细地址',
                        dataIndex: 'address'
                    },
                    {
                        title: '设备状态',
                        dataIndex: 'status_str'
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'add_time'
                    },
                    {
                        title: '小区名称',
                        dataIndex: 'village_name',
                        scopedSlots: {
                            customRender: 'village_name'
                        }
                    },
                    {
                        title: '操作',
                        scopedSlots: { customRender: 'action' },
                    },
                ],
                tableList: [],
                bindVisible: false,
                detailVisible: false,
                tableLoading: false,
                
                typeList: [],
                equip_id: ''
            }
        },
        
        methods: {
            handleTableChange({current, pageSize}){
                this.pageInfo.current = current
                this.pageInfo.page = current
                this.pageInfo.pageSize = pageSize
                this.getEqiupmentList()
            },
            
            getMachineType(){
                let that = this
                that.request('/community/platform.device.GarbageCollectionMachine/getMachineType', {}).then((res) => {
                    that.typeList = res
                    that.typeList.unshift({'key':0,'value':'全部'})
                })
            },
            
            getEqiupmentList(){
                let that = this
                that.tableLoading = true
                that.request('/community/platform.device.GarbageCollectionMachine/machineList', that.pageInfo).then((res) => {
                    that.tableLoading = false
                    that.pageInfo.total = res.total
                    that.tableList = res.data
                })
            },
            
            lookRecord(record){
                this.equip_id = record.id
                this.detailVisible = true
            },
            
            closeDetail(){
                this.equip_id = ''
                this.detailVisible = false
            },
            
            bindEquip(record){
                this.equip_id = record.id
                this.bindVisible = true
            },
            unbindEquip(record){//解绑
                this.$confirm({
                    title: '提示',
                    content: '是否确定取消绑定【'+record.village_name+'】小区',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        this.request('/community/platform.device.GarbageCollectionMachine/machineBind', {id: record.id, village_id: record.village_id,status:0}).then((res) => {
                            this.$message.success('解绑成功！')
                            setTimeout(() => {
                                this.getEqiupmentList()
                            }, 1500)
                        })
                    },
                    onCancel: () => {
                        console.log('Cancel')
                        this.currentBtn = ''
                    },
                    class: 'test'
                })
            },
            
            closeBind(){
                this.equip_id = ''
                this.bindVisible = false
                this.getEqiupmentList()
            },
            
            queryThis() {
                this.getEqiupmentList()
            },
            
            clearThis(){
                this.pageInfo.device_no = ''
                this.pageInfo.name = ''
                this.pageInfo.type = undefined
                this.pageInfo.status = undefined
                this.getEqiupmentList()
            },
            
            pullMachine(){
                let that = this
                that.request('/community/platform.device.GarbageCollectionMachine/pullMachine', {}).then((res) => {
                    that.$message.success('拉取成功！')
                    that.getEqiupmentList()
                })
            }
        },
        
        mounted() {
            this.getEqiupmentList()
            this.getMachineType()
        }
    }
</script>

<style lang="less" scoped>
    .equipment_list {
        padding: 20px;
        background: #ffffff;
        margin-top: 10px;
        .search_con {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            transform: tranlateX(-10px);
            .search_item {
                display: flex;
                align-items: center;
                margin: 10px;
                
                .label {
                    font-size: 14px;
                    color: #666666;
                }

                .value {}
            }
        }
    }
</style>
