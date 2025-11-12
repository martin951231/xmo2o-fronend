<template>
    <a-modal :title="title" :width="800" :height='600' :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel">
        <a-table :columns="columns" :data-source="navigationList"
                 :pagination="pagination"
                 :loading="loading"
                 @change="tableChange" >
            <span slot="action" slot-scope="text, record">
                <a @click="selected_url(record.url)">选中</a>
            </span>
        </a-table>
    </a-modal>
</template>

<script>
    import villageApi from '@/api/community/village';
    const columns = [
        {title: '编号', dataIndex: 'id', key: 'id',},
        {title: '名称', dataIndex: 'title', key: 'title',},
        {title: '操作', key: 'action', dataIndex: '', scopedSlots: {customRender: 'action'}},
    ];
    export default {
        name:'FunctionDetails',
        data() {
            return {
                title: '',
                visible: false,
                confirmLoading: false,
                navigationList: [],
                pagination: { current:1,pageSize: 10, total:10 },
                search: { page: 1 },
                page: 1,
                xtype:'',
                loading: false,
                cfromModel:'',
            }
        },
        computed:{
            columns() {
                return columns;
            },
        },
        methods: {
            navigations(title,xtype,cfromModel) {
                this.title = '【'+title+'】详细'
                this.visible = true;
                this.xtype=xtype;
                if(cfromModel){
                    this.cfromModel=cfromModel
                }else{
                    this.cfromModel='';
                }
                
                this.getList();
            },
            getList() {
                let _this=this;
                _this.loading = true;
                _this.search['xtype'] = _this.xtype;
                _this.search['page'] = _this.pagination.current;
                let post_url=villageApi.getHotWordFuncApplicationDetails;
                if(this.cfromModel=='HouseHotWordManage'){
                    post_url=villageApi.getHotWordFuncApplicationDetails;
                }
                this.request(post_url, this.search).then((res) => {
                    _this.loading = false;
                    _this.navigationList = res.list;
                    _this.pagination.total = res.count ? res.count : 0;
                    _this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                })
            },
            tableChange(e) {
                let _this=this;
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.getList()
                }
            },
            selected_url(url){
                this.$emit('ok', url)
                this.visible = false;
            },
            handleCancel() {
                this.visible = false
            },
        },
    }
</script>