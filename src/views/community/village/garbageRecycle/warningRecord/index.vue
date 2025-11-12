<template>
    <div class="equipment_list">
        <div class="search_con">

            <div class="search_item">
                <div class="label">名称：</div>
                <div class="value">
                    <a-input style="width: 120px;" placeholder="请输入" v-model="pageInfo.name" />
                </div>
            </div>
            
            <div class="search_item">
                <div class="label">设备编号：</div>
                <div class="value">
                    <a-input style="width: 120px;" placeholder="请输入" v-model="pageInfo.device_no" />
                </div>
            </div>
            <div class="search_item">
                <div class="label">预警类型：</div>
                <div class="value">
                    <a-select style="width: 120px;" v-model="pageInfo.type">
                        <a-select-option :value="0">全部</a-select-option>
                        <a-select-option v-for="(item, index) in typeList" :key="index" :value="item.key">{{item.value}}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="search_item">
                <div class="label">预警状态：</div>
                <div class="value">
                    <a-select style="width: 120px;" v-model="pageInfo.status">
                        <a-select-option :value="0">全部</a-select-option>
                        <a-select-option :value="1">预警中</a-select-option>
                        <a-select-option :value="2">已解除</a-select-option>
                    </a-select>
                </div>
            </div>
            <a-button type="primary" style="margin-left: 10px;" @click="queryThis">查询</a-button>
        </div>

        <div class="table_con">
            <a-table rowKey="id" :columns="tableColumns" :data-source="tableList" :pagination="pageInfo" :loading="tableLoading" @change="handleTableChange">
                <span slot="status" slot-scope="text, record">
                    <span v-if="record.status==1"style="color: #ff0000" >{{ text }}</span>
                    <span v-else style="color: #0ccfa3" >{{ text }}</span>
                </span>
                <template slot="action" slot-scope="record">
                    <a-button type="link" @click="lookRecord(record)">查看</a-button>
                </template>
            </a-table>
        </div>
        
        <detailModal :equip_id="equip_id" :visible="detailVisible" @close="closeDetail" />
    </div>
</template>

<script>
    import Vue from 'vue';
    import detailModal from './modules/detailModal.vue';
    export default {
        components: {
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
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
                },
                tableColumns: [{
                        title: '设备编号',
                        dataIndex: 'device_no'
                    },
                    {
                        title: '设备名称',
                        dataIndex: 'name'
                    },
                    {
                        title: '设备地址',
                        dataIndex: 'address'
                    },
                    {
                        title: '桶编号',
                        dataIndex: 'bucke_no'
                    },
                    {
                        title: '预警类型',
                        dataIndex: 'type_str'
                    },
                    {
                        title: '预警时间',
                        dataIndex: 'warn_time'
                    },
                    {
                        title: '状态',
                        dataIndex: 'status_str',
                        scopedSlots: {
                            customRender: 'status'
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
                typeList: [],
                tableLoading: false,
                equip_id: ''
            }
        },
        mounted() {
            this.getData()
            this.getWarnType()
        },
        
        methods: {
            handleTableChange({current, pageSize}){
                this.pageInfo.current = current
                this.pageInfo.page = current
                this.pageInfo.pageSize = pageSize
                this.getData()
            },
            
            lookRecord(record){
                this.equip_id = record.id
                this.detailVisible = true
            },
            
            closeDetail(){
                this.equip_id = ''
                this.detailVisible = false
            },
            getWarnType(){
                let that = this
                that.request('/community/village_api.Garbage.GarbageCollectionWarn/getWarnType', {}).then((res) => {
                    that.typeList = res
                })
            },
            getData(){
                let that = this
                that.tableLoading = true
                that.request('/community/village_api.Garbage.GarbageCollectionWarn/warnList', that.pageInfo).then((res) => {
                    that.tableLoading = false
                    that.pageInfo.total = res.total
                    that.tableList = res.data
                })
            },
            queryThis() {
                this.getData()
            },
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
