<template>
    <div id="components-layout-demo-basic">
        <a-modal :title="title" :width="'60%'" :visible="confirmShow" :footer="null" @cancel="handleCancelModel">
                <a-row>
                    <a-input-group compact>
                        <a-select style="width: 100px" v-model="queryParam.search_type">
                            <a-select-option value="1">姓名</a-select-option>
                            <a-select-option value="2">手机号</a-select-option>
                        </a-select> 
                        
                        <a-input style="width: 200px" v-model="queryParam.keywords" />
                        <a-button type="primary" @click="onSearch">搜索</a-button>
                        <span style="margin-left: 50px;line-height: 32px;">状态：</span>
                        <a-select style="width: 100px" v-model="queryParam.status" @change="onChange">
                            <a-select-option :value="null">全部</a-select-option>
                            <!-- <a-select-option :value="0">待支付</a-select-option> -->
                            <a-select-option :value="10">已支付</a-select-option>
                            <a-select-option :value="1">报名成功</a-select-option>
                            <a-select-option :value="2">报名失败</a-select-option>
                        </a-select> 
                        <span style="margin-left: 50px;line-height: 32px;">审核状态：</span>
                        <a-select style="width: 100px" v-model="queryParam.audit_status" @change="onChange">
                            <a-select-option :value="null">全部</a-select-option>
                            <a-select-option :value="0">待审核</a-select-option>
                            <a-select-option :value="1">审核中</a-select-option>
                            <a-select-option :value="2">审核成功</a-select-option>
                            <a-select-option :value="3">审核失败</a-select-option>
                        </a-select> 
                        <a-button type="primary" style="margin-left: 50px;" @click="onReset">重置</a-button>
                        <a-button icon="download" style="float: right;" @click="getExport"> 导出</a-button>
                    </a-input-group>
                </a-row>
              
                <a-row style="margin-top: 20px;">
                     <a-table :columns="columns"
                                @change="changePage"
                                 rowKey="pigcms_id"
                                 :data-source="data"
                                 :pagination="pagination">
                            <span slot="status" slot-scope="text, record">
                                <!-- <a v-if="record.status==0">待支付</a>
                                <a v-if="record.status==1">报名成功</a>
                                <a v-if="record.status==2">报名失败</a> -->
                                <a>{{record.status_text}}</a>
                            </span>

                            <span slot="need_pay" slot-scope="text, record">
                                <a v-if="record.need_pay==0">不需要</a>
                                <a v-if="record.need_pay==1">需要</a>
                            </span>

                            <span slot="paid" slot-scope="text, record">
                                <a v-if="record.paid==0">未支付</a>
                                <a v-if="record.paid==1">已支付</a>
                            </span>
                            <span slot="audit_status" slot-scope="text, item">
                                <a-popover placement="rightTop">
                                    <template slot="content">
                                    <div>
                                        <a-table rowKey="id" :columns="statusColumns" :data-source="item.audit_list">
                                            <span slot="status" slot-scope="text, item">
                                                <span v-if="item.status == 0" style="color: #faad14">待审核</span>
                                <span v-else-if="item.status == 1" style="color: #52c41a">审核通过</span>
                                <span v-else-if="item.status == 2" style="color: #f5222d">审核失败</span>
                                            </span>
                                        </a-table>
                                    </div>
                                    </template>
                                    <span v-if="item.audit_status == 0 || item.audit_status == 1" style="color: #faad14">{{ item.audit_status_text }}</span>
                                <span v-else-if="item.audit_status == 3" style="color: #f5222d">{{ item.audit_status_text}}</span>
                                <span v-else-if="item.audit_status == 2" style="color: #52c41a">{{ item.audit_status_text }}</span>
                                </a-popover>
                            </span>
                        </a-table> 

                </a-row>
                 
                       
             
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
        // {
        //     title: '是否支付',
        //     dataIndex: 'paid',
        //     scopedSlots: {customRender: 'paid'},
        // },
        {
            title: '审核状态',
            dataIndex: 'audit_status',
            scopedSlots: {customRender: 'audit_status'},
        },
        {
            title: '支付时间',
            dataIndex: 'pay_time_text',
            scopedSlots: {customRender: 'pay_time_text'},
        },
        // {
        //     title: '操作',
        //     dataIndex: 'action',
        //     scopedSlots: {customRender: 'action'},
        // },
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
                competition_id:0,
                exportUrl: lifeToolsPlatformApi.exportUserOrder,
                searchForm: {
                    type: 'pc',
                    competition_id: '',
                    act: 'all',
                    pay: 'all',
                },
                queryParam:{
                    competition_id: 0,
                    page: 1,
                    page_size: 10,
                    search_type: '1',
                    status: null,
                    keywords: '',
                    audit_status: null
                },
                columns,
                pagination: {
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 1
                },
                statusColumns:[
                    {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '审核',
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'},
        },
         {
            title: '备注',
            dataIndex: 'remark',
        },
                ],
                statusData: []
            }
        },
        methods: {
            showRes(id) {
                this.confirmShow = true
                this.searchForm.competition_id=this.competition_id = id
                this.getUserList()
            },
            handleCancelModel(){
                this.confirmShow=false
                this.$emit('getSportList')
            },
            // 获得技师列表
            getUserList() {
                this.queryParam.competition_id = this.competition_id;
                this.queryParam.page = this.pagination.current;
                this.queryParam.page_size = this.pagination.pageSize
 
                this.request(lifeToolsPlatformApi.lookCompetitionUser, this.queryParam).then((res) => {
                    this.data = res.data
                    this.pagination.total = res.total
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
                    this.request(this.exportUrl, this.queryParam).then((res)=>{
                        // console.log(res)
                        if(res.file_url){
                            window.open(res.file_url)
                        }
                    })
                    // this.$refs.ExportAddModal.exports()
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
            // 设置为删除
            childDel(id) {
                this.$confirm({
                    title: '你确定解除此技师吗?',
                    centered: true,
                    onOk: () => {
                        this.request(mallMerchantApi.delJob, {ids: id}).then((res) => {
                            this.$message.success('解除成功！')
                            this.getJobList()
                        })
                    },
                    onCancel() {
                    },
                })
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
            sureEdit() {
                if (this.is_res) {
                    this.request(mallMerchantApi.authentica, {
                        id: this.person_id,
                        uid: this.uid,
                        detail: this.detail
                    }).then((res) => {
                        this.$message.success('已经提交申请，请等待审核结果！')
                        // 调用父页面方法
                        this.phone = ""
                        this.confirmShow = false
                        this.detail = ""
                        this.uid = 0
                        this.person_id = 0
                        this.getJobList()
                    })
                } else {
                    this.$message.error('请输入有效的技师账号(手机号)验证！')
                }
            },
            resJob() {
                this.request(mallMerchantApi.resJob, {phone: this.phone}).then((res) => {
                    if (res.uid) {
                        this.is_res = true
                        this.msg = "该账号可申请认证"
                        this.uid = res.uid
                        this.avatar = res.avatar
                    } else {
                        this.is_res = false
                        this.msg = "该账号不存在或者已经被认证"
                    }
                })
            },
            changePage(page, pageSize)
            {
                this.pagination.current = page.current;
                this.getUserList();
            },
            onSearch()
            {
                this.getUserList();
            },
            onChange()
            {
                this.getUserList();
            },
            onReset(){
                this.queryParam = {
                    competition_id: 0,
                    page: 1,
                    page_size: 10,
                    search_type: '1',
                    status: null,
                    audit_status: null,
                    keywords: ''
                }
                this.pagination= {
                    pageSize: 10,
                    total: 0,
                    current: 1,
                    page: 1
                }
                this.getUserList();
            }
        }
    }
</script>

<style scoped>

</style>