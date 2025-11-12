<template>
    <div class="package-list ant-pro-page-header-wrap-children-content" style="margin:24px 0 0;">
        <a-card :bordered="false">
            <div class="search-box">
                <a-row :gutter="48" style="margin-bottom: 12px">
                    <a-col :md="4" :sm="10">
                        <label style="margin-top: 5px;">姓名：</label> <a-input style="width: 172px" placeholder="请输入姓名"
                            v-model="search.xname" />
                    </a-col>
                    <a-col :md="4" style="padding-left: 0px;padding-right: 10px;">
                        <label style="margin-top: 5px;">手机号：</label> <a-input style="width: 180px" placeholder="请输入手机号"
                            v-model="search.phone" />
                    </a-col>
                    <a-col :md="6" style="padding-left: 0px;padding-right: 1px;">
                        <a-button type="primary" icon="search" @click="searchList()">
                            查询
                        </a-button>
                        <a-button style="margin-left: 20px;" @click="clearThis()">清空</a-button>
                        <a-button v-if="role_add==1" type="primary" style="margin-left: 25px;" @click="$refs.addEditWorker.addMember()">添加人员</a-button>
                    </a-col>

                </a-row>

            </div>

            <a-table :columns="columns" :data-source="list" :pagination="pagination" @change="tableChange"
                :row-key="record => record.hw_id" :loading="loading">
                <span slot="status" slot-scope="status,record,index">
                    <a-tag v-if="record.status*1==1" color="green"> {{record.status_str}} </a-tag>
                    <a-tag v-else-if="record.status*1==0" color="red"> {{record.status_str}} </a-tag>
                    <a-tag v-else-if="record.status*1==4 " color="#e38307"> {{record.status_str}} </a-tag>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a v-if="record.status*1!=0 && record.status*1!=4 && role_disable==1" @click="disableAccount(record)">禁用账号</a>
                    <a-divider type="vertical" v-if="record.status*1!=0 && record.status*1!=4 && role_disable==1" />
                    
                    <a @click="$refs.addEditWorker.editMember(record)" v-if="record.status*1==0 || record.status*1==4">查看</a>
                    <a @click="$refs.addEditWorker.editMember(record)" v-if="record.status*1>0 &&  record.status*1!=4 && role_edit==1">编辑</a>
                    
                    <a-divider type="vertical" v-if="role_del==1" />
                    <a-popconfirm v-if="role_del==1" class="ant-dropdown-link" ok-text="删 除" cancel-text="取 消"
                        @confirm="deleteConfirm(record.hw_id)" @cancel="delCancel">
                        <template slot="title">
                            <p>确认删除?</p>
                            <p style="color:red;">如果删除会同步删除该账号关联的所有登录！</p>
                            <p style="color:red;">删除后不可恢复！请谨慎操作。</p>
                        </template>
                        <a href="#">删除</a></a-popconfirm>
                </span>

            </a-table>
        </a-card>
        <add-edit-worker :height='800' :width="1500" ref="addEditWorker" @ok="handleOks" />
    </div>
</template>
<script>
    import propertyApi from '@/api/community/property/packages';
    import addEditWorker from "@/views/community/property/framework/addEditWorker";
    const columns = [

        {
            title: '编号（工号）',
            dataIndex: 'job_number',
            key: 'job_number',
            width: 120
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: 130
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            width: 140
        },
        {
            title: '账号',
            dataIndex: 'account',
            key: 'account',
            width: 140
        },
        {
            title: '身份证',
            dataIndex: 'id_card',
            key: 'id_card',
            width: 180,
        },
        {
            title: '性别',
            dataIndex: 'gender_str',
            key: 'gender_str',
            width: 100
        },
        {
            title: '状态',
            dataIndex: 'status_str',
            key: 'status_str',
            width: 110,
            scopedSlots: {
                customRender: 'status'
            }
        },
        {
            title: '入职时间',
            dataIndex: 'job_create_time_str',
            key: 'job_create_time_str',
            width: 130,
        },
        {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
        },
        {
            title: '操作',
            key: 'action',
            dataIndex: '',
            scopedSlots: {
                customRender: 'action'
            }
        },
    ];
    export default {
        name: 'propertyWorker',
        components: {
            addEditWorker
        },
        data() {
            return {
                list: [],
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 10
                },
                search: {
                    page: 1,
                    xname: '',
                    phone: ''
                },
                page: 1,
                id: 0,
                columns,
                loading: false,
                role_add:0,
                role_edit: 0,
                role_disable:0,
                role_del:0,
            };
        },
        mounted() {
            this.getWorkerList()
        },
        methods: {
            //列表数据
            getWorkerList() {
                this.loading = true
                this.search.page = this.page;
                this.request(propertyApi.getPropertyWorkerList, this.search)
                    .then((res) => {
                        this.loading = false
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.role_add=0;
                        this.role_edit=0;
                        this.role_disable=0;
                        this.role_del=0;
                        if(res.role_add!=undefined){
                            this.role_add=res.role_add;
                        }
                        if(res.role_edit!=undefined){
                            this.role_edit=res.role_edit;
                        }
                        if(res.role_disable!=undefined){
                            this.role_disable=res.role_disable;
                        }
                        if(res.role_del!=undefined){
                            this.role_del=res.role_del;
                        }
                    }).catch((error) => {
                        this.loading = false
                    })
            },
            disableAccount(record) {
                let hw_id = record.hw_id;
                var _this = this;
                this.$confirm({
                    title: '禁用确认',
                    content: '确认禁用该工作人员？如果禁用会同步禁用该账号关联的所有登录，禁用后不可恢复！请谨慎操作。',
                    onOk() {
                        _this.request(propertyApi.disableWorkerAccount, {
                                hw_id: hw_id
                            })
                            .then((res) => {
                                _this.$message.success('操作成功')
                                _this.getWorkerList()
                            })
                    },
                    onCancel() {},
                });
            },
            //删除
            deleteConfirm(hw_id) {
                this.request(propertyApi.delPropertyWorker, {
                        'hw_id': hw_id
                    })
                    .then((res) => {
                        this.$message.success('操作成功')
                        this.getWorkerList();
                    })
            },
            //取消删除
            delCancel() {

            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.page = 1;
                let val = {
                    current: 1,
                    pageSize: 10,
                    total: 10
                }
                this.tableChange(val)
                // this.getList()
            },
            //分页
            tableChange(e) {
                let _this = this;
                if (e.current && e.current > 0) {
                    _this.pagination.current = e.current;
                    this.page = e.current;
                    _this.getWorkerList()
                }
            },
            //取消
            cancel() {

            },
            clearThis() {

                this.search = {
                    page: 1,
                    xname: '',
                    phone: ''
                };
                this.page = 1;
                this.getWorkerList()
            },
            //提交
            handleOks() {
                this.getWorkerList();
            },
        },
    };
</script>
<style lang="less" scoped>
    .txt-green {
        color: #0fb70f;
    }

    .txt-red {
        color: red;
    }

    .table-operator {
        margin-bottom: 10px;
    }
</style>