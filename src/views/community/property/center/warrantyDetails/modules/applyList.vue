<template>
    <a-modal title="申请列表" :width="1300" :visible="visible" @cancel="onClose" :footer="null" centered>
        <a-table style="margin-top: 10px;" :rowKey="record=>record.id" :loading="tableLoading" :columns="tableColumns" :data-source="tableList" :pagination="pagination" @change="handleTableChange">
            <span slot="action" slot-scope="text, record">
                <a @click="lookDetail(record)">查看</a>
                <a-divider v-if="record.status == 0" type="vertical" />
                <a v-if="record.status == 0" @click="vertifyThis(record)">审核</a>
                <a-divider type="vertical" />
                <a-popconfirm class="ant-dropdown-link" title="确认删除?" ok-text="是" cancel-text="否"
                    @confirm="deleteConfirm(record)" @cancel="()=>{}">
                    <a style="color: red;">删除</a>
                </a-popconfirm>
            </span>
        </a-table>
        <applyDetail :visible="detailVisivle" :apply_id="apply_id" @close="closeApply" />
        <vertifyModal :visible="vertifyVisible" :applyInfo="applyInfo" @close="closeVertify" />
    </a-modal>
</template>

<script>
    const tableColumns = [{
            title: '小区名称',
            dataIndex: 'village_name',
            key: 'village_name',
        },{
            title: '类别名称',
            dataIndex: 'category_name',
            key: 'category_name',
        },{
            title: '修改后类别名称',
            dataIndex: 'change_name',
            key: 'change_name',
        },{
            title: '申请原因',
            dataIndex: 'reason',
            key: 'reason',
        },{
            title: '申请时间',
            dataIndex: 'apply_time_text',
            key: 'apply_time_text',
        },{
            title: '申请人',
            dataIndex: 'apply_name',
            key: 'apply_name',
        },{
            title: '状态',
            dataIndex: 'status_text',
            key: 'status_text',
        },{
            title: '操作',
            key: 'action',
            dataIndex: '',
            scopedSlots: {
                customRender: 'action'
            }
        },
    ];
    import applyDetail from './applyDetail.vue';
    import vertifyModal from './vertifyModal.vue';
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        components: {
            applyDetail,
            vertifyModal
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
        
        data() {
            return {
               tableList: [],
               tableLoading: false,
               pagination: {
                   current: 1,
                   pageSize: 10,
                   total: 10
               },
               tableColumns,
               detailVisivle: false,
               vertifyVisible: false,
               applyInfo: {},
               apply_id: 0,
            };
        },
        methods: {
            getTableList() {
                let that = this
                that.tableLoading = true
                that.request('/community/property_api.workorder.CommunityQuality/applyCommunityQualityList', {
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
                if (e.current && e.current > 0) {
                    that.pagination.current = e.current;
                    that.pagination.pageSize = e.pageSize;
                    that.getTableList()
                }
            },
            
            deleteConfirm(record) {
                this.request('/community/property_api.workorder.CommunityQuality/deleteChangeApply', {
                        'id': record.id
                }).then((res) => {
                    this.getTableList()
                    this.$message.success('删除成功')
                })
            },
            
            onClose(){
                this.$emit('close')
            },
            
            lookDetail(record){
                this.detailVisivle = true
                this.apply_id = record.id
            },
            
            vertifyThis(record){
                this.vertifyVisible = true
                this.applyInfo = record
            },
            
            closeVertify(flag){
                if(flag){
                    this.getTableList()
                }
                this.vertifyVisible = false
                this.applyInfo = {}
            },
            
            closeApply(){
                this.detailVisivle = false
                this.apply_id = 0
            }
        },
    };
</script>

<style lang="less" scoped>
    /deep/ textarea {
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
</style>