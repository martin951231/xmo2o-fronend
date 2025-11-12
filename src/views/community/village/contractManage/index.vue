<template>
    <div class="contract_manage">
        <div class="top_search">
            <a-form-model class="form_con" :model="searchForm" type="vertical">
                <a-form-model-item class="form_item" label="合同编号">
                    <a-input placeholder="请输入" v-model="searchForm.contract_number" />
                </a-form-model-item>
                <a-form-model-item class="form_item" label="合同名称">
                    <a-input placeholder="请输入" v-model="searchForm.contract_name" />
                </a-form-model-item>
                <a-form-model-item class="form_item" label="小区名称">
                    <a-input placeholder="请输入" v-model="searchForm.village_name" />
                </a-form-model-item>
                <a-form-model-item class="form_item" label="合同状态">
                    <a-select v-model="searchForm.status" placeholder="请选择">
                        <a-select-option :value="item.value" v-for="(item, index) in statusList" :key="index">
                            {{item.label}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item class="form_item" label="合同类别">
                    <a-select v-model="searchForm.classify_id" placeholder="请选择">
                        <a-select-option :value="item.value" v-for="(item, index) in classifyList" :key="index">
                            {{item.label}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item class="form_item" label="搜索">
                    <a-button type="primary" @click="handleSearch">搜索</a-button>
                    <a-button @click="clearSearch" style="margin-left: 10px;">清空</a-button>
                </a-form-model-item>
            </a-form-model>
        </div>
        
        <div class="btn_con">
            <a-button style="margin-right: 10px;" type="primary" @click="addContract" v-if="role_auth_add==1">添加合同</a-button>
            <!-- <a-button style="margin-right: 10px;" type="primary" @click="contractClassify">合同类型管理</a-button>
            <a-button type="primary" @click="contractSet">合同到期提醒设置</a-button> -->
        </div>
        
        <div class="table_con">
            <a-table :rowKey="record=>record.id" :columns="tableColumns" :loading="tableLoading" :data-source="contractList" @change="handleTableChange">
                <template slot="action" slot-scope="text, record">
                    <a-button type="link" @click="editContract(record.id)" v-if="record.role_auth_edit==1">编辑</a-button>
                    <a-divider type="vertical" v-if="record.role_auth_delete==1"/>
                    <a-popconfirm
                        title="确定删除此项?"
                        ok-text="是"
                        cancel-text="否"
                        @confirm="deleteConfirm(record.id)"
                        @cancel="()=>{}">
                            <a-button style="color: red;" type="link" v-if="record.role_auth_delete==1">删除</a-button>
                     </a-popconfirm>
                </template>
            </a-table>
        </div>
        <addContractCom :visible="addVisible" :contractId="contractId" @close="closeAdd" />
        <classifyCom :visible="classifyVisible" @close="closeClassify" />
        <timeSet :visible="setVisible" @close="setVisible = false" />
    </div>
</template>

<script>
    import addContractCom from './module/addContractCom.vue';
    import classifyCom from './module/classifyCom.vue';
    import timeSet from './module/timeSet.vue';
    export default {
        components: {
            addContractCom,
            classifyCom,
            timeSet
        },
        data() {
            return {
                addVisible: false,
                classifyVisible: false,
                setVisible: false,
                contractId: '',
                searchForm: {
                    contract_number: '',
                    contract_name: '',
                    status: undefined,
                    classify_id: undefined,
                    village_name: ''
                },
                statusList: [],
                classifyList: [],
                contractList: [],
                pageInfo: {
                    pageSize: 10,
                    current: 1,
                    total: 0
                },
                tableLoading: false,
                tableColumns: [
                    {
                        title: '合同编号',
                        dataIndex: 'contract_number',
                        key: 'contract_number',
                    },
                    {
                        title: '合同名称',
                        dataIndex: 'contract_name',
                        key: 'contract_name',
                    },
                    {
                        title: '合同类型',
                        dataIndex: 'classify_name',
                        key: 'classify_name',
                    },
                    {
                        title: '合同开始时间',
                        key: 'contract_start_time_text',
                        dataIndex: 'contract_start_time_text',
                    },
                    {
                        title: '合同到期时间',
                        key: 'contract_end_time_text',
                        dataIndex: 'contract_end_time_text',
                    },
                    {
                        title: '合同状态',
                        key: 'status_text',
                        dataIndex: 'status_text',
                    },
                    {
                        title: '小区名称',
                        key: 'village_name',
                        dataIndex: 'village_name',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        scopedSlots: {
                            customRender: 'action'
                        },
                    },
                ],
                role_auth_add: 0,
            }
        },

        mounted() {
            this.getSelectList()
            this.getContractList()
        },

        methods: {
            getSelectList() {
                this.request('/community/village_api.contract.Index/getClassifyList').then(res => {
                    this.classifyList = res.selectList
                })
            },

            getContractList() {
                let params = {}
                Object.assign(params, this.pageInfo)
                Object.assign(params, this.searchForm)
                params.page = this.pageInfo.current
                this.tableLoading = true
                this.request('/community/village_api.contract.Index/getList', params).then(res => {
                    this.statusList = res.statusSelect
                    this.contractList = res.list
                    this.pageInfo.total = res.count
                    this.role_auth_add = res.role_auth_add
                    this.tableLoading = false
                }).catch(err=>{
                    this.tableLoading = false
                })
            },

            handleTableChange({
                current,
                pageSize
            }) {
                this.pageInfo.current = current
                this.pageInfo.pageSize = pageSize
                this.getContractList()
            },

            handleSearch() {
                this.getContractList()
            },
            
            clearSearch(){
                this.searchForm = {
                    contract_number: '',
                    contract_name: '',
                    status: undefined,
                    classify_id: undefined,
                    village_name: ''
                }
                this.getContractList()
            },
            
            addContract(){
                this.addVisible = true
                this.contractId = ''
            },
            
            editContract(id){
                this.addVisible = true
                this.contractId = id
            },
            
            closeAdd(flag){
                this.addVisible = false
                this.contractId = ''
                if(flag){
                    this.getContractList()
                }
            },
            
            deleteConfirm(id){
                this.request('/community/village_api.contract.Index/deleteContractInfo', {id, }).then(res=>{
                    this.getContractList()
                    this.$message.success('删除成功！')
                })
            },
            
            contractClassify(){
                this.classifyVisible = true
            },
            
            closeClassify(){
                this.classifyVisible = false
            },
            
            contractSet(){
                this.setVisible = true
            }
        }
    }
</script>

<style lang="less" scoped>
    .contract_manage {
        padding: 20px;
        background: #fff;
        margin-top: 10px;

        .top_search {
            .form_con {
                display: flex;
                flex-wrap: wrap;
                transform: translateX(-10px);

                .form_item {
                    width: 150px;
                    margin-left: 10px;
                }
            }
        }
        
        .btn_con{
            
        }
        
        .table_con{
            margin-top: 10px;
        }
    }
</style>