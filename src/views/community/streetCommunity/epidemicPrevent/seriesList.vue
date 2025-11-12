<template>
    <a-modal :title="title" :width="1200" :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
        <div class="table-operator" style="margin-bottom: 5px">
            <a-button type="primary" icon="plus"  @click="$refs.seriesInfoModel.add()" >添加</a-button>
        </div>
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading"
        >
            <span slot="status" slot-scope="text, record">
                <div v-if="record.status == 0" style="color: red;">关闭</div>
                <div v-if="record.status == 1" style="color: #1890ff;">开启</div>
            </span>
            <span slot="action" slot-scope="text, record">
                <a @click="$refs.seriesInfoModel.edit(record.id)" >编辑</a>
                <a-popconfirm
                        class="ant-dropdown-link"
                        title="确认删除?(操作后可能不能恢复！)"
                        ok-text="是"
                        cancel-text="否"
                        @confirm="deleteConfirm(record.id)"
                > | <a href="#">删除</a></a-popconfirm>
                </span>
        </a-table>
        <SeriesInfo ref="seriesInfoModel" @ok="info" />
    </a-modal>
</template>
<style lang="less" scoped>
    /deep/ .imgname{
        width: 100px;
    }
</style>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity';
    import SeriesInfo from './seriesInfo';
    const columns = [
        { title: 'ID',  dataIndex: 'id', key: 'id'},
        { title: '名称', dataIndex: 'title', key: 'title' },
        { title: '排序值', dataIndex: 'sort', key: 'sort'},
        {title: '状态', dataIndex: 'status', key: 'status' , scopedSlots: { customRender: 'status' },},
        {title: '操作', key: 'action', dataIndex: '', scopedSlots: {customRender: 'action'},width: '10%',},
    ];
    const data = [];
    export default {
        name: 'seriesList',
        filters: {},
        components:{
            SeriesInfo
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
            getList(t=0) {
                if(t == 1){
                    this.$set(this.pagination, 'current', 1);
                }
                this.loading = true;
                this.title='添加系列';
                this.search['page'] = this.pagination.current;
                this.request(streetCommunityApi.getEpidemicPreventSeriesList, this.search).then((res) => {
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

            info(val){
                this.getList();
            },

            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                let _this=this;
                console.log('e', e)
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.getList()
                }
            },

            //删除
            deleteConfirm(id){
                this.request(streetCommunityApi.epidemicPreventSeriesDel,{'id':id}).then((res) => {
                    this.getList();
                    this.$message.success('删除成功')
                })
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