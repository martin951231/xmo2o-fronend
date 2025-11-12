<template>
    <div id="components-layout-demo-basic">
        <a-modal :title="title" :width="'70%'" :visible="confirmShow" :footer="null" @cancel="handleCancelModel">
            <a-layout>
                <a-layout style="padding: 0 20px; background: #fff">
                    <a-layout-content
                        :style="{ margin: '0px', padding: '0px', background: '#fff', minHeight: '100px' }">
                        <a-input-group compact>
                            <a-select style="width: 100px;" v-model="searchForm.date_type">
                                <a-select-option :value="0">报名日期</a-select-option>
                                <a-select-option :value="1">核销日期</a-select-option>
                                <a-select-option :value="3">手机号</a-select-option>
                            </a-select>
                            <template v-if="searchForm.date_type != 3">
                                <a-range-picker @change="selectDate" v-model="dateString" />
                            </template> 
                            <template v-else>
                                 <a-input-search placeholder="请输入手机号" v-model="searchForm.keywords" style="width: 360px" @search="onSearch" />
                            </template> 

                            <label style="margin-left: 100px;line-height: 31px;">状态： </label>
                            <a-select style="width: 100px;" v-model="searchForm.status"  @change="selectStatus">
                                <a-select-option :value="0">全部</a-select-option>
                                <a-select-option :value="1">报名成功</a-select-option>
                                <a-select-option :value="3">已核销</a-select-option>
                                <a-select-option :value="5">已退款</a-select-option>
                            </a-select>

                            <a-button style="margin-left: 50px;" type="primary" @click="onReset">重置</a-button>

                            <a-button style="float:right" icon="download" @click="getExport"> 导出</a-button>
                        </a-input-group>
                        <!-- <div class="table-operations">
                            <a-row align="top" style="padding: 0px;width: 100%;">
                                <a-col :span="24" class="text-right">
                                    <a-button icon="download" @click="getExport"> 导出</a-button>
                                </a-col>
                            </a-row>
                        </div> -->
                        <a-table :columns="columns" :data-source="data" :pagination="pagination2"  style="margin-top: 20px;" @change="changePage">
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

                            <span slot="detail" slot-scope="text, record">
                                <a @click="showDetail(record.order_id)">详情</a>
                            </span>

                            <span slot="action" slot-scope="text, record">

                                <div v-if="record.is_apply_refund==1">
                                    <span class="red" @click="refund(record.pigcms_id, record.apply_refund_reason)">退款</span>
                                </div>
                                <span v-else>无</span>
                            </span>
                        </a-table>
                    </a-layout-content>
                </a-layout>
            </a-layout>
        </a-modal>
        <a-modal v-model="refundVisible" title="退款确认">
            <p>{{apply_refund_reason}}</p>
            <template slot="footer">
                <a-button key="back" @click="handleCancelRefund">
                    取消
                </a-button>
                <a-button key="submit" type="primary" :loading="loading" @click="doRefund(1)">
                    同意
                </a-button>
                <a-button key="refund" type="danger" :loading="loading" @click="doRefund(2)">
                    拒绝
                </a-button>
            </template>
        </a-modal>
        <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="searchForm"></export-add>
    <appoint-order-detail @loadRefresh="getUserList" ref="appointOrderDetailModel" />
    </div>
</template>
<script>
    import lifeToolsMerchantApi from '@/api/life_tools/merchant/index'
    import ExportAdd from "../../../common/export/ExportAdd";
    import AppointOrderDetail from "./appointOrderDetail";
    const columns = [
         
        {
            title: '昵称',
            dataIndex: 'nickname',
            scopedSlots: {
                customRender: 'nickname'
            },
        }, 
        {
            title: '手机号',
            dataIndex: 'phone',
            scopedSlots: {
                customRender: 'phone'
            },
        },
        
        
        {
            title: '报名费',
            dataIndex: 'price',
            scopedSlots: {
                customRender: 'price'
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: {
                customRender: 'status'
            },
        },
        {
            title: '是否需要报名费',
            dataIndex: 'need_pay',
            scopedSlots: {
                customRender: 'need_pay'
            },
        },
        {
            title: '是否支付',
            dataIndex: 'paid',
            scopedSlots: {
                customRender: 'paid'
            },
        },
        {
            title: '支付时间',
            dataIndex: 'pay_time',
            scopedSlots: {
                customRender: 'pay_time'
            },
        },
        {
            title: '是否需要核销',
            dataIndex: 'need_verify',
            scopedSlots: {
                customRender: 'need_verify'
            },
        },
        {
            title: '核销时间',
            dataIndex: 'verify_time',
            scopedSlots: {
                customRender: 'verify_time'
            },
        },
        {
            title: '详情',
            dataIndex: 'detail',
            scopedSlots: {
                customRender: 'detail'
            },
        },
        {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {
                customRender: 'action'
            },
        },
    ];

    export default {
        name: "userRecordList",
        components: {
            ExportAdd,
            AppointOrderDetail
        },
        data() {
            return {
                title: "报名列表",
                refundVisible: false,
                refundId: 0,
                sortLoading: false,
                confirmShow: false,
                loading: false,
                is_res: false,
                data: [],
                appoint_id: 0,
                exportUrl: lifeToolsMerchantApi.exportAppointUserOrder,
                searchForm: {
                    type: 'pc',
                    appoint_id: '',
                    act: 'all',
                    pay: 'all',
                    date_start: null,
                    date_end: null,
                    date_type: 0,
                    status: 0,
                    page: 1,
                    page_size: 10,
                    keywords: '',
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
                pagination2:{
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 1
                },
                apply_refund_reason: '',
                dateString: null
            }
        },
        methods: {
            showRes(id) {
                this.confirmShow = true
                this.searchForm.appoint_id = this.appoint_id = id
                this.getUserList()
            },
            handleCancelModel() {
                this.confirmShow = false
                this.$emit('getAppointList')
            },
            // 获得技师列表
            getUserList() {
                this.searchForm.page_size = this.pagination2.pageSize
                this.searchForm.page = this.pagination2.current;
                this.request(lifeToolsMerchantApi.lookAppointUser, this.searchForm).then((res) => {
                    this.data = res.list
                    this.$set(this, 'data', res.list)
                    this.pagination2.total = res.total
                })
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.queryParam['page'] = e.current
                    this.getUserList()
                }
            },
            getExport() {
                if (this.data.length) {
                    this.request(lifeToolsMerchantApi.exportAppointUserOrder, this.searchForm).then((res)=>{
                        window.open(res.file_url)
                    })
                    // this.$refs.ExportAddModal.exports()
                } else {
                    this.$message.warn('当前没有可以导出的内容')
                }
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.$set(this.pagination, 'current', page)
                this.getUserList()
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
                this.getUserList()
            },
            handleCancel() {
                this.confirmShow = false
            },
            handleCancelRefund() {
                this.refundVisible = false
                this.refundId = 0
            },
            // 同意退款
            refund(id, msg = '是否同意退款') {
                this.refundVisible = true
                this.refundId = id
                this.apply_refund_reason = msg
            },
            doRefund(type) {
                this.refundVisible = true
                let _this = this
                let msg = ''
                if (type == 1) {
                    // 同意退款
                    msg = '是否同意退款'
                } else {
                    msg = '是否拒绝退款'
                }
                this.$confirm({
                    title: '退款确认框',
                    content: msg,
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                        _this.request(lifeToolsMerchantApi.auditRefund, {
                            order_id: _this.refundId,
                            type: type
                        }).then((res) => {
                            _this.$message.success('操作成功')
                            _this.refundVisible = false
                            _this.refundId = 0
                            _this.getUserList()
                        })
                    },
                    onCancel() {},
                });
            },
            showDetail(order_id) {
                this.$refs.appointOrderDetailModel.showWindow(order_id)
            },
            selectDate(value, dateString) {
                this.searchForm.date_start = dateString[0];
                this.searchForm.date_end = dateString[1];
                this.getUserList()
            },
            selectStatus(){
                this.getUserList()
            },
             changePage(page, pageSize)
            {
                this.pagination2.current = page.current;
                this.getUserList();
            },
            onSearch(text){
                this.getUserList()
            },
            onReset(){
                this.pagination2 = {
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 1
                };
                this.searchForm = {
                    type: 'pc',
                    appoint_id: this.appoint_id,
                    act: 'all',
                    pay: 'all',
                    date_start: null,
                    date_end: null,
                    date_type: 0,
                    status: 0,
                    page: 1,
                    page_size: 10
                };
                this.dateString = null;
                this.getUserList();
            }
        }
    }
</script>

<style scoped>
    .red {
        color: red;
        cursor: pointer;
    }
</style>
