<template>
    <a-modal :title="title" :width="1200" :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel" >
        <div class="message-suggestions-list-box">

            <div class="add-box">
                <a-row :gutter="48">
                    <a-col :md="8" :sm="24" style="margin-bottom: 20px;" v-if="!(func_kaidalaicn_special && data2.length>0)">
                        <a-button type="primary" @click="$refs.discountOrderAddModel.add(charge_rule_id,bill_date_set,charge_project_id,project_cycle_type,order_discount_type,{'func_kaidalaicn_special':func_kaidalaicn_special})">
                            创建
                        </a-button>
                    </a-col>
                </a-row>
            </div>

            <a-table
                    :columns="columns2"
                    :data-source="data2"
                    class="components-table-demo-nested"
                    :pagination="pagination"
                    @change='table_change'
                    :loading="loading"
            >
            <span slot="action_opt" slot-scope="text, record">
                    <a  @click="$refs.discountOrderAddModel.edit(record.id,charge_rule_id,bill_date_set,charge_project_id,project_cycle_type,order_discount_type,{'func_kaidalaicn_special':func_kaidalaicn_special})">编辑</a>
                      <a-popconfirm
                              class="ant-dropdown-link"
                              title="确认删除?"
                              ok-text="是"
                              cancel-text="否"
                              @confirm="deleteConfirm(record.id)"
                              @cancel="cancel"
                              style="margin-left: 20px"
                      >
                          <a href="#">删除</a>
                      </a-popconfirm>
                </span>
            </a-table>
   
            <orderDiscountSetInfo ref="discountOrderAddModel" @ok="optActive"/>

        </div>
    </a-modal>
</template>
<style>
    .imgname{
        width: 100px;
    }
    .page_top{
        background-color: #e6f7ff;
        display: inline-block;
        width: 100%;
        padding: 20px 20px;
        margin-bottom: 20px;
        color: #666666;
    }
</style>
<script>
    import villageApi from '@/api/community/village'
    import orderDiscountSetInfo from './orderDiscountSetInfo';
    
    const data = [];
    const columns2 = [
        { title: '优惠类型',  dataIndex: 'order_discount_type_str', key: 'order_discount_type_str'}, 
        { title: '缴费类型',  dataIndex: 'discount_type_str', key: 'discount_type_str'}, 
        { title: '预缴时长',  dataIndex: 'xcontent', key: 'xcontent'},
        { title: '优惠到期时间', dataIndex: 'expire_time_str', key: 'expire_time_str' },
        {title: '最后编辑时间', dataIndex: 'update_time_str', key: 'update_time_str'},
        {title: '操作', dataIndex: '', key: '', scopedSlots: { customRender: 'action_opt' }},
    ];
    const data2 = [];
    export default {
        name: 'prepaidList',
        filters: {

        },
        components:{
            orderDiscountSetInfo,
        },
        data() {
            return {
                reply_content: '',
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showTotal: total => `共 ${total} 条`, // 显示总数
                    onChange:(page,pageSize)=>this.onTableChange(page,pageSize)//点击页码事件
                },
                search: { keyword: '', page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data2,
                columns2,
                title:'账单优惠管理',
                isShow:false,
                confirmLoading:false,
                charge_rule_id:'',
                bill_date_set:2,
                ids:[],
                charge_project_id:0,
                project_cycle_type:0,
                order_discount_type:0,
                func_kaidalaicn_special:0,
            };
        },
        methods: {
            // 获取列表信息
            List(charge_rule_id=0,project_cycle_type=0,bill_date_set=2,isShow = true,charge_project_id=0) {
                this.charge_project_id=charge_project_id;
                this.loading = true;
                this.project_cycle_type=project_cycle_type;
                this.bill_date_set=bill_date_set;
                this.charge_rule_id=charge_rule_id;
                this.order_discount_type=0;
                this.columns2 = [
                    { title: '优惠类型',  dataIndex: 'order_discount_type_str', key: 'order_discount_type_str'}, 
                    { title: '缴费类型',  dataIndex: 'discount_type_str', key: 'discount_type_str'}, 
                    { title: '预缴时长',  dataIndex: 'xcontent', key: 'xcontent'},
                    { title: '优惠到期时间', dataIndex: 'expire_time_str', key: 'expire_time_str' },
                    {title: '最后编辑时间', dataIndex: 'update_time_str', key: 'update_time_str'},
                    {title: '操作', dataIndex: '', key: '', scopedSlots: { customRender: 'action_opt' }},
                ];
                this.getDiscountList();
             
            },
            getDiscountList(){
                this.search['bill_date_set']=this.bill_date_set;
                this.search['charge_rule_id']=this.charge_rule_id;
                this.search['charge_project_id']=this.charge_project_id;
                this.search['page'] = this.pagination.current;
                this.search['limit'] = this.pagination.pageSize;
                this.request(villageApi.getChargePrepaidDiscountList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0;
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10;
                        this.data2 = res.list;
                        if(res.count!=undefined && res.count>0){
                           this.isShow=false;
                        }else{
                            this.isShow = true;
                        }
                        if(res.func_kaidalaicn_special!=undefined){
                            this.func_kaidalaicn_special=res.func_kaidalaicn_special*1;
                        }
                        if(res.order_discount_type!=undefined){
                            this.order_discount_type=res.order_discount_type;
                            if(this.order_discount_type==2){
                                this.columns2= [
                                    { title: '优惠类型',  dataIndex: 'order_discount_type_str', key: 'order_discount_type_str'}, 
                                    { title: '满足账单优惠条件',  dataIndex: 'con_num_str', key: 'con_num_str'},
                                    { title: '提前缴费优惠内容',  dataIndex: 'xcontent', key: 'xcontent'},
                                    { title: '缴费到期时间', dataIndex: 'expire_time_str', key: 'expire_time_str' },
                                    {title: '最后编辑时间', dataIndex: 'update_time_str', key: 'update_time_str'},
                                    {title: '操作', dataIndex: '', key: '', scopedSlots: { customRender: 'action_opt' }},
                                ];
                            }

                        }
                        this.loading = false;
                        this.confirmLoading=false;
                        this.visible=true;
                    })
            },
            onTableChange(page,pageSize){
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.loading=true;
                this.getDiscountList();

                console.log('onTableChange==>', page, pageSize)
            },
            handleCancel() {
                this.visible = false;
                setTimeout(() => {
                    this.id = '0';
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            cancel() {},
            deleteConfirm(id){
                let _this=this;
                    this.request(villageApi.chargePrepaidDiscountDel,{'id':id})
                        .then((res) => {
                            this.getDiscountList();
                            _this.$message.success('删除成功')
                        })
            },
            optActive(val,type){
                this.loading=true;
                this.getDiscountList();
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current>0) {
                    this.$set(this.pagination, 'current', e.current)
                    this.loading=true;
                     this.getDiscountList();

                }
            },
        }
    };
</script>