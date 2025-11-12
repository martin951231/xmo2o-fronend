<template>
  <div class="table-operator" style="margin-top: 25px">
    <a-card :bordered="false">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()">添加</a-button>
        <a-table :columns="columns" :data-source="list"
                :pagination="pagination"
                style="margin-top: 15px"
                @change="handleTableChange">
            <span slot="action" slot-scope="text, record">
            <a @click="$refs.createModal.save(record.cat_id,record.cat_name,record.sort,record.status)">修改</a>
            <a-popconfirm
                class="ant-dropdown-link"
                title="确认删除?"
                ok-text="是"
                cancel-text="否"
                @confirm="deleteConfirm(record.cat_id)"
                style="margin-left: 20px"
            >
                <a href="#">删除</a>
                </a-popconfirm>
            </span>
        <span slot="fid" slot-scope="text, record">
            <router-link :to="{ name:'GridChildEvent',params:{cat_id:record.cat_id}}" style="color: #1890ff;">查看子分类</router-link>
        </span>
        <span slot="status" slot-scope="text, record">
            <span v-if="record.status == 1" style="color: green">开启</span>
            <span v-else style="color: red">关闭</span>
        </span>
        </a-table>
        <add-grid-event :height='800' :width="1200" ref="createModal" @ok="handleOks"/>
    </a-card>
  </div>
</template>

<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
    import addGridEvent from './AddGridEvent'
    export default {
        components:{
            addGridEvent
        },
        data(){
            return {
                pagination: { pageSize: 10, total:10 },
                page:1,
                list:[],
                search: { page: 1},
            }
        },
        mounted(){
            //this.getList();
            this.fetch();
        },
        computed:{
            columns() {
                const columns = [
                    {
                        title: '分类名称',
                        dataIndex: 'cat_name',
                        key: 'cat_name',
                    },
                    {
                        title: '子分类',
                        key: 'fid',
                        dataIndex: '',
                        scopedSlots: {
                            customRender: 'fid'
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        dataIndex: '',
                        scopedSlots: {
                            customRender: 'status'
                        }
                    },
                    {
                        title: '排序值',
                        dataIndex: 'sort',
                        key: 'sort',
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
                return columns;
            },
        },
        methods:{
            handleTableChange(pagination, filters, sorter) {
                console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                this.pagination = pager;
                this.fetch({
                    results: pagination.pageSize,
                    page: pagination.current,
                    sortField: sorter.field,
                    sortOrder: sorter.order,
                    ...filters,
                });
            },
            fetch(params={}) {
                this.loading = true;
                this.request(streetCommunityApi.getEventCategoryList,
                    params
                ).then((res) => {
                    const pagination = { ...this.pagination };
                    pagination.total = res.count;
                    pagination.pageSize = res.total_limit;
                    //this.loading = false;
                    this.list = res.list;
                    this.pagination = pagination;
                });
            },
            handleOks() {
                //this.getList();
                this.fetch();
            },
            getList(){
                this.search['page'] = this.page;
                this.request(streetCommunityApi.getEventCategoryList, this.search)
                    .then((res) => {
                        console.log('res', res);
                        this.list = res.list;
                        this.pagination.total = res.count ? res.count : 0;
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                    })
            },
            deleteConfirm(id){
                this.request(streetCommunityApi.editEventCategory,{'cat_id':id,'status':4})
                    .then((res) => {
                        //this.getList();
                        this.fetch();
                        this.$message.success('删除成功');
                        this.reload();
                    })
            },
        },
    }
</script>

<style scoped>

</style>