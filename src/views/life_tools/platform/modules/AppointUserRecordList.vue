<template>
    <div id="components-layout-demo-basic">
        <a-modal :title="title" :width="'60%'" :visible="confirmShow" :footer="null" @cancel="handleCancelModel">
            <a-layout>
                <a-layout style="padding: 0 20px; background: #fff">
                    <a-layout-content :style="{ margin: '0px', padding: '0px', background: '#fff', minHeight: '100px' }">
                        <div class="table-operations">
                            <a-row align="top" style="padding: 0px;width: 100%;">
                                <a-col :span="24" class="text-right">
                                    <a-button icon="download" @click="getExport"> 导出</a-button>
                                </a-col>
                            </a-row>
                        </div>
                        <a-table :columns="columns"
                                 :data-source="data"
                                 :pagination="pagination">
                            <span slot="status" slot-scope="text, record">
                                <a v-if="record.status==0">待支付</a>
                                <a v-if="record.status==1">报名成功</a>
                                <a v-if="record.status==2">报名失败</a>
                                <a v-if="record.status==4">已过期</a>
                                <a v-if="record.status==3">已核销</a>
                                <a class="red" v-if="record.status==5">已退款</a>
                            </span>

                            <span slot="verify_time" slot-scope="text">
                                {{text ? text : "--"}}
                            </span>
                            <span slot="need_pay" slot-scope="text, record">
                                <a v-if="record.need_pay==0">不需要</a>
                                <a v-if="record.need_pay==1">需要</a>
                            </span>
                            <span slot="need_verify" slot-scope="text, record">
                                <a v-if="record.need_verify==0">不需要</a>
                                <a v-if="record.need_verify==1">需要</a>
                            </span>

                            <span slot="paid" slot-scope="text, record">
                                <a v-if="record.paid==0">未支付</a>
                                <a v-if="record.paid==1">已支付</a>
                            </span>
                        </a-table>
                    </a-layout-content>
                </a-layout>
            </a-layout>
        </a-modal>
        <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="searchForm"></export-add>
    </div>
</template>
<script>
    import lifeToolsPlatformApi from '@/api/life_tools/platform/index'
    import ExportAdd from "../../../common/export/ExportAdd";
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            scopedSlots: {customRender: 'phone'},
        },
        {
            title: '报名费',
            dataIndex: 'price',
            scopedSlots: {customRender: 'price'},
        },
        {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'},
        },
        {
            title: '是否需要报名费',
            dataIndex: 'need_pay',
            scopedSlots: {customRender: 'need_pay'},
        },
        {
            title: '是否支付',
            dataIndex: 'paid',
            scopedSlots: {customRender: 'paid'},
        },
        {
            title: '支付时间',
            dataIndex: 'pay_time',
            scopedSlots: {customRender: 'pay_time'},
        },
        {
            title: '是否需要核销',
            dataIndex: 'need_verify',
            scopedSlots: {customRender: 'need_verify'},
        },
        {
            title: '核销时间',
            dataIndex: 'verify_time',
            scopedSlots: {customRender: 'verify_time'},
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
        },
    ];

    export default {
        name: "userRecordList",
        components: {ExportAdd},
        data() {
            return {
                title: "报名列表",
                sortLoading: false,
                confirmShow: false,
                is_res: false,
                data: [],
                appoint_id:0,
                exportUrl: lifeToolsPlatformApi.exportAppointUserOrder,
                searchForm: {
                    type: 'pc',
                    appoint_id: '',
                    act: 'all',
                    pay: 'all',
                },
                columns,
                pagination: {
                    current: 1,
                    total: 0,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: this.onPageChange,
                    onShowSizeChange: this.onPageSizeChange,
                    showTotal: (total) => `共 ${total} 条记录`,
                },
            }
        },
        methods: {
            showRes(id) {
                this.confirmShow = true
                this.searchForm.appoint_id=this.appoint_id = id
                this.getUserList()
            },
            handleCancelModel(){
                this.confirmShow=false
                this.$emit('getAppointList')
            },
            // 获得技师列表
            getUserList() {
                this.request(lifeToolsPlatformApi.lookAppointUser, {appoint_id: this.appoint_id}).then((res) => {
                    this.data = res.list
                    this.$set(this, 'data', res.list)
                    this.$set(this.pagination, 'total', res.count)
                })
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                    this.getJobList()
                }
            },
            getExport() {
                if (this.data.length) {
                    this.$refs.ExportAddModal.exports()
                } else {
                    this.$message.warn('当前没有可以导出的内容')
                }
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.$set(this.pagination, 'current', page)
                this.getJobList()
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.getJobList()
            },
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRows = [];
                if (selectedRows.length) {
                    selectedRows.map((item) => {
                        this.selectedRows.push(item.id)
                    })
                }
            },
            // 添加编辑删除回调
            handleUpdate() {
                this.getJobList()
            },
            handleCancel() {
                this.phone = ""
                this.confirmShow = false
                this.detail = ""
            },
        }
    }
</script>

<style scoped>
.red{
    color:red;
    cursor: pointer;
}

</style>