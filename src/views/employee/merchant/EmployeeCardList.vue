<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10">
        <!-- <div class="page-title" style="padding-left: 0px;margin-left: 0px;padding-top: 0px;border-bottom: none;margin-top: 0px;padding-bottom: 10px;">商家员工卡列表</div> -->
   
        
        <a-row>
            <div class="card_tab">
                <span class="on">商家员工卡列表</span>
            </div>
            <div class="card_tab">
                <router-link to='/merchant/merchant.life_tools/employeeCardConsume'>
                <span>核销列表</span>
                </router-link> 
            </div>
            <div class="card_tab">
                <router-link to='/merchant/merchant.life_tools/employeeCardRechargeList'>
                <span>充值记录</span>
                </router-link>
            </div>
            <div class="card_tab">
                <router-link to='/merchant/merchant.life_tools/employeeBillList'>
                <span>财务报表</span>
                </router-link> 
            </div>
            <div class="card_tab">
                <router-link to='/merchant/merchant.life_tools/employeeClearScoreList'>
                    <span>积分清零记录</span>
                </router-link>
            </div>
           
        </a-row>
        
        <a-form-model layout="inline" :model="searchForm">
            <a-row>
                <a-col :span="12" style="display: flex; align-items:center;">
                    <a-form-model-item label="搜索">
                        <!--<a-select
                                v-model="searchForm.type"
                        >
                            <a-select-option :value="0"> 手机号</a-select-option>
                            <a-select-option :value="1"> 会员名称</a-select-option>
                            <a-select-option :value="2"> 会员卡号</a-select-option>
                        </a-select>
                        <a-input v-model="searchForm.content" placeholder="请输入搜索内容"/>-->
                        <a-input-group compact>
                            <a-select
                                    v-model="searchForm.type"
                                    style="width: 100px;margin-top: 0px;"
                            >
                                <a-select-option :value="0"> 手机号</a-select-option>
                                <a-select-option :value="1"> 会员名称</a-select-option>
                                <a-select-option :value="2"> 会员卡号</a-select-option>
                                <a-select-option :value="3"> 会员部门</a-select-option>
                                <a-select-option :value="4"> 会员身份</a-select-option>
                                <a-select-option :value="5"> 会员标签</a-select-option>
                            </a-select>
                           <!-- <a-input style="width: 60%" v-model="searchForm.content" placeholder="请输入搜索内容"/>-->
                            <a-input-search
                                    style="width: 70%;margin-top: 1px;"
                                    v-model="searchForm.content"
                                    placeholder="请输入搜索内容"
                                    enter-button="查询"
                                    @search="getSportList()"
                            />
                        </a-input-group>
                    </a-form-model-item>
                    <a-button type="primary" placement="top" @click="doDel()">
                        批量删除
                    </a-button>
<!--                    <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="onDeleteGroup">-->
<!--                        <template slot="title">-->
<!--                        <p>是否删除选中的列表？</p>-->
<!--                        </template>-->
<!--                        <a-button type="primary"> 批量删除</a-button>-->
<!--                    </a-popconfirm>-->
                    <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="onOpenGroup" class="ml-20">
                        <template slot="title">
                            <p>是否开启选中的列表？</p>
                        </template>
                        <a-button type="primary"> 批量开启</a-button>
                    </a-popconfirm>
                    <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="onCloseGroup" class="ml-20">
                        <template slot="title">
                            <p>是否关闭选中的列表？</p>
                        </template>
                        <a-button type="primary"> 批量关闭</a-button>
                    </a-popconfirm>
                    <a-button type="primary" icon="download" @click="getExport()" class="ml-20">导出</a-button>
                    
                </a-col>
                <a-col :span="4">
                    <!--<a-form-model-item>
                        <a-button type="primary" icon="search" @click="getSportList()"> 查询</a-button>
                    </a-form-model-item>-->
                </a-col>
                <a-col :span="2">
                    <a-button type="primary" @click="employLable()" style="width: 100px;font-size: 10px;padding-left: 10px;text-align: center;"> 身份标签管理</a-button>
                </a-col>
                <a-col :span="2">
                    <a-button type="primary" @click="employEdit()" style="width: 80px;font-size: 10px;padding-left: 10px;text-align: center;"> 编辑员工卡</a-button>
                </a-col>
                <a-col :span="2">
                    <a-button type="primary" @click="employUserAdd()" class="maxbox" style="width: 80px;font-size: 10px;">新增会员</a-button>
                </a-col>
                <a-col :span="2">
                    <a-upload
                            name="file"
                            :action="upload"
                            :headers="headers"
                            :data="{ upload_dir: upload_dir}"
                            :file-list="avatarFileList"
                            :before-upload="beforeUploadFile"
                            @change="handleChangeUpload"
                    >
                        <a-button type="primary" style="width: 100px;">
                            <a-icon type="upload"/>
                            导入表格
                        </a-button>
                    </a-upload>
                </a-col>
            </a-row>
        </a-form-model>
        <div>
            <a-row>
                <a-col :span="2">
                    <span>示例表格</span>
                    <a href="/static/file/employee/demo.xls" target="_blank" style="margin-left: 20px">点击下载</a>
                </a-col>
            </a-row>
        </div>
        <a-table :columns="columns"
                 :data-source="data"
                 :pagination="pagination"
                 rowKey="user_id"
                 :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                 @change="handleTableChange">
            <span slot="status" slot-scope="text,record">
                     <a v-if="record.status==1" class="ml-10 inline-block">开启</a>
                     <a v-if="record.status==0" class="ml-10 inline-block">关闭</a>
                </span>

                  <span slot="action" slot-scope="text,record">
                          <a class="ml-10 inline-block" @click="checkAct(record.user_id,record.card_id)">消费记录</a>
                          <a class="ml-10 inline-block" @click="editAct(record.user_id)">编辑</a>
                          <a class="ml-10 inline-block" v-if="record.card_money == 0" @click="delAct(record.user_id)">删除</a>
                  </span>

            <span slot="card_money">
                会员卡余额
                <a-tooltip trigger="hover">
                  <template slot="title">会员卡余额总数量：{{ all_card_money }}</template>
                  <a-icon class="ml-10" type="question-circle" />
                </a-tooltip>
              </span>
            <span slot="card_score">
                会员卡积分
                <a-tooltip trigger="hover">
                  <template slot="title">会员卡积分总金额：{{ all_card_score }}</template>
                  <a-icon class="ml-10" type="question-circle" />
                </a-tooltip>
              </span>
        </a-table>
        <export-add ref="ExportAddModal" :exportUrl="exportUrl" :queryParam="searchForm"></export-add>
        <edit-employee-card-user ref="editEmployeeCardUser" @getSportList="getSportList"></edit-employee-card-user>
        <employee-card-order ref="editEmployeeCardOrder" @getSportList="getSportList"></employee-card-order>
        <!-- 身份标签列表 -->
        <employLable
            :visible="employLableVisible"
            @getDataList="getSportList"
            @handleCancel="employLableVisible = false"
        ></employLable>
<!--        批量删除-->
        <a-modal
            :visible="delvisible"
            title="批量删除"
            width="20%"
            @cancel="delCancel"
            @ok="onDeleteGroup"
        >
            员工卡余额大于0时不得删除，请先检查所选数据<br>
            当前登陆账号：{{mer.account}}<br>
            输入账号密码验证：<a-input v-model="pass" type="text" />
        </a-modal>
    </div>
</template>

<script>
    import lifeMerchantApi from '@/api/employee/merchant/index'
    import 'ant-design-vue/dist/antd.css'
    import 'viewerjs/dist/viewer.css'
    import Viewer from 'v-viewer'
    import Vue from 'vue'
    import ACol from "ant-design-vue/es/grid/Col";
    import EditEmployeeCardUser from "./modules/editEmployeeCardUser";
    import EmployeeCardOrder from "./modules/employeeCardOrder";
    import employLable from "./modules/employLable";
    import ExportAdd from "@/views/common/export/ExportAdd"
    Vue.use(Viewer)
    const columns = [
        {
            title: '会员名称',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
            align: "center"
        },
        {
            title: '会员卡号',
            dataIndex: 'card_number',
            scopedSlots: {customRender: 'card_number'},
            align: "center"
        },
        {
            title: '会员标签',
            dataIndex: 'lables',
            slots: {customRender: 'lables'},
            align: "center"
        },
        {
            title: '会员身份',
            dataIndex: 'identity',
            slots: {customRender: 'identity'},
            align: "center"
        },
        {
            title: '会员部门',
            dataIndex: 'department',
            scopedSlots: {customRender: 'department'},
            align: "center"
        },
        {
            title: '会员手机号',
            dataIndex: 'phone',
            scopedSlots: {customRender: 'phone'},
            align: "center"
        },
        {
            // title: '会员卡余额',
            dataIndex: 'card_money',
            slots: { title: 'card_money' },
            // scopedSlots: {customRender: 'card_money'},
            align: "center"
        },
        {
            // title: '会员卡积分',
            dataIndex: 'card_score',
            slots: { title: 'card_score' },
            // scopedSlots: {customRender: 'card_score'},
            align: "center"
        },
        {
            title: '会员卡状态',
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'},
            align: "center"
        },
        {
            title: '操作',
            dataIndex: 'user_id',
            key: 'user_id',
            scopedSlots: {customRender: 'action'},
        },
    ];
    export default {
        name: "EmployeeCardList",
        props: {
            // 存放路径
            upload_dir: {
                type: String,
                default: 'employee_file',
            },
        },
        components: {EmployeeCardOrder, EditEmployeeCardUser, ACol, employLable, ExportAdd},
        data() {
            return {
                selectedRowKeys: [], // 表格选中
                upload: '/v20/public/index.php/common/common.UploadFile/uploadFile',
                employLableVisible: false,
                avatarFileList: [],
                headers: {
                    authorization: 'authorization-text',
                },
                total_num: 0,
                visible: false,
                columns,
                data: [],
                areaList: [],
                card_id:0,
                formData: {},
                searchForm: {
                    type:0,
                    content: '', // 搜索内容
                },
                all_card_money: 0,
                all_card_score: 0,
                delvisible: false,
                pass: '',
                mer: [],
                exportUrl: lifeMerchantApi.exportUserCardList,
                pagination: {
                    page: 1,
                    current: 1,
                    total: 0,
                    pageSize: 10,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => this.onPageChange(page, pageSize),
                    onShowSizeChange: (page, pageSize) => this.onPageSizeChange(page, pageSize),
                    showTotal: (total) => `共 ${total} 条`,
                },
            }
        },
        activated() {
            this.getSportList()
        },
        created() {
            this.getSportList()
        },
        methods: {
            // 获取表格的选中与不选中
            onSelectChange (selectedRowKeys) {
                console.log('selectedRowKeys changed: ', selectedRowKeys)
                this.selectedRowKeys = selectedRowKeys
            },
            delCancel() {
                this.pass = ''
                this.delvisible = false
            },
            doDel() {
                if (!this.selectedRowKeys || this.selectedRowKeys.length === 0) {
                    this.$message.warning('请选择要删除的列表')
                    return false
                }
                this.delvisible = true
            },
            // 批量删除
            onDeleteGroup () {
                console.log(this.selectedRowKeys, '-----批量删除----------')
                // delUserCard
                if (!this.selectedRowKeys || this.selectedRowKeys.length === 0) {
                    this.$message.warning('请选择要删除的列表')
                    return false
                }
                if (this.pass == '') {
                    this.$message.warning('请输入账号密码')
                }

                this.request(lifeMerchantApi.delUserCard, { user_ids: this.selectedRowKeys, pass: this.pass }).then((res) => {
                    console.log(res)
                    this.data = []
                    this.selectedRowKeys = []
                    this.getSportList()
                    this.$message.success('删除成功')
                    this.delvisible = false
                })
            },
            // 批量开启
            onOpenGroup () {
                if (!this.selectedRowKeys || this.selectedRowKeys.length === 0) {
                    this.$message.warning('请选择要开启的列表')
                    return false
                }
                this.request(lifeMerchantApi.openUserCard, { user_ids: this.selectedRowKeys }).then((res) => {
                    console.log(res)
                    this.data = []
                    this.selectedRowKeys = []
                    this.getSportList()
                    this.$message.success('操作成功')
                })
            },
            // 批量关闭
            onCloseGroup () {
                if (!this.selectedRowKeys || this.selectedRowKeys.length === 0) {
                    this.$message.warning('请选择要关闭的列表')
                    return false
                }
                this.request(lifeMerchantApi.closeUserCard, { user_ids: this.selectedRowKeys }).then((res) => {
                    console.log(res)
                    this.data = []
                    this.selectedRowKeys = []
                    this.getSportList()
                    this.$message.success('操作成功')
                })
            },
            reset() {
                this.data = []
                this.getSportList()
            },
            beforeUploadFile(file){
                let isLt20M = file.size / 1024 / 1024 < 20;
                if (!isLt20M) {
                    this.$message.error('上传图片最大支持20MB!');
                    return false;
                }
                if (this.fileloading) {
                    this.$message.warning('当前还有文件上传中，请等候上传完成!');
                    return false;
                }
                return isLt20M;
            },
            handleChangeUpload(info) {
                console.log('########',info);
                if (info.file && !info.file.status && this.fileloading) {
                    return false;
                }
                if (info.file.status === 'uploading') {
                    if (this.fileloading) {
                        return false;
                    }
                    this.fileloading = true;
                    this.avatarFileList = info.fileList;
                }
                if (info.file.status !== 'uploading') {
                    this.fileloading = false;
                    console.log(info.file, info.fileList);
                }

                if(info.file.status == 'done' && info.file && info.file.response)
                {
                    let res= info.file.response;
                    if(res.status === 1000){
                        let file_url=res.data
                        this.avatarFileList = [];
                        console.log('--------',res.data.url);
                        this.request(lifeMerchantApi.loadExcel,{
                            fileUrl:file_url,
                            card_id:this.card_id,
                        }).then((res)=>{
                            this.$message.success('上传成功');
                            this.getSportList()
                        })
                    }
                }
                if (info.file.status == "removed" && info.file) {
                    console.log('data_arr1',this.data_arr);
                }
            },
            employEdit(){
                this.$router.push({ path: '/merchant/merchant.employee/editEmployeeCard'})
            },
            editAct(id) {
                this.$refs.editEmployeeCardUser.edit(id);
            },
            checkAct(user_id,card_id){
                this.$refs.editEmployeeCardOrder.edit(user_id,card_id)
            },
            employUserAdd(){
                if(this.card_id){
                    this.$refs.editEmployeeCardUser.add(this.card_id)
                }else{
                    this.$message.error('请先编辑商家卡')
                    return false
                }
            },
            getSportList() {
                this.request(lifeMerchantApi.getUserCardList, this.searchForm).then((res) => {
                    this.data = res.list
                    this.total_num = res.total
                    this.card_id=res.card_id
                    this.all_card_money = res.all_card_money
                    this.all_card_score = res.all_card_score
                    this.$set(this.pagination, 'total', res.total)
                    this.mer = res.mer
                })
            },
            delAct(id) {
                this.$confirm({
                    title: "是否删除会员",
                    content: '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        this.request(lifeMerchantApi.delData, {
                            user_id: id,
                        }).then((res) => {
                            this.getSportList()
                        })
                    },
                    onCancel: () => {
                        this.currentBtn = ''
                    },
                    class: 'test',
                })
            },
            handleUpdate() {
                this.getSportList()
            },
            handleTableChange(e) {
                if (e.current && e.current > 0) {
                    this.pagination['page'] = e.current
                }
            },
            // 页码变化
            onPageChange(page, pageSize) {
                this.pagination.page = page
                this.$set(this.pagination, 'current', page)
            },
            onPageSizeChange(page, pageSize) {
                this.$set(this.pagination, 'pageSize', pageSize)
            },

            employLable() {
                this.employLableVisible = true
            },
            getExport() {
                if (this.data.length > 0) {
                    this.$refs.ExportAddModal.exports()
                } else {
                    this.$message.warn('当前没有可以导出的内容')
                }
            },
        }
    }
</script>

<style scoped>
    .wrap {
        width: 100%;
        min-height: 100%;
    }

    .page-title {
        padding: 20px 30px;
        border-bottom: 1px solid #f1f1f1;
        font-size: 15px;
        font-weight: bold;
        color: #000000;
    }

    .content {
        margin: 20px 30px;
    }

    .ant-row-flex {
        margin-bottom: 12px;
    }

    .ant-form-item {
        display: flex;
        align-items: center;
    }

    .ant-form-item-control-wrapper {
        padding-right: 100px;
        flex: 1;
        box-sizing: border-box;
    }

    .ant-form-item-children {
        width: 100%;
        display: inline-block;
    }

    .total-performance {
        margin: 20px 0;
        padding: 0 30px;
        width: 100%;
        background-color: #e6f7ff;
        border: 1px solid #91d5ff;
        border-radius: 4px;
        font-size: 14px;
        line-height: 1;
    }

    .cr-f1 {
        color: #f1f1f1;
    }
    .card_tab{
        text-align: center;
       width: 140px;
       float: left;
       margin: 0 0 20px 0;
    }  
    .card_tab span{
        color:#000000;
        font-size: 15px;
        padding: 7px 10px;
    }
    .card_tab span.on{
        color: #1890ff;
        border-bottom: 2px solid #1890ffcc;
    }
</style>