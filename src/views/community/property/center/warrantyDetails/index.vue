<template>
    <div class="waranty_details" style="margin:24px 0 0;">
        <div class="top_search">
            <a-button type="primary" icon="plus" @click="editVisible = true">添加</a-button>
            <a-button style="margin-left: 10px;" type="primary" @click="applyVisible = true">申请记录</a-button>
        </div>
        <a-table style="margin-top: 10px;" :rowKey="record=>record.id" :loading="tableLoading" :columns="tableColumns" :data-source="tableList" :pagination="pagination" @change="handleTableChange">
            <span slot="action" slot-scope="text, record">
                <a @click="editThis(record)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm class="ant-dropdown-link" title="确认删除?" ok-text="是" cancel-text="否"
                    @confirm="deleteConfirm(record)" @cancel="()=>{}">
                    <a style="color: red;" href="#">删除</a>
                </a-popconfirm>
            </span>
        </a-table>
        
        <editModal :visible="editVisible" :warranty_id="warranty_id" @close="closeEdit" />
        <applyList :visible="applyVisible" @close="closeApply" />
    </div>
</template>
<script>
    const tableColumns = [{
            title: '类别名莉',
            dataIndex: 'category_name',
            key: 'category_name',
        },{
            title: '上级类别',
            dataIndex: 'fid_category_name',
            key: 'fid_category_name',
        },{
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },{
            title: '操作',
            key: 'action',
            dataIndex: '',
            scopedSlots: {
                customRender: 'action'
            }
        },
    ];
    import editModal from './modules/editModal.vue';
    import applyList from './modules/applyList.vue';
    export default {
        name: 'warantyDetails',
        data() {
            return {
                applyVisible: false,
                editVisible: false,
                warranty_id: 0,
                tableList: [],
                tableLoading: false,
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 10
                },
                tableColumns,
            };
        },
        components: {
            editModal,
            applyList
        },
        mounted() {
            this.getWarrantyList()
        },
        methods: {
            getWarrantyList() {
                let that = this
                that.tableLoading = true
                that.request('/community/property_api.workorder.CommunityQuality/getList', {
                    page: that.pagination.current,
                    pageSize: that.pagination.pageSize
                }).then((res) => {
                    that.tableLoading = false
                    that.tableList = res.list;
                    that.pagination.total = res.count ? res.count : 0
                    that.pagination.pageSize = res.total_limit ? res.total_limit : 10
                }).catch(err=>{
                    that.tableLoading = false
                })
            },
            handleTableChange(e) {
                let that = this
                if (e.current && e.current > 0) {
                    that.pagination.current = e.current;
                    that.pagination.pageSize = e.pageSize;
                    that.getWarrantyList()
                }
            },
            editThis(record){
                this.warranty_id = record.id
                this.editVisible = true
            },
            closeEdit(flag){
                this.editVisible = false
                this.warranty_id = 0
                if(flag){
                    this.getWarrantyList()
                }
            },
            
            closeApply(){
                this.applyVisible = false
            },
            
            deleteConfirm(record) {
                this.request('/community/property_api.workorder.CommunityQuality/deleteCommunityQuality', {
                        'id': record.id
                }).then((res) => {
                    this.getWarrantyList()
                    this.$message.success('删除成功')
                })
            },
        },
    };
</script>
<style lang="less" scoped>
    .waranty_details {
        background: #fff;
        padding: 20px;
        .top_search{
            width: 100%;
            display: flex;
            align-items: center;
        }
    }
</style>