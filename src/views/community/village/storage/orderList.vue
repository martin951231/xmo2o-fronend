<template>
    <a-modal :title="title" :width="1400" :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
            <a-table
                    :columns="columns"
                    :data-source="data"
                    class="components-table-demo-nested"
                    :pagination="pagination"
                    @change='table_change'
                    :loading="loading"
            >

             <span slot="operation" slot-scope="text, record">
                 <div v-if="record.is_paid == 1" >
                      <a @click="$refs.PrintModel.add(record.order_id,record.pigcms_id)">打印</a>
                 </div>
                  <div v-else >
                        <a-popconfirm
                                class="ant-dropdown-link"
                                title="确认催缴?"
                                ok-text="是"
                                cancel-text="否"
                                @confirm="send_message(record.order_id)"
                        ><a>一键催缴</a></a-popconfirm>
                 </div>
            </span>
            </a-table>
        <get-print-template ref="PrintModel"/>
    </a-modal>
</template>
<style>
    /deep/ .imgname{
        width: 100px;
    }
    .content-p1{
        color: #52A5FF;font-weight: bold;padding: 0px 10px 0 10px;
    }
</style>
<script>
    import villageApi from '@/api/community/village'
    import GetPrintTemplate from "@/views/community/village/charge/cashier/getPrintTemplate";
    const columns = [
        { title: '订单编号',  dataIndex: 'order_id', key: 'order_id'},
        { title: '收费项目',  dataIndex: 'project_name', key: 'project_name'},
        { title: '收费所属类别', dataIndex: 'order_type', key: 'order_type' },
        { title: '单价（元）', dataIndex: 'unit_price', key: 'unit_price',},
        { title: '倍率', dataIndex: 'rate', key: 'rate',},
        { title: '抄表时间', dataIndex: 'add_time', key: 'add_time',},
        { title: '起度', dataIndex: 'start_ammeter', key: 'start_ammeter',},
        { title: '止度', dataIndex: 'last_ammeter', key: 'last_ammeter',},
        { title: '应收费用（元）', dataIndex: 'total_money', key: 'total_money',},
        { title: '实缴费用（元）', dataIndex: 'pay_money', key: 'pay_money',},
        { title: '住户余额支付（元）', dataIndex: 'now_money', key: 'now_money',},
        { title: '备注', dataIndex: 'note', key: 'note',},
        { title: '操作', dataIndex: 'operation', width: '100px', key: 'operation', scopedSlots: { customRender: 'operation' }},
    ];
    const data = [];
    export default {
        name: 'orderList',
        filters: {

        },
        components:{
            GetPrintTemplate
        },
        data() {
            return {
                reply_content: '',
                pagination: {current:1,  pageSize: 10, total:10 },
                search: { keyword: '', page: 1 },
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
                this.title='消费记录';
                this.loading = true;
                if(uid > 0){
                    this.$set(this.pagination, 'current', 1)
                    this.uid=uid;
                    this.search['uid']=this.uid;
                }
                this.search['page'] = this.pagination.current;
                this.request(villageApi.storageUserOrderRecord, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false;
                        this.confirmLoading=true;
                        this.visible=true;
                    })
            },


            //发送模板消息通知
            send_message(order_id){
                this.request(villageApi.storageUserSendMessage,{
                    order_id:order_id
                }).then((res)=>{
                    this.$message.success('发送成功');
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
                this.table_change({
                    current: 1,
                    pageSize: 10,
                    total: 10
                });
            },
            // 进行重置
            resetList() {
                this.$set(this.pagination, 'current', 1)
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