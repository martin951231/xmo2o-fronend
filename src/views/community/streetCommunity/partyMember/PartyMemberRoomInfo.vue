<template>
    <a-modal :title="title" :width="1200" :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
        <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                :loading="loading"
        >
            <span slot="money" slot-scope="text, record">
                <div v-if="record.type == 1" style="color: green;">{{record.money}}</div>
                <div v-if="record.type == 2" style="color: red;">{{record.money}}</div>
            </span>
        </a-table>
    </a-modal>
</template>
<script>
    import streetCommunityApi from '@/api/community/streetCommunity'
	import store from '@/store';
    const columns = [
        { title: '社区',  dataIndex: 'street_name', key: 'street_name'},
        { title: store.getters.config.house_name, dataIndex: 'community_name', key: 'community_name' },
        { title: '姓名',  dataIndex: 'name', key: 'name'},
        { title: '手机号',  dataIndex: 'phone', key: 'phone'},
        { title: store.getters.config.room_name+'号', dataIndex: 'address', key: 'address'},
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
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showSizeChanger: true, // 显示可改变每页数量
                    pageSizeOptions: ['10', '20', '50', '100'], // 每页数量选项
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onShowSizeChange: (current, pageSize) => this.onTableChange(current, pageSize), // 改变每页数量时更新显示
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                search: { uid:'',keyword: '', page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                title:'',
                confirmLoading:false,
                uid:'',
            };
        },
        methods: {
            // 获取列表信息
            getList(record='') {
                this.title='姓名：'+record.name+'，联系方式：'+record.phone;
                this.loading = true;
                if(record.uid > 0){
                    this.$set(this.pagination, 'current', 1)
                    this.uid=record.uid;
                    this.search['uid']=this.uid;
                }
                this.search['page'] = this.pagination.current;
                this.search['limit'] = this.pagination.pageSize;
                this.request(streetCommunityApi.getPartyMemberRoomInfo, this.search)
                    .then((res) => {
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
            },
            //分页页数触发
            onTableChange(page,pageSize){
                this.page = page;
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
        }
    };
</script>