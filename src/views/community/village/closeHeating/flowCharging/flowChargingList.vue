<template>
    <div class="parking_space">
        <div class="header_search">
            <div class="search_item">
                <label class="label_title" style="width: 75px;">申请人：</label>
                <a-input placeholder="请输入申请人" v-model="pageInfo.name" />
            </div>

            <div class="search_item">
                <label class="label_title" style="width: 100px;">联系方式：</label>
                <a-input placeholder="请输入联系方式" v-model="pageInfo.phone" />
            </div>
            <div class="search_item" style="margin-left: 20px;">
                <label class="label_title">审核状态：</label>
                <a-select show-search placeholder="请选择" style="width: 200px" :filter-option="filterOption"
                          @change="handleSelectChange" v-model="pageInfo.audit_status">
                    <a-select-option v-for="(item,index) in positionStatus" :value="item.position_status">
                        {{item.label}}
                    </a-select-option>
                </a-select>
                <a-button style="margin-left: 10px;" type="primary" @click="queryThis">查询</a-button>
                <a-button style="margin-left: 10px;" @click="clearThis">清空</a-button>
            </div>
            <div class="search_item">
                <a-button type="primary" v-if="role_add" @click="$refs.detailModal.add()">申请流量计费</a-button>
                <a-button type="primary" v-if="role_protocol" @click="$refs.ProtocolModel.set()" class="operation_btn">流量计费协议</a-button>
                <a-button type="primary" v-if="role_protocol" @click="$refs.flowChargSetModel.set()" class="operation_btn">流量计费设置</a-button>
            </div>
            
        </div>
        <div class="table_content">
            <a-table :columns="columns" :row-key="record=>record.pigcms_id"
                :pagination="pageInfo" :loading="tableLoadding"
                @change="handleTableChange" :data-source="dataList">
                <span slot="str" slot-scope="text">
                    <span v-if="text">
                    {{text}}
                    </span>
                    <span v-else>
                    --
                    </span>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="$refs.detailModal.show(record.pigcms_id)" v-if="record.role.select" >查看</a>
                    <a-divider type="vertical" v-if="record.role.audit" />
                    <a @click="$refs.detailModal.audit(record.pigcms_id)" v-if="record.role.audit" >审核</a>
                    <a-divider type="vertical" v-if="record.role.measure_up" />
                    <a @click="$refs.detailModal.measure_up(record.pigcms_id)" v-if="record.role.measure_up" >检查</a>
                    <a-divider type="vertical" v-if="record.role.delete" />
                    <a-popconfirm v-if="record.role.delete" title="确定要删除该项吗?" ok-text="是" cancel-text="否" @confirm="delConfirm(record)"
                        @cancel="delCancel">
                        <a style="color: red;">删除</a>
                    </a-popconfirm>
                     <a-divider type="vertical" v-if="record.role.audit==0 && record.audit_status==1"  />
                    <a @click="$refs.addFlowMeterModel.addMeter(record,'new_nuanqifei')" v-if="record.role.audit==0 && record.audit_status==1" >用量录入</a>
                   
                </span>
            </a-table>
        </div>
        <protocol-set ref="ProtocolModel" />
        <flow-charging-detail ref="detailModal" @ok="getDataList" />
        <flow-charg-set ref="flowChargSetModel" />
        <add-flow-meter ref="addFlowMeterModel" />
    </div>
</template>

<script>
    import villageApi from '@/api/community/village';
    import ProtocolSet from '@/views/community/village/closeHeating/flowCharging/protocolSet'
    import flowChargingDetail from '@/views/community/village/closeHeating/flowCharging/flowChargingDetail'
    import flowChargSet from '@/views/community/village/closeHeating/flowCharging/flowChargSet'
    import addFlowMeter from "@/views/community/village/closeHeating/flowCharging/addFlowMeter";
    const columns = [{
            title: '编号',
            dataIndex: 'sn',
            key: 'sn',
        },
        {
            title: '申请人',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '联系方式',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '申请时间',
            dataIndex: 'application_time',
            key: 'application_time',
        },
        {
            title: '申请房间',
            dataIndex: 'room',
            key: 'room',
        },
        {
            title: '审核状态',
            dataIndex: 'audit_status_msg',
            key: 'audit_status_msg',
            scopedSlots: {
                customRender: 'str'
            },
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];
    
    export default {
        data() {
            return {
                pageInfo: {
                    current: 1,
                    pageSize: 10,
                    total: 10,
                    page: 1,
                    name: '',
                    phone: '',
                    audit_status: -1,
                    is_measure_up: -1,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange: (page, pageSize) => this.onTableChange(page, pageSize) //点击页码事件
                },
                columns,
                tableLoadding: false,
                selectedRowKeys: [],
                modelTitle: '',
                dataList: [],
                positionStatus: [{position_status: -1, label:'全部'},{position_status: 0, label:'待审核'},{position_status: 1, label:'审核通过'}, {position_status: 2, label: '审核不通过'}],
                positionBindStatus: [{position_status: -1, label:'全部'},{position_status: 1, label:'符合'}, {position_status: 2, label: '不符合'}],
                frequency: false,
                pigcms_id: '',
                space_type: 'add',
                role_add: 0,
                role_protocol: 0,
                show_flow_charging_pop:false,
            }
        },

        components: {
            ProtocolSet,
            flowChargingDetail,
            flowChargSet,
            addFlowMeter
        },

        mounted() {
            this.getDataList()
        },

        methods: {
            queryThis() {
                if (this.frequency) {
                    this.$message.warn('请求频繁，请稍后再试')
                    return
                }
                this.frequency = true
                let timeout = setTimeout(() => {
                    this.frequency = false
                    clearTimeout(timeout)
                }, 2000)
                this.pageInfo.page = 1
                this.getDataList()
            },
            clearThis() {
                this.pageInfo = {
                    page: 1,
                    current: 1,
                    position_num: '',
                    pageSize: this.pageInfo.pageSize,
                    total: 0,
                }
                this.getDataList()
            },
            handleTableChange(pagenation, filters, sorter) {
                this.pageInfo.current = pagenation.current
                this.pageInfo.page = pagenation.current
                this.getDataList()
            },
            onTableChange(page, pageSize) {
                this.pageInfo.current = page
                this.pageInfo.pageSize = pageSize
                this.pageInfo.page = page
                this.getDataList()
                console.log('onTableChange==>', page, pageSize)
            },

            showflowCharging(){
                this.show_flow_charging_pop=true;
            },
            handleSelectChange(value) {
                this.pageInfo.page = 1
                this.pageInfo.current = 1
                console.log(`selected ${value}`);
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },

            getDataList() {
                let that = this
                this.show_flow_charging_pop=false;
                that.tableLoadding = true
                that.request(villageApi.flowChargingList, that.pageInfo).then((res) => {
                    that.dataList = res.data
                    that.pageInfo.total = res.total
                    that.tableLoadding = false
                    that.role_add = res.role.add
                    that.role_protocol = res.role.protocol
                })
            },

            editThis(record) {
                this.modelTitle = '编辑车位'
                this.space_type = 'edit'
                this.pigcms_id = record + ''
            },

            delConfirm(record) {
                let that = this
                that.request(villageApi.delFlowCharging, {
                    pigcms_id: record.pigcms_id
                }).then((res) => {
                    that.$message.success('删除成功！')
                    that.selectedRowKeys = []
                    that.getDataList()
                })
            },
            delCancel() {

            },

            closeSpace(flag) {
                this.pigcms_id = ''
                if (flag) {
                    this.getDataList()
                }
            },

            // onSelectChange(selectedRowKeys) {
            //     console.log('selectedRowKeys changed: ', selectedRowKeys);
            //     this.selectedRowKeys = selectedRowKeys;
            //     this.dataList.map(v => {
            //         selectedRowKeys.map((item, index) => {
            //             if (item == v.pigcms_id) {
            //             }
            //         })
            //     })
            // },

            addThis() {
                this.modelTitle = '添加车位'
                this.space_type = 'add'
            },
        },
    }
</script>

<style lang="less" scoped>
    .parking_space {
        width: 98%;
        background-color: #ffffff;
        margin: 10px;

        .header_search {
            width: 100%;
            padding: 20px;
            background-color: #ffffff;
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;

            .search_item {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin: 10px 20px;
            }

            .operation_btn {
                margin-left: 20px;
            }
        }

        .table_content {
            padding: 0 20px;
            margin: 10px 0;
        }
    }
</style>
