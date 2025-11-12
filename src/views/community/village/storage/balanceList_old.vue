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
            <span slot="money" slot-scope="text, record">
                <div v-if="record.type == 1" style="color: green;">{{record.money}}</div>
                <div v-if="record.type == 2" style="color: red;">{{record.money}}</div>
            </span>
        </a-table>
    </a-modal>
</template>
<style>
    /deep/ .imgname{
        width: 100px;
    }
</style>
<script>
    import villageApi from '@/api/community/village'
    const columns = [
        { title: '订单编号',  dataIndex: 'order_no', key: 'order_no'},
        { title: '预存时间', dataIndex: 'add_time', key: 'add_time' },
        { title: '金额变更前（元）', dataIndex: 'current_money', key: 'current_money',},
        { title: '缴费金额（元）', dataIndex: 'money', key: 'money',scopedSlots: { customRender: 'money' }},
        { title: '金额变更后（元）', dataIndex: 'after_price', key: 'after_price',},
        { title: '备注', dataIndex: 'desc', key: 'desc'},
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
                uid:''
            };
        },
        methods: {
            // 获取列表信息
            List(uid=0) {
                this.title='余额记录';
                this.loading = true;
                if(uid > 0){
                    this.$set(this.pagination, 'current', 1)
                    this.uid=uid;
                    this.search['uid']=this.uid;
                }
                this.search['page'] = this.pagination.current;
                this.request(villageApi.storageUserBalanceRecord, this.search)
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


            cancel() {

            },


            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                let _this=this;
                console.log('e', e)
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.List()
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