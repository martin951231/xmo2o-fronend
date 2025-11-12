<template>
    <div class="ruleListBox">
        <a-alert message="" type="info" style="margin-bottom: 15px;margin-top: -10px;">
            <div slot="description">
                <div>删除收费标准时，会将该收费标准对应已绑定的{{$store.getters.config.room_name}}和车场解除绑定，以及对应的未缴费账单会变为作废账单。</div>
                <div>例如：当前有收费标准名称为[水费]和[电费]两个收费标准，当删除收费标准名称为[水费]的收费标准时，仅作废[水费]对应的未缴费账单，[电费]对应的未缴费账单不会被作废</div>
            </div>
        </a-alert>
        <div class="message-suggestions-list-box">
            <div class="search-box">
                <a-row :gutter="48">
                    <a-col :md="9" :sm="24">
                        <a-input-group compact>
                            <p style="margin-top: 5px;">收费标准名称：</p>
                            <a-input style="width: 70%" v-model="search.keyword"/>
                        </a-input-group>
                    </a-col>
                    <a-col :md="2" :sm="24">
                        <a-button type="primary" icon="search" @click="searchList()">
                            查询
                        </a-button>
                    </a-col>
                    <a-col :md="2" :sm="24">
                        <a-button  @click="resetList()">重置</a-button>
                    </a-col>
                </a-row>

            </div>
            <div class="add-box">
                <a-row :gutter="48">
                    <a-col :md="8" :sm="24">
                        <a-button type="primary" @click="$refs.PopupAddModel.add(charge_project_id, 'normal', charge_type,0)">
                            添加
                        </a-button>
                        
                        <a-button type="primary"  @click="copyAndAddNewRule()" style="margin-left: 25px;" v-if="pagination.total>0 && (charge_type=='public_water' || charge_type=='public_electric')">
                            从选中收费标准复制
                        </a-button>
                        
                    </a-col>
                </a-row>
            </div>
            <a-table
                :columns="columns"
                :data-source="data"
                class="components-table-demo-nested"
                :pagination="pagination"
                @change='table_change'
                :loading="loading"
                :row-key="record => record.id"
                :row-selection="rowSelection"
            >
            <span slot="status" slot-scope="text, record">
                <div v-if="record.status == 2" style="color: red;">关闭</div>
                <div v-if="record.status == 1" style="color: #1890ff;">开启</div>
            </span>
                <span slot="standard" slot-scope="text, record">
               <a v-if="record.fees_type_status!=3 && record.charge_type!='qrcode' && record.charge_type!='electricity_loss'" @click="bindFunc(record)">绑定</a>
               <span v-if="record.charge_type=='qrcode'">--</span>
            </span>
                <span slot="action" slot-scope="text, record">
               <div v-if="record.fees_type_status!=3 && (record.rule_to_order_btn==1 || record.project_rule_to_order_btn==1)" style="margin-bottom: 7px;">
               <a v-if="record.fees_type_status!=3 && record.rule_to_order_btn==1"  @click="$refs.addVacancyBindToOrder.add(record.id,record.charge_name,0,record)"  >手动生成账单</a>
               <a v-if="record.fees_type_status!=3 && record.project_rule_to_order_btn==1"  @click="$refs.addVacancyBindToOrder.add(record.id,record.charge_name,1,record)" >批量生成账单</a>
                </div>
                
               <a  @click="$refs.PopupEditModel.edit(record.id)">编辑</a>
                    <a-popconfirm
                        class="ant-dropdown-link"
                        title="删除时会影响已绑定的信息和未缴费账单，确认删除?"
                        cancel-text="否"
                        ok-text="是"
                        @confirm="deleteConfirm(record.id)"
                        @cancel="cancel"
                        style="margin-left: 20px;width: 225px"
                    >
                        <a href="#">删除</a>
                    </a-popconfirm>
            </span>
            </a-table>
            <ruleInfo ref="PopupAddModel" @ok="addRule"/>
            <ruleInfo ref="PopupEditModel" @ok="editRule"/>
            <bindList ref="BindModel" @ok="bindOk"/>
            <addVacancyBindOrder ref="addVacancyBindToOrder" @ok="bindOk"/>
        </div>
    </div>
</template>
<style>
    .imgname{
        width: 100px;
    }
    .ruleListBox .ant-popover-placement-top{
        left: 1210px !important;
        top: 250px !important;
        transform-origin: 50% 103px !important;
    }
    .ant-popover-inner {
        width: 225px;
        background-color: #fff;
        background-clip: padding-box;
        border-radius: 2px;
        -webkit-box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
        box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
        -webkit-box-shadow: 0 0 8px rgba(0, 0, 0, 0.15) \9;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.15) \9;
    }
</style>
<script>
    import villageApi from '@/api/community/village'
    import ruleInfo from './ruleInfo'
    import bindList from './bindList';
    import addVacancyBindOrder from './addVacancyBindOrder';
    const columns = [
        { title: '标准ID',  dataIndex: 'id', key: 'id'},
        { title: '收费标准名称',  dataIndex: 'charge_name', key: 'charge_name'},
        { title: '收费标准生效时间', dataIndex: 'charge_valid_time', key: 'charge_valid_time' },
        { title: '计费模式', dataIndex: 'fees_type', key: 'fees_type' },
        { title: '账单生成周期设置', dataIndex: 'bill_create_set', key: 'bill_create_set' },
        { title: '账单欠费模式', dataIndex: 'bill_arrears_set', key: 'bill_arrears_set' },
        { title: '生成账单模式', dataIndex: 'bill_type', key: 'bill_type' },
        { title: '是否支持预缴', dataIndex: 'is_prepaid', key: 'is_prepaid' },
        { title: '未入住房屋折扣', dataIndex: 'not_house_rate', key: 'not_house_rate' },
        { title: '绑定费用对象', dataIndex: 'bddx', key: 'bddx', scopedSlots: { customRender: 'standard' }},
        {title: '操作', dataIndex: 'operation', key: 'operation', width:120, scopedSlots: { customRender: 'action' }},
    ];
    const data = [];
    export default {
        name: 'ruleList',
        filters: {

        },
        components:{
            ruleInfo,
            bindList,
            addVacancyBindOrder
        },
        data() {
            return {
                reply_content: '',
                pagination: {
                    current:1,
                    pageSize: 10,
                    total:10,
                    showTotal: total => `共 ${total} 条`, // 显示总数
                },
                search: { keyword: '', page: 1 },
                form: this.$form.createForm(this),
                visible: false,
                loading: false,
                data,
                columns,
                title:'',
                confirmLoading:false,
                charge_project_id:'',
                charge_type: '',
                selected_rule_id:0,
            };
        },
        computed: {
            rowSelection() {
                if(this.charge_type=='public_water' || this.charge_type=='public_electric'){
                   return {
                       type:'radio',
                       onChange: (selectedRowKeys, selectedRows) => {
                           console.log('selectedRowKeys',selectedRowKeys);
                           this.selected_rule_id=selectedRowKeys*1;
                       },
                       onSelect:(record, selected, selectedRows, nativeEvent)=>{
                           console.log('record,',record,'selected',selected);
                       },
                   }
                }else{
                     return null;
                }

            }
        },
        methods: {
            // 获取列表信息
            List(charge_project_id=0,t=0, charge_type='') {
                this.title='收费标准管理';
                this.loading = true;
                if(t == 1){
                    this.$set(this.pagination, 'current', 1);
                }
                if(charge_project_id > 0){
                    this.charge_project_id=charge_project_id;
                    this.search['charge_project_id']=charge_project_id;
                }
                
                if(charge_type){
                    this.charge_type = charge_type
                }
                this.search['page'] = this.pagination.current;
                this.search['limit'] = this.pagination.pageSize;
                this.request(villageApi.ChargeRuleList, this.search)
                    .then((res) => {
                        console.log('收费标准===============', res)
                        this.pagination.total = res.count ? res.count : 0
                        this.pagination.pageSize = res.total_limit ? res.total_limit : 10
                        this.data = res.list
                        this.loading = false;
                        this.confirmLoading=true;
                        this.visible=true;
                    })
            },
            onTableChange(page,pageSize){
                this.pagination.current = page
                this.pagination.pageSize = pageSize
                this.List()
                console.log('onTableChange==>', page, pageSize)
            },
            copyAndAddNewRule(){
                if(!this.selected_rule_id || this.selected_rule_id<1){
                    this.$message.error('请选择一条数据来复制');
                    return false;
                }
                this.$refs.PopupAddModel.add(this.charge_project_id, 'normal', this.charge_type,this.selected_rule_id)
            },
            handleCancel() {
                this.visible = false;
                setTimeout(() => {
                    this.id = '0';
                    this.form = this.$form.createForm(this)
                }, 500)
            },
            // 添加
            addRule(val) {
                this.List(this.charge_project_id,1);
            },
            //编辑
            editRule(val){
                this.List();
            },
              // 绑定
              bindOk(val) {
                this.List();
              },
            cancel() {

            },
            deleteConfirm(id){
                let _this=this;
                this.request(villageApi.ChargeRuleDel,{'id':id})
                    .then((res) => {
                        _this.List(_this.charge_project_id,1);
                        _this.$message.success('删除成功')
                    })
            },
            //规则列表
            ruleList(val){
                this.List();
            },
            prepaidList(val){
                this.List();
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                console.log('e', e)
                if (e.current && e.current>0) {
                    this.$set(this.pagination, 'current', e.current)
                    this.List()
                }
            },
            // 删除
            delInfo(record) {
                let _this = this
                this.$confirm({
                    title: '你确定要删除该活动信息?',
                    content: '该活动一旦删除不可恢复，且相关报名信息将失效',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                        _this.request(villageApi.delVolunteerActivity, { activity_id: record.activity_id })
                            .then((res) => {
                                _this.$message.success('删除成功！');
                                _this.List();
                            })
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            },
            // 进行搜索
            searchList() {
                console.log('search', this.search);
                this.$set(this.pagination, 'current', 1)
                this.List();
            },
            // 进行重置
            resetList() {
                this.$set(this.pagination, 'current', 1)
                this.search.keyword='';
                this.search.page=1;
                this.List();
            },

            bindFunc(record){
                let _this = this
                this.request(villageApi.checkTakeEffectTime).then((res) => {
                    if(!res.status){
                        _this.$message.warning(res.msg);
                        return false;
                    }
                    _this.$refs.BindModel.list(record.id, record.charge_type,record)
                })
            }
        }
    };
</script>