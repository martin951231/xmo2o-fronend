<template>
    <a-drawer width="800" :visible="visible" title="合同类型管理" @close="onClose">
        <a-button @click="addClassify" type="primary">添加合同类型</a-button>
        <div class="table_con">
            <a-table :rowKey="record=>record.id" :columns="tableColumns" :loading="tableLoading" :data-source="tableList" @change="handleTableChange">
                <template slot="action" slot-scope="text, record">
                    <a-button type="link" @click="editClassiify(record)">编辑</a-button>
                    <a-divider type="vertical" />
                    <a-popconfirm
                        title="确定删除此项?"
                        ok-text="是"
                        cancel-text="否"
                        @confirm="deleteConfirm(record.id)"
                        @cancel="()=>{}">
                            <a-button style="color: red;" type="link">删除</a-button>
                    </a-popconfirm>
                </template>
            </a-table>
        </div>
        <editClassify :visible="editVisible" :classifyInfo="classifyInfo" @close="closeClassify" />
    </a-drawer>
</template>

<script>
    import editClassify from './editClassify.vue';
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        components: {
            editClassify
        },
        watch: {
            visible: {
                handler(val){
                    if(val){
                        this.getTableList()
                    }
                }
            }
        },
        data(){
            return{
                editVisible: false,
                pageInfo: {
                    pageSize: 10,
                    current: 1,
                    total: 0
                },
                classifyInfo: {},
                tableLoading: false,
                tableColumns: [
                    {
                        title: '合同类型名称',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: '状态',
                        dataIndex: 'status_text',
                        key: 'status_text',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        scopedSlots: {
                            customRender: 'action'
                        },
                    },
                ],
                tableList: []
            }
        },
        methods: {
            onClose(){
                this.$emit('close')
            },
            getTableList(){
                let params = {}
                Object.assign(params, this.pageInfo)
                params.page = this.pageInfo.current
                this.tableLoading = true
                this.request('/community/platform.contract.Classify/getClassifyList', params).then(res=> {
                    this.tableList = res.list 
                    this.pageInfo.total = res.count
                    this.tableLoading = false
                }).catch(err=> {
                    this.tableLoading = false
                })
            },
            
            handleTableChange({
                current,
                pageSize
            }) {
                this.pageInfo.current = current
                this.pageInfo.pageSize = pageSize
                this.getTableList()
            },
            
            deleteConfirm(id){
                this.request('/community/platform.contract.Classify/deleteClassifyInfo', {id, }).then(res=>{
                    this.getTableList()
                    this.$message.success('删除成功！')
                })
            },
            
            addClassify(){
                this.editVisible = true
                this.classifyInfo = {}
            },
            
            editClassiify(info){
                this.editVisible = true
                this.classifyInfo = info
            },
            
            closeClassify(flag){
                this.editVisible = false
                this.classifyInfo = {}
                if(flag){
                    this.getTableList()
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .table_con{
        margin-top: 10px;
    }
</style>