<template>
    <a-modal title="申请列表" :width="1300" :visible="visible" @cancel="onClose" :footer="null" centered>
        <a-table style="margin-top: 10px;" :rowKey="record=>record.id" :loading="tableLoading" :columns="tableColumns" :data-source="tableList" :pagination="pagination" @change="handleTableChange">
            <span slot="action" slot-scope="text, record">
                <a @click="lookDetail(record)">查看</a>
                <a-divider type="vertical" />
                <a-popconfirm class="ant-dropdown-link" title="确认删除?" ok-text="是" cancel-text="否"
                    @confirm="deleteConfirm(record)" @cancel="()=>{}">
                    <a style="color: red;">删除</a>
                </a-popconfirm>
            </span>
        </a-table>
        <applyDetail :visible="detailVisivle" :apply_id="apply_id" @close="closeApply" />
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
    import Vue from 'vue';
    import {
        toRefs,
        ref,
        watch,
        reactive,
        onMounted,
        onUpdated,
        defineComponent
    } from '@vue/composition-api';
    import moment from 'moment';
    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        components: {
            applyDetail
        },
        setup(props, context) {
            const state = reactive({
                tableList: [],
                tableLoading: false,
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 10
                },
                tableColumns,
                detailVisivle: false,
                apply_id: 0,
            })
            
            const getTableList = () => {
                state.tableLoading = true
                Vue.prototype.request('/community/village_api.workorder.CommunityQuality/applyCommunityQualityList', {
                    page: state.pagination.current,
                    pageSize: state.pagination.pageSize
                }).then((res) => {
                    state.tableLoading = false
                    state.tableList = res.list;
                    state.pagination.total = res.count ? res.count : 0
                    state.pagination.pageSize = res.total_limit ? res.total_limit : 10
                }).catch(err=>{
                    state.tableLoading = false
                })
            }
            
            const handleTableChange = (e) => {
                if (e.current && e.current > 0) {
                    state.pagination.current = e.current;
                    state.pagination.pageSize = e.pageSize;
                    getTableList()
                }
            }
            
            const deleteConfirm = (record) => {
                Vue.prototype.request('/community/village_api.workorder.CommunityQuality/deleteChangeApply', {
                        'id': record.id
                }).then((res) => {
                    getTableList()
                    Vue.prototype.$message.success('删除成功')
                })
            }
            
            const onClose = () => {
                context.emit('close')
            }
            
            const lookDetail = (record) => {
                state.detailVisivle = true
                state.apply_id = record.id
            }
            
            const closeApply = () => {
                state.detailVisivle = false
                state.apply_id = 0
            }
            
            watch(()=>props.visible, val=>{
                if(val){
                    getTableList()
                }
            })
            
            return {
                handleTableChange,
                deleteConfirm,
                onClose,
                lookDetail,
                closeApply,
                ...toRefs(state)
            }
        }
    })
</script>

<style lang="less" scoped>
    /deep/ textarea {
        overflow-x: hidden;
        overflow-y: scroll !important;
    }
</style>