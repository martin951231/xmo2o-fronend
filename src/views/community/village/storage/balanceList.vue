<template>
    <div>
    <a-modal :title="title" :width="1300" :footer="null" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading"  @cancel="handleCancel">
        <div class="search-box" style="margin: 0px 0px 10px 20px;" v-if="is_customized_meter_reading==1">
            <a-row :gutter="48">
                <a-col :md="6" :sm="24">
                     <label style="margin-top: 5px;">预存类型：</label>
                        <a-select placeholder="请选择预存类型" style="width: 200px" v-model="money_type">
                            <a-select-option value="0">全部</a-select-option>
                            <a-select-option value="4">冷水</a-select-option>
                            <a-select-option value="3">热水</a-select-option>
                            <a-select-option value="2">电费</a-select-option>
                            <a-select-option value="1">物业费</a-select-option>
                        </a-select>
            
                </a-col>
                <a-col :md="2" :sm="24">
                    <a-button type="primary" icon="search"  @click="searchList()">
                        查询
                    </a-button>
                </a-col>
                
                <a-col :md="2" :sm="24" v-if="is_customized_meter_reading==1">
                       <a-button type="primary" @click="excelExportData()">Excel导出</a-button>
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
        >
            <span slot="money" slot-scope="text, record">
                <div v-if="record.type == 1" style="color: green;">{{record.money}}</div>
                <div v-if="record.type == 2" style="color: red;">{{record.money}}</div>
            </span>
        </a-table>
    </a-modal>
    
        <a-modal
          title="导出提示"
          :width="450"
          :visible="exportVisible"
          :maskClosable="false"
          :confirmLoading="confirmLoading"
          :footer="null"
          :closable="false"
          :centered="true"
          >
            <div style="padding: 15px;color: black;font-size: 16px;">
                正在为您导出数据，你稍等 . . .
            </div>
        </a-modal>
   </div>
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
                is_customized_meter_reading:0,
                is_aihorse_customized:0,
                uid:'',
                money_type:"0",
                exportVisible:false,
            };
        },
        methods: {
            // 获取列表信息
            List(uid=0,is_customized_meter_reading=0,is_aihorse_customized=0) {
                this.title='余额记录';
                this.uid=uid ? uid:0;
                this.loading = true;
                this.exportVisible=false;
                this.is_customized_meter_reading=is_customized_meter_reading ? is_customized_meter_reading:0;
                this.is_aihorse_customized=is_aihorse_customized ? is_aihorse_customized:0;
                if(this.is_customized_meter_reading==1){
                    this.columns=[
                        { title: '订单编号',  dataIndex: 'order_no', key: 'order_no'},
                        { title: '预存类型', dataIndex: 'money_type_str', key: 'money_type_str' },
                        { title: '预存时间', dataIndex: 'add_time', key: 'add_time' },
                        { title: '金额变更前（元）', dataIndex: 'current_money', key: 'current_money',},
                        { title: '缴费金额（元）', dataIndex: 'money', key: 'money',scopedSlots: { customRender: 'money' }},
                        { title: '金额变更后（元）', dataIndex: 'after_price', key: 'after_price',},
                        { title: '备注', dataIndex: 'desc', key: 'desc'},
                    ];
                }else if(this.is_aihorse_customized==1){
                    this.columns=[
                            { title: '订单编号',  dataIndex: 'order_no', key: 'order_no'},
                            { title: '预存时间', dataIndex: 'add_time', key: 'add_time' },
                            { title: '金额变更前（元）', dataIndex: 'current_money', key: 'current_money',},
                            { title: '缴费金额（元）', dataIndex: 'money', key: 'money',scopedSlots: { customRender: 'money' }},
                            { title: '金额变更后（元）', dataIndex: 'after_price', key: 'after_price',},
                            { title: '线下支付方式', dataIndex: 'off_pay_type_str', key: 'off_pay_type_str',},
                            { title: '备注', dataIndex: 'desc', key: 'desc'},
                    ];
                }
                this.getListData();
                this.$set(this.pagination, 'current', 1)
            },
            
            getListData(){
                if(this.uid > 0){
                    this.search['uid']=this.uid;
                }
                this.search['page'] = this.pagination.current;
                this.search['money_type']=this.money_type;
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
            // 导出Excel
            excelExportData () {
                this.exportVisible=true;
                this.loading = true;
                this.confirmLoading= true;
                this.search['uid']=this.uid;
                this.search['money_type']=this.money_type;
                
                this.request(villageApi.excelExportBalanceRecord, this.search).then((res) => {
                        console.log('res', res)
                        if(res && res.url){
                            window.location.href = res.url
                        }
                        this.loading = false
                        this.exportVisible = false;
                        this.confirmLoading= false;
                    }).catch((error) => {
                    this.loading = false
                    this.exportVisible = false;
                    this.confirmLoading= false;
                })
                
            },
            // 表格中变动  这里只针对页面页数切换
            table_change(e) {
                let _this=this;
                console.log('e', e)
                if (e.current && e.current>0) {
                    _this.pagination.current = e.current;
                    _this.getListData()
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