<template>
    <a-modal :title="title" :width="1200" :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading"
        >
        </a-table>
    </a-modal>
</template>
<style>
    /deep/ .imgname{
        width: 100px;
    }
</style>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity';
    const columns = [
        { title: '上报人',  dataIndex: 'work_name', key: 'work_name'},
        { title: '上报时间', dataIndex: 'add_time', key: 'add_time' },
        { title: '任务数量', dataIndex: 'complete_num', key: 'complete_num',},
        { title: '完成数量', dataIndex: 'complete_num_u', key: 'complete_num_u'},
        { title: '上报内容', dataIndex: 'complete_num', key: 'complete_num',},
        { title: '状态', dataIndex: 'status', key: 'status'},
    ];
    const data = [];
    export default {
        name: 'balanceList',
        filters: {

        },
        components:{
        },
        data() {
            return {
                reply_content: '',
                pagination: {current:1,  pageSize: 10, total:10 },
                search: { uid:'',keyword: '', page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                title:'',
                confirmLoading:false,
                id:''
            };
        },
        methods: {
            // 获取列表信息
            getList(title='',id=0) {
                this.loading = true;
                if(title){
                    this.title='查看【'+title+'】';
                }
                if(id > 0){
                    this.$set(this.pagination, 'current', 1)
                    this.id=id;
                    this.search['id']=this.id;
                }
                this.search['page'] = this.pagination.current;
                this.request(streetCommunityApi.getTaskReleaseRecord, this.search).then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false;
                        this.confirmLoading=true;
                        this.visible=true;
                    })
            },
            handleCancel() {
                this.visible = false;
                setTimeout(() => {
                    this.id = '0';
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            cancel() {},

            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                let _this=this;
                console.log('e', e)
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.getList()
                }
            },

            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
            // 进行重置
            resetList() {
                this.search.keyword='';
                this.search.page=1;
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            }
        }
    };
</script>