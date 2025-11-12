<template>
    <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <div class="cout-fee-list-box">

            <div class="search-box">
                <a-row style="display: flex; flex-wrap: wrap;">
                    <a-col :md="4" :sm="20" style="width: 260px; display: flex; margin-top: 15px;">
                        <label style="margin-top: 5px;">票据编号：</label>
                        <a-input style="width: 170px" placeholder="请输入票号" v-model="search.ticket_number" />
                    </a-col>
                    <a-col :md="4" :sm="20" style="width: 190px; display: flex; margin-top: 15px;">
                        <label style="margin-top: 5px;">状态：</label>
                        <a-select style="width: 130px" v-model="search.ticket_status">
                            <a-select-option value="0">
                                全部
                            </a-select-option>
                            <a-select-option value="1">
                                未使用
                            </a-select-option>
                            <a-select-option value="2">
                                已占用
                            </a-select-option>
                            <a-select-option value="3">
                                已使用
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :md="4" :sm="20" style="width: 290px; display: flex; margin-top: 15px;">
                        <label style="margin-top: 5px;">小区筛选：</label>
                        <a-select style="width: 200px" v-model="search.village_id">
                            <a-select-option value="0" >
                                全部
                            </a-select-option>
                            <a-select-option :value="item.village_id" v-for="(item,index) in villageList" :key="index">
                                {{ item.village_name }}
                            </a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :md="6" :sm="20" style="width: 350px; display: flex; margin-top: 15px;">
                        <label style="margin-top: 5px;">创建时间筛选：</label>
                        <a-range-picker style="width: 240px" :allowClear="true" @change="dateOnChangeAddDate"
                            v-model="search.add_date" />
                    </a-col>

                    <a-col :md="6" :sm="24" class="suggestions_col"
                        style="width: 350px; display: flex; margin-top: 15px;">
                        <label style="margin-top: 5px;">使用时间筛选：</label>
                        <a-range-picker @change="dateOnChangeUseDate" :allowClear="true" v-model="search.use_date"
                            style="width: 240px;" />
                    </a-col>
                </a-row>
                <a-row style="display: flex; flex-wrap: wrap;">
                    <a-col :md="2" :sm="24" style="width: 90px; margin-top: 15px;padding-left: 1px;">
                        <a-button type="primary" icon="search" @click="searchTicketNumber()">
                            查询
                        </a-button>
                    </a-col>
                    <a-col :md="2" :sm="24" style="width: 100px; margin-top: 15px;padding-left: 20px;"
                        v-if="role_add==1">
                        <a-button type="primary" @click="addOrderTicketNumber()">新建票据</a-button>
                    </a-col>
                    <a-col :md="2" :sm="24" style="width: 100px; margin-top: 15px;padding-left: 30px;"
                        v-if="role_add==1">
                        <a-button type="primary" @click="upExcelImportData()">Excel导入</a-button>
                    </a-col>
                </a-row>
            </div>
            <div>
                <a-table :columns="columns" :data-source="list" :pagination="pagination" :rowKey="record=>record.id">

                    <span slot="ticket_status" slot-scope="text, record">
                        <span v-if="record.ticket_status*1<1" style="color:green;">{{record.ticket_status_str}}</span>
                        <span v-else-if="record.ticket_status*1==2"
                            style="color:red;">{{record.ticket_status_str}}</span>
                        <span v-else>{{record.ticket_status_str}}</span>
                    </span>
                    <span slot="opt_action" slot-scope="text, record">
                        <a-popconfirm v-if="role_del==1" class="ant-dropdown-link" ok-text="删 除" cancel-text="取 消"
                            @confirm="deleteConfirm(record.id)" @cancel="delCancel">
                            <template slot="title">
                                <p>确认删除?</p>
                                <p style="color:red;">您确认要删除【{{record.ticket_fill_number}}】这个票据编号吗？</p>
                            </template>
                            <a href="#"> 删 除 </a></a-popconfirm>
                            <a-divider type="vertical" v-if="record.ticket_status*1==1" />
                            <a-popconfirm v-if="record.ticket_status*1==1" class="ant-dropdown-link" ok-text="清除占用状态" cancel-text="取 消"
                                @confirm="updateConfirm(record.id)" @cancel="updateCancel">
                                <template slot="title">
                                    <p>确认清除占用状态?</p>
                                    <p style="color:red;">此票据编号【{{record.ticket_fill_number}}】最近占用时间是{{record.update_time_str}}</p>
                                    <p>如果是长时间被占用，建议清除占用状态，释放此票据</p>
                                </template>
                                <a href="#"> 清除占用状态 </a></a-popconfirm>
                    </span>
                </a-table>

            </div>

            <a-modal title="新建票据" :width="650" :visible="add_visible" :maskClosable="false"
                :confirmLoading="confirmLoading" @ok="handleAddSubmit" @cancel="handleAddCancel">
                <a-form-model :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-form-model-item label="票据编号前缀">
                        <a-input placeholder="例如TR" v-model="postArr.ticket_prefix" style="width:200px" /> <span
                            style="color:red;margin-left: 20px;">不填则直接显示数字编号</span>
                    </a-form-model-item>
                    <a-form-model-item label="票据编号起始数字">
                        <a-input-number placeholder="请填入一个开始数字" v-model="postArr.start_num" :min="0"
                            style="width:200px" />
                        <span style="color:red;margin-left: 20px;"> 编号自动生成的第一个数字</span>
                    </a-form-model-item>

                    <a-form-model-item label="生成票据编号的数量">
                        <a-input-number placeholder="请填入一个数量数字" v-model="postArr.total_num" :min="0" :max="300000"
                            style="width:200px" />
                        <span style="color:red;margin-left: 20px;"> 要自动生成票据编号的数量</span>
                    </a-form-model-item>
                    <a-form-model-item label="绑定生成小区">
                        <a-select style="width: 200px" v-model="postArr.village_id">
                            <a-select-option value="0">
                                请选择一个小区
                            </a-select-option>
                            <a-select-option :value="item.village_id" v-for="(item,index) in villageList" :key="index">
                                {{ item.village_name }}
                            </a-select-option>
                        </a-select> <span style="color:red;margin-left: 20px;"> 请选择一个要生成票据编号的小区</span>
                    </a-form-model-item>
                </a-form-model>

            </a-modal>


            <a-modal title="导入票据编号" :width="400" :visible="visibleUpload" :maskClosable="false"
                :confirmLoading="confirmLoading" @cancel="handleAddCancel" :footer="null">
                <a-spin :spinning="confirmLoading" :height="800">
                    <div>
                        <span>导入表格模版</span>
                        <a :href="demo_xurl" target="_blank" style="margin-left: 20px">点击下载</a>
                        <div style="color:#181717;margin-top: 10px;">请按照导入表格模版给定的字段填写数据，导入的数据将按照<span
                                style="color:red;">未使用</span>状态处理</span></div>
                    </div>
                    <div style="border-bottom: 1px solid #dad8d8;border-top: 1px solid #dad8d8;margin-top: 20px">
                        <span>上传Excel表格导入数据</span>
                        <a-upload name="file" :file-list="avatarFileList" :action="upload" :headers="headers"
                            :before-upload="beforeUploadFile" @change="handleChangeUpload">
                            <a-button type="primary" style="margin: 20px   20px  10px">
                                <a-icon type="upload" />
                                导 入
                            </a-button>
                        </a-upload>
                    </div>
                    <div style="margin-top: 20px" v-if="xshow">
                        <span>导入失败</span>
                        <a :href="xurl" target="_blank" style="margin-left: 20px">点击下载带入失败数据表格</a>
                    </div>
                </a-spin>
            </a-modal>

        </div>
    </div>
</template>
<script>
    import newChargeApi from '@/api/community/property/packages';
    import receivableOrderList from '@/views/community/village/charge/cashier/receivableOrderList.vue';
    import Vue from "vue";
    import {
        setCookie
    } from "@/utils/util";
    import store from '@/store';
    const columns = [

        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 120,
        },
        {
            title: '票据编号前缀',
            dataIndex: 'ticket_prefix',
            key: 'ticket_prefix',
            width: 130,
        },
        {
            title: '票据编号',
            dataIndex: 'ticket_fill_number',
            key: 'ticket_fill_number',
            width: 200,
        },
        {
            title: store.getters.config.house_name + '名称',
            dataIndex: 'village_name',
            key: 'village_name',
            width: 200,
        },
        {
            title: '状态',
            dataIndex: 'ticket_status_str',
            key: 'ticket_status_str',
            scopedSlots: {
                customRender: 'ticket_status'
            },
            width: 120,
        },
        {
            title: '使用时间',
            dataIndex: 'use_time_str',
            key: 'use_time_str',
            width: 180,
        },
        {
            title: '创建时间',
            dataIndex: 'add_time_str',
            key: 'add_time_str',
            width: 180,
        },
        {
            title: '操作',
            dataIndex: '',
            key: '',
            scopedSlots: {
                customRender: 'opt_action'
            },
        },
    ];
    export default {
        name: 'orderTicketNumber',
        components: {},
        data() {
            return {
                labelCol: {
                    span: 6
                },
                wrapperCol: {
                    span: 18
                },
                list: [],
                avatarFileList: [],
                upload: '/v20/public/index.php/community/property_api.OrderTicketNumber/uploadFiles?upload_dir=/villageImport/tmp',
                headers: {
                    authorization: 'authorization-text',
                },
                columns,
                search: {
                    ticket_number: '',
                    ticket_status: "0",
                    village_id: "0",
                    add_date: [],
                    use_date: []
                },
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 10,
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onChange: (page, pageSize) => this.onTableChange(page, pageSize) //点击页码事件
                },
                page: 1,
                villageList: [],
                loading: false,
                add_visible: false,
                confirmLoading: false,
                postArr: {
                    ticket_prefix: '',
                    start_num: 1,
                    total_num: '',
                    village_id: "0",
                },
                role_del: 1,
                role_add: 1,
                visibleUpload: false,
                demo_xurl: '/static/file/village_order_ticket_number.xls',
                xshow: false,
                xurl: '',
                data_arr: [],
            };
        },
        mounted() {
            this.getOrderTicketNumberList()
            this.getPropertyVillageList()
        },
        methods: {

            onTableChange(page, pageSize) {
                this.page = page
                this.pagination.current = page
                this.getOrderTicketNumberList()
            },
            addOrderTicketNumber() {
                this.add_visible = true;
                this.confirmLoading = false;
                this.postArr = {
                    ticket_prefix: '',
                    start_num: 1,
                    total_num: '',
                    village_id: "0",
                };
            },
            searchTicketNumber() {
                this.page = 1;
                this.pagination.current = 1;
                this.getOrderTicketNumberList()
            },
            beforeUploadFile(file) {
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
                if (info.file.status == 'done' && info.file && info.file.response) {
                    let res = info.file.response;
                    if (res.status === 1000) {
                        this.page = 1;
                        this.pagination.current = 1;
                        this.data_arr.push(res.data);
                        console.log('data_arr', this.data_arr);
                        this.avatarFileList = info.fileList;
                        this.request('/community/property_api.OrderTicketNumber/handleImportExcel', {
                            xfile: res.data.url,
                        }).then((xres) => {
                            if (xres.error_code < 1) {
                                this.$message.success('上传导入成功');
                                this.getOrderTicketNumberList();
                            } else {
                                this.xurl=xres.fail_url;
                                this.xshow=true;
                                this.getOrderTicketNumberList();
                                window.location.href = xres.fail_url;
                            }
                        })
                        this.visibleUpload = false;
                    } else {
                        this.$message.error(info.file.response.msg);
                        this.avatarFileList = [];
                        for (var i in info.fileList) {
                            if (info.fileList[i]) {
                                let info_1 = info.fileList[i];
                                console.log('info_1', info_1);
                                if (info_1 && info_1.response && info_1.response.status === 1000) {
                                    this.avatarFileList.push(info_1)
                                }
                            }
                        }
                    }
                }
                if (info.file.status == "removed" && info.file) {
                    let res = info.file.response;
                    if (res && res.status === 1000) {
                        this.data_arr = [];
                        for (var i in info.fileList) {
                            if (info.fileList[i]) {
                                let info_msg = info.fileList[i];
                                if (info_msg && info_msg.response && info_msg.response.status === 1000) {
                                    this.data_arr.push(info_msg.response.data)
                                }
                            }
                        }
                    }
                    this.avatarFileList = info.fileList;

                }
            },
            handleAddSubmit() {
                if (!this.postArr.start_num) {
                    this.$message.error('请填写票据编号起始数字！')
                    return false
                }
                if (!this.postArr.total_num) {
                    this.$message.error('请填写生成票据编号的数量！')
                    return false
                }

                if (!this.postArr.village_id) {
                    this.$message.error('请选择一个绑定生成小区！')
                    return false
                }
                this.confirmLoading = true;
                this.request(newChargeApi.generateTicketNumber, this.postArr).then((res) => {
                    this.$message.success(res.msg)
                    this.handleAddCancel();
                    this.getOrderTicketNumberList()
                    this.confirmLoading = false;
                }).catch((error) => {
                    this.confirmLoading = false;
                })
            },
            handleAddCancel() {
                this.add_visible = false;
                this.confirmLoading = false;
                this.postArr = {
                    ticket_prefix: '',
                    start_num: 1,
                    total_num: '',
                    village_id: "0",
                };
                this.page = 1;
                this.pagination.current = 1;
                this.visibleUpload = false;
            },
            getPropertyVillageList() {
                this.request(newChargeApi.getPropertyVillageList, {
                        type: 'selectdata'
                    })
                    .then((res) => {
                        this.villageList = res.list
                    })
            },

            dateOnChangeAddDate(date, dateString) {
                this.search.add_date = dateString
            },
            dateOnChangeUseDate(date, dateString) {
                this.search.use_date = dateString
            },
            getOrderTicketNumberList() {
                this.postArr = {
                    ticket_prefix: '',
                    start_num: 1,
                    total_num: '',
                    village_id: "0",
                };
                this.search.page=this.pagination.current;
                this.request(newChargeApi.getOrderTicketNumberList, this.search)
                    .then((res) => {
                        this.list = res.list;
                        this.pagination.pageSize = res.page_size
                        this.pagination.total = res.total
                        if (res.role_del) {
                            this.role_del = res.role_del;
                        }
                        if (res.role_add) {
                            this.role_add = res.role_add;
                        }
                    }).catch((error) => {
                        this.loading = false
                    })
            },
            //删除
            deleteConfirm(idd) {
                this.request(newChargeApi.delTicketNumber, {
                        'idd': idd
                    })
                    .then((res) => {
                        this.$message.success('操作成功')
                        this.getOrderTicketNumberList();
                    }).catch((error) => {
                        this.loading = false
                    })
            },
            //取消删除
            delCancel() {

            },
            updateCancel(){
                
            },
            //更新
            updateConfirm(idd) {
                this.request(newChargeApi.clearTicketNumberStatus, {
                        'idd': idd
                    })
                    .then((res) => {
                        this.$message.success('操作成功')
                        this.getOrderTicketNumberList();
                    }).catch((error) => {
                        this.loading = false
                    })
            },
            // 导入Excel
            upExcelImportData() {
                this.avatarFileList=[];
                this.data_arr=[];
                this.xurl='';
                this.xshow=false;
                this.visibleUpload = true;

            },
        },
    };
</script>
<style scoped>
    .cout-fee-list-box {
        margin: 10px 20px 10px 20px;
        background-color: white;
    }

    .cout-fee-list-box .search-box {
        padding: 0px 10px 10px 10px;
        border: 1px solid #e4dfdf;
        border-top: none;
    }

    .txt-green {
        color: #0fb70f;
    }

    .txt-red {
        color: red;
    }

    .table-operator {
        margin-bottom: 10px;
    }

    .count-fee-list-tip-box {
        padding: 0px 4px;
    }
</style>