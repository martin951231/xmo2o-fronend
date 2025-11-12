<template>
    <a-modal :title="title" :width="1200" :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleCancel" >
        <div class="message-suggestions-list-box">

            <div class="add-box" v-if="isShow">
                <a-row :gutter="48">
                    <a-col :md="8" :sm="24" style="margin-bottom: 20px;" v-if="is_grapefruit_prepaid==1">
                        <a-button type="primary" @click="$refs.discountAddModel.add(charge_rule_id,bill_date_set,charge_project_id)">
                            创建
                        </a-button>
                    </a-col>
                    <a-col :md="8" :sm="24" style="margin-bottom: 20px;" v-else >
                        <a-button type="primary" @click="$refs.PopupAddModel.add(charge_rule_id,bill_date_set)">
                            添加
                        </a-button>
                    </a-col>
                </a-row>
            </div>
            <a-table 
                    v-if="is_grapefruit_prepaid<1"
                    :columns="columns"
                    :data-source="data"
                    class="components-table-demo-nested"
                    :pagination="pagination"
                    @change='table_change'
                    :loading="loading"
            >
             <span slot="status" slot-scope="text, record">
                    <div v-if="record.status == 2" style="color: red;">禁止</div>
                    <div v-if="record.status == 1" style="color: #1890ff;">开启</div>
                    <div v-if="record.status == 4" style="color: red;">已删除</div>
                </span>
                <span slot="standard" slot-scope="text, record">
                    <a >绑定</a>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a v-if="isShow" @click="$refs.PopupEditModel.edit(record.id,bill_date_set,charge_rule_id)">编辑</a>
                    <a v-if="!isShow" style="color: #CCCCCC;">编辑</a>

                      <a-popconfirm
                          v-if="isShow"
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
            
            <a-table
                    v-if="is_grapefruit_prepaid==1"
                    :columns="columns2"
                    :data-source="data2"
                    class="components-table-demo-nested"
                    :pagination="pagination"
                    @change='table_change'
                    :loading="loading"
            >
            <span slot="action_opt" slot-scope="text, record">
                    <a  @click="$refs.discountAddModel.edit(record.id,charge_rule_id,bill_date_set,charge_project_id)">编辑</a>
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
   
            <discountPrepaidInfo ref="discountAddModel" @ok="addActive"/>
            <discountPrepaidInfo ref="discountAddModel" @ok="editActive"/>
            
            <prepaidInfo ref="PopupAddModel" @ok="addActive"/>
            <prepaidInfo ref="PopupEditModel" @ok="editActive"/>
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
    import prepaidInfo from './prepaidInfo';
    import discountPrepaidInfo from './discountPrepaidInfo';
    
    const columns = [
        { title: '预缴时间',  dataIndex: 'cycle', key: 'cycle'},
        { title: '优惠模式',  dataIndex: 'type_txt', key: 'type_txt'},
        { title: '添加时间', dataIndex: 'add_time', key: 'add_time' },
        {title: '状态', dataIndex: 'status', key: 'status' , scopedSlots: { customRender: 'status' },},
        {title: '操作', dataIndex: 'operation', key: 'operation', scopedSlots: { customRender: 'action' }},
    ];
    const data = [];
    const columns2 = [
        { title: '预缴类型',  dataIndex: 'discount_type_str', key: 'discount_type_str'},
        { title: '预缴时长',  dataIndex: 'xcontent', key: 'xcontent'},
        { title: '预缴到期时间', dataIndex: 'expire_time_str', key: 'expire_time_str' },
        {title: '最后编辑时间', dataIndex: 'update_time_str', key: 'update_time_str'},
        {title: '操作', dataIndex: '', key: '', scopedSlots: { customRender: 'action_opt' }},
    ];
    const data2 = [];
    export default {
        name: 'prepaidList',
        filters: {

        },
        components:{
            prepaidInfo,
            discountPrepaidInfo,
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
                search: { keyword: '', page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                data2,
                columns,
                columns2,
                title:'',
                confirmLoading:false,
                charge_rule_id:'',
                bill_date_set:2,
                isShow: true,
                is_grapefruit_prepaid:0,
                ids:[],
                charge_project_id:0,
            };
        },
        methods: {
            // 获取列表信息
            List(charge_rule_id=0,t=0,bill_date_set=2,isShow = true,is_grapefruit_prepaid=0,charge_project_id=0) {
                this.title='预缴时间';
                this.charge_project_id=charge_project_id;
                this.loading = true;
                
                if(t == 1){
                    this.$set(this.pagination, 'current', 1);
                }
                console.log('is_grapefruit_prepaid',is_grapefruit_prepaid);
                this.bill_date_set=bill_date_set;
                this.charge_rule_id=charge_rule_id;
                if(is_grapefruit_prepaid!=undefined && is_grapefruit_prepaid>0){
                    this.isShow=false;
                    this.is_grapefruit_prepaid=is_grapefruit_prepaid;
                    this.title='预缴优惠管理';
                     this.getDiscountList();
                }else{
                    this.isShow = isShow;
                    this.getList();
                }
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
                        this.loading = false;
                        this.confirmLoading=false;
                        this.visible=true;
                    })
            },
            getList(){
                this.search['bill_date_set']=this.bill_date_set;
                this.search['charge_rule_id']=this.charge_rule_id;
                this.search['charge_project_id']=this.charge_project_id;
                this.search['page'] = this.pagination.current;
                this.search['limit'] = this.pagination.pageSize;
                if (!this.isShow) {
                    this.search['type'] = 'del_detail'
                }
                this.request(villageApi.ChargePrepaidList, this.search)
                    .then((res) => {
                        this.pagination.total = res.count ? res.count : 0;
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10;
                        this.data = res.list;
                        this.is_grapefruit_prepaid=res.is_grapefruit_prepaid ? res.is_grapefruit_prepaid:0;
                        this.loading = false;
                        this.confirmLoading=false;
                        this.visible=true;
                    })
            },
            onTableChange(page,pageSize){
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.loading=true;
                if( this.is_grapefruit_prepaid>0){
                     this.getDiscountList();
                }else{
                    this.getList();
                }
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
                if( _this.is_grapefruit_prepaid>0){
                    this.request(villageApi.chargePrepaidDiscountDel,{'id':id})
                        .then((res) => {
                            this.getDiscountList();
                            _this.$message.success('删除成功')
                        })
                    }else{
                        this.request(villageApi.ChargePrepaidDel,{'id':id})
                            .then((res) => {
                                this.getList();
                                _this.$message.success('删除成功')
                            })
                    }
            },

            // 添加
            addActive(val) {
                this.loading=true;
                if(val){
                    this.ids.push(val);
                }
                if( this.is_grapefruit_prepaid>0){
                     this.getDiscountList();
                }else{
                    this.getList();
                }
            },
            //编辑
            editActive(val){
                this.loading=true;
                if( this.is_grapefruit_prepaid>0){
                     this.getDiscountList();
                }else{
                    this.getList();
                }
                
            },

            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current>0) {
                    this.$set(this.pagination, 'current', e.current)
                    this.loading=true;
                    if( this.is_grapefruit_prepaid>0){
                         this.getDiscountList();
                    }else{
                        this.getList();
                    }
                }
            },
        }
    };
</script>